/* ============================================================
   ClearShield — Navbar Manager
   ============================================================ */
const NavbarManager = (() => {
  'use strict';
  const navbar    = document.getElementById('main-navbar');
  const hamburger = document.getElementById('navbar-hamburger');
  const menu      = document.getElementById('navbar-menu');
  const ddTrigger = document.getElementById('home-dropdown-trigger');
  const ddParent  = ddTrigger?.closest('.navbar__item--dropdown');

  function scrollHandler() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  function toggleMenu(force) {
    if (!hamburger || !menu) return;
    const open = force !== undefined ? !force : !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function toggleDropdown(force) {
    if (!ddParent || !ddTrigger) return;
    const open = force !== undefined ? !force : !ddParent.classList.contains('open');
    ddParent.classList.toggle('open', open);
    ddTrigger.setAttribute('aria-expanded', String(open));
  }

  function setActive() {
    const page = window.location.pathname.split('/').pop() || 'home1.html';
    document.querySelectorAll('.navbar__link, .navbar__dropdown-item').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === page) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        if (link.classList.contains('navbar__dropdown-item')) {
          ddTrigger?.classList.add('active');
        }
      }
    });
  }

  function init() {
    if (!navbar) return;
    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler();
    hamburger?.addEventListener('click', () => toggleMenu());
    ddTrigger?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggleDropdown(); });
    document.addEventListener('click', e => {
      if (ddParent && !ddParent.contains(e.target)) toggleDropdown(true);
      if (menu?.classList.contains('open') && !menu.contains(e.target) && !hamburger.contains(e.target)) toggleMenu(true);
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 1024) { toggleMenu(true); document.body.style.overflow = ''; } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { toggleMenu(true); toggleDropdown(true); } });
    setActive();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', NavbarManager.init);
