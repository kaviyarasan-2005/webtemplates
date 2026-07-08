/**
 * auth.js — Client-side validation for Login & Signup pages
 * LeatherCraft Bindery
 */

/* ── Utility ── */
function showError(input, errEl) {
  input.classList.add('is-error');
  if (errEl) errEl.style.display = 'block';
}

function clearError(input, errEl) {
  input.classList.remove('is-error');
  if (errEl) errEl.style.display = 'none';
}

function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

/* ────────────────────────────────────────────
   LOGIN FORM
──────────────────────────────────────────── */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  const emailInput    = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const emailErr      = document.getElementById('loginEmailErr');
  const passwordErr   = document.getElementById('loginPasswordErr');
  const submitBtn     = document.getElementById('loginSubmitBtn');

  /* Live clear on input */
  emailInput && emailInput.addEventListener('input', () => clearError(emailInput, emailErr));
  passwordInput && passwordInput.addEventListener('input', () => clearError(passwordInput, passwordErr));

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    if (!isValidEmail(emailInput.value)) {
      showError(emailInput, emailErr);
      valid = false;
    } else {
      clearError(emailInput, emailErr);
    }

    if (!passwordInput.value.trim()) {
      showError(passwordInput, passwordErr);
      valid = false;
    } else {
      clearError(passwordInput, passwordErr);
    }

    if (!valid) return;

    /* Simulate submit — replace with real auth call */
    submitBtn.textContent = 'Signing in…';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.textContent = '✓ Signed In!';
      submitBtn.style.background = '#2a7a5a';
    }, 1200);
  });
}

/* ────────────────────────────────────────────
   SIGNUP FORM
──────────────────────────────────────────── */
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  const firstName     = document.getElementById('signupFirstName');
  const lastName      = document.getElementById('signupLastName');
  const emailInput    = document.getElementById('signupEmail');
  const passwordInput = document.getElementById('signupPassword');
  const confirmInput  = document.getElementById('signupConfirmPassword');
  const termsInput    = document.getElementById('signupTerms');
  const submitBtn     = document.getElementById('signupSubmitBtn');

  const firstNameErr  = document.getElementById('signupFirstNameErr');
  const lastNameErr   = document.getElementById('signupLastNameErr');
  const emailErr      = document.getElementById('signupEmailErr');
  const passwordErr   = document.getElementById('signupPasswordErr');
  const confirmErr    = document.getElementById('signupConfirmPasswordErr');

  const strengthLabel = document.getElementById('passwordStrengthLabel');
  const strengthBar   = document.getElementById('passwordStrengthBar');

  /* Live clear on input */
  firstName    && firstName.addEventListener('input',    () => clearError(firstName, firstNameErr));
  lastName     && lastName.addEventListener('input',     () => clearError(lastName, lastNameErr));
  emailInput   && emailInput.addEventListener('input',   () => clearError(emailInput, emailErr));
  confirmInput && confirmInput.addEventListener('input', () => clearError(confirmInput, confirmErr));

  /* Password strength meter */
  if (passwordInput && strengthBar && strengthLabel) {
    passwordInput.addEventListener('input', function () {
      clearError(passwordInput, passwordErr);
      const val = this.value;
      let score = 0;
      if (val.length >= 8)  score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
      const colors = ['', '#e05c5c', '#f0a04b', '#c4a962', '#2f5d50'];
      const widths = ['0%', '25%', '50%', '75%', '100%'];

      strengthBar.style.width    = widths[score]  || '0%';
      strengthBar.style.background = colors[score] || 'rgba(255,255,255,0.1)';
      strengthLabel.textContent  = val.length ? `Strength: ${labels[score] || ''}` : '';
    });
  }

  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    if (!firstName.value.trim()) {
      showError(firstName, firstNameErr); valid = false;
    } else { clearError(firstName, firstNameErr); }

    if (!lastName.value.trim()) {
      showError(lastName, lastNameErr); valid = false;
    } else { clearError(lastName, lastNameErr); }

    if (!isValidEmail(emailInput.value)) {
      showError(emailInput, emailErr); valid = false;
    } else { clearError(emailInput, emailErr); }

    if (passwordInput.value.trim().length < 8) {
      showError(passwordInput, passwordErr); valid = false;
    } else { clearError(passwordInput, passwordErr); }

    if (confirmInput.value !== passwordInput.value || !confirmInput.value) {
      showError(confirmInput, confirmErr); valid = false;
    } else { clearError(confirmInput, confirmErr); }

    if (!termsInput.checked) {
      termsInput.style.outline = '2px solid #e05c5c';
      valid = false;
    } else {
      termsInput.style.outline = '';
    }

    if (!valid) return;

    /* Simulate submit — replace with real auth call */
    submitBtn.textContent = 'Creating account…';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.textContent = '✓ Account Created!';
      submitBtn.style.background = '#2a7a5a';
    }, 1400);
  });
}
