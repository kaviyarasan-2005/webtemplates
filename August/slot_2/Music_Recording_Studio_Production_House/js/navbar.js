/* ============================================================
   SoundForge Studios — Navbar Interactivity
   Hamburger, dropdowns, scroll behavior, active links
   ============================================================ */

const NavbarManager = (() => {

  /* ── Selectors ──────────────────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');

  /* ── Scroll behavior ────────────────────────────────────── */
  const handleScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  /* ── Hamburger toggle ───────────────────────────────────── */
  const toggleMobile = () => {
    if (!hamburger || !mobileMenu) return;
    const isOpen = hamburger.classList.toggle('is-open');
    mobileMenu.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMobile = () => {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  /* ── Desktop dropdown ───────────────────────────────────── */
  const initDesktopDropdowns = () => {
    document.querySelectorAll('.navbar__item--dropdown').forEach((item) => {
      const trigger = item.querySelector('.navbar__link--dropdown');
      const dropdown = item.querySelector('.navbar__dropdown');
      if (!trigger || !dropdown) return;

      let timeout;

      item.addEventListener('mouseenter', () => {
        clearTimeout(timeout);
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      });

      item.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        }, 120);
      });

      /* Keyboard: Enter/Space opens dropdown */
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const open = item.classList.toggle('is-open');
          trigger.setAttribute('aria-expanded', String(open));
        }
        if (e.key === 'Escape') {
          item.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });
    });
  };

  /* ── Mobile accordion dropdowns ─────────────────────────── */
  const initMobileDropdowns = () => {
    document.querySelectorAll('[data-mobile-dropdown-trigger]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-mobile-dropdown-trigger');
        const target = document.getElementById(targetId);
        if (!target) return;
        const icon = btn.querySelector('.mobile-dropdown-icon');
        const isOpen = target.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(isOpen));
        if (icon) {
          icon.style.transform = isOpen ? 'rotate(180deg)' : '';
        }
      });
    });
  };

  /* ── Active link highlighter ────────────────────────────── */
  const setActiveLink = () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__link, .navbar__dropdown-link, .navbar__mobile-link, .navbar__mobile-sub-link').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const linkFile = href.split('/').pop();
      if (linkFile === currentPath) {
        link.classList.add('active');
        /* Also mark parent dropdown trigger */
        const parentItem = link.closest('.navbar__item--dropdown');
        if (parentItem) {
          const trigger = parentItem.querySelector('.navbar__link');
          if (trigger) trigger.classList.add('active');
        }
      }
    });
  };

  /* ── Close mobile on outside click ─────────────────────── */
  const handleOutsideClick = (e) => {
    if (
      mobileMenu &&
      mobileMenu.classList.contains('is-open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMobile();
    }
  };

  /* ── Close mobile on ESC ────────────────────────────────── */
  const handleKeydown = (e) => {
    if (e.key === 'Escape') closeMobile();
  };

  /* ── Init ─────────────────────────────────────────────── */
  const init = () => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (hamburger) {
      hamburger.addEventListener('click', toggleMobile);
    }

    initDesktopDropdowns();
    initMobileDropdowns();
    setActiveLink();

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeydown);
  };

  return { init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', NavbarManager.init);
} else {
  NavbarManager.init();
}
