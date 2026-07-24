/* ==========================================
   SEWIT — Home Page JavaScript
   Configurator, Form Validation, Gallery
   ========================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initConfigurator();
  initAppointmentForm();
});

// =============================
// Design Configurator
// =============================
function initConfigurator() {
  const configurator = document.getElementById('design-configurator');
  if (!configurator) return;

  const steps = configurator.querySelectorAll('.configurator__step-indicator');
  const panels = configurator.querySelectorAll('.configurator__panel');
  const priceDisplay = document.getElementById('config-price');

  const selections = {
    garment: 0,
    fabric: 0,
    style: 0,
    complexity: 0
  };

  // Step navigation
  steps.forEach(step => {
    step.addEventListener('click', () => {
      const stepNum = step.getAttribute('data-step');
      showStep(stepNum);
    });
  });

  function showStep(num) {
    steps.forEach(s => s.classList.remove('active'));
    panels.forEach(p => p.style.display = 'none');

    const activeStep = configurator.querySelector(`[data-step="${num}"]`);
    const activePanel = document.getElementById(`config-step-${num}`);

    if (activeStep) activeStep.classList.add('active');
    if (activePanel) activePanel.style.display = 'block';
  }

  // Option selection
  configurator.addEventListener('click', (e) => {
    const option = e.target.closest('.configurator__option');
    if (!option) return;

    const category = option.getAttribute('data-category');
    const price = parseInt(option.getAttribute('data-price'), 10);

    // Deselect siblings
    const siblings = option.parentElement.querySelectorAll('.configurator__option');
    siblings.forEach(s => s.classList.remove('selected'));
    option.classList.add('selected');

    // Update price
    selections[category] = price;
    updatePrice();

    // Auto-advance to next step after short delay
    const currentStep = option.closest('.configurator__panel').id.replace('config-step-', '');
    const nextStep = parseInt(currentStep) + 1;
    if (nextStep <= 4) {
      setTimeout(() => showStep(nextStep), 400);
    }
  });

  function updatePrice() {
    const total = Object.values(selections).reduce((sum, val) => sum + val, 0);
    if (priceDisplay) {
      priceDisplay.textContent = `$${total}`;
    }
  }
}


// =============================
// Appointment Form Validation
// =============================
function initAppointmentForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  const successMsg = document.getElementById('appointment-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
      const group = field.closest('.form-group');
      if (!group) return;

      if (!field.value.trim()) {
        group.classList.add('error');
        isValid = false;
      } else {
        group.classList.remove('error');
      }

      // Email validation
      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          group.classList.add('error');
          isValid = false;
        }
      }
    });

    if (isValid) {
      form.style.display = 'none';
      if (successMsg) successMsg.classList.add('show');
    }
  });

  // Clear error on input
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group) group.classList.remove('error');
    });
  });
}
