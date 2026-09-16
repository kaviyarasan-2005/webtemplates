/* ============================================================
   ClearShield — Gallery, Slider, Lightbox, Carousel
   ============================================================ */
const GalleryManager = (() => {
  'use strict';

  /* Before/After Drag Slider */
  function initBASliders() {
    document.querySelectorAll('.before-after-slider').forEach(slider => {
      const handle  = slider.querySelector('.ba-handle');
      const after   = slider.querySelector('.ba-after');
      if (!handle || !after) return;
      let dragging = false;

      function setPos(x) {
        const r = slider.getBoundingClientRect();
        let pct = ((x - r.left) / r.width) * 100;
        pct = Math.max(5, Math.min(95, pct));
        after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        handle.style.left = pct + '%';
      }

      handle.addEventListener('mousedown',  () => dragging = true);
      handle.addEventListener('touchstart', () => dragging = true, { passive: true });
      window.addEventListener('mousemove',  e => { if (dragging) setPos(e.clientX); });
      window.addEventListener('touchmove',  e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('mouseup',    () => dragging = false);
      window.addEventListener('touchend',   () => dragging = false);

      // Init at 50%
      const r = slider.getBoundingClientRect();
      setPos(r.left + r.width * 0.5);
    });
  }

  /* Gallery Filter */
  function initFilter() {
    const btns  = document.querySelectorAll('.gallery-filter-btn');
    const items = document.querySelectorAll('.gallery-item');
    if (!btns.length) return;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.getAttribute('data-filter');
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        items.forEach(item => {
          const cat = item.getAttribute('data-category');
          const show = f === 'all' || cat === f;
          item.style.display = show ? '' : 'none';
          if (show) requestAnimationFrame(() => item.classList.add('visible'));
          else item.classList.remove('visible');
        });
      });
    });
  }

  /* Lightbox */
  function initLightbox() {
    const imgs = document.querySelectorAll('[data-lightbox]');
    if (!imgs.length) return;
    const lb = document.createElement('div');
    lb.className = 'lightbox'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true'); lb.setAttribute('aria-label','Image viewer');
    lb.innerHTML = `<button class="lb-close" aria-label="Close"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button><button class="lb-prev" aria-label="Previous"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg></button><img class="lb-image" src="" alt=""/><button class="lb-next" aria-label="Next"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg></button>`;
    document.body.appendChild(lb);
    const lbImg = lb.querySelector('.lb-image');
    let list = Array.from(imgs), idx = 0;
    function open(i)  { idx = (i + list.length) % list.length; lbImg.src = list[idx].src || list[idx].getAttribute('data-src') || ''; lbImg.alt = list[idx].alt || ''; lb.classList.add('open'); document.body.style.overflow = 'hidden'; lb.querySelector('.lb-close').focus(); }
    function close()  { lb.classList.remove('open'); document.body.style.overflow = ''; }
    function nav(d)   { open(idx + d); }
    imgs.forEach((img, i) => { img.addEventListener('click', () => open(i)); img.style.cursor = 'zoom-in'; });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click',  () => nav(-1));
    lb.querySelector('.lb-next').addEventListener('click',  () => nav(1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  nav(-1);
      if (e.key === 'ArrowRight') nav(1);
    });
  }

  /* Testimonial Carousel */
  function initCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;
    const track  = carousel.querySelector('.carousel-track');
    const dots   = carousel.querySelectorAll('.carousel-dot');
    const prev   = carousel.querySelector('.carousel-prev');
    const next   = carousel.querySelector('.carousel-next');
    if (!track) return;
    let cur = 0, total = track.children.length, auto;
    function goTo(i) {
      cur = (i + total) % total;
      track.style.transform = `translateX(-${cur * 100}%)`;
      dots.forEach((d, j) => d.classList.toggle('active', j === cur));
    }
    function startAuto() { auto = setInterval(() => goTo(cur + 1), 5000); }
    prev?.addEventListener('click', () => goTo(cur - 1));
    next?.addEventListener('click', () => goTo(cur + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
    carousel.addEventListener('mouseenter', () => clearInterval(auto));
    carousel.addEventListener('mouseleave', startAuto);
    startAuto();
  }

  /* Tint Shade Selector */
  function initShadeSelector() {
    const btns    = document.querySelectorAll('.shade-btn');
    const preview = document.getElementById('shade-preview');
    if (!btns.length || !preview) return;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const opacity = btn.getAttribute('data-opacity');
        const tintLayer = preview.querySelector('.shade-tint-layer');
        if (tintLayer) tintLayer.style.opacity = opacity;
        const label = preview.querySelector('.shade-label-value');
        if (label) label.textContent = btn.getAttribute('data-vlt') + '% VLT';
      });
    });
  }

  /* Accordion */
  function initAccordion() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const isOpen = item.classList.contains('active');
        document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
        if (!isOpen) item.classList.add('active');
      });
    });
  }

  /* Tab Panels */
  function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('[data-tabs]');
        if (!group) return;
        const target = btn.getAttribute('data-tab');
        group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = group.querySelector(`[data-panel="${target}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  function init() {
    initBASliders();
    initFilter();
    initLightbox();
    initCarousel();
    initShadeSelector();
    initAccordion();
    initTabs();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', GalleryManager.init);
