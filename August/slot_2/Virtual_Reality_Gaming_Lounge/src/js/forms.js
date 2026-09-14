document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

      inputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        const errorMsg = formGroup.querySelector('.form-error');

        // Reset
        formGroup.classList.remove('has-error');
        
        if (!input.value.trim()) {
          isValid = false;
          formGroup.classList.add('has-error');
          if (errorMsg) errorMsg.textContent = 'This field is required';
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          isValid = false;
          formGroup.classList.add('has-error');
          if (errorMsg) errorMsg.textContent = 'Please enter a valid email address';
        }
      });

      if (isValid) {
        // Handle form submission logic here (e.g., API call)
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="ph ph-spinner animate-spin"></i> Processing...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
          submitBtn.textContent = 'Success!';
          form.reset();
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 3000);
        }, 1500);
      }
    });
  });

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
});
