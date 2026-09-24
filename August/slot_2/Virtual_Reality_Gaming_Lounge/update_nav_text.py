import os
import re

files_to_update = ['home1.html', 'home2.html', 'games.html', 'pricing.html', 'groups.html']

for fname in files_to_update:
    if not os.path.exists(fname):
        continue
        
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace Home dropdown text
    content = content.replace('>Home 1 (Immersive)</a>', '>Home 1</a>')
    content = content.replace('>Home 2 (Dynamic)</a>', '>Home 2</a>')
    
    # Replace Dashboards dropdown text (desktop nav)
    content = content.replace('>Player Dashboard</a>', '>User</a>')
    content = content.replace('>Admin Dashboard</a>', '>Admin</a>')
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated {fname}")
