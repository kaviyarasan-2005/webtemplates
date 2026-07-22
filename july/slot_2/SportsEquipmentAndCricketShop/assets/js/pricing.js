/* ============================================
   PLAY — Pricing Page Interactions
   Category Filters, Interactive Elements
   ============================================ */

(function() {
  'use strict';

  function initEquipmentFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.price-list-item');
    const indicator = document.getElementById('categoryIndicator');

    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter;

        // Toggle active button class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update category running indicator text
        if (indicator) {
          indicator.textContent = btn.textContent;
        }

        // Show/Hide items with animation
        items.forEach(item => {
          if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'flex';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  function init() {
    initEquipmentFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
