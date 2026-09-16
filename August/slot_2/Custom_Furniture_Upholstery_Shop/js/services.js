/**
 * services.js — Services Page specific scripts
 * Custom Furniture Upholstery Shop
 */
import { initPageNewsletter } from './form.js';
import { initFAQ } from './faq.js';

function initServices() {
  initFAQ();
  initPageNewsletter('services-newsletter-form', 'sv-nl-result');
  
  // Smooth scroll for service links
  const serviceLinks = document.querySelectorAll('.category-list a[href^="#"]');
  serviceLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Update active state
          serviceLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  // Highlight active category based on scroll position
  const sections = document.querySelectorAll('.service-detail-section');
  if (sections.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.scrollY;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      if (current) {
        serviceLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
          }
        });
      }
    }, { passive: true });
  }
}

export { initServices };
