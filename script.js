// Hiệu ứng pháo hoa
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

class Firework {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.particles = [];
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: x,
        y: y,
        radius: Math.random() * 3 + 2,
        color: color,
        speed: Math.random() * 5 + 2,
        angle: Math.random() * 2 * Math.PI,
        opacity: 1
      });
    }
  }
  draw() {
    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
      ctx.fill();
    });
  }
  update() {
    this.particles.forEach(p => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.opacity -= 0.02;
    });
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((fw, i) => {
    fw.draw();
    fw.update();
    fw.particles = fw.particles.filter(p => p.opacity > 0);
    if (fw.particles.length === 0) fireworks.splice(i, 1);
  });
  requestAnimationFrame(animate);
}
animate();

document.getElementById("btn").addEventListener("click", () => {
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height / 2;
  let color = `${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)}`;
  fireworks.push(new Firework(x, y, color));
});

// Resize canvas
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
