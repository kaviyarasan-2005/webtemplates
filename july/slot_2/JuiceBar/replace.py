import os
import re

directory = r'd:\Projects\Z_PartTime\partime_revox\july\slot_2\JuiceBar'

old_svg_pattern = r'<svg[^>]*class="navbar__logo-svg"[^>]*>.*?</svg>'
new_svg_navbar = '''<svg
              class="navbar__logo-svg"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M19 4C19 4 6 14 6 24C6 30.627 11.928 36 19 36C26.072 36 32 30.627 32 24C32 14 19 4 19 4Z" fill="#D97706" opacity="0.85"/>
              <path d="M19 36L19 18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M19 26L14 21" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M19 30L24 25" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>'''

old_svg_footer_pattern = r'<svg\s+width="34"\s+height="34"\s+viewBox="0 0 38 38"\s+fill="none"\s+xmlns="http://www.w3.org/2000/svg"[^>]*>.*?</svg>'
new_svg_footer = '''<svg
                width="34"
                height="34"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M19 4C19 4 6 14 6 24C6 30.627 11.928 36 19 36C26.072 36 32 30.627 32 24C32 14 19 4 19 4Z" fill="#D97706" opacity="0.85"/>
                <path d="M19 36L19 18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M19 26L14 21" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M19 30L24 25" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              </svg>'''


def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace SVG
    content = re.sub(old_svg_pattern, new_svg_navbar, content, flags=re.DOTALL)
    content = re.sub(old_svg_footer_pattern, new_svg_footer, content, flags=re.DOTALL)

    # Replace brand text
    content = content.replace('Brew — Home', 'Juicy — Home')
    content = content.replace('Brew Home', 'Juicy Home')
    content = content.replace('<span class="navbar__logo-text">Brew</span>', '<span class="navbar__logo-text">Juicy</span>')
    content = content.replace('<span class="footer__logo-text">Brew</span>', '<span class="footer__logo-text">Juicy</span>')
    content = content.replace('aria-label="Brew — Home"', 'aria-label="Juicy — Home"')
    
    # other Brew occurrences
    content = content.replace('Brewing <span class="highlight">Brilliance', 'Blending <span class="highlight">Brilliance')
    content = content.replace('Something Big Is Brewing', 'Something Big Is Blending')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)


for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.html'):
            process_file(os.path.join(root, file))

print("Done")
