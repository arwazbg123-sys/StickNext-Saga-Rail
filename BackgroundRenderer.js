// BackgroundRenderer.js - Modular background rendering system
// Provides multi-layered parallax background for StickNext game

class BackgroundRenderer {
  constructor(canvasContext, gameState) {
    this.ctx = canvasContext;
    this.state = gameState;
    
    // Color palette untuk variasi gunung
    this.mountainColors = {
      day: ['#7B9BC4', '#5B7BA3', '#4A5F80', '#6B8FA8', '#8BA8C4'],
      night: ['#3a4556', '#2c3e50', '#1f2937', '#4a5a7a', '#5a6a8a']
    };
    
    this.grassColors = {
      day: ['#3d7a3d', '#4a8f4a', '#2d6b2d', '#5a9a5a'],
      night: ['#1a3a1a', '#223a22', '#0d4d0d', '#2d5a2d']
    };
  }

  // Background mountains (farthest layer - parallax factor: 0.05) - dengan variasi warna dan detail
  drawBackgroundMountains(cameraX, isNight) {
    const bgMountainOffsetX = -cameraX * 0.05;
    const colorPalette = isNight ? this.mountainColors.night : this.mountainColors.day;

    // Distant mountain ranges with varying heights dan warna
    for (let i = 0; i < 8; i++) {
      const baseX = i * 300 + bgMountainOffsetX;
      const height = 0.2 + (i % 3) * 0.1;
      const peakHeight = this.state.height * height;
      
      // Pilih warna dengan variasi
      this.ctx.fillStyle = colorPalette[i % colorPalette.length];

      this.ctx.beginPath();
      this.ctx.moveTo(baseX, this.state.height * 0.8);
      this.ctx.lineTo(baseX + 150, peakHeight);
      this.ctx.lineTo(baseX + 300, this.state.height * 0.8);
      this.ctx.closePath();
      this.ctx.fill();
      
      // Tambah highlight di puncak (snow effect)
      this.ctx.fillStyle = isNight ? 'rgba(200, 220, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)';
      this.ctx.beginPath();
      this.ctx.moveTo(baseX + 150, peakHeight);
      this.ctx.lineTo(baseX + 100, peakHeight + 20);
      this.ctx.lineTo(baseX + 200, peakHeight + 20);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  // Background clouds (floating layer - parallax factor: 0.08)
  drawBackgroundClouds(cameraX, isNight) {
    if (isNight) return; // No clouds at night

    const cloudOffsetX = -cameraX * 0.08;
    this.ctx.fillStyle = 'rgba(255,255,255,0.3)';

    for (let i = 0; i < 6; i++) {
      const x = (i * 250 + cloudOffsetX + Date.now() * 0.005) % (this.state.width + 200) - 100;
      const y = 80 + (i % 3) * 30;

      // Larger, softer background clouds
      this.ctx.beginPath();
      this.ctx.arc(x, y, 35, 0, Math.PI * 2);
      this.ctx.arc(x + 40, y, 45, 0, Math.PI * 2);
      this.ctx.arc(x + 80, y, 35, 0, Math.PI * 2);
      this.ctx.arc(x + 50, y - 15, 25, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // Midground mountains (current mountains - parallax factor: 0.1) - dengan gradasi warna realistis
  drawMidgroundMountains(cameraX, isNight) {
    const mountainOffsetX = -cameraX * 0.1;
    const colorPalette = isNight ? this.mountainColors.night : this.mountainColors.day;

    // Mountain 1 - dengan variasi warna
    this.ctx.fillStyle = colorPalette[0];
    this.ctx.beginPath();
    this.ctx.moveTo(0 + mountainOffsetX, this.state.height * 0.7);
    this.ctx.lineTo(200 + mountainOffsetX, this.state.height * 0.35);
    this.ctx.lineTo(350 + mountainOffsetX, this.state.height * 0.7);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Highlight di peak mountain 1
    this.ctx.fillStyle = isNight ? 'rgba(180, 200, 230, 0.4)' : 'rgba(255, 255, 255, 0.4)';
    this.ctx.beginPath();
    this.ctx.moveTo(200 + mountainOffsetX, this.state.height * 0.35);
    this.ctx.lineTo(160 + mountainOffsetX, this.state.height * 0.5);
    this.ctx.lineTo(240 + mountainOffsetX, this.state.height * 0.5);
    this.ctx.closePath();
    this.ctx.fill();

    // Mountain 2
    this.ctx.fillStyle = colorPalette[1];
    this.ctx.beginPath();
    this.ctx.moveTo(250 + mountainOffsetX, this.state.height * 0.7);
    this.ctx.lineTo(450 + mountainOffsetX, this.state.height * 0.4);
    this.ctx.lineTo(600 + mountainOffsetX, this.state.height * 0.7);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Highlight mountain 2
    this.ctx.fillStyle = isNight ? 'rgba(200, 215, 245, 0.3)' : 'rgba(255, 255, 255, 0.35)';
    this.ctx.beginPath();
    this.ctx.moveTo(450 + mountainOffsetX, this.state.height * 0.4);
    this.ctx.lineTo(410 + mountainOffsetX, this.state.height * 0.55);
    this.ctx.lineTo(490 + mountainOffsetX, this.state.height * 0.55);
    this.ctx.closePath();
    this.ctx.fill();

    // Mountain 3
    this.ctx.fillStyle = colorPalette[2];
    this.ctx.beginPath();
    this.ctx.moveTo(480 + mountainOffsetX, this.state.height * 0.7);
    this.ctx.lineTo(650 + mountainOffsetX, this.state.height * 0.45);
    this.ctx.lineTo(800 + mountainOffsetX, this.state.height * 0.7);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Highlight mountain 3
    this.ctx.fillStyle = isNight ? 'rgba(190, 210, 240, 0.25)' : 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.moveTo(650 + mountainOffsetX, this.state.height * 0.45);
    this.ctx.lineTo(620 + mountainOffsetX, this.state.height * 0.58);
    this.ctx.lineTo(680 + mountainOffsetX, this.state.height * 0.58);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // Water pond/lake siluet - layer di bawah mountains
  drawWaterSiluette(cameraX, isNight) {
    const waterOffsetX = -cameraX * 0.12;
    const waterY = this.state.height * 0.68;
    
    this.ctx.fillStyle = isNight ? 'rgba(30, 60, 100, 0.8)' : 'rgba(100, 150, 200, 0.6)';
    
    // Pertama water body yang lebih besar
    for (let i = 0; i < 5; i++) {
      const baseX = i * 400 + waterOffsetX;
      
      this.ctx.beginPath();
      this.ctx.moveTo(baseX, waterY);
      this.ctx.bezierCurveTo(
        baseX + 50, waterY - 20,
        baseX + 150, waterY - 25,
        baseX + 200, waterY
      );
      this.ctx.lineTo(baseX + 200, waterY + 30);
      this.ctx.lineTo(baseX, waterY + 30);
      this.ctx.closePath();
      this.ctx.fill();
      
      // Ripple lines untuk efek air
      this.ctx.strokeStyle = isNight ? 'rgba(100, 150, 200, 0.3)' : 'rgba(150, 200, 255, 0.3)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.bezierCurveTo(
        baseX + 30, waterY - 8,
        baseX + 120, waterY - 10,
        baseX + 200, waterY
      );
      this.ctx.stroke();
    }
  }

  // Foreground trees (current trees - parallax factor: 0.3) - dengan variasi warna dan detail
  drawForegroundTrees(cameraX, isNight) {
    const treeOffsetX = -cameraX * 0.3;
    const treePositions = [100, 330, 520, 760, 980, 1240, 1500, 1800, 2100, 2400];

    treePositions.forEach((baseX, idx) => {
      const tx = baseX + treeOffsetX;
      const ty = this.state.height * 0.8;

      // Only draw trees that are visible on screen (performance optimization)
      if (tx > -100 && tx < this.state.width + 100) {
        // Trunk dengan variasi warna
        const trunkColors = ['#704020', '#8B5A2B', '#654321', '#7A4419'];
        this.ctx.fillStyle = trunkColors[idx % trunkColors.length];
        this.ctx.fillRect(tx, ty - 60, 16, 60);

        // Leaves dengan variasi warna yang lebih kaya
        const leafPalette = isNight 
          ? ['#1a3410', '#2d5a1a', '#0f4d0f', '#254a20']
          : ['#228B22', '#2E8B57', '#3CB371', '#4BBF72'];

        // Top leaves layer
        this.ctx.fillStyle = leafPalette[idx % leafPalette.length];
        this.ctx.beginPath();
        this.ctx.moveTo(tx - 22, ty - 40);
        this.ctx.lineTo(tx + 8, ty - 105);
        this.ctx.lineTo(tx + 38, ty - 40);
        this.ctx.closePath();
        this.ctx.fill();

        // Middle leaves layer
        this.ctx.fillStyle = leafPalette[(idx + 1) % leafPalette.length];
        this.ctx.beginPath();
        this.ctx.moveTo(tx - 18, ty - 52);
        this.ctx.lineTo(tx + 8, ty - 115);
        this.ctx.lineTo(tx + 34, ty - 52);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Bottom leaves layer untuk depth
        this.ctx.fillStyle = leafPalette[(idx + 2) % leafPalette.length];
        this.ctx.beginPath();
        this.ctx.moveTo(tx - 16, ty - 30);
        this.ctx.lineTo(tx + 8, ty - 70);
        this.ctx.lineTo(tx + 32, ty - 30);
        this.ctx.closePath();
        this.ctx.fill();
      }
    });
  }

  // Grass siluette layer - di depan semua untuk detail ground
  drawGrassLayer(cameraX, isNight) {
    const grassOffsetX = -cameraX * 0.4;
    const grassY = this.state.height * 0.82;
    const colorPalette = isNight ? this.grassColors.night : this.grassColors.day;
    
    // Main grass base
    this.ctx.fillStyle = colorPalette[0];
    this.ctx.fillRect(0, grassY, this.state.width, this.state.height - grassY);
    
    // Grass detail strokes untuk texture
    this.ctx.strokeStyle = colorPalette[1];
    this.ctx.lineWidth = 2;
    
    for (let i = 0; i < 40; i++) {
      const x = (i * 30 + grassOffsetX) % (this.state.width + 100);
      const baseHeight = 8 + Math.sin(x * 0.05) * 3;
      
      // Grass blade - menggunakan sine wave untuk natural look
      this.ctx.beginPath();
      this.ctx.moveTo(x, grassY);
      this.ctx.quadraticCurveTo(x + 3, grassY - baseHeight * 0.5, x + 2, grassY - baseHeight);
      this.ctx.stroke();
      
      this.ctx.beginPath();
      this.ctx.moveTo(x + 5, grassY);
      this.ctx.quadraticCurveTo(x + 7, grassY - baseHeight * 0.6, x + 6, grassY - baseHeight - 1);
      this.ctx.stroke();
    }
    
    // Rocks and pebbles untuk detail
    this.ctx.fillStyle = isNight ? 'rgba(80, 80, 100, 0.6)' : 'rgba(140, 120, 100, 0.5)';
    for (let i = 0; i < 15; i++) {
      const x = (i * 60 + grassOffsetX + 20) % (this.state.width + 100);
      const size = 3 + (i % 3) * 2;
      this.ctx.beginPath();
      this.ctx.arc(x, grassY + 2, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // Main render method - draws all background layers in correct order
  drawAll(cameraX, isNight) {
    this.drawBackgroundMountains(cameraX, isNight);
    this.drawBackgroundClouds(cameraX, isNight);
    this.drawWaterSiluette(cameraX, isNight);
    this.drawMidgroundMountains(cameraX, isNight);
    this.drawForegroundTrees(cameraX, isNight);
    this.drawGrassLayer(cameraX, isNight);
  }

  // Utility method to add more background elements dynamically
  addBackgroundElement(type, x, y, properties = {}) {
    // Future extension for dynamic background elements
    console.log(`Adding ${type} background element at (${x}, ${y})`);
  }
}

// Export for use in main game file
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BackgroundRenderer;
}