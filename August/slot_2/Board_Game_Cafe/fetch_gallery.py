import urllib.request
import urllib.parse
import os

target_dir = r"d:\Projects\Z_PartTime\partime_revox\August\slot_2\Board_Game_Cafe\assets\images"
images = {
    "gallery-counter.jpg": "A modern cafe counter with an espresso machine and barista, board game cafe theme, high quality photography",
    "gallery-seating.jpg": "Cozy seating area in a board game cafe with comfortable couches and large wooden tables, warm lighting, interior design",
    "gallery-interior.jpg": "Wide angle interior shot of a modern board game cafe showing massive shelves full of colorful board games",
    "gallery-playing.jpg": "People sitting at a large wooden table in a cafe playing a board game, bright and inviting atmosphere, lifestyle photography"
}

for filename, prompt in images.items():
    print(f"Generating {filename}...")
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=800&height=600&nologo=true"
    dst = os.path.join(target_dir, filename)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as response:
            with open(dst, 'wb') as f:
                f.write(response.read())
        print(f"Success: {filename}")
    except Exception as e:
        print(f"Error for {filename}: {e}")
