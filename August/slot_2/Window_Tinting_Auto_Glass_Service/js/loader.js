/* ============================================================
   Tintex — Page Loader
   ============================================================ */
const LoaderManager = (() => {
  'use strict';
  function init() {
    const bar = document.createElement('div');
    bar.id = 'page-loader';
    bar.innerHTML = '<div class="page-loader__bar"></div>';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);
    function hide() { bar.classList.add('done'); setTimeout(() => bar.remove(), 500); }
    if (document.readyState === 'complete') { hide(); }
    else { window.addEventListener('load', hide); setTimeout(hide, 3000); }
  }
  return { init };
})();

document.addEventListener('DOMContentLoaded', LoaderManager.init);
