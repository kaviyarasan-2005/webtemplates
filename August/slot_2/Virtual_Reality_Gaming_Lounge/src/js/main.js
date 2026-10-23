document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Set initial theme based on saved value or default to dark for gaming lounge aesthetic
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  function handleThemeToggle() {
    let theme = document.documentElement.getAttribute('data-theme');
    let targetTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    updateThemeIcon(targetTheme);
  }

  if (themeToggle) themeToggle.addEventListener('click', handleThemeToggle);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', handleThemeToggle);

  function updateThemeIcon(theme) {
    const themeIcons = document.querySelectorAll('#theme-toggle i, #theme-toggle-mobile i');
    themeIcons.forEach(icon => {
      icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
    });
  }

  // --- RTL Toggle ---
  const rtlToggle = document.getElementById('rtl-toggle');
  const rtlToggleMobile = document.getElementById('rtl-toggle-mobile');
  const currentDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.setAttribute('dir', currentDir);
  updateRtlButtonText(currentDir);

  function updateRtlButtonText(dir) {
    const text = dir === 'rtl' ? 'LTR' : 'RTL';
    if (rtlToggle) rtlToggle.textContent = text;
    if (rtlToggleMobile) rtlToggleMobile.textContent = text;
  }

  function handleRtlToggle() {
    let dir = document.documentElement.getAttribute('dir');
    let targetDir = dir === 'ltr' ? 'rtl' : 'ltr';
    
    document.documentElement.setAttribute('dir', targetDir);
    localStorage.setItem('dir', targetDir);
    updateRtlButtonText(targetDir);
  }

  if (rtlToggle) rtlToggle.addEventListener('click', handleRtlToggle);
  if (rtlToggleMobile) rtlToggleMobile.addEventListener('click', handleRtlToggle);

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
        // Close all accordion groups when menu closes
        document.querySelectorAll('.mob-group-btn.open').forEach(btn => {
          btn.classList.remove('open');
          btn.nextElementSibling.classList.remove('open');
        });
      }
    });
  }

  // --- Mobile Accordion Dropdowns ---
  document.querySelectorAll('.mob-group-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('open');
      // Close all groups first
      document.querySelectorAll('.mob-group-btn').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
      });
      // Toggle clicked group
      if (!isOpen) {
        btn.classList.add('open');
        btn.nextElementSibling.classList.add('open');
      }
    });
  });

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
