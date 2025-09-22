const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bubbles = [];
const particles = [];
let mouse = { x: null, y: null };

class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 50;
    this.size = Math.random() * 40 + 25;
    this.baseSize = this.size;
    this.speedY = -(Math.random() * 2.5 + 1.5);
    this.color = `hsl(${Math.random() * 100 + 200}, 80%, 60%)`; // Mở rộng dải màu: xanh dương, tím, hồng
    this.angle = Math.random() * 0.03;
    this.glow = 10;
    this.rotation = 0;
  }
  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.angle += 0.025) * 2.5; // Chuyển động lắc lư mượt hơn
    this.glow = Math.sin(Date.now() * 0.003) * 15 + 15; // Phát sáng nhấp nháy mượt
    this.rotation += 0.005; // Xoay nhẹ để ảo diệu
    if (this.y < -this.size) {
      this.y = canvas.height + this.size;
      this.x = Math.random() * canvas.width;
    }

    // Hiệu ứng hover
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.size + 20) {
      this.size = this.baseSize * 1.2; // Phóng to khi hover
      this.glow += 10;
    } else {
      this.size = this.baseSize;
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Gradient cho hiệu ứng 3D
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    gradient.addColorStop(0, `rgba(255,255,255,0.8)`);
    gradient.addColorStop(1, this.color);

    ctx.beginPath();
    // Vẽ trái tim đẹp hơn với bezier curves mượt
    ctx.moveTo(0, -this.size / 2);
    ctx.bezierCurveTo(
      -this.size, -this.size * 0.8,
      -this.size * 1.2, this.size / 3,
      0, this.size * 0.9
    );
    ctx.bezierCurveTo(
      this.size * 1.2, this.size / 3,
      this.size, -this.size * 0.8,
      0, -this.size / 2
    );
    ctx.fillStyle = gradient;
    ctx.shadowBlur = this.glow;
    ctx.shadowColor = this.color;
    ctx.fill();

    // Thêm highlight cho 3D
    ctx.beginPath();
    ctx.arc(-this.size / 4, -this.size / 4, this.size / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fill();

    ctx.restore();
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 2;
    this.speedX = Math.random() * 6 - 3;
    this.speedY = Math.random() * 6 - 3;
    this.opacity = 1;
    this.color = color;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.02;
    this.size *= 0.98; // Thu nhỏ dần
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color.replace('hsl(', '').replace(')', '')}, ${this.opacity})`;
    ctx.fill();
  }
}

function init() {
  for (let i = 0; i < 40; i++) { // Tăng số lượng bong bóng
    bubbles.push(new Bubble());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bubbles.forEach(b => {
    b.update();
    b.draw();
  });
  particles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.opacity <= 0) particles.splice(index, 1);
  });
  requestAnimationFrame(animate);
}

function createTextExplosion(x, y) {
  const texts = ["Thơm", "Thúi"];
  const textContent = texts[Math.floor(Math.random() * texts.length)];
  const text = document.createElement("div");
  text.className = "text-explosion";
  text.innerText = textContent;
  text.style.left = `${x}px`;
  text.style.top = `${y}px`;
  document.body.appendChild(text);

  gsap.fromTo(text, 
    { scale: 0, opacity: 1, rotation: Math.random() * 360 - 180 },
    { scale: 2, opacity: 0, duration: 1.2, ease: "power3.out", onComplete: () => text.remove() }
  );
}

function createExplosion(x, y, color) {
  for (let i = 0; i < 30; i++) {
    particles.push(new Particle(x, y, color));
  }
}

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  bubbles.forEach((bubble, index) => {
    const dx = mouseX - bubble.x;
    const dy = mouseY - bubble.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < bubble.size) {
      createExplosion(bubble.x, bubble.y, bubble.color);
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
