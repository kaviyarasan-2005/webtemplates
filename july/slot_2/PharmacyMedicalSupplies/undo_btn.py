import os
import glob
import re

html_files = glob.glob("*.html") + glob.glob("pages/*.html")

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We are looking for:
    # 1. The two toggle buttons
    # 2. nav-cta-mobile -> </nav> -> <div class="header-actions"> -> nav-cta
    # We will swap them back to 2 then 1.
    pattern = r'([ \t]*<button id="theme-toggle".*?</button>[ \t]*\n[ \t]*<button id="dir-toggle".*?</button>[ \t]*\n)(^[ \t]*<a href="[^"]*contact\.html"[^>]*nav-cta-mobile[^>]*>.*?</a>[ \t]*\n[ \t]*</nav>[ \t]*\n*[ \t]*<div class="header-actions">[ \t]*\n[ \t]*<a href="[^"]*contact\.html"[^>]*nav-cta"[^>]*>.*?</a>[ \t]*\n)'
    # wait, the class in group 2 might be `nav-cta` or `nav-cta"`... let's just use `nav-cta`
    # Let's make it more robust since it could have varying whitespace.
    
    # Actually, a simpler regex to undo:
    # group 1: theme-toggle and dir-toggle
    # group 2: anything starting with `<a href=` ... up to `<a href=...nav-cta...</a>\n`
    pattern2 = r'([ \t]*<button id="theme-toggle".*?</button>[ \t]*\n[ \t]*<button id="dir-toggle".*?</button>[ \t]*\n)(^[ \t]*<a href="[^"]*contact\.html"[^>]*nav-cta-mobile.*?</a>[ \t]*\n.*?<div class="header-actions">[ \t]*\n[ \t]*<a href="[^"]*contact\.html"[^>]*class="btn btn-primary nav-cta">.*?</a>[ \t]*\n)'
    
    new_content = re.sub(pattern2, r'\2\1', content, flags=re.DOTALL | re.MULTILINE)
    
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Reverted {file_path}")
    else:
        print(f"No changes to revert in {file_path}")
