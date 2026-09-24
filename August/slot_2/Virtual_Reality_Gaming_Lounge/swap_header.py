
# Replaces the dash-topbar (fixed navbar style) in both dashboards
# with a proper inline dashboard page header

dashboard_old_topbar_css = """.dash-topbar{position:fixed;top:0;left:0;right:0;z-index:200;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;background:rgba(8,11,20,0.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.08);}
    [data-theme="light"] .dash-topbar{background:rgba(255,255,255,0.95);border-bottom:1px solid rgba(0,0,0,0.08);}"""

dashboard_new_header_css = """.dash-page-header{display:flex;align-items:center;justify-content:space-between;padding:2rem 2rem 1.5rem;max-width:1400px;width:100%;margin:0 auto;}
    @media(max-width:768px){.dash-page-header{padding:1.25rem 1rem 1rem;flex-wrap:wrap;gap:1rem;}}"""

admin_old_topbar_css = """.dash-topbar{position:fixed;top:0;left:0;right:0;z-index:200;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;background:rgba(8,11,20,0.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.08);}
    [data-theme="light"] .dash-topbar{background:rgba(255,255,255,0.95);border-bottom:1px solid rgba(0,0,0,0.08);}"""

admin_new_header_css = """.dash-page-header{display:flex;align-items:center;justify-content:space-between;padding:2rem 2rem 1.5rem;max-width:1400px;width:100%;margin:0 auto;}
    @media(max-width:768px){.dash-page-header{padding:1.25rem 1rem 1rem;flex-wrap:wrap;gap:1rem;}}"""

# New dashboard header HTML (replaces <header class="dash-topbar">...</header>)
new_dashboard_header = """  <!-- PAGE HEADER -->
  <div class="dash-page-header">
    <!-- Brand + Page Title -->
    <div style="display:flex;flex-direction:column;gap:0.25rem;">
      <a href="home1.html" class="topbar-brand" style="margin-bottom:0.1rem;">
        <i class="ph ph-hexagon topbar-brand-icon"></i>
        <span class="topbar-brand-name">Nexus VR</span>
      </a>
      <div style="display:flex;align-items:center;gap:0.5rem;">
        <span style="font-size:0.75rem;color:var(--clr-text-muted);">Player Dashboard</span>
        <span style="font-size:0.75rem;color:var(--clr-text-muted);">/</span>
        <span style="font-size:0.75rem;color:var(--clr-primary);font-weight:600;">Overview</span>
      </div>
    </div>
    <!-- Controls -->
    <div class="topbar-actions">
      <button id="theme-toggle" class="t-btn" aria-label="Toggle theme"><i class="ph ph-moon"></i></button>
      <button id="rtl-toggle" class="t-rtl">RTL</button>
      <div class="avatar-online">
        <img src="src/assets/images/avatar-1.jpg" alt="VoidWalker" class="t-avatar">
      </div>
    </div>
  </div>"""

new_admin_header = """  <!-- PAGE HEADER -->
  <div class="dash-page-header">
    <!-- Brand + Page Title -->
    <div style="display:flex;flex-direction:column;gap:0.25rem;">
      <a href="home1.html" class="topbar-brand" style="margin-bottom:0.1rem;">
        <i class="ph ph-hexagon topbar-brand-icon"></i>
        <span class="topbar-brand-name">Nexus VR</span>
      </a>
      <div style="display:flex;align-items:center;gap:0.5rem;">
        <span style="font-size:0.75rem;color:var(--clr-text-muted);">Admin Panel</span>
        <span style="font-size:0.75rem;color:var(--clr-text-muted);">/</span>
        <span style="font-size:0.75rem;color:var(--clr-primary);font-weight:600;">Overview</span>
      </div>
    </div>
    <!-- Controls -->
    <div class="topbar-actions">
      <button id="theme-toggle" class="t-btn" aria-label="Toggle theme"><i class="ph ph-moon"></i></button>
      <button id="rtl-toggle" class="t-rtl">RTL</button>
      <div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:var(--clr-primary);color:#fff;font-size:1rem;" title="Admin">
        <i class="ph ph-shield-star"></i>
      </div>
    </div>
  </div>"""

import re

# ── DASHBOARD ──
with open('dashboard.html', 'r', encoding='utf-8') as f:
    d = f.read()

# Replace CSS
d = d.replace(
    '.dash-topbar{position:fixed;top:0;left:0;right:0;z-index:200;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;background:rgba(8,11,20,0.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.08);}\n    [data-theme="light"] .dash-topbar{background:rgba(255,255,255,0.95);border-bottom:1px solid rgba(0,0,0,0.08);}',
    '.dash-page-header{display:flex;align-items:center;justify-content:space-between;padding:2rem 2rem 1.5rem;max-width:1400px;width:100%;margin:0 auto;}\n    @media(max-width:768px){.dash-page-header{padding:1.25rem 1rem 1rem;flex-wrap:wrap;gap:1rem;}}'
)

# Replace dash-body margin-top (no more fixed bar offset needed)
d = d.replace(
    '.dash-body{margin-top:64px;padding:2rem;max-width:1400px;width:100%;margin-left:auto;margin-right:auto;}',
    '.dash-body{padding:0 2rem 4rem;max-width:1400px;width:100%;margin-left:auto;margin-right:auto;}'
)
d = d.replace(
    '@media(max-width:768px){.dash-body{padding:1rem;}.topbar-center{display:none;}}',
    '@media(max-width:768px){.dash-body{padding:0 1rem 3rem;}}'
)

# Replace the <header class="dash-topbar">...</header> block with new header
d = re.sub(
    r'<header class="dash-topbar">.*?</header>',
    new_dashboard_header,
    d, flags=re.DOTALL
)

# Wrap content in a simple wrapper without fixed offset
d = d.replace('<main class="dash-body">', '<main class="dash-body">', 1)

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(d)

print('dashboard.html done')

# ── ADMIN ──
with open('admin.html', 'r', encoding='utf-8') as f:
    a = f.read()

# Replace CSS
a = a.replace(
    '.dash-topbar{position:fixed;top:0;left:0;right:0;z-index:200;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;background:rgba(8,11,20,0.9);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,0.08);}\n    [data-theme="light"] .dash-topbar{background:rgba(255,255,255,0.95);border-bottom:1px solid rgba(0,0,0,0.08);}',
    '.dash-page-header{display:flex;align-items:center;justify-content:space-between;padding:2rem 2rem 1.5rem;max-width:1400px;width:100%;margin:0 auto;}\n    @media(max-width:768px){.dash-page-header{padding:1.25rem 1rem 1rem;flex-wrap:wrap;gap:1rem;}}'
)

a = a.replace(
    '.dash-body{margin-top:64px;padding:2rem;max-width:1400px;width:100%;margin-left:auto;margin-right:auto;}',
    '.dash-body{padding:0 2rem 4rem;max-width:1400px;width:100%;margin-left:auto;margin-right:auto;}'
)
a = a.replace(
    '@media(max-width:768px){.dash-body{padding:1rem;}.topbar-center{display:none;}}',
    '@media(max-width:768px){.dash-body{padding:0 1rem 3rem;}}'
)

# Replace the <header class="dash-topbar">...</header> block
a = re.sub(
    r'<header class="dash-topbar">.*?</header>',
    new_admin_header,
    a, flags=re.DOTALL
)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(a)

print('admin.html done')
