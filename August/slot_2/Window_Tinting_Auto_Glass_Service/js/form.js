/* ============================================================
   Tintex — Form Validation
   ============================================================ */
const FormManager = (() => {
  'use strict';
  const V = {
    required: v => v.trim().length > 0,
    email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone:    v => /^[\d\s\+\-\(\)]{7,20}$/.test(v.trim()),
    min:     (v,n) => v.trim().length >= parseInt(n),
    max:     (v,n) => v.trim().length <= parseInt(n),
  };
  const M = {
    required: 'This field is required.',
    email:    'Please enter a valid email address.',
    phone:    'Please enter a valid phone number.',
    min:     n => `Minimum ${n} characters required.`,
    max:     n => `Maximum ${n} characters allowed.`,
  };

  function showErr(input, msg) {
    input.classList.add('form-control--error');
    input.setAttribute('aria-invalid', 'true');
    let el = input.closest('.form-group')?.querySelector('.form-error');
    if (!el) {
      el = document.createElement('p');
      el.className = 'form-error';
      el.setAttribute('role', 'alert');
      el.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span></span>`;
      input.closest('.form-group')?.appendChild(el);
    }
    el.querySelector('span').textContent = msg;
    el.style.display = 'flex';
  }

  function clearErr(input) {
    input.classList.remove('form-control--error');
    input.removeAttribute('aria-invalid');
    const el = input.closest('.form-group')?.querySelector('.form-error');
    if (el) el.style.display = 'none';
  }

  function validateField(input) {
    clearErr(input);
    const rules = (input.dataset.validate || '').split(',').map(r => r.trim()).filter(Boolean);
    for (const rule of rules) {
      if (rule === 'required' && !V.required(input.value)) { showErr(input, M.required); return false; }
      if (rule === 'email' && input.value.trim() && !V.email(input.value)) { showErr(input, M.email); return false; }
      if (rule === 'phone' && input.value.trim() && !V.phone(input.value)) { showErr(input, M.phone); return false; }
      if (rule.startsWith('min:')) { const n = rule.split(':')[1]; if (!V.min(input.value, n)) { showErr(input, M.min(n)); return false; } }
      if (rule.startsWith('max:')) { const n = rule.split(':')[1]; if (!V.max(input.value, n)) { showErr(input, M.max(n)); return false; } }
    }
    return true;
  }

  function validateForm(form) {
    let ok = true;
    form.querySelectorAll('[data-validate]').forEach(inp => { if (!validateField(inp)) ok = false; });
    return ok;
  }

  function showSuccess(form, msg = 'Thank you! We will be in touch shortly.') {
    const el = document.createElement('div');
    el.className = 'form-success-msg';
    el.setAttribute('role', 'alert');
    el.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>${msg}</span>`;
    form.replaceWith(el);
  }

  function wireForm(id, successMsg) {
    const form = document.getElementById(id);
    if (!form) return;
    form.querySelectorAll('[data-validate]').forEach(inp => {
      inp.addEventListener('blur', () => validateField(inp));
      inp.addEventListener('input', () => { if (inp.classList.contains('form-control--error')) validateField(inp); });
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(form)) {
        const btn = form.querySelector('[type="submit"]');
        if (btn) btn.classList.add('loading');
        setTimeout(() => showSuccess(form, successMsg), 1200);
      }
    });
  }

  function wireNewsletter(id) {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const inp = form.querySelector('[type="email"]');
      if (inp && V.email(inp.value)) { inp.value = ''; inp.placeholder = 'Subscribed! Thank you.'; }
      else if (inp) { inp.style.borderColor = '#ef4444'; }
    });
  }

  function init() {
    wireForm('contact-form', 'Appointment request received! Our team will confirm within 2 hours.');
    wireNewsletter('footer-newsletter-form');
    wireNewsletter('newsletter-form');
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', FormManager.init);
