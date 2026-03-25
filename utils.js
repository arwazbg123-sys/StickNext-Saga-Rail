// utils.js - Utility functions for Anggota page

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// Animate number counting
function animateNumber(element, target) {
  const start = parseInt(element.textContent) || 0;
  const duration = 1000;
  const step = (target - start) / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += step;
    if ((step > 0 && current >= target) || (step < 0 && current <= target)) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add ripple effect for touch interactions
function addRippleEffect(element, event) {
  if (!isMobile) return;

  const ripple = document.createElement('div');
  ripple.className = 'mobile-ripple';

  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.touches[0].clientX - rect.left - size / 2;
  const y = event.touches[0].clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';

  element.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 400);
}

// Haptic feedback for mobile
function triggerHapticFeedback() {
  if (isMobile && 'vibrate' in navigator) {
    navigator.vibrate(50);
  }
}