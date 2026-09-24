/**
 * DEAL — Navbar: hamburger drawer, dropdowns
 */
(function () {
  'use strict';

  function init () {
    const hamburger = document.querySelector('.nav-hamburger');
    const drawer    = document.querySelector('.nav-drawer');
    const overlay   = document.querySelector('.nav-drawer-overlay');
    const body      = document.body;

    function openDrawer () {
      hamburger && hamburger.classList.add('open');
      drawer    && drawer.classList.add('open');
      overlay   && overlay.classList.add('open');
      body.classList.add('nav-open');
    }
    function closeDrawer () {
      hamburger && hamburger.classList.remove('open');
      drawer    && drawer.classList.remove('open');
      overlay   && overlay.classList.remove('open');
      body.classList.remove('nav-open');
    }

    hamburger && hamburger.addEventListener('click', () => {
      hamburger.classList.contains('open') ? closeDrawer() : openDrawer();
    });
    overlay && overlay.addEventListener('click', closeDrawer);

    // Close on ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer();
    });

    // Drawer accordion for "Home" dropdown
    document.querySelectorAll('.drawer-toggle-sub').forEach(btn => {
      btn.addEventListener('click', () => {
        const sub = btn.nextElementSibling;
        const isOpen = sub && sub.classList.contains('open');
        document.querySelectorAll('.drawer-sub.open').forEach(s => s.classList.remove('open'));
        if (!isOpen && sub) sub.classList.add('open');
        const chevron = btn.querySelector('.nav-chevron');
        document.querySelectorAll('.drawer-toggle-sub .nav-chevron').forEach(c => c.style.transform = '');
        if (!isOpen && chevron) chevron.style.transform = 'rotate(180deg)';
      });
    });

    // Desktop dropdown — Home nav item
    document.querySelectorAll('.nav-dropdown-parent').forEach(li => {
      const toggle = li.querySelector('.nav-dropdown-toggle');
      toggle && toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        li.classList.toggle('open');
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.nav-dropdown-parent.open').forEach(li => li.classList.remove('open'));
    });

    // Focus-trap within drawer
    drawer && drawer.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const focusable = drawer.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 0));
  } else {
    setTimeout(init, 0);
  }
})();
