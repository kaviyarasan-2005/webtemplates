/* ============================================
   INKA — Main JavaScript
   Theme toggle, RTL, navigation, animations
   ============================================ */

'use strict';

/* ---- Theme Toggle ---- */
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('inka-theme') || 'light';
    this.apply(saved);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        this.apply(next);
      });
    });
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('inka-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
      const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      btn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
};

/* ---- RTL Toggle ---- */
const RTLManager = {
  init() {
    const saved = localStorage.getItem('inka-dir') || 'ltr';
    this.apply(saved);
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        const next = current === 'rtl' ? 'ltr' : 'rtl';
        this.apply(next);
      });
    });
  },
  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('inka-dir', dir);
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }
};

/* ---- Navbar ---- */
const NavbarManager = {
  init() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.hamburger');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.dropdowns = document.querySelectorAll('.nav-dropdown');

    if (this.navbar) {
      window.addEventListener('scroll', () => this.onScroll());
    }

    if (this.hamburger && this.mobileMenu) {
      this.hamburger.addEventListener('click', () => this.toggleMobile());
      // Close on link click
      this.mobileMenu.querySelectorAll('.nav-link:not(.dropdown-trigger)').forEach(link => {
        link.addEventListener('click', () => this.closeMobile());
      });
    }

    // Desktop dropdowns
    this.dropdowns.forEach(dd => {
      const trigger = dd.querySelector('.dropdown-trigger');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          // In mobile menu, toggle
          if (window.innerWidth <= 1024) {
            dd.classList.toggle('open');
          }
        });
      }
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        this.dropdowns.forEach(dd => dd.classList.remove('open'));
      }
    });

    // Active link
    this.setActiveLink();
  },

  onScroll() {
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  },

  toggleMobile() {
    this.hamburger.classList.toggle('active');
    this.mobileMenu.classList.toggle('active');
    document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
  },

  closeMobile() {
    if (this.hamburger && this.mobileMenu) {
      this.hamburger.classList.remove('active');
      this.mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes(currentPage)) {
        link.classList.add('active');
        const parent = link.closest('.nav-dropdown');
        if (parent) {
          parent.querySelector('.dropdown-trigger')?.classList.add('active');
        }
      }
    });
  }
};

/* ---- Scroll Reveal Animations ---- */
const RevealManager = {
  init() {
    this.elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (this.elements.length === 0) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.elements.forEach(el => this.observer.observe(el));
  }
};

/* ---- Counter Animation ---- */
const CounterManager = {
  init() {
    this.counters = document.querySelectorAll('[data-counter]');
    if (this.counters.length === 0) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.counters.forEach(el => this.observer.observe(el));
  },

  animate(el) {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    };

    requestAnimationFrame(update);
  }
};

/* ---- Accordion ---- */
const AccordionManager = {
  init() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const body = item.querySelector('.accordion-body');
        const isActive = item.classList.contains('active');

        // Close siblings
        item.parentElement.querySelectorAll('.accordion-item').forEach(sibling => {
          sibling.classList.remove('active');
          const sibBody = sibling.querySelector('.accordion-body');
          if (sibBody) sibBody.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }
};

/* ---- Lightbox ---- */
const LightboxManager = {
  init() {
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.getElementById('lightbox-img');
    if (!this.lightbox) return;

    document.querySelectorAll('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const src = trigger.getAttribute('data-lightbox') || trigger.querySelector('img')?.src;
        if (src) this.open(src);
      });
    });

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox || e.target.closest('.lightbox-close')) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  },

  open(src) {
    this.lightboxImg.src = src;
    this.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (this.lightbox) {
      this.lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
};

/* ---- Parallax ---- */
const ParallaxManager = {
  init() {
    this.elements = document.querySelectorAll('.hero-bg[data-parallax]');
    if (this.elements.length === 0) return;
    window.addEventListener('scroll', () => this.update(), { passive: true });
  },

  update() {
    const scrollY = window.scrollY;
    this.elements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }
};

/* ---- Smooth Scroll ---- */
const SmoothScrollManager = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
};

/* ---- Newsletter Form ---- */
const NewsletterManager = {
  init() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]');
        if (email && email.value) {
          const btn = form.querySelector('button');
          const originalText = btn.textContent;
          btn.textContent = 'Subscribed!';
          btn.disabled = true;
          btn.style.background = 'var(--color-success)';
          btn.style.borderColor = 'var(--color-success)';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.background = '';
            btn.style.borderColor = '';
            email.value = '';
          }, 3000);
        }
      });
    });
  }
};

/* ---- Contact Form ---- */
const ContactFormManager = {
  init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('error');
          valid = false;
        } else {
          input.classList.remove('error');
        }

        if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          input.classList.add('error');
          valid = false;
        }
      });

      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Message Sent!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          form.reset();
        }, 3000);
      }
    });

    // Remove error on input
    form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => input.classList.remove('error'));
    });
  }
};

/* ---- Blog Filter ---- */
const BlogFilterManager = {
  init() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-grid .blog-card');
    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        blogCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
            card.style.opacity = '0';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.3s ease';
              card.style.opacity = '1';
            });
          } else {
            card.style.opacity = '0';
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }
};

/* ---- Comment Form ---- */
const CommentFormManager = {
  init() {
    const form = document.getElementById('comment-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('error');
          valid = false;
        } else {
          input.classList.remove('error');
        }
      });
      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Comment Posted!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Post Comment';
          btn.disabled = false;
          form.reset();
        }, 3000);
      }
    });
  }
};

/* ---- Initialize All ---- */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  NavbarManager.init();
  RevealManager.init();
  CounterManager.init();
  AccordionManager.init();
  LightboxManager.init();
  ParallaxManager.init();
  SmoothScrollManager.init();
  NewsletterManager.init();
  ContactFormManager.init();
  BlogFilterManager.init();
  CommentFormManager.init();
});
