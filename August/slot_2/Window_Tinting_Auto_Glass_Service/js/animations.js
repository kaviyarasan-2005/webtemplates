/* ============================================================
   Tintex — Animations (Intersection Observer)
   ============================================================ */
const AnimationManager = (() => {
  'use strict';
  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(el => obs.observe(el));
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  }

  function animateCounter(el) {
    const target   = parseFloat(el.getAttribute('data-count'));
    const suffix   = el.getAttribute('data-suffix') || '';
    const prefix   = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const steps    = duration / 16;
    let current    = 0;
    const inc      = target / steps;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(current) : current.toFixed(1)) + suffix;
    }, 16);
  }

  return { init, initCounters };
})();

document.addEventListener('DOMContentLoaded', () => {
  AnimationManager.init();
  AnimationManager.initCounters();
});
