/**
 * VELOX — Pricing & Estimator JavaScript
 * pricing.js
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ─── Service Cost Estimator ──────────────────────────────
  const estimatorForm = document.getElementById('estimator-form');
  const estPrice = document.getElementById('est-price');

  const basePrices = {
    tune: { road: [45, 75], mountain: [50, 80], city: [40, 65], ebike: [65, 95] },
    overhaul: { road: [180, 280], mountain: [200, 310], city: [160, 240], ebike: [250, 380] },
    upgrade: { road: [120, 350], mountain: [140, 400], city: [100, 280], ebike: [180, 500] },
    custom: { road: [1800, 4500], mountain: [2000, 5500], city: [800, 2000], ebike: [2500, 6000] },
    fit: { road: [150, 220], mountain: [160, 230], city: [120, 180], ebike: [160, 220] },
  };

  const urgencyMult = { standard: 1, express: 1.25, sameday: 1.5 };

  const updateEstimate = () => {
    if (!estPrice) return;
    const service = document.getElementById('est-service')?.value || 'tune';
    const bike = document.getElementById('est-bike')?.value || 'road';
    const urgency = document.getElementById('est-urgency')?.value || 'standard';

    const base = basePrices[service]?.[bike] || [45, 75];
    const mult = urgencyMult[urgency] || 1;
    const low = Math.round(base[0] * mult);
    const high = Math.round(base[1] * mult);

    estPrice.textContent = `$${low.toLocaleString()} – $${high.toLocaleString()}`;
  };

  if (estimatorForm) {
    estimatorForm.querySelectorAll('select').forEach(sel => {
      sel.addEventListener('change', updateEstimate);
    });
    updateEstimate();
  }

  // ─── Pricing Page: Category Filter ──────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      filterItems.forEach(item => {
        const cat = item.dataset.category;
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          item.classList.add('visible');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Activate "All" button by default
  const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (allBtn) allBtn.classList.add('active');
});
