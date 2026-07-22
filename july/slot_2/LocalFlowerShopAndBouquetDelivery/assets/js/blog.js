/* ============================================
   BLOOM — Blog Page JavaScript
   Category filter, search, pagination
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBlogFilters();
  initBlogSearch();
  initPagination();
  initCommentForm();
});

/* --- Blog Category Filters --- */
function initBlogFilters() {
  const filterBtns = document.querySelectorAll('#blog-filters .tag');
  const articles = document.querySelectorAll('#blog-grid .card');

  if (!filterBtns.length || !articles.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      articles.forEach(article => {
        const category = article.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          article.style.display = '';
          requestAnimationFrame(() => {
            article.style.opacity = '0';
            article.style.transform = 'translateY(10px)';
            requestAnimationFrame(() => {
              article.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              article.style.opacity = '1';
              article.style.transform = 'translateY(0)';
            });
          });
        } else {
          article.style.display = 'none';
        }
      });
    });
  });
}

/* --- Blog Search --- */
function initBlogSearch() {
  const searchInput = document.getElementById('blog-search');
  const articles = document.querySelectorAll('#blog-grid .card');

  if (!searchInput || !articles.length) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    articles.forEach(article => {
      const title = article.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const text = article.querySelector('.card-text')?.textContent.toLowerCase() || '';
      const tag = article.querySelector('.card-tag')?.textContent.toLowerCase() || '';

      if (title.includes(query) || text.includes(query) || tag.includes(query)) {
        article.style.display = '';
      } else {
        article.style.display = 'none';
      }
    });
  });
}

/* --- Pagination --- */
function initPagination() {
  const paginationBtns = document.querySelectorAll('.pagination-btn:not([aria-label])');

  paginationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      paginationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/* --- Comment Form Validation --- */
function initCommentForm() {
  const form = document.getElementById('comment-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear errors
    form.querySelectorAll('.form-error').forEach(err => err.classList.remove('visible'));
    form.querySelectorAll('.form-input, .form-textarea').forEach(input => input.classList.remove('error'));

    // Validate name
    const name = document.getElementById('comment-name');
    if (name && !name.value.trim()) {
      name.classList.add('error');
      const err = document.getElementById('comment-name-error');
      if (err) err.classList.add('visible');
      isValid = false;
    }

    // Validate email
    const email = document.getElementById('comment-email');
    if (email && (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))) {
      email.classList.add('error');
      const err = document.getElementById('comment-email-error');
      if (err) err.classList.add('visible');
      isValid = false;
    }

    // Validate comment
    const comment = document.getElementById('comment-text');
    if (comment && !comment.value.trim()) {
      comment.classList.add('error');
      const err = document.getElementById('comment-text-error');
      if (err) err.classList.add('visible');
      isValid = false;
    }

    if (isValid) {
      form.style.display = 'none';
      const success = document.getElementById('comment-success');
      if (success) {
        success.classList.add('visible');
        success.style.display = 'block';
      }
    }
  });
}
