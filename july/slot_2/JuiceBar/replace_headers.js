const fs = require('fs');
const path = require('path');

// Read index.html to get the source navbar
const indexContent = fs.readFileSync('index.html', 'utf8');
const navRegex = /<nav[^>]*class="navbar"[^>]*>[\s\S]*?<\/nav>/;
const match = navRegex.exec(indexContent);

if (!match) {
  console.error("Could not find navbar in index.html");
  process.exit(1);
}

const sourceNavbar = match[0];

// Modify paths for the pages/ directory
// 1. href="index.html" -> href="../index.html"
// 2. href="pages/xyz.html" -> href="xyz.html"
let modifiedNavbar = sourceNavbar.replace(/href="index\.html"/g, 'href="../index.html"');
modifiedNavbar = modifiedNavbar.replace(/href="pages\/([^"]+)"/g, 'href="$1"');

// Apply to all files in pages/
const pagesDir = './pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find and replace the navbar in the target file
  if (navRegex.test(content)) {
    content = content.replace(navRegex, modifiedNavbar);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated navbar in', filePath);
  } else {
    console.log('No navbar found in', filePath);
  }
});
