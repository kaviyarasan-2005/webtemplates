/* ==========================================
   SEWIT — Pricing Page JavaScript
   Fabric category filter
   ========================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initFabricFilter();
});

function initFabricFilter() {
  const filterBar = document.getElementById('fabric-filters');
  const grid = document.getElementById('fabric-grid');

  if (!filterBar || !grid) return;

  const buttons = filterBar.querySelectorAll('.filter-btn');
  const cards = grid.querySelectorAll('.fabric-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      buttons.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      // Filter cards
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          // Trigger re-animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
