/* ============================================
   DRIV — Auth JavaScript
   Login & Register page functionality
   ============================================ */

(function () {
  'use strict';

  // ---- Password Toggle ----
  const PasswordToggle = {
    init() {
      document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          const wrapper = btn.closest('.password-wrapper');
          const input = wrapper.querySelector('input');
          const icon = btn.querySelector('i');

          if (input.type === 'password') {
            input.type = 'text';
            icon.setAttribute('data-lucide', 'eye-off');
          } else {
            input.type = 'password';
            icon.setAttribute('data-lucide', 'eye');
          }

          if (typeof lucide !== 'undefined') lucide.createIcons();
        });
      });
    }
  };

  // ---- Form Validation ----
  const FormValidation = {
    init() {
      const loginForm = document.getElementById('login-form');
      const registerForm = document.getElementById('register-form');

      if (loginForm) this.setupLogin(loginForm);
      if (registerForm) this.setupRegister(registerForm);
    },

    showError(input, message) {
      const group = input.closest('.form-group');
      input.classList.add('form-control--error');
      let errorEl = group.querySelector('.form-error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error';
        group.appendChild(errorEl);
      }
      errorEl.textContent = message;
    },

    clearError(input) {
      const group = input.closest('.form-group');
      input.classList.remove('form-control--error');
      const errorEl = group.querySelector('.form-error');
      if (errorEl) errorEl.remove();
    },

    clearAllErrors(form) {
      form.querySelectorAll('.form-control--error').forEach(el => el.classList.remove('form-control--error'));
      form.querySelectorAll('.form-error').forEach(el => el.remove());
    },

    validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    validatePhone(phone) {
      return /^[\+]?[0-9\s\-\(\)]{7,15}$/.test(phone);
    },

    setupLogin(form) {
      // Real-time validation
      form.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('blur', () => this.validateLoginField(input));
        input.addEventListener('input', () => this.clearError(input));
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.clearAllErrors(form);

        const email = form.querySelector('#login-email');
        const password = form.querySelector('#login-password');
        let valid = true;

        if (!email.value.trim()) {
          this.showError(email, 'Email is required');
          valid = false;
        } else if (!this.validateEmail(email.value)) {
          this.showError(email, 'Please enter a valid email');
          valid = false;
        }

        if (!password.value) {
          this.showError(password, 'Password is required');
          valid = false;
        } else if (password.value.length < 6) {
          this.showError(password, 'Password must be at least 6 characters');
          valid = false;
        }

        if (valid) {
          const btn = form.querySelector('button[type="submit"]');
          btn.textContent = 'Signing In...';
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = 'Sign In';
            btn.disabled = false;
            // Demo: show success
            this.showSuccess(form, 'Login successful! Redirecting...');
          }, 1500);
        }
      });
    },

    validateLoginField(input) {
      this.clearError(input);
      if (input.id === 'login-email') {
        if (!input.value.trim()) this.showError(input, 'Email is required');
        else if (!this.validateEmail(input.value)) this.showError(input, 'Please enter a valid email');
      }
      if (input.id === 'login-password') {
        if (!input.value) this.showError(input, 'Password is required');
      }
    },

    setupRegister(form) {
      form.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('blur', () => this.validateRegisterField(input, form));
        input.addEventListener('input', () => this.clearError(input));
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.clearAllErrors(form);

        const name = form.querySelector('#reg-name');
        const email = form.querySelector('#reg-email');
        const phone = form.querySelector('#reg-phone');
        const password = form.querySelector('#reg-password');
        const confirmPassword = form.querySelector('#reg-confirm-password');
        const terms = form.querySelector('#reg-terms');
        let valid = true;

        if (!name.value.trim()) {
          this.showError(name, 'Full name is required');
          valid = false;
        }

        if (!email.value.trim()) {
          this.showError(email, 'Email is required');
          valid = false;
        } else if (!this.validateEmail(email.value)) {
          this.showError(email, 'Please enter a valid email');
          valid = false;
        }

        if (!phone.value.trim()) {
          this.showError(phone, 'Phone number is required');
          valid = false;
        } else if (!this.validatePhone(phone.value)) {
          this.showError(phone, 'Please enter a valid phone number');
          valid = false;
        }

        if (!password.value) {
          this.showError(password, 'Password is required');
          valid = false;
        } else if (password.value.length < 8) {
          this.showError(password, 'Password must be at least 8 characters');
          valid = false;
        }

        if (!confirmPassword.value) {
          this.showError(confirmPassword, 'Please confirm your password');
          valid = false;
        } else if (confirmPassword.value !== password.value) {
          this.showError(confirmPassword, 'Passwords do not match');
          valid = false;
        }

        if (!terms.checked) {
          const group = terms.closest('.form-group') || terms.closest('.checkbox-group').parentElement;
          let errorEl = group.querySelector('.form-error');
          if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'form-error';
            group.appendChild(errorEl);
          }
          errorEl.textContent = 'You must accept the Terms of Service';
          valid = false;
        }

        if (valid) {
          const btn = form.querySelector('button[type="submit"]');
          btn.textContent = 'Creating Account...';
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = 'Create Account';
            btn.disabled = false;
            this.showSuccess(form, 'Account created successfully! Redirecting...');
          }, 1500);
        }
      });
    },

    validateRegisterField(input, form) {
      this.clearError(input);
      const id = input.id;

      if (id === 'reg-name' && !input.value.trim()) {
        this.showError(input, 'Full name is required');
      }
      if (id === 'reg-email') {
        if (!input.value.trim()) this.showError(input, 'Email is required');
        else if (!this.validateEmail(input.value)) this.showError(input, 'Please enter a valid email');
      }
      if (id === 'reg-phone') {
        if (!input.value.trim()) this.showError(input, 'Phone number is required');
        else if (!this.validatePhone(input.value)) this.showError(input, 'Please enter a valid phone number');
      }
      if (id === 'reg-password') {
        if (!input.value) this.showError(input, 'Password is required');
        else if (input.value.length < 8) this.showError(input, 'Password must be at least 8 characters');
      }
      if (id === 'reg-confirm-password') {
        const password = form.querySelector('#reg-password');
        if (!input.value) this.showError(input, 'Please confirm your password');
        else if (input.value !== password.value) this.showError(input, 'Passwords do not match');
      }
    },

    showSuccess(form, message) {
      let successEl = form.querySelector('.form-success');
      if (!successEl) {
        successEl = document.createElement('div');
        successEl.className = 'form-success';
        successEl.style.cssText = 'background:rgba(46,204,113,0.1);color:#2ECC71;padding:12px 16px;border-radius:6px;font-size:14px;font-weight:500;text-align:center;margin-top:16px;';
        form.appendChild(successEl);
      }
      successEl.textContent = message;
      setTimeout(() => successEl.remove(), 4000);
    }
  };

  // ---- Init ----
  function init() {
    PasswordToggle.init();
    FormValidation.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
