/* ============================================
   BLOOM — Main JavaScript
   Core functionality for all pages
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initRTLToggle();
  initMobileMenu();
  initNavbarScroll();
  initScrollReveal();
  initHomeDropdown();
  initActiveNavLink();
  initAccordions();
  initCounterAnimation();
  initGallerySliders();
});

/* --- Theme Toggle (Dark / Light) --- */
function initThemeToggle() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const html = document.documentElement;

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('bloom-theme');
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  }

  updateThemeIcons();

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('bloom-theme', newTheme);
      updateThemeIcons();
    });
  });

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('bloom-theme')) {
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateThemeIcons();
    }
  });
}

function updateThemeIcons() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = isDark ? 'ph ph-sun' : 'ph ph-moon';
    }
  });
}

/* --- RTL / LTR Toggle --- */
function initRTLToggle() {
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  const html = document.documentElement;

  // Check saved preference
  const savedDir = localStorage.getItem('bloom-dir');
  if (savedDir) {
    html.setAttribute('dir', savedDir);
  }

  updateRTLLabels();

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentDir = html.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      html.setAttribute('dir', newDir);
      localStorage.setItem('bloom-dir', newDir);
      updateRTLLabels();
    });
  });
}

function updateRTLLabels() {
  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
  document.querySelectorAll('.rtl-toggle').forEach(btn => {
    btn.textContent = isRTL ? 'LTR' : 'RTL';
  });
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close button inside menu
  const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Mobile dropdown
  const mobileDropdown = document.querySelector('.mobile-dropdown-toggle');
  if (mobileDropdown) {
    mobileDropdown.addEventListener('click', (e) => {
      e.preventDefault();
      const items = mobileDropdown.nextElementSibling;
      if (items) items.classList.toggle('open');
      const icon = mobileDropdown.querySelector('i');
      if (icon) icon.style.transform = items.classList.contains('open') ? 'rotate(180deg)' : '';
    });
  }

  // Close menu on link click
  mobileMenu.querySelectorAll('a:not(.mobile-dropdown-toggle)').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Navbar Scroll Effect --- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Respect prefers-reduced-motion
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
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --- Home Dropdown --- */
function initHomeDropdown() {
  const dropdown = document.querySelector('.nav-dropdown');
  if (!dropdown) return;

  const toggle = dropdown.querySelector('.nav-dropdown-toggle');

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
    }
  });
}

/* --- Active Nav Link --- */
function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPage = href.split('/').pop();

    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --- Accordion --- */
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = header.nextElementSibling;
      const isActive = item.classList.contains('active');

      // Close all siblings
      const parent = item.parentElement;
      parent.querySelectorAll('.accordion-item').forEach(sibling => {
        sibling.classList.remove('active');
        const sibBody = sibling.querySelector('.accordion-body');
        if (sibBody) sibBody.style.maxHeight = null;
      });

      // Open clicked item
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* --- Counter Animation --- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter-number');
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

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 16);
}

/* --- Gallery Slider --- */
function initGallerySliders() {
  const sliders = document.querySelectorAll('.gallery-slider');

  sliders.forEach(slider => {
    const track = slider.querySelector('.gallery-slider-track');
    const prevBtn = slider.querySelector('.gallery-slider-btn.prev');
    const nextBtn = slider.querySelector('.gallery-slider-btn.next');
    if (!track || !prevBtn || !nextBtn) return;

    const images = track.querySelectorAll('img');
    let currentIndex = 0;

    const updateSlider = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateSlider();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateSlider();
    });
  });
}

/* --- Utility: Smooth scroll to element --- */
function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
