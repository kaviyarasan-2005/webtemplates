/* ============================================================
   SHIP — dashboard.js
   Dashboard-only JS: sidebar collapse, view switching with
   skeleton loaders, hand-built charts (SVG/Canvas), stage
   trackers, checklists, modals, demo actions — both dashboards.
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────
   1. SIDEBAR COLLAPSE
   ───────────────────────────────────────── */
(function initSidebar() {
  const sidebar = document.getElementById('dbSidebar');
  const main    = document.getElementById('dbMain');
  const toggle  = document.getElementById('dbHamburger');
  if (!sidebar || !toggle) return;

  // On mobile, sidebar opens as overlay
  function isMobile() { return window.innerWidth <= 768; }

  toggle.addEventListener('click', function() {
    if (isMobile()) {
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  });

  // close on outside click (mobile)
  document.addEventListener('click', function(e) {
    if (isMobile() && sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  window.addEventListener('resize', function() {
    if (!isMobile()) {
      sidebar.classList.remove('open');
    }
  });
})();

/* ─────────────────────────────────────────
   2. VIEW SWITCHING WITH SKELETON LOADERS
   ───────────────────────────────────────── */
(function initViewSwitching() {
  const navItems = document.querySelectorAll('.db-nav-item[data-view]');
  const views    = document.querySelectorAll('.db-view');
  if (!navItems.length) return;

  function skeletonHTML(type) {
    if (type === 'tiles+charts') {
      return `
        <div class="stat-tiles" style="margin-bottom:20px">
          ${Array(4).fill('<div class="skeleton skeleton-tile"></div>').join('')}
        </div>
        <div class="charts-grid">
          <div class="skeleton skeleton-chart"></div>
          <div class="skeleton skeleton-chart"></div>
          <div class="skeleton skeleton-chart"></div>
          <div class="skeleton skeleton-chart"></div>
        </div>`;
    }
    return Array(5).fill('<div class="skeleton skeleton-row"></div>').join('');
  }

  function switchView(viewId) {
    // update nav
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewId);
    });

    // show skeleton
    views.forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + viewId);
    if (!target) return;

    const isOverview = viewId === 'overview';
    const skelWrap = document.createElement('div');
    skelWrap.innerHTML = skeletonHTML(isOverview ? 'tiles+charts' : 'rows');
    target.classList.add('active');
    const original = target.innerHTML;
    target.innerHTML = skelWrap.innerHTML;

    setTimeout(() => {
      target.innerHTML = original;
      // re-init charts if overview
      if (isOverview) {
        setTimeout(() => initCharts(), 50);
      }
    }, 480);
  }

  navItems.forEach(item => {
    item.addEventListener('click', function() {
      switchView(item.dataset.view);
    });
  });

  // activate overview by default
  switchView('overview');
})();

/* ─────────────────────────────────────────
   3. HAND-BUILT CHARTS
   ───────────────────────────────────────── */
function initCharts() {
  initLineChart();
  initBarChart();
  initDonutChart();
  initAreaChart();
}

// ── Shared helpers ──
function getDarkMode() { return document.documentElement.classList.contains('dark'); }

function getGridColor() {
  return getDarkMode() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
}
function getTextColor() {
  return getDarkMode() ? '#6B6B6B' : '#9CA3AF';
}
function getAccent()    { return '#C0392B'; }
function getSurfaceColor() {
  return getDarkMode() ? '#1A1A1A' : '#FFFFFF';
}

function resizeCanvas(canvas) {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width  = Math.floor(rect.width);
  canvas.height = Math.min(200, Math.floor(rect.width * 0.55));
  return { w: canvas.width, h: canvas.height };
}

// ── 3a. LINE CHART ──
function initLineChart() {
  const canvas = document.getElementById('lineChart');
  if (!canvas) return;

  const isAdmin = canvas.dataset.admin === 'true';
  const labels  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const data    = isAdmin
    ? [52000, 61000, 57000, 74000, 68000, 81000, 79000, 88000, 92000, 86000, 95000, 103000]
    : [2100,  2800,  2400,  3200,  2900,  3600,  3400,  4100,  3900,  4400,  4200,  4800];

  function draw() {
    const ctx = canvas.getContext('2d');
    const { w, h } = resizeCanvas(canvas);
    ctx.clearRect(0, 0, w, h);

    const pad = { top: 20, right: 20, bottom: 36, left: isAdmin ? 60 : 50 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top  - pad.bottom;

    const maxVal = Math.max(...data) * 1.15;
    const xStep  = cw / (data.length - 1);

    // grid lines
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const y = pad.top + ch - (ch / gridLines) * i;
      ctx.strokeStyle = getGridColor();
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();

      // y-axis labels
      const val = Math.round((maxVal / gridLines) * i);
      ctx.fillStyle = getTextColor();
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(isAdmin ? '$' + (val/1000).toFixed(0) + 'K' : '$' + (val/1000).toFixed(1) + 'K', pad.left - 6, y + 4);
    }

    // points array
    const pts = data.map((d, i) => ({
      x: pad.left + i * xStep,
      y: pad.top + ch - (d / maxVal) * ch,
    }));

    // fill area under line
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pad.top + ch);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length-1].x, pad.top + ch);
    ctx.closePath();
    const areaGrad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
    areaGrad.addColorStop(0, 'rgba(192,57,43,0.18)');
    areaGrad.addColorStop(1, 'rgba(192,57,43,0.00)');
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // line
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = getAccent();
    ctx.lineWidth = 2.5;
    ctx.lineJoin  = 'round';
    ctx.stroke();

    // dots + x labels
    pts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = getAccent();
      ctx.fill();
      ctx.strokeStyle = getSurfaceColor();
      ctx.lineWidth = 2;
      ctx.stroke();

      // x label
      ctx.fillStyle = getTextColor();
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], p.x, h - 6);
    });
  }

  draw();
  window.addEventListener('resize', draw);
  // Redraw on theme change
  const obs = new MutationObserver(draw);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

// ── 3b. BAR CHART ──
function initBarChart() {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;

  const isAdmin = canvas.dataset.admin === 'true';
  const labels  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const data    = isAdmin
    ? [120, 145, 132, 168, 155, 189, 178, 202, 195, 212, 230, 248]
    : [18, 24, 21, 29, 26, 33, 31, 38, 36, 41, 39, 44];

  function draw() {
    const ctx = canvas.getContext('2d');
    const { w, h } = resizeCanvas(canvas);
    ctx.clearRect(0, 0, w, h);

    const pad  = { top: 20, right: 16, bottom: 36, left: 40 };
    const cw   = w - pad.left - pad.right;
    const ch   = h - pad.top  - pad.bottom;
    const maxV = Math.max(...data) * 1.2;
    const barW = (cw / data.length) * 0.6;
    const barG = (cw / data.length) * 0.4;

    // grid
    [0.25, 0.5, 0.75, 1].forEach(r => {
      const y = pad.top + ch - ch * r;
      ctx.strokeStyle = getGridColor();
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
      ctx.fillStyle = getTextColor();
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(maxV * r), pad.left - 4, y + 3);
    });

    // bars
    data.forEach((d, i) => {
      const x  = pad.left + i * (barW + barG) + barG / 2;
      const bh = (d / maxV) * ch;
      const y  = pad.top + ch - bh;

      // bar with rounded top
      ctx.beginPath();
      ctx.roundRect(x, y, barW, bh, [3, 3, 0, 0]);
      ctx.fillStyle = getAccent();
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;

      // x label
      ctx.fillStyle = getTextColor();
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], x + barW / 2, h - 6);
    });
  }

  // polyfill roundRect if needed
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
      const rr = typeof r === 'number' ? [r,r,r,r] : r;
      this.moveTo(x + rr[0], y);
      this.lineTo(x + w - rr[1], y);
      this.arcTo(x + w, y, x + w, y + rr[1], rr[1]);
      this.lineTo(x + w, y + h - rr[2]);
      this.arcTo(x + w, y + h, x + w - rr[2], y + h, rr[2]);
      this.lineTo(x + rr[3], y + h);
      this.arcTo(x, y + h, x, y + h - rr[3], rr[3]);
      this.lineTo(x, y + rr[0]);
      this.arcTo(x, y, x + rr[0], y, rr[0]);
      this.closePath();
    };
  }

  draw();
  window.addEventListener('resize', draw);
  const obs = new MutationObserver(draw);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

// ── 3c. DONUT CHART ──
function initDonutChart() {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;

  const isAdmin = canvas.dataset.admin === 'true';
  const slices = isAdmin
    ? [
        { label: 'Retail',        value: 38, color: '#C0392B' },
        { label: 'Manufacturing', value: 27, color: '#7F8C8D' },
        { label: 'Pharma',        value: 20, color: '#4A5568' },
        { label: 'Tech',          value: 15, color: '#374151' },
      ]
    : [
        { label: 'Air Freight',  value: 35, color: '#C0392B' },
        { label: 'Sea Freight',  value: 45, color: '#4A5568' },
        { label: 'Land Freight', value: 20, color: '#7F8C8D' },
      ];

  let hoveredIdx = -1;
  const total = slices.reduce((a, b) => a + b.value, 0);

  function draw() {
    const ctx = canvas.getContext('2d');
    const { w, h } = resizeCanvas(canvas);
    ctx.clearRect(0, 0, w, h);

    const cx = w * 0.38;
    const cy = h / 2;
    const outerR = Math.min(cx, cy) - 10;
    const innerR = outerR * 0.58;

    let startAngle = -Math.PI / 2;
    slices.forEach((s, i) => {
      const angle = (s.value / total) * Math.PI * 2;
      const isHov = i === hoveredIdx;
      const offset = isHov ? 8 : 0;
      const midA   = startAngle + angle / 2;
      const ox     = Math.cos(midA) * offset;
      const oy     = Math.sin(midA) * offset;

      ctx.beginPath();
      ctx.moveTo(cx + ox, cy + oy);
      ctx.arc(cx + ox, cy + oy, outerR, startAngle, startAngle + angle);
      ctx.arc(cx + ox, cy + oy, innerR, startAngle + angle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.globalAlpha = isHov ? 1 : 0.88;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = getSurfaceColor();
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle += angle;
    });

    // center label
    ctx.fillStyle = getDarkMode() ? '#F0F0F0' : '#0D1B2A';
    ctx.font = `bold 20px Syne, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(total + (isAdmin ? '' : '%'), cx, cy + 7);
    ctx.fillStyle = getTextColor();
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText(isAdmin ? 'Clients' : 'Shipments', cx, cy + 22);

    // legend
    const lx = w * 0.68;
    const startY = cy - (slices.length * 22) / 2;
    slices.forEach((s, i) => {
      const ly = startY + i * 26;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.roundRect(lx, ly, 12, 12, 2);
      ctx.fill();
      ctx.fillStyle = getDarkMode() ? '#A3A3A3' : '#374151';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${s.label}  ${s.value}${isAdmin ? '' : '%'}`, lx + 18, ly + 10);
    });
  }

  draw();
  canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top)  * (canvas.height / rect.height);
    const cx = canvas.width * 0.38;
    const cy = canvas.height / 2;
    const outerR = Math.min(cx, cy) - 10;
    const dx = mx - cx; const dy = my - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < outerR) {
      let angle = Math.atan2(dy, dx) + Math.PI / 2;
      if (angle < 0) angle += Math.PI * 2;
      let start = 0, hit = -1;
      slices.forEach((s, i) => {
        const end = start + (s.value / total) * Math.PI * 2;
        if (angle >= start && angle < end) hit = i;
        start = end;
      });
      if (hit !== hoveredIdx) { hoveredIdx = hit; draw(); }
    } else if (hoveredIdx !== -1) { hoveredIdx = -1; draw(); }
  });
  canvas.addEventListener('mouseleave', () => { hoveredIdx = -1; draw(); });

  window.addEventListener('resize', draw);
  const obs = new MutationObserver(draw);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

// ── 3d. AREA CHART ──
function initAreaChart() {
  const canvas = document.getElementById('areaChart');
  if (!canvas) return;

  const isAdmin = canvas.dataset.admin === 'true';
  const labels  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  let cumA, cumB, limitLine;
  if (isAdmin) {
    // cumulative shipments coordinated vs. target
    cumA = [120, 265, 397, 565, 720, 909, 1087, 1289, 1484, 1696, 1926, 2174];
    cumB = [150, 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500, 1650, 1800];
    limitLine = true;
  } else {
    // cumulative spend vs. budget
    cumA = [2100, 4900, 7300, 10500, 13400, 17000, 20400, 24500, 28400, 32800, 37000, 41800];
    cumB = [4000, 8000, 12000, 16000, 20000, 24000, 28000, 32000, 36000, 40000, 44000, 48000];
    limitLine = true;
  }

  function draw() {
    const ctx = canvas.getContext('2d');
    const { w, h } = resizeCanvas(canvas);
    ctx.clearRect(0, 0, w, h);

    const pad  = { top: 16, right: 20, bottom: 36, left: 52 };
    const cw   = w - pad.left - pad.right;
    const ch   = h - pad.top  - pad.bottom;
    const maxV = Math.max(...cumB) * 1.1;
    const xStep = cw / (labels.length - 1);

    const toX = i => pad.left + i * xStep;
    const toY = v => pad.top + ch - (v / maxV) * ch;

    // grid
    [0.25, 0.5, 0.75, 1].forEach(r => {
      const y = pad.top + ch - ch * r;
      ctx.strokeStyle = getGridColor();
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
      ctx.fillStyle = getTextColor();
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      const val = maxV * r;
      ctx.fillText(val >= 1000 ? (val/1000).toFixed(0) + 'K' : val.toFixed(0), pad.left - 4, y + 3);
    });

    // budget line (dotted)
    if (limitLine) {
      ctx.beginPath();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = getDarkMode() ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1.5;
      cumB.forEach((v, i) => i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v)));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // spend fill
    const ptsA = cumA.map((v, i) => ({ x: toX(i), y: toY(v) }));
    ctx.beginPath();
    ctx.moveTo(ptsA[0].x, pad.top + ch);
    ptsA.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(ptsA[ptsA.length-1].x, pad.top + ch);
    ctx.closePath();
    const areaGrad = ctx.createLinearGradient(0, pad.top, 0, pad.top + ch);
    areaGrad.addColorStop(0, 'rgba(192,57,43,0.25)');
    areaGrad.addColorStop(1, 'rgba(192,57,43,0.00)');
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // spend line
    ctx.beginPath();
    ptsA.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = getAccent();
    ctx.lineWidth = 2.5;
    ctx.lineJoin  = 'round';
    ctx.stroke();

    // dots + x labels
    ptsA.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = getAccent();
      ctx.fill();
      ctx.strokeStyle = getSurfaceColor();
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = getTextColor();
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], p.x, h - 6);
    });
  }

  draw();
  window.addEventListener('resize', draw);
  const obs = new MutationObserver(draw);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

/* ─────────────────────────────────────────
   4. BOOK SHIPMENT — User Dashboard
   ───────────────────────────────────────── */
(function initBookShipment() {
  const form = document.getElementById('dbBookForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const ref = 'SHP-' + Date.now().toString().slice(-6);
    const msg = document.getElementById('dbBookConfirm');
    const refEl = document.getElementById('dbBookRef');
    if (msg)   msg.style.display = 'block';
    if (refEl) refEl.textContent = ref;
  });
})();

/* ─────────────────────────────────────────
   5. INVOICE DOWNLOAD DEMO
   ───────────────────────────────────────── */
(function initInvoices() {
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-invoice-dl]');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = 'Preparing…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Downloaded';
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2000);
    }, 900);
  });
})();

/* ─────────────────────────────────────────
   6. POD DOWNLOAD DEMO
   ───────────────────────────────────────── */
(function initPOD() {
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-pod-dl]');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = 'Downloading…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Downloaded';
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2000);
    }, 800);
  });
})();

/* ─────────────────────────────────────────
   7. CUSTOMS DOCUMENT CHECKLISTS
   ───────────────────────────────────────── */
(function initChecklists() {
  document.addEventListener('change', function(e) {
    const cb = e.target.closest('.doc-checkbox');
    if (!cb) return;

    const ring = cb.closest('.doc-shipment-card')?.querySelector('.progress-ring-circle');
    if (!ring) return;

    const allCbs = cb.closest('.doc-shipment-card').querySelectorAll('.doc-checkbox input');
    const checked = [...allCbs].filter(c => c.checked).length;
    const pct = Math.round((checked / allCbs.length) * 100);

    const r = 20;
    const circ = 2 * Math.PI * r;
    ring.setAttribute('stroke-dashoffset', circ - (circ * pct / 100));
    const label = cb.closest('.doc-shipment-card').querySelector('.progress-ring-label');
    if (label) label.textContent = pct + '%';
  });
})();

/* ─────────────────────────────────────────
   8. MESSAGES — compose + demo threads
   ───────────────────────────────────────── */
(function initMessages() {
  const threads = document.querySelectorAll('[data-thread]');
  const pane = document.getElementById('messagePane');
  if (!threads.length || !pane) return;

  threads.forEach(t => {
    t.addEventListener('click', function() {
      threads.forEach(tt => tt.classList.remove('active'));
      t.classList.add('active');
      const content = t.dataset.content || 'No messages.';
      const sender  = t.dataset.sender || 'Unknown';
      pane.innerHTML = `
        <div style="padding:20px; border-bottom:1px solid var(--border-subtle); font-weight:600;">${sender}</div>
        <div style="padding:20px; flex:1; overflow-y:auto; font-size:.9rem; color:var(--txt-secondary); line-height:1.7;">${content}</div>
      `;
    });
  });

  const composeForm = document.getElementById('composeForm');
  if (composeForm) {
    composeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const inp = composeForm.querySelector('textarea');
      if (!inp || !inp.value.trim()) return;
      const msg = document.createElement('div');
      msg.style.cssText = 'padding:12px 20px; background:rgba(192,57,43,.06); border-radius:8px; margin:8px 20px; font-size:.88rem;';
      msg.textContent = inp.value;
      pane.appendChild(msg);
      inp.value = '';
      pane.scrollTop = pane.scrollHeight;
    });
  }
})();

/* ─────────────────────────────────────────
   9. ADMIN — CLIENTS SEARCH + FILTER
   ───────────────────────────────────────── */
(function initClientsView() {
  const search = document.getElementById('clientSearch');
  const filter = document.getElementById('clientFilter');
  if (!search && !filter) return;

  function applyFilter() {
    const q   = search ? search.value.toLowerCase() : '';
    const st  = filter ? filter.value : '';
    document.querySelectorAll('[data-client-row]').forEach(row => {
      const name = (row.dataset.name || '').toLowerCase();
      const status = row.dataset.status || '';
      const show = (!q || name.includes(q)) && (!st || status === st);
      row.style.display = show ? '' : 'none';
    });
  }

  if (search) search.addEventListener('input', applyFilter);
  if (filter) filter.addEventListener('change', applyFilter);
})();

/* ─────────────────────────────────────────
   10. ADMIN — QUOTES DEMO ACTIONS
   ───────────────────────────────────────── */
(function initQuotes() {
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-quote-action]');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = 'Sent';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2500);
  });
})();

/* ─────────────────────────────────────────
   11. ADMIN — REPORTS PERIOD SELECTOR
   ───────────────────────────────────────── */
(function initReports() {
  const sel = document.getElementById('reportPeriod');
  if (!sel) return;

  const baseValues = {
    'monthly': ['$82,400', '142', '94.2%', '3.1 days'],
    'quarterly': ['$241,000', '438', '93.8%', '3.4 days'],
    'yearly': ['$968,000', '1,746', '94.1%', '3.2 days'],
  };

  sel.addEventListener('change', function() {
    const vals = baseValues[sel.value] || baseValues['monthly'];
    const cells = document.querySelectorAll('[data-report-val]');
    cells.forEach((c, i) => { if (vals[i] !== undefined) c.textContent = vals[i]; });
  });
})();

/* ─────────────────────────────────────────
   12. SETTINGS — logout
   ───────────────────────────────────────── */
(function initLogout() {
  document.addEventListener('click', function(e) {
    if (e.target.closest('[data-logout]')) {
      window.location.href = 'login.html';
    }
  });
})();

/* ─────────────────────────────────────────
   13. ADMIN KANBAN — drag-and-drop (demo)
   ───────────────────────────────────────── */
(function initKanban() {
  const cards = document.querySelectorAll('.kanban-card');
  const cols  = document.querySelectorAll('.kanban-cards');
  if (!cards.length) return;

  cards.forEach(card => {
    card.setAttribute('draggable', 'true');
    card.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', card.outerHTML);
      card.style.opacity = '.4';
    });
    card.addEventListener('dragend', function() {
      card.style.opacity = '1';
    });
  });

  cols.forEach(col => {
    col.addEventListener('dragover', function(e) {
      e.preventDefault();
      col.style.outline = '2px dashed var(--clr-accent)';
    });
    col.addEventListener('dragleave', function() {
      col.style.outline = '';
    });
    col.addEventListener('drop', function(e) {
      e.preventDefault();
      col.style.outline = '';
      const html = e.dataTransfer.getData('text/plain');
      const temp = document.createElement('div');
      temp.innerHTML = html;
      const newCard = temp.firstElementChild;
      if (newCard) {
        newCard.setAttribute('draggable', 'true');
        col.appendChild(newCard);
        // rebind drag events
        newCard.addEventListener('dragstart', function(ev) {
          ev.dataTransfer.setData('text/plain', newCard.outerHTML);
          newCard.style.opacity = '.4';
        });
        newCard.addEventListener('dragend', function() {
          newCard.style.opacity = '1';
        });
        // update column counts
        document.querySelectorAll('.kanban-col').forEach(kc => {
          const count = kc.querySelector('.kanban-count');
          const cards = kc.querySelectorAll('.kanban-card');
          if (count) count.textContent = cards.length;
        });
      }
    });
  });
})();

/* ─────────────────────────────────────────
   14. INIT ON DOM READY
   ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  // Charts are initialized by view switcher after skeleton
  // but call directly if overview is already shown
  const overviewView = document.getElementById('view-overview');
  if (overviewView && overviewView.classList.contains('active')) {
    setTimeout(initCharts, 100);
  }
});
