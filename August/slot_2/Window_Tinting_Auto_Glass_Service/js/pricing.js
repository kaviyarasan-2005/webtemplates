/* ============================================================
   Tintex — Pricing Page & Interactive Calculator
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Calculator State
  let basePrice = 249; // Sedan default
  let filmAddon = 100; // Ceramic default
  let extraAddons = 0;

  const priceDisplay = document.getElementById('calc-total-display');
  const packageDesc = document.getElementById('calc-package-desc');
  const bookBtn = document.getElementById('calc-book-btn');

  function updateCalc() {
    const total = basePrice + filmAddon + extraAddons;
    if (priceDisplay) {
      priceDisplay.textContent = `$${total}`;
    }

    // Build package summary text
    const activeVehicle = document.querySelector('.calc-opt-vehicle.active')?.dataset.name || 'Sedan';
    const activeFilm = document.querySelector('.calc-opt-film.active')?.dataset.name || 'Ceramic';
    if (packageDesc) {
      packageDesc.textContent = `${activeVehicle} with ${activeFilm} Window Tinting Package`;
    }

    if (bookBtn) {
      bookBtn.href = `contact.html?service=tint&vehicle=${encodeURIComponent(activeVehicle)}&film=${encodeURIComponent(activeFilm)}&est=${total}`;
    }
  }

  // Vehicle selection
  document.querySelectorAll('.calc-opt-vehicle').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.calc-opt-vehicle').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      basePrice = parseInt(btn.dataset.price, 10) || 249;
      updateCalc();
    });
  });

  // Film Grade selection
  document.querySelectorAll('.calc-opt-film').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.calc-opt-film').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filmAddon = parseInt(btn.dataset.addon, 10) || 0;
      updateCalc();
    });
  });

  // Add-on checkboxes / toggles
  document.querySelectorAll('.calc-opt-addon').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      recalcAddons();
      updateCalc();
    });
  });

  function recalcAddons() {
    extraAddons = 0;
    document.querySelectorAll('.calc-opt-addon.active').forEach(btn => {
      extraAddons += parseInt(btn.dataset.addon, 10) || 0;
    });
  }

  // Initial Calculation
  updateCalc();
});
