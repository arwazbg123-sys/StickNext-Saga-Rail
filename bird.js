// ============================================
// BIRD.JS - Modular Flying Birds System
// Sistem modular untuk burung-burung di langit
// ============================================

/**
 * Individual Bird Class
 * Merepresentasikan satu burung dengan animasi dan fisika
 */
class Bird {
  constructor(x, y, vx, options = {}) {
    this.x = x;
    this.y = y;
    this.vx = vx; // Velocity X (kecepatan pergerakan)
    
    // Default options
    this.size = options.size || Math.random() * 2 + 1.5; // Lebih besar: 1.5-3.5 px
    this.type = options.type || (Math.random() > 0.5 ? 'small' : 'large');
    this.wingFlap = options.wingFlap || Math.random() * Math.PI * 2;
    this.wingSpeed = options.wingSpeed || (Math.random() * 0.2 + 0.1); // Kecepatan sayap
    this.bobAmount = options.bobAmount || 0; // Animasi naik-turun
    this.bobSpeed = options.bobSpeed || 0.02;
    
    // World size untuk wrapping
    this.worldWidth = options.worldWidth || 25000;
    this.screenWidth = options.screenWidth || 800;
    this.parallaxFactor = options.parallaxFactor || 0.15;
  }

  /**
   * Update posisi dan animasi burung
   * @param {number} deltaTime - Waktu dalam milisekon
   */
  update(deltaTime = 1) {
    // Update posisi horizontal (sangat lambat)
    this.x += this.vx * 0.001;
    
    // Wrap around di batas dunia
    if (this.x > this.worldWidth) {
      this.x = -100; // Muncul dari kiri dengan buffer
    } else if (this.x < -100) {
      this.x = this.worldWidth;
    }
    
    // Update animasi sayap
    this.wingFlap += this.wingSpeed * deltaTime;
    
    // Update animasi naik-turun (bobbing)
    this.bobAmount = Math.sin(this.wingFlap * 0.5) * 2; // Subtle vertical movement
  }

  /**
   * Dapatkan posisi screen dengan parallax
   * @param {number} cameraX - Posisi camera X
   * @param {number} cameraY - Posisi camera Y
   * @returns {Object} {screenX, screenY}
   */
  getScreenPosition(cameraX, cameraY) {
    const screenX = this.x - cameraX * this.parallaxFactor;
    const screenY = this.y - cameraY * 0.05 + this.bobAmount; // Slight Y parallax + bob
    
    return { screenX, screenY };
  }

  /**
   * Render burung ke canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} screenX - Posisi X di screen
   * @param {number} screenY - Posisi Y di screen
   * @param {string} color - Warna burung
   */
  draw(ctx, screenX, screenY, color = '#555555') {
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    
    // Draw bird body
    const bodySize = Math.max(2, this.size); // Minimal ukuran 2px
    const wingSpan = bodySize * 3;
    
    // Body - ellipse untuk bentuk tubuh alami
    ctx.beginPath();
    ctx.ellipse(screenX, screenY, bodySize, bodySize * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Head
    ctx.beginPath();
    ctx.arc(screenX + bodySize * 0.6, screenY - bodySize * 0.3, bodySize * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Wings (flapping animation)
    const flapAmount = Math.sin(this.wingFlap) * 0.3;
    const wingAngle1 = -0.3 + flapAmount;
    const wingAngle2 = 0.3 - flapAmount;
    
    // Left wing
    ctx.save();
    ctx.translate(screenX - bodySize * 0.3, screenY);
    ctx.rotate(wingAngle1);
    ctx.fillRect(0, -bodySize * 0.3, wingSpan * 0.5, bodySize * 0.6);
    ctx.stroke();
    ctx.restore();
    
    // Right wing
    ctx.save();
    ctx.translate(screenX + bodySize * 0.3, screenY);
    ctx.rotate(wingAngle2);
    ctx.fillRect(-wingSpan * 0.5, -bodySize * 0.3, wingSpan * 0.5, bodySize * 0.6);
    ctx.stroke();
    ctx.restore();
    
    ctx.restore();
  }

  /**
   * Check apakah burung visible di screen
   * @param {number} screenX - Posisi X di screen
   * @param {number} screenY - Posisi Y di screen
   * @param {number} canvasWidth - Lebar canvas
   * @param {number} canvasHeight - Tinggi canvas
   * @returns {boolean}
   */
  isVisible(screenX, screenY, canvasWidth, canvasHeight) {
    const buffer = 100;
    return !(screenX < -buffer || screenX > canvasWidth + buffer ||
             screenY < -buffer || screenY > canvasHeight + buffer);
  }
}

/**
 * Bird Flock Class
 * Mengelola kumpulan burung dengan rendering dan update
 */
class BirdFlock {
  constructor(options = {}) {
    this.birds = [];
    this.worldWidth = options.worldWidth || 25000;
    this.screenWidth = options.screenWidth || 800;
    this.screenHeight = options.screenHeight || 400;
    this.parallaxFactor = options.parallaxFactor || 0.15;
    this.birdCount = options.birdCount || 8;
    this.maxBirds = options.maxBirds || 12;
    
    // Inisialize flock
    this.createFlock();
    
    console.log(`[BIRD] Flock initialized dengan ${this.birds.length} burung`);
    if (this.birds.length > 0) {
      console.log(`[BIRD] Screen: ${this.screenWidth}x${this.screenHeight}, Parallax: ${this.parallaxFactor}`);
      console.log(`[BIRD] World width: ${this.worldWidth}`);
      console.log(`[BIRD] Burung spawn positions:`);
      this.birds.forEach((b, i) => {
        console.log(`  Bird ${i+1}: x=${Math.round(b.x)} y=${Math.round(b.y)} vx=${b.vx.toFixed(1)} size=${b.size.toFixed(1)}`);
      });
    }
  }

  /**
   * Buat flock awal
   */
  createFlock() {
    this.birds = [];
    for (let i = 0; i < this.birdCount; i++) {
      // Spawn dalam area yang terlihat (0 ke worldWidth)
      // Dengan parallax, mereka akan tersebar di screen dari start
      const x = (i * (this.worldWidth / this.birdCount)) + Math.random() * 1000;
      const y = Math.random() * 100 + 50;
      const vx = Math.random() * 50 + 30;
      
      this.birds.push(new Bird(x, y, vx, {
        worldWidth: this.worldWidth,
        screenWidth: this.screenWidth,
        parallaxFactor: this.parallaxFactor
      }));
    }
  }

  /**
   * Tambah satu burung ke flock
   * @param {Object} options - Opsi custom untuk burung
   */
  addBird(options = {}) {
    if (this.birds.length >= this.maxBirds) return;
    
    const x = options.x !== undefined ? options.x : Math.random() * this.worldWidth;
    // Y position: 50-150 di world coords (sky area, visible di screen)
    const y = options.y !== undefined ? options.y : Math.random() * 100 + 50;
    const vx = options.vx !== undefined ? options.vx : Math.random() * 50 + 30;
    
    const bird = new Bird(x, y, vx, {
      size: options.size,
      type: options.type,
      worldWidth: this.worldWidth,
      screenWidth: this.screenWidth,
      parallaxFactor: this.parallaxFactor
    });
    
    this.birds.push(bird);
  }

  /**
   * Update semua burung
   * @param {number} deltaTime - Waktu dalam milisekon
   */
  update(deltaTime = 1) {
    this.birds.forEach(bird => {
      bird.update(deltaTime);
    });
  }

  /**
   * Render semua burung
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} cameraX - Posisi camera X
   * @param {number} cameraY - Posisi camera Y
   * @param {boolean} isNight - Apakah malam hari
   */
  render(ctx, cameraX, cameraY, isNight = false) {
    if (this.birds.length === 0) return;
    
    const birdColor = isNight ? '#333333' : '#555555';
    const alpha = isNight ? 0.5 : 0.8;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    
    let visibleCount = 0;
    
    this.birds.forEach((bird, idx) => {
      const { screenX, screenY } = bird.getScreenPosition(cameraX, cameraY);
      
      // Only render if visible
      if (bird.isVisible(screenX, screenY, this.screenWidth, this.screenHeight)) {
        bird.draw(ctx, screenX, screenY, birdColor);
        visibleCount++;
        
        // Visual debug marker untuk visible birds
        if (window.debugBirds && window.debugBirds === 'visual') {
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#00FF00';
          ctx.beginPath();
          ctx.arc(screenX + 3, screenY - 5, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = alpha;
        }
      }
    });
    
    ctx.restore();
    
    // Show on-screen bird count at top-left
    if (window.debugBirds) {
      ctx.save();
      ctx.fillStyle = '#FFFF00';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`Birds: ${visibleCount}/${this.birds.length}`, 10, 20);
      ctx.restore();
    }
  }

  /**
   * Dapatkan informasi flock untuk debug
   */
  getInfo() {
    return {
      count: this.birds.length,
      positions: this.birds.map(b => ({ x: b.x, y: b.y }))
    };
  }
}

// Export untuk digunakan
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Bird, BirdFlock };
}
