const buttonTexts = [
    "Need someone to talk to?",
    "Start Your Therapy Session",
    "I'm here to listen.",
    "Tap for Support & Comfort",
    "Let's Talk, Whenever You're Ready"
];

const button = document.getElementById('animatedButton');
const buttonText = button.querySelector('.button-text');
let currentIndex = 0;

function updateButtonText() {
    // Fade out
    buttonText.classList.add('fade-out');
    
    setTimeout(() => {
        // Change text
        buttonText.textContent = buttonTexts[currentIndex];
        // Fade in
        buttonText.classList.remove('fade-out');
        
        // Update index for next text
        currentIndex = (currentIndex + 1) % buttonTexts.length;
    }, 500); // Half a second for fade out
}

// Initial delay before starting animation
setTimeout(() => {
    // Start the animation cycle
    setInterval(updateButtonText, 3000); // Change text every 3 seconds
}, 1000); 