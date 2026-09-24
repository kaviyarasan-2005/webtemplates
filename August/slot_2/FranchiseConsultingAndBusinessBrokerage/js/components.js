/**
 * DEAL — Shared Components: Navbar + Footer HTML injection
 */
(function () {
  'use strict';

  const NAV_HTML = `
<nav id="navbar" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <!-- Logo -->
    <a href="index.html" class="nav-logo" aria-label="DEAL Home">
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="nav-logo-svg">
        <path d="M16 4L4 9.5V21.5C4 26 9 30 16 32.5V4Z" class="logo-pillar" />
        <path d="M20 4L32 9.5V21.5C32 26 27 30 20 32.5V4Z" class="logo-arch" />
      </svg>
      <span class="nav-logo-text">DEAL</span>
    </a>

    <!-- Center links -->
    <ul class="nav-links" role="list">
      <li class="nav-dropdown-parent">
        <button class="nav-dropdown-toggle" aria-haspopup="true" aria-expanded="false">
          Home
          <svg class="nav-chevron" viewBox="0 0 24 24" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-dropdown" role="menu">
          <a href="index.html" role="menuitem">Home 1</a>
          <a href="home-2.html" role="menuitem">Home 2</a>
        </div>
      </li>
      <li><a href="about.html">About</a></li>
      <li><a href="services.html">Services</a></li>
      <li><a href="pricing.html">Pricing</a></li>
      <li><a href="blog.html">Blog</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>

    <!-- Right cluster -->
    <div class="nav-right">
      <button class="nav-icon-btn" data-theme-toggle aria-label="Toggle theme">
        <svg class="icon icon-md icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg class="icon icon-md icon-moon" viewBox="0 0 24 24" style="display:none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
      <button class="nav-rtl-btn" data-rtl-toggle aria-label="Switch layout direction">RTL</button>
      <a href="contact.html" class="btn btn-primary nav-cta">Book Free Consultation</a>
    </div>

    <!-- Hamburger -->
    <button class="nav-hamburger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<!-- Mobile Drawer -->
<div class="nav-drawer" role="dialog" aria-label="Mobile navigation" aria-modal="true">
  <div class="drawer-top">
    <a href="index.html" class="nav-logo" aria-label="DEAL Home">
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="nav-logo-svg" style="width:32px; height:32px;">
        <path d="M16 4L4 9.5V21.5C4 26 9 30 16 32.5V4Z" class="logo-pillar" />
        <path d="M20 4L32 9.5V21.5C32 26 27 30 20 32.5V4Z" class="logo-arch" />
      </svg>
      <span class="nav-logo-text" style="font-size:1.4rem;">DEAL</span>
    </a>
    <div class="drawer-toggles">
      <button class="nav-icon-btn" data-theme-toggle aria-label="Toggle theme">
        <svg class="icon icon-md icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg class="icon icon-md icon-moon" viewBox="0 0 24 24" style="display:none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
      <button class="nav-rtl-btn" data-rtl-toggle aria-label="Switch layout direction">RTL</button>
    </div>
  </div>
  <nav class="drawer-links">
    <button class="drawer-toggle-sub">
      Home
      <svg class="nav-chevron" viewBox="0 0 24 24" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div class="drawer-sub">
      <a href="index.html">Home 1</a>
      <a href="home-2.html">Home 2</a>
    </div>
    <a href="about.html">About</a>
    <a href="services.html">Services</a>
    <a href="pricing.html">Pricing</a>
    <a href="blog.html">Blog</a>
    <a href="contact.html">Contact</a>
  </nav>
  <div class="drawer-cta">
    <a href="contact.html" class="btn btn-primary">Book Free Consultation</a>
  </div>
</div>
<div class="nav-drawer-overlay"></div>`;

  const FOOTER_HTML = `
<footer id="footer" role="contentinfo">
  <div class="container">
    <div class="footer-grid">
      <!-- Brand -->
      <div class="footer-brand-col">
        <a href="index.html" class="footer-logo" aria-label="DEAL Home">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="footer-logo-svg">
            <path d="M16 4L4 9.5V21.5C4 26 9 30 16 32.5V4Z" class="logo-pillar" />
            <path d="M20 4L32 9.5V21.5C32 26 27 30 20 32.5V4Z" class="logo-arch" />
          </svg>
          <span class="footer-logo-text">DEAL</span>
        </a>
        <p class="footer-tagline">Your trusted partner in franchise consulting and business brokerage. We guide buyers, sellers, and investors to confident decisions.</p>
        <div class="footer-socials">
          <a href="#" class="footer-social-btn" aria-label="LinkedIn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </a>
          <a href="#" class="footer-social-btn" aria-label="Twitter / X">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#" class="footer-social-btn" aria-label="Facebook">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="#" class="footer-social-btn" aria-label="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
          </a>
        </div>
      </div>

      <!-- Quick Links -->
      <div>
        <p class="footer-col-heading">Quick Links</p>
        <ul class="footer-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About DEAL</a></li>
          <li><a href="pricing.html">Pricing</a></li>
          <li><a href="blog.html">Insights Blog</a></li>
          <li><a href="contact.html">Contact Us</a></li>
          <li><a href="coming-soon.html">Listings Portal</a></li>
        </ul>
      </div>

      <!-- Services -->
      <div>
        <p class="footer-col-heading">Services</p>
        <ul class="footer-links">
          <li><a href="services.html">Buy a Business</a></li>
          <li><a href="services.html">Sell Your Business</a></li>
          <li><a href="services.html">Franchise Consulting</a></li>
          <li><a href="service-details.html">Service Details</a></li>
          <li><a href="home-2.html">Franchise Investor</a></li>
          <li><a href="contact.html">Free Valuation</a></li>
        </ul>
      </div>

      <!-- Contact + Newsletter -->
      <div>
        <p class="footer-col-heading">Contact</p>
        <div class="footer-contact-item">
          <svg class="footer-contact-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>1250 Broadway, Suite 3600<br>New York, NY 10001</span>
        </div>
        <div class="footer-contact-item">
          <svg class="footer-contact-icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1.02-1.02a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z"/></svg>
          <span>+1 (212) 555-0180</span>
        </div>
        <div class="footer-contact-item">
          <svg class="footer-contact-icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span>hello@dealbrokerage.com</span>
        </div>
        <div class="footer-newsletter">
          <p class="footer-col-heading" style="margin-bottom:var(--space-2)">Deal Brief</p>
          <p style="font-size:var(--fs-xs);color:var(--footer-text);margin-bottom:var(--space-3);">Weekly market insights, direct to your inbox.</p>
          <form class="footer-newsletter-form" onsubmit="return false;">
            <input type="email" class="footer-newsletter-input" placeholder="Your email" aria-label="Email for newsletter">
            <button type="submit" class="footer-newsletter-btn">Subscribe</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <div class="footer-bar-inner">
      <p class="footer-bar-copy">&copy; 2026 DEAL Franchise Consulting &amp; Business Brokerage. All rights reserved.</p>
    </div>
  </div>
</footer>`;

  function inject () {
    const navPh    = document.getElementById('nav-placeholder');
    const footerPh = document.getElementById('footer-placeholder');
    if (navPh)    navPh.outerHTML    = NAV_HTML;
    if (footerPh) footerPh.outerHTML = FOOTER_HTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
