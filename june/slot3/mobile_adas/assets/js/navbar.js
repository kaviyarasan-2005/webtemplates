/* ============================================
   CALIBRATE ADAS — Navbar Injection
   ============================================ */

'use strict';

(() => {
  const isSubpage = window.location.pathname.includes('/pages/') || window.location.pathname.includes('\\pages\\');
  const basePath = isSubpage ? '../' : './';
  const pagesPath = isSubpage ? '' : 'pages/';

  // Get active page name to set active class
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  const navbarHtml = `
    <header class="navbar-wrapper">
      <nav class="navbar">
        <div class="container">
          <a href="${basePath}index.html" class="navbar-logo">
            <div class="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crosshair"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
            </div>
            <span class="logo-text">Nexo</span>
          </a>
          
          <div class="nav-menu">
            <div class="nav-item">
              <a href="#" class="nav-link ${page === 'index.html' || page === 'home2.html' ? 'active' : ''}">Home <i data-lucide="chevron-down"></i></a>
              <div class="dropdown-menu">
                <a href="${basePath}index.html" class="dropdown-link ${page === 'index.html' ? 'active' : ''}">Home 1</a>
                <a href="${pagesPath}home2.html" class="dropdown-link ${page === 'home2.html' ? 'active' : ''}">Home 2</a>
              </div>
            </div>
            <div class="nav-item">
              <a href="${pagesPath}about.html" class="nav-link ${page === 'about.html' ? 'active' : ''}">About</a>
            </div>
            <div class="nav-item">
              <a href="${pagesPath}services.html" class="nav-link ${page === 'services.html' ? 'active' : ''}">Services</a>
            </div>
            <div class="nav-item">
              <a href="${pagesPath}pricing.html" class="nav-link ${page === 'pricing.html' ? 'active' : ''}">Pricing</a>
            </div>
            <div class="nav-item">
              <a href="${pagesPath}contact.html" class="nav-link ${page === 'contact.html' ? 'active' : ''}">Contact</a>
            </div>
            <div class="nav-item">
              <a href="#" class="nav-link ${page.includes('dashboard') || page === 'login.html' || page === 'signup.html' ? 'active' : ''}">Dashboard <i data-lucide="chevron-down"></i></a>
              <div class="dropdown-menu">
                <a href="${pagesPath}admin-dashboard.html" class="dropdown-link ${page === 'admin-dashboard.html' ? 'active' : ''}">Admin</a>
                <a href="${pagesPath}user-dashboard.html" class="dropdown-link ${page === 'user-dashboard.html' ? 'active' : ''}">User</a>
              </div>
            </div>
          </div>
          
          <div class="navbar-actions">
            <button class="nav-toggle-btn rtl-toggle" aria-label="Toggle RTL Mode">
              <span class="toggle-label" style="font-size: var(--text-xs); font-weight: var(--weight-bold);">RTL</span>
            </button>
            <button class="nav-toggle-btn theme-toggle" aria-label="Toggle Theme">
              <i data-lucide="moon"></i>
            </button>
            <a href="${pagesPath}login.html" class="btn btn-primary nav-desktop-login" style="padding: 0.5rem 1rem; font-size: var(--text-sm); margin-inline-start: var(--space-2); text-decoration: none;">Login</a>
            <button class="hamburger" aria-label="Open Menu">
              <i data-lucide="menu"></i>
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile Navigation Drawer -->
      <div class="mobile-overlay"></div>
      <div class="mobile-nav">
        <div class="mobile-nav-header">
          <a href="${basePath}index.html" class="navbar-logo">
            <div class="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-crosshair"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
            </div>
            <span class="logo-text">Nexo</span>
          </a>
          <button class="mobile-nav-close" aria-label="Close Menu">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div class="mobile-nav-links">
          <a href="#" class="mobile-nav-link mobile-dropdown-trigger">Home <i data-lucide="chevron-down"></i></a>
          <div class="mobile-dropdown">
            <a href="${basePath}index.html">Home 1</a>
            <a href="${pagesPath}home2.html">Home 2</a>
          </div>
          
          <a href="${pagesPath}about.html" class="mobile-nav-link ${page === 'about.html' ? 'active' : ''}">About</a>
          <a href="${pagesPath}services.html" class="mobile-nav-link ${page === 'services.html' ? 'active' : ''}">Services</a>
          <a href="${pagesPath}pricing.html" class="mobile-nav-link ${page === 'pricing.html' ? 'active' : ''}">Pricing</a>
          <a href="${pagesPath}contact.html" class="mobile-nav-link ${page === 'contact.html' ? 'active' : ''}">Contact</a>
          
          <a href="#" class="mobile-nav-link mobile-dropdown-trigger">Dashboard <i data-lucide="chevron-down"></i></a>
          <div class="mobile-dropdown">
            <a href="${pagesPath}admin-dashboard.html">Admin</a>
            <a href="${pagesPath}user-dashboard.html">User</a>
          </div>

          <a href="${pagesPath}login.html" class="mobile-nav-link text-accent" style="margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--color-border); font-weight: var(--weight-bold);">Login / Sign Up</a>
        </div>
    </header>
  `;

  const initNavbar = () => {
    const isDashboard = page.includes('dashboard');
    if (isDashboard) {
      return;
    }

    const placeholder = document.getElementById('navbar-placeholder');
    if (placeholder) {
      placeholder.outerHTML = navbarHtml;
    } else {
      document.body.insertAdjacentHTML('afterbegin', navbarHtml);
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }
})();
