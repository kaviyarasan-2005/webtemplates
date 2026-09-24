with open('admin.html', 'r', encoding='utf-8') as f:
    c = f.read()

# Wrap all tbl tables with scrollable div
c = c.replace('<table class="tbl">', '<div class="tbl-wrap"><table class="tbl">')
c = c.replace('</table>', '</table></div>')

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(c)
print('done')
