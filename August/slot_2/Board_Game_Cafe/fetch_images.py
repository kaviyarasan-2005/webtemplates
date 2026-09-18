import urllib.request
import urllib.parse
import os
import shutil

# First, copy the existing ones
artifact_dir = r"C:\Users\Asus-2024\.gemini\antigravity-ide\brain\0941c078-e887-45d9-bbc4-280378c31d36"
target_dir = r"d:\Projects\Z_PartTime\partime_revox\August\slot_2\Board_Game_Cafe\assets\images"
os.makedirs(target_dir, exist_ok=True)

existing = {
    "menu_coffee_1789556305590.jpg": "menu-coffee.jpg",
    "menu_food_1789556320861.jpg": "menu-food.jpg",
    "hero_home2_1789556331912.jpg": "hero-home2.jpg",
    "event_mtg_1789556346089.jpg": "event-mtg.jpg",
    "contact_reserve_1789556361898.jpg": "contact-reserve.jpg",
    "special_1_1789556375775.jpg": "special-1.jpg",
}

for src_name, dst_name in existing.items():
    src = os.path.join(artifact_dir, src_name)
    dst = os.path.join(target_dir, dst_name)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied {src_name} to {dst_name}")

# Now generate the rest using pollinations.ai
to_generate = {
    "special-2.jpg": "A gourmet artisan flatbread pizza topped with fresh vegetables cheese and herbs",
    "special-3.jpg": "A visually stunning colorful Galaxy Cocktail drink in a glass with a vibrant purple and blue gradient",
    "lib-new-1.jpg": "Dune Imperium board game setup on a table",
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

for filename, prompt in to_generate.items():
    dst = os.path.join(target_dir, filename)
    if os.path.exists(dst):
        print(f"Skipping {filename}, already exists")
        continue
        
    print(f"Generating {filename}...")
    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=600&nologo=true"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open(dst, 'wb') as f:
                f.write(response.read())
        print(f"Successfully generated {filename}")
    except Exception as e:
        print(f"Failed to generate {filename}: {e}")
