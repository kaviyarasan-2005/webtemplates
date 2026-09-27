/* ============================================================
   AXE FORGE VENUE — nav-footer.js
   Shared Navigation + Footer HTML injection
   ============================================================ */

'use strict';

(function injectSharedLayout() {
  const isPages = window.location.pathname.includes('/pages/');
  const root    = isPages ? '../' : './';

  /* ─── NAVBAR HTML ─────────────────────────────────────────── */
  const navHTML = `
  <div class="page-loader" aria-hidden="true" id="page-loader">
    <div class="page-loader__spinner"></div>
  </div>

  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="container">
      <div class="navbar__inner">
        <!-- Logo -->
        <a href="${root}index.html" class="navbar__logo" aria-label="Axe — Home">
          <div class="navbar__logo-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9"/>
              <path d="M15 13 9 7l4-4 6 6h3a8 8 0 0 1-7 7z"/>
            </svg>
          </div>
          <span class="navbar__logo-text">Axe</span>
        </a>

        <!-- Desktop Links -->
        <ul class="navbar__links" role="list">
          <li class="nav-dropdown">
            <button class="nav-link nav-dropdown__trigger" aria-expanded="false" aria-haspopup="true" id="home-dropdown-btn">
              Home
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" style="margin-inline-start:4px;transition:transform 0.2s;"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="nav-dropdown__menu" role="menu" aria-labelledby="home-dropdown-btn">
              <a href="${root}index.html" class="nav-dropdown__item" role="menuitem">
                <span class="nav-dropdown__item-title">Home 1</span>
              </a>
              <a href="${root}index2.html" class="nav-dropdown__item" role="menuitem">
                <span class="nav-dropdown__item-title">Home 2</span>
              </a>
            </div>
          </li>
          <li><a href="${root}pages/book-a-lane.html" class="nav-link">Book a Lane</a></li>
          <li><a href="${root}pages/leagues.html" class="nav-link">Leagues</a></li>
          <li><a href="${root}pages/events.html" class="nav-link">Events</a></li>
          <li class="nav-dropdown">
            <button class="nav-link nav-dropdown__trigger" aria-expanded="false" aria-haspopup="true" id="dashboard-dropdown-btn">
              Dashboard
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true" style="margin-inline-start:4px;transition:transform 0.2s;"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="nav-dropdown__menu" role="menu" aria-labelledby="dashboard-dropdown-btn">
              <a href="${root}pages/dashboard.html" class="nav-dropdown__item" role="menuitem">
                <span class="nav-dropdown__item-title">User</span>
              </a>
              <a href="${root}pages/admin.html" class="nav-dropdown__item" role="menuitem">
                <span class="nav-dropdown__item-title">Admin</span>
              </a>
            </div>
          </li>
        </ul>


        <!-- Controls -->
        <div class="navbar__controls" aria-label="Display controls">
          <button class="ctrl-btn" data-theme-toggle data-theme-icon title="Toggle Theme" aria-label="Toggle Theme">
          </button>
          <button class="ctrl-btn" data-rtl-toggle data-dir-label title="Toggle RTL" aria-label="Toggle RTL/LTR">
            RTL
          </button>
          <a href="${root}pages/login.html" class="btn btn--primary btn--sm" aria-label="Login">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Login
          </a>
        </div>

        <!-- Hamburger -->
        <button class="hamburger" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <div class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
    <ul role="list">
      <li class="mobile-nav-group">
        <button class="mobile-nav-group__btn" aria-expanded="false">
          Home
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="mobile-nav-group__content">
          <a href="${root}index.html" class="nav-link">Home 1</a>
          <a href="${root}index2.html" class="nav-link">Home 2</a>
        </div>
      </li>
      <li><a href="${root}pages/book-a-lane.html" class="nav-link">Book a Lane</a></li>
      <li><a href="${root}pages/leagues.html" class="nav-link">Leagues</a></li>
      <li><a href="${root}pages/events.html" class="nav-link">Events</a></li>
      <li class="mobile-nav-group">
        <button class="mobile-nav-group__btn" aria-expanded="false">
          Dashboard
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="mobile-nav-group__content">
          <a href="${root}pages/dashboard.html" class="nav-link">User</a>
          <a href="${root}pages/admin.html" class="nav-link">Admin</a>
        </div>
      </li>
    </ul>

    <!-- Injected Mobile Controls -->
    <div class="mobile-menu__controls" style="display:flex; flex-direction:column; gap:var(--sp-4); margin-top:var(--sp-6); padding-top:var(--sp-6); border-top:1px solid rgba(255,255,255,0.1);">
      <div style="display:flex; gap:var(--sp-4);">
        <button class="ctrl-btn" data-theme-toggle data-theme-icon title="Toggle Theme" aria-label="Toggle Theme" style="flex:1; justify-content:center; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:var(--sp-2);">
          Theme
        </button>
        <button class="ctrl-btn" data-rtl-toggle data-dir-label title="Toggle RTL" aria-label="Toggle RTL/LTR" style="flex:1; justify-content:center; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:var(--sp-2);">
          RTL
        </button>
      </div>
      <a href="${root}pages/login.html" class="btn btn--primary" aria-label="Login" style="width:100%; justify-content:center;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        Login
      </a>
    </div>
  </div>`;

  /* ─── FOOTER HTML ─────────────────────────────────────────── */
  const footerHTML = `
  <footer class="footer" role="contentinfo" aria-label="Site footer">
    <div class="container">
      <div class="footer__top">
        <!-- Brand -->
        <div>
          <a href="${root}index.html" class="navbar__logo" aria-label="Axe — Home">
            <div class="navbar__logo-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9"/>
                <path d="M15 13 9 7l4-4 6 6h3a8 8 0 0 1-7 7z"/>
              </svg>
            </div>
            <span class="navbar__logo-text" style="color:white;">Axe</span>
          </a>
          <p class="footer__brand-text">
            The premier axe throwing venue for thrill-seekers, team builders, and competitive athletes. Book your lane, compete in leagues, and forge unforgettable memories.
          </p>
          <nav class="footer__social" aria-label="Social media links">
            <a href="#" class="footer__social-link" aria-label="Facebook" title="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="Instagram" title="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="Twitter / X" title="Twitter / X">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4l16 16M4 20 20 4"/></svg>
            </a>
            <a href="#" class="footer__social-link" aria-label="YouTube" title="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
            </a>
          </nav>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="footer__col-title">Quick Links</h3>
          <ul class="footer__links" role="list">
            <li><a href="${root}index.html" class="footer__link">Home</a></li>
            <li><a href="${root}pages/book-a-lane.html" class="footer__link">Book a Lane</a></li>
            <li><a href="${root}pages/leagues.html" class="footer__link">Leagues &amp; Tournaments</a></li>
            <li><a href="${root}pages/events.html" class="footer__link">Group &amp; Corporate Events</a></li>
            <li><a href="${root}pages/login.html" class="footer__link">Login Portal</a></li>
            <li><a href="${root}pages/dashboard.html" class="footer__link">My Dashboard</a></li>
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h3 class="footer__col-title">Services</h3>
          <ul class="footer__links" role="list">
            <li><a href="#" class="footer__link">Beginner Sessions</a></li>
            <li><a href="#" class="footer__link">Private Lane Rental</a></li>
            <li><a href="#" class="footer__link">Coaching &amp; Training</a></li>
            <li><a href="#" class="footer__link">Birthday Parties</a></li>
            <li><a href="#" class="footer__link">Corporate Packages</a></li>
            <li><a href="#" class="footer__link">Gift Cards</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="footer__col-title">Contact</h3>
          <ul class="footer__links" role="list">
            <li>
              <address class="footer__contact-item" style="font-style:normal;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>482 Forge Street, Industrial District, Toronto, ON M5V 2T6</span>
              </address>
            </li>
            <li>
              <a href="tel:+14165550192" class="footer__contact-item" style="text-decoration:none;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.84h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 5.68 5.68l1.82-1.82a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>+1 (416) 555-0192</span>
              </a>
            </li>
            <li>
              <a href="mailto:info@axeforge.com" class="footer__contact-item" style="text-decoration:none;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>info@axeforge.com</span>
              </a>
            </li>
          </ul>
          <div style="margin-top: var(--sp-5);">
            <p style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:var(--sp-2);">Hours of Operation</p>
            <p style="font-size:0.875rem;color:rgba(255,255,255,0.6);">Mon–Fri: 2pm – 11pm</p>
            <p style="font-size:0.875rem;color:rgba(255,255,255,0.6);">Sat–Sun: 10am – 12am</p>
          </div>
        </div>
      </div>

      <div class="footer__bottom" style="justify-content: center; text-align: center;">
        <p>&copy; <span id="footer-year"></span> Axe Forge Throwing Venue. All rights reserved.</p>
      </div>
    </div>

    <!-- Scroll To Top -->
    <button class="scroll-top-btn" aria-label="Scroll to top" title="Scroll to top">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
    </button>
  </footer>`;

  /* ─── INJECT ───────────────────────────────────────────────── */
  const navTarget = document.getElementById('nav-placeholder');
  const footTarget = document.getElementById('footer-placeholder');
  if (navTarget) navTarget.outerHTML = navHTML;
  if (footTarget) footTarget.outerHTML = footerHTML;

  // Year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
