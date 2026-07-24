/* ==========================================
   SEWIT — Main JavaScript
   Navigation, Theme, RTL, Animations
   ========================================== */

'use strict';

// =============================
// DOM Ready
// =============================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavbar();
  initScrollReveal();
  initAccordions();
  initGallerySliders();
  initCounters();
});

// =============================
// Theme Toggle (Dark / Light)
// =============================
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const drawerToggle = document.getElementById('theme-toggle-drawer');
  const html = document.documentElement;

  // Check saved preference or system preference
  const saved = localStorage.getItem('sewit-theme');
  if (saved) {
    html.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  }

  updateThemeIcon();

  // Listen for system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('sewit-theme')) {
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateThemeIcon();
    }
  });

  function handleToggle() {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('sewit-theme', next);
    updateThemeIcon();
  }

  if (toggle) toggle.addEventListener('click', handleToggle);
  if (drawerToggle) drawerToggle.addEventListener('click', handleToggle);

  function updateThemeIcon() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const iconClass = isDark ? 'ph ph-moon' : 'ph ph-sun';
    
    [toggle, drawerToggle].forEach(btn => {
      if (btn) {
        const icon = btn.querySelector('i');
        if (icon) icon.className = iconClass;
      }
    });
  }
}


// =============================
// RTL / LTR Toggle
// =============================
function initRTL() {
  const toggle = document.getElementById('rtl-toggle');
  const drawerToggle = document.getElementById('rtl-toggle-drawer');
  const html = document.documentElement;

  // Check saved preference
  const saved = localStorage.getItem('sewit-dir');
  if (saved) {
    html.setAttribute('dir', saved);
  }

  updateRTLLabel();

  function handleToggle() {
    const current = html.getAttribute('dir') || 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    html.setAttribute('dir', next);
    localStorage.setItem('sewit-dir', next);
    updateRTLLabel();
  }

  if (toggle) toggle.addEventListener('click', handleToggle);
  if (drawerToggle) drawerToggle.addEventListener('click', handleToggle);

  function updateRTLLabel() {
    const isRTL = html.getAttribute('dir') === 'rtl';
    const label = isRTL ? 'LTR' : 'RTL';
    
    [toggle, drawerToggle].forEach(btn => {
      if (btn) btn.textContent = label;
    });
  }
}


// =============================
// Navbar
// =============================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('navbar-drawer');
  const overlay = document.getElementById('drawer-overlay');

  if (!navbar) return;

  // Scroll behavior — add glass effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    lastScroll = scrollY;
  }, { passive: true });

  // Hamburger menu
  if (hamburger && drawer && overlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      toggleDrawer(!isOpen);
    });

    overlay.addEventListener('click', () => {
      toggleDrawer(false);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        toggleDrawer(false);
      }
    });
  }

  function toggleDrawer(open) {
    if (open) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      hamburger.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Home dropdown in drawer
  const homeDropdownTrigger = document.getElementById('drawer-home-trigger');
  const homeDropdown = document.getElementById('drawer-home-dropdown');

  if (homeDropdownTrigger && homeDropdown) {
    homeDropdownTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      homeDropdown.classList.toggle('open');
    });
  }

  // Active page highlighting
  highlightActivePage();
}

function highlightActivePage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Desktop nav links
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('navbar__link--active');
    }
  });

  // Drawer links
  document.querySelectorAll('.drawer__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}


// =============================
// Scroll Reveal (Intersection Observer)
// =============================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  if (reveals.length === 0) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('revealed'));
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

  reveals.forEach(el => observer.observe(el));
}


// =============================
// Accordion
// =============================
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach(accordion => {
    const items = accordion.querySelectorAll('.accordion__item');

    items.forEach(item => {
      const trigger = item.querySelector('.accordion__trigger');
      const content = item.querySelector('.accordion__content');

      if (!trigger || !content) return;

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items in this accordion
        items.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion__content');
          if (otherContent) otherContent.style.maxHeight = null;
        });

        // Open clicked if it was closed
        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  });
}


// =============================
// Gallery Slider
// =============================
function initGallerySliders() {
  const sliders = document.querySelectorAll('.gallery-slider');

  sliders.forEach(slider => {
    const track = slider.querySelector('.gallery-slider__track');
    const slides = slider.querySelectorAll('.gallery-slider__slide');
    const prevBtn = slider.querySelector('.gallery-slider__btn--prev');
    const nextBtn = slider.querySelector('.gallery-slider__btn--next');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
    }, { passive: true });
  });
}


// =============================
// Counter Animation
// =============================
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  if (counters.length === 0) return;

  // Respect reduced motion
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';

        if (reduceMotion) {
          el.textContent = prefix + target.toLocaleString() + suffix;
        } else {
          animateCount(el, target, prefix, suffix);
        }
        
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
}

function animateCount(el, target, prefix, suffix) {
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}


// =============================
// Smooth Scroll for Anchor Links
// =============================
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  
  const targetId = link.getAttribute('href');
  if (targetId === '#') return;

  const targetEl = document.querySelector(targetId);
  if (targetEl) {
    e.preventDefault();
    const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
    const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }
});
