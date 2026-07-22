/* ============================================
   INKA — Dashboard JavaScript
   Charts, sidebar, tables, countdown
   ============================================ */

'use strict';

/* ---- Sidebar ---- */
const SidebarManager = {
  init() {
    this.sidebar = document.querySelector('.sidebar');
    this.toggle = document.querySelector('.sidebar-toggle');
    this.mobileToggle = document.querySelector('.mobile-sidebar-toggle');

    if (this.toggle && this.sidebar) {
      this.toggle.addEventListener('click', () => {
        this.sidebar.classList.toggle('collapsed');
        localStorage.setItem('inka-sidebar', this.sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded');
      });
    }

    if (this.mobileToggle && this.sidebar) {
      this.mobileToggle.addEventListener('click', () => {
        this.sidebar.classList.toggle('mobile-open');
      });

      // Close on outside click (mobile)
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && !e.target.closest('.sidebar') && !e.target.closest('.mobile-sidebar-toggle')) {
          this.sidebar.classList.remove('mobile-open');
        }
      });
    }

    // Restore state
    const saved = localStorage.getItem('inka-sidebar');
    if (saved === 'collapsed' && this.sidebar && window.innerWidth > 1024) {
      this.sidebar.classList.add('collapsed');
    }

    // Active link
    this.setActiveLink();
  },

  setActiveLink() {
    const hash = window.location.hash || '#overview';
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
      }
    });
  }
};

/* ---- Dashboard Charts (Chart.js) ---- */
const ChartManager = {
  init() {
    if (typeof Chart === 'undefined') return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#ADB5BD' : '#6C757D';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

    Chart.defaults.color = textColor;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;

    this.createLineChart(textColor, gridColor);
    this.createBarChart(textColor, gridColor);
    this.createDonutChart();
    this.createAreaChart(textColor, gridColor);
    this.createHorizontalBarChart(textColor, gridColor);
    this.createUserBarChart(textColor, gridColor);
  },

  createLineChart(textColor, gridColor) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Revenue ($)',
          data: [12500, 15800, 14200, 18900, 22300, 19500, 24100, 26800, 23400, 28900, 31200, 35000],
          borderColor: '#6C3483',
          backgroundColor: 'rgba(108, 52, 131, 0.1)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#6C3483',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A0A2E',
            titleColor: '#fff',
            bodyColor: '#BB8FCE',
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (ctx) => `Revenue: $${ctx.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              callback: (val) => '$' + (val / 1000) + 'k'
            }
          }
        }
      }
    });
  },

  createBarChart(textColor, gridColor) {
    const ctx = document.getElementById('ordersBarChart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Orders',
          data: [145, 198, 167, 234, 289, 256],
          backgroundColor: [
            'rgba(108, 52, 131, 0.8)',
            'rgba(108, 52, 131, 0.65)',
            'rgba(108, 52, 131, 0.8)',
            'rgba(108, 52, 131, 0.65)',
            'rgba(108, 52, 131, 0.8)',
            'rgba(108, 52, 131, 0.65)'
          ],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A0A2E',
            titleColor: '#fff',
            bodyColor: '#BB8FCE',
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor } }
        }
      }
    });
  },

  createDonutChart() {
    const ctx = document.getElementById('statusDonut');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Processing', 'Pending', 'Cancelled'],
        datasets: [{
          data: [58, 22, 15, 5],
          backgroundColor: ['#28A745', '#6C3483', '#F59E0B', '#DC3545'],
          borderWidth: 0,
          spacing: 3,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: '#1A0A2E',
            titleColor: '#fff',
            bodyColor: '#BB8FCE',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed}%`
            }
          }
        }
      }
    });
  },

  createAreaChart(textColor, gridColor) {
    const ctx = document.getElementById('pendingArea');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Pending Jobs',
          data: [12, 19, 8, 15, 12, 8, 5],
          borderColor: '#BB8FCE',
          backgroundColor: 'rgba(187, 143, 206, 0.15)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#BB8FCE'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A0A2E',
            bodyColor: '#BB8FCE',
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor } }
        }
      }
    });
  },

  createHorizontalBarChart(textColor, gridColor) {
    const ctx = document.getElementById('topCustomersChart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Acme Corp', 'TechStart Inc', 'Design Studio', 'PrintWorks', 'MediaGroup'],
        datasets: [{
          label: 'Total Spent ($)',
          data: [12800, 9500, 8200, 7400, 6100],
          backgroundColor: 'rgba(108, 52, 131, 0.75)',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A0A2E',
            bodyColor: '#BB8FCE',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => `Total: $${ctx.parsed.x.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, callback: (val) => '$' + (val / 1000) + 'k' }
          },
          y: { grid: { display: false }, ticks: { color: textColor } }
        }
      }
    });
  },

  createUserBarChart(textColor, gridColor) {
    const ctx = document.getElementById('spendingChart');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Spending ($)',
          data: [320, 480, 290, 560, 410, 380],
          backgroundColor: 'rgba(108, 52, 131, 0.7)',
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A0A2E',
            bodyColor: '#BB8FCE',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => `Spent: $${ctx.parsed.y}`
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, callback: (v) => '$' + v } }
        }
      }
    });
  }
};

/* ---- Dashboard Table Sorting ---- */
const TableManager = {
  init() {
    document.querySelectorAll('.dash-table th[data-sort]').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => this.sort(th));
    });
  },

  sort(th) {
    const table = th.closest('table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const col = th.cellIndex;
    const isAsc = th.classList.contains('asc');

    // Reset all
    table.querySelectorAll('th').forEach(h => h.classList.remove('asc', 'desc'));

    if (isAsc) {
      th.classList.add('desc');
    } else {
      th.classList.add('asc');
    }

    rows.sort((a, b) => {
      const aVal = a.cells[col].textContent.trim();
      const bVal = b.cells[col].textContent.trim();
      const aNum = parseFloat(aVal.replace(/[$,]/g, ''));
      const bNum = parseFloat(bVal.replace(/[$,]/g, ''));

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return isAsc ? bNum - aNum : aNum - bNum;
      }
      return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    });

    rows.forEach(row => tbody.appendChild(row));
  }
};

/* ---- File Upload ---- */
const UploadManager = {
  init() {
    const zone = document.querySelector('.upload-zone');
    if (!zone) return;

    ['dragenter', 'dragover'].forEach(evt => {
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      zone.addEventListener(evt, (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
      });
    });

    zone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length) {
        this.handleFiles(files);
      }
    });

    zone.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = '.pdf,.ai,.psd,.png,.jpg,.jpeg';
      input.addEventListener('change', () => {
        if (input.files.length) this.handleFiles(input.files);
      });
      input.click();
    });
  },

  handleFiles(files) {
    const zone = document.querySelector('.upload-zone');
    const h4 = zone.querySelector('h4');
    h4.textContent = `${files.length} file${files.length > 1 ? 's' : ''} selected`;
    setTimeout(() => {
      h4.textContent = 'Drag & Drop Files Here';
    }, 3000);
  }
};

/* ---- Countdown Timer (Coming Soon) ---- */
const CountdownManager = {
  init() {
    this.elements = {
      days: document.getElementById('countdown-days'),
      hours: document.getElementById('countdown-hours'),
      minutes: document.getElementById('countdown-minutes'),
      seconds: document.getElementById('countdown-seconds')
    };

    if (!this.elements.days) return;

    // Set target date: 30 days from now
    this.target = new Date();
    this.target.setDate(this.target.getDate() + 30);

    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  },

  update() {
    const now = new Date();
    const diff = this.target - now;

    if (diff <= 0) {
      clearInterval(this.interval);
      Object.values(this.elements).forEach(el => { if (el) el.textContent = '00'; });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    this.elements.days.textContent = String(days).padStart(2, '0');
    this.elements.hours.textContent = String(hours).padStart(2, '0');
    this.elements.minutes.textContent = String(minutes).padStart(2, '0');
    this.elements.seconds.textContent = String(seconds).padStart(2, '0');
  }
};

/* ---- Particles (Coming Soon) ---- */
const ParticlesManager = {
  init() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const count = 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(187, 143, 206, ${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(187, 143, 206, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  }
};

/* ---- Dashboard Notification Dropdown ---- */
const NotificationManager = {
  init() {
    const trigger = document.querySelector('.topbar-notification');
    const dropdown = document.querySelector('.notification-dropdown');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      dropdown.classList.remove('active');
    });
  }
};

/* ---- User Avatar Dropdown ---- */
const AvatarDropdownManager = {
  init() {
    const trigger = document.querySelector('.topbar-avatar');
    const dropdown = document.querySelector('.avatar-dropdown');
    if (!trigger || !dropdown) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      dropdown.classList.remove('active');
    });
  }
};

/* ---- Initialize Dashboard ---- */
document.addEventListener('DOMContentLoaded', () => {
  SidebarManager.init();
  ChartManager.init();
  TableManager.init();
  UploadManager.init();
  CountdownManager.init();
  ParticlesManager.init();
  NotificationManager.init();
  AvatarDropdownManager.init();
});

// Re-init charts on theme change
const origThemeApply = window.ThemeManager?.apply;
if (origThemeApply) {
  const _origApply = origThemeApply.bind(window.ThemeManager);
  window.ThemeManager.apply = function(theme) {
    _origApply(theme);
    setTimeout(() => ChartManager.init(), 100);
  };
}
