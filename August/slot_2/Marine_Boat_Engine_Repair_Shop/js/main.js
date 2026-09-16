/* ========================================================================
   AnchorPoint Marine — Main JavaScript
   Marine & Boat Engine Repair Shop
   ES6+ | Modular Structure
   ======================================================================== */

'use strict';

/* ========================================================================
   1. THEME MANAGEMENT
   ======================================================================== */
const ThemeManager = (() => {
  const STORAGE_KEY = 'anchorpoint-theme';
  const html = document.documentElement;

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const theme = saved || getSystemPreference();
    apply(theme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        apply(e.matches ? 'dark' : 'light');
      }
    });
  }

  function apply(theme) {
    html.setAttribute('data-theme', theme);
    updateIcons(theme);
  }

  function toggle() {
    const current = html.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    apply(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  function updateIcons(theme) {
    const btns = document.querySelectorAll('[data-theme-toggle]');
    btns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  return { init, toggle };
})();


/* ========================================================================
   2. RTL MANAGEMENT
   ======================================================================== */
const RTLManager = (() => {
  const STORAGE_KEY = 'anchorpoint-dir';
  const html = document.documentElement;

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) apply(saved);
  }

  function apply(dir) {
    html.setAttribute('dir', dir);
    updateIcons(dir);
  }

  function toggle() {
    const current = html.getAttribute('dir') || 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    apply(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  function updateIcons(dir) {
    const btns = document.querySelectorAll('[data-rtl-toggle]');
    btns.forEach(btn => {
      const label = btn.querySelector('.rtl-label');
      if (label) label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left');
    });
  }

  return { init, toggle };
})();


/* ========================================================================
   3. NAVBAR
   ======================================================================== */
const Navbar = (() => {
  let lastScroll = 0;

  function init() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }
      lastScroll = scrollY;
    }, { passive: true });

    // Hamburger
    const hamburger = document.querySelector('.navbar__hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
      });

      // Close on link click
      mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        });
      });

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Mobile dropdown toggle
    const mobileDropdowns = document.querySelectorAll('.mobile-menu__dropdown-toggle');
    mobileDropdowns.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const sub = toggle.nextElementSibling;
        if (sub) {
          sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
          toggle.classList.toggle('active');
        }
      });
    });
  }

  return { init };
})();


/* ========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ======================================================================== */
const ScrollReveal = (() => {
  function init() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach((el, i) => {
      el.style.transitionDelay = `${i % 4 * 100}ms`;
      observer.observe(el);
    });
  }

  return { init };
})();


/* ========================================================================
   5. COUNTER ANIMATION
   ======================================================================== */
const CounterAnimation = (() => {
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      element.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  function init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  return { init };
})();


/* ========================================================================
   6. TESTIMONIAL CAROUSEL
   ======================================================================== */
const TestimonialCarousel = (() => {
  let currentSlide = 0;
  let autoPlayInterval = null;

  function init() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.testimonial-carousel__track');
    const slides = carousel.querySelectorAll('.testimonial-carousel__slide');
    const dots = carousel.querySelectorAll('.testimonial-carousel__dot');

    if (!slides.length) return;

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${index * 100}%)`;

      const dir = document.documentElement.getAttribute('dir');
      if (dir === 'rtl') {
        track.style.transform = `translateX(${index * 100}%)`;
      }

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoPlay();
      });
    });

    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }

    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    goToSlide(0);
    startAutoPlay();

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    carousel.addEventListener('mouseleave', startAutoPlay);
  }

  return { init };
})();


/* ========================================================================
   7. ACCORDION
   ======================================================================== */
const Accordion = (() => {
  function init() {
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
      const items = accordion.querySelectorAll('.accordion__item');
      items.forEach(item => {
        const header = item.querySelector('.accordion__header');
        const content = item.querySelector('.accordion__content');

        header.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Close all in this accordion
          items.forEach(i => {
            i.classList.remove('active');
            i.querySelector('.accordion__content').style.maxHeight = null;
          });

          // Open clicked one
          if (!isActive) {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });

        // Keyboard support
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            header.click();
          }
        });
      });
    });
  }

  return { init };
})();


/* ========================================================================
   8. TABS
   ======================================================================== */
const Tabs = (() => {
  function init() {
    const tabContainers = document.querySelectorAll('.tabs');
    tabContainers.forEach(container => {
      const tabs = container.querySelectorAll('.tabs__tab');
      const panels = container.querySelectorAll('.tabs__panel');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const targetId = tab.getAttribute('data-tab');

          tabs.forEach(t => t.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));

          tab.classList.add('active');
          const panel = container.querySelector(`#${targetId}`);
          if (panel) panel.classList.add('active');
        });
      });
    });
  }

  return { init };
})();


/* ========================================================================
   9. PRICING TOGGLE
   ======================================================================== */
const PricingToggle = (() => {
  function init() {
    const toggle = document.querySelector('.pricing-toggle__switch');
    if (!toggle) return;

    const monthlyLabel = document.querySelector('[data-pricing="monthly"]');
    const annualLabel = document.querySelector('[data-pricing="annual"]');
    const monthlyPrices = document.querySelectorAll('[data-price-monthly]');
    const annualPrices = document.querySelectorAll('[data-price-annual]');

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      const isAnnual = toggle.classList.contains('active');

      if (monthlyLabel) monthlyLabel.classList.toggle('active', !isAnnual);
      if (annualLabel) annualLabel.classList.toggle('active', isAnnual);

      monthlyPrices.forEach(el => {
        const monthly = el.getAttribute('data-price-monthly');
        const annual = el.getAttribute('data-price-annual');
        el.textContent = isAnnual ? annual : monthly;
      });
    });
  }

  return { init };
})();


/* ========================================================================
   10. FORM VALIDATION
   ======================================================================== */
const FormValidator = (() => {
  function init() {
    const forms = document.querySelectorAll('[data-validate]');
    forms.forEach(form => {
      form.setAttribute('novalidate', '');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(form)) {
          showFormSuccess(form);
        }
      });

      // Real-time validation
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) {
            validateField(input);
          }
        });
      });
    });
  }

  function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  function validateField(input) {
    const errorEl = input.parentElement.querySelector('.form-error');
    let message = '';

    // Required check
    if (input.hasAttribute('required') && !input.value.trim()) {
      message = 'This field is required';
    }
    // Email check
    else if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        message = 'Please enter a valid email address';
      }
    }
    // Phone check
    else if (input.type === 'tel' && input.value) {
      const phoneRegex = /^[\d\s\-+()]{7,}$/;
      if (!phoneRegex.test(input.value)) {
        message = 'Please enter a valid phone number';
      }
    }
    // Min length
    else if (input.minLength > 0 && input.value.length < input.minLength) {
      message = `Must be at least ${input.minLength} characters`;
    }

    if (message) {
      input.classList.add('error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
      }
      return false;
    } else {
      input.classList.remove('error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
      }
      return true;
    }
  }

  function showFormSuccess(form) {
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn ? btn.innerHTML : '';

    if (btn) {
      btn.innerHTML = '<i data-lucide="check-circle"></i> Submitted Successfully!';
      btn.style.background = 'var(--color-success)';
      btn.style.borderColor = 'var(--color-success)';
      btn.disabled = true;

      if (typeof lucide !== 'undefined') lucide.createIcons();

      setTimeout(() => {
        form.reset();
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 3000);
    }
  }

  return { init };
})();


/* ========================================================================
   11. BEFORE/AFTER COMPARISON SLIDER
   ======================================================================== */
const ComparisonSlider = (() => {
  function init() {
    const containers = document.querySelectorAll('.comparison');
    containers.forEach(container => {
      const slider = container.querySelector('.comparison__slider');
      const before = container.querySelector('.comparison__before');
      if (!slider || !before) return;

      let isDragging = false;

      function updatePosition(x) {
        const rect = container.getBoundingClientRect();
        let pos = ((x - rect.left) / rect.width) * 100;
        pos = Math.max(5, Math.min(95, pos));
        slider.style.left = `${pos}%`;
        before.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
      }

      slider.addEventListener('mousedown', () => isDragging = true);
      container.addEventListener('mousedown', () => isDragging = true);

      document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          e.preventDefault();
          updatePosition(e.clientX);
        }
      });

      document.addEventListener('mouseup', () => isDragging = false);

      // Touch support
      slider.addEventListener('touchstart', () => isDragging = true, { passive: true });
      container.addEventListener('touchstart', () => isDragging = true, { passive: true });

      document.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length) {
          updatePosition(e.touches[0].clientX);
        }
      }, { passive: true });

      document.addEventListener('touchend', () => isDragging = false);
    });
  }

  return { init };
})();


/* ========================================================================
   12. SKELETON LOADING
   ======================================================================== */
const SkeletonLoader = (() => {
  function init() {
    const skeletons = document.querySelectorAll('[data-skeleton]');
    skeletons.forEach(skeleton => {
      const delay = parseInt(skeleton.getAttribute('data-skeleton-delay') || '1500', 10);
      setTimeout(() => {
        skeleton.classList.add('loaded');
        const realContent = skeleton.querySelector('.skeleton-real');
        const skeletonContent = skeleton.querySelector('.skeleton-placeholder');
        if (realContent) realContent.style.display = '';
        if (skeletonContent) skeletonContent.style.display = 'none';
      }, delay);
    });
  }

  return { init };
})();


/* ========================================================================
   13. PAGE LOADER
   ======================================================================== */
const PageLoader = (() => {
  function init() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 400);
      }, 300);
    });
  }

  return { init };
})();


/* ========================================================================
   14. SMOOTH SCROLL
   ======================================================================== */
const SmoothScroll = (() => {
  function init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = document.querySelector('.navbar')?.offsetHeight || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  return { init };
})();


/* ========================================================================
   15. MARQUEE DUPLICATE (for infinite scroll)
   ======================================================================== */
const MarqueeSetup = (() => {
  function init() {
    const marquees = document.querySelectorAll('.marquee');
    marquees.forEach(marquee => {
      const items = marquee.innerHTML;
      marquee.innerHTML = items + items;
    });
  }

  return { init };
})();


/* ========================================================================
   INITIALIZATION
   ======================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  Navbar.init();
  PageLoader.init();
  ScrollReveal.init();
  CounterAnimation.init();
  TestimonialCarousel.init();
  Accordion.init();
  Tabs.init();
  PricingToggle.init();
  FormValidator.init();
  ComparisonSlider.init();
  SkeletonLoader.init();
  SmoothScroll.init();
  MarqueeSetup.init();

  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

/* ── Global event bindings ── */
document.addEventListener('click', (e) => {
  const themeToggle = e.target.closest('[data-theme-toggle]');
  if (themeToggle) {
    ThemeManager.toggle();
    return;
  }

  const rtlToggle = e.target.closest('[data-rtl-toggle]');
  if (rtlToggle) {
    RTLManager.toggle();
    return;
  }
});
