/*!
 * FESTA — blog.js
 * Category Filter, Search, Pagination
 */
(function () {
  'use strict';

  /* ══════════════════════════════════════════
     1. CATEGORY FILTER
  ══════════════════════════════════════════ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const blogCards  = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      blogCards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
        // Reset reveal
        if (show) {
          card.classList.remove('revealed');
          requestAnimationFrame(() => card.classList.add('revealed'));
        }
      });

      updatePagination();
    });
  });

  /* ══════════════════════════════════════════
     2. SEARCH
  ══════════════════════════════════════════ */
  const searchInput = document.getElementById('blogSearch');

  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    blogCards.forEach(card => {
      const title = card.querySelector('.blog-card-title')?.textContent.toLowerCase() || '';
      const text  = card.querySelector('.blog-card-excerpt')?.textContent.toLowerCase() || '';
      card.style.display = (title.includes(query) || text.includes(query)) ? '' : 'none';
    });
    updatePagination();
  });

  /* ══════════════════════════════════════════
     3. PAGINATION
  ══════════════════════════════════════════ */
  const ITEMS_PER_PAGE = 4;
  let currentPage      = 1;

  function getVisibleCards() {
    return [...blogCards].filter(c => c.style.display !== 'none');
  }

  function renderPage(page) {
    currentPage = page;
    const visible = getVisibleCards();
    const start   = (page - 1) * ITEMS_PER_PAGE;
    const end     = start + ITEMS_PER_PAGE;

    visible.forEach((card, i) => {
      card.style.display = (i >= start && i < end) ? '' : 'none';
    });

    renderPageBtns(Math.ceil(visible.length / ITEMS_PER_PAGE));
  }

  function renderPageBtns(totalPages) {
    const container = document.getElementById('paginationContainer');
    if (!container) return;
    container.innerHTML = '';

    const prev = createPageBtn('prev');
    prev.disabled = currentPage === 1;
    prev.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>`;
    prev.addEventListener('click', () => { if (currentPage > 1) renderPage(currentPage - 1); });
    container.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
      const btn = createPageBtn(i);
      btn.textContent = i;
      if (i === currentPage) btn.classList.add('active');
      btn.addEventListener('click', () => renderPage(i));
      container.appendChild(btn);
    }

    const next = createPageBtn('next');
    next.disabled = currentPage === totalPages;
    next.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>`;
    next.addEventListener('click', () => { if (currentPage < totalPages) renderPage(currentPage + 1); });
    container.appendChild(next);
  }

  function createPageBtn(id) {
    const btn = document.createElement('button');
    btn.className = 'page-btn';
    btn.setAttribute('aria-label', 'Page ' + id);
    return btn;
  }

  function updatePagination() { renderPage(1); }

  if (blogCards.length > 0) renderPage(1);

})();
