/* PAWS - Main JavaScript */
(function() {
  'use strict';

  /* Theme Toggle */
  const html = document.documentElement;
  const THEME_KEY = 'paws-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    document.querySelectorAll('.theme-toggle').forEach(function(btn) {
      btn.innerHTML = theme === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  setTheme(getPreferredTheme());

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.theme-toggle');
    if (btn) {
      var current = html.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    }
  });

  /* RTL Toggle */
  var RTL_KEY = 'paws-rtl';

  function getPreferredDir() {
    var stored = localStorage.getItem(RTL_KEY);
    if (stored) return stored;
    return 'ltr';
  }

  function setDirection(dir) {
    html.setAttribute('dir', dir);
    localStorage.setItem(RTL_KEY, dir);
    updateRtlLabel(dir);
  }

  function updateRtlLabel(dir) {
    document.querySelectorAll('.rtl-toggle').forEach(function(btn) {
      btn.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
      btn.setAttribute('aria-label', dir === 'ltr' ? 'Switch to RTL' : 'Switch to LTR');
    });
  }

  setDirection(getPreferredDir());

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.rtl-toggle');
    if (btn) {
      var current = html.getAttribute('dir');
      setDirection(current === 'ltr' ? 'rtl' : 'ltr');
    }
  });

  /* Mobile Menu */
  var menuToggle = document.querySelector('.mobile-menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuToggle && mobileNav) {
    var overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    document.body.appendChild(overlay);

    function openMenu() {
      menuToggle.classList.add('active');
      mobileNav.classList.add('open');
      overlay.classList.add('active');
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menuToggle.classList.remove('active');
      mobileNav.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(function() { overlay.style.display = 'none'; }, 300);
    }

    menuToggle.addEventListener('click', function() {
      if (mobileNav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    document.addEventListener('click', function(e) {
      if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* Header scroll shadow */
  var header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* Dropdown on click for touch devices */
  document.querySelectorAll('.nav-dropdown').forEach(function(dropdown) {
    var link = dropdown.querySelector('a');
    if (link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth < 1024) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    }
  });

  /* Accordion */
  document.addEventListener('click', function(e) {
    var header = e.target.closest('.accordion-header');
    if (!header) return;
    var item = header.parentElement;
    var body = item.querySelector('.accordion-body');
    var inner = body.querySelector('.accordion-body-inner');
    var isOpen = item.classList.contains('open');

    /* Close all others */
    item.parentElement.querySelectorAll('.accordion-item.open').forEach(function(openItem) {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion-body').style.maxHeight = '0';
      }
    });

    if (isOpen) {
      item.classList.remove('open');
      body.style.maxHeight = '0';
    } else {
      item.classList.add('open');
      body.style.maxHeight = inner.scrollHeight + 'px';
    }
  });

  /* Active nav link */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  /* Form validation */
  document.addEventListener('submit', function(e) {
    var form = e.target;
    if (!form.classList.contains('validate')) return;
    e.preventDefault();
    var valid = true;

    form.querySelectorAll('[required]').forEach(function(input) {
      var errorMsg = input.parentElement.querySelector('.error-message');
      if (!input.value.trim()) {
        input.classList.add('error');
        if (errorMsg) errorMsg.classList.add('visible');
        valid = false;
      } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.classList.add('error');
        if (errorMsg) errorMsg.classList.add('visible');
        valid = false;
      } else {
        input.classList.remove('error');
        if (errorMsg) errorMsg.classList.remove('visible');
      }
    });

    if (valid) {
      alert('Thank you! Your submission has been received.');
      form.reset();
    }
  });

  /* Clear errors on input */
  document.addEventListener('input', function(e) {
    if (e.target.classList.contains('error')) {
      e.target.classList.remove('error');
      var errorMsg = e.target.parentElement.querySelector('.error-message');
      if (errorMsg) errorMsg.classList.remove('visible');
    }
  });

})();
