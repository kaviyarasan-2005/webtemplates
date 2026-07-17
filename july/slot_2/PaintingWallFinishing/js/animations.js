/**
 * MediCare Plus — animations.js
 * Scroll-triggered animations using IntersectionObserver.
 * Also handles: counter animation, hero parallax, skeleton loaders.
 */

/* ── Scroll Animations ────────────────────────────────────────── */
const ANIMATION_MAP = {
  fadeInUp:   'animate-fadeInUp',
  fadeIn:     'animate-fadeIn',
  slideInLeft:'animate-slideInLeft',
  slideInRight:'animate-slideInRight',
  scaleIn:    'animate-scaleIn',
};

function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const type   = el.dataset.animate;
        const delay  = parseInt(el.dataset.delay || '0', 10);
        const cls    = ANIMATION_MAP[type] || 'animate-fadeIn';

        setTimeout(() => {
          el.classList.add(cls, 'animated');
          el.style.opacity = '1';
        }, delay);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

/* ── Counter Animations ───────────────────────────────────────── */
function animateCounter(el, end, duration = 1600) {
  const start = 0;
  const step  = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    // Ease-out quad
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(eased * end);
    el.textContent = current.toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = end.toLocaleString('en-IN');
  };
  let startTime = null;
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el  = entry.target;
        const end = parseInt(el.getAttribute('data-counter'), 10);
        animateCounter(el, end);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── Float animation for 404 icon ────────────────────────────── */
function injectKeyframes() {
  if (document.getElementById('medicare-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'medicare-keyframes';
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-12px); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-32px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(32px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.88); }
      to   { opacity: 1; transform: scale(1); }
    }
    .animate-fadeInUp    { animation: fadeInUp    0.6s ease forwards; }
    .animate-fadeIn      { animation: fadeIn      0.6s ease forwards; }
    .animate-slideInLeft { animation: slideInLeft 0.6s ease forwards; }
    .animate-slideInRight{ animation: slideInRight 0.6s ease forwards; }
    .animate-scaleIn     { animation: scaleIn     0.5s ease forwards; }
  `;
  document.head.appendChild(style);
}

/* ── Navbar scroll-link smooth behavior ──────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const navH = document.getElementById('navbar')?.offsetHeight || 80;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
}

/* ── Brands ticker ───────────────────────────────────────────── */
function initBrandsTicker() {
  const track = document.querySelector('.brands-track');
  if (!track) return;
  // CSS handles animation via layout.css — just ensure no JS override
}

/* ── Skip Link ───────────────────────────────────────────────── */
function initSkipLink() {
  if (document.getElementById('skip-link')) return;
  const skip = document.createElement('a');
  skip.id = 'skip-link';
  skip.href = '#main-content';
  skip.textContent = 'Skip to main content';
  skip.style.cssText = `
    position:fixed;top:-100px;left:var(--sp-4);z-index:9999;
    background:var(--clr-primary);color:#fff;padding:var(--sp-2) var(--sp-4);
    border-radius:var(--radius-md);font-weight:600;text-decoration:none;
    transition:top 0.2s;
  `;
  skip.addEventListener('focus', () => { skip.style.top = '16px'; });
  skip.addEventListener('blur',  () => { skip.style.top = '-100px'; });
  document.body.insertBefore(skip, document.body.firstChild);
}

/* ── Init ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectKeyframes();
  initSkipLink();
  initScrollAnimations();
  initCounters();
  initSmoothScroll();
  initBrandsTicker();
});
