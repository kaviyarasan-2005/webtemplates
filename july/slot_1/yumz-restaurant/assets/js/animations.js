/* ============================================================
   YUMZ Restaurant — Animations JavaScript
   animations.js | Version 1.0
   Handles: Scroll Animations (IntersectionObserver),
            Hero Ken Burns, Stagger Delays
   ============================================================ */

'use strict';

/* ============================================================
   1. SCROLL REVEAL (Intersection Observer)
   ============================================================ */
(function initScrollAnimations() {
  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Make all animated elements immediately visible
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('animate-in');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Once animated in, stop observing to save performance
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1,
    }
  );

  // Observe all elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
})();

/* ============================================================
   2. HERO KEN BURNS EFFECT
   ============================================================ */
(function initHeroKenBurns() {
  const heroBgs = document.querySelectorAll('.hero__bg');

  heroBgs.forEach(bg => {
    // Start the subtle zoom-in animation
    requestAnimationFrame(() => {
      bg.classList.add('ken-burns');
    });
  });
})();

/* ============================================================
   3. STAGGER ANIMATION FOR GRID CHILDREN
   ============================================================ */
(function initStaggeredGrids() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Auto-stagger children inside grids that have data-stagger attribute
  document.querySelectorAll('[data-stagger]').forEach(grid => {
    const children = grid.children;
    Array.from(children).forEach((child, index) => {
      if (!child.hasAttribute('data-animate')) {
        child.setAttribute('data-animate', 'slide-up');
      }
      // Assign delay based on position (max 6 delays)
      const delayIndex = Math.min(index + 1, 6);
      child.setAttribute('data-animate-delay', delayIndex);
    });
  });

  // Re-run intersection observer for newly added attributes
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.08 }
  );

  document.querySelectorAll('[data-stagger] > *[data-animate]').forEach(el => {
    observer.observe(el);
  });
})();

/* ============================================================
   4. PROGRESS BAR ANIMATION (Loyalty / Stats)
   ============================================================ */
(function initProgressBars() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bars = document.querySelectorAll('.progress-bar__fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width') || '0%';

          if (prefersReducedMotion) {
            bar.style.width = targetWidth;
          } else {
            // Start from 0 and animate to target
            bar.style.width = '0%';
            requestAnimationFrame(() => {
              setTimeout(() => {
                bar.style.width = targetWidth;
              }, 100);
            });
          }

          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
})();

/* ============================================================
   5. NUMBER COUNT-UP ANIMATION (Stats)
   ============================================================ */
(function initCountUp() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stats = document.querySelectorAll('[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el       = entry.target;
          const target   = parseInt(el.getAttribute('data-count'), 10);
          const suffix   = el.getAttribute('data-count-suffix') || '';
          const duration = prefersReducedMotion ? 0 : 1500;

          if (duration === 0) {
            el.textContent = target + suffix;
          } else {
            animateCount(el, target, suffix, duration);
          }

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(el => observer.observe(el));
})();

function animateCount(el, target, suffix, duration) {
  const start    = Date.now();
  const initial  = 0;

  function step() {
    const elapsed  = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(initial + (target - initial) * eased);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(step);
}

/* ============================================================
   6. NAVBAR LOGO HOVER PULSE (subtle brand reinforcement)
   ============================================================ */
(function initLogoHover() {
  const logos = document.querySelectorAll('.navbar__logo-svg, .footer__logo-svg');
  logos.forEach(logo => {
    logo.style.transition = 'transform 0.3s ease';
    logo.closest('a')?.addEventListener('mouseenter', () => {
      logo.style.transform = 'rotate(-5deg) scale(1.1)';
    });
    logo.closest('a')?.addEventListener('mouseleave', () => {
      logo.style.transform = '';
    });
  });
})();

/* ============================================================
   7. CARD HOVER TILT (subtle 3D feel — desktop only)
   ============================================================ */
(function initCardTilt() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Only on desktop
  if (window.innerWidth < 1024) return;

  const tiltCards = document.querySelectorAll('.card, .deal-card, .pricing-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ============================================================
   8. SMOOTH IMAGE LOADING (fade in when loaded)
   ============================================================ */
(function initImageFadeIn() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.4s ease';

    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    }
  });
})();
