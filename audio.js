// ====== ADVANCED AUDIO.JS - MODULAR AUDIO SYSTEM ======

/**
 * AudioEngine - Core Web Audio API management
 */
class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.analyser = null;
    this.sourceNodes = new WeakMap();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw new Error('Web Audio API not supported');

      this.audioCtx = new AudioContext();
      this.masterGain = this.audioCtx.createGain();
      this.analyser = this.audioCtx.createAnalyser();

      // High-quality analyser settings
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
      this.analyser.minDecibels = -90;
      this.analyser.maxDecibels = -10;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      // Load saved volume
      const savedVolume = parseFloat(localStorage.getItem('globalVolume')) || 0.75;
      this.setMasterVolume(savedVolume);

      this.isInitialized = true;
      console.log('AudioEngine initialized successfully');
    } catch (error) {
      console.error('AudioEngine initialization failed:', error);
      throw error;
    }
  }

  connectAudioElement(audioElement) {
    if (!this.audioCtx || this.sourceNodes.has(audioElement)) return;

    try {
      const source = this.audioCtx.createMediaElementSource(audioElement);
      source.connect(this.masterGain);
      this.sourceNodes.set(audioElement, source);
    } catch (error) {
      console.error('Failed to connect audio element:', error);
    }
  }

  setMasterVolume(value) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, value));
      localStorage.setItem('globalVolume', value.toString());
    }
  }

  getFrequencyData() {
    if (!this.analyser) return null;
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  getTimeDomainData() {
    if (!this.analyser) return null;
    const bufferLength = this.analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  resume() {
    return this.audioCtx?.resume();
  }
}

/**
 * Advanced Equalizer with 10 bands and presets
 */
class AdvancedEqualizer {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.filters = [];
    this.presets = {
      flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      rock: [2, 1, -1, -2, 1, 2, 3, 2, 1, 0],
      pop: [-1, 0, 2, 3, 2, 0, -1, -1, 0, 1],
      jazz: [3, 2, 1, 0, -1, -2, -1, 1, 2, 3],
      electronic: [4, 3, 0, -2, -1, 2, 3, 4, 3, 2],
      classical: [2, 2, 1, 0, 0, 0, -1, -1, -1, 0],
      hiphop: [4, 2, 0, -1, 1, 2, 3, 2, 1, 0],
      vocal: [-2, -1, 3, 4, 2, 0, -1, -2, -1, 0]
    };
    this.currentPreset = 'flat';
    this.initializeFilters();
  }

  initializeFilters() {
    if (!this.audioEngine.audioCtx) return;

    const ctx = this.audioEngine.audioCtx;
    const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

    // Clear existing filters
    this.filters.forEach(filter => {
      try { filter.disconnect(); } catch (e) {}
    });
    this.filters = [];

    // Create 10-band parametric EQ
    frequencies.forEach((freq, index) => {
      const filter = ctx.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = freq;
      filter.Q.value = 1.4; // Wider Q for smoother response
      filter.gain.value = 0;
      this.filters.push(filter);
    });

    // Connect filters in series
    this.filters.reduce((prev, current) => {
      prev.connect(current);
      return current;
    });

    // Connect to master gain
    if (this.filters.length > 0) {
      this.filters[this.filters.length - 1].connect(this.audioEngine.masterGain);
    }
  }

  setBandGain(bandIndex, gain) {
    if (this.filters[bandIndex]) {
      this.filters[bandIndex].gain.value = Math.max(-20, Math.min(20, gain));
    }
  }

  getBandGain(bandIndex) {
    return this.filters[bandIndex]?.gain.value || 0;
  }

  applyPreset(presetName) {
    if (!this.presets[presetName]) return false;

    this.presets[presetName].forEach((gain, index) => {
      this.setBandGain(index, gain);
    });
    this.currentPreset = presetName;
    return true;
  }

  resetToFlat() {
    this.filters.forEach((filter, index) => {
      this.setBandGain(index, 0);
    });
    this.currentPreset = 'flat';
  }

  getFrequencyResponse() {
    // Calculate frequency response for visualization
    const sampleRate = this.audioEngine.audioCtx?.sampleRate || 44100;
    const nyquist = sampleRate / 2;
    const frequencies = [];
    const magnitudes = [];

    for (let f = 20; f <= nyquist; f *= Math.pow(2, 1/12)) { // 1/12 octave steps
      frequencies.push(f);
      let totalMag = 1;

      this.filters.forEach(filter => {
        const mag = this.getFilterMagnitude(filter, f);
        totalMag *= mag;
      });

      magnitudes.push(20 * Math.log10(totalMag));
    }

    return { frequencies, magnitudes };
  }

  getFilterMagnitude(filter, frequency) {
    // Simplified magnitude calculation for peaking filter
    const f0 = filter.frequency.value;
    const g = filter.gain.value;
    const q = filter.Q.value;

    const omega = 2 * Math.PI * frequency / (this.audioEngine.audioCtx?.sampleRate || 44100);
    const omega0 = 2 * Math.PI * f0 / (this.audioEngine.audioCtx?.sampleRate || 44100);
    const alpha = Math.sin(omega0) / (2 * q);

    const A = Math.pow(10, g / 40);
    const cosOmega0 = Math.cos(omega0);

    const b0 = 1 + alpha * A;
    const b1 = -2 * cosOmega0;
    const b2 = 1 - alpha * A;
    const a0 = 1 + alpha / A;
    const a1 = -2 * cosOmega0;
    const a2 = 1 - alpha / A;

    const cosOmega = Math.cos(omega);
    const num = b0 + b1 * cosOmega + b2 * Math.cos(2 * omega);
    const den = a0 + a1 * cosOmega + a2 * Math.cos(2 * omega);

    return num / den;
  }
}

/**
 * Beat Detection using spectral flux and onset strength
 */
class BeatDetector {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.previousSpectrum = null;
    this.onsetHistory = [];
    this.beatThreshold = 0.3;
    this.sensitivity = 1.0;
    this.lastBeatTime = 0;
    this.minBeatInterval = 200; // ms
    this.beatCallbacks = [];
  }

  analyze() {
    const spectrum = this.audioEngine.getFrequencyData();
    if (!spectrum) return { beat: false, strength: 0 };

    const onsetStrength = this.calculateOnsetStrength(spectrum);
    this.onsetHistory.push(onsetStrength);

    // Keep history for adaptive threshold
    if (this.onsetHistory.length > 43) { // ~1 second at 43fps
      this.onsetHistory.shift();
    }

    const avgOnset = this.onsetHistory.reduce((a, b) => a + b, 0) / this.onsetHistory.length;
    const variance = this.onsetHistory.reduce((sum, val) => sum + Math.pow(val - avgOnset, 2), 0) / this.onsetHistory.length;
    const threshold = avgOnset + (Math.sqrt(variance) * this.beatThreshold * this.sensitivity);

    const isBeat = onsetStrength > threshold;
    const now = Date.now();

    if (isBeat && (now - this.lastBeatTime) > this.minBeatInterval) {
      this.lastBeatTime = now;
      this.beatCallbacks.forEach(callback => callback(onsetStrength));
      return { beat: true, strength: onsetStrength };
    }

    return { beat: false, strength: onsetStrength };
  }

  calculateOnsetStrength(spectrum) {
    if (!this.previousSpectrum) {
      this.previousSpectrum = new Uint8Array(spectrum.length);
      return 0;
    }

    let flux = 0;
    for (let i = 0; i < spectrum.length; i++) {
      const diff = spectrum[i] - this.previousSpectrum[i];
      if (diff > 0) flux += diff;
    }

    // Update previous spectrum
    this.previousSpectrum.set(spectrum);

    // Normalize flux
    return flux / (spectrum.length * 255);
  }

  setSensitivity(value) {
    this.sensitivity = Math.max(0.1, Math.min(3.0, value));
  }

  setThreshold(value) {
    this.beatThreshold = Math.max(0.1, Math.min(1.0, value));
  }

  onBeat(callback) {
    this.beatCallbacks.push(callback);
  }

  removeBeatCallback(callback) {
    const index = this.beatCallbacks.indexOf(callback);
    if (index > -1) this.beatCallbacks.splice(index, 1);
  }
}

/**
 * Advanced Visualizer with multiple modes
 */
class AdvancedVisualizer {
  constructor(canvas, audioEngine, beatDetector) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audioEngine = audioEngine;
    this.beatDetector = beatDetector;
    this.animationId = null;
    this.mode = 'bars'; // bars, circular, waveform, particles
    this.colors = {
      primary: '#00ffe0',
      secondary: '#ff6b6b',
      accent: '#00a4ff',
      background: 'rgba(0, 0, 0, 0.1)'
    };
    this.particles = [];
    this.beatIntensity = 0;
    this.lastBeatStrength = 0;
  }

  start() {
    if (this.animationId) return;
    this.animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.clear();
  }

  setMode(mode) {
    this.mode = mode;
    this.particles = []; // Reset particles for particle mode
  }

  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    const beatInfo = this.beatDetector.analyze();
    if (beatInfo.beat) {
      this.beatIntensity = beatInfo.strength * 2;
      this.lastBeatStrength = beatInfo.strength;
      this.createBeatEffect();
    }

    this.beatIntensity *= 0.95; // Decay

    this.clear();

    switch (this.mode) {
      case 'bars':
        this.drawBars();
        break;
      case 'circular':
        this.drawCircular();
        break;
      case 'waveform':
        this.drawWaveform();
        break;
      case 'particles':
        this.drawParticles();
        break;
    }
  }

  clear() {
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBars() {
    const frequencyData = this.audioEngine.getFrequencyData();
    if (!frequencyData) return;

    const barCount = 128;
    const barWidth = this.canvas.width / barCount;
    const heightScale = this.canvas.height / 255;

    for (let i = 0; i < barCount; i++) {
      const value = frequencyData[i * 2] || 0;
      const barHeight = value * heightScale * (1 + this.beatIntensity * 0.5);

      // Color gradient based on frequency
      const hue = (i / barCount) * 240; // 0-240 degrees
      this.ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;

      // Beat effect
      if (this.beatIntensity > 0.1) {
        this.ctx.shadowColor = this.colors.primary;
        this.ctx.shadowBlur = this.beatIntensity * 20;
      }

      this.ctx.fillRect(i * barWidth, this.canvas.height - barHeight, barWidth - 1, barHeight);

      this.ctx.shadowBlur = 0;
    }
  }

  drawCircular() {
    const frequencyData = this.audioEngine.getFrequencyData();
    if (!frequencyData) return;

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const barCount = 180;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);

    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const value = frequencyData[i % frequencyData.length] || 0;
      const barLength = (value / 255) * radius * (1 + this.beatIntensity);

      const x1 = Math.cos(angle) * radius * 0.3;
      const y1 = Math.sin(angle) * radius * 0.3;
      const x2 = Math.cos(angle) * (radius * 0.3 + barLength);
      const y2 = Math.sin(angle) * (radius * 0.3 + barLength);

      // Color based on angle
      const hue = (angle / (Math.PI * 2)) * 360;
      this.ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
      this.ctx.lineWidth = 2;

      if (this.beatIntensity > 0.1) {
        this.ctx.shadowColor = `hsl(${hue}, 70%, 50%)`;
        this.ctx.shadowBlur = this.beatIntensity * 10;
      }

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }

    this.ctx.restore();
    this.ctx.shadowBlur = 0;
  }

  drawWaveform() {
    const timeData = this.audioEngine.getTimeDomainData();
    if (!timeData) return;

    this.ctx.strokeStyle = this.colors.primary;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    const sliceWidth = this.canvas.width / timeData.length;
    let x = 0;

    for (let i = 0; i < timeData.length; i++) {
      const v = timeData[i] / 128.0;
      const y = v * this.canvas.height / 2 + this.canvas.height / 2;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    if (this.beatIntensity > 0.1) {
      this.ctx.shadowColor = this.colors.primary;
      this.ctx.shadowBlur = this.beatIntensity * 15;
    }

    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  drawParticles() {
    // Update existing particles
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.02;
      particle.size *= 0.98;
      return particle.life > 0;
    });

    // Draw particles
    this.particles.forEach(particle => {
      this.ctx.save();
      this.ctx.globalAlpha = particle.life;
      this.ctx.fillStyle = particle.color;
      this.ctx.shadowColor = particle.color;
      this.ctx.shadowBlur = particle.size * 2;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  createBeatEffect() {
    if (this.mode === 'particles') {
      // Create burst of particles on beat
      const particleCount = Math.floor(this.lastBeatStrength * 20) + 5;
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const size = Math.random() * 4 + 2;

        this.particles.push({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: size,
          life: 1,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });
      }
    }
  }
}

/**
 * Pulse Effect System for beat visualization
 */
class PulseEffect {
  constructor(container) {
    this.container = container;
    this.pulses = [];
    this.beatCallbacks = [];
  }

  createPulse(intensity = 1) {
    const pulse = document.createElement('div');
    pulse.className = 'beat-pulse';
    pulse.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 255, 224, 0.8) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 1000;
      animation: beatPulse ${0.5 / intensity}s ease-out forwards;
    `;

    this.container.appendChild(pulse);
    this.pulses.push(pulse);

    // Remove pulse after animation
    setTimeout(() => {
      if (pulse.parentNode) {
        pulse.parentNode.removeChild(pulse);
      }
      this.pulses = this.pulses.filter(p => p !== pulse);
    }, 500 / intensity);
  }

  onBeat(callback) {
    this.beatCallbacks.push(callback);
  }

  triggerBeat(strength) {
    this.createPulse(strength);
    this.beatCallbacks.forEach(callback => callback(strength));
  }
}

/**
 * Playlist Manager
 */
class PlaylistManager {
  constructor() {
    this.tracks = [];
    this.audioElements = [];
    this.currentIndex = -1;
    this.searchTerm = '';
    this.isShuffled = false;
    this.originalOrder = [];
  }

  initialize() {
    this.tracks = Array.from(document.querySelectorAll('.track'));
    this.audioElements = this.tracks.map(track => track.querySelector('audio'));
    this.originalOrder = [...this.tracks];
  }

  play(index) {
    if (index < 0 || index >= this.audioElements.length) return false;

    // Stop current track
    this.stopAll();

    const audio = this.audioElements[index];
    audio.play();
    this.currentIndex = index;
    return true;
  }

  pause(index = this.currentIndex) {
    if (index >= 0 && this.audioElements[index]) {
      this.audioElements[index].pause();
    }
  }

  stopAll() {
    this.audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.currentIndex = -1;
  }

  next() {
    if (this.audioElements.length === 0) return;
    const nextIndex = (this.currentIndex + 1) % this.audioElements.length;
    this.play(nextIndex);
  }

  previous() {
    if (this.audioElements.length === 0) return;
    const prevIndex = this.currentIndex <= 0 ? this.audioElements.length - 1 : this.currentIndex - 1;
    this.play(prevIndex);
  }

  shuffle() {
    if (this.isShuffled) {
      // Restore original order
      this.restoreOrder();
    } else {
      // Shuffle tracks
      for (let i = this.tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
        [this.audioElements[i], this.audioElements[j]] = [this.audioElements[j], this.audioElements[i]];
      }
    }
    this.isShuffled = !this.isShuffled;
    this.updateDOM();
  }

  restoreOrder() {
    this.tracks = [...this.originalOrder];
    this.audioElements = this.tracks.map(track => track.querySelector('audio'));
  }

  updateDOM() {
    const container = this.tracks[0]?.parentNode;
    if (!container) return;

    // Clear container
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Re-add tracks in new order
    this.tracks.forEach(track => container.appendChild(track));
  }

  search(term) {
    this.searchTerm = term.toLowerCase().trim();
    let visibleCount = 0;

    this.tracks.forEach(track => {
      const title = track.dataset.title.toLowerCase();
      const isVisible = !this.searchTerm || title.includes(this.searchTerm);
      track.style.display = isVisible ? '' : 'none';
      if (isVisible) visibleCount++;
    });

    return visibleCount;
  }

  getCurrentTrack() {
    return this.currentIndex >= 0 ? this.tracks[this.currentIndex] : null;
  }

  getTrackInfo(index) {
    if (index < 0 || index >= this.tracks.length) return null;
    return {
      title: this.tracks[index].dataset.title,
      element: this.tracks[index],
      audio: this.audioElements[index]
    };
  }
}

/**
 * AI Assistant for smart recommendations
 */
class AIAssistant {
  constructor(audioEngine, equalizer, playlistManager) {
    this.audioEngine = audioEngine;
    this.equalizer = equalizer;
    this.playlistManager = playlistManager;
    this.moodProfiles = {
      energetic: { preset: 'electronic', sensitivity: 1.2, message: 'Mode Energetic: Bass boost dan beat detection tinggi!' },
      relaxed: { preset: 'jazz', sensitivity: 0.8, message: 'Mode Relaxed: EQ jazz dan sensitivitas beat rendah.' },
      focus: { preset: 'classical', sensitivity: 0.6, message: 'Mode Focus: EQ klasik untuk konsentrasi maksimal.' },
      party: { preset: 'electronic', sensitivity: 1.5, message: 'Mode Party: EQ elektronik dan beat detection maksimal!' },
      chill: { preset: 'hiphop', sensitivity: 0.9, message: 'Mode Chill: EQ hiphop dengan beat yang smooth.' }
    };
  }

  suggestMode() {
    const moods = Object.keys(this.moodProfiles);
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    const profile = this.moodProfiles[randomMood];

    this.equalizer.applyPreset(profile.preset);
    // Note: Beat detector sensitivity would be set here if available

    return profile.message;
  }

  analyzePlaylist() {
    const titles = this.playlistManager.tracks.map(t => t.dataset.title.toLowerCase());
    const words = titles.join(' ').split(/\s+/).filter(w => w.length > 2);

    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    const topWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([word]) => word);

    if (topWords.length === 0) {
      return 'Playlist masih kosong atau belum cukup data untuk analisis.';
    }

    return `Tema dominan: ${topWords.join(', ')}. Rekomendasi: Mode ${this.detectBestMode(topWords)}`;
  }

  detectBestMode(keywords) {
    const moodMap = {
      dark: 'energetic',
      chaos: 'party',
      dance: 'party',
      soul: 'relaxed',
      nature: 'chill',
      sky: 'focus',
      world: 'classical'
    };

    for (const keyword of keywords) {
      if (moodMap[keyword]) return moodMap[keyword];
    }

    return 'energetic'; // Default
  }

  getSmartRecommendation() {
    const currentTrack = this.playlistManager.getCurrentTrack();
    if (!currentTrack) return 'Mainkan lagu dulu untuk rekomendasi yang lebih akurat.';

    const title = currentTrack.dataset.title.toLowerCase();
    let recommendation = '';

    if (title.includes('dark') || title.includes('chaos')) {
      recommendation = 'Rekomendasi: Mode Electronic dengan visualizer particles untuk atmosfer intens!';
    } else if (title.includes('nature') || title.includes('soul')) {
      recommendation = 'Rekomendasi: Mode Jazz dengan visualizer circular untuk suasana tenang.';
    } else if (title.includes('dance')) {
      recommendation = 'Rekomendasi: Mode Party dengan beat detection tinggi!';
    } else {
      recommendation = 'Rekomendasi: Mode Energetic untuk pengalaman audio maksimal.';
    }

    return recommendation;
  }
}

// ====== MAIN APPLICATION CONTROLLER ======

class AudioLoungeApp {
  constructor() {
    this.audioEngine = new AudioEngine();
    this.equalizer = null;
    this.beatDetector = null;
    this.visualizer = null;
    this.pulseEffect = null;
    this.playlistManager = new PlaylistManager();
    this.aiAssistant = null;

    this.ui = {
      statusText: null,
      volumeLabel: null,
      aiMessage: null,
      visualizerCanvas: null,
      visualizerModeSelect: null
    };

    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize core systems
      await this.audioEngine.initialize();
      this.equalizer = new AdvancedEqualizer(this.audioEngine);
      this.beatDetector = new BeatDetector(this.audioEngine);

      // Initialize UI elements
      this.initializeUI();

      // Initialize managers
      this.playlistManager.initialize();
      this.aiAssistant = new AIAssistant(this.audioEngine, this.equalizer, this.playlistManager);

      // Setup visualizer
      if (this.ui.visualizerCanvas) {
        this.visualizer = new AdvancedVisualizer(this.ui.visualizerCanvas, this.audioEngine, this.beatDetector);
        this.pulseEffect = new PulseEffect(document.body);
      }

      // Setup event listeners
      this.setupEventListeners();

      // Setup beat callbacks
      this.setupBeatCallbacks();

      this.initialized = true;
      this.updateStatus('Audio Lounge siap! Klik track untuk mulai.');
      console.log('AudioLoungeApp initialized successfully');

    } catch (error) {
      console.error('Failed to initialize AudioLoungeApp:', error);
      this.updateStatus('Error: Gagal menginisialisasi sistem audio.');
    }
  }

  initializeUI() {
    this.ui.statusText = document.getElementById('status-text');
    this.ui.volumeLabel = document.getElementById('volume-label');
    this.ui.aiMessage = document.getElementById('ai-message');
    this.ui.visualizerCanvas = document.getElementById('visualizer');

    // Create visualizer mode selector if it doesn't exist
    if (!document.getElementById('visualizer-mode')) {
      const modeSelect = document.createElement('select');
      modeSelect.id = 'visualizer-mode';
      modeSelect.innerHTML = `
        <option value="bars">Bars</option>
        <option value="circular">Circular</option>
        <option value="waveform">Waveform</option>
        <option value="particles">Particles</option>
      `;
      modeSelect.style.cssText = `
        margin: 10px 0;
        padding: 5px;
        background: rgba(0,0,0,0.5);
        color: #00ffe0;
        border: 1px solid #00ffe0;
        border-radius: 5px;
      `;

      const visualizerSection = document.querySelector('#audio-control div:last-child');
      if (visualizerSection) {
        visualizerSection.insertBefore(modeSelect, this.ui.visualizerCanvas);
      }
      this.ui.visualizerModeSelect = modeSelect;
    }
  }

  setupEventListeners() {
    // Playlist controls
    this.playlistManager.tracks.forEach((track, index) => {
      track.addEventListener('dblclick', () => this.playTrack(index));
      const audio = this.playlistManager.audioElements[index];
      audio.addEventListener('play', () => this.onTrackPlay(index));
      audio.addEventListener('ended', () => this.playlistManager.next());
    });

    // Control buttons
    this.setupControlButtons();

    // Volume control
    const volumeSlider = document.getElementById('global-volume');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const value = e.target.valueAsNumber / 100;
        this.audioEngine.setMasterVolume(value);
        this.updateVolumeLabel(value);
      });
      // Set initial value
      const savedVolume = parseFloat(localStorage.getItem('globalVolume')) || 0.75;
      volumeSlider.value = Math.round(savedVolume * 100);
      this.updateVolumeLabel(savedVolume);
    }

    // Search
    const searchInput = document.getElementById('search-track');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const visibleCount = this.playlistManager.search(e.target.value);
        this.updateStatus(`Pencarian: ${visibleCount} track ditemukan.`);
      });
    }

    // Equalizer controls
    this.setupEqualizerControls();

    // Visualizer mode
    if (this.ui.visualizerModeSelect) {
      this.ui.visualizerModeSelect.addEventListener('change', (e) => {
        if (this.visualizer) {
          this.visualizer.setMode(e.target.value);
        }
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  setupControlButtons() {
    const buttons = {
      'play-all': () => {
        if (this.playlistManager.currentIndex === -1) {
          this.playTrack(0);
        } else {
          const audio = this.playlistManager.audioElements[this.playlistManager.currentIndex];
          if (audio.paused) audio.play();
        }
      },
      'pause-all': () => this.playlistManager.pause(),
      'stop-all': () => {
        this.playlistManager.stopAll();
        if (this.visualizer) this.visualizer.stop();
        this.updateStatus('Semua track dihentikan.');
      },
      'shuffle': () => {
        this.playlistManager.shuffle();
        this.updateStatus(this.playlistManager.isShuffled ? 'Playlist diacak.' : 'Playlist dikembalikan ke urutan asli.');
      },
      'next-track': () => this.playlistManager.next(),
      'prev-track': () => this.playlistManager.previous(),
      'ai-suggest': () => {
        const suggestion = this.aiAssistant.suggestMode();
        this.updateAIMessage(suggestion);
      },
      'ai-scan': () => {
        const analysis = this.aiAssistant.analyzePlaylist();
        this.updateAIMessage(analysis);
      }
    };

    Object.entries(buttons).forEach(([id, handler]) => {
      const button = document.getElementById(id);
      if (button) button.addEventListener('click', handler);
    });
  }

  setupEqualizerControls() {
    // EQ preset buttons (we'll add these to HTML)
    const eqContainer = document.getElementById('eq-controls');
    if (eqContainer && !document.getElementById('eq-presets')) {
      const presetContainer = document.createElement('div');
      presetContainer.id = 'eq-presets';
      presetContainer.innerHTML = `
        <h4>EQ Presets:</h4>
        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px;">
          ${Object.keys(this.equalizer.presets).map(preset => `
            <button class="eq-preset-btn" data-preset="${preset}" style="
              padding: 5px 10px;
              background: rgba(0,255,224,0.2);
              color: #00ffe0;
              border: 1px solid #00ffe0;
              border-radius: 5px;
              cursor: pointer;
              font-size: 0.8rem;
            ">${preset.charAt(0).toUpperCase() + preset.slice(1)}</button>
          `).join('')}
        </div>
      `;
      eqContainer.appendChild(presetContainer);

      // Add preset button listeners
      document.querySelectorAll('.eq-preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const preset = e.target.dataset.preset;
          this.equalizer.applyPreset(preset);
          this.updateStatus(`EQ Preset: ${preset}`);
          this.updateEqualizerUI();
        });
      });
    }

    // Individual band controls (simplified - just keep existing 3-band for now)
    const bassSlider = document.getElementById('bass-slider');
    const midSlider = document.getElementById('mid-slider');
    const trebleSlider = document.getElementById('treble-slider');

    if (bassSlider) bassSlider.addEventListener('input', () => this.updateEqualizerFromUI());
    if (midSlider) midSlider.addEventListener('input', () => this.updateEqualizerFromUI());
    if (trebleSlider) trebleSlider.addEventListener('input', () => this.updateEqualizerFromUI());
  }

  updateEqualizerFromUI() {
    const bass = parseFloat(document.getElementById('bass-slider')?.value || 0);
    const mid = parseFloat(document.getElementById('mid-slider')?.value || 0);
    const treble = parseFloat(document.getElementById('treble-slider')?.value || 0);

    // Map 3-band to 10-band (simplified)
    this.equalizer.setBandGain(0, bass * 0.5); // 32Hz
    this.equalizer.setBandGain(1, bass * 0.8); // 64Hz
    this.equalizer.setBandGain(2, bass); // 125Hz
    this.equalizer.setBandGain(3, bass * 0.6); // 250Hz
    this.equalizer.setBandGain(4, mid * 0.4); // 500Hz
    this.equalizer.setBandGain(5, mid); // 1kHz
    this.equalizer.setBandGain(6, mid * 0.8); // 2kHz
    this.equalizer.setBandGain(7, treble * 0.6); // 4kHz
    this.equalizer.setBandGain(8, treble); // 8kHz
    this.equalizer.setBandGain(9, treble * 0.8); // 16kHz

    this.updateEqualizerUI();
  }

  updateEqualizerUI() {
    const bassValue = document.getElementById('bass-value');
    const midValue = document.getElementById('mid-value');
    const trebleValue = document.getElementById('treble-value');

    if (bassValue) bassValue.textContent = Math.round(this.equalizer.getBandGain(2));
    if (midValue) midValue.textContent = Math.round(this.equalizer.getBandGain(5));
    if (trebleValue) trebleValue.textContent = Math.round(this.equalizer.getBandGain(8));
  }

  setupBeatCallbacks() {
    this.beatDetector.onBeat((strength) => {
      if (this.pulseEffect) {
        this.pulseEffect.triggerBeat(strength);
      }
      if (this.visualizer) {
        // Visualizer already handles beat effects internally
      }
    });
  }

  playTrack(index) {
    if (this.playlistManager.play(index)) {
      this.audioEngine.connectAudioElement(this.playlistManager.audioElements[index]);
      this.audioEngine.resume();
      if (this.visualizer) this.visualizer.start();
      const trackInfo = this.playlistManager.getTrackInfo(index);
      this.updateStatus(`🎵 Memutar: ${trackInfo.title}`);
      this.updateAIMessage(this.aiAssistant.getSmartRecommendation());
    }
  }

  onTrackPlay(index) {
    this.playlistManager.currentIndex = index;
    const trackInfo = this.playlistManager.getTrackInfo(index);
    this.updateStatus(`🎵 Sedang memutar: ${trackInfo.title}`);
    this.updateAIMessage(`AI DJ: ${trackInfo.title} dimainkan.`);
    if (this.visualizer) this.visualizer.start();
  }

  handleKeyboard(e) {
    if (e.target.tagName === 'INPUT') return; // Don't interfere with input fields

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        if (this.playlistManager.currentIndex === -1) {
          this.playTrack(0);
        } else {
          const audio = this.playlistManager.audioElements[this.playlistManager.currentIndex];
          audio.paused ? audio.play() : audio.pause();
        }
        break;
      case 'ArrowRight':
        this.playlistManager.next();
        break;
      case 'ArrowLeft':
        this.playlistManager.previous();
        break;
      case 'KeyS':
        this.playlistManager.stopAll();
        if (this.visualizer) this.visualizer.stop();
        this.updateStatus('Semua track dihentikan.');
        break;
    }
  }

  updateStatus(text) {
    if (this.ui.statusText) this.ui.statusText.textContent = text;
  }

  updateVolumeLabel(value) {
    if (this.ui.volumeLabel) this.ui.volumeLabel.textContent = `${Math.round(value * 100)}%`;
  }

  updateAIMessage(text) {
    if (this.ui.aiMessage) this.ui.aiMessage.textContent = text;
  }
}

// ====== LEGACY COMPATIBILITY FUNCTIONS ======

function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => {
    loader.style.transition = 'opacity 1.5s ease';
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 1500);
  }, 1800);
}

function initClock() {
  const clock = document.getElementById('clock');
  const clockMobile = document.getElementById('clock-mobile');
  if (!clock && !clockMobile) return;

  const update = () => {
    const time = new Date().toLocaleTimeString('id-ID', { hour12: false, timeZone: 'Asia/Jakarta' });
    if (clock) clock.textContent = time;
    if (clockMobile) clockMobile.textContent = time;
  };

  update();
  setInterval(update, 1000);
}

function initSidebar() {
  const hamburger = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('close-sidebar');

  if (!hamburger || !sidebar || !closeBtn) return;

  hamburger.addEventListener('click', () => sidebar.classList.toggle('active'));
  closeBtn.addEventListener('click', () => sidebar.classList.remove('active'));
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });
}

// ====== APPLICATION STARTUP ======

const audioLoungeApp = new AudioLoungeApp();

window.addEventListener('load', async () => {
  initLoader();
  initClock();
  initSidebar();
  await audioLoungeApp.initialize();
});
