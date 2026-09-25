/**
 * DEAL — Home 2 JS
 */
(function () {
  'use strict';

  /* ── Constellation Map Tooltips ── */
  function initConstellation () {
    const nodes = document.querySelectorAll('.constellation-node');
    const tooltip = document.getElementById('constellation-tooltip');
    const tTitle = tooltip ? tooltip.querySelector('.constellation-tooltip-title') : null;
    const tRange = tooltip ? tooltip.querySelector('.constellation-tooltip-range') : null;

    nodes.forEach(node => {
      node.addEventListener('mouseenter', (e) => {
        if (!tooltip) return;
        const rect = node.getBoundingClientRect();
        const mapRect = node.closest('svg').getBoundingClientRect();

        // Position tooltip relative to SVG
        const x = rect.left - mapRect.left + (rect.width / 2);
        const y = rect.top - mapRect.top - 10;

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        tooltip.style.transform = `translate(-50%, -100%) scale(1)`;

        if (tTitle) tTitle.textContent = node.dataset.title;
        if (tRange) tRange.textContent = node.dataset.range;

        tooltip.classList.add('show');
      });

      node.addEventListener('mouseleave', () => {
        if (tooltip) {
          tooltip.classList.remove('show');
          tooltip.style.transform = `translate(-50%, -100%) scale(0.9)`;
        }
      });
    });
  }

  /* ── Investment Dials Console ── */
  function initDials () {
    const sliders = document.querySelectorAll('.dial-slider');
    const countDisplay = document.getElementById('dial-count');
    const matchContainer = document.getElementById('dial-matches-container');

    const matchDB = [
      { name: 'Fitness Studio Franchise', inv: 150000 },
      { name: 'Commercial Cleaning Route', inv: 75000 },
      { name: 'QSR Fast Food Outlet', inv: 350000 },
      { name: 'Boutique Coffee Shop', inv: 220000 },
      { name: 'Home Care Services', inv: 95000 },
      { name: 'Automotive Repair Center', inv: 450000 },
      { name: 'B2B Printing Hub', inv: 180000 },
      { name: 'Tutoring Center', inv: 110000 }
    ];

    function updateDials () {
      let budgetVal = 0;
      sliders.forEach(slider => {
        const valDisplay = document.getElementById(slider.id + '-val');
        if (valDisplay) {
          if (slider.id === 'dial-budget') {
            budgetVal = parseInt(slider.value);
            valDisplay.textContent = '$' + (budgetVal / 1000) + 'k';
          } else if (slider.id === 'dial-terr') {
            valDisplay.textContent = slider.value + ' Units';
          } else {
            const arr = ['Passive', 'Semi-absentee', 'Owner-Op'];
            valDisplay.textContent = arr[parseInt(slider.value) - 1];
          }
        }
      });

      // Filter dummy data based on budget
      const filtered = matchDB.filter(m => m.inv <= budgetVal).slice(0, 3);
      if (countDisplay) {
        countDisplay.textContent = matchDB.filter(m => m.inv <= budgetVal).length * 12 + Math.floor(Math.random() * 5); // Add some fake volume
      }

      if (matchContainer) {
        matchContainer.innerHTML = '';
        filtered.forEach(m => {
          const div = document.createElement('div');
          div.className = 'dial-match-item';
          div.innerHTML = `<span class="dial-match-name">${m.name}</span><span class="dial-match-invest">$${(m.inv/1000)}k min</span>`;
          matchContainer.appendChild(div);
        });
        if (filtered.length === 0) {
          matchContainer.innerHTML = `<div class="dial-match-item"><span class="dial-match-name">Increase budget for matches</span></div>`;
        }
      }
    }

    sliders.forEach(s => s.addEventListener('input', updateDials));
    if (sliders.length > 0) updateDials();
  }

  /* ── Territory Atlas ── */
  function initAtlas () {
    const hotspots = document.querySelectorAll('.atlas-hotspot');
    const pTitle = document.getElementById('atlas-region-title');
    const pList = document.getElementById('atlas-list');

    const atlasData = {
      northeast: { title: 'Northeast Region', list: [{n:'Boutique Fitness',i:'$150k'},{n:'Home Services',i:'$80k'}] },
      south: { title: 'Southern Region', list: [{n:'QSR Multi-Unit',i:'$450k'},{n:'Auto Repair',i:'$220k'},{n:'Commercial Cleaning',i:'$60k'}] },
      midwest: { title: 'Midwest Region', list: [{n:'Senior Care',i:'$110k'},{n:'B2B Services',i:'$95k'}] },
      west: { title: 'Western Region', list: [{n:'Health & Wellness Spa',i:'$320k'},{n:'Tech Repair',i:'$140k'}] }
    };

    hotspots.forEach(spot => {
      spot.addEventListener('click', () => {
        hotspots.forEach(h => h.classList.remove('active'));
        spot.classList.add('active');

        const data = atlasData[spot.dataset.region];
        if (data && pTitle && pList) {
          pTitle.textContent = data.title;
          pList.innerHTML = '';
          data.list.forEach(item => {
            const div = document.createElement('div');
            div.className = 'atlas-listing';
            div.innerHTML = `<div class="atlas-listing-name">${item.n}</div><div class="atlas-listing-inv">Min: ${item.i}</div>`;
            pList.appendChild(div);
          });
        }
      });
    });
  }

  /* ── Dossier Tabs ── */
  function initDossier () {
    const btns = document.querySelectorAll('.dossier-tab-btn');
    const bodies = document.querySelectorAll('.dossier-body');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        btns.forEach(b => b.classList.remove('active'));
        bodies.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(targetId)?.classList.add('active');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initConstellation();
    initDials();
    initAtlas();
    initDossier();
  });

})();
