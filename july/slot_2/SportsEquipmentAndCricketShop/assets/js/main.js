/* ============================================
   APEX — Global JavaScript
   Navigation, Theme, RTL, Scroll Animations
   ============================================ */

(function() {
  'use strict';

  // ─── DOM Elements ───────────────────────────
  const html = document.documentElement;
  const body = document.body;
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navCloseBtn = document.getElementById('navCloseBtn');
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  const rtlToggle = document.getElementById('rtlToggle');
  const rtlToggleMobile = document.getElementById('rtlToggleMobile');

  // ─── Constants ──────────────────────────────
  const STORAGE_KEYS = {
    theme: 'apex-theme',
    direction: 'apex-direction'
  };

  // ─── Theme System ───────────────────────────
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEYS.theme);
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    updateThemeIcons(theme);
  }

  function updateThemeIcons(theme) {
    const sunSVG = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"></path></svg>`;
    const moonSVG = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.36A88,88,0,0,1,65.64,67.09,89,89,0,0,1,96,48.11,104.1,104.1,0,0,0,128,152a104.1,104.1,0,0,0,103.89,32A89,89,0,0,1,188.9,190.36Z"></path></svg>`;
    
    const icon = theme === 'dark' ? sunSVG : moonSVG;
    if (themeToggle) themeToggle.innerHTML = icon;
    if (themeToggleMobile) themeToggleMobile.innerHTML = icon;
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  function initTheme() {
    const stored = getStoredTheme();
    const theme = stored || getSystemTheme();
    setTheme(theme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getStoredTheme()) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ─── RTL/LTR System ────────────────────────
  function getStoredDirection() {
    return localStorage.getItem(STORAGE_KEYS.direction);
  }

  function setDirection(dir) {
    html.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEYS.direction, dir);
    updateDirectionLabels(dir);
  }

  function updateDirectionLabels(dir) {
    const label = dir === 'rtl' ? 'LTR' : 'RTL';
    if (rtlToggle) rtlToggle.textContent = label;
    if (rtlToggleMobile) rtlToggleMobile.textContent = label;
  }

  function toggleDirection() {
    const current = html.getAttribute('dir') || 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    setDirection(next);
  }

  function initDirection() {
    const stored = getStoredDirection();
    const dir = stored || 'ltr';
    setDirection(dir);
  }

  // ─── Navbar Scroll ─────────────────────────
  let lastScrollY = 0;

  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('at-top');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('at-top');
    }
    
    lastScrollY = scrollY;
  }

  function initNavbarScroll() {
    if (!navbar) return;
    navbar.classList.add('at-top');
    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  }

  // ─── Mobile Menu ───────────────────────────
  function openMobileMenu() {
    navMenu.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    body.classList.add('nav-open');
    if (navOverlay) {
      navOverlay.classList.add('active');
    }
  }

  function closeMobileMenu() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    body.classList.remove('nav-open');
    if (navOverlay) {
      navOverlay.classList.remove('active');
    }
    // Close any open dropdowns
    document.querySelectorAll('.nav-item.open').forEach(item => {
      item.classList.remove('open');
    });
  }

  function toggleMobileMenu() {
    if (navMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function initMobileMenu() {
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', toggleMobileMenu);

    if (navCloseBtn) {
      navCloseBtn.addEventListener('click', closeMobileMenu);
    }

    if (navOverlay) {
      navOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Close menu on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // ─── Dropdown ──────────────────────────────
  function initDropdowns() {
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');

    dropdownTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parent = trigger.closest('.nav-item');
        const isOpen = parent.classList.contains('open');

        // Close all other dropdowns
        document.querySelectorAll('.nav-item.open').forEach(item => {
          if (item !== parent) item.classList.remove('open');
        });

        parent.classList.toggle('open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen);
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item')) {
        document.querySelectorAll('.nav-item.open').forEach(item => {
          item.classList.remove('open');
          const trigger = item.querySelector('.dropdown-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // ─── Scroll Reveal ─────────────────────────
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  // ─── Active Nav Link ───────────────────────
  function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-trigger)');
    const dropdownItems = document.querySelectorAll('.dropdown-menu a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });

    // Check dropdown items for active state
    dropdownItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentPage) {
        item.classList.add('active');
        // Also highlight the parent dropdown trigger
        const parent = item.closest('.nav-item');
        if (parent) {
          const trigger = parent.querySelector('.dropdown-trigger');
          if (trigger) trigger.classList.add('active');
        }
      }
    });
  }

  // ─── Event Listeners ──────────────────────
  function bindEvents() {
    // Theme toggle
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

    // RTL toggle
    if (rtlToggle) rtlToggle.addEventListener('click', toggleDirection);
    if (rtlToggleMobile) rtlToggleMobile.addEventListener('click', toggleDirection);
  }

  // ─── Accordion ─────────────────────────────
  function initAccordions() {
    const triggers = document.querySelectorAll('.accordion-trigger');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const isActive = item.classList.contains('active');
        const accordion = item.closest('.accordion');

        // Close all items in this accordion
        if (accordion) {
          accordion.querySelectorAll('.accordion-item').forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
              const otherContent = otherItem.querySelector('.accordion-content');
              if (otherContent) otherContent.style.maxHeight = null;
            }
          });
        }

        // Toggle current item
        item.classList.toggle('active', !isActive);
        if (!isActive) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = null;
        }
      });
    });
  }

  // ─── Counter Animation ─────────────────────
  function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);

      element.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // ─── Gallery Slider ────────────────────────
  function initGallerySliders() {
    const sliders = document.querySelectorAll('.gallery-slider');

    sliders.forEach(slider => {
      const track = slider.querySelector('.gallery-slider-track');
      const images = track.querySelectorAll('img');
      const prevBtn = slider.querySelector('.gallery-slider-btn.prev');
      const nextBtn = slider.querySelector('.gallery-slider-btn.next');
      let currentIndex = 0;

      function goTo(index) {
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
    });
  }

  // ─── Smooth Page Load ──────────────────────
  function initPageLoad() {
    body.style.opacity = '0';
    body.style.transition = 'opacity 0.5s ease-out';
    
    requestAnimationFrame(() => {
      body.style.opacity = '1';
    });
  }

  // ─── Initialize Everything ─────────────────
  function init() {
    initTheme();
    initDirection();
    initPageLoad();
    initNavbarScroll();
    initMobileMenu();
    initDropdowns();
    initActiveNavLink();
    initScrollReveal();
    initAccordions();
    initCounterAnimation();
    initGallerySliders();
    bindEvents();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
