/* ============================================================
   MUSE — main.js
   Theme toggle, RTL/LTR toggle, Nav behavior, Auth demo,
   Page-specific interactions, Scroll animations
   ============================================================ */

'use strict';

/* ── HELPERS ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

/* ============================================================
   1. THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const stored = localStorage.getItem('muse-theme') || 'light';
  applyTheme(stored);

  $$('.toggle-theme-btn').forEach(btn => {
    on(btn, 'click', () => {
      const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('muse-theme', next);
    });
  });

  function applyTheme(t) {
    document.documentElement.classList.toggle('dark', t === 'dark');
    $$('.toggle-theme-btn').forEach(btn => {
      btn.innerHTML = t === 'dark' ? sunIcon() : moonIcon();
      btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function moonIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
  function sunIcon() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  }
})();

/* ============================================================
   2. RTL / LTR TOGGLE
   ============================================================ */
(function initRTL() {
  const stored = localStorage.getItem('muse-dir') || 'ltr';
  applyDir(stored);

  $$('.toggle-rtl-btn').forEach(btn => {
    on(btn, 'click', () => {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'ltr' ? 'rtl' : 'ltr';
      applyDir(next);
      localStorage.setItem('muse-dir', next);
    });
  });

  function applyDir(d) {
    document.documentElement.setAttribute('dir', d);
    $$('.toggle-rtl-btn').forEach(btn => {
      btn.textContent = d === 'ltr' ? 'RTL' : 'LTR';
      btn.setAttribute('aria-label', d === 'ltr' ? 'Switch to RTL mode' : 'Switch to LTR mode');
    });
  }
})();

/* ============================================================
   3. NAVBAR — scroll shadow, hamburger, dropdowns, active link
   ============================================================ */
(function initNavbar() {
  const navbar = $('.navbar');
  const hamburger = $('.hamburger');
  const drawer = $('.nav-drawer');
  const drawerOverlay = $('.nav-drawer-overlay');

  if (!navbar) return;

  /* Scroll shadow */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* Hamburger toggle */
  on(hamburger, 'click', () => {
    const open = hamburger.classList.toggle('open');
    if (drawer) drawer.classList.toggle('open', open);
    if (drawerOverlay) {
      if (open) {
        drawerOverlay.style.display = 'block';
        requestAnimationFrame(() => drawerOverlay.classList.add('open'));
      } else {
        closeDrawer();
      }
    }
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  on(drawerOverlay, 'click', closeDrawer);

  function closeDrawer() {
    if (hamburger) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    if (drawer) drawer.classList.remove('open');
    if (drawerOverlay) {
      drawerOverlay.classList.remove('open');
      setTimeout(() => {
        if (!drawerOverlay.classList.contains('open')) {
          drawerOverlay.style.display = 'none';
        }
      }, 300);
    }
    document.body.style.overflow = '';
  }

  // Ensure initial clean state on mobile/desktop
  if (drawerOverlay) {
    drawerOverlay.classList.remove('open');
    drawerOverlay.style.display = 'none';
  }
  if (drawer) {
    drawer.classList.remove('open');
  }

  /* Keyboard: Escape closes drawer */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  /* Desktop dropdowns */
  $$('.nav-dropdown').forEach(drop => {
    const trigger = $('.nav-dropdown-trigger', drop);
    const menu = $('.nav-dropdown-menu', drop);
    if (!trigger || !menu) return;

    on(trigger, 'click', (e) => {
      e.stopPropagation();
      const open = drop.classList.toggle('open');
      $$('.nav-dropdown.open').forEach(d => { if (d !== drop) d.classList.remove('open'); });
    });
  });

  document.addEventListener('click', () => {
    $$('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
  });

  /* Drawer dropdowns (Home & Dashboard in mobile menu) */
  $$('.nav-drawer-dropdown').forEach(drop => {
    const trigger = $('.nav-drawer-dropdown-trigger', drop);
    if (!trigger) return;

    on(trigger, 'click', (e) => {
      e.stopPropagation();
      const open = drop.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* Active link highlighting & auto-expanding active drawer dropdown */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  $$('.navbar-links a, .nav-dropdown-menu a, .nav-drawer a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const hrefFile = href.split('/').pop();
    if (hrefFile === currentPath || (currentPath === '' && (hrefFile === 'index.html' || hrefFile === ''))) {
      a.classList.add('active');
      const parentDrop = a.closest('.nav-drawer-dropdown');
      if (parentDrop) {
        parentDrop.classList.add('open');
        const trig = $('.nav-drawer-dropdown-trigger', parentDrop);
        if (trig) {
          trig.classList.add('active');
          trig.setAttribute('aria-expanded', 'true');
        }
      }
    }
  });
})();

/* ============================================================
   4. SCROLL FADE-UP (IntersectionObserver)
   ============================================================ */
(function initFadeUp() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.fade-up').forEach(el => obs.observe(el));
})();

/* ============================================================
   5. HOME 1 — ATELIER EDITORIAL RUNWAY HERO
   Interactive Talent Spotlight Switcher
   ============================================================ */
(function initAtelierHero() {
  const hero = $('.atelier-hero');
  if (!hero) return;

  const talentData = [
    {
      name: 'Elena Rostova',
      div: 'Haute Couture & Editorial Runway',
      img: 'images/elena-rostova-editorial-model.png',
      booking: 'Chanel Haute Couture \'26 Exclusive',
      height: '180 cm / 5\'11"',
      stats: '32" • 24" • 34.5"',
      eyes: 'Emerald / Bronze',
      market: 'Paris • Milan • NYC'
    },
    {
      name: 'Marcus Webb',
      div: 'Runway Men & Global Campaigns',
      img: 'images/marcus-webb-actor.png',
      booking: 'Prada SS26 Worldwide Exclusive',
      height: '188 cm / 6\'2"',
      stats: 'Chest 38" • W 30"',
      eyes: 'Deep Brown / Charcoal',
      market: 'London • Milan • Tokyo'
    },
    {
      name: 'Amara Nwosu',
      div: 'Screen, Cinema & Red Carpet',
      img: 'images/amara-nwosu-runway-model.png',
      booking: 'Lead Booking: Cannes \'26 Feature Film',
      height: '177 cm / 5\'9.5"',
      stats: '33" • 25" • 35"',
      eyes: 'Dark Amber / Espresso',
      market: 'Los Angeles • Paris • Berlin'
    },
    {
      name: 'Sophia Laurent',
      div: 'Vogue Cover Icon & High Luxury',
      img: 'images/sophia-laurent-editorial-model.png',
      booking: 'Cover Story: Vogue Global Autumn Issue',
      height: '179 cm / 5\'10.5"',
      stats: '32.5" • 24" • 35"',
      eyes: 'Hazel / Sunlit Honey',
      market: 'New York • Paris • London'
    }
  ];

  const catTabs = $$('.cat-tab', hero);
  const thumbBtns = $$('.thumb-btn', hero);
  const heroImg = $('#hero-talent-img', hero);
  const heroName = $('#hero-talent-name', hero);
  const heroDiv = $('#hero-talent-div', hero);
  const heroBooking = $('#hero-talent-booking', hero);
  const heroHeight = $('#hero-talent-height', hero);
  const heroStats = $('#hero-talent-stats', hero);
  const heroEyes = $('#hero-talent-eyes', hero);
  const heroMarket = $('#hero-talent-market', hero);

  let currentIndex = 0;
  let autoTimer = null;

  function switchTalent(index) {
    if (!talentData[index]) return;
    currentIndex = index;
    const data = talentData[index];

    // Update active tab & thumb
    catTabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
      tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
    thumbBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    // Image crossfade
    if (heroImg) {
      heroImg.classList.add('changing');
      setTimeout(() => {
        heroImg.src = data.img;
        heroImg.alt = data.name + ' — ' + data.div;
        heroImg.onload = () => heroImg.classList.remove('changing');
        setTimeout(() => heroImg.classList.remove('changing'), 200);
      }, 200);
    }

    // Text updates
    if (heroName) heroName.textContent = data.name;
    if (heroDiv) heroDiv.textContent = data.div;
    if (heroBooking) heroBooking.textContent = data.booking;
    if (heroHeight) heroHeight.textContent = data.height;
    if (heroStats) heroStats.textContent = data.stats;
    if (heroEyes) heroEyes.textContent = data.eyes;
    if (heroMarket) heroMarket.textContent = data.market;
  }

  // Click listeners for tabs & thumbnails
  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.talent, 10);
      switchTalent(idx);
      restartTimer();
    });
  });

  thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.talent, 10);
      switchTalent(idx);
      restartTimer();
    });
  });

  // Subtle auto-cycle every 7 seconds
  function startTimer() {
    autoTimer = setInterval(() => {
      const next = (currentIndex + 1) % talentData.length;
      switchTalent(next);
    }, 7000);
  }

  function restartTimer() {
    if (autoTimer) clearInterval(autoTimer);
    startTimer();
  }

  hero.addEventListener('mouseenter', () => {
    if (autoTimer) clearInterval(autoTimer);
  });
  hero.addEventListener('mouseleave', () => {
    restartTimer();
  });

  startTimer();
})();

/* ============================================================
   6. HOME 2 — CREATOR STUDIO BROADCAST HERO INTERACTION
   ============================================================ */
(function initCreatorStudioHero() {
  const hero = $('.creator-studio-hero');
  if (!hero) return;

  const creatorsData = {
    fashion: {
      handle: '@_zia.creates',
      tag: 'Fashion & Couture &bull; Zia Rossi',
      reach: '2.4M REACH',
      sponsor: 'SPONSORED BY GUCCI',
      dealBadge: 'Signed $180k',
      dealBrand: 'Gucci FW26',
      liveDeal: 'Signed $180k \u2022 Gucci FW26 Global Campaign',
      growth: '+340% YoY',
      likes: '1.8M',
      comments: '34.2k',
      shares: '128k',
      img: 'images/zia-rossi-featured-creator.png',
      alt: 'Zia Rossi Fashion Creator'
    },
    cinema: {
      handle: '@kaito.cinema',
      tag: 'Tech & Directing &bull; Kaito Tanaka',
      reach: '3.8M REACH',
      sponsor: 'PARTNERED WITH SONY',
      dealBadge: 'Signed $240k',
      dealBrand: 'Sony CineFX',
      liveDeal: 'Signed $240k \u2022 Sony CineFX Worldwide Launch',
      growth: '+480% YoY',
      likes: '2.6M',
      comments: '51.8k',
      shares: '210k',
      img: 'images/james-osei-creative-director.png',
      alt: 'Kaito Tanaka Cinema Creator'
    },
    beauty: {
      handle: '@maya.glow',
      tag: 'Beauty & Wellness &bull; Maya Sterling',
      reach: '4.1M REACH',
      sponsor: 'AMBASSADOR &bull; SEPHORA',
      dealBadge: 'Signed $310k',
      dealBrand: 'Sephora Global',
      liveDeal: 'Signed $310k \u2022 Sephora Global Ambassador Deal',
      growth: '+520% YoY',
      likes: '3.4M',
      comments: '82.4k',
      shares: '415k',
      img: 'images/elena-rostova-editorial-model.png',
      alt: 'Maya Sterling Beauty Creator'
    },
    lifestyle: {
      handle: '@leovance.raw',
      tag: 'Cinema & Lifestyle &bull; Leo Vance',
      reach: '1.9M REACH',
      sponsor: 'REPRESENTED &bull; RED BULL',
      dealBadge: 'Signed $145k',
      dealBrand: 'Red Bull Media',
      liveDeal: 'Signed $145k \u2022 Red Bull Expedition Series',
      growth: '+290% YoY',
      likes: '1.2M',
      comments: '28.9k',
      shares: '94k',
      img: 'images/marcus-fontaine-creative-director.png',
      alt: 'Leo Vance Lifestyle Creator'
    }
  };

  const navTabs = $$('.creator-filter-tabs .cr-tab', hero);
  const thumbBtns = $$('.creator-thumb-strip .cr-thumb-btn', hero);
  const deckImg = $('#deckCreatorImg', hero);
  const handleEl = $('#crHandle', hero);
  const nicheTagEl = $('#crNicheTag', hero);
  const reachBadgeEl = $('#crReachBadge', hero);
  const sponsorTextEl = $('#crSponsorText', hero);
  const dealBadgeEl = $('#deckDealText', hero);
  const dealBrandEl = $('#deckDealBrand', hero);
  const liveDealEl = $('#creatorLiveDeal', hero);
  const growthEl = $('#creatorGrowth', hero);
  const likesEl = $('#crLikes', hero);
  const commentsEl = $('#crComments', hero);
  const sharesEl = $('#crShares', hero);

  const keys = ['fashion', 'cinema', 'beauty', 'lifestyle'];
  let currentIndex = 0;
  let autoTimer = null;

  function switchCreator(catKey) {
    const data = creatorsData[catKey];
    if (!data) return;

    currentIndex = keys.indexOf(catKey);

    // Update active tab buttons
    navTabs.forEach(tab => {
      const isSelected = tab.getAttribute('data-category') === catKey;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    // Update active thumbnail buttons
    thumbBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-category') === catKey);
    });

    // Transition image smoothly
    if (deckImg) {
      deckImg.classList.add('changing');
      setTimeout(() => {
        deckImg.src = data.img;
        deckImg.alt = data.alt;
        deckImg.classList.remove('changing');
      }, 200);
    }

    // Update textual indicators
    if (handleEl) handleEl.textContent = data.handle;
    if (nicheTagEl) nicheTagEl.innerHTML = data.tag;
    if (reachBadgeEl) reachBadgeEl.textContent = data.reach;
    if (sponsorTextEl) sponsorTextEl.textContent = data.sponsor;
    if (dealBadgeEl) dealBadgeEl.textContent = data.dealBadge;
    if (dealBrandEl) dealBrandEl.textContent = data.dealBrand;
    if (liveDealEl) liveDealEl.textContent = data.liveDeal;
    if (growthEl) growthEl.textContent = data.growth;
    if (likesEl) likesEl.textContent = data.likes;
    if (commentsEl) commentsEl.textContent = data.comments;
    if (sharesEl) sharesEl.textContent = data.shares;
  }

  // Click listeners for tabs
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.getAttribute('data-category');
      switchCreator(cat);
      resetAutoTimer();
    });
  });

  // Click listeners for thumbnails
  thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      switchCreator(cat);
      resetAutoTimer();
    });
  });

  function startAutoCycle() {
    autoTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % keys.length;
      switchCreator(keys[currentIndex]);
    }, 5500);
  }

  function resetAutoTimer() {
    clearInterval(autoTimer);
    startAutoCycle();
  }

  hero.addEventListener('mouseenter', () => clearInterval(autoTimer));
  hero.addEventListener('mouseleave', () => resetAutoTimer());

  startAutoCycle();
})();

/* ============================================================
   7. ABOUT — VANITY MIRROR BULBS
   ============================================================ */
(function initVanityBulbs() {
  const container = $('.vanity-bulbs');
  if (!container) return;

  const bulbs = $$('.bulb', container);
  let i = 0;
  const interval = setInterval(() => {
    if (i < bulbs.length) {
      bulbs[i].classList.add('lit');
      i++;
    } else {
      clearInterval(interval);
    }
  }, 80);
})();

/* ============================================================
   8. ABOUT — SEASONS ACCORDION (episode guide)
   ============================================================ */
(function initSeasonToggles() {
  $$('.guide-season-toggle').forEach(toggle => {
    on(toggle, 'click', () => {
      const content = toggle.nextElementSibling;
      if (!content) return;
      const open = content.classList.toggle('open');
      const chevron = $('.guide-chevron', toggle);
      if (chevron) chevron.style.transform = open ? 'rotate(180deg)' : '';
    });
  });
})();

/* ============================================================
   9. ROSTER — WARDROBE RAIL FILTER
   ============================================================ */
(function initRailFilter() {
  const btns = $$('.rail-btn');
  const cards = $$('.comp-card');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    on(btn, 'click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category || 'all';

      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        if (match) {
          card.style.opacity = '1'; card.style.transform = '';
          card.closest('.comp-grid-item') && (card.closest('.comp-grid-item').style.display = '');
        } else {
          card.style.opacity = '0'; card.style.transform = 'scale(0.95)';
          setTimeout(() => { if (card.style.opacity === '0') { card.closest('.comp-grid-item') && (card.closest('.comp-grid-item').style.display = 'none'); } }, 300);
        }
      });
    });
  });
})();

/* ============================================================
   10. CASTING — DUST PARTICLES
   ============================================================ */
(function initDustParticles() {
  const container = $('.dust-particles');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'dust-particle';
    p.style.cssText = `
      left: ${40 + Math.random() * 20}%;
      bottom: ${-10 + Math.random() * 20}%;
      animation-duration: ${3 + Math.random() * 4}s;
      animation-delay: ${Math.random() * 4}s;
      opacity: ${0.3 + Math.random() * 0.7};
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
    `;
    container.appendChild(p);
  }
})();

/* ============================================================
   11. CONTACT — INTERCOM BUZZER
   ============================================================ */
(function initIntercom() {
  const panel = $('.intercom-panel');
  const hero = $('.intercom-hero');
  if (!panel || !hero) return;

  on(panel, 'click', () => {
    panel.classList.add('ringing');
    // Ring arcs
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const arc = document.createElement('div');
        arc.className = 'ring-arc';
        const buzzer = $('.intercom-buzzer', panel);
        if (buzzer) buzzer.appendChild(arc);
        setTimeout(() => arc.remove(), 900);
      }, i * 250);
    }
    setTimeout(() => panel.classList.remove('ringing'), 500);

    // Show h1
    const heroContent = $('.hero-content', hero);
    if (heroContent) {
      heroContent.style.opacity = '0';
      setTimeout(() => {
        heroContent.style.transition = 'opacity 0.6s ease';
        heroContent.style.opacity = '1';
      }, 300);
    }
  });
})();

/* ============================================================
   12. CONTACT — FORM VALIDATION
   ============================================================ */
(function initContactForm() {
  const form = $('#application-form');
  if (!form) return;

  on(form, 'submit', e => {
    e.preventDefault();
    let valid = true;

    $$('[required]', form).forEach(field => {
      const group = field.closest('.form-group');
      if (!group) return;
      const empty = field.value.trim() === '';
      group.classList.toggle('error', empty);
      if (empty) valid = false;
    });

    // Email validation
    const emailField = $('#contact-email');
    if (emailField) {
      const emailGroup = emailField.closest('.form-group');
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value);
      if (!emailValid) { emailGroup && emailGroup.classList.add('error'); valid = false; }
    }

    if (valid) {
      const btn = form.querySelector('[type="submit"]');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Application Sent!';
        btn.disabled = true;
        btn.style.background = '#28a745';
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; btn.style.background = ''; }, 3000);
      }
    }
  });

  // Clear errors on input
  $$('[required]', form).forEach(field => {
    on(field, 'input', () => field.closest('.form-group')?.classList.remove('error'));
  });
})();

/* ============================================================
   13. BLOG — PRESS KIT SUBSCRIBE
   ============================================================ */
(function initPressKit() {
  const form = $('.kit-form');
  const confirm = $('.kit-confirm');
  if (!form) return;

  on(form, 'submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (!input || !input.value.trim()) return;
    if (confirm) {
      form.style.display = 'none';
      confirm.style.display = 'block';
    }
  });
})();

/* ============================================================
   14. PRICING — MARQUEE BULB LETTERS
   ============================================================ */
(function initMarqueeLetters() {
  const container = $('.marquee-title');
  if (!container) return;

  const letters = $$('.marquee-letter', container);
  letters.forEach((letter, i) => {
    setTimeout(() => {
      letter.classList.add('lit');
    }, i * 120 + 500);
  });
})();

/* ============================================================
   15. SERVICES — CLAPPERBOARD
   ============================================================ */
(function initClapperboard() {
  const clapper = $('.clapper-wrap');
  if (!clapper) return;

  on(clapper, 'click', () => {
    const top = $('.clapper-top', clapper);
    if (!top) return;
    top.style.animation = 'none';
    requestAnimationFrame(() => {
      top.style.animation = 'clapSnap 0.2s ease-out';
    });
  });
})();

/* ============================================================
   16. BLOG DETAILS — READING PROGRESS BAR
   ============================================================ */
(function initReadingProgress() {
  const bar = $('.progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const scrolled = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
    bar.style.width = Math.min(100, scrolled) + '%';
  }, { passive: true });
})();

/* ============================================================
   17. AUTH DEMO — Login/Signup redirects
   ============================================================ */
(function initAuth() {
  /* Login */
  const loginForm = $('#login-form');
  if (loginForm) {
    const roleBtns = $$('.seg-btn[data-role]');
    let selectedRole = 'talent';

    roleBtns.forEach(btn => {
      on(btn, 'click', () => {
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedRole = btn.dataset.role;
      });
    });

    on(loginForm, 'submit', e => {
      e.preventDefault();
      let valid = true;
      const email = $('#login-email');
      const password = $('#login-password');

      if (email) {
        const eg = email.closest('.form-group');
        if (!email.value.trim()) { eg?.classList.add('error'); valid = false; }
        else eg?.classList.remove('error');
      }
      if (password) {
        const pg = password.closest('.form-group');
        if (!password.value.trim()) { pg?.classList.add('error'); valid = false; }
        else pg?.classList.remove('error');
      }

      if (valid) {
        const dest = selectedRole === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
        window.location.href = dest;
      }
    });
  }

  /* Signup */
  const signupForm = $('#signup-form');
  if (signupForm) {
    on(signupForm, 'submit', e => {
      e.preventDefault();
      let valid = true;
      const required = $$('[required]', signupForm);

      required.forEach(field => {
        const group = field.closest('.form-group');
        if (!field.value.trim()) { group?.classList.add('error'); valid = false; }
        else group?.classList.remove('error');
      });

      const pw = $('#signup-password');
      const cpw = $('#signup-confirm-password');
      if (pw && cpw && pw.value && cpw.value && pw.value !== cpw.value) {
        cpw.closest('.form-group')?.classList.add('error');
        valid = false;
      }

      const terms = $('#signup-terms');
      if (terms && !terms.checked) { terms.closest('.form-group')?.classList.add('error'); valid = false; }

      if (valid) window.location.href = 'user-dashboard.html';
    });

    $$('[required]', signupForm).forEach(f => {
      on(f, 'input', () => f.closest('.form-group')?.classList.remove('error'));
    });
  }

  /* Social buttons (demo) */
  $$('.auth-social-btn').forEach(btn => {
    on(btn, 'click', () => {
      const role = $('[data-role].active')?.dataset.role || 'talent';
      window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
    });
  });
})();

/* ============================================================
   18. SEGMENTED BUTTONS (generic)
   ============================================================ */
(function initSegButtons() {
  $$('.seg-group').forEach(group => {
    $$('.seg-btn', group).forEach(btn => {
      if (btn.dataset.role) return; // handled by auth
      on(btn, 'click', () => {
        $$('.seg-btn', group).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
})();

/* ============================================================
   19. EPISODE GUIDE TOGGLE
   ============================================================ */
(function initEpisodeGuide() {
  $$('.guide-season-toggle').forEach(toggle => {
    on(toggle, 'click', () => {
      const content = toggle.nextElementSibling;
      if (!content) return;
      content.classList.toggle('open');
      const chevron = toggle.querySelector('.guide-chevron');
      if (chevron) chevron.style.transform = content.classList.contains('open') ? 'rotate(180deg)' : '';
    });
  });
})();

/* ============================================================
   20. COMING SOON — Mirror bulbs
   ============================================================ */
(function initComingMirrorBulbs() {
  const bulbs = $$('.mirror-bulb');
  if (!bulbs.length) return;

  let i = 0;
  const half = Math.ceil(bulbs.length / 2);
  const interval = setInterval(() => {
    if (i < half) { bulbs[i].classList.add('lit'); i++; }
    else clearInterval(interval);
  }, 150);
})();

/* ============================================================
   21. GENERIC CARD / HOVER RIPPLE
   ============================================================ */
(function initRipple() {
  $$('.btn-primary').forEach(btn => {
    on(btn, 'click', function(e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        width:200px;height:200px;
        left:${e.clientX - rect.left - 100}px;
        top:${e.clientY - rect.top - 100}px;
        background:rgba(255,255,255,.2);
        transform:scale(0);animation:rippleAnim 0.5s ease-out forwards;
      `;
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Add keyframes if not already injected
  if (!$('#ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = '@keyframes rippleAnim { to { transform:scale(4); opacity:0; } }';
    document.head.appendChild(style);
  }
})();

/* ============================================================
   22. SMOOTH LAZY IMAGE LOAD
   ============================================================ */
(function initLazyImages() {
  const imgs = $$('img[loading="lazy"]');
  if (!('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        if (src) img.src = src;
        img.style.transition = 'opacity 0.4s ease';
        img.style.opacity = '1';
        obs.unobserve(img);
      }
    });
  }, { threshold: 0.1 });

  imgs.forEach(img => {
    img.style.opacity = '0';
    obs.observe(img);
  });
})();

/* ============================================================
   23. NAVBAR SCROLL: body padding for fixed nav
   ============================================================ */
(function initNavSpacing() {
  const spacer = $('.nav-spacer');
  const navbar = $('.navbar');
  if (!spacer || !navbar) return;
  spacer.style.height = navbar.offsetHeight + 'px';
})();

/* ============================================================
   24. LIVE WORLD CLOCKS (Contact Prefooter)
   ============================================================ */
(function initWorldClocks() {
  function updateClocks() {
    const now = new Date();
    const formatTime = (offsetHours) => {
      const d = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (offsetHours * 3600000));
      return d.toTimeString().slice(0, 5);
    };
    const milan = document.getElementById('clock-milan');
    const paris = document.getElementById('clock-paris');
    const london = document.getElementById('clock-london');
    const ny = document.getElementById('clock-ny');
    if (milan) milan.textContent = formatTime(1);
    if (paris) paris.textContent = formatTime(1);
    if (london) london.textContent = formatTime(0);
    if (ny) ny.textContent = formatTime(-5);
  }
  updateClocks();
  setInterval(updateClocks, 30000);
})();

/* ============================================================
   CARD REDIRECT LINKS ([data-href])
   ============================================================ */
(function initCardLinks() {
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-href]');
    if (!card) return;
    // If the click target is already an interactive link or form element, let native browser action handle it
    if (e.target.closest('a, button, input, select, textarea, label')) return;
    const url = card.getAttribute('data-href');
    if (url) {
      window.location.href = url;
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = document.activeElement && document.activeElement.closest('[data-href]');
      if (card && card === document.activeElement) {
        const url = card.getAttribute('data-href');
        if (url) {
          e.preventDefault();
          window.location.href = url;
        }
      }
    }
  });
})();
