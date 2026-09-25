/**
 * MOVE — Corporate Relocation & Employee Mobility Platform
 * js/main.js — Universal Script
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. THEME TOGGLE WITH LOCALSTORAGE PERSISTENCE
     ========================================================================== */
  const THEME_KEY = 'move_theme';
  const htmlEl = document.documentElement;

  const sunIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  const moonIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlEl.classList.add('dark-theme');
      document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.innerHTML = sunIcon;
        btn.setAttribute('aria-label', 'Switch to Light Mode');
      });
    } else {
      htmlEl.classList.remove('dark-theme');
      document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.innerHTML = moonIcon;
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
      });
    }
  }

  // Load saved theme or system preference
  const savedTheme = localStorage.getItem(THEME_KEY) || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(savedTheme);

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = htmlEl.classList.contains('dark-theme');
      const newTheme = isDark ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, newTheme);
      applyTheme(newTheme);
    });
  });

  /* ==========================================================================
     2. RTL / LTR TOGGLE WITH LOCALSTORAGE PERSISTENCE (Rule 4)
     Button shows target mode: "RTL" when in LTR, "LTR" when in RTL
     ========================================================================== */
  const DIR_KEY = 'move_dir';

  function applyDirection(dir) {
    htmlEl.setAttribute('dir', dir);
    const targetLabel = dir === 'rtl' ? 'LTR' : 'RTL';
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.textContent = targetLabel;
      btn.setAttribute('aria-label', `Switch to ${targetLabel} reading direction`);
    });
  }

  const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
  applyDirection(savedDir);

  document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = htmlEl.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      localStorage.setItem(DIR_KEY, newDir);
      applyDirection(newDir);
    });
  });

  /* ==========================================================================
     3. NAVBAR DROPDOWNS & ACTIVE LINK HIGHLIGHTING
     ========================================================================== */
  // Dropdown toggling for desktop & drawer
  document.querySelectorAll('[data-dropdown-toggle]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetId = trigger.getAttribute('data-dropdown-toggle');
      const dropdown = document.getElementById(targetId);
      
      // Close other open dropdowns
      document.querySelectorAll('.nav-dropdown').forEach(d => {
        if (d !== dropdown) d.classList.remove('show');
      });

      if (dropdown) {
        dropdown.classList.toggle('show');
      }
    });
  });

  // Close dropdown on outside click or Escape
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('show'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('show'));
      closeMobileDrawer();
    }
  });

  // Drawer Dropdowns (Home and Dashboard Accordions)
  document.querySelectorAll('[data-drawer-toggle]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetId = trigger.getAttribute('data-drawer-toggle');
      const dropdown = document.getElementById(targetId);
      const parentItem = trigger.closest('.drawer-item') || trigger.parentElement;
      
      if (dropdown) {
        const isOpen = dropdown.classList.contains('open');
        if (isOpen) {
          dropdown.classList.remove('open');
          trigger.classList.remove('active');
          if (parentItem) parentItem.classList.remove('open');
        } else {
          dropdown.classList.add('open');
          trigger.classList.add('active');
          if (parentItem) parentItem.classList.add('open');
        }
      }
    });
  });

  // Active Link Highlighting based on current pathname
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
      const parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown) {
        const parentToggle = document.querySelector(`[data-dropdown-toggle="${parentDropdown.id}"]`);
        if (parentToggle) parentToggle.classList.add('active');
      }
      const parentDrawerDropdown = link.closest('.drawer-dropdown');
      if (parentDrawerDropdown) {
        const parentDrawerToggle = document.querySelector(`[data-drawer-toggle="${parentDrawerDropdown.id}"]`);
        if (parentDrawerToggle) {
          parentDrawerToggle.classList.add('active');
          parentDrawerDropdown.classList.add('open');
          const parentItem = parentDrawerToggle.closest('.drawer-item');
          if (parentItem) parentItem.classList.add('open');
        }
      }
    }
  });

  /* ==========================================================================
     4. MOBILE HAMBURGER DRAWER
     ========================================================================== */
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
  const drawerCloseBtn = document.querySelector('.drawer-close-btn');

  function openMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileDrawer);

  /* ==========================================================================
     5. SCROLL FADE-UP ANIMATIONS (IntersectionObserver)
     ========================================================================== */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-fade-up').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    const styleEl = document.createElement('style');
    styleEl.textContent = `.fade-in-visible { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(styleEl);
  }

  /* ==========================================================================
     6. AUTH PAGES LOGIC (login.html & signup.html)
     ========================================================================== */
  // Demo Role Selector on login.html
  let selectedRole = 'user'; // 'user' or 'admin'
  const roleButtons = document.querySelectorAll('.role-btn');
  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRole = btn.getAttribute('data-role');
    });
  });

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value;
      const pass = document.getElementById('loginPassword')?.value;
      if (!email || !pass) {
        alert('Please fill in both email and password.');
        return;
      }
      if (selectedRole === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'user-dashboard.html';
      }
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'user-dashboard.html';
    });
  }

  /* ==========================================================================
     7. HOME 1: INTERACTIVE LIVE CORRIDOR TELEMETRY CONSOLE & DESK FEED
     ========================================================================== */
  // Home 1 Live Corridor Switcher
  const corridorTabs = document.querySelectorAll('.corridor-tab-btn');
  if (corridorTabs.length > 0) {
    const corridorData = {
      'jfk-zrh': {
        id: '#MV-8842',
        status: 'In Transit — On Schedule',
        originCode: 'JFK',
        originCity: 'New York, USA',
        originMeta: '40.6413° N, 73.7781° W',
        destCode: 'ZRH',
        destCity: 'Zurich, Switzerland',
        destMeta: '47.4582° N, 8.5555° E',
        transitBadge: 'Priority Air Cargo Tier 1',
        carrierPosition: '62%',
        milestones: ['completed', 'completed', 'active', 'pending'],
        metric1Val: '19.4°C / 0.02G',
        metric1Sub: 'Nominal • Shock-Safe',
        metric2Val: '100% Cleared',
        metric2Sub: 'Swiss Carnet Bonded',
        metric3Val: 'Sept 28, 14:00',
        metric3Sub: 'Guaranteed SLA Window',
        officerName: 'Elena Rostova',
        officerTitle: 'Global Transit Director',
        officerAvatar: 'images/team-member1.jpg',
        officerTag: 'Cantonal Clearance Approved'
      },
      'lhr-sin': {
        id: '#MV-9014',
        status: 'Sea-Air Intermodal En Route',
        originCode: 'LHR',
        originCity: 'London, UK',
        originMeta: '51.4700° N, 0.4543° W',
        destCode: 'SIN',
        destCity: 'Singapore, SGP',
        destMeta: '1.3644° N, 103.9915° E',
        transitBadge: 'Express Intermodal Line',
        carrierPosition: '42%',
        milestones: ['completed', 'completed', 'active', 'pending'],
        metric1Val: '21.0°C / 0.01G',
        metric1Sub: 'Climate Dampened',
        metric2Val: 'Pre-Approved',
        metric2Sub: 'ICA Green Lane',
        metric3Val: 'Oct 04, 09:30',
        metric3Sub: 'Harbour Berth Confirmed',
        officerName: 'Marcus Vance',
        officerTitle: 'Asia-Pac Mobility Lead',
        officerAvatar: 'images/team-member2.jpg',
        officerTag: 'EP Visa & Leases Handed Over'
      },
      'sfo-hnd': {
        id: '#MV-7730',
        status: 'Final Mile Destination Concierge',
        originCode: 'SFO',
        originCity: 'San Francisco, USA',
        originMeta: '37.6213° N, 122.3790° W',
        destCode: 'HND',
        destCity: 'Tokyo, Japan',
        destMeta: '35.5494° N, 139.7798° E',
        transitBadge: 'Executive White-Glove Air',
        carrierPosition: '88%',
        milestones: ['completed', 'completed', 'completed', 'active'],
        metric1Val: '18.8°C / 0.00G',
        metric1Sub: 'Zero Impact Delta',
        metric2Val: 'Customs Exemption',
        metric2Sub: 'Diplomatic / Tier A',
        metric3Val: 'Sept 25, 17:00',
        metric3Sub: 'Residence Turnkey Handover',
        officerName: 'Kenji Sato',
        officerTitle: 'Japan Corridors Lead',
        officerAvatar: 'images/team-member3.jpg',
        officerTag: 'School Placements Finalized'
      }
    };

    corridorTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        corridorTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const key = tab.getAttribute('data-corridor');
        const d = corridorData[key];
        if (!d) return;

        const idEl = document.getElementById('telemetryId');
        if (idEl) idEl.textContent = d.id;

        const statusEl = document.getElementById('telemetryStatus');
        if (statusEl) statusEl.textContent = d.status;

        const originCodeEl = document.getElementById('routeOriginCode');
        if (originCodeEl) originCodeEl.textContent = d.originCode;

        const originCityEl = document.getElementById('routeOriginCity');
        if (originCityEl) originCityEl.textContent = d.originCity;

        const originMetaEl = document.getElementById('routeOriginMeta');
        if (originMetaEl) originMetaEl.textContent = d.originMeta;

        const destCodeEl = document.getElementById('routeDestCode');
        if (destCodeEl) destCodeEl.textContent = d.destCode;

        const destCityEl = document.getElementById('routeDestCity');
        if (destCityEl) destCityEl.textContent = d.destCity;

        const destMetaEl = document.getElementById('routeDestMeta');
        if (destMetaEl) destMetaEl.textContent = d.destMeta;

        const badgeEl = document.getElementById('routeTransitBadge');
        if (badgeEl) badgeEl.textContent = d.transitBadge;

        const carrierEl = document.getElementById('routeCarrierIcon');
        if (carrierEl) carrierEl.style.left = d.carrierPosition;

        // Milestones
        const steps = document.querySelectorAll('.milestone-step');
        steps.forEach((step, idx) => {
          step.className = 'milestone-step ' + (d.milestones[idx] || 'pending');
        });

        // Metrics
        const m1Val = document.getElementById('metric1Val');
        if (m1Val) m1Val.textContent = d.metric1Val;
        const m1Sub = document.getElementById('metric1Sub');
        if (m1Sub) m1Sub.textContent = d.metric1Sub;

        const m2Val = document.getElementById('metric2Val');
        if (m2Val) m2Val.textContent = d.metric2Val;
        const m2Sub = document.getElementById('metric2Sub');
        if (m2Sub) m2Sub.textContent = d.metric2Sub;

        const m3Val = document.getElementById('metric3Val');
        if (m3Val) m3Val.textContent = d.metric3Val;
        const m3Sub = document.getElementById('metric3Sub');
        if (m3Sub) m3Sub.textContent = d.metric3Sub;

        // Officer
        const offName = document.getElementById('officerName');
        if (offName) offName.textContent = d.officerName;
        const offTitle = document.getElementById('officerTitle');
        if (offTitle) offTitle.textContent = d.officerTitle;
        const offAvatar = document.getElementById('officerAvatar');
        if (offAvatar) offAvatar.src = d.officerAvatar;
        const offTag = document.getElementById('officerTag');
        if (offTag) offTag.textContent = d.officerTag;
      });
    });
  }

  // Tape Rip fallback if present
  const tapeRipContainer = document.querySelector('.tape-rip-container');
  if (tapeRipContainer) {
    setTimeout(() => {
      tapeRipContainer.classList.add('tape-ripped');
    }, 450);
  }

  // Live Desk Feed
  const feedList = document.getElementById('liveDeskFeed');
  if (feedList) {
    const feedItems = [
      { text: 'Crate 214 cleared customs — Dubai (DXB)', time: 'Just now' },
      { text: 'Lease signed & keys handed over — Toronto', time: '2m ago' },
      { text: 'Comprehensive home survey completed — Munich', time: '5m ago' },
      { text: 'Pet relocation health passport approved — London', time: '8m ago' },
      { text: 'High-tech lab servers crated — Singapore', time: '12m ago' },
      { text: 'Household container vessel departed — Tokyo', time: '18m ago' }
    ];

    let feedIndex = 0;
    let feedInterval = setInterval(() => {
      const item = feedItems[feedIndex % feedItems.length];
      feedIndex++;
      const li = document.createElement('li');
      li.className = 'feed-item';
      li.innerHTML = `
        <span class="feed-text">${item.text}</span>
        <span class="feed-time">${item.time}</span>
      `;
      feedList.insertBefore(li, feedList.firstChild);
      if (feedList.children.length > 5) {
        feedList.removeChild(feedList.lastChild);
      }
    }, 4000);

    const deskPanel = document.querySelector('.desk-feed-panel');
    if (deskPanel) {
      deskPanel.addEventListener('mouseenter', () => clearInterval(feedInterval));
      deskPanel.addEventListener('mouseleave', () => {
        feedInterval = setInterval(() => {
          const item = feedItems[feedIndex % feedItems.length];
          feedIndex++;
          const li = document.createElement('li');
          li.className = 'feed-item';
          li.innerHTML = `
            <span class="feed-text">${item.text}</span>
            <span class="feed-time">${item.time}</span>
          `;
          feedList.insertBefore(li, feedList.firstChild);
          if (feedList.children.length > 5) {
            feedList.removeChild(feedList.lastChild);
          }
        }, 4000);
      });
    }
  }

  /* ==========================================================================
     8. HOME 2: ROLODEX CITY FINDER
     ========================================================================== */
  const rolodexTabs = document.querySelectorAll('.rolodex-tab-btn');
  const rolodexCards = document.querySelectorAll('.rolodex-card');
  if (rolodexTabs.length && rolodexCards.length) {
    rolodexTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const city = tab.getAttribute('data-city');
        rolodexTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        rolodexCards.forEach(card => {
          if (card.getAttribute('data-city') === city) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     9. SERVICE DETAILS: QUOTE TICKET CALCULATOR
     ========================================================================== */
  const volumeSlider = document.getElementById('calcVolume');
  const distanceSlider = document.getElementById('calcDistance');
  const totalDisplay = document.getElementById('calcTotalDisplay');

  function calculateEstimate() {
    if (!volumeSlider || !distanceSlider || !totalDisplay) return;
    const vol = parseInt(volumeSlider.value, 10);
    const dist = parseInt(distanceSlider.value, 10);
    const base = 1200;
    const volCost = vol * 4.5;
    const distCost = dist * 1.8;
    const total = Math.round(base + volCost + distCost);
    totalDisplay.textContent = '$' + total.toLocaleString();

    const volLabel = document.getElementById('volumeVal');
    const distLabel = document.getElementById('distanceVal');
    if (volLabel) volLabel.textContent = vol + ' cu ft';
    if (distLabel) distLabel.textContent = dist + ' miles';
  }

  if (volumeSlider && distanceSlider) {
    volumeSlider.addEventListener('input', calculateEstimate);
    distanceSlider.addEventListener('input', calculateEstimate);
    calculateEstimate();
  }

  /* ==========================================================================
     10. PRICING: ADD-ON PALLET RUNNING TOTAL
     ========================================================================== */
  const palletCrates = document.querySelectorAll('.pallet-crate');
  const palletTotalEl = document.getElementById('palletTotal');
  const palletCountEl = document.getElementById('palletCount');
  let selectedPalletTotal = 0;
  let selectedPalletCount = 0;

  palletCrates.forEach(crate => {
    crate.addEventListener('click', () => {
      const price = parseInt(crate.getAttribute('data-price') || '0', 10);
      crate.classList.toggle('selected');
      if (crate.classList.contains('selected')) {
        selectedPalletTotal += price;
        selectedPalletCount++;
      } else {
        selectedPalletTotal -= price;
        selectedPalletCount--;
      }
      if (palletTotalEl) palletTotalEl.textContent = '$' + selectedPalletTotal.toLocaleString();
      if (palletCountEl) palletCountEl.textContent = `${selectedPalletCount} items added`;
    });
  });

  /* ==========================================================================
     11. CONTACT: MOVE REQUEST FORM & REFERENCE GENERATOR
     ========================================================================== */
  const moveForm = document.getElementById('moveRequestForm');
  const refDisplay = document.getElementById('formRefDisplay');

  if (moveForm) {
    moveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const refNum = `MV-2026-${randomCode}`;
      if (refDisplay) {
        refDisplay.innerHTML = `
          <div style="background: var(--accent-soft); border: 2px solid var(--accent-color); padding: 1.25rem; border-radius: 8px; margin-top: 1.5rem; text-align: center;">
            <h4 style="color: var(--accent-color); margin-bottom: 0.25rem;">Move Request Registered!</h4>
            <p style="font-weight: 700; color: var(--text-main);">Your Reference: <span style="letter-spacing: 0.05em;">${refNum}</span></p>
            <p style="font-size: 0.85rem; margin-top: 0.25rem;">A senior relocation coordinator will reach out within 4 business hours.</p>
          </div>
        `;
      }
      moveForm.reset();
    });
  }

  /* ==========================================================================
     12. BLOG: TRAY FILTER ARTICLE GRID
     ========================================================================== */
  const blogFilters = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  blogFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');
      blogFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      blogCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     13. BLOG DETAILS: DESK LOG COMMENTS
     ========================================================================== */
  const commentForm = document.getElementById('commentForm');
  const commentsList = document.getElementById('commentsList');

  if (commentForm && commentsList) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('commentAuthor')?.value || 'HR Coordinator';
      const text = document.getElementById('commentText')?.value;
      if (!text) return;

      const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const li = document.createElement('li');
      li.className = 'feed-item';
      li.style.marginBottom = '1rem';
      li.innerHTML = `
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span style="font-family: var(--font-display); font-weight: 700; font-size: 0.88rem;">${author}</span>
            <span class="stamp-mark" style="font-size: 0.65rem; padding: 2px 6px; margin: 0;">LOGGED</span>
          </div>
          <p style="font-size: 0.92rem; margin: 0; color: var(--text-main);">${text}</p>
        </div>
        <span class="feed-time">${dateStr}</span>
      `;
      commentsList.appendChild(li);
      commentForm.reset();
    });
  }

  /* ==========================================================================
     14. CASE STUDIES: CLIENT VOICES ROTATOR
     ========================================================================== */
  const quoteSlides = document.querySelectorAll('.quote-slide');
  const prevQuoteBtn = document.getElementById('prevQuote');
  const nextQuoteBtn = document.getElementById('nextQuote');
  let currentQuoteIndex = 0;

  function showQuote(idx) {
    if (!quoteSlides.length) return;
    quoteSlides.forEach((slide, i) => {
      slide.style.display = i === idx ? 'block' : 'none';
    });
  }

  if (quoteSlides.length) {
    showQuote(0);
    if (nextQuoteBtn) {
      nextQuoteBtn.addEventListener('click', () => {
        currentQuoteIndex = (currentQuoteIndex + 1) % quoteSlides.length;
        showQuote(currentQuoteIndex);
      });
    }
    if (prevQuoteBtn) {
      prevQuoteBtn.addEventListener('click', () => {
        currentQuoteIndex = (currentQuoteIndex - 1 + quoteSlides.length) % quoteSlides.length;
        showQuote(currentQuoteIndex);
      });
    }
  }

  // Case Studies: Sector Folder Tabs
  const folderTabs = document.querySelectorAll('.folder-tab');
  if (folderTabs.length) {
    folderTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        folderTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  }

  /* ==========================================================================
     15. BESPOKE PRE-FOOTER INTERACTIVE MODULES
     ========================================================================== */
  // A. Services: Modular Bundle Builder
  const bundleChips = document.querySelectorAll('.bundle-chip');
  const bundleCountEl = document.getElementById('bundleCount');
  const bundleDiscountEl = document.getElementById('bundleDiscount');

  function updateBundleTally() {
    const selectedCount = document.querySelectorAll('.bundle-chip.selected').length;
    if (bundleCountEl) bundleCountEl.textContent = selectedCount;
    if (bundleDiscountEl) {
      if (selectedCount >= 4) {
        bundleDiscountEl.textContent = '20% Off Unified Transit SLA';
      } else if (selectedCount >= 2) {
        bundleDiscountEl.textContent = '15% Off Total Transit SLA';
      } else {
        bundleDiscountEl.textContent = 'Standard Volume Rates';
      }
    }
  }

  bundleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const input = chip.querySelector('input');
      if (input) input.checked = chip.classList.contains('selected');
      updateBundleTally();
    });
  });

  // B. Service Details: Calendar Slots Selector
  const dayPills = document.querySelectorAll('.calendar-day-pill');
  const timePills = document.querySelectorAll('.calendar-time-pill');

  dayPills.forEach(pill => {
    pill.addEventListener('click', () => {
      dayPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  timePills.forEach(pill => {
    pill.addEventListener('click', () => {
      timePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  // C. Contact: Live Operational Hub Clocks
  function updateHubClocks() {
    const now = new Date();
    const timezones = {
      'clockLondon': 'Europe/London',
      'clockNewYork': 'America/New_York',
      'clockSingapore': 'Asia/Singapore',
      'clockDubai': 'Asia/Dubai'
    };

    for (const [id, tz] of Object.entries(timezones)) {
      const el = document.getElementById(id);
      if (el) {
        try {
          const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });
          el.textContent = formatter.format(now);
        } catch (e) {
          // fallback
          el.textContent = now.toTimeString().split(' ')[0];
        }
      }
    }
  }

  if (document.getElementById('clockLondon')) {
    updateHubClocks();
    setInterval(updateHubClocks, 1000);
  }

  // D. Pricing: Drag-and-drop RFP Dropzone
  const dropzone = document.getElementById('rfpDropzone');
  const rfpFileInput = document.getElementById('rfpFileInput');
  const dropzoneText = document.getElementById('dropzoneFeedback');

  if (dropzone && rfpFileInput) {
    dropzone.addEventListener('click', () => rfpFileInput.click());
    
    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files.length) {
        rfpFileInput.files = e.dataTransfer.files;
        if (dropzoneText) {
          dropzoneText.textContent = `✓ Uploaded: ${e.dataTransfer.files[0].name} (${(e.dataTransfer.files[0].size/1024).toFixed(0)} KB)`;
          dropzoneText.style.color = 'var(--accent-color)';
        }
      }
    });

    rfpFileInput.addEventListener('change', () => {
      if (rfpFileInput.files.length && dropzoneText) {
        dropzoneText.textContent = `✓ Selected: ${rfpFileInput.files[0].name}`;
        dropzoneText.style.color = 'var(--accent-color)';
      }
    });
  }

  // E. Blog: Topic interest tags toggle
  document.querySelectorAll('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });
});
