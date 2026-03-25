// modal.js - Modal behavior for Anggota page

const modal = document.getElementById('member-modal');
const modalImg = document.getElementById('modal-image'); // fix id reference
const modalName = document.getElementById('modal-name');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalWorks = document.getElementById('modal-works-list');
const modalBadge = document.getElementById('modal-badge');
const modalCloseButton = document.querySelector('.modal-close');

function safeElement(element, fallback = null) {
  return element || fallback;
}


let touchStartY = 0;
let touchStartX = 0;
let isDragging = false;

function openModal(member) {
  if (modalImg) modalImg.src = member.img;
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

  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'block';

    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  }

  if (isMobile) {
    triggerHapticFeedback();
  }

  modal.style.display = 'block';

  setTimeout(() => {
    modal.classList.add('show');
  }, 10);

  if (isMobile) {
    triggerHapticFeedback();
  }
}

function closeModal() {
  if (!modal) {
    return;
  }
  modal.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('active');
    modal.style.transform = '';
    modal.style.opacity = '';
  }, 180);
}

function initModalInteractions() {
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
    touchStartY = event.touches[0].clientY;
    touchStartX = event.touches[0].clientX;
    isDragging = true;
  });

  modal.addEventListener('touchmove', event => {
    if (!isDragging) return;
    const deltaY = event.touches[0].clientY - touchStartY;
    const deltaX = event.touches[0].clientX - touchStartX;
    if (Math.abs(deltaY) > 70 && Math.abs(deltaY) > Math.abs(deltaX)) {
      modal.style.transform = `translateY(${deltaY}px)`;
      modal.style.opacity = `${1 - Math.abs(deltaY) / 250}`;
    }
  });

  modal.addEventListener('touchend', event => {
    isDragging = false;
    const deltaY = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(deltaY) > 85) {
      closeModal();
      modal.style.transform = '';
      modal.style.opacity = '';
    } else {
      modal.style.transform = '';
      modal.style.opacity = '';
    }
  });
}

// Close with ESC key
window.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeModal();
  }
});
