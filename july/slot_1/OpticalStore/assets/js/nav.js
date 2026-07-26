/**
 * nav.js – VisionCare Optical
 * Shared navbar + footer injection, hamburger menu, scroll effects
 */

(function () {
  'use strict';

  /* ── Path resolver ── */
  const isRoot = !window.location.pathname.includes('/pages/');
  const base   = isRoot ? '' : '../';

  /* ── Shared Navbar HTML ── */
  function buildNav() {
    const path = window.location.pathname;
    const isHome1   = path === '/' || path.endsWith('index.html');
    const isHome2   = path.includes('home2');
    const isAbout   = path.includes('about');
    const isService = path.includes('service');
    const isBlog    = path.includes('blog');
    const isPricing = path.includes('pricing');
    const isContact = path.includes('contact');

    function active(check) {
      return check ? 'active' : '';
    }

    return `
    <!-- Page Loader -->
    <div class="page-loader" id="pageLoader" aria-hidden="true">
      <div class="page-loader-logo">
        <div class="page-loader-icon">
          <img src="${base}assets/images/favicon.png" alt="Optic Logo" class="logo-icon-img">
        </div>
        <span class="page-loader-text">Optic</span>
      </div>
    </div>

    <!-- Skip Link -->
    <a class="skip-link" href="#main-content">Skip to main content</a>

    <!-- Navbar -->
    <nav class="navbar" id="navbar" role="navigation" aria-label="Main navigation">
      <div class="nav-container">

        <!-- Brand -->
        <a href="${base}index.html" class="nav-brand" aria-label="Optic - Home">
          <div class="nav-logo" aria-hidden="true">
            <img src="${base}assets/images/favicon.png" alt="Optic Logo" class="logo-icon-img">
          </div>
          <div class="nav-brand-text">
            <span class="nav-brand-name">Optic</span>
          </div>
        </a>

        <!-- Desktop Menu -->
        <ul class="nav-menu" role="list">
          <li class="nav-item">
            <a href="${base}index.html"
               class="nav-link ${active(isHome1 || isHome2)}"
               aria-haspopup="true"
               aria-expanded="false">
              Home
              <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
            </a>
            <div class="nav-dropdown" role="menu">
              <a href="${base}index.html"
                 class="nav-dropdown-item ${active(isHome1)}" role="menuitem">
                Home 1
              </a>
              <a href="${base}pages/home2.html"
                 class="nav-dropdown-item ${active(isHome2)}" role="menuitem">
                Home 2
              </a>
            </div>
          </li>
          <li class="nav-item">
            <a href="${base}pages/about.html"
               class="nav-link ${active(isAbout)}">About</a>
          </li>
          <li class="nav-item">
            <a href="${base}pages/service.html"
               class="nav-link ${active(isService)}">Services</a>
          </li>
          <li class="nav-item">
            <a href="${base}pages/blog.html"
               class="nav-link ${active(isBlog)}">Blog</a>
          </li>
          <li class="nav-item">
            <a href="${base}pages/pricing.html"
               class="nav-link ${active(isPricing)}">Pricing</a>
          </li>
          <li class="nav-item">
            <a href="${base}pages/contact.html"
               class="nav-link ${active(isContact)}">Contact</a>
          </li>
        </ul>

        <!-- Nav Actions -->
        <div class="nav-actions">
          <!-- RTL Toggle -->
          <button class="toggle-btn"
                  data-dir-toggle
                  aria-label="Switch to RTL layout"
                  title="Switch to RTL layout">
            <span class="toggle-label">RTL</span>
          </button>

          <!-- Theme Toggle -->
          <button class="toggle-btn"
                  data-theme-toggle
                  aria-label="Switch to dark mode"
                  title="Switch to dark mode">
            <i class="fa-solid fa-moon" aria-hidden="true"></i>
          </button>

          <!-- Login CTA -->
          <a href="${base}pages/login.html"
             class="btn btn-primary btn-sm"
             style="display:none"
             id="navLoginBtn">
            <i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i>
            Login
          </a>
          <div id="navLoginDesktop" class="show-desktop">
            <a href="${base}pages/login.html"
               class="btn btn-primary btn-sm">
              <i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i>
              Login
            </a>
          </div>

          <!-- Hamburger -->
          <button class="nav-hamburger"
                  id="hamburger"
                  aria-label="Open navigation menu"
                  aria-expanded="false"
                  aria-controls="mobileNav">
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
            <span class="hamburger-line" aria-hidden="true"></span>
          </button>
        </div>

      </div>
    </nav>

    <!-- Mobile Nav -->
    <div class="mobile-nav" id="mobileNav" role="dialog" aria-label="Mobile navigation" aria-hidden="true">
      <ul class="mobile-nav-menu" role="list">
        <li class="mobile-nav-item">
          <button class="mobile-nav-link" id="mobileHomeToggle"
                  aria-haspopup="true" aria-expanded="false"
                  style="background:none;border:none;width:100%;text-align:inherit;cursor:pointer;font-size:var(--text-lg);font-weight:var(--font-medium);color:var(--text-primary);font-family:var(--font-primary);">
            Home
            <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
          </button>
          <div class="mobile-dropdown" id="mobileHomeDropdown" role="menu">
            <a href="${base}index.html" class="mobile-dropdown-link" role="menuitem">
              Home 1
            </a>
            <a href="${base}pages/home2.html" class="mobile-dropdown-link" role="menuitem">
              Home 2
            </a>
          </div>
        </li>
        <li class="mobile-nav-item">
          <a href="${base}pages/about.html" class="mobile-nav-link">
            About
          </a>
        </li>
        <li class="mobile-nav-item">
          <a href="${base}pages/service.html" class="mobile-nav-link">
            Services
          </a>
        </li>
        <li class="mobile-nav-item">
          <a href="${base}pages/blog.html" class="mobile-nav-link">
            Blog
          </a>
        </li>
        <li class="mobile-nav-item">
          <a href="${base}pages/pricing.html" class="mobile-nav-link">
            Pricing
          </a>
        </li>
        <li class="mobile-nav-item">
          <a href="${base}pages/contact.html" class="mobile-nav-link">
            Contact
          </a>
        </li>
      </ul>
      <div style="margin-top:var(--space-6);display:flex;flex-direction:column;gap:var(--space-3);">
        <a href="${base}pages/login.html" class="btn btn-primary btn-full">
          <i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i>
          Login to Account
        </a>
      </div>
    </div>

    <!-- Back to Top -->
    <a href="#" class="back-to-top" id="backToTop" aria-label="Back to top">
      <i class="fa-solid fa-chevron-up" aria-hidden="true"></i>
    </a>

    <!-- Toast Container -->
    <div class="toast-container" id="toastContainer" aria-live="polite" aria-atomic="true"></div>
    `;
  }

  /* ── Shared Footer HTML ── */
  function buildFooter() {
    return `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-grid">

          <!-- Brand Column -->
          <div class="footer-brand-col">
            <a href="${base}index.html" class="footer-logo" aria-label="Optic">
              <div class="footer-logo-icon" aria-hidden="true">
                <img src="${base}assets/images/favicon.png" alt="Optic Logo" class="logo-icon-img">
              </div>
              <div>
                <div class="footer-brand-name">Optic</div>
              </div>
            </a>
            <p class="footer-desc">
              Providing exceptional eye care and premium eyewear since 2005.
              Your vision is our passion — see the world more clearly with Optic.
            </p>
            <div class="footer-social">
              <a href="#" class="social-btn" aria-label="Facebook">
                <i class="fa-brands fa-facebook-f" aria-hidden="true"></i>
              </a>
              <a href="#" class="social-btn" aria-label="Instagram">
                <i class="fa-brands fa-instagram" aria-hidden="true"></i>
              </a>
              <a href="#" class="social-btn" aria-label="Twitter / X">
                <i class="fa-brands fa-x-twitter" aria-hidden="true"></i>
              </a>
              <a href="#" class="social-btn" aria-label="LinkedIn">
                <i class="fa-brands fa-linkedin-in" aria-hidden="true"></i>
              </a>
              <a href="#" class="social-btn" aria-label="YouTube">
                <i class="fa-brands fa-youtube" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="footer-heading">Quick Links</h3>
            <ul class="footer-links">
              <li><a href="${base}index.html"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i>Home</a></li>
              <li><a href="${base}pages/about.html"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i>About Us</a></li>
              <li><a href="${base}pages/service.html"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i>Our Services</a></li>
              <li><a href="${base}pages/pricing.html"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i>Pricing</a></li>
              <li><a href="${base}pages/blog.html"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i>Blog</a></li>
              <li><a href="${base}pages/contact.html"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i>Contact</a></li>
              <li><a href="${base}pages/coming-soon.html"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i>Coming Soon</a></li>
            </ul>
          </div>

          <!-- Services Links -->
          <div>
            <h3 class="footer-heading">Eye Care Services</h3>
            <ul class="footer-links">
              <li><a href="${base}pages/service.html#eye-test"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i>Comprehensive Eye Test</a></li>
              <li><a href="${base}pages/service.html#lenses"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i>Prescription Lenses</a></li>
              <li><a href="${base}pages/service.html#frames"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i>Frame Collections</a></li>
              <li><a href="${base}pages/service.html#contact-lenses"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i>Contact Lenses</a></li>
              <li><a href="${base}pages/service.html#kids"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i>Children's Eye Care</a></li>
              <li><a href="${base}pages/service.html#sunglasses"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i>Sunglasses</a></li>
            </ul>
          </div>

          <!-- Contact & Newsletter -->
          <div>
            <h3 class="footer-heading">Get In Touch</h3>
            <div class="footer-contact-item">
              <div class="footer-contact-icon" aria-hidden="true">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <p class="footer-contact-text">
                42, Anna Salai, T. Nagar<br>
                Chennai, Tamil Nadu 600017<br>India
              </p>
            </div>
            <div class="footer-contact-item">
              <div class="footer-contact-icon" aria-hidden="true">
                <i class="fa-solid fa-phone"></i>
              </div>
              <p class="footer-contact-text">
                <a href="tel:+914428221234" style="color:var(--color-slate-400)">+91 44 2822 1234</a><br>
                <a href="tel:+919876543210" style="color:var(--color-slate-400)">+91 98765 43210</a>
              </p>
            </div>
            <div class="footer-contact-item">
              <div class="footer-contact-icon" aria-hidden="true">
                <i class="fa-solid fa-envelope"></i>
              </div>
              <p class="footer-contact-text">
                <a href="mailto:info@visioncare.in" style="color:var(--color-slate-400)">info@visioncare.in</a><br>
                <a href="mailto:appointments@visioncare.in" style="color:var(--color-slate-400)">appointments@visioncare.in</a>
              </p>
            </div>

            <div class="footer-newsletter">
              <p style="font-size:var(--text-xs);color:var(--color-slate-400);margin-bottom:var(--space-2);">
                Subscribe for eye care tips &amp; offers:
              </p>
              <form class="footer-newsletter-form" id="footerNewsletter" novalidate>
                <input
                  type="email"
                  class="footer-newsletter-input"
                  placeholder="Your email address"
                  aria-label="Email for newsletter"
                  required>
                <button type="submit" class="footer-newsletter-btn" aria-label="Subscribe to newsletter">
                  <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
                </button>
              </form>
            </div>
          </div>

        </div>

        <div class="footer-bottom">
          <p class="footer-copyright">
            &copy; <span id="footerYear"></span> Optic. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
    `;
  }

  /* ── Inject into DOM ── */
  document.addEventListener('DOMContentLoaded', () => {

    // Inject nav before #main-content
    const navSlot = document.getElementById('nav-slot');
    if (navSlot) {
      navSlot.innerHTML = buildNav();
    } else {
      document.body.insertAdjacentHTML('afterbegin', buildNav());
    }

    // Inject footer
    const footerSlot = document.getElementById('footer-slot');
    if (footerSlot) {
      footerSlot.innerHTML = buildFooter();
    } else {
      document.body.insertAdjacentHTML('beforeend', buildFooter());
    }

    // Set current year in footer
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ── Page Loader ── */
    const loader = document.getElementById('pageLoader');
    if (loader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          loader.classList.add('hidden');
          loader.addEventListener('transitionend', () => loader.remove(), { once: true });
        }, 400);
      });
      // Fallback
      setTimeout(() => { if (loader) loader.classList.add('hidden'); }, 2500);
    }

    /* ── Hamburger Menu ── */
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        mobileNav.setAttribute('aria-hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
          closeMobileNav();
        }
      });

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
          closeMobileNav();
          hamburger.focus();
        }
      });
    }

    function closeMobileNav() {
      if (!mobileNav) return;
      mobileNav.classList.remove('open');
      hamburger && hamburger.classList.remove('open');
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    /* ── Mobile Home Dropdown ── */
    const mobileHomeToggle   = document.getElementById('mobileHomeToggle');
    const mobileHomeDropdown = document.getElementById('mobileHomeDropdown');

    if (mobileHomeToggle && mobileHomeDropdown) {
      mobileHomeToggle.addEventListener('click', () => {
        const isOpen = mobileHomeDropdown.classList.toggle('open');
        mobileHomeToggle.setAttribute('aria-expanded', isOpen);
      });
    }

    /* ── Navbar Scroll Effect ── */
    const navbar = document.getElementById('navbar');
    if (navbar) {
      const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ── Back to Top ── */
    const btt = document.getElementById('backToTop');
    if (btt) {
      window.addEventListener('scroll', () => {
        btt.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });

      btt.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ── Footer Newsletter (placeholder) ── */
    const footerForm = document.getElementById('footerNewsletter');
    if (footerForm) {
      footerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = footerForm.querySelector('input[type="email"]');
        if (input && input.value && input.checkValidity()) {
          showToast('Thank you for subscribing!', 'success');
          input.value = '';
        } else {
          showToast('Please enter a valid email address.', 'error');
        }
      });
    }

    /* ── Sync Theme Icons ── */
    if (window.VCTheme) window.VCTheme.updateIcons(window.VCTheme.current);
    if (window.VCDir) window.VCDir.updateButtons(window.VCDir.current);

  }); // end DOMContentLoaded

  /* ── Toast Notification System ── */
  window.showToast = function (message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
      success: 'fa-circle-check',
      error:   'fa-circle-xmark',
      info:    'fa-circle-info'
    };

    const colors = {
      success: 'var(--color-secondary)',
      error:   'var(--color-error)',
      info:    'var(--color-primary)'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <i class="fa-solid ${icons[type] || icons.info}"
         style="color:${colors[type]};font-size:1.25rem;flex-shrink:0;"
         aria-hidden="true"></i>
      <span style="font-size:var(--text-sm);color:var(--text-primary);flex:1;">${message}</span>
      <button onclick="this.closest('.toast').remove()"
              style="background:none;border:none;color:var(--text-muted);cursor:pointer;padding:4px;"
              aria-label="Dismiss notification">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

})();
