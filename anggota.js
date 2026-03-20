const anggotaData = [
  {
    name: 'Naufal MrSov',
    title: 'Kreator / Leader',
    description: 'Pembuat StickNext Saga Rail, ahli desain stiker dan pengembang proyek komunitas.',
    // Pastikan file berikut ada di folder yang sama dengan anggota.html:
    // C:\Users\Naufal Maulana Rizki\Documents\StickNext SagRe (WEB)\Naufal Mrsov.images.jpg
    // lalu gunakan nama relatif / sederhana agar bisa diakses dari browser:
    img: 'Naufal Mrsov.images.jpg',
    works: ['StickMazz', 'StickNext', 'StickBot']
  },
  {
    name: 'Sherifal Vornefal Desertfall.',
    title: 'Penjaga Gurun',
    description: 'Bertanggung jawab atas keamanan dan perlindungan wilayah gurun komunitas.',
    img: 'sherifal vornefal desertfall.jpg',
    works: ['Keamanan Gurun', 'Perlindungan Wilayah', 'menegakkan Hukum']
  },
  {
    name: 'Grandarma Vermansyah.',
    title: 'Penjaga Nebula Kosmik',
    description: 'Menjaga keamanan dan keseimbangan di wilayah nebula kosmik komunitas.',
    img: 'Grandarma anggota.jpg',
    works: ['Keamanan Nebula', 'Keseimbangan Kosmik', 'Pengawasan Wilayah']
  },
  {
    name: 'Paratugas Idol Devas.',
    title: 'Programmer',
    description: 'Membangun fitur interaktif dan fungsionalitas situs dengan JavaScript.',
    img: 'images/anggota-adit.jpg',
    works: ['Fitur Anggota', 'Sistem Rating', 'Animasi Loader']
  },
  {
    name: 'NovaZess Veldrass.',
    title: 'agent elite',
    description: 'Bertanggung jawab atas operasi rahasia dan misi khusus komunitas.',
    img: 'NovaZess Veldrass.jpg',
    works: ['Perdamaian anggota', 'keamanan', 'Intelijen Rahasia']
  },
  {
    name: 'Novarizwan kurniawan.',
    title: 'Komandan Operasi Militer',
    description: 'Bertanggung jawab atas operasi pengamanan komunitas.',
    img: 'Novarizwan kurniawan.jpg',
    works: ['Perdamaian anggota', 'keamanan', 'Komando Operasi']
  },
];

function renderAnggota() {
  const grid = document.getElementById('member-grid');
  if (!grid) return;

  grid.innerHTML = '';

  anggotaData.forEach((anggota) => {
    const card = document.createElement('article');
    card.className = 'member-card';

    card.innerHTML = `
      <img src="${anggota.img}" alt="Foto ${anggota.name}" loading="lazy" />
      <div class="member-card-content">
        <h3>${anggota.name}</h3>
        <p><strong>${anggota.title}</strong></p>
        <p>${anggota.description}</p>
        <ul class="works">
          ${anggota.works.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;

    grid.appendChild(card);
  });
}

window.addEventListener('DOMContentLoaded', renderAnggota);
