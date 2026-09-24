/* ============================================================
   MUSE — dashboard.js
   Sidebar, view switching, skeleton loaders, 4 charts each,
   tables, modals, demo actions
   ============================================================ */

'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

/* ── detect which dashboard ── */
const IS_ADMIN = document.body.classList.contains('admin-dash');

/* ============================================================
   1. SIDEBAR COLLAPSE
   ============================================================ */
(function initSidebar() {
  const sidebar = $('.dash-sidebar');
  const hamburgers = $$('.sidebar-hamburger, .topbar-hamburger');
  const main = $('.dash-main');
  if (!sidebar || !hamburgers.length) return;

  let collapsed = window.innerWidth <= 768 ? false : (localStorage.getItem('muse-sidebar') === 'collapsed');
  apply(collapsed);

  hamburgers.forEach(hamburger => {
    on(hamburger, 'click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
        // overlay
        let ov = $('#sidebar-overlay');
        if (!ov) {
          ov = document.createElement('div');
          ov.id = 'sidebar-overlay';
          ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:199;display:none;';
          document.body.appendChild(ov);
        }
        const open = sidebar.classList.contains('mobile-open');
        ov.style.display = open ? 'block' : 'none';
        on(ov, 'click', () => { sidebar.classList.remove('mobile-open'); ov.style.display = 'none'; });
      } else {
        collapsed = !collapsed;
        localStorage.setItem('muse-sidebar', collapsed ? 'collapsed' : '');
        apply(collapsed);
      }
    });
  });

  function apply(c) {
    sidebar.classList.toggle('collapsed', c);
    setTimeout(() => {
      if (typeof renderCharts === 'function') {
        chartsRendered = false;
        renderCharts();
      }
    }, 320);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) { sidebar.classList.remove('mobile-open'); }
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (typeof renderCharts === 'function') {
        chartsRendered = false;
        renderCharts();
      }
    }, 150);
  });
})();

/* ============================================================
   2. VIEW SWITCHING with skeleton loaders
   ============================================================ */
(function initViewSwitching() {
  const navItems = $$('.sidebar-nav-item[data-view]');
  const views = $$('.dash-view');

  if (!navItems.length || !views.length) return;

  navItems.forEach(item => {
    on(item, 'click', () => {
      const viewId = item.dataset.view;
      switchView(viewId, item);
    });
  });

  function switchView(viewId, activeItem) {
    // Update nav
    navItems.forEach(i => i.classList.remove('active'));
    activeItem.classList.add('active');

    // Show skeleton, then reveal
    views.forEach(v => v.classList.remove('active'));
    const target = $(`#view-${viewId}`);
    if (!target) return;

    // Skeleton flash
    target.classList.add('active');
    const skeletonEl = target.querySelector('.view-skeleton');
    const contentEl = target.querySelector('.view-content');

    if (skeletonEl && contentEl) {
      skeletonEl.style.display = 'block';
      contentEl.style.display = 'none';
      setTimeout(() => {
        skeletonEl.style.display = 'none';
        contentEl.style.display = 'block';
        // Render charts if overview
        if (viewId === 'overview') renderCharts();
      }, 500);
    } else {
      if (viewId === 'overview') renderCharts();
    }
  }

  // Activate default (overview)
  const defaultItem = $('.sidebar-nav-item[data-view="overview"]');
  if (defaultItem) {
    // small delay to let DOM settle
    setTimeout(() => switchView('overview', defaultItem), 100);
  }
})();

/* ============================================================
   3. CHARTS — Hand-built SVG/Canvas (4 per dashboard)
   ============================================================ */

let chartsRendered = false;
function renderCharts() {
  if (chartsRendered) return;
  chartsRendered = true;

  if (IS_ADMIN) {
    renderAdminCharts();
  } else {
    renderUserCharts();
  }
}

/* ── Color helpers ── */
function isDark() { return document.documentElement.classList.contains('dark'); }
function textColor() { return isDark() ? 'rgba(240,237,232,.7)' : 'rgba(50,50,50,.7)'; }
function gridColor() { return isDark() ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'; }
const ACCENT = '#E8253A';
const ACCENT_LIGHT = 'rgba(232,37,58,.15)';

/* ── USER DASHBOARD CHARTS ── */
function renderUserCharts() {
  // 1. LINE CHART — booking trend 12 months
  const lineData = [3, 5, 4, 7, 6, 9, 8, 11, 10, 13, 12, 15];
  const lineLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  drawLineChart('chart-user-line', lineLabels, lineData, 'Booking Trend');

  // 2. BAR CHART — monthly earnings
  const barData = [2400, 3100, 2800, 4200, 3700, 5100, 4600, 5800, 5200, 6400, 5900, 7200];
  drawBarChart('chart-user-bar', lineLabels, barData, 'Monthly Earnings ($)');

  // 3. DONUT CHART — casting responses
  const donutData = [{ label:'Accepted', value:42, color:'#28a745' }, { label:'Pending', value:33, color:'#ffc107' }, { label:'Declined', value:25, color:ACCENT }];
  drawDonutChart('chart-user-donut', donutData, 'Casting Responses');

  // 4. AREA CHART — cumulative payments
  const areaData = [1200, 3400, 5100, 7800, 9500, 12100, 15600, 18200, 21000, 24800, 28500, 32400];
  drawAreaChart('chart-user-area', lineLabels, areaData, 'Cumulative Payments ($)');
}

/* ── ADMIN DASHBOARD CHARTS ── */
function renderAdminCharts() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // 1. LINE CHART — agency revenue trend
  const revenueData = [14000, 18500, 16200, 22400, 20100, 28600, 25800, 32000, 29400, 36800, 34200, 42000];
  drawLineChart('chart-admin-line', months, revenueData, 'Agency Revenue ($)');

  // 2. BAR CHART — new talent applications per month
  const appData = [12, 19, 15, 24, 21, 28, 26, 32, 29, 35, 31, 38];
  drawBarChart('chart-admin-bar', months, appData, 'New Applications');

  // 3. DONUT CHART — roster status distribution
  const rosterData = [{ label:'Active', value:58, color:'#28a745' }, { label:'On Hold', value:24, color:'#ffc107' }, { label:'Prospect', value:18, color:ACCENT }];
  drawDonutChart('chart-admin-donut', rosterData, 'Roster Status');

  // 4. AREA CHART — cumulative commission growth
  const commissionData = [8200, 19400, 28100, 39800, 49500, 62100, 75600, 89200, 101000, 118800, 132500, 149400];
  drawAreaChart('chart-admin-area', months, commissionData, 'Cumulative Commission ($)');
}

/* ── DRAW LINE CHART (Canvas) ── */
function drawLineChart(canvasId, labels, data, title) {
  const canvas = $(`#${canvasId}`);
  if (!canvas) return;
  canvas.width = canvas.offsetWidth || 400;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const PAD = { top: 16, right: 16, bottom: 32, left: 44 };
  const w = W - PAD.left - PAD.right;
  const h = H - PAD.top - PAD.bottom;

  ctx.clearRect(0, 0, W, H);

  const max = Math.max(...data) * 1.1;
  const min = 0;

  // Grid lines
  ctx.strokeStyle = gridColor();
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + (h / 4) * i;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + w, y); ctx.stroke();
    const val = Math.round(max - (max / 4) * i);
    ctx.fillStyle = textColor(); ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(val, PAD.left - 6, y + 3);
  }

  // X labels
  ctx.fillStyle = textColor(); ctx.textAlign = 'center';
  labels.forEach((lbl, i) => {
    const x = PAD.left + (w / (labels.length - 1)) * i;
    ctx.fillText(lbl, x, H - 8);
  });

  // Points
  const pts = data.map((d, i) => ({
    x: PAD.left + (w / (data.length - 1)) * i,
    y: PAD.top + h - ((d - min) / (max - min)) * h
  }));

  // Fill under line
  ctx.beginPath();
  ctx.moveTo(pts[0].x, PAD.top + h);
  pts.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(pts[pts.length - 1].x, PAD.top + h);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + h);
  grad.addColorStop(0, 'rgba(232,37,58,.25)');
  grad.addColorStop(1, 'rgba(232,37,58,0)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = ACCENT; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.stroke();

  // Dots
  pts.forEach(p => {
    ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = ACCENT; ctx.fill();
    ctx.strokeStyle = isDark() ? '#1A1A1A' : '#fff'; ctx.lineWidth = 2; ctx.stroke();
  });
}

/* ── DRAW BAR CHART (Canvas) ── */
function drawBarChart(canvasId, labels, data, title) {
  const canvas = $(`#${canvasId}`);
  if (!canvas) return;
  canvas.width = canvas.offsetWidth || 400;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const PAD = { top: 16, right: 12, bottom: 32, left: 44 };
  const w = W - PAD.left - PAD.right;
  const h = H - PAD.top - PAD.bottom;

  ctx.clearRect(0, 0, W, H);

  const max = Math.max(...data) * 1.15;
  const barGap = w / data.length;
  const barW = barGap * 0.6;

  // Grid
  ctx.strokeStyle = gridColor(); ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + (h / 4) * i;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + w, y); ctx.stroke();
    const val = Math.round(max - (max / 4) * i);
    ctx.fillStyle = textColor(); ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(val, PAD.left - 6, y + 3);
  }

  // Bars
  data.forEach((d, i) => {
    const x = PAD.left + barGap * i + (barGap - barW) / 2;
    const barH = (d / max) * h;
    const y = PAD.top + h - barH;

    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, ACCENT);
    grad.addColorStop(1, 'rgba(232,37,58,.5)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barW, barH, [3, 3, 0, 0]) : ctx.rect(x, y, barW, barH);
    ctx.fill();

    // X label
    ctx.fillStyle = textColor(); ctx.font = '9px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barW / 2, H - 8);
  });
}

/* ── DRAW DONUT CHART (Canvas) ── */
function drawDonutChart(canvasId, segments, title) {
  const canvas = $(`#${canvasId}`);
  if (!canvas) return;
  canvas.width = canvas.offsetWidth || 280;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  const cx = (W - 120) / 2, cy = H / 2, radius = Math.min(cx, cy) - 10;
  const inner = radius * 0.6;
  const total = segments.reduce((s, d) => s + d.value, 0);

  let startAngle = -Math.PI / 2;
  segments.forEach(seg => {
    const slice = (seg.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    ctx.strokeStyle = isDark() ? '#1A1A1A' : '#fff';
    ctx.lineWidth = 2; ctx.stroke();
    startAngle += slice;
  });

  // Inner circle (donut hole)
  ctx.beginPath(); ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = isDark() ? '#1A1A1A' : '#fff'; ctx.fill();

  // Center label
  ctx.fillStyle = isDark() ? '#F0EDE8' : '#0D0D0D';
  ctx.font = 'bold 18px Inter, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(total, cx, cy + 3);
  ctx.font = '10px Inter, sans-serif'; ctx.fillStyle = textColor();
  ctx.fillText('Total', cx, cy + 16);

  // Legend
  const legX = W - 115, legStartY = H / 2 - (segments.length * 22) / 2;
  segments.forEach((seg, i) => {
    const y = legStartY + i * 22;
    ctx.fillStyle = seg.color;
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(legX, y, 10, 10, 2) : ctx.rect(legX, y, 10, 10);
    ctx.fill();
    ctx.fillStyle = textColor(); ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(`${seg.label} (${seg.value}%)`, legX + 14, y + 9);
  });
}

/* ── DRAW AREA CHART (Canvas) ── */
function drawAreaChart(canvasId, labels, data, title) {
  const canvas = $(`#${canvasId}`);
  if (!canvas) return;
  canvas.width = canvas.offsetWidth || 400;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const PAD = { top: 16, right: 16, bottom: 32, left: 52 };
  const w = W - PAD.left - PAD.right;
  const h = H - PAD.top - PAD.bottom;

  ctx.clearRect(0, 0, W, H);

  const max = Math.max(...data) * 1.08;

  // Grid
  ctx.strokeStyle = gridColor(); ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = PAD.top + (h / 4) * i;
    ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + w, y); ctx.stroke();
    const val = Math.round((max - (max / 4) * i));
    const label = val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val;
    ctx.fillStyle = textColor(); ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(label, PAD.left - 6, y + 3);
  }

  // X labels
  ctx.fillStyle = textColor(); ctx.font = '9px Inter, sans-serif'; ctx.textAlign = 'center';
  labels.forEach((lbl, i) => {
    const x = PAD.left + (w / (labels.length - 1)) * i;
    ctx.fillText(lbl, x, H - 8);
  });

  const pts = data.map((d, i) => ({
    x: PAD.left + (w / (data.length - 1)) * i,
    y: PAD.top + h - (d / max) * h
  }));

  // Smooth area
  ctx.beginPath();
  ctx.moveTo(pts[0].x, PAD.top + h);
  pts.forEach((p, i) => {
    if (i === 0) ctx.lineTo(p.x, p.y);
    else {
      const prev = pts[i - 1];
      const cpx = (prev.x + p.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
    }
  });
  ctx.lineTo(pts[pts.length - 1].x, PAD.top + h);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + h);
  grad.addColorStop(0, 'rgba(232,37,58,.35)');
  grad.addColorStop(1, 'rgba(232,37,58,.02)');
  ctx.fillStyle = grad; ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = ACCENT; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  pts.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else {
      const prev = pts[i - 1];
      const cpx = (prev.x + p.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
    }
  });
  ctx.stroke();
}

/* ============================================================
   THEME & RTL TOGGLES FOR DASHBOARD
   ============================================================ */
(function initDashboardThemeAndRTL() {
  const moonIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const sunIcon = () => `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

  /* Theme Init */
  const storedTheme = localStorage.getItem('muse-theme') || (document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  applyTheme(storedTheme);

  document.querySelectorAll('.toggle-theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('muse-theme', nextTheme);
      chartsRendered = false;
      setTimeout(() => renderCharts(), 100);
    });
  });

  function applyTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.querySelectorAll('.toggle-theme-btn').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? sunIcon() : moonIcon();
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  /* RTL Init */
  const storedDir = localStorage.getItem('muse-dir') || document.documentElement.getAttribute('dir') || 'ltr';
  applyDir(storedDir);

  document.querySelectorAll('.toggle-rtl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const nextDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
      applyDir(nextDir);
      localStorage.setItem('muse-dir', nextDir);
      chartsRendered = false;
      setTimeout(() => renderCharts(), 100);
    });
  });

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.querySelectorAll('.toggle-rtl-btn').forEach(btn => {
      btn.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
      btn.setAttribute('aria-label', dir === 'ltr' ? 'Switch to RTL mode' : 'Switch to LTR mode');
      btn.setAttribute('title', dir === 'ltr' ? 'Switch to RTL mode' : 'Switch to LTR mode');
    });
  }
})();

/* ============================================================
   4. DASHBOARD TABLES — demo data
   ============================================================ */
(function initTables() {
  populateTalentTable();
  populateCastingTable();
  populateBookingsTable();
  populatePaymentsTable();
  populateContractsTable();
  populateReportsCards();
})();

function populateTalentTable() {
  const tbody = $('#talent-table-body');
  if (!tbody) return;
  const talent = [
    { name: 'Sofia Marchetti', cat: 'Model', loc: 'Milan', status: 'Active', date: 'Jan 12, 2024' },
    { name: 'James Okafor', cat: 'Actor', loc: 'Lagos', status: 'Active', date: 'Feb 03, 2024' },
    { name: 'Priya Nair', cat: 'Influencer', loc: 'Mumbai', status: 'On Hold', date: 'Mar 18, 2024' },
    { name: 'Luca Fernández', cat: 'Creator', loc: 'Madrid', status: 'Active', date: 'Apr 07, 2024' },
    { name: 'Amara Diallo', cat: 'Model', loc: 'Dakar', status: 'Active', date: 'May 22, 2024' },
    { name: 'Ethan Kwan', cat: 'Actor', loc: 'Toronto', status: 'Suspended', date: 'Jun 14, 2024' },
    { name: 'Isabelle Moreau', cat: 'Model', loc: 'Paris', status: 'Active', date: 'Jul 30, 2024' },
    { name: 'Rayan Al-Faris', cat: 'Influencer', loc: 'Dubai', status: 'On Hold', date: 'Aug 11, 2024' },
  ];

  talent.forEach(t => {
    const statusPill = t.status === 'Active' ? 'pill-green' : t.status === 'On Hold' ? 'pill-amber' : 'pill-red';
    const initials = t.name.split(' ').map(n=>n[0]).join('');
    tbody.innerHTML += `
      <tr>
        <td><div class="td-avatar">
          <div style="width:36px;height:36px;border-radius:50%;background:var(--clr-accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;flex-shrink:0">${initials}</div>
          <span>${t.name}</span>
        </div></td>
        <td>${t.cat}</td>
        <td>${t.loc}</td>
        <td><span class="pill ${statusPill}">${t.status}</span></td>
        <td>${t.date}</td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-sm btn-outline" onclick="demoAction(this,'Approved')">Approve</button>
            <button class="btn btn-sm" style="background:var(--clr-bg-alt);font-size:.78rem;padding:6px 10px;" onclick="demoAction(this,'Suspended')">Suspend</button>
          </div>
        </td>
      </tr>`;
  });
}

function populateCastingTable() {
  const tbody = $('#casting-table-body');
  if (!tbody) return;
  const calls = [
    { role: 'Lead — Drama Series', prod: 'Netflix Original', status: 'Open', count: 47, deadline: 'Oct 15' },
    { role: 'Commercial Talent', prod: 'Chanel Campaign', status: 'Open', count: 23, deadline: 'Oct 20' },
    { role: 'Supporting Actor', prod: 'Studio Feature Film', status: 'Closed', count: 112, deadline: 'Sep 30' },
    { role: 'Brand Ambassador', prod: 'Luxury Auto Brand', status: 'Open', count: 18, deadline: 'Nov 05' },
    { role: 'Editorial Model', prod: 'Vogue Cover', status: 'Open', count: 64, deadline: 'Oct 28' },
  ];
  calls.forEach(c => {
    const pill = c.status === 'Open' ? 'pill-green' : 'pill-gray';
    tbody.innerHTML += `
      <tr>
        <td>${c.role}</td>
        <td>${c.prod}</td>
        <td><span class="pill ${pill}">${c.status}</span></td>
        <td>${c.count}</td>
        <td>${c.deadline}</td>
        <td>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-sm btn-outline" onclick="demoAction(this,'Edited')">Edit</button>
            <button class="btn btn-sm" style="background:var(--clr-bg-alt);font-size:.78rem;padding:6px 10px;" onclick="demoAction(this,'Closed')">Close</button>
          </div>
        </td>
      </tr>`;
  });
}

function populateBookingsTable() {
  const tbody = $('#bookings-table-body');
  if (!tbody) return;
  const bookings = [
    { talent: 'Sofia Marchetti', client: 'Dior', prod: 'Spring Campaign', date: 'Oct 12, 2024', value: '$4,200', status: 'Confirmed' },
    { talent: 'James Okafor', client: 'Netflix', prod: 'Drama Lead', date: 'Nov 03, 2024', value: '$12,500', status: 'Pending' },
    { talent: 'Priya Nair', client: 'Meta', prod: 'Social Campaign', date: 'Oct 28, 2024', value: '$2,800', status: 'Completed' },
    { talent: 'Luca Fernández', client: 'Adidas', prod: 'Brand Collab', date: 'Dec 01, 2024', value: '$6,400', status: 'Confirmed' },
    { talent: 'Amara Diallo', client: 'L\'Oréal', prod: 'Beauty Editorial', date: 'Oct 18, 2024', value: '$3,100', status: 'Completed' },
  ];
  bookings.forEach(b => {
    const pill = b.status === 'Confirmed' ? 'pill-green' : b.status === 'Pending' ? 'pill-amber' : 'pill-blue';
    tbody.innerHTML += `
      <tr>
        <td>${b.talent}</td>
        <td>${b.client}</td>
        <td>${b.prod}</td>
        <td>${b.date}</td>
        <td style="font-weight:600;color:var(--clr-accent)">${b.value}</td>
        <td><span class="pill ${pill}">${b.status}</span></td>
      </tr>`;
  });
}

function populatePaymentsTable() {
  const tbody = $('#payments-table-body');
  if (!tbody) return;
  const payments = [
    { date: 'Oct 05, 2024', prod: 'Chanel Editorial', amount: '$3,200', status: 'Paid' },
    { date: 'Sep 28, 2024', prod: 'Netflix Pilot', amount: '$8,750', status: 'Paid' },
    { date: 'Sep 15, 2024', prod: 'Dior Campaign', amount: '$4,200', status: 'Processing' },
    { date: 'Aug 30, 2024', prod: 'Vogue Cover', amount: '$2,800', status: 'Paid' },
    { date: 'Aug 12, 2024', prod: 'Samsung Ad', amount: '$5,600', status: 'Paid' },
  ];
  payments.forEach(p => {
    const pill = p.status === 'Paid' ? 'pill-green' : 'pill-amber';
    tbody.innerHTML += `
      <tr>
        <td>${p.date}</td>
        <td>${p.prod}</td>
        <td style="font-weight:700;color:var(--clr-accent)">${p.amount}</td>
        <td><span class="pill ${pill}">${p.status}</span></td>
      </tr>`;
  });
}

function populateContractsTable() {
  const tbody = $('#contracts-table-body');
  if (!tbody) return;
  const contracts = [
    { name: 'Netflix Drama Series Agreement', prod: 'Netflix Original', status: 'Signed' },
    { name: 'Chanel Spring Campaign Contract', prod: 'Chanel SA', status: 'Awaiting Signature' },
    { name: 'Dior Talent Management Agreement', prod: 'Dior', status: 'Signed' },
    { name: 'Brand Ambassador Agreement — Adidas', prod: 'Adidas AG', status: 'Awaiting Signature' },
  ];
  contracts.forEach(c => {
    const pill = c.status === 'Signed' ? 'pill-green' : 'pill-amber';
    tbody.innerHTML += `
      <tr>
        <td><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:6px;color:var(--clr-accent)"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>${c.name}</td>
        <td>${c.prod}</td>
        <td><span class="pill ${pill}">${c.status}</span></td>
        <td><button class="btn btn-sm btn-outline" onclick="openSignModal('${c.name}')">Review & Sign</button></td>
      </tr>`;
  });
}

function populateReportsCards() {
  const container = $('#reports-cards');
  if (!container) return;
  const reports = [
    { title: 'Bookings Report', desc: 'All bookings this quarter with revenue breakdown', icon: '📋' },
    { title: 'Revenue Report', desc: 'Agency revenue by category and month', icon: '📊' },
    { title: 'Roster Growth', desc: 'New talent joined vs churned this period', icon: '👥' },
  ];
  reports.forEach(r => {
    container.innerHTML += `
      <div class="card" style="padding:24px;">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px;">
          <div>
            <h4 style="font-size:1rem;margin-bottom:6px">${r.title}</h4>
            <p style="font-size:.82rem;color:var(--clr-text-muted)">${r.desc}</p>
          </div>
        </div>
        <button class="btn btn-sm btn-outline" onclick="demoAction(this,'Exported')">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>`;
  });
}

/* ============================================================
   5. MODALS
   ============================================================ */
window.openSignModal = function(name) {
  const overlay = $('#sign-modal');
  if (!overlay) return;
  const title = overlay.querySelector('.modal-title');
  if (title) title.textContent = name;
  overlay.classList.add('open');
};

window.closeModal = function(id) {
  const overlay = $(`#${id}`);
  if (overlay) overlay.classList.remove('open');
};

$$('.modal-close').forEach(btn => {
  on(btn, 'click', () => btn.closest('.modal-overlay')?.classList.remove('open'));
});

$$('.modal-overlay').forEach(overlay => {
  on(overlay, 'click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
});

/* ============================================================
   6. DEMO ACTIONS
   ============================================================ */
window.demoAction = function(btn, label) {
  const orig = btn.textContent;
  btn.textContent = label + '!';
  btn.style.opacity = '0.7';
  btn.disabled = true;
  setTimeout(() => { btn.textContent = orig; btn.style.opacity = '1'; btn.disabled = false; }, 1500);
};

/* ============================================================
   7. INVITE ACCEPT / DECLINE (User dashboard)
   ============================================================ */
(function initInvites() {
  $$('.invite-accept').forEach(btn => {
    on(btn, 'click', () => {
      const card = btn.closest('.invite-card');
      if (!card) return;
      card.style.transition = 'opacity 0.4s, transform 0.4s';
      card.style.opacity = '0'; card.style.transform = 'scale(0.95)';
      setTimeout(() => { card.innerHTML = `<div style="padding:24px;text-align:center;color:var(--clr-accent);font-weight:600">✓ Added to Bookings & Schedule</div>`; card.style.opacity = '1'; card.style.transform = ''; }, 400);
    });
  });

  $$('.invite-decline').forEach(btn => {
    on(btn, 'click', () => {
      const card = btn.closest('.invite-card');
      if (!card) return;
      card.style.transition = 'opacity 0.4s'; card.style.opacity = '0';
      setTimeout(() => card.remove(), 400);
    });
  });
})();

/* ============================================================
   8. SEARCH FILTER (Talent Management)
   ============================================================ */
(function initSearch() {
  const searchInput = $('#talent-search');
  const catFilter = $('#cat-filter');
  if (!searchInput) return;

  function filterTable() {
    const q = searchInput.value.toLowerCase();
    const cat = catFilter ? catFilter.value.toLowerCase() : '';
    const rows = $$('#talent-table-body tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const matchQ = !q || text.includes(q);
      const matchCat = !cat || text.includes(cat);
      row.style.display = matchQ && matchCat ? '' : 'none';
    });
  }

  on(searchInput, 'input', filterTable);
  on(catFilter, 'change', filterTable);
})();

/* ============================================================
   9. LOGOUT BUTTONS
   ============================================================ */
$$('.logout-btn').forEach(btn => {
  on(btn, 'click', () => { window.location.href = 'login.html'; });
});

/* ============================================================
   10. MESSAGES
   ============================================================ */
(function initMessages() {
  $$('.msg-item').forEach(item => {
    on(item, 'click', () => {
      $$('.msg-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  const composeForm = $('.compose-form');
  on(composeForm, 'submit', (e) => {
    e.preventDefault();
    const input = composeForm ? composeForm.querySelector('input') : null;
    if (!input || !input.value.trim()) return;
    const thread = $('.thread-messages');
    if (thread) {
      const msg = document.createElement('div');
      msg.className = 'thread-msg outgoing';
      msg.textContent = input.value;
      thread.appendChild(msg);
      thread.scrollTop = thread.scrollHeight;
      input.value = '';
    }
  });
})();

/* ============================================================
   11. SETTINGS FORM (demo)
   ============================================================ */
(function initSettings() {
  $$('.settings-form').forEach(form => {
    on(form, 'submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (!btn) return;
      const orig = btn.textContent;
      btn.textContent = 'Saved!';
      btn.style.background = '#28a745';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
    });
  });
})();

/* ============================================================
   12. ADD TALENT MODAL
   ============================================================ */
window.openAddTalentModal = function() {
  const overlay = $('#add-talent-modal');
  if (overlay) overlay.classList.add('open');
};

window.openNewCastingModal = function() {
  const overlay = $('#new-casting-modal');
  if (overlay) overlay.classList.add('open');
};

/* ============================================================
   13. RESPONSIVE CHART RESIZE
   ============================================================ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    chartsRendered = false;
    renderCharts();
  }, 250);
});
