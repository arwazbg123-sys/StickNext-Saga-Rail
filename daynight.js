/**
 * Day/Night System - Handles time cycle, sun, moon, stars, and lighting
 * Modular day/night cycle rendering for the game
 */

// Day/Night cycle configuration
const DAY_NIGHT_CONFIG = {
  dayLength: 180, // seconds for full day/night cycle (faster cycle for better viewing)
  sunriseTime: 0.15, // 15% of cycle - earlier sunrise
  sunsetTime: 0.85, // 85% of cycle - later sunset
  nightStart: 0.92, // 92% of cycle - night starts later
  dayStart: 0.08, // 8% of cycle - day starts later
  sunRadius: 40,
  moonRadius: 35,
  starCount: 100 // More stars for prettier night sky
};

/**
 * DayNightRenderer - Handles all time-based rendering
 * Includes sun, moon, stars, sky colors, and time transitions
 */
class DayNightRenderer {
  constructor(canvasContext, gameState) {
    this.ctx = canvasContext;
    this.state = gameState;
    this.startTime = Date.now();
    this.stars = this.generateStars();
  }

  // Get current time of day (0-1, where 0 = midnight, 0.5 = noon)
  getTimeOfDay() {
    const elapsed = (Date.now() - this.startTime) / 1000;
    return (elapsed / DAY_NIGHT_CONFIG.dayLength) % 1;
  }

  // Check if it's night time
  isNight() {
    const time = this.getTimeOfDay();
    return time >= DAY_NIGHT_CONFIG.nightStart || time <= DAY_NIGHT_CONFIG.dayStart;
  }

  // Get sky color based on time of day with smooth gradients
  getSkyColor() {
    const time = this.getTimeOfDay();
    const isNight = this.isNight();

    if (isNight) {
      // Night sky - smooth transition from sunset to deep night
      let nightIntensity = 0;
      if (time >= DAY_NIGHT_CONFIG.nightStart) {
        nightIntensity = (time - DAY_NIGHT_CONFIG.nightStart) / (1 - DAY_NIGHT_CONFIG.nightStart);
      } else if (time <= DAY_NIGHT_CONFIG.dayStart) {
        nightIntensity = (DAY_NIGHT_CONFIG.dayStart - time) / DAY_NIGHT_CONFIG.dayStart;
      } else {
        nightIntensity = 0;
      }
      
      // Smoothly transition from dusk (#1a1f35) to midnight (#0a0f1a)
      const r = Math.floor(26 + (10 - 26) * nightIntensity);
      const g = Math.floor(31 + (15 - 31) * nightIntensity);
      const b = Math.floor(53 + (26 - 53) * nightIntensity);
      
      return `rgb(${r}, ${g}, ${b})`;
    } else if (time >= DAY_NIGHT_CONFIG.sunriseTime && time <= DAY_NIGHT_CONFIG.sunsetTime) {
      // Day sky - light blue
      return '#87CEEB';
    } else {
      // Sunrise/sunset - smooth orange/red gradients
      const sunriseProgress = time < 0.5 ?
        Math.min(1, (time - DAY_NIGHT_CONFIG.dayStart) / (DAY_NIGHT_CONFIG.sunriseTime - DAY_NIGHT_CONFIG.dayStart)) :
        Math.min(1, (DAY_NIGHT_CONFIG.sunsetTime - time) / (DAY_NIGHT_CONFIG.sunsetTime - DAY_NIGHT_CONFIG.nightStart));

      // Smooth color interpolation
      const r = Math.floor(135 + (255 - 135) * (1 - sunriseProgress));
      const g = Math.floor(206 + (100 - 206) * (1 - sunriseProgress));
      const b = Math.floor(235 + (30 - 235) * (1 - sunriseProgress));

      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  // Generate random star positions
  generateStars() {
    const stars = [];
    for (let i = 0; i < DAY_NIGHT_CONFIG.starCount; i++) {
      stars.push({
        x: Math.random() * this.state.width,
        y: Math.random() * (this.state.height * 0.6),
        brightness: 0.3 + Math.random() * 0.7,
        twinkle: Math.random() * Math.PI * 2
      });
    }
    return stars;
  }

  // Draw the sky background
  drawSky() {
    const skyColor = this.getSkyColor();
    this.ctx.fillStyle = skyColor;
    this.ctx.fillRect(0, 0, this.state.width, this.state.height);
  }

  // Draw stars at night
  drawStars() {
    if (!this.isNight()) return;

    // Only show stars when it's really night (after 90% into cycle)
    const time = this.getTimeOfDay();
    let starAlpha = 0;
    
    if (time >= DAY_NIGHT_CONFIG.nightStart) {
      starAlpha = Math.min(1, (time - DAY_NIGHT_CONFIG.nightStart) / 0.05); // Fade in stars
    } else if (time <= DAY_NIGHT_CONFIG.dayStart * 0.5) {
      starAlpha = Math.min(1, (DAY_NIGHT_CONFIG.dayStart * 0.5 - time) / 0.05); // Fade out stars
    } else {
      starAlpha = 1;
    }

    this.ctx.fillStyle = 'white';
    this.stars.forEach(star => {
      const twinkle = Math.sin(Date.now() * 0.003 + star.twinkle) * 0.4 + 0.6;
      const alpha = Math.max(0.3, star.brightness * twinkle * starAlpha);

      this.ctx.globalAlpha = alpha;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Add subtle glow to brighter stars
      if (star.brightness > 0.6) {
        this.ctx.globalAlpha = alpha * 0.3;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
    this.ctx.globalAlpha = 1;
  }

  // Draw the sun with rays
  drawSun() {
    if (this.isNight()) return;

    const time = this.getTimeOfDay();
    const sunProgress = (time - DAY_NIGHT_CONFIG.dayStart) / (DAY_NIGHT_CONFIG.sunsetTime - DAY_NIGHT_CONFIG.dayStart);

    // Sun position (arc across the sky)
    const sunAngle = sunProgress * Math.PI;
    const sunX = this.state.width * 0.5 + Math.cos(sunAngle) * this.state.width * 0.4;
    const sunY = this.state.height * 0.8 - Math.sin(sunAngle) * this.state.height * 0.6;

    // Sun glow (radial gradient)
    const gradient = this.ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, DAY_NIGHT_CONFIG.sunRadius * 2);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 150, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, DAY_NIGHT_CONFIG.sunRadius * 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Sun core
    this.ctx.fillStyle = '#FFD700';
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, DAY_NIGHT_CONFIG.sunRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Sun rays
    this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const rayLength = DAY_NIGHT_CONFIG.sunRadius + 15;

      this.ctx.beginPath();
      this.ctx.moveTo(
        sunX + Math.cos(angle) * DAY_NIGHT_CONFIG.sunRadius,
        sunY + Math.sin(angle) * DAY_NIGHT_CONFIG.sunRadius
      );
      this.ctx.lineTo(
        sunX + Math.cos(angle) * rayLength,
        sunY + Math.sin(angle) * rayLength
      );
      this.ctx.stroke();
    }
  }

  // Draw the moon
  drawMoon() {
    if (!this.isNight()) return;

    const time = this.getTimeOfDay();
    const moonProgress = time >= DAY_NIGHT_CONFIG.nightStart ?
      (time - DAY_NIGHT_CONFIG.nightStart) / (1 - DAY_NIGHT_CONFIG.nightStart + DAY_NIGHT_CONFIG.dayStart) :
      (time + (1 - DAY_NIGHT_CONFIG.nightStart)) / (1 - DAY_NIGHT_CONFIG.nightStart + DAY_NIGHT_CONFIG.dayStart);

    // Moon position (opposite arc to sun)
    const moonAngle = moonProgress * Math.PI + Math.PI; // Opposite to sun
    const moonX = this.state.width * 0.5 + Math.cos(moonAngle) * this.state.width * 0.4;
    const moonY = this.state.height * 0.8 - Math.sin(moonAngle) * this.state.height * 0.6;

    // Moon glow
    const gradient = this.ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, DAY_NIGHT_CONFIG.moonRadius * 1.5);
    gradient.addColorStop(0, 'rgba(200, 200, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(150, 150, 200, 0)');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, DAY_NIGHT_CONFIG.moonRadius * 1.5, 0, Math.PI * 2);
    this.ctx.fill();

    // Moon core
    this.ctx.fillStyle = '#E6E6FA';
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, DAY_NIGHT_CONFIG.moonRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Moon craters (simple dark spots)
    this.ctx.fillStyle = 'rgba(150, 150, 180, 0.8)';
    const craters = [
      { x: -10, y: -5, r: 3 },
      { x: 8, y: 8, r: 4 },
      { x: -5, y: 12, r: 2 },
      { x: 12, y: -8, r: 3 }
    ];

    craters.forEach(crater => {
      this.ctx.beginPath();
      this.ctx.arc(moonX + crater.x, moonY + crater.y, crater.r, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  // Draw clouds (only during day)
  drawClouds() {
    if (this.isNight()) return;

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 6; i++) {
      const x = (i * 200 + Date.now() * 0.01) % (this.state.width + 100) - 50;
      const y = 60 + (i % 3) * 40;

      // Cloud puffs
      this.ctx.beginPath();
      this.ctx.arc(x, y, 25, 0, Math.PI * 2);
      this.ctx.arc(x + 30, y, 35, 0, Math.PI * 2);
      this.ctx.arc(x + 60, y, 25, 0, Math.PI * 2);
      this.ctx.arc(x + 30, y - 15, 20, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // Draw time indicator (optional debug)
  drawTimeIndicator() {
    const time = this.getTimeOfDay();
    const timeString = this.isNight() ? 'Night' : 'Day';
    const timePercent = Math.floor(time * 100);

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.fillText(`${timeString} ${timePercent}%`, 10, 30);
  }

  // Draw all day/night elements
  drawAll() {
    this.drawSky();
    this.drawStars();
    this.drawSun();
    this.drawMoon();
    this.drawClouds();

    // Uncomment for debug time indicator
    // this.drawTimeIndicator();
  }

  // Get lighting intensity (0-1, affects game brightness)
  getLightingIntensity() {
    const time = this.getTimeOfDay();

    if (this.isNight()) {
      return 0.3; // Dim lighting at night
    } else {
      // Peak brightness at noon
      const noonDistance = Math.abs(time - 0.5);
      return 0.7 + 0.3 * (1 - noonDistance * 2);
    }
  }
}