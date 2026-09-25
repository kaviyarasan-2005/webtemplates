/**
 * DEAL — Home 1 JS
 */
(function () {
  'use strict';

  /* ── Vault Door Reveal ── */
  function initVaultReveal () {
    const heroContent = document.querySelector('.vault-hero-content');
    const leftPanel   = document.querySelector('.vault-panel-left');
    const rightPanel  = document.querySelector('.vault-panel-right');
    const signature   = document.querySelector('.signature-path');

    // Trigger reveal after a short delay on load
    setTimeout(() => {
      if (leftPanel) leftPanel.classList.add('open');
      if (rightPanel) rightPanel.classList.add('open');
      if (heroContent) heroContent.classList.add('visible');
    }, 400);

    // Signature observer
    if (signature && 'IntersectionObserver' in window) {
      const sigObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            signature.classList.add('drawn');
            sigObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      sigObserver.observe(signature);
    } else if (signature) {
      signature.classList.add('drawn');
    }
  }

  /* ── Opportunity Compass ── */
  function initCompass () {
    const btns = document.querySelectorAll('.compass-btn');
    const previewImg = document.querySelector('.compass-preview-img img');
    const title = document.querySelector('.compass-preview-title');
    const desc = document.querySelector('.compass-preview-desc');
    const stats = document.querySelectorAll('.compass-stat-value');

    const data = {
      retail: {
        title: 'Retail & E-Commerce',
        desc: 'High-traffic storefronts and established digital brands with scalable supply chains.',
        stats: ['24', '$1.2M', '14%'] // Available, Avg Value, Cap Rate
      },
      food: {
        title: 'Food & Beverage',
        desc: 'Turnkey restaurant operations, franchised QSRs, and specialized food production.',
        stats: ['38', '$850K', '18%']
      },
      health: {
        title: 'Health & Wellness',
        desc: 'Boutique fitness centers, medical spas, and established specialized clinics.',
        stats: ['12', '$2.1M', '11%']
      },
      services: {
        title: 'B2B Services',
        desc: 'Commercial cleaning, IT managed services, and professional consulting firms.',
        stats: ['45', '$1.5M', '22%']
      }
    };

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const key = btn.dataset.category;
        const info = data[key];

        if (info) {
          // Fade effect
          if (previewImg) previewImg.style.opacity = 0;
          setTimeout(() => {
            if (title) title.textContent = info.title;
            if (desc) desc.textContent = info.desc;
            if (stats.length === 3) {
              stats[0].textContent = info.stats[0];
              stats[1].textContent = info.stats[1];
              stats[2].textContent = info.stats[2];
            }
            if (previewImg) previewImg.style.opacity = 1;
          }, 300);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initVaultReveal();
    initCompass();
  });

})();
