/* ============================================================
   YUMZ Restaurant — Form Validation JavaScript
   validation.js | Version 1.0
   Handles: Client-side form validation with accessible
            error messages, inline validation on blur,
            submit state management, newsletter forms
   ============================================================ */

'use strict';

/* ============================================================
   1. INIT ALL FORMS ON PAGE LOAD
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Validate all forms with [data-validate="true"]
  document.querySelectorAll('form[data-validate="true"]').forEach(form => {
    initFormValidation(form);
  });
});

/* ============================================================
   2. FORM VALIDATION ENGINE
   ============================================================ */
function initFormValidation(form) {
  const inputs   = form.querySelectorAll('input[required], textarea[required], select[required], input[type="email"], input[type="tel"]');
  const submitBtn = form.querySelector('.form__submit, button[type="submit"]');

  // Validate on blur (after user finishes typing)
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });

    // Clear error on input (after it was shown)
    input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) {
        validateField(input);
      }
    });
  });

  // Validate on submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    inputs.forEach(input => {
      const valid = validateField(input);
      if (!valid) isFormValid = false;
    });

    if (isFormValid) {
      handleFormSuccess(form, submitBtn);
    } else {
      // Focus first invalid field
      const firstError = form.querySelector('.is-error');
      if (firstError) firstError.focus();
    }
  });
}

/* ============================================================
   3. FIELD VALIDATION RULES
   ============================================================ */
function validateField(input) {
  const value     = input.value.trim();
  const type      = input.type;
  const required  = input.hasAttribute('required');
  const minLength = parseInt(input.getAttribute('minlength'), 10) || 0;
  const maxLength = parseInt(input.getAttribute('maxlength'), 10) || Infinity;
  const name      = input.getAttribute('name') || input.id || 'Field';
  const label     = getFieldLabel(input);

  let error = '';

  // Required check
  if (required && !value) {
    error = `${label} is required.`;
  }
  // Email validation
  else if (type === 'email' && value && !isValidEmail(value)) {
    error = 'Please enter a valid email address (e.g. name@example.com).';
  }
  // Phone validation
  else if (type === 'tel' && value && !isValidPhone(value)) {
    error = 'Please enter a valid phone number (digits, spaces, +, -, () allowed).';
  }
  // Min length
  else if (minLength && value.length < minLength) {
    error = `${label} must be at least ${minLength} characters.`;
  }
  // Max length
  else if (maxLength && value.length > maxLength) {
    error = `${label} must be no more than ${maxLength} characters.`;
  }
  // Select validation
  else if (input.tagName === 'SELECT' && required && (!value || value === '')) {
    error = `Please select a ${label.toLowerCase()}.`;
  }

  setFieldState(input, error);
  return !error;
}

/* ============================================================
   4. VALIDATION HELPERS
   ============================================================ */
function isValidEmail(email) {
  // RFC 5322 simplified
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  // Allows: +1-555-000-0000, (555) 000-0000, digits with spaces/dashes
  return /^[+\d][\d\s\-().]{6,20}$/.test(phone);
}

function getFieldLabel(input) {
  // Try associated <label> first
  const id = input.id;
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) {
      // Strip required asterisk text if present
      return label.textContent.replace('*', '').trim();
    }
  }

  // Fallback to placeholder or name
  return input.placeholder || input.name || 'This field';
}

/* ============================================================
   5. FIELD STATE (error / valid / neutral)
   ============================================================ */
function setFieldState(input, errorMessage) {
  // Find or create error element
  let errorEl = input.parentElement.querySelector('.form__error');

  if (!errorEl) {
    // Create error element if it doesn't exist
    errorEl = document.createElement('span');
    errorEl.className = 'form__error';
    errorEl.setAttribute('role', 'alert');
    errorEl.setAttribute('aria-live', 'polite');
    input.insertAdjacentElement('afterend', errorEl);
  }

  if (errorMessage) {
    // Show error state
    input.classList.add('is-error');
    input.classList.remove('is-valid');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorEl.id || (errorEl.id = `err-${input.id || Math.random().toString(36).slice(2)}`));

    errorEl.innerHTML = `<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> ${errorMessage}`;
    errorEl.classList.add('visible');
  } else {
    // Show valid state
    input.classList.remove('is-error');
    input.classList.add('is-valid');
    input.setAttribute('aria-invalid', 'false');
    input.removeAttribute('aria-describedby');

    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

/* ============================================================
   6. FORM SUCCESS HANDLER
   ============================================================ */
function handleFormSuccess(form, submitBtn) {
  // Show loading state
  if (submitBtn) {
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending...';

    // Simulate async submission (replace with real API call)
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Sent!';
      submitBtn.style.backgroundColor = '#2A9D8F';

      showSuccessToast(form);
      form.reset();

      // Clear valid states
      form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));

      // Reset button after delay
      setTimeout(() => {
        submitBtn.disabled  = false;
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = '';
      }, 4000);
    }, 1200);
  }
}

/* ============================================================
   7. TOAST NOTIFICATION
   ============================================================ */
function showSuccessToast(form) {
  // Remove any existing toast
  const existing = document.querySelector('.yumz-toast');
  if (existing) existing.remove();

  const formType  = form.getAttribute('data-form-type') || 'contact';
  let message = 'Thank you! Your message has been sent.';

  if (formType === 'newsletter') {
    message = 'You\'re subscribed! Deals and updates coming your way.';
  } else if (formType === 'comment') {
    message = 'Your comment has been submitted for review. Thank you!';
  }

  const toast = document.createElement('div');
  toast.className = 'yumz-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <i class="fa-solid fa-check-circle" aria-hidden="true"></i>
    <span>${message}</span>
  `;

  // Toast styles (injected inline to avoid extra CSS dependency)
  Object.assign(toast.style, {
    position:        'fixed',
    bottom:          '24px',
    right:           '24px',
    background:      '#2A9D8F',
    color:           '#fff',
    padding:         '14px 22px',
    borderRadius:    '10px',
    display:         'flex',
    alignItems:      'center',
    gap:             '10px',
    fontSize:        '0.9375rem',
    fontWeight:      '500',
    boxShadow:       '0 10px 30px rgba(0,0,0,0.15)',
    zIndex:          '9999',
    transform:       'translateY(80px)',
    opacity:         '0',
    transition:      'transform 0.35s ease, opacity 0.35s ease',
    maxWidth:        '360px',
    fontFamily:      "'Inter', sans-serif",
  });

  // RTL support
  if (document.documentElement.getAttribute('dir') === 'rtl') {
    toast.style.right = 'auto';
    toast.style.left  = '24px';
  }

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity   = '1';
    });
  });

  // Auto dismiss after 4s
  setTimeout(() => {
    toast.style.transform = 'translateY(80px)';
    toast.style.opacity   = '0';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ============================================================
   8. NEWSLETTER FORMS (compact inline forms)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn  = form.querySelector('button[type="submit"]');

    if (!emailInput || !submitBtn) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const value = emailInput.value.trim();

      if (!value) {
        showInlineError(emailInput, 'Please enter your email address.');
        return;
      }

      if (!isValidEmail(value)) {
        showInlineError(emailInput, 'Please enter a valid email address.');
        return;
      }

      // Clear error
      clearInlineError(emailInput);

      // Success state
      const originalText = submitBtn.textContent;
      submitBtn.disabled  = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        emailInput.value    = '';

        showSuccessToast({ getAttribute: () => 'newsletter' });

        setTimeout(() => {
          submitBtn.disabled  = false;
          submitBtn.textContent = originalText;
        }, 3500);
      }, 1000);
    });

    emailInput.addEventListener('blur', () => {
      if (emailInput.value.trim() && !isValidEmail(emailInput.value.trim())) {
        showInlineError(emailInput, 'Please enter a valid email address.');
      } else {
        clearInlineError(emailInput);
      }
    });
  });
});

function showInlineError(input, message) {
  input.style.borderColor = '#D62828';
  input.style.boxShadow   = '0 0 0 3px rgba(214,40,40,0.12)';

  let errorEl = input.parentElement.querySelector('.newsletter-error');
  if (!errorEl) {
    errorEl = document.createElement('p');
    errorEl.className = 'newsletter-error';
    Object.assign(errorEl.style, {
      color: '#D62828',
      fontSize: '0.8125rem',
      marginTop: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    });
    input.parentElement.insertAdjacentElement('afterend', errorEl);
  }
  errorEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
  input.setAttribute('aria-invalid', 'true');
}

function clearInlineError(input) {
  input.style.borderColor = '';
  input.style.boxShadow   = '';
  const errorEl = input.parentElement.querySelector('.newsletter-error') ||
                  input.parentElement.nextElementSibling;
  if (errorEl && errorEl.classList.contains('newsletter-error')) errorEl.remove();
  input.setAttribute('aria-invalid', 'false');
}

/* ============================================================
   9. COMMENT FORM VALIDATION
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const commentForm = document.querySelector('form[data-form-type="comment"]');
  if (!commentForm) return;

  // Already handled by the generic initFormValidation above
  // Just ensure data-validate="true" is set on the form in HTML
});
