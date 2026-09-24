/* ============================================================
   MAIN.JS — VOWS Wedding Planning & Event Coordination
   Handles: theme toggle, RTL toggle, mobile hamburger drawer,
   nav dropdowns, active link highlighting, IntersectionObserver
   fade-up, page-specific interactions, auth demo validation,
   all guarded with existence checks.
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────
   1. THEME TOGGLE
────────────────────────────────────────────────────────── */
(function initTheme() {
  const stored = localStorage.getItem('vows-theme') || 'light';
  document.documentElement.setAttribute('data-theme', stored);

  function applyThemeIcon(theme) {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const sun  = btn.querySelector('.icon-sun');
      const moon = btn.querySelector('.icon-moon');
      if (sun)  sun.style.display  = theme === 'dark' ? 'none'   : 'block';
      if (moon) moon.style.display = theme === 'dark' ? 'block'  : 'none';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('vows-theme', next);
    applyThemeIcon(next);
    // Redraw charts if on a dashboard page
    if (typeof window.redrawAllCharts === 'function') window.redrawAllCharts();
  }

  document.addEventListener('click', e => {
    if (e.target.closest('[data-theme-toggle]')) toggleTheme();
  });

  applyThemeIcon(stored);
})();

/* ──────────────────────────────────────────────────────────
   2. RTL / LTR TOGGLE
────────────────────────────────────────────────────────── */
(function initDir() {
  const stored = localStorage.getItem('vows-dir') || 'ltr';
  document.documentElement.setAttribute('dir', stored);

  function applyDirLabel(dir) {
    const label = dir === 'rtl' ? 'LTR' : 'RTL';
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.textContent = label;
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
    });
  }

  function toggleDir() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next    = current === 'rtl' ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', next);
    localStorage.setItem('vows-dir', next);
    applyDirLabel(next);
  }

  document.addEventListener('click', e => {
    if (e.target.closest('[data-rtl-toggle]')) toggleDir();
  });

  applyDirLabel(stored);
})();

/* ──────────────────────────────────────────────────────────
   3. MOBILE HAMBURGER DRAWER
────────────────────────────────────────────────────────── */
(function initDrawer() {
  const hamburger = document.getElementById('nav-hamburger');
  const drawer    = document.getElementById('nav-drawer');
  const overlay   = document.getElementById('nav-drawer-overlay');
  const close     = document.getElementById('drawer-close');

  if (!hamburger || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay && overlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay && overlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  close   && close.addEventListener('click', closeDrawer);
  overlay && overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });
})();

/* ──────────────────────────────────────────────────────────
   4. NAV DROPDOWNS (desktop)
────────────────────────────────────────────────────────── */
(function initDropdowns() {
  const navItems = document.querySelectorAll('.nav-item');
  if (!navItems.length) return;

  navItems.forEach(item => {
    const trigger  = item.querySelector('[data-dropdown-trigger]');
    const dropdown = item.querySelector('.nav-dropdown');
    if (!trigger || !dropdown) return;

    function open()  { item.classList.add('open'); trigger.setAttribute('aria-expanded','true'); }
    function close() { item.classList.remove('open'); trigger.setAttribute('aria-expanded','false'); }

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = item.classList.contains('open');
      // close all others
      navItems.forEach(ni => { ni.classList.remove('open'); const t = ni.querySelector('[data-dropdown-trigger]'); if(t) t.setAttribute('aria-expanded','false'); });
      isOpen ? close() : open();
    });
  });

  document.addEventListener('click', () => {
    navItems.forEach(ni => { ni.classList.remove('open'); const t = ni.querySelector('[data-dropdown-trigger]'); if(t) t.setAttribute('aria-expanded','false'); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      navItems.forEach(ni => { ni.classList.remove('open'); const t = ni.querySelector('[data-dropdown-trigger]'); if(t) t.setAttribute('aria-expanded','false'); });
    }
  });
})();

/* ──────────────────────────────────────────────────────────
   5. DRAWER SUBMENUS (mobile)
────────────────────────────────────────────────────────── */
(function initDrawerSubmenus() {
  document.querySelectorAll('[data-drawer-submenu-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      if (sub && sub.classList.contains('drawer-sub')) {
        const isOpen = sub.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   6. ACTIVE NAV LINK HIGHLIGHTING
────────────────────────────────────────────────────────── */
(function initActiveLinks() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const allLinks = document.querySelectorAll('.nav-links a, .nav-dropdown a, .drawer-links a, .drawer-sub a');
  allLinks.forEach(a => {
    const href = a.getAttribute('href') || '';
    const hrefFile = href.split('/').pop();
    if (hrefFile === path || (path === '' && hrefFile === 'index.html')) {
      a.classList.add('active');
      // Also mark parent nav-item if dropdown child
      const parentItem = a.closest('.nav-item');
      if (parentItem) parentItem.classList.add('active');
    }
  });
})();

/* ──────────────────────────────────────────────────────────
   7. NAVBAR SCROLL SHADOW
────────────────────────────────────────────────────────── */
(function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ──────────────────────────────────────────────────────────
   8. SCROLL FADE-UP (IntersectionObserver)
────────────────────────────────────────────────────────── */
(function initScrollFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ──────────────────────────────────────────────────────────
   9. WREATH SVG DRAW (About hero)
────────────────────────────────────────────────────────── */
(function initWreathDraw() {
  const paths = document.querySelectorAll('.wreath-path');
  if (!paths.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        paths.forEach(p => p.classList.add('drawn'));
        obs.disconnect();
      }
    });
  }, { threshold: .3 });
  const hero = document.querySelector('.floral-wreath-hero');
  if (hero) obs.observe(hero);
})();

/* ──────────────────────────────────────────────────────────
   10. SILK CURTAIN — trigger on load (Home 1)
────────────────────────────────────────────────────────── */
// CSS animation handles this automatically. No JS needed beyond CSS.

/* ──────────────────────────────────────────────────────────
   11. TASTING MENU (Home 1 S2)
────────────────────────────────────────────────────────── */
(function initTastingMenu() {
  const cards = document.querySelectorAll('.menu-card');
  if (!cards.length) return;
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      cards.forEach(c => c.classList.remove('open'));
      if (!isOpen) card.classList.add('open');
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   12. POSTCARD REEL (Home 2 S2) — drag to scroll + flip
────────────────────────────────────────────────────────── */
(function initPostcardReel() {
  document.querySelectorAll('.postcard').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   13. DESTINATION MATCHER (Home 2 S3)
────────────────────────────────────────────────────────── */
(function initMatcher() {
  const chips = document.querySelectorAll('.matcher-chips .chip');
  if (!chips.length) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.closest('.matcher-chips');
      group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  const findBtn = document.getElementById('matcher-find-btn');
  const result  = document.getElementById('matcher-result');
  if (!findBtn || !result) return;

  const destinations = {
    Beach:    { name: 'Santorini, Greece',   reason: 'Clifftop venues & endless Aegean views match your beach dream perfectly.' },
    Vineyard: { name: 'Tuscany, Italy',       reason: 'Rolling vineyards and stone villas create an unmatched vineyard romance.' },
    City:     { name: 'Amalfi Coast',         reason: 'Dramatic cliffs and pastel-village charm suit a chic city celebration.' },
    Mountains:{ name: 'Swiss Alps',           reason: 'Alpine chalets and snow-capped peaks frame a breathtaking mountain union.' }
  };

  findBtn.addEventListener('click', () => {
    const moodChip = document.querySelector('.matcher-chips.mood-chips .chip.active');
    const mood = moodChip ? moodChip.dataset.value : 'Beach';
    const dest = destinations[mood] || destinations.Beach;
    const nameEl   = result.querySelector('.matcher-result-name');
    const reasonEl = result.querySelector('.matcher-result-reason');
    if (nameEl)   nameEl.textContent   = dest.name;
    if (reasonEl) reasonEl.textContent = dest.reason;
    result.classList.add('visible');
  });
})();

/* ──────────────────────────────────────────────────────────
   14. ITINERARY RAIL (Home 2 S4) — scroll progress
────────────────────────────────────────────────────────── */
(function initItineraryRail() {
  const rail = document.querySelector('.rail-track');
  if (!rail) return;

  const progress  = rail.querySelector('.rail-progress');
  const stations  = rail.querySelectorAll('.rail-station');
  const luggage   = rail.querySelector('.luggage-icon');
  const total     = stations.length;

  function updateRail() {
    const rect   = rail.getBoundingClientRect();
    const vh     = window.innerHeight;
    const pct    = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height * .5)));
    const idx    = Math.min(total - 1, Math.floor(pct * total));

    if (window.innerWidth <= 768) {
      if (progress) {
        progress.style.height = (pct * 100) + '%';
        progress.style.width = '4px';
      }
    } else {
      if (progress) {
        progress.style.width = (pct * 100) + '%';
        progress.style.height = '4px';
      }
    }
    stations.forEach((s, i) => s.classList.toggle('active', i <= idx));
    if (luggage && window.innerWidth > 768) luggage.style.left = (pct * (rail.offsetWidth - 28)) + 'px';
  }

  window.addEventListener('scroll', updateRail, { passive: true });
  updateRail();
})();

/* ──────────────────────────────────────────────────────────
   15. RIBBON PROCESS STEPS (Home 1 S5) — bloom on scroll
────────────────────────────────────────────────────────── */
(function initRibbonSteps() {
  const steps = document.querySelectorAll('.ribbon-step');
  if (!steps.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: .25 });
  steps.forEach((s, i) => {
    s.style.transitionDelay = (i * 150) + 'ms';
    obs.observe(s);
  });
})();

/* ──────────────────────────────────────────────────────────
   16. WAX SEAL STAMP (Pricing S5)
────────────────────────────────────────────────────────── */
(function initWaxSeals() {
  const seals = document.querySelectorAll('.wax-seal');
  if (!seals.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('stamped');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .4 });
  seals.forEach(seal => obs.observe(seal));
})();

/* ──────────────────────────────────────────────────────────
   17. PORTFOLIO SHELF FILTER
────────────────────────────────────────────────────────── */
(function initShelfFilter() {
  const tabs   = document.querySelectorAll('.shelf-tab');
  const albums = document.querySelectorAll('.album-book');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      albums.forEach(album => {
        const cat = album.dataset.category || 'all';
        if (filter === 'all' || cat === filter) {
          album.classList.remove('hidden');
        } else {
          album.classList.add('hidden');
        }
      });
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   18. ESCORT CARD FLIP (Portfolio S4)
────────────────────────────────────────────────────────── */
(function initEscortFlip() {
  document.querySelectorAll('.escort-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
})();

/* ──────────────────────────────────────────────────────────
   19. SNAP LIGHTBOX (Portfolio S5)
────────────────────────────────────────────────────────── */
(function initSnapLightbox() {
  const lightbox = document.getElementById('snap-lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCap    = document.getElementById('lightbox-caption');
  const lbClose  = document.getElementById('lightbox-close');
  if (!lightbox) return;

  document.querySelectorAll('.snap-polaroid').forEach(snap => {
    snap.addEventListener('click', () => {
      const img = snap.querySelector('img');
      const cap = snap.dataset.caption || '';
      if (lbImg) { lbImg.src = img.src; lbImg.alt = img.alt; }
      if (lbCap) lbCap.textContent = cap;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  lbClose && lbClose.addEventListener('click', closeLb);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
})();

/* ──────────────────────────────────────────────────────────
   20. CHAPTER RINGS SVG DRAW (Portfolio S6)
────────────────────────────────────────────────────────── */
(function initChapterRings() {
  const paths = document.querySelectorAll('.rings-path');
  if (!paths.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        paths.forEach(p => p.classList.add('drawn'));
        obs.disconnect();
      }
    });
  }, { threshold: .4 });
  const banner = document.querySelector('.chapter-banner');
  if (banner) obs.observe(banner);
})();

/* ──────────────────────────────────────────────────────────
   21. GIFT BOX UNFURL (Service Details S2)
────────────────────────────────────────────────────────── */
(function initGiftBoxes() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const boxes = entry.target.querySelectorAll('.gift-box');
        boxes.forEach((box, i) => {
          setTimeout(() => box.classList.add('open'), i * 300);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .3 });
  const section = document.querySelector('.gift-boxes-section');
  if (section) obs.observe(section);
})();

/* ──────────────────────────────────────────────────────────
   22. ADVICE COLUMN ACCORDION (Service Details S4)
────────────────────────────────────────────────────────── */
(function initAdviceAccordion() {
  document.querySelectorAll('.advice-letter-header').forEach(header => {
    header.addEventListener('click', () => {
      const letter = header.closest('.advice-letter');
      const isOpen = letter.classList.contains('open');
      document.querySelectorAll('.advice-letter').forEach(l => l.classList.remove('open'));
      if (!isOpen) letter.classList.add('open');
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   23. A LA CARTE SELECTION (Pricing S4)
────────────────────────────────────────────────────────── */
(function initALaCarte() {
  const rows     = document.querySelectorAll('.addon-row');
  const plate    = document.getElementById('selection-plate');
  const totalEl  = document.getElementById('selection-total-price');
  if (!rows.length) return;

  let total = 0;
  const selected = new Set();

  rows.forEach(row => {
    row.addEventListener('click', () => {
      const id    = row.dataset.id;
      const price = parseFloat(row.dataset.price || '0');
      if (selected.has(id)) {
        selected.delete(id);
        total -= price;
        row.classList.remove('selected');
      } else {
        selected.add(id);
        total += price;
        row.classList.add('selected');
      }
      if (plate) plate.classList.toggle('visible', selected.size > 0);
      if (totalEl) totalEl.textContent = '$' + total.toLocaleString();
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   24. BLOG JOURNAL TAB FILTER
────────────────────────────────────────────────────────── */
(function initJournalTabs() {
  const tabs  = document.querySelectorAll('.page-tab');
  const cards = document.querySelectorAll('.journal-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach(card => {
        const cat = card.dataset.category || 'all';
        card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
      });
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   25. RIBBON BOOKMARK FILTER (Blog S4)
────────────────────────────────────────────────────────── */
(function initBookmarkFilter() {
  const bookmarks = document.querySelectorAll('.ribbon-bookmark');
  const cards     = document.querySelectorAll('.journal-card');
  if (!bookmarks.length) return;

  bookmarks.forEach(bm => {
    bm.addEventListener('click', () => {
      bookmarks.forEach(b => b.classList.remove('active'));
      bm.classList.add('active');
      const filter = bm.dataset.filter;
      cards.forEach(card => {
        const cat = card.dataset.category || 'all';
        card.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
      });
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   26. STATIONERY SUBSCRIBE (Blog S5)
────────────────────────────────────────────────────────── */
(function initSubscribeForm() {
  const form    = document.getElementById('subscribe-form');
  const letter  = document.querySelector('.letterhead');
  const confirm = document.getElementById('envelope-confirm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    if (!emailInput || !emailInput.value.trim()) {
      emailInput && emailInput.focus();
      return;
    }
    if (letter) letter.classList.add('folding');
    setTimeout(() => {
      if (letter)  letter.style.display = 'none';
      if (confirm) confirm.classList.add('visible');
    }, 600);
  });
})();

/* ──────────────────────────────────────────────────────────
   27. READING PROGRESS (Blog Details S2)
────────────────────────────────────────────────────────── */
(function initReadingProgress() {
  const proseBody = document.querySelector('.prose-body');
  const petals    = document.querySelectorAll('.bloom-petal');
  const pctEl     = document.querySelector('.progress-pct');
  if (!proseBody || !petals.length) return;

  function update() {
    const rect  = proseBody.getBoundingClientRect();
    const total = rect.height;
    const read  = Math.max(0, Math.min(total, window.innerHeight - rect.top));
    const pct   = Math.round((read / total) * 100);
    if (pctEl) pctEl.textContent = pct + '%';
    const openCount = Math.ceil((pct / 100) * petals.length);
    petals.forEach((p, i) => p.classList.toggle('open', i < openCount));
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ──────────────────────────────────────────────────────────
   28. WELL-WISHES COMMENT FORM (Blog Details S5)
────────────────────────────────────────────────────────── */
(function initCommentForm() {
  const form     = document.getElementById('comment-form');
  const list     = document.getElementById('comments-list');
  if (!form || !list) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('#comment-name');
    const msg  = form.querySelector('#comment-message');
    if (!name || !name.value.trim() || !msg || !msg.value.trim()) return;

    const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const el  = document.createElement('div');
    el.className = 'comment-entry writing-in';
    el.innerHTML = `
      <div class="comment-header">
        <span class="comment-author">${escHtml(name.value.trim())}</span>
        <span class="comment-date">${now}</span>
      </div>
      <p class="comment-text">${escHtml(msg.value.trim())}</p>
    `;
    list.appendChild(el);
    form.reset();
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();

/* ──────────────────────────────────────────────────────────
   29. CONTACT FORM VALIDATION (Contact S3)
────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('invite-response-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const err = form.querySelector(`[data-error="${field.id}"]`);
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#b85c8a';
        if (err) err.textContent = 'This field is required.';
      } else {
        field.style.borderColor = '';
        if (err) err.textContent = '';
      }
    });
    if (valid) {
      const btn = form.querySelector('[type="submit"]');
      if (btn) { btn.textContent = 'RSVP Sent!'; btn.disabled = true; }
    }
  });

  // Toggle pills (guest count, destination)
  form.querySelectorAll('.toggle-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.closest('.guest-options, .dest-toggle');
      if (group) group.querySelectorAll('.toggle-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   30. CONSULTATION CALENDAR (Contact S5)
────────────────────────────────────────────────────────── */
(function initCalendar() {
  const calGrid  = document.getElementById('cal-grid');
  const monthEl  = document.getElementById('cal-month');
  const prevBtn  = document.getElementById('cal-prev');
  const nextBtn  = document.getElementById('cal-next');
  const slots    = document.getElementById('time-slots-list');
  if (!calGrid) return;

  const bookable = [3,7,10,14,17,21,24,28]; // Demo bookable days
  const times    = ['10:00 AM','11:30 AM','1:00 PM','3:00 PM','4:30 PM'];
  let now = new Date();
  let year = now.getFullYear(), month = now.getMonth();

  function render() {
    const d1  = new Date(year, month, 1);
    const d2  = new Date(year, month + 1, 0);
    const startDay = d1.getDay();
    const days = d2.getDate();
    monthEl.textContent = d1.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    // Day labels
    let html = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<div class="cal-day-label">${d}</div>`).join('');
    // Empty cells
    for (let i = 0; i < startDay; i++) html += '<div class="cal-day empty"></div>';
    // Days
    for (let d = 1; d <= days; d++) {
      const isBookable = bookable.includes(d);
      const isPast     = (year < now.getFullYear()) || (year === now.getFullYear() && month < now.getMonth()) || (year === now.getFullYear() && month === now.getMonth() && d < now.getDate());
      let cls = 'cal-day';
      if (isPast) cls += ' past';
      else if (isBookable) cls += ' bookable';
      html += `<div class="${cls}" data-day="${d}">${d}</div>`;
    }
    calGrid.innerHTML = html;
    // Click on bookable
    calGrid.querySelectorAll('.cal-day.bookable').forEach(d => {
      d.addEventListener('click', () => {
        calGrid.querySelectorAll('.cal-day').forEach(x => x.classList.remove('selected'));
        d.classList.add('selected');
        showSlots(d.dataset.day);
      });
    });
  }

  function showSlots(day) {
    if (!slots) return;
    slots.innerHTML = times.map(t =>
      `<div class="time-slot" tabindex="0">${t}</div>`
    ).join('');
    slots.querySelectorAll('.time-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        slots.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        // Feed into date field
        const dateField = document.getElementById('wedding-date');
        if (dateField) {
          const m = month + 1;
          dateField.value = `${year}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        }
      });
    });
  }

  prevBtn && prevBtn.addEventListener('click', () => { month--; if (month < 0) { month = 11; year--; } render(); });
  nextBtn && nextBtn.addEventListener('click', () => { month++; if (month > 11) { month = 0; year++; } render(); });
  render();
})();

/* ──────────────────────────────────────────────────────────
   31. AUTH DEMO — LOGIN
────────────────────────────────────────────────────────── */
(function initLogin() {
  const form      = document.getElementById('login-form');
  const roleBtns  = document.querySelectorAll('.role-btn');
  if (!form) return;

  let activeRole = 'couple';
  roleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRole = btn.dataset.role;
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('#login-email');
    const pass  = form.querySelector('#login-pass');
    const errEl = form.querySelector('#login-error');
    let valid   = true;

    if (!email || !email.value.trim()) { valid = false; }
    if (!pass  || !pass.value.trim())  { valid = false; }

    if (!valid) {
      if (errEl) errEl.textContent = 'Please enter your email and password.';
      return;
    }
    if (errEl) errEl.textContent = '';

    // Demo redirect
    if (activeRole === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'user-dashboard.html';
    }
  });
})();

/* ──────────────────────────────────────────────────────────
   32. AUTH DEMO — SIGNUP
────────────────────────────────────────────────────────── */
(function initSignup() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const pass    = form.querySelector('#signup-pass');
    const confirm = form.querySelector('#signup-confirm');
    const terms   = form.querySelector('#signup-terms');
    const errEl   = form.querySelector('#signup-error');

    if (errEl) errEl.textContent = '';

    if (pass && confirm && pass.value !== confirm.value) {
      if (errEl) errEl.textContent = 'Passwords do not match.';
      return;
    }
    if (terms && !terms.checked) {
      if (errEl) errEl.textContent = 'Please agree to the terms.';
      return;
    }

    window.location.href = 'user-dashboard.html';
  });
})();

/* ──────────────────────────────────────────────────────────
   33. COMING SOON QUILL TYPING ANIMATION
────────────────────────────────────────────────────────── */
(function initQuillTyping() {
  const el = document.getElementById('quill-text');
  if (!el) return;

  const text = 'Something Beautiful Is Being Planned';
  let i = 0;
  el.textContent = '';

  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 65);
    } else {
      // Loop: pause then retype
      setTimeout(() => {
        el.textContent = '';
        i = 0;
        setTimeout(type, 400);
      }, 3500);
    }
  }
  setTimeout(type, 800);
})();

/* ──────────────────────────────────────────────────────────
   34. COMING SOON NOTIFY FORM
────────────────────────────────────────────────────────── */
(function initComingSoonForm() {
  const form = document.getElementById('notify-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn   = form.querySelector('button');
    if (input && input.value.trim()) {
      if (btn) btn.textContent = 'Noted!';
      input.value = '';
      input.placeholder = 'We\'ll be in touch.';
      input.disabled = true;
      btn.disabled = true;
    }
  });
})();

/* ──────────────────────────────────────────────────────────
   35. MILESTONE BLOOM GARLAND (About S4)
────────────────────────────────────────────────────────── */
// Handled via CSS :hover. No additional JS needed.

/* ──────────────────────────────────────────────────────────
   36. ARCH SVG DRAW (Portfolio hero)
────────────────────────────────────────────────────────── */
// CSS animation handles .arch-path. Triggered on page load.

/* ──────────────────────────────────────────────────────────
   37. UTILS
────────────────────────────────────────────────────────── */
function escHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ──────────────────────────────────────────────────────────
   38. LUCIDE ICONS INIT
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
