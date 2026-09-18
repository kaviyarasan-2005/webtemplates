/* ============================================================
   SoundForge Studios — Theme Manager (Dark / Light)
   ============================================================ */

const ThemeManager = (() => {
  const STORAGE_KEY = 'soundforge-theme';
  const DARK        = 'dark';
  const LIGHT       = 'light';

  /* ── Detect system preference ──────────────────────────── */
  const systemPrefersDark = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  /* ── Read stored preference ─────────────────────────────── */
  const storedTheme = () => localStorage.getItem(STORAGE_KEY);

  /* ── Resolve active theme ───────────────────────────────── */
  const resolveTheme = () =>
    storedTheme() || (systemPrefersDark() ? DARK : LIGHT);

  /* ── Apply theme to DOM ─────────────────────────────────── */
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleButtons(theme);
    updateMetaTheme(theme);
  };

  /* ── Update all toggle buttons ──────────────────────────── */
  const updateToggleButtons = (theme) => {
    const btns = document.querySelectorAll('[data-theme-toggle]');
    btns.forEach((btn) => {
      const icon = btn.querySelector('i');
      if (!icon) return;
      if (theme === DARK) {
        icon.className = 'ri-sun-line';
        btn.setAttribute('aria-label', 'Switch to light mode');
        btn.setAttribute('title', 'Switch to light mode');
      } else {
        icon.className = 'ri-moon-fill';
        btn.setAttribute('aria-label', 'Switch to dark mode');
        btn.setAttribute('title', 'Switch to dark mode');
      }
    });
  };

  /* ── Update browser meta theme-color ────────────────────── */
  const updateMetaTheme = (theme) => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === DARK ? '#0B0910' : '#F7F5F9');
    }
  };

  /* ── Toggle between themes ──────────────────────────────── */
  const toggle = () => {
    const current = document.documentElement.getAttribute('data-theme') || LIGHT;
    const next    = current === DARK ? LIGHT : DARK;
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  /* ── Init ────────────────────────────────────────────────── */
  const init = () => {
    applyTheme(resolveTheme());

    /* Attach to all theme toggle buttons */
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', toggle);
    });

    /* Listen for OS-level preference changes */
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!storedTheme()) {
          applyTheme(e.matches ? DARK : LIGHT);
        }
      });
  };

  return { init, toggle, resolveTheme };
})();

/* ── Auto-init on DOM ready ──────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ThemeManager.init);
} else {
  ThemeManager.init();
}
