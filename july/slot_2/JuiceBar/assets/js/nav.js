/* ============================================================
   ZEST & BLEND — JavaScript: Navigation
   ============================================================ */
'use strict';

const NavManager = (() => {
  function init() {
    const navbar       = document.getElementById('navbar');
    const hamburger    = document.getElementById('hamburger');
    const navMenu      = document.getElementById('navMenu');
    const dropdownItems= document.querySelectorAll('.navbar__item--dropdown');

    // ─── Scroll behavior ──────────────────────────────────
    if (navbar) {
      const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // ─── Hamburger toggle ─────────────────────────────────
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
    }

    // ─── Dropdown menus ───────────────────────────────────
    dropdownItems.forEach((item) => {
      const btn = item.querySelector('.navbar__link--dropdown');
      const isMobile = () => window.innerWidth <= 1024;

      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = item.classList.toggle('navbar__item--open');
          btn.setAttribute('aria-expanded', String(isOpen));
          // Close other dropdowns
          dropdownItems.forEach((other) => {
            if (other !== item) {
              other.classList.remove('navbar__item--open');
              const otherBtn = other.querySelector('.navbar__link--dropdown');
              if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            }
          });
        });
      }

      // Desktop: hover to open
      item.addEventListener('mouseenter', () => {
        if (!isMobile()) {
          item.classList.add('navbar__item--open');
          btn && btn.setAttribute('aria-expanded', 'true');
        }
      });
      item.addEventListener('mouseleave', () => {
        if (!isMobile()) {
          item.classList.remove('navbar__item--open');
          btn && btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // ─── Close menu on outside click ──────────────────────
    document.addEventListener('click', (e) => {
      // Close dropdown
      dropdownItems.forEach((item) => {
        if (!item.contains(e.target)) {
          item.classList.remove('navbar__item--open');
          const btn = item.querySelector('.navbar__link--dropdown');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
      // Close mobile menu
      if (navMenu && hamburger && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // ─── Close mobile menu on resize ─────────────────────
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && navMenu) {
        navMenu.classList.remove('open');
        hamburger && hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // ─── Active link highlighting ─────────────────────────
    setActiveNavLink();

    // ─── Scroll to top button ─────────────────────────────
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
      window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
      }, { passive: true });
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  function setActiveNavLink() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';

    document.querySelectorAll('.navbar__link, .navbar__dropdown-item').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const linkFile = href.split('/').pop();
      if (linkFile && filename && (linkFile === filename || (filename === '' && linkFile === 'index.html'))) {
        link.classList.add('active');
      }
    });
  }

  return { init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', NavManager.init);
} else {
  NavManager.init();
}
