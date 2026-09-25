import os
import re
from collections import Counter

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
img_regex = re.compile(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>')

all_srcs = []
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        all_srcs.extend(img_regex.findall(content))

counter = Counter(all_srcs)
for src, count in counter.most_common():
    print(f'{count}x {src}')
