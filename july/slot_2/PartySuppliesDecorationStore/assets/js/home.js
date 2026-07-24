/*!
 * FESTA — home.js
 * Confetti particles + animated counters
 */
(function () {
  'use strict';

  /* ── Confetti Canvas ── */
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) {
    const ctx    = canvas.getContext('2d');
    const colors = ['#FF6B6B','#4ECDC4','#FFD93D','#FF8787','#6EE7DF','#FFE066','#fff'];
    let pieces   = [];
    let animId;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createPiece() {
      return {
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height - canvas.height,
        w:     Math.random() * 10 + 5,
        h:     Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 1.5 + 0.5,
        angle: Math.random() * Math.PI * 2,
        spin:  (Math.random() - 0.5) * 0.08,
        opacity: Math.random() * 0.5 + 0.4,
      };
    }

    function init() {
      pieces = Array.from({ length: 60 }, createPiece);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle   = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        p.y     += p.speed;
        p.angle += p.spin;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });
      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) draw();
    window.addEventListener('resize', () => { resize(); init(); });

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(animId); }
      else if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) draw();
    });
  }

  /* ── Animated Counters ── */
  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const start    = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const val      = target * eased;
      el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

})();
