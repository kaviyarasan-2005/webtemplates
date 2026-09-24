/**
 * DEAL — Service Details JS
 */
(function () {
  'use strict';

  /* ── Document Fold Tabs ── */
  function initDocTabs () {
    const tabs = document.querySelectorAll('.doc-tab');
    const bodies = document.querySelectorAll('.doc-body-inner');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.dataset.target;
        tabs.forEach(t => t.classList.remove('active'));
        bodies.forEach(b => b.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(targetId)?.classList.add('active');
      });
    });
  }

  /* ── Flip Panel FAQ ── */
  function initFlippers () {
    const tiles = document.querySelectorAll('.faq-tile');
    tiles.forEach(tile => {
      tile.addEventListener('click', () => {
        tile.classList.toggle('flipped');
      });
    });
  }

  /* ── Rail Controls ── */
  function initRail () {
    const track = document.querySelector('.rail-track');
    const btnLeft = document.getElementById('rail-prev');
    const btnRight = document.getElementById('rail-next');
    if (!track || !btnLeft || !btnRight) return;

    btnLeft.addEventListener('click', () => {
      track.scrollBy({ left: -300, behavior: 'smooth' });
    });
    btnRight.addEventListener('click', () => {
      track.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDocTabs();
    initFlippers();
    initRail();
  });
})();
