'use strict';

// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const cityMenu = nav ? nav.querySelector('.city-menu') : null;

if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (e) => {
    if (cityMenu && cityMenu.hasAttribute('open') && !cityMenu.contains(e.target)) {
      cityMenu.removeAttribute('open');
    }

    if (!burger.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });

  if (cityMenu) {
    cityMenu.querySelectorAll('.city-menu__item').forEach((item) => {
      item.addEventListener('click', () => {
        cityMenu.removeAttribute('open');
      });
    });
  }
}

// ===== STICKY HEADER SHADOW =====
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 24px rgba(0,0,0,.1)'
      : '0 2px 12px rgba(0,0,0,.06)';
  }, { passive: true });
}

// ===== PHONE MASK =====
function applyPhoneMask(input) {
  input.addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '');
    if (val.startsWith('8')) val = '7' + val.slice(1);
    if (!val.startsWith('7')) val = '7' + val;
    val = val.slice(0, 11);

    let result = '+7';
    if (val.length > 1) result += ' (' + val.slice(1, 4);
    if (val.length > 4) result += ') ' + val.slice(4, 7);
    if (val.length > 7) result += '-' + val.slice(7, 9);
    if (val.length > 9) result += '-' + val.slice(9, 11);

    this.value = result;
  });

  input.addEventListener('focus', function () {
    if (!this.value) this.value = '+7 (';
  });

  input.addEventListener('blur', function () {
    if (this.value === '+7 (') this.value = '';
  });
}

document.querySelectorAll('input[type="tel"]').forEach(applyPhoneMask);

// ===== MODALS =====
const applicationModal = document.getElementById('modal-application');
const applicationModalTitle = document.getElementById('application-modal-title');
const applicationModalDescription = document.getElementById('application-modal-description');
const modalRequestTopic = document.getElementById('modal-request-topic');

let activeModal = null;
let lastModalTrigger = null;

function openModal(modalId, trigger = null) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  if (activeModal && activeModal !== modal) {
    closeModal(activeModal, false);
  }

  activeModal = modal;
  if (trigger) lastModalTrigger = trigger;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const focusTarget = modal.querySelector('input:not([type="hidden"]), textarea, select')
    || modal.querySelector('button, a');
  if (focusTarget) focusTarget.focus();
}

function closeModal(targetModal = activeModal, restoreFocus = true) {
  if (!targetModal) return;

  targetModal.classList.remove('open');
  targetModal.setAttribute('aria-hidden', 'true');

  if (activeModal === targetModal) {
    activeModal = null;
    document.body.style.overflow = '';
  }

  if (restoreFocus && lastModalTrigger) {
    lastModalTrigger.focus();
  }
}

function fillApplicationModal(trigger) {
  if (!applicationModal) return;

  const title = trigger?.dataset.modalTitle || 'Оставьте заявку на подключение';
  const requestTopic = trigger?.dataset.requestTopic || 'Общая заявка';

  if (applicationModalTitle) {
    applicationModalTitle.textContent = title;
  }

  if (applicationModalDescription) {
    applicationModalDescription.textContent = 'Оставьте контакты, и мы свяжемся с вами в течение 15 минут.';
  }

  if (modalRequestTopic) {
    modalRequestTopic.value = requestTopic;
  }
}

document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    fillApplicationModal(trigger);
    openModal(trigger.dataset.openModal, trigger);
  });
});

document.querySelectorAll('[data-close-modal]').forEach((control) => {
  control.addEventListener('click', () => {
    const parentModal = control.closest('.modal');
    closeModal(parentModal);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ===== FORM SUBMIT =====
function handleFormSubmit(form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.textContent : '';

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Отправляем...';
    }

    // Имитация отправки. Здесь можно подключить fetch к backend API.
    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalText;
      }

      form.reset();
      closeModal(form.closest('.modal'), false);
      openModal('modal-success');

      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', { event_category: 'form', event_label: form.id });
      }

      if (typeof ym !== 'undefined' && typeof window.yaCounterId !== 'undefined') {
        ym(window.yaCounterId, 'reachGoal', 'form_submit');
      }
    }, 800);
  });
}

document.querySelectorAll('form').forEach(handleFormSubmit);

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq__question').forEach((btn) => {
  btn.addEventListener('click', function () {
    const item = this.closest('.faq__item');
    const isOpen = item.classList.contains('active');

    document.querySelectorAll('.faq__item').forEach((el) => {
      el.classList.remove('active');
      el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('active');
      this.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== TARIFF FILTERS =====
const tariffFilterButtons = document.querySelectorAll('.tariffs__filter[data-tariff-panel]');
const tariffPanels = document.querySelectorAll('.tariffs__panel');

if (tariffFilterButtons.length && tariffPanels.length) {
  tariffFilterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.tariffPanel;

      tariffFilterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('tariffs__filter--active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });

      tariffPanels.forEach((panel) => {
        panel.hidden = panel.id !== targetId;
      });
    });
  });
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll(
  '.advantage-card, .tariff-card, .step, .faq__item'
).forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 4 === 1) el.classList.add('reveal-delay-1');
  if (i % 4 === 2) el.classList.add('reveal-delay-2');
  if (i % 4 === 3) el.classList.add('reveal-delay-3');
  revealObserver.observe(el);
});

// ===== ANCHOR SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// ===== COUNTDOWN TIMER =====
function startCountdown() {
  const badges = document.querySelectorAll('.hero__badge');
  if (!badges.length) return;

  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  function update() {
    const diff = endOfMonth - new Date();
    if (diff <= 0) return;

    const days = Math.floor(diff / 864e5);
    const hours = Math.floor((diff % 864e5) / 36e5);

    if (days > 0 && days <= 7) {
      badges.forEach((badge) => {
        if (!badge.dataset.originalText) badge.dataset.originalText = badge.textContent;
        badge.textContent = `Акция заканчивается через ${days} дн. ${hours} ч.`;
      });
    }
  }

  update();
  setInterval(update, 60000);
}

startCountdown();

// ===== ACTIVE NAV ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach((section) => {
    if (window.pageYOffset >= section.offsetTop - 100) {
      current = '#' + section.id;
    }
  });

  navLinks.forEach((link) => {
    link.style.color = link.getAttribute('href') === current ? 'var(--blue)' : '';
    link.style.fontWeight = link.getAttribute('href') === current ? '700' : '';
  });
}, { passive: true });
