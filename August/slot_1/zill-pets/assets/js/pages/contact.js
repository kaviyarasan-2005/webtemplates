const ZILL_POLICY_ITEMS = (typeof ZILL_POLICY !== 'undefined' && ZILL_POLICY.length > 0) ? ZILL_POLICY : [
  { id: 'coverage-window', title: "100% Live-Arrival & 7-Day Extended Health Guarantee", body: "All captive-bred reptiles are backed by our dual-layer guarantee: (1) 100% Live-Arrival upon initial delivery, and (2) an extended 7-Day Health Guarantee (168 hours from delivery timestamp). If your animal shows persistent signs of distress, illness, or genetic defects within this period despite correct husbandry, we will replace the animal or issue store credit." },
  { id: 'delivery-conditions', title: "Delivery & Acceptance Requirements", body: "To maintain guarantee validity, the customer (or a designated adult) must be physically present to receive and sign for the shipment on the carrier's first delivery attempt (typically by 10:30 AM via FedEx Priority Overnight). If held at a certified FedEx Ship Center, the package must be picked up within 4 hours of arrival. Packages left on unattended porches in ambient sun or cold void live-arrival protection." },
  { id: 'doa-claims', title: "Dead on Arrival (DOA) Procedure & 2-Hour Notice Window", body: "In the extremely rare event that an animal arrives deceased or in critical condition, notice must be emailed to support@zillpets.com within strictly 2 hours of the carrier's recorded delivery timestamp. Submissions must include: (1) clear photographs or video of the animal resting on the shipping box with the shipping label fully legible, and (2) your order number." },
  { id: 'husbandry-prerequisites', title: "Enclosure Setup & Husbandry Verification", body: "The 7-Day Health Guarantee requires that the buyer has prepared a species-appropriate habitat adhering to the environmental metrics in ZILL Care Guides (correct thermal gradient, linear UVB where applicable, and humidity). In the event of a health claim, the buyer must provide clear photos of the enclosure showing digital thermometer and hygrometer readings." },
  { id: 'exclusions', title: "Explicit Exclusions & Void Criteria", body: "The guarantee does not cover: (1) physical injuries sustained after unboxing (falls, stepped-on limbs, escapes), (2) thermal burns caused by unregulated heat rocks or mats without probe thermostats, (3) intestinal impactions caused by calcium sand or crushed walnut shells in juveniles, (4) tail drops (autotomy) in geckos occurring post-unboxing, (5) housing with other reptiles, or (6) feeding wild-caught insects." },
  { id: 'weather-shipping', title: "Weather & Climate-Controlled Shipping Protocol", body: "Live reptiles ship exclusively via FedEx Priority Overnight Monday through Wednesday to avoid weekend warehouse holds. Shipments are dispatched only when origin, hub, and destination temperatures are between 38°F and 92°F. Between 32°F–38°F or 92°F–98°F, shipping is restricted to FedEx Ship Center counter pickup. We hold shipments automatically during extreme weather." },
  { id: 'feeder-guarantee', title: "Feeder Insect Viability Guarantee (95%+)", body: "Live feeder insects (Dubia roaches, crickets, hornworms, BSFL) are guaranteed 95%+ viable upon arrival. If transit delays cause mortality exceeding 5%, submit photos of the shipping box and count within 24 hours of delivery for a free reshipment or store credit." },
  { id: 'refund-policy', title: "Claim Resolution, Replacement & Store Credit", body: "Approved live-animal claims are resolved via an immediate replacement specimen of equivalent or higher value, or full store credit for the animal's purchase price. Store credit never expires and can be used on any reptile, habitat, or supply order. Courier shipping fees are non-refundable." }
];

const ENQUIRY_TOPICS = {
  availability: {
    title: 'Animal Availability',
    refLabel: 'Target Species or Morph',
    refPlaceholder: 'e.g., Bearded Dragon (Citrus morph) or Banana Ball Python',
    tip: 'Inquiring about captive-bred reptiles? Tell us which species, age, or morph you are looking for. We can confirm current terrarium stock or reserve a specimen from an upcoming clutch with a 20% refundable deposit.',
    msgPlaceholder: 'Please describe your keeping experience, enclosure readiness, or any specific questions about available bloodlines...',
    dept: 'Animal Availability Desk (orders@zillpets.com)'
  },
  care: {
    title: 'Care Advice',
    refLabel: 'Reptile Species & Care Subject',
    refPlaceholder: 'e.g., Veiled Chameleon hydration & Ferguson Zone 3 UVB',
    tip: 'Our certified herpetologists provide free husbandry advice. Mention your animal\'s age, vivarium dimensions, heating/lighting equipment, and current humidity levels for precise guidance.',
    msgPlaceholder: 'Detail your current enclosure specs, basking gradient, diet routine, or specific shedding/behavioral questions...',
    dept: 'Herpetology Husbandry Desk (care@zillpets.com)'
  },
  products: {
    title: 'Products & Gear',
    refLabel: 'Product Name / Category',
    refPlaceholder: 'e.g., 40-Gallon Bioactive Terrarium Kit or T5 HO UVB 10.0',
    tip: 'Need help choosing the right enclosure, linear UVB fixture, or feeder insect subscription? Let us know what species you are housing and your target space.',
    msgPlaceholder: 'Inquire about product dimensions, habitat compatibility, live feeder recurring shipments, or hardware specifications...',
    dept: 'Products & Habitats Desk (support@zillpets.com)'
  },
  guarantee: {
    title: 'Health Guarantee',
    refLabel: 'Order Number & Specimen',
    refPlaceholder: 'e.g., #ZILL-1048 &bull; Leopard Gecko (Super Hypo Tangerine)',
    tip: 'All captive reptiles are backed by our 100% Live-Arrival & 7-Day Extended Health Guarantee. For transit concerns (2-hr notice) or health inquiries, please include your Order # for expedited priority review.',
    msgPlaceholder: 'Describe your delivery arrival time, specimen condition, acclimation steps taken, or health symptoms observed...',
    dept: 'Health Guarantee & Claims Desk (guarantee@zillpets.com)'
  },
  general: {
    title: 'General Inquiries',
    refLabel: 'Subject',
    refPlaceholder: 'e.g., Showroom visit & weekend handling sessions',
    tip: 'Planning a visit to our Austin showroom, curious about weekend workshops, or have general questions? We look forward to meeting you.',
    msgPlaceholder: 'How can our team help you today?',
    dept: 'Storefront & Customer Desk (hello@zillpets.com)'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Accordions (Policy Accordion on health-guarantee.html & FAQ Accordion on contact.html)
  const policyAccordion = document.getElementById('policy-accordion');
  if (policyAccordion) {
    const existingItems = policyAccordion.querySelectorAll('.accordion__item');
    if (existingItems.length === 0) {
      policyAccordion.innerHTML = '';
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
        policyAccordion.appendChild(item);
      });
    }
  }

  // Attach click listeners to all accordions on the page
  document.querySelectorAll('.accordion').forEach(accordionContainer => {
    accordionContainer.querySelectorAll('.accordion__trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion__item');
        if (!item) return;
        const isOpen = item.classList.contains('accordion__item--open');

        // Close all other panels in the same accordion
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
  });

  // 2. Enquiry Form & Topic Selectors
  const contactForm = document.getElementById('contact-form');
  const successPanel = document.getElementById('contact-success');
  const selectType = document.getElementById('enquiry-type');
  const refLabel = document.getElementById('enquiry-reference-label');
  const refInput = document.getElementById('enquiry-reference');
  const contextTip = document.getElementById('enquiry-context-tip');
  const messageInput = document.getElementById('message');
  const topicButtons = document.querySelectorAll('.enquiry-topic-btn');
  const resetBtn = document.getElementById('btn-reset-enquiry');

  function updateTopicUI(topicKey, scrollIntoView = false) {
    const conf = ENQUIRY_TOPICS[topicKey] || ENQUIRY_TOPICS.general;

    // Update Dropdown
    if (selectType && selectType.value !== topicKey) {
      selectType.value = topicKey;
    }

    // Update Topic Badges
    topicButtons.forEach(btn => {
      const match = btn.getAttribute('data-topic') === topicKey;
      btn.classList.toggle('is-active', match);
      btn.setAttribute('aria-pressed', match ? 'true' : 'false');
    });

    // Update Dynamic Labels & Tips
    if (refLabel) refLabel.textContent = conf.refLabel;
    if (refInput) refInput.placeholder = conf.refPlaceholder;
    if (contextTip) contextTip.innerHTML = conf.tip;
    if (messageInput) messageInput.placeholder = conf.msgPlaceholder;

    if (scrollIntoView) {
      const formEl = document.getElementById('contact-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  // Click on Topic Badges
  topicButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const topic = btn.getAttribute('data-topic');
      if (topic) updateTopicUI(topic, true);
    });
  });

  // Change Dropdown
  if (selectType) {
    selectType.addEventListener('change', () => {
      updateTopicUI(selectType.value, false);
    });
  }

  // 3. Parse URL query params (?type=availability / care / products / guarantee)
  const urlParams = new URLSearchParams(window.location.search);
  const rawType = (urlParams.get('type') || urlParams.get('category') || urlParams.get('topic') || '').toLowerCase();
  const rawItem = urlParams.get('item') || urlParams.get('species') || urlParams.get('product') || urlParams.get('order');

  let initialTopic = 'availability';
  if (rawType.includes('care') || rawType.includes('advice') || rawType.includes('guide')) {
    initialTopic = 'care';
  } else if (rawType.includes('prod') || rawType.includes('gear') || rawType.includes('feeder') || rawType.includes('habitat')) {
    initialTopic = 'products';
  } else if (rawType.includes('guarantee') || rawType.includes('claim') || rawType.includes('health') || rawType.includes('doa')) {
    initialTopic = 'guarantee';
  } else if (rawType.includes('avail') || rawType.includes('animal') || rawType.includes('reptile') || rawType.includes('clutch')) {
    initialTopic = 'availability';
  } else if (rawType.includes('general')) {
    initialTopic = 'general';
  }

  updateTopicUI(initialTopic, Boolean(rawType || rawItem));

  if (rawItem && refInput) {
    refInput.value = rawItem;
  }

  // 4. Form Submission & Validation
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
          }
        } else {
          input.style.borderColor = '';
          if (errorMsg && errorMsg.classList.contains('form-error')) {
            errorMsg.classList.remove('is-visible');
          }
        }
      });

      if (isValid) {
        const nameVal = document.getElementById('name')?.value || 'Valued Keeper';
        const emailVal = document.getElementById('email')?.value || 'your email';
        const topicVal = selectType ? selectType.value : 'general';
        const conf = ENQUIRY_TOPICS[topicVal] || ENQUIRY_TOPICS.general;

        const ticketNum = 'ZILL-ENQ-2026-' + Math.floor(1000 + Math.random() * 9000);
        const ticketEl = document.getElementById('success-ticket-id');
        if (ticketEl) ticketEl.textContent = ticketNum;

        const customMsgEl = document.getElementById('success-custom-msg');
        if (customMsgEl) {
          customMsgEl.innerHTML = `Thank you, <strong>${nameVal}</strong>! Your enquiry regarding <strong>${conf.title}</strong> has been routed directly to our <em>${conf.dept}</em>. A keeper will review your message and reply to <strong>${emailVal}</strong> within 2 business hours.`;
        }

        contactForm.style.display = 'none';
        if (successPanel) {
          successPanel.style.display = 'block';
          successPanel.classList.add('is-visible');
          successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    // Clear error states on input
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

  // 5. Reset button to submit another enquiry
  if (resetBtn && contactForm && successPanel) {
    resetBtn.addEventListener('click', () => {
      contactForm.reset();
      updateTopicUI('availability', false);
      successPanel.style.display = 'none';
      successPanel.classList.remove('is-visible');
      contactForm.style.display = 'block';
      contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
});
