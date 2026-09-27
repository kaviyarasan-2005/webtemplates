/* ============================================
   BREW — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
  const themeToggle = document.querySelectorAll('[data-theme-toggle]');
  const savedTheme = localStorage.getItem('brew-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('brew-theme', next);
      updateToggleIcons();
    });
  });

  function updateToggleIcons() {
    const theme = document.documentElement.getAttribute('data-theme');
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'ph-fill ph-sun' : 'ph-fill ph-moon';
      }
    });
  }
  updateToggleIcons();

  // --- RTL/LTR Toggle ---
  const rtlToggle = document.querySelectorAll('[data-rtl-toggle]');
  const savedDir = localStorage.getItem('brew-dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);

  rtlToggle.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir');
      const next = current === 'ltr' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', next);
      localStorage.setItem('brew-dir', next);
      updateRTLToggles();
    });
  });

  function updateRTLToggles() {
    const dir = document.documentElement.getAttribute('dir');
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.textContent = dir === 'ltr' ? 'LTR' : 'RTL';
    });
  }
  updateRTLToggles();

  // --- Navbar Dropdown (click-accessible) ---
  document.querySelectorAll('.navbar__dropdown-wrapper').forEach(wrapper => {
    const trigger = wrapper.querySelector('.navbar__link');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      const isCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
      if (!isCoarse) return;
      e.preventDefault();
      wrapper.classList.toggle('dropdown-open');
    });

    wrapper.querySelectorAll('.navbar__dropdown a').forEach(item => {
      item.addEventListener('click', () => wrapper.classList.remove('dropdown-open'));
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar__dropdown-wrapper')) {
      document.querySelectorAll('.navbar__dropdown-wrapper.dropdown-open').forEach(w => {
        w.classList.remove('dropdown-open');
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.navbar__dropdown-wrapper.dropdown-open').forEach(w => {
        w.classList.remove('dropdown-open');
      });
    }
  });

  // --- Navbar Scroll ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --- Mobile Menu ---
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealStaggerElements = document.querySelectorAll('.reveal-stagger');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));
  revealStaggerElements.forEach(el => revealObserver.observe(el));

  // --- Accordion ---
  document.querySelectorAll('.accordion__header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion__body');
      const content = item.querySelector('.accordion__content');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.accordion__item').forEach(other => {
        other.classList.remove('active');
        other.querySelector('.accordion__body').style.maxHeight = '0';
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // --- Filter Pills ---
  document.querySelectorAll('.filter-pills').forEach(container => {
    container.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        container.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.getAttribute('data-filter');
        const grid = container.nextElementSibling;
        if (grid) {
          grid.querySelectorAll('[data-category]').forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });
        }
      });
    });
  });

  // --- Number Count Up Animation ---
  const countElements = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const start = performance.now();

        function animate(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          el.textContent = prefix + current.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  countElements.forEach(el => countObserver.observe(el));

  // --- Form Validation ---
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          valid = false;
          group.classList.add('error');
          const msg = group.querySelector('.error-message');
          if (msg) msg.textContent = 'This field is required';
        } else {
          group.classList.remove('error');
        }

        if (input.type === 'email' && input.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value)) {
            valid = false;
            group.classList.add('error');
            const msg = group.querySelector('.error-message');
            if (msg) msg.textContent = 'Please enter a valid email';
          }
        }

        if (input.name === 'password' && input.value && input.value.length < 8) {
          valid = false;
          group.classList.add('error');
          const msg = group.querySelector('.error-message');
          if (msg) msg.textContent = 'Password must be at least 8 characters';
        }

        if (input.name === 'confirm_password' && input.value) {
          const pw = form.querySelector('[name="password"]');
          if (pw && input.value !== pw.value) {
            valid = false;
            group.classList.add('error');
            const msg = group.querySelector('.error-message');
            if (msg) msg.textContent = 'Passwords do not match';
          }
        }
      });

      if (!valid) e.preventDefault();
    });

    form.querySelectorAll('[required]').forEach(input => {
      input.addEventListener('blur', () => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          group.classList.add('error');
          const msg = group.querySelector('.error-message');
          if (msg) msg.textContent = 'This field is required';
        } else {
          group.classList.remove('error');
        }
      });
    });
  });

  // --- Password Toggle ---
  document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.closest('.form-group').querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        toggle.className = 'ph-fill ph-eye-slash password-toggle';
      } else {
        input.type = 'password';
        toggle.className = 'ph-fill ph-eye password-toggle';
      }
    });
  });

  // --- Smooth Scroll to Top ---
  document.querySelectorAll('a[href="#top"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // --- Dashboard Sidebar Toggle (Desktop) ---
  const sidebar = document.querySelector('.dashboard__sidebar');
  const sidebarToggleBtn = document.querySelector('.sidebar-toggle');
  if (sidebar && sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // --- Dashboard Sidebar Mobile ---
  const sidebarHamburger = document.querySelector('.dashboard__hamburger');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');
  if (sidebarHamburger && sidebar) {
    sidebarHamburger.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      sidebarOverlay.classList.toggle('active');
    });
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        sidebarOverlay.classList.remove('active');
      });
    }
  }

  // --- Login/Register Toggle ---
  const authToggle = document.querySelectorAll('[data-auth-toggle]');
  authToggle.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-auth-toggle');
      const loginCard = document.querySelector('.auth-login');
      const registerCard = document.querySelector('.auth-register');
      if (target === 'register') {
        loginCard.style.display = 'none';
        registerCard.style.display = 'block';
      } else {
        loginCard.style.display = 'block';
        registerCard.style.display = 'none';
      }
    });
  });
});
