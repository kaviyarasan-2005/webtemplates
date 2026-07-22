/* ================================================================
   WASH — Auth JavaScript
   Login/Register form handling, validation, social login
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   1. AUTH FORM VALIDATION
   ---------------------------------------------------------------- */
const AuthForm = {
  init() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validateLogin(loginForm)) {
          this.handleLogin(loginForm);
        }
      });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validateRegister(registerForm)) {
          this.handleRegister(registerForm);
        }
      });
    }

    // Live validation
    document.querySelectorAll('.auth-form-container .form-input').forEach(input => {
      input.addEventListener('blur', () => this.validateSingleField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          this.validateSingleField(input);
        }
      });
    });
  },

  validateSingleField(input) {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    let valid = true;
    let message = '';

    // Required
    if (input.required && !value) {
      valid = false;
      message = 'This field is required';
    }

    // Email
    if (valid && type === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        valid = false;
        message = 'Please enter a valid email address';
      }
    }

    // Password strength
    if (valid && type === 'password' && name === 'password' && value) {
      if (value.length < 8) {
        valid = false;
        message = 'Password must be at least 8 characters';
      }
    }

    // Confirm password
    if (valid && name === 'confirmPassword' && value) {
      const passwordInput = document.querySelector('input[name="password"]');
      if (passwordInput && value !== passwordInput.value) {
        valid = false;
        message = 'Passwords do not match';
      }
    }

    // Phone
    if (valid && type === 'tel' && value) {
      if (!/^[\+]?[0-9\s\-\(\)]{8,15}$/.test(value)) {
        valid = false;
        message = 'Please enter a valid phone number';
      }
    }

    // Full name
    if (valid && name === 'fullName' && value) {
      if (value.length < 2) {
        valid = false;
        message = 'Name must be at least 2 characters';
      }
    }

    this.setFieldState(input, valid, message);
    return valid;
  },

  setFieldState(input, valid, message) {
    const errorEl = input.closest('.form-group')?.querySelector('.form-error');
    if (valid) {
      input.classList.remove('error');
      if (errorEl) errorEl.style.display = 'none';
    } else {
      input.classList.add('error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      }
    }
  },

  validateLogin(form) {
    let valid = true;
    const email = form.querySelector('input[name="email"]');
    const password = form.querySelector('input[name="password"]');

    if (email && !this.validateSingleField(email)) valid = false;
    if (password && !this.validateSingleField(password)) valid = false;

    return valid;
  },

  validateRegister(form) {
    let valid = true;
    form.querySelectorAll('.form-input[required]').forEach(input => {
      if (!this.validateSingleField(input)) valid = false;
    });

    // Terms checkbox
    const terms = form.querySelector('input[name="terms"]');
    if (terms && !terms.checked) {
      valid = false;
      const termsError = terms.closest('.form-group')?.querySelector('.form-error');
      if (termsError) {
        termsError.textContent = 'You must accept the terms and conditions';
        termsError.style.display = 'block';
      }
    }

    return valid;
  },

  handleLogin(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing In...';

    // Simulate API call
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Show success or redirect
      const successEl = form.querySelector('.form-success');
      if (successEl) {
        successEl.textContent = 'Login successful! Redirecting...';
        successEl.style.display = 'block';
        successEl.style.animation = 'fadeInUp 0.4s ease';
      }
    }, 1500);
  },

  handleRegister(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      const successEl = form.querySelector('.form-success');
      if (successEl) {
        successEl.textContent = 'Account created! Please check your email to verify.';
        successEl.style.display = 'block';
        successEl.style.animation = 'fadeInUp 0.4s ease';
        form.reset();
      }
    }, 1500);
  }
};

/* ----------------------------------------------------------------
   2. PASSWORD STRENGTH INDICATOR
   ---------------------------------------------------------------- */
const PasswordStrength = {
  init() {
    const passwordInput = document.querySelector('input[name="password"]');
    const strengthBar = document.querySelector('.password-strength');

    if (!passwordInput || !strengthBar) return;

    passwordInput.addEventListener('input', () => {
      const value = passwordInput.value;
      const strength = this.calculate(value);
      this.updateUI(strengthBar, strength);
    });
  },

  calculate(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  },

  updateUI(bar, strength) {
    const levels = ['weak', 'fair', 'good', 'strong'];
    const colors = ['#E74C3C', '#F39C12', '#3498DB', '#2ECC71'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];

    const fill = bar.querySelector('.password-strength__fill');
    const label = bar.querySelector('.password-strength__label');

    if (fill) {
      fill.style.width = (strength / 4) * 100 + '%';
      fill.style.backgroundColor = colors[strength - 1] || '#E74C3C';
    }

    if (label) {
      label.textContent = labels[strength - 1] || '';
      label.style.color = colors[strength - 1] || '#E74C3C';
    }
  }
};

/* ----------------------------------------------------------------
   INITIALIZE
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  AuthForm.init();
  PasswordStrength.init();
});
