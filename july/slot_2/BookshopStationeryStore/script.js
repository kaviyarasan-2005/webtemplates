const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, 'pages');

fs.readdirSync(pagesDir).filter(f => f.endsWith('.html')).forEach(file => {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace </div></nav>
    content = content.replace(/<\/div>\s*<\/nav>/, `</div>
                <div class="nav-item mobile-only">
                    <a href="service.html" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px 16px; font-size: 1rem; border-radius: var(--radius-full);">Book Now</a>
                </div>
            </nav>`);
            
    // Replace Book Now in nav-tools
    content = content.replace(/<a href="service\.html" class="btn btn-primary" style="padding: 8px 16px; font-size: 0\.875rem; border-radius: var\(--radius-full\);">Book Now<\/a>/, `<a href="service.html" class="btn btn-primary desktop-only" style="padding: 8px 16px; font-size: 0.875rem; border-radius: var(--radius-full);">Book Now</a>`);
    
    fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Done');
