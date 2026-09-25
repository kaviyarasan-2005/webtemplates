/* ============================================================
   SHIP — main.js
   Common JS: theme toggle, RTL toggle, hamburger drawer,
   dropdowns, active nav links, scroll fade-up, auth demo,
   page-specific interactions (guarded by existence checks)
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────
   1. THEME TOGGLE
   ───────────────────────────────────────── */
(function initTheme() {
  const stored = localStorage.getItem('ship-theme') || 'light';
  if (stored === 'dark') document.documentElement.classList.add('dark');

  function applyThemeIcons(isDark) {
    document.querySelectorAll('[data-theme-icon]').forEach(el => {
      el.innerHTML = isDark
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    });
  }

  const isDark = document.documentElement.classList.contains('dark');
  applyThemeIcons(isDark);

  document.addEventListener('click', function(e) {
    if (e.target.closest('[data-theme-toggle]')) {
      const html = document.documentElement;
      html.classList.toggle('dark');
      const nowDark = html.classList.contains('dark');
      localStorage.setItem('ship-theme', nowDark ? 'dark' : 'light');
      applyThemeIcons(nowDark);
    }
  });
})();

/* ─────────────────────────────────────────
   2. RTL / LTR TOGGLE
   ───────────────────────────────────────── */
(function initRTL() {
  const stored = localStorage.getItem('ship-dir') || 'ltr';
  document.documentElement.setAttribute('dir', stored);

  // On dashboard pages, prevent horizontal scroll at the HTML level in RTL
  const isDashboard = document.body.classList.contains('dashboard-page');

  function applyRTLOverflow(dir) {
    if (isDashboard) {
      document.documentElement.style.overflowX = dir === 'rtl' ? 'hidden' : '';
      document.body.style.overflowX = dir === 'rtl' ? 'hidden' : '';
    }
  }
  applyRTLOverflow(stored);

  function applyRTLLabel() {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    document.querySelectorAll('[data-rtl-label]').forEach(el => {
      el.textContent = isRTL ? 'LTR' : 'RTL';
    });
  }
  applyRTLLabel();

  document.addEventListener('click', function(e) {
    if (e.target.closest('[data-rtl-toggle]')) {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', next);
      localStorage.setItem('ship-dir', next);
      applyRTLLabel();
      applyRTLOverflow(next);
    }
  });
})();

/* ─────────────────────────────────────────
   3. NAVBAR — MOBILE HAMBURGER DRAWER
   ───────────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('navHamburger');
  const drawer    = document.getElementById('navDrawer');
  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', function() {
    const open = hamburger.classList.toggle('open');
    drawer.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // close on outside click
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !drawer.contains(e.target)) {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // drawer sub-menu toggles
  drawer.querySelectorAll('[data-drawer-toggle]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.getElementById(btn.dataset.drawerToggle);
      if (target) target.classList.toggle('open');
    });
  });
})();

/* ─────────────────────────────────────────
   4. DESKTOP DROPDOWNS
   ───────────────────────────────────────── */
(function initDropdowns() {
  const items = document.querySelectorAll('.nav-item-dropdown');
  if (!items.length) return;

  items.forEach(item => {
    const toggle = item.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const wasOpen = item.classList.contains('open');
      // close all dropdowns
      items.forEach(i => {
        i.classList.remove('open');
        const t = i.querySelector('.nav-dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    // close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        items.forEach(i => {
          i.classList.remove('open');
          const t = i.querySelector('.nav-dropdown-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
      }
    });
  });

  // close on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-item-dropdown')) {
      items.forEach(i => {
        i.classList.remove('open');
        const t = i.querySelector('.nav-dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });
})();

/* ─────────────────────────────────────────
   5. ACTIVE NAV LINK HIGHLIGHTING
   ───────────────────────────────────────── */
(function initActiveLinks() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-dropdown a, .nav-drawer-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === page || href === './' + page)) {
      a.classList.add('active');
    }
  });
  if (page === 'index.html' || page === 'home-2.html' || page === '') {
    const homeToggle = document.querySelector('.nav-item-dropdown .nav-dropdown-toggle');
    if (homeToggle) homeToggle.classList.add('active');
  }
})();

/* ─────────────────────────────────────────
   6. SCROLL FADE-UP — IntersectionObserver
   ───────────────────────────────────────── */
(function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
})();

/* ─────────────────────────────────────────
   7. HERO INTERACTIONS — Home 1 & Home 2
   ───────────────────────────────────────── */

/* ── Home 1: Multimodal Freight Command Center ── */
let currentH1Mode = 'ocean';

window.switchH1Mode = function(btn, mode) {
  currentH1Mode = mode;
  document.querySelectorAll('.h1-mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  window.calcH1Route();
};

window.calcH1Route = function() {
  const originEl = document.getElementById('h1OriginSelect');
  const destEl = document.getElementById('h1DestSelect');
  const transitVal = document.getElementById('h1TransitVal');
  const distanceVal = document.getElementById('h1DistanceVal');
  const carbonVal = document.getElementById('h1CarbonVal');
  const corridorEl = document.getElementById('h1CarrierCorridor');

  if (!originEl || !destEl || !transitVal) return;

  const o = originEl.value;
  const d = destEl.value;

  if (corridorEl) {
    corridorEl.textContent = `${o} (${originEl.options[originEl.selectedIndex].text.split('—')[1]?.trim() || o}) ➔ ${d} (${destEl.options[destEl.selectedIndex].text.split('—')[1]?.trim() || d})`;
  }

  // Calculate based on mode & ports
  if (currentH1Mode === 'air') {
    transitVal.textContent = (o === d) ? '24 Hours (Express Shuttle)' : '2 - 3 Days (Direct Priority Flight)';
    if (distanceVal) distanceVal.textContent = '9,840 km (Great Circle Track)';
    if (carbonVal) { carbonVal.textContent = 'SAF 30% Blend (B-Rating)'; carbonVal.style.color = '#60A5FA'; }
  } else if (currentH1Mode === 'rail') {
    transitVal.textContent = '14 - 16 Days (Trans-Eurasian Block)';
    if (distanceVal) distanceVal.textContent = '11,280 km (Continental Corridor)';
    if (carbonVal) { carbonVal.textContent = 'Electric Traction (A+ Rating)'; carbonVal.style.color = '#4ADE80'; }
  } else {
    // Ocean
    if (o === 'CNSHA' && d === 'USLAX') {
      transitVal.textContent = '14 Days (Trans-Pacific Direct)';
      if (distanceVal) distanceVal.textContent = '5,820 Nautical Miles';
    } else if (o === 'SGSIN' && d === 'NLRTM') {
      transitVal.textContent = '18 Days (Direct Berth Priority)';
      if (distanceVal) distanceVal.textContent = '8,420 Nautical Miles';
    } else {
      transitVal.textContent = '22 Days (Direct Berth)';
      if (distanceVal) distanceVal.textContent = '10,540 Nautical Miles';
    }
    if (carbonVal) { carbonVal.textContent = 'IMO Tier III (A-Rating)'; carbonVal.style.color = '#4ADE80'; }
  }
};

const h1CarrierData = {
  vessel: {
    title: 'MV PACIFIC CARRIER',
    corridor: 'CNSHA (SHANGHAI) ➔ NLRTM (ROTTERDAM)',
    imo: '9824419 • SGP',
    leg: 'LEG 3 OF 5 • 68% COMPLETED',
    fill: '68%',
    nodes: ['Shanghai', 'Singapore', 'Malacca', 'Suez', 'Rotterdam'],
    speed: '22.4 KTS',
    draft: '274° / 15.1m',
    teu: '18,450 TEU',
    sea: 'Beaufort 3',
    manifest: '[BILL #SH-9924-X]: Semiconductor Fab Modules • 40ft High Cube • Customs Pre-Cleared • ETA Rotterdam 14:00 UTC'
  },
  flight: {
    title: 'FLIGHT SH-809 (BOEING 777F)',
    corridor: 'PVG (SHANGHAI) ➔ AMS (SCHIPHOL)',
    imo: 'ICAO: SH809 • B777F',
    leg: 'LEG 2 OF 4 • 54% EN ROUTE',
    fill: '54%',
    nodes: ['PVG Hub', 'Almaty', 'Black Sea', 'Frankfurt', 'Schiphol'],
    speed: '492 KTS',
    draft: 'FL360 / 36,000ft',
    teu: '104 Tonnes',
    sea: 'Smooth Air',
    manifest: '[AWB #SH-7714-A]: Temperature-Sensitive Biopharma (Cold Chain 4°C) • Priority Clearance Guaranteed'
  },
  rail: {
    title: 'EURASIAN EXPRESS #TX-401',
    corridor: 'CHENGDU ➔ DUISBURG TERMINAL',
    imo: 'RAIL-ID: EUX-4012',
    leg: 'LEG 4 OF 6 • 72% IN TRANSIT',
    fill: '72%',
    nodes: ['Chengdu', 'Alashankou', 'Dostyk', 'Brest', 'Duisburg'],
    speed: '85 KM/H',
    draft: 'Track 1435mm',
    teu: '54 FEU',
    sea: 'Clear Track',
    manifest: '[CIM #SH-3320-R]: Automotive Electronic Harness Assemblies • Bonded Rail Transit • In-Transit GPS Active'
  }
};

window.switchH1Carrier = function(type) {
  const data = h1CarrierData[type];
  if (!data) return;

  document.querySelectorAll('.h1-carrier-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-carrier') === type);
  });

  const tTitle = document.getElementById('h1CarrierTitle');
  const tCorridor = document.getElementById('h1CarrierCorridor');
  const tImo = document.getElementById('h1CarrierImo');
  const tLeg = document.getElementById('h1LegProgress');
  const tFill = document.getElementById('h1WayTrackFill');
  const tSpeed = document.getElementById('h1TeleSpeed');
  const tDraft = document.getElementById('h1TeleDraft');
  const tTeu = document.getElementById('h1TeleTeu');
  const tSea = document.getElementById('h1TeleWeather');
  const tManifest = document.getElementById('h1ManifestTickerText');

  if (tTitle) tTitle.textContent = data.title;
  if (tCorridor) tCorridor.textContent = data.corridor;
  if (tImo) tImo.textContent = data.imo;
  if (tLeg) tLeg.textContent = data.leg;
  if (tFill) tFill.style.width = data.fill;
  if (tSpeed) tSpeed.textContent = data.speed;
  if (tDraft) tDraft.textContent = data.draft;
  if (tTeu) tTeu.textContent = data.teu;
  if (tSea) tSea.textContent = data.sea;
  if (tManifest) tManifest.textContent = data.manifest;

  for (let i = 1; i <= 5; i++) {
    const nodeEl = document.getElementById('h1Node' + i);
    if (nodeEl && data.nodes[i - 1]) {
      nodeEl.textContent = data.nodes[i - 1];
    }
  }
};

window.triggerH1AisPing = function() {
  const statusEl = document.getElementById('h1AisStatusText');
  if (!statusEl) return;
  statusEl.textContent = 'PINGING AIS TRANSPONDER...';
  statusEl.style.color = '#F59E0B';
  setTimeout(() => {
    statusEl.textContent = 'ECHO CONFIRMED (0.014s)';
    statusEl.style.color = '#4ADE80';
    setTimeout(() => {
      statusEl.textContent = 'LIVE AIS ACTIVE';
    }, 2500);
  }, 400);
};

/* ── Home 2: E-Commerce Velocity Matrix ── */
let currentH2Pkg = 'poly';

const h2PkgRates = {
  poly: { price: 6.80, code: 'SHIP-EXP-9924', sla: '✓ 24-48 HOURS GUARANTEED DOOR-TO-DOOR', duty: 'DDP Pre-Calculated (Zero Dwell)' },
  box: { price: 14.50, code: 'SHIP-BOX-8812', sla: '✓ 48 HOURS DOOR-TO-DOOR EXPRESS', duty: 'Customs Pre-Screened & Cleared' },
  pallet: { price: 48.00, code: 'SHIP-PLT-4401', sla: '✓ 3-5 DAYS PRIORITY FREIGHT INJECTION', duty: 'Commercial Invoice Pre-Filed' }
};

window.switchH2Package = function(btn, pkg) {
  currentH2Pkg = pkg;
  document.querySelectorAll('.h2-pkg-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  window.calcH2Rate();
};

window.calcH2Rate = function() {
  const destEl = document.getElementById('h2DestSelect');
  const codeEl = document.getElementById('h2LabelCode');
  const priceEl = document.getElementById('h2LabelPrice');
  const slaEl = document.getElementById('h2LabelSla');
  const dutyEl = document.getElementById('h2LabelDuty');

  if (!destEl || !priceEl) return;
  const dest = destEl.value;
  const base = h2PkgRates[currentH2Pkg] || h2PkgRates.poly;

  let mult = 1.0;
  if (dest === 'EU') mult = 1.15;
  if (dest === 'UK') mult = 1.10;
  if (dest === 'APAC') mult = 1.25;

  const finalPrice = (base.price * mult).toFixed(2);
  priceEl.innerHTML = `$${finalPrice} <span style="font-size:.8rem; font-weight:400; color:#666;">USD</span>`;
  if (codeEl) codeEl.textContent = `${base.code}-${dest}`;
  if (slaEl) slaEl.textContent = base.sla;
  if (dutyEl) dutyEl.textContent = base.duty;
};

window.runH2FulfillmentSim = function() {
  const btn = document.getElementById('h2SimBtn');
  const s1 = document.getElementById('h2Step1');
  const s2 = document.getElementById('h2Step2');
  const s3 = document.getElementById('h2Step3');
  const s4 = document.getElementById('h2Step4');
  const feed = document.getElementById('h2FeedContainer');

  if (!btn || !s1 || !s2 || !s3 || !s4) return;

  btn.disabled = true;
  btn.innerHTML = `<span class="h2-dot" style="display:inline-block;margin-right:8px;"></span> Ingesting Test Order ORD-${Math.floor(1000 + Math.random() * 9000)}...`;

  // Step progression animation
  s1.className = 'h2-step active';
  s2.className = 'h2-step';
  s3.className = 'h2-step';
  s4.className = 'h2-step';

  setTimeout(() => {
    s1.className = 'h2-step completed';
    s2.className = 'h2-step active';

    setTimeout(() => {
      s2.className = 'h2-step completed';
      s3.className = 'h2-step active';

      setTimeout(() => {
        s3.className = 'h2-step completed';
        s4.className = 'h2-step active';

        setTimeout(() => {
          s4.className = 'h2-step completed';
          btn.disabled = false;
          btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg> Simulate Live Order Ingestion`;

          if (feed) {
            const newItem = document.createElement('div');
            newItem.className = 'h2-feed-item';
            newItem.innerHTML = `<span>✓ ORD #${Math.floor(1000 + Math.random() * 9000)} • Changi ➔ Frankfurt</span><span style="color:#4ADE80;">Tarmac Injected</span>`;
            feed.insertBefore(newItem, feed.firstChild);
            if (feed.children.length > 4) feed.removeChild(feed.lastChild);
          }
        }, 350);
      }, 350);
    }, 350);
  }, 300);
};

/* ─────────────────────────────────────────
   8. CAPSTAN CHAIN PROCESS — Home 1
   ───────────────────────────────────────── */
(function initCapstan() {
  const items = document.querySelectorAll('.chain-link-item');
  if (!items.length) return;

  let current = 0;
  function advance() {
    items.forEach((item, i) => item.classList.toggle('active', i <= current));
    current = (current + 1) % items.length;
  }
  advance();
  setInterval(advance, 1800);
})();

/* ─────────────────────────────────────────
   9. COUNTDOWN TIMER — Home 2
   ───────────────────────────────────────── */
(function initCountdown() {
  const el = document.getElementById('dispatchCountdown');
  if (!el) return;

  let total = 5 * 3600 - 1; // 4:59:59
  function tick() {
    const h = String(Math.floor(total / 3600)).padStart(2, '0');
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
    if (total > 0) { total--; setTimeout(tick, 1000); }
    else { total = 5 * 3600 - 1; setTimeout(tick, 1000); }
  }
  tick();
})();

/* ─────────────────────────────────────────
   9b. SORT CHUTE DIAGRAM — Home 2
   ───────────────────────────────────────── */
(function initSortChute() {
  const diagram = document.querySelector('.chute-diagram');
  if (!diagram) return;
  const items = diagram.querySelectorAll('.chute-item');
  if (!items.length) return;

  const revealItems = () => {
    items.forEach((item, idx) => {
      setTimeout(() => {
        item.classList.add('visible');
      }, idx * 90);
    });
  };

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          revealItems();
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    obs.observe(diagram);
  } else {
    revealItems();
  }
})();

/* ─────────────────────────────────────────
   10. ZONE GAUGE — Home 2
   ───────────────────────────────────────── */
(function initZoneGauges() {
  const rows = document.querySelectorAll('.zone-row');
  if (!rows.length) return;

  const heights = ['40%', '55%', '65%', '78%', '90%'];
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector('.zone-gauge-fill');
        const idx = [...rows].indexOf(e.target);
        if (fill) setTimeout(() => { fill.style.height = heights[idx] || '50%'; }, idx * 150);
      }
    });
  }, { threshold: 0.3 });

  rows.forEach(r => obs.observe(r));
})();

/* ─────────────────────────────────────────
   11. REVERSE LOOP DIAGRAM — Home 2
   ───────────────────────────────────────── */
(function initReverseLoop() {
  const stages = document.querySelectorAll('[data-loop-stage]');
  if (!stages.length) return;

  stages.forEach(s => {
    s.addEventListener('click', function() {
      const card = document.getElementById('loopStageCard');
      if (!card) return;
      card.querySelector('h4').textContent = s.dataset.stageName || '';
      card.querySelector('p').textContent  = s.dataset.stageDesc || '';
      card.style.display = 'block';
    });
  });
})();

/* ─────────────────────────────────────────
   12. SOUNDING CHART PATH — About
   ───────────────────────────────────────── */
(function initSoundingChart() {
  const svg = document.getElementById('soundingSvg');
  if (!svg) return;

  const path = svg.querySelector('.sounding-path');
  if (!path) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      path.classList.add('drawn');
      obs.disconnect();
    }
  }, { threshold: 0.3 });

  obs.observe(svg);
})();

/* ─────────────────────────────────────────
   13. TELEGRAPH SELECTOR — Services
   ───────────────────────────────────────── */
(function initTelegraph() {
  const items = document.querySelectorAll('[data-telegraph]');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('click', function() {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const panel = document.getElementById('telegraphPanel');
      if (!panel) return;
      panel.querySelector('h3').textContent = item.dataset.name || '';
      panel.querySelector('p').textContent  = item.dataset.desc || '';
      const featWrap = panel.querySelector('.telegraph-features');
      if (featWrap && item.dataset.features) {
        featWrap.innerHTML = item.dataset.features.split('|').map(f =>
          `<div class="telegraph-feature"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>${f}</span></div>`
        ).join('');
      }
    });
  });

  // activate first
  if (items[0]) items[0].click();
})();

/* ─────────────────────────────────────────
   14. WAYPOINT / PASSAGE PLAN — Services
   ───────────────────────────────────────── */
(function initWaypoints() {
  const dots = document.querySelectorAll('.waypoint-dot');
  if (!dots.length) return;

  dots.forEach(dot => {
    dot.addEventListener('click', function() {
      dots.forEach(d => { d.classList.remove('active'); const c = d.closest('.waypoint').querySelector('.waypoint-card'); if (c) c.classList.remove('open'); });
      dot.classList.add('active');
      const card = dot.closest('.waypoint').querySelector('.waypoint-card');
      if (card) card.classList.add('open');
    });
  });
})();

/* ─────────────────────────────────────────
   15. RADIO Q&A — Service Details
   ───────────────────────────────────────── */
(function initRadioQA() {
  const cards = document.querySelectorAll('.radio-q-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const btn = card.querySelector('.radio-tune-btn');
    if (!btn) return;
    btn.addEventListener('click', function() {
      const isOpen = card.classList.toggle('open');
      btn.textContent = isOpen ? 'Over & Out' : 'Tune In';
    });
  });
})();

/* ─────────────────────────────────────────
   16. TRACKING — Track page
   ───────────────────────────────────────── */
(function initTracking() {
  const form  = document.getElementById('trackForm');
  const input = document.getElementById('trackInput');
  if (!form || !input) return;

  const demoShipments = {
    'SHP-001': {
      route: 'Shanghai → Los Angeles',
      status: 'In Transit',
      progress: 60,
      mode: 'Sea',
      lat: 'LAT: 28.4210° N',
      lon: 'LON: 168.1925° W',
      speed: '18.4 kn',
      eta: '3 days 14 hrs',
      zone: 'PACIFIC BASIN · IN TRANSIT',
      routeId: 'mapRouteShp001',
      pillClass: 'pill-success'
    },
    'SHP-002': {
      route: 'Dubai → Rotterdam',
      status: 'Customs',
      progress: 80,
      mode: 'Air',
      lat: 'LAT: 37.2140° N',
      lon: 'LON: 28.5320° E',
      speed: '490 kn',
      eta: '4 hrs 20 mins',
      zone: 'MEDITERRANEAN CORRIDOR · CUSTOMS CLEARANCE',
      routeId: 'mapRouteShp002',
      pillClass: 'pill-warning'
    },
    'SHP-003': {
      route: 'New York → São Paulo',
      status: 'Delivered',
      progress: 100,
      mode: 'Air',
      lat: 'LAT: 23.4356° S',
      lon: 'LON: 46.4731° W',
      speed: '0.0 kn (Arrived)',
      eta: 'Delivered (POD Signed)',
      zone: 'GRU AIR CARGO HUB · COMPLETED',
      routeId: 'mapRouteShp003',
      pillClass: 'pill-success'
    },
    'DEFAULT': {
      route: 'Shanghai → Los Angeles',
      status: 'In Transit',
      progress: 60,
      mode: 'Sea',
      lat: 'LAT: 28.4210° N',
      lon: 'LON: 168.1925° W',
      speed: '18.4 kn',
      eta: '3 days 14 hrs',
      zone: 'PACIFIC BASIN · IN TRANSIT',
      routeId: 'mapRouteShp001',
      pillClass: 'pill-success'
    }
  };

  function updateActiveShipment(data) {
    const routeEl = document.getElementById('trackRoute');
    const statusEl = document.getElementById('trackStatus');
    const latEl = document.getElementById('coordLat');
    const lonEl = document.getElementById('coordLon');
    const speedEl = document.getElementById('trackSpeed');
    const etaEl = document.getElementById('trackETA');
    const zoneTitle = document.getElementById('svgMapZoneTitle');

    if (routeEl) routeEl.textContent = 'Route: ' + data.route;
    if (statusEl) {
      statusEl.textContent = data.status;
      statusEl.className = 'pill ' + (data.pillClass || 'pill-success');
    }
    if (latEl && data.lat) latEl.textContent = data.lat;
    if (lonEl && data.lon) lonEl.textContent = data.lon;
    if (speedEl && data.speed) speedEl.textContent = data.speed;
    if (etaEl && data.eta) etaEl.textContent = data.eta;
    if (zoneTitle && data.zone) zoneTitle.textContent = data.zone;

    // Switch SVG active route group
    ['mapRouteShp001', 'mapRouteShp002', 'mapRouteShp003'].forEach(rId => {
      const g = document.getElementById(rId);
      if (g) {
        if (g.id === data.routeId) {
          g.style.display = 'inline';
        } else {
          g.style.display = 'none';
        }
      }
    });

    // Update progress fills
    document.querySelectorAll('.shipment-progress-fill').forEach(f => {
      f.style.width = data.progress + '%';
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const ref = input.value.trim().toUpperCase() || 'DEFAULT';
    const data = demoShipments[ref] || demoShipments['DEFAULT'];

    // Animate console lights
    const lights = document.querySelectorAll('.status-light');
    lights.forEach((l, i) => setTimeout(() => l.classList.add('green'), i * 200));

    // Highlight card if matched
    document.querySelectorAll('.shipment-card').forEach(c => {
      if (c.dataset.ref === ref) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });

    updateActiveShipment(data);
  });

  // Shipment card clicks
  document.querySelectorAll('.shipment-card').forEach(card => {
    card.addEventListener('click', function() {
      document.querySelectorAll('.shipment-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const ref = card.dataset.ref || 'DEFAULT';
      const data = demoShipments[ref] || demoShipments['DEFAULT'];
      if (input) input.value = ref;
      updateActiveShipment(data);
    });
  });
})();

/* ─────────────────────────────────────────
   17. TIDE GAUGES — Pricing
   ───────────────────────────────────────── */
(function initTideGauges() {
  const fills = document.querySelectorAll('.tide-fill');
  if (!fills.length) return;

  const targets = ['35%', '62%', '88%'];
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      fills.forEach((f, i) => {
        setTimeout(() => { f.style.height = targets[i] || '50%'; }, i * 250);
      });
      obs.disconnect();
    }
  }, { threshold: 0.3 });

  const section = fills[0].closest('section');
  if (section) obs.observe(section);
})();

/* ─────────────────────────────────────────
   18. FREQUENCY DIAL — Blog
   ───────────────────────────────────────── */
(function initFreqDial() {
  const btns = document.querySelectorAll('.freq-band-btn');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', function() {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      const cards = document.querySelectorAll('.blog-card');
      cards.forEach(c => {
        const match = !cat || c.dataset.cat === cat;
        c.style.display = match ? '' : 'none';
      });

      // rotate needle on SVG
      const needle = document.getElementById('freqNeedle');
      if (needle) {
        const idx = [...btns].indexOf(btn);
        const deg = -60 + idx * 40;
        needle.setAttribute('transform', `rotate(${deg}, 120, 120)`);
      }
    });
  });
})();

/* ─────────────────────────────────────────
   19. BLOG FILTER — Blog page
   ───────────────────────────────────────── */
(function initBlogFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.blog-card').forEach(c => {
        c.style.display = (!cat || c.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
})();

/* ─────────────────────────────────────────
   20. SIGNAL BOOSTER SUBSCRIBE — Blog
   ───────────────────────────────────────── */
(function initSignalBooster() {
  const input   = document.getElementById('subscribeInput');
  const confirm = document.getElementById('subscribeConfirm');
  const form    = document.getElementById('subscribeForm');
  if (!input) return;

  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  input.addEventListener('input', function() {
    const bars = document.querySelectorAll('.s-bar');
    const valid = isValidEmail(input.value);
    const len = Math.min(input.value.length, 20);
    const lit = Math.round(len / 4);
    bars.forEach((b, i) => b.classList.toggle('active', i < lit));
    if (valid) bars.forEach(b => b.classList.add('active'));
  });

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!isValidEmail(input.value)) return;
      document.querySelectorAll('.s-bar').forEach(b => b.classList.add('active'));
      if (confirm) { confirm.textContent = 'Transmission Received. Welcome aboard.'; confirm.style.display = 'block'; }
      input.value = '';
    });
  }
})();

/* ─────────────────────────────────────────
   21. MORSE READING PROGRESS — Blog Details
   ───────────────────────────────────────── */
(function initMorseProgress() {
  const fill = document.getElementById('morseProgressFill');
  if (!fill) return;

  window.addEventListener('scroll', function() {
    const scrollTop  = document.documentElement.scrollTop;
    const scrollH    = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollH > 0 ? (scrollTop / scrollH) * 100 : 0;
    fill.style.width = pct + '%';
  });
})();

/* ─────────────────────────────────────────
   22. COMMENT FORM — Blog Details
   ───────────────────────────────────────── */
(function initCommentForm() {
  const form = document.getElementById('commentForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const confirm = document.getElementById('commentConfirm');
    if (confirm) { confirm.style.display = 'block'; }
    form.reset();
  });
})();

/* ─────────────────────────────────────────
   23. BOOKING FORM — Contact
   ───────────────────────────────────────── */
(function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  function validate(el) {
    const group = el.closest('.form-group');
    if (!group) return true;
    if (el.required && !el.value.trim()) { group.classList.add('has-error'); return false; }
    group.classList.remove('has-error');
    return true;
  }

  form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(el => {
    el.addEventListener('blur', () => validate(el));
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(el => { if (!validate(el)) valid = false; });
    if (!valid) return;

    const ref = 'SHP-2026-' + Math.floor(1000 + Math.random() * 9000);
    const confirm = document.getElementById('bookingConfirm');
    const refEl   = document.getElementById('bookingRefGen');
    if (confirm) confirm.style.display = 'block';
    if (refEl)   refEl.textContent = ref;
    form.reset();
  });
})();

/* ─────────────────────────────────────────
   24. WATCH BILL — Contact
   ───────────────────────────────────────── */
(function initWatchBill() {
  const rows = document.querySelectorAll('.watch-row');
  if (!rows.length) return;

  const now = new Date();
  const hour = now.getHours();
  const watches = [
    { start: 0,  end: 6  },
    { start: 6,  end: 12 },
    { start: 12, end: 18 },
    { start: 18, end: 24 },
  ];

  rows.forEach((row, i) => {
    const w = watches[i];
    if (w && hour >= w.start && hour < w.end) {
      row.classList.add('current');
      const badge = row.querySelector('.on-watch-badge');
      if (badge) badge.style.display = 'inline-flex';
    } else {
      const badge = row.querySelector('.on-watch-badge');
      if (badge) badge.style.display = 'none';
    }
  });
})();

/* ─────────────────────────────────────────
   25. AUTH PAGE — login.html
   ───────────────────────────────────────── */
(function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const roleBtns = document.querySelectorAll('.role-btn');
  let role = 'client';

  roleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      role = btn.dataset.role;
    });
  });

  function validate(el) {
    const group = el.closest('.form-group');
    if (!group) return true;
    if (el.required && !el.value.trim()) { group.classList.add('has-error'); return false; }
    if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) { group.classList.add('has-error'); return false; }
    group.classList.remove('has-error');
    return true;
  }

  form.querySelectorAll('input').forEach(el => el.addEventListener('blur', () => validate(el)));

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(el => { if (!validate(el)) valid = false; });
    if (!valid) return;
    window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
  });
})();

/* ─────────────────────────────────────────
   26. AUTH PAGE — signup.html
   ───────────────────────────────────────── */
(function initSignup() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  function validate(el) {
    const group = el.closest('.form-group');
    if (!group) return true;
    if (el.required && !el.value.trim()) { group.classList.add('has-error'); return false; }
    if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) { group.classList.add('has-error'); return false; }
    if (el.id === 'confirmPassword') {
      const pw = document.getElementById('signupPassword');
      if (pw && el.value !== pw.value) { group.classList.add('has-error'); return false; }
    }
    group.classList.remove('has-error');
    return true;
  }

  form.querySelectorAll('input').forEach(el => el.addEventListener('blur', () => validate(el)));

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(el => { if (!validate(el)) valid = false; });
    const terms = document.getElementById('termsCheck');
    if (terms && !terms.checked) { valid = false; }
    if (!valid) return;
    window.location.href = 'user-dashboard.html';
  });
})();

/* ─────────────────────────────────────────
   27. COVERAGE MAP — Home 1
   ───────────────────────────────────────── */
(function initCoverageMap() {
  const regions = document.querySelectorAll('.coverage-region');
  if (!regions.length) return;

  const panel = document.getElementById('coveragePanel');
  const regionData = {
    'asia':   { name: 'Asia Pacific', lanes: '48 active lanes', partners: '180+ partners', transit: '12–28 days avg.' },
    'europe': { name: 'Europe',       lanes: '36 active lanes', partners: '140+ partners', transit: '8–18 days avg.' },
    'america':{ name: 'Americas',     lanes: '30 active lanes', partners: '95+ partners',  transit: '14–32 days avg.' },
    'africa': { name: 'Africa & ME',  lanes: '22 active lanes', partners: '65+ partners',  transit: '18–40 days avg.' },
  };

  regions.forEach(r => {
    r.addEventListener('mouseenter', function() {
      const data = regionData[r.dataset.region];
      if (!panel || !data) return;
      panel.querySelector('h4').textContent  = data.name;
      panel.querySelector('[data-lanes]').textContent   = data.lanes;
      panel.querySelector('[data-partners]').textContent = data.partners;
      panel.querySelector('[data-transit]').textContent  = data.transit;
      panel.style.opacity = '1';
    });
  });
})();

/* ─────────────────────────────────────────
   28. ALERT WATCH PANEL — Track
   ───────────────────────────────────────── */
(function initAlertWatch() {
  const btn = document.getElementById('setWatchBtn');
  if (!btn) return;

  btn.addEventListener('click', function() {
    btn.textContent = 'Watch Set';
    btn.disabled = true;
    btn.style.opacity = '0.6';
    const conf = document.getElementById('watchConfirm');
    if (conf) { conf.style.display = 'block'; }
  });
})();

/* ─────────────────────────────────────────
   29. GAUGE NEEDLE ANIMATION — Pricing Hero
   ───────────────────────────────────────── */
(function initGaugeNeedles() {
  const needles = document.querySelectorAll('[data-gauge-needle]');
  if (!needles.length) return;

  const targets = [75, 85, 92]; // degrees from -90
  setTimeout(() => {
    needles.forEach((needle, i) => {
      const deg = -90 + (targets[i] || 70) * 1.8;
      needle.style.transform = `rotate(${deg}deg)`;
    });
  }, 600);
})();

/* ─────────────────────────────────────────
   30. CONTACT — Channel Preset scroll
   ───────────────────────────────────────── */
(function initChannelResponseBanner() {
  const cta = document.getElementById('openChannelCTA');
  if (!cta) return;
  cta.addEventListener('click', function(e) {
    e.preventDefault();
    const form = document.getElementById('bookingFormSection');
    if (form) form.scrollIntoView({ behavior: 'smooth' });
  });
})();

/* ─────────────────────────────────────────
   31. COMING SOON NOTIFY FORM
   ───────────────────────────────────────── */
(function initNotifyForm() {
  const form = document.getElementById('notifyForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = form.querySelector('button');
    if (btn) { btn.textContent = 'Registered'; btn.disabled = true; }
  });
})();

/* ─────────────────────────────────────────
   32. GLOBAL: resize handler for canvas elements
   ───────────────────────────────────────── */
window.addEventListener('resize', function() {
  document.querySelectorAll('canvas[data-resize]').forEach(c => {
    c.width  = c.offsetWidth;
    c.height = c.offsetHeight;
  });
});
