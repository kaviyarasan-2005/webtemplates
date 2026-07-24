/* ============================================
   BLOOM — Home Page Specific JavaScript
   Custom builder, enquiry form, masonry layout
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initArrangementBuilder();
  initEnquiryForm();
});

/* --- Custom Arrangement Builder --- */
function initArrangementBuilder() {
  const builder = document.getElementById('arrangement-builder');
  if (!builder) return;

  const steps = builder.querySelectorAll('.builder-step');
  const panels = builder.querySelectorAll('.builder-panel');
  const totalDisplay = document.getElementById('builder-total');
  const basePrice = 39;
  let selections = {};

  // Step navigation
  steps.forEach(step => {
    step.addEventListener('click', () => {
      const targetStep = step.getAttribute('data-step');

      // Update active step
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');

      // Show corresponding panel
      panels.forEach(p => {
        p.style.display = p.getAttribute('data-panel') === targetStep ? 'block' : 'none';
      });
    });
  });

  // Option selection
  builder.querySelectorAll('.builder-option').forEach(option => {
    option.addEventListener('click', () => {
      const panel = option.closest('.builder-panel');
      const panelName = panel.getAttribute('data-panel');

      // Deselect siblings
      panel.querySelectorAll('.builder-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');

      // Store selection
      selections[panelName] = parseInt(option.getAttribute('data-price'), 10) || 0;

      // Calculate total
      const total = basePrice + Object.values(selections).reduce((sum, val) => sum + val, 0);
      if (totalDisplay) {
        totalDisplay.textContent = '$' + total;
      }

      // Auto-advance to next step
      const stepNames = ['occasion', 'colors', 'flowers', 'size'];
      const currentIdx = stepNames.indexOf(panelName);
      if (currentIdx < stepNames.length - 1) {
        setTimeout(() => {
          const nextStep = steps[currentIdx + 1];
          if (nextStep) nextStep.click();
        }, 400);
      }
    });
  });
}

/* --- Enquiry Form Validation --- */
function initEnquiryForm() {
  const form = document.getElementById('enquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(err => err.classList.remove('visible'));
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => input.classList.remove('error'));

    // Validate name
    const name = document.getElementById('eq-name');
    if (name && !name.value.trim()) {
      showError(name, 'eq-name-error');
      isValid = false;
    }

    // Validate email
    const email = document.getElementById('eq-email');
    if (email && (!email.value.trim() || !isValidEmail(email.value))) {
      showError(email, 'eq-email-error');
      isValid = false;
    }

    if (isValid) {
      form.style.display = 'none';
      const successMsg = document.getElementById('eq-success');
      if (successMsg) {
        successMsg.classList.add('visible');
        successMsg.style.display = 'block';
      }
    }
  });
}

function showError(input, errorId) {
  input.classList.add('error');
  const errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.classList.add('visible');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
