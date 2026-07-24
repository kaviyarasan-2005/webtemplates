/* ==========================================
   SEWIT — Contact Page JavaScript
   Form validation, business hours highlight
   ========================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  highlightCurrentDay();
});

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('contact-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      const group = field.closest('.form-group');
      if (!group) return;

      // Reset
      group.classList.remove('error');

      // Check empty
      if (!field.value.trim()) {
        group.classList.add('error');
        isValid = false;
        return;
      }

      // Email validation
      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          group.classList.add('error');
          isValid = false;
        }
      }

      // Phone validation (basic)
      if (field.type === 'tel') {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,}$/;
        if (!phoneRegex.test(field.value.trim())) {
          group.classList.add('error');
          isValid = false;
        }
      }

      // Date validation - must be in the future
      if (field.type === 'date') {
        const selectedDate = new Date(field.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          group.classList.add('error');
          isValid = false;
        }
      }
    });

    if (isValid) {
      // Hide form, show success
      form.querySelectorAll('.form-group, button[type="submit"]').forEach(el => {
        el.style.display = 'none';
      });
      if (successMsg) {
        successMsg.classList.add('show');
        successMsg.style.display = 'block';
      }
    }
  });

  // Clear errors on input
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group) group.classList.remove('error');
    });
    field.addEventListener('change', () => {
      const group = field.closest('.form-group');
      if (group) group.classList.remove('error');
    });
  });

  // Set min date to today
  const dateInput = document.getElementById('c-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
}

function highlightCurrentDay() {
  const table = document.getElementById('hours-table');
  if (!table) return;

  const today = new Date().getDay(); // 0=Sunday, 1=Monday, etc.
  const rows = table.querySelectorAll('tr[data-day]');

  rows.forEach(row => {
    const dayNum = parseInt(row.getAttribute('data-day'), 10);
    if (dayNum === today) {
      row.classList.add('today');
    }
  });
}
