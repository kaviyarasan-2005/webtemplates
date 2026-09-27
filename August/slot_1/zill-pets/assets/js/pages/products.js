/**
 * products.js
 * Handles products grid filtering, searching, sorting, and detail page population.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the products list page or the product detail page
  const gridContainer = document.getElementById('product-grid');
  const detailTitle = document.getElementById('detail-title');

  if (gridContainer) {
    initProductsPage();
  } else if (detailTitle) {
    initProductDetailPage();
  }
});

// ==========================================
// PRODUCTS LIST PAGE
// ==========================================
function initProductsPage() {
  const gridContainer = document.getElementById('product-grid');
  const noResults = document.getElementById('no-results');
  const searchInput = document.getElementById('product-search');
  const sortSelect = document.getElementById('product-sort');
  const filterPills = document.querySelectorAll('.filter-pill');

  // Fallback data if ZILL_PRODUCTS is missing
  let products = (typeof ZILL_PRODUCTS !== 'undefined') ? [...ZILL_PRODUCTS] : getMockProducts();
  
  let currentFilter = 'all';
  let currentSearch = '';
  let currentSort = 'featured';

  // Render Initial Grid
  renderGrid(products);

  // Filter Pills Event
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('filter-pill--active'));
      pill.classList.add('filter-pill--active');
      currentFilter = pill.dataset.filter;
      applyFilters();
    });
  });

  // Search Input Event
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentSearch = e.target.value.trim().toLowerCase();
        applyFilters();
      }, 300);
    });
  }

  // Sort Select Event
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFilters();
    });
  }

  function applyFilters() {
    let filtered = products.filter(p => {
      const matchFilter = currentFilter === 'all' || p.category === currentFilter;
      const matchSearch = currentSearch === '' || p.name.toLowerCase().includes(currentSearch) || p.category.toLowerCase().includes(currentSearch);
      return matchFilter && matchSearch;
    });

    if (currentSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } // 'featured' keeps original order mostly

    renderGrid(filtered);
    
    // Trigger main.js reflow animation if available
    if (typeof window.filterReflow === 'function') {
      window.filterReflow(gridContainer);
    }
  }

  function renderGrid(data) {
    gridContainer.innerHTML = '';
    if (data.length === 0) {
      gridContainer.style.display = 'none';
      if (noResults) noResults.style.display = 'block';
      return;
    }

    gridContainer.style.display = 'grid'; // .grid-4
    if (noResults) noResults.style.display = 'none';

    data.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'card reveal reveal--visible';
      card.style.animationDelay = `${(idx % 4) * 80}ms`;
      card.dataset.category = p.category;
      
      const badgeHtml = p.badge ? `<div class="sticker sticker--absolute" style="top:10px;left:10px;transform:rotate(-5deg);">${p.badge}</div>` : '';
      const priceVal = typeof p.price === 'number' ? p.price.toFixed(2) : '0.00';
      
      card.innerHTML = `
        <div class="card__img-wrap" style="position:relative; border-bottom: 2px solid var(--clr-border); overflow:hidden; aspect-ratio:1/1;">
          ${badgeHtml}
          <img src="${p.image}" alt="${p.name}" class="card__img" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div class="card__body" style="padding: 1.5rem; display:flex; flex-direction:column; gap:0.5rem; flex:1;">
          <span class="card__tag" style="font-family:'Space Mono',monospace; font-size:0.75rem; text-transform:uppercase; color:var(--clr-text-sub);">${p.category}</span>
          <h3 class="card__title" style="margin:0; font-size:1.25rem;">${p.name}</h3>
          <div class="price-tag" style="font-family:'Space Mono',monospace; font-weight:bold; font-size:1.1rem; margin-top:auto;">$${priceVal}</div>
          <a href="product-detail.html?id=${p.id}" class="card__link btn btn--sm btn--outline" style="margin-top:1rem; text-align:center;">View →</a>
        </div>
      `;
      gridContainer.appendChild(card);
    });
  }
}

// ==========================================
// PRODUCT DETAIL PAGE
// ==========================================
function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  let products = (typeof ZILL_PRODUCTS !== 'undefined') ? ZILL_PRODUCTS : getMockProducts();
  
  // Find product or default to first
  let product = products.find(p => p.id === productId);
  if (!product) {
    product = products[0]; // fallback to Bearded Dragon
  }

  // Populate elements
  const elCurrent = document.getElementById('breadcrumb-current');
  const elTitle = document.getElementById('detail-title');
  const elImg = document.getElementById('detail-img');
  const elPrice = document.getElementById('detail-price');
  const elDesc = document.getElementById('detail-desc');
  const elCategory = document.getElementById('detail-category');
  const elSticker = document.getElementById('detail-sticker');
  const elSpecs = document.getElementById('detail-specs');

  if (elCurrent) elCurrent.textContent = product.name;
  if (elTitle) elTitle.textContent = product.name;
  if (elImg) {
    elImg.src = product.image;
    elImg.alt = product.name;
  }
  if (elPrice) elPrice.textContent = `$${product.price.toFixed(2)}`;
  if (elDesc) elDesc.textContent = product.description || `Premium quality ${product.name} bred or curated by experts.`;
  if (elCategory) elCategory.textContent = product.category.toUpperCase();
  
  if (elSticker && product.badge) {
    elSticker.textContent = product.badge;
    elSticker.style.display = 'inline-block';
  } else if (elSticker) {
    elSticker.style.display = 'none';
  }

  // Specs
  if (elSpecs) {
    let specs = [];
    
    if (product.category === 'reptile') {
      specs = [
        { 
          label: 'Temperament', 
          value: product.temperament || 'Docile', 
          icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>' 
        },
        { 
          label: 'Size', 
          value: product.size || 'Medium', 
          icon: '<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' 
        },
        { 
          label: 'Diet', 
          value: product.diet || 'Omnivore', 
          icon: '<svg viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>' 
        },
        { 
          label: 'Difficulty', 
          value: product.careLevel || product.difficulty || 'Beginner', 
          icon: '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' 
        }
      ];
    } else {
      specs = [
        { 
          label: 'Material', 
          value: 'Premium Grade', 
          icon: '<svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>' 
        },
        { 
          label: 'Size', 
          value: product.size || 'Standard', 
          icon: '<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>' 
        },
        { 
          label: 'Durability', 
          value: 'High / Vet-Tested', 
          icon: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>' 
        },
        { 
          label: 'Difficulty', 
          value: product.careLevel || 'Beginner', 
          icon: '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' 
        }
      ];
    }

    elSpecs.innerHTML = specs.map(s => `
      <div class="spec-row">
        <div class="spec-row__icon">${s.icon}</div>
        <div>
          <div class="spec-row__label">${s.label}</div>
          <div class="spec-row__value">${s.value}</div>
        </div>
      </div>
    `).join('');
  }

  // Initialize qty stepper if function exists
  if (typeof window.initQtyStepper === 'function') {
    window.initQtyStepper();
  }

  // Related Items
  const relatedGrid = document.getElementById('related-grid');
  if (relatedGrid) {
    const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
    // If not enough related, just get random ones
    while(related.length < 3 && products.length > related.length + 1) {
      let rand = products[Math.floor(Math.random() * products.length)];
      if (!related.includes(rand) && rand.id !== product.id) {
        related.push(rand);
      }
    }
    
    relatedGrid.innerHTML = related.map((p, idx) => `
      <div class="card reveal reveal--visible" data-delay="${idx * 80}">
        <div class="card__img-wrap" style="position:relative; border-bottom: 2px solid var(--clr-border); overflow:hidden; aspect-ratio:1/1;">
          <img src="${p.image}" alt="${p.name}" class="card__img" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div class="card__body" style="padding: 1.5rem; display:flex; flex-direction:column; gap:0.5rem; flex:1;">
          <span class="card__tag" style="font-family:'Space Mono',monospace; font-size:0.75rem; text-transform:uppercase; color:var(--clr-text-sub);">${p.category}</span>
          <h3 class="card__title" style="margin:0; font-size:1.25rem;">${p.name}</h3>
          <div class="price-tag" style="font-family:'Space Mono',monospace; font-weight:bold; font-size:1.1rem; margin-top:auto;">$${typeof p.price === 'number' ? p.price.toFixed(2) : '0.00'}</div>
          <a href="product-detail.html?id=${p.id}" class="card__link btn btn--sm btn--outline" style="margin-top:1rem; text-align:center;">View →</a>
        </div>
      </div>
    `).join('');
  }
}

// Fallback Mock Data
function getMockProducts() {
  return [
    { id: '1', name: 'Bearded Dragon', category: 'reptile', price: 150, image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&q=80', badge: 'Best Seller' },
    { id: '2', name: 'Ball Python', category: 'reptile', price: 200, image: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=600&q=80' },
    { id: '3', name: 'Crested Gecko', category: 'reptile', price: 80, image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&q=80', badge: 'Staff Pick' },
    { id: '4', name: '40G PVC Enclosure', category: 'habitat', price: 250, image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=600&q=80' },
    { id: '5', name: 'Bioactive Kit', category: 'habitat', price: 90, image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&q=80' },
    { id: '6', name: 'Live Crickets (500ct)', category: 'feeder', price: 25, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', badge: 'Subscribe' },
    { id: '7', name: 'UVB Lamp', category: 'supply', price: 45, image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80' },
    { id: '8', name: 'Calcium Supplement', category: 'supply', price: 15, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80' }
  ];
}
