/**
 * DEAL — Core: Theme Toggle, RTL Toggle, Navbar scroll behaviour
 */
(function () {
  'use strict';

  /* ── Theme ── */
  const THEME_KEY = 'deal-theme';
  const html = document.documentElement;

  function getTheme () {
    return localStorage.getItem(THEME_KEY) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyTheme (theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    // Update all toggle icons
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const sun  = btn.querySelector('.icon-sun');
      const moon = btn.querySelector('.icon-moon');
      if (sun)  sun.style.display  = theme === 'dark' ? 'none' : 'block';
      if (moon) moon.style.display = theme === 'dark' ? 'block' : 'none';
    });
  }

  function toggleTheme () {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  /* ── RTL ── */
  const DIR_KEY = 'deal-dir';

  function getDir () { return localStorage.getItem(DIR_KEY) || 'ltr'; }

  function applyDir (dir) {
    html.setAttribute('dir', dir);
    localStorage.setItem(DIR_KEY, dir);
    // Update button labels
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR layout' : 'Switch to RTL layout');
    });
  }

  function toggleDir () {
    applyDir(getDir() === 'rtl' ? 'ltr' : 'rtl');
  }

  /* ── Navbar scroll ── */
  function initNavScroll () {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active link ── */
  function markActiveLink () {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .drawer-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ── Init ── */
  function init () {
    applyTheme(getTheme());
    applyDir(getDir());
    initNavScroll();
    markActiveLink();

    document.addEventListener('click', e => {
      if (e.target.closest('[data-theme-toggle]')) toggleTheme();
      if (e.target.closest('[data-rtl-toggle]')) toggleDir();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
  } else {
    setTimeout(init, 0);
  }
})();
