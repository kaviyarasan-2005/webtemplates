import urllib.request
import json
import os

queries = {
    'prod-crystal-star.jpg': 'crystal star trophy',
    'prod-pillar-trophy.jpg': 'marble pillar trophy',
    'prod-acrylic-color.jpg': 'acrylic award',
    'prod-rosewood-plaque.jpg': 'rosewood plaque',
    'prod-brass-plaque.jpg': 'brass plaque',
    'prod-acrylic-plaque.jpg': 'acrylic plaque',
    'prod-sports-medal.jpg': 'sports medal',
    'prod-academic-medal.jpg': 'academic medal',
    'prod-finisher-medal.jpg': 'finisher medal',
    'prod-brass-badge.jpg': 'brass name badge',
    'prod-plastic-badge.jpg': 'plastic name badge',
    'prod-anodized-badge.jpg': 'aluminum name badge'
}

def get_wikimedia_image(query):
    # Search for page
    search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}%20image&utf8=&format=json"
    req = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read())
        if not data['query']['search']: return None
        pageid = data['query']['search'][0]['pageid']
        
        # Get image from page
        image_url = f"https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&pageids={pageid}&pithumbsize=500&format=json"
        req = urllib.request.Request(image_url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        data = json.loads(response.read())
        pages = data['query']['pages']
        for p_id in pages:
            if 'thumbnail' in pages[p_id]:
                return pages[p_id]['thumbnail']['source']
    except Exception as e:
        print(e)
    return None

for filename, query in queries.items():
    print(f"Searching for {query}...")
    img_url = get_wikimedia_image(query)
    if img_url:
        print(f"Found image for {query}: {img_url}")
        # Download
        req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(os.path.join('images', 'wiki_' + filename), 'wb') as out_file:
            out_file.write(response.read())
    else:
        print(f"Could not find image for {query}")

