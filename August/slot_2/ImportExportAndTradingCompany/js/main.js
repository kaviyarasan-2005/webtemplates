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
  
  // ==========================================================================
  // PAGE 2: REDESIGNED HOME 2 INTERACTIVITY
  // ==========================================================================

  // 1. Panoramic 4-Bay Physical Commodity Specimen Dock & Allocation Terminal
  const specimenBayCards = document.querySelectorAll('.specimen-bay-card');
  const terminalCommodityName = document.getElementById('terminal-commodity-name');
  const terminalShipName = document.getElementById('terminal-ship-name');
  const terminalCorridorText = document.getElementById('terminal-corridor-text');
  const terminalLeadText = document.getElementById('terminal-lead-text');
  const terminalSpecText = document.getElementById('terminal-spec-text');
  const terminalAssayText = document.getElementById('terminal-assay-text');
  const terminalVolumeSelect = document.getElementById('terminal-volume-select');
  const terminalIncotermPills = document.querySelectorAll('.terminal-incoterm-pills .term-pill-btn');
  const terminalTotalPrice = document.getElementById('terminal-total-price');
  const terminalLockBtn = document.getElementById('terminal-lock-btn');

  let activeBayPrice = 9480;
  let activeBayCommodity = 'copper';
  let activeTerminalIncoterm = 'CIF';

  function updateTerminalBookingTotal() {
    if (!terminalTotalPrice || !terminalVolumeSelect) return;
    const volume = parseFloat(terminalVolumeSelect.value) || 500;
    let multiplier = 1.0;
    if (activeTerminalIncoterm === 'FOB') multiplier = 0.96;
    if (activeTerminalIncoterm === 'DDP') multiplier = 1.12;

    const total = Math.round(activeBayPrice * volume * multiplier);
    terminalTotalPrice.textContent = '$' + total.toLocaleString() + ' USD';

    if (terminalLockBtn) {
      terminalLockBtn.href = `contact.html?commodity=${encodeURIComponent(activeBayCommodity)}&volume=${volume}&term=${activeTerminalIncoterm}`;
    }
  }

  if (specimenBayCards.length > 0) {
    specimenBayCards.forEach(card => {
      card.addEventListener('click', () => {
        specimenBayCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        activeBayPrice = parseFloat(card.getAttribute('data-price')) || 9480;
        activeBayCommodity = card.getAttribute('data-commodity') || 'copper';

        if (terminalCommodityName) terminalCommodityName.textContent = card.getAttribute('data-name');
        if (terminalShipName) terminalShipName.textContent = card.getAttribute('data-ship');
        if (terminalCorridorText) terminalCorridorText.textContent = `${card.getAttribute('data-origin')} ➔ Waalhaven Rotterdam`;
        if (terminalLeadText) terminalLeadText.textContent = card.getAttribute('data-lead');
        if (terminalSpecText) terminalSpecText.textContent = card.getAttribute('data-spec');
        if (terminalAssayText) terminalAssayText.textContent = card.getAttribute('data-assay');

        // Adjust volume select options if Unit vs MT
        const unit = card.getAttribute('data-unit') || 'MT';
        if (terminalVolumeSelect) {
          if (unit === 'Unit') {
            terminalVolumeSelect.innerHTML = `
              <option value="1">1 Unit (Flat-Rack FCL)</option>
              <option value="2" selected>2 Units (~1 40ft FCL)</option>
              <option value="5">5 Units (Fleet Allocation)</option>
              <option value="10">10 Units (Turnkey Line)</option>
            `;
          } else {
            terminalVolumeSelect.innerHTML = `
              <option value="100">100 MT (~4 TEU)</option>
              <option value="250">250 MT (~10 TEU)</option>
              <option value="500" selected>500 MT (~20 TEU)</option>
              <option value="1000">1,000 MT (~40 TEU)</option>
              <option value="2500">2,500 MT (Full Hold)</option>
            `;
          }
        }

        updateTerminalBookingTotal();
      });
    });
  }

  if (terminalVolumeSelect) {
    terminalVolumeSelect.addEventListener('change', updateTerminalBookingTotal);
  }

  if (terminalIncotermPills.length > 0) {
    terminalIncotermPills.forEach(pill => {
      pill.addEventListener('click', () => {
        terminalIncotermPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeTerminalIncoterm = pill.getAttribute('data-incoterm');
        updateTerminalBookingTotal();
      });
    });
  }

  if (terminalVolumeSelect && terminalTotalPrice) {
    updateTerminalBookingTotal();
  }

  // 3. Sourcing Corridor Matrix Filter Tabs
  const matrixFilterPills = document.querySelectorAll('.matrix-filter-pill');
  const matrixCards = document.querySelectorAll('.commodity-matrix-card');
  if (matrixFilterPills.length > 0 && matrixCards.length > 0) {
    matrixFilterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        matrixFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const filterVal = pill.getAttribute('data-filter');
        matrixCards.forEach(card => {
          if (filterVal === 'all' || card.getAttribute('data-cat') === filterVal) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. 4-Stage Provenance & Assay Pipeline
  const pipelineSteps = document.querySelectorAll('.pipeline-step-item');
  const coaStageTitle = document.getElementById('coa-stage-title');
  const coaLotCode = document.getElementById('coa-lot-code');
  const coaMetaCommodity = document.getElementById('coa-meta-commodity');
  const coaMetaProtocol = document.getElementById('coa-meta-protocol');
  const coaMetaInspector = document.getElementById('coa-meta-inspector');
  const coaTableBody = document.getElementById('coa-table-body');

  const pipelineStagesData = {
    "1": {
      title: "STAGE 01 // MINE ORIGIN & ESG AUDIT CERTIFICATE",
      lot: "ORIGIN-AUDIT #EXIM-2026-CHILE-0894",
      commodity: "Atacama Mine Extraction Pit 4B",
      protocol: "IRMA Standard / Conflict-Free Gold & Cu",
      inspector: "SGS On-Site Extraction Auditor",
      rows: `
        <tr><td><strong>Origin Pit Depth</strong></td><td>Surveyed Section</td><td>Bench 42 Level</td><td class="assay-pass">✓ VERIFIED</td></tr>
        <tr><td><strong>ESG Water Recycling</strong></td><td>Min 85% Target</td><td>94.2% Achieved</td><td class="assay-pass">✓ VERIFIED</td></tr>
        <tr><td><strong>Labor Standard ILO</strong></td><td>Zero Child / Forced</td><td>100% Compliant</td><td class="assay-pass">✓ VERIFIED</td></tr>
        <tr><td><strong>Batch Chain of Custody</strong></td><td>Tamper Tagging</td><td>RFID Chip #4401</td><td class="assay-pass">✓ VERIFIED</td></tr>
      `
    },
    "2": {
      title: "STAGE 02 // CERTIFICATE OF CHEMICAL ANALYSIS (COA)",
      lot: "LAB-ASSAY #EXIM-2026-CHILE-0894",
      commodity: "Electrolytic Copper Cathode Grade A",
      protocol: "ISO 12743 / Core Multi-Point Assay",
      inspector: "SGS Inspector Desk Waalhaven",
      rows: `
        <tr><td><strong>Copper (Cu)</strong></td><td>Min 99.9900%</td><td><strong>99.9935%</strong></td><td class="assay-pass">✓ PASS</td></tr>
        <tr><td><strong>Arsenic (As)</strong></td><td>Max 0.0005%</td><td>0.0001%</td><td class="assay-pass">✓ PASS</td></tr>
        <tr><td><strong>Sulfur (S)</strong></td><td>Max 0.0015%</td><td>0.0008%</td><td class="assay-pass">✓ PASS</td></tr>
        <tr><td><strong>Lead (Pb)</strong></td><td>Max 0.0005%</td><td>0.0002%</td><td class="assay-pass">✓ PASS</td></tr>
      `
    },
    "3": {
      title: "STAGE 03 // PORT LOADING & DRAFT SURVEY TELEMETRY",
      lot: "HOLD-SEAL #EXIM-2026-CHILE-0894",
      commodity: "M/V EXIM PACIFIC TRADER Hold #2 & #3",
      protocol: "IMO Cleanliness Standard / Electronic Seal",
      inspector: "Bureau Veritas Maritime Port Surveyor",
      rows: `
        <tr><td><strong>Hold Dryness & Desiccant</strong></td><td>Relative Humidity < 40%</td><td>28.4% RH</td><td class="assay-pass">✓ PASS</td></tr>
        <tr><td><strong>Draft Survey Tonnage</strong></td><td>Target 500.00 MT</td><td>500.42 MT Verified</td><td class="assay-pass">✓ PASS</td></tr>
        <tr><td><strong>Electronic Bolt Seal</strong></td><td>GPS Geo-Fenced</td><td>Seal #BV-9921-X</td><td class="assay-pass">✓ LOCKED</td></tr>
        <tr><td><strong>Nitrogen Purge Atmosphere</strong></td><td>O2 < 5% in Packaging</td><td>2.1% O2 Barrier</td><td class="assay-pass">✓ SECURED</td></tr>
      `
    },
    "4": {
      title: "STAGE 04 // BLOCKCHAIN SMART BILL OF LADING",
      lot: "BLOCKCHAIN-TX #0x9f4a...e12d-BL",
      commodity: "Confirmed Title & Escrow Release",
      protocol: "TradeTrust / UNCITRAL MLETR Compliant",
      inspector: "Automated Smart Escrow Oracles",
      rows: `
        <tr><td><strong>Phytosanitary EUR.1</strong></td><td>Authorized Authority</td><td>Digital Signed</td><td class="assay-pass">✓ EMITTED</td></tr>
        <tr><td><strong>Commercial Invoice</strong></td><td>L/C Verified MT700</td><td>Matching 100%</td><td class="assay-pass">✓ RELEASED</td></tr>
        <tr><td><strong>Customs Fast Track</strong></td><td>Green Channel Pre-Arrival</td><td>Approved Rotterdam</td><td class="assay-pass">✓ GREEN TRACK</td></tr>
        <tr><td><strong>Smart Escrow Settlement</strong></td><td>Letter of Credit Release</td><td>Dispatched to Seller</td><td class="assay-pass">✓ SETTLED</td></tr>
      `
    }
  };

  if (pipelineSteps.length > 0) {
    pipelineSteps.forEach(step => {
      step.addEventListener('click', () => {
        pipelineSteps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
        const stageNum = step.getAttribute('data-stage');
        const data = pipelineStagesData[stageNum];
        if (data) {
          if (coaStageTitle) coaStageTitle.textContent = data.title;
          if (coaLotCode) coaLotCode.textContent = data.lot;
          if (coaMetaCommodity) coaMetaCommodity.textContent = data.commodity;
          if (coaMetaProtocol) coaMetaProtocol.textContent = data.protocol;
          if (coaMetaInspector) coaMetaInspector.textContent = data.inspector;
          if (coaTableBody) coaTableBody.innerHTML = data.rows;
        }
      });
    });
  }

  // 5. Incoterms 2020 Interactive Allocator
  const incotermBtns = document.querySelectorAll('.incoterm-switch-bar .incoterm-btn');
  const milestoneNodes = document.querySelectorAll('#incoterms-milestones .milestone-node');
  const incotermSummaryTitle = document.getElementById('incoterm-summary-title');
  const incotermSummaryDesc = document.getElementById('incoterm-summary-desc');
  const incotermRecText = document.getElementById('incoterm-rec-text');

  const incotermsMatrixConfig = {
    EXW: {
      sellerSteps: [1],
      riskStep: 1,
      title: "EXW (Ex Works) — Maximum Buyer Liability",
      desc: "The seller makes goods available at their factory or warehouse gate. The buyer assumes all risks, export clearance permits, loading fees, ocean carriage, insurance, and import duties.",
      rec: "Rarely recommended for bulk commodities due to international export customs liability. Best suited for domestic buyers with existing regional freight fleets."
    },
    FOB: {
      sellerSteps: [1, 2, 3],
      riskStep: 4,
      title: "FOB (Free on Board) — Port of Loading Handover",
      desc: "EXIM handles mine transport, export permits, and loading onboard the vessel. Risk transfers to you once goods pass the ship's rail. You choose and contract the ocean charter carrier.",
      rec: "Ideal if you have long-term volume charter contracts with shipping lines and wish to control ocean freight routes directly."
    },
    CFR: {
      sellerSteps: [1, 2, 3, 4],
      riskStep: 4,
      title: "CFR (Cost and Freight) — Ocean Freight Paid by EXIM",
      desc: "EXIM charters and pays for ocean carriage to your destination port. However, marine insurance is excluded and risk transfers at loading port. The buyer must arrange separate cargo insurance.",
      rec: "Suitable for corporate buyers that maintain master open-cover marine insurance policies."
    },
    CIF: {
      sellerSteps: [1, 2, 3, 4, 5],
      riskStep: 4,
      title: "CIF (Cost, Insurance and Freight) — Recommended by EXIM",
      desc: "EXIM pays for inland haulage, export licenses, ocean vessel freight, and Institute Cargo Clauses (A) insurance to your designated destination deepwater port. You take over for destination port clearance and inland cartage, avoiding complex overseas vessel booking.",
      rec: "Best for international buyers seeking guaranteed freight rates without the liability of ocean vessel chartering."
    },
    DDP: {
      sellerSteps: [1, 2, 3, 4, 5, 6, 7, 8],
      riskStep: 8,
      title: "DDP (Delivered Duty Paid) — Complete Turnkey Door-to-Door",
      desc: "The ultimate white-glove trade service. EXIM manages every single milestone: overseas export, maritime freight, all-risks insurance, discharge port handling, import tariffs, customs duties, and final inland transport right to your factory warehouse door.",
      rec: "The preferred solution for manufacturers who want fixed, all-inclusive pricing without needing an in-house customs or maritime logistics department."
    }
  };

  function applyIncotermConfig(term) {
    const config = incotermsMatrixConfig[term];
    if (!config) return;

    if (incotermSummaryTitle) incotermSummaryTitle.textContent = config.title;
    if (incotermSummaryDesc) incotermSummaryDesc.textContent = config.desc;
    if (incotermRecText) incotermRecText.textContent = config.rec;

    milestoneNodes.forEach(node => {
      const stepNum = parseInt(node.getAttribute('data-milestone'), 10);
      const isSeller = config.sellerSteps.includes(stepNum);
      const isRisk = (stepNum === config.riskStep);

      node.classList.remove('seller-owned', 'buyer-owned', 'has-risk-transfer');
      const existingBadge = node.querySelector('.milestone-risk-badge');
      if (existingBadge) existingBadge.remove();

      if (isSeller) {
        node.classList.add('seller-owned');
        node.querySelector('.milestone-responsible-tag').textContent = 'EXIM';
      } else {
        node.classList.add('buyer-owned');
        node.querySelector('.milestone-responsible-tag').textContent = 'Buyer';
      }

      if (isRisk) {
        node.classList.add('has-risk-transfer');
        const badge = document.createElement('span');
        badge.className = 'milestone-risk-badge';
        badge.textContent = '● Risk Transfers Here';
        node.prepend(badge);
      }
    });
  }

  if (incotermBtns.length > 0) {
    incotermBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        incotermBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const term = btn.getAttribute('data-incoterm');
        applyIncotermConfig(term);
      });
    });
  }

  // 6. Bulk Vessel Fleet Telemetry Switcher
  const vesselTabs = document.querySelectorAll('.vessel-tabs-nav .vessel-tab-btn');
  const vesselNameDisplay = document.getElementById('vessel-name-display');
  const vesselTagDisplay = document.getElementById('vessel-tag-display');
  const specDwt = document.getElementById('spec-dwt');
  const specVolume = document.getElementById('spec-volume');
  const specCranes = document.getElementById('spec-cranes');
  const specDraft = document.getElementById('spec-draft');
  const vesselCargoText = document.getElementById('vessel-cargo-text');

  const activeShipName = document.getElementById('active-ship-name');
  const activeShipCorridor = document.getElementById('active-ship-corridor');
  const activeShipCoords = document.getElementById('active-ship-coords');
  const activeShipSpeed = document.getElementById('active-ship-speed');
  const activeShipEta = document.getElementById('active-ship-eta');

  const vesselFleetData = {
    panamax: {
      name: "Panamax Geared Dry Bulk Carrier",
      tag: "Lloyd's Register 100A1",
      dwt: "76,450 DWT MT",
      volume: "91,200 m³ (7 Holds)",
      cranes: "4 x 35 MT with Grabs",
      draft: "14.25 Meters",
      cargo: "Non-GMO Agricultural Soybeans & Corn, Fertilizer Urea, Refined Copper Cathodes, Bauxite, and Structural Steel Billets.",
      ship: "M/V EXIM PACIFIC TRADER",
      corridor: "Current Corridor: Malacca Strait ➔ Suez ➔ Rotterdam",
      coords: "Lat: 01°16' N // Lon: 103°50' E",
      speed: "13.8 knots (Eco-Engineered)",
      eta: "2026-10-24 06:00 UTC (On Schedule)"
    },
    heavylift: {
      name: "Multipurpose Project Heavy-Lift Vessel",
      tag: "DNV-GL +1A1 Project Cargo",
      dwt: "32,500 DWT MT",
      volume: "38,500 m³ + Flush Weather Deck",
      cranes: "2 x 250 MT (500 MT Tandem Lift)",
      draft: "9.80 Meters",
      cargo: "Industrial CNC Machining Centers, 2000 kVA Soundproof Generators, Steel Mill Plant Components, Wind Turbines, and Mining Shovels.",
      ship: "M/V EXIM ATLAS TITAN",
      corridor: "Current Corridor: Shanghai ➔ Houston Ship Channel",
      coords: "Lat: 28°45' N // Lon: 89°10' W",
      speed: "15.2 knots",
      eta: "2026-10-21 14:00 UTC (Berth Green-Tracked)"
    },
    container: {
      name: "Neo-Panamax High-Capacity Container Ship",
      tag: "ABS High-Efficiency Carrier",
      dwt: "128,000 DWT MT",
      volume: "12,500 TEU (1,200 Reefer Plugs)",
      cranes: "Gearless (Shore Gantry Compatible)",
      draft: "15.50 Meters",
      cargo: "Consolidated FCL Manufactured Electronics, Lithium Forklifts, Palletized Industrial Chemicals, and High-Value Packaged Goods.",
      ship: "M/V EXIM GLOBAL PIONEER",
      corridor: "Current Corridor: Ningbo ➔ Los Angeles Pier 400",
      coords: "Lat: 33°42' N // Lon: 118°15' W",
      speed: "18.6 knots",
      eta: "2026-10-19 18:00 UTC (Pilot Boarding Active)"
    },
    tanker: {
      name: "Stainless Steel Parcel Chemical Tanker",
      tag: "IMO Type II/III Chemical Tanker",
      dwt: "25,000 DWT MT",
      volume: "28,000 m³ (SUS316LN Steel)",
      cranes: "Center Manifold Hose Cranes",
      draft: "10.10 Meters",
      cargo: "Industrial Solvents, Biofuels, Liquid Fertilizers, Base Lubricants, and Speciality Chemical Intermediates.",
      ship: "M/V EXIM CHEM NAVIGATOR",
      corridor: "Current Corridor: Singapore ➔ Antwerp Petrochemical Hub",
      coords: "Lat: 51°14' N // Lon: 04°23' E",
      speed: "14.1 knots",
      eta: "2026-10-26 09:00 UTC (Nitrogen Blanket Verified)"
    }
  };

  if (vesselTabs.length > 0) {
    vesselTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        vesselTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const vesselKey = tab.getAttribute('data-vessel');
        const data = vesselFleetData[vesselKey];
        if (data) {
          if (vesselNameDisplay) vesselNameDisplay.textContent = data.name;
          if (vesselTagDisplay) vesselTagDisplay.textContent = data.tag;
          if (specDwt) specDwt.textContent = data.dwt;
          if (specVolume) specVolume.textContent = data.volume;
          if (specCranes) specCranes.textContent = data.cranes;
          if (specDraft) specDraft.textContent = data.draft;
          if (vesselCargoText) vesselCargoText.textContent = data.cargo;

          if (activeShipName) activeShipName.textContent = data.ship;
          if (activeShipCorridor) activeShipCorridor.textContent = data.corridor;
          if (activeShipCoords) activeShipCoords.textContent = data.coords;
          if (activeShipSpeed) activeShipSpeed.textContent = data.speed;
          if (activeShipEta) activeShipEta.textContent = data.eta;
        }
      });
    });
  }

  // Pricing - Departure Board Flap
  const departureBoard = document.querySelector('.departure-board');
  if (departureBoard) {
    // Split flap logic
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

