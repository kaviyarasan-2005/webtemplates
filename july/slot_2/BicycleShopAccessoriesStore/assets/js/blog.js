/**
 * VELOX — Blog JavaScript
 * blog.js — Filter, pagination, search
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ─── Blog Filter ─────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('[data-blog-cat]');
  const searchInput = document.getElementById('blog-search');

  let currentFilter = 'all';
  let searchTerm = '';

  const applyFilters = () => {
    blogCards.forEach(card => {
      const cat = card.dataset.blogCat;
      const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
      const excerpt = card.querySelector('p')?.textContent?.toLowerCase() || '';
      const matchesFilter = currentFilter === 'all' || cat === currentFilter;
      const matchesSearch = !searchTerm || title.includes(searchTerm) || excerpt.includes(searchTerm);

      if (matchesFilter && matchesSearch) {
        card.style.display = '';
        setTimeout(() => card.classList.add('visible'), 10);
      } else {
        card.style.display = 'none';
      }
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.blogFilter;
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchTerm = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // ─── Pagination (simulated) ────────────────────────────────
  const pageBtns = document.querySelectorAll('.page-btn');
  pageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('prev') || btn.classList.contains('next')) return;
      pageBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
});
