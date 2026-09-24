/* ============================================================
   DASHBOARD.JS — VOWS Wedding Planning & Event Coordination
   Handles: sidebar collapse, view switching with skeleton
   loaders, 4 hand-built Canvas charts per dashboard, tables,
   modals, demo actions. All guarded with existence checks.
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────
   UTILITIES
────────────────────────────────────────────────────────── */
function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx){ return (ctx || document).querySelectorAll(sel); }

function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}
function isDark() { return getTheme() === 'dark'; }

// Chart color palette
function chartColors() {
  const dark = isDark();
  return {
    primary:   '#3B1A3F',
    accent:    '#C9A8E0',
    accentDark:'#8B5E9C',
    line:      '#C9A8E0',
    grid:      dark ? '#2E2031' : '#E8D5EE',
    text:      dark ? '#C4A8D4' : '#7A5A84',
    bg:        dark ? '#1A1A1A' : '#FFFFFF',
    area:      dark ? 'rgba(201,168,224,0.18)' : 'rgba(201,168,224,0.22)',
    bars:      ['#C9A8E0','#B48FCC','#8B5E9C','#5C2D63','#3B1A3F','#2A0F2E'],
    donut:     ['#C9A8E0','#8B5E9C','#5C2D63','#3B1A3F','#2A0F2E','#B48FCC'],
  };
}

/* ──────────────────────────────────────────────────────────
   CHART 1 — LINE CHART (Canvas)
   Usage: drawLineChart(canvas, labels, datasets, title)
────────────────────────────────────────────────────────── */
function getCanvasDims(canvas) {
  const parent = canvas.parentElement;
  const pw = parent ? parent.clientWidth : 0;
  const rect = canvas.getBoundingClientRect();
  const W = Math.round(pw || rect.width || canvas.offsetWidth || 500);
  const H = Math.round(canvas.offsetHeight || rect.height || 220);
  return { W: Math.max(W, 260), H: Math.max(H, 180) };
}

function drawLineChart(canvas, labels, data, opts = {}) {
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const { W, H } = getCanvasDims(canvas);
  canvas.width  = W * (window.devicePixelRatio || 1);
  canvas.height = H * (window.devicePixelRatio || 1);
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

  const C   = chartColors();
  const pad = { top: 20, right: 24, bottom: 48, left: 54 };
  const cW  = W - pad.left - pad.right;
  const cH  = H - pad.top  - pad.bottom;

  const allVals = data.flatMap(d => d.values);
  const maxV    = Math.max(...allVals) * 1.15 || 1;
  const step    = cW / (labels.length - 1);

  // Clear
  ctx.clearRect(0, 0, W, H);

  // Grid lines
  const gridCount = 4;
  ctx.strokeStyle = C.grid;
  ctx.lineWidth   = 1;
  for (let i = 0; i <= gridCount; i++) {
    const y = pad.top + cH - (i / gridCount) * cH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + cW, y);
    ctx.stroke();
    // Y labels
    ctx.fillStyle = C.text;
    ctx.font = `10px Inter, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(Math.round((i / gridCount) * maxV).toLocaleString(), pad.left - 6, y + 3);
  }

  // X labels
  ctx.fillStyle  = C.text;
  ctx.font = `10px Inter, sans-serif`;
  ctx.textAlign  = 'center';
  labels.forEach((l, i) => {
    ctx.fillText(l, pad.left + i * step, H - pad.bottom + 16);
  });

  // Lines & points
  data.forEach((dataset, di) => {
    const color = dataset.color || C.line;
    ctx.save();
    ctx.beginPath();
    dataset.values.forEach((v, i) => {
      const x = pad.left + i * step;
      const y = pad.top  + cH - (v / maxV) * cH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth   = 2.5;
    ctx.lineJoin    = 'round';
    ctx.stroke();

    // Points
    dataset.values.forEach((v, i) => {
      const x = pad.left + i * step;
      const y = pad.top  + cH - (v / maxV) * cH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle   = color;
      ctx.fill();
      ctx.strokeStyle = C.bg;
      ctx.lineWidth   = 2;
      ctx.stroke();
    });
    ctx.restore();
  });
}

/* ──────────────────────────────────────────────────────────
   CHART 2 — BAR CHART (Canvas)
────────────────────────────────────────────────────────── */
function drawBarChart(canvas, labels, values, opts = {}) {
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const { W, H } = getCanvasDims(canvas);
  canvas.width  = W * (window.devicePixelRatio || 1);
  canvas.height = H * (window.devicePixelRatio || 1);
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

  const C   = chartColors();
  const pad = { top: 20, right: 24, bottom: 48, left: 54 };
  const cW  = W - pad.left - pad.right;
  const cH  = H - pad.top  - pad.bottom;
  const maxV = Math.max(...values) * 1.15 || 1;
  const barGap= cW / labels.length;
  const barW  = Math.min(barGap * 0.55, 32);

  ctx.clearRect(0, 0, W, H);

  // Grid
  const gridCount = 4;
  ctx.strokeStyle = C.grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridCount; i++) {
    const y = pad.top + cH - (i / gridCount) * cH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + cW, y);
    ctx.stroke();
    ctx.fillStyle = C.text;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round((i / gridCount) * maxV).toLocaleString(), pad.left - 6, y + 3);
  }

  // Bars
  values.forEach((v, i) => {
    const x  = pad.left + i * barGap + (barGap - barW) / 2;
    const h  = (v / maxV) * cH;
    const y  = pad.top + cH - h;
    const gr = ctx.createLinearGradient(x, y, x, y + h);
    gr.addColorStop(0, C.accentDark);
    gr.addColorStop(1, C.accent);
    ctx.fillStyle = gr;
    ctx.beginPath();
    const r = Math.min(4, barW / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + barW - r, y);
    ctx.arcTo(x + barW, y, x + barW, y + r, r);
    ctx.lineTo(x + barW, y + h);
    ctx.lineTo(x, y + h);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
  });

  // X Labels
  ctx.fillStyle = C.text;
  ctx.font = '9px Inter, sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    ctx.fillText(l, pad.left + i * barGap + barGap / 2, H - pad.bottom + 14);
  });
}

/* ──────────────────────────────────────────────────────────
   CHART 3 — DONUT CHART (Canvas)
────────────────────────────────────────────────────────── */
function drawDonutChart(canvas, labels, values, opts = {}) {
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const { W, H } = getCanvasDims(canvas);
  canvas.width  = W * (window.devicePixelRatio || 1);
  canvas.height = H * (window.devicePixelRatio || 1);
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

  const C     = chartColors();
  const total = values.reduce((a, b) => a + b, 0) || 1;
  
  const isWide = W >= 420;
  const cx    = isWide ? Math.min(W * 0.32, 170) : W * 0.4;
  const cy    = H / 2;
  const r     = Math.min(cx - 20, cy - 20, 80);
  const ri    = r * 0.58; // inner radius (donut hole)

  ctx.clearRect(0, 0, W, H);

  let angle = -Math.PI / 2;
  values.forEach((v, i) => {
    const slice = (v / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle + slice);
    ctx.closePath();
    ctx.fillStyle = C.donut[i % C.donut.length];
    ctx.fill();
    angle += slice;
  });

  // Donut hole
  ctx.beginPath();
  ctx.arc(cx, cy, ri, 0, Math.PI * 2);
  ctx.fillStyle = C.bg;
  ctx.fill();

  // Center text
  ctx.fillStyle = C.text;
  ctx.font = `bold 18px Cormorant Garamond, Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(opts.centerLabel || 'Total', cx, cy - 8);
  ctx.font = `11px Inter, sans-serif`;
  ctx.fillText(total.toLocaleString(), cx, cy + 12);

  // Legend (right side)
  const lx = isWide ? Math.max(cx + r + 36, W * 0.52) : Math.max(cx + r + 20, W * 0.55);
  let   ly = H / 2 - (labels.length * 24) / 2 + 12;
  labels.forEach((l, i) => {
    const pct = ((values[i] / total) * 100).toFixed(0) + '%';
    ctx.fillStyle = C.donut[i % C.donut.length];
    ctx.beginPath();
    ctx.arc(lx + 5, ly, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = C.text;
    ctx.font = '500 11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(l, lx + 18, ly);

    ctx.font = '700 11px Inter, sans-serif';
    ctx.fillStyle = C.accentDark;
    ctx.fillText(pct, lx + 105, ly);
    ly += 24;
  });
}

/* ──────────────────────────────────────────────────────────
   CHART 4 — AREA CHART (Canvas)
────────────────────────────────────────────────────────── */
function drawAreaChart(canvas, labels, datasets, opts = {}) {
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const { W, H } = getCanvasDims(canvas);
  canvas.width  = W * (window.devicePixelRatio || 1);
  canvas.height = H * (window.devicePixelRatio || 1);
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

  const C   = chartColors();
  const pad = { top: 20, right: 24, bottom: 48, left: 54 };
  const cW  = W - pad.left - pad.right;
  const cH  = H - pad.top  - pad.bottom;
  const allVals = datasets.flatMap(d => d.values);
  const maxV    = Math.max(...allVals) * 1.15 || 1;
  const step    = cW / (labels.length - 1);

  ctx.clearRect(0, 0, W, H);

  // Grid
  const gridCount = 4;
  ctx.strokeStyle = C.grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridCount; i++) {
    const y = pad.top + cH - (i / gridCount) * cH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + cW, y);
    ctx.stroke();
    ctx.fillStyle = C.text;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round((i / gridCount) * maxV).toLocaleString(), pad.left - 6, y + 3);
  }

  // X labels
  ctx.fillStyle = C.text;
  ctx.font = '10px Inter, sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    ctx.fillText(l, pad.left + i * step, H - pad.bottom + 16);
  });

  // Areas
  datasets.forEach((dataset, di) => {
    const color = dataset.color || C.accent;
    const areaC = dataset.areaColor || C.area;

    // Area fill
    ctx.save();
    ctx.beginPath();
    dataset.values.forEach((v, i) => {
      const x = pad.left + i * step;
      const y = pad.top + cH - (v / maxV) * cH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    const lastX = pad.left + (dataset.values.length - 1) * step;
    ctx.lineTo(lastX, pad.top + cH);
    ctx.lineTo(pad.left, pad.top + cH);
    ctx.closePath();
    ctx.fillStyle = areaC;
    ctx.fill();

    // Line
    ctx.beginPath();
    dataset.values.forEach((v, i) => {
      const x = pad.left + i * step;
      const y = pad.top + cH - (v / maxV) * cH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
  });
}

/* ──────────────────────────────────────────────────────────
   USER DASHBOARD DATA & CHARTS
────────────────────────────────────────────────────────── */
const userChartData = {
  line: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
    datasets: [{
      values: [2000,3500,4200,6800,8100,9400,11200,13000],
      color: '#C9A8E0'
    }]
  },
  bar: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    values: [0,1500,0,2500,0,3000,1800,0,2200,0,0,3500]
  },
  donut: {
    labels: ['Venue','Catering','Florals','Photography','Attire','Other'],
    values: [12000,8500,3200,4800,2600,1900]
  },
  area: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
    datasets: [
      { values: [2000,5500,9700,16500,24600,34000,45200,58200], color: '#C9A8E0', areaColor: 'rgba(201,168,224,0.22)' },
      { values: [33000,33000,33000,33000,33000,33000,33000,33000], color: '#8B5E9C', areaColor: 'rgba(139,94,156,0.10)' }
    ]
  }
};

/* ──────────────────────────────────────────────────────────
   ADMIN DASHBOARD DATA & CHARTS
────────────────────────────────────────────────────────── */
const adminChartData = {
  line: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets: [{
      values: [18000,22000,19500,31000,27000,38000,42000,35000,44000,39000,51000,58000],
      color: '#C9A8E0'
    }]
  },
  bar: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    values: [3,5,2,7,4,9,8,5,11,7,6,12]
  },
  donut: {
    labels: ['Local','Destination','Micro','Corporate'],
    values: [42,28,18,12]
  },
  area: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets: [{
      values: [3,8,10,17,21,30,38,43,54,61,67,79],
      color: '#C9A8E0',
      areaColor: 'rgba(201,168,224,0.20)'
    }]
  }
};

/* ──────────────────────────────────────────────────────────
   RENDER ALL CHARTS
────────────────────────────────────────────────────────── */
function renderUserCharts() {
  const c1 = document.getElementById('user-chart-line');
  const c2 = document.getElementById('user-chart-bar');
  const c3 = document.getElementById('user-chart-donut');
  const c4 = document.getElementById('user-chart-area');
  drawLineChart(c1,  userChartData.line.labels,   userChartData.line.datasets);
  drawBarChart(c2,   userChartData.bar.labels,    userChartData.bar.values);
  drawDonutChart(c3, userChartData.donut.labels,  userChartData.donut.values, { centerLabel: 'Budget' });
  drawAreaChart(c4,  userChartData.area.labels,   userChartData.area.datasets);
}

function renderAdminCharts() {
  const c1 = document.getElementById('admin-chart-line');
  const c2 = document.getElementById('admin-chart-bar');
  const c3 = document.getElementById('admin-chart-donut');
  const c4 = document.getElementById('admin-chart-area');
  drawLineChart(c1,  adminChartData.line.labels,   adminChartData.line.datasets);
  drawBarChart(c2,   adminChartData.bar.labels,    adminChartData.bar.values);
  drawDonutChart(c3, adminChartData.donut.labels,  adminChartData.donut.values, { centerLabel: 'Events' });
  drawAreaChart(c4,  adminChartData.area.labels,   adminChartData.area.datasets);
}

window.redrawAllCharts = function() {
  const isUser  = !!document.getElementById('user-chart-line');
  const isAdmin = !!document.getElementById('admin-chart-line');
  requestAnimationFrame(() => {
    if (isUser)  renderUserCharts();
    if (isAdmin) renderAdminCharts();
  });
};

/* ──────────────────────────────────────────────────────────
   SIDEBAR COLLAPSE
────────────────────────────────────────────────────────── */
(function initSidebar() {
  const sidebar    = document.getElementById('dash-sidebar');
  const hamburgers = document.querySelectorAll('.sidebar-hamburger, #sidebar-hamburger');
  const overlay    = document.getElementById('sidebar-overlay');
  if (!sidebar || !hamburgers.length) return;

  function isMobile() { return window.innerWidth <= 768; }

  function openSidebarMobile() {
    sidebar.classList.add('mobile-open');
    overlay && overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebarMobile() {
    sidebar.classList.remove('mobile-open');
    overlay && overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleSidebar() {
    if (isMobile()) {
      if (sidebar.classList.contains('mobile-open')) {
        closeSidebarMobile();
      } else {
        openSidebarMobile();
      }
    } else {
      sidebar.classList.toggle('collapsed');
    }
    // Redraw charts after transition
    setTimeout(window.redrawAllCharts, 320);
  }

  hamburgers.forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
  }));

  // Close on overlay click
  overlay && overlay.addEventListener('click', closeSidebarMobile);

  // Close when clicking outside sidebar on mobile
  document.addEventListener('click', (e) => {
    if (isMobile() && sidebar.classList.contains('mobile-open')) {
      const clickedInsideSidebar = sidebar.contains(e.target);
      const clickedHamburger = Array.from(hamburgers).some(btn => btn.contains(e.target));
      if (!clickedInsideSidebar && !clickedHamburger) {
        closeSidebarMobile();
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
      closeSidebarMobile();
    }
  });

  // Close when clicking a nav item on mobile
  sidebar.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (isMobile()) {
        closeSidebarMobile();
      }
    });
  });

  // On resize
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      closeSidebarMobile();
    }
  });
})();

/* ──────────────────────────────────────────────────────────
   VIEW SWITCHING WITH SKELETON LOADERS
────────────────────────────────────────────────────────── */
(function initViewSwitching() {
  const navItems = document.querySelectorAll('.sidebar-nav-item[data-view]');
  const views    = document.querySelectorAll('.dash-view');
  if (!navItems.length) return;

  function showView(viewId) {
    // Deactivate all
    navItems.forEach(n => n.classList.remove('active'));
    views.forEach(v => { v.classList.remove('active'); });

    // Activate nav item
    const activeNav = document.querySelector(`.sidebar-nav-item[data-view="${viewId}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Show skeleton
    const targetView = document.getElementById(viewId);
    if (!targetView) return;

    const skeleton = targetView.querySelector('.view-skeleton');
    const content  = targetView.querySelector('.view-content');
    if (skeleton && content) {
      skeleton.style.display = 'block';
      content.style.display  = 'none';
      targetView.classList.add('active');
      setTimeout(() => {
        skeleton.style.display = 'none';
        content.style.display  = '';
        // Render charts after layout is ready
        requestAnimationFrame(() => {
          if (viewId === 'view-overview-user') renderUserCharts();
          if (viewId === 'view-overview-admin') renderAdminCharts();
        });
      }, 350);
    } else {
      targetView.classList.add('active');
      requestAnimationFrame(() => {
        if (viewId === 'view-overview-user') renderUserCharts();
        if (viewId === 'view-overview-admin') renderAdminCharts();
      });
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => showView(item.dataset.view));
  });

  // Show default view
  const defaultView = navItems[0];
  if (defaultView) showView(defaultView.dataset.view);
})();

/* ──────────────────────────────────────────────────────────
   CHECKLIST INTERACTIONS (User Dashboard)
────────────────────────────────────────────────────────── */
(function initChecklist() {
  document.querySelectorAll('.checklist-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      updatePhaseRings();
    });
  });

  function updatePhaseRings() {
    document.querySelectorAll('.checklist-phase').forEach(phase => {
      const items   = phase.querySelectorAll('.checklist-item');
      const checked = phase.querySelectorAll('.checklist-item.checked');
      const pct     = items.length ? Math.round((checked.length / items.length) * 100) : 0;
      const ring    = phase.querySelector('.phase-ring-fill');
      const pctEl   = phase.querySelector('.phase-ring-text');
      if (ring) {
        const circumference = 2 * Math.PI * 18; // r=18
        ring.style.strokeDasharray  = circumference;
        ring.style.strokeDashoffset = circumference - (pct / 100) * circumference;
      }
      if (pctEl) pctEl.textContent = pct + '%';
    });
  }

  updatePhaseRings();

  // Add item demo
  const addBtn   = document.getElementById('checklist-add-btn');
  const addInput = document.getElementById('checklist-add-input');
  const defaultPhaseList = document.querySelector('.checklist-phase .checklist-items');

  if (addBtn && addInput && defaultPhaseList) {
    addBtn.addEventListener('click', () => {
      const val = addInput.value.trim();
      if (!val) return;
      const li = document.createElement('div');
      li.className = 'checklist-item';
      li.innerHTML = `
        <div class="checklist-checkbox">
          <i data-lucide="check" style="width:12px;height:12px;display:none;"></i>
        </div>
        <span class="checklist-label">${escHtmlD(val)}</span>
      `;
      li.addEventListener('click', () => { li.classList.toggle('checked'); updatePhaseRings(); });
      defaultPhaseList.appendChild(li);
      addInput.value = '';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      updatePhaseRings();
    });
  }
})();

/* ──────────────────────────────────────────────────────────
   VENDOR DEMO ACTIONS
────────────────────────────────────────────────────────── */
(function initVendorActions() {
  document.querySelectorAll('[data-vendor-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.vendorAction;
      const card   = btn.closest('.vendor-card');
      const pill   = card && card.querySelector('.status-pill');
      if (action === 'accept' && pill) {
        pill.className = 'status-pill status-booked';
        pill.textContent = 'Booked';
        btn.closest('.vendor-actions') && (btn.closest('.vendor-actions').style.display = 'none');
      }
      if (action === 'decline' && card) {
        card.style.opacity = '.4';
        card.style.pointerEvents = 'none';
      }
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   BUDGET EDITABLE ROWS
────────────────────────────────────────────────────────── */
(function initBudget() {
  document.querySelectorAll('.budget-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row      = btn.closest('.budget-row');
      const amountEl = row && row.querySelector('.budget-spent');
      if (!amountEl) return;
      const current  = parseInt(amountEl.dataset.spent || '0');
      const input    = document.createElement('input');
      input.type     = 'number';
      input.value    = current;
      input.className = 'form-input';
      input.style.cssText = 'width:90px;padding:.25rem .5rem;font-size:.85rem;';
      amountEl.replaceWith(input);
      input.focus();
      input.addEventListener('blur', () => {
        const val  = parseInt(input.value) || 0;
        const span = document.createElement('span');
        span.className    = 'budget-spent';
        span.dataset.spent= val;
        span.textContent  = '$' + val.toLocaleString();
        input.replaceWith(span);
      });
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   TIMELINE EDIT MODAL (User Dashboard)
────────────────────────────────────────────────────────── */
(function initTimelineEdit() {
  const modal   = document.getElementById('timeline-modal');
  const modalTitle = document.getElementById('modal-timeline-title');
  const closeBtn   = document.getElementById('modal-close');
  const saveBtn    = document.getElementById('modal-save');
  if (!modal) return;

  let activeBlock = null;

  document.querySelectorAll('.timeline-block').forEach(block => {
    block.addEventListener('click', () => {
      activeBlock = block;
      if (modalTitle) modalTitle.value = block.querySelector('h4') ? block.querySelector('h4').textContent : '';
      modal.classList.add('open');
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    activeBlock = null;
  }

  closeBtn && closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  saveBtn && saveBtn.addEventListener('click', () => {
    if (activeBlock && modalTitle) {
      const h4 = activeBlock.querySelector('h4');
      if (h4) h4.textContent = modalTitle.value;
    }
    closeModal();
  });
})();

/* ──────────────────────────────────────────────────────────
   MESSAGES DEMO (both dashboards)
────────────────────────────────────────────────────────── */
(function initMessages() {
  document.querySelectorAll('.message-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.message-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  document.querySelectorAll('.compose-box').forEach(box => {
    const input   = box.querySelector('input');
    const sendBtn = box.querySelector('.send-btn');
    if (!input || !sendBtn) return;

    function sendMessage() {
      const val = input.value.trim();
      if (!val) return;
      const thread = box.closest('.message-thread');
      const body   = thread && thread.querySelector('.thread-body');
      if (!body) return;
      const msg = document.createElement('div');
      msg.className = 'thread-message from-me';
      msg.innerHTML = `
        <div class="thread-message-bubble">${escHtmlD(val)}</div>
        <div class="thread-message-time">${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
      `;
      body.appendChild(msg);
      input.value = '';
      msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
  });
})();

/* ──────────────────────────────────────────────────────────
   ADMIN — CLIENT TABLE SEARCH & FILTER
────────────────────────────────────────────────────────── */
(function initClientTable() {
  const search   = document.getElementById('client-search');
  const filter   = document.getElementById('client-status-filter');
  const rows     = document.querySelectorAll('.client-row');
  if (!rows.length) return;

  function applyFilters() {
    const q    = search   ? search.value.toLowerCase()   : '';
    const stat = filter   ? filter.value.toLowerCase()   : 'all';
    rows.forEach(row => {
      const name   = (row.dataset.name   || '').toLowerCase();
      const status = (row.dataset.status || '').toLowerCase();
      const show   = name.includes(q) && (stat === 'all' || status === stat);
      row.style.display = show ? '' : 'none';
    });
  }

  search && search.addEventListener('input', applyFilters);
  filter && filter.addEventListener('change', applyFilters);
})();

/* ──────────────────────────────────────────────────────────
   ADMIN — VENDOR APPROVE/SUSPEND
────────────────────────────────────────────────────────── */
(function initVendorManagement() {
  document.querySelectorAll('[data-vendor-mgmt]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.vendorMgmt;
      const row    = btn.closest('tr');
      const pill   = row && row.querySelector('.status-pill');
      if (!pill) return;
      if (action === 'approve') {
        pill.className = 'status-pill status-approved';
        pill.textContent = 'Approved';
      } else if (action === 'suspend') {
        pill.className = 'status-pill status-suspended';
        pill.textContent = 'Suspended';
      }
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   ADMIN — REPORTS PERIOD SELECTOR
────────────────────────────────────────────────────────── */
(function initReports() {
  const selector = document.getElementById('report-period');
  const numbers  = document.querySelectorAll('[data-report-value]');
  if (!selector) return;

  const data = {
    month:   { revenue: '$48,200', bookings: '12', inquiries: '28', avg: '$4,017' },
    quarter: { revenue: '$142,500', bookings: '38', inquiries: '84', avg: '$3,750' },
    year:    { revenue: '$524,000', bookings: '134', inquiries: '312', avg: '$3,910' }
  };

  selector.addEventListener('change', () => {
    const d = data[selector.value] || data.month;
    numbers.forEach(el => {
      const key = el.dataset.reportValue;
      if (d[key]) el.textContent = d[key];
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   SETTINGS — LOGOUT
────────────────────────────────────────────────────────── */
(function initLogout() {
  document.querySelectorAll('[data-logout]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   SETTINGS — DEMO SAVE
────────────────────────────────────────────────────────── */
(function initSettingsForms() {
  document.querySelectorAll('.settings-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Saved!';
        btn.disabled = true;
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2000);
      }
    });
  });
})();

/* ──────────────────────────────────────────────────────────
   RESIZE — REDRAW CHARTS
────────────────────────────────────────────────────────── */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(window.redrawAllCharts, 100);
});

// Auto-resize charts via ResizeObserver when charts-grid layout is ready
if (typeof ResizeObserver !== 'undefined') {
  document.querySelectorAll('.charts-grid').forEach(grid => {
    let roTimer;
    new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentRect && entry.contentRect.width > 0) {
          clearTimeout(roTimer);
          roTimer = setTimeout(window.redrawAllCharts, 40);
          break;
        }
      }
    }).observe(grid);
  });
}

/* ──────────────────────────────────────────────────────────
   INIT ON DOM READY
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  setTimeout(window.redrawAllCharts, 80);
});

window.addEventListener('load', () => {
  setTimeout(window.redrawAllCharts, 100);
});

/* ──────────────────────────────────────────────────────────
   UTILS
────────────────────────────────────────────────────────── */
function escHtmlD(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}
