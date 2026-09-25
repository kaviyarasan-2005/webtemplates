/**
 * DEAL — Animations: IntersectionObserver fade-up + animated counters
 */
(function () {
  'use strict';

  /* ── Scroll-reveal observer ── */
  function initScrollReveal () {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in').forEach(el => {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in').forEach(el => {
      observer.observe(el);
    });
  }

  /* ── Animated counters ── */
  function animateCounter (el) {
    const target   = parseFloat(el.dataset.target || 0);
    const decimals = (el.dataset.target || '').includes('.') ? 1 : 0;
    const duration = parseInt(el.dataset.duration || 2000);
    const start    = performance.now();

    function step (now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value  = eased * target;
      el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters () {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-counter]').forEach(animateCounter);
      return;
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('[data-counter]').forEach(el => {
      counterObserver.observe(el);
    });
  }

  /* ── Init ── */
  function init () {
    initScrollReveal();
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
  } else {
    setTimeout(init, 0);
  }
})();
