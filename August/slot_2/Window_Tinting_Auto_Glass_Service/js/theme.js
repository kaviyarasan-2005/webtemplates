/* ============================================================
   Tintex — Theme & RTL Manager
   ============================================================ */
const ThemeManager = (() => {
  'use strict';
  const THEME_KEY = 'cs-theme';
  const DIR_KEY   = 'cs-dir';
  const html = document.documentElement;

  const getSystem = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const saved     = (k, def) => localStorage.getItem(k) || def;

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function applyDir(d) {
    html.setAttribute('dir', d);
    localStorage.setItem(DIR_KEY, d);
    const btn = document.getElementById('rtl-toggle');
    if (!btn) return;
    const lbl = btn.querySelector('.navbar__control-label');
    if (lbl) lbl.textContent = d === 'rtl' ? 'LTR' : 'RTL';
    btn.setAttribute('aria-label', d === 'rtl' ? 'Switch to LTR layout' : 'Switch to RTL layout');
  }

  function init() {
    applyTheme(saved(THEME_KEY, getSystem()));
    applyDir(saved(DIR_KEY, 'ltr'));

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', () => {
      applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    const rtlBtn = document.getElementById('rtl-toggle');
    if (rtlBtn) rtlBtn.addEventListener('click', () => {
      applyDir(html.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl');
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', ThemeManager.init);
