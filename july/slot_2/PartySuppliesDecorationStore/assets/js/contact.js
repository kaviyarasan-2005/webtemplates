/*!
 * FESTA — contact.js
 * Form Validation, Business Hours Highlight, Success Message
 */
(function () {
  'use strict';

  /* ══════════════════════════════════════════
     1. CONTACT FORM VALIDATION
  ══════════════════════════════════════════ */
  const contactForm = document.getElementById('contactForm');

  const VALIDATORS = {
    name:      { test: v => v.trim().length >= 2,          msg: 'Please enter your full name (at least 2 characters).' },
    email:     { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email address.' },
    phone:     { test: v => v === '' || /^[\d\s\-\+\(\)]{7,}$/.test(v), msg: 'Please enter a valid phone number.' },
    eventType: { test: v => v !== '',                      msg: 'Please select an event type.' },
    message:   { test: v => v.trim().length >= 10,         msg: 'Please enter a message (at least 10 characters).' },
  };

  function validateField(input) {
    const name      = input.name || input.id;
    const validator = VALIDATORS[name];
    const group     = input.closest('.form-group');
    const errEl     = group?.querySelector('.form-error');

    if (!validator) return true;

    const valid = validator.test(input.value);
    group?.classList.toggle('has-error', !valid);
    input.classList.toggle('error', !valid);
    if (errEl) errEl.textContent = validator.msg;
    return valid;
  }

  contactForm?.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.form-group')?.classList.contains('has-error')) validateField(field);
    });
  });

  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    const fields = contactForm.querySelectorAll('input, select, textarea');
    let allValid = true;

    fields.forEach(f => { if (!validateField(f)) allValid = false; });

    if (allValid) {
      showSuccess();
      contactForm.reset();
    } else {
      const firstError = contactForm.querySelector('.form-group.has-error input, .form-group.has-error select, .form-group.has-error textarea');
      firstError?.focus();
    }
  });

  function showSuccess() {
    const successEl = document.getElementById('formSuccess');
    if (!successEl) return;
    successEl.style.display = 'block';
    successEl.setAttribute('role', 'alert');
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => { successEl.style.display = 'none'; }, 6000);
  }

  /* ══════════════════════════════════════════
     2. NEWSLETTER FORM VALIDATION (shared)
  ══════════════════════════════════════════ */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput) return;

      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
      if (valid) {
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Subscribed!';
        btn.disabled = true;
        emailInput.value = '';
        setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 4000);
      } else {
        emailInput.classList.add('error');
        emailInput.focus();
        setTimeout(() => emailInput.classList.remove('error'), 3000);
      }
    });
  });

  /* ══════════════════════════════════════════
     3. HIGHLIGHT CURRENT DAY IN HOURS TABLE
  ══════════════════════════════════════════ */
  const dayIndex = new Date().getDay(); // 0=Sun, 6=Sat
  const dayMap   = { 1:'mon', 2:'tue', 3:'wed', 4:'thu', 5:'fri', 6:'sat', 0:'sun' };
  const todayKey = dayMap[dayIndex];

  const hoursRow = document.querySelector(`[data-day="${todayKey}"]`);
  hoursRow?.classList.add('today');

  /* ══════════════════════════════════════════
     4. COMMENT FORM VALIDATION
  ══════════════════════════════════════════ */
  const commentForm = document.getElementById('commentForm');

  commentForm?.addEventListener('submit', e => {
    e.preventDefault();
    const nameInput    = commentForm.querySelector('#commentName');
    const emailInput   = commentForm.querySelector('#commentEmail');
    const msgInput     = commentForm.querySelector('#commentMsg');
    let valid = true;

    [nameInput, emailInput, msgInput].forEach(f => {
      if (!f) return;
      const isEmpty = f.value.trim().length < 2;
      f.classList.toggle('error', isEmpty);
      if (isEmpty) valid = false;
    });

    if (valid) {
      const confirmEl = document.getElementById('commentSuccess');
      if (confirmEl) {
        confirmEl.style.display = 'block';
        commentForm.reset();
        setTimeout(() => { confirmEl.style.display = 'none'; }, 5000);
      }
    }
  });

})();
