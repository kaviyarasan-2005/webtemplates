/**
 * Main JavaScript for Bookshop & Stationery Store
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initDirectionToggle();
  initMobileNav();
  initFormValidation();
});

// 1. Theme Toggle (Dark/Light)
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcon('light');
  }

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  // Using Phosphor icons classes
  if (theme === 'dark') {
    themeBtn.innerHTML = '<i class="ph ph-sun"></i>';
  } else {
    themeBtn.innerHTML = '<i class="ph ph-moon"></i>';
  }
}

// 2. Layout Direction (RTL/LTR)
function initDirectionToggle() {
  const dirBtn = document.getElementById('dir-toggle');
  if (!dirBtn) return;

  const savedDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
  dirBtn.textContent = savedDir === 'ltr' ? 'RTL' : 'LTR';

  dirBtn.addEventListener('click', () => {
    const currentDir = document.documentElement.getAttribute('dir');
    const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem('dir', newDir);
    dirBtn.textContent = newDir === 'ltr' ? 'RTL' : 'LTR';
  });
}

// 3. Mobile Navigation
function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('ph-list');
        icon.classList.add('ph-x');
      } else {
        icon.classList.remove('ph-x');
        icon.classList.add('ph-list');
      }
    });
  }

  // Handle dropdown in mobile view
  const dropdownToggles = document.querySelectorAll('.nav-item.dropdown > a');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        toggle.parentElement.classList.toggle('show-dropdown');
      }
    });
  });
}

// 4. Client-side Form Validation
function initFormValidation() {
  const forms = document.querySelectorAll('.needs-validation');
  
  forms.forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
      
      // Custom error messages display
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('form-error')) {
          if (!input.validity.valid) {
            errorMsg.style.display = 'block';
          } else {
            errorMsg.style.display = 'none';
          }
        }
      });
    }, false);
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('form-error')) {
          if (input.validity.valid) {
            errorMsg.style.display = 'none';
          }
        }
      });
    });
  });
}
