const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const butterflies = [];
const flowers = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 5 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.opacity = Math.random() * 0.5 + 0.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    this.opacity -= 0.005;
    if (this.opacity < 0) this.opacity = 0;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(142, 45, 226, ${this.opacity})`;
    ctx.fill();
  }
}

class Butterfly {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 20 + 10;
    this.angle = Math.random() * 2 * Math.PI;
    this.speed = Math.random() * 2 + 1;
  }
  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.angle += 0.05;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
    }
  }
  draw() {
    ctx.fillStyle = `rgba(0, 198, 255, 0.7)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(142, 45, 226, 0.7)`;
    ctx.beginPath();
    ctx.arc(this.x + this.size / 2, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Flower {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.size = Math.random() * 15 + 10;
    this.speedY = -(Math.random() * 2 + 1);
  }
  update() {
    this.y += this.speedY;
    if (this.y < 0) {
      this.y = canvas.height;
      this.x = Math.random() * canvas.width;
    }
  }
  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
    butterflies.push(new Butterfly());
    flowers.push(new Flower());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  butterflies.forEach(b => {
    b.update();
    b.draw();
  });
  flowers.forEach(f => {
    f.update();
    f.draw();
  });
  requestAnimationFrame(animate);
}

init();
animate();

document.getElementById("btn").addEventListener("click", () => {
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle());
    butterflies.push(new Butterfly());
    flowers.push(new Flower());
  }
  gsap.to("#title", {
    scale: 1.1,
    duration: 0.5,
    yoyo: true,
    repeat: 1,
    ease: "power2.out"
  });
  gsap.to("#btn", {
    scale: 1.2,
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: "power2.out"
  });
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
