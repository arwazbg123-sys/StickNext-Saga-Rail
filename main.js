// main.js - Orchestrates Anggota page behavior

// DOM Elements
const memberGrid = document.getElementById('member-grid');
const searchInput = document.getElementById('search-input');
const totalMembersEl = document.getElementById('total-members');
const activeMembersEl = document.getElementById('active-members');
const founderCountEl = document.getElementById('founder-count');
const totalWorksEl = document.getElementById('total-works');
const loader = document.getElementById('loader');

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
  if (!document.querySelector('.error-banner')) {
    const banner = document.createElement('div');
    banner.className = 'error-banner';
    banner.textContent = 'Terjadi masalah pemuatan sebagian fitur. Silakan muat ulang halaman.';
    banner.style = 'position:fixed;top:0;left:0;width:100%;padding:10px;background:#c30;color:#fff;z-index:10001;text-align:center;font-weight:bold;';
    document.body.appendChild(banner);
  }
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
  try {
    renderAnggota();
    updateStats();
    setupSearch();
    initModalInteractions();
    adjustForMobile();
    setUpLoader();
  } catch (error) {
    safeInitError(error);
  }
}

window.addEventListener('DOMContentLoaded', init);
