/**
 * faq.js — FAQ Accordion
 * Custom Furniture Upholstery Shop
 */

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => toggleFAQ(item));
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ(item);
      }
    });
  });

  function toggleFAQ(item) {
    const isOpen = item.classList.contains('open');

    // Close all
    faqItems.forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it wasn't already open)
    if (!isOpen) {
      item.classList.add('open');
      item.querySelector('.faq-question')?.setAttribute('aria-expanded', 'true');
    }
  }
}

export { initFAQ };
