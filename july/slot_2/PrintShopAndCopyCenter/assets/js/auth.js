/* ============================================
   INKA — Auth JavaScript
   Login/Register form validation
   ============================================ */

'use strict';

const AuthManager = {
  init() {
    this.initLoginForm();
    this.initRegisterForm();
    this.initPasswordToggle();
  },

  initLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const email = form.querySelector('#login-email');
      const password = form.querySelector('#login-password');

      // Email validation
      if (!email.value.trim()) {
        this.showError(email, 'Email is required');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        this.showError(email, 'Please enter a valid email');
        valid = false;
      } else {
        this.clearError(email);
      }

      // Password validation
      if (!password.value.trim()) {
        this.showError(password, 'Password is required');
        valid = false;
      } else if (password.value.length < 6) {
        this.showError(password, 'Password must be at least 6 characters');
        valid = false;
      } else {
        this.clearError(password);
      }

      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Signing In...';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Success!';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
          }, 2000);
        }, 1500);
      }
    });

    // Clear errors on input
    form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => this.clearError(input));
    });
  },

  initRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name = form.querySelector('#reg-name');
      const email = form.querySelector('#reg-email');
      const phone = form.querySelector('#reg-phone');
      const password = form.querySelector('#reg-password');
      const confirmPassword = form.querySelector('#reg-confirm-password');
      const terms = form.querySelector('#reg-terms');

      // Name
      if (!name.value.trim()) {
        this.showError(name, 'Full name is required');
        valid = false;
      } else {
        this.clearError(name);
      }

      // Email
      if (!email.value.trim()) {
        this.showError(email, 'Email is required');
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        this.showError(email, 'Please enter a valid email');
        valid = false;
      } else {
        this.clearError(email);
      }

      // Phone
      if (!phone.value.trim()) {
        this.showError(phone, 'Phone number is required');
        valid = false;
      } else {
        this.clearError(phone);
      }

      // Password
      if (!password.value.trim()) {
        this.showError(password, 'Password is required');
        valid = false;
      } else if (password.value.length < 8) {
        this.showError(password, 'Password must be at least 8 characters');
        valid = false;
      } else {
        this.clearError(password);
      }

      // Confirm Password
      if (!confirmPassword.value.trim()) {
        this.showError(confirmPassword, 'Please confirm your password');
        valid = false;
      } else if (confirmPassword.value !== password.value) {
        this.showError(confirmPassword, 'Passwords do not match');
        valid = false;
      } else {
        this.clearError(confirmPassword);
      }

      // Terms
      if (!terms.checked) {
        const termsWrapper = terms.closest('.form-checkbox');
        if (termsWrapper) termsWrapper.style.color = 'var(--color-error)';
        valid = false;
      } else {
        const termsWrapper = terms.closest('.form-checkbox');
        if (termsWrapper) termsWrapper.style.color = '';
      }

      if (valid) {
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Creating Account...';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = 'Account Created!';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
          }, 2000);
        }, 1500);
      }
    });

    // Clear errors on input
    form.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => this.clearError(input));
    });
  },

  initPasswordToggle() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        const input = toggle.previousElementSibling || toggle.parentElement.querySelector('input');
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        const eyeOpen = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
        const eyeClosed = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
        toggle.innerHTML = isPassword ? eyeClosed : eyeOpen;
        toggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      });
    });
  },

  showError(input, message) {
    input.classList.add('error');
    let errorEl = input.parentElement.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  },

  clearError(input) {
    input.classList.remove('error');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AuthManager.init();
});
