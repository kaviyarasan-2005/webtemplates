import os
import glob

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the icon
    content = content.replace('<i class="fa-solid fa-plus"></i>', '<i class="fa-solid fa-heart-pulse"></i>')
    
    # Let's also check if there's any other fa-plus used for logo that might have different spacing
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    html_files = glob.glob('d:/Projects/Z_PartTime/partime_revox/july/slot_2/PharmacyMedicalSupplies/**/*.html', recursive=True)
    for f in html_files:
        replace_in_file(f)
    print("Replaced fa-plus with fa-heart-pulse in all HTML files.")
