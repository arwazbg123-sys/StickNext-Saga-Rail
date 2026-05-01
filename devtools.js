/**
 * ═════════════════════════════════════════════════════════════════════════════════
 * DEVELOPER TOOLS - Rapid exploration & testing utilities
 * Features: Teleport, GOD mode, stats, teleport shortcuts, cheats
 * ═════════════════════════════════════════════════════════════════════════════════
 */

class DeveloperTools {
  constructor(ctx, state) {
    this.ctx = ctx;
    this.state = state;
    
    // DevTools state
    this.enabled = false;
    this.visible = false;
    this.godMode = false;
    this.noClip = false;
    this.speedMultiplier = 1.0;
    this.showHitboxes = false;
    this.showCoordinates = false;
    this.showTerrainInfo = false;
    
    // UI Panel dimensions
    this.panelX = 10;
    this.panelY = 60;
    this.panelWidth = 350;
    this.panelHeight = 400;
    
    // Teleport hotspots
    this.teleportPoints = {
      'world_start': { x: 100, y: 2800, dimension: 'world', label: 'World Start' },
      'world_mid': { x: 12500, y: 2800, dimension: 'world', label: 'World Mid' },
      'world_desert_portal': { x: 24500, y: 2800, dimension: 'world', label: 'Desert Portal' },
      'desert_start': { x: 100, y: 2800, dimension: 'desert', label: 'Desert Start' },
      'desert_mid': { x: 12500, y: 2800, dimension: 'desert', label: 'Desert Mid' },
      'mountain_start': { x: 100, y: 2800, dimension: 'mountain', label: 'Mountain Start' },
      'mountain_mid': { x: 12500, y: 2800, dimension: 'mountain', label: 'Mountain Mid' }
    };
    
    this.init();
  }

  /**
   * Initialize devtools - setup keyboard shortcuts
   */
  init() {
    // Register keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Toggle DevTools with Ctrl+D
      if (e.ctrlKey && e.code === 'KeyD') {
        e.preventDefault();
        this.toggle();
      }
      
      // Quick teleports with number keys
      if (this.enabled) {
        if (e.code === 'Digit1') this.teleportTo('world_start');
        if (e.code === 'Digit2') this.teleportTo('world_mid');
        if (e.code === 'Digit3') this.teleportTo('world_desert_portal');
        if (e.code === 'Digit4') this.teleportTo('desert_start');
        if (e.code === 'Digit5') this.teleportTo('desert_mid');
        if (e.code === 'Digit6') this.teleportTo('mountain_start');
        if (e.code === 'Digit7') this.teleportTo('mountain_mid');
        
        // Toggle GOD mode with G
        if (e.code === 'KeyG') {
          this.godMode = !this.godMode;
          console.log(`[DEV] GOD MODE: ${this.godMode ? 'ON' : 'OFF'}`);
        }
        
        // Show hitboxes with H
        if (e.code === 'KeyH') {
          this.showHitboxes = !this.showHitboxes;
          console.log(`[DEV] HITBOXES: ${this.showHitboxes ? 'ON' : 'OFF'}`);
        }
        
        // Show coordinates with C
        if (e.code === 'KeyC') {
          this.showCoordinates = !this.showCoordinates;
          console.log(`[DEV] COORDINATES: ${this.showCoordinates ? 'ON' : 'OFF'}`);
        }
        
        // Show terrain info with T
        if (e.code === 'KeyT') {
          this.showTerrainInfo = !this.showTerrainInfo;
          console.log(`[DEV] TERRAIN INFO: ${this.showTerrainInfo ? 'ON' : 'OFF'}`);
        }
        
        // Speed boost with + / -
        if (e.code === 'Equal') {
          this.speedMultiplier = Math.min(3.0, this.speedMultiplier + 0.5);
          console.log(`[DEV] SPEED: ${this.speedMultiplier.toFixed(1)}x`);
        }
        if (e.code === 'Minus') {
          this.speedMultiplier = Math.max(0.5, this.speedMultiplier - 0.5);
          console.log(`[DEV] SPEED: ${this.speedMultiplier.toFixed(1)}x`);
        }
      }
    });
  }

  /**
   * Toggle devtools visibility
   */
  toggle() {
    this.enabled = !this.enabled;
    this.visible = this.enabled;
    console.log(`[DEV] Developer Tools ${this.enabled ? 'ENABLED' : 'DISABLED'}`);
    console.log('[DEV] Shortcuts:');
    console.log('  1-7: Teleport to locations');
    console.log('  G: Toggle GOD mode (infinite lives)');
    console.log('  H: Toggle hitboxes');
    console.log('  C: Toggle coordinates');
    console.log('  T: Toggle terrain info');
    console.log('  +/-: Speed multiplier');
    console.log('  Ctrl+D: Toggle this panel');
  }

  /**
   * Teleport player to location
   */
  teleportTo(pointKey) {
    if (!this.teleportPoints[pointKey]) return;
    
    const point = this.teleportPoints[pointKey];
    
    // Update player position
    if (window.player) {
      window.player.x = point.x;
      window.player.y = point.y;
    }
    
    // Update dimension
    if (window.portalSystem) {
      window.portalSystem.currentDimension = point.dimension;
    }
    
    console.log(`[DEV] Teleported to: ${point.label} (${point.x}, ${point.y}) - ${point.dimension}`);
  }

  /**
   * Apply GOD mode protection
   */
  applyGodMode(state) {
    if (this.godMode) {
      state.lives = 999;
    }
  }

  /**
   * Apply speed multiplier
   */
  getSpeedMultiplier() {
    return this.speedMultiplier;
  }

  /**
   * Draw DevTools UI Panel
   */
  drawPanel() {
    if (!this.visible) return;
    
    this.ctx.save();
    
    // Panel background
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    this.ctx.fillRect(this.panelX, this.panelY, this.panelWidth, this.panelHeight);
    
    // Panel border
    this.ctx.strokeStyle = '#00FF00';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.panelX, this.panelY, this.panelWidth, this.panelHeight);
    
    // Title
    this.ctx.fillStyle = '#00FF00';
    this.ctx.font = 'bold 14px monospace';
    this.ctx.fillText('═ DEVELOPER TOOLS ═', this.panelX + 10, this.panelY + 20);
    
    let y = this.panelY + 40;
    const lineHeight = 18;
    
    // Teleport section
    this.ctx.fillStyle = '#FFFF00';
    this.ctx.font = 'bold 12px monospace';
    this.ctx.fillText('TELEPORT (1-7):', this.panelX + 10, y);
    y += lineHeight;
    
    this.ctx.fillStyle = '#00FF00';
    this.ctx.font = '11px monospace';
    
    const teleportLabels = [
      '1: World Start',
      '2: World Mid',
      '3: Desert Portal',
      '4: Desert Start',
      '5: Desert Mid',
      '6: Mountain',
      '7: Mountain Mid'
    ];
    
    teleportLabels.forEach(label => {
      this.ctx.fillText(label, this.panelX + 20, y);
      y += lineHeight - 4;
    });
    
    y += 5;
    
    // Toggles section
    this.ctx.fillStyle = '#FFFF00';
    this.ctx.font = 'bold 12px monospace';
    this.ctx.fillText('TOGGLES:', this.panelX + 10, y);
    y += lineHeight;
    
    this.ctx.fillStyle = '#00FF00';
    this.ctx.font = '11px monospace';
    
    const toggles = [
      `G: GOD Mode ${this.godMode ? '[ON]' : '[OFF]'}`,
      `H: Hitboxes ${this.showHitboxes ? '[ON]' : '[OFF]'}`,
      `C: Coords ${this.showCoordinates ? '[ON]' : '[OFF]'}`,
      `T: Terrain ${this.showTerrainInfo ? '[ON]' : '[OFF]'}`,
      `+/-: Speed ${this.speedMultiplier.toFixed(1)}x`
    ];
    
    toggles.forEach(toggle => {
      this.ctx.fillText(toggle, this.panelX + 20, y);
      y += lineHeight - 4;
    });
    
    y += 5;
    
    // Info section
    this.ctx.fillStyle = '#FFFF00';
    this.ctx.font = 'bold 12px monospace';
    this.ctx.fillText('INFO:', this.panelX + 10, y);
    y += lineHeight;
    
    this.ctx.fillStyle = '#00FFFF';
    this.ctx.font = '10px monospace';
    
    if (window.player) {
      this.ctx.fillText(`Pos: (${Math.floor(window.player.x)}, ${Math.floor(window.player.y)})`, this.panelX + 20, y);
      y += lineHeight - 4;
    }
    
    if (window.portalSystem) {
      this.ctx.fillText(`Dimension: ${window.portalSystem.currentDimension.toUpperCase()}`, this.panelX + 20, y);
      y += lineHeight - 4;
    }
    
    if (this.state) {
      this.ctx.fillText(`Lives: ${this.state.lives}`, this.panelX + 20, y);
      y += lineHeight - 4;
      this.ctx.fillText(`Score: ${Math.floor(this.state.score)}`, this.panelX + 20, y);
      y += lineHeight - 4;
    }
    
    // Help text
    y = this.panelY + this.panelHeight - 25;
    this.ctx.fillStyle = '#888888';
    this.ctx.font = '10px monospace';
    this.ctx.fillText('Ctrl+D: Hide Panel', this.panelX + 10, y);
    
    this.ctx.restore();
  }

  /**
   * Draw coordinates on screen
   */
  drawCoordinates(player, cameraX, cameraY) {
    if (!this.showCoordinates) return;
    
    this.ctx.save();
    this.ctx.fillStyle = '#00FF00';
    this.ctx.font = 'bold 12px monospace';
    
    const screenX = player.x - cameraX;
    const screenY = player.y - cameraY;
    
    this.ctx.fillText(`WORLD: (${Math.floor(player.x)}, ${Math.floor(player.y)})`, 10, this.state.height - 40);
    this.ctx.fillText(`SCREEN: (${Math.floor(screenX)}, ${Math.floor(screenY)})`, 10, this.state.height - 20);
    
    this.ctx.restore();
  }

  /**
   * Draw hitboxes for debugging
   */
  drawHitboxes(player, cameraX, cameraY) {
    if (!this.showHitboxes) return;
    
    this.ctx.save();
    
    // Player hitbox
    this.ctx.strokeStyle = '#00FF00';
    this.ctx.lineWidth = 2;
    
    const screenX = player.x - cameraX;
    const screenY = player.y - cameraY;
    
    this.ctx.strokeRect(
      screenX - player.w / 2,
      screenY - player.h,
      player.w,
      player.h
    );
    
    // Center point
    this.ctx.fillStyle = '#00FF00';
    this.ctx.beginPath();
    this.ctx.arc(screenX, screenY, 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Velocity indicator
    if (player.vx !== 0 || player.vy !== 0) {
      this.ctx.strokeStyle = '#FF0000';
      this.ctx.beginPath();
      this.ctx.moveTo(screenX, screenY);
      this.ctx.lineTo(screenX + player.vx * 5, screenY + player.vy * 5);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  /**
   * Draw terrain info
   */
  drawTerrainInfo(player, cameraX, cameraY) {
    if (!this.showTerrainInfo) return;
    
    this.ctx.save();
    this.ctx.fillStyle = '#FFFF00';
    this.ctx.font = '11px monospace';
    
    if (typeof getGroundHeightAtX !== 'undefined') {
      const groundHeight = getGroundHeightAtX(player.x, this.state.levelHeight);
      const distanceToGround = groundHeight - player.y;
      
      this.ctx.fillText(`Ground: ${Math.floor(groundHeight)}px`, 10, this.state.height - 60);
      this.ctx.fillText(`Distance: ${Math.floor(distanceToGround)}px`, 10, this.state.height - 40);
    }
    
    this.ctx.restore();
  }

  /**
   * Draw grid overlay for level design
   */
  drawGrid(cameraX, cameraY) {
    if (!this.visible) return;
    
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
    this.ctx.lineWidth = 1;
    
    const gridSize = 100;
    const startX = Math.floor(cameraX / gridSize) * gridSize;
    const startY = Math.floor(cameraY / gridSize) * gridSize;
    
    // Vertical lines
    for (let x = startX; x < startX + this.state.width + gridSize; x += gridSize) {
      const screenX = x - cameraX;
      this.ctx.beginPath();
      this.ctx.moveTo(screenX, 0);
      this.ctx.lineTo(screenX, this.state.height);
      this.ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = startY; y < startY + this.state.height + gridSize; y += gridSize) {
      const screenY = y - cameraY;
      this.ctx.beginPath();
      this.ctx.moveTo(0, screenY);
      this.ctx.lineTo(this.state.width, screenY);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  /**
   * Update devtools state
   */
  update(delta) {
    // Can add time-based updates here if needed
  }

  /**
   * Main render function - call from game.js
   */
  render(player, cameraX, cameraY) {
    if (!this.enabled) return;
    
    // Draw grid if enabled
    this.drawGrid(cameraX, cameraY);
    
    // Draw player debug info
    this.drawHitboxes(player, cameraX, cameraY);
    this.drawCoordinates(player, cameraX, cameraY);
    this.drawTerrainInfo(player, cameraX, cameraY);
    
    // Draw main panel on top
    this.drawPanel();
  }
}

// Export for use in game.js
if (typeof window !== 'undefined') {
  window.DeveloperTools = DeveloperTools;
}
