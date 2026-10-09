import os
import re
import glob

workspace_dir = r"d:\Projects\Z_PartTime\partime_revox\August\slot_2\Window_Tinting_Auto_Glass_Service"

pattern = re.compile(r'(<div class="navbar__controls">\s*)')
new_cta = r'\1<a href="contact.html" class="btn btn-primary btn-sm navbar__cta">Get a Quote</a>\n        '

for filepath in glob.glob(os.path.join(workspace_dir, "*.html")):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if CTA already exists
    if 'navbar__cta' not in content:
        new_content = pattern.sub(new_cta, content)
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Added CTA to {os.path.basename(filepath)}")
