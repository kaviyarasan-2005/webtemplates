document.addEventListener('DOMContentLoaded', () => {
  const isDetailPage = document.getElementById('guide-title') !== null;

  if (isDetailPage) {
    loadGuideDetail();
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
        difficulty: 'Beginner',
        readTime: '10 Min Read',
        image: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=1600&q=80',
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
        difficulty: 'Beginner',
        readTime: '15 Min Read',
        image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1600&q=80',
        intro: 'Bearded dragons are incredibly resilient and full of personality, but they require a very specific setup to mimic their native Australian environment.',
        sections: [
          { id: 'lighting', title: 'Lighting & UVB', content: '<p>The most common mistake new keepers make is underestimating the need for intense, quality UVB. It is not just light—it is literal life support for a bearded dragon.</p>' },
          { id: 'diet', title: 'Diet & Feeding', content: '<p>Juveniles need mostly insects (80%) and some greens (20%). Adults need the opposite: 80% greens and veggies, 20% insects.</p>' }
        ]
      },
      {
        id: 'leopard-gecko-care',
        title: 'Leopard Gecko Care',
        difficulty: 'Beginner',
        readTime: '8 Min Read',
        image: 'https://images.unsplash.com/photo-1567611769761-39d1f5aac3c5?w=1600&q=80',
        intro: 'Leopard geckos are one of the most popular reptile pets. They are hardy, relatively easy to care for, and come in a wide variety of colors (morphs).',
        sections: [
          { id: 'setup', title: 'Enclosure Setup', content: '<p>A 20-gallon long tank is the minimum for one adult leopard gecko. Provide at least three hides: a warm hide, a cool hide, and a humid hide to assist with shedding.</p>' },
          { id: 'diet', title: 'Feeding', content: '<p>Leopard geckos are strictly insectivores. Offer gut-loaded crickets, mealworms, or dubia roaches, dusted with calcium and vitamins.</p>' }
        ]
      },
      {
        id: 'crested-gecko-care',
        title: 'Crested Gecko Care',
        difficulty: 'Beginner',
        readTime: '10 Min Read',
        image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=1600&q=80',
        intro: 'Crested geckos are arboreal wonders that do well at room temperature, making them a fantastic low-maintenance pet.',
        sections: [
          { id: 'environment', title: 'Environment', content: '<p>They require a tall enclosure with plenty of vertical climbing space and foliage. Keep humidity between 50-80% with daily misting.</p>' }
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

});
