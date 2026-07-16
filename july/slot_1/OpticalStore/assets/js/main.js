/**
 * main.js – VisionCare Optical
 * Form validation, scroll reveal, counter animation, interactions
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     SCROLL REVEAL
     ══════════════════════════════════════════════════════════ */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* ══════════════════════════════════════════════════════════
     COUNTER ANIMATION
     ══════════════════════════════════════════════════════════ */
  function animateCounter(el, target, suffix = '', duration = 2000) {
    const start     = 0;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current  = Math.round(start + (target - start) * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el     = entry.target;
            const target = parseInt(el.dataset.counter, 10);
            const suffix = el.dataset.suffix || '';
            animateCounter(el, target, suffix);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* ══════════════════════════════════════════════════════════
     FORM VALIDATION
     ══════════════════════════════════════════════════════════ */
  const validators = {
    required: (val) => val.trim().length > 0,
    email:    (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
    phone:    (val) => /^[\+]?[\d\s\-\(\)]{7,15}$/.test(val.trim()),
    minlen:   (val, len) => val.trim().length >= parseInt(len, 10),
    match:    (val, id) => {
      const target = document.getElementById(id);
      return target ? val === target.value : false;
    }
  };

  const errorMessages = {
    required: 'This field is required.',
    email:    'Please enter a valid email address.',
    phone:    'Please enter a valid phone number.',
    minlen:   (len) => `Must be at least ${len} characters.`,
    match:    'Passwords do not match.'
  };

  function validateField(input) {
    const rules     = (input.dataset.validate || '').split('|').filter(Boolean);
    const errorEl   = document.getElementById(input.id + '-error');
    let   valid     = true;
    let   message   = '';

    for (const rule of rules) {
      const [ruleName, ruleArg] = rule.split(':');
      const fn = validators[ruleName];
      if (!fn) continue;

      if (!fn(input.value, ruleArg)) {
        valid   = false;
        message = typeof errorMessages[ruleName] === 'function'
          ? errorMessages[ruleName](ruleArg)
          : errorMessages[ruleName] || `Invalid ${ruleName}`;
        break;
      }
    }

    input.classList.toggle('error',   !valid);
    input.classList.toggle('success',  valid && input.value.trim() !== '');

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.toggle('visible', !valid);
    }

    return valid;
  }

  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate-form]');

    forms.forEach((form) => {
      const inputs = form.querySelectorAll('[data-validate]');

      // Validate on blur
      inputs.forEach((input) => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) validateField(input);
        });
      });

      // Validate on submit
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let allValid = true;

        inputs.forEach((input) => {
          if (!validateField(input)) allValid = false;
        });

        if (allValid) {
          handleFormSubmit(form);
        } else {
          const firstError = form.querySelector('.form-control.error');
          if (firstError) firstError.focus();
        }
      });
    });
  }

  function handleFormSubmit(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    const formType  = form.dataset.formType || 'generic';

    if (submitBtn) {
      const origText     = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin" aria-hidden="true"></i> Sending...';
      submitBtn.disabled  = true;

      setTimeout(() => {
        submitBtn.innerHTML = origText;
        submitBtn.disabled  = false;

        const messages = {
          contact:     'Message sent! We will get back to you within 24 hours.',
          appointment: 'Appointment booked! Check your email for confirmation.',
          login:       'Login successful! Redirecting...',
          signup:      'Account created! Welcome to VisionCare.',
          generic:     'Submitted successfully!'
        };

        if (window.showToast) {
          window.showToast(messages[formType] || messages.generic, 'success');
        }

        // Show success state
        const successEl = form.querySelector('[data-form-success]');
        if (successEl) {
          form.style.display = 'none';
          successEl.style.display = 'block';
        } else {
          form.reset();
          form.querySelectorAll('.form-control').forEach(i => {
            i.classList.remove('success', 'error');
          });
        }

        // Redirect for login/signup (placeholder)
        if (formType === 'login') {
          setTimeout(() => { window.location.href = '../index.html'; }, 1200);
        }
      }, 1400);
    }
  }

  /* ══════════════════════════════════════════════════════════
     PASSWORD TOGGLE
     ══════════════════════════════════════════════════════════ */
  function initPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        }
        btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     TIME SLOT SELECTION
     ══════════════════════════════════════════════════════════ */
  function initTimeSlots() {
    document.querySelectorAll('.time-slot-grid').forEach((grid) => {
      grid.querySelectorAll('.time-slot:not(.unavailable)').forEach((slot) => {
        slot.addEventListener('click', () => {
          grid.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
          slot.classList.add('selected');

          const hiddenInput = grid.closest('form')?.querySelector('[name="appointment_time"]');
          if (hiddenInput) hiddenInput.value = slot.textContent.trim();
        });
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     COUNTDOWN TIMER (Coming Soon page)
     ══════════════════════════════════════════════════════════ */
  function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    const target = new Date(countdownEl.dataset.target || '2026-12-01T00:00:00');

    function update() {
      const now  = new Date();
      const diff = target - now;

      if (diff <= 0) {
        countdownEl.innerHTML = '<p style="color:var(--color-primary);font-size:2rem;font-weight:bold;">We are LIVE!</p>';
        return;
      }

      const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = n => String(n).padStart(2, '0');

      document.getElementById('cd-days')    && (document.getElementById('cd-days').textContent    = pad(days));
      document.getElementById('cd-hours')   && (document.getElementById('cd-hours').textContent   = pad(hours));
      document.getElementById('cd-minutes') && (document.getElementById('cd-minutes').textContent = pad(minutes));
      document.getElementById('cd-seconds') && (document.getElementById('cd-seconds').textContent = pad(seconds));
    }

    update();
    setInterval(update, 1000);
  }

  /* ══════════════════════════════════════════════════════════
     TABS
     ══════════════════════════════════════════════════════════ */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach((container) => {
      const triggers = container.querySelectorAll('[data-tab]');
      const panels   = container.querySelectorAll('[data-tab-panel]');

      triggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
          const target = trigger.dataset.tab;

          triggers.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });

          panels.forEach(p => {
            p.hidden = p.dataset.tabPanel !== target;
          });

          trigger.classList.add('active');
          trigger.setAttribute('aria-selected', 'true');
        });
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     STICKY HEADER OFFSET FOR ANCHOR LINKS
     ══════════════════════════════════════════════════════════ */
  function handleAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     ACCORDION
     ══════════════════════════════════════════════════════════ */
  function initAccordion() {
    document.querySelectorAll('[data-accordion]').forEach((container) => {
      const items = container.querySelectorAll('[data-accordion-item]');

      items.forEach((item) => {
        const trigger = item.querySelector('[data-accordion-trigger]');
        const panel   = item.querySelector('[data-accordion-panel]');

        if (!trigger || !panel) return;

        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');

          // Close all
          items.forEach((i) => {
            i.classList.remove('open');
            const p = i.querySelector('[data-accordion-panel]');
            const t = i.querySelector('[data-accordion-trigger]');
            if (p) p.style.maxHeight = null;
            if (t) t.setAttribute('aria-expanded', 'false');
          });

          // Open clicked if it was closed
          if (!isOpen) {
            item.classList.add('open');
            panel.style.maxHeight = panel.scrollHeight + 'px';
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     INIT ALL
     ══════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCounters();
    initFormValidation();
    initPasswordToggles();
    initTimeSlots();
    initCountdown();
    initTabs();
    initAccordion();
    handleAnchorLinks();
  });

})();
