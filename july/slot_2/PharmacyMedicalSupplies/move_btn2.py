import os
import glob
import re

html_files = glob.glob("*.html") + glob.glob("pages/*.html")

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Find start and end of header-actions
    start_str = '<div class="header-actions">'
    end_str = '</div>'
    
    start_idx = content.find(start_str)
    if start_idx == -1:
        continue
    
    # We want the first </div> after start_idx
    # Since header-actions might contain children that have </div>? 
    # Actually the buttons don't have </div> inside them. But let's just find the next </div>.
    end_idx = content.find(end_str, start_idx)
    
    if end_idx == -1:
        continue
        
    block = content[start_idx:end_idx + len(end_str)]
    
    # Extract the <a ...> ... </a> block inside it
    a_start = block.find('<a href=')
    a_end = block.find('</a>', a_start) + 4
    
    if a_start == -1 or 'nav-cta' not in block[a_start:a_end]:
        # skip if no nav-cta link found
        continue
        
    a_tag = block[a_start:a_end]
    
    # Remove a_tag from block
    # We should also remove the leading whitespace before a_tag to avoid leaving blank lines,
    # but for simplicity, we can just remove a_tag and then insert it later.
    # Let's find the newline right after a_tag
    if block[a_end] == '\n':
        a_tag_with_nl = a_tag + '\n'
    else:
        a_tag_with_nl = a_tag
        
    block_without_a = block[:a_start] + block[a_end:]
    
    # Now find where mobile-menu-btn starts in block_without_a
    mobile_start = block_without_a.find('<button id="mobile-menu-btn"')
    if mobile_start == -1:
        continue
        
    # We want to insert the a_tag right before the mobile_start
    # Let's see the indentation of mobile_start
    indent_start = block_without_a.rfind('\n', 0, mobile_start)
    indent = block_without_a[indent_start+1:mobile_start] if indent_start != -1 else "    "
    
    # insert a_tag
    new_block = block_without_a[:mobile_start] + a_tag + '\n' + indent + block_without_a[mobile_start:]
    
    new_content = content[:start_idx] + new_block + content[end_idx + len(end_str):]
    
    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {file_path}")
    else:
        print(f"No changes in {file_path}")
