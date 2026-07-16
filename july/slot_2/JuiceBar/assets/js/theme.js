/* ============================================================
   ZEST & BLEND — JavaScript: Theme (Dark/Light) Toggle
   ============================================================ */
'use strict';

const ThemeManager = (() => {
  const STORAGE_KEY = 'zb-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleButton(theme);
  }

  function updateToggleButton(theme) {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const isDark = theme === DARK;
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('title', isDark ? 'Light mode' : 'Dark mode');
    // Update icon via data attribute
    btn.setAttribute('data-theme-current', theme);
    // Update lucide icon
    const sunIcon = btn.querySelector('[data-lucide="sun"]');
    const moonIcon = btn.querySelector('[data-lucide="moon"]');
    if (sunIcon && moonIcon) {
      sunIcon.style.display = isDark ? 'block' : 'none';
      moonIcon.style.display = isDark ? 'none' : 'block';
    }
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || LIGHT;
    applyTheme(current === DARK ? LIGHT : DARK);
  }

  function init() {
    const saved = getSavedTheme();
    const theme = saved || getSystemPreference();
    applyTheme(theme);

    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', toggle);
    }

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getSavedTheme()) {
        applyTheme(e.matches ? DARK : LIGHT);
      }
    });
  }

  return { init, toggle, applyTheme };
})();

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ThemeManager.init);
} else {
  ThemeManager.init();
}
