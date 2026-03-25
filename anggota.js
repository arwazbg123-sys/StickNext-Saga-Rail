// anggota.js - Complete modular member page system for StickNext Saga Rail
// Combines data, badge system, utilities, modal, and main orchestration

(function() {
  'use strict';

  // ==========================================
  // DATA MODULE - Member data and configuration
  // ==========================================

  // Import data from anggotaData.js
  let MEMBERS = {};
  let MEMBER_CATEGORIES = {};
  let MEMBER_STATUS = {};

  // Try to load data, with fallback
  if (typeof window.AnggotaData !== 'undefined') {
    ({ MEMBERS, MEMBER_CATEGORIES, MEMBER_STATUS } = window.AnggotaData);
  } else {
    // Fallback data
    MEMBER_CATEGORIES = {
      FOUNDER: 'founder',
      GUARDIAN: 'guardian',
      DEVELOPER: 'developer',
      ELITE: 'elite',
      COMMANDER: 'commander'
    };
    MEMBER_STATUS = {
      ACTIVE: 'active',
      INACTIVE: 'inactive',
      SUSPENDED: 'suspended'
    };
    MEMBERS = {
      fallback: {
        name: 'Data Loading...',
        title: 'Please wait',
        description: 'Member data is being loaded. If this persists, please refresh the page.',
        img: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUI5QkE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPg==',
        works: ['Loading...'],
        status: 'active',
        badge: 'developer'  // Use existing badge instead of 'default'
      }
    };
  }

  // Data management functions
  function getAllMembers() {
    return Object.values(MEMBERS);
  }

  function getMemberById(id) {
    return MEMBERS[id] || null;
  }

  function getMembersByCategory(category) {
    return Object.values(MEMBERS).filter(member => member.badge === category);
  }

  function getMembersByStatus(status) {
    return Object.values(MEMBERS).filter(member => member.status === status);
  }

  function addMember(id, memberData) {
    if (MEMBERS[id]) {
      console.warn(`Member with id '${id}' already exists`);
      return false;
    }

    // Validate required fields
    const requiredFields = ['name', 'title', 'description', 'img', 'works', 'status', 'badge'];
    for (const field of requiredFields) {
      if (!memberData[field]) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }

    MEMBERS[id] = { ...memberData };
    console.log(`Member '${memberData.name}' added successfully`);
    return true;
  }

  function updateMember(id, updates) {
    if (!MEMBERS[id]) {
      console.warn(`Member with id '${id}' not found`);
      return false;
    }

    MEMBERS[id] = { ...MEMBERS[id], ...updates };
    console.log(`Member '${id}' updated successfully`);
    return true;
  }

  function removeMember(id) {
    if (!MEMBERS[id]) {
      console.warn(`Member with id '${id}' not found`);
      return false;
    }

    const memberName = MEMBERS[id].name;
    delete MEMBERS[id];
    console.log(`Member '${memberName}' removed successfully`);
    return true;
  }

  // Generate the final anggotaData array from MEMBERS object
  const anggotaData = getAllMembers();

  // Statistics functions
  function getMemberStats() {
    const allMembers = getAllMembers();
    return {
      total: allMembers.length,
      active: getMembersByStatus(MEMBER_STATUS.ACTIVE).length,
      inactive: getMembersByStatus(MEMBER_STATUS.INACTIVE).length,
      suspended: getMembersByStatus(MEMBER_STATUS.SUSPENDED).length,
      byCategory: {
        founder: getMembersByCategory(MEMBER_CATEGORIES.FOUNDER).length,
        guardian: getMembersByCategory(MEMBER_CATEGORIES.GUARDIAN).length,
        developer: getMembersByCategory(MEMBER_CATEGORIES.DEVELOPER).length,
        elite: getMembersByCategory(MEMBER_CATEGORIES.ELITE).length,
        commander: getMembersByCategory(MEMBER_CATEGORIES.COMMANDER).length
      },
      totalWorks: allMembers.reduce((sum, member) => sum + member.works.length, 0),
      averageLevel: Math.round(allMembers.reduce((sum, member) => sum + (member.level || 1), 0) / allMembers.length)
    };
  }

  // Export functions for external use (if needed)
  window.MemberManager = {
    getAllMembers,
    getMemberById,
    getMembersByCategory,
    getMembersByStatus,
    addMember,
    updateMember,
    removeMember,
    getMemberStats,
    CATEGORIES: MEMBER_CATEGORIES,
    STATUS: MEMBER_STATUS
  };

  // ==========================================
  // BADGE MODULE - Badge system configuration
  // ==========================================

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

  function getBadgeInfo(badge) {
    return badgeConfig[badge] || null;
  }

  function createBadgeElement(badgeType) {
    const badgeInfo = getBadgeInfo(badgeType);
    if (!badgeInfo) return null;

    const badge = document.createElement('div');
    badge.className = `member-badge badge-${badgeType}`;
    badge.textContent = badgeInfo.name;

    // Apply only badge-specific styling and avoid card-specific founder class on badge
    if (badgeInfo.special) {
      badge.classList.add('badge-founder-special');
    }

    return badge;
  }

  // ==========================================
  // UTILITIES MODULE - Helper functions
  // ==========================================

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

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

  function triggerHapticFeedback() {
    if (isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  // ==========================================
  // MODAL MODULE - Modal functionality
  // ==========================================

  let modal, modalImg, modalName, modalTitle, modalDescription, modalWorks, modalBadge, modalCloseButton;
  let touchStartY = 0;
  let touchStartX = 0;
  let isDragging = false;

  function safeElement(element, fallback = null) {
    return element || fallback;
  }

  function openModal(member) {
    if (!modal) {
      console.warn('Modal element not found');
      return;
    }

    try {
      if (modalImg) {
        modalImg.src = member.img;
        modalImg.onerror = function() {
          this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUI5QkE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk5vSBJbWFnZTwvdGV4dD4KPC9zdmc+'; // Placeholder SVG
          this.alt = 'Image not available';
        };
      }

      if (modalName) modalName.textContent = member.name;
      if (modalTitle) modalTitle.textContent = member.title;
      if (modalDescription) modalDescription.textContent = member.description;

      if (modalWorks) {
        modalWorks.innerHTML = '';
        member.works.forEach(work => {
          const li = document.createElement('li');
          li.textContent = work;
          modalWorks.appendChild(li);
        });
      }

      const badgeInfo = getBadgeInfo(member.badge);
      if (modalBadge) {
        if (badgeInfo) {
          modalBadge.textContent = badgeInfo.name;
          modalBadge.style.background = badgeInfo.color;
          modalBadge.style.boxShadow = badgeInfo.glow;
        } else {
          modalBadge.textContent = 'Anggota';
          modalBadge.style.background = 'rgba(255, 255, 255, 0.15)';
          modalBadge.style.boxShadow = 'none';
        }
      }

      modal.classList.add('active');
      modal.style.display = 'block';

      setTimeout(() => {
        modal.classList.add('show');
      }, 10);

      if (isMobile) {
        triggerHapticFeedback();
      }
    } catch (error) {
      console.error('Error opening modal:', error);
      closeModal();
    }
  }

  function closeModal() {
    if (!modal) {
      return;
    }

    try {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('active');
        modal.style.transform = '';
        modal.style.opacity = '';
      }, 180);
    } catch (error) {
      console.error('Error closing modal:', error);
      // Force close as fallback
      modal.style.display = 'none';
      modal.classList.remove('active', 'show');
    }
  }

  function initModalInteractions() {
    // Initialize DOM elements
    modal = document.getElementById('member-modal');
    modalImg = document.getElementById('modal-image');
    modalName = document.getElementById('modal-name');
    modalTitle = document.getElementById('modal-title');
    modalDescription = document.getElementById('modal-description');
    modalWorks = document.getElementById('modal-works-list');
    modalBadge = document.getElementById('modal-badge');
    modalCloseButton = document.querySelector('.modal-close');

    if (modalCloseButton) {
      modalCloseButton.addEventListener('click', closeModal);
    }

    if (!modal) {
      return;
    }

    modal.addEventListener('click', event => {
      if (event.target === modal) {
        closeModal();
      }
    });

    modal.addEventListener('touchstart', event => {
      if (event.touches.length !== 1) return; // Only handle single touch
      touchStartY = event.touches[0].clientY;
      touchStartX = event.touches[0].clientX;
      isDragging = false; // Reset dragging state
    });

    modal.addEventListener('touchmove', event => {
      if (event.touches.length !== 1) return;

      const deltaY = event.touches[0].clientY - touchStartY;
      const deltaX = event.touches[0].clientX - touchStartX;

      // Only start dragging if vertical movement is dominant and significant
      if (!isDragging && Math.abs(deltaY) > 10 && Math.abs(deltaY) > Math.abs(deltaX)) {
        isDragging = true;
        event.preventDefault(); // Prevent scroll when dragging modal
      }

      if (isDragging && Math.abs(deltaY) > 20) {
        const translateY = Math.max(0, deltaY); // Prevent upward movement
        const opacity = Math.max(0.3, 1 - Math.abs(deltaY) / 300);
        modal.style.transform = `translateY(${translateY}px)`;
        modal.style.opacity = opacity.toString();
      }
    });

    modal.addEventListener('touchend', event => {
      if (!isDragging) return;

      const deltaY = event.changedTouches[0].clientY - touchStartY;
      const velocity = Math.abs(deltaY) / (event.timeStamp - event.changedTouches[0].timeStamp || 1);

      // Close modal if dragged down significantly or with high velocity
      if (deltaY > 100 || (deltaY > 50 && velocity > 0.5)) {
        closeModal();
      } else {
        // Reset modal position smoothly
        modal.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        modal.style.transform = '';
        modal.style.opacity = '';

        setTimeout(() => {
          modal.style.transition = '';
        }, 300);
      }

      isDragging = false;
    });
  }

  // ==========================================
  // MAIN MODULE - Page orchestration
  // ==========================================

  // DOM Elements (initialized in init() to ensure DOM is ready)
  let memberGrid, searchInput, totalMembersEl, activeMembersEl, founderCountEl, totalWorksEl, loader;

  function hideLoader() {
    if (!loader) return;
    loader.classList.add('hide');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 300);
  }

  function safeInitError(err) {
    console.error('Anggota page script error:', err);
    hideLoader();
    // Silent error handling - don't show intrusive recovery message
  }

  window.onerror = function (message, source, lineno, colno, error) {
    safeInitError(error || message);
  };

  window.onunhandledrejection = function (event) {
    safeInitError(event.reason);
  };

  function createMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'member-card';
    // Founder card gets VIP frame + effects while keeping member-card base.
    if (member.badge === 'founder') {
      card.classList.add('founder-card');

      for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'star-sparkle';
        card.appendChild(sparkle);
      }
    }

    const img = document.createElement('img');
    img.src = member.img;
    img.alt = `${member.name}'s photo`;
    img.onerror = function() {
      this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUI5QkE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk5vIEF2YXRhcjwvdGV4dD4KPC9zdmc+';
      this.alt = 'Image not available';
    };

    const content = document.createElement('div');
    content.className = 'member-card-content';

    const name = document.createElement('h3');
    name.textContent = member.name;

    const title = document.createElement('p');
    title.textContent = member.title;

    const description = document.createElement('p');
    description.textContent = member.description;

    const workList = document.createElement('ul');
    workList.className = 'works';
    member.works.forEach(work => {
      const listItem = document.createElement('li');
      listItem.textContent = work;
      workList.appendChild(listItem);
    });

    const badge = createBadgeElement(member.badge);
    if (badge) {
      card.appendChild(badge);
    }

    content.append(name, title, description, workList);
    card.append(img, content);

    card.addEventListener('click', () => {
      addRippleEffect(card, { touches: [{ clientX: card.getBoundingClientRect().left + card.clientWidth / 2, clientY: card.getBoundingClientRect().top + card.clientHeight / 2 }] });
      openModal(member);
    });

    card.addEventListener('touchstart', (event) => {
      addRippleEffect(card, event);
    });

    return card;
  }

  function renderAnggota(filter = '') {
    if (!memberGrid) {
      console.error('Member grid not found');
      return;
    }
    memberGrid.innerHTML = '';

    // Ensure data is available
    if (!anggotaData || anggotaData.length === 0) {
      memberGrid.innerHTML = `
        <div class="member-card" style="text-align: center; padding: 2rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
          <h3>Data Anggota Tidak Ditemukan</h3>
          <p>Sistem sedang memuat data anggota. Silakan refresh halaman jika masalah berlanjut.</p>
          <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #e63946; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Muat Ulang Halaman
          </button>
        </div>
      `;
      updateStats();
      return;
    }

    const filteredData = anggotaData.filter(member => {
      const searchTerm = filter.toLowerCase();
      return (
        member.name.toLowerCase().includes(searchTerm) ||
        member.title.toLowerCase().includes(searchTerm) ||
        member.description.toLowerCase().includes(searchTerm) ||
        member.works.some(work => work.toLowerCase().includes(searchTerm))
      );
    });

    if (filteredData.length === 0) {
      memberGrid.innerHTML = `
        <div class="member-card" style="text-align: center; padding: 2rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3>Tidak Ada Anggota Ditemukan</h3>
          <p>Coba ubah kata kunci pencarian atau hapus filter untuk melihat semua anggota.</p>
        </div>
      `;
    } else {
      filteredData.forEach((member, index) => {
        const card = createMemberCard(member);
        card.style.animationDelay = `${index * 0.06}s`;
        memberGrid.appendChild(card);
      });
    }

    updateStats();
  }

  function updateStats() {
    const stats = getMemberStats();

    if (totalMembersEl) animateNumber(totalMembersEl, stats.total);
    if (activeMembersEl) animateNumber(activeMembersEl, stats.active);
    if (founderCountEl) animateNumber(founderCountEl, stats.byCategory.founder);
    if (totalWorksEl) animateNumber(totalWorksEl, stats.totalWorks);
  }

  function setupSearch() {
    if (!searchInput) {
      return;
    }

    const debouncedSearch = debounce((event) => {
      const term = event.target.value;
      renderAnggota(term);
    }, 240);

    searchInput.addEventListener('input', debouncedSearch);
  }

  function adjustForMobile() {
    if (isMobile) {
      document.body.classList.add('mobile-optimized');
    }
  }

  function setUpLoader() {
    const loadingText = document.getElementById('loading-text');
    if (!loader || !loadingText) {
      return;
    }

    setTimeout(() => {
      loadingText.style.opacity = '1';
      setTimeout(() => {
        hideLoader();
      }, 900);
    }, 1500);

    // safety: force hide loader in case something crash sebelum setUpLoader selesai
    setTimeout(() => {
      hideLoader();
    }, 7000);
  }

  function init() {
    let attempts = 0;
    const maxAttempts = 100; // Max 5 seconds (100 * 50ms)

    // Wait for DOM to be ready
    function checkDataAndInit() {
      attempts++;

      if (document.readyState === 'loading') {
        if (attempts >= maxAttempts) {
          console.warn('DOM not ready after max attempts, proceeding anyway');
          startInit();
        } else {
          setTimeout(checkDataAndInit, 50);
        }
        return;
      }

      startInit();
    }

    function startInit() {
      try {
        // Initialize DOM elements
        memberGrid = document.getElementById('member-grid');
        searchInput = document.getElementById('search-input');
        totalMembersEl = document.getElementById('total-members');
        activeMembersEl = document.getElementById('active-members');
        founderCountEl = document.getElementById('founder-count');
        totalWorksEl = document.getElementById('total-works');
        loader = document.getElementById('loader');

        renderAnggota();
        setupSearch();
        initModalInteractions();
        adjustForMobile();
        setUpLoader();
      } catch (error) {
        console.error('Main.js init error:', error);
        // Continue with basic functionality without intrusive recovery message
        hideLoader();
      }
    }

    checkDataAndInit();
  }

  function minimalRecovery() {
    // Silent recovery - just hide loader and log
    console.log('Minimal recovery mode activated');
    hideLoader();
  }

  // ==========================================
  // ESC KEY HANDLER - Global keyboard events
  // ==========================================

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });

  // ==========================================
  // INITIALIZATION - Start the application
  // ==========================================

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
