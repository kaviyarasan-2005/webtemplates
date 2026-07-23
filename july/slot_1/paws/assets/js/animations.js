/* PAWS - Animations JavaScript */
(function() {
  'use strict';

  /* Scroll Reveal - Intersection Observer */
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  /* Staggered reveal for grid items */
  var staggerGroups = document.querySelectorAll('.card-grid, .brand-grid, .steps-grid, .teaser-grid');
  if ('IntersectionObserver' in window && staggerGroups.length) {
    var staggerObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var children = entry.target.children;
          for (var i = 0; i < children.length; i++) {
            (function(index) {
              setTimeout(function() {
                children[index].style.opacity = '1';
                children[index].style.transform = 'translateY(0)';
              }, index * 80);
            })(i);
          }
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    staggerGroups.forEach(function(group) {
      var children = group.children;
      for (var i = 0; i < children.length; i++) {
        children[i].style.opacity = '0';
        children[i].style.transform = 'translateY(20px)';
        children[i].style.transition = 'opacity 400ms ease-out, transform 400ms ease-out';
      }
      staggerObserver.observe(group);
    });
  }

  /* Countdown Timer */
  var countdownEl = document.querySelector('.countdown');
  if (countdownEl) {
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    function updateCountdown() {
      var now = new Date().getTime();
      var distance = targetDate.getTime() - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      var dayEl = document.getElementById('countdown-days');
      var hourEl = document.getElementById('countdown-hours');
      var minEl = document.getElementById('countdown-minutes');
      var secEl = document.getElementById('countdown-seconds');

      if (dayEl) dayEl.textContent = String(days).padStart(2, '0');
      if (hourEl) hourEl.textContent = String(hours).padStart(2, '0');
      if (minEl) minEl.textContent = String(minutes).padStart(2, '0');
      if (secEl) secEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* Blog category filter */
  var categoryPills = document.querySelectorAll('.category-pill');
  var blogCards = document.querySelectorAll('.blog-card[data-category]');

  if (categoryPills.length && blogCards.length) {
    categoryPills.forEach(function(pill) {
      pill.addEventListener('click', function() {
        categoryPills.forEach(function(p) { p.classList.remove('active'); });
        pill.classList.add('active');
        var filter = pill.getAttribute('data-filter');

        blogCards.forEach(function(card) {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(function() {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
              card.style.transition = 'opacity 300ms ease, transform 300ms ease';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector('.header') ? 72 : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
