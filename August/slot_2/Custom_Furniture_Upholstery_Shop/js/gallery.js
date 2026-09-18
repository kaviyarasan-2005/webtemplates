/**
 * gallery.js — Before/After Sliders, Gallery Filters
 * Custom Furniture Upholstery Shop
 */

/* ── Before/After Slider ── */
function initBASliders() {
  const containers = document.querySelectorAll('[data-ba-container]');

  containers.forEach(container => {
    const clip = container.querySelector('.ba-clip');
    const divider = container.querySelector('.ba-divider');
    if (!clip || !divider) return;

    let isDragging = false;

    function setPosition(x) {
      const rect = container.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width;
      pos = Math.max(0.04, Math.min(0.96, pos));
      const pct = `${pos * 100}%`;
      clip.style.width = pct;
      divider.style.left = pct;
    }

    // Mouse
    container.addEventListener('mousedown', (e) => { isDragging = true; setPosition(e.clientX); });
    window.addEventListener('mousemove', (e) => { if (isDragging) setPosition(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });

    // Touch
    container.addEventListener('touchstart', (e) => { isDragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchmove', (e) => { if (isDragging) setPosition(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });

    // Keyboard accessibility
    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', 'Before and after comparison — drag the slider or use arrow keys');
    container.addEventListener('keydown', (e) => {
      const rect = container.getBoundingClientRect();
      const currentPct = parseFloat(clip.style.width) / 100 || 0.5;
      let newPct = currentPct;
      if (e.key === 'ArrowLeft') newPct = Math.max(0.04, currentPct - 0.05);
      if (e.key === 'ArrowRight') newPct = Math.min(0.96, currentPct + 0.05);
      clip.style.width = `${newPct * 100}%`;
      divider.style.left = `${newPct * 100}%`;
    });
  });
}

/* ── Gallery Filter ── */
function initGalleryFilter(gridId, filterGroupSelector) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const filterBtns = document.querySelectorAll(filterGroupSelector + ' .filter-btn');
  const items = grid.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.35s ease both';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/* ── Fabric Gallery Filter ── */
function initFabricGallery() {
  initGalleryFilter('fabric-items-grid', '[role="group"][aria-label="Filter fabrics by type"]');
  initBASliders();
}

/* ── BA Gallery Page Filter ── */
function initBAGallery() {
  initGalleryFilter('ba-items-grid', '[role="group"][aria-label="Filter by furniture type"]');
  initBASliders();
}

/* ── Testimonials Carousel ── */
function initCarousel(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  if (!track) return;

  let current = 0;
  const total = dots.length;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-advance
  let autoTimer = setInterval(() => goTo(current + 1), 5500);
  carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
  carousel.addEventListener('mouseleave', () => { clearInterval(autoTimer); autoTimer = setInterval(() => goTo(current + 1), 5500); });
}

export { initBASliders, initFabricGallery, initBAGallery, initCarousel };
