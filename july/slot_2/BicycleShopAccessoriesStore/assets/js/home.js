/**
 * VELOX — Home Page JavaScript
 * home.js — Home-specific interactions
 */

'use strict';

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
});
