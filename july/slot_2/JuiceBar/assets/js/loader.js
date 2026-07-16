/* ============================================================
   ZEST & BLEND — JavaScript: Page Loader & Skeleton Loaders
   ============================================================ */
'use strict';

const LoaderManager = (() => {
  // ─── Page Loader ──────────────────────────────────────
  function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    const hide = () => {
      loader.classList.add('loaded');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    };

    if (document.readyState === 'complete') {
      setTimeout(hide, 400);
    } else {
      window.addEventListener('load', () => setTimeout(hide, 400));
    }
  }

  // ─── Skeleton Loaders for dynamic content ─────────────
  function createSkeletonCard() {
    return `
      <div class="skeleton-card" aria-hidden="true">
        <div class="skeleton skeleton--img skeleton-card__img"></div>
        <div class="skeleton skeleton--title"></div>
        <div class="skeleton skeleton--text" style="width:80%"></div>
        <div class="skeleton skeleton--text" style="width:60%"></div>
        <div class="skeleton skeleton--btn" style="margin-top:1rem"></div>
      </div>
    `;
  }

  function showSkeletons(container, count = 3) {
    if (!container) return;
    container.innerHTML = Array(count).fill(createSkeletonCard()).join('');
  }

  function hideSkeletons(container) {
    if (!container) return;
    container.querySelectorAll('.skeleton-card').forEach((el) => el.remove());
  }

  // ─── Image lazy loading ───────────────────────────────
  function initLazyImages() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    images.forEach((img) => observer.observe(img));
  }

  function init() {
    initPageLoader();
    initLazyImages();
  }

  return { init, showSkeletons, hideSkeletons };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', LoaderManager.init);
} else {
  LoaderManager.init();
}
