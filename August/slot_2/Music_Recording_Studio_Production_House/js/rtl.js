/* ============================================================
   SoundForge Studios — RTL / LTR Direction Manager
   ============================================================ */

const DirectionManager = (() => {
  const STORAGE_KEY = 'soundforge-dir';
  const RTL = 'rtl';
  const LTR = 'ltr';

  /* ── Read stored direction ─────────────────────────────── */
  const storedDir = () => localStorage.getItem(STORAGE_KEY) || LTR;

  /* ── Apply direction to DOM ────────────────────────────── */
  const applyDirection = (dir) => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang',
      dir === RTL ? 'ar' : 'en'
    );
    updateToggleButtons(dir);
  };

  /* ── Update all toggle buttons ──────────────────────────── */
  const updateToggleButtons = (dir) => {
    const btns = document.querySelectorAll('[data-dir-toggle]');
    btns.forEach((btn) => {
      const icon = btn.querySelector('i');
      if (!icon) return;
      if (dir === RTL) {
        icon.className = 'ri-text-direction-l';
        btn.setAttribute('aria-label', 'Switch to LTR layout');
        btn.setAttribute('title', 'Switch to LTR layout');
        btn.querySelector('.dir-label') &&
          (btn.querySelector('.dir-label').textContent = 'LTR');
      } else {
        icon.className = 'ri-text-direction-r';
        btn.setAttribute('aria-label', 'Switch to RTL layout');
        btn.setAttribute('title', 'Switch to RTL layout');
        btn.querySelector('.dir-label') &&
          (btn.querySelector('.dir-label').textContent = 'RTL');
      }
    });
  };

  /* ── Toggle RTL ↔ LTR ──────────────────────────────────── */
  const toggle = () => {
    const current = document.documentElement.getAttribute('dir') || LTR;
    const next    = current === RTL ? LTR : RTL;
    localStorage.setItem(STORAGE_KEY, next);
    applyDirection(next);
  };

  /* ── Init ─────────────────────────────────────────────── */
  const init = () => {
    applyDirection(storedDir());
    document.querySelectorAll('[data-dir-toggle]').forEach((btn) => {
      btn.addEventListener('click', toggle);
    });
  };

  return { init, toggle };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', DirectionManager.init);
} else {
  DirectionManager.init();
}
