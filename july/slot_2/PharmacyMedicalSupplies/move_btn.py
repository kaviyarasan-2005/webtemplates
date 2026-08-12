import os
import glob
import re

html_files = glob.glob("*.html") + glob.glob("pages/*.html")

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Regex to match the Order Now button and the two toggle buttons
    pattern = r'(^[ \t]*<a href="[^"]*contact\.html"[^>]*nav-cta[^>]*>.*?</a>[ \t]*\n)([ \t]*<button id="theme-toggle".*?</button>[ \t]*\n[ \t]*<button id="dir-toggle".*?</button>[ \t]*\n)'
    
    # The replacement puts group 2 before group 1
    new_content = re.sub(pattern, r'\2\1', content, flags=re.DOTALL | re.MULTILINE)
    
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {file_path}")
    else:
        print(f"No changes in {file_path}")
