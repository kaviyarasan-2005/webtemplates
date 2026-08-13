import os
import glob
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace blue colors with green
    # rgb(37,99,235) is blue-600. Green-600 is rgb(22,163,74).
    content = content.replace('37,99,235', '22,163,74')
    
    # Replace blue hex
    content = re.sub(r'#93C5FD', '#86efac', content, flags=re.IGNORECASE)
    content = re.sub(r'#2563eb', '#16a34a', content, flags=re.IGNORECASE)
    content = re.sub(r'#1d4ed8', '#15803d', content, flags=re.IGNORECASE)
    
    # Replace purple/indigo (often used for category icons) with green shades
    content = re.sub(r'#EDE9FE', '#DCFCE7', content, flags=re.IGNORECASE)
    content = re.sub(r'#7C3AED', '#16A34A', content, flags=re.IGNORECASE)

    # Replace yellow/orange with green shades
    content = re.sub(r'#FEF3C7', '#F0FDF4', content, flags=re.IGNORECASE)
    content = re.sub(r'#D97706', '#15803D', content, flags=re.IGNORECASE)
    
    # Replace red/pink with green shades
    content = re.sub(r'#FEE2E2', '#DCFCE7', content, flags=re.IGNORECASE)
    content = re.sub(r'#DC2626', '#16A34A', content, flags=re.IGNORECASE)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    html_files = glob.glob('d:/Projects/Z_PartTime/partime_revox/july/slot_2/PharmacyMedicalSupplies/**/*.html', recursive=True)
    for f in html_files:
        process_file(f)
    print("Replaced all hardcoded non-green inline colors with green.")
