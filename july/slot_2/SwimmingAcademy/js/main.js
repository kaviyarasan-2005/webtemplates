document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Check system preference
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.classList.remove('ri-moon-line');
        themeIcon.classList.add('ri-sun-line');
      } else {
        themeIcon.classList.remove('ri-sun-line');
        themeIcon.classList.add('ri-moon-line');
      }
    }
  }

  // --- RTL/LTR Toggle ---
  const dirToggle = document.getElementById('dir-toggle');
  const savedDir = localStorage.getItem('dir');
  
  if (savedDir) {
    document.documentElement.setAttribute('dir', savedDir);
    updateDirText(savedDir);
  } else {
    updateDirText('ltr');
  }

  if (dirToggle) {
    dirToggle.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir');
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('dir', newDir);
      updateDirText(newDir);
    });
  }

  function updateDirText(dir) {
    if (dirToggle) {
      dirToggle.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    }
  }

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('ri-menu-3-line');
        icon.classList.add('ri-close-line');
      } else {
        icon.classList.remove('ri-close-line');
        icon.classList.add('ri-menu-3-line');
      }
    });

    // Close menu when clicking links on mobile
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Don't close the menu if clicking a dropdown toggle
        if (link.nextElementSibling && link.nextElementSibling.classList.contains('dropdown-menu')) {
          e.preventDefault();
          return;
        }

        if (window.innerWidth <= 1024) {
          navMenu.classList.remove('active');
          const icon = mobileToggle.querySelector('i');
          if (icon) {
            icon.classList.remove('ri-close-line');
            icon.classList.add('ri-menu-3-line');
          }
        }
      });
    });
  }

  // Mobile Dropdown Toggle
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        dropdown.classList.toggle('active');
      }
    });
  });

  // --- Form Validation ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      
      const inputs = contactForm.querySelectorAll('.form-control[required]');
      inputs.forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          isValid = false;
          group.classList.add('has-error');
        } else {
          group.classList.remove('has-error');
          if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
              isValid = false;
              group.classList.add('has-error');
            }
          }
        }
      });
      
      if (isValid) {
        // Mock successful submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          alert('Message sent successfully!');
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 1500);
      }
    });
    
    // Real-time validation
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (input.hasAttribute('required') && input.value.trim()) {
          group.classList.remove('has-error');
        }
      });
    });
  }
});
