'use strict';

/* =============================================================
   SCOOP ICE CREAM PARLOUR — animations.js
   Scroll reveal, parallax, floating scoops, sprinkles,
   hero sequences, page load, and countdown timer.
   ============================================================= */

// ============================================================
// REDUCED MOTION CHECK
// Respect user's OS-level preference throughout this file.
// ============================================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================================
// SCROLL REVEAL (Intersection Observer)
// Classes: .reveal | .reveal-left | .reveal-right
// Parent: .stagger-children auto-adds .reveal to each child
//         with staggered transitionDelay.
// ============================================================
const ScrollReveal = {
  observer: null,

  init() {
    const options = {
      threshold:  0.10,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        this.observer.unobserve(entry.target);
      });
    }, options);

    // Auto-stagger children of .stagger-children containers
    document.querySelectorAll('.stagger-children').forEach(parent => {
      Array.from(parent.children).forEach((child, i) => {
        child.classList.add('reveal');
        child.style.transitionDelay = `${i * 0.10}s`;
      });
    });

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      this.observer.observe(el);
    });
  }
};

// ============================================================
// PARALLAX BACKGROUND
// Add data-parallax="0.3" to any element to give it parallax.
// Skipped on mobile and when reduced-motion is requested.
// ============================================================
const Parallax = {
  elements: [],
  ticking:  false,

  init() {
    if (prefersReducedMotion) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    this.elements = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!this.elements.length) return;

    window.addEventListener('scroll', () => this._requestTick(), { passive: true });
    this._update();
  },

  _requestTick() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this._update();
        this.ticking = false;
      });
      this.ticking = true;
    }
  },

  _update() {
    const scrollY = window.scrollY;
    this.elements.forEach(el => {
      const rate = parseFloat(el.dataset.parallax) || 0.30;
      el.style.transform = `translateY(${scrollY * rate}px)`;
    });
  }
};

// ============================================================
// FLOATING SCOOPS GENERATOR
// Inserts SVG scoops into .floating-scoops-container elements.
// ============================================================
const FloatingScoops = {
  colors: ['#F4A261', '#2A9D8F', '#E76F51', '#264653'],
  coneColor: '#DEB887',

  init() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.floating-scoops-container').forEach(container => {
      for (let i = 0; i < 4; i++) {
        const scoop = document.createElement('div');
        scoop.className = 'floating-scoop';
        scoop.innerHTML = this._getSVG(i);
        scoop.setAttribute('aria-hidden', 'true');

        const size = 60 + i * 20;
        const top  = 15 + i * 18;
        const side = 5 + i * 8;
        const isLeft = i % 2 === 0;

        scoop.style.cssText = `
          position: absolute;
          width: ${size}px;
          top: ${top}%;
          ${isLeft ? 'left' : 'right'}: ${side}%;
          animation-delay: ${i * 0.7}s;
          pointer-events: none;
        `;

        container.appendChild(scoop);
      }
    });
  },

  _getSVG(index) {
    const c = this.colors[index % this.colors.length];
    return `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M40 60 L25 95 L55 95 Z" fill="${this.coneColor}"/>
      <line x1="40" y1="60" x2="32" y2="95" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
      <line x1="40" y1="60" x2="48" y2="95" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
      <circle cx="40" cy="40" r="28" fill="${c}"/>
      <circle cx="30" cy="32" r="7" fill="rgba(255,255,255,0.20)"/>
      <circle cx="46" cy="46" r="4" fill="rgba(255,255,255,0.10)"/>
    </svg>`;
  }
};

// ============================================================
// SPRINKLES GENERATOR
// Inserts coloured confetti sprinkles into .sprinkle-container
// ============================================================
const Sprinkles = {
  colors: ['#F4A261', '#2A9D8F', '#E76F51', '#264653', '#FFC107', '#9C27B0', '#E91E63'],

  init() {
    if (prefersReducedMotion) return;

    document.querySelectorAll('.sprinkle-container').forEach(container => {
      for (let i = 0; i < 10; i++) {
        const el = document.createElement('div');
        el.className = 'sprinkle';
        el.setAttribute('aria-hidden', 'true');
        el.style.cssText = `
          background:   ${this.colors[i % this.colors.length]};
          left:         ${5 + i * 9}%;
          top:          ${15 + (i % 4) * 20}%;
          transform:    rotate(${i * 37}deg);
          animation:    sprinkle ${2 + i * 0.25}s ease-in-out infinite ${i * 0.35}s alternate;
          width:        ${6 + (i % 3) * 2}px;
          height:       3px;
          border-radius: 2px;
          position:     absolute;
          pointer-events: none;
        `;
        container.appendChild(el);
      }
    });
  }
};

// ============================================================
// PAGE LOAD FADE-IN
// ============================================================
function initPageLoad() {
  document.body.classList.add('page-load');
}

// ============================================================
// HERO ANIMATION SEQUENCE
// Runs staggered animations on hero section elements.
// ============================================================
function initHeroAnimations() {
  if (prefersReducedMotion) return;

  const heroBrand   = document.querySelector('.hero__brand');
  const heroTitle   = document.querySelector('.hero__title');
  const heroSub     = document.querySelector('.hero__subtitle');
  const heroActions = document.querySelector('.hero__actions');

  const sequence = [
    { el: heroBrand,   delay: 0,   anim: 'fadeInUp',    duration: '0.5s' },
    { el: heroTitle,   delay: 0.2, anim: 'fadeInLeft',   duration: '0.8s', easing: 'cubic-bezier(0.16,1,0.3,1)' },
    { el: heroSub,     delay: 0.4, anim: 'fadeInUp',    duration: '0.6s' },
    { el: heroActions, delay: 0.6, anim: 'fadeInUp',    duration: '0.6s' }
  ];

  sequence.forEach(({ el, delay, anim, duration, easing = 'ease-out' }) => {
    if (!el) return;
    el.style.cssText = `animation: ${anim} ${duration} ${easing} ${delay}s both;`;
  });
}

// ============================================================
// COUNTDOWN TIMER
// Targets an element with data-countdown="ISO-date-string"
// and updates .countdown-num inside .countdown child elements.
//
// HTML structure:
// <div data-countdown="2025-12-31T23:59:59">
//   <div class="countdown">
//     <div class="countdown-unit"><div class="countdown-num" id="cd-days">0</div><div class="countdown-label">Days</div></div>
//     <div class="countdown-unit"><div class="countdown-num" id="cd-hours">0</div><div class="countdown-label">Hours</div></div>
//     <div class="countdown-unit"><div class="countdown-num" id="cd-mins">0</div><div class="countdown-label">Minutes</div></div>
//     <div class="countdown-unit"><div class="countdown-num" id="cd-secs">0</div><div class="countdown-label">Seconds</div></div>
//   </div>
// </div>
// ============================================================
const CountdownTimer = {
  timers: [],

  init() {
    document.querySelectorAll('[data-countdown]').forEach(container => {
      const targetDate = new Date(container.dataset.countdown);
      if (isNaN(targetDate.getTime())) return;

      const units = container.querySelectorAll('.countdown-unit');
      if (!units.length) return;

      const getNum = unit => unit.querySelector('.countdown-num');

      const update = () => {
        const now  = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
          units.forEach(u => { const n = getNum(u); if (n) n.textContent = '00'; });
          return;
        }

        const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const values = [days, hours, minutes, seconds];
        units.forEach((unit, i) => {
          const numEl = getNum(unit);
          if (numEl) numEl.textContent = String(values[i]).padStart(2, '0');
        });
      };

      update();
      const id = setInterval(update, 1000);
      this.timers.push(id);
    });
  },

  destroy() {
    this.timers.forEach(id => clearInterval(id));
    this.timers = [];
  }
};

// ============================================================
// IMAGE LIGHTBOX (Gallery)
// Click .gallery-item to open a lightbox overlay.
// ============================================================
const Lightbox = {
  overlay:  null,
  img:      null,
  caption:  null,
  items:    [],
  current:  0,

  init() {
    this.items = Array.from(document.querySelectorAll('.gallery-item'));
    if (!this.items.length) return;

    // Build lightbox DOM
    this.overlay = document.createElement('div');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-label', 'Image lightbox');
    this.overlay.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.92);
      z-index: 2000;
      display: none;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 24px;
    `;

    this.img = document.createElement('img');
    this.img.style.cssText = 'max-width: 90vw; max-height: 80vh; border-radius: 12px; object-fit: contain;';
    this.img.setAttribute('alt', '');

    this.caption = document.createElement('p');
    this.caption.style.cssText = 'color: rgba(255,255,255,0.8); margin-top: 16px; font-size: 0.9375rem; text-align: center;';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    closeBtn.style.cssText = `
      position: absolute; top: 20px; right: 20px;
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(255,255,255,0.1); border: none;
      color: #fff; font-size: 1.25rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    `;

    const prevBtn = this._navBtn('fa-chevron-left', 'Previous image', 'left: 20px;');
    const nextBtn = this._navBtn('fa-chevron-right', 'Next image', 'right: 20px;');

    this.overlay.append(closeBtn, prevBtn, this.img, this.caption, nextBtn);
    document.body.appendChild(this.overlay);

    // Events
    this.items.forEach((item, index) => {
      item.addEventListener('click', () => this._open(index));
    });

    closeBtn.addEventListener('click', () => this._close());
    prevBtn.addEventListener('click', () => this._navigate(-1));
    nextBtn.addEventListener('click', () => this._navigate(1));

    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) this._close();
    });

    document.addEventListener('keydown', e => {
      if (!this.overlay || this.overlay.style.display === 'none') return;
      if (e.key === 'Escape')     this._close();
      if (e.key === 'ArrowLeft')  this._navigate(-1);
      if (e.key === 'ArrowRight') this._navigate(1);
    });
  },

  _navBtn(icon, label, posStyle) {
    const btn = document.createElement('button');
    btn.innerHTML = `<i class="fa-solid ${icon}"></i>`;
    btn.setAttribute('aria-label', label);
    btn.style.cssText = `
      position: absolute; top: 50%; transform: translateY(-50%);
      ${posStyle}
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(255,255,255,0.1); border: none;
      color: #fff; font-size: 1.125rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
    `;
    btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(255,255,255,0.25)');
    btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(255,255,255,0.1)');
    return btn;
  },

  _open(index) {
    this.current = index;
    this._show();
    this.overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  },

  _close() {
    this.overlay.style.display = 'none';
    document.body.style.overflow = '';
  },

  _navigate(dir) {
    this.current = (this.current + dir + this.items.length) % this.items.length;
    this._show();
  },

  _show() {
    const item    = this.items[this.current];
    const imgEl   = item.querySelector('img');
    const overlay = item.querySelector('.gallery-item__overlay');

    if (imgEl) {
      this.img.src = imgEl.src;
      this.img.alt = imgEl.alt || '';
    }
    this.caption.textContent = overlay?.textContent?.trim() || imgEl?.alt || '';
  }
};

// ============================================================
// STICKY SECTION HEADER HIGHLIGHT
// Highlights nav links as user scrolls past sections.
// Looks for sections with id="" matching navbar links.
// ============================================================
const SectionObserver = {
  init() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    const navLinks = document.querySelectorAll('.navbar__link[href^="#"]');
    if (!navLinks.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => {
          const matches = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', matches);
        });
      });
    }, { threshold: 0.5, rootMargin: '-60px 0px -40% 0px' });

    sections.forEach(s => observer.observe(s));
  }
};

// ============================================================
// TAB COMPONENT
// Controls elements with [data-tab-group], [data-tab], [data-tab-panel]
// ============================================================
const TabManager = {
  init() {
    document.querySelectorAll('[data-tab-group]').forEach(group => {
      const tabs   = group.querySelectorAll('[data-tab]');
      const panels = group.querySelectorAll('[data-tab-panel]');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          panels.forEach(p => {
            p.style.display = 'none';
            p.setAttribute('aria-hidden', 'true');
          });

          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          const target = group.querySelector(`[data-tab-panel="${tab.dataset.tab}"]`);
          if (target) {
            target.style.display = '';
            target.setAttribute('aria-hidden', 'false');
          }
        });
      });
    });
  }
};

// ============================================================
// INIT ON DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initPageLoad();
  initHeroAnimations();
  ScrollReveal.init();
  Parallax.init();
  FloatingScoops.init();
  Sprinkles.init();
  CountdownTimer.init();
  Lightbox.init();
  SectionObserver.init();
  TabManager.init();
});

// ============================================================
// EXPORTS
// ============================================================
if (typeof window !== 'undefined') {
  window.SCOOP = window.SCOOP || {};
  Object.assign(window.SCOOP, {
    ScrollReveal,
    Parallax,
    FloatingScoops,
    Sprinkles,
    CountdownTimer,
    Lightbox,
    SectionObserver,
    TabManager
  });
}
