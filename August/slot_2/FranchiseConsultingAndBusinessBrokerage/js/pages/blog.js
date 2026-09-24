/**
 * DEAL — Blog JS
 */
(function () {
  'use strict';

  function initBlogFilter () {
    const filters = document.querySelectorAll('.wire-chip, .topic-item');
    const articles = document.querySelectorAll('.article-card');

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.filter;
        
        // Update active states
        filters.forEach(f => f.classList.remove('active'));
        document.querySelectorAll(`[data-filter="${cat}"]`).forEach(f => f.classList.add('active'));

        // Filter matrix
        articles.forEach(art => {
          if (cat === 'all' || art.dataset.category === cat) {
            art.style.display = 'flex';
            // simple animation trigger
            art.style.animation = 'none';
            art.offsetHeight; /* trigger reflow */
            art.style.animation = 'scaleIn var(--dur-normal) var(--ease-out)';
          } else {
            art.style.display = 'none';
          }
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initBlogFilter);
})();
