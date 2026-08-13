import glob
import re
from collections import defaultdict

def find_images():
    html_files = glob.glob('d:/Projects/Z_PartTime/partime_revox/july/slot_2/PharmacyMedicalSupplies/**/*.html', recursive=True)
    css_files = glob.glob('d:/Projects/Z_PartTime/partime_revox/july/slot_2/PharmacyMedicalSupplies/**/*.css', recursive=True)
    
    image_counts = defaultdict(list)
    
    # Regex for src="..." or url(...)
    # This captures the URL inside quotes or parentheses
    img_pattern = re.compile(r'(?:src|url)\s*[=(]\s*[\'"]?(.*?(?:jpg|jpeg|png|svg|webp|unsplash\.com.*?\w))[\'")]?', re.IGNORECASE)

    for file in html_files + css_files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        urls = img_pattern.findall(content)
        for url in urls:
            # clean up url
            url = url.strip()
            # ignore placeholders like "YOUR_FORM_ID" or non-images if regex caught them accidentally
            if 'http' in url or any(ext in url.lower() for ext in ['.png', '.jpg', '.jpeg', '.svg', '.webp']):
                image_counts[url].append(file)
                
    print("--- Duplicated Images ---")
    for url, files in image_counts.items():
        if len(files) > 1:
            print(f"\nImage: {url}")
            print(f"Used {len(files)} times in:")
            for f in set(files):
                count = files.count(f)
                print(f"  - {f} (x{count})")

if __name__ == "__main__":
    find_images()
