/* ============================================
   PLAY — Home Page Interactions
   Kit Configurator, Gallery, Form Validation
   ============================================ */

(function() {
  'use strict';

  // ─── Kit Configurator ──────────────────────
  function initKitConfigurator() {
    const configurator = document.querySelector('.configurator');
    if (!configurator) return;

    const stepBtns = configurator.querySelectorAll('.config-step-btn');
    const panels = configurator.querySelectorAll('.config-panel');
    const prevBtn = document.getElementById('configPrevBtn');
    const nextBtn = document.getElementById('configNextBtn');
    const priceDisplay = document.getElementById('configTotalPrice');
    let currentStep = 1;
    const totalSteps = stepBtns.length;

    // Base prices
    let basePrice = 35;
    let stylePrice = 0;

    function goToStep(step) {
      if (step < 1 || step > totalSteps) return;
      currentStep = step;

      stepBtns.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.step) <= step);
      });

      panels.forEach(panel => {
        panel.classList.toggle('active', parseInt(panel.dataset.panel) === step);
      });

      prevBtn.disabled = step === 1;
      nextBtn.textContent = step === totalSteps ? 'Start Design' : 'Next Step';
      
      if (step === totalSteps) {
        nextBtn.addEventListener('click', handleFinalSubmit, { once: true });
      }
    }

    function handleFinalSubmit() {
      nextBtn.textContent = 'Design Submitted!';
      nextBtn.disabled = true;
      setTimeout(() => {
        nextBtn.textContent = 'Start Design';
        nextBtn.disabled = false;
        goToStep(1);
      }, 2000);
    }

    function updatePrice() {
      const total = basePrice + stylePrice;
      if (priceDisplay) priceDisplay.textContent = '$' + total;
    }

    // Step button clicks
    stepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        goToStep(parseInt(btn.dataset.step));
      });
    });

    // Next/Prev
    nextBtn.addEventListener('click', () => {
      if (currentStep < totalSteps) goToStep(currentStep + 1);
    });

    prevBtn.addEventListener('click', () => {
      if (currentStep > 1) goToStep(currentStep - 1);
    });

    // Sport selection (panel 1)
    const sportOptions = configurator.querySelectorAll('[data-panel="1"] .config-option');
    sportOptions.forEach(option => {
      option.addEventListener('click', () => {
        sportOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        basePrice = parseInt(option.dataset.price) || 35;
        updatePrice();
      });
    });

    // Style selection (panel 2)
    const styleOptions = configurator.querySelectorAll('[data-panel="2"] .config-option');
    styleOptions.forEach(option => {
      option.addEventListener('click', () => {
        styleOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        stylePrice = parseInt(option.dataset.price) || 0;
        updatePrice();
      });
    });

    // Color swatch selection
    const swatchGroups = configurator.querySelectorAll('.color-swatches');
    swatchGroups.forEach(group => {
      const swatches = group.querySelectorAll('.color-swatch');
      swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
          swatches.forEach(s => s.classList.remove('selected'));
          swatch.classList.add('selected');
        });
      });
    });

    // Logo upload area hover
    const uploadArea = document.getElementById('logoUploadArea');
    if (uploadArea) {
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--color-accent)';
      });
      uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
      });
      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--color-accent)';
        uploadArea.innerHTML = '<p style="color: var(--color-accent); font-weight: 600;">Logo uploaded successfully!</p>';
      });
      uploadArea.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.click();
        input.addEventListener('change', () => {
          if (input.files.length) {
            uploadArea.innerHTML = '<p style="color: var(--color-accent); font-weight: 600;">' + input.files[0].name + ' selected</p>';
          }
        });
      });
    }
  }

  // ─── Bulk Order Form Validation ────────────
  function initBulkOrderForm() {
    const form = document.getElementById('bulkOrderForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset errors
      form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });

      // Validate required fields
      const name = document.getElementById('bulkName');
      const email = document.getElementById('bulkEmail');

      if (!name.value.trim()) {
        name.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        email.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (isValid) {
        const success = document.getElementById('bulkFormSuccess');
        if (success) {
          success.classList.add('visible');
          form.reset();
          setTimeout(() => success.classList.remove('visible'), 5000);
        }
      }
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ─── Initialize ────────────────────────────
  function init() {
    initKitConfigurator();
    initBulkOrderForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
