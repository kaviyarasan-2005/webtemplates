document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     THEME TOGGLE
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check for saved theme
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  /* ==========================================================================
     RTL/LTR TOGGLE
     ========================================================================== */
  const dirToggle = document.getElementById('dir-toggle');
  
  const currentDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.setAttribute('dir', currentDir);
  if (dirToggle) {
    dirToggle.textContent = currentDir === 'rtl' ? 'LTR' : 'RTL';
  }
  
  if (dirToggle) {
    dirToggle.addEventListener('click', () => {
      let dir = document.documentElement.getAttribute('dir');
      let newDir = dir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('dir', newDir);
      dirToggle.textContent = newDir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  /* ==========================================================================
     MOBILE HAMBURGER & NAV
     ========================================================================== */
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navItems = document.querySelectorAll('.nav-item');

  function closeMobileMenu() {
    if (navMenu && hamburger) {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open Menu');
      document.body.classList.remove('menu-open');
    }
  }

  function openMobileMenu() {
    if (navMenu && hamburger) {
      navMenu.classList.add('active');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close Menu');
      document.body.classList.add('menu-open');
    }
  }

  if (hamburger && navMenu) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.contains('active');
      if (isActive) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Handle dropdown toggle on mobile and tablet (<= 1024px)
  navItems.forEach(item => {
    const dropdown = item.querySelector('.dropdown-menu');
    if (dropdown) {
      const toggleLink = item.querySelector('.nav-link');
      if (toggleLink) {
        toggleLink.addEventListener('click', (e) => {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            e.stopPropagation();
            item.classList.toggle('active');
          }
        });
      }
    }
  });

  // Close menu when clicking regular links (not the dropdown toggle)
  if (navMenu) {
    const regularLinks = navMenu.querySelectorAll('.dropdown-item, .nav-link:not(.dropdown-toggle), .nav-drawer-cta a');
    regularLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          closeMobileMenu();
        }
      });
    });
  }

  // Close menu when clicking escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Automatically reset menu state if resizing to desktop (> 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && navMenu && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     ACTIVE NAV LINK HIGHLIGHTING
     ========================================================================== */
  const currentLocation = location.href;
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
  navLinks.forEach(link => {
    if (link.href === currentLocation) {
      link.classList.add('active');
      // If it's a dropdown item, also highlight parent
      const parentDropdown = link.closest('.dropdown-menu');
      if (parentDropdown) {
        parentDropdown.previousElementSibling.classList.add('active');
      }
    }
  });

  /* ==========================================================================
     SCROLL FADE-UP ANIMATIONS
     ========================================================================== */
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const fadeElements = document.querySelectorAll('.fade-up');
  fadeElements.forEach(el => observer.observe(el));

  /* ==========================================================================
     PAGE-SPECIFIC LOGIC (Guarded)
     ========================================================================== */
  
  // Home 2 - Coordinate Lock Typing
  const coordElement = document.getElementById('typing-coordinates');
  if (coordElement) {
    const coords = ["LAT: 40.7128° N", "LON: 74.0060° W", "LOCKING TARGET..."];
    let i = 0; let j = 0; let currentWord = ""; let isDeleting = false;
    function type() {
      currentWord = coords[i];
      if (isDeleting) {
        coordElement.textContent = currentWord.substring(0, j - 1);
        j--;
        if (j == 0) { isDeleting = false; i++; if (i == coords.length) i = 0; }
      } else {
        coordElement.textContent = currentWord.substring(0, j + 1);
        j++;
        if (j == currentWord.length) { isDeleting = true; setTimeout(type, 2000); return; }
      }
      setTimeout(type, isDeleting ? 50 : 100);
    }
    type();
  }

  // Home 2 - Route String Board (Mock animation toggle)
  const portItems = document.querySelectorAll('.port-item');
  if(portItems.length > 0) {
    portItems.forEach(item => {
      item.addEventListener('click', () => {
        item.parentElement.querySelectorAll('.port-item').forEach(p => p.classList.remove('selected'));
        item.classList.add('selected');
        const board = document.querySelector('.route-board-stats');
        if(board) board.classList.add('pulse');
        setTimeout(() => {
          if(board) board.classList.remove('pulse');
        }, 500);
      });
    });
  }

  // Home 2 - Commodity Card Fan Selection
  const fanCards = document.querySelectorAll('.fan-card');
  if (fanCards.length > 0) {
    fanCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') return;
        fanCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  }
  
  // Pricing - Departure Board Flap
  const departureBoard = document.querySelector('.departure-board');
  if (departureBoard) {
    // Add split flap logic here if needed
  }

  // Home 2 - Incoterms 3D Cube Rotation
  const incotermCube = document.getElementById('incoterm-cube');
  const cubePrevBtn = document.getElementById('cube-prev-btn');
  const cubeNextBtn = document.getElementById('cube-next-btn');
  if (incotermCube && (cubePrevBtn || cubeNextBtn)) {
    let cubeYAngle = 0;
    if (cubePrevBtn) {
      cubePrevBtn.addEventListener('click', () => {
        cubeYAngle += 90;
        incotermCube.style.transform = `rotateY(${cubeYAngle}deg)`;
      });
    }
    if (cubeNextBtn) {
      cubeNextBtn.addEventListener('click', () => {
        cubeYAngle -= 90;
        incotermCube.style.transform = `rotateY(${cubeYAngle}deg)`;
      });
    }
  }

  // Blog - Intelligence Terminal Topic Pills Toggle
  const topicPills = document.querySelectorAll('.topic-pill');
  if (topicPills.length > 0) {
    topicPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const checkbox = pill.querySelector('input[type="checkbox"]');
        setTimeout(() => {
          if (checkbox) {
            pill.classList.toggle('active', checkbox.checked);
          } else {
            pill.classList.toggle('active');
          }
        }, 10);
      });
    });
  }

  // Home 1 - Global Trade Command Nexus Hero Interactivity
  const originSelect = document.getElementById('corridor-origin');
  const destSelect = document.getElementById('corridor-dest');
  const modeSelect = document.getElementById('corridor-mode');
  const transitDisplay = document.getElementById('metric-transit');
  const customsDisplay = document.getElementById('metric-customs');
  const carbonDisplay = document.getElementById('metric-carbon');
  const hudCorridorRoute = document.getElementById('hud-corridor-route');

  function updateCorridorEstimator() {
    if (!originSelect || !destSelect || !modeSelect) return;
    const origin = originSelect.value;
    const dest = destSelect.value;
    const mode = modeSelect.value;

    if (hudCorridorRoute) {
      hudCorridorRoute.textContent = `${origin} ➔ ${dest} CORRIDOR`;
    }

    // Dynamic Transit Table Matrix
    if (mode === 'air_priority') {
      if (transitDisplay) transitDisplay.textContent = '2 - 3 Days';
      if (customsDisplay) customsDisplay.textContent = '< 2 Hours Priority';
      if (carbonDisplay) carbonDisplay.textContent = '4.85t CO₂ / Ton';
    } else if (mode === 'rail_express') {
      if (transitDisplay) transitDisplay.textContent = '12 - 15 Days';
      if (customsDisplay) customsDisplay.textContent = '< 3 Hours Bonded';
      if (carbonDisplay) carbonDisplay.textContent = '0.78t CO₂ / TEU';
    } else if (mode === 'ocean_lcl') {
      let baseDays = (dest === 'LAX') ? '14 - 17 Days' : (dest === 'SSZ') ? '30 - 35 Days' : '21 - 25 Days';
      if (transitDisplay) transitDisplay.textContent = baseDays;
      if (customsDisplay) customsDisplay.textContent = '< 6 Hours Consolidation';
      if (carbonDisplay) carbonDisplay.textContent = '1.45t CO₂ / CBM';
    } else {
      // Ocean FCL Standard
      let baseDays = (dest === 'LAX') ? '11 - 13 Days' : (dest === 'DXB') ? '14 - 16 Days' : (dest === 'SSZ') ? '26 - 30 Days' : '18 - 21 Days';
      if (transitDisplay) transitDisplay.textContent = baseDays;
      if (customsDisplay) customsDisplay.textContent = '< 4 Hours Green Track';
      if (carbonDisplay) carbonDisplay.textContent = '1.38t CO₂ / TEU';
    }
  }

  if (originSelect && destSelect && modeSelect) {
    originSelect.addEventListener('change', updateCorridorEstimator);
    destSelect.addEventListener('change', updateCorridorEstimator);
    modeSelect.addEventListener('change', updateCorridorEstimator);
  }

  // Home 1 - HUD Mode Switcher Tabs
  const hudTabs = document.querySelectorAll('.hud-tab-btn');
  const hudImg = document.getElementById('hud-scene-img');
  const hudWaybill = document.getElementById('hud-waybill-code');
  const hudVehicle = document.getElementById('hud-vehicle-name');
  const hudSpeed = document.getElementById('hud-speed-val');
  const hudCustoms = document.getElementById('hud-customs-desc');

  const hudTelemetryData = {
    ocean: {
      img: 'images/hero-port-cranes.png',
      code: 'WAYBILL #EXIM-98240-X',
      vehicle: 'CMA CGM Palais',
      speed: '19.4 knots',
      customs: 'HS-Code 8471.30 • Green Channel Fast-Track'
    },
    air: {
      img: 'images/hero-air-cargo.png',
      code: 'AWB #EXIM-AIR-4109-A',
      vehicle: 'Boeing 777-200F',
      speed: '490 knots (Mach 0.84)',
      customs: 'IATA e-Freight • Pre-Cleared at Wheels Up'
    },
    rail: {
      img: 'images/hero-rail-freight.png',
      code: 'CIM/SMGS #EXIM-RL-882',
      vehicle: 'Eurasia Express #44',
      speed: '65 mph (Block Train)',
      customs: 'Cross-Border Transit Bond Approved'
    }
  };

  if (hudTabs.length > 0) {
    hudTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        hudTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const mode = tab.getAttribute('data-mode');
        const data = hudTelemetryData[mode];
        if (data) {
          if (hudImg) hudImg.src = data.img;
          if (hudWaybill) hudWaybill.textContent = data.code;
          if (hudVehicle) hudVehicle.textContent = data.vehicle;
          if (hudSpeed) hudSpeed.textContent = data.speed;
          if (hudCustoms) hudCustoms.textContent = data.customs;
        }
      });
    });
  }
  
});

