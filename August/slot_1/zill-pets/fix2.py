import glob

for f in glob.glob('*.html'):
    with open(f, 'rb') as file:
        content = file.read().decode('utf-8', errors='ignore')
    
    content = content.replace('â\xa0’', '&rarr;')
    content = content.replace('â€“', '&ndash;')
    content = content.replace('â€”', '&mdash;')
    content = content.replace('â†’', '&rarr;')
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
