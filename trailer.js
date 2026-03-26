(function() {
  'use strict';

  const canvas = document.getElementById('trailer-canvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const overlay = document.getElementById('trailer-overlay');

  const state = {
    width: window.innerWidth,
    height: window.innerHeight,
    lastTime: 0,
    active: false,
    hueShift: 0,
    trail: [],
    scene: 'intro', // 'intro', 'welcome', 'manifest', 'mainloop'
    sceneTimer: 0,
    sceneDuration: {
      intro: 3500,
      welcome: 7000,
      manifest: 9500,
      mainloop: 7000
    },
    manifestIndex: 0,
    manifestT: 0,
    manifestLines: [
      'Koneksi antargalaksi',
      'Kreativitas tanpa batas',
      'Komunitas yang bergerak cepat',
      'StickNext Saga Rail, dimulai sekarang.'
    ],
    titleAlpha: 0,
    textAlpha: 0,
    avatarImg: new Image(),
    avatarLoaded: false
  };

  window.addEventListener('resize', resizeCanvas);

  function resizeCanvas() {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    canvas.width = state.width * devicePixelRatio;
    canvas.height = state.height * devicePixelRatio;
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  // Preload avatar image
  state.avatarImg.src = 'Naufal Mrsov.images.jpg';
  state.avatarImg.onload = () => {
    state.avatarLoaded = true;
  };
  state.avatarImg.onerror = () => {
    console.warn('Avatar image failed to load');
  };

  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * state.width;
      this.y = Math.random() * state.height;
      this.z = Math.random() * state.width;
      this.r = Math.random() * 1.5 + 0.25;
      this.speed = (0.05 + Math.random() * 0.22) * 1.4;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update(delta) {
      this.z -= this.speed * delta;
      if (this.z <= 1) {
        this.reset();
        this.z = state.width;
      }
    }
    draw() {
      const px = (this.x - state.width / 2) * (state.width / this.z) + state.width / 2;
      const py = (this.y - state.height / 2) * (state.width / this.z) + state.height / 2;
      const size = this.r * (state.width / this.z) * 1.4;
      if (px < 0 || px > state.width || py < 0 || py > state.height) return;
      ctx.fillStyle = `rgba(255,255,255, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const stars = Array.from({ length: 220 }, () => new Star());

  class Comet {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * state.width;
      this.y = Math.random() * state.height * 0.4;
      this.length = Math.random() * 100 + 130;
      this.speed = Math.random() * 0.8 + 0.7;
      this.thickness = Math.random() * 2.5 + 1;
      this.alpha = Math.random() * 0.6 + 0.25;
      this.angle = Math.PI * 0.72 + (Math.random() * 0.14 - 0.07);
      this.life = Math.random() * 1.5 + 1.3;
      this.age = 0;
    }
    update(delta) {
      const dx = Math.cos(this.angle) * this.speed * 110 * delta;
      const dy = Math.sin(this.angle) * this.speed * 110 * delta;
      this.x += dx;
      this.y += dy;
      this.age += delta;
      if (this.age > this.life || this.x > state.width + 60 || this.y > state.height + 60) this.reset();
    }
    draw() {
      ctx.save();
      const grd = ctx.createLinearGradient(this.x, this.y, this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
      grd.addColorStop(0, `rgba(255,255,255, ${this.alpha})`);
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grd;
      ctx.lineWidth = this.thickness;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - Math.cos(this.angle) * this.length, this.y - Math.sin(this.angle) * this.length);
      ctx.stroke();
      ctx.restore();
    }
  }

  const comets = Array.from({ length: 3 }, () => new Comet());

  class Train {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = -260;
      this.y = state.height * 0.9;
      this.baseY = this.y;
      this.vx = 180;
      this.offset = 0;
      this.phase = 0;
    }
    update(delta) {
      this.x += this.vx * delta;
      this.offset = Math.sin(this.phase) * 5;
      this.phase += delta * 2;
      this.y = this.baseY + this.offset;
      if (this.x > state.width + 220) {
        this.x = -320;
      }
    }
    draw() {
      const px = this.x;
      const py = this.y;

      ctx.save();
      ctx.translate(px, py);
      ctx.fillStyle = '#181f3c';
      ctx.strokeStyle = 'rgba(61, 224, 255, .9)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(65, 207, 255, 0.8)';
      ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.roundRect(0, -40, 260, 60, 12);
      ctx.fill();
      ctx.stroke();

      const windows = 5;
      for (let i = 0; i < windows; i++) {
        const offsetX = 20 + i * 45;
        ctx.fillStyle = `rgba(173, 224, 255, 0.6)`;
        ctx.fillRect(offsetX, -30, 28, 26);
        ctx.strokeStyle = 'rgba(158, 227, 255, 0.8)';
        ctx.strokeRect(offsetX, -30, 28, 26);
      }

      ctx.beginPath();
      ctx.moveTo(-18, -25);
      ctx.lineTo(0, -15);
      ctx.lineTo(-18, -5);
      ctx.closePath();
      ctx.fillStyle = '#08cdff';
      ctx.fill();

      ctx.fillStyle = '#00f9ff';
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.9)';
      ctx.fillRect(0, 12, 250, 5);

      ctx.restore();
    }
  }

  const train = new Train();

  class TextTunnel {
    constructor() {
      this.text = 'STICKNEXT SAGA RAIL';
      this.offset = 0;
      this.speed = 30;
    }
    update(delta) {
      this.offset += this.speed * delta;
      if (this.offset > 1200) this.offset = 0;
    }
    draw() {
      const y = state.height * 0.33;
      const textSize = Math.min(88, state.width / 10);
      ctx.font = `${textSize}px Orbitron, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(140, 156, 255, 0.2)';
      ctx.fillText(this.text, state.width / 2, y);
      for (let i = -2; i <= 2; i++) {
        ctx.fillStyle = `hsla(${(state.hueShift + i * 24) % 360}, 100%, 72%, 0.18)`;
        ctx.fillText(this.text, state.width / 2 + (i * 220 - (state.hueShift * 1.1) % 220), y + i * 1.6);
      }
    }
  }

  const textTunnel = new TextTunnel();

  function drawSky() {
    const grad = ctx.createRadialGradient(state.width * 0.45, state.height * 0.2, 30, state.width * 0.5, state.height * 0.8, state.width * 0.7);
    grad.addColorStop(0, 'rgba(74,80,160,0.85)');
    grad.addColorStop(0.55, 'rgba(8,14,38,0.55)');
    grad.addColorStop(1, 'rgba(2,4,14,1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, state.width, state.height);

    const p = 0.04;
    const horiz = state.height * 0.75;
    ctx.fillStyle = 'rgba(31, 39, 67, 0.6)';
    ctx.fillRect(0, horiz, state.width, state.height - horiz);

    for (let i = 0; i < 2; i++) {
      const y = horiz - 8 - i * 2;
      ctx.strokeStyle = `rgba(25,110,220,${0.1 + i * 0.04})`;
      ctx.lineWidth = 2; 
      ctx.beginPath();
      ctx.moveTo(-80, y);
      ctx.lineTo(state.width + 80, y);
      ctx.stroke();
    }
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(34, 120, 178, 0.22)';
    ctx.lineWidth = 1;
    const offset = (state.hueShift % 20) * 2;
    const spacing = 32;
    for (let x = -spacing; x < state.width + spacing; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x + offset, state.height * 0.79);
      ctx.lineTo(x - 100 + offset, state.height);
      ctx.stroke();
    }
    for (let y = state.height * 0.79; y <= state.height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(state.width, y + 4);
      ctx.stroke();
    }
  }

  function drawInfo() {
    ctx.fillStyle = `hsla(${state.hueShift % 360}, 100%, 78%, 0.65)`;
    ctx.font = 'bold 24px Orbitron, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Pre-Launch: Komunitas, Kreativitas, Kecepatan', 30, state.height * 0.14);

    ctx.font = '12px Monospace';
    ctx.fillStyle = 'rgba(204, 228, 255, 0.42)';
    const time = new Date().toLocaleTimeString('id-ID');
    ctx.fillText(`Sesi: ${time} | Frame: ${(performance.now() / 1000).toFixed(1)}`, 30, state.height * 0.17);
  }

  function getResponsiveFontSize(text, baseSize, maxWidth) {
    const metric = 'Orbitron, sans-serif';
    let size = baseSize;
    do {
      ctx.font = `${size}px ${metric}`;
      if (ctx.measureText(text).width <= maxWidth) break;
      size -= 1;
    } while (size > 14);
    return size;
  }

  function drawCinematicOverlay(delta) {
    state.sceneTimer += delta * 1000;

    if (state.scene === 'intro' && state.sceneTimer > state.sceneDuration.intro) {
      state.scene = 'welcome';
      state.sceneTimer = 0;
      state.titleAlpha = 0;
      state.textAlpha = 0;
    }

    if (state.scene === 'welcome' && state.sceneTimer > state.sceneDuration.welcome) {
      state.scene = 'manifest';
      state.sceneTimer = 0;
      state.manifestIndex = 0;
      state.manifestT = 0;
      state.textAlpha = 0;
    }

    if (state.scene === 'manifest' && state.sceneTimer > state.sceneDuration.manifest) {
      state.scene = 'mainloop';
      state.sceneTimer = 0;
      state.titleAlpha = 0;
      state.textAlpha = 0;
    }

    if (state.scene === 'mainloop' && state.sceneTimer > state.sceneDuration.mainloop) {
      window.location.href = 'beranda.html';
      return;
    }

    // Background soft star-flash for intro
    if (state.scene === 'intro') {
      const r = Math.min(1, state.sceneTimer / 1200);
      ctx.fillStyle = `rgba(0, 0, 18, ${0.35 + r * 0.45})`;
      ctx.fillRect(0, 0, state.width, state.height);
      const o = Math.sin(state.sceneTimer * 0.005) * 0.4;
      ctx.strokeStyle = `rgba(200, 240, 255, ${0.14 + o})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(state.width * 0.02, state.height * 0.7);
      ctx.lineTo(state.width * 0.98, state.height * 0.72);
      ctx.stroke();
      return;
    }

    // overlay text for welcome and manifest
    ctx.save();
    ctx.textAlign = 'center';
    if (state.scene === 'welcome') {
      const progress = Math.min(1, state.sceneTimer / 1200);
      state.titleAlpha = Math.min(1, state.titleAlpha + delta * 1.2);
      state.textAlpha = Math.min(1, state.textAlpha + delta * 1.1);

      // dark cinematic backplate behind text
      ctx.fillStyle = `rgba(1, 6, 18, 0.56)`;
      ctx.fillRect(state.width * 0.08, state.height * 0.28, state.width * 0.84, state.height * 0.28);
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.strokeRect(state.width * 0.08, state.height * 0.28, state.width * 0.84, state.height * 0.28);

      const welcomeText = 'SELAMAT DATANG DI STICKNEXT';
      const helpText = 'Sistem loading rute kosmik... Bersiaplah untuk kecepatan galaksi.';
      const maxTitleWidth = state.width * 0.86;
      const maxHelpWidth = state.width * 0.82;
      const titleSize = getResponsiveFontSize(welcomeText, Math.min(78, state.width / 11), maxTitleWidth);
      const helpSize = getResponsiveFontSize(helpText, Math.min(24, state.width / 24), maxHelpWidth);

      ctx.shadowBlur = 24;
      ctx.shadowColor = 'rgba(40, 180, 255, 0.9)';
      ctx.fillStyle = `rgba(230, 255, 255, ${state.titleAlpha})`;
      ctx.font = `${titleSize}px Orbitron, sans-serif`;
      ctx.fillText(welcomeText, state.width / 2, state.height * 0.4);

      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(135, 230, 255, 0.8)';
      ctx.fillStyle = `rgba(170, 221, 255, ${state.textAlpha})`;
      ctx.font = `${helpSize}px Orbitron, sans-serif`;
      ctx.fillText(helpText, state.width / 2, state.height * 0.48);
      ctx.shadowBlur = 0;

      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(state.width / 2, state.height / 2 + 32, 62 * (1 - progress), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      return;
    }

    if (state.scene === 'manifest') {
      if (state.manifestIndex < state.manifestLines.length) {
        state.manifestT += delta;
        if (state.manifestT > 1.8) {
          state.manifestIndex++;
          state.manifestT = 0;
          state.textAlpha = 0;
        }
      }

      if (state.manifestIndex < state.manifestLines.length) {
        state.textAlpha = Math.min(1, state.textAlpha + delta * 1.5);
        const headlineText = state.manifestLines[state.manifestIndex];
        const maxManifestWidth = state.width * 0.77;
        const manifestSize = getResponsiveFontSize(headlineText, Math.min(38, state.width / 22), maxManifestWidth);

        // dark panel for manifest text
        ctx.fillStyle = 'rgba(0, 0, 0, 0.47)';
        ctx.fillRect(state.width * 0.12, state.height * 0.25, state.width * 0.76, state.height * 0.22);

        ctx.shadowBlur = 16;
        ctx.shadowColor = 'rgba(128, 220, 255, 0.78)';
        ctx.fillStyle = `rgba(190, 243, 255, ${state.textAlpha})`;
        ctx.font = `${manifestSize}px Orbitron, sans-serif`;
        ctx.fillText(headlineText, state.width / 2, state.height * 0.38);
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = 'rgba(70, 90, 130, 0.24)';
      ctx.fillRect(0, state.height * 0.82, state.width, state.height * 0.14);
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.font = '18px monospace';
      ctx.fillText('01: ROUTE INTEGRATION  02: CREATIVE FORCE  03: NEW EPOCH', state.width / 2, state.height * 0.86);

      ctx.restore();
      return;
    }

    // mainloop credit slide
    if (state.scene === 'mainloop') {
      const logoW = Math.min(160, state.width * 0.16);
      const logoH = logoW;
      const centerX = state.width / 2;

      ctx.fillStyle = 'rgba(0, 0, 10, 0.58)';
      ctx.fillRect(state.width * 0.1, state.height * 0.12, state.width * 0.8, state.height * 0.56);

      ctx.shadowBlur = 18;
      ctx.shadowColor = 'rgba(80, 210, 255, 0.85)';
      ctx.fillStyle = 'rgba(195, 241, 255, 0.95)';
      ctx.font = `${Math.min(46, state.width / 18)}px Orbitron, sans-serif`;
      ctx.fillText('CREDIT', centerX, state.height * 0.23);

      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(120, 195, 255, 0.8)';
      ctx.font = `${Math.min(28, state.width / 22)}px Orbitron, sans-serif`;
      ctx.fillStyle = 'rgba(200, 230, 255, 0.96)';
      ctx.fillText('StickNext Saga Rail', centerX, state.height * 0.34);
      ctx.fillText('Dibuat oleh Naufal MrSov', centerX, state.height * 0.395);

      ctx.font = `${Math.min(20, state.width / 36)}px Orbitron, sans-serif`;
      ctx.fillStyle = 'rgba(165, 205, 235, 0.94)';
      ctx.fillText('Terima kasih sudah menonton trailer', centerX, state.height * 0.46);

      // Draw avatar square
      if (state.avatarLoaded) {
        ctx.save();
        const x = centerX - logoW / 2;
        const y = state.height * 0.5;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(x - 12, y - 12, logoW + 24, logoH + 24);
        ctx.drawImage(state.avatarImg, x, y, logoW, logoH);
        ctx.restore();
      } else {
        // Placeholder if image not loaded
        ctx.fillStyle = 'rgba(100, 150, 200, 0.8)';
        ctx.fillRect(centerX - logoW / 2, state.height * 0.5, logoW, logoH);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = `${Math.min(24, logoW / 6)}px Arial`;
        ctx.fillText('Naufal', centerX, state.height * 0.5 + logoH / 2);
      }

      ctx.fillStyle = `rgba(255,255,255, ${0.08 + Math.abs(Math.sin(state.sceneTimer * 0.034)) * 0.07})`;
      ctx.font = 'bold 18px Arial';
      ctx.fillText('Halaman akan diarahkan ke beranda sebentar lagi...', centerX, state.height * 0.94);
      ctx.restore();
    }
  }

  function gameLoop(timestamp) {
    const delta = Math.min((timestamp - state.lastTime) / 1000, 0.06);
    state.lastTime = timestamp;

    ctx.clearRect(0, 0, state.width, state.height);
    drawSky();
    drawGrid();

    stars.forEach(s => { s.update(delta); s.draw(); });
    comets.forEach(c => { c.update(delta); c.draw(); });

    textTunnel.update(delta);
    textTunnel.draw();

    train.update(delta);
    train.draw();

    drawInfo();
    drawCinematicOverlay(delta);

    state.hueShift = (state.hueShift + delta * 15) % 360;

    if (state.active) {
      requestAnimationFrame(gameLoop);
    }
  }

  function startTrailer() {
    if (state.active) return;
    state.active = true;
    overlay.classList.add('hidden');
    state.lastTime = performance.now();
    state.hueShift = 0;
    requestAnimationFrame(gameLoop);
  }

  function resetTrailer() {
    state.active = false;
    overlay.classList.remove('hidden');
    train.reset();
    stars.forEach(s => s.reset());
    comets.forEach(c => c.reset());
    textTunnel.offset = 0;
    ctx.clearRect(0, 0, state.width, state.height);
  }

  startBtn.addEventListener('click', startTrailer);
  resetBtn.addEventListener('click', resetTrailer);

  resizeCanvas();
  resetTrailer();
})();