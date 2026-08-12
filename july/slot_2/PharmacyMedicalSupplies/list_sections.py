import glob
import re

html_files = glob.glob('d:/Projects/Z_PartTime/partime_revox/july/slot_2/PharmacyMedicalSupplies/**/*.html', recursive=True)

for file in html_files:
    print(f"\n--- {file} ---")
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all comments that might indicate a section
    sections = re.findall(r'<!--\s*(={0,20})?\s*([A-Z0-9 &]+?)\s*(={0,20})?\s*-->', content)
    for s in sections:
        name = s[1].strip()
        if len(name) > 3 and name not in ['HEADER', 'FOOTER']:
            print(name)
