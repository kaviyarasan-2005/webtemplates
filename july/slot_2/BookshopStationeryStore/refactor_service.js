const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'pages/service.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Bespoke Gift Wrapping (3 -> 3-col grid)
const wrapOld = /<!-- 3\. Artisan Gift Wrapping -->[\s\S]*?<\/section>/;
const wrapNew = `<!-- 3. Artisan Gift Wrapping -->
    <section class="section text-center">
        <div class="container">
            <h2 class="section-title">Bespoke Gift Wrapping</h2>
            <p class="text-muted" style="font-size: 1.125rem; max-width: 600px; margin: 0 auto 48px;">
                Present your literary gifts beautifully with our premium artisan wrapping paper. We use traditional wax seals, custom ribbons, and personalized handwritten notes.
            </p>
            <div class="grid grid-3 gap-4">
                <div class="card text-center" style="padding: 32px;">
                    <i class="ph ph-map-trifold" style="font-size: 3rem; color: var(--secondary-color); margin-bottom: 16px;"></i>
                    <h4>Vintage Map Paper</h4>
                    <p class="text-muted">Unique, textured papers sourced from historical archives.</p>
                </div>
                <div class="card text-center" style="padding: 32px;">
                    <i class="ph ph-seal" style="font-size: 3rem; color: var(--secondary-color); margin-bottom: 16px;"></i>
                    <h4>Custom Wax Seals</h4>
                    <p class="text-muted">Hand-pressed seals with literary crests and initial stamps.</p>
                </div>
                <div class="card text-center" style="padding: 32px;">
                    <i class="ph ph-flower-lotus" style="font-size: 3rem; color: var(--secondary-color); margin-bottom: 16px;"></i>
                    <h4>Floral Accents</h4>
                    <p class="text-muted">Dried lavender and wild flowers tucked into twine ribbons.</p>
                </div>
            </div>
        </div>
    </section>`;
content = content.replace(wrapOld, wrapNew);

// 2. Stationery Personalization (5 -> Full width banner)
const statOld = /<!-- 5\. Stationery Personalization -->[\s\S]*?<\/section>/;
const statNew = `<!-- 5. Stationery Personalization -->
    <section class="section" style="background-image: url('https://image.pollinations.ai/prompt/calligrapher%20using%20fountain%20pen?width=1200&height=600&nologo=true'); background-size: cover; background-position: center; position: relative; padding: 120px 0;">
        <div style="position: absolute; inset: 0; background-color: rgba(17,33,54,0.8);"></div>
        <div class="container text-center" style="position: relative; z-index: 1;">
            <h2 class="section-title" style="color: white;">Stationery Personalization</h2>
            <p style="font-size: 1.125rem; margin: 0 auto 32px; max-width: 700px; color: rgba(255,255,255,0.9);">
                Make it yours. We offer custom blind embossing and gold-foil stamping on our leather journals, as well as precise laser engraving for fine fountain pens. Perfect for corporate or personal gifts.
            </p>
            <a href="contact.html" class="btn btn-secondary">Request Customization</a>
        </div>
    </section>`;
content = content.replace(statOld, statNew);

// 3. Academic Supplying (6 -> Split Card)
const acadOld = /<!-- 6\. Academic Supplying -->[\s\S]*?<\/section>/;
const acadNew = `<!-- 6. Academic Supplying -->
    <section class="section section-light">
        <div class="container">
            <div style="display: flex; flex-wrap: wrap; background-color: white; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); overflow: hidden;">
                <div style="flex: 1 1 400px; padding: 48px; display: flex; flex-direction: column; justify-content: center;">
                    <h2 class="section-title text-left">Academic Supplying</h2>
                    <p class="text-muted" style="font-size: 1.125rem; margin-bottom: 24px;">
                        We partner with local universities, schools, and institutions to provide course materials, academic texts, and specialized bulk stationery orders at institutional rates.
                    </p>
                    <div>
                        <a href="contact.html" class="btn btn-primary">Open an Account</a>
                    </div>
                </div>
                <div style="flex: 1 1 400px; background-image: url('https://image.pollinations.ai/prompt/stack%20of%20academic%20textbooks?width=800&height=800&nologo=true'); background-size: cover; background-position: center; min-height: 300px;">
                </div>
            </div>
        </div>
    </section>`;
content = content.replace(acadOld, acadNew);

fs.writeFileSync(file, content);
console.log('service.html updated');
