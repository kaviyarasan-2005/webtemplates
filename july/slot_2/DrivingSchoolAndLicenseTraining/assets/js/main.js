/* ============================================
   DRIV — Main JavaScript
   Core functionality for all pages
   ============================================ */

(function () {
  'use strict';

  // ---- Theme Management ----
  const ThemeManager = {
    init() {
      const saved = localStorage.getItem('driv-theme') || 'light';
      this.set(saved);
      document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => this.toggle());
      });
    },
    set(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('driv-theme', theme);
      document.querySelectorAll('.theme-toggle').forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      });
    },
    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      this.set(current === 'dark' ? 'light' : 'dark');
    }
  };

  // ---- RTL Management ----
  const RTLManager = {
    init() {
      const saved = localStorage.getItem('driv-dir') || 'ltr';
      this.set(saved);
      document.querySelectorAll('.rtl-toggle').forEach(btn => {
        btn.addEventListener('click', () => this.toggle());
      });
    },
    set(dir) {
      document.documentElement.setAttribute('dir', dir);
      localStorage.setItem('driv-dir', dir);
      document.querySelectorAll('.rtl-toggle').forEach(btn => {
        btn.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
      });
    },
    toggle() {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      this.set(current === 'ltr' ? 'rtl' : 'ltr');
    }
  };

  // ---- Navbar ----
  const Navbar = {
    init() {
      this.navbar = document.querySelector('.navbar');
      this.hamburger = document.querySelector('.navbar__hamburger');
      this.mobileMenu = document.querySelector('.navbar__mobile-menu');
      this.dropdowns = document.querySelectorAll('.navbar__dropdown');

      if (this.hamburger) {
        this.hamburger.addEventListener('click', () => this.toggleMobile());
      }

      // Scroll behavior
      window.addEventListener('scroll', () => this.onScroll());

      // Desktop dropdowns
      this.dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.navbar__dropdown-toggle');
        if (toggle) {
          toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
              e.preventDefault();
              dropdown.classList.toggle('open');
            }
          });
        }
      });

      // Close mobile menu on link click
      if (this.mobileMenu) {
        this.mobileMenu.querySelectorAll('a:not(.navbar__dropdown-toggle)').forEach(link => {
          link.addEventListener('click', () => this.closeMobile());
        });
      }

      // Close mobile menu on outside click
      document.addEventListener('click', (e) => {
        if (this.mobileMenu && this.mobileMenu.classList.contains('open')) {
          if (!this.mobileMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
            this.closeMobile();
          }
        }
      });

      // Scroll behavior
      window.addEventListener('scroll', () => this.onScroll());
      this.onScroll();

      // Set active nav link
      this.setActive();
    },
    toggleMobile() {
      this.hamburger.classList.toggle('active');
      this.mobileMenu.classList.toggle('open');
      document.body.style.overflow = this.mobileMenu.classList.contains('open') ? 'hidden' : '';
    },
    closeMobile() {
      if (this.hamburger) this.hamburger.classList.remove('active');
      if (this.mobileMenu) this.mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    },
    onScroll() {
      if (this.navbar) {
        this.navbar.classList.toggle('scrolled', window.scrollY > 20);
      }
    },
    setActive() {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('.navbar__link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
          link.classList.add('active');
        }
      });
    }
  };

  // ---- Scroll Animations ----
  const ScrollAnimations = {
    init() {
      this.elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in');
      if (this.elements.length === 0) return;

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

      this.elements.forEach(el => this.observer.observe(el));
    }
  };

  // ---- Counter Animation ----
  const CounterAnimation = {
    init() {
      const counters = document.querySelectorAll('[data-count]');
      if (counters.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => observer.observe(counter));
    },
    animate(el) {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * eased);
        el.textContent = prefix + current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }
  };

  // ---- Accordion ----
  const Accordion = {
    init() {
      document.querySelectorAll('.accordion__header').forEach(header => {
        header.addEventListener('click', () => {
          const item = header.parentElement;
          const body = item.querySelector('.accordion__body');
          const isActive = item.classList.contains('active');

          // Close all in same accordion
          const accordion = item.closest('.accordion');
          accordion.querySelectorAll('.accordion__item').forEach(other => {
            other.classList.remove('active');
            const otherBody = other.querySelector('.accordion__body');
            if (otherBody) otherBody.style.maxHeight = null;
          });

          if (!isActive) {
            item.classList.add('active');
            body.style.maxHeight = body.scrollHeight + 'px';
          }
        });
      });
    }
  };

  // ---- Smooth Scroll ----
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const target = document.querySelector(link.getAttribute('href'));
          if (target) {
            e.preventDefault();
            const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'), 10) || 72;
            window.scrollTo({
              top: target.offsetTop - offset,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  };

  // ---- Lazy Loading ----
  const LazyLoad = {
    init() {
      const images = document.querySelectorAll('img[data-src]');
      if (images.length === 0) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            if (img.getAttribute('data-srcset')) {
              img.srcset = img.getAttribute('data-srcset');
            }
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });

      images.forEach(img => observer.observe(img));
    }
  };

  // ---- Filter Buttons ----
  const FilterButtons = {
    init() {
      const filterBars = document.querySelectorAll('.filter-bar');
      filterBars.forEach(bar => {
        const buttons = bar.querySelectorAll('.filter-btn');
        const targetId = bar.getAttribute('data-filter-target');
        const target = document.getElementById(targetId);

        buttons.forEach(btn => {
          btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-filter');

            if (target) {
              const items = target.querySelectorAll('[data-category]');
              items.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                  item.style.display = '';
                  item.style.opacity = '1';
                  item.style.transform = 'scale(1)';
                } else {
                  item.style.opacity = '0';
                  item.style.transform = 'scale(0.9)';
                  setTimeout(() => { item.style.display = 'none'; }, 300);
                }
              });
            }
          });
        });
      });
    }
  };

  // ---- Lightbox ----
  const Lightbox = {
    init() {
      const items = document.querySelectorAll('[data-lightbox]');
      if (items.length === 0) return;

      // Create lightbox element
      const overlay = document.createElement('div');
      overlay.id = 'lightbox-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:none;align-items:center;justify-content:center;cursor:pointer;';
      overlay.innerHTML = '<img style="max-width:90vw;max-height:90vh;border-radius:8px;object-fit:contain;" />';
      document.body.appendChild(overlay);

      const img = overlay.querySelector('img');

      items.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
          const src = item.getAttribute('data-lightbox') || item.querySelector('img')?.src;
          if (src) {
            img.src = src;
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
          }
        });
      });

      overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
          overlay.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    }
  };

  // ---- Marquee ----
  const Marquee = {
    init() {
      document.querySelectorAll('.marquee').forEach(marquee => {
        // Duplicate content for seamless loop
        const content = marquee.innerHTML;
        marquee.innerHTML = content + content;
      });
    }
  };

  // ---- Newsletter Form ----
  const NewsletterForm = {
    init() {
      document.querySelectorAll('.newsletter-form').forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const input = form.querySelector('input[type="email"]');
          const btn = form.querySelector('button');

          if (input && input.value && input.checkValidity()) {
            btn.textContent = 'Subscribed!';
            btn.disabled = true;
            btn.style.opacity = '0.7';
            input.value = '';
            setTimeout(() => {
              btn.textContent = 'Subscribe';
              btn.disabled = false;
              btn.style.opacity = '1';
            }, 3000);
          }
        });
      });
    }
  };

  // ---- Back to Top ----
  const BackToTop = {
    init() {
      const btn = document.createElement('button');
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Back to top');
      btn.innerHTML = '<i data-lucide="chevron-up"></i>';
      btn.style.cssText = 'position:fixed;bottom:24px;right:24px;width:44px;height:44px;border-radius:10px;background:var(--color-primary);color:white;display:none;align-items:center;justify-content:center;z-index:100;box-shadow:var(--shadow-md);transition:all 0.25s ease;cursor:pointer;border:none;';
      document.body.appendChild(btn);

      window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 500 ? 'flex' : 'none';
      });

      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-3px)';
        btn.style.boxShadow = 'var(--shadow-lg)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.boxShadow = 'var(--shadow-md)';
      });

      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  };

  // ---- Interactive Speedometer & Telemetry ----
  const Speedometer = {
    init() {
      const needle = document.querySelector('.speedometer-needle');
      if (!needle) return;
      setTimeout(() => {
        needle.style.transform = 'rotate(135deg)';
      }, 500);
    }
  };

  // ---- Reading Progress Bar ----
  const ReadingProgress = {
    init() {
      const bar = document.querySelector('.reading-bar');
      if (!bar) return;
      window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / total) * 100;
        bar.style.width = Math.min(progress, 100) + '%';
      });
    }
  };

  // ---- Diagnostic Readiness Quiz Engine ----
  const DiagnosticQuiz = {
    init() {
      const container = document.querySelector('.readiness-quiz-container');
      if (!container) return;
      const btns = container.querySelectorAll('.quiz-option-btn');
      const resultBox = container.querySelector('.quiz-result-box');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (resultBox) {
            resultBox.style.display = 'block';
            resultBox.textContent = 'Recommended Program: ' + (btn.getAttribute('data-recommendation') || 'Beginner Driving Lessons (10-Hour Block)');
          }
        });
      });
    }
  };

  // ---- Initialize Everything ----
  function init() {
    ThemeManager.init();
    RTLManager.init();

    if (document.querySelector('.navbar')) Navbar.init();

    ScrollAnimations.init();
    CounterAnimation.init();
    Accordion.init();
    SmoothScroll.init();
    LazyLoad.init();
    FilterButtons.init();
    Lightbox.init();
    Marquee.init();
    NewsletterForm.init();
    Speedometer.init();
    ReadingProgress.init();
    DiagnosticQuiz.init();

    // Only add back-to-top on pages with footer (not auth/error pages)
    if (document.querySelector('.footer')) BackToTop.init();

    // Re-init Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

