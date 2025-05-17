const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Redistribute particles when canvas is resized
    redistributeParticles();
}

// Call resize on load and when window is resized
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3.5 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset particle if it goes off screen
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    reset() {
        // Reset to a random position within the canvas
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 165, 0, ${this.opacity})`; // Orange color with opacity
        ctx.fill();
    }
}

// Create particle array
const particles = [];
const particleCount = 100;

// Function to redistribute particles evenly
function redistributeParticles() {
    particles.length = 0; // Clear existing particles
    
    // Calculate grid dimensions for even distribution
    const cols = Math.ceil(Math.sqrt(particleCount));
    const rows = Math.ceil(particleCount / cols);
    
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;
    
    for (let i = 0; i < particleCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        // Add some randomness within each cell
        const x = (col * cellWidth) + (Math.random() * cellWidth);
        const y = (row * cellHeight) + (Math.random() * cellHeight);
        
        particles.push(new Particle(x, y));
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

// Start animation
animate(); 