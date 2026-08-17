/**
 * ColorCraft — Components.js
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
      <a href="${BASE}index.html" class="navbar__logo" aria-label="ColorCraft - Go to homepage">
        <div class="navbar__logo-icon" aria-hidden="true">
          <i class="fas fa-paint-roller"></i>
        </div>
        <span class="navbar__logo-text">ColorCraft</span>
      </a>

      <!-- Desktop & Mobile Nav -->
      <div class="navbar__menu" id="mobileMenu">
        <nav class="navbar__nav" role="navigation" aria-label="Main navigation">

        <!-- Home Dropdown -->
        <div class="navbar__item navbar__item--dropdown" role="none">
          <button class="navbar__link navbar__link--dropdown" aria-haspopup="true" aria-expanded="false" aria-controls="homeDropdown" id="homeDropdownBtn">
            Home <i class="fas fa-chevron-down" aria-hidden="true"></i>
          </button>
          <div class="navbar__dropdown" id="homeDropdown" role="menu" aria-labelledby="homeDropdownBtn">
            <a href="${BASE}index.html" class="navbar__dropdown-link" role="menuitem" ${isPage('index.html')}>
              Home 1
            </a>
            <a href="${BASE}pages/home2.html" class="navbar__dropdown-link" role="menuitem" ${isPage('home2.html')}>
              Home 2
            </a>
          </div>
        </div>

        <a href="${BASE}pages/about.html" class="navbar__link ${isActive('about.html')}" ${isPage('about.html')}>About</a>
        <a href="${BASE}pages/service.html" class="navbar__link ${isActive('service.html')}" ${isPage('service.html')}>Service</a>
        <a href="${BASE}pages/blog.html" class="navbar__link ${isActive('blog.html')}" ${isPage('blog.html')}>Blog</a>
        <a href="${BASE}pages/pricing.html" class="navbar__link ${isActive('pricing.html')}" ${isPage('pricing.html')}>Pricing</a>
        <a href="${BASE}pages/contact.html" class="navbar__link ${isActive('contact.html')}" ${isPage('contact.html')}>Contact</a>

        </nav>
      </div>

      <!-- Actions -->
      <div class="navbar__actions">
        <!-- RTL Toggle -->
        <button class="btn-icon" id="rtlToggle" aria-label="Toggle RTL/LTR text direction" title="Toggle RTL/LTR">
          <span id="rtlText">RTL</span>
        </button>

        <!-- Theme Toggle -->
        <button class="btn-icon" id="themeToggle" aria-label="Toggle dark or light mode" title="Toggle theme">
          <i class="fas fa-moon" id="themeIcon" aria-hidden="true"></i>
        </button>

        <!-- Get Quote CTA -->
        <a href="${BASE}index.html#store-hours" class="btn btn--primary" aria-label="Get Quote">Get Quote</a>

        <!-- Mobile hamburger -->
        <button class="navbar__hamburger" id="hamburger" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobileMenu">
          <i class="fas fa-bars" id="hamburgerIcon" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>


</header>`;
}

/* ── FOOTER HTML ─────────────────────────────────────────────── */
function buildFooter() {
  const currentYear = new Date().getFullYear();
  return `
<footer class="footer" role="contentinfo" aria-label="ColorCraft footer">
  <div class="footer__main">
    <div class="container">
      <div class="footer__grid">

        <!-- Brand -->
        <div class="footer__brand">
          <a href="${BASE}index.html" class="footer__brand-logo" aria-label="ColorCraft - Home">
            <div class="footer__brand-icon" aria-hidden="true"><i class="fas fa-paint-roller"></i></div>
            <span class="footer__brand-name">ColorCraft</span>
          </a>
          <p class="footer__brand-desc">
            Your trusted painting and wall finishing experts, delivering flawless interiors and stunning exteriors to your home or business since 2009.
          </p>
          <div class="footer__social" role="list" aria-label="Social media links">
            <a href="#" class="footer__social-link" role="listitem" aria-label="ColorCraft on Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>
            <a href="#" class="footer__social-link" role="listitem" aria-label="ColorCraft on Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
            <a href="#" class="footer__social-link" role="listitem" aria-label="ColorCraft on X/Twitter"><i class="fab fa-x-twitter" aria-hidden="true"></i></a>
            <a href="#" class="footer__social-link" role="listitem" aria-label="ColorCraft on WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>
            <a href="#" class="footer__social-link" role="listitem" aria-label="ColorCraft on YouTube"><i class="fab fa-youtube" aria-hidden="true"></i></a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer__col">
          <h3 class="footer__col-title">Quick Links</h3>
          <ul class="footer__links" role="list">
            <li role="listitem"><a href="${BASE}index.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Home</a></li>
            <li role="listitem"><a href="${BASE}pages/about.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>About Us</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Services</a></li>
            <li role="listitem"><a href="${BASE}pages/pricing.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Pricing & Packages</a></li>
            <li role="listitem"><a href="${BASE}pages/blog.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Our Gallery</a></li>
            <li role="listitem"><a href="${BASE}pages/contact.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Contact</a></li>
            <li role="listitem"><a href="${BASE}pages/coming-soon.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Coming Soon</a></li>
          </ul>
        </div>

        <!-- Services -->
        <div class="footer__col">
          <h3 class="footer__col-title">Our Services</h3>
          <ul class="footer__links" role="list">
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Interior Painting</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Exterior Painting</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Cabinet Refinishing</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Wallpaper Installation</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Drywall Repair</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Color Consultation</a></li>
            <li role="listitem"><a href="${BASE}pages/service.html" class="footer__link"><i class="fas fa-chevron-right footer__link-icon" aria-hidden="true"></i>Commercial Painting</a></li>
          </ul>
        </div>

        <!-- Newsletter + Contact -->
        <div class="footer__col">
          <h3 class="footer__col-title">Stay Inspired</h3>
          <p style="color:rgba(255,255,255,0.6);font-size:var(--fs-sm);margin-bottom:var(--sp-4);">Get seasonal painting tips, color trends, and exclusive offers.</p>
          <form class="footer__newsletter" aria-label="Newsletter subscription" data-newsletter>
            <input type="email" name="email" class="footer__newsletter-input" placeholder="Enter your email..." aria-label="Email address for newsletter" required>
          </form>

          <div style="margin-top:var(--sp-6);">
            <h3 class="footer__col-title">Contact</h3>
            <div style="display:flex;flex-direction:column;gap:var(--sp-2);">
              <a href="tel:+911800123456" class="footer__link" style="display:flex;gap:var(--sp-2);align-items:center;">
                <i class="fas fa-phone" style="width:14px;" aria-hidden="true"></i> +91 1800-123-456
              </a>
              <a href="mailto:hello@colorcraft.com" class="footer__link" style="display:flex;gap:var(--sp-2);align-items:center;">
                <i class="fas fa-envelope" style="width:14px;" aria-hidden="true"></i> hello@colorcraft.com
              </a>
              <span class="footer__link" style="display:flex;gap:var(--sp-2);align-items:flex-start;cursor:default;">
                <i class="fas fa-location-dot" style="width:14px;margin-top:2px;" aria-hidden="true"></i>
                123 Paintbrush Lane, Connaught Place,<br>New Delhi – 110001
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
          &copy; ${currentYear} ColorCraft Painting. All rights reserved.
        </p>
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
  document.querySelectorAll('.navbar__link--dropdown').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.navbar__link--dropdown').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.closest('.navbar__item--dropdown')?.classList.remove('is-open');
      });
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        btn.closest('.navbar__item--dropdown')?.classList.add('is-open');
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.navbar__item--dropdown.is-open').forEach(d => d.classList.remove('is-open'));
    document.querySelectorAll('.navbar__link--dropdown').forEach(b => b.setAttribute('aria-expanded', 'false'));
  });

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      const navbarEl = document.getElementById('navbar');
      if (navbarEl) {
        navbarEl.classList.toggle('is-menu-open', isOpen);
        navbarEl.classList.remove('is-hidden');
      }
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      if (hamburgerIcon) hamburgerIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        const navbarEl = document.getElementById('navbar');
        if (navbarEl) navbarEl.classList.remove('is-menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        if (hamburgerIcon) hamburgerIcon.className = 'fas fa-bars';
        document.body.style.overflow = '';
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

      const mobileMenuEl = document.getElementById('mobileMenu');
      if (y > lastY && y > 200 && !mobileMenuEl?.classList.contains('is-open')) {
        navbar.classList.add('is-hidden');
      } else {
        navbar.classList.remove('is-hidden');
      }
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
        localStorage.setItem('Pulse-theme', JSON.stringify(next));
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
