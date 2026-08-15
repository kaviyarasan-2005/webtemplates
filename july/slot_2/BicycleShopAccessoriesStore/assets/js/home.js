/**
 * VELOX — Home Page JavaScript
 * home.js — Home-specific interactions
 */

'use strict';

// ─── Configurator Tile & Step Logic ───────────────────────
let cfgStep = 1;
const stepCosts = { 1: 1200, 2: 800, 3: 900 };

window.selectTile = function(el, step) {
  const parent = el.parentElement;
  parent.querySelectorAll('.vx-option-tile').forEach(t => t.classList.remove('vx-selected'));
  el.classList.add('vx-selected');
  stepCosts[step] = parseInt(el.getAttribute('data-cost')) || 0;
  const total = stepCosts[1] + stepCosts[2] + stepCosts[3];
  const priceBadge = document.getElementById('build-price');
  if (priceBadge) priceBadge.textContent = `$${total.toLocaleString()}`;
};

window.moveConfigStep = function(delta) {
  cfgStep += delta;
  if (cfgStep < 1) cfgStep = 1;
  if (cfgStep > 3) cfgStep = 3;

  for (let i = 1; i <= 3; i++) {
    const panel = document.getElementById(`panel-${i}`);
    const node  = document.getElementById(`node-${i}`);
    if (panel) panel.classList.toggle('vx-active', i === cfgStep);
    if (node) {
      node.classList.toggle('active', i === cfgStep);
      node.classList.toggle('done', i < cfgStep);
    }
  }

  const prevBtn = document.getElementById('cfg-prev');
  const nextBtn = document.getElementById('cfg-next');
  if (prevBtn) prevBtn.disabled = (cfgStep === 1);
  if (nextBtn) nextBtn.textContent = (cfgStep === 3) ? 'Complete Build' : 'Next Step';
};

// ─── Conversational Form Logic ─────────────────────────────
let convStep = 1;

window.updateRadioSelection = function(input) {
  const labels = input.closest('.vx-radio-grid').querySelectorAll('.vx-radio-label');
  labels.forEach(l => l.classList.remove('vx-checked'));
  input.parentElement.classList.add('vx-checked');
};

window.moveConvStep = function(delta) {
  if (delta > 0 && convStep === 3) {
    const cname = document.getElementById('cname');
    const cemail = document.getElementById('cemail');
    if (!cname.value.trim() || !cemail.value.trim()) {
      alert('Please enter your name and email address.');
      return;
    }
    document.getElementById('cstep-3').classList.remove('vx-active');
    document.getElementById('cstep-success').classList.add('vx-active');
    document.getElementById('conv-nav').style.display = 'none';
    document.getElementById('conv-progress').style.width = '100%';
    document.getElementById('conv-step-num').textContent = 'Completed!';
    return;
  }

  convStep += delta;
  if (convStep < 1) convStep = 1;
  if (convStep > 3) convStep = 3;

  for (let i = 1; i <= 3; i++) {
    const stepEl = document.getElementById(`cstep-${i}`);
    if (stepEl) stepEl.classList.toggle('vx-active', i === convStep);
  }

  const prevBtn = document.getElementById('conv-prev-btn');
  const nextBtn = document.getElementById('conv-next-btn');
  if (prevBtn) prevBtn.disabled = (convStep === 1);
  if (nextBtn) nextBtn.textContent = (convStep === 3) ? 'Submit Request' : 'Next Step';

  const progress = document.getElementById('conv-progress');
  const stepNum = document.getElementById('conv-step-num');
  if (progress) progress.style.width = `${(convStep / 3) * 100}%`;
  if (stepNum) stepNum.textContent = `Step ${convStep} of 3`;
};

// ─── Newsletter Form ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsletter-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = document.getElementById('newsletter-email');
      const email = input?.value.trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        input?.classList.add('error');
        input?.setAttribute('aria-invalid', 'true');
        return;
      }

      input?.classList.remove('error');
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Subscribed!';
        btn.disabled = true;
        btn.style.background = 'var(--color-secondary)';
      }
      if (input) input.value = '';
    });
  }

  // ─── Custom Build Configurator (Home Alt) ──────────────
  const buildForm = document.getElementById('bike-builder');
  if (buildForm) {
    const priceDisplay = document.getElementById('build-price');
    const parts = {
      frame: { carbon: 1200, aluminum: 700, steel: 450 },
      groupset: { shimano_ultegra: 800, shimano_105: 500, sram_rival: 650 },
      wheels: { carbon_clincher: 900, alloy_tubeless: 450, entry_alloy: 220 },
      finishing: { premium: 300, standard: 150, basic: 80 },
    };

    const updatePrice = () => {
      let total = 0;
      Object.keys(parts).forEach(key => {
        const sel = buildForm.querySelector(`[name="${key}"]`);
        if (sel && parts[key][sel.value]) {
          total += parts[key][sel.value];
        }
      });
      if (priceDisplay) priceDisplay.textContent = `$${total.toLocaleString()}`;
    };

    buildForm.querySelectorAll('select').forEach(sel => {
      sel.addEventListener('change', updatePrice);
    });

    updatePrice();
  }

  // ─── Appointment Form (Home Alt) ───────────────────────
  const apptForm = document.getElementById('appointment-form');
  if (apptForm) {
    apptForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      apptForm.querySelectorAll('[required]').forEach(field => {
        const err = field.parentElement.querySelector('.form-error');
        if (!field.value.trim()) {
          field.classList.add('error');
          if (err) err.classList.add('visible');
          valid = false;
        } else {
          field.classList.remove('error');
          if (err) err.classList.remove('visible');
        }
      });

      if (valid) {
        const btn = apptForm.querySelector('button[type="submit"]');
        if (btn) {
          btn.textContent = 'Appointment Booked!';
          btn.disabled = true;
          btn.style.background = 'var(--color-secondary)';
        }
      }
    });
  }
  // ─── VELOX-H1: Hero Word Ticker ────────────────────────
  const ticker = document.getElementById('vx-ticker');
  if (ticker) {
    const words = ['Road', 'Mountain', 'City', 'Kids', 'Gravel'];
    let idx = 0;
    setInterval(() => {
      ticker.classList.add('exiting');
      setTimeout(() => {
        idx = (idx + 1) % words.length;
        ticker.textContent = words[idx];
        ticker.classList.remove('exiting');
        ticker.classList.add('entering');
        setTimeout(() => ticker.classList.remove('entering'), 50);
      }, 350);
    }, 2800);
  }

  // ─── VELOX-S2: Scroll-Snap Shelf Controls ──────────────
  const shelf = document.getElementById('vx-shelf');
  const shelfPrev = document.getElementById('shelf-prev');
  const shelfNext = document.getElementById('shelf-next');
  if (shelf) {
    shelfPrev?.addEventListener('click', () => shelf.scrollBy({ left: -240, behavior: 'smooth' }));
    shelfNext?.addEventListener('click', () => shelf.scrollBy({ left: 240, behavior: 'smooth' }));
  }

  // ─── VELOX-S3: Feature Rail Observer ───────────────────
  const featureRail = document.getElementById('vx-feature-rail');
  if (featureRail && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          featureRail.classList.add('vx-animated');
          featureRail.querySelectorAll('.vx-feature-row').forEach((row, i) => {
            setTimeout(() => row.classList.add('vx-animated'), i * 180);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    observer.observe(featureRail);
  }

  // ─── VELOX-S4: Spotlight Testimonial Controls ─────────
  const quotes = document.querySelectorAll('.vx-spotlight-quote');
  const dots   = document.querySelectorAll('.vx-dot');
  if (quotes.length && dots.length) {
    let currentSpot = 0;
    const showQuote = (index) => {
      quotes.forEach((q, i) => {
        q.classList.toggle('vx-active', i === index);
      });
      dots.forEach((d, i) => {
        d.classList.toggle('vx-active', i === index);
        d.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      currentSpot = index;
    };
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showQuote(i));
    });
    setInterval(() => {
      showQuote((currentSpot + 1) % quotes.length);
    }, 5000);
  }
});

