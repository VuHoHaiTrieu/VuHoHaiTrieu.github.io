const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bubbles = [];

class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 50;
    this.size = Math.random() * 30 + 20;
    this.speedY = -(Math.random() * 3 + 2);
    this.color = `hsl(${Math.random() * 60 + 240}, 70%, 60%)`; // Tím, xanh dương, hồng phấn
    this.angle = Math.random() * 0.02;
    this.glow = 0;
  }
  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.angle += 0.02) * 2;
    this.glow = Math.sin(Date.now() * 0.002) * 10 + 10; // Hiệu ứng phát sáng nhấp nháy
    if (this.y < -this.size) {
      this.y = canvas.height + this.size;
      this.x = Math.random() * canvas.width;
    }
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    // Vẽ hình trái tim
    ctx.moveTo(this.x, this.y - this.size / 2);
    ctx.bezierCurveTo(
      this.x - this.size, this.y - this.size,
      this.x - this.size, this.y + this.size / 2,
      this.x, this.y + this.size
    );
    ctx.bezierCurveTo(
      this.x + this.size, this.y + this.size / 2,
      this.x + this.size, this.y - this.size,
      this.x, this.y - this.size / 2
    );
    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.glow;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function init() {
  for (let i = 0; i < 30; i++) {
    bubbles.push(new Bubble());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bubbles.forEach(b => {
    b.update();
    b.draw();
  });
  requestAnimationFrame(animate);
}

function createTextExplosion(x, y) {
  const text = document.createElement("div");
  text.className = "text-explosion";
  text.innerText = "Thúi";
  text.style.left = `${x}px`;
  text.style.top = `${y}px`;
  document.body.appendChild(text);

  gsap.to(text, {
    y: y - 100,
    opacity: 0,
    scale: 1.5,
    duration: 1,
    ease: "power2.out",
    onComplete: () => text.remove()
  });
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  bubbles.forEach((bubble, index) => {
    const dx = mouseX - bubble.x;
    const dy = mouseY - bubble.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < bubble.size) {
      createTextExplosion(mouseX, mouseY);
      bubbles.splice(index, 1);
      bubbles.push(new Bubble());
    }
  });
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

init();
animate();
