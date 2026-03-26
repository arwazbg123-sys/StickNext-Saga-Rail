// anggotaData.js - Modular member data for StickNext Saga Rail
// Contains all member definitions, categories, and status constants

(function() {
  'use strict';

  // ==========================================
  // CONSTANTS
  // ==========================================

  // Member categories for better organization
  const MEMBER_CATEGORIES = {
    FOUNDER: 'founder',
    GUARDIAN: 'guardian',
    DEVELOPER: 'developer',
    ELITE: 'elite',
    COMMANDER: 'commander',
    VISIONARY: 'visionary', // kategori baru khusus untuk kreator kosmik
    MODERATOR: 'moderator', // kategori untuk moderator komunitas
    ARTIST: 'artist', // kategori untuk seniman dan desainer
    SUPPORTER: 'supporter', // kategori untuk pendukung aktif
    AMBASSADOR: 'ambassador', // kategori untuk duta komunitas
    CONTRIBUTOR: 'contributor', // kategori untuk kontributor konten
    MEMBER: 'member' // kategori untuk anggota biasa tanpa badge khusus
  };

  // Status types
  const MEMBER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    SUSPENDED: 'suspended'
  };

  // ==========================================
  // MEMBER DATA
  // ==========================================

  const MEMBERS = {
    naufal: {
      name: 'Naufal MrSov',
      title: 'Kreator / Leader',
      description: 'Pembuat StickNext Saga Rail, ahli desain stiker dan pengembang proyek komunitas.',
      img: 'Naufal Mrsov.images.jpg',
      works: ['StickMazz', 'StickNext', 'StickNext Saga Rail'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.FOUNDER,
      joinDate: '2024-01-01',
      level: 10
    },

    sherifal: {
      name: 'Sherifal Vornefal Desertfall',
      title: 'Penjaga Gurun',
      description: 'Bertanggung jawab atas keamanan dan perlindungan wilayah gurun komunitas.',
      img: 'sherifal vornefal desertfall.jpg',
      works: ['Keamanan Gurun', 'Perlindungan Wilayah', 'Menegakkan Hukum'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.GUARDIAN,
      joinDate: '2024-02-15',
      level: 8
    },

    grandarma: {
      name: 'Grandarma Vermansyah',
      title: 'Penjaga Nebula Kosmik',
      description: 'Menjaga keamanan dan keseimbangan di wilayah nebula kosmik komunitas.',
      img: 'Grandarma anggota.jpg',
      works: ['Keamanan Nebula', 'Keseimbangan Kosmik', 'Pengawasan Wilayah'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.GUARDIAN,
      joinDate: '2024-03-01',
      level: 7
    },

    paratugas: {
      name: 'Paratugas Idol Devas',
      title: 'Programmer',
      description: 'Membangun fitur interaktif dan fungsionalitas situs dengan JavaScript.',
      img: 'data:image/svg+xml;base64,...', // placeholder avatar
      works: ['Fitur Anggota', 'Sistem Rating', 'Animasi Loader'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.DEVELOPER,
      joinDate: '2024-04-10',
      level: 6
    },

    novazess: {
      name: 'NovaZess Veldrass',
      title: 'Agent Elite',
      description: 'Bertanggung jawab atas operasi rahasia dan misi khusus komunitas.',
      img: 'NovaZess Veldrass.jpg',
      works: ['Perdamaian Anggota', 'Keamanan', 'Intelijen Rahasia'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.ELITE,
      joinDate: '2024-05-20',
      level: 9
    },

    novarizwan: {
      name: 'Novarizwan Kurniawan',
      title: 'Komandan Operasi Militer',
      description: 'Bertanggung jawab atas operasi pengamanan komunitas.',
      img: 'Novarizwan kurniawan.jpg',
      works: ['Perdamaian Anggota', 'Keamanan', 'Komando Operasi'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.COMMANDER,
      joinDate: '2024-06-01',
      level: 8
    },

    lea: {
      name: 'Growmeliana Leviana (Lea)',
      title: 'Visionary Creator',
      description: 'Arsitek kosmik StickNext, pencipta dunia glitch, audio lounge futuristik, dan saga rail interaktif.',
      img: 'lea.jpeg', // bisa diganti dengan foto/avatar kamu
      works: ['StickNext Universe', 'StickNext Go to Future', 'Audio Lounge Kosmik', 'Loader Planet Berputar'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.VISIONARY,
      joinDate: '2024-07-01',
      level: 10
    },

    // Anggota dengan kategori baru
    moderator1: {
      name: 'Alex Moderator',
      title: 'Community Moderator',
      description: 'Bertanggung jawab atas moderasi diskusi dan menjaga harmoni komunitas.',
      img: 'YmM1NDIwOWYtNjE3OC00NGY0LTg3NGMtMDZkNmZhMmRmZmY4.jpeg',
      works: ['Moderasi Diskusi', 'Penegakan Aturan', 'Dukungan Anggota'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.MODERATOR,
      joinDate: '2024-08-01',
      level: 5
    },

    artist1: {
      name: 'Luna Artist',
      title: 'Digital Artist',
      description: 'Pencipta seni digital dan desain visual untuk proyek StickNext.',
      img: 'OGVhZmRlNzItOGY1Ni00YzBlLTk2MjktNGFkOWU5OTlmYmY4.jpeg',
      works: ['Desain Stiker', 'Ilustrasi Digital', 'Konten Visual'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.ARTIST,
      joinDate: '2024-09-01',
      level: 6
    },

    supporter1: {
      name: 'Sam Supporter',
      title: 'Community Supporter',
      description: 'Mendukung komunitas dengan kontribusi aktif dan partisipasi.',
      img: 'NzM1MTYwOTItYWRhNS00MmEwLTk1ZjItZjE3NTk5ZWRhYTVj.jpeg',
      works: ['Dukungan Komunitas', 'Partisipasi Acara', 'Bantuan Anggota'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.SUPPORTER,
      joinDate: '2024-10-01',
      level: 4
    },

    ambassador1: {
      name: 'Jordan Ambassador',
      title: 'Community Ambassador',
      description: 'Mewakili komunitas StickNext di platform eksternal dan membangun jaringan.',
      img: 'lv_0_20260107161053.jpg',
      works: ['Promosi Komunitas', 'Jaringan Eksternal', 'Representasi'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.AMBASSADOR,
      joinDate: '2024-11-01',
      level: 7
    },

    contributor1: {
      name: 'Taylor Contributor',
      title: 'Content Contributor',
      description: 'Berkontribusi dengan konten berkualitas untuk pengembangan komunitas.',
      img: 'image-5.jpg',
      works: ['Konten Edukasi', 'Tutorial', 'Artikel Komunitas'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.CONTRIBUTOR,
      joinDate: '2024-12-01',
      level: 5
    },

    member1: {
      name: 'Regular Member',
      title: 'Anggota Biasa',
      description: 'Anggota aktif komunitas StickNext tanpa peran khusus.',
      img: 'lv_0_20260109160632.jpg',
      works: ['Partisipasi Komunitas', 'Dukungan Umum'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.MEMBER, // anggota biasa tanpa badge khusus
      joinDate: '2025-01-01',
      level: 3
    },

    dummySuspended: {
  name: 'Dummy Suspended',
  title: 'Anggota Percobaan',
  description: 'Akun ini dibuat hanya untuk menguji status suspended.',
  img: 'IMG_20251219_115810.jpg', // avatar placeholder
  works: ['Tes Suspended Mode'],
  status: MEMBER_STATUS.SUSPENDED,
  badge: MEMBER_CATEGORIES.DEVELOPER,
  joinDate: '2026-03-25',
  level: 1
},

    dummyInactive: {
      name: 'Dummy Inactive',
      title: 'Anggota Tidak Aktif',
      description: 'Anggota ini sedang tidak aktif sementara waktu. Mereka mungkin kembali suatu saat nanti.',
      img: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUI5QkE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPklOQUNUSVZFPC90ZXh0Pgo8L3N2Zz4=',
      works: ['Tidak Aktif Sementara'],
      status: MEMBER_STATUS.INACTIVE,
      badge: MEMBER_CATEGORIES.DEVELOPER,
      joinDate: '2024-01-01',
      level: 3
    }
  };

  // ==========================================
  // EXPORTS
  // ==========================================

  window.AnggotaData = {
    MEMBERS,
    MEMBER_CATEGORIES,
    MEMBER_STATUS
  };

})();