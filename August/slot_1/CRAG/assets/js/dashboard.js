/**
 * CRAG — dashboard.js
 * Chart.js charts, sidebar toggle, dashboard-specific logic
 */

'use strict';

/* ══════════════════════════════════════════════
   CHART.JS DEFAULTS (Brutalist Theme)
══════════════════════════════════════════════ */
function setupChartDefaults() {
  if (typeof Chart === 'undefined') return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor  = isDark ? '#fafafa' : '#0a0a0a';
  const gridColor  = isDark ? 'rgba(250,250,250,0.1)' : 'rgba(10,10,10,0.08)';

  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size   = 12;
  Chart.defaults.color       = textColor;
  Chart.defaults.borderColor = gridColor;
  Chart.defaults.plugins.tooltip.cornerRadius = 0;
  Chart.defaults.plugins.tooltip.borderWidth  = 2;
  Chart.defaults.plugins.tooltip.borderColor  = '#ea580c';
  Chart.defaults.plugins.tooltip.backgroundColor = isDark ? '#27272a' : '#ffffff';
  Chart.defaults.plugins.tooltip.titleColor   = '#ea580c';
  Chart.defaults.plugins.tooltip.bodyColor    = isDark ? '#fafafa' : '#0a0a0a';
  Chart.defaults.plugins.legend.labels.color  = textColor;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.padding = 20;
}

/* ══════════════════════════════════════════════
   ADMIN DASHBOARD CHARTS
══════════════════════════════════════════════ */
function initAdminCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const orange  = '#ea580c';
  const gridColor = isDark ? 'rgba(250,250,250,0.1)' : 'rgba(10,10,10,0.08)';

  // 1. LINE CHART — Monthly Revenue
  const lineCtx = document.getElementById('chart-revenue');
  if (lineCtx) {
    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
          label: 'Revenue ($)',
          data: [18400, 21200, 19800, 24600, 28300, 31500, 29800, 33100, 35600, 32400, 38200, 41800],
          borderColor: orange,
          borderWidth: 3,
          pointBackgroundColor: orange,
          pointBorderColor: isDark ? '#0a0a0a' : '#fafafa',
          pointBorderWidth: 2,
          pointRadius: 5,
          tension: 0,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { color: gridColor },
            border: { color: isDark ? '#fafafa' : '#0a0a0a' }
          },
          y: {
            grid: { color: gridColor },
            border: { color: isDark ? '#fafafa' : '#0a0a0a' },
            ticks: {
              callback: v => '$' + (v / 1000).toFixed(0) + 'k'
            }
          }
        }
      }
    });
  }

  // 2. BAR CHART — Visits by Zone
  const barCtx = document.getElementById('chart-zones');
  if (barCtx) {
    const zoneColors = isDark
      ? [orange, '#f97316', '#fafafa', '#a1a1aa']
      : [orange, '#52525b', '#18181b', '#a1a1aa'];

    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Bouldering', 'Top-Rope', 'Lead', 'Training'],
        datasets: [{
          label: 'Daily Visits',
          data: [342, 218, 156, 94],
          backgroundColor: zoneColors,
          borderWidth: 0,
          borderRadius: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            border: { color: isDark ? '#fafafa' : '#0a0a0a' }
          },
          y: {
            grid: { color: gridColor },
            border: { color: isDark ? '#fafafa' : '#0a0a0a' },
          }
        }
      }
    });
  }

  // 3. DOUGHNUT CHART — Member Types
  const doughnutCtx = document.getElementById('chart-members');
  if (doughnutCtx) {
    const memberColors = isDark
      ? [orange, '#fafafa', '#a1a1aa', '#f97316']
      : [orange, '#18181b', '#52525b', '#a1a1aa'];

    new Chart(doughnutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Day Pass', 'Monthly', 'Annual', 'Student'],
        datasets: [{
          data: [28, 42, 20, 10],
          backgroundColor: memberColors,
          borderWidth: 0,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              color: isDark ? '#fafafa' : '#0a0a0a'
            }
          }
        }
      }
    });
  }

  // 4. AREA CHART — Daily Check-ins
  const areaCtx = document.getElementById('chart-checkins');
  if (areaCtx) {
    const labels = Array.from({length: 30}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toLocaleDateString('en-US', {month:'short', day:'numeric'});
    });
    const data = [62,55,78,81,90,68,45,52,88,94,102,87,76,65,93,108,
                  112,98,84,71,60,77,89,103,97,85,78,95,110,118];

    new Chart(areaCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Check-ins',
          data,
          borderColor: orange,
          borderWidth: 2,
          backgroundColor: isDark ? 'rgba(234,88,12,0.25)' : 'rgba(234,88,12,0.15)',
          pointRadius: 0,
          tension: 0.35,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            border: { color: isDark ? '#fafafa' : '#0a0a0a' },
            ticks: {
              maxTicksLimit: 8,
              maxRotation: 0,
            }
          },
          y: {
            grid: { color: gridColor },
            border: { color: isDark ? '#fafafa' : '#0a0a0a' },
          }
        }
      }
    });
  }
}

/* ══════════════════════════════════════════════
   USER DASHBOARD CHARTS
══════════════════════════════════════════════ */
function initUserCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const orange  = '#ea580c';
  const gridColor = isDark ? 'rgba(250,250,250,0.1)' : 'rgba(10,10,10,0.08)';

  // 1. LINE CHART — Climbing Frequency
  const freqCtx = document.getElementById('chart-frequency');
  if (freqCtx) {
    new Chart(freqCtx, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
          label: 'Sessions',
          data: [6, 8, 10, 7, 12, 14, 11, 16, 13, 17, 15, 18],
          borderColor: orange,
          borderWidth: 3,
          pointBackgroundColor: orange,
          pointBorderColor: isDark ? '#0a0a0a' : '#fafafa',
          pointBorderWidth: 2,
          pointRadius: 5,
          tension: 0,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor }, border: { color: isDark ? '#fafafa' : '#0a0a0a' } },
          y: { grid: { color: gridColor }, border: { color: isDark ? '#fafafa' : '#0a0a0a' }, min: 0 }
        }
      }
    });
  }

  // 2. BAR CHART — Grade Distribution
  const gradeCtx = document.getElementById('chart-grades');
  if (gradeCtx) {
    const gradeColors = isDark
      ? ['#71717a', '#a1a1aa', orange, '#f97316', '#fafafa']
      : ['#a1a1aa', '#71717a', orange, '#c2440a', '#18181b'];

    new Chart(gradeCtx, {
      type: 'bar',
      data: {
        labels: ['VB', 'V0–V2', 'V3–V5', 'V6–V8', 'V9+'],
        datasets: [{
          label: 'Routes Sent',
          data: [12, 38, 52, 29, 8],
          backgroundColor: gradeColors,
          borderWidth: 0,
          borderRadius: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, border: { color: isDark ? '#fafafa' : '#0a0a0a' } },
          y: { grid: { color: gridColor }, border: { color: isDark ? '#fafafa' : '#0a0a0a' }, min: 0 }
        }
      }
    });
  }

  // 3. DOUGHNUT CHART — Time by Zone
  const zoneCtx = document.getElementById('chart-zones-user');
  if (zoneCtx) {
    const userZoneColors = isDark
      ? [orange, '#fafafa', '#a1a1aa', '#f97316']
      : [orange, '#18181b', '#52525b', '#a1a1aa'];

    new Chart(zoneCtx, {
      type: 'doughnut',
      data: {
        labels: ['Bouldering', 'Top-Rope', 'Lead', 'Training'],
        datasets: [{
          data: [52, 20, 18, 10],
          backgroundColor: userZoneColors,
          borderWidth: 0,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              color: isDark ? '#fafafa' : '#0a0a0a'
            }
          }
        }
      }
    });
  }

  // 4. RADAR CHART — Skill Breakdown
  const radarCtx = document.getElementById('chart-skills');
  if (radarCtx) {
    new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: ['Strength', 'Technique', 'Endurance', 'Flexibility', 'Mental', 'Route Reading'],
        datasets: [{
          label: 'Your Skills',
          data: [78, 85, 62, 58, 72, 80],
          borderColor: orange,
          borderWidth: 2,
          backgroundColor: 'rgba(234,88,12,0.15)',
          pointBackgroundColor: orange,
          pointRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: { stepSize: 25, display: false },
            grid: { color: gridColor },
            angleLines: { color: gridColor },
            pointLabels: { font: { size: 11, weight: '600' } }
          }
        }
      }
    });
  }
}

/* ══════════════════════════════════════════════
   SIDEBAR TOGGLE
══════════════════════════════════════════════ */
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const main    = document.querySelector('.dashboard-main');
  const toggleBtn = document.querySelector('.sidebar__toggle');
  const overlay = document.querySelector('.sidebar-overlay');
  const mobileToggle = document.getElementById('sidebar-mobile-toggle') || document.querySelector('.sidebar-mobile-toggle');

  if (!sidebar) return;

  // Desktop collapse
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isCollapsed = sidebar.classList.toggle('collapsed');
      if (main) main.classList.toggle('sidebar-collapsed', isCollapsed);
      toggleBtn.setAttribute('aria-expanded', !isCollapsed);
    });
  }

  // Mobile: hamburger opens sidebar as overlay drawer
  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = sidebar.classList.toggle('mobile-open');
      if (overlay) overlay.style.display = isOpen ? 'block' : 'none';
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close on overlay click
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.style.display = 'none';
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    });
  }

  // Close on link click inside mobile drawer
  document.querySelectorAll('.sidebar__link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        sidebar.classList.remove('mobile-open');
        if (overlay) overlay.style.display = 'none';
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Responsive: hide overlay on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      sidebar.classList.remove('mobile-open');
      if (overlay) overlay.style.display = 'none';
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  setupChartDefaults();
  initSidebar();

  // Initialize the right charts based on which page we're on
  if (document.getElementById('chart-revenue')) {
    initAdminCharts();
  }
  if (document.getElementById('chart-frequency')) {
    initUserCharts();
  }

  // Re-apply chart defaults on theme change
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      // Short delay to let theme apply, then redraw
      setTimeout(() => {
        Chart.helpers.each(Chart.instances, chart => chart.destroy());
        setupChartDefaults();
        if (document.getElementById('chart-revenue')) initAdminCharts();
        if (document.getElementById('chart-frequency')) initUserCharts();
      }, 100);
    });
  });
});
