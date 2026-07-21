/**
 * Pulse — theme.js
 * Handles dark/light mode and RTL/LTR toggle.
 */

const THEME_KEY = 'Pulse-theme';
const DIR_KEY   = 'Pulse-dir';

export function getTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
}

export function getDir() {
  try {
    const stored = localStorage.getItem(DIR_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return 'ltr';
}

export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(THEME_KEY, JSON.stringify(theme)); } catch {}
  syncIcons();
}

export function setDir(dir) {
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
  try { localStorage.setItem(DIR_KEY, JSON.stringify(dir)); } catch {}
  syncIcons();
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

export function toggleDir() {
  const current = document.documentElement.getAttribute('dir') || 'ltr';
  setDir(current === 'rtl' ? 'ltr' : 'rtl');
}

export function syncIcons() {
  const theme = document.documentElement.getAttribute('data-theme');
  const dir   = document.documentElement.getAttribute('dir') || 'ltr';
  const isDark = theme === 'dark';

  // All theme icons on page
  document.querySelectorAll('#themeIcon, #themeIconMobile').forEach(icon => {
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  });

  // All RTL toggles text
  document.querySelectorAll('#rtlText, #rtlTextMobile').forEach(el => {
    el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    el.style.fontSize = '0.9rem';
    el.style.fontWeight = 'var(--fw-bold)';
    el.style.fontFamily = 'var(--font-base)';
  });

  // Aria labels
  document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(btn => {
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
  document.querySelectorAll('#rtlToggle, #rtlToggleMobile').forEach(btn => {
    btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR layout' : 'Switch to RTL layout');
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  // Already applied by inline script to prevent flash — just sync icons
  setTimeout(syncIcons, 100);

  // Wire up standalone toggles (for pages without components.js)
  const themeToggle = document.getElementById('themeToggle');
  const rtlToggle   = document.getElementById('rtlToggle');
  if (themeToggle && !themeToggle.dataset.bound) {
    themeToggle.dataset.bound = '1';
    themeToggle.addEventListener('click', toggleTheme);
  }
  if (rtlToggle && !rtlToggle.dataset.bound) {
    rtlToggle.dataset.bound = '1';
    rtlToggle.addEventListener('click', toggleDir);
  }
});

// Listen for storage changes (sync across tabs)
window.addEventListener('storage', (e) => {
  if (e.key === THEME_KEY && e.newValue) {
    document.documentElement.setAttribute('data-theme', JSON.parse(e.newValue));
    syncIcons();
  }
  if (e.key === DIR_KEY && e.newValue) {
    const dir = JSON.parse(e.newValue);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    syncIcons();
  }
});
