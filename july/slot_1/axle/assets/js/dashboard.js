document.addEventListener('DOMContentLoaded', () => {
  // Sidebar Toggle
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
  }

  // Mobile sidebar
  const mobileSidebar = document.getElementById('mobileSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (mobileSidebar && sidebar) {
    mobileSidebar.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));
  }
  if (overlay && sidebar) {
    overlay.addEventListener('click', () => sidebar.classList.remove('mobile-open'));
  }

  // Active sidebar item
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Wait for Chart.js to load
  if (typeof Chart === 'undefined') return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor, font: { family: 'Inter', size: 12 } } } },
    scales: {
      x: { ticks: { color: textColor, font: { size: 11 } }, grid: { color: gridColor } },
      y: { ticks: { color: textColor, font: { size: 11 } }, grid: { color: gridColor } }
    }
  };

  // ADMIN DASHBOARD
  const revenueCanvas = document.getElementById('revenueChart');
  if (revenueCanvas) {
    new Chart(revenueCanvas, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
          label: 'Revenue ($)',
          data: [8200,9100,8800,10200,11500,10800,12400,11900,13200,12800,14100,14500],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#f59e0b',
          pointRadius: 4
        }]
      },
      options: { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } } }
    });
  }

  const serviceCanvas = document.getElementById('serviceChart');
  if (serviceCanvas) {
    new Chart(serviceCanvas, {
      type: 'bar',
      data: {
        labels: ['Oil Change','Brake','AC','Tyre','Engine','Other'],
        datasets: [{
          label: 'Services',
          data: [145,98,76,112,54,38],
          backgroundColor: ['#f59e0b','#0f172a','#64748b','#10b981','#6366f1','#ef4444'],
          borderRadius: 6
        }]
      },
      options: { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } } }
    });
  }

  const sourceCanvas = document.getElementById('sourceChart');
  if (sourceCanvas) {
    new Chart(sourceCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Online','Walk-in','Referral','Fleet'],
        datasets: [{
          data: [42,28,18,12],
          backgroundColor: ['#f59e0b','#0f172a','#64748b','#10b981'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, padding: 16, font: { size: 12 } } }
        },
        cutout: '65%'
      }
    });
  }

  const apptCanvas = document.getElementById('appointmentChart');
  if (apptCanvas) {
    const apptData = Array.from({length: 30}, () => Math.floor(Math.random() * 8) + 3);
    new Chart(apptCanvas, {
      type: 'line',
      data: {
        labels: apptData.map((_, i) => `Day ${i + 1}`),
        datasets: [{
          label: 'Appointments',
          data: apptData,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }]
      },
      options: { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } }, scales: { ...baseOptions.scales, x: { ...baseOptions.scales.x, ticks: { ...baseOptions.scales.x.ticks, maxTicksLimit: 10 } } } }
    });
  }

  // USER DASHBOARD
  const userServiceCanvas = document.getElementById('userServiceChart');
  if (userServiceCanvas) {
    new Chart(userServiceCanvas, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [{
          label: 'Services',
          data: [2,1,3,2,1,2,3,1,2,0,0,0],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#f59e0b',
          pointRadius: 4
        }]
      },
      options: { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } } }
    });
  }

  const userCostCanvas = document.getElementById('userCostChart');
  if (userCostCanvas) {
    new Chart(userCostCanvas, {
      type: 'bar',
      data: {
        labels: ['Parts','Labor','Diagnostics','Add-ons'],
        datasets: [{
          label: 'Cost ($)',
          data: [680,420,180,120],
          backgroundColor: ['#f59e0b','#0f172a','#64748b','#10b981'],
          borderRadius: 6
        }]
      },
      options: { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } } }
    });
  }

  const userTypeCanvas = document.getElementById('userTypeChart');
  if (userTypeCanvas) {
    new Chart(userTypeCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Preventive','Repair','Emergency','Upgrade'],
        datasets: [{
          data: [45,25,10,20],
          backgroundColor: ['#f59e0b','#0f172a','#ef4444','#10b981'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: textColor, padding: 16, font: { size: 12 } } } },
        cutout: '65%'
      }
    });
  }

  const healthCanvas = document.getElementById('healthGauge');
  if (healthCanvas) {
    new Chart(healthCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Health Score','Remaining'],
        datasets: [{
          data: [87, 13],
          backgroundColor: ['#10b981', isDark ? '#1a1a1a' : '#e2e8f0'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: -90,
        circumference: 180,
        cutout: '75%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      },
      plugins: [{
        id: 'centerText',
        afterDraw(chart) {
          const { ctx, width, height } = chart;
          ctx.save();
          ctx.font = 'bold 36px Space Grotesk, sans-serif';
          ctx.fillStyle = '#10b981';
          ctx.textAlign = 'center';
          ctx.fillText('87', width / 2, height / 2 + 20);
          ctx.font = '14px Inter, sans-serif';
          ctx.fillStyle = textColor;
          ctx.fillText('out of 100', width / 2, height / 2 + 42);
          ctx.restore();
        }
      }]
    });
  }
});
