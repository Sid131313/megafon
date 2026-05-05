'use strict';

// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });
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

// ===== MODAL =====
const modal = document.getElementById('modal-success');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');

function openModal() {
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

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

    // Имитация отправки (замените на реальный fetch к вашему API)
    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalText;
      }
      form.reset();
      openModal();

      // Счётчик конверсий (Google Analytics / Яндекс.Метрика)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', { event_category: 'form', event_label: form.id });
      }
      if (typeof ym !== 'undefined') {
        ym(XXXXXXXX, 'reachGoal', 'form_submit');
      }
    }, 800);
  });
}

document.querySelectorAll('form').forEach(handleFormSubmit);

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', function () {
    const item = this.closest('.faq__item');
    const isOpen = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq__item').forEach(el => {
      el.classList.remove('active');
      el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (toggle)
    if (!isOpen) {
      item.classList.add('active');
      this.setAttribute('aria-expanded', 'true');
    }
  });
});

// ===== TARIFF CTA SMOOTH SCROLL TO FORM =====
document.querySelectorAll('.tariff-cta').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const firstInput = target.querySelector('input');
        if (firstInput) setTimeout(() => firstInput.focus(), 600);
      }
    }
  });
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

// Добавляем анимацию к карточкам
document.querySelectorAll(
  '.advantage-card, .tariff-card, .whom-card, .review-card, .step, .faq__item'
).forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 4 === 1) el.classList.add('reveal-delay-1');
  if (i % 4 === 2) el.classList.add('reveal-delay-2');
  if (i % 4 === 3) el.classList.add('reveal-delay-3');
  revealObserver.observe(el);
});

// ===== ANCHOR SMOOTH SCROLL (fallback) =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 70; // высота хедера
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

// ===== COUNTDOWN TIMER (urgency) =====
function startCountdown() {
  const badges = document.querySelectorAll('.hero__badge, .final-cta__badge');
  if (!badges.length) return;

  // Конец месяца
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  function update() {
    const diff = endOfMonth - new Date();
    if (diff <= 0) return;

    const days = Math.floor(diff / 864e5);
    const hours = Math.floor((diff % 864e5) / 36e5);

    if (days > 0 && days <= 7) {
      badges.forEach(b => {
        if (!b.dataset.originalText) b.dataset.originalText = b.textContent;
        b.textContent = `🔥 Акция заканчивается через ${days} дн. ${hours} ч.`;
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
  sections.forEach(section => {
    if (window.pageYOffset >= section.offsetTop - 100) {
      current = '#' + section.id;
    }
  });

  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === current ? 'var(--blue)' : '';
    link.style.fontWeight = link.getAttribute('href') === current ? '700' : '';
  });
}, { passive: true });
