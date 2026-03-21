// ====== INTIMIDATING DISCLAIMER INTERACTIVE SYSTEM ======

class IntimidatingDisclaimer {
  constructor() {
    this.audioContext = null;
    this.isInitialized = false;
    this.warningMessages = [
      "⚠️ SISTEM MENDETEKSI AKTIVITAS TIDAK SAH",
      "🚨 PERINGATAN: HALAMAN INI DILINDUNGI HUKUM",
      "💀 PELANGGARAN AKAN DIHUKUM BERAT",
      "👁️ SEMUA AKTIVITAS ANDA DIPANTAU",
      "🔒 ENKRIPSI MILITER AKTIF",
      "⚡ VOLTASI TINGGI TERDETEKSI",
      "🩸 DARAH ELEKTRONIK MENGALIR",
      "💥 LEDAKAN DATA MUNGKIN TERJADI",
      "👻 HANTU DIGITAL MENGINTAI",
      "🔥 API NERAKA MENUNGGU",
      "🚨 JANGAN BERSALAH FAHAM !"
    ];
    this.currentWarningIndex = 0;
    this.heartbeatInterval = null;
    this.glitchInterval = null;
    this.eyeTrackingActive = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize Web Audio for sound effects
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      this.setupEventListeners();
      this.startWarningRotation();
      this.setupMouseTracking();
      this.setupTypingEffect();
      this.setupGlitchEffects();
      this.setupHeartbeatSimulation();
      this.setupScreenShake();

      this.isInitialized = true;
      console.log('Intimidating Disclaimer System Activated');
    } catch (error) {
      console.error('Failed to initialize intimidating system:', error);
    }
  }

  setupEventListeners() {
    // Enhanced loading screen
    const loader = document.getElementById('loader');
    const loadingText = document.getElementById('loading-text');

    // Add more dramatic loading sequence
    setTimeout(() => {
      loadingText.textContent = "ANALISIS KEAMANAN...";
      this.playWarningBeep();
    }, 1000);

    setTimeout(() => {
      loadingText.textContent = "VERIFIKASI IDENTITAS...";
      this.screenShake(500);
    }, 2500);

    setTimeout(() => {
      loadingText.textContent = "MEMUAT PROTOKOL KEAMANAN...";
      this.playHeartbeat();
    }, 4000);

    // Enhanced confirm button
    const confirmBtn = document.getElementById('confirm-read');
    if (confirmBtn) {
      confirmBtn.addEventListener('mouseenter', () => {
        this.playWarningBeep();
        this.screenShake(200);
      });

      confirmBtn.addEventListener('click', () => {
        this.playExplosionSound();
        this.screenShake(1000);
        this.showFinalWarning();
      });
    }

    // Add click effects to entire page
    document.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') {
        this.createClickEffect(e.clientX, e.clientY);
      }
    });

    // Keyboard effects
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.showEscapeWarning();
      }
    });
  }

  startWarningRotation() {
    const warningContainer = document.createElement('div');
    warningContainer.id = 'warning-banner';
    warningContainer.style.cssText = `
      position: fixed;
      top: 60px;
      left: 0;
      right: 0;
      background: linear-gradient(45deg, #ff0000, #8b0000);
      color: white;
      padding: 10px;
      text-align: center;
      font-weight: bold;
      font-family: 'Orbitron', monospace;
      z-index: 1000;
      border-top: 2px solid #ff4444;
      border-bottom: 2px solid #ff4444;
      animation: warningPulse 2s infinite alternate;
    `;

    document.body.insertBefore(warningContainer, document.body.firstChild);

    setInterval(() => {
      warningContainer.textContent = this.warningMessages[this.currentWarningIndex];
      this.currentWarningIndex = (this.currentWarningIndex + 1) % this.warningMessages.length;
    }, 3000);
  }

  setupMouseTracking() {
    const cursor = document.createElement('div');
    cursor.id = 'intimidating-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 30px;
      height: 30px;
      background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDEwQzIwIDExLjEwNDYgMTkuMTA0NiAxMiAxOCAyQzE2Ljg5NTQgMTIgMTYgMTEuMTA0NiAxNiAxMEMxNiA4Ljg5NTQyIDE2Ljg5NTQgOCA4IDEwQzE2Ljg5NTQgOCA4IDguODk1NDIgOCA4IDEwQzggOC44OTU0MiA4Ljg5NTQyIDEwIDggMTBDOCAxMS4xMDQ2IDguODk1NDIgMTIgMTAgMTJDMTIuMTA0NiAxMiAxMyAxMS4xMDQ2IDEzIDEwQzEzIDYuODY5IDEwLjEzNCA0IDYgNEM0Ljg2NiA0IDQgNC44NjYgNCA2QzQgOS4xMzQgNi44NjkgMTIgMTAgMTJDMTMuMTMxIDEyIDE2IDkuMTM0IDE2IDZDMTYgNC44NjYgMTUuMTM0IDQgMTMgNEMxMC44NjYgNCA4IDYuODY5IDggMTBaTTEyIDZDMTIgNy4yMDQ2IDExLjIwNDYgOCA4IDhDOCA3LjgwNTQgOC43OTU0MiA3IDggN0M4IDZDOSA2IDkgNi4yMDQ2IDguNzk1NDIgN0M4IDZDOSA2IDkgNi4yMDQ2IDguNzk1NDIgNyIgc3Ryb2tlPSIjZmYwMDAwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9IiNmZjAwMDAiLz4KPC9zdmc+') no-repeat center;
      background-size: contain;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease;
    `;

    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX - 15 + 'px';
      cursor.style.top = e.clientY - 15 + 'px';

      // Random cursor effects
      if (Math.random() < 0.05) {
        cursor.style.transform = `scale(${1 + Math.random() * 0.5}) rotate(${Math.random() * 10 - 5}deg)`;
        setTimeout(() => {
          cursor.style.transform = 'scale(1) rotate(0deg)';
        }, 200);
      }
    });
  }

  setupTypingEffect() {
    const disclaimerBody = document.getElementById('disclaimer-body');
    if (!disclaimerBody) return;

    const paragraphs = disclaimerBody.querySelectorAll('p');
    paragraphs.forEach((p, index) => {
      const originalText = p.textContent;
      p.textContent = '';
      p.style.borderRight = '2px solid #ff0000';
      p.style.animation = 'blink 1s infinite';

      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < originalText.length) {
          p.textContent += originalText[charIndex];
          charIndex++;
          this.playTypingSound();
        } else {
          clearInterval(typeInterval);
          p.style.borderRight = 'none';
          p.style.animation = 'none';
        }
      }, 50 + Math.random() * 50); // Random typing speed for more intimidation
    });
  }

  setupGlitchEffects() {
    const glitchElements = document.querySelectorAll('h1, h2, .alert-panel h2');

    this.glitchInterval = setInterval(() => {
      glitchElements.forEach(element => {
        if (Math.random() < 0.1) { // 10% chance every interval
          element.style.animation = 'glitch 0.3s ease-in-out';
          setTimeout(() => {
            element.style.animation = '';
          }, 300);
        }
      });
    }, 2000);
  }

  setupHeartbeatSimulation() {
    const body = document.body;

    this.heartbeatInterval = setInterval(() => {
      body.style.animation = 'heartbeat 0.5s ease-in-out';
      this.playHeartbeat();
      setTimeout(() => {
        body.style.animation = '';
      }, 500);
    }, 3000 + Math.random() * 2000); // Random interval
  }

  setupScreenShake() {
    // Add shake effect capability
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      .shake { animation: shake 0.5s ease-in-out; }
    `;
    document.head.appendChild(style);
  }

  screenShake(duration = 500) {
    document.body.classList.add('shake');
    setTimeout(() => {
      document.body.classList.remove('shake');
    }, duration);
  }

  createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.style.cssText = `
      position: fixed;
      left: ${x - 25}px;
      top: ${y - 25}px;
      width: 50px;
      height: 50px;
      border: 2px solid #ff0000;
      border-radius: 50%;
      animation: clickEffect 0.6s ease-out forwards;
      pointer-events: none;
      z-index: 9998;
    `;

    document.body.appendChild(effect);

    setTimeout(() => {
      document.body.removeChild(effect);
    }, 600);
  }

  showEscapeWarning() {
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff0000;
      color: white;
      padding: 20px;
      border-radius: 10px;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      z-index: 10000;
      animation: warningPopup 0.5s ease-out;
      box-shadow: 0 0 50px rgba(255, 0, 0, 0.8);
    `;
    warning.textContent = '🚫 MELARIKAN DIRI DILARANG! 🚫';

    document.body.appendChild(warning);
    this.playWarningBeep();
    this.screenShake(1000);

    setTimeout(() => {
      document.body.removeChild(warning);
    }, 3000);
  }

  showFinalWarning() {
    const finalWarning = document.createElement('div');
    finalWarning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      color: #ff0000;
      font-family: 'Orbitron', monospace;
      text-align: center;
    `;

    finalWarning.innerHTML = `
      <div style="font-size: 5rem; margin-bottom: 2rem;">⚠️</div>
      <h1 style="font-size: 3rem; margin-bottom: 1rem;">AKSES DIVERIFIKASI</h1>
      <p style="font-size: 1.5rem; margin-bottom: 2rem;">Anda telah memahami dan menyetujui semua risiko</p>
      <div style="font-size: 2rem; animation: pulse 1s infinite;">✅</div>
    `;

    document.body.appendChild(finalWarning);

    setTimeout(() => {
      finalWarning.style.transition = 'opacity 2s ease';
      finalWarning.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(finalWarning);
      }, 2000);
    }, 3000);
  }

  // Audio Effects
  playWarningBeep() {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  }

  playHeartbeat() {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Heartbeat pattern: lub-dub
      oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
      oscillator.frequency.setValueAtTime(50, this.audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.error('Heartbeat audio failed:', error);
    }
  }

  playTypingSound() {
    if (!this.audioContext || Math.random() > 0.3) return; // Only play sometimes

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(1000 + Math.random() * 500, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.01, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.05);
    } catch (error) {
      console.error('Typing sound failed:', error);
    }
  }

  playExplosionSound() {
    if (!this.audioContext) return;

    try {
      const noiseBuffer = this.createNoiseBuffer();
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      source.buffer = noiseBuffer;
      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

      source.start();
      source.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Explosion sound failed:', error);
    }
  }

  createNoiseBuffer() {
    const bufferSize = this.audioContext.sampleRate * 0.5;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  destroy() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.glitchInterval) clearInterval(this.glitchInterval);
    if (this.audioContext) this.audioContext.close();

    // Remove added elements
    const warningBanner = document.getElementById('warning-banner');
    const intimidatingCursor = document.getElementById('intimidating-cursor');

    if (warningBanner) warningBanner.remove();
    if (intimidatingCursor) intimidatingCursor.remove();
  }
}

// Initialize the intimidating system
const intimidatingDisclaimer = new IntimidatingDisclaimer();

// Wait for user interaction before initializing audio context
document.addEventListener('click', () => {
  intimidatingDisclaimer.initialize();
}, { once: true });

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  intimidatingDisclaimer.destroy();
});