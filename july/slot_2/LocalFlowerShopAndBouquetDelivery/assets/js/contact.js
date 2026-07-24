/* ============================================
   BLOOM — Contact Page JavaScript
   Form validation, business hours highlight
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initBusinessHours();
});

/* --- Contact Form Validation --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(err => err.classList.remove('visible'));
    form.querySelectorAll('.form-input, .form-textarea').forEach(input => input.classList.remove('error'));

    // Validate name
    const name = document.getElementById('ct-name');
    if (name && !name.value.trim()) {
      showFieldError(name, 'ct-name-error');
      isValid = false;
    }

    // Validate email
    const email = document.getElementById('ct-email');
    if (email && (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))) {
      showFieldError(email, 'ct-email-error');
      isValid = false;
    }

    // Validate message
    const message = document.getElementById('ct-message');
    if (message && !message.value.trim()) {
      showFieldError(message, 'ct-message-error');
      isValid = false;
    }

    if (isValid) {
      // Show success, hide form
      form.querySelectorAll('.form-group, .form-row, .text-center').forEach(el => {
        el.style.display = 'none';
      });
      const success = document.getElementById('ct-success');
      if (success) {
        success.classList.add('visible');
        success.style.display = 'block';
      }
    }
  });

  // Real-time validation on blur
  form.querySelectorAll('.form-input[required], .form-textarea[required]').forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim()) {
        input.classList.remove('error');
        const errorId = input.id.replace('ct-', 'ct-') + '-error';
        const errorEl = document.getElementById(errorId);
        if (errorEl) errorEl.classList.remove('visible');
      }
    });
  });
}

function showFieldError(input, errorId) {
  input.classList.add('error');
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.classList.add('visible');
  // Focus the first error field
  input.focus();
}

/* --- Business Hours — Highlight Today --- */
function initBusinessHours() {
  const table = document.getElementById('hours-table');
  if (!table) return;

  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const rows = table.querySelectorAll('tr[data-day]');

  rows.forEach(row => {
    const dayNum = parseInt(row.getAttribute('data-day'), 10);
    if (dayNum === today) {
      row.classList.add('today');
    }
  });
}
