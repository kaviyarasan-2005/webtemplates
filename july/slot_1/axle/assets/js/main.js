document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const theme = localStorage.getItem('axle-theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeIcons();

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('axle-theme', next);
      updateThemeIcons();
    });
  });

  function updateThemeIcons() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerHTML = isDark
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      const mobileLabel = btn.closest('.mobile-toggles');
      if (mobileLabel) {
        const label = btn.querySelector('.toggle-label');
        if (label) label.textContent = isDark ? 'Light' : 'Dark';
      }
    });
  }

  // RTL Toggle
  const savedDir = localStorage.getItem('axle-dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
  document.documentElement.setAttribute('data-dir', savedDir);
  updateRTLIcons();

  document.querySelectorAll('.rtl-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir');
      const next = current === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', next);
      document.documentElement.setAttribute('data-dir', next);
      localStorage.setItem('axle-dir', next);
      updateRTLIcons();
    });
  });

  function updateRTLIcons() {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    document.querySelectorAll('.rtl-toggle').forEach(btn => {
      const label = btn.querySelector('.toggle-label');
      if (label) label.textContent = isRTL ? 'RTL' : 'LTR';
      else btn.textContent = isRTL ? 'RTL' : 'LTR';
    });
  }

  // Navbar Scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Mobile Menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      if (mobileOverlay) mobileOverlay.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  }

  // Mobile Dropdown Toggle
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggle.classList.toggle('open');
      const dropdown = toggle.nextElementSibling;
      if (dropdown) dropdown.classList.toggle('open');
    });
  });

  // Scroll Reveal
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item.active').forEach(open => {
        open.classList.remove('active');
        open.querySelector('.faq-answer').style.maxHeight = '0';
      });
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Contact Form Validation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          group.classList.add('has-error');
          valid = false;
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          group.classList.add('has-error');
          valid = false;
        } else {
          group.classList.remove('has-error');
        }
      });
      if (valid) {
        alert('Message sent successfully!');
        contactForm.reset();
      }
    });
  }

  // Newsletter Form
  document.querySelectorAll('.newsletter-form, .notify-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        alert('Subscribed successfully!');
        form.reset();
      }
    });
  });

  // Login/Register Form
  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      authForm.querySelectorAll('[required]').forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          group.classList.add('has-error');
          valid = false;
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          group.classList.add('has-error');
          valid = false;
        } else {
          group.classList.remove('has-error');
        }
      });
      if (valid) {
        window.location.href = '../pages/admin-dashboard.html';
      }
    });
  }

  // Password Toggle
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
      } else {
        input.type = 'password';
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
      }
    });
  });

  // Auth Toggle (Login/Register)
  document.querySelectorAll('.auth-toggle-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const loginCard = document.getElementById('loginCard');
      const registerCard = document.getElementById('registerCard');
      if (loginCard && registerCard) {
        loginCard.style.display = loginCard.style.display === 'none' ? 'block' : 'none';
        registerCard.style.display = registerCard.style.display === 'none' ? 'block' : 'none';
      }
    });
  });

  // Blog Filter
  document.querySelectorAll('.blog-filter button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.blog-filter button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      document.querySelectorAll('.blog-card[data-category]').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
      });
    });
  });

  // Hero animation
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
    setTimeout(() => {
      heroContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 100);
  }

  // Active Nav Link
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) {
      link.classList.add('active');
    }
  });
});
