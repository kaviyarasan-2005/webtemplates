/**
 * DEAL — Pricing JS
 */
(function () {
  'use strict';

  function initScopeToggle () {
    const btns = document.querySelectorAll('.scope-toggle-btn');
    const contents = document.querySelectorAll('.scope-content');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        btns.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(targetId)?.classList.add('active');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initScopeToggle);
})();
