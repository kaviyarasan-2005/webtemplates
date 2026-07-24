/* ============================================
   PLAY — Contact Page Interactions
   Form Validation, Current Day Highlight
   ============================================ */

(function() {
  'use strict';

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clean all errors
      form.querySelectorAll('.form-group').forEach(g => {
        g.classList.remove('error');
      });

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const qty = document.getElementById('contactQty');
      const message = document.getElementById('contactMessage');

      if (!name.value.trim()) {
        name.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (qty.value && parseInt(qty.value) < 1) {
        qty.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (!message.value.trim()) {
        message.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (isValid) {
        const success = document.getElementById('contactSuccess');
        if (success) {
          success.classList.add('visible');
          form.reset();
          setTimeout(() => {
            success.classList.remove('visible');
          }, 6000);
        }
      }
    });
  }

  function highlightCurrentDay() {
    const tableBody = document.querySelector('.hours-table tbody');
    if (!tableBody) return;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = days[new Date().getDay()];

    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
      const dayCell = row.querySelector('td:first-child');
      if (dayCell && dayCell.textContent.trim() === currentDayName) {
        row.classList.add('today');
      }
    });
  }

  function init() {
    initContactForm();
    highlightCurrentDay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
