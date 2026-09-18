/**
 * home1.js — Home Page 1 specific scripts
 * Custom Furniture Upholstery Shop
 */
import { initBASliders, initCarousel } from './gallery.js';

function initHome1() {
  initBASliders();
  initCarousel('testimonials-carousel');
  initNewsletterHome1();
  initCounters();
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target || el.innerText.replace(/[^0-9]/g, ''));
        const suffix = el.innerText.replace(/[0-9]/g, '');
        let count = 0;
        const duration = 2000; 
        const inc = target / (duration / 16);
        
        const update = () => {
          count += inc;
          if (count < target) {
            el.innerText = Math.ceil(count) + suffix;
            requestAnimationFrame(update);
          } else {
            el.innerText = target + suffix;
          }
        };
        update();
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(c => observer.observe(c));
}

function initNewsletterHome1() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('nl-email');
    if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailInput?.classList.add('error');
      return;
    }
    emailInput.classList.remove('error');
    const btn = form.querySelector('#newsletter-submit');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg> Subscribed!';
    btn.style.background = '#4CAF50';
    form.reset();
  });
}

export { initHome1 };
