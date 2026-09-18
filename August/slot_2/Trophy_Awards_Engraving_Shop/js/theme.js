/**
 * Theme Manager — GoldCrest Engravings
 * Handles dark/light mode with system preference detection
 */

const ThemeManager = (() => {
  const STORAGE_KEY = 'goldcrest-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  const getSystemPref = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;

  const getStoredTheme = () => localStorage.getItem(STORAGE_KEY);

  const getResolvedTheme = () => getStoredTheme() || getSystemPref();

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === DARK);
    updateToggleButton(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  };

  const updateToggleButton = (theme) => {
    const btn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (!btn || !icon) return;

    if (theme === DARK) {
      icon.className = 'fa-solid fa-sun';
      btn.setAttribute('aria-label', 'Switch to light mode');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      icon.className = 'fa-solid fa-moon';
      btn.setAttribute('aria-label', 'Switch to dark mode');
      btn.setAttribute('aria-pressed', 'false');
    }
  };

  const toggle = () => {
    const current = document.documentElement.getAttribute('data-theme') || LIGHT;
    applyTheme(current === DARK ? LIGHT : DARK);
  };

  const init = () => {
    // Apply on load (no transition flash)
    const theme = getResolvedTheme();
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === DARK);

    // Wire toggle button
    document.addEventListener('DOMContentLoaded', () => {
      updateToggleButton(theme);
      const btn = document.getElementById('theme-toggle');
      if (btn) btn.addEventListener('click', toggle);
    });

    // Listen for OS preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getStoredTheme()) applyTheme(e.matches ? DARK : LIGHT);
    });
  };

  return { init, toggle, applyTheme, getResolvedTheme };
})();

// Initialize immediately to prevent FOUC
ThemeManager.init();
