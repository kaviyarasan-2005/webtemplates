import os, re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
css_files = [os.path.join('css', f) for f in os.listdir('css') if f.endswith('.css')]

used_images = set()

img_regex = re.compile(r'[\'\""](images/[^\'\""]+)[\'\""]')
css_regex = re.compile(r'url\([\'\"]?([^\'\")]+)[\'\"]?\)')

for file in html_files:
    content = open(file, 'r', encoding='utf-8').read()
    for src in img_regex.findall(content):
        used_images.add(os.path.basename(src))
    for src in css_regex.findall(content):
        used_images.add(os.path.basename(src))

for file in css_files:
    content = open(file, 'r', encoding='utf-8').read()
    for src in css_regex.findall(content):
        used_images.add(os.path.basename(src))

all_images = set(os.listdir('images'))
unused = all_images - used_images

print("Unused images:")
for img in unused:
    print(img)
