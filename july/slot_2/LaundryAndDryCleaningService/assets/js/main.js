/* ================================================================
   WASH — Main JavaScript
   Core functionality: Theme, RTL, Navigation, Animations
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   1. THEME TOGGLE (Dark / Light)
   ---------------------------------------------------------------- */
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('wash-theme') || 'light';
    this.set(saved);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        this.set(current === 'dark' ? 'light' : 'dark');
      });
    });
  },

  set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wash-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
        moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
      }
    });
  }
};

/* ----------------------------------------------------------------
   2. RTL / LTR TOGGLE
   ---------------------------------------------------------------- */
const RTLManager = {
  init() {
    const saved = localStorage.getItem('wash-dir') || 'ltr';
    this.set(saved);
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('dir');
        this.set(current === 'rtl' ? 'ltr' : 'rtl');
      });
    });
  },

  set(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('wash-dir', dir);
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }
};

/* ----------------------------------------------------------------
   3. NAVBAR
   ---------------------------------------------------------------- */
const Navbar = {
  init() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.navbar__hamburger');
    this.mobileMenu = document.querySelector('.navbar__mobile-menu');
    this.dropdownToggles = document.querySelectorAll('.navbar__mobile-dropdown-toggle');

    if (!this.navbar) return;

    // Scroll effect
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    // Hamburger toggle
    if (this.hamburger && this.mobileMenu) {
      this.hamburger.addEventListener('click', () => this.toggleMobile());
    }

    // Mobile dropdown toggles
    this.dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const items = toggle.nextElementSibling;
        if (items) {
          items.classList.toggle('active');
          toggle.classList.toggle('active');
        }
      });
    });

    // Close mobile menu on link click
    if (this.mobileMenu) {
      this.mobileMenu.querySelectorAll('a:not(.navbar__mobile-dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => this.closeMobile());
      });
    }

    // Close mobile menu on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        this.closeMobile();
      }
    });
  },

  handleScroll() {
    if (!this.navbar) return;
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
    if (this.hamburger) this.hamburger.classList.remove('active');
    if (this.mobileMenu) this.mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
};

/* ----------------------------------------------------------------
   4. SCROLL REVEAL ANIMATIONS
   ---------------------------------------------------------------- */
const ScrollReveal = {
  init() {
    this.elements = document.querySelectorAll('.reveal, .stagger-children');
    if (!this.elements.length) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    this.elements.forEach(el => this.observer.observe(el));
  }
};

/* ----------------------------------------------------------------
   5. COUNTER ANIMATION
   ---------------------------------------------------------------- */
const CounterAnimation = {
  init() {
    this.counters = document.querySelectorAll('[data-count]');
    if (!this.counters.length) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.counters.forEach(el => this.observer.observe(el));
  },

  animate(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
      const current = Math.round(eased * target);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }
};

/* ----------------------------------------------------------------
   6. ACCORDION
   ---------------------------------------------------------------- */
const Accordion = {
  init() {
    document.querySelectorAll('.accordion__header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const body = item.querySelector('.accordion__body');
        const isActive = item.classList.contains('active');

        // Close siblings in same accordion
        const accordion = item.closest('.accordion');
        if (accordion) {
          accordion.querySelectorAll('.accordion__item.active').forEach(activeItem => {
            if (activeItem !== item) {
              activeItem.classList.remove('active');
              const activeBody = activeItem.querySelector('.accordion__body');
              if (activeBody) activeBody.style.maxHeight = null;
            }
          });
        }

        // Toggle current
        item.classList.toggle('active');
        if (!isActive && body) {
          body.style.maxHeight = body.scrollHeight + 'px';
        } else if (body) {
          body.style.maxHeight = null;
        }
      });
    });
  }
};

/* ----------------------------------------------------------------
   7. SMOOTH SCROLL
   ---------------------------------------------------------------- */
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }
};

/* ----------------------------------------------------------------
   8. ACTIVE NAV LINK
   ---------------------------------------------------------------- */
const ActiveNav = {
  init() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Desktop nav
    document.querySelectorAll('.navbar__link, .navbar__dropdown-item').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const linkPath = href.split('/').pop();
        if (linkPath === currentPath) {
          link.classList.add('active');
          // Also highlight parent dropdown toggle
          const dropdown = link.closest('.navbar__dropdown');
          if (dropdown) {
            const toggle = dropdown.querySelector('.navbar__dropdown-toggle');
            if (toggle) toggle.classList.add('active');
          }
        }
      }
    });

    // Mobile nav
    document.querySelectorAll('.navbar__mobile-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const linkPath = href.split('/').pop();
        if (linkPath === currentPath) {
          link.classList.add('active');
        }
      }
    });
  }
};

/* ----------------------------------------------------------------
   9. LIGHTBOX
   ---------------------------------------------------------------- */
const Lightbox = {
  init() {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox__close');

    document.querySelectorAll('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const src = trigger.getAttribute('data-lightbox') || trigger.querySelector('img')?.src;
        if (src && lightboxImg) {
          lightboxImg.src = src;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close(lightbox));
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) this.close(lightbox);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        this.close(lightbox);
      }
    });
  },

  close(lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
};

/* ----------------------------------------------------------------
   10. LAZY LOADING IMAGES
   ---------------------------------------------------------------- */
const LazyLoad = {
  init() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.removeAttribute('data-src');
      });
    } else {
      // Fallback with IntersectionObserver
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });

      document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    }
  }
};

/* ----------------------------------------------------------------
   11. PARALLAX (subtle hero background)
   ---------------------------------------------------------------- */
const Parallax = {
  init() {
    this.elements = document.querySelectorAll('.hero__bg[data-parallax]');
    if (!this.elements.length) return;

    // Only on desktop, skip for performance on mobile
    if (window.innerWidth < 1024) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      this.elements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }
};

/* ----------------------------------------------------------------
   12. BLOG FILTER
   ---------------------------------------------------------------- */
const BlogFilter = {
  init() {
    const filterBtns = document.querySelectorAll('.blog-filter__btn');
    const blogCards = document.querySelectorAll('.blog-card[data-category]');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        blogCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
};

/* ----------------------------------------------------------------
   13. FORM VALIDATION
   ---------------------------------------------------------------- */
const FormValidator = {
  init() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validate(form)) {
          this.showSuccess(form);
        }
      });

      // Live validation on blur
      form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) {
            this.validateField(input);
          }
        });
      });
    });
  },

  validate(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      if (!this.validateField(input)) {
        valid = false;
      }
    });
    return valid;
  },

  validateField(input) {
    const value = input.value.trim();
    const type = input.getAttribute('type');
    const errorEl = input.parentElement.querySelector('.form-error') ||
                    input.nextElementSibling;
    let valid = true;
    let message = '';

    // Required check
    if (input.hasAttribute('required') && !value) {
      valid = false;
      message = 'This field is required';
    }

    // Email validation
    if (valid && type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        valid = false;
        message = 'Please enter a valid email';
      }
    }

    // Phone validation
    if (valid && type === 'tel' && value) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/;
      if (!phoneRegex.test(value)) {
        valid = false;
        message = 'Please enter a valid phone number';
      }
    }

    // Password min length
    if (valid && type === 'password' && value && input.hasAttribute('minlength')) {
      const minLen = parseInt(input.getAttribute('minlength'), 10);
      if (value.length < minLen) {
        valid = false;
        message = `Password must be at least ${minLen} characters`;
      }
    }

    // Confirm password
    if (valid && input.getAttribute('data-match')) {
      const matchInput = document.getElementById(input.getAttribute('data-match'));
      if (matchInput && value !== matchInput.value) {
        valid = false;
        message = 'Passwords do not match';
      }
    }

    // Update UI
    if (!valid) {
      input.classList.add('error');
      if (errorEl && errorEl.classList.contains('form-error')) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      }
    } else {
      input.classList.remove('error');
      if (errorEl && errorEl.classList.contains('form-error')) {
        errorEl.style.display = 'none';
      }
    }

    return valid;
  },

  showSuccess(form) {
    const successMsg = form.querySelector('.form-success');
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.style.animation = 'fadeInUp 0.4s ease';
      form.reset();
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 4000);
    }
  }
};

/* ----------------------------------------------------------------
   14. PASSWORD TOGGLE
   ---------------------------------------------------------------- */
const PasswordToggle = {
  init() {
    document.querySelectorAll('.form-password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input');
        if (!input) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        const eyeOpen = btn.querySelector('.icon-eye');
        const eyeClosed = btn.querySelector('.icon-eye-off');
        if (eyeOpen && eyeClosed) {
          eyeOpen.style.display = isPassword ? 'none' : 'block';
          eyeClosed.style.display = isPassword ? 'block' : 'none';
        }
      });
    });
  }
};

/* ----------------------------------------------------------------
   15. COUNTDOWN TIMER (Coming Soon)
   ---------------------------------------------------------------- */
const Countdown = {
  init() {
    const countdownEl = document.querySelector('.countdown');
    if (!countdownEl) return;

    const targetDate = countdownEl.getAttribute('data-target');
    if (!targetDate) return;

    const target = new Date(targetDate).getTime();
    this.daysEl = countdownEl.querySelector('[data-days]');
    this.hoursEl = countdownEl.querySelector('[data-hours]');
    this.minutesEl = countdownEl.querySelector('[data-minutes]');
    this.secondsEl = countdownEl.querySelector('[data-seconds]');

    this.update(target);
    setInterval(() => this.update(target), 1000);
  },

  update(target) {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (this.daysEl) this.daysEl.textContent = String(days).padStart(2, '0');
    if (this.hoursEl) this.hoursEl.textContent = String(hours).padStart(2, '0');
    if (this.minutesEl) this.minutesEl.textContent = String(minutes).padStart(2, '0');
    if (this.secondsEl) this.secondsEl.textContent = String(seconds).padStart(2, '0');
  }
};

/* ----------------------------------------------------------------
   16. BUBBLE ANIMATION (404, Coming Soon)
   ---------------------------------------------------------------- */
const BubbleAnimation = {
  init() {
    const container = document.querySelector('.bubbles');
    if (!container) return;

    for (let i = 0; i < 15; i++) {
      const bubble = document.createElement('div');
      bubble.classList.add('bubble');
      const size = Math.random() * 40 + 10;
      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = Math.random() * 100 + '%';
      bubble.style.animationDuration = Math.random() * 8 + 6 + 's';
      bubble.style.animationDelay = Math.random() * 5 + 's';
      container.appendChild(bubble);
    }
  }
};

/* ----------------------------------------------------------------
   17. MARQUEE (duplicate content for seamless loop)
   ---------------------------------------------------------------- */
const Marquee = {
  init() {
    document.querySelectorAll('.marquee-track').forEach(track => {
      if (track.dataset.duplicated) return;
      const items = track.innerHTML;
      track.innerHTML = items + items;
      track.dataset.duplicated = 'true';
    });
  }
};

/* ----------------------------------------------------------------
   INITIALIZE ALL
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  Navbar.init();
  ScrollReveal.init();
  CounterAnimation.init();
  Accordion.init();
  SmoothScroll.init();
  ActiveNav.init();
  Lightbox.init();
  LazyLoad.init();
  Parallax.init();
  BlogFilter.init();
  FormValidator.init();
  PasswordToggle.init();
  Countdown.init();
  BubbleAnimation.init();
  Marquee.init();
});
