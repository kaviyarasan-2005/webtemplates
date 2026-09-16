/* ============================================================
   SoundForge Studios — Scroll Animations & Counters
   IntersectionObserver-driven reveals and number counters
   ============================================================ */

const AnimationsManager = (() => {

  /* ── Scroll Reveal ──────────────────────────────────────── */
  const initScrollReveal = () => {
    const elements = document.querySelectorAll(
      '.reveal, .reveal--left, .reveal--right, .reveal--scale'
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  };

  /* ── Counter Animation ──────────────────────────────────── */
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target') || '0');
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = parseInt(el.getAttribute('data-duration') || '2000', 10);
    const decimals = (String(target).split('.')[1] || '').length;

    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      const current = eased * target;
      el.textContent = prefix + current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const initCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  };

  /* ── Waveform Canvas ────────────────────────────────────── */
  const initWaveform = (canvasId) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    let animFrame;
    let phase = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      phase += 0.018;

      const bars        = 90;
      const barWidth    = (canvas.width / bars) * 0.6;
      const gap         = (canvas.width / bars) * 0.4;
      const totalWidth  = bars * (barWidth + gap);
      const startX      = (canvas.width - totalWidth) / 2;
      const isDark      = document.documentElement.getAttribute('data-theme') === 'dark';
      const violet      = isDark ? '#9B5CFF' : '#7C3AED';
      const gold        = isDark ? '#E0B85A' : '#D4A84F';

      for (let i = 0; i < bars; i++) {
        const x        = startX + i * (barWidth + gap);
        const amp      = Math.sin(i * 0.18 + phase) * 0.45
                       + Math.sin(i * 0.09 + phase * 1.6) * 0.30
                       + Math.sin(i * 0.27 + phase * 0.75) * 0.25;
        const height   = Math.abs(amp) * canvas.height * 0.72 + 3;
        const y        = (canvas.height - height) / 2;
        const t        = i / bars;

        const grad = ctx.createLinearGradient(0, y, 0, y + height);
        grad.addColorStop(0,   gold);
        grad.addColorStop(0.5, violet);
        grad.addColorStop(1,   gold);

        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.7 + Math.abs(amp) * 0.3;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, height, barWidth / 2);
        } else {
          ctx.rect(x, y, barWidth, height);
        }
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  };

  /* ── Carousel ───────────────────────────────────────────── */
  const initCarousels = () => {
    document.querySelectorAll('[data-carousel]').forEach((carousel) => {
      const track  = carousel.querySelector('.carousel__track');
      const slides = carousel.querySelectorAll('.carousel__slide');
      const dots   = carousel.querySelectorAll('.carousel__dot');
      const prev   = carousel.querySelector('[data-carousel-prev]');
      const next   = carousel.querySelector('[data-carousel-next]');

      if (!track || !slides.length) return;

      let current = 0;
      let autoInterval;

      const goTo = (index) => {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
      };

      const startAuto = () => {
        clearInterval(autoInterval);
        autoInterval = setInterval(() => goTo(current + 1), 5000);
      };

      if (prev) prev.addEventListener('click', () => { goTo(current - 1); startAuto(); });
      if (next) next.addEventListener('click', () => { goTo(current + 1); startAuto(); });
      dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));

      /* Touch swipe */
      let startX = 0;
      carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
      carousel.addEventListener('touchend', (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        startAuto();
      });

      goTo(0);
      startAuto();
    });
  };

  /* ── Accordion ──────────────────────────────────────────── */
  const initAccordion = () => {
    document.querySelectorAll('.accordion__trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item  = trigger.closest('.accordion__item');
        const isOpen = item.classList.contains('is-open');

        /* Close all others in same accordion */
        const parent = item.closest('.accordion');
        if (parent) {
          parent.querySelectorAll('.accordion__item.is-open').forEach((openItem) => {
            if (openItem !== item) {
              openItem.classList.remove('is-open');
              openItem.querySelector('.accordion__trigger')
                      ?.setAttribute('aria-expanded', 'false');
            }
          });
        }

        item.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  };

  /* ── Tabs ───────────────────────────────────────────────── */
  const initTabs = () => {
    document.querySelectorAll('[data-tabs]').forEach((tabContainer) => {
      const buttons = tabContainer.querySelectorAll('.tabs__btn');
      const panels  = document.querySelectorAll('.tabs__panel');

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-tab');
          buttons.forEach((b) => b.classList.remove('is-active'));
          panels.forEach((p) => p.classList.remove('is-active'));
          btn.classList.add('is-active');
          document.getElementById(target)?.classList.add('is-active');
        });
      });
    });
  };

  /* ── Page loader ─────────────────────────────────────────── */
  const initPageLoader = () => {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 400);
      }, 600);
    });
  };

  /* ── Filter grid ─────────────────────────────────────────── */
  const initFilters = () => {
    document.querySelectorAll('[data-filter-group]').forEach((group) => {
      const buttons = group.querySelectorAll('[data-filter]');
      const targetId = group.getAttribute('data-filter-group');
      const items = document.querySelectorAll(`[data-filter-item][data-group="${targetId}"]`);

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const filter = btn.getAttribute('data-filter');
          buttons.forEach((b) => b.classList.remove('is-active'));
          btn.classList.add('is-active');

          items.forEach((item) => {
            const tags = item.getAttribute('data-tags') || '';
            if (filter === 'all' || tags.includes(filter)) {
              item.style.display = '';
              setTimeout(() => { item.style.opacity = '1'; item.style.transform = ''; }, 10);
            } else {
              item.style.opacity = '0';
              item.style.transform = 'scale(0.95)';
              setTimeout(() => { item.style.display = 'none'; }, 250);
            }
          });
        });
      });
    });
  };

  /* ── Smooth scroll for hash links ────────────────────────── */
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };

  /* ── Init all ────────────────────────────────────────────── */
  const init = () => {
    initScrollReveal();
    initCounters();
    initCarousels();
    initAccordion();
    initTabs();
    initPageLoader();
    initFilters();
    initSmoothScroll();
  };

  return { init, initWaveform };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', AnimationsManager.init);
} else {
  AnimationsManager.init();
}
