const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hearts = [];
const particles = [];
let mouse = { x: null, y: null };
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
let heartCount = 0;
const countElement = document.getElementById("count");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const toggleIcon = darkModeToggle.querySelector(".icon");

class Heart {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 50;
    this.size = Math.random() * (isMobile ? 30 : 40) + (isMobile ? 20 : 25);
    this.baseSize = this.size;
    this.speedY = -(Math.random() * 2 + 1.5);
    this.colorHsl = { h: Math.random() * 100 + 200, s: 85, l: document.body.classList.contains("dark-mode") ? 40 : 65 }; // Tối hơn ở dark mode
    this.angle = Math.random() * 0.03;
    this.glow = 0;
    this.rotation = 0;
    this.hover = false;
  }
  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.angle += 0.025) * 2;
    this.rotation += 0.01;
    this.glow = Math.sin(Date.now() * 0.004) * (isMobile ? 15 : 20) + (isMobile ? 15 : 20);
    if (this.y < -this.size * 2) {
      this.y = canvas.height + this.size * 2;
      this.x = Math.random() * canvas.width;
    }

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.size + (isMobile ? 30 : 20)) {
      this.size = this.baseSize * (isMobile ? 1.4 : 1.3);
      this.glow += isMobile ? 10 : 15;
    } else {
      this.size = this.baseSize;
    }
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
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

    ctx.beginPath();
    ctx.arc(-this.size / 4, -this.size / 4, this.size / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();

    ctx.restore();
  }
}

class Particle {
  constructor(x, y, colorHsl) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * (isMobile ? 5 : 7) + (isMobile ? 3 : 4);
    this.speedX = Math.random() * (isMobile ? 8 : 10) - (isMobile ? 4 : 5);
    this.speedY = Math.random() * (isMobile ? 8 : 10) - (isMobile ? 4 : 5);
    this.opacity = 1;
    this.colorHsl = colorHsl;
    this.glow = Math.random() * (isMobile ? 10 : 15) + (isMobile ? 5 : 10);
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= isMobile ? 0.015 : 0.012;
    this.size *= isMobile ? 0.97 : 0.96;
    this.speedX *= 0.97;
    this.speedY *= 0.97;
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

class TextParticle {
  constructor(x, y, colorHsl) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * (isMobile ? 2 : 3) + 2;
    this.speedX = Math.random() * (isMobile ? 4 : 6) - (isMobile ? 2 : 3);
    this.speedY = Math.random() * (isMobile ? 4 : 6) - (isMobile ? 2 : 3);
    this.opacity = 1;
    this.colorHsl = colorHsl;
    this.glow = Math.random() * (isMobile ? 8 : 10) + 5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= isMobile ? 0.025 : 0.02;
    this.size *= 0.98;
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
  const heartCountInit = isMobile ? 20 : 40;
  for (let i = 0; i < heartCountInit; i++) {
    hearts.push(new Heart());
  }

  // Khôi phục chế độ tối từ localStorage
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    toggleIcon.textContent = "🌙";
    hearts.forEach(heart => heart.colorHsl.l = 40);
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

  const colorHsl = { h: Math.random() * 100 + 200, s: 85, l: document.body.classList.contains("dark-mode") ? 40 : 65 };
  for (let i = 0; i < (isMobile ? 10 : 20); i++) {
    particles.push(new TextParticle(x, y, colorHsl));
  }

  gsap.fromTo(text, 
    { scale: 0.5, opacity: 1, rotation: Math.random() * 90 - 45 },
    { scale: isMobile ? 3.5 : 3, opacity: 0, duration: isMobile ? 2.2 : 2, ease: "power4.out", onComplete: () => text.remove() }
  );
}

function createExplosion(x, y, colorHsl) {
  const particleCount = isMobile ? 30 : 50;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(x, y, colorHsl));
  }
}

function handleExplosion(e, isTouch = false) {
  const rect = canvas.getBoundingClientRect();
  const eventX = isTouch ? e.touches[0].clientX : e.clientX;
  const eventY = isTouch ? e.touches[0].clientY : e.clientY;
  mouse.x = eventX - rect.left;
  mouse.y = eventY - rect.top;

  let exploded = false;
  for (let i = 0; i < hearts.length; i++) {
    const heart = hearts[i];
    const dx = mouse.x - heart.x;
    const dy = mouse.y - heart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < heart.size + (isMobile ? 30 : 20)) {
      createExplosion(heart.x, heart.y, heart.colorHsl);
      createTextExplosion(mouse.x, mouse.y);
      hearts.splice(i, 1);
      hearts.push(new Heart());
      heartCount++;
      countElement.textContent = heartCount;
      exploded = true;
      break; // Chỉ nổ một quả bóng
    }
  }
  if (isTouch && exploded) {
    e.preventDefault();
  }
}

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("click", (e) => handleExplosion(e));

canvas.addEventListener("touchstart", (e) => handleExplosion(e, true));

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
    toggleIcon.textContent = "🌙";
    hearts.forEach(heart => heart.colorHsl.l = 40);
  } else {
    localStorage.setItem("darkMode", "disabled");
    toggleIcon.textContent = "☀️";
    hearts.forEach(heart => heart.colorHsl.l = 65);
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

init();
animate();
