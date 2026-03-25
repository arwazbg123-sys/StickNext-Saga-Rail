const anggotaData = [
  {
    name: 'Naufal MrSov',
    title: 'Kreator / Leader',
    description: 'Pembuat StickNext Saga Rail, ahli desain stiker dan pengembang proyek komunitas.',
    img: 'Naufal Mrsov.images.jpg',
    works: ['StickMazz', 'StickNext', 'StickBot'],
    status: 'active',
    badge: 'founder' // Badge khusus untuk founder
  },
  {
    name: 'Sherifal Vornefal Desertfall.',
    title: 'Penjaga Gurun',
    description: 'Bertanggung jawab atas keamanan dan perlindungan wilayah gurun komunitas.',
    img: 'sherifal vornefal desertfall.jpg',
    works: ['Keamanan Gurun', 'Perlindungan Wilayah', 'menegakkan Hukum'],
    status: 'active',
    badge: 'guardian' // Badge untuk penjaga
  },
  {
    name: 'Grandarma Vermansyah.',
    title: 'Penjaga Nebula Kosmik',
    description: 'Menjaga keamanan dan keseimbangan di wilayah nebula kosmik komunitas.',
    img: 'Grandarma anggota.jpg',
    works: ['Keamanan Nebula', 'Keseimbangan Kosmik', 'Pengawasan Wilayah'],
    status: 'active',
    badge: 'guardian' // Badge untuk penjaga
  },
  {
    name: 'Paratugas Idol Devas.',
    title: 'Programmer',
    description: 'Membangun fitur interaktif dan fungsionalitas situs dengan JavaScript.',
    img: 'images/anggota-adit.jpg',
    works: ['Fitur Anggota', 'Sistem Rating', 'Animasi Loader'],
    status: 'active',
    badge: 'developer' // Badge untuk developer
  },
  {
    name: 'NovaZess Veldrass.',
    title: 'Agent Elite',
    description: 'Bertanggung jawab atas operasi rahasia dan misi khusus komunitas.',
    img: 'NovaZess Veldrass.jpg',
    works: ['Perdamaian Anggota', 'Keamanan', 'Intelijen Rahasia'],
    status: 'active',
    badge: 'elite' // Badge untuk agent elite
  },
  {
    name: 'Novarizwan Kurniawan.',
    title: 'Komandan Operasi Militer',
    description: 'Bertanggung jawab atas operasi pengamanan komunitas.',
    img: 'Novarizwan kurniawan.jpg',
    works: ['Perdamaian Anggota', 'Keamanan', 'Komando Operasi'],
    status: 'active',
    badge: 'commander' // Badge untuk komandan
  },
];

let currentFilter = '';

// DOM Elements
const memberGrid = document.getElementById('member-grid');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('member-modal');
const modalImg = document.getElementById('modal-img');
const modalName = document.getElementById('modal-name');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalWorks = document.getElementById('modal-works');
const modalClose = document.getElementById('modal-close');
const totalMembersEl = document.getElementById('total-members');
const activeMembersEl = document.getElementById('active-members');
const totalWorksEl = document.getElementById('total-works');

// Mobile-specific enhancements
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// Touch handling for modal
let touchStartY = 0;
let touchStartX = 0;
let isDragging = false;

// Pull-to-refresh
let pullStartY = 0;
let isPulling = false;

// Search debouncing
let searchTimeout;

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

// Update Stats
function updateStats() {
  const totalMembers = anggotaData.length;
  const activeMembers = anggotaData.filter(member => member.status === 'active').length;
  const totalWorks = anggotaData.reduce((sum, member) => sum + member.works.length, 0);

  animateNumber(totalMembersEl, totalMembers);
  animateNumber(activeMembersEl, activeMembers);
  animateNumber(totalWorksEl, totalWorks);
}

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

// Haptic feedback for mobile
function hapticFeedback() {
  if (isMobile && navigator.vibrate) {
    navigator.vibrate(50);
  }
}

// Filter members based on search
function filterMembers(query) {
  currentFilter = query.toLowerCase();
  renderAnggota();
}

// Render members with animation
function renderAnggota() {
  if (!memberGrid) return;

  const filteredData = anggotaData.filter(member =>
    member.name.toLowerCase().includes(currentFilter) ||
    member.title.toLowerCase().includes(currentFilter) ||
    member.works.some(work => work.toLowerCase().includes(currentFilter))
  );

  memberGrid.innerHTML = '';

  if (filteredData.length === 0) {
    memberGrid.innerHTML = '<p class="placeholder">Tidak ada anggota yang ditemukan.</p>';
    return;
  }

  filteredData.forEach((anggota, index) => {
    const card = document.createElement('article');
    card.className = 'member-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const badgeInfo = getBadgeInfo(anggota.badge);
    const badgeHTML = badgeInfo ? `
      <div class="member-badge ${badgeInfo.special ? 'special-badge' : ''}" style="
        background: ${badgeInfo.color};
        box-shadow: ${badgeInfo.glow};
        color: white;
      ">
        ${badgeInfo.name}
      </div>
    ` : '';

    // Special particle effect for founder
    const particleHTML = badgeInfo && badgeInfo.special ? `
      <div class="founder-particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
      </div>
    ` : '';

    card.innerHTML = `
      ${badgeHTML}
      ${particleHTML}
      <img src="${anggota.img}" alt="Foto ${anggota.name}" loading="lazy" />
      <div class="member-card-content">
        <h3>${anggota.name}</h3>
        <p><strong>${anggota.title}</strong></p>
        <p>${anggota.description}</p>
        <ul class="works">
          ${anggota.works.slice(0, 2).map((item) => `<li>${item}</li>`).join('')}
          ${anggota.works.length > 2 ? `<li>+${anggota.works.length - 2} lainnya</li>` : ''}
        </ul>
      </div>
    `;

    // Add click event for modal
    card.addEventListener('click', (event) => handleCardClick(anggota, event));

    memberGrid.appendChild(card);
  });
}

// Enhanced modal open with mobile optimizations
function openModal(member) {
  modalImg.src = member.img;
  modalImg.alt = `Foto ${member.name}`;
  modalName.textContent = member.name;
  modalTitle.textContent = member.title;
  modalDescription.textContent = member.description;
  modalWorks.innerHTML = member.works.map(work => `<li>${work}</li>`).join('');

  // Add badge to modal if exists
  const badgeInfo = getBadgeInfo(member.badge);
  const existingBadge = modal.querySelector('.modal-badge');
  if (existingBadge) existingBadge.remove();

  if (badgeInfo) {
    const modalBadge = document.createElement('div');
    modalBadge.className = `modal-badge ${badgeInfo.special ? 'special-modal-badge' : ''}`;
    modalBadge.style.cssText = `
      background: ${badgeInfo.color};
      box-shadow: ${badgeInfo.glow};
      color: white;
      position: absolute;
      top: 20px;
      right: 20px;
      padding: 0.6rem 1.2rem;
      border-radius: 25px;
      font-size: 0.9rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      z-index: 1001;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
    `;
    modalBadge.textContent = badgeInfo.name;
    modal.appendChild(modalBadge);
  }

  // Special founder modal effect
  if (member.badge === 'founder') {
    modal.style.border = '3px solid #FFD700';
    modal.style.boxShadow = '0 0 50px rgba(255, 215, 0, 0.5), 0 20px 40px rgba(0,0,0,0.5)';
  } else {
    modal.style.border = '';
    modal.style.boxShadow = '';
  }

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  // Mobile-specific: haptic feedback
  hapticFeedback();

  // Focus management for accessibility
  modal.focus();
}

// Enhanced modal close
function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';

  // Remove modal badge
  const modalBadge = modal.querySelector('.modal-badge');
  if (modalBadge) modalBadge.remove();

  hapticFeedback();
}

// Touch event handlers for swipe-to-close modal
function handleTouchStart(e) {
  if (!isMobile || modal.style.display !== 'block') return;

  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
  isDragging = false;
}

function handleTouchMove(e) {
  if (!isMobile || modal.style.display !== 'block' || !touchStartY) return;

  const touchY = e.touches[0].clientY;
  const touchX = e.touches[0].clientX;
  const deltaY = touchY - touchStartY;
  const deltaX = Math.abs(touchX - touchStartX);

  // Only allow vertical swipe if more vertical than horizontal
  if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 30) {
    isDragging = true;
    e.preventDefault(); // Prevent scrolling
    const translateY = Math.max(0, deltaY);
    modal.style.transform = `translateY(${translateY}px)`;
    modal.style.transition = 'none';
  }
}

function handleTouchEnd(e) {
  if (!isMobile || modal.style.display !== 'block') return;

  if (isDragging) {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY;

    if (deltaY > 100) { // Swipe down threshold
      closeModal();
    } else {
      // Reset position
      modal.style.transform = '';
      modal.style.transition = '';
    }
  }

  touchStartY = 0;
  touchStartX = 0;
  isDragging = false;
}

// Pull-to-refresh functionality for mobile
function handlePullStart(e) {
  if (!isMobile || window.scrollY > 0) return;
  pullStartY = e.touches[0].clientY;
  isPulling = true;
}

function handlePullMove(e) {
  if (!isMobile || !isPulling || window.scrollY > 0) return;

  const pullY = e.touches[0].clientY;
  const pullDistance = pullY - pullStartY;

  if (pullDistance > 0) {
    e.preventDefault();
    const pullRatio = Math.min(pullDistance / 100, 1);
    document.body.style.transform = `translateY(${pullDistance * 0.3}px)`;
    document.body.style.transition = 'none';

    // Visual feedback
    if (pullRatio > 0.8) {
      hapticFeedback();
    }
  }
}

function handlePullEnd(e) {
  if (!isMobile || !isPulling) return;

  const pullEndY = e.changedTouches[0].clientY;
  const pullDistance = pullEndY - pullStartY;

  if (pullDistance > 120) { // Pull threshold
    // Refresh data
    hapticFeedback();
    updateStats();
    renderAnggota();
    filterMembers(''); // Reset filter
    if (searchInput) searchInput.value = ''; // Clear search
  }

  // Reset
  document.body.style.transform = '';
  document.body.style.transition = '';
  pullStartY = 0;
  isPulling = false;
}

// Enhanced card click with mobile feedback
function handleCardClick(member, event) {
  event.preventDefault();

  if (isMobile) {
    hapticFeedback();
    // Add ripple effect
    const card = event.currentTarget;
    const ripple = document.createElement('div');
    ripple.className = 'mobile-ripple';
    ripple.style.left = `${event.touches ? event.touches[0].clientX - card.offsetLeft : event.clientX - card.offsetLeft}px`;
    ripple.style.top = `${event.touches ? event.touches[0].clientY - card.offsetTop : event.clientY - card.offsetTop}px`;
    card.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
      openModal(member);
    }, 200);
  } else {
    openModal(member);
  }
}

// Enhanced search with debouncing for mobile
function debouncedFilter(query) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filterMembers(query);
    // Smooth scroll to top on mobile when searching
    if (isMobile && query.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, isMobile ? 300 : 150); // Longer debounce on mobile
}

// Event listeners
function setupEventListeners() {
  // Search input with debouncing
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      debouncedFilter(e.target.value);
    });
  }

  // Modal close
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close modal on outside click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });

  // Mobile touch events
  if (isMobile) {
    // Modal swipe to close
    modal.addEventListener('touchstart', handleTouchStart, { passive: false });
    modal.addEventListener('touchmove', handleTouchMove, { passive: false });
    modal.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Pull to refresh
    document.addEventListener('touchstart', handlePullStart, { passive: false });
    document.addEventListener('touchmove', handlePullMove, { passive: false });
    document.addEventListener('touchend', handlePullEnd, { passive: false });
  }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  // Hide loader after content loads
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = 'none';
    }
  }, 2000); // Match animation duration

  updateStats();
  renderAnggota();
  setupEventListeners();
});
