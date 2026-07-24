/* ============================================================
   ZEST & BLEND — JavaScript: RTL/LTR Toggle
   ============================================================ */
'use strict';

const RTLManager = (() => {
  const STORAGE_KEY = 'zb-dir';
  const RTL = 'rtl';
  const LTR = 'ltr';

  function getStoredDir() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === RTL ? 'ar' : 'en');
    localStorage.setItem(STORAGE_KEY, dir);
    updateToggleButton(dir);
  }

  function updateToggleButton(dir) {
    const btn = document.getElementById('rtlToggle');
    if (!btn) return;
    const isRTL = dir === RTL;
    btn.setAttribute('aria-label', isRTL ? 'Switch to LTR mode' : 'Switch to RTL mode');
    btn.setAttribute('title', isRTL ? 'LTR' : 'RTL');
    btn.setAttribute('data-dir-current', dir);

    const label = btn.querySelector('.rtl-label');
    if (label) {
      label.textContent = isRTL ? 'LTR' : 'RTL';
    }
  }

  function toggle() {
    const current = document.documentElement.getAttribute('dir') || LTR;
    applyDir(current === RTL ? LTR : RTL);
  }

  function init() {
    const saved = getStoredDir();
    if (saved) {
      applyDir(saved);
    } else {
      applyDir(LTR); // Default
    }

    const btn = document.getElementById('rtlToggle');
    if (btn) {
      btn.addEventListener('click', toggle);
    }
  }

  return { init, toggle, applyDir };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', RTLManager.init);
} else {
  RTLManager.init();
}
