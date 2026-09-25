/* ============================================================
   SPOT — main.js
   One shared JS file for the entire site.
   All page-specific interactions guarded with existence checks.
   ============================================================ */

'use strict';

/* ─── Utility ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ═══════════════════════════════════════════════════════════
   1. THEME TOGGLE
   ═══════════════════════════════════════════════════════════ */
(function initTheme() {
  const saved = localStorage.getItem('spot-theme') || 'light';
  document.documentElement.dataset.theme = saved;

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('spot-theme', theme);
    $$('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? sunIcon() : moonIcon();
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  }

  function moonIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
  function sunIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  }

  applyTheme(saved);

  document.addEventListener('click', e => {
    const btn = e.target.closest('.theme-toggle-btn');
    if (!btn) return;
    const current = document.documentElement.dataset.theme;
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
})();

/* ═══════════════════════════════════════════════════════════
   2. RTL / LTR TOGGLE
   ═══════════════════════════════════════════════════════════ */
(function initDir() {
  const saved = localStorage.getItem('spot-dir') || 'ltr';
  applyDir(saved);

  function applyDir(dir) {
    document.documentElement.dir = dir;
    localStorage.setItem('spot-dir', dir);
    const nextDir = dir === 'rtl' ? 'ltr' : 'rtl';
    $$('.rtl-toggle-btn').forEach(btn => {
      btn.textContent = nextDir.toUpperCase();
      btn.setAttribute('aria-label', `Switch to ${nextDir.toUpperCase()} direction`);
    });
    window.dispatchEvent(new CustomEvent('dirchange', { detail: { dir } }));
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.rtl-toggle-btn');
    if (!btn) return;
    const current = document.documentElement.dir || 'ltr';
    applyDir(current === 'rtl' ? 'ltr' : 'rtl');
  });
})();

/* ═══════════════════════════════════════════════════════════
   3. MOBILE HAMBURGER DRAWER
   ═══════════════════════════════════════════════════════════ */
(function initDrawer() {
  const hamburger = $('#hamburger');
  const drawer    = $('#mobile-drawer');
  const overlay   = $('#drawer-overlay');
  const closeBtn  = $('#drawer-close');
  if (!hamburger || !drawer) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay?.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('active');
    overlay?.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  /* Drawer sub-menu toggle (Home dropdown) */
  const drawerHomeToggle = $('#drawer-home-toggle');
  const drawerSub = $('#drawer-home-sub');
  if (drawerHomeToggle && drawerSub) {
    drawerHomeToggle.addEventListener('click', e => {
      e.preventDefault();
      const open = drawerSub.classList.toggle('open');
      drawerHomeToggle.setAttribute('aria-expanded', open);
    });
  }
})();

/* ═══════════════════════════════════════════════════════════
   4. HOME DROPDOWN BEHAVIOR
   ═══════════════════════════════════════════════════════════ */
(function initDropdown() {
  const dropdowns = $$('.nav-item.has-dropdown');
  if (!dropdowns.length) return;

  dropdowns.forEach(trigger => {
    let dropTimeout = null;
    const link = trigger.querySelector('.nav-link');
    const menu = trigger.querySelector('.dropdown-menu');

    function openDrop() {
      clearTimeout(dropTimeout);
      trigger.classList.add('open');
      link?.setAttribute('aria-expanded', 'true');
    }

    function closeDrop() {
      clearTimeout(dropTimeout);
      trigger.classList.remove('open');
      link?.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('mouseenter', openDrop);
    trigger.addEventListener('mouseleave', () => {
      dropTimeout = setTimeout(closeDrop, 220);
    });

    link?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      if (trigger.classList.contains('open')) {
        closeDrop();
      } else {
        openDrop();
      }
    });

    // Ensure links inside dropdown can be clicked without suppression
    menu?.querySelectorAll('a').forEach(item => {
      item.addEventListener('click', () => {
        closeDrop();
      });
    });

    document.addEventListener('click', e => {
      if (!trigger.contains(e.target)) closeDrop();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrop();
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   5. ACTIVE NAV LINK
   ═══════════════════════════════════════════════════════════ */
(function setActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link, .dropdown-menu a, .drawer-nav-link, .drawer-sub a').forEach(a => {
    const href = a.getAttribute('href')?.split('/').pop();
    if (href === path) {
      a.classList.add('active');
      /* If inside dropdown, also mark parent */
      const parentItem = a.closest('.nav-item.has-dropdown');
      if (parentItem) {
        parentItem.querySelector('.nav-link')?.classList.add('active');
      }
    }
  });
})();

/* ═══════════════════════════════════════════════════════════
   6. SCROLL FADE-UP (IntersectionObserver)
   ═══════════════════════════════════════════════════════════ */
(function initScrollAnimations() {
  const els = $$('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 40px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════════════════════
   7. NAVBAR SCROLL SHADOW
   ═══════════════════════════════════════════════════════════ */
(function initNavShadow() {
  const nav = $('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 4px 32px rgba(0,0,0,.35)'
      : '0 2px 20px rgba(59,15,110,.35)';
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   8. HERO LOAD CLASS (triggers CSS entry animations)
   ═══════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  const heroEls = $$('[class*="hero-"]');
  heroEls.forEach(el => {
    el.classList.add('loaded');
  });
  /* Also trigger banner in-view classes */
  $$('.squeegee-sweep-banner, .gleam-pull-banner').forEach(el => el.classList.add('in-view'));
});

/* ═══════════════════════════════════════════════════════════
   9. HOME 1 — index.html SPECIFIC
   ═══════════════════════════════════════════════════════════ */

/* 9-hero. Bento Hero — Routine Preset Switcher */
(function initBentoHeroProtocolTabs() {
  const tabs = $$('.hero-bento-home .protocol-tab');
  const liveTag = $('#protocol-live-tag');
  const specTurnaround = $('#spec-turnaround');
  const specCompliance = $('#spec-compliance');
  const specAudit = $('#spec-audit');

  if (!tabs.length) return;

  const protocolData = {
    daily: {
      tag: 'Daily Routine',
      turnaround: '7 Days',
      turnaroundLabel: 'Coverage Schedule',
      compliance: '100% Eco',
      complianceLabel: 'EPA / Green Seal',
      audit: 'Every Shift',
      auditLabel: 'Supervisor QA'
    },
    deep: {
      tag: 'Decontamination Protocol',
      turnaround: 'Bi-Weekly',
      turnaroundLabel: 'Frequency',
      compliance: 'Hospital Gr.',
      complianceLabel: 'CDC / OSHA Standard',
      audit: 'ATP Swabs',
      auditLabel: 'Surface Validation'
    },
    porter: {
      tag: 'Full-Day Attendant',
      turnaround: '8 AM - 6 PM',
      turnaroundLabel: 'Continuous On-Site',
      compliance: 'Immediate',
      complianceLabel: 'Restroom Restock',
      audit: 'Hourly Log',
      auditLabel: 'Digital Touchpoint'
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const proto = tab.dataset.protocol;
      if (!proto || !protocolData[proto]) return;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const data = protocolData[proto];
      if (liveTag) {
        liveTag.textContent = data.tag;
        liveTag.style.animation = 'none';
        void liveTag.offsetWidth;
        liveTag.style.animation = 'fadeUp 0.3s ease forwards';
      }

      if (specTurnaround) specTurnaround.textContent = data.turnaround;
      if (specCompliance) specCompliance.textContent = data.compliance;
      if (specAudit) specAudit.textContent = data.audit;

      const specGrid = $('#protocol-specs');
      if (specGrid) {
        const labels = specGrid.querySelectorAll('.spec-name');
        if (labels.length >= 3) {
          labels[0].textContent = data.turnaroundLabel;
          labels[1].textContent = data.complianceLabel;
          labels[2].textContent = data.auditLabel;
        }
      }
    });
  });
})();

/* 9a. Foam Bubble Cluster — detail card pop */
(function initBubbleCluster() {
  const bubbles = $$('.service-bubble');
  const detail  = $('#bubble-detail');
  if (!bubbles.length || !detail) return;

  const data = {
    'office-cleaning':        { title: 'Office Cleaning',       desc: 'Daily, weekly or custom schedules keeping every desk, floor and surface pristine.' },
    'floor-care':             { title: 'Floor Care',             desc: 'Strip, scrub and polish hard floors; deep-clean carpets to manufacturer spec.' },
    'restroom-sanitation':    { title: 'Restroom Sanitation',   desc: 'Hospital-grade disinfection of fixtures, tiles, dispensers and grout lines.' },
    'window-washing':         { title: 'Window Washing',        desc: 'Streak-free interior and exterior glass up to multi-storey height.' },
    'trash-recycling':        { title: 'Trash & Recycling',     desc: 'Reliable waste removal and recycling separation to keep your facility compliant.' },
    'supply-restocking':      { title: 'Supply Restocking',     desc: 'Paper, soap and consumables restocked so you never run out mid-day.' },
  };

  bubbles.forEach(b => {
    b.addEventListener('click', () => {
      const key = b.dataset.service;
      const info = data[key] || {};
      detail.querySelector('.detail-title').textContent = info.title || '';
      detail.querySelector('.detail-desc').textContent  = info.desc  || '';
      detail.classList.add('active');
    });
  });

  const closeBtn = detail.querySelector('.bubble-detail-close');
  closeBtn?.addEventListener('click', () => detail.classList.remove('active'));
  document.addEventListener('click', e => {
    if (!detail.contains(e.target) && !e.target.closest('.service-bubble')) {
      detail.classList.remove('active');
    }
  });
})();

/* 9b. Clothesline — sequential light-up on scroll */
(function initClothesline() {
  const cards = $$('.clothesline-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('lit'), i * 200);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const section = $('.clothesline-section');
  if (section) observer.observe(section);
})();

/* 9c. Rising Bubbles — generate dynamically */
(function initRisingBubbles() {
  const container = $('.rising-bubbles');
  if (!container) return;

  for (let i = 0; i < 18; i++) {
    const b = document.createElement('div');
    b.className = 'rise-bubble';
    const size = 20 + Math.random() * 60;
    b.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      animation-duration:${4+Math.random()*8}s;
      animation-delay:${Math.random()*6}s;
    `;
    container.appendChild(b);
  }
})();

/* ═══════════════════════════════════════════════════════════
   10. HOME 2 — home-2.html SPECIFIC
   ═══════════════════════════════════════════════════════════ */

/* 10a. Toolkit pockets reveal on scroll */
(function initToolkitReveal() {
  const pockets = $$('.toolkit-pocket');
  if (!pockets.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        pockets.forEach((p, i) => setTimeout(() => p.classList.add('revealed'), i * 150));
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const section = $('.toolkit-section');
  if (section) obs.observe(section);
})();

/* 10b. Sponge wipe steps */
(function initSpongeWipe() {
  const stages    = $$('.sponge-stage');
  const sponge    = $('.sponge-head');
  const trail     = $('.sponge-damp-trail');
  const track     = $('.sponge-track');
  if (!stages.length || !sponge) return;

  let current = 0;

  function activateStage(idx) {
    stages.forEach((s, i) => s.classList.toggle('active', i === idx));
    if (track) {
      const pct = (idx / (stages.length - 1)) * 100;
      const trackW = track.offsetWidth;
      const spongeW = sponge.offsetWidth;
      const pos = (pct / 100) * (trackW - spongeW);
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      if (isRtl) {
        sponge.style.left = 'auto';
        sponge.style.right = pos + 'px';
        if (trail) {
          trail.style.left = 'auto';
          trail.style.right = '0px';
          trail.style.width = (pos + spongeW/2) + 'px';
        }
      } else {
        sponge.style.right = 'auto';
        sponge.style.left = pos + 'px';
        if (trail) {
          trail.style.right = 'auto';
          trail.style.left = '0px';
          trail.style.width = (pos + spongeW/2) + 'px';
        }
      }
    }
  }

  stages.forEach((s, i) => s.addEventListener('click', () => { current = i; activateStage(i); }));
  window.addEventListener('dirchange', () => activateStage(current));

  /* Auto-advance on scroll into view */
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      activateStage(0);
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  const section = $('.sponge-wipe-section');
  if (section) obs.observe(section);
})();

/* 10c. Inspection card auto-fill */
(function initInspection() {
  const checkboxes = $$('.inspection-checkbox');
  const statusBadge = $('.inspection-status-badge');
  const readings = $$('.reading-val');
  if (!checkboxes.length) return;

  const readingTargets = ['73.2°F', '99.8%', 'pH 7.2'];

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    checkboxes.forEach((cb, i) => {
      setTimeout(() => {
        cb.classList.add('checked');
        cb.innerHTML = `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="1.5,6 5,9.5 10.5,2.5"/></svg>`;
        const timeEl = cb.closest('.inspection-item')?.querySelector('.inspection-item-time');
        if (timeEl) timeEl.textContent = new Date().toLocaleTimeString();
      }, i * 600 + 400);
    });
    readings.forEach((r, i) => {
      setTimeout(() => { r.textContent = readingTargets[i] || '--'; }, i * 800 + 1800);
    });
    setTimeout(() => {
      if (statusBadge) { statusBadge.textContent = 'PASSED'; statusBadge.classList.add('passed'); }
    }, checkboxes.length * 600 + 800);
    obs.disconnect();
  }, { threshold: 0.3 });

  const section = $('.inspection-section');
  if (section) obs.observe(section);
})();

/* 10d. Sparkle Burst Canvas */
(function initSparkleBurst() {
  const canvas = $('.burst-canvas');
  if (!canvas) return;

  canvas.width  = canvas.offsetWidth  || window.innerWidth;
  canvas.height = canvas.offsetHeight || 300;

  const ctx = canvas.getContext('2d');
  const particles = [];

  function spawnParticle() {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 2,
      vy: -1 - Math.random() * 2,
      alpha: 1,
      decay: 0.012 + Math.random() * 0.015,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (particles.length < 60) spawnParticle();
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = '#C8FF00';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════════════════════════════════════
   11. SERVICES — services.html SPECIFIC
   ═══════════════════════════════════════════════════════════ */

/* 11a. Mist spray hero particles */
(function initMistSpray() {
  const hero = $('.hero-services');
  if (!hero) return;

  function spawnMist() {
    const particle = document.createElement('div');
    particle.className = 'mist-particle';
    const size = 3 + Math.random() * 8;
    const tx = (Math.random() - 0.5) * 400;
    const ty = (Math.random() - 0.5) * 300;
    particle.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      animation-duration:${0.8 + Math.random() * 1.2}s;
      --tx:${tx}px;--ty:${ty}px;
    `;
    hero.appendChild(particle);
    setTimeout(() => particle.remove(), 2000);
  }

  for (let i = 0; i < 60; i++) {
    setTimeout(spawnMist, i * 25);
  }
})();

/* 11b. Wax layer build — step click/hover */
(function initWaxBuild() {
  const steps  = $$('.wax-step');
  const layers = $$('.wax-layer');
  if (!steps.length) return;

  steps.forEach((step, i) => {
    step.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
      layers.forEach((l, li) => l.classList.toggle('active', li <= i));
    });
  });

  /* Auto-activate first step on scroll */
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { steps[0]?.click(); obs.disconnect(); }
  }, { threshold: 0.3 });
  const section = $('.wax-section');
  if (section) obs.observe(section);
})();

/* 11c. Fill-ring timer */
(function initFillRing() {
  const ring = $('.ring-fill');
  if (!ring) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { ring.classList.add('filling'); obs.disconnect(); }
  }, { threshold: 0.4 });
  const banner = $('.fill-ring-banner');
  if (banner) obs.observe(banner);
})();

/* ═══════════════════════════════════════════════════════════
   12. SERVICE DETAILS — service-details.html SPECIFIC
   ═══════════════════════════════════════════════════════════ */

/* 12a. Bubble Pop Q&A */
(function initBubblePop() {
  const bubbles = $$('.qa-bubble');
  if (!bubbles.length) return;

  bubbles.forEach(b => {
    b.addEventListener('click', () => {
      if (b.classList.contains('popped')) {
        b.classList.remove('popped');
      } else {
        bubbles.forEach(x => x.classList.remove('popped'));
        b.classList.add('popped');
        spawnPopParticles(b);
      }
    });
  });

  function spawnPopParticles(el) {
    const rect = el.getBoundingClientRect();
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      const angle = (i / 12) * Math.PI * 2;
      const dist  = 30 + Math.random() * 40;
      p.style.cssText = `
        position:fixed;width:6px;height:6px;border-radius:50%;
        background:#C8FF00;pointer-events:none;z-index:9999;
        left:${rect.left + rect.width/2}px;top:${rect.top + rect.height/2}px;
        transition:transform .5s ease,opacity .5s ease;
      `;
      document.body.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 600);
    }
  }
})();

/* 12b. Beaker fill — factor chips */
(function initDilution() {
  const chips   = $$('.factor-chip');
  const fills   = $$('.beaker-fill');
  if (!chips.length) return;

  chips.forEach((chip, i) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const selected = $$('.factor-chip.selected').length;
      fills.forEach(f => {
        f.classList.toggle('filled', selected > 0);
        f.style.height = `${Math.min(90, selected * 22)}%`;
      });
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   13. INDUSTRIES — industries.html SPECIFIC
   ═══════════════════════════════════════════════════════════ */

/* 13a. Elevator panel */
(function initElevatorPanel() {
  const btns = $$('.elevator-btn');
  if (!btns.length) return;

  const headlines = {
    offices:     'Spotless Offices, Productive Teams',
    healthcare:  'Sterile Environments, Safer Patients',
    retail:      'Pristine Showfloors, Happy Shoppers',
    education:   'Clean Campuses, Focused Learners',
    industrial:  'Safe Facilities, Compliant Operations',
    hospitality: 'Immaculate Spaces, Loyal Guests',
  };
  const heroh1 = $('.hero-industries .hero-content h1');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.industry;
      if (heroh1 && headlines[key]) heroh1.textContent = headlines[key];
    });
  });

  btns[0]?.classList.add('active');
})();

/* 13b. Wiped-clean panels on scroll */
(function initWipedPanels() {
  const panels = $$('.wiped-panel');
  if (!panels.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = panels.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('wiped'), idx * 400);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  panels.forEach(p => obs.observe(p));
})();

/* ═══════════════════════════════════════════════════════════
   14. PRICING — pricing.html SPECIFIC
   ═══════════════════════════════════════════════════════════ */

/* 14a. Compare table hover highlight */
(function initCompare() {
  const table = $('.compare-table');
  if (!table) return;

  const rows = $$('tr', table);
  rows.forEach(row => {
    const cells = $$('td', row);
    if (cells.length < 2) return;

    row.addEventListener('mouseenter', () => {
      const aVal = cells[1]?.textContent.trim();
      const bVal = cells[2]?.textContent.trim();
      if (cells[1] && cells[2]) {
        if (aVal !== bVal) {
          cells[1].classList.add('diff-highlight');
          cells[2].classList.add('diff-highlight');
        } else {
          cells[1].classList.add('diff-dim');
          cells[2].classList.add('diff-dim');
        }
      }
    });
    row.addEventListener('mouseleave', () => {
      cells.forEach(c => { c.classList.remove('diff-highlight','diff-dim'); });
    });
  });
})();

/* 14b. Shine star tiers — animate stars on scroll */
(function initShineStars() {
  const tiers = $$('.star-tier');
  if (!tiers.length) return;

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    tiers.forEach((tier, ti) => {
      const stars = $$('.shine-star', tier);
      const count = parseInt(tier.dataset.stars || '1', 10);
      stars.forEach((star, si) => {
        if (si < count) setTimeout(() => star.classList.add('lit'), ti * 200 + si * 120 + 400);
      });
    });
    obs.disconnect();
  }, { threshold: 0.3 });
  const section = $('.star-tiers-section');
  if (section) obs.observe(section);
})();

/* ═══════════════════════════════════════════════════════════
   15. BLOG — blog.html SPECIFIC
   ═══════════════════════════════════════════════════════════ */

/* 15a. Press roller reveals article sheet */
(function initPressRoller() {
  const sheet = $('.press-sheet');
  if (!sheet) return;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { sheet.classList.add('printed'); obs.disconnect(); }
  }, { threshold: 0.3 });
  const section = $('.press-roller-section');
  if (section) obs.observe(section);
})();

/* 15b. Bubble wand filter */
(function initWandFilter() {
  const wands = $$('.wand-btn');
  const cards = $$('.recipe-card');
  if (!wands.length) return;

  wands.forEach(wand => {
    wand.addEventListener('click', () => {
      wands.forEach(w => w.classList.remove('active'));
      wand.classList.add('active');
      const cat = wand.dataset.cat;
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });
})();

/* 15c. Spray subscribe */
(function initSpraySubscribe() {
  const form    = $('.spray-subscribe-form');
  const success = $('.spray-success');
  const mist    = $('.mist-overlay');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    mist?.classList.add('active');
    setTimeout(() => success?.classList.add('active'), 500);
  });
})();

/* ═══════════════════════════════════════════════════════════
   16. CONTACT — contact.html SPECIFIC
   ═══════════════════════════════════════════════════════════ */

/* 16a. Whiteboard wipe form */
(function initWhiteboardForm() {
  const form    = $('.wb-form');
  const success = $('.whiteboard-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.classList.add('wiping');
    setTimeout(() => success?.classList.add('active'), 800);
  });
})();

/* 16b. Clock face SVG — draw hours arc */
(function initClockFace() {
  const svg = $('.clock-face-svg');
  if (!svg) return;

  const now = new Date();
  const hrs = now.getHours();
  const mins = now.getMinutes();
  const totalMins = hrs * 60 + mins;

  /* Animate the hour hand to current time */
  const hourHand = svg.querySelector('.hour-hand');
  const minuteHand = svg.querySelector('.minute-hand');
  if (hourHand) {
    const hAngle = (totalMins / 720) * 360 - 90;
    hourHand.setAttribute('transform', `rotate(${hAngle}, 60, 60)`);
  }
  if (minuteHand) {
    const mAngle = (mins / 60) * 360 - 90;
    minuteHand.setAttribute('transform', `rotate(${mAngle}, 60, 60)`);
  }
})();

/* 16c. Gleam Pull Banner scroll trigger */
(function initGleamPull() {
  const banner = $('.gleam-pull-banner');
  if (!banner) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { banner.classList.add('in-view'); obs.disconnect(); }
  }, { threshold: 0.3 });
  obs.observe(banner);
})();

/* ═══════════════════════════════════════════════════════════
   17. BLOG DETAILS — blog-details.html SPECIFIC
   ═══════════════════════════════════════════════════════════ */

/* 17a. Margin notes appear on scroll */
(function initMarginNotes() {
  const notes = $$('.margin-note');
  if (!notes.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  notes.forEach(n => obs.observe(n));
})();

/* 17b. Comment sink-drop submission */
(function initSinkComments() {
  const form = $('.comment-form');
  const list = $('.comments-list');
  if (!form || !list) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nameInput = form.querySelector('[name="comment-name"]');
    const textInput = form.querySelector('[name="comment-text"]');
    const name = nameInput?.value.trim();
    const text = textInput?.value.trim();
    if (!name || !text) return;

    const entry = document.createElement('div');
    entry.className = 'comment-entry';
    entry.innerHTML = `
      <div class="comment-avatar">${name.charAt(0).toUpperCase()}</div>
      <div class="comment-bubble">
        <div class="comment-meta">
          <span class="comment-name">${escHtml(name)}</span>
          <span class="comment-time">Just now</span>
        </div>
        <p class="comment-text">${escHtml(text)}</p>
      </div>
    `;
    list.appendChild(entry);
    list.scrollTop = list.scrollHeight;
    if (nameInput) nameInput.value = '';
    if (textInput) textInput.value = '';
    spawnRipple(list);
  });

  function spawnRipple(container) {
    const r = document.createElement('div');
    r.className = 'ripple-ring';
    const size = 40;
    r.style.cssText = `width:${size}px;height:${size}px;position:relative;margin:0 auto;`;
    container.appendChild(r);
    setTimeout(() => r.remove(), 900);
  }

  function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();

/* ═══════════════════════════════════════════════════════════
   18. ABOUT — about.html SPECIFIC
   ═══════════════════════════════════════════════════════════ */

/* 18a. Brick tiles parallax-like shift on scroll */
(function initBrickTiles() {
  const tiles = $$('.brick-tile');
  if (!tiles.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tiles.forEach(t => t.classList.add('in-view'));
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });
  const section = $('.story-section');
  if (section) obs.observe(section);
})();

/* ═══════════════════════════════════════════════════════════
   19. 404 — 404.html SPECIFIC
   ═══════════════════════════════════════════════════════════ */
(function init404() {
  const spongeBtn = $('.sponge-shape');
  if (!spongeBtn) return;
  spongeBtn.addEventListener('click', () => { window.location.href = 'index.html'; });
})();

/* ═══════════════════════════════════════════════════════════
   20. SQUEEGEE SWEEP BANNER scroll trigger
   ═══════════════════════════════════════════════════════════ */
(function initSqueegeeSwpBanner() {
  const banner = $('.squeegee-sweep-banner');
  if (!banner) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { banner.classList.add('in-view'); obs.disconnect(); }
  }, { threshold: 0.3 });
  obs.observe(banner);
})();

/* ═══════════════════════════════════════════════════════════
   21. COMING SOON — email form
   ═══════════════════════════════════════════════════════════ */
(function initComingSoon() {
  const form = $('.cs-notify-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn   = form.querySelector('button');
    if (btn)   { btn.textContent = "You're on the list!"; btn.disabled = true; }
    if (input) { input.value = ''; input.disabled = true; }
  });
})();
