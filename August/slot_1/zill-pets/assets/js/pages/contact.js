const ZILL_POLICY_ITEMS = (typeof ZILL_POLICY !== 'undefined' && ZILL_POLICY.length > 0) ? ZILL_POLICY : [
  { id: 'coverage-window', title: "Coverage Window", body: "We offer a 7-day health guarantee on all captive-bred reptiles. If your animal shows signs of illness within 7 days of arrival, contact us immediately for assistance." },
  { id: 'exclusions', title: "Exclusions & Limitations", body: "Our guarantee does not cover injuries sustained after unboxing, illnesses resulting from improper husbandry, or refusal to eat due to normal acclimation stress." },
  { id: 'shipping-claims', title: "Shipping & Live-Arrival Claims", body: "In the rare event of a DOA (Dead on Arrival), you must notify us with photographic evidence within 2 hours of delivery as recorded by the carrier. Failure to do so voids the live-arrival guarantee." },
  { id: 'feeder-guarantee', title: "Feeder Insect Guarantee", body: "Feeder insects have a live-arrival guarantee only. We ensure at least 90% viability upon arrival. Notify us within 24 hours if mortality exceeds this threshold." },
  { id: 'refund-policy', title: "Refunds & Store Credit", body: "Approved claims will be resolved via store credit or a replacement animal of equal value. Shipping costs are non-refundable." }
];

document.addEventListener('DOMContentLoaded', () => {
  // Populate accordion if it exists
  const accordionContainer = document.getElementById('policy-accordion');
  if (accordionContainer) {
    accordionContainer.innerHTML = '';
    ZILL_POLICY_ITEMS.forEach((policy, index) => {
      const item = document.createElement('div');
      item.className = 'accordion__item';
      item.innerHTML = `
        <button class="accordion__trigger" aria-expanded="false" aria-controls="policy-panel-${index}">
          <span>${policy.title}</span>
          <span class="accordion__icon">+</span>
        </button>
        <div class="accordion__panel" id="policy-panel-${index}">
          <div class="accordion__content">
            <p>${policy.body || policy.content}</p>
          </div>
        </div>
      `;
      accordionContainer.appendChild(item);
    });
    
    // Attach click listeners to generated triggers
    accordionContainer.querySelectorAll('.accordion__trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion__item');
        const isOpen = item.classList.contains('accordion__item--open');

        // Close all others in same accordion
        accordionContainer.querySelectorAll('.accordion__item--open').forEach(open => {
          if (open !== item) {
            open.classList.remove('accordion__item--open');
            open.querySelector('.accordion__trigger')?.setAttribute('aria-expanded', 'false');
          }
        });

        item.classList.toggle('accordion__item--open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  // Handle Contact Form
  const contactForm = document.getElementById('contact-form');
  const successStamp = document.getElementById('contact-success');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const requiredInputs = contactForm.querySelectorAll('[required]');
      
      requiredInputs.forEach(input => {
        const errorMsg = input.nextElementSibling;
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#D32F2F';
          if (errorMsg && errorMsg.classList.contains('form-error')) {
            errorMsg.classList.add('is-visible');
            errorMsg.textContent = 'This field is required.';
          }
        } else {
          input.style.borderColor = '';
          if (errorMsg && errorMsg.classList.contains('form-error')) {
            errorMsg.classList.remove('is-visible');
          }
        }
      });
      
      if (isValid) {
        // Simulate sending
        contactForm.style.display = 'none';
        if (successStamp) {
          successStamp.classList.add('is-visible');
        }
      }
    });
    
    // Clear errors on input
    contactForm.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.style.borderColor = '';
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('form-error')) {
          errorMsg.classList.remove('is-visible');
        }
      });
    });
  }
});
