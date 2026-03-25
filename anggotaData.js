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
    VISIONARY: 'visionary' // kategori baru khusus untuk kreator kosmik
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
      img: 'Lea.jpeg', // bisa diganti dengan foto/avatar kamu
      works: ['StickNext Universe', 'StickNext Go to Future', 'Audio Lounge Kosmik', 'Loader Planet Berputar'],
      status: MEMBER_STATUS.ACTIVE,
      badge: MEMBER_CATEGORIES.VISIONARY,
      joinDate: '2024-07-01',
      level: 10
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