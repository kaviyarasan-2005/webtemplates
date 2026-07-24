/* ============================================================
   ZEST & BLEND — JavaScript: Form Validation
   ============================================================ */
'use strict';

const FormManager = (() => {
  // ─── Validators ──────────────────────────────────────
  const validators = {
    required: (value) => value.trim() !== '',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    minLength: (min) => (value) => value.trim().length >= min,
    maxLength: (max) => (value) => value.trim().length <= max,
    phone: (value) => /^[+\d\s\-()]{7,20}$/.test(value.trim()),
    numeric: (value) => /^\d+$/.test(value.trim()),
  };

  const messages = {
    required: 'This field is required.',
    email: 'Please enter a valid email address.',
    phone: 'Please enter a valid phone number.',
    minLength: (min) => `Minimum ${min} characters required.`,
    maxLength: (max) => `Maximum ${max} characters allowed.`,
  };

  // ─── Show/Hide error ─────────────────────────────────
  function showError(field, msg) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    const errorEl = field.closest('.form-group')?.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
    }
  }

  function clearError(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    const errorEl = field.closest('.form-group')?.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function clearAll(field) {
    field.classList.remove('is-invalid', 'is-valid');
    const errorEl = field.closest('.form-group')?.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  // ─── Validate a single field ─────────────────────────
  function validateField(field) {
    const rules = (field.dataset.validate || '').split(',').map((r) => r.trim()).filter(Boolean);
    const value = field.value;

    for (const rule of rules) {
      if (rule === 'required' && !validators.required(value)) {
        showError(field, messages.required);
        return false;
      }
      if (rule === 'email' && value.trim() && !validators.email(value)) {
        showError(field, messages.email);
        return false;
      }
      if (rule === 'phone' && value.trim() && !validators.phone(value)) {
        showError(field, messages.phone);
        return false;
      }
      if (rule.startsWith('min:')) {
        const min = parseInt(rule.split(':')[1]);
        if (!validators.minLength(min)(value)) {
          showError(field, messages.minLength(min));
          return false;
        }
      }
      if (rule.startsWith('max:')) {
        const max = parseInt(rule.split(':')[1]);
        if (!validators.maxLength(max)(value)) {
          showError(field, messages.maxLength(max));
          return false;
        }
      }
    }

    clearError(field);
    return true;
  }

  // ─── Validate entire form ─────────────────────────────
  function validateForm(form) {
    const fields = form.querySelectorAll('[data-validate]');
    let valid = true;
    fields.forEach((field) => {
      if (!validateField(field)) valid = false;
    });
    return valid;
  }

  // ─── Show toast notification ─────────────────────────
  function showToast(msg, type = 'success') {
    const container = document.querySelector('.toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    const icons = { success: 'check-circle', error: 'x-circle', warning: 'alert-triangle' };
    toast.innerHTML = `
      <span class="toast__icon">
        <i data-lucide="${icons[type] || 'info'}" width="20" height="20"></i>
      </span>
      <span class="toast__msg">${msg}</span>
    `;
    container.appendChild(toast);
    if (window.lucide) lucide.createIcons({ el: toast });

    setTimeout(() => {
      toast.style.animation = 'fadeInRight 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function createToastContainer() {
    const el = document.createElement('div');
    el.className = 'toast-container';
    document.body.appendChild(el);
    return el;
  }

  // ─── Init all forms on page ───────────────────────────
  function init() {
    // Real-time validation on blur
    document.querySelectorAll('[data-validate]').forEach((field) => {
      field.addEventListener('blur', () => {
        if (field.value.trim()) validateField(field);
      });
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) validateField(field);
        if (!field.value.trim()) clearAll(field);
      });
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(contactForm)) {
          const btn = contactForm.querySelector('[type="submit"]');
          if (btn) {
            btn.classList.add('loading');
            btn.disabled = true;
          }
          // Simulate async submission (replace with real Formspree action)
          setTimeout(() => {
            if (btn) { btn.classList.remove('loading'); btn.disabled = false; }
            showToast('Message sent! We will get back to you shortly.', 'success');
            contactForm.reset();
            contactForm.querySelectorAll('[data-validate]').forEach(clearAll);
          }, 1500);
        }
      });
    }

    // Catering form submission
    const cateringForm = document.getElementById('cateringForm');
    if (cateringForm) {
      cateringForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(cateringForm)) {
          const btn = cateringForm.querySelector('[type="submit"]');
          if (btn) { btn.classList.add('loading'); btn.disabled = true; }
          setTimeout(() => {
            if (btn) { btn.classList.remove('loading'); btn.disabled = false; }
            showToast('Catering enquiry submitted! We will contact you within 24 hours.', 'success');
            cateringForm.reset();
            cateringForm.querySelectorAll('[data-validate]').forEach(clearAll);
          }, 1500);
        }
      });
    }

    // Newsletter forms
    document.querySelectorAll('.newsletter-form, #newsletterForm, .footer__newsletter-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && !validators.email(emailInput.value)) {
          emailInput.classList.add('is-invalid');
          showToast('Please enter a valid email address.', 'error');
          return;
        }
        showToast('Subscribed successfully! Welcome to the fresh life.', 'success');
        form.reset();
      });
    });

    // Coming soon subscribe
    const csForm = document.getElementById('comingSoonForm');
    if (csForm) {
      csForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = csForm.querySelector('input[type="email"]');
        if (emailInput && !validators.email(emailInput.value)) {
          showToast('Please enter a valid email address.', 'error');
          return;
        }
        showToast('You are on the list! Stay fresh.', 'success');
        csForm.reset();
      });
    }
  }

  return { init, showToast, validateForm };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', FormManager.init);
} else {
  FormManager.init();
}
