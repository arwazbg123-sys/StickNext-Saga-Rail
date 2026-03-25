const anggotaData = [
  {
    name: 'Naufal MrSov',
    title: 'Kreator / Leader',
    description: 'Pembuat StickNext Saga Rail, ahli desain stiker dan pengembang proyek komunitas.',
    img: 'Naufal Mrsov.images.jpg',
    works: ['StickMazz', 'StickNext', 'StickBot'],
    status: 'active'
  },
  {
    name: 'Sherifal Vornefal Desertfall.',
    title: 'Penjaga Gurun',
    description: 'Bertanggung jawab atas keamanan dan perlindungan wilayah gurun komunitas.',
    img: 'sherifal vornefal desertfall.jpg',
    works: ['Keamanan Gurun', 'Perlindungan Wilayah', 'menegakkan Hukum'],
    status: 'active'
  },
  {
    name: 'Grandarma Vermansyah.',
    title: 'Penjaga Nebula Kosmik',
    description: 'Menjaga keamanan dan keseimbangan di wilayah nebula kosmik komunitas.',
    img: 'Grandarma anggota.jpg',
    works: ['Keamanan Nebula', 'Keseimbangan Kosmik', 'Pengawasan Wilayah'],
    status: 'active'
  },
  {
    name: 'Paratugas Idol Devas.',
    title: 'Programmer',
    description: 'Membangun fitur interaktif dan fungsionalitas situs dengan JavaScript.',
    img: 'images/anggota-adit.jpg',
    works: ['Fitur Anggota', 'Sistem Rating', 'Animasi Loader'],
    status: 'active'
  },
  {
    name: 'NovaZess Veldrass.',
    title: 'Agent Elite',
    description: 'Bertanggung jawab atas operasi rahasia dan misi khusus komunitas.',
    img: 'NovaZess Veldrass.jpg',
    works: ['Perdamaian Anggota', 'Keamanan', 'Intelijen Rahasia'],
    status: 'active'
  },
  {
    name: 'Novarizwan Kurniawan.',
    title: 'Komandan Operasi Militer',
    description: 'Bertanggung jawab atas operasi pengamanan komunitas.',
    img: 'Novarizwan kurniawan.jpg',
    works: ['Perdamaian Anggota', 'Keamanan', 'Komando Operasi'],
    status: 'active'
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

    card.innerHTML = `
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
    card.addEventListener('click', () => openModal(anggota));

    memberGrid.appendChild(card);
  });
}

// Open modal with member details
function openModal(member) {
  modalImg.src = member.img;
  modalImg.alt = `Foto ${member.name}`;
  modalName.textContent = member.name;
  modalTitle.textContent = member.title;
  modalDescription.textContent = member.description;
  modalWorks.innerHTML = member.works.map(work => `<li>${work}</li>`).join('');

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Event listeners
function setupEventListeners() {
  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterMembers(e.target.value);
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
