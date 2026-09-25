/**
 * DEAL — Coming Soon JS
 */
(function () {
  'use strict';

  function initComingSoonForm () {
    const form = document.getElementById('coming-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.coming-notify-input');
      const btn = form.querySelector('.coming-notify-btn');
      
      if (!input.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        input.style.borderColor = '#e53e3e';
        return;
      }
      
      input.style.borderColor = '';
      const originalText = btn.textContent;
      btn.textContent = 'Subscribed';
      btn.style.background = '#28CA41';
      btn.style.borderColor = '#28CA41';
      input.value = '';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 3000);
    });

    form.addEventListener('input', (e) => {
      if (e.target.classList.contains('coming-notify-input')) {
        e.target.style.borderColor = '';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initComingSoonForm);
})();
