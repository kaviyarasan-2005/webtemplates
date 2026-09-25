import os
import re
import shutil

repeated_images = [
    "images/specialty-plaque.jpg",
    "images/specialty-medal.jpg",
    "images/specialty-corporate.jpg",
    "images/materials-acrylic.jpg",
    "images/category-plaques.jpg",
    "images/category-medals.jpg",
    "images/category-badges.jpg",
    "images/feat-crystal-trophy-notext.jpg",
    "images/feat-aluminum-plaque-notext.jpg",
    "images/feat-sports-medal-notext.jpg",
    "images/feat-brass-badge-notext.jpg"
]

new_images = [f"trophy_engraving_{str(i).zfill(2)}.png" for i in range(1, 12)]

# Move images to 'images' folder
for img in new_images:
    if os.path.exists(img):
        dest = os.path.join("images", img)
        # overwrite if exists
        if os.path.exists(dest):
            os.remove(dest)
        shutil.move(img, dest)
        print(f"Moved {img} to images/")

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# Track occurrences
seen_count = {img: 0 for img in repeated_images}

def replacer(match):
    full_tag = match.group(0)
    src_match = re.search(r'src=["\']([^"\']+)["\']', full_tag)
    if src_match:
        src = src_match.group(1)
        if src in repeated_images:
            seen_count[src] += 1
            if seen_count[src] > 1: # Replace 2nd occurrence (and any subsequent)
                idx = repeated_images.index(src)
                new_src = "images/" + new_images[idx]
                return full_tag.replace(src, new_src)
    return full_tag

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(r'<img[^>]+>', replacer, content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")

print("Image mapping complete.")
