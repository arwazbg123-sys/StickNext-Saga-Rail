/**
 * ═════════════════════════════════════════════════════════════════════════════════
 * DESERT ENVIRONMENT SYSTEM - Modular desert world rendering
 * Features: Sandy terrain, desert mountains, cacti, eternal daylight
 * ═════════════════════════════════════════════════════════════════════════════════
 */

class DesertEnvironment {
  constructor(ctx, state) {
    this.ctx = ctx;
    this.state = state;
    
    // Desert-specific colors
    this.colors = {
      sky: '#F4A460',        // Orange-tan sky
      skyLower: '#FFB84D',   // More orange lower
      sand: '#DEB887',       // Sandy brown ground
      sandDark: '#C19A6B',   // Darker sand for variation
      mountain: '#A0826D',   // Mountain color
      mountainDark: '#7A6852', // Dark mountain
      cactus: '#228B22',     // Green cactus
      cactusSpine: '#FFD700'  // Golden spines
    };
    
    // Terrain configuration
    this.mountainRange = this.generateMountainRange();
    this.cacti = this.generateCacti();
    this.dunes = this.generateDunes();
  }

  /**
   * Generate desert mountain range
   */
  generateMountainRange() {
    const mountains = [];
    
    // Create 5 large mountains across the map
    for (let i = 0; i < 5; i++) {
      mountains.push({
        x: i * (this.state.levelWidth / 5),
        width: this.state.levelWidth / 4,
        height: 400 + Math.random() * 200,
        peakOffset: Math.random() * this.state.levelWidth / 10,
        depth: 0.05 + (i * 0.02) // Parallax depth
      });
    }
    
    return mountains;
  }

  /**
   * Generate cacti positions
   */
  generateCacti() {
    const cacti = [];
    const cactusCount = 25;
    
    for (let i = 0; i < cactusCount; i++) {
      cacti.push({
        x: Math.random() * this.state.levelWidth,
        type: Math.random() > 0.7 ? 'tall' : 'short',
        scale: 0.5 + Math.random() * 0.8,
        variance: Math.random() // For visual variation
      });
    }
    
    return cacti;
  }

  /**
   * Generate sand dunes for visual interest
   */
  generateDunes() {
    const dunes = [];
    const duneCount = 15;
    
    for (let i = 0; i < duneCount; i++) {
      dunes.push({
        x: Math.random() * this.state.levelWidth,
        width: 200 + Math.random() * 300,
        height: 80 + Math.random() * 120,
        curvature: 0.3 + Math.random() * 0.4
      });
    }
    
    return dunes;
  }

  /**
   * Draw complete desert environment
   */
  drawAll(cameraX, cameraY) {
    // Always daytime in desert
    this.drawSky();
    this.drawMountains(cameraX, cameraY);
    this.drawDunes(cameraX, cameraY);
    this.drawGround(cameraX, cameraY);
    this.drawCacti(cameraX, cameraY);
    this.drawSunHaze();
  }

  /**
   * Draw eternal daylight sky
   */
  drawSky() {
    // Gradient sky - orange at bottom to lighter at top
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.state.height);
    gradient.addColorStop(0, '#FFD699');    // Top - light orange
    gradient.addColorStop(0.7, '#F4A460');   // Middle - main desert color
    gradient.addColorStop(1, '#FFB84D');     // Bottom - warmer orange
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.state.width, this.state.height);
  }

  /**
   * Draw background mountains with parallax
   */
  drawMountains(cameraX, cameraY) {
    this.mountainRange.forEach((mountain, idx) => {
      // Apply parallax - distant mountains move slower
      const screenX = mountain.x - cameraX * mountain.depth;
      const screenWidth = mountain.width;
      const screenHeight = mountain.height;
      
      // Skip if completely off-screen
      if (screenX + screenWidth < -500 || screenX > this.state.width + 500) {
        return;
      }
      
      // Main mountain silhouette
      this.ctx.save();
      
      // Mountain shape - triangle-like
      this.ctx.fillStyle = this.colors.mountain;
      this.ctx.beginPath();
      
      // Left slope
      this.ctx.moveTo(screenX, this.state.height - 100);
      
      // Peak with variation
      const peakX = screenX + mountain.peakOffset + screenWidth / 2;
      const peakY = this.state.height - 100 - screenHeight;
      this.ctx.lineTo(peakX, peakY);
      
      // Right slope
      this.ctx.lineTo(screenX + screenWidth, this.state.height - 100);
      
      // Extend to bottom
      this.ctx.lineTo(screenX + screenWidth, this.state.height);
      this.ctx.lineTo(screenX, this.state.height);
      this.ctx.closePath();
      this.ctx.fill();
      
      // Mountain shading/detail
      this.ctx.fillStyle = this.colors.mountainDark;
      this.ctx.globalAlpha = 0.3;
      
      // Right side shadow
      this.ctx.beginPath();
      this.ctx.moveTo(peakX, peakY);
      this.ctx.lineTo(screenX + screenWidth, this.state.height - 100);
      this.ctx.lineTo(screenX + screenWidth, this.state.height);
      this.ctx.lineTo(peakX, this.state.height);
      this.ctx.closePath();
      this.ctx.fill();
      
      // Mountain texture lines (crevices)
      this.ctx.globalAlpha = 0.15;
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const lineX = screenX + (screenWidth / 5) * (i + 1);
        const startY = this.state.height - 100;
        const endY = peakY + (startY - peakY) * (1 - (i % 3) * 0.3);
        
        this.ctx.beginPath();
        this.ctx.moveTo(lineX, startY);
        this.ctx.lineTo(lineX + 20, endY);
        this.ctx.stroke();
      }
      
      this.ctx.restore();
    });
  }

  /**
   * Draw sand dunes for foreground interest
   */
  drawDunes(cameraX, cameraY) {
    this.dunes.forEach(dune => {
      const screenX = dune.x - cameraX * 0.1; // Slight parallax
      const screenY = this.state.height - 100;
      
      // Skip if off-screen
      if (screenX + dune.width < -100 || screenX > this.state.width + 100) {
        return;
      }
      
      this.ctx.save();
      
      // Dune sandy color (slightly lighter variation)
      this.ctx.fillStyle = this.colors.sand;
      this.ctx.globalAlpha = 0.4;
      
      // Curved dune shape
      this.ctx.beginPath();
      this.ctx.moveTo(screenX, screenY);
      
      // Top curve of dune
      for (let i = 0; i <= 100; i++) {
        const progress = i / 100;
        const x = screenX + progress * dune.width;
        const y = screenY - Math.sin(progress * Math.PI) * dune.height * dune.curvature;
        this.ctx.lineTo(x, y);
      }
      
      this.ctx.lineTo(screenX + dune.width, screenY);
      this.ctx.closePath();
      this.ctx.fill();
      
      // Dune shadow (underside)
      this.ctx.globalAlpha = 0.2;
      this.ctx.fillStyle = this.colors.sandDark;
      this.ctx.beginPath();
      this.ctx.moveTo(screenX, screenY);
      
      for (let i = 0; i <= 100; i++) {
        const progress = i / 100;
        const x = screenX + progress * dune.width;
        const y = screenY - Math.sin(progress * Math.PI) * dune.height * dune.curvature;
        this.ctx.lineTo(x, y);
      }
      
      this.ctx.lineTo(screenX, screenY);
      this.ctx.closePath();
      this.ctx.fill();
      
      this.ctx.restore();
    });
  }

  /**
   * Draw sandy ground
   */
  drawGround(cameraX, cameraY) {
    const groundHeight = 100;
    const groundY = this.state.height - groundHeight;
    
    // Main sand color
    this.ctx.fillStyle = this.colors.sand;
    this.ctx.fillRect(0, groundY, this.state.width, groundHeight);
    
    // Ground variation - sandy patterns
    this.ctx.save();
    this.ctx.globalAlpha = 0.15;
    
    // Random sand ripple patterns
    for (let i = 0; i < 5; i++) {
      const waveY = groundY + (i * groundHeight / 5);
      this.ctx.fillStyle = i % 2 === 0 ? this.colors.sand : this.colors.sandDark;
      this.ctx.fillRect(0, waveY, this.state.width, groundHeight / 5);
    }
    
    // Sand grain texture (subtle)
    this.ctx.globalAlpha = 0.08;
    this.ctx.fillStyle = '#000000';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * this.state.width;
      const y = groundY + Math.random() * groundHeight;
      this.ctx.fillRect(x, y, 2, 1);
    }
    
    this.ctx.restore();
  }

  /**
   * Draw desert cacti
   */
  drawCacti(cameraX, cameraY) {
    this.cacti.forEach(cactus => {
      const screenX = cactus.x - cameraX * 0.2; // Slight parallax
      const terrainY = getGroundHeightAtX(cactus.x, this.state.levelHeight) + 50; // Desert ground level
      const screenY = terrainY - cameraY;
      
      // Skip if off-screen
      if (screenX < -100 || screenX > this.state.width + 100) {
        return;
      }
      
      if (cactus.type === 'tall') {
        this.drawTallCactus(screenX, screenY, cactus.scale, cactus.variance);
      } else {
        this.drawShortCactus(screenX, screenY, cactus.scale, cactus.variance);
      }
    });
  }

  /**
   * Draw tall saguaro-style cactus
   */
  drawTallCactus(screenX, screenY, scale, variance) {
    this.ctx.save();
    
    const height = 120 * scale;
    const width = 30 * scale;
    
    // Main stem
    this.ctx.fillStyle = this.colors.cactus;
    this.ctx.fillRect(screenX - width / 2, screenY - height, width, height);
    
    // Cactus ridges (vertical lines)
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(screenX - width / 2 + (i + 1) * width / 4, screenY - height);
      this.ctx.lineTo(screenX - width / 2 + (i + 1) * width / 4, screenY);
      this.ctx.stroke();
    }
    
    // Left arm
    const armScale = 0.6 * scale;
    const armHeight = height * armScale;
    const armY = screenY - height * 0.5;
    
    this.ctx.fillStyle = this.colors.cactus;
    this.ctx.beginPath();
    this.ctx.moveTo(screenX - width / 2, armY);
    this.ctx.quadraticCurveTo(
      screenX - width * 0.8,
      armY - armHeight * 0.3,
      screenX - width,
      armY - armHeight * 0.6
    );
    this.ctx.lineTo(screenX - width, armY - armHeight * 0.6 + 20);
    this.ctx.quadraticCurveTo(
      screenX - width * 0.8,
      armY - armHeight * 0.3 + 20,
      screenX - width / 2,
      armY + 20
    );
    this.ctx.closePath();
    this.ctx.fill();
    
    // Right arm
    const rightArmY = screenY - height * 0.3;
    this.ctx.beginPath();
    this.ctx.moveTo(screenX + width / 2, rightArmY);
    this.ctx.quadraticCurveTo(
      screenX + width * 0.8,
      rightArmY - armHeight * 0.5,
      screenX + width,
      rightArmY - armHeight * 0.8
    );
    this.ctx.lineTo(screenX + width, rightArmY - armHeight * 0.8 + 20);
    this.ctx.quadraticCurveTo(
      screenX + width * 0.8,
      rightArmY - armHeight * 0.5 + 20,
      screenX + width / 2,
      rightArmY + 20
    );
    this.ctx.closePath();
    this.ctx.fill();
    
    // Spines
    this.ctx.strokeStyle = this.colors.cactusSpine;
    this.ctx.lineWidth = 1.5;
    this.ctx.globalAlpha = 0.7;
    for (let i = 0; i < 8; i++) {
      const spineX = screenX - width / 2 + Math.random() * width;
      const spineY = screenY - Math.random() * height;
      const spineAngle = Math.random() * Math.PI * 2;
      const spineLength = 8 * scale;
      
      this.ctx.beginPath();
      this.ctx.moveTo(spineX, spineY);
      this.ctx.lineTo(
        spineX + Math.cos(spineAngle) * spineLength,
        spineY + Math.sin(spineAngle) * spineLength
      );
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  /**
   * Draw short barrel cactus
   */
  drawShortCactus(screenX, screenY, scale, variance) {
    this.ctx.save();
    
    const radius = 25 * scale;
    
    // Barrel shape
    this.ctx.fillStyle = this.colors.cactus;
    this.ctx.beginPath();
    this.ctx.ellipse(screenX, screenY - radius, radius, radius * 0.8, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Cactus segments (horizontal lines)
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const y = screenY - radius * (1 - (i / 5) * 1.6);
      const segmentWidth = radius * 2 * Math.sqrt(1 - Math.pow((i / 5) * 1.6 - 1, 2));
      
      this.ctx.beginPath();
      this.ctx.moveTo(screenX - segmentWidth / 2, y);
      this.ctx.lineTo(screenX + segmentWidth / 2, y);
      this.ctx.stroke();
    }
    
    // Spines on barrel
    this.ctx.strokeStyle = this.colors.cactusSpine;
    this.ctx.lineWidth = 1.5;
    this.ctx.globalAlpha = 0.6;
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const x = screenX + Math.cos(angle) * radius;
      const y = screenY - radius * 0.8 + Math.sin(angle) * radius * 0.8;
      const spineLength = 6 * scale;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(
        x + Math.cos(angle) * spineLength,
        y + Math.sin(angle) * spineLength
      );
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  /**
   * Draw sun haze effect (heat shimmer)
   */
  drawSunHaze() {
    this.ctx.save();
    
    // Sun position (upper right)
    const sunX = this.state.width * 0.8;
    const sunY = this.state.height * 0.2;
    
    // Large sun glow
    const gradient = this.ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 150);
    gradient.addColorStop(0, 'rgba(255, 200, 0, 0.3)');
    gradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.state.width, this.state.height);
    
    // Heat shimmer waves
    this.ctx.globalAlpha = 0.1;
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 1;
    
    const time = performance.now() / 1000;
    for (let i = 0; i < 3; i++) {
      const waveY = this.state.height * 0.5 + Math.sin(time * 2 + i) * 30;
      
      this.ctx.beginPath();
      for (let x = 0; x < this.state.width; x += 20) {
        const y = waveY + Math.sin(x * 0.01 + time * 3) * 10;
        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
}

// Export for use in game.js
if (typeof window !== 'undefined') {
  window.DesertEnvironment = DesertEnvironment;
}
