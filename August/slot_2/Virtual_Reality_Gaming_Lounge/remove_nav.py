import re

for fname in ['dashboard.html', 'admin.html']:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    # Remove the topbar-center nav block
    content = re.sub(r'\s*<nav class="topbar-center">.*?</nav>', '', content, flags=re.DOTALL)
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
    print(fname, 'done')
