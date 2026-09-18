/**
 * RTL Manager — GoldCrest Engravings
 * Handles Right-to-Left / Left-to-Right layout direction toggle
 */

const RTLManager = (() => {
  const STORAGE_KEY = 'goldcrest-dir';
  const RTL = 'rtl';
  const LTR = 'ltr';

  const getStoredDir = () => localStorage.getItem(STORAGE_KEY);

  const applyDir = (dir) => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.lang = dir === RTL ? 'ar' : 'en';
    localStorage.setItem(STORAGE_KEY, dir);
    updateButton(dir);
  };

  const updateButton = (dir) => {
    const btn = document.getElementById('rtl-toggle');
    const label = document.getElementById('rtl-label');
    if (!btn) return;

    if (dir === RTL) {
      btn.setAttribute('aria-label', 'Switch to Left-to-Right layout');
      btn.setAttribute('aria-pressed', 'true');
      btn.classList.add('active');
      if (label) label.textContent = 'LTR';
    } else {
      btn.setAttribute('aria-label', 'Switch to Right-to-Left layout');
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('active');
      if (label) label.textContent = 'RTL';
    }
  };

  const toggle = () => {
    const current = document.documentElement.getAttribute('dir') || LTR;
    applyDir(current === RTL ? LTR : RTL);
  };

  const init = () => {
    const stored = getStoredDir();
    const dir = stored || LTR;
    document.documentElement.setAttribute('dir', dir);

    document.addEventListener('DOMContentLoaded', () => {
      updateButton(dir);
      const btn = document.getElementById('rtl-toggle');
      if (btn) btn.addEventListener('click', toggle);
    });
  };

  return { init, toggle, applyDir };
})();

RTLManager.init();
