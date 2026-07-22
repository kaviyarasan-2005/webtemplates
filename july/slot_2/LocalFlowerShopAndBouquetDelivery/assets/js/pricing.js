/* ============================================
   BLOOM — Pricing Page JavaScript
   Add-on filters
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initAddonFilters();
});

function initAddonFilters() {
  const filterBtns = document.querySelectorAll('#addon-filters .tag');
  const addonCards = document.querySelectorAll('#addon-grid .addon-card');

  if (!filterBtns.length || !addonCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      addonCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
