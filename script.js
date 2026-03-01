:root {
  --bg-gradient: linear-gradient(-60deg, #0a0826, #2a1b5c, #1e1a4a, #9b38e6, #00d4ff, #ff4da6);
  --bg-size: 600% 600%;
  --star-opacity: 0.8;
  --twinkle-opacity: 0.7;
  --nebula-opacity: 0.3;
  --cloud-opacity: 0.15;
  --ambient-opacity: 0.1;
  --title-color: #fff;
  --title-shadow: 0 0 15px #fff, 0 0 25px #ff4da6, 0 0 35px #00d4ff, 0 0 45px #9b38e6;
  --text-explosion-color: #ff2e82;
  --text-explosion-stroke: 1.5px #fff;
  --text-explosion-shadow: 0 0 20px #ff2e82, 0 0 30px #00d4ff, 0 0 40px #9b38e6;
  --button-bg: rgba(255, 255, 255, 0.1);
  --button-color: #fff;
  --counter-color: #fff;
}

body.dark-mode {
  --bg-gradient: linear-gradient(-60deg, #000000, #1a1a1a, #2a2a2a, #3a3a3a, #4a4a4a, #5a5a5a);
  --star-opacity: 0.5;
  --twinkle-opacity: 0.4;
  --nebula-opacity: 0.2;
  --cloud-opacity: 0.1;
  --ambient-opacity: 0.05;
  --title-color: #ddd;
  --title-shadow: 0 0 10px #ddd, 0 0 15px #333, 0 0 20px #444, 0 0 25px #555;
  --text-explosion-color: #aaa;
  --text-explosion-stroke: 1px #ccc;
  --text-explosion-shadow: 0 0 15px #aaa, 0 0 20px #555, 0 0 25px #666;
  --button-bg: rgba(0, 0, 0, 0.5);
  --button-color: #ccc;
  --counter-color: #ccc;
}

body {
  margin: 0;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
  height: 100vh;
  background: var(--bg-gradient);
  background-size: var(--bg-size);
  animation: cosmicGradient 28s ease-in-out infinite; /* Chậm hơn cho chill */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  touch-action: manipulation;
}

@keyframes cosmicGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Hiệu ứng nền */
.stars, .twinkling, .nebula, .clouds, .ambient-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.stars {
  background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><circle cx="1" cy="1" r="1" fill="white"/></svg>') repeat;
  animation: twinkle 20s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  opacity: var(--star-opacity);
}

.twinkling {
  background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"><circle cx="2" cy="2" r="2" fill="rgba(255,255,255,0.7)"/></svg>') repeat;
  animation: twinkle 15s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse;
  opacity: var(--twinkle-opacity);
}

.nebula {
  background: radial-gradient(ellipse at center, rgba(155,56,230,var(--nebula-opacity)) 0%, rgba(0,212,255,var(--nebula-opacity)) 50%, transparent 100%);
  animation: pulse 12s ease-in-out infinite;
}

.clouds {
  background: radial-gradient(ellipse at center, rgba(255,255,255,var(--cloud-opacity)) 0%, transparent 65%);
  animation: float 35s cubic-bezier(0.36, 0, 0.64, 1) infinite;
}

.ambient-glow {
  background: radial-gradient(circle at center, rgba(255,255,255,var(--ambient-opacity)) 0%, transparent 70%);
  animation: ambientPulse 15s ease-in-out infinite;
}

@keyframes twinkle { /* ... giữ nguyên */ }
@keyframes pulse { /* ... giữ nguyên */ }
@keyframes float { /* ... giữ nguyên */ }
@keyframes ambientPulse { /* ... giữ nguyên */ }

/* Tiêu đề */
#title {
  font-family: 'Playfair Display', serif;
  font-size: 9vw;
  color: var(--title-color);
  text-shadow: var(--title-shadow);
  animation: glow 3s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
  z-index: 10;
  letter-spacing: 1.5px;
  text-align: center;
  padding: 0 15px;
  opacity: 1;
}

@keyframes glow { /* ... giữ nguyên */ }

/* Fade out title */
.fade-out-title {
  animation: fadeOutTitle 2.5s ease-in forwards;
  animation-delay: 5s;
}

@keyframes fadeOutTitle {
  to {
    opacity: 0;
    transform: translateY(-40px);
  }
}

/* Nút chế độ sáng/tối */
.dark-mode-toggle {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 15;
  cursor: pointer;
  font-size: 2em;
  background: var(--button-bg);
  border-radius: 50%;
  padding: 10px;
  color: var(--button-color);
  transition: background 0.3s, transform 0.2s;
}

.dark-mode-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

/* Bộ đếm trái tim */
.heart-counter {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 15;
  font-size: 1.6em;
  color: var(--counter-color);
  display: flex;
  align-items: center;
  background: var(--button-bg);
  border-radius: 20px;
  padding: 6px 12px;
  backdrop-filter: blur(4px);
}

/* Canvas */
#canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  cursor: default;
  transition: cursor 0.2s;
}

#canvas.interactive {
  cursor: pointer;
}

/* Hiệu ứng chữ nổ */
.text-explosion {
  position: absolute;
  font-family: 'Poppins', sans-serif;
  font-size: 10vw;
  font-weight: 900;
  color: var(--text-explosion-color);
  -webkit-text-stroke: var(--text-explosion-stroke);
  text-shadow: var(--text-explosion-shadow);
  pointer-events: none;
  z-index: 10;
  opacity: 1;
  transform-origin: center;
}

/* Media query cho di động */
@media (max-width: 768px) {
  #title { font-size: 11vw; }
  .text-explosion { font-size: 14vw; -webkit-text-stroke: 1.2px #fff; }
  .dark-mode-toggle, .heart-counter { font-size: 1.4em; padding: 8px; }
}
