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
    COMMANDER: 'commander'
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

  // Individual member definitions - Easy to add/remove members
  const MEMBERS = {
    naufal: {
      name: 'Naufal MrSov',
      title: 'Kreator / Leader',
      description: 'Pembuat StickNext Saga Rail, ahli desain stiker dan pengembang proyek komunitas.',
      img: 'Naufal Mrsov.images.jpg',
      works: ['StickMazz', 'StickNext', 'StickBot'],
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
      img: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUI5QkE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPk5vIEF2YXRhcjwvdGV4dD4KPC9zdmc+',
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
    }
  };

  // ==========================================
  // EXPORTS
  // ==========================================

  // Make data available globally
  window.AnggotaData = {
    MEMBERS,
    MEMBER_CATEGORIES,
    MEMBER_STATUS
  };

})();