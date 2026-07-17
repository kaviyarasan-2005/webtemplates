/**
 * MediCare Plus — Components.js
 * Injects shared Navbar and Footer into every page.
 * Detects page depth (root vs pages/) automatically.
 */

const IS_ROOT = !window.location.pathname.includes('/pages/');
const BASE    = IS_ROOT ? './' : '../';

/* ── NAVBAR HTML ─────────────────────────────────────────────── */
function buildNavbar() {
  const currentPath = window.location.pathname;
  const isPage = (href) => currentPath.includes(href) ? 'aria-current="page"' : '';
  const isActive = (href) => currentPath.includes(href) ? 'is-active' : '';

  return `
<header class="navbar" id="navbar" role="banner">
  <div class="container">
    <div class="navbar__inner">

      <!-- Logo -->
      <a href="${BASE}index.html" class="navbar__logo" aria-label="MediCare Plus - Go to homepage">
        <div class="navbar__logo-icon" aria-hidden="true">
          <i class="fas fa-cross"></i>
        </div>
        <span class="navbar__logo-text">MediCare<span class="accent">Plus</span></span>
      </a>

      <!-- Desktop Nav -->
      <nav class="navbar__nav" role="navigation" aria-label="Main navigation">

        <!-- Home Dropdown -->
        <div class="nav-dropdown" role="none">
          <button class="nav-link nav-link--dropdown" aria-haspopup="true" aria-expanded="false" aria-controls="homeDropdown" id="homeDropdownBtn">
            Home <i class="fas fa-chevron-down nav-dropdown__caret" aria-hidden="true"></i>
          </button>
          <div class="nav-dropdown__menu" id="homeDropdown" role="menu" aria-labelledby="homeDropdownBtn">
            <a href="${BASE}index.html" class="nav-dropdown__item" role="menuitem" ${isPage('index.html')}>
              <i class="fas fa-house" aria-hidden="true"></i>
              <div>
                <div class="nav-dropdown__item-title">Home 1</div>
                <div class="nav-dropdown__item-desc">Main landing page</div>
              </div>
            </a>
            <a href="${BASE}pages/home2.html" class="nav-dropdown__item" role="menuitem" ${isPage('home2.html')}>
              <i class="fas fa-house-medical" aria-hidden="true"></i>
              <div>
                <div class="nav-dropdown__item-title">Home 2</div>
                <div class="nav-dropdown__item-desc">Alternate layout</div>
              </div>
            </a>
          </div>
        </div>

        <a href="${BASE}pages/about.html" class="nav-link ${isActive('about.html')}" ${isPage('about.html')}>About</a>
        <a href="${BASE}pages/service.html" class="nav-link ${isActive('service.html')}" ${isPage('service.html')}>Service</a>
        <a href="${BASE}pages/blog.html" class="nav-link ${isActive('blog.html')}" ${isPage('blog.html')}>Blog</a>
        <a href="${BASE}pages/pricing.html" class="nav-link ${isActive('pricing.html')}" ${isPage('pricing.html')}>Pricing</a>
        <a href="${BASE}pages/contact.html" class="nav-link ${isActive('contact.html')}" ${isPage('contact.html')}>Contact</a>

        <!-- Dashboard Dropdown -->
        <div class="nav-dropdown" role="none">
          <button class="nav-link nav-link--dropdown" aria-haspopup="true" aria-expanded="false" aria-controls="dashDropdown" id="dashDropdownBtn">
            Dashboard <i class="fas fa-chevron-down nav-dropdown__caret" aria-hidden="true"></i>
          </button>
          <div class="nav-dropdown__menu" id="dashDropdown" role="menu" aria-labelledby="dashDropdownBtn">
            <a href="${BASE}pages/dashboard-user.html" class="nav-dropdown__item" role="menuitem" ${isPage('dashboard-user.html')}>
              <i class="fas fa-user-circle" aria-hidden="true"></i>
              <div>
                <div class="nav-dropdown__item-title">User Dashboard</div>
                <div class="nav-dropdown__item-desc">Orders, prescriptions, profile</div>
              </div>
            </a>
            <a href="${BASE}pages/dashboard-admin.html" class="nav-dropdown__item" role="menuitem" ${isPage('dashboard-admin.html')}>
              <i class="fas fa-shield-halved" aria-hidden="true"></i>
              <div>
                <div class="nav-dropdown__item-title">Admin Dashboard</div>
                <div class="nav-dropdown__item-desc">Store management & analytics</div>
              </div>
            </a>
          </div>
        </div>
      </nav>

      <!-- Controls -->
      <div class="navbar__controls">
        <!-- RTL Toggle -->
        <button class="btn-icon" id="rtlToggle" aria-label="Toggle RTL/LTR text direction" title="Toggle RTL/LTR">
          <i class="fas fa-language" id="rtlIcon" aria-hidden="true"></i>
        </button>

        <!-- Theme Toggle -->
        <button class="btn-icon" id="themeToggle" aria-label="Toggle dark or light mode" title="Toggle theme">
          <i class="fas fa-moon" id="themeIcon" aria-hidden="true"></i>
        </button>

        <!-- CTA -->
        <a href="${BASE}pages/login.html" class="btn btn--outline btn--sm navbar__cta" aria-label="Sign in to your account">
          <i class="fas fa-right-to-bracket" aria-hidden="true"></i> Sign In
        </a>
        <a href="${BASE}pages/signup.html" class="btn btn--primary btn--sm navbar__cta--primary" aria-label="Create a free account">
          <i class="fas fa-user-plus" aria-hidden="true"></i> Sign Up
        </a>

        <!-- Mobile hamburger -->
        <button class="navbar__hamburger" id="hamburger" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobileMenu">
          <i class="fas fa-bars" id="hamburgerIcon" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  <div class="mobile-menu" id="mobileMenu" aria-hidden="true" role="dialog" aria-label="Mobile navigation menu">
    <nav aria-label="Mobile navigation">
      <div class="mobile-menu__section">Home</div>
      <a href="${BASE}index.html" class="mobile-menu__link" ${isPage('index.html')}>
        <i class="fas fa-house" aria-hidden="true"></i> Home 1
      </a>
      <a href="${BASE}pages/home2.html" class="mobile-menu__link" ${isPage('home2.html')}>
        <i class="fas fa-house-medical" aria-hidden="true"></i> Home 2
      </a>

      <div class="mobile-menu__section">Pages</div>
      <a href="${BASE}pages/about.html" class="mobile-menu__link" ${isPage('about.html')}>
        <i class="fas fa-circle-info" aria-hidden="true"></i> About
      </a>
      <a href="${BASE}pages/service.html" class="mobile-menu__link" ${isPage('service.html')}>
        <i class="fas fa-hand-holding-heart" aria-hidden="true"></i> Service
      </a>
      <a href="${BASE}pages/blog.html" class="mobile-menu__link" ${isPage('blog.html')}>
        <i class="fas fa-newspaper" aria-hidden="true"></i> Blog
      </a>
      <a href="${BASE}pages/pricing.html" class="mobile-menu__link" ${isPage('pricing.html')}>
        <i class="fas fa-tag" aria-hidden="true"></i> Pricing
      </a>
      <a href="${BASE}pages/contact.html" class="mobile-menu__link" ${isPage('contact.html')}>
        <i class="fas fa-headset" aria-hidden="true"></i> Contact
      </a>

      <div class="mobile-menu__section">Dashboard</div>
      <a href="${BASE}pages/dashboard-user.html" class="mobile-menu__link" ${isPage('dashboard-user.html')}>
        <i class="fas fa-user-circle" aria-hidden="true"></i> User Dashboard
      </a>
      <a href="${BASE}pages/dashboard-admin.html" class="mobile-menu__link" ${isPage('dashboard-admin.html')}>
        <i class="fas fa-shield-halved" aria-hidden="true"></i> Admin Dashboard
      </a>

      <div class="mobile-menu__section">Account</div>
      <a href="${BASE}pages/login.html" class="mobile-menu__link" ${isPage('login.html')}>
        <i class="fas fa-right-to-bracket" aria-hidden="true"></i> Sign In
      </a>
      <a href="${BASE}pages/signup.html" class="mobile-menu__link" ${isPage('signup.html')}>
        <i class="fas fa-user-plus" aria-hidden="true"></i> Create Account
      </a>

      <div style="display:flex;gap:var(--sp-3);padding:var(--sp-4) var(--sp-5);">
        <button class="btn-icon" id="rtlToggleMobile" aria-label="Toggle RTL/LTR">
          <i class="fas fa-language" aria-hidden="true"></i>
        </button>
        <button class="btn-icon" id="themeToggleMobile" aria-label="Toggle theme">
          <i class="fas fa-moon" aria-hidden="true"></i>
        </button>
      </div>
    </nav>
  </div>
</header>`;
}

/* ── FOOTER HTML ─────────────────────────────────────────────── */
function buildFooter() {
  const currentYear = new Date().getFullYear();
  return `
<footer class="footer" role="contentinfo" aria-label="MediCare Plus footer">
  <div class="footer__main">
    <div class="container">
      <div class="footer__grid">

        <!-- Brand -->
        <div class="footer__brand">
          <a href="${BASE}index.html" class="footer__logo" aria-label="MediCare Plus - Home">
            <div class="footer__logo-icon" aria-hidden="true"><i class="fas fa-cross"></i></div>
            <span>MediCare<span class="footer__logo-accent">Plus</span></span>
          </a>
          <p class="footer__brand-desc">
            India's most trusted pharmacy delivering genuine medicines, vitamins, baby care, and medical devices to your doorstep since 2009.
          </p>
          <div class="footer__social" role="list" aria-label="Social media links">
            <a href="#" class="footer__social-link" role="listitem" aria-label="MediCare Plus on Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>
            <a href="#" class="footer__social-link" role="listitem" aria-label="MediCare Plus on Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
            <a href="#" class="footer__social-link" role="listitem" aria-label="MediCare Plus on X/Twitter"><i class="fab fa-x-twitter" aria-hidden="true"></i></a>
            <a href="#" class="footer__social-link" role="listitem" aria-label="MediCare Plus on WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>
            <a href="#" class="footer__social-link" role="listitem" aria-label="MediCare Plus on YouTube"><i class="fab fa-youtube" aria-hidden="true"></i></a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer__col">
          <h3 class="footer__col-title">Quick Links</h3>
          <ul class="footer__links" role="list">
            <li role="listitem"><a href="${BASE}index.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Home</a></li>
            <li role="listitem"><a href="${BASE}pages/about.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>About Us</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Services</a></li>
            <li role="listitem"><a href="${BASE}pages/pricing.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Pricing</a></li>
            <li role="listitem"><a href="${BASE}pages/blog.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Health Blog</a></li>
            <li role="listitem"><a href="${BASE}pages/contact.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Contact</a></li>
            <li role="listitem"><a href="${BASE}pages/coming-soon.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Coming Soon</a></li>
          </ul>
        </div>

        <!-- Services -->
        <div class="footer__col">
          <h3 class="footer__col-title">Our Services</h3>
          <ul class="footer__links" role="list">
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Prescription Medicines</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Home Delivery</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Doctor Consultation</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Lab Test Booking</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Vitamins & Supplements</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Baby & Mother Care</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Medical Devices</a></li>
          </ul>
        </div>

        <!-- Newsletter + Contact -->
        <div class="footer__col">
          <h3 class="footer__col-title">Stay Healthy</h3>
          <p style="color:rgba(255,255,255,0.6);font-size:var(--fs-sm);margin-bottom:var(--sp-4);">Get weekly health tips, medicine alerts, and exclusive member offers.</p>
          <form class="footer__newsletter" aria-label="Newsletter subscription" data-newsletter>
            <input type="email" name="email" class="footer__newsletter-input" placeholder="Enter your email..." aria-label="Email address for newsletter" required>
            <button type="submit" class="footer__newsletter-btn" aria-label="Subscribe to newsletter">
              <i class="fas fa-paper-plane" aria-hidden="true"></i>
            </button>
          </form>

          <div style="margin-top:var(--sp-6);">
            <h3 class="footer__col-title">Contact</h3>
            <div style="display:flex;flex-direction:column;gap:var(--sp-2);">
              <a href="tel:+911800123456" class="footer__link" style="display:flex;gap:var(--sp-2);align-items:center;">
                <i class="fas fa-phone" style="width:14px;" aria-hidden="true"></i> +91 1800-123-456
              </a>
              <a href="mailto:care@medicareplus.in" class="footer__link" style="display:flex;gap:var(--sp-2);align-items:center;">
                <i class="fas fa-envelope" style="width:14px;" aria-hidden="true"></i> care@medicareplus.in
              </a>
              <span class="footer__link" style="display:flex;gap:var(--sp-2);align-items:flex-start;cursor:default;">
                <i class="fas fa-location-dot" style="width:14px;margin-top:2px;" aria-hidden="true"></i>
                123 Health Avenue, Connaught Place,<br>New Delhi – 110001
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- Footer Bottom -->
  <div class="footer__bottom">
    <div class="container">
      <div class="footer__bottom-inner">
        <p class="footer__copyright">
          &copy; ${currentYear} MediCare Plus. All rights reserved. Drug License No: MH-DL-2009-001.
        </p>
        <nav class="footer__legal" aria-label="Legal links">
          <a href="#" class="footer__legal-link">Privacy Policy</a>
          <a href="#" class="footer__legal-link">Terms of Service</a>
          <a href="#" class="footer__legal-link">Cookie Policy</a>
          <a href="#" class="footer__legal-link">Disclaimer</a>
          <a href="${BASE}pages/404.html" class="footer__legal-link">Sitemap</a>
        </nav>
      </div>
    </div>
  </div>
</footer>`;
}

/* ── INJECTION ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const navEl  = document.getElementById('nav-placeholder');
  const footEl = document.getElementById('footer-placeholder');

  if (navEl)  { navEl.outerHTML  = buildNavbar(); }
  if (footEl) { footEl.outerHTML = buildFooter(); }

  // Wire up dropdown toggles
  document.querySelectorAll('.nav-link--dropdown').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.nav-link--dropdown').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.closest('.nav-dropdown')?.classList.remove('is-open');
      });
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        btn.closest('.nav-dropdown')?.classList.add('is-open');
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.is-open').forEach(d => d.classList.remove('is-open'));
    document.querySelectorAll('.nav-link--dropdown').forEach(b => b.setAttribute('aria-expanded', 'false'));
  });

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      if (hamburgerIcon) hamburgerIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    });
    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        if (hamburgerIcon) hamburgerIcon.className = 'fas fa-bars';
      });
    });
  }

  // Navbar scroll behavior
  const navbar = document.getElementById('navbar');
  if (navbar) {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 60) navbar.classList.add('is-scrolled');
      else navbar.classList.remove('is-scrolled');
      if (y > lastY && y > 200) navbar.classList.add('is-hidden');
      else navbar.classList.remove('is-hidden');
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Wire up theme & RTL toggles in navbar
  import('./theme.js').then(mod => {
    const themeToggle  = document.getElementById('themeToggle');
    const themeToggleM = document.getElementById('themeToggleMobile');
    const rtlToggle    = document.getElementById('rtlToggle');
    const rtlToggleM   = document.getElementById('rtlToggleMobile');
    if (themeToggle)  themeToggle.addEventListener('click', mod.toggleTheme);
    if (themeToggleM) themeToggleM.addEventListener('click', mod.toggleTheme);
    if (rtlToggle)    rtlToggle.addEventListener('click', mod.toggleDir);
    if (rtlToggleM)   rtlToggleM.addEventListener('click', mod.toggleDir);
    mod.syncIcons();
  }).catch(() => {
    // Fallback if import fails (e.g., file:// protocol)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('medicare-theme', JSON.stringify(next));
      });
    }
  });

  // Newsletter forms
  document.querySelectorAll('[data-newsletter]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input?.value) {
        input.value = '';
        const btn = form.querySelector('button');
        if (btn) {
          const origInner = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-circle-check" aria-hidden="true"></i>';
          btn.style.background = 'var(--clr-success)';
          setTimeout(() => { btn.innerHTML = origInner; btn.style.background = ''; }, 2000);
        }
      }
    });
  });

  // Countdown timer for coming-soon page
  const countdownTarget = document.querySelector('[data-countdown]');
  if (countdownTarget) {
    const target = new Date(countdownTarget.getAttribute('data-countdown')).getTime();
    const tick = () => {
      const now  = Date.now();
      const diff = Math.max(0, target - now);
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = n => String(n).padStart(2, '0');
      const days  = document.getElementById('countdownDays');
      const hours = document.getElementById('countdownHours');
      const mins  = document.getElementById('countdownMins');
      const secs  = document.getElementById('countdownSecs');
      if (days)  { days.textContent  = pad(d); days.setAttribute('aria-label', `${d} days`); }
      if (hours) { hours.textContent = pad(h); hours.setAttribute('aria-label', `${h} hours`); }
      if (mins)  { mins.textContent  = pad(m); mins.setAttribute('aria-label', `${m} minutes`); }
      if (secs)  { secs.textContent  = pad(s); secs.setAttribute('aria-label', `${s} seconds`); }
    };
    tick();
    setInterval(tick, 1000);
  }

  // Accordion
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item    = trigger.closest('.accordion__item');
      const content = item?.querySelector('.accordion__content');
      const isOpen  = trigger.getAttribute('aria-expanded') === 'true';
      // Close others
      trigger.closest('.accordion')?.querySelectorAll('.accordion__trigger').forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        t.closest('.accordion__item')?.querySelector('.accordion__content')?.classList.remove('is-open');
      });
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        content?.classList.add('is-open');
      }
    });
  });
});
