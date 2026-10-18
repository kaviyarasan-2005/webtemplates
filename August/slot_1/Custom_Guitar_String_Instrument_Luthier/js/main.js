/**
 * FRET — Main JavaScript
 * Handles Theme toggling, RTL toggling, Navbar, Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ── Theme Toggle ──────────────────────────────────────────────────────── */
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const htmlEl = document.documentElement;
  
  // Initialize theme from localStorage or system preference
  const initTheme = () => {
    const savedTheme = localStorage.getItem('fret-theme');
    if (savedTheme) {
      htmlEl.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      htmlEl.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    // Add transition class for smooth color change
    document.body.classList.add('theme-transitioning');
    
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('fret-theme', newTheme);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 300); // matches --transition-theme duration
  };

  // Bind theme toggles
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', toggleTheme);
    // Add aria-label
    toggle.setAttribute('aria-label', 'Toggle light/dark theme');
  });

  initTheme();

  /* ── RTL / LTR Toggle ──────────────────────────────────────────────────── */
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  
  // Initialize direction from localStorage
  const initRTL = () => {
    const savedDir = localStorage.getItem('fret-dir') || 'ltr';
    htmlEl.setAttribute('dir', savedDir);
    updateRtlToggleText(savedDir);
  };

  const updateRtlToggleText = (currentDir) => {
    // Requirements: "displays 'RTL' while in LTR mode (tap to switch) and 'LTR' while in RTL mode"
    const textToShow = currentDir === 'ltr' ? 'RTL' : 'LTR';
    rtlToggles.forEach(toggle => {
      toggle.textContent = textToShow;
      toggle.setAttribute('aria-label', `Switch to ${textToShow} layout`);
    });
  };

  const toggleRTL = () => {
    const currentDir = htmlEl.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    
    htmlEl.setAttribute('dir', newDir);
    localStorage.setItem('fret-dir', newDir);
    updateRtlToggleText(newDir);
  };

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', toggleRTL);
  });

  initRTL();

  /* ── Desktop Navigation Dropdowns ──────────────────────────────────────── */
  const navDropdowns = document.querySelectorAll('.nav-dropdown');

  navDropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-link');
    const menu = dropdown.querySelector('.nav-dropdown__menu');

    if (!trigger || !menu) return;

    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    // Click / Touch toggle on trigger
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = dropdown.classList.contains('active');

      // Close any other open desktop dropdowns
      navDropdowns.forEach(other => {
        if (other !== dropdown) {
          other.classList.remove('active');
          const otherTrigger = other.querySelector('.nav-link');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      dropdown.classList.toggle('active', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });

    // Prevent clicks inside the dropdown menu from closing it prematurely,
    // but let links navigate normally
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      navDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
        const trigger = dropdown.querySelector('.nav-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navDropdowns.forEach(dropdown => {
        if (dropdown.classList.contains('active')) {
          dropdown.classList.remove('active');
          const trigger = dropdown.querySelector('.nav-link');
          if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
            trigger.focus();
          }
        }
      });
    }
  });

  /* ── Mobile Menu (Hamburger) ───────────────────────────────────────────── */
  const hamburger = document.querySelector('.header__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const hasDropdowns = document.querySelectorAll('.mobile-menu__link[data-toggle="dropdown"]');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.contains('active');
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? '' : 'hidden';
      
      hamburger.setAttribute('aria-expanded', !isActive);
    });

    // Mobile dropdowns
    hasDropdowns.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const targetId = href && href.startsWith('#') ? href.substring(1) : '';
        const subMenu = targetId ? document.getElementById(targetId) : null;
        
        if (subMenu) {
          const isOpen = subMenu.classList.contains('active');
          subMenu.classList.toggle('active', !isOpen);
          link.classList.toggle('active', !isOpen);
          link.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
          const icon = link.querySelector('svg');
          if (icon) {
            icon.style.transform = !isOpen ? 'rotate(180deg)' : '';
          }
        }
      });
    });
  }

  /* ── Active Nav Link Highlighting ──────────────────────────────────────── */
  // Get current page path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const isHomePage = currentPath === 'index.html' || currentPath === 'home-2.html' || currentPath === '';

  // Desktop nav links
  const navLinks = document.querySelectorAll('.header__nav .nav-link');
  navLinks.forEach(link => {
    const isDropdownTrigger = link.closest('.nav-dropdown');
    const href = link.getAttribute('href');

    if (isDropdownTrigger) {
      if (isHomePage) {
        link.classList.add('nav-link--active');
      } else {
        link.classList.remove('nav-link--active');
      }
    } else if (href && href === currentPath) {
      link.classList.add('nav-link--active');
    } else {
      link.classList.remove('nav-link--active');
    }
  });

  // Desktop dropdown links
  const dropdownLinks = document.querySelectorAll('.nav-dropdown__link');
  dropdownLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (href === 'index.html' && currentPath === '')) {
      link.classList.add('nav-dropdown__link--active');
    } else {
      link.classList.remove('nav-dropdown__link--active');
    }
  });

  // Mobile links
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  mobileLinks.forEach(link => {
    const isDropdown = link.getAttribute('data-toggle') === 'dropdown';
    const href = link.getAttribute('href');

    if (isDropdown) {
      if (isHomePage) {
        link.classList.add('mobile-menu__link--active');
      } else {
        link.classList.remove('mobile-menu__link--active');
      }
    } else if (href && (href === currentPath || (href === 'index.html' && currentPath === ''))) {
      link.classList.add('mobile-menu__link--active');
    }
  });
});
