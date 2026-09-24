/**
 * MOVE — Corporate Relocation & Employee Mobility Platform
 * js/dashboard.js — Dashboard System & Hand-Built SVG Visualizations
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. SIDEBAR COLLAPSE & MOBILE DRAWER (WITH CLICK-OUTSIDE & OVERLAY SUPPORT)
     ========================================================================== */
  const sidebar = document.querySelector('.dash-sidebar');
  const overlay = document.getElementById('dashSidebarOverlay');
  const closeBtn = document.getElementById('sidebarCloseBtn');
  const toggleButtons = document.querySelectorAll('.dash-topbar-hamburger, .sidebar-toggle-btn, .dash-mobile-hamburger');

  function openMobileSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('mobile-open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!sidebar) return;
      if (window.innerWidth <= 1024) {
        if (sidebar.classList.contains('mobile-open')) {
          closeMobileSidebar();
        } else {
          openMobileSidebar();
        }
      } else {
        sidebar.classList.toggle('collapsed');
        // Redraw charts after sidebar width change
        setTimeout(renderAllCharts, 250);
      }
    });
  });

  // Close button inside sidebar
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileSidebar();
    });
  }

  // Click on background backdrop overlay
  if (overlay) {
    overlay.addEventListener('click', () => {
      closeMobileSidebar();
    });
  }

  // Click outside sidebar on document
  document.addEventListener('click', (e) => {
    if (sidebar && sidebar.classList.contains('mobile-open')) {
      const clickedInsideSidebar = sidebar.contains(e.target);
      const clickedToggleBtn = Array.from(toggleButtons).some(btn => btn.contains(e.target));
      if (!clickedInsideSidebar && !clickedToggleBtn) {
        closeMobileSidebar();
      }
    }
  });

  // Escape key to dismiss mobile drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('mobile-open')) {
      closeMobileSidebar();
    }
  });

  // Auto-close drawer on viewport resize above 1024px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && sidebar && sidebar.classList.contains('mobile-open')) {
      closeMobileSidebar();
    }
  });

  /* ==========================================================================
     2. VIEW SWITCHING WITH SKELETON LOADER TRANSITIONS
     ========================================================================== */
  const navLinks = document.querySelectorAll('.dash-nav-link[data-view]');
  const viewPanels = document.querySelectorAll('.view-panel');
  const skeletonOverlay = document.getElementById('dashSkeleton');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-view');
      const targetPanel = document.getElementById(targetView);
      if (!targetPanel) return;

      // Active state in sidebar
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Close mobile sidebar if open
      closeMobileSidebar();

      // Shimmer Skeleton State (300ms transition, no blank flashes)
      if (skeletonOverlay) {
        skeletonOverlay.style.display = 'block';
        viewPanels.forEach(panel => panel.classList.remove('active'));

        setTimeout(() => {
          skeletonOverlay.style.display = 'none';
          targetPanel.classList.add('active');
          renderAllCharts();
        }, 300);
      } else {
        viewPanels.forEach(panel => panel.classList.remove('active'));
        targetPanel.classList.add('active');
        renderAllCharts();
      }
    });
  });

  /* ==========================================================================
     3. HAND-BUILT SVG CHARTS (Zero external chart libraries)
     ========================================================================== */

  // Helper: Create SVG Element with strict LTR coordinate enforcement
  function createSVG(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (tag === 'svg') {
      el.setAttribute('direction', 'ltr');
      el.style.direction = 'ltr';
    } else if (tag === 'text') {
      el.style.direction = 'ltr';
      el.style.unicodeBidi = 'isolate';
    }
    for (const key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
    return el;
  }

  // --- CHART 1: LINE CHART ---
  function renderLineChart(containerId, dataPoints, labels, yPrefix = '$') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 450;
    const height = 240;
    const padX = 45;
    const padY = 30;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    const maxVal = Math.max(...dataPoints) * 1.15;
    const minVal = 0;

    const svg = createSVG('svg', {
      width: '100%',
      height: '100%',
      viewBox: `0 0 ${width} ${height}`
    });

    // Horizontal grid lines
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const y = padY + (chartH / gridLines) * i;
      const val = Math.round(maxVal - (maxVal / gridLines) * i);
      const line = createSVG('line', {
        x1: padX,
        y1: y,
        x2: width - padX,
        y2: y,
        stroke: 'var(--border-subtle)',
        'stroke-width': '1',
        'stroke-dasharray': '3,3'
      });
      svg.appendChild(line);

      const label = createSVG('text', {
        x: padX - 8,
        y: y + 4,
        'text-anchor': 'end',
        'font-size': '10',
        fill: 'var(--text-muted)'
      });
      label.textContent = `${yPrefix}${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`;
      svg.appendChild(label);
    }

    // Points coordinates
    const stepX = chartW / (dataPoints.length - 1);
    const coords = dataPoints.map((val, idx) => {
      const x = padX + idx * stepX;
      const y = padY + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
      return { x, y, val, label: labels[idx] };
    });

    // Curved Path
    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const cpX = (coords[i].x + coords[i + 1].x) / 2;
      pathD += ` C ${cpX} ${coords[i].y}, ${cpX} ${coords[i + 1].y}, ${coords[i + 1].x} ${coords[i + 1].y}`;
    }

    const path = createSVG('path', {
      d: pathD,
      fill: 'none',
      stroke: 'var(--accent-color)',
      'stroke-width': '3',
      'stroke-linecap': 'round'
    });
    svg.appendChild(path);

    // Data dots & X-Labels
    coords.forEach(pt => {
      const circle = createSVG('circle', {
        cx: pt.x,
        cy: pt.y,
        r: '4.5',
        fill: 'var(--primary-color)',
        stroke: 'var(--accent-color)',
        'stroke-width': '2.5',
        style: 'cursor: pointer; transition: r 0.2s;'
      });
      circle.addEventListener('mouseenter', () => circle.setAttribute('r', '7'));
      circle.addEventListener('mouseleave', () => circle.setAttribute('r', '4.5'));
      
      const title = createSVG('title', {});
      title.textContent = `${pt.label}: ${yPrefix}${pt.val.toLocaleString()}`;
      circle.appendChild(title);
      svg.appendChild(circle);

      const xLabel = createSVG('text', {
        x: pt.x,
        y: height - 10,
        'text-anchor': 'middle',
        'font-size': '10',
        fill: 'var(--text-muted)'
      });
      xLabel.textContent = pt.label;
      svg.appendChild(xLabel);
    });

    container.appendChild(svg);
  }

  // --- CHART 2: BAR CHART ---
  function renderBarChart(containerId, dataPoints, labels) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 450;
    const height = 240;
    const padX = 40;
    const padY = 30;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    const maxVal = Math.max(...dataPoints) * 1.25;

    const svg = createSVG('svg', {
      width: '100%',
      height: '100%',
      viewBox: `0 0 ${width} ${height}`
    });

    // Horizontal lines
    for (let i = 0; i <= 3; i++) {
      const y = padY + (chartH / 3) * i;
      const line = createSVG('line', {
        x1: padX,
        y1: y,
        x2: width - padX,
        y2: y,
        stroke: 'var(--border-subtle)',
        'stroke-width': '1',
        'stroke-dasharray': '3,3'
      });
      svg.appendChild(line);
    }

    const barWidth = Math.min(28, (chartW / dataPoints.length) * 0.55);
    const stepX = chartW / dataPoints.length;

    dataPoints.forEach((val, idx) => {
      const barH = (val / maxVal) * chartH;
      const x = padX + idx * stepX + (stepX - barWidth) / 2;
      const y = padY + chartH - barH;

      const rect = createSVG('rect', {
        x,
        y,
        width: barWidth,
        height: barH,
        fill: 'var(--accent-color)',
        rx: '4',
        style: 'transition: fill 0.2s; cursor: pointer;'
      });
      rect.addEventListener('mouseenter', () => rect.setAttribute('fill', 'var(--accent-hover)'));
      rect.addEventListener('mouseleave', () => rect.setAttribute('fill', 'var(--accent-color)'));

      const title = createSVG('title', {});
      title.textContent = `${labels[idx]}: ${val}`;
      rect.appendChild(title);
      svg.appendChild(rect);

      // Top value label
      const valLabel = createSVG('text', {
        x: x + barWidth / 2,
        y: y - 5,
        'text-anchor': 'middle',
        'font-size': '10',
        'font-weight': '600',
        fill: 'var(--text-main)'
      });
      valLabel.textContent = val;
      svg.appendChild(valLabel);

      // Bottom X label
      const xLabel = createSVG('text', {
        x: x + barWidth / 2,
        y: height - 10,
        'text-anchor': 'middle',
        'font-size': '10',
        fill: 'var(--text-muted)'
      });
      xLabel.textContent = labels[idx];
      svg.appendChild(xLabel);
    });

    container.appendChild(svg);
  }

  // --- CHART 3: DONUT CHART ---
  function renderDonutChart(containerId, dataSegments, centerMetricText) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 300;
    const height = 240;
    const cx = Math.max(100, Math.round(width * 0.35));
    const cy = height / 2;
    const radius = 70;
    const strokeWidth = 26;

    const total = dataSegments.reduce((sum, s) => sum + s.value, 0);
    const circumference = 2 * Math.PI * radius;

    const svg = createSVG('svg', {
      width: '100%',
      height: '100%',
      viewBox: `0 0 ${width} ${height}`,
      style: 'direction: ltr !important;'
    });

    let currentOffset = 0;

    dataSegments.forEach(segment => {
      const sliceLength = (segment.value / total) * circumference;
      const circle = createSVG('circle', {
        cx,
        cy,
        r: radius,
        fill: 'none',
        stroke: segment.color,
        'stroke-width': strokeWidth,
        'stroke-dasharray': `${sliceLength} ${circumference}`,
        'stroke-dashoffset': -currentOffset,
        style: 'transition: stroke-width 0.2s; cursor: pointer;'
      });

      circle.addEventListener('mouseenter', () => circle.setAttribute('stroke-width', strokeWidth + 4));
      circle.addEventListener('mouseleave', () => circle.setAttribute('stroke-width', strokeWidth));

      const title = createSVG('title', {});
      title.textContent = `${segment.label}: ${segment.value} (${Math.round((segment.value / total) * 100)}%)`;
      circle.appendChild(title);
      svg.appendChild(circle);

      currentOffset += sliceLength;
    });

    // Center Text
    const centerText = createSVG('text', {
      x: cx,
      y: cy + 5,
      'text-anchor': 'middle',
      'font-family': 'var(--font-display)',
      'font-size': '16',
      'font-weight': '800',
      fill: 'var(--text-main)',
      style: 'direction: ltr !important; unicode-bidi: isolate !important;'
    });
    centerText.textContent = centerMetricText;
    svg.appendChild(centerText);

    // Legend on the right side
    const legendX = Math.max(cx + radius + strokeWidth / 2 + 18, Math.round(width * 0.62));
    dataSegments.forEach((seg, i) => {
      const legY = 65 + i * 30;

      const swatch = createSVG('rect', {
        x: legendX,
        y: legY - 10,
        width: 12,
        height: 12,
        fill: seg.color,
        rx: 2
      });
      svg.appendChild(swatch);

      const legText = createSVG('text', {
        x: legendX + 20,
        y: legY,
        'font-size': '11',
        'text-anchor': 'start',
        fill: 'var(--text-muted)',
        style: 'direction: ltr !important; unicode-bidi: isolate !important;'
      });
      legText.textContent = `${seg.label} (${seg.value})`;
      svg.appendChild(legText);
    });

    container.appendChild(svg);
  }

  // --- CHART 4: AREA CHART ---
  function renderAreaChart(containerId, actualPoints, budgetPoints, labels) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 450;
    const height = 240;
    const padX = 45;
    const padY = 30;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    const maxVal = Math.max(...budgetPoints) * 1.15;
    const stepX = chartW / (labels.length - 1);

    const svg = createSVG('svg', {
      width: '100%',
      height: '100%',
      viewBox: `0 0 ${width} ${height}`
    });

    // Gradient definition for area fill
    const defs = createSVG('defs', {});
    const grad = createSVG('linearGradient', {
      id: `areaGrad_${containerId}`,
      x1: '0', y1: '0', x2: '0', y2: '1'
    });
    grad.innerHTML = `
      <stop offset="0%" stop-color="var(--accent-color)" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="var(--accent-color)" stop-opacity="0.0"/>
    `;
    defs.appendChild(grad);
    svg.appendChild(defs);

    // Actual coordinates
    const actualCoords = actualPoints.map((val, idx) => ({
      x: padX + idx * stepX,
      y: padY + chartH - (val / maxVal) * chartH
    }));

    // Area Path
    let areaD = `M ${padX} ${padY + chartH}`;
    actualCoords.forEach(pt => {
      areaD += ` L ${pt.x} ${pt.y}`;
    });
    areaD += ` L ${actualCoords[actualCoords.length - 1].x} ${padY + chartH} Z`;

    const areaPath = createSVG('path', {
      d: areaD,
      fill: `url(#areaGrad_${containerId})`
    });
    svg.appendChild(areaPath);

    // Actual Line
    let lineD = `M ${actualCoords[0].x} ${actualCoords[0].y}`;
    for (let i = 1; i < actualCoords.length; i++) {
      lineD += ` L ${actualCoords[i].x} ${actualCoords[i].y}`;
    }
    const actualLine = createSVG('path', {
      d: lineD,
      fill: 'none',
      stroke: 'var(--accent-color)',
      'stroke-width': '2.5'
    });
    svg.appendChild(actualLine);

    // Budget Dashed Reference Line
    const budgetCoords = budgetPoints.map((val, idx) => ({
      x: padX + idx * stepX,
      y: padY + chartH - (val / maxVal) * chartH
    }));
    let budgetD = `M ${budgetCoords[0].x} ${budgetCoords[0].y}`;
    for (let i = 1; i < budgetCoords.length; i++) {
      budgetD += ` L ${budgetCoords[i].x} ${budgetCoords[i].y}`;
    }
    const budgetLine = createSVG('path', {
      d: budgetD,
      fill: 'none',
      stroke: 'var(--text-muted)',
      'stroke-width': '1.5',
      'stroke-dasharray': '4,4'
    });
    svg.appendChild(budgetLine);

    // X-Labels
    labels.forEach((lbl, idx) => {
      const text = createSVG('text', {
        x: padX + idx * stepX,
        y: height - 10,
        'text-anchor': 'middle',
        'font-size': '10',
        fill: 'var(--text-muted)'
      });
      text.textContent = lbl;
      svg.appendChild(text);
    });

    container.appendChild(svg);
  }

  // --- RENDER ALL CHARTS TRIGGER ---
  function renderAllCharts() {
    // 1. User Dashboard Charts
    if (document.getElementById('userSpendLineChart')) {
      renderLineChart(
        'userSpendLineChart',
        [42000, 58000, 51000, 69000, 84000, 92000],
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      );
    }
    if (document.getElementById('userMovesBarChart')) {
      renderBarChart(
        'userMovesBarChart',
        [12, 18, 15, 24, 28, 31],
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      );
    }
    if (document.getElementById('userStatusDonutChart')) {
      renderDonutChart(
        'userStatusDonutChart',
        [
          { label: 'Inquiry', value: 8, color: '#6B625B' },
          { label: 'In Transit', value: 16, color: '#C59B63' },
          { label: 'Delivered', value: 12, color: '#B28850' },
          { label: 'Settled', value: 24, color: '#1A1410' }
        ],
        '60 Moves'
      );
    }
    if (document.getElementById('userSpendAreaChart')) {
      renderAreaChart(
        'userSpendAreaChart',
        [42000, 100000, 151000, 220000, 304000, 396000],
        [75000, 150000, 225000, 300000, 375000, 450000],
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      );
    }

    // 2. Admin Dashboard Charts
    if (document.getElementById('adminRevenueLineChart')) {
      renderLineChart(
        'adminRevenueLineChart',
        [180000, 210000, 245000, 290000, 310000, 385000, 420000, 410000, 490000, 520000, 560000, 610000],
        ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
      );
    }
    if (document.getElementById('adminCompletedBarChart')) {
      renderBarChart(
        'adminCompletedBarChart',
        [28, 34, 42, 38, 56, 62, 59, 64, 71, 78, 85, 92],
        ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
      );
    }
    if (document.getElementById('adminServiceMixDonutChart')) {
      renderDonutChart(
        'adminServiceMixDonutChart',
        [
          { label: 'Household', value: 38, color: '#C59B63' },
          { label: 'Visa/Immig.', value: 24, color: '#1A1410' },
          { label: 'Housing', value: 22, color: '#6B625B' },
          { label: 'Orientation', value: 16, color: '#B28850' }
        ],
        '100%'
      );
    }
    if (document.getElementById('adminCumulativeAreaChart')) {
      renderAreaChart(
        'adminCumulativeAreaChart',
        [150, 320, 520, 780, 1100, 1540],
        [200, 400, 600, 800, 1200, 1600],
        ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6']
      );
    }
  }

  // Initial render, resize, & direction/theme mutation listener
  renderAllCharts();
  window.addEventListener('resize', () => {
    clearTimeout(window.chartResizeTimer);
    window.chartResizeTimer = setTimeout(renderAllCharts, 150);
  });

  const chartObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'dir' || m.attributeName === 'class') {
        clearTimeout(window.chartResizeTimer);
        window.chartResizeTimer = setTimeout(renderAllCharts, 50);
        break;
      }
    }
  });
  chartObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['dir', 'class'] });

  /* ==========================================================================
     4. USER DASHBOARD INTERACTIVE ACTIONS
     ========================================================================== */
  // New Request Submission
  const userReqForm = document.getElementById('newRequestForm');
  if (userReqForm) {
    userReqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ref = 'MV-REQ-' + Math.floor(1000 + Math.random() * 9000);
      alert(`Relocation Request Registered successfully! Reference: ${ref}. Added to My Moves.`);
      userReqForm.reset();
      const myMovesTab = document.querySelector('[data-view="viewMyMoves"]');
      if (myMovesTab) myMovesTab.click();
    });
  }

  // Document checklist toggles
  document.querySelectorAll('.doc-check-input').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const item = checkbox.closest('.doc-item');
      if (item) {
        if (checkbox.checked) {
          item.style.opacity = '0.6';
          item.style.textDecoration = 'line-through';
        } else {
          item.style.opacity = '1';
          item.style.textDecoration = 'none';
        }
      }
    });
  });

  // Demo feedback toast button
  document.querySelectorAll('[data-demo-toast]').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.getAttribute('data-demo-toast') || 'Action completed successfully.';
      alert(msg);
    });
  });

  /* ==========================================================================
     5. ADMIN DASHBOARD PIPELINE & ACTIONS
     ========================================================================== */
  // Client Table Search
  const clientSearch = document.getElementById('clientTableSearch');
  if (clientSearch) {
    clientSearch.addEventListener('input', () => {
      const term = clientSearch.value.toLowerCase();
      document.querySelectorAll('#clientTableBody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
      });
    });
  }
});
