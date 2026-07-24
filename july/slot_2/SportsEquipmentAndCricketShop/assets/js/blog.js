/* ============================================
   PLAY — Blog Interactions
   Category Filters, Search, Pagination
   ============================================ */

(function() {
  'use strict';

  function initBlogFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const articles = document.querySelectorAll('.blog-article-card');
    const searchInput = document.getElementById('blogSearch');

    if (!articles.length) return;

    function applyFilterAndSearch() {
      const activeBtn = document.querySelector('.filter-btn.active');
      const category = activeBtn ? activeBtn.dataset.filter : 'all';
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

      articles.forEach(article => {
        const matchesCategory = (category === 'all' || article.dataset.category === category);
        const title = article.querySelector('h3').textContent.toLowerCase();
        const excerpt = article.querySelector('p').textContent.toLowerCase();
        const matchesQuery = !query || title.includes(query) || excerpt.includes(query);

        if (matchesCategory && matchesQuery) {
          article.style.display = 'block';
          setTimeout(() => {
            article.style.opacity = '1';
            article.style.transform = 'scale(1)';
          }, 50);
        } else {
          article.style.opacity = '0';
          article.style.transform = 'scale(0.95)';
          setTimeout(() => {
            article.style.display = 'none';
          }, 300);
        }
      });
    }

    if (filterBtns.length) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          applyFilterAndSearch();
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilterAndSearch);
    }
  }

  function initCommentForm() {
    const form = document.getElementById('commentForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('commentName');
      const email = document.getElementById('commentEmail');
      const content = document.getElementById('commentContent');
      let isValid = true;

      // Clean errors
      form.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      if (!name.value.trim()) {
        name.closest('.form-group').classList.add('error');
        isValid = false;
      }
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.closest('.form-group').classList.add('error');
        isValid = false;
      }
      if (!content.value.trim()) {
        content.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (isValid) {
        const commentList = document.getElementById('commentsList');
        if (commentList) {
          const newComment = document.createElement('div');
          newComment.className = 'comment';
          newComment.innerHTML = `
            <div style="width:48px;height:48px;border-radius:50%;background:var(--color-accent);display:flex;align-items:center;justify-content:center;color:var(--text-on-accent);font-weight:700;flex-shrink:0;">
              ${name.value.trim().charAt(0).toUpperCase()}
            </div>
            <div class="comment-body">
              <h4>${escapeHTML(name.value.trim())}</h4>
              <div class="comment-date">Just now</div>
              <p>${escapeHTML(content.value.trim())}</p>
            </div>
          `;
          commentList.appendChild(newComment);
          form.reset();
        }
      }
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  function init() {
    initBlogFilters();
    initCommentForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
