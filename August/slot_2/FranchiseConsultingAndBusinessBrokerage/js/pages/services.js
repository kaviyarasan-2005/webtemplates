/**
 * DEAL — Services JS
 */
(function () {
  'use strict';

  /* ── Engagement Stepper Animation ── */
  function initStepper () {
    const progress = document.querySelector('.stepper-progress');
    const steps = document.querySelectorAll('.stepper-step');
    if (!progress || steps.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      progress.style.width = '100%';
      steps.forEach(s => s.classList.add('done'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progress.style.width = '100%';
          steps.forEach((step, idx) => {
            setTimeout(() => step.classList.add('done'), idx * 300);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.stepper-track'));
  }

  /* ── Industry Wheel ── */
  function initWheel () {
    const segments = document.querySelectorAll('.wheel-segment');
    const resTitle = document.getElementById('wheel-res-title');
    const resList  = document.getElementById('wheel-res-list');

    const wheelData = {
      tech: { t: 'Technology & IT', list: [{n:'SaaS Platform', p:'$2.4M'}, {n:'Managed IT Services', p:'$1.1M'}] },
      health: { t: 'Healthcare', list: [{n:'Specialty Clinic', p:'$3.5M'}, {n:'Home Health Agency', p:'$850K'}] },
      retail: { t: 'Retail & E-Com', list: [{n:'Boutique Brand', p:'$450K'}, {n:'E-Com Store', p:'$920K'}] },
      mfg: { t: 'Manufacturing', list: [{n:'Precision Parts CNC', p:'$4.2M'}, {n:'Packaging Plant', p:'$2.8M'}] }
    };

    segments.forEach(seg => {
      seg.addEventListener('click', () => {
        segments.forEach(s => s.classList.remove('active'));
        seg.classList.add('active');

        const key = seg.dataset.industry;
        const d = wheelData[key];
        if (d && resTitle && resList) {
          resTitle.textContent = d.t;
          resList.innerHTML = '';
          d.list.forEach(item => {
            const div = document.createElement('div');
            div.className = 'wheel-result-item';
            div.innerHTML = `<span class="wheel-result-name">${item.n}</span><span class="wheel-result-price">${item.p}</span>`;
            resList.appendChild(div);
          });
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initStepper();
    initWheel();
  });
})();
