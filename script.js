const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hearts = [];
const particles = [];
let mouse = { x: 0, y: 0 };

class Heart {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 50;
    this.size = Math.random() * 35 + 25;
    this.baseSize = this.size;
    this.speedY = -(Math.random() * 4 + 3);
    this.colorHsl = { h: Math.random() * 120 + 200, s: 80, l: 60 }; // Lưu dưới dạng object để dễ chuyển rgb
    this.angle = Math.random() * 0.03;
    this.glow = 0;
    this.rotation = 0;
    this.hover = false;
  }
  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.angle += 0.03) * 3;
    this.rotation += 0.01;
    this.glow = Math.sin(Date.now() * 0.003) * 15 + 15;
    if (this.y < -this.size * 2) {
      this.y = canvas.height + this.size * 2;
      this.x = Math.random() * canvas.width;
    }

    // Hiệu ứng hover
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.size + 20) {
      this.size = this.baseSize * 1.2;
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
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, `hsl(${this.colorHsl.h}, ${this.colorHsl.s}%, ${this.colorHsl.l}%)`);

    ctx.beginPath();
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
    ctx.shadowColor = `hsl(${this.colorHsl.h}, ${this.colorHsl.s}%, ${this.colorHsl.l}%)`;
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
  constructor(x, y, colorHsl) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 6 + 3;
    this.speedX = Math.random() * 8 - 4;
    this.speedY = Math.random() * 8 - 4;
    this.opacity = 1;
    this.colorHsl = colorHsl;
    this.glow = Math.random() * 10 + 5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.015; // Chậm fade hơn để đẹp
    this.size *= 0.97; // Thu nhỏ mượt hơn
    this.speedX *= 0.98; // Chậm dần để tự nhiên
    this.speedY *= 0.98;
  }
  draw() {
    ctx.save();
    ctx.shadowBlur = this.glow;
    ctx.shadowColor = `hsl(${this.colorHsl.h}, ${this.colorHsl.s}%, ${this.colorHsl.l}%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.colorHsl.h}, ${this.colorHsl.s}%, ${this.colorHsl.l}%, ${this.opacity})`;
    ctx.fill();
    ctx.restore();
  }
}

function init() {
  for (let i = 0; i < 40; i++) {
    hearts.push(new Heart());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach(h => {
    h.update();
    h.draw();
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
    { scale: 0.5, opacity: 1, rotation: Math.random() * 180 - 90 },
    { scale: 2.5, opacity: 0, duration: 1.8, ease: "power3.out", onComplete: () => text.remove() }
  );
}

function createExplosion(x, y, colorHsl) {
  for (let i = 0; i < 40; i++) { // Tăng số particles cho đẹp hơn
    particles.push(new Particle(x, y, colorHsl));
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

  hearts.forEach((heart, index) => {
    const dx = mouseX - heart.x;
    const dy = mouseY - heart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < heart.size) {
      createExplosion(heart.x, heart.y, heart.colorHsl);
      createTextExplosion(mouseX, mouseY);
      hearts.splice(index, 1);
      hearts.push(new Heart());
    }
  });
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

init();
animate();
