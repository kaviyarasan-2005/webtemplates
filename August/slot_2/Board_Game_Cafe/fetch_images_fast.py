import urllib.request
import urllib.parse
import os
import concurrent.futures

target_dir = r"d:\Projects\Z_PartTime\partime_revox\August\slot_2\Board_Game_Cafe\assets\images"
os.makedirs(target_dir, exist_ok=True)

to_generate = {
    "special-2.jpg": "A gourmet artisan flatbread pizza topped with fresh vegetables cheese and herbs",
    "lib-new-2.jpg": "Ark Nova board game setup on a table with animal cards",
    "lib-new-3.jpg": "Cascadia board game setup with nature theme tiles",
    "staff-1.jpg": "A friendly portrait of a cafe manager in a board game cafe",
    "staff-2.jpg": "A friendly portrait of a board game guru explaining rules",
    "hero-home1.jpg": "Interior of a cozy modern board game cafe with shelves of games and people playing",
    "game-1.jpg": "Complex strategy board game on a table",
    "game-2.jpg": "Fun party card game being played",
    "game-3.jpg": "Cooperative board game with detailed miniatures",
    "about-cafe.jpg": "Diverse group of friends laughing and playing games at a cafe",
    "cat-strategy.jpg": "Euro style strategy board game components",
    "cat-party.jpg": "Fast paced party game cards scattered on table",
    "cat-coop.jpg": "Cooperative game board with player pawns",
    "cat-family.jpg": "Family friendly board game being played by family",
    "gallery-1.jpg": "Wide shot of a bustling board game cafe interior",
    "gallery-2.jpg": "Close up of colorful wooden board game meeples and dice",
    "gallery-3.jpg": "Coffee cup and a pastry next to a board game on a wooden table",
    "gallery-4.jpg": "Four friends smiling while holding playing cards in a cafe",
    "event-catan.jpg": "Catan board game setup on a rustic table",
    "event-private.jpg": "Group of people celebrating a birthday party at a board game cafe",
    "team-1.jpg": "Portrait of a friendly board game cafe manager",
    "team-2.jpg": "Portrait of an enthusiastic board game teacher at a cafe"
}

def download_image(item):
    filename, prompt = item
    dst = os.path.join(target_dir, filename)
    if os.path.exists(dst) and os.path.getsize(dst) > 0:
        print(f"Skipping {filename}, already exists")
        return
        
    print(f"Generating {filename}...")
    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=600&nologo=true"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as response:
            with open(dst, 'wb') as f:
                f.write(response.read())
        print(f"Successfully generated {filename}")
    except Exception as e:
        print(f"Failed to generate {filename}: {e}")

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    executor.map(download_image, to_generate.items())
