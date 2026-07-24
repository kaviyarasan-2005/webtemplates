/**
 * VELOX — Contact JavaScript
 * contact.js — Form validation, map, business hours
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ─── Contact Form Validation ──────────────────────────────
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const fields = contactForm.querySelectorAll('[required]');
      fields.forEach(field => {
        const err = field.parentElement.querySelector('.form-error');
        let fieldValid = field.value.trim() !== '';

        if (field.type === 'email' && fieldValid) {
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }

        if (!fieldValid) {
          field.classList.add('error');
          field.setAttribute('aria-invalid', 'true');
          if (err) err.classList.add('visible');
          valid = false;
        } else {
          field.classList.remove('error');
          field.setAttribute('aria-invalid', 'false');
          if (err) err.classList.remove('visible');
        }
      });

      if (valid) {
        const successMsg = document.getElementById('form-success');
        if (successMsg) {
          successMsg.style.display = 'block';
          contactForm.reset();
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // Clear error on input
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const err = field.parentElement.querySelector('.form-error');
        if (err) err.classList.remove('visible');
      });
    });
  }

  // ─── Business Hours — Highlight Current Day ──────────────
  const dayRows = document.querySelectorAll('[data-day]');
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const dayMap = { 0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday' };
  const todayName = dayMap[today];

  dayRows.forEach(row => {
    if (row.dataset.day === todayName) {
      row.classList.add('today');
    }
  });
});
