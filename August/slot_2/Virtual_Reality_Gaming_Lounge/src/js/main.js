document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Set initial theme based on system preference or saved value
  const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  if (themeToggle) {
    // Update icon initially
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let targetTheme = theme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('theme', targetTheme);
      updateThemeIcon(targetTheme);
    });
  }

  function updateThemeIcon(theme) {
    if(!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if(icon) {
      if(theme === 'dark') {
        icon.className = 'ph ph-sun';
      } else {
        icon.className = 'ph ph-moon';
      }
    }
  }

  // --- RTL Toggle ---
  const rtlToggle = document.getElementById('rtl-toggle');
  const currentDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.setAttribute('dir', currentDir);

  if (rtlToggle) {
    rtlToggle.addEventListener('click', () => {
      let dir = document.documentElement.getAttribute('dir');
      let targetDir = dir === 'ltr' ? 'rtl' : 'ltr';
      
      document.documentElement.setAttribute('dir', targetDir);
      localStorage.setItem('dir', targetDir);
      
      // Update button text if needed
      rtlToggle.textContent = targetDir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  // --- Mobile Menu ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (mobileMenu.classList.contains('active')) {
        icon.className = 'ph ph-x';
      } else {
        icon.className = 'ph ph-list';
      }
    });
  }

  // --- Skeleton Loaders ---
  // Simulate loading dynamic content
  const skeletons = document.querySelectorAll('.skeleton-wrapper');
  if (skeletons.length > 0) {
    setTimeout(() => {
      skeletons.forEach(wrapper => {
        const skeleton = wrapper.querySelector('.skeleton');
        const content = wrapper.querySelector('.content-loaded');
        if (skeleton) skeleton.classList.add('hidden');
        if (content) content.classList.remove('hidden');
      });
    }, 1500); // Simulate network delay
  }

  // --- Scroll Animations (Hover/Reveal) ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    observer.observe(el);
  });
});
