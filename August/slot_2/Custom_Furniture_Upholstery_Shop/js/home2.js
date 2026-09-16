/**
 * home2.js — Home Page 2 specific scripts
 * Custom Furniture Upholstery Shop
 */
import { initBASliders, initCarousel } from './gallery.js';
import { initPageNewsletter } from './form.js';

function initHome2() {
  initBASliders();
  initCarousel('artisan-testimonials');
  initPageNewsletter('home2-newsletter-form', 'h2-nl-result');
}

export { initHome2 };
