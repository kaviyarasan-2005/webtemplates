/**
 * DEAL — Contact JS
 */
(function () {
  'use strict';

  function initContactForm () {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('.form-input, .form-textarea, .form-select');

      inputs.forEach(input => {
        const group = input.closest('.form-group');
        const error = group.querySelector('.form-error');

        if (!input.value.trim() || (input.tagName === 'SELECT' && input.value === '')) {
          isValid = false;
          group.classList.add('has-error');
          if (error) error.textContent = 'This field is required';
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          isValid = false;
          group.classList.add('has-error');
          if (error) error.textContent = 'Please enter a valid email';
        } else {
          group.classList.remove('has-error');
        }
      });

      if (isValid) {
        const btn = form.querySelector('.btn');
        const originalText = btn.textContent;
        btn.textContent = 'Request Sent Successfully';
        btn.style.background = '#28CA41';
        btn.style.borderColor = '#28CA41';
        inputs.forEach(i => i.value = '');
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 3000);
      }
    });

    form.addEventListener('input', (e) => {
      if (e.target.classList.contains('form-input') || e.target.classList.contains('form-textarea') || e.target.classList.contains('form-select')) {
        e.target.closest('.form-group').classList.remove('has-error');
      }
    });
  }

  function initHoursStatus () {
    // Simple logic to highlight today
    const rows = document.querySelectorAll('.hours-row');
    const today = new Date().getDay(); // 0 = Sun, 1 = Mon...
    // Adjust map: rows in HTML are Mon-Fri, Sat, Sun. 
    // Assuming Mon is row 0, Sun is row 6
    const rowMap = [6, 0, 1, 2, 3, 4, 5]; 
    const todayRowIndex = rowMap[today];
    
    if (rows[todayRowIndex]) {
      rows[todayRowIndex].style.background = 'rgba(176,141,60,0.05)';
      const dayLabel = rows[todayRowIndex].querySelector('.hours-day');
      if (dayLabel) {
        dayLabel.textContent += ' (Today)';
        dayLabel.style.color = 'var(--brass)';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initHoursStatus();
  });
})();
