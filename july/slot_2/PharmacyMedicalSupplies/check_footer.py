import glob
import re

html_files = glob.glob('d:/Projects/Z_PartTime/partime_revox/july/slot_2/PharmacyMedicalSupplies/**/*.html', recursive=True)

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # split by FOOTER
    parts = content.split('<!-- ===================== FOOTER ===================== -->')
    if len(parts) == 1:
        parts = content.split('<!-- FOOTER -->')
        
    if len(parts) > 1:
        # Get the last 500 characters before footer
        pre_footer = parts[0][-500:]
        # try to find the section comment before it
        comments = re.findall(r'<!--\s*(={0,20})?\s*([A-Z0-9 &]+?)\s*(={0,20})?\s*-->', parts[0])
        last_section = comments[-1][1].strip() if comments else "Unknown"
        print(f"\n--- {file} ---")
        print(f"Pre-footer section comment: {last_section}")
    else:
        print(f"\n--- {file} --- NO FOOTER FOUND")
