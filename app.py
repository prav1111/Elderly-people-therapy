import os
import sys
import uuid
import subprocess
import shutil
from flask import Flask, render_template, request, jsonify, url_for, session
import speech_recognition as sr
import requests
import ffmpeg


try:
    from google.cloud import texttospeech as tts_lib
    texttospeech = tts_lib
    from gtts import gTTS
    _USE_GCLOUD = True
except ImportError:
    from gtts import gTTS
    texttospeech = None
    _USE_GCLOUD = False

# ----------------- App Config ----------------- #
app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET', 'change-me')  # needed for session
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'audio')
app.config['VIDEO_FOLDER'] = os.path.join(app.root_path, 'static', 'video')
TMP_FOLDER = os.path.join(app.root_path, 'tmp')
for folder in (app.config['UPLOAD_FOLDER'], app.config['VIDEO_FOLDER'], TMP_FOLDER):
    os.makedirs(folder, exist_ok=True)

# ----------------- External Tools ----------------- #
FFMPEG_BIN = shutil.which('ffmpeg')
if not FFMPEG_BIN:
    raise RuntimeError('ffmpeg not found on PATH. Please install ffmpeg.')

# ----------------- Gemini API Config ----------------- #
GEMINI_API_KEY = os.getenv('GOOGLE_API_KEY')
if not GEMINI_API_KEY:
    raise RuntimeError('Missing GOOGLE_API_KEY environment variable.')
# Using generateContent endpoint with stitched history
GEMINI_API_URL = (
    'https://generativelanguage.googleapis.com/v1beta/models/' +
    'gemini-2.0-flash:generateContent' +
    f'?key={GEMINI_API_KEY}'
)

# ----------------- Conversation-aware Gemini API Call ----------------- #
def call_gemini_api(message_list, retries=3, backoff=1.0):
    """
    message_list: list of dicts with keys 'author' and 'text'
    """
    import time
    from requests.exceptions import HTTPError

    # Stitch history into single prompt
    lines = []
    for msg in message_list:
        if msg['author'] == 'system':
            speaker = 'System'
        elif msg['author'] == 'user':
            speaker = 'User'
        else:
            speaker = 'Assistant'
        lines.append(f"{speaker}: {msg['text']}")
    lines.append("Assistant:")  # prompt next reply
    prompt_text = '\n'.join(lines)

    payload = {'contents': [{'parts': [{'text': prompt_text}]}]}
    headers = {'Content-Type': 'application/json'}
    last_exc = None
    for attempt in range(1, retries + 1):
        try:
            resp = requests.post(GEMINI_API_URL, headers=headers, json=payload, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            candidates = data.get('candidates') or []
            if not candidates:
                raise RuntimeError('No response from Gemini API')
            content = candidates[0].get('content')
            if isinstance(content, dict) and 'text' in content:
                return content['text']
            # If content parts
            parts = getattr(content, 'get', None)
            if parts:
                return ''.join(part.get('text', '') for part in content.get('parts', []))
            return str(content)
        except HTTPError as e:
            last_exc = e
            if resp.status_code == 503 and attempt < retries:
                time.sleep(backoff * (2 ** (attempt - 1)))
                continue
            raise
    raise last_exc

# ----------------- Conversational TTS ----------------- #
def synthesize_conversational(text, out_path):
    words = text.split()
    if len(words) > 150:
        text = ' '.join(words[:150]) + '…'

    if _USE_GCLOUD and texttospeech:
        client = texttospeech.TextToSpeechClient()
        ssml = f"<speak>{text}</speak>"
        synthesis_input = texttospeech.SynthesisInput(ssml=ssml)
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            name="en-US-Wavenet-D",
            ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=1.0,
            pitch=0.0
        )
        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )
        with open(out_path, 'wb') as f:
            f.write(response.audio_content)
    else:
        gTTS(text=text, lang='en').save(out_path)

# ----------------- Routes ----------------- #
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/ai')
def model_page():
    return render_template('ai.html')

@app.route('/process_audio', methods=['POST'])
def process_audio():
    history = session.get('history', [])
    try:
        audio_file = request.files.get('audio_data')
        if not audio_file:
            return jsonify({'error': 'No audio_data provided'}), 400

        # Save and convert audio
        webm_fn = f"{uuid.uuid4().hex}.webm"
        webm_path = os.path.join(TMP_FOLDER, webm_fn)
        audio_file.save(webm_path)
        wav_fn = webm_fn.replace('.webm', '.wav')
        wav_path = os.path.join(TMP_FOLDER, wav_fn)
        ffmpeg.input(webm_path).output(wav_path, ac=1, ar=16000).run(quiet=True, overwrite_output=True)

        # Transcribe
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_path) as src:
            audio_data = recognizer.record(src)
        try:
            transcript = recognizer.recognize_google(audio_data)
        except sr.UnknownValueError:
            transcript = ''
        except sr.RequestError as e:
            raise RuntimeError(f"Speech recognition error: {e}")

        # Check word count and clear history if needed
        current_word_count = len(transcript.split())
        existing_word_count = sum(len(msg['text'].split()) for msg in history)
        if existing_word_count + current_word_count > 2000:
            history = []
            session['history'] = history

        # Update history with current transcript
        history.append({'author': 'user', 'text': transcript})
        session['history'] = history

        # Prepend system message on first turn
        if len(history) == 1:
          system_msg = {
        'author': 'system',
        'text': (
            'You are restricted to response only in 20 words'
        )
    }
          messages = [system_msg] + history
        else:
          messages = history+ 'Please Remember , You are restricted to response only in 20 words'


        # Generate response
        response_text = call_gemini_api(messages)
        response_text = response_text.replace('*', '')

        # Save assistant reply
        history.append({'author': 'assistant', 'text': response_text})
        session['history'] = history

        # Cleanup audio files
        os.remove(webm_path)
        os.remove(wav_path)

        # Generate TTS
        mp3_fn = f"resp_{uuid.uuid4().hex}.mp3"
        mp3_path = os.path.join(app.config['UPLOAD_FOLDER'], mp3_fn)
        synthesize_conversational(response_text, mp3_path)

        # Convert for Wav2Lip
        wav2l_fn = mp3_fn.replace('.mp3', '_w2l.wav')
        w2l_wav = os.path.join(app.config['UPLOAD_FOLDER'], wav2l_fn)
        ffmpeg.input(mp3_path).output(w2l_wav, ac=1, ar=16000).run(quiet=True, overwrite_output=True)

        # Run inference
        face_img = os.path.join(app.root_path, 'static', 'images', 'an.jpg')
        vid_fn = f"talk_{uuid.uuid4().hex}.mp4"
        out_vid_abs = os.path.join(app.config['VIDEO_FOLDER'], vid_fn)
        subprocess.run([
            sys.executable,
            'inference.py',
            '--face', face_img,
            '--audio', w2l_wav,
            '--outfile', out_vid_abs
        ], cwd='Wav2lip-Fix-For-Inference', check=True)

        # Cleanup TTS files
        os.remove(mp3_path)
        os.remove(w2l_wav)

        return jsonify({
            'transcript': transcript,
            'response_text': response_text,
            'video_url': url_for('static', filename=f'video/{vid_fn}')
        })
    except Exception as e:
        app.logger.exception('process_audio error')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)