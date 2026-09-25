import os
import shutil

missing_images = [
    "serve-schools.jpg", "serve-corporate.jpg", "serve-sports.jpg", "serve-events.jpg",
    "bulk-benefits-img.jpg", "case-study-school.jpg", "case-study-corp.jpg", "case-study-sports.jpg", "case-study-hospital.jpg",
    "engrave-crystal-icon.jpg", "engrave-metal-icon.jpg", "engrave-wood-icon.jpg", "engrave-acrylic-icon.jpg",
    "engrave-leather-icon.jpg", "engrave-slate-icon.jpg", "engrave-paper-icon.jpg", "engrave-fabric-icon.jpg",
    "style-laser.jpg", "style-rotary.jpg", "style-uv.jpg", "style-diamond.jpg",
    "gallery-awards-2.jpg", "gallery-awards-3.jpg", "gallery-awards-4.jpg", "team-2.jpg", "team-3.jpg",
    "featured-prestige-trophy.jpg", "featured-century-plaque.jpg", "featured-grand-medal.jpg"
]

for i in range(1, 30):
    src_file = f"imageun{i}.jpg"
    dest_file = os.path.join("images", missing_images[i-1])
    if os.path.exists(src_file):
        shutil.move(src_file, dest_file)
        print(f"Moved {src_file} -> {dest_file}")
    else:
        print(f"File not found: {src_file}")
