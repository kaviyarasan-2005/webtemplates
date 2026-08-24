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
  const categoryPills = document.querySelectorAll('.sidebar-pill');
  const cards = document.querySelectorAll('.masonry-main-feed .card');
  if (!categoryPills.length) return;

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('sidebar-pill--active'));
      pill.classList.add('sidebar-pill--active');

      const categoryText = pill.textContent.split('(')[0].trim().toLowerCase();

      cards.forEach(card => {
        if (categoryText === 'all articles' || categoryText.includes('all')) {
          card.style.display = '';
        } else {
          const cardTag = (card.querySelector('.card__tag') ? card.querySelector('.card__tag').textContent : '').toLowerCase();
          const cardTitle = (card.querySelector('h3, h4') ? card.querySelector('h3, h4').textContent : '').toLowerCase();
          if (cardTag.includes(categoryText) || cardTitle.includes(categoryText) || categoryText.includes(cardTag)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
}

function initBlogSearch() {
  const searchInput = document.getElementById('blog-search');
  const cards = document.querySelectorAll('.masonry-main-feed .card');
  if (!searchInput || !cards.length) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = (!query || text.includes(query)) ? '' : 'none';
    });
  });
}

function initBlogPagination() {
  const navBtns = document.querySelectorAll('.nav-arrow-btn');
  const currentPageEl = document.querySelector('.current-page');
  const volumePills = document.querySelectorAll('.volume-pill');

  let currentPage = 1;
  const maxPages = 4;

  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navBtns.forEach(b => b.classList.remove('nav-arrow-btn--active'));

      if (btn.textContent.includes('Prev')) {
        currentPage = Math.max(1, currentPage - 1);
      } else if (btn.textContent.includes('Next')) {
        currentPage = Math.min(maxPages, currentPage + 1);
      }
      btn.classList.add('nav-arrow-btn--active');

      if (currentPageEl) {
        currentPageEl.textContent = currentPage < 10 ? '0' + currentPage : currentPage;
      }
    });
  });

  volumePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      volumePills.forEach(p => p.classList.remove('volume-pill--active'));
      pill.classList.add('volume-pill--active');
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
      let successMsg = form.parentNode.querySelector('.form-success-msg');
      if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'form-success-msg';
        successMsg.style.cssText = 'color: #D4956A; font-weight: 700; margin-top: 0.75rem; font-size: 0.9rem;';
        form.parentNode.appendChild(successMsg);
      }
      successMsg.textContent = '✓ Thank you for subscribing to the Sartorial Journal!';
      setTimeout(() => {
        if (successMsg) successMsg.textContent = '';
      }, 5000);
    }
  });
}
