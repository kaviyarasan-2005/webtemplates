import glob

for f in glob.glob('*.html'):
    with open(f, 'rb') as file:
        content = file.read().decode('utf-8', errors='ignore')
    
    # \xe2\x80\xa0\xe2\x80\x99 is one way it might appear, but let's just use regex for 'Learn More'
    import re
    content = re.sub(r'Learn More.*?</a>', r'Learn More &rarr;</a>', content)
    content = re.sub(r'Read note.*?</a>', r'Read note &rarr;</a>', content)
    content = re.sub(r'Mon.*?Sat: 9am.*?6pm', r'Mon&ndash;Sat: 9am &ndash; 6pm', content)
    content = re.sub(r'Sun: 10am.*?4pm', r'Sun: 10am &ndash; 4pm', content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
