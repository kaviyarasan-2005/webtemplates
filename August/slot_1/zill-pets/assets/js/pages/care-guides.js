document.addEventListener('DOMContentLoaded', () => {
  const isDetailPage = document.getElementById('guide-title') !== null;

  if (isDetailPage) {
    loadGuideDetail();
  } else {
    initCareGuidesPage();
  }

  function loadGuideDetail() {
    // 1. Get ID from URL
    const params = new URLSearchParams(window.location.search);
    const guideId = params.get('id') || 'ball-python-care'; // default if none provided

    // 2. Fetch dummy data for guides
    // In a real app this would come from ZILL_GUIDES in data.js
    // We'll mock the specific structures needed to render.
    
    // Fallback/Mock data to render if ZILL_GUIDES is not fully populated in data.js yet
    const guidesDb = (typeof ZILL_GUIDES !== 'undefined') ? ZILL_GUIDES : [
      {
        id: 'ball-python-care',
        title: 'Ball Python Care',
        species: 'Ball Python',
        difficulty: 'Beginner',
        readTime: '10 Min Read',
        tempRange: '76–88°F',
        humidityRange: '55–65%',
        image: 'https://images.unsplash.com/photo-1546992772-3318f1f3a1be?w=1600&q=80',
        intro: 'Ball pythons are widely considered the perfect starter snake. With their docile nature, manageable size, and relatively simple care requirements, they make fantastic companions for reptile enthusiasts of all experience levels.',
        sections: [
          { id: 'habitat', title: 'Habitat Setup', content: '<p>Adult ball pythons require an enclosure of at least 40 gallons, though a 4x2x2 foot enclosure is ideal for adults. Provide multiple hides—one on the warm side and one on the cool side—so your snake feels secure.</p>' },
          { id: 'temperature', title: 'Temperature & Lighting', content: '<p>Maintain a temperature gradient of 75-80°F on the cool end and 85-90°F on the warm end. A basking spot is not strictly necessary. UVB lighting is beneficial but not strictly required for this species.</p>' },
          { id: 'diet', title: 'Diet & Feeding', content: '<p>Feed your ball python an appropriately sized rodent every 1-2 weeks depending on age. Prey should be roughly the same width as the widest part of the snakes body.</p>' }
        ]
      },
      {
        id: 'bearded-dragon-care',
        title: 'Bearded Dragon Care',
        species: 'Bearded Dragon',
        difficulty: 'Beginner',
        readTime: '15 Min Read',
        tempRange: '80–110°F',
        humidityRange: '30–40%',
        image: 'https://images.unsplash.com/photo-1619816128374-a6b4766ca92c?w=1600&q=80',
        intro: 'Bearded dragons are incredibly resilient and full of personality, but they require a very specific setup to mimic their native Australian environment.',
        sections: [
          { id: 'lighting', title: 'Lighting & UVB', content: '<p>The most common mistake new keepers make is underestimating the need for intense, quality UVB. It is not just light—it is literal life support for a bearded dragon.</p>' },
          { id: 'diet', title: 'Diet & Feeding', content: '<p>Juveniles need mostly insects (80%) and some greens (20%). Adults need the opposite: 80% greens and veggies, 20% insects.</p>' }
        ]
      },
      {
        id: 'leopard-gecko-care',
        title: 'Leopard Gecko Care',
        species: 'Leopard Gecko',
        difficulty: 'Beginner',
        readTime: '8 Min Read',
        tempRange: '75–90°F',
        humidityRange: '30–40%',
        image: 'assets/images/leopard-gecko.jpg',
        intro: 'Leopard geckos are one of the most popular reptile pets. They are hardy, relatively easy to care for, and come in a wide variety of colors (morphs).',
        sections: [
          { id: 'setup', title: 'Enclosure Setup', content: '<p>A 20-gallon long tank is the minimum for one adult leopard gecko. Provide at least three hides: a warm hide, a cool hide, and a humid hide to assist with shedding.</p>' },
          { id: 'diet', title: 'Feeding', content: '<p>Leopard geckos are strictly insectivores. Offer gut-loaded crickets, mealworms, or dubia roaches, dusted with calcium and vitamins.</p>' }
        ]
      },
      {
        id: 'crested-gecko-care',
        title: 'Crested Gecko Care',
        species: 'Crested Gecko',
        difficulty: 'Beginner',
        readTime: '10 Min Read',
        tempRange: '72–78°F',
        humidityRange: '60–80%',
        image: 'https://images.unsplash.com/photo-1769986289575-d402e93d5885?w=1600&q=80',
        intro: 'Crested geckos are arboreal wonders that do well at room temperature, making them a fantastic low-maintenance pet.',
        sections: [
          { id: 'environment', title: 'Environment', content: '<p>They require a tall enclosure with plenty of vertical climbing space and foliage. Keep humidity between 50-80% with daily misting.</p>' }
        ]
      },
      {
        id: 'veiled-chameleon-care',
        title: 'Veiled Chameleon Care',
        species: 'Veiled Chameleon',
        difficulty: 'Advanced',
        readTime: '9 Min Read',
        tempRange: '72–95°F',
        humidityRange: '50–70%',
        image: 'https://images.unsplash.com/photo-1621150538602-2351d4f7dc2f?w=1600&q=80',
        intro: 'Veiled Chameleons require precise vertical screen housing, moving water drippers, and Ferguson Zone 3 UVB.',
        sections: [
          { id: 'screen-housing', title: 'Screen Housing', content: '<p>Minimum 24x24x48 inch all-screen cage. Stagnant air in glass terrariums causes upper respiratory infections.</p>' }
        ]
      },
      {
        id: 'blue-tongued-skink-care',
        title: 'Blue-Tongued Skink Care',
        species: 'Blue-Tongued Skink',
        difficulty: 'Intermediate',
        readTime: '8 Min Read',
        tempRange: '75–100°F',
        humidityRange: '40–60%',
        image: 'assets/images/blue-tongued-skink.jpg',
        intro: 'Northern Blue-Tongued Skinks are intelligent, calm Australian omnivores that require a 120-gallon enclosure with deep substrate.',
        sections: [
          { id: 'substrate-enclosure', title: 'Substrate & Digging', content: '<p>Provide 4-6 inches of cypress mulch or topsoil mix in a 4x2x2 foot enclosure for natural burrowing.</p>' }
        ]
      }
    ];

    const guide = guidesDb.find(g => g.id === guideId) || guidesDb[0];

    // Format compatibility helpers
    const introText = (guide.content && guide.content.intro) || guide.intro || '';
    const sectionsArr = (guide.content && guide.content.sections) || guide.sections || [];
    const readTimeText = guide.readingTime || guide.readTime || '5 min read';

    // 3. Populate Hero Image
    const heroImg = document.getElementById('guide-hero-img');
    if (heroImg && guide.image) {
      heroImg.src = guide.image;
      heroImg.alt = guide.title;
      heroImg.style.display = 'block';
    }

    // 4. Populate Title & Meta
    const titleEl = document.getElementById('guide-title');
    if (titleEl) titleEl.textContent = guide.title;
    document.title = `ZILL — ${guide.title}`;

    const breadcrumbEl = document.getElementById('breadcrumb-current');
    if (breadcrumbEl) breadcrumbEl.textContent = guide.title;
    
    const metaEl = document.getElementById('guide-meta');
    if (metaEl) {
      let metaHtml = `
        <span class="section-label" style="margin: 0;">${guide.difficulty || 'Beginner'}</span>
        <span class="text-mono" style="font-size: 0.875rem; color: var(--clr-text-sub);">${readTimeText}</span>
      `;
      if (guide.species) {
        metaHtml += `<span class="sticker" style="background: var(--clr-yellow); color: var(--clr-ink); font-family: 'Space Mono', monospace; font-size: 0.8rem; padding: 0.25rem 0.5rem; border: 1px solid var(--clr-border);">${guide.species}</span>`;
      }
      metaEl.innerHTML = metaHtml;
    }

    // 5. Build Content & TOC
    const contentContainer = document.getElementById('guide-content');
    const tocContainer = document.getElementById('guide-toc-links');
    
    let contentHtml = '';

    // Add Quick Stats Banner if available
    if (guide.tempRange || guide.humidityRange || guide.difficulty) {
      contentHtml += `
        <div class="guide-quick-spec" style="background: var(--clr-bg-alt); border: var(--border); box-shadow: var(--shadow-sm); padding: 1.25rem; border-radius: 8px; margin-bottom: 2.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 1rem; align-items: center;">
          ${guide.tempRange ? `<div><div class="text-mono" style="font-size: 0.75rem; color: var(--clr-text-sub); font-weight: bold; text-transform: uppercase;">Temp Range</div><div style="font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; font-weight: bold; color: var(--clr-text);">${guide.tempRange}</div></div>` : ''}
          ${guide.humidityRange ? `<div><div class="text-mono" style="font-size: 0.75rem; color: var(--clr-text-sub); font-weight: bold; text-transform: uppercase;">Humidity</div><div style="font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; font-weight: bold; color: var(--clr-text);">${guide.humidityRange}</div></div>` : ''}
          ${guide.difficulty ? `<div><div class="text-mono" style="font-size: 0.75rem; color: var(--clr-text-sub); font-weight: bold; text-transform: uppercase;">Care Level</div><div style="font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; font-weight: bold; color: var(--clr-text);">${guide.difficulty}</div></div>` : ''}
        </div>
      `;
    }

    if (introText) {
      contentHtml += `<p class="drop-cap" style="margin-bottom: 2rem; font-size: 1.125rem; line-height: 1.7; color: var(--clr-text-sub);">${introText}</p>`;
    }

    let tocHtml = '';

    // Add Callout Warning
    contentHtml += `
      <div class="callout callout--warning" style="background: rgba(255, 197, 61, 0.15); border-left: 4px solid var(--clr-yellow); padding: 1.25rem; margin-bottom: 2rem; border-radius: 4px; color: var(--clr-text);">
        <strong style="color: var(--clr-text);">Warning:</strong> Always monitor temperatures with a digital thermometer. Analog gauges are often inaccurate.
      </div>
    `;

    sectionsArr.forEach(sec => {
      const secId = sec.id || sec.title.toLowerCase().replace(/\s+/g, '-');
      const secTitle = sec.title;
      let secBody = sec.body || sec.content || '';

      if (!secBody.trim().startsWith('<')) {
        secBody = `<p style="margin: 0;">${secBody}</p>`;
      }

      // Content
      contentHtml += `
        <h2 id="${secId}" class="guide-section-heading" style="font-family: 'Space Grotesk', sans-serif; font-size: 1.85rem; margin-top: 2.5rem; margin-bottom: 1rem; border-bottom: 2px solid var(--clr-border); padding-bottom: 0.5rem; color: var(--clr-text);">${secTitle}</h2>
        <div style="font-size: 1.125rem; line-height: 1.7; color: var(--clr-text-sub); margin-bottom: 1.5rem;">${secBody}</div>
      `;
      // TOC Link
      tocHtml += `<a href="#${secId}" class="guide-toc__link">${secTitle}</a>`;
    });

    // Add Pro Tip Callout
    contentHtml += `
      <div class="callout callout--tip" style="background: rgba(62, 155, 79, 0.12); border-left: 4px solid var(--clr-green); padding: 1.25rem; margin-top: 2.5rem; border-radius: 4px; color: var(--clr-text);">
        <strong style="color: var(--clr-green);">Pro Tip:</strong> Keep a detailed log of your reptile's feeding and shedding schedule to quickly spot any health issues.
      </div>
    `;

    if (contentContainer) contentContainer.innerHTML = contentHtml;
    if (tocContainer) tocContainer.innerHTML = tocHtml;

    // 6. Populate Related Guides (3 other guides)
    const relatedGrid = document.getElementById('related-guides-grid');
    if (relatedGrid) {
      const otherGuides = guidesDb.filter(g => g.id !== guide.id).slice(0, 3);
      let relatedHtml = '';
      otherGuides.forEach(g => {
        const rTime = g.readingTime || g.readTime || '8 min read';
        relatedHtml += `
          <article class="card reveal reveal--visible">
            <div class="card__img-wrap" style="position:relative; overflow:hidden; aspect-ratio:16/9;">
              <span class="sticker sticker--absolute sticker--green" style="top: 1rem; left: 1rem;">${g.difficulty || 'Beginner'}</span>
              <img src="${g.image}" alt="${g.title}" class="card__img" loading="lazy" style="height: 100%; object-fit: cover; width: 100%;">
            </div>
            <div class="card__body" style="padding: 1.5rem; display:flex; flex-direction:column; gap:0.5rem;">
              <span class="card__tag text-mono" style="font-size: 0.75rem; color: var(--clr-text-sub);">${rTime}</span>
              <h3 class="card__title" style="margin:0; font-size:1.25rem; color: var(--clr-text);">${g.title}</h3>
              <a href="guide-detail.html?id=${g.id}" class="card__link btn btn--sm btn--outline" style="margin-top: 1rem; text-align: center;">Read Guide &rarr;</a>
            </div>
          </article>
        `;
      });
      relatedGrid.innerHTML = relatedHtml;
    }

    // Scroll to hash if present after loading
    if (window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  /* ============================================================
     SPECIES TELEMETRY NAVIGATOR (care-guides.html)
     ============================================================ */
  function initCareGuidesPage() {
    const tabsContainer = document.getElementById('species-care-tabs');
    const panelContainer = document.getElementById('species-care-display');
    if (!tabsContainer || !panelContainer) return;

    const SPECIES_CARE_DB = {
      'bearded-dragon': {
        name: 'Central Bearded Dragon',
        scientific: 'Pogona vitticeps',
        difficulty: 'Beginner',
        lifespan: '10–15 Years',
        activity: 'Diurnal (Day Active)',
        image: 'https://images.unsplash.com/photo-1619816128374-a6b4766ca92c?w=800&q=80',
        guideId: 'bearded-dragon-care',
        origin: 'Arid Woodlands & Scrublands of Central Australia',
        enclosure: {
          size: '120 Gallon (48"×24"×24") Minimum',
          orientation: 'Horizontal Terrestrial (Front-opening PVC/Wood)',
          substrate: '50/50 organic topsoil & washed play sand (Adults); paper towels (Juveniles)',
          ventilation: 'High airflow wire-mesh screen top + dual lower air vents'
        },
        thermal: {
          basking: '105°F–110°F (surface temp on slate, measured via IR temp gun)',
          warmSide: '85°F–90°F ambient temperature',
          coolSide: '75°F–80°F cool retreat zone',
          nightDrop: '65°F–70°F safe night drop (no visible light; ceramic heater only if <65°F)'
        },
        uvb: {
          zone: 'Ferguson Zone 3 (UVI 2.9–7.4)',
          bulb: 'Linear T5 HO 10.0 or Arcadia 12% Desert (must span 50–66% of tank length)',
          distance: '12–15 inches above primary basking rock',
          cycle: '12h summer / 10h winter; replace linear tube every 12 months'
        },
        nutrition: {
          dietType: 'Omnivore (Drastic age-dependent ratio)',
          juvenile: '80% live gut-loaded insects (Dubia, BSFL, crickets) daily + 20% fresh chopped greens',
          adult: '80% dark leafy greens (collard, mustard, dandelion) daily + 20% insects 2–3x weekly',
          supplements: 'Pure calcium (no D3) every insect feed; Calcium+D3 2x/mo; Multivitamin 2x/mo'
        },
        hydration: {
          humidity: '30%–40% ambient RH',
          waterSource: 'Shallow fresh water dish; morning droplet misting on greens; weekly warm 15m soak'
        },
        warnings: [
          'NEVER use loose calcium sand ("Vita-Sand") for juveniles — high risk of fatal intestinal impaction.',
          'Always verify basking temp with an infrared temp gun; analog dials underread surface slate heat by up to 15°F.',
          'UVB light cannot penetrate glass or acrylic — bulbs must be mounted inside or over wide wire mesh.'
        ]
      },
      'ball-python': {
        name: 'Ball Python (Royal Python)',
        scientific: 'Python regius',
        difficulty: 'Beginner',
        lifespan: '20–30 Years',
        activity: 'Crepuscular / Nocturnal (Twilight & Night)',
        image: 'https://images.unsplash.com/photo-1546992772-3318f1f3a1be?w=800&q=80',
        guideId: 'ball-python-care',
        origin: 'Sub-Saharan West & Central Africa (Grasslands & Savannas)',
        enclosure: {
          size: '40–50 Gallon (36"×18"×18") Minimum for Adults',
          orientation: 'Horizontal Terrestrial (Solid PVC or sealed screen)',
          substrate: 'Coconut husk chips (ReptiChip), cypress mulch, or organic moisture-retentive mix',
          ventilation: 'Controlled ventilation (minimize wide mesh to prevent humidity loss)'
        },
        thermal: {
          basking: '88°F–92°F (belly heat hotspot via thermostat-regulated UTH or deep heat projector)',
          warmSide: '85°F–88°F ambient warmth',
          coolSide: '76°F–80°F cool hide retreat',
          nightDrop: '75°F–78°F safe night drop'
        },
        uvb: {
          zone: 'Ferguson Zone 1 (UVI 0.4–1.4)',
          bulb: 'Linear T5 ShadeDweller 2.4% or 7% (low intensity welfare lighting)',
          distance: '12–18 inches above ground hides',
          cycle: '12h day / 12h night photoperiod'
        },
        nutrition: {
          dietType: 'Strict Carnivore (Whole Prey)',
          juvenile: 'Appropriately sized frozen/thawed hopper or rat fuzzy every 5–7 days',
          adult: 'F/T rat pup or small adult rat (girth equal to widest mid-body) every 10–14 days',
          supplements: 'No external powder needed; whole rodents supply complete skeletal & organ nutrients'
        },
        hydration: {
          humidity: '60%–65% ambient RH (spike to 75%–80% during active ecdysis / shedding)',
          waterSource: 'Heavy ceramic water bowl large enough for the snake to fully submerge'
        },
        warnings: [
          'Humidity below 55% causes stuck shedding (especially retained eye spectacles) and respiratory wheezing.',
          'NEVER use heat pads without a digital probe thermostat — unregulated mats exceed 125°F and cause fatal burns.',
          'Never handle your python within 48 hours of feeding to prevent stress-induced regurgitation.'
        ]
      },
      'leopard-gecko': {
        name: 'Common Leopard Gecko',
        scientific: 'Eublepharis macularius',
        difficulty: 'Beginner',
        lifespan: '15–20 Years',
        activity: 'Crepuscular (Active at Dawn & Dusk)',
        image: 'assets/images/leopard-gecko.jpg',
        guideId: 'leopard-gecko-care',
        origin: 'Rocky Deserts & Grasslands of Afghanistan, Pakistan & India',
        enclosure: {
          size: '20 Gallon Long (30"×12"×12") Minimum; 36"×18"×18" Preferred',
          orientation: 'Horizontal Terrestrial with Minimum 3 Distinct Hides',
          substrate: 'Textured slate tile, paper towels, or 70/30 organic topsoil & washed play sand mix',
          ventilation: 'Full screen wire top with unobstructed airflow'
        },
        thermal: {
          basking: '88°F–92°F floor temperature on warm hide surface',
          warmSide: '85°F–88°F ambient warm side',
          coolSide: '72°F–76°F cool hide retreat',
          nightDrop: '68°F–72°F night drop'
        },
        uvb: {
          zone: 'Ferguson Zone 1 (UVI 0.5–1.2)',
          bulb: 'Arcadia ShadeDweller T5 7% or linear T5 HO 5.0 (2.4% for albino morphs)',
          distance: '10–12 inches above substrate surface',
          cycle: '12h day / 12h night cycle'
        },
        nutrition: {
          dietType: 'Strict Insectivore (Live Feeders Only)',
          juvenile: '5–8 small gut-loaded Dubia roaches or crickets dusted daily',
          adult: '6–8 large gut-loaded Dubia roaches, crickets, or mealworms 2–3 times weekly',
          supplements: 'Small cap of pure calcium in tank 24/7; Calcium+D3 2x/mo; Multivitamin 1x/mo'
        },
        hydration: {
          humidity: '30%–40% ambient room humidity',
          waterSource: 'Shallow water dish; dedicated enclosed humid hide packed with moist sphagnum moss 24/7'
        },
        warnings: [
          'A moist humid hide is MANDATORY — shedding skin constricts around toes causing necrosis and permanent digit loss.',
          'NEVER feed wild-caught insects — high probability of lethal pesticide toxicity and parasites.',
          'Avoid high-calcium loose sand substrates that cause intestinal impaction in young geckos.'
        ]
      },
      'crested-gecko': {
        name: 'New Caledonian Crested Gecko',
        scientific: 'Correlophus ciliatus',
        difficulty: 'Beginner',
        lifespan: '15–20 Years',
        activity: 'Nocturnal / Arboreal Climber',
        image: 'https://images.unsplash.com/photo-1769986289575-d402e93d5885?w=800&q=80',
        guideId: 'crested-gecko-care',
        origin: 'Subtropical Rainforest Canopy of Southern New Caledonia',
        enclosure: {
          size: '20 Gallon Tall (18"×18"×24") Minimum; 18"×18"×36" Ideal',
          orientation: 'Vertical Arboreal with Heavy Foliage & Cork Bark Ledges',
          substrate: 'Bioactive tropical ABG mix, coconut coir, or cypress mulch with drainage layer',
          ventilation: 'Screen top with front ventilation strip'
        },
        thermal: {
          basking: '75°F–78°F gentle warm spot (optional; only in cold climates)',
          warmSide: '72°F–78°F (standard household room temperature)',
          coolSide: '68°F–72°F lower foliage retreat',
          nightDrop: '65°F–70°F safe natural night drop'
        },
        uvb: {
          zone: 'Ferguson Zone 1 (UVI 0.4–1.0)',
          bulb: 'Linear T5 ShadeDweller 2.4% or 7% (mounted above mesh)',
          distance: '10–12 inches from topmost basking vine',
          cycle: '10–12 hours photoperiod'
        },
        nutrition: {
          dietType: 'Frugivore & Insectivore (Complete Meal Powder)',
          juvenile: 'Fresh prepared Crested Gecko Diet (Pangea/Repashy) every night; 2–3 small live insects weekly',
          adult: 'Fresh prepared CGD powder 3 times weekly; 3–4 gut-loaded dubia roaches or crickets weekly',
          supplements: 'CGD powders are 100% complete with balanced calcium & D3; lightly dust feeder insects'
        },
        hydration: {
          humidity: '60%–80% RH (allow daily dry-out to 50% between mistings to prevent respiratory mold)',
          waterSource: 'Heavy evening foliage misting for droplet drinking + shallow elevated ledge water cup'
        },
        warnings: [
          'CRITICAL: Temperatures above 82°F (28°C) are rapidly FATAL due to severe heat stroke. Keep in air-conditioned rooms.',
          'Crested geckos drop tails under extreme stress and DO NOT regenerate them ("frog butt" geckos live normally).',
          'Never keep humidity at 100% constantly; a daily dry-out cycle is essential to prevent bacterial lung rot.'
        ]
      },
      'veiled-chameleon': {
        name: 'Veiled Chameleon',
        scientific: 'Chamaeleo calyptratus',
        difficulty: 'Advanced',
        lifespan: '5–8 Years',
        activity: 'Diurnal / Arboreal Canopy Specialist',
        image: 'https://images.unsplash.com/photo-1621150538602-2351d4f7dc2f?w=800&q=80',
        guideId: 'veiled-chameleon-care',
        origin: 'Coastal & Mountain Plateau Regions of Yemen and Saudi Arabia',
        enclosure: {
          size: '24"×24"×48" Full-Mesh Screen Enclosure Minimum',
          orientation: 'Vertical Arboreal with Dense Live Plants (Pothos, Ficus, Schefflera)',
          substrate: 'Bare bottom with easy-clean paper towel (loose substrate poses high ingestion risk)',
          ventilation: '100% Screen wire mesh (NO glass aquariums allowed)'
        },
        thermal: {
          basking: '85°F–90°F (Males) / 80°F–85°F (Females to prevent dangerous over-ovulation)',
          warmSide: '78°F–82°F mid-level foliage ambient',
          coolSide: '70°F–75°F lower retreat zone',
          nightDrop: '60°F–68°F (essential natural drop for metabolic recovery & deep sleep)'
        },
        uvb: {
          zone: 'Ferguson Zone 3 (UVI 2.6–3.5)',
          bulb: 'Linear T5 HO 6.0 or 10.0 (spanning full top screen width)',
          distance: '10–12 inches from topmost basking vine',
          cycle: '12h day / 12h night photoperiod'
        },
        nutrition: {
          dietType: 'Insectivore with Herbivorous Plant Foraging',
          juvenile: '8–12 small gut-loaded insects (Dubia, crickets, silkworms) daily',
          adult: '5–6 large gut-loaded insects every other day + organic safe greens (hibiscus, dandelion, kale)',
          supplements: 'Plain calcium without D3 every feed; Calcium+D3 2x/month; Multivitamin 1–2x/month'
        },
        hydration: {
          humidity: '50%–70% ambient (spike to 80% with mist, drop to 40% midday)',
          waterSource: 'Automated dripper dripping onto broad non-toxic leaves + 2–3 daily fine mistings (2–3 mins each)'
        },
        warnings: [
          'Chameleons DO NOT drink from standing water bowls — they will dehydrate while sitting next to full dishes.',
          'Glass aquariums trap stagnant humid air and cause fatal upper respiratory infections (URI). Always use screen cages.',
          'Strictly a visual observation pet; handling causes extreme chronic immune suppression and stress.'
        ]
      },
      'blue-tongued-skink': {
        name: 'Northern Blue-Tongued Skink',
        scientific: 'Tiliqua scincoides intermedia',
        difficulty: 'Intermediate',
        lifespan: '15–20+ Years',
        activity: 'Diurnal / Terrestrial Burrower',
        image: 'assets/images/blue-tongued-skink.jpg',
        guideId: 'blue-tongued-skink-care',
        origin: 'Semi-Arid Woodlands & Savannas of Northern Australia',
        enclosure: {
          size: '120 Gallon (48"×24"×24") Minimum for 1 Adult',
          orientation: 'Horizontal Terrestrial Vivarium with Deep Bedding',
          substrate: '4–6 inches deep cypress mulch, coconut husk, or organic topsoil/sphagnum mix for burrowing',
          ventilation: 'Low-to-moderate cross-ventilation'
        },
        thermal: {
          basking: '95°F–100°F surface temperature on flat stone or slate',
          warmSide: '82°F–88°F warm ambient',
          coolSide: '75°F–80°F cool hide retreat',
          nightDrop: '68°F–72°F night ambient'
        },
        uvb: {
          zone: 'Ferguson Zone 2–3 (UVI 1.5–3.0)',
          bulb: 'Linear T5 HO 10.0 or 6.0 mounted overhead',
          distance: '12–15 inches above basking slate',
          cycle: '12h on / 12h off'
        },
        nutrition: {
          dietType: 'True Omnivore (50% Greens / 40% Protein / 10% Fruit)',
          juvenile: 'Eat daily: 60% protein (insects, snails, turkey) + 40% finely chopped greens',
          adult: 'Eat 2–3x weekly: 50% dark greens/squash + 40% protein (dubia, snails, high-end dog food) + 10% fruit treat',
          supplements: 'Calcium without D3 at every other feeding; Calcium+D3 2x/month; Multivitamin 2x/month'
        },
        hydration: {
          humidity: '40%–60% RH for Northerns (maintain 60%–80% for Indonesian species)',
          waterSource: 'Heavy, tip-proof ceramic water bowl large and low enough for easy access'
        },
        warnings: [
          'Substrate MUST be 4–6" deep — skinks have an instinctive psychological need to burrow to feel secure.',
          'Check toes after every shed cycle: retained skin rings can constrict and sever digits.',
          'Never feed avocados, onion, garlic, rhubarb, or dog food with grain fillers.'
        ]
      }
    };

    function renderSpecies(key) {
      const sp = SPECIES_CARE_DB[key];
      if (!sp) return;

      // Update Tab active states
      const tabBtns = tabsContainer.querySelectorAll('[data-species-tab]');
      tabBtns.forEach(btn => {
        const isCurrent = btn.getAttribute('data-species-tab') === key;
        btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        btn.classList.toggle('active', isCurrent);
        if (isCurrent) {
          btn.style.background = 'var(--clr-green)';
          btn.style.color = '#fff';
          btn.style.borderColor = 'var(--clr-border)';
          btn.style.transform = 'translateY(-2px)';
        } else {
          btn.style.background = 'var(--clr-surface)';
          btn.style.color = 'var(--clr-text)';
          btn.style.borderColor = 'var(--clr-border)';
          btn.style.transform = 'none';
        }
      });

      // Render Display HTML
      panelContainer.innerHTML = `
        <div class="species-telemetry-card" style="background: var(--clr-surface); border: 2px solid var(--clr-border); border-radius: 12px; box-shadow: var(--shadow-md); padding: clamp(1.5rem, 3vw, 2.5rem); margin-top: 1.5rem; transition: all 0.3s ease;">
          
          <!-- Header Banner -->
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 1.5rem; border-bottom: 2px solid var(--clr-border); padding-bottom: 1.5rem; margin-bottom: 2rem;">
            <div>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                <span class="sticker sticker--green" style="font-size: 0.75rem; text-transform: uppercase;">${sp.difficulty}</span>
                <span class="sticker" style="background: var(--clr-yellow); color: var(--clr-ink); font-size: 0.75rem;">${sp.activity}</span>
                <span class="text-mono" style="font-size: 0.8rem; color: var(--clr-text-sub); border: 1px solid var(--clr-border); padding: 0.2rem 0.5rem; border-radius: 4px;">Lifespan: ${sp.lifespan}</span>
              </div>
              <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: clamp(1.8rem, 4vw, 2.75rem); margin: 0; color: var(--clr-text); line-height: 1.15;">
                ${sp.name}
              </h2>
              <p style="font-style: italic; font-family: 'Space Mono', monospace; font-size: 1rem; color: var(--clr-text-muted); margin-top: 0.25rem;">
                ${sp.scientific} &bull; ${sp.origin}
              </p>
            </div>
            
            <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
              <a href="guide-detail.html?id=${sp.guideId}" class="btn btn--primary" style="white-space: nowrap; color: #fff !important;">
                Read Full Guide &rarr;
              </a>
              <a href="products.html" class="btn btn--outline" style="white-space: nowrap;">
                Shop Habitat &rarr;
              </a>
            </div>
          </div>

          <!-- Top Bento: Photo & Enclosure Telemetry -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
            
            <!-- Photo & Overview -->
            <div style="position: relative; border-radius: 8px; overflow: hidden; border: 1px solid var(--clr-border); box-shadow: 0 4px 12px rgba(0,0,0,0.08); max-height: 320px;">
              <img src="${sp.image}" alt="${sp.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" loading="lazy">
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%); padding: 1.25rem 1rem 0.75rem; color: #fff;">
                <span style="font-family: 'Space Mono', monospace; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--clr-yellow); font-weight: bold;">Verified Husbandry Standard</span>
                <p style="margin: 0.2rem 0 0; font-size: 0.85rem; opacity: 0.9;">100% captive-bred parameters tested by ZILL veterinary specialists.</p>
              </div>
            </div>

            <!-- Panel 1: Enclosure Architecture -->
            <div style="background: var(--clr-bg); border: 1px solid var(--clr-border); border-radius: 8px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                  <span style="display: inline-block; width: 10px; height: 10px; background: var(--clr-green); border-radius: 50%;"></span>
                  <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.25rem; margin: 0; color: var(--clr-text);">1. Enclosure Specifications</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.95rem;">
                  <div><strong style="color: var(--clr-text);">Minimum Volume:</strong> <span style="color: var(--clr-text-sub);">${sp.enclosure.size}</span></div>
                  <div><strong style="color: var(--clr-text);">Architecture:</strong> <span style="color: var(--clr-text-sub);">${sp.enclosure.orientation}</span></div>
                  <div><strong style="color: var(--clr-text);">Substrate:</strong> <span style="color: var(--clr-text-sub);">${sp.enclosure.substrate}</span></div>
                  <div><strong style="color: var(--clr-text);">Airflow:</strong> <span style="color: var(--clr-text-sub);">${sp.enclosure.ventilation}</span></div>
                </div>
              </div>
            </div>

          </div>

          <!-- Bottom Bento 3-Col Grid: Thermal, UVB, Nutrition -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            
            <!-- Panel 2: Thermal Gradient -->
            <div style="background: var(--clr-bg); border: 1px solid var(--clr-border); border-radius: 8px; padding: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <span style="display: inline-block; width: 10px; height: 10px; background: #e76f51; border-radius: 50%;"></span>
                <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; margin: 0; color: var(--clr-text);">2. Thermal Gradient</h3>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.9rem;">
                <div style="background: var(--clr-surface); padding: 0.6rem; border-radius: 4px; border-left: 3px solid #e76f51;">
                  <strong style="color: var(--clr-text); display: block; font-size: 0.8rem; text-transform: uppercase;">Basking Surface:</strong>
                  <span style="color: var(--clr-text-sub); font-size: 0.95rem; font-weight: bold;">${sp.thermal.basking}</span>
                </div>
                <div><strong style="color: var(--clr-text);">Warm Ambient:</strong> <span style="color: var(--clr-text-sub);">${sp.thermal.warmSide}</span></div>
                <div><strong style="color: var(--clr-text);">Cool Retreat:</strong> <span style="color: var(--clr-text-sub);">${sp.thermal.coolSide}</span></div>
                <div><strong style="color: var(--clr-text);">Night Drop:</strong> <span style="color: var(--clr-text-sub);">${sp.thermal.nightDrop}</span></div>
              </div>
            </div>

            <!-- Panel 3: UVB Lighting Index -->
            <div style="background: var(--clr-bg); border: 1px solid var(--clr-border); border-radius: 8px; padding: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <span style="display: inline-block; width: 10px; height: 10px; background: var(--clr-yellow); border-radius: 50%;"></span>
                <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; margin: 0; color: var(--clr-text);">3. UVB Index & Lighting</h3>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.9rem;">
                <div style="background: var(--clr-surface); padding: 0.6rem; border-radius: 4px; border-left: 3px solid var(--clr-yellow);">
                  <strong style="color: var(--clr-text); display: block; font-size: 0.8rem; text-transform: uppercase;">Radiation Index:</strong>
                  <span style="color: var(--clr-text-sub); font-size: 0.95rem; font-weight: bold;">${sp.uvb.zone}</span>
                </div>
                <div><strong style="color: var(--clr-text);">Recommended Lamp:</strong> <span style="color: var(--clr-text-sub);">${sp.uvb.bulb}</span></div>
                <div><strong style="color: var(--clr-text);">Basking Distance:</strong> <span style="color: var(--clr-text-sub);">${sp.uvb.distance}</span></div>
                <div><strong style="color: var(--clr-text);">Photoperiod:</strong> <span style="color: var(--clr-text-sub);">${sp.uvb.cycle}</span></div>
              </div>
            </div>

            <!-- Panel 4: Dietary Regimen -->
            <div style="background: var(--clr-bg); border: 1px solid var(--clr-border); border-radius: 8px; padding: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                <span style="display: inline-block; width: 10px; height: 10px; background: var(--clr-green); border-radius: 50%;"></span>
                <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; margin: 0; color: var(--clr-text);">4. Nutrition & Hydration</h3>
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.9rem;">
                <div><strong style="color: var(--clr-text);">Dietary Profile:</strong> <span style="color: var(--clr-text-sub);">${sp.nutrition.dietType}</span></div>
                <div><strong style="color: var(--clr-text);">Juvenile Feeding:</strong> <span style="color: var(--clr-text-sub);">${sp.nutrition.juvenile}</span></div>
                <div><strong style="color: var(--clr-text);">Adult Schedule:</strong> <span style="color: var(--clr-text-sub);">${sp.nutrition.adult}</span></div>
                <div><strong style="color: var(--clr-text);">Supplements:</strong> <span style="color: var(--clr-text-sub);">${sp.nutrition.supplements}</span></div>
                <div><strong style="color: var(--clr-text);">Hydration & RH:</strong> <span style="color: var(--clr-text-sub);">${sp.hydration.humidity} &bull; ${sp.hydration.waterSource}</span></div>
              </div>
            </div>

          </div>

          <!-- Critical Husbandry Warnings -->
          <div style="background: rgba(255, 197, 61, 0.12); border-left: 4px solid var(--clr-yellow); border-radius: 6px; padding: 1.25rem 1.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: #b58100;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <strong style="font-family: 'Space Grotesk', sans-serif; font-size: 1.05rem; color: var(--clr-text); text-transform: uppercase; letter-spacing: 0.05em;">
                Critical ${sp.name} Husbandry Warnings &amp; Red Flags
              </strong>
            </div>
            <ul style="margin: 0; padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.4rem; color: var(--clr-text-sub); font-size: 0.95rem; line-height: 1.5;">
              ${sp.warnings.map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>

        </div>
      `;
    }

    // Attach click events
    tabsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-species-tab]');
      if (!btn) return;
      const key = btn.getAttribute('data-species-tab');
      renderSpecies(key);
    });

    // Keyboard navigation (Left / Right Arrow)
    tabsContainer.addEventListener('keydown', (e) => {
      const tabs = Array.from(tabsContainer.querySelectorAll('[data-species-tab]'));
      const activeIdx = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
      if (activeIdx === -1) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = tabs[(activeIdx + 1) % tabs.length];
        next.focus();
        renderSpecies(next.getAttribute('data-species-tab'));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = tabs[(activeIdx - 1 + tabs.length) % tabs.length];
        prev.focus();
        renderSpecies(prev.getAttribute('data-species-tab'));
      }
    });

    // Initial render
    renderSpecies('bearded-dragon');
  }

});

