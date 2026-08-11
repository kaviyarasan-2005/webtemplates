'use strict';

(function () {

  // ============================================================
  // UTILITY: easing functions
  // ============================================================
  const ease = {
    outCubic:  t => 1 - Math.pow(1 - t, 3),
    outQuart:  t => 1 - Math.pow(1 - t, 4),
    outExpo:   t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    outBounce: t => {
      const n1 = 7.5625, d1 = 2.75;
      if (t < 1/d1)       return n1 * t * t;
      else if (t < 2/d1)  return n1 * (t -= 1.5/d1) * t + 0.75;
      else if (t < 2.5/d1)return n1 * (t -= 2.25/d1) * t + 0.9375;
      else                return n1 * (t -= 2.625/d1) * t + 0.984375;
    },
    inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  };

  // ============================================================
  // 1. MULTI-TYPE SCROLL REVEAL (IntersectionObserver)
  //    Supported data attributes:
  //      data-anim="fade-up"    (default)
  //      data-anim="fade-down"
  //      data-anim="fade-left"
  //      data-anim="fade-right"
  //      data-anim="zoom-in"
  //      data-anim="zoom-out"
  //      data-anim="flip-up"
  //      data-delay="200"       (ms, optional)
  //      data-duration="800"    (ms, optional)
  // ============================================================
  const ANIM_MAP = {
    'fade-up':    { from: 'opacity:0; transform:translateY(48px)',   to: 'opacity:1; transform:translateY(0)' },
    'fade-down':  { from: 'opacity:0; transform:translateY(-48px)',  to: 'opacity:1; transform:translateY(0)' },
    'fade-left':  { from: 'opacity:0; transform:translateX(60px)',   to: 'opacity:1; transform:translateX(0)' },
    'fade-right': { from: 'opacity:0; transform:translateX(-60px)',  to: 'opacity:1; transform:translateX(0)' },
    'zoom-in':    { from: 'opacity:0; transform:scale(0.82)',        to: 'opacity:1; transform:scale(1)' },
    'zoom-out':   { from: 'opacity:0; transform:scale(1.18)',        to: 'opacity:1; transform:scale(1)' },
    'flip-up':    { from: 'opacity:0; transform:perspective(600px) rotateX(30deg) translateY(32px)', to: 'opacity:1; transform:perspective(600px) rotateX(0deg) translateY(0)' },
  };

  function applyStyles(el, styleStr) {
    styleStr.split(';').forEach(s => {
      const [prop, val] = s.split(':').map(x => x.trim());
      if (prop && val !== undefined) el.style[prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = val;
    });
  }

  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay    = parseInt(el.dataset.delay || 0);
        const duration = parseInt(el.dataset.duration || 700);
        const animType = el.dataset.anim || 'fade-up';
        const anim     = ANIM_MAP[animType] || ANIM_MAP['fade-up'];

        // Set initial "from" state
        applyStyles(el, anim.from);
        el.style.transition = `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
        el.style.willChange = 'opacity, transform';

        // Trigger "to" state on next frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.classList.add('visible');
            applyStyles(el, anim.to);
            // Clean up will-change after animation
            setTimeout(() => { el.style.willChange = ''; }, duration + delay + 100);
          });
        });

        revealObs.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

    revealEls.forEach(el => {
      // Set initial hidden state immediately
      const animType = el.dataset.anim || 'fade-up';
      const anim = ANIM_MAP[animType] || ANIM_MAP['fade-up'];
      applyStyles(el, anim.from);
      revealObs.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ============================================================
  // 2. RICH STAGGER GRID ANIMATION
  //    Cards enter in sequence with alternating directions
  // ============================================================
  const STAGGER_SELECTORS = [
    '.product-grid', '.category-grid', '.dept-grid',
    '.brand-card-grid', '.blog-grid', '.teaser-grid',
    '.steps-grid', '.pricing-grid', '.error-links-grid',
    '.footer-grid', '.testimonials-grid'
  ];

  const staggerGroups = document.querySelectorAll(STAGGER_SELECTORS.join(', '));

  if ('IntersectionObserver' in window && staggerGroups.length) {
    const staggerObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const children = Array.from(entry.target.children);
        children.forEach((child, i) => {
          const delay    = i * 80;          // 80ms between each card
          const duration = 650;

          // Initial hidden state
          child.style.opacity   = '0';
          child.style.transform = 'translateY(36px) scale(0.97)';
          child.style.transition = `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
          child.style.willChange = 'opacity, transform';

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              child.style.opacity   = '1';
              child.style.transform = 'translateY(0) scale(1)';
              setTimeout(() => { child.style.willChange = ''; }, duration + delay + 100);
            });
          });
        });

        staggerObs.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });

    staggerGroups.forEach(g => {
      // Pre-hide children before observation
      Array.from(g.children).forEach(child => {
        child.style.opacity   = '0';
        child.style.transform = 'translateY(36px) scale(0.97)';
      });
      staggerObs.observe(g);
    });
  }

  // ============================================================
  // 3. HERO ENTRANCE — multi-element cinematic sequence
  // ============================================================
  const heroWrapper = document.querySelector('.hero-wrapper');
  if (heroWrapper) {
    const heroBg = heroWrapper.querySelector('.hero-bg');
    const heroOverlay = heroWrapper.querySelector('.hero-overlay');
    const heroContent = heroWrapper.querySelector('.hero-content');

    // Parallax: subtle bg scale on load
    if (heroBg) {
      heroBg.style.transform   = 'scale(1.08)';
      heroBg.style.transition  = 'transform 1400ms cubic-bezier(0.22,1,0.36,1)';
    }

    // Content sequence: label → h1 → p → buttons (staggered)
    if (heroContent) {
      const sequences = [
        heroContent.querySelector('.section-label, .hero-label'),
        heroContent.querySelector('h1'),
        heroContent.querySelector('p, .hero-sub'),
        heroContent.querySelector('.hero-btns, .hero-search'),
        heroContent.querySelector('.hero-trust, .trust-row'),
      ].filter(Boolean);

      sequences.forEach(el => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'none';
      });

      window.addEventListener('load', () => {
        // Scale down hero bg
        if (heroBg) heroBg.style.transform = 'scale(1)';

        // Sequence each element
        sequences.forEach((el, i) => {
          const delay = 200 + i * 140;
          setTimeout(() => {
            el.style.transition = `opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)`;
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
        });
      });
    }
  }

  // ============================================================
  // 4. SCROLL PARALLAX on hero background
  // ============================================================
  const parallaxBg = document.querySelector('.hero-bg');
  if (parallaxBg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;
          const heroH   = parallaxBg.closest('.hero-wrapper')?.offsetHeight || 600;
          if (scrollY < heroH * 1.5) {
            const shift = scrollY * 0.3;
            parallaxBg.style.transform = `translateY(${shift}px) scale(1)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================================
  // 5. NUMBER COUNTER (stats sections)
  //    <span data-counter="15000" data-suffix="+" data-prefix="$">
  // ============================================================
  const counters = document.querySelectorAll('[data-counter]');

  if ('IntersectionObserver' in window && counters.length) {
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el       = entry.target;
        const target   = parseInt(el.getAttribute('data-counter').replace(/,/g, ''));
        const suffix   = el.getAttribute('data-suffix') || '';
        const prefix   = el.getAttribute('data-prefix') || '';
        const duration = parseInt(el.getAttribute('data-duration') || 2000);
        const start    = performance.now();

        function tick(now) {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const current  = Math.floor(ease.outExpo(progress) * target);
          el.textContent = prefix + current.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = prefix + target.toLocaleString() + suffix;
        }
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach(c => counterObs.observe(c));
  }

  // ============================================================
  // 6. COUNTDOWN TIMER (flash sale + coming soon)
  //    Elements: data-countdown="days|hours|minutes|seconds"
  // ============================================================
  function initCountdown(container, targetTime) {
    let prevSecs = -1;

    function update() {
      const diff = Math.max(targetTime - Date.now(), 0);
      const days  = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000) / 60000);
      const secs  = Math.floor((diff % 60000) / 1000);

      const parts = { days, hours, minutes: mins, seconds: secs };
      Object.entries(parts).forEach(([key, val]) => {
        const numEl = container.querySelector(`[data-countdown="${key}"]`);
        if (!numEl) return;
        const str = String(val).padStart(2, '0');
        if (numEl.textContent !== str) {
          // Flip animation on change
          numEl.style.transform = 'translateY(-100%)';
          numEl.style.opacity   = '0';
          numEl.style.transition = 'transform 180ms ease-in, opacity 180ms ease-in';
          setTimeout(() => {
            numEl.textContent = str;
            numEl.style.transform = 'translateY(100%)';
            numEl.style.transition = 'none';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                numEl.style.transition = 'transform 220ms cubic-bezier(0.22,1,0.36,1), opacity 220ms ease';
                numEl.style.transform  = 'translateY(0)';
                numEl.style.opacity    = '1';
              });
            });
          }, 180);
        }
      });

      prevSecs = secs;
      if (diff > 0) setTimeout(update, 1000);
    }
    update();
  }

  const flashCountdown = document.querySelector('.flash-countdown-el');
  if (flashCountdown) initCountdown(flashCountdown, Date.now() + 48 * 3600000);

  const comingSoonCountdown = document.querySelector('.coming-soon-countdown');
  if (comingSoonCountdown) initCountdown(comingSoonCountdown, Date.now() + 30 * 86400000);

  // ============================================================
  // 7. SMOOTH SCROLL for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id     = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 76;
        const top  = target.getBoundingClientRect().top + window.pageYOffset - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // 8. MAGNETIC HOVER on buttons (subtle pull effect)
  // ============================================================
  document.querySelectorAll('.btn-primary, .btn-outline, .add-to-cart-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.18;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.18;
      btn.style.transform = `translate(${x}px, ${y}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 400ms cubic-bezier(0.22,1,0.36,1)';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });

  // ============================================================
  // 9. PRODUCT CARD TILT (3D perspective on hover)
  // ============================================================
  document.querySelectorAll('.product-card, .blog-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top ) / rect.height - 0.5;
      const rotX = (-y * 6).toFixed(2);
      const rotY = ( x * 6).toFixed(2);
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.01)`;
      card.style.transition = 'transform 100ms linear, box-shadow 100ms linear';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 500ms cubic-bezier(0.22,1,0.36,1), box-shadow 500ms cubic-bezier(0.22,1,0.36,1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });

  // ============================================================
  // 10. SECTION HEADER UNDERLINE DRAW (SVG-style)
  //     Animates an underline on h2 in .section-header
  // ============================================================
  const sectionHeaders = document.querySelectorAll('.section-header h2');
  if ('IntersectionObserver' in window && sectionHeaders.length) {
    const headObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('h2-underline-animated');
          headObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    sectionHeaders.forEach(h => headObs.observe(h));
  }

  // ============================================================
  // 11. NAVBAR SHRINK + SHADOW on scroll
  // ============================================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.pageYOffset;
      navbar.classList.toggle('scrolled', y > 24);

      // Hide on fast scroll down, show on scroll up
      if (y > 120) {
        if (y > lastScroll + 4) {
          navbar.style.transform = 'translateY(-100%)';
        } else if (y < lastScroll - 4) {
          navbar.style.transform = 'translateY(0)';
        }
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      lastScroll = y;
    }, { passive: true });
  }

  // ============================================================
  // 12. IMAGE LAZY LOAD with fade-in
  // ============================================================
  if ('IntersectionObserver' in window) {
    const imgObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const src = img.dataset.src;
        if (src) {
          img.style.opacity   = '0';
          img.style.transition = 'opacity 500ms ease';
          img.src = src;
          img.onload = () => { img.style.opacity = '1'; };
          delete img.dataset.src;
        }
        obs.unobserve(img);
      });
    }, { rootMargin: '200px 0px' });

    document.querySelectorAll('img[data-src]').forEach(img => imgObs.observe(img));
  }

  // ============================================================
  // 13. SCROLL PROGRESS BAR (top of page)
  // ============================================================
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'height:3px',
    'width:0%', 'z-index:9999',
    'background:linear-gradient(90deg, var(--color-primary), var(--color-accent))',
    'transition:width 60ms linear',
    'pointer-events:none',
  ].join(';');
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrolled  = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct       = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  // ============================================================
  // 14. SECTION SEPARATOR LINE DRAW
  //     Any element with class .line-draw gets width animated
  // ============================================================
  if ('IntersectionObserver' in window) {
    const lineObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = '100%';
          lineObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.line-draw').forEach(el => {
      el.style.width = '0';
      el.style.transition = 'width 800ms cubic-bezier(0.22,1,0.36,1)';
      lineObs.observe(el);
    });
  }

})();
