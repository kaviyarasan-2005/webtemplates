/* ==========================================
   SEWIT — Blog Page JavaScript
   Category filter, search, pagination, newsletter
   ========================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initBlogFilter();
  initBlogSearch();
  initBlogPagination();
  initBlogNewsletter();
});

function initBlogFilter() {
  const filterBar = document.getElementById('blog-filters');
  const grid = document.getElementById('blog-grid');
  if (!filterBar || !grid) return;

  const buttons = filterBar.querySelectorAll('.filter-btn');
  const cards = grid.querySelectorAll('.blog-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      buttons.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        }
      });
    });
  });
}

function initBlogSearch() {
  const searchInput = document.getElementById('blog-search');
  const grid = document.getElementById('blog-grid');
  if (!searchInput || !grid) return;

  const cards = grid.querySelectorAll('.blog-card');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    cards.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const text = card.textContent.toLowerCase();
      const match = !query || title.includes(query) || text.includes(query);
      card.style.display = match ? '' : 'none';
    });

    // Reset category filters
    const filterBtns = document.querySelectorAll('#blog-filters .filter-btn');
    filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    const allBtn = document.querySelector('#blog-filters [data-filter="all"]');
    if (allBtn) allBtn.classList.add('filter-btn--active');
  });
}

function initBlogPagination() {
  const paginationBtns = document.querySelectorAll('.pagination__btn');
  paginationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Only handle number buttons (not prev/next arrows)
      if (btn.querySelector('i')) return;
      paginationBtns.forEach(b => b.classList.remove('pagination__btn--active'));
      btn.classList.add('pagination__btn--active');
    });
  });
}

function initBlogNewsletter() {
  const form = document.getElementById('blog-newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value) {
      input.value = '';
      alert('Thank you for subscribing! You\'ll receive weekly tips every Wednesday.');
    }
  });
}
