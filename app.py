app=FLASK(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/ai')
def ai():
    return render_template('ai.html')
if __name__=='__main__':
    app.run(debug=True)