import re
import sys

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove Navbar
    content = re.sub(r'\s*<!-- Navbar -->.*?</nav>', '', content, flags=re.DOTALL)
    
    # Remove Mobile Menu
    content = re.sub(r'\s*<!-- Mobile Menu -->.*?</div>\s*<main', '\n\n  <main', content, flags=re.DOTALL)
    
    # Remove Footer
    content = re.sub(r'\s*<!-- Footer -->.*?</footer>', '', content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

process_file('admin.html')
process_file('dashboard.html')
print("Done")
