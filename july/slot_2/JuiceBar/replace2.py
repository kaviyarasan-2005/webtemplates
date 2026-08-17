import os
import re

directory = r'd:\Projects\Z_PartTime\partime_revox\july\slot_2\JuiceBar'

old_svg_navbar = r'<svg[^>]*class="navbar__logo-svg"[^>]*>.*?</svg>'
new_svg_navbar = '''<svg
              class="navbar__logo-svg"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <!-- Outer Rind -->
              <circle cx="19" cy="21" r="14" stroke="#D97706" stroke-width="3" fill="#FEF3C7"/>
              <!-- Inner Segments -->
              <circle cx="19" cy="21" r="10" fill="#F59E0B"/>
              <path d="M19 11V31M9 21H29M12 14L26 28M12 28L26 14" stroke="#FEF3C7" stroke-width="2" stroke-linecap="round"/>
              <!-- Leaves -->
              <path d="M19 7C19 7 13 1 7 5C11 9 19 7 19 7Z" fill="#10B981" stroke="#059669" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M19 7C19 7 24 2 28 6C24 10 19 7 19 7Z" fill="#34D399" stroke="#059669" stroke-width="1.5" stroke-linejoin="round"/>
            </svg>'''

old_svg_footer = r'<svg[^>]*width="34"[^>]*height="34"[^>]*>.*?</svg>'
new_svg_footer = '''<svg
                width="34"
                height="34"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <!-- Outer Rind -->
                <circle cx="19" cy="21" r="14" stroke="#D97706" stroke-width="3" fill="#FEF3C7"/>
                <!-- Inner Segments -->
                <circle cx="19" cy="21" r="10" fill="#F59E0B"/>
                <path d="M19 11V31M9 21H29M12 14L26 28M12 28L26 14" stroke="#FEF3C7" stroke-width="2" stroke-linecap="round"/>
                <!-- Leaves -->
                <path d="M19 7C19 7 13 1 7 5C11 9 19 7 19 7Z" fill="#10B981" stroke="#059669" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M19 7C19 7 24 2 28 6C24 10 19 7 19 7Z" fill="#34D399" stroke="#059669" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>'''

old_svg_cs = r'<svg[^>]*width="72"[^>]*height="72"[^>]*>.*?</svg>'
new_svg_cs = '''<svg
                width="72"
                height="72"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <!-- Outer Rind -->
                <circle cx="19" cy="21" r="14" stroke="#D97706" stroke-width="3" fill="#FEF3C7"/>
                <!-- Inner Segments -->
                <circle cx="19" cy="21" r="10" fill="#F59E0B"/>
                <path d="M19 11V31M9 21H29M12 14L26 28M12 28L26 14" stroke="#FEF3C7" stroke-width="2" stroke-linecap="round"/>
                <!-- Leaves -->
                <path d="M19 7C19 7 13 1 7 5C11 9 19 7 19 7Z" fill="#10B981" stroke="#059669" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M19 7C19 7 24 2 28 6C24 10 19 7 19 7Z" fill="#34D399" stroke="#059669" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>'''

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    content = re.sub(old_svg_navbar, new_svg_navbar, content, flags=re.DOTALL)
    content = re.sub(old_svg_footer, new_svg_footer, content, flags=re.DOTALL)
    content = re.sub(old_svg_cs, new_svg_cs, content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.html'):
            process_file(os.path.join(root, file))

print("Done")
