/*!
 * FESTA — pricing.js
 * Service Calculator + Add-on Toggles with Running Total
 */
(function () {
  'use strict';

  /* ══════════════════════════════════════════
     1. SERVICE COST CALCULATOR
  ══════════════════════════════════════════ */
  const calcForm    = document.getElementById('calcForm');
  const calcResult  = document.getElementById('calcResult');
  const calcDisplay = document.getElementById('calcPrice');

  const BASE_PRICES = {
    birthday:    299,
    wedding:     799,
    babyshower:  349,
    corporate:   599,
    graduation:  279,
    anniversary: 449,
  };

  const GUEST_MULTIPLIERS = {
    '1-25':    1.0,
    '26-50':   1.3,
    '51-100':  1.6,
    '101-200': 2.0,
    '201+':    2.6,
  };

  const DECOR_MULTIPLIERS = {
    basic:    1.0,
    standard: 1.4,
    premium:  1.85,
    luxury:   2.5,
  };

  function calcPrice() {
    if (!calcForm) return;
    const eventType  = calcForm.querySelector('#calcEvent')?.value;
    const guests     = calcForm.querySelector('#calcGuests')?.value;
    const decorLevel = calcForm.querySelector('#calcDecor')?.value;

    if (!eventType || !guests || !decorLevel) {
      if (calcDisplay) calcDisplay.textContent = '--';
      return;
    }

    const base   = BASE_PRICES[eventType]       || 299;
    const gMult  = GUEST_MULTIPLIERS[guests]    || 1;
    const dMult  = DECOR_MULTIPLIERS[decorLevel]|| 1;
    const total  = Math.round(base * gMult * dMult);

    if (calcDisplay) {
      calcDisplay.textContent = '$' + total.toLocaleString();
      calcResult?.classList.remove('hidden');
      calcResult?.classList.add('visible');
    }
  }

  calcForm?.querySelectorAll('select').forEach(sel => sel.addEventListener('change', calcPrice));

  /* ══════════════════════════════════════════
     2. ADD-ON TOGGLES WITH RUNNING TOTAL
  ══════════════════════════════════════════ */
  const addonToggles  = document.querySelectorAll('[data-addon-price]');
  const totalDisplay  = document.getElementById('addonTotal');
  const BASE_PACKAGE  = parseInt(document.getElementById('basePackagePrice')?.dataset.price || '0', 10);

  function updateAddonTotal() {
    if (!totalDisplay) return;
    let extra = 0;
    addonToggles.forEach(toggle => {
      if (toggle.checked) extra += parseInt(toggle.dataset.addonPrice, 10);
    });
    totalDisplay.textContent = '$' + (BASE_PACKAGE + extra).toLocaleString();
  }

  addonToggles.forEach(t => t.addEventListener('change', updateAddonTotal));
  updateAddonTotal();

  /* ══════════════════════════════════════════
     3. INTERACTIVE SLIDER CALCULATOR
  ══════════════════════════════════════════ */
  window.updateGuestCalc = function (val) {
    const guestCountVal = document.getElementById('guestCountVal');
    const btnGuestVal   = document.getElementById('btnGuestVal');
    const sliderPrice   = document.getElementById('sliderPrice');
    if (guestCountVal) guestCountVal.textContent = val;
    if (btnGuestVal)   btnGuestVal.textContent   = val;
    if (sliderPrice) {
      const price = Math.round(val * 9);
      sliderPrice.textContent = '$' + price.toLocaleString();
    }
  };

})();
