/**
 * Main JavaScript File
 * Handles toggles, mobile menu, form validation, skeleton loaders
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initRTLToggle();
  initMobileMenu();
  initFormValidation();
  simulateSkeletonLoading();
});

/* Theme Toggle (Dark/Light) */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  // Check system preference or local storage
  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  }

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#theme-toggle i');
  if (!icon) return;
  if (theme === 'dark') {
    // Lucide moon icon
    icon.setAttribute('data-lucide', 'sun');
  } else {
    // Lucide sun icon
    icon.setAttribute('data-lucide', 'moon');
  }
  // Re-render lucide icons if library is loaded
  if (window.lucide) {
    lucide.createIcons();
  }
}

/* RTL Toggle */
function initRTLToggle() {
  const toggleBtn = document.getElementById('rtl-toggle');
  if (!toggleBtn) return;

  const savedDir = localStorage.getItem('dir');
  if (savedDir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  toggleBtn.addEventListener('click', () => {
    const currentDir = document.documentElement.getAttribute('dir');
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem('dir', newDir);
  });
}

/* Mobile Menu */
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      if (window.lucide) lucide.createIcons();
    });
  }

  // Handle dropdowns on mobile
  const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (window.innerWidth <= 1023) {
        if(e.target.classList.contains('nav-link')) {
          e.preventDefault();
          item.classList.toggle('active');
        }
      }
    });
  });
}

/* Form Validation */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const inputs = form.querySelectorAll('.form-control[required]');
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('invalid');
          isValid = false;
        } else {
          input.classList.remove('invalid');
        }
        
        // Basic email check
        if (input.type === 'email' && input.value.trim()) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(input.value)) {
            input.classList.add('invalid');
            isValid = false;
          }
        }
      });

      if (isValid) {
        // Simulate successful submit
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="loader" class="spin"></i> Sending...';
        if (window.lucide) lucide.createIcons();
        btn.disabled = true;

        setTimeout(() => {
          form.reset();
          btn.innerHTML = '<i data-lucide="check"></i> Sent Successfully';
          if (window.lucide) lucide.createIcons();
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            if (window.lucide) lucide.createIcons();
          }, 3000);
        }, 1500);
      }
    });

    // Remove invalid class on input
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('invalid');
      });
    });
  });
}

/* Simulate Skeleton Loading for dynamic content sections */
function simulateSkeletonLoading() {
  const skeletons = document.querySelectorAll('.skeleton-wrapper');
  if (skeletons.length === 0) return;

  setTimeout(() => {
    skeletons.forEach(wrapper => {
      wrapper.style.display = 'none';
      const realContent = wrapper.nextElementSibling;
      if (realContent && realContent.classList.contains('real-content')) {
        realContent.style.display = 'block'; // or flex/grid based on parent
      }
    });
  }, 1500); // 1.5s simulated load
}
