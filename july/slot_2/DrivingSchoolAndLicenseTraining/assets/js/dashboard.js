/* ============================================
   DRIV — Dashboard JavaScript
   Admin & User Dashboard functionality
   ============================================ */

(function () {
  'use strict';

  // ---- Sidebar ----
  const Sidebar = {
    init() {
      this.sidebar = document.querySelector('.sidebar');
      this.toggleBtn = document.querySelector('.sidebar__toggle');

      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggle();
        });
      }

      // Close mobile sidebar on overlay click
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && this.sidebar && this.sidebar.classList.contains('mobile-open')) {
          if (!this.sidebar.contains(e.target) && !this.toggleBtn?.contains(e.target)) {
            this.sidebar.classList.remove('mobile-open');
          }
        }
      });

      // Set active sidebar link
      this.setActive();

      // Remove collapsed class in mobile view on load and resize
      const checkMobileState = () => {
        if (window.innerWidth <= 1024 && this.sidebar && this.sidebar.classList.contains('collapsed')) {
          this.sidebar.classList.remove('collapsed');
        }
      };
      checkMobileState();
      window.addEventListener('resize', checkMobileState);
    },
    toggle() {
      if (this.sidebar) {
        if (window.innerWidth <= 1024) {
          this.sidebar.classList.toggle('mobile-open');
        } else {
          this.sidebar.classList.toggle('collapsed');
        }
      }
    },
    setActive() {
      const currentPage = window.location.pathname.split('/').pop();
      document.querySelectorAll('.sidebar__link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
          link.classList.add('active');
        }
      });
    }
  };

  // ---- Charts (Chart.js) ----
  const Charts = {
    colors: {
      primary: '#FF6B35',
      primaryLight: 'rgba(255, 107, 53, 0.15)',
      accent: '#CC5020',
      success: '#2ECC71',
      warning: '#F39C12',
      error: '#E74C3C',
      info: '#3498DB',
      grey: '#6E6E78',
      greyLight: 'rgba(110, 110, 120, 0.1)',
      text: '#1A1A1E',
      border: '#E2E2E6'
    },

    init() {
      if (typeof Chart === 'undefined') return;

      // Global Chart.js defaults
      Chart.defaults.font.family = "'Inter', sans-serif";
      Chart.defaults.font.size = 12;
      Chart.defaults.plugins.legend.labels.usePointStyle = true;
      Chart.defaults.plugins.legend.labels.padding = 16;
      Chart.defaults.plugins.tooltip.backgroundColor = '#252530';
      Chart.defaults.plugins.tooltip.titleFont = { weight: '600' };
      Chart.defaults.plugins.tooltip.padding = 12;
      Chart.defaults.plugins.tooltip.cornerRadius = 8;

      // Detect dark mode for chart text colors
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const textColor = isDark ? '#B0B0B8' : '#6E6E78';
      const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

      Chart.defaults.color = textColor;
      Chart.defaults.scale = Chart.defaults.scale || {};

      // Admin Dashboard Charts
      this.initRevenueChart(gridColor);
      this.initBookingStatusChart();
      this.initInstructorsChart(gridColor);

      // User Dashboard Charts
      this.initHoursChart(gridColor);
      this.initProgressChart();

      // Mini charts in stat cards
      this.initMiniCharts();
    },

    initRevenueChart(gridColor) {
      const ctx = document.getElementById('revenue-chart');
      if (!ctx) return;

      const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const revenueData = [18500, 22300, 19800, 25600, 28400, 31200, 29800, 33500, 35200, 32100, 37800, 41200];
      const expenseData = [12000, 14200, 13500, 16800, 18200, 19500, 18800, 21000, 22400, 20800, 24500, 26100];

      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Revenue',
              data: revenueData,
              borderColor: this.colors.primary,
              backgroundColor: this.colors.primaryLight,
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 6,
              pointBackgroundColor: this.colors.primary
            },
            {
              label: 'Expenses',
              data: expenseData,
              borderColor: this.colors.grey,
              backgroundColor: this.colors.greyLight,
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 6,
              pointBackgroundColor: this.colors.grey
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { intersect: false, mode: 'index' },
          plugins: {
            legend: { position: 'top', align: 'end' },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: $${ctx.raw.toLocaleString()}`
              }
            }
          },
          scales: {
            x: { grid: { display: false }, border: { display: false } },
            y: {
              grid: { color: gridColor },
              border: { display: false },
              ticks: { callback: (v) => '$' + (v / 1000) + 'k' }
            }
          }
        }
      });
    },

    initBookingStatusChart() {
      const ctx = document.getElementById('booking-status-chart');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
          datasets: [{
            data: [35, 18, 120, 12],
            backgroundColor: [this.colors.primary, this.colors.info, this.colors.success, this.colors.error],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    },

    initInstructorsChart(gridColor) {
      const ctx = document.getElementById('instructors-chart');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['James M.', 'Sarah K.', 'David L.', 'Emma T.', 'Robert P.'],
          datasets: [{
            label: 'Pass Rate %',
            data: [97, 95, 93, 91, 89],
            backgroundColor: [
              this.colors.primary,
              'rgba(255, 107, 53, 0.8)',
              'rgba(255, 107, 53, 0.6)',
              'rgba(255, 107, 53, 0.4)',
              'rgba(255, 107, 53, 0.3)'
            ],
            borderRadius: 6,
            barThickness: 28
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: { label: (ctx) => `Pass Rate: ${ctx.raw}%` }
            }
          },
          scales: {
            x: {
              grid: { color: gridColor },
              border: { display: false },
              max: 100,
              ticks: { callback: (v) => v + '%' }
            },
            y: {
              grid: { display: false },
              border: { display: false }
            }
          }
        }
      });
    },

    initHoursChart(gridColor) {
      const ctx = document.getElementById('hours-chart');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
          datasets: [{
            label: 'Hours',
            data: [2, 3, 2.5, 4, 3, 3.5, 2, 4.5],
            backgroundColor: this.colors.primary,
            borderRadius: 6,
            barThickness: 32
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: { label: (ctx) => `${ctx.raw} hours` }
            }
          },
          scales: {
            x: { grid: { display: false }, border: { display: false } },
            y: {
              grid: { color: gridColor },
              border: { display: false },
              ticks: { callback: (v) => v + 'h' }
            }
          }
        }
      });
    },

    initProgressChart() {
      const ctx = document.getElementById('progress-chart');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Theory', 'Basic Controls', 'Road Driving', 'Maneuvers', 'Remaining'],
          datasets: [{
            data: [100, 85, 60, 30, 25],
            backgroundColor: [
              this.colors.success,
              this.colors.primary,
              this.colors.info,
              this.colors.warning,
              this.colors.greyLight
            ],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    },

    initMiniCharts() {
      // Mini line chart
      const miniLine = document.getElementById('mini-line-chart');
      if (miniLine) {
        new Chart(miniLine, {
          type: 'line',
          data: {
            labels: ['', '', '', '', '', '', ''],
            datasets: [{
              data: [30, 45, 35, 55, 48, 60, 72],
              borderColor: this.colors.primary,
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 0,
              fill: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } }
          }
        });
      }

      // Mini bar chart
      const miniBar = document.getElementById('mini-bar-chart');
      if (miniBar) {
        new Chart(miniBar, {
          type: 'bar',
          data: {
            labels: ['', '', '', '', '', '', ''],
            datasets: [{
              data: [18, 25, 22, 30, 28, 35, 41],
              backgroundColor: this.colors.primary,
              borderRadius: 2,
              barThickness: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } }
          }
        });
      }

      // Mini pie chart
      const miniPie = document.getElementById('mini-pie-chart');
      if (miniPie) {
        new Chart(miniPie, {
          type: 'doughnut',
          data: {
            labels: ['Pass', 'Fail'],
            datasets: [{
              data: [95, 5],
              backgroundColor: [this.colors.primary, this.colors.greyLight],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
          }
        });
      }

      // Mini area chart
      const miniArea = document.getElementById('mini-area-chart');
      if (miniArea) {
        new Chart(miniArea, {
          type: 'line',
          data: {
            labels: ['', '', '', '', '', '', ''],
            datasets: [{
              data: [5, 8, 6, 12, 10, 14, 18],
              borderColor: this.colors.primary,
              backgroundColor: this.colors.primaryLight,
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 0,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } }
          }
        });
      }
    }
  };

  // ---- Table Sorting ----
  const TableSort = {
    init() {
      document.querySelectorAll('.table th[data-sort]').forEach(th => {
        th.style.cursor = 'pointer';
        th.addEventListener('click', () => {
          const table = th.closest('table');
          const tbody = table.querySelector('tbody');
          const colIndex = Array.from(th.parentElement.children).indexOf(th);
          const rows = Array.from(tbody.querySelectorAll('tr'));
          const isAsc = th.classList.contains('sort-asc');

          // Reset all headers
          table.querySelectorAll('th[data-sort]').forEach(h => {
            h.classList.remove('sort-asc', 'sort-desc');
          });

          th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');

          rows.sort((a, b) => {
            const aVal = a.children[colIndex]?.textContent.trim() || '';
            const bVal = b.children[colIndex]?.textContent.trim() || '';

            if (!isNaN(aVal) && !isNaN(bVal)) {
              return isAsc ? bVal - aVal : aVal - bVal;
            }
            return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
          });

          rows.forEach(row => tbody.appendChild(row));
        });
      });
    }
  };

  // ---- Status Filter ----
  const StatusFilter = {
    init() {
      document.querySelectorAll('.status-filter').forEach(select => {
        select.addEventListener('change', () => {
          const status = select.value.toLowerCase();
          const table = document.querySelector(select.getAttribute('data-table'));
          if (!table) return;

          table.querySelectorAll('tbody tr').forEach(row => {
            const badge = row.querySelector('.badge');
            if (!badge) return;
            const rowStatus = badge.textContent.trim().toLowerCase();
            row.style.display = (status === 'all' || rowStatus === status) ? '' : 'none';
          });
        });
      });
    }
  };

  // ---- Topbar User Dropdown ----
  const TopbarDropdown = {
    init() {
      const user = document.querySelector('.topbar__user');
      const dropdown = document.querySelector('.topbar__user-dropdown');
      if (!user || !dropdown) return;

      user.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      document.addEventListener('click', () => {
        dropdown.classList.remove('open');
      });
    }
  };

  // ---- Init ----
  function init() {
    Sidebar.init();
    Charts.init();
    TableSort.init();
    StatusFilter.init();
    TopbarDropdown.init();

    // Re-initialize charts on theme change
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        setTimeout(() => {
          // Destroy existing charts and re-init
          Chart.helpers?.each(Chart.instances, (instance) => {
            instance.destroy();
          });
          Charts.init();
        }, 100);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
