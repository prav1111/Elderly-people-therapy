const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

function initParticles() {
  particlesArray = [];
  const num = 200;
  for (let i = 0; i < num; i++) {
    particlesArray.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1 + 0.5,
      dx: (Math.random() - 0.5) * 1.5,
      dy: (Math.random() - 0.5) * 1.5
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particlesArray) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff"; // White particles
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;

    // Bounce on edges
    if (p.x + p.radius > canvas.width || p.x - p.radius < 0) p.dx *= -1;
    if (p.y + p.radius > canvas.height || p.y - p.radius < 0) p.dy *= -1;
  }
  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

initParticles();
animateParticles(); 