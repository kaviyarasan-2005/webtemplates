/**
 * nav.js — CREST Engravings
 * Handles: sticky header, hamburger, dropdowns, scroll-reveal,
 *           counter animation, accordion, tabs, filter pills,
 *           scroll-to-top, lightbox, ripple, count-up numbers
 */

;(function () {
  'use strict';

  /* ════════════════════════════════════════
     1. STICKY HEADER
  ════════════════════════════════════════ */
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ════════════════════════════════════════
     2. HAMBURGER / MOBILE NAV
  ════════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      hamburger.classList.toggle('is-open');
      navMenu.classList.toggle('nav__menu--open');
      document.body.classList.toggle('nav-open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('is-open');
        navMenu.classList.remove('nav__menu--open');
        document.body.classList.remove('nav-open');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('is-open');
        navMenu.classList.remove('nav__menu--open');
        document.body.classList.remove('nav-open');
        hamburger.focus();
      }
    });
  }

  /* ════════════════════════════════════════
     3. DROPDOWN MENUS
  ════════════════════════════════════════ */
  document.querySelectorAll('.nav__item--dropdown').forEach(item => {
    const btn = item.querySelector('.nav__link--dropdown');
    const dropdown = item.querySelector('.nav__dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains('dropdown-open');
      // Close all others
      document.querySelectorAll('.nav__item--dropdown.dropdown-open').forEach(d => {
        d.classList.remove('dropdown-open');
        d.querySelector('.nav__link--dropdown').setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('dropdown-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) {
        item.classList.remove('dropdown-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ════════════════════════════════════════
     4. SCROLL-TO-TOP BUTTON
  ════════════════════════════════════════ */
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ════════════════════════════════════════
     5. SCROLL REVEAL (IntersectionObserver)
  ════════════════════════════════════════ */
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-reveal-delay') || 0;
          setTimeout(() => {
            el.classList.add('revealed');
          }, Number(delay) * 120);
          ro.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => ro.observe(el));
  }

  /* ════════════════════════════════════════
     6. COUNT-UP ANIMATION
  ════════════════════════════════════════ */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        const tick = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
          const current = Math.round(ease * target);
          el.textContent = current.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  /* ════════════════════════════════════════
     7. TABS COMPONENT
  ════════════════════════════════════════ */
  document.querySelectorAll('.tabs').forEach(tabContainer => {
    const buttons = tabContainer.querySelectorAll('.tabs__btn');
    const panels = tabContainer.querySelectorAll('.tabs__panel');

    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b, i) => {
          b.classList.toggle('active', i === index);
          b.setAttribute('aria-selected', String(i === index));
        });
        panels.forEach((p, i) => {
          p.classList.toggle('active', i === index);
        });
      });
    });
  });

  /* ════════════════════════════════════════
     8. ACCORDION COMPONENT
  ════════════════════════════════════════ */
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('is-open');

      // Close siblings
      trigger.closest('.accordion').querySelectorAll('.accordion-item.is-open').forEach(openItem => {
        openItem.classList.remove('is-open');
        openItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    // Initialize open state from aria-expanded
    if (trigger.getAttribute('aria-expanded') === 'true') {
      trigger.closest('.accordion-item').classList.add('is-open');
    }
  });

  /* ════════════════════════════════════════
     9. FILTER PILLS (Products page)
  ════════════════════════════════════════ */
  const filterPills = document.querySelectorAll('.filter-pill');
  if (filterPills.length) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', function () {
        filterPills.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');

        const filter = this.getAttribute('data-filter');
        const items = document.querySelectorAll('.product-grid [data-category], .product-grid article');

        items.forEach(item => {
          const cat = item.getAttribute('data-category') || '';
          if (filter === 'all' || cat === filter) {
            item.style.display = '';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    // URL param on load
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) {
      const matchPill = document.querySelector(`.filter-pill[data-filter="${catParam}"]`);
      if (matchPill) matchPill.click();
    }
  }

  /* ════════════════════════════════════════
     10. LIGHTBOX
  ════════════════════════════════════════ */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('.lightbox__img');
    const lbClose = lightbox.querySelector('.lightbox__close');

    const openLightbox = (src, alt) => {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lightbox.classList.add('open');
      document.body.classList.add('lightbox-open');
      lbClose && lbClose.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.classList.remove('lightbox-open');
    };

    document.querySelectorAll('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const src = trigger.getAttribute('data-lightbox') || trigger.querySelector('img')?.src;
        const alt = trigger.querySelector('img')?.alt || '';
        if (src) openLightbox(src, alt);
      });

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
        }
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ════════════════════════════════════════
     11. ACTIVE NAV LINK (current page)
  ════════════════════════════════════════ */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__dropdown-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('?')[0].split('/').pop();
    if (href === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ════════════════════════════════════════
     12. NEWSLETTER FORM (client-side feedback)
  ════════════════════════════════════════ */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const btn = this.querySelector('button[type="submit"]');
      if (!emailInput || !emailInput.value.trim()) return;

      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Subscribing...';
      btn.disabled = true;

      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align:center;color:var(--color-gold);padding:var(--space-6);">
            <i class="fa-solid fa-circle-check" style="font-size:2rem;margin-bottom:var(--space-3);display:block;"></i>
            <strong>You're subscribed!</strong><br />
            <span style="font-size:var(--text-sm);opacity:0.75;">Thanks for joining the CREST community.</span>
          </div>
        `;
      }, 1200);
    });
  });

  /* ════════════════════════════════════════
     13. FORM SUCCESS TOAST
  ════════════════════════════════════════ */
  const toast = document.getElementById('form-success-toast');
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', function (e) {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = btn.innerHTML.replace('Sending...', 'Send Again');
          btn.disabled = false;
          if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4000);
          }
        }, 1800);
      }
    });
  });

  /* ════════════════════════════════════════
     14. HIGHLIGHT TODAY's HOURS CARD
  ════════════════════════════════════════ */
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayKey = days[new Date().getDay()];
  const todayCard = document.getElementById('card-' + todayKey);
  if (todayCard) {
    todayCard.classList.add('today');
    const badge = todayCard.querySelector('.hours-card__status');
    if (badge && todayKey !== 'sun') {
      badge.textContent = 'Open Today';
    }
  }

})();
