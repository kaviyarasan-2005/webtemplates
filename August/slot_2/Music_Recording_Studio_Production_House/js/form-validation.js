/* ============================================================
   SoundForge Studios — Client-side Form Validation
   Real-time validation with accessible error messages
   ============================================================ */

const FormValidator = (() => {

  /* ── Rules ──────────────────────────────────────────────── */
  const RULES = {
    required:  (v)    => v.trim().length > 0,
    email:     (v)    => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone:     (v)    => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(v.trim()),
    minLength: (v, n) => v.trim().length >= n,
    maxLength: (v, n) => v.trim().length <= n,
    pattern:   (v, p) => new RegExp(p).test(v),
    match:     (v, id) => v === (document.getElementById(id)?.value || ''),
    password:  (v)    => v.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v),
  };

  const MESSAGES = {
    required:  'This field is required.',
    email:     'Please enter a valid email address.',
    phone:     'Please enter a valid phone number.',
    minLength: (n) => `Must be at least ${n} characters.`,
    maxLength: (n) => `Must be no more than ${n} characters.`,
    pattern:   'Invalid format.',
    match:     'Fields do not match.',
    password:  'Password must be 8+ chars, include uppercase and a number.',
  };

  /* ── Validate a single field ─────────────────────────────── */
  const validateField = (input) => {
    const errorEl = document.getElementById(`${input.id}-error`);
    const rules   = (input.getAttribute('data-rules') || '').split(' ').filter(Boolean);
    let valid     = true;
    let message   = '';

    for (const rule of rules) {
      const [name, param] = rule.split(':');
      const check         = RULES[name];
      if (!check) continue;

      const passed = check(input.value, param);
      if (!passed) {
        valid = false;
        message = typeof MESSAGES[name] === 'function'
          ? MESSAGES[name](param)
          : MESSAGES[name];
        break;
      }
    }

    /* Update visual state */
    input.classList.toggle('form-control--error',   !valid);
    input.classList.toggle('form-control--success',  valid && input.value.trim().length > 0);

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.toggle('visible', !valid);
    }

    input.setAttribute('aria-invalid', String(!valid));
    return valid;
  };

  /* ── Validate entire form ───────────────────────────────── */
  const validateForm = (form) => {
    const inputs = form.querySelectorAll('[data-rules]');
    let allValid = true;
    let firstInvalid = null;

    inputs.forEach((input) => {
      const valid = validateField(input);
      if (!valid) {
        allValid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return allValid;
  };

  /* ── Show toast notification ─────────────────────────────── */
  const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container')
      || (() => {
        const div = document.createElement('div');
        div.id = 'toast-container';
        div.className = 'toast-container';
        div.setAttribute('aria-live', 'polite');
        document.body.appendChild(div);
        return div;
      })();

    const icons = {
      success: 'ri-checkbox-circle-fill',
      error:   'ri-error-warning-fill',
      info:    'ri-information-fill',
    };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <i class="${icons[type] || icons.info}" aria-hidden="true" style="font-size:1.2rem;color:${
        type === 'success' ? 'var(--color-success)' :
        type === 'error'   ? 'var(--color-danger)'  : 'var(--color-info)'
      }"></i>
      <span>${message}</span>
    `;
    toast.setAttribute('role', 'alert');

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px) scale(0.96)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  /* ── Attach live validation ──────────────────────────────── */
  const attachLiveValidation = (form) => {
    form.querySelectorAll('[data-rules]').forEach((input) => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('form-control--error')) {
          validateField(input);
        }
      });
    });
  };

  /* ── Init forms ─────────────────────────────────────────── */
  const initForm = (formId, onSuccess) => {
    const form = document.getElementById(formId);
    if (!form) return;

    attachLiveValidation(form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        if (typeof onSuccess === 'function') {
          onSuccess(form);
        } else {
          showToast('Form submitted successfully!', 'success');
        }
      } else {
        showToast('Please fix the errors below.', 'error');
      }
    });
  };

  /* ── Init all marked forms ──────────────────────────────── */
  const init = () => {
    /* Contact form */
    initForm('contact-form', (form) => {
      showToast('Message sent! We\'ll be in touch shortly.', 'success');
      setTimeout(() => form.reset(), 1000);
    });

    /* Newsletter forms */
    document.querySelectorAll('[data-newsletter-form]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (input && RULES.email(input.value)) {
          showToast('You\'re subscribed! Welcome to the community.', 'success');
          input.value = '';
        } else {
          showToast('Please enter a valid email address.', 'error');
          if (input) input.focus();
        }
      });
    });

    /* Login form */
    initForm('login-form', () => {
      showToast('Logging you in…', 'info');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    });

    /* Register form */
    initForm('register-form', () => {
      showToast('Account created! Redirecting…', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    });

    /* Booking form */
    initForm('booking-form', (form) => {
      showToast('Session booked! Check your email for confirmation.', 'success');
      setTimeout(() => form.reset(), 1000);
    });
  };

  return { init, validateForm, validateField, showToast, initForm };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', FormValidator.init);
} else {
  FormValidator.init();
}
