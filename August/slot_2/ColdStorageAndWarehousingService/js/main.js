/* ═══════════════════════════════════════════════════════════
   COLD — Main JavaScript
   Theme toggle, RTL/LTR toggle, mobile drawer, dropdown,
   active nav, scroll animations, live temperatures,
   and all page-specific interactions
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════
     1. THEME TOGGLE + PERSISTENCE
     ═══════════════════════════════════════════════════════ */
  const THEME_KEY = 'cold-theme';

  function applyTheme(dark) {
    if (dark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark') {
      applyTheme(true);
    } else if (!saved) {
      // Default to light
      applyTheme(false);
    }
  }

  function bindThemeToggles() {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const isDark = document.body.classList.contains('dark-mode');
        applyTheme(!isDark);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     2. RTL/LTR TOGGLE + PERSISTENCE
     ═══════════════════════════════════════════════════════ */
  const DIR_KEY = 'cold-dir';

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.querySelectorAll('.rtl-toggle').forEach(function (btn) {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
    localStorage.setItem(DIR_KEY, dir);
  }

  function initDirection() {
    const saved = localStorage.getItem(DIR_KEY);
    applyDirection(saved || 'ltr');
  }

  function bindDirToggles() {
    document.querySelectorAll('.rtl-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        applyDirection(current === 'ltr' ? 'rtl' : 'ltr');
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     3. MOBILE HAMBURGER DRAWER
     ═══════════════════════════════════════════════════════ */
  function initMobileDrawer() {
    var hamburger = document.querySelector('.hamburger');
    var drawer = document.querySelector('.mobile-drawer');
    var backdrop = document.querySelector('.drawer-backdrop');

    if (!hamburger || !drawer) return;

    function openDrawer() {
      hamburger.classList.add('active');
      drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      hamburger.classList.remove('active');
      drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('visible');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', closeDrawer);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Close drawer on link click
    drawer.querySelectorAll('a:not(.mobile-dropdown-trigger)').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });
  }

  /* ═══════════════════════════════════════════════════════
     4. HOME DROPDOWN BEHAVIOR
     ═══════════════════════════════════════════════════════ */
  function initDropdown() {
    // Desktop dropdown
    var dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(function (dd) {
      var trigger = dd.querySelector('.nav-dropdown-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = dd.classList.contains('open');
        // Close all
        dropdowns.forEach(function (d) { d.classList.remove('open'); });
        if (!isOpen) dd.classList.add('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      dropdowns.forEach(function (dd) {
        if (!dd.contains(e.target)) {
          dd.classList.remove('open');
        }
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdowns.forEach(function (dd) { dd.classList.remove('open'); });
      }
    });

    // Mobile dropdown
    var mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
    mobileDropdowns.forEach(function (dd) {
      var trigger = dd.querySelector('.mobile-dropdown-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        dd.classList.toggle('open');
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     5. ACTIVE NAV LINK HIGHLIGHTING
     ═══════════════════════════════════════════════════════ */
  function initActiveNav() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === '') currentPage = 'index.html';

    // Desktop nav links
    document.querySelectorAll('.nav-link, .nav-dropdown-item').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPage = href.split('/').pop();
      if (linkPage === currentPage) {
        link.classList.add('active');
        // If it's a dropdown item, also mark the parent trigger as active
        var parentDropdown = link.closest('.nav-dropdown');
        if (parentDropdown) {
          var parentTrigger = parentDropdown.querySelector('.nav-dropdown-trigger');
          if (parentTrigger) parentTrigger.classList.add('active');
        }
      }
    });

    // Mobile nav links
    document.querySelectorAll('.mobile-nav-link, .mobile-dropdown .nav-dropdown-item').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPage = href.split('/').pop();
      if (linkPage === currentPage) {
        link.classList.add('active');
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
     6. SCROLL FADE-UP ANIMATIONS (IntersectionObserver)
     ═══════════════════════════════════════════════════════ */
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      document.querySelectorAll('.fade-up').forEach(function (el) {
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
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-up').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════════════
     7. LIVE TEMPERATURE READOUTS (Home 1)
     ═══════════════════════════════════════════════════════ */
  function initLiveTemperatures() {
    var panels = document.querySelectorAll('.temp-panel');
    if (panels.length === 0) return;

    var zones = [
      { base: -25, range: 0.5, el: null },
      { base: 2, range: 0.3, el: null },
      { base: 8, range: 0.4, el: null },
      { base: 20, range: 0.3, el: null }
    ];

    panels.forEach(function (panel, i) {
      if (zones[i]) {
        zones[i].el = panel.querySelector('.temp-value');
      }
    });

    function updateTemps() {
      zones.forEach(function (zone) {
        if (!zone.el) return;
        var fluctuation = (Math.random() - 0.5) * 2 * zone.range;
        var temp = zone.base + fluctuation;
        zone.el.textContent = temp.toFixed(1) + '°C';
      });
    }

    updateTemps();
    setInterval(updateTemps, 3000);
  }

  /* ═══════════════════════════════════════════════════════
     8. CHILLER UNIT PROCESS ROW (Home 1 — Sequential reveal)
     ═══════════════════════════════════════════════════════ */
  function initProcessRow() {
    var units = document.querySelectorAll('.process-unit');
    if (units.length === 0) return;

    var section = units[0].closest('.section');
    if (!section) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          units.forEach(function (unit, i) {
            setTimeout(function () {
              unit.classList.add('visible');
            }, i * 400);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  }

  /* ═══════════════════════════════════════════════════════
     9. BLUEPRINT HOTSPOTS (Home 2)
     ═══════════════════════════════════════════════════════ */
  function initBlueprintHotspots() {
    var pins = document.querySelectorAll('.hotspot-pin');
    var detail = document.querySelector('.hotspot-detail');
    if (pins.length === 0 || !detail) return;

    var detailTitle = detail.querySelector('h3');
    var detailSpecs = detail.querySelector('.hotspot-specs');

    var zones = {
      '1': {
        name: 'Receiving Dock',
        specs: [
          ['Dock Doors', '6 Levelers'],
          ['Temperature', 'Ambient'],
          ['Capacity', '200 pallets/hr'],
          ['Features', 'Drive-in ramps']
        ]
      },
      '2': {
        name: 'Quarantine Zone',
        specs: [
          ['Area', '2,000 sq ft'],
          ['Temperature', '2–8°C'],
          ['Security', 'Restricted access'],
          ['Purpose', 'QA inspection']
        ]
      },
      '3': {
        name: 'Pharma Vault',
        specs: [
          ['Area', '5,000 sq ft'],
          ['Temperature', '2–8°C / -20°C'],
          ['Compliance', 'GDP certified'],
          ['Monitoring', '24/7 IoT sensors']
        ]
      },
      '4': {
        name: 'Blast Freezers',
        specs: [
          ['Capacity', '40 pallets/cycle'],
          ['Temperature', '-35°C to -40°C'],
          ['Cycle Time', '4–8 hours'],
          ['Power', 'Dual redundancy']
        ]
      },
      '5': {
        name: 'Dispatch Bay',
        specs: [
          ['Dock Doors', '8 Levelers'],
          ['Temperature', 'Multi-zone'],
          ['Staging', '500 pallet positions'],
          ['Systems', 'WMS integrated']
        ]
      }
    };

    pins.forEach(function (pin) {
      pin.addEventListener('click', function () {
        var id = pin.getAttribute('data-zone');
        var zone = zones[id];
        if (!zone) return;

        // Toggle active
        pins.forEach(function (p) { p.classList.remove('active'); });
        pin.classList.add('active');

        // Populate detail
        if (detailTitle) detailTitle.textContent = zone.name;
        if (detailSpecs) {
          detailSpecs.innerHTML = '';
          zone.specs.forEach(function (spec) {
            var item = document.createElement('div');
            item.className = 'spec-item';
            item.innerHTML = '<span>' + spec[0] + '</span><span>' + spec[1] + '</span>';
            detailSpecs.appendChild(item);
          });
        }

        detail.classList.add('open');
      });
    });

    // Close detail on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.hotspot-pin') && !e.target.closest('.hotspot-detail')) {
        detail.classList.remove('open');
        pins.forEach(function (p) { p.classList.remove('active'); });
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
     10. ALERT RESOLUTION DEMO (Home 2 — Sequential)
     ═══════════════════════════════════════════════════════ */
  function initAlertDemo() {
    var steps = document.querySelectorAll('.alert-step');
    if (steps.length === 0) return;

    var section = steps[0].closest('.section');
    if (!section) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          steps.forEach(function (step, i) {
            setTimeout(function () {
              step.classList.add('visible');
            }, i * 800);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  }

  /* ═══════════════════════════════════════════════════════
     11. MAGNETIC SHIFT BOARD (About — Snap tiles)
     ═══════════════════════════════════════════════════════ */
  function initShiftBoard() {
    var tiles = document.querySelectorAll('.team-tile');
    if (tiles.length === 0) return;

    var section = tiles[0].closest('.section');
    if (!section) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tiles.forEach(function (tile, i) {
            setTimeout(function () {
              tile.classList.add('snapped');
            }, i * 150);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(section);
  }

  /* ═══════════════════════════════════════════════════════
     12. ICE-CORE VALUES (About — Scroll highlight)
     ═══════════════════════════════════════════════════════ */
  function initIceCoreValues() {
    var cards = document.querySelectorAll('.core-value-card');
    if (cards.length === 0) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, { threshold: 0.5 });

    cards.forEach(function (card) { observer.observe(card); });
  }

  /* ═══════════════════════════════════════════════════════
     13. SCANLINE PROCESS (Services — Sweep animation)
     ═══════════════════════════════════════════════════════ */
  function initScanline() {
    var section = document.querySelector('.scanline-section');
    if (!section) return;

    var stages = section.querySelectorAll('.scan-stage');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          section.classList.add('scanned');
          stages.forEach(function (stage, i) {
            setTimeout(function () {
              stage.classList.add('scanned-in');
            }, 500 + i * 400);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  }

  /* ═══════════════════════════════════════════════════════
     14. CLIPBOARD INCLUSIONS (Service Details — Animated checks)
     ═══════════════════════════════════════════════════════ */
  function initClipboardChecks() {
    var items = document.querySelectorAll('.clipboard-item');
    if (items.length === 0) return;

    var section = items[0].closest('.section');
    if (!section) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          items.forEach(function (item, i) {
            setTimeout(function () {
              item.classList.add('checked');
            }, i * 300);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  }

  /* ═══════════════════════════════════════════════════════
     15. DEFROST REVEAL Q&A (Service Details — Click to defrost)
     ═══════════════════════════════════════════════════════ */
  function initDefrostQA() {
    var cards = document.querySelectorAll('.qa-card');
    if (cards.length === 0) return;

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        card.classList.toggle('defrosted');
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     16. ICE-FILL CAPACITY TANK (Facilities — Scroll fill)
     ═══════════════════════════════════════════════════════ */
  function initCapacityTank() {
    var tankFill = document.querySelector('.tank-fill');
    if (!tankFill) return;

    var section = tankFill.closest('.section');
    if (!section) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tankFill.style.height = '85%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);
  }

  /* ═══════════════════════════════════════════════════════
     17. WIPE COMPARE PANEL (Pricing — Draggable divider)
     ═══════════════════════════════════════════════════════ */
  function initWipeCompare() {
    var container = document.querySelector('.wipe-container');
    var handle = document.querySelector('.wipe-handle');
    var rightPanel = document.querySelector('.wipe-panel-right');

    if (!container || !handle || !rightPanel) return;

    // Only on desktop
    if (window.innerWidth < 768) return;

    var isDragging = false;

    function updatePosition(clientX) {
      var rect = container.getBoundingClientRect();
      var x = clientX - rect.left;
      var percent = Math.max(15, Math.min(85, (x / rect.width) * 100));
      var dir = document.documentElement.getAttribute('dir') || 'ltr';

      if (dir === 'rtl') {
        rightPanel.style.width = percent + '%';
        rightPanel.style.left = '0';
        rightPanel.style.right = 'auto';
        handle.style.left = percent + '%';
        handle.style.right = 'auto';
        handle.style.insetInlineStart = 'auto';
      } else {
        rightPanel.style.width = (100 - percent) + '%';
        handle.style.insetInlineStart = 'calc(' + percent + '% - 20px)';
      }
    }

    handle.addEventListener('mousedown', function (e) {
      isDragging = true;
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (isDragging) updatePosition(e.clientX);
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
    });

    // Touch support
    handle.addEventListener('touchstart', function (e) {
      isDragging = true;
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', function (e) {
      if (isDragging) updatePosition(e.touches[0].clientX);
    });

    document.addEventListener('touchend', function () {
      isDragging = false;
    });
  }

  /* ═══════════════════════════════════════════════════════
     18. SNOWBALL SAVINGS (Pricing — Scroll-driven growth)
     ═══════════════════════════════════════════════════════ */
  function initSnowball() {
    var snowball = document.querySelector('.snowball');
    var labels = document.querySelectorAll('.savings-label');
    if (!snowball || labels.length === 0) return;

    var section = snowball.closest('.section');
    if (!section) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            snowball.classList.add('grown-1');
            if (labels[0]) labels[0].classList.add('visible');
          }, 400);
          setTimeout(function () {
            snowball.classList.add('grown-2');
            if (labels[1]) labels[1].classList.add('visible');
          }, 1000);
          setTimeout(function () {
            snowball.classList.add('grown-3');
            if (labels[2]) labels[2].classList.add('visible');
          }, 1600);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);
  }

  /* ═══════════════════════════════════════════════════════
     19. CALENDAR ARCHIVE STRIP (Blog — Month filter)
     ═══════════════════════════════════════════════════════ */
  function initCalendarFilter() {
    var months = document.querySelectorAll('.calendar-month');
    var cards = document.querySelectorAll('.magnet-card');
    if (months.length === 0 || cards.length === 0) return;

    months.forEach(function (month) {
      month.addEventListener('click', function () {
        months.forEach(function (m) { m.classList.remove('active'); });
        month.classList.add('active');

        var filter = month.getAttribute('data-month');
        cards.forEach(function (card) {
          var cardMonth = card.getAttribute('data-month');
          if (filter === 'all' || cardMonth === filter) {
            card.style.display = '';
            card.style.opacity = '0';
            setTimeout(function () { card.style.opacity = '1'; }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     20. FROST PROGRESS BAR (Blog Details — Reading progress)
     ═══════════════════════════════════════════════════════ */
  function initFrostProgress() {
    var progressFill = document.querySelector('.frost-progress-fill');
    var articleBody = document.querySelector('.article-body');
    if (!progressFill || !articleBody) return;

    window.addEventListener('scroll', function () {
      var rect = articleBody.getBoundingClientRect();
      var articleTop = rect.top + window.scrollY;
      var articleHeight = rect.height;
      var scrolled = window.scrollY - articleTop;
      var percent = Math.max(0, Math.min(100, (scrolled / (articleHeight - window.innerHeight)) * 100));
      progressFill.style.width = percent + '%';
    });
  }

  /* ═══════════════════════════════════════════════════════
     21. FREEZER SLOT COMMENT PANEL (Blog Details — Submit)
     ═══════════════════════════════════════════════════════ */
  function initCommentPanel() {
    var form = document.querySelector('.comment-form');
    var wall = document.querySelector('.comment-wall');
    if (!form || !wall) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameInput = form.querySelector('input[name="comment-name"]');
      var textInput = form.querySelector('textarea[name="comment-text"]');

      if (!nameInput || !textInput) return;

      var name = nameInput.value.trim();
      var text = textInput.value.trim();

      if (!name || !text) return;

      var now = new Date();
      var timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      var dateStr = now.toLocaleDateString();

      var comment = document.createElement('div');
      comment.className = 'frozen-comment';
      comment.innerHTML =
        '<div class="comment-author">' + escapeHTML(name) + '</div>' +
        '<div class="comment-time">' + dateStr + ' at ' + timeStr + '</div>' +
        '<div class="comment-text">' + escapeHTML(text) + '</div>';

      wall.prepend(comment);
      nameInput.value = '';
      textInput.value = '';
    });
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ═══════════════════════════════════════════════════════
     22. KIOSK ENQUIRY FORM (Contact — Validation)
     ═══════════════════════════════════════════════════════ */
  function initKioskForm() {
    var form = document.querySelector('.kiosk-form');
    if (!form) return;

    // Segment button selection
    var segmentGroups = form.querySelectorAll('.segment-group');
    segmentGroups.forEach(function (group) {
      var buttons = group.querySelectorAll('.segment-btn');
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          buttons.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          // Store value
          var input = group.querySelector('input[type="hidden"]');
          if (input) input.value = btn.getAttribute('data-value');
        });
      });
    });

    // Form submission with validation
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      // Clear previous errors
      form.querySelectorAll('.form-group').forEach(function (g) {
        g.classList.remove('error');
      });

      // Validate required fields
      var requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(function (field) {
        var group = field.closest('.form-group');
        if (!field.value.trim()) {
          if (group) group.classList.add('error');
          valid = false;
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
          var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(field.value.trim())) {
            if (group) group.classList.add('error');
            valid = false;
          }
        }

        // Phone validation
        if (field.type === 'tel' && field.value.trim()) {
          var phonePattern = /^[\d\s\-\+\(\)]{7,20}$/;
          if (!phonePattern.test(field.value.trim())) {
            if (group) group.classList.add('error');
            valid = false;
          }
        }
      });

      if (valid) {
        // Show success
        var submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          var originalText = submitBtn.textContent;
          submitBtn.textContent = 'Enquiry Sent!';
          submitBtn.style.background = '#00D09C';
          setTimeout(function () {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            form.reset();
            // Reset segment buttons
            form.querySelectorAll('.segment-btn').forEach(function (b) {
              b.classList.remove('active');
            });
          }, 2500);
        }
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
     23. CALLOUT PINS (Facilities — Hover cards)
     ═══════════════════════════════════════════════════════ */
  function initCalloutPins() {
    var pins = document.querySelectorAll('.callout-pin');
    if (pins.length === 0) return;

    // Touch support for mobile
    pins.forEach(function (pin) {
      pin.addEventListener('click', function (e) {
        e.stopPropagation();
        var card = pin.nextElementSibling;
        if (!card || !card.classList.contains('callout-card')) return;

        // Close others
        document.querySelectorAll('.callout-card.show').forEach(function (c) {
          c.classList.remove('show');
          c.style.opacity = '0';
          c.style.pointerEvents = 'none';
        });

        card.classList.add('show');
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        card.style.transform = 'translateY(0)';
      });
    });

    document.addEventListener('click', function () {
      document.querySelectorAll('.callout-card.show').forEach(function (c) {
        c.classList.remove('show');
        c.style.opacity = '0';
        c.style.pointerEvents = 'none';
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     24. FROST CRYSTALLIZATION HERO (Home 1 — Particle effect)
     ═══════════════════════════════════════════════════════ */
  function initFrostCrystals() {
    var canvas = document.querySelector('.frost-canvas');
    if (!canvas) return;

    var c = document.createElement('canvas');
    c.width = canvas.offsetWidth || window.innerWidth;
    c.height = canvas.offsetHeight || window.innerHeight;
    c.style.width = '100%';
    c.style.height = '100%';
    canvas.appendChild(c);

    var ctx = c.getContext('2d');
    if (!ctx) return;

    var particles = [];
    var maxParticles = 60;

    for (var i = 0; i < maxParticles; i++) {
      var edge = Math.floor(Math.random() * 4);
      var x, y;
      if (edge === 0) { x = Math.random() * c.width; y = 0; }
      else if (edge === 1) { x = c.width; y = Math.random() * c.height; }
      else if (edge === 2) { x = Math.random() * c.width; y = c.height; }
      else { x = 0; y = Math.random() * c.height; }

      particles.push({
        x: x, y: y,
        targetX: c.width / 2 + (Math.random() - 0.5) * c.width * 0.6,
        targetY: c.height / 2 + (Math.random() - 0.5) * c.height * 0.6,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.01 + 0.005,
        progress: 0,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    var animFrame;
    function animate() {
      ctx.clearRect(0, 0, c.width, c.height);
      var allDone = true;

      particles.forEach(function (p) {
        if (p.progress < 1) {
          p.progress += p.speed;
          allDone = false;
        }
        var t = Math.min(p.progress, 1);
        var ease = t * t * (3 - 2 * t); // smoothstep
        var cx = p.x + (p.targetX - p.x) * ease;
        var cy = p.y + (p.targetY - p.y) * ease;

        ctx.beginPath();
        ctx.arc(cx, cy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 208, 156, ' + (p.opacity * ease) + ')';
        ctx.fill();

        // Draw tiny frost lines
        if (ease > 0.3) {
          ctx.beginPath();
          ctx.moveTo(cx - p.size * 2, cy);
          ctx.lineTo(cx + p.size * 2, cy);
          ctx.moveTo(cx, cy - p.size * 2);
          ctx.lineTo(cx, cy + p.size * 2);
          ctx.strokeStyle = 'rgba(0, 208, 156, ' + (p.opacity * 0.3 * ease) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });

      if (!allDone) {
        animFrame = requestAnimationFrame(animate);
      }
    }

    animate();

    // Fade out after animation completes
    setTimeout(function () {
      canvas.style.transition = 'opacity 1.5s ease';
      canvas.style.opacity = '0.3';
    }, 5000);
  }

  /* ═══════════════════════════════════════════════════════
     25. VITAL MONITOR LINE (Home 2 — ECG line)
     ═══════════════════════════════════════════════════════ */
  function initVitalLine() {
    var container = document.querySelector('.vital-line-canvas');
    if (!container) return;

    var c = document.createElement('canvas');
    c.width = container.offsetWidth || window.innerWidth;
    c.height = container.offsetHeight || window.innerHeight;
    c.style.width = '100%';
    c.style.height = '100%';
    container.appendChild(c);

    var ctx = c.getContext('2d');
    if (!ctx) return;

    var x = 0;
    var midY = c.height * 0.55;
    var speed = 4;

    ctx.strokeStyle = 'rgba(0, 208, 156, 0.7)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(0, 208, 156, 0.5)';
    ctx.beginPath();
    ctx.moveTo(0, midY);

    function drawLine() {
      if (x >= c.width) return;

      var y;
      var cycle = x % 200;
      if (cycle > 80 && cycle < 90) {
        y = midY - 40;
      } else if (cycle > 90 && cycle < 100) {
        y = midY + 20;
      } else if (cycle > 100 && cycle < 110) {
        y = midY - 15;
      } else {
        y = midY;
      }

      x += speed;
      ctx.lineTo(x, y);
      ctx.stroke();
      requestAnimationFrame(drawLine);
    }

    drawLine();

    // Fade after complete
    setTimeout(function () {
      container.style.transition = 'opacity 2s ease';
      container.style.opacity = '0.25';
    }, 6000);
  }

  /* ═══════════════════════════════════════════════════════
     26. SNOWFLAKE ASSEMBLY (About Hero — SVG draw)
     ═══════════════════════════════════════════════════════ */
  function initSnowflakeAssembly() {
    var svg = document.querySelector('.snowflake-svg svg');
    if (!svg) return;

    var paths = svg.querySelectorAll('path, line, polyline');
    paths.forEach(function (path) {
      var length = path.getTotalLength ? path.getTotalLength() : 500;
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.animation = 'snowflake-draw 3s ease forwards';
    });
  }

  /* ═══════════════════════════════════════════════════════
     27. SMOOTH SCROLL FOR ANCHOR LINKS
     ═══════════════════════════════════════════════════════ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          var navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 72;
          window.scrollTo({
            top: target.offsetTop - navHeight,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     PRE-FOOTER INTERACTIVE WIDGETS
     ═══════════════════════════════════════════════════════ */
  function initPrefooterInteractions() {
    // Frost Frame Banner Allocator (Home 1)
    const zoneOptions = document.querySelectorAll('.ffb-zone-option');
    if (zoneOptions.length) {
      zoneOptions.forEach(function (opt) {
        opt.addEventListener('click', function () {
          zoneOptions.forEach(function (o) { o.classList.remove('active'); });
          opt.classList.add('active');
        });
      });
    }

    const palletChips = document.querySelectorAll('.ffb-pallet-chip');
    if (palletChips.length) {
      palletChips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          palletChips.forEach(function (c) { c.classList.remove('active'); });
          chip.classList.add('active');
        });
      });
    }

    // Facilities Tour Ticket Slot Picker (Facilities)
    const ticketSlots = document.querySelectorAll('.ticket-slot-btn');
    if (ticketSlots.length) {
      ticketSlots.forEach(function (btn) {
        btn.addEventListener('click', function () {
          ticketSlots.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
        });
      });
    }
  }

  /* ═══════════════════════════════════════════════════════
     INIT — Run everything on DOM ready
     ═══════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initDirection();
    bindThemeToggles();
    bindDirToggles();
    initMobileDrawer();
    initDropdown();
    initActiveNav();
    initScrollAnimations();
    initSmoothScroll();

    // Page-specific (guarded with existence checks)
    initFrostCrystals();
    initVitalLine();
    initSnowflakeAssembly();
    initLiveTemperatures();
    initProcessRow();
    initBlueprintHotspots();
    initAlertDemo();
    initShiftBoard();
    initIceCoreValues();
    initScanline();
    initClipboardChecks();
    initDefrostQA();
    initCapacityTank();
    initWipeCompare();
    initSnowball();
    initCalendarFilter();
    initFrostProgress();
    initCommentPanel();
    initKioskForm();
    initCalloutPins();
    initPrefooterInteractions();
  });

})();
