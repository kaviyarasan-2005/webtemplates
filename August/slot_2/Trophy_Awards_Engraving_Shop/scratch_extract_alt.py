import os
import re

missing_images = [
    "images/serve-schools.jpg", "images/serve-corporate.jpg", "images/serve-sports.jpg", "images/serve-events.jpg",
    "images/bulk-benefits-img.jpg", "images/case-study-school.jpg", "images/case-study-corp.jpg", "images/case-study-sports.jpg", "images/case-study-hospital.jpg",
    "images/engrave-crystal-icon.jpg", "images/engrave-metal-icon.jpg", "images/engrave-wood-icon.jpg", "images/engrave-acrylic-icon.jpg",
    "images/engrave-leather-icon.jpg", "images/engrave-slate-icon.jpg", "images/engrave-paper-icon.jpg", "images/engrave-fabric-icon.jpg",
    "images/style-laser.jpg", "images/style-rotary.jpg", "images/style-uv.jpg", "images/style-diamond.jpg",
    "images/gallery-awards-2.jpg", "images/gallery-awards-3.jpg", "images/gallery-awards-4.jpg", "images/team-2.jpg", "images/team-3.jpg",
    "images/featured-prestige-trophy.jpg", "images/featured-century-plaque.jpg", "images/featured-grand-medal.jpg"
]

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = re.finditer(r'<img[^>]+>', content)
    for match in matches:
        tag = match.group(0)
        src_match = re.search(r'src=["\']([^"\']+)["\']', tag)
        if src_match:
            src = src_match.group(1)
            if src in missing_images:
                alt_match = re.search(r'alt=["\']([^"\']*)["\']', tag)
                alt_text = alt_match.group(1) if alt_match else "No alt text provided in HTML"
                print(f"- **{src}**\n  - Context/Prompt: {alt_text}")
