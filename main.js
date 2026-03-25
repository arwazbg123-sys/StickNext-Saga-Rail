// main.js - Orchestrates Anggota page behavior

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
  // Use minimal recovery instead of showing error banner
  minimalRecovery();
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
  if (member.badge === 'founder') {
    card.classList.add('founder-card');
  }

  const img = document.createElement('img');
  img.src = member.img;
  img.alt = `${member.name}'s photo`;
  img.onerror = function() {
    this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUI5QkE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk5vSBJbWFnZTwvdGV4dD4KPC9zdmc+'; // Placeholder SVG
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
    return;
  }
  memberGrid.innerHTML = '';

  const filteredData = anggotaData.filter(member => {
    const searchTerm = filter.toLowerCase();
    return (
      member.name.toLowerCase().includes(searchTerm) ||
      member.title.toLowerCase().includes(searchTerm) ||
      member.description.toLowerCase().includes(searchTerm) ||
      member.works.some(work => work.toLowerCase().includes(searchTerm))
    );
  });

  filteredData.forEach((member, index) => {
    const card = createMemberCard(member);
    card.style.animationDelay = `${index * 0.06}s`;
    memberGrid.appendChild(card);
  });

  updateStats();
}

function updateStats() {
  const totalMembers = anggotaData.length;
  const activeMembers = anggotaData.filter(member => member.status === 'active').length;
  const founderCount = anggotaData.filter(member => member.badge === 'founder').length;
  const totalWorks = anggotaData.reduce((sum, member) => sum + member.works.length, 0);

  if (totalMembersEl) animateNumber(totalMembersEl, totalMembers);
  if (activeMembersEl) animateNumber(activeMembersEl, activeMembers);
  if (founderCountEl) animateNumber(founderCountEl, founderCount);
  if (totalWorksEl) animateNumber(totalWorksEl, totalWorks);
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

  // Wait for anggotaData to be available
  function checkDataAndInit() {
    attempts++;

    if (typeof anggotaData !== 'undefined') {
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
        updateStats();
        setupSearch();
        initModalInteractions();
        adjustForMobile();
        setUpLoader();
      } catch (error) {
        console.error('Main.js init error:', error);
        // Try to continue with minimal functionality
        minimalRecovery();
      }
    } else if (attempts >= maxAttempts) {
      console.warn('anggotaData not available after max attempts, using fallback');
      // Create fallback data
      if (typeof anggotaData === 'undefined') {
        window.anggotaData = [
          {
            name: 'Data Tidak Tersedia',
            title: 'System Recovery',
            description: 'Data anggota sedang dipulihkan secara otomatis',
            img: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOUI5QkE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPkRhdGEgRXJyb3I8L3RleHQ+Cjwvc3ZnPg==',
            works: ['System recovery in progress'],
            status: 'active',
            badge: 'default'
          }
        ];
      }
      // Retry init with fallback data
      checkDataAndInit();
    } else {
      setTimeout(checkDataAndInit, 50);
    }
  }

  checkDataAndInit();
}

function minimalRecovery() {
  // Minimal recovery when main functions fail
  console.log('Running minimal recovery mode');

  const memberGrid = document.getElementById('member-grid');
  if (memberGrid) {
    memberGrid.innerHTML = `
      <div class="member-card" style="text-align: center; padding: 2rem; background: rgba(255,255,255,0.05); border-radius: 10px;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔄</div>
        <h3>Sistem Sedang Dipulihkan</h3>
        <p>Fitur lengkap akan segera kembali. Halaman tetap dapat digunakan.</p>
        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #e63946; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Muat Ulang Halaman
        </button>
      </div>
    `;
  }

  // Still try to hide loader
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }

  // Try to setup basic search if possible
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.placeholder = 'Pencarian akan aktif setelah pemulihan';
    searchInput.disabled = true;
  }
}

window.addEventListener('DOMContentLoaded', init);
