/* nav.js - harmony navigation + hamburger shared across pages */

(function() {
  const hamburger = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('sidebar');
  const closeBtn = document.getElementById('close-sidebar');
  const mainNav = document.querySelector('.main-nav');
  const body = document.body;

  function setAriaState(expanded) {
    if (hamburger) hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if (sidebar) sidebar.setAttribute('aria-hidden', expanded ? 'false' : 'true');
  }

  function openSidebar() {
    if (!sidebar || !hamburger) return;
    sidebar.classList.add('active');
    hamburger.classList.add('active');
    setAriaState(true);
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Tutup navigasi');
    body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (!sidebar || !hamburger) return;
    sidebar.classList.remove('active');
    hamburger.classList.remove('active');
    setAriaState(false);
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Buka navigasi');
    body.style.overflow = '';
  }

  function toggleSidebar() {
    if (!sidebar) return;
    if (sidebar.classList.contains('active')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  function highlightActiveLink() {
    const current = window.location.pathname.split('/').pop().toLowerCase();
    document.querySelectorAll('.main-nav a, .sidebar a').forEach((link) => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (!href) return;
      if (href === current || (href === 'index.html' && current === '')) {
        link.classList.add('active-link');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active-link');
        link.removeAttribute('aria-current');
      }

      link.addEventListener('click', () => closeSidebar());
    });
  }

  function setupEvents() {
    if (hamburger) {
      hamburger.addEventListener('click', toggleSidebar);
      hamburger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleSidebar();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeSidebar);
    }

    document.addEventListener('click', (event) => {
      if (!sidebar || !hamburger) return;
      const target = event.target;
      if (sidebar.classList.contains('active') && !sidebar.contains(target) && !hamburger.contains(target)) {
        closeSidebar();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
        closeSidebar();
      }
    });

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const header = document.querySelector('header');
      if (header) {
        if (scrollTop > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });
  }

  function init() {
    setAriaState(false);
    highlightActiveLink();
    setupEvents();
  }

  init();
})();