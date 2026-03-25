// badge.js - Badge system for member cards

// Badge configuration
const badgeConfig = {
  founder: {
    name: '🏆 Founder',
    color: '#FFD700',
    glow: '0 0 20px rgba(255, 215, 0, 0.8)',
    special: true
  },
  guardian: {
    name: '🛡️ Guardian',
    color: '#FF6B35',
    glow: '0 0 15px rgba(255, 107, 53, 0.6)',
    special: false
  },
  developer: {
    name: '💻 Developer',
    color: '#00D4FF',
    glow: '0 0 15px rgba(0, 212, 255, 0.6)',
    special: false
  },
  elite: {
    name: '⚡ Elite Agent',
    color: '#9D4EDD',
    glow: '0 0 15px rgba(157, 78, 221, 0.6)',
    special: false
  },
  commander: {
    name: '🎖️ Commander',
    color: '#FF006E',
    glow: '0 0 15px rgba(255, 0, 110, 0.6)',
    special: false
  }
};

// Get badge info
function getBadgeInfo(badge) {
  return badgeConfig[badge] || null;
}

// Create badge element
function createBadgeElement(badgeType) {
  const badgeInfo = getBadgeInfo(badgeType);
  if (!badgeInfo) return null;

  const badge = document.createElement('div');
  badge.className = `member-badge badge-${badgeType}`;
  badge.textContent = badgeInfo.name;

  if (badgeInfo.special) {
    badge.classList.add('founder-card');
  }

  return badge;
}