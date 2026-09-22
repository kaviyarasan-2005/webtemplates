/**
 * Form Validation — CREST Engravings
 * Client-side validation with error messages and WCAG 2.1 AA compliance
 */

document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('[data-validate]');

  forms.forEach(form => {
    // Live validation on blur
    form.querySelectorAll('.form-control').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('is-error')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('.form-control').forEach(field => {
        if (!validateField(field)) valid = false;
      });
      if (valid) handleSuccess(form);
    });
  });

  function validateField(field) {
    const value = field.value.trim();
    const type  = field.type;
    const name  = field.name || field.id;
    const required = field.hasAttribute('required');
    let error = '';

    if (required && !value) {
      error = getLabel(field) + ' is required.';
    } else if (value) {
      if (type === 'email' && !isValidEmail(value)) {
        error = 'Please enter a valid email address.';
      } else if (type === 'tel' && !isValidPhone(value)) {
        error = 'Please enter a valid phone number.';
      } else if (field.getAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'))) {
        error = `${getLabel(field)} must be at least ${field.getAttribute('minlength')} characters.`;
      } else if (field.getAttribute('maxlength') && value.length > parseInt(field.getAttribute('maxlength'))) {
        error = `${getLabel(field)} must be no more than ${field.getAttribute('maxlength')} characters.`;
      } else if (name === 'quantity' || name === 'units') {
        const num = parseInt(value, 10);
        const min = parseInt(field.getAttribute('min') || '1', 10);
        if (isNaN(num) || num < min) {
          error = `Minimum value is ${min}.`;
        }
      }
    }

    setFieldState(field, error);
    return !error;
  }

  function setFieldState(field, error) {
    const errorEl = field.closest('.form-group')?.querySelector('.form-error');
    field.classList.toggle('is-error', !!error);
    field.classList.toggle('is-valid', !error && field.value.trim() !== '');
    field.setAttribute('aria-invalid', error ? 'true' : 'false');

    if (errorEl) {
      errorEl.textContent = error;
      errorEl.classList.toggle('visible', !!error);
      if (error) {
        errorEl.setAttribute('role', 'alert');
        field.setAttribute('aria-describedby', errorEl.id || '');
      }
    }
  }

  function handleSuccess(form) {
    // Show success toast
    const toast = document.getElementById('form-success-toast');
    if (toast) {
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 5000);
    }

    // Visual success state on button
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      const original = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully!';
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.innerHTML = original;
        submitBtn.disabled = false;
        form.reset();
        form.querySelectorAll('.form-control').forEach(f => {
          f.classList.remove('is-valid', 'is-error');
        });
      }, 4000);
    }
  }

  function getLabel(field) {
    const label = field.closest('.form-group')?.querySelector('.form-label');
    return label ? label.textContent.replace('*', '').trim() : 'This field';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone.replace(/\s/g, ''));
  }
});
