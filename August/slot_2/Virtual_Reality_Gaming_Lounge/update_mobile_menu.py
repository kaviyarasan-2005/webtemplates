import re

NEW_MOBILE_MENU = '''  <!-- Mobile Menu -->
  <div id="mobile-menu" class="mobile-menu flex-col gap-6">
    <!-- Home Group -->
    <div class="mob-group">
      <button class="mob-group-btn">
        Home <i class="ph ph-caret-down mob-caret"></i>
      </button>
      <div class="mob-group-links">
        <a href="home1.html" class="nav-link text-large">Home 1</a>
        <a href="home2.html" class="nav-link text-large">Home 2</a>
      </div>
    </div>
    <a href="games.html" class="nav-link text-large">Games Library</a>
    <a href="pricing.html" class="nav-link text-large">Pricing</a>
    <a href="groups.html" class="nav-link text-large">Parties &amp; Groups</a>
    <!-- Dashboards Group -->
    <div class="mob-group">
      <button class="mob-group-btn">
        Dashboards <i class="ph ph-caret-down mob-caret"></i>
      </button>
      <div class="mob-group-links">
        <a href="dashboard.html" class="nav-link text-large">User</a>
        <a href="admin.html" class="nav-link text-large">Admin</a>
      </div>
    </div>
    <hr style="border-color: rgba(255,255,255,0.1);">
    <a href="login.html" class="btn btn-primary justify-center">Login</a>
    <a href="dashboard.html" class="btn btn-secondary justify-center">Book Now</a>
  </div>'''

pages = ['home1.html', 'home2.html', 'games.html', 'pricing.html', 'groups.html']

for fname in pages:
    try:
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace mobile menu block
        new_content = re.sub(
            r'  <!-- Mobile Menu -->.*?</div>(?=\s*\n\s*<(?:main|section))',
            NEW_MOBILE_MENU,
            content,
            flags=re.DOTALL
        )
        
        if new_content != content:
            with open(fname, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated: {fname}')
        else:
            print(f'No match found: {fname}')
    except Exception as e:
        print(f'Error {fname}: {e}')
