/* ================================================================
   WASH — Dashboard JavaScript
   Chart.js initialization, sidebar, tables, interactions
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   1. SIDEBAR TOGGLE
   ---------------------------------------------------------------- */
const Sidebar = {
  init() {
    this.sidebar = document.querySelector('.sidebar');
    this.toggleBtn = document.querySelector('.sidebar__toggle');
    this.mobileToggle = document.querySelector('.dashboard-mobile-toggle');

    if (this.toggleBtn && this.sidebar) {
      this.toggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          this.sidebar.classList.remove('collapsed');
          this.sidebar.classList.toggle('mobile-open');
        } else {
          this.sidebar.classList.remove('mobile-open');
          this.sidebar.classList.toggle('collapsed');
          // Trigger a window resize event after CSS transition finishes (300ms)
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 300);
        }
      });
    }

    if (this.mobileToggle && this.sidebar) {
      this.mobileToggle.addEventListener('click', () => {
        this.sidebar.classList.toggle('mobile-open');
      });
    }

    // Close sidebar on clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024 && this.sidebar && this.sidebar.classList.contains('mobile-open')) {
        if (!this.sidebar.contains(e.target) && (!this.toggleBtn || !this.toggleBtn.contains(e.target)) && e.target !== this.mobileToggle) {
          this.sidebar.classList.remove('mobile-open');
        }
      }
    });
  }
};

/* ----------------------------------------------------------------
   2. CHART.JS INITIALIZATION
   ---------------------------------------------------------------- */
const DashboardCharts = {
  colors: {
    accent: '#D48C2E',
    accentLight: 'rgba(212, 140, 46, 0.15)',
    accentMedium: 'rgba(212, 140, 46, 0.5)',
    text: '#6B6570',
    border: 'rgba(42, 42, 46, 0.08)',
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C',
    info: '#3498DB',
    purple: '#9B59B6',
    gridLines: 'rgba(42, 42, 46, 0.06)'
  },

  init() {
    if (typeof Chart === 'undefined') return;

    // Set global Chart.js defaults
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = this.getTextColor();
    Chart.defaults.plugins.legend.display = true;
    Chart.defaults.plugins.legend.position = 'bottom';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 16;
    Chart.defaults.plugins.tooltip.backgroundColor = '#2A2A2E';
    Chart.defaults.plugins.tooltip.titleFont = { weight: '600' };
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.displayColors = true;

    // Initialize charts based on what's on the page
    this.initRevenueChart();
    this.initOrderStatusChart();
    this.initTopCustomersChart();
    this.initSpendingChart();
    this.initMiniCharts();
  },

  getTextColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'dark' ? '#A8A0AA' : '#6B6570';
  },

  getGridColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(42,42,46,0.06)';
  },

  /* Revenue Line/Area Chart */
  initRevenueChart() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Revenue ($)',
          data: [1200, 1900, 1500, 2200, 2800, 2400, 3100],
          borderColor: this.colors.accent,
          backgroundColor: this.colors.accentLight,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: this.colors.accent,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: this.getTextColor() }
          },
          y: {
            beginAtZero: true,
            grid: { color: this.getGridColor() },
            ticks: {
              color: this.getTextColor(),
              callback: (val) => '$' + val.toLocaleString()
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `Revenue: $${ctx.parsed.y.toLocaleString()}`
            }
          }
        }
      }
    });
  },

  /* Order Status Donut Chart */
  initOrderStatusChart() {
    const canvas = document.getElementById('orderStatusChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Scheduled', 'Out for Delivery'],
        datasets: [{
          data: [45, 25, 18, 12],
          backgroundColor: [
            this.colors.success,
            this.colors.accent,
            this.colors.info,
            this.colors.warning
          ],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              usePointStyle: true,
              font: { size: 12 }
            }
          }
        }
      }
    });
  },

  /* Top Customers Horizontal Bar Chart */
  initTopCustomersChart() {
    const canvas = document.getElementById('topCustomersChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Sarah M.', 'James K.', 'Emily R.', 'Robert T.', 'Lisa C.'],
        datasets: [{
          label: 'Total Spent ($)',
          data: [4200, 3800, 3200, 2900, 2500],
          backgroundColor: this.colors.accentMedium,
          borderColor: this.colors.accent,
          borderWidth: 1.5,
          borderRadius: 6,
          barThickness: 24
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: this.getGridColor() },
            ticks: {
              color: this.getTextColor(),
              callback: (val) => '$' + val.toLocaleString()
            }
          },
          y: {
            grid: { display: false },
            ticks: { color: this.getTextColor() }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  },

  /* User Dashboard: Monthly Spending Bar Chart */
  initSpendingChart() {
    const canvas = document.getElementById('spendingChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Monthly Spending ($)',
          data: [180, 220, 195, 290, 240, 310],
          backgroundColor: this.colors.accentMedium,
          borderColor: this.colors.accent,
          borderWidth: 1.5,
          borderRadius: 6,
          barThickness: 32
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: this.getTextColor() }
          },
          y: {
            beginAtZero: true,
            grid: { color: this.getGridColor() },
            ticks: {
              color: this.getTextColor(),
              callback: (val) => '$' + val
            }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  },

  /* Mini charts for stat cards */
  initMiniCharts() {
    // Mini Line Chart
    this.initMiniChart('miniLineChart', 'line', [30, 45, 35, 50, 65, 55, 70]);
    // Mini Bar Chart
    this.initMiniChart('miniBarChart', 'bar', [25, 40, 35, 55, 45, 60]);
    // Mini Area Chart
    this.initMiniChart('miniAreaChart', 'line', [20, 35, 40, 30, 50, 45, 55], true);
  },

  initMiniChart(canvasId, type, data, fill = false) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: type,
      data: {
        labels: data.map(() => ''),
        datasets: [{
          data: data,
          borderColor: this.colors.accent,
          backgroundColor: fill ? this.colors.accentLight : this.colors.accentMedium,
          borderWidth: type === 'line' ? 2 : 0,
          fill: fill,
          tension: 0.4,
          pointRadius: 0,
          borderRadius: type === 'bar' ? 3 : 0,
          barThickness: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: false }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        },
        elements: {
          point: { radius: 0 }
        }
      }
    });
  }
};

/* ----------------------------------------------------------------
   3. TABLE SORTING
   ---------------------------------------------------------------- */
const TableSort = {
  init() {
    document.querySelectorAll('.table th[data-sort]').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const table = th.closest('.table');
        const tbody = table.querySelector('tbody');
        const colIndex = Array.from(th.parentElement.children).indexOf(th);
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const isAsc = th.classList.contains('sort-asc');

        // Reset all headers
        table.querySelectorAll('th').forEach(h => {
          h.classList.remove('sort-asc', 'sort-desc');
        });

        // Sort rows
        rows.sort((a, b) => {
          const aVal = a.children[colIndex]?.textContent.trim() || '';
          const bVal = b.children[colIndex]?.textContent.trim() || '';

          // Try numeric sort first
          const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
          const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ''));

          if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAsc ? bNum - aNum : aNum - bNum;
          }

          return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        });

        // Re-append sorted rows
        rows.forEach(row => tbody.appendChild(row));
        th.classList.add(isAsc ? 'sort-desc' : 'sort-asc');
      });
    });
  }
};

/* ----------------------------------------------------------------
   4. TABLE STATUS FILTER
   ---------------------------------------------------------------- */
const StatusFilter = {
  init() {
    document.querySelectorAll('.status-filter').forEach(select => {
      select.addEventListener('change', () => {
        const value = select.value;
        const table = select.closest('.dash-chart')?.querySelector('.table') ||
                      document.querySelector('.table');
        if (!table) return;

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const badge = row.querySelector('.badge');
          if (!badge) return;

          if (value === 'all' || badge.textContent.trim().toLowerCase() === value.toLowerCase()) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }
};

/* ----------------------------------------------------------------
   5. INITIALIZE
   ---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  Sidebar.init();
  DashboardCharts.init();
  TableSort.init();
  StatusFilter.init();
});

// Re-init charts on theme change (for color updates)
const themeObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'data-theme') {
      // Update chart colors on theme change
      Chart.defaults.color = DashboardCharts.getTextColor();
    }
  });
});

themeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme']
});
