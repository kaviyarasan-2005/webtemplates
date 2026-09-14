document.addEventListener('DOMContentLoaded', () => {
  // Chart styling defaults
  Chart.defaults.color = '#9CA3AF'; // text-muted
  Chart.defaults.font.family = "'Inter', sans-serif";
  
  const brandPrimary = '#8B5CF6';
  const brandSecondary = '#22D3EE';
  const brandSuccess = '#10B981';
  const brandWarning = '#F59E0B';
  const gridColor = 'rgba(255, 255, 255, 0.05)';

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#F3F4F6'
        }
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: '#9CA3AF' }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: '#9CA3AF' }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#F3F4F6' }
      }
    },
    borderWidth: 0
  };

  /* =========================================================
     ADMIN DASHBOARD CHARTS
     ========================================================= */

  // 1. Weekly Revenue (Line Chart)
  const adminRevCanvas = document.getElementById('adminRevenueChart');
  if (adminRevCanvas) {
    new Chart(adminRevCanvas, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Revenue ($)',
          data: [1200, 1900, 1500, 2200, 3100, 4500, 3800],
          borderColor: brandPrimary,
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: commonOptions
    });
  }

  // 2. Pod Utilization (Bar Chart)
  const adminPodCanvas = document.getElementById('adminPodChart');
  if (adminPodCanvas) {
    new Chart(adminPodCanvas, {
      type: 'bar',
      data: {
        labels: ['10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM'],
        datasets: [{
          label: 'Pods in Use',
          data: [4, 8, 12, 16, 22, 24, 18],
          backgroundColor: brandSecondary,
          borderRadius: 4
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          ...commonOptions.scales,
          y: { ...commonOptions.scales.y, max: 24 }
        }
      }
    });
  }

  // 3. Popular Game Bookings (Doughnut Chart)
  const adminGamesCanvas = document.getElementById('adminGamesChart');
  if (adminGamesCanvas) {
    new Chart(adminGamesCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Alyx: Ground Zero', 'Cyber Ninja', 'Racket Fury', 'Dark Asylum', 'Others'],
        datasets: [{
          data: [35, 25, 15, 15, 10],
          backgroundColor: [
            brandPrimary,
            brandSecondary,
            brandSuccess,
            brandWarning,
            '#4B5563'
          ],
          borderWidth: 0
        }]
      },
      options: doughnutOptions
    });
  }

  // 4. User Growth (Area Chart)
  const adminGrowthCanvas = document.getElementById('adminGrowthChart');
  if (adminGrowthCanvas) {
    new Chart(adminGrowthCanvas, {
      type: 'line',
      data: {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
          label: 'New Users',
          data: [450, 600, 850, 1200, 1500, 1850],
          borderColor: brandSecondary,
          backgroundColor: 'rgba(34, 211, 238, 0.2)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: commonOptions
    });
  }

  /* =========================================================
     USER DASHBOARD CHARTS
     ========================================================= */

  // 1. Play Time Trends (Bar Chart)
  const userPlayTimeCanvas = document.getElementById('userPlayTimeChart');
  if (userPlayTimeCanvas) {
    new Chart(userPlayTimeCanvas, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Hours Played',
          data: [0, 1.5, 0, 2, 0, 4, 2.5],
          backgroundColor: brandPrimary,
          borderRadius: 4
        }]
      },
      options: commonOptions
    });
  }

  // 2. Favorite Genres (Doughnut Chart)
  const userGenresCanvas = document.getElementById('userGenresChart');
  if (userGenresCanvas) {
    new Chart(userGenresCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Action', 'Horror', 'Simulation', 'Puzzle'],
        datasets: [{
          data: [40, 30, 20, 10],
          backgroundColor: [
            brandPrimary,
            brandSecondary,
            brandSuccess,
            brandWarning
          ],
          borderWidth: 0
        }]
      },
      options: doughnutOptions
    });
  }

  // 3. Reward Points History (Line Chart)
  const userPointsCanvas = document.getElementById('userPointsChart');
  if (userPointsCanvas) {
    new Chart(userPointsCanvas, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Total Points',
          data: [800, 950, 1050, 1250],
          borderColor: brandSecondary,
          backgroundColor: 'rgba(34, 211, 238, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: brandSecondary
        }]
      },
      options: commonOptions
    });
  }

  // 4. Completion Rate (Pie Chart)
  const userCompCanvas = document.getElementById('userCompletionChart');
  if (userCompCanvas) {
    new Chart(userCompCanvas, {
      type: 'pie',
      data: {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [{
          data: [12, 5, 8],
          backgroundColor: [
            brandSuccess,
            brandPrimary,
            '#4B5563'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#F3F4F6' }
          }
        }
      }
    });
  }

});
