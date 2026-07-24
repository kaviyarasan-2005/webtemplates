'use strict';

/* =============================================================
   SCOOP ICE CREAM PARLOUR — forms.js
   Complete form validation, submission handling,
   multi-step forms, range sliders, and quantity controls.
   ============================================================= */

// ============================================================
// UTILITY: Debounce
// ============================================================
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ============================================================
// VALIDATOR
// Validates individual fields and full forms.
// ============================================================
const Validator = {
  /**
   * Validate a single field element.
   * Returns { valid: Boolean, message: String }
   */
  validateField(field) {
    const value   = field.value.trim();
    const type    = field.type || field.tagName.toLowerCase();
    const name    = field.name || field.id || 'Field';

    // Required check
    if (field.required && value === '') {
      return { valid: false, message: `${this._label(field)} is required.` };
    }

    // Skip further checks if empty and not required
    if (value === '') return { valid: true, message: '' };

    // Email
    if (type === 'email') {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!re.test(value)) {
        return { valid: false, message: 'Please enter a valid email address.' };
      }
    }

    // Tel
    if (type === 'tel') {
      const re = /^[\d\s\+\-\(\)]{7,20}$/;
      if (!re.test(value)) {
        return { valid: false, message: 'Please enter a valid phone number.' };
      }
    }

    // URL
    if (type === 'url') {
      try { new URL(value); }
      catch { return { valid: false, message: 'Please enter a valid URL.' }; }
    }

    // Number min/max
    if (type === 'number') {
      const num = parseFloat(value);
      if (field.min !== '' && num < parseFloat(field.min)) {
        return { valid: false, message: `Minimum value is ${field.min}.` };
      }
      if (field.max !== '' && num > parseFloat(field.max)) {
        return { valid: false, message: `Maximum value is ${field.max}.` };
      }
    }

    // minLength
    if (field.minLength && field.minLength > 0 && value.length < field.minLength) {
      return { valid: false, message: `Must be at least ${field.minLength} characters.` };
    }

    // maxLength
    if (field.maxLength && field.maxLength > 0 && value.length > field.maxLength) {
      return { valid: false, message: `Cannot exceed ${field.maxLength} characters.` };
    }

    // Pattern
    if (field.pattern) {
      const re = new RegExp(field.pattern);
      if (!re.test(value)) {
        const patTitle = field.title || 'Invalid format.';
        return { valid: false, message: patTitle };
      }
    }

    // Custom data-validate
    const customRule = field.dataset.validate;
    if (customRule) {
      const result = this._runCustomRule(customRule, value, field);
      if (!result.valid) return result;
    }

    return { valid: true, message: '' };
  },

  _label(field) {
    const label = field.closest('.form-group')?.querySelector('.form-label');
    if (label) return label.textContent.replace('*', '').trim();
    return field.placeholder || field.name || 'Field';
  },

  _runCustomRule(rule, value, field) {
    switch (rule) {
      case 'confirm-password': {
        const original = document.querySelector(field.dataset.validateTarget);
        if (original && original.value !== value) {
          return { valid: false, message: 'Passwords do not match.' };
        }
        break;
      }
      case 'min-words': {
        const min  = parseInt(field.dataset.validateMin || '10', 10);
        const count = value.split(/\s+/).filter(Boolean).length;
        if (count < min) return { valid: false, message: `Please write at least ${min} words.` };
        break;
      }
      case 'future-date': {
        const d = new Date(value);
        if (d <= new Date()) return { valid: false, message: 'Please choose a future date.' };
        break;
      }
    }
    return { valid: true, message: '' };
  },

  /**
   * Validate entire form.
   * Returns { valid: Boolean, firstError: HTMLElement|null }
   */
  validateForm(form) {
    const fields     = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    let allValid     = true;
    let firstError   = null;

    fields.forEach(field => {
      const result = this.validateField(field);
      this._applyResult(field, result);
      if (!result.valid && allValid) {
        allValid   = false;
        firstError = field;
      }
    });

    return { valid: allValid, firstError };
  },

  /**
   * Apply visual result to a field (success/error state + helper message).
   */
  _applyResult(field, result) {
    const group    = field.closest('.form-group');
    if (!group) return;

    // Clear previous
    group.querySelectorAll('.form-error, .form-success').forEach(el => el.remove());
    field.classList.remove('error', 'success');

    if (!result.valid) {
      field.classList.add('error');
      field.setAttribute('aria-invalid', 'true');

      const msg = document.createElement('p');
      msg.className   = 'form-error';
      msg.textContent = result.message;
      msg.setAttribute('role', 'alert');
      group.appendChild(msg);
    } else if (field.value.trim() !== '') {
      field.classList.add('success');
      field.setAttribute('aria-invalid', 'false');
    }
  },

  clearField(field) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.querySelectorAll('.form-error, .form-success').forEach(el => el.remove());
    field.classList.remove('error', 'success');
    field.removeAttribute('aria-invalid');
  }
};

// ============================================================
// FORM MANAGER
// Wires up validation on blur + submit for every form
// that has data-validate attribute.
// ============================================================
const FormManager = {
  init() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      this._initForm(form);
    });
  },

  _initForm(form) {
    const fields = form.querySelectorAll('.form-input, .form-select, .form-textarea');

    // Validate on blur (not on keystroke — better UX)
    fields.forEach(field => {
      field.addEventListener('blur', () => {
        const result = Validator.validateField(field);
        Validator._applyResult(field, result);
      });

      // Clear error when user starts typing again
      field.addEventListener('input', debounce(() => {
        if (field.classList.contains('error')) {
          Validator.clearField(field);
        }
      }, 300));
    });

    // Submit handler
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const { valid, firstError } = Validator.validateForm(form);

      if (!valid) {
        firstError?.focus();
        // Scroll to first error
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      await this._handleSubmit(form);
    });
  },

  async _handleSubmit(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn?.textContent || 'Submit';

    // Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Sending…';
    }

    const formId     = form.dataset.formId || form.id || 'generic';
    const formData   = new FormData(form);
    const endpoint   = form.action || form.dataset.endpoint;

    try {
      // If endpoint is configured, POST data
      if (endpoint && endpoint !== window.location.href) {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);
      } else {
        // Simulate network delay in development
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      this._showSuccess(form, formId);
    } catch (err) {
      console.error('[SCOOP Forms] Submission error:', err);
      this._showError(form, err.message);
    } finally {
      if (submitBtn) {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = originalText;
      }
    }
  },

  _showSuccess(form, formId) {
    // Find or create success message
    const existing = form.querySelector('.form-submit-success');
    if (existing) {
      existing.style.display = 'flex';
      existing.setAttribute('aria-hidden', 'false');
      return;
    }

    const msg = document.createElement('div');
    msg.className = 'form-submit-success';
    msg.setAttribute('role', 'status');
    msg.style.cssText = `
      display: flex; align-items: center; gap: 12px;
      padding: 16px 20px; border-radius: 8px;
      background: rgba(42, 157, 143, 0.10);
      border: 1px solid rgba(42, 157, 143, 0.30);
      color: var(--secondary); font-size: 0.9375rem;
      margin-top: 16px;
    `;
    msg.innerHTML = `<i class="fa-solid fa-circle-check" aria-hidden="true"></i>
      <span>Thank you! Your message has been sent successfully. We'll be in touch soon! 🍦</span>`;

    form.appendChild(msg);
    form.reset();
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(f => {
      f.classList.remove('success', 'error');
    });

    // Toast if ToastManager available
    if (window.SCOOP?.ToastManager) {
      window.SCOOP.ToastManager.show('Message sent successfully!', 'success');
    }
  },

  _showError(form, errorMessage) {
    const msg = document.createElement('div');
    msg.className = 'form-submit-error';
    msg.setAttribute('role', 'alert');
    msg.style.cssText = `
      display: flex; align-items: center; gap: 12px;
      padding: 16px 20px; border-radius: 8px;
      background: rgba(231, 111, 81, 0.10);
      border: 1px solid rgba(231, 111, 81, 0.30);
      color: var(--accent); font-size: 0.9375rem;
      margin-top: 16px;
    `;
    msg.innerHTML = `<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i>
      <span>Something went wrong. Please try again or call us directly.</span>`;

    // Remove existing error msg
    form.querySelector('.form-submit-error')?.remove();
    form.appendChild(msg);
    setTimeout(() => msg.remove(), 6000);
  }
};

// ============================================================
// MULTI-STEP FORM
// Supports forms with data-multistep, with [data-step] panels
// and [data-step-next] / [data-step-back] buttons.
// Progress bar: .multistep-progress-fill
// ============================================================
const MultiStepForm = {
  init() {
    document.querySelectorAll('[data-multistep]').forEach(form => this._initForm(form));
  },

  _initForm(form) {
    const steps    = Array.from(form.querySelectorAll('[data-step]'));
    const progress = form.querySelector('.multistep-progress-fill');
    const stepLabel = form.querySelector('.multistep-step-label');
    let currentStep = 0;

    const show = index => {
      steps.forEach((s, i) => {
        s.hidden = i !== index;
        s.setAttribute('aria-hidden', String(i !== index));
      });

      if (progress) {
        const pct = ((index + 1) / steps.length) * 100;
        progress.style.width = `${pct}%`;
      }
      if (stepLabel) {
        stepLabel.textContent = `Step ${index + 1} of ${steps.length}`;
      }
    };

    show(0);

    form.querySelectorAll('[data-step-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        // Validate current step's fields before advancing
        const currentFields = steps[currentStep].querySelectorAll('.form-input, .form-select, .form-textarea');
        let stepValid = true;
        let firstInvalid = null;

        currentFields.forEach(field => {
          const result = Validator.validateField(field);
          Validator._applyResult(field, result);
          if (!result.valid && stepValid) {
            stepValid    = false;
            firstInvalid = field;
          }
        });

        if (!stepValid) {
          firstInvalid?.focus();
          return;
        }

        if (currentStep < steps.length - 1) {
          currentStep++;
          show(currentStep);
          form.querySelector('[data-step]:not([hidden])')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    form.querySelectorAll('[data-step-back]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep--;
          show(currentStep);
        }
      });
    });
  }
};

// ============================================================
// QUANTITY CONTROLS
// For +/- quantity inputs used in ordering.
// HTML: <div class="qty-control">
//         <button class="qty-btn qty-btn--minus">−</button>
//         <input type="number" class="qty-input" value="1" min="1" max="99">
//         <button class="qty-btn qty-btn--plus">+</button>
//       </div>
// ============================================================
const QuantityControls = {
  init() {
    document.querySelectorAll('.qty-control').forEach(control => {
      const input   = control.querySelector('.qty-input');
      const minusBtn = control.querySelector('.qty-btn--minus');
      const plusBtn  = control.querySelector('.qty-btn--plus');
      if (!input) return;

      const min = parseInt(input.min || '1',  10);
      const max = parseInt(input.max || '99', 10);

      const update = (newVal) => {
        const clamped = Math.max(min, Math.min(max, newVal));
        input.value   = clamped;
        if (minusBtn) minusBtn.disabled = clamped <= min;
        if (plusBtn)  plusBtn.disabled  = clamped >= max;

        // Fire change event for any listeners
        input.dispatchEvent(new Event('change', { bubbles: true }));

        // Update cart if available
        this._updateCart(control, clamped);
      };

      minusBtn?.addEventListener('click', () => update(parseInt(input.value, 10) - 1));
      plusBtn?.addEventListener('click',  () => update(parseInt(input.value, 10) + 1));
      input.addEventListener('change',   () => update(parseInt(input.value, 10) || min));
      input.addEventListener('blur',     () => update(parseInt(input.value, 10) || min));

      update(parseInt(input.value, 10) || min);
    });
  },

  _updateCart(control, qty) {
    const priceEl = control.closest('[data-item-price]');
    const totalEl = control.closest('[data-item]')?.querySelector('[data-item-total]');
    if (!priceEl || !totalEl) return;

    const price = parseFloat(priceEl.dataset.itemPrice || '0');
    totalEl.textContent = `$${(price * qty).toFixed(2)}`;
  }
};

// ============================================================
// RANGE SLIDER
// Syncs <input type="range" data-range-output="#targetId">
// with a display element.
// ============================================================
const RangeSliders = {
  init() {
    document.querySelectorAll('input[type="range"][data-range-output]').forEach(slider => {
      const outputId = slider.dataset.rangeOutput;
      const output   = outputId ? document.querySelector(outputId) : null;
      const prefix   = slider.dataset.rangePrefix || '';
      const suffix   = slider.dataset.rangeSuffix || '';

      const update = () => {
        if (output) output.textContent = prefix + slider.value + suffix;

        // Visual fill (CSS custom property)
        const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.setProperty('--range-fill', `${pct}%`);
      };

      slider.addEventListener('input', update);
      update();
    });
  }
};

// ============================================================
// PASSWORD VISIBILITY TOGGLE
// HTML: <button data-pw-toggle="#password-input-id">
// ============================================================
function initPasswordToggles() {
  document.querySelectorAll('[data-pw-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.querySelector(btn.dataset.pwToggle);
      if (!input) return;

      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';

      const icon = btn.querySelector('i');
      if (icon) icon.className = show ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';

      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });
}

// ============================================================
// CHARACTER COUNTER
// HTML: <textarea data-char-counter maxlength="500">
// ============================================================
function initCharCounters() {
  document.querySelectorAll('[data-char-counter]').forEach(field => {
    const max     = parseInt(field.maxLength, 10) || 500;
    const counter = document.createElement('p');
    counter.className = 'form-helper';
    counter.setAttribute('aria-live', 'polite');

    const update = () => {
      const remaining = max - field.value.length;
      counter.textContent = `${remaining} character${remaining !== 1 ? 's' : ''} remaining`;
      counter.style.color = remaining < 20 ? 'var(--accent)' : '';
    };

    field.addEventListener('input', update);
    field.after(counter);
    update();
  });
}

// ============================================================
// FILE UPLOAD PREVIEW
// HTML: <input type="file" data-preview="#previewId">
// ============================================================
function initFileUploads() {
  document.querySelectorAll('input[type="file"][data-preview]').forEach(input => {
    const previewContainer = document.querySelector(input.dataset.preview);
    if (!previewContainer) return;

    input.addEventListener('change', () => {
      previewContainer.innerHTML = '';
      const files = Array.from(input.files);

      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = e => {
          const img = document.createElement('img');
          img.src   = e.target.result;
          img.alt   = file.name;
          img.style.cssText = 'width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin: 4px;';
          previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    });
  });
}

// ============================================================
// NEWSLETTER FORM (Quick inline handler)
// Targets forms with data-newsletter attribute.
// ============================================================
function initNewsletterForms() {
  document.querySelectorAll('[data-newsletter]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput) return;

      const result = Validator.validateField(emailInput);
      Validator._applyResult(emailInput, result);
      if (!result.valid) return;

      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled  = true;
        submitBtn.textContent = 'Subscribing…';
      }

      // Simulate async submission
      await new Promise(resolve => setTimeout(resolve, 600));

      form.innerHTML = `
        <div style="text-align:center; color: var(--secondary); padding: 16px;">
          <i class="fa-solid fa-heart" aria-hidden="true" style="font-size:2rem; color:var(--primary); margin-bottom:8px; display:block;"></i>
          <strong>You're in!</strong><br>
          <span style="font-size:0.9375rem; color:var(--text-secondary);">Welcome to the SCOOP family. 🍦</span>
        </div>
      `;

      if (window.SCOOP?.ToastManager) {
        window.SCOOP.ToastManager.show('Successfully subscribed!', 'success');
      }
    });
  });
}

// ============================================================
// CATERING ORDER FORM (domain-specific)
// Calculates total price from selected flavors × quantity.
// ============================================================
const CateringOrderForm = {
  init() {
    const form = document.querySelector('[data-catering-form]');
    if (!form) return;

    const updateTotal = () => {
      const selectedPills = form.querySelectorAll('.flavor-pill.selected').length;
      const qty           = parseInt(form.querySelector('[data-catering-qty]')?.value || '50', 10);
      const pricePerScoop = parseFloat(form.dataset.cateringPrice || '2.50');
      const flavourMult   = Math.max(1, selectedPills);
      const total         = qty * pricePerScoop * flavourMult;

      const totalDisplay = form.querySelector('[data-catering-total]');
      if (totalDisplay) totalDisplay.textContent = `$${total.toFixed(2)}`;
    };

    form.addEventListener('click',  e => {
      if (e.target.closest('.flavor-pill')) updateTotal();
    });
    form.addEventListener('change', updateTotal);
    updateTotal();
  }
};

// ============================================================
// RESERVATION FORM — Date/Time guard
// Prevents selecting past dates for reservations.
// ============================================================
function initReservationDateGuard() {
  document.querySelectorAll('input[type="date"][data-reservation-date]').forEach(input => {
    const today = new Date().toISOString().split('T')[0];
    input.min   = today;
    input.value = input.value || today;
  });

  document.querySelectorAll('input[type="time"][data-reservation-time]').forEach(input => {
    input.min = input.dataset.openTime  || '09:00';
    input.max = input.dataset.closeTime || '21:00';
  });
}

// ============================================================
// INIT ON DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  FormManager.init();
  MultiStepForm.init();
  QuantityControls.init();
  RangeSliders.init();
  initPasswordToggles();
  initCharCounters();
  initFileUploads();
  initNewsletterForms();
  CateringOrderForm.init();
  initReservationDateGuard();
});

// ============================================================
// EXPORTS
// ============================================================
if (typeof window !== 'undefined') {
  window.SCOOP = window.SCOOP || {};
  Object.assign(window.SCOOP, {
    Validator,
    FormManager,
    MultiStepForm,
    QuantityControls,
    RangeSliders,
    CateringOrderForm
  });
}
