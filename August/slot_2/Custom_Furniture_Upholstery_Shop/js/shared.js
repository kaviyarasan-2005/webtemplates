/**
 * shared.js — Navbar, Footer injection + Theme + RTL + Nav behaviors
 * Custom Furniture Upholstery Shop
 */

/* ── SVG Icons ── */
const Icons = {
  sun: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 9.8a19.79 19.79 0 0 1-3-8.57A2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8a16 16 0 0 0 7.92 7.92l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  mapPin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  pinterest: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.77 0 3.136-1.866 3.136-4.56 0-2.385-1.715-4.052-4.163-4.052-2.837 0-4.5 2.127-4.5 4.326 0 .856.33 1.775.741 2.277.081.099.093.186.069.286-.076.312-.244.995-.277 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.522 0 10-4.477 10-10S17.522 2 12 2z"/></svg>`,
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20.06 12 20.06 12 20.06s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>`,
  home: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  scissors: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/></svg>`,
  grid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
  camera: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
  messageCircle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  send: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
  externalLink: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  award: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  layers: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  truck: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
  recycle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/></svg>`,
  chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  chevronsLeftRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 7-5 5 5 5"/><path d="m15 7 5 5-5 5"/></svg>`,
  palette: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  bookOpen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  sofa: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"/><path d="M4 18v2"/><path d="M20 18v2"/><path d="M12 4v9"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
  creditCard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
  arrowUp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
};

/* ── Navbar HTML ── */
function getNavbarHTML(activePage = '') {
  const pages = {
    home1: 'home1.html',
    home2: 'home2.html',
    services: 'services.html',
    fabric: 'fabric-gallery.html',
    beforeafter: 'before-after.html',
    contact: 'contact.html',
  };
  const isActive = (p) => activePage === p ? 'active' : '';

  return `
  <nav class="navbar" id="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-container">
      <!-- Brand -->
      <a href="home1.html" class="nav-brand" id="nav-brand" aria-label="ReVox - Go to Home">
        <div class="premium-logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" />
            <path d="M19 12v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4" />
            <path d="M7 18v2" />
            <path d="M17 18v2" />
            <path d="M3 10h18v4H3z" fill="currentColor" fill-opacity="0.15" />
          </svg>
        </div>
        <div class="nav-brand-text">
          <span class="nav-brand-name">ReVox</span>

        </div>
      </a>

      <!-- Desktop Nav -->
      <ul class="nav-list" role="list">
        <li class="nav-item">
          <a href="#" class="nav-link ${isActive('home1') || isActive('home2') ? 'active' : ''}" aria-haspopup="true" aria-expanded="false" id="nav-home-btn">
            Home ${Icons.chevronDown}
          </a>
          <div class="nav-dropdown" role="menu" aria-label="Home submenu">
            <a href="home1.html" role="menuitem" id="nav-home1-link">
              <span class="dd-icon">${Icons.home}</span>
              <span class="dd-label">
                <strong>Home Classic</strong>
                <em>Transformation stories</em>
              </span>
            </a>
            <a href="home2.html" role="menuitem" id="nav-home2-link">
              <span class="dd-icon">${Icons.layers}</span>
              <span class="dd-label">
                <strong>Home Artisan</strong>
                <em>Craftsmanship focus</em>
              </span>
            </a>
          </div>
        </li>
        <li class="nav-item">
          <a href="services.html" class="nav-link ${isActive('services')}" id="nav-services-link">Services</a>
        </li>
        <li class="nav-item">
          <a href="fabric-gallery.html" class="nav-link ${isActive('fabric')}" id="nav-fabric-link">Fabric Gallery</a>
        </li>
        <li class="nav-item">
          <a href="before-after.html" class="nav-link ${isActive('beforeafter')}" id="nav-ba-link">Before &amp; After</a>
        </li>
        <li class="nav-item">
          <a href="contact.html" class="nav-link ${isActive('contact')}" id="nav-contact-link">Contact</a>
        </li>
      </ul>

      <!-- Controls -->
      <div class="nav-controls">
        <button class="control-btn" id="theme-toggle" aria-label="Toggle dark/light theme" title="Toggle theme">
          ${Icons.sun}
        </button>
        <button class="control-btn" id="rtl-toggle" aria-label="Toggle RTL/LTR text direction" title="Toggle RTL/LTR">
          <span style="font-size:11px;font-weight:700;letter-spacing:0">RTL</span>
        </button>
        <a href="contact.html" class="btn btn-primary btn-sm" id="nav-cta-btn" style="margin-left:8px">Get a Quote</a>
        <button class="nav-hamburger" id="nav-hamburger" aria-label="Open navigation menu" aria-expanded="false" aria-controls="nav-mobile">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div class="nav-mobile" id="nav-mobile" role="menu" aria-label="Mobile navigation">
      <div style="font-size:0.75rem;font-weight:600;letter-spacing:0.1em;color:rgba(244,235,221,0.78);padding:8px 16px 4px;text-transform:uppercase">Home</div>
      <div class="mobile-sub">
        <a href="home1.html" id="mob-home1">${Icons.home} <span>Home Classic</span></a>
        <a href="home2.html" id="mob-home2">${Icons.layers} <span>Home Artisan</span></a>
      </div>
      <a href="services.html" class="nav-link ${isActive('services')}" id="mob-services">Services</a>
      <a href="fabric-gallery.html" class="nav-link ${isActive('fabric')}" id="mob-fabric">Fabric Gallery</a>
      <a href="before-after.html" class="nav-link ${isActive('beforeafter')}" id="mob-ba">Before &amp; After</a>
      <a href="contact.html" class="nav-link ${isActive('contact')}" id="mob-contact">Contact</a>
      <div class="nav-mobile-controls">
        <button class="control-btn" id="theme-toggle-mob" aria-label="Toggle theme">${Icons.sun}</button>
        <button class="control-btn" id="rtl-toggle-mob" aria-label="Toggle RTL/LTR"><span style="font-size:11px;font-weight:700">RTL</span></button>
        <a href="contact.html" class="btn btn-primary btn-sm" style="margin-left:auto">Get a Quote</a>
      </div>
    </div>
  </nav>`;
}

/* ── Footer HTML ── */
function getFooterHTML() {
  return `
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <!-- Newsletter Banner -->
      <div class="footer-newsletter-banner reveal">
        <div class="footer-nb-content">
          <div class="footer-nb-text">
            <span class="eyebrow" style="color:var(--terracotta-light)">Stay Connected</span>
            <h3 class="footer-nb-title">Bespoke Stories &amp; Seasonal Textiles</h3>
            <p class="footer-nb-desc">Join over 3,200 design enthusiasts for fabric arrivals, restoration insights, and care tips.</p>
          </div>
          <div class="footer-nb-form-wrap">
            <form class="footer-newsletter-form" id="footer-newsletter-form" novalidate>
              <div class="footer-nl-input-group">
                <input type="email" class="footer-nl-input" placeholder="Enter your email address" aria-label="Newsletter email" id="footer-newsletter-email" required />
                <button type="submit" class="btn btn-primary footer-nl-btn" id="footer-newsletter-btn">
                  <span>Subscribe</span>
                  ${Icons.send}
                </button>
              </div>
              <div id="footer-newsletter-status" class="footer-nl-status" aria-live="polite"></div>
              <p class="footer-nl-note">No spam. Unsubscribe with a single click anytime.</p>
            </form>
          </div>
        </div>
      </div>

      <!-- Main Footer Grid -->
      <div class="footer-grid">
        <!-- Brand & Heritage -->
        <div class="footer-brand">
          <a href="home1.html" class="nav-brand" aria-label="ReVox - Go to Home">
            <div class="premium-logo-icon footer-logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" />
                <path d="M19 12v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4" />
                <path d="M7 18v2" />
                <path d="M17 18v2" />
                <path d="M3 10h18v4H3z" fill="currentColor" fill-opacity="0.15" />
              </svg>
            </div>
            <div class="nav-brand-text">
              <span class="nav-brand-name">ReVox</span>

            </div>
          </a>
          <p class="footer-brand-desc">Master artisans dedicated to revitalizing beloved furniture through traditional hand-upholstery, 8-way hand-tied springs, and curated luxury textiles.</p>
          <div class="footer-badges">
            <span class="footer-pill">${Icons.award} 25+ Yrs Mastery</span>
            <span class="footer-pill">${Icons.shield} Lifetime Warranty</span>
          </div>
          <div class="footer-social" aria-label="Social media links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Follow us on Instagram" id="footer-instagram">${Icons.instagram}</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Follow us on Facebook" id="footer-facebook">${Icons.facebook}</a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Follow us on Pinterest" id="footer-pinterest">${Icons.pinterest}</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Subscribe on YouTube" id="footer-youtube">${Icons.youtube}</a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4 class="footer-heading">Explore</h4>
          <nav class="footer-links" aria-label="Footer quick links">
            <a href="home1.html" id="footer-home1-link">${Icons.chevronRight} Home Classic</a>
            <a href="home2.html" id="footer-home2-link">${Icons.chevronRight} Home Artisan</a>
            <a href="services.html" id="footer-services-link">${Icons.chevronRight} Our Services</a>
            <a href="fabric-gallery.html" id="footer-fabric-link">${Icons.chevronRight} Fabric Gallery</a>
            <a href="before-after.html" id="footer-ba-link">${Icons.chevronRight} Before &amp; After</a>
            <a href="contact.html" id="footer-contact-link">${Icons.chevronRight} Contact Us</a>
          </nav>
        </div>

        <!-- Services -->
        <div class="footer-col">
          <h4 class="footer-heading">Our Services</h4>
          <nav class="footer-links" aria-label="Footer services links">
            <a href="services.html#sofa" id="footer-sofa">${Icons.chevronRight} Sofa &amp; Sectionals</a>
            <a href="services.html#chair" id="footer-chair">${Icons.chevronRight} Chair Reupholstery</a>
            <a href="services.html#headboard" id="footer-headboard">${Icons.chevronRight} Bespoke Headboards</a>
            <a href="services.html#ottoman" id="footer-ottoman">${Icons.chevronRight} Ottoman &amp; Benches</a>
            <a href="services.html#dining" id="footer-dining">${Icons.chevronRight} Dining Chair Sets</a>
            <a href="contact.html#quote" id="footer-quote">${Icons.chevronRight} Request a Quote</a>
          </nav>
        </div>

        <!-- Workshop & Contact -->
        <div class="footer-col">
          <h4 class="footer-heading">Visit Workshop</h4>
          <div class="footer-contact-list">
            <div class="footer-contact-item">
              <span class="footer-contact-icon">${Icons.mapPin}</span>
              <div class="footer-contact-text">
                <strong>Showroom &amp; Atelier</strong>
                <span>142 Artisan Lane, Design District<br>Chennai, TN 600001</span>
              </div>
            </div>
            <div class="footer-contact-item">
              <span class="footer-contact-icon">${Icons.phone}</span>
              <div class="footer-contact-text">
                <strong>Direct Line</strong>
                <a href="tel:+914412345678" id="footer-phone">+91 44 1234 5678</a>
              </div>
            </div>
            <div class="footer-contact-item">
              <span class="footer-contact-icon">${Icons.mail}</span>
              <div class="footer-contact-text">
                <strong>Inquiries</strong>
                <a href="mailto:hello@revoxupholstery.com" id="footer-email">hello@revoxupholstery.com</a>
              </div>
            </div>
            <div class="footer-contact-item">
              <span class="footer-contact-icon">${Icons.clock}</span>
              <div class="footer-contact-text">
                <strong>Workshop Hours</strong>
                <span>Mon – Sat: 9:00 AM – 6:00 PM</span>
              </div>
            </div>
          </div>
          <div class="footer-col-action">
            <a href="contact.html" class="btn btn-outline btn-sm footer-book-btn">${Icons.calendar} Book Showroom Visit</a>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="footer-bottom-left">
          <p>&copy; <span id="footer-year"></span> ReVox. All rights reserved.</p>
          <span class="footer-bottom-divider" aria-hidden="true">•</span>
          <p class="footer-craft-note">Handcrafted with passion &amp; precision</p>
        </div>
        <nav class="footer-bottom-links" aria-label="Footer legal links">
          <a href="contact.html#faq" id="footer-faq">FAQ</a>
          <a href="#" id="footer-privacy">Privacy Policy</a>
          <a href="#" id="footer-terms">Terms of Service</a>
          <a href="#" id="footer-sitemap">Sitemap</a>
        </nav>
        <button class="footer-back-top" id="footer-back-top" aria-label="Back to top of page">
          <span>Top</span>
          ${Icons.arrowUp}
        </button>
      </div>
    </div>
  </footer>`;
}

/* ── Inject Navbar & Footer ── */
function injectLayout(activePage = '') {
  // Inject navbar
  const navPlaceholder = document.getElementById('navbar-placeholder');
  if (navPlaceholder) navPlaceholder.outerHTML = getNavbarHTML(activePage);

  // Inject footer
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) footerPlaceholder.outerHTML = getFooterHTML();

  // Set year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ── Theme Manager ── */
const ThemeManager = {
  key: 'revox-theme',
  init() {
    const saved = localStorage.getItem(this.key);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    this.apply(theme);

    // Watch system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.key)) this.apply(e.matches ? 'dark' : 'light');
    });
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.key, theme);
    this.updateIcons(theme);
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  },
  updateIcons(theme) {
    const isDark = theme === 'dark';
    document.querySelectorAll('#theme-toggle, #theme-toggle-mob').forEach(btn => {
      btn.innerHTML = isDark ? Icons.moon : Icons.sun;
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
};

/* ── RTL Manager ── */
const RTLManager = {
  key: 'revox-dir',
  init() {
    const saved = localStorage.getItem(this.key) || 'ltr';
    this.apply(saved);
  },
  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(this.key, dir);
    this.updateButtons(dir);
  },
  toggle() {
    const current = document.documentElement.getAttribute('dir');
    this.apply(current === 'rtl' ? 'ltr' : 'rtl');
  },
  updateButtons(dir) {
    document.querySelectorAll('#rtl-toggle, #rtl-toggle-mob').forEach(btn => {
      btn.querySelector('span').textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR layout' : 'Switch to RTL layout');
    });
  }
};

/* ── Hamburger ── */
function initHamburger() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ── Navbar scroll ── */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}

/* ── Page Loader ── */
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('loaded'), 300);
  });
}

/* ── Event Wiring (called after DOM injection) ── */
function wireControls() {
  document.querySelectorAll('#theme-toggle, #theme-toggle-mob').forEach(btn => {
    btn.addEventListener('click', () => ThemeManager.toggle());
  });
  document.querySelectorAll('#rtl-toggle, #rtl-toggle-mob').forEach(btn => {
    btn.addEventListener('click', () => RTLManager.toggle());
  });
}

/* ── Newsletter footer ── */
function initNewsletterForm() {
  const form = document.getElementById('footer-newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('footer-newsletter-email');
    const statusEl = document.getElementById('footer-newsletter-status');
    if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
      if (statusEl) {
        statusEl.innerHTML = `<span style="color:#FF8A80;font-size:0.8125rem">Please enter a valid email address.</span>`;
      }
      return;
    }
    input.classList.remove('error');
    input.value = '';
    const btn = form.querySelector('button[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `${Icons.check} <span>Subscribed!</span>`;
    btn.style.background = '#2E7D32';
    btn.style.borderColor = '#2E7D32';
    if (statusEl) {
      statusEl.innerHTML = `<span style="color:#81C784;font-size:0.8125rem">Thank you for subscribing! Welcome to ReVox.</span>`;
    }
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = origHTML;
      btn.style.background = '';
      btn.style.borderColor = '';
      if (statusEl) statusEl.innerHTML = '';
    }, 4000);
  });
}

/* ── Back to Top ── */
function initBackToTop() {
  const btn = document.getElementById('footer-back-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Counter Animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString();
    if (current >= target) clearInterval(timer);
  }, 16);
}
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
}

/* ── Main Init ── */
function initShared(activePage = '') {
  injectLayout(activePage);
  ThemeManager.init();
  RTLManager.init();
  wireControls();
  initHamburger();
  initNavbarScroll();
  initScrollReveal();
  initPageLoader();
  initCounters();
  initNewsletterForm();
  initBackToTop();
}

export { initShared, Icons, ThemeManager, RTLManager };
