/* ============================================
   DESK — Animations JavaScript
   Scroll Reveals, Accordion, Counters, Countdown
   ============================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initScrollReveal();
    initAccordions();
    initCounters();
    initCountdown();
  }

  /* ---------- Reduced Motion Check ---------- */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ==========================================
     SCROLL REVEAL (IntersectionObserver)
     ========================================== */
  function initScrollReveal() {
    if (prefersReducedMotion()) {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ==========================================
     ACCORDION (FAQ)
     ========================================== */
  function initAccordions() {
    var accordions = document.querySelectorAll('.accordion__item');

    accordions.forEach(function (item) {
      var header = item.querySelector('.accordion__header');
      var body = item.querySelector('.accordion__body');

      if (!header || !body) return;

      header.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        /* Close siblings in same accordion */
        var parent = item.closest('.accordion');
        if (parent) {
          parent.querySelectorAll('.accordion__item.open').forEach(function (openItem) {
            if (openItem !== item) {
              openItem.classList.remove('open');
              openItem.querySelector('.accordion__body').style.maxHeight = '0';
              openItem.querySelector('.accordion__header').setAttribute('aria-expanded', 'false');
            }
          });
        }

        if (isOpen) {
          item.classList.remove('open');
          body.style.maxHeight = '0';
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
          header.setAttribute('aria-expanded', 'true');
        }
      });

      /* Keyboard accessibility */
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });

      /* Set initial ARIA state */
      header.setAttribute('aria-expanded', 'false');
      body.setAttribute('role', 'region');
    });
  }

  /* ==========================================
     ANIMATED COUNTERS
     ========================================== */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (prefersReducedMotion()) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-count');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 1500;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* ==========================================
     COUNTDOWN TIMER (Coming Soon page)
     ========================================== */
  function initCountdown() {
    var daysEl = document.getElementById('countdown-days');
    var hoursEl = document.getElementById('countdown-hours');
    var minutesEl = document.getElementById('countdown-minutes');
    var secondsEl = document.getElementById('countdown-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    targetDate.setHours(0, 0, 0, 0);

    var stored = localStorage.getItem('desk-countdown-target');
    if (stored) {
      targetDate = new Date(parseInt(stored, 10));
    } else {
      localStorage.setItem('desk-countdown-target', targetDate.getTime().toString());
    }

    function update() {
      var now = new Date().getTime();
      var diff = targetDate.getTime() - now;

      if (diff <= 0) {
        daysEl.textContent = '0';
        hoursEl.textContent = '0';
        minutesEl.textContent = '0';
        secondsEl.textContent = '0';
        return;
      }

      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = days;
      hoursEl.textContent = hours;
      minutesEl.textContent = minutes;
      secondsEl.textContent = seconds;
    }

    update();
    setInterval(update, 1000);
  }

})();
