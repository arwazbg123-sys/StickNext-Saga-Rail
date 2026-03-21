const initialNotes = [
  { id: 1, type: 'dev', title: 'Deployment staging siap', date: '2026-03-20', desc: 'Backend API baru telah dipasang; endpoint `/api/contact` tersedia. Pastikan test load 1000 request per menit dan cek return code 2xx.', link: '#', tag: 'update' },
  { id: 2, type: 'news', title: 'Fitur Network Stat Resmi Rilis', date: '2026-03-19', desc: 'Tampilan UI baru untuk statistik jaringan dev. Berhasil ditambahkan di `navigasi` dan `statistik-jaringan.html`.', link: 'statistik-jaringan.html', tag: 'berita' },
  { id: 3, type: 'dev', title: 'Pembaruan FAQ interaktif', date: '2026-03-18', desc: 'Pertanyaan developer dan tips roadmap ditambahkan ke halaman FAQ. Accordion dibuat satu terbuka dan keyboard friendly.', link: 'faq.html', tag: 'catatan' },
  { id: 4, type: 'news', title: 'Kecerdasan Buatan Naufal Mrsov', date: '2026-03-18', desc: 'Kecerdasan buatan Naufal Mrsov Mazzi akan hadir sebagai kecerdasan Buatan Indonesia Pertama.', link: '#', tag: 'berita' },
  { id: 5, type: 'dev', title: 'Pembaruan kata Halaman Kontak', date: '2026-12-18', desc: 'Merubah Kosakata Di Halaman Kontak Menjadi lebih santai dan gaul untuk pengalaman penjelajahan yang unik.', link: 'kontak.html', tag: 'dev' },
  { id: 6, type: 'news', title: 'Fitur Login', date: '2026-12-18', desc: 'Fitur Login akan ditambahkan untuk membuat situs StickNext Saga Rail Menjadi Profesional dan Resmi.', link: '#', tag: 'berita' },
];

const blogGrid = document.getElementById('blog-grid');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const countArticles = document.getElementById('count-articles');
const countVisitors = document.getElementById('count-visitors');
const avgLoad = document.getElementById('avg-load');
const cloudStatus = document.getElementById('cloud-status');
const forceUpdateBtn = document.getElementById('forceUpdate');

let visitors = Math.floor(Math.random() * 450 + 200);
let loadMs = Math.floor(Math.random() * 320 + 150);
let articles = initialNotes.length;
let currentPage = 1;
const itemsPerPage = 6;
let filteredNotes = initialNotes;

// Futuristic Loader Functions
function startLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    animateParticles();
  }
}

function stopLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 1000);
  }
}

function animateParticles() {
  const particles = document.querySelectorAll('.loader-particle');
  particles.forEach((particle, index) => {
    const angle = (index / particles.length) * 2 * Math.PI;
    const radius = 60;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    particle.style.transform = `translate(${x}px, ${y}px)`;
    particle.style.animation = `orbit 3s linear infinite`;
    particle.style.animationDelay = `${index * 0.2}s`;
  });
}

function glitchText() {
  const text = document.querySelector('.loader-text');
  if (!text) return;
  const original = 'Memuat Saga Blog...';
  let glitched = '';
  for (let i = 0; i < original.length; i++) {
    if (Math.random() > 0.8) {
      glitched += String.fromCharCode(65 + Math.floor(Math.random() * 26));
    } else {
      glitched += original[i];
    }
  }
  text.textContent = glitched;
  setTimeout(glitchText, 150);
}

function renderGrid(notes, page = 1) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedNotes = notes.slice(start, end);

  let html = '';
  paginatedNotes.forEach(function(note) {
    html += '<div class="blog-card" data-aos="zoom-in">' +
      '<h3>' + note.title + ' <span class="badge">' + note.tag + '</span></h3>' +
      '<small>' + note.date + ' • ' + (note.type === 'dev' ? 'Catatan Developer' : 'Berita') + '</small>' +
      '<p>' + note.desc + '</p>' +
      '<a href="' + note.link + '">Baca selengkapnya &raquo;</a>' +
      '</div>';
  });
  blogGrid.innerHTML = html;

  renderPagination(notes.length);
  countArticles.innerText = notes.length;
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) {
      btn.classList.add('active');
    }
    btn.addEventListener('click', function() {
      currentPage = i;
      renderGrid(filteredNotes, currentPage);
    });
    pagination.appendChild(btn);
  }
}

function filterNotes() {
  const searchTerm = searchInput.value.toLowerCase();
  const filterType = filterSelect.value;

  filteredNotes = initialNotes.filter(function(note) {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm) || note.desc.toLowerCase().includes(searchTerm);
    const matchesFilter = filterType === 'all' || note.type === filterType;
    return matchesSearch && matchesFilter;
  });

  currentPage = 1;
  renderGrid(filteredNotes, currentPage);
}

function tickStatUpdate() {
  visitors += Math.floor(Math.random() * 8 - 2); if (visitors < 0) visitors = 0;
  loadMs = Math.max(70, loadMs + Math.floor(Math.random() * 31 - 15));
  countVisitors.innerText = visitors.toLocaleString('id-ID');
  avgLoad.innerText = loadMs + ' ms';
  const uptime = Math.random() > 0.05 ? 'terhubung' : 'terputus';
  cloudStatus.innerText = uptime;
  cloudStatus.style.color = uptime === 'terhubung' ? '#88ff94' : '#ff5f5f';
  if (uptime === 'terputus' && Math.random() < 0.35) {
    cloudStatus.innerText = 'pemulihan...';
    cloudStatus.style.color = '#f5d940';
  }
}

function setup() {
  startLoader();
  glitchText();
  setTimeout(() => {
    renderGrid(filteredNotes);
    tickStatUpdate();
    setInterval(tickStatUpdate, 1100);
    forceUpdateBtn.addEventListener('click', tickStatUpdate);
    searchInput.addEventListener('input', filterNotes);
    filterSelect.addEventListener('change', filterNotes);
    stopLoader();
  }, 3000); // Simulate loading time
}

document.addEventListener('DOMContentLoaded', setup);

// Clock update
function updateClock() {
  const now = new Date();
  document.getElementById('clock').innerText = now.toLocaleTimeString('id-ID', { hour12: false, timeZone: 'Asia/Jakarta' });
}
setInterval(updateClock, 1000);
updateClock();