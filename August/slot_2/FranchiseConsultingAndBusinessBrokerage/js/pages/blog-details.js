/**
 * DEAL — Blog Details JS
 */
(function () {
  'use strict';

  function initCommentForm () {
    const form = document.getElementById('comment-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('.form-input, .form-textarea');

      inputs.forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          isValid = false;
          group.classList.add('has-error');
        } else {
          group.classList.remove('has-error');
        }
      });

      if (isValid) {
        const btn = form.querySelector('.btn');
        const originalText = btn.textContent;
        btn.textContent = 'Submitted!';
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

    // Clear error on type
    form.addEventListener('input', (e) => {
      if (e.target.classList.contains('form-input') || e.target.classList.contains('form-textarea')) {
        e.target.closest('.form-group').classList.remove('has-error');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initCommentForm);
})();
