import os
import re
from collections import defaultdict

css_files = [f for f in os.listdir('css') if f.endswith('.css')]
html_files = [f for f in os.listdir('.') if f.endswith('.html')]

bg_regex = re.compile(r'url\([\'"]?([^\'"\)]+)[\'"]?\)')

images = defaultdict(list)

for file in css_files:
    content = open(os.path.join('css', file), 'r', encoding='utf-8').read()
    for src in bg_regex.findall(content):
        src_path = src.replace('../', '')
        images[src_path].append(os.path.join('css', file))

for file in html_files:
    content = open(file, 'r', encoding='utf-8').read()
    for src in bg_regex.findall(content):
        images[src].append(file)

for src, files in images.items():
    if len(files) > 1:
        print(f'DUPLICATE CSS BG: {src} used in {files}')
