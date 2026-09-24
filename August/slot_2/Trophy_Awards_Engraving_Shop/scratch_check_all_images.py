import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
img_regex = re.compile(r'<img[^>]+src=["\']([^"\']*)["\'][^>]*>')

print("Checking all images:")
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        matches = img_regex.findall(content)
        for src in matches:
            if not src:
                print(f"Empty src in {file}")
            elif src.startswith('http') or src.startswith('data:'):
                pass # External or inline
            else:
                if not os.path.exists(src):
                    print(f"MISSING: {src} in {file}")
