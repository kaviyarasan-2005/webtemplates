import os

dashboard_html = r"""<!DOCTYPE html>
<html lang="en" data-theme="dark" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus VR | Player Dashboard</title>
  <meta name="description" content="Manage your Nexus VR experience, track stats, and book sessions.">
  <link rel="stylesheet" href="src/css/main.css">
  <script src="https://unpkg.com/@phosphor-icons/web"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link rel="icon" type="image/svg+xml" href="src/assets/images/favicon.svg">
  <style>
    .dash-wrapper{display:flex;flex-direction:column;min-height:100vh;background:var(--clr-bg);}
    .dash-topbar{position:fixed;top:0;left:0;right:0;z-index:200;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;background:rgba(8,11,20,0.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.08);}
    [data-theme="light"] .dash-topbar{background:rgba(255,255,255,0.95);border-bottom:1px solid rgba(0,0,0,0.08);}
    .topbar-brand{display:flex;align-items:center;gap:0.625rem;text-decoration:none;flex-shrink:0;}
    .topbar-brand-icon{font-size:1.75rem;background:linear-gradient(135deg,var(--clr-primary),var(--clr-secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .topbar-brand-name{font-family:var(--font-primary);font-weight:800;font-size:1.2rem;color:var(--clr-text);letter-spacing:-0.01em;}
    .topbar-center{flex:1;display:flex;align-items:center;justify-content:center;gap:0.25rem;}
    .topbar-tab{padding:0.375rem 0.875rem;border-radius:99px;font-size:0.85rem;font-weight:500;color:var(--clr-text-muted);text-decoration:none;transition:all 150ms ease;}
    .topbar-tab:hover{color:var(--clr-text);background:var(--clr-surface-alt);}
    .topbar-tab.active{background:rgba(139,92,246,0.15);color:var(--clr-primary);}
    .topbar-actions{display:flex;align-items:center;gap:0.75rem;flex-shrink:0;}
    .t-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:var(--clr-text-muted);cursor:pointer;transition:all 150ms ease;font-size:1rem;}
    .t-btn:hover{background:var(--clr-primary);color:#fff;border-color:var(--clr-primary);}
    [data-theme="light"] .t-btn{border-color:rgba(0,0,0,0.1);background:rgba(0,0,0,0.04);color:var(--clr-text-muted);}
    .t-rtl{padding:0.25rem 0.75rem;border-radius:99px;border:1px solid rgba(255,255,255,0.12);background:transparent;color:var(--clr-text-muted);font-size:0.75rem;font-weight:700;cursor:pointer;transition:all 150ms ease;font-family:var(--font-primary);}
    .t-rtl:hover{background:var(--clr-primary);color:#fff;border-color:var(--clr-primary);}
    [data-theme="light"] .t-rtl{border-color:rgba(0,0,0,0.12);color:var(--clr-text-muted);}
    .t-avatar{width:34px;height:34px;border-radius:50%;border:2px solid var(--clr-primary);object-fit:cover;cursor:pointer;}
    .dash-body{margin-top:64px;padding:2rem;max-width:1400px;width:100%;margin-left:auto;margin-right:auto;}
    @media(max-width:768px){.dash-body{padding:1rem;}.topbar-center{display:none;}}
    .section-lbl{font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--clr-text-muted);margin-bottom:0.75rem;margin-top:2rem;}
    .user-hero{background:linear-gradient(135deg,rgba(139,92,246,0.18) 0%,rgba(34,211,238,0.06) 100%);border:1px solid rgba(139,92,246,0.2);border-radius:20px;padding:1.75rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;margin-bottom:0.25rem;}
    .hero-stat{text-align:center;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:0.875rem 1.5rem;min-width:100px;}
    [data-theme="light"] .hero-stat{background:rgba(0,0,0,0.03);border-color:rgba(0,0,0,0.07);}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;}
    @media(max-width:900px){.g2{grid-template-columns:1fr;}}
    .g-main{display:grid;grid-template-columns:2fr 1fr;gap:1.25rem;}
    @media(max-width:1024px){.g-main{grid-template-columns:1fr;}}
    .d-card{background:var(--clr-surface);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.5rem;transition:border-color 0.25s,box-shadow 0.25s;}
    .d-card:hover{border-color:rgba(139,92,246,0.3);box-shadow:0 4px 24px rgba(139,92,246,0.1);}
    [data-theme="light"] .d-card{border-color:rgba(0,0,0,0.07);}
    .d-card-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;}
    .d-card-ttl{font-family:var(--font-primary);font-size:0.95rem;font-weight:700;margin:0;display:flex;align-items:center;gap:0.5rem;}
    .chart-card{background:var(--clr-surface);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.5rem;transition:border-color 0.25s,box-shadow 0.25s;}
    .chart-card:hover{border-color:rgba(139,92,246,0.3);box-shadow:0 0 20px rgba(139,92,246,0.1);}
    [data-theme="light"] .chart-card{border-color:rgba(0,0,0,0.07);}
    .chart-ttl{font-family:var(--font-primary);font-size:0.9rem;font-weight:700;margin:0 0 1rem;display:flex;justify-content:space-between;align-items:center;}
    .act-item{display:flex;align-items:flex-start;gap:1rem;padding:0.75rem 0;border-bottom:1px solid rgba(255,255,255,0.05);}
    .act-item:last-child{border-bottom:none;}
    [data-theme="light"] .act-item{border-bottom-color:rgba(0,0,0,0.06);}
    .bk-row{display:flex;align-items:center;gap:1rem;padding:1rem;border-radius:12px;background:var(--clr-surface-alt);border-left:3px solid var(--clr-secondary);margin-bottom:0.625rem;}
    .bundle-opt{display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1rem;border-radius:10px;border:1.5px solid rgba(255,255,255,0.06);background:var(--clr-surface-alt);cursor:pointer;transition:all 150ms ease;margin-bottom:0.5rem;}
    .bundle-opt.sel{border-color:var(--clr-primary);background:rgba(139,92,246,0.08);}
    .bundle-opt:hover:not(.sel){border-color:rgba(255,255,255,0.15);}
    [data-theme="light"] .bundle-opt{border-color:rgba(0,0,0,0.07);}
    .fr-row{display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;}
    .ach-it{display:flex;flex-direction:column;align-items:center;gap:0.25rem;padding:0.875rem 0.5rem;border-radius:12px;background:var(--clr-surface-alt);text-align:center;transition:transform 0.2s;}
    .ach-it:hover{transform:translateY(-3px);}
    .ach-it.locked{opacity:0.35;}
    .pb-wrap{width:100%;height:6px;background:var(--clr-surface-alt);border-radius:99px;overflow:hidden;}
    .pb-fill{height:100%;border-radius:99px;}
    .inv-row{display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.05);font-size:0.875rem;}
    .inv-row:last-child{border-bottom:none;}
    [data-theme="light"] .inv-row{border-bottom-color:rgba(0,0,0,0.06);}
  </style>
</head>
<body>
<div class="dash-wrapper">

  <!-- TOP BAR -->
  <header class="dash-topbar">
    <a href="home1.html" class="topbar-brand">
      <i class="ph ph-hexagon topbar-brand-icon"></i>
      <span class="topbar-brand-name">Nexus VR</span>
    </a>
    <nav class="topbar-center">
      <a href="home1.html" class="topbar-tab">Home</a>
      <a href="games.html" class="topbar-tab">Games</a>
      <a href="pricing.html" class="topbar-tab">Pricing</a>
      <a href="dashboard.html" class="topbar-tab active">My Dashboard</a>
      <a href="admin.html" class="topbar-tab">Admin</a>
    </nav>
    <div class="topbar-actions">
      <button id="theme-toggle" class="t-btn" aria-label="Toggle theme"><i class="ph ph-moon"></i></button>
      <button id="rtl-toggle" class="t-rtl">RTL</button>
      <div class="avatar-online">
        <img src="src/assets/images/avatar-1.jpg" alt="VoidWalker" class="t-avatar">
      </div>
    </div>
  </header>

  <main class="dash-body">

    <!-- USER HERO -->
    <div class="user-hero animate-on-scroll">
      <div style="display:flex;align-items:center;gap:1.25rem;">
        <div class="avatar-online">
          <img src="src/assets/images/avatar-1.jpg" alt="Profile" style="width:72px;height:72px;border-radius:50%;border:2px solid var(--clr-primary);object-fit:cover;">
        </div>
        <div>
          <h2 style="margin:0;font-size:1.5rem;" class="text-gradient">Welcome back, VoidWalker</h2>
          <div style="display:flex;align-items:center;gap:0.5rem;margin-top:0.375rem;">
            <span class="badge" style="background:rgba(245,158,11,0.15);color:var(--clr-warning);"><i class="ph-fill ph-crown"></i> Gold Member</span>
            <span style="font-size:0.78rem;color:var(--clr-text-muted);">&#8226; Last session: Oct 12</span>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:1rem;flex-wrap:wrap;">
        <div class="hero-stat">
          <div style="font-size:0.68rem;font-weight:700;color:var(--clr-text-muted);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:0.25rem;">Time Balance</div>
          <div style="font-size:1.5rem;font-weight:800;font-family:var(--font-primary);color:var(--clr-primary);">4.5 hrs</div>
        </div>
        <div class="hero-stat">
          <div style="font-size:0.68rem;font-weight:700;color:var(--clr-text-muted);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:0.25rem;">Reward Pts</div>
          <div style="font-size:1.5rem;font-weight:800;font-family:var(--font-primary);color:var(--clr-secondary);">1,250</div>
        </div>
        <div class="hero-stat">
          <div style="font-size:0.68rem;font-weight:700;color:var(--clr-text-muted);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:0.25rem;">Sessions</div>
          <div style="font-size:1.5rem;font-weight:800;font-family:var(--font-primary);color:var(--clr-success);">38</div>
        </div>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="section-lbl">Analytics</div>
    <div class="g2" style="margin-bottom:1.25rem;">
      <div class="chart-card animate-on-scroll">
        <div class="chart-ttl"><span><i class="ph ph-chart-line" style="color:var(--clr-primary);margin-right:0.3rem;"></i>Play Time</span><span style="font-size:0.72rem;font-weight:400;color:var(--clr-text-muted);">Last 7 Days</span></div>
        <div style="height:210px;position:relative;"><canvas id="userPlayTimeChart"></canvas></div>
      </div>
      <div class="chart-card animate-on-scroll">
        <div class="chart-ttl"><span><i class="ph ph-chart-pie-slice" style="color:var(--clr-secondary);margin-right:0.3rem;"></i>Favorite Genres</span><span style="font-size:0.72rem;font-weight:400;color:var(--clr-text-muted);">All Time</span></div>
        <div style="height:210px;position:relative;display:flex;justify-content:center;"><canvas id="userGenresChart"></canvas></div>
      </div>
      <div class="chart-card animate-on-scroll">
        <div class="chart-ttl"><span><i class="ph ph-star" style="color:var(--clr-warning);margin-right:0.3rem;"></i>Reward Points</span><span style="font-size:0.72rem;font-weight:400;color:var(--clr-text-muted);">This Month</span></div>
        <div style="height:210px;position:relative;"><canvas id="userPointsChart"></canvas></div>
      </div>
      <div class="chart-card animate-on-scroll">
        <div class="chart-ttl"><span><i class="ph ph-checks" style="color:var(--clr-success);margin-right:0.3rem;"></i>Completion Rate</span><span style="font-size:0.72rem;font-weight:400;color:var(--clr-text-muted);">By Game</span></div>
        <div style="height:210px;position:relative;display:flex;justify-content:center;"><canvas id="userCompletionChart"></canvas></div>
      </div>
    </div>

    <!-- MAIN COLUMNS -->
    <div class="section-lbl">Overview</div>
    <div class="g-main">

      <!-- LEFT -->
      <div style="display:flex;flex-direction:column;gap:1.25rem;">

        <!-- Bookings -->
        <div class="d-card animate-on-scroll">
          <div class="d-card-hdr">
            <h3 class="d-card-ttl"><i class="ph ph-calendar-check" style="color:var(--clr-primary);"></i> Upcoming Bookings</h3>
            <button class="btn btn-secondary btn-sm">+ Book New Slot</button>
          </div>
          <div class="bk-row">
            <div style="min-width:48px;text-align:center;line-height:1.1;">
              <div style="font-size:1.5rem;font-weight:800;font-family:var(--font-primary);">24</div>
              <div style="font-size:0.62rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--clr-text-muted);">OCT</div>
            </div>
            <div style="flex:1;">
              <strong style="font-size:0.9rem;">Pod 04 &mdash; Immersive Suite</strong>
              <div style="font-size:0.78rem;color:var(--clr-text-muted);margin-top:0.15rem;"><i class="ph ph-clock"></i> 6:00 PM &ndash; 8:00 PM &nbsp;&middot;&nbsp; 2 hrs</div>
            </div>
            <button class="t-btn" style="background:rgba(239,68,68,0.1);color:var(--clr-error);border-color:rgba(239,68,68,0.2);" title="Cancel"><i class="ph ph-x"></i></button>
          </div>
          <p style="text-align:center;color:var(--clr-text-muted);font-size:0.83rem;margin:0.25rem 0 0;">No other upcoming bookings.</p>
        </div>

        <!-- Activity -->
        <div class="d-card animate-on-scroll">
          <div class="d-card-hdr">
            <h3 class="d-card-ttl"><i class="ph ph-clock-counter-clockwise" style="color:var(--clr-primary);"></i> Recent Activity</h3>
          </div>
          <div class="act-item">
            <img src="src/assets/images/game-action-1.jpg" style="width:50px;height:50px;border-radius:8px;object-fit:cover;flex-shrink:0;" alt="">
            <div style="flex:1;">
              <strong style="font-size:0.88rem;">Cyber Ninja VR</strong>
              <div style="font-size:0.78rem;color:var(--clr-text-muted);margin-top:0.1rem;">Played 1.5 hrs &middot; Earned <span style="color:var(--clr-warning);">&ldquo;Master Swordsman&rdquo;</span></div>
            </div>
            <span style="font-size:0.72rem;color:var(--clr-text-muted);white-space:nowrap;">Oct 12</span>
          </div>
          <div class="act-item">
            <div style="width:50px;height:50px;border-radius:8px;background:rgba(34,211,238,0.1);color:var(--clr-secondary);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="ph ph-shopping-cart" style="font-size:1.3rem;"></i></div>
            <div style="flex:1;">
              <strong style="font-size:0.88rem;">Purchased 5-Hour Bundle</strong>
              <div style="font-size:0.78rem;color:var(--clr-text-muted);margin-top:0.1rem;">Added 5 hours to wallet balance.</div>
            </div>
            <span style="font-size:0.72rem;color:var(--clr-text-muted);white-space:nowrap;">Oct 10</span>
          </div>
          <div class="act-item">
            <div style="width:50px;height:50px;border-radius:8px;background:rgba(139,92,246,0.1);color:var(--clr-primary);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="ph ph-trophy" style="font-size:1.3rem;"></i></div>
            <div style="flex:1;">
              <strong style="font-size:0.88rem;">Level Up &mdash; Prestige II</strong>
              <div style="font-size:0.78rem;color:var(--clr-text-muted);margin-top:0.1rem;">Loyalty tier upgraded automatically.</div>
            </div>
            <span style="font-size:0.72rem;color:var(--clr-text-muted);white-space:nowrap;">Sep 28</span>
          </div>
        </div>

        <!-- Achievements -->
        <div class="d-card animate-on-scroll">
          <div class="d-card-hdr">
            <h3 class="d-card-ttl"><i class="ph ph-medal" style="color:var(--clr-warning);"></i> Achievements &amp; Badges</h3>
            <span style="font-size:0.78rem;color:var(--clr-text-muted);">14 / 50 Unlocked</span>
          </div>
          <div style="margin-bottom:1.25rem;">
            <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:0.375rem;"><span style="color:var(--clr-text-muted);">Overall Progress</span><span style="color:var(--clr-warning);font-weight:700;">28%</span></div>
            <div class="pb-wrap"><div class="pb-fill" style="width:28%;background:linear-gradient(90deg,var(--clr-primary),var(--clr-warning));"></div></div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.625rem;">
            <div class="ach-it"><i class="ph-fill ph-sword text-error" style="font-size:1.75rem;"></i><span style="font-size:0.67rem;font-weight:700;">First Blood</span></div>
            <div class="ach-it"><i class="ph-fill ph-trophy text-warning" style="font-size:1.75rem;"></i><span style="font-size:0.67rem;font-weight:700;">Champion</span></div>
            <div class="ach-it"><i class="ph-fill ph-ghost text-secondary" style="font-size:1.75rem;"></i><span style="font-size:0.67rem;font-weight:700;">Survivor</span></div>
            <div class="ach-it locked"><i class="ph-fill ph-lock-key text-muted" style="font-size:1.75rem;"></i><span style="font-size:0.67rem;">Locked</span></div>
          </div>
        </div>
      </div>

      <!-- RIGHT -->
      <div style="display:flex;flex-direction:column;gap:1.25rem;">

        <!-- Top Up -->
        <div class="d-card animate-on-scroll" style="background:linear-gradient(150deg,rgba(139,92,246,0.12),var(--clr-surface));">
          <div class="d-card-hdr"><h3 class="d-card-ttl"><i class="ph ph-wallet" style="color:var(--clr-primary);"></i> Top Up Balance</h3></div>
          <p style="font-size:0.8rem;color:var(--clr-text-muted);margin:0 0 1rem;">You have 4.5 hrs. Grab a bundle before your next session.</p>
          <div class="bundle-opt sel"><div><strong style="font-size:0.875rem;">2 Hours</strong><div style="font-size:0.72rem;color:var(--clr-text-muted);">Standard Rate</div></div><strong style="color:var(--clr-primary);">$60</strong></div>
          <div class="bundle-opt"><div><strong style="font-size:0.875rem;">5 Hours</strong><div style="font-size:0.72rem;color:var(--clr-success);">Save $10</div></div><strong>$140</strong></div>
          <div class="bundle-opt"><div><strong style="font-size:0.875rem;">10 Hours</strong><div style="font-size:0.72rem;color:var(--clr-success);">Best Value &mdash; Save $30</div></div><strong>$270</strong></div>
          <button class="btn btn-primary" style="width:100%;margin-top:0.75rem;">Purchase Selected</button>
        </div>

        <!-- Recommended -->
        <div class="d-card animate-on-scroll">
          <div class="d-card-hdr"><h3 class="d-card-ttl"><i class="ph ph-game-controller" style="color:var(--clr-secondary);"></i> Recommended</h3><a href="games.html" style="font-size:0.78rem;color:var(--clr-primary);text-decoration:none;">View All</a></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.625rem;">
            <div style="position:relative;border-radius:10px;overflow:hidden;"><img src="src/assets/images/game-top.jpg" style="width:100%;height:88px;object-fit:cover;display:block;" alt="Alyx"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.8));padding:0.4rem 0.5rem;font-size:0.72rem;font-weight:600;">Alyx</div></div>
            <div style="position:relative;border-radius:10px;overflow:hidden;"><img src="src/assets/images/game-horror-1.jpg" style="width:100%;height:88px;object-fit:cover;display:block;" alt="Dark Asylum"><div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.8));padding:0.4rem 0.5rem;font-size:0.72rem;font-weight:600;">Dark Asylum</div></div>
          </div>
        </div>

        <!-- Friends -->
        <div class="d-card animate-on-scroll">
          <div class="d-card-hdr"><h3 class="d-card-ttl"><i class="ph ph-users" style="color:var(--clr-primary);"></i> Friends Online</h3><span class="badge" style="font-size:0.7rem;">3 Online</span></div>
          <div class="fr-row"><div class="avatar-online"><img src="src/assets/images/avatar-1.jpg" alt="Alex_VR" style="width:36px;height:36px;border-radius:50%;object-fit:cover;filter:hue-rotate(90deg);"></div><div style="flex:1;"><div style="font-size:0.85rem;font-weight:600;">Alex_VR</div><div style="font-size:0.72rem;color:var(--clr-text-muted);">Playing Cyber Ninja</div></div><button class="t-btn" style="font-size:0.8rem;" title="Invite"><i class="ph ph-plus"></i></button></div>
          <div class="fr-row"><div class="avatar-online"><img src="src/assets/images/avatar-1.jpg" alt="SarahConnor" style="width:36px;height:36px;border-radius:50%;object-fit:cover;filter:hue-rotate(180deg);"></div><div style="flex:1;"><div style="font-size:0.85rem;font-weight:600;">SarahConnor</div><div style="font-size:0.72rem;color:var(--clr-text-muted);">In Lobby</div></div><button class="t-btn" style="font-size:0.8rem;" title="Invite"><i class="ph ph-plus"></i></button></div>
          <div class="fr-row"><div class="avatar-online"><img src="src/assets/images/avatar-1.jpg" alt="NoobMaster" style="width:36px;height:36px;border-radius:50%;object-fit:cover;filter:hue-rotate(270deg);"></div><div style="flex:1;"><div style="font-size:0.85rem;font-weight:600;">NoobMaster</div><div style="font-size:0.72rem;color:var(--clr-text-muted);">Playing Alyx</div></div><button class="t-btn" style="font-size:0.8rem;" title="Invite"><i class="ph ph-plus"></i></button></div>
        </div>

        <!-- Invoices -->
        <div class="d-card animate-on-scroll" style="padding:0;overflow:hidden;">
          <div style="padding:1rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.06);"><h3 class="d-card-ttl" style="margin:0;"><i class="ph ph-receipt" style="color:var(--clr-text-muted);"></i> Recent Invoices</h3></div>
          <div class="inv-row"><span style="color:var(--clr-text-muted);">Oct 10</span><span>5h Bundle</span><strong style="color:var(--clr-primary);">$140</strong></div>
          <div class="inv-row"><span style="color:var(--clr-text-muted);">Sep 01</span><span>Gold Membership</span><strong style="color:var(--clr-primary);">$49</strong></div>
          <div class="inv-row"><span style="color:var(--clr-text-muted);">Aug 15</span><span>2h Session</span><strong style="color:var(--clr-primary);">$60</strong></div>
        </div>

      </div>
    </div>
  </main>
</div>
<script src="src/js/main.js"></script>
<script src="src/js/charts.js"></script>
</body>
</html>"""

admin_html = r"""<!DOCTYPE html>
<html lang="en" data-theme="dark" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nexus VR | Admin Dashboard</title>
  <meta name="description" content="Nexus VR Admin Dashboard - Manage pods, users, and view analytics.">
  <link rel="stylesheet" href="src/css/main.css">
  <script src="https://unpkg.com/@phosphor-icons/web"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <link rel="icon" type="image/svg+xml" href="src/assets/images/favicon.svg">
  <style>
    .dash-wrapper{display:flex;flex-direction:column;min-height:100vh;background:var(--clr-bg);}
    .dash-topbar{position:fixed;top:0;left:0;right:0;z-index:200;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;background:rgba(8,11,20,0.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.08);}
    [data-theme="light"] .dash-topbar{background:rgba(255,255,255,0.95);border-bottom:1px solid rgba(0,0,0,0.08);}
    .topbar-brand{display:flex;align-items:center;gap:0.625rem;text-decoration:none;flex-shrink:0;}
    .topbar-brand-icon{font-size:1.75rem;background:linear-gradient(135deg,var(--clr-primary),var(--clr-secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
    .topbar-brand-name{font-family:var(--font-primary);font-weight:800;font-size:1.2rem;color:var(--clr-text);letter-spacing:-0.01em;}
    .topbar-center{flex:1;display:flex;align-items:center;justify-content:center;gap:0.25rem;}
    .topbar-tab{padding:0.375rem 0.875rem;border-radius:99px;font-size:0.85rem;font-weight:500;color:var(--clr-text-muted);text-decoration:none;transition:all 150ms ease;}
    .topbar-tab:hover{color:var(--clr-text);background:var(--clr-surface-alt);}
    .topbar-tab.active{background:rgba(139,92,246,0.15);color:var(--clr-primary);}
    .topbar-actions{display:flex;align-items:center;gap:0.75rem;flex-shrink:0;}
    .t-btn{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:var(--clr-text-muted);cursor:pointer;transition:all 150ms ease;font-size:1rem;}
    .t-btn:hover{background:var(--clr-primary);color:#fff;border-color:var(--clr-primary);}
    [data-theme="light"] .t-btn{border-color:rgba(0,0,0,0.1);background:rgba(0,0,0,0.04);color:var(--clr-text-muted);}
    .t-rtl{padding:0.25rem 0.75rem;border-radius:99px;border:1px solid rgba(255,255,255,0.12);background:transparent;color:var(--clr-text-muted);font-size:0.75rem;font-weight:700;cursor:pointer;transition:all 150ms ease;font-family:var(--font-primary);}
    .t-rtl:hover{background:var(--clr-primary);color:#fff;border-color:var(--clr-primary);}
    [data-theme="light"] .t-rtl{border-color:rgba(0,0,0,0.12);color:var(--clr-text-muted);}
    .t-avatar{width:34px;height:34px;border-radius:50%;border:2px solid var(--clr-primary);object-fit:cover;cursor:pointer;}
    .dash-body{margin-top:64px;padding:2rem;max-width:1400px;width:100%;margin-left:auto;margin-right:auto;}
    @media(max-width:768px){.dash-body{padding:1rem;}.topbar-center{display:none;}}
    .section-lbl{font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--clr-text-muted);margin-bottom:0.75rem;margin-top:2rem;}
    .admin-hero{background:linear-gradient(135deg,rgba(139,92,246,0.15) 0%,rgba(34,211,238,0.05) 100%);border:1px solid rgba(139,92,246,0.2);border-radius:20px;padding:1.75rem 2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:0.25rem;}
    .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;}
    @media(max-width:1024px){.g4{grid-template-columns:1fr 1fr;}}
    @media(max-width:540px){.g4{grid-template-columns:1fr;}}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;}
    @media(max-width:900px){.g2{grid-template-columns:1fr;}}
    .g13{display:grid;grid-template-columns:1fr 3fr;gap:1.25rem;}
    @media(max-width:1024px){.g13{grid-template-columns:1fr;}}
    .g12{display:grid;grid-template-columns:1fr 2fr;gap:1.25rem;}
    @media(max-width:1024px){.g12{grid-template-columns:1fr;}}
    .stat-card{background:var(--clr-surface);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:1rem 1.25rem;display:flex;align-items:center;gap:0.875rem;transition:border-color 0.25s,transform 0.25s;}
    .stat-card:hover{border-color:rgba(139,92,246,0.3);transform:translateY(-2px);}
    [data-theme="light"] .stat-card{border-color:rgba(0,0,0,0.07);}
    .stat-icon{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.25rem;}
    .d-card{background:var(--clr-surface);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.5rem;transition:border-color 0.25s,box-shadow 0.25s;}
    .d-card:hover{border-color:rgba(139,92,246,0.3);box-shadow:0 4px 24px rgba(139,92,246,0.1);}
    [data-theme="light"] .d-card{border-color:rgba(0,0,0,0.07);}
    .d-card-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;}
    .d-card-ttl{font-family:var(--font-primary);font-size:0.95rem;font-weight:700;margin:0;display:flex;align-items:center;gap:0.5rem;}
    .chart-card{background:var(--clr-surface);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:1.5rem;transition:border-color 0.25s,box-shadow 0.25s;}
    .chart-card:hover{border-color:rgba(139,92,246,0.3);box-shadow:0 0 20px rgba(139,92,246,0.1);}
    [data-theme="light"] .chart-card{border-color:rgba(0,0,0,0.07);}
    .chart-ttl{font-family:var(--font-primary);font-size:0.9rem;font-weight:700;margin:0 0 1rem;display:flex;justify-content:space-between;align-items:center;}
    .pod-cell{padding:0.5rem 0.25rem;border-radius:8px;text-align:center;font-size:0.72rem;font-weight:700;}
    .pb-wrap{width:100%;height:6px;background:var(--clr-surface-alt);border-radius:99px;overflow:hidden;}
    .pb-fill{height:100%;border-radius:99px;}
    .fr-row{display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;}
    .tbl{width:100%;border-collapse:collapse;font-size:0.85rem;}
    .tbl th{padding:0.625rem 1rem;background:var(--clr-surface-alt);font-size:0.72rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:var(--clr-text-muted);text-align:left;}
    .tbl td{padding:0.75rem 1rem;border-bottom:1px solid rgba(255,255,255,0.05);}
    .tbl tr:last-child td{border-bottom:none;}
    [data-theme="light"] .tbl td{border-bottom-color:rgba(0,0,0,0.05);}
  </style>
</head>
<body>
<div class="dash-wrapper">

  <!-- TOP BAR -->
  <header class="dash-topbar">
    <a href="home1.html" class="topbar-brand">
      <i class="ph ph-hexagon topbar-brand-icon"></i>
      <span class="topbar-brand-name">Nexus VR</span>
    </a>
    <nav class="topbar-center">
      <a href="home1.html" class="topbar-tab">Home</a>
      <a href="games.html" class="topbar-tab">Games</a>
      <a href="pricing.html" class="topbar-tab">Pricing</a>
      <a href="dashboard.html" class="topbar-tab">My Dashboard</a>
      <a href="admin.html" class="topbar-tab active">Admin</a>
    </nav>
    <div class="topbar-actions">
      <button id="theme-toggle" class="t-btn" aria-label="Toggle theme"><i class="ph ph-moon"></i></button>
      <button id="rtl-toggle" class="t-rtl">RTL</button>
      <div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:var(--clr-primary);color:#fff;font-size:1rem;" title="Admin">
        <i class="ph ph-shield-star"></i>
      </div>
    </div>
  </header>

  <main class="dash-body">

    <!-- ADMIN HERO -->
    <div class="admin-hero animate-on-scroll">
      <div>
        <h2 style="margin:0;font-size:1.5rem;" class="text-gradient"><i class="ph ph-shield-check"></i> Admin Overview</h2>
        <p style="margin:0.375rem 0 0;font-size:0.83rem;color:var(--clr-text-muted);">Manage lounge operations and view real-time analytics.</p>
      </div>
      <div style="display:flex;gap:0.75rem;">
        <button class="btn btn-primary btn-sm"><i class="ph ph-plus"></i> New Booking</button>
        <button class="btn btn-secondary btn-sm"><i class="ph ph-download-simple"></i> Export</button>
      </div>
    </div>

    <!-- STAT CARDS -->
    <div class="section-lbl">Key Metrics</div>
    <div class="g4" style="margin-bottom:1.25rem;">
      <div class="stat-card" style="border-left:3px solid var(--clr-primary);">
        <div class="stat-icon" style="background:rgba(139,92,246,0.12);color:var(--clr-primary);"><i class="ph ph-users"></i></div>
        <div><div style="font-size:0.72rem;color:var(--clr-text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Total Users</div><div style="font-size:1.35rem;font-weight:800;font-family:var(--font-primary);" class="text-gradient">12,450</div></div>
      </div>
      <div class="stat-card" style="border-left:3px solid var(--clr-success);">
        <div class="stat-icon" style="background:rgba(16,185,129,0.12);color:var(--clr-success);"><i class="ph ph-currency-dollar"></i></div>
        <div><div style="font-size:0.72rem;color:var(--clr-text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Today's Revenue</div><div style="font-size:1.35rem;font-weight:800;font-family:var(--font-primary);color:var(--clr-success);">$3,240</div></div>
      </div>
      <div class="stat-card" style="border-left:3px solid var(--clr-secondary);">
        <div class="stat-icon" style="background:rgba(34,211,238,0.12);color:var(--clr-secondary);"><i class="ph ph-game-controller"></i></div>
        <div><div style="font-size:0.72rem;color:var(--clr-text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Active Pods</div><div style="font-size:1.35rem;font-weight:800;font-family:var(--font-primary);color:var(--clr-secondary);">18 / 24</div></div>
      </div>
      <div class="stat-card" style="border-left:3px solid var(--clr-warning);">
        <div class="stat-icon" style="background:rgba(245,158,11,0.12);color:var(--clr-warning);"><i class="ph ph-warning-circle"></i></div>
        <div><div style="font-size:0.72rem;color:var(--clr-text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Maintenance</div><div style="font-size:1.35rem;font-weight:800;font-family:var(--font-primary);color:var(--clr-warning);">2 Pods</div></div>
      </div>
    </div>

    <!-- CHARTS -->
    <div class="section-lbl">Analytics</div>
    <div class="g2" style="margin-bottom:1.25rem;">
      <div class="chart-card animate-on-scroll">
        <div class="chart-ttl"><span><i class="ph ph-chart-bar" style="color:var(--clr-primary);margin-right:0.3rem;"></i>Weekly Revenue</span><span style="font-size:0.72rem;font-weight:400;color:var(--clr-text-muted);">Last 7 Days</span></div>
        <div style="height:220px;position:relative;"><canvas id="adminRevenueChart"></canvas></div>
      </div>
      <div class="chart-card animate-on-scroll">
        <div class="chart-ttl"><span><i class="ph ph-chart-line-up" style="color:var(--clr-secondary);margin-right:0.3rem;"></i>Pod Utilization</span><span style="font-size:0.72rem;font-weight:400;color:var(--clr-text-muted);">By Hour</span></div>
        <div style="height:220px;position:relative;"><canvas id="adminPodChart"></canvas></div>
      </div>
    </div>
    <div class="g12" style="margin-bottom:1.25rem;">
      <div class="chart-card animate-on-scroll">
        <div class="chart-ttl"><span><i class="ph ph-chart-donut" style="color:var(--clr-warning);margin-right:0.3rem;"></i>Top Games</span><span style="font-size:0.72rem;font-weight:400;color:var(--clr-text-muted);">This Month</span></div>
        <div style="height:200px;position:relative;display:flex;justify-content:center;"><canvas id="adminGamesChart"></canvas></div>
      </div>
      <div class="chart-card animate-on-scroll">
        <div class="chart-ttl"><span><i class="ph ph-trend-up" style="color:var(--clr-success);margin-right:0.3rem;"></i>User Growth</span><span style="font-size:0.72rem;font-weight:400;color:var(--clr-text-muted);">Last 6 Months</span></div>
        <div style="height:200px;position:relative;"><canvas id="adminGrowthChart"></canvas></div>
      </div>
    </div>

    <!-- PODS + BOOKINGS TABLE -->
    <div class="section-lbl">Operations</div>
    <div class="g13" style="margin-bottom:1.25rem;">
      <!-- Pod Status -->
      <div class="d-card animate-on-scroll">
        <div class="d-card-hdr"><h3 class="d-card-ttl"><i class="ph ph-circles-four" style="color:var(--clr-secondary);"></i> Live Pod Status</h3></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
          <div class="pod-cell" style="background:rgba(16,185,129,0.15);color:var(--clr-success);">P01<div style="font-size:0.62rem;font-weight:400;">In Use</div></div>
          <div class="pod-cell" style="background:rgba(16,185,129,0.15);color:var(--clr-success);">P02<div style="font-size:0.62rem;font-weight:400;">In Use</div></div>
          <div class="pod-cell" style="background:var(--clr-surface-alt);color:var(--clr-text-muted);">P03<div style="font-size:0.62rem;font-weight:400;">Available</div></div>
          <div class="pod-cell" style="background:rgba(245,158,11,0.15);color:var(--clr-warning);">P04<div style="font-size:0.62rem;font-weight:400;">Cleaning</div></div>
          <div class="pod-cell" style="background:rgba(239,68,68,0.15);color:var(--clr-error);">P05<div style="font-size:0.62rem;font-weight:400;">Offline</div></div>
          <div class="pod-cell" style="background:rgba(16,185,129,0.15);color:var(--clr-success);">P06<div style="font-size:0.62rem;font-weight:400;">In Use</div></div>
        </div>
        <button class="btn btn-secondary" style="width:100%;margin-top:1rem;">Manage All Pods</button>
      </div>
      <!-- Bookings Table -->
      <div class="d-card animate-on-scroll" style="padding:0;overflow:hidden;">
        <div style="padding:1rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;">
          <h3 class="d-card-ttl" style="margin:0;"><i class="ph ph-list-checks" style="color:var(--clr-primary);"></i> Recent Bookings</h3>
          <a href="#" style="font-size:0.78rem;color:var(--clr-primary);text-decoration:none;">View All</a>
        </div>
        <div style="overflow-x:auto;">
          <table class="tbl">
            <thead><tr><th>User</th><th>Pod</th><th>Time Slot</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              <tr><td>VoidWalker</td><td>P01</td><td>14:00 &ndash; 16:00</td><td><span class="badge" style="background:rgba(16,185,129,0.15);color:var(--clr-success);font-size:0.72rem;">Active</span></td><td><button class="t-btn" style="width:30px;height:30px;font-size:0.85rem;"><i class="ph ph-dots-three-vertical"></i></button></td></tr>
              <tr><td>NeonDemon</td><td>P02</td><td>14:30 &ndash; 15:30</td><td><span class="badge" style="background:rgba(16,185,129,0.15);color:var(--clr-success);font-size:0.72rem;">Active</span></td><td><button class="t-btn" style="width:30px;height:30px;font-size:0.85rem;"><i class="ph ph-dots-three-vertical"></i></button></td></tr>
              <tr><td>Alex J.</td><td>P03</td><td>16:00 &ndash; 18:00</td><td><span class="badge" style="background:rgba(34,211,238,0.15);color:var(--clr-secondary);font-size:0.72rem;">Upcoming</span></td><td><button class="t-btn" style="width:30px;height:30px;font-size:0.85rem;"><i class="ph ph-dots-three-vertical"></i></button></td></tr>
              <tr><td>SarahConnor</td><td>P06</td><td>15:00 &ndash; 17:00</td><td><span class="badge" style="background:rgba(16,185,129,0.15);color:var(--clr-success);font-size:0.72rem;">Active</span></td><td><button class="t-btn" style="width:30px;height:30px;font-size:0.85rem;"><i class="ph ph-dots-three-vertical"></i></button></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SYSTEM + STAFF -->
    <div class="section-lbl">System &amp; Team</div>
    <div class="g2">
      <!-- System Health -->
      <div class="d-card animate-on-scroll">
        <div class="d-card-hdr">
          <h3 class="d-card-ttl"><i class="ph ph-cpu" style="color:var(--clr-secondary);"></i> System Health</h3>
          <span class="badge" style="background:rgba(16,185,129,0.15);color:var(--clr-success);font-size:0.72rem;">Optimal</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <div><div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.375rem;"><span>Main Server CPU</span><span style="color:var(--clr-secondary);font-weight:600;">42%</span></div><div class="pb-wrap"><div class="pb-fill" style="width:42%;background:var(--clr-secondary);"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.375rem;"><span>Network Latency</span><span style="color:var(--clr-success);font-weight:600;">14ms</span></div><div class="pb-wrap"><div class="pb-fill" style="width:14%;background:var(--clr-success);"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.375rem;"><span>Storage Array</span><span style="color:var(--clr-warning);font-weight:600;">78%</span></div><div class="pb-wrap"><div class="pb-fill" style="width:78%;background:var(--clr-warning);"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;font-size:0.78rem;margin-bottom:0.375rem;"><span>VR Headset Fleet</span><span style="color:var(--clr-success);font-weight:600;">Healthy</span></div><div class="pb-wrap"><div class="pb-fill" style="width:90%;background:linear-gradient(90deg,var(--clr-primary),var(--clr-secondary));"></div></div></div>
        </div>
      </div>
      <!-- Staff on Duty -->
      <div class="d-card animate-on-scroll">
        <div class="d-card-hdr">
          <h3 class="d-card-ttl"><i class="ph ph-identification-badge" style="color:var(--clr-primary);"></i> Staff on Duty</h3>
          <span class="badge" style="font-size:0.7rem;">2 Active</span>
        </div>
        <div class="fr-row">
          <div class="avatar-online"><img src="src/assets/images/avatar-1.jpg" alt="Elena M." style="width:40px;height:40px;border-radius:50%;object-fit:cover;filter:hue-rotate(120deg);"></div>
          <div style="flex:1;"><div style="font-size:0.875rem;font-weight:600;">Elena M.</div><div style="font-size:0.75rem;color:var(--clr-primary);">Shift Manager</div></div>
          <span class="badge" style="font-size:0.68rem;background:rgba(16,185,129,0.15);color:var(--clr-success);">On Duty</span>
        </div>
        <div class="fr-row">
          <div class="avatar-online"><img src="src/assets/images/avatar-1.jpg" alt="Marcus T." style="width:40px;height:40px;border-radius:50%;object-fit:cover;filter:hue-rotate(200deg);"></div>
          <div style="flex:1;"><div style="font-size:0.875rem;font-weight:600;">Marcus T.</div><div style="font-size:0.75rem;color:var(--clr-text-muted);">VR Technician</div></div>
          <span class="badge" style="font-size:0.68rem;background:rgba(16,185,129,0.15);color:var(--clr-success);">On Duty</span>
        </div>
        <div class="fr-row" style="opacity:0.5;">
          <div style="width:40px;height:40px;border-radius:50%;background:var(--clr-surface-alt);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="ph ph-user" style="font-size:1.2rem;color:var(--clr-text-muted);"></i></div>
          <div style="flex:1;"><div style="font-size:0.875rem;font-weight:600;color:var(--clr-text-muted);">Open Shift</div><div style="font-size:0.75rem;color:var(--clr-text-muted);">6:00 PM &ndash; 12:00 AM</div></div>
          <button class="btn btn-primary btn-sm">Assign</button>
        </div>
      </div>
    </div>

  </main>
</div>
<script src="src/js/main.js"></script>
<script src="src/js/charts.js"></script>
</body>
</html>"""

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(dashboard_html)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(admin_html)

print("Done:", os.path.getsize('dashboard.html'), "bytes dashboard,", os.path.getsize('admin.html'), "bytes admin")
