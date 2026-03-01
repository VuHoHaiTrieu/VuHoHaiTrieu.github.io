const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hearts = [];
const particles = [];
let mouse = { x: null, y: null };
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
let heartCount = 0;
let highScore = localStorage.getItem('highScore') || 0;
const countElement = document.getElementById("count");
const highScoreElement = document.getElementById("high-score");
highScoreElement.textContent = ` | High: ${highScore}`;
const darkModeToggle = document.getElementById("dark-mode-toggle");
const toggleIcon = darkModeToggle.querySelector(".icon");
const shareButton = document.getElementById("share-button");
const fullscreenToggle = document.getElementById("fullscreen-toggle");
const popSound = document.getElementById("pop-sound");

let isNearHeart = false;

class Heart {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 50;
    this.size = Math.random() * (isMobile ? 25 : 35) + (isMobile ? 15 : 20); // Nhỏ hơn trên mobile
    this.baseSize = this.size;
    this.speedY = -(Math.random() * 1.5 + 1); // Chậm hơn cho mượt
    this.colorHsl = { h: Math.random() * 100 + 200, s: 80, l: document.body.classList.contains("dark-mode") ? 45 : 70 };
    this.angle = Math.random() * 0.02;
    this.glow = 0;
    this.rotation = 0;
    this.opacity = 0;
  }

  update() {
    this.y += this.speedY;
    this.x += Math.sin(this.angle += 0.02) * 1.5;
    this.rotation += 0.008;
    this.glow = Math.sin(Date.now() * 0.003) * 20 + 20;

    if (this.opacity < 1) this.opacity += 0.025;

    if (this.y < -this.size * 2) {
      this.y = canvas.height + this.size * 2;
      this.x = Math.random() * canvas.width;
      this.opacity = 0;
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
    gradient.addColorStop(1, `hsl(${this.colorHsl.h}, ${this.colorHsl.s}%, ${this.colorHsl.l}%)`);
    ctx.beginPath();
    ctx.moveTo(0, -this.size / 2);
    ctx.bezierCurveTo(-this.size, -this.size * 0.8, -this.size * 1.2, this.size / 3, 0, this.size * 0.9);
    ctx.bezierCurveTo(this.size * 1.2, this.size / 3, this.size, -this.size * 0.8, 0, -this.size / 2);
    ctx.fillStyle = gradient;
    ctx.shadowBlur = this.glow;
    ctx.shadowColor = `hsl(${this.colorHsl.h}, ${this.colorHsl.s}%, ${this.colorHsl.l}%)`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-this.size / 4, -this.size / 4, this.size / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fill();
    ctx.restore();
  }
}

// Particle và TextParticle (tăng particle trên desktop, giảm trên mobile)
class Particle {
  constructor(x, y, colorHsl) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * (isMobile ? 4 : 6) + 3;
    this.speedX = Math.random() * (isMobile ? 6 : 8) - (isMobile ? 3 : 4);
    this.speedY = Math.random() * (isMobile ? 6 : 8) - (isMobile ? 3 : 4);
    this.opacity = 1;
    this.colorHsl = colorHsl;
    this.glow = Math.random() * 12 + 8;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= isMobile ? 0.018 : 0.015;
    this.size *= 0.965;
    this.speedX *= 0.975;
    this.speedY *= 0.975;
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
    this.size = Math.random() * 2.5 + 1.5;
    this.speedX = Math.random() * 5 - 2.5;
    this.speedY = Math.random() * 5 - 2.5;
    this.opacity = 1;
    this.colorHsl = colorHsl;
    this.glow = Math.random() * 10 + 5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.022;
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
  const heartCountInit = isMobile ? 15 : 35; // Tối ưu performance mobile
  for (let i = 0; i < heartCountInit; i++) {
    hearts.push(new Heart());
  }

  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    toggleIcon.textContent = "🌙";
    hearts.forEach(heart => heart.colorHsl.l = 45);
  }

  gsap.to("#title", { opacity: 0, y: -30, duration: 2, delay: 5, ease: "power2.in" });

  // Parallax layers mượt (GSAP)
  document.addEventListener("mousemove", (e) => {
    gsap.to(".stars", { x: e.clientX * 0.02, y: e.clientY * 0.02, duration: 0.5 });
    gsap.to(".twinkling", { x: e.clientX * 0.04, y: e.clientY * 0.04, duration: 0.6 });
    gsap.to(".nebula", { x: e.clientX * 0.06, y: e.clientY * 0.06, duration: 0.7 });
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  isNearHeart = false;
  hearts.forEach(h => {
    h.update();
    h.draw();
    const dx = mouse.x - h.x;
    const dy = mouse.y - h.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < h.size + (isMobile ? 25 : 15)) isNearHeart = true;
  });

  particles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.opacity <= 0) particles.splice(index, 1);
  });

  canvas.classList.toggle('interactive', isNearHeart);

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

  const colorHsl = { h: Math.random() * 100 + 200, s: 80, l: document.body.classList.contains("dark-mode") ? 45 : 70 };

  for (let i = 0; i < (isMobile ? 8 : 15); i++) {
    particles.push(new TextParticle(x, y, colorHsl));
  }

  gsap.fromTo(text, { scale: 0.4, opacity: 1, rotation: Math.random() * 80 - 40 }, 
    { scale: 2.5, opacity: 0, duration: 1.8, ease: "power3.out", onComplete: () => text.remove() });
}

function createExplosion(x, y, colorHsl) {
  const particleCount = isMobile ? 25 : 45;
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
  for (let i = hearts.length - 1; i >= 0; i--) {
    const heart = hearts[i];
    const dx = mouse.x - heart.x;
    const dy = mouse.y - heart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < heart.size + (isMobile ? 30 : 20)) {
      createExplosion(heart.x, heart.y, heart.colorHsl);
      createTextExplosion(mouse.x, mouse.y);
      popSound.play(); // Sound effect
      hearts.splice(i, 1);
      hearts.push(new Heart());
      heartCount++;
      countElement.textContent = heartCount;
      if (heartCount > highScore) {
        highScore = heartCount;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = ` | High: ${highScore}`;
      }
      // Confetti mốc
      if (heartCount % 10 === 0) confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      exploded = true;
      break;
    }
  }

  if (isTouch && exploded) e.preventDefault();
}

// Events
canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX - canvas.getBoundingClientRect().left;
  mouse.y = e.clientY - canvas.getBoundingClientRect().top;
});

canvas.addEventListener("click", handleExplosion);
canvas.addEventListener("touchstart", (e) => handleExplosion(e, true));

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
  toggleIcon.textContent = isDark ? "🌙" : "☀️";
  hearts.forEach(heart => heart.colorHsl.l = isDark ? 45 : 70);
});

// Share
shareButton.addEventListener("click", async () => {
  const shareData = { title: "Tặng Thơm Thúi", text: `Tôi đã chạm ${heartCount} trái tim!`, url: window.location.href };
  try {
    await navigator.share(shareData);
  } catch {
    prompt("Copy link:", window.location.href);
  }
});

// Fullscreen
fullscreenToggle.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

init();
animate();
