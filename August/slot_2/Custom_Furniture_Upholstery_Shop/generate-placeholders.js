/**
 * generate-placeholders.js
 * Creates SVG placeholder images for all missing assets
 * Run with: node generate-placeholders.js
 */
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets', 'images');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const placeholders = [
  // Hero images
  { name: 'hero-home1.jpg',       w: 1600, h: 900, color: '#4A3025', label: 'Home Hero — Terracotta Tufted Sofa' },
  { name: 'hero-home2.jpg',       w: 1600, h: 900, color: '#2E1D14', label: 'Home 2 Hero — Workshop Craftsmanship' },
  { name: 'services-hero.jpg',    w: 1200, h: 900, color: '#3A2418', label: 'Services — Workshop Interior' },
  { name: 'fabric-gallery-hero.jpg', w: 1200, h: 900, color: '#4A3025', label: 'Fabric Gallery — Showroom' },
  { name: 'ba-gallery-hero.jpg',  w: 1200, h: 900, color: '#2E1D14', label: 'Before & After Gallery' },
  { name: 'contact-hero.jpg',     w: 1200, h: 900, color: '#4A3025', label: 'Contact — Workshop Entrance' },
  // Story images
  { name: 'story-workshop.jpg',   w: 800, h: 900, color: '#5C3D28', label: 'Workshop Interior' },
  { name: 'story-tools.jpg',      w: 600, h: 600, color: '#4A3025', label: 'Upholstery Tools' },
  { name: 'story-fabric-wall.jpg',w: 600, h: 600, color: '#B86F52', label: 'Fabric Wall Display' },
  // Why section
  { name: 'why-workshop.jpg',     w: 800, h: 1067, color: '#3A2418', label: 'Master Artisan at Work' },
  // Process steps
  { name: 'process-consult.jpg',  w: 800, h: 600, color: '#4A3025', label: 'Consultation' },
  { name: 'process-select.jpg',   w: 800, h: 600, color: '#B86F52', label: 'Fabric Selection' },
  { name: 'process-craft.jpg',    w: 800, h: 600, color: '#3A2418', label: 'Craftsmanship' },
  { name: 'process-deliver.jpg',  w: 800, h: 600, color: '#5C3D28', label: 'Delivery' },
  // Testimonials
  { name: 'testimonial-1.jpg',    w: 200, h: 200, color: '#B86F52', label: 'Priya R.' },
  { name: 'testimonial-2.jpg',    w: 200, h: 200, color: '#4A3025', label: 'Arjun M.' },
  { name: 'testimonial-3.jpg',    w: 200, h: 200, color: '#5C3D28', label: 'Sunita K.' },
  // Transformation items
  { name: 'transform-sofa.jpg',   w: 800, h: 600, color: '#4A3025', label: 'Sofa Transformation' },
  { name: 'transform-chair.jpg',  w: 800, h: 600, color: '#B86F52', label: 'Chair Transformation' },
  { name: 'transform-headboard.jpg', w: 800, h: 600, color: '#3A2418', label: 'Headboard' },
  // BA items
  { name: 'ba2-sofa-after.jpg',   w: 800, h: 600, color: '#2D5A8A', label: 'After: Teal Velvet Sofa' },
  { name: 'ba2-sofa-before.jpg',  w: 800, h: 600, color: '#888', label: 'Before: Worn Sofa' },
  { name: 'ba3-chesterfield-after.jpg', w: 800, h: 600, color: '#2E5931', label: 'After: Green Leather Chesterfield' },
  { name: 'ba3-chesterfield-before.jpg',w: 800, h: 600, color: '#555', label: 'Before: Peeling Chesterfield' },
  { name: 'ba4-wingback-after.jpg', w: 800, h: 600, color: '#B86F52', label: 'After: Terracotta Wingback' },
  { name: 'ba4-wingback-before.jpg',w: 800, h: 600, color: '#888', label: 'Before: Torn Wingback' },
  { name: 'ba5-dining-after.jpg', w: 800, h: 600, color: '#D4A0A0', label: 'After: Rose Dining Chairs' },
  { name: 'ba5-dining-before.jpg',w: 800, h: 600, color: '#999', label: 'Before: Stained Dining Chairs' },
  { name: 'ba6-headboard-after.jpg',w: 800, h: 600, color: '#1A1A2E', label: 'After: Black Velvet Headboard' },
  { name: 'ba6-headboard-before.jpg',w: 800, h: 600, color: '#8B7355', label: 'Before: Plain Headboard' },
  { name: 'ba7-ottoman-after.jpg', w: 800, h: 600, color: '#9B4E1F', label: 'After: Cognac Leather Ottoman' },
  { name: 'ba7-ottoman-before.jpg',w: 800, h: 600, color: '#AAA', label: 'Before: Worn Ottoman' },
  { name: 'ba8-antique-after.jpg', w: 800, h: 600, color: '#1B4332', label: 'After: Victorian Settee' },
  { name: 'ba8-antique-before.jpg',w: 800, h: 600, color: '#777', label: 'Before: Antique Settee' },
  { name: 'ba9-antique-chair-after.jpg',w: 800, h: 600, color: '#E07575', label: 'After: Coral Nursing Chair' },
  { name: 'ba9-antique-chair-before.jpg',w: 800, h: 600, color: '#888', label: 'Before: Nursing Chair' },
  // Spotlight
  { name: 'spotlight-after.jpg',  w: 1200, h: 675, color: '#1B4332', label: 'After: Peacock Parlour Suite' },
  { name: 'spotlight-before.jpg', w: 1200, h: 675, color: '#666', label: 'Before: Parlour Suite' },
  // Sofa service images
  { name: 'sofa-chesterfield.jpg',w: 600, h: 450, color: '#6B2737', label: 'Chesterfield Sofa' },
  { name: 'sofa-modular.jpg',     w: 600, h: 450, color: '#3D3D3D', label: 'Modular Sectional' },
  // Chair service images
  { name: 'chair-upholstery-main.jpg', w: 800, h: 600, color: '#8FAF88', label: 'Wingback Chair' },
  { name: 'chair-dining-set.jpg', w: 600, h: 450, color: '#3D3D3D', label: 'Dining Chair Set' },
  { name: 'chair-antique.jpg',    w: 600, h: 450, color: '#5A2D6B', label: 'Antique Chair' },
  // Headboard
  { name: 'headboard-tufted.jpg', w: 600, h: 450, color: '#1B4332', label: 'Tufted Headboard' },
  { name: 'headboard-curved.jpg', w: 600, h: 450, color: '#E8B4B8', label: 'Curved Headboard' },
  // Additional services
  { name: 'service-ottoman.jpg',  w: 800, h: 600, color: '#D4AC0D', label: 'Ottoman Service' },
  { name: 'service-dining-chairs.jpg', w: 800, h: 600, color: '#8FAF88', label: 'Dining Chairs' },
  { name: 'service-outdoor.jpg',  w: 800, h: 600, color: '#2980B9', label: 'Outdoor Furniture' },
  { name: 'service-commercial.jpg',w: 800, h: 600, color: '#4A3025', label: 'Commercial Upholstery' },
  // Fabrics
  { name: 'fabric-velvet-forest.jpg', w: 600, h: 800, color: '#2D5A27', label: 'Forest Velvet' },
  { name: 'fabric-linen-natural.jpg',  w: 600, h: 800, color: '#C8B89A', label: 'Natural Linen' },
  { name: 'fabric-leather-cognac.jpg', w: 600, h: 800, color: '#9B4E1F', label: 'Cognac Leather' },
  { name: 'fabric-boucle-cream.jpg',   w: 600, h: 800, color: '#F2EDDF', label: 'Cream Boucle' },
  { name: 'fab-velvet-navy.jpg',  w: 600, h: 600, color: '#1B2A4A', label: 'Navy Velvet' },
  { name: 'fab-velvet-blush.jpg', w: 600, h: 600, color: '#E8B4B8', label: 'Blush Velvet' },
  { name: 'fab-velvet-terracotta.jpg', w: 600, h: 600, color: '#B86F52', label: 'Terracotta Velvet' },
  { name: 'fab-linen-natural.jpg',w: 600, h: 600, color: '#C8B89A', label: 'Natural Linen' },
  { name: 'fab-linen-stone.jpg',  w: 600, h: 600, color: '#9E9E8E', label: 'Stone Linen' },
  { name: 'fab-linen-sage.jpg',   w: 600, h: 600, color: '#8FAF88', label: 'Sage Linen' },
  { name: 'fab-leather-cognac.jpg',w:600, h: 600, color: '#9B4E1F', label: 'Cognac Leather' },
  { name: 'fab-leather-black.jpg',w: 600, h: 600, color: '#1A1A1A', label: 'Black Leather' },
  { name: 'fab-leather-caramel.jpg',w:600,h: 600, color: '#C8823A', label: 'Caramel Leather' },
  { name: 'fab-boucle-ivory.jpg', w: 600, h: 600, color: '#F2EDDF', label: 'Ivory Boucle' },
  { name: 'fab-boucle-oatmeal.jpg',w:600,h: 600, color: '#D9C9A8', label: 'Oatmeal Boucle' },
  { name: 'fab-tweed-herringbone.jpg', w: 600, h: 600, color: '#6B6B5A', label: 'Herringbone Tweed' },
  { name: 'fab-cotton-duckegg.jpg',w:600,h: 600, color: '#7EACB5', label: 'Duck Egg Cotton' },
  { name: 'fab-performance-pewter.jpg', w: 600, h: 600, color: '#8D8D8D', label: 'Pewter Performance' },
  { name: 'fab-performance-slate.jpg',  w: 600, h: 600, color: '#7B8FA6', label: 'Slate Performance' },
  // Collections
  { name: 'collection-heritage.jpg',  w: 800, h: 500, color: '#4A3025', label: 'Heritage Collection' },
  { name: 'collection-contemporary.jpg', w: 800, h: 500, color: '#3D3D3D', label: 'Contemporary Collection' },
  { name: 'collection-luxe.jpg',  w: 800, h: 500, color: '#2D5A27', label: 'Luxe Collection' },
  // Sustainability
  { name: 'sustainability-fabrics.jpg', w: 800, h: 600, color: '#2E5931', label: 'Sustainable Fabrics' },
  // Swatch
  { name: 'swatch-samples.jpg',   w: 800, h: 1067, color: '#F4EBDD', label: 'Fabric Swatches' },
  // Team artisans
  { name: 'artisan-krishna.jpg',  w: 400, h: 500, color: '#4A3025', label: 'Krishnaswamy Pillai' },
  { name: 'artisan-lakshmi.jpg',  w: 400, h: 500, color: '#B86F52', label: 'Lakshmi Devi' },
  { name: 'artisan-ravi.jpg',     w: 400, h: 500, color: '#5C3D28', label: 'Ravi Kumar' },
  { name: 'artisan-anitha.jpg',   w: 400, h: 500, color: '#8FAF88', label: 'Anitha Krishnan' },
  // Blog
  { name: 'blog-fabric-choice.jpg',w: 800, h: 500, color: '#4A3025', label: 'Blog: Fabric Choice' },
  { name: 'blog-tufting.jpg',     w: 800, h: 500, color: '#3A2418', label: 'Blog: Tufting' },
  { name: 'blog-repair-vs-replace.jpg', w: 800, h: 500, color: '#2E5931', label: 'Blog: Repair vs Replace' },
  // Instagram-style
  { name: 'insta-velvet-detail.jpg', w: 600, h: 600, color: '#1B4332', label: 'Velvet Detail' },
  { name: 'insta-artisan-work.jpg',  w: 600, h: 600, color: '#4A3025', label: 'Artisan Working' },
  { name: 'insta-armchair-complete.jpg', w: 600, h: 600, color: '#1B2A4A', label: 'Blue Armchair' },
  { name: 'insta-fabric-swatches.jpg',   w: 600, h: 600, color: '#B86F52', label: 'Fabric Swatches' },
  { name: 'insta-headboard-reveal.jpg',  w: 600, h: 600, color: '#F2EDDF', label: 'Headboard Reveal' },
  { name: 'insta-leather-finish.jpg',    w: 600, h: 600, color: '#9B4E1F', label: 'Leather Finishing' },
  // Booking
  { name: 'booking-showroom.jpg', w: 800, h: 800, color: '#4A3025', label: 'ReVox Showroom' },
  // Contact
  { name: 'workshop-exterior.jpg', w: 800, h: 450, color: '#3A2418', label: 'Workshop Exterior' },
  { name: 'workshop-crafting.jpg', w: 800, h: 600, color: '#4A3025', label: 'Workshop Crafting' },
  { name: 'map-static.jpg',       w: 1200, h: 525, color: '#E8E0D0', label: 'Google Maps Location' },
  // Client stories
  { name: 'story-ananya.jpg',     w: 480, h: 600, color: '#B86F52', label: 'Ananya K.' },
  { name: 'story-danish.jpg',     w: 480, h: 600, color: '#4A3025', label: 'Danish A.' },
  // Newsletter
  { name: 'newsletter-contact.jpg', w: 600, h: 800, color: '#3A2418', label: 'Newsletter Mood Board' },
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgb(${r},${g},${b})`;
}

function luminance(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  return 0.299*r + 0.587*g + 0.114*b;
}

function makeSvg(w, h, bg, label) {
  const textColor = luminance(bg) > 0.45 ? '#4A3025' : '#F4EBDD';
  const accentColor = luminance(bg) > 0.45 ? '#B86F52' : '#E8A87C';
  const lines = label.split(' — ');
  const fs1 = Math.min(18, Math.max(10, Math.round(w/30)));
  const fs2 = Math.min(14, Math.max(8, Math.round(w/40)));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${textColor}" stroke-width="0.4" opacity="0.08"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <rect x="${w*0.05}" y="${h*0.05}" width="${w*0.9}" height="${h*0.9}" fill="none" stroke="${accentColor}" stroke-width="1.5" rx="4" opacity="0.3"/>
  <circle cx="${w/2}" cy="${h*0.38}" r="${Math.min(w,h)*0.08}" fill="${accentColor}" opacity="0.25"/>
  <text x="${w/2}" y="${h*0.38 + Math.min(w,h)*0.03}" text-anchor="middle" font-family="Georgia, serif" font-size="${fs1}" fill="${accentColor}" font-weight="bold">RV</text>
  <text x="${w/2}" y="${h*0.56}" text-anchor="middle" font-family="Georgia, serif" font-size="${fs1}" fill="${textColor}" font-weight="bold">${lines[0] || label}</text>
  ${lines[1] ? `<text x="${w/2}" y="${h*0.56 + fs1*1.4}" text-anchor="middle" font-family="sans-serif" font-size="${fs2}" fill="${textColor}" opacity="0.65">${lines[1]}</text>` : ''}
  <text x="${w/2}" y="${h*0.88}" text-anchor="middle" font-family="sans-serif" font-size="${Math.max(8,fs2-2)}" fill="${textColor}" opacity="0.35">Image placeholder — ReVox Upholstery</text>
</svg>`;
}

let created = 0;
let skipped = 0;

for (const p of placeholders) {
  const filePath = path.join(assetsDir, p.name);
  if (fs.existsSync(filePath)) {
    skipped++;
    continue;
  }
  // Write SVG as a .jpg-named file (browsers will still render SVG content)
  // Better: write actual SVG with .svg extension and reference it — but since HTML uses .jpg,
  // we write the SVG content to the .jpg path (browsers parse by content, not extension for <img>)
  // Actually for <img> tags, let's write a tiny JPG-compatible base64 embedded SVG as a data URI wrapper.
  // Simplest approach: write the SVG directly — most browsers will render SVG even with .jpg extension
  fs.writeFileSync(filePath, makeSvg(p.w, p.h, p.color, p.label), 'utf8');
  created++;
  process.stdout.write(`\r  Created ${created} placeholders...`);
}

console.log(`\n\nDone! Created ${created} placeholders, skipped ${skipped} existing files.`);
console.log(`Total images in assets/images: ${fs.readdirSync(assetsDir).length}`);
