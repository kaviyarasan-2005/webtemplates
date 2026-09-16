/**
 * form.js — Contact Form & Swatch Form Validation
 * Custom Furniture Upholstery Shop
 */

const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>`;
const ERROR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

/* ── Validator ── */
class FormValidator {
  constructor(formEl, rules) {
    this.form = formEl;
    this.rules = rules;
    this.errors = {};
  }

  validate() {
    this.errors = {};
    let valid = true;

    for (const [fieldId, rule] of Object.entries(this.rules)) {
      const field = this.form.querySelector(`#${fieldId}`);
      if (!field) continue;

      const value = field.value.trim();
      const errorEl = this.form.querySelector(`#${fieldId}-error`);

      field.classList.remove('error', 'success');
      field.setAttribute('aria-invalid', 'false');
      if (errorEl) errorEl.style.display = 'none';

      if (rule.required && !value) {
        this.setError(field, errorEl, rule.requiredMsg || 'This field is required.');
        valid = false;
        continue;
      }
      if (rule.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        this.setError(field, errorEl, rule.emailMsg || 'Please enter a valid email address.');
        valid = false;
        continue;
      }
      if (rule.minLength && value.length < rule.minLength) {
        this.setError(field, errorEl, rule.minLengthMsg || `Minimum ${rule.minLength} characters required.`);
        valid = false;
        continue;
      }
      if (value) {
        field.classList.add('success');
      }
    }
    return valid;
  }

  setError(field, errorEl, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      errorEl.innerHTML = `${ERROR_ICON} ${message}`;
      errorEl.style.display = 'flex';
    }
    this.errors[field.id] = message;
  }
}

/* ── Submit Handler ── */
async function handleFormSubmit(form, resultId, validator) {
  const resultEl = document.getElementById(resultId);
  const submitBtn = form.querySelector('[type="submit"]');
  if (!resultEl || !submitBtn) return;

  if (!validator.validate()) {
    const firstError = form.querySelector('.error');
    firstError?.focus();
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Loading state
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" style="animation:spin 0.8s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending...`;

  try {
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' },
    });

    if (response.ok) {
      form.reset();
      form.querySelectorAll('.form-control').forEach(f => f.classList.remove('success', 'error'));
      resultEl.innerHTML = `
        <div class="form-success" role="alert" aria-live="polite">
          ${CHECK_ICON}
          <div><strong>Sent successfully!</strong> We will respond within one business day. Thank you for reaching out to ReVox Upholstery.</div>
        </div>`;
    } else {
      throw new Error('Server error');
    }
  } catch {
    resultEl.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;padding:16px;background:rgba(217,83,79,0.08);border:1px solid rgba(217,83,79,0.2);border-radius:8px;color:#D9534F;font-size:14px" role="alert">
        ${ERROR_ICON} Something went wrong. Please email us directly at <a href="mailto:hello@revoxupholstery.com" style="color:var(--terracotta);font-weight:600;margin-left:4px">hello@revoxupholstery.com</a>
      </div>`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

/* ── Contact/Quote Form ── */
function initContactForm() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  const validator = new FormValidator(form, {
    'cf-fname':   { required: true, requiredMsg: 'First name is required' },
    'cf-lname':   { required: true, requiredMsg: 'Last name is required' },
    'cf-email':   { required: true, type: 'email', emailMsg: 'Please enter a valid email address' },
    'cf-service': { required: true, requiredMsg: 'Please select a service' },
    'cf-message': { required: true, minLength: 20, requiredMsg: 'Please describe your project', minLengthMsg: 'Please provide a little more detail (at least 20 characters)' },
  });

  // Live validation on blur
  ['cf-fname','cf-lname','cf-email','cf-service','cf-message'].forEach(id => {
    const field = form.querySelector(`#${id}`);
    if (field) field.addEventListener('blur', () => validator.validate());
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(form, 'quote-form-result', validator);
  });
}

/* ── Swatch Request Form ── */
function initSwatchForm() {
  const form = document.getElementById('swatch-request-form');
  if (!form) return;

  const validator = new FormValidator(form, {
    'sw-name':    { required: true, requiredMsg: 'Please enter your full name' },
    'sw-email':   { required: true, type: 'email', emailMsg: 'Please enter a valid email address' },
    'sw-address': { required: true, minLength: 15, requiredMsg: 'Please enter your delivery address', minLengthMsg: 'Please enter your full address' },
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(form, 'swatch-form-result', validator);
  });
}

/* ── Newsletter form (standalone page sections) ── */
function initPageNewsletter(formId, resultId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailInput?.classList.add('error');
      return;
    }
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = CHECK_ICON;
    btn.style.background = '#4CAF50';
    btn.style.borderColor = '#4CAF50';
    emailInput.value = '';
    emailInput.classList.remove('error');
    const resultEl = document.getElementById(resultId);
    if (resultEl) {
      resultEl.innerHTML = `<p style="color:rgba(244,235,221,0.7);font-size:0.8125rem;margin-top:8px">${CHECK_ICON} You are subscribed! Welcome to the ReVox community.</p>`;
    }
    setTimeout(() => { btn.disabled = false; btn.innerHTML = orig; btn.style.background = ''; btn.style.borderColor = ''; }, 4000);
  });
}

export { initContactForm, initSwatchForm, initPageNewsletter };
