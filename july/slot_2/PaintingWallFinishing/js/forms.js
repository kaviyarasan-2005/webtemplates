/**
 * MediCare Plus — forms.js
 * Client-side form validation, file upload, and form submission handling.
 */

/* ── Validators ─────────────────────────────────────────────── */
const VALIDATORS = {
  required: (val) => val.trim().length > 0 || 'This field is required.',
  email:    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Please enter a valid email address.',
  phone:    (val) => /^[\+]?[\d\s\-\(\)]{8,15}$/.test(val.replace(/\s/g,'')) || 'Please enter a valid phone number.',
  password: (val) => val.length >= 8 || 'Password must be at least 8 characters.',
  min:      (val, len) => val.trim().length >= parseInt(len) || `Minimum ${len} characters required.`,
  max:      (val, len) => val.trim().length <= parseInt(len) || `Maximum ${len} characters allowed.`,
  match:    (val, sel) => {
    const other = document.querySelector(sel);
    return (other && val === other.value) || 'Passwords do not match.';
  },
};

function validateField(input) {
  const rules = input.dataset.validate;
  if (!rules) return true;

  const val = input.type === 'checkbox' ? (input.checked ? 'checked' : '') : input.value;
  const errorEl = input.closest('.form-group')?.querySelector('.form-error');

  for (const rule of rules.split(',')) {
    const [name, param] = rule.trim().split(':');
    if (VALIDATORS[name]) {
      const result = VALIDATORS[name](val, param);
      if (result !== true) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        input.setAttribute('aria-invalid', 'true');
        if (errorEl) { errorEl.textContent = result; errorEl.style.display = 'flex'; }
        return false;
      }
    }
  }

  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  input.setAttribute('aria-invalid', 'false');
  if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }
  return true;
}

/* ── Form Submission ─────────────────────────────────────────── */
function handleFormSubmit(form) {
  const inputs = form.querySelectorAll('[data-validate]');
  let valid = true;

  inputs.forEach(input => {
    if (!validateField(input)) valid = false;
  });

  if (!valid) {
    // Focus first invalid field
    const firstInvalid = form.querySelector('.is-invalid');
    firstInvalid?.focus();
    firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Simulate submission
  const btn = form.querySelector('[type="submit"]');
  if (btn) {
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Processing...';
    btn.setAttribute('aria-label', 'Processing your request...');

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-circle-check" aria-hidden="true"></i> Done!';
      btn.style.background = 'var(--clr-success)';

      const msg = form.dataset.successMessage || 'Your request has been submitted successfully!';
      showToast(msg, 'success');
      form.reset();
      form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
        el.classList.remove('is-valid', 'is-invalid');
      });

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = original;
        btn.style.background = '';
      }, 3000);
    }, 1500);
  }
}

/* ── File Upload Drag & Drop ─────────────────────────────────── */
function initFileUpload(container) {
  const input   = container.querySelector('.file-upload__input');
  const text    = container.querySelector('.file-upload__text');
  const hint    = container.querySelector('.file-upload__hint');
  const preview = document.getElementById('prescriptionUploadPreview');
  const status  = document.getElementById('prescriptionUploadStatus');

  if (!input) return;

  const allowed = ['application/pdf','image/jpeg','image/png','image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  const handleFile = (file) => {
    if (!allowed.includes(file.type)) {
      if (status) { status.textContent = 'Invalid file type. Please upload PDF, JPG, PNG, or WEBP.'; status.style.color = 'var(--clr-danger)'; }
      return;
    }
    if (file.size > maxSize) {
      if (status) { status.textContent = 'File too large. Maximum size is 10MB.'; status.style.color = 'var(--clr-danger)'; }
      return;
    }
    if (status) { status.textContent = `Selected: ${file.name} (${(file.size/1024/1024).toFixed(2)} MB)`; status.style.color = 'var(--clr-success)'; }
    container.classList.add('has-file');
    if (text) text.textContent = file.name;

    // Image preview
    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.style.display = 'block';
        preview.innerHTML = `<img src="${e.target.result}" alt="Prescription preview" style="max-width:100%;max-height:200px;border-radius:var(--radius-lg);border:2px solid var(--clr-secondary);">`;
      };
      reader.readAsDataURL(file);
    } else if (preview) {
      preview.style.display = 'block';
      preview.innerHTML = `<div style="padding:var(--sp-4);background:var(--clr-bg-muted);border-radius:var(--radius-lg);text-align:center;"><i class="fas fa-file-pdf" style="color:var(--clr-danger);font-size:2rem;"></i><p style="margin-top:var(--sp-2);font-size:var(--fs-sm);color:var(--clr-text-secondary);">${file.name}</p></div>`;
    }
  };

  input.addEventListener('change', () => {
    if (input.files[0]) handleFile(input.files[0]);
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    container.classList.add('is-drag-over');
  });

  container.addEventListener('dragleave', () => {
    container.classList.remove('is-drag-over');
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    container.classList.remove('is-drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
      input.files = e.dataTransfer.files;
      handleFile(file);
    }
  });

  // Keyboard accessibility
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); }
  });
}

/* ── Toast Notification ──────────────────────────────────────── */
export function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-label', 'Notifications');
    container.style.cssText = `
      position:fixed;
      ${document.documentElement.getAttribute('dir')==='rtl'?'left':'right'}:var(--sp-4);
      bottom:var(--sp-4);
      z-index:10000;
      display:flex;
      flex-direction:column;
      gap:var(--sp-2);
      max-width:380px;
      pointer-events:none;
    `;
    document.body.appendChild(container);
  }

  const icons = { success:'fa-circle-check', error:'fa-circle-xmark', warning:'fa-triangle-exclamation', info:'fa-circle-info' };
  const colors = { success:'var(--clr-success)', error:'var(--clr-danger)', warning:'var(--clr-warning)', info:'var(--clr-primary)' };

  const toast = document.createElement('div');
  toast.setAttribute('role', 'alert');
  toast.style.cssText = `
    background:var(--clr-bg-card);
    border:1px solid var(--clr-border);
    border-left:4px solid ${colors[type]};
    border-radius:var(--radius-lg);
    padding:var(--sp-4) var(--sp-5);
    box-shadow:var(--shadow-lg);
    display:flex;align-items:center;gap:var(--sp-3);
    font-size:var(--fs-sm);color:var(--clr-text);
    pointer-events:all;
    animation:slideInRight 0.3s ease forwards;
    max-width:380px;
  `;
  toast.innerHTML = `<i class="fas ${icons[type]}" style="color:${colors[type]};flex-shrink:0;" aria-hidden="true"></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── Init ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Forms validation
  document.querySelectorAll('[data-validate-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(form);
    });

    // Real-time validation on blur
    form.querySelectorAll('[data-validate]').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) validateField(input);
      });
    });
  });

  // File uploads
  document.querySelectorAll('.file-upload').forEach(initFileUpload);
});
