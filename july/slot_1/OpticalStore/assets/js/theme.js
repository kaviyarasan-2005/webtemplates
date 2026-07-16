/**
 * theme.js – VisionCare Optical
 * Dark/Light mode toggle + RTL/LTR toggle
 * Persists preferences in localStorage, detects system preference
 */

(function () {
  'use strict';

  /* ── Constants ── */
  const THEME_KEY = 'vc-theme';
  const DIR_KEY   = 'vc-direction';

  /* ── Theme Management ── */
  const ThemeManager = {
    init() {
      const saved  = localStorage.getItem(THEME_KEY);
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      this.apply(saved || system);

      // Watch for system preference changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
          this.apply(e.matches ? 'dark' : 'light');
        }
      });
    },

    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);
      this.updateIcons(theme);
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      this.apply(current === 'dark' ? 'light' : 'dark');
    },

    updateIcons(theme) {
      const btns = document.querySelectorAll('[data-theme-toggle]');
      btns.forEach(btn => {
        const icon  = btn.querySelector('i');
        const label = btn.querySelector('.toggle-label');
        if (icon) {
          icon.className = theme === 'dark'
            ? 'fa-solid fa-sun'
            : 'fa-solid fa-moon';
        }
        if (label) {
          label.textContent = theme === 'dark' ? 'Light' : 'Dark';
        }
        btn.setAttribute('aria-label',
          theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        btn.setAttribute('title',
          theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      });
    },

    get current() {
      return document.documentElement.getAttribute('data-theme') || 'light';
    }
  };

  /* ── Direction Management ── */
  const DirectionManager = {
    init() {
      const saved = localStorage.getItem(DIR_KEY) || 'ltr';
      this.apply(saved);
    },

    apply(dir) {
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
      localStorage.setItem(DIR_KEY, dir);
      this.updateButtons(dir);
    },

    toggle() {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      this.apply(current === 'ltr' ? 'rtl' : 'ltr');
    },

    updateButtons(dir) {
      const btns = document.querySelectorAll('[data-dir-toggle]');
      btns.forEach(btn => {
        const label = btn.querySelector('.toggle-label');
        const icon  = btn.querySelector('i');
        if (label) label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
        if (icon)  icon.className = dir === 'rtl'
          ? 'fa-solid fa-align-left'
          : 'fa-solid fa-align-right';
        btn.setAttribute('aria-label',
          dir === 'rtl' ? 'Switch to left-to-right' : 'Switch to right-to-left');
        btn.setAttribute('title',
          dir === 'rtl' ? 'Switch to LTR layout' : 'Switch to RTL layout');
      });
    },

    get current() {
      return document.documentElement.getAttribute('dir') || 'ltr';
    }
  };

  /* ── Bind click events after DOM loads ── */
  document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle buttons
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => ThemeManager.toggle());
    });

    // Direction toggle buttons
    document.querySelectorAll('[data-dir-toggle]').forEach(btn => {
      btn.addEventListener('click', () => DirectionManager.toggle());
    });
  });

  /* ── Initialize immediately (before paint) ── */
  ThemeManager.init();
  DirectionManager.init();

  /* ── Expose to global scope ── */
  window.VCTheme = ThemeManager;
  window.VCDir   = DirectionManager;
})();
