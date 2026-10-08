import os, glob, re

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8', errors='ignore') as file:
        content = file.read()
    
    # Fix corrupted title
    content = re.sub(r'<title>ZILL[^A-Za-z0-9]+([A-Za-z0-9\s]+)</title>', r'<title>ZILL - \1</title>', content)
    
    # Correct navbar logo
    logo = '<a href="index.html" class="navbar__logo" aria-label="ZILL - Home">\n        <img src="assets/images/zill-logo.png" alt="ZILL Logo" class="navbar__logo-img">\n        <span>ZILL</span>\n      </a>'
    content = re.sub(r'<a href="index\.html" class="navbar__logo".*?</a>', logo, content, flags=re.DOTALL)
    
    # Correct footer logo
    footer = '<a href="index.html" class="footer__logo" aria-label="ZILL - Home">\n            <img src="assets/images/zill-logo.png" alt="ZILL Logo" class="footer__logo-img">\n            <span>ZILL</span>\n          </a>'
    content = re.sub(r'<a href="index\.html" class="footer__logo".*?</a>', footer, content, flags=re.DOTALL)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
