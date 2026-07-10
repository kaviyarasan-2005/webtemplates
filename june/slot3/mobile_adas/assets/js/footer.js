/* ============================================
   CALIBRATE ADAS — Footer Injection
   ============================================ */

'use strict';

(() => {
  const isSubpage = window.location.pathname.includes('/pages/') || window.location.pathname.includes('\\pages\\');
  const basePath = isSubpage ? '../' : './';
  const pagesPath = isSubpage ? '' : 'pages/';

  const footerHtml = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand Column -->
          <div class="footer-brand">
            <a href="${basePath}index.html" class="navbar-logo" style="margin-bottom: var(--space-4); text-decoration: none;">
              <div class="logo-icon">
                <i data-lucide="crosshair"></i>
              </div>
              <div class="logo-text">Nexo</div>
            </a>
            <p>Certified Mobile ADAS Calibration & Collision Avoidance Services. Precision alignment for all vehicle makes and models at your collision shop or repair center.</p>
            <div class="footer-social">
              <a href="#" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" aria-label="Youtube">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>
          
          <!-- Quick Links -->
          <div class="footer-col">
            <h4>Quick Links</h4>
            <div class="footer-links">
              <a href="${basePath}index.html" class="footer-link"><i data-lucide="chevron-right"></i> Home 1</a>
              <a href="${pagesPath}home2.html" class="footer-link"><i data-lucide="chevron-right"></i> Home 2</a>
              <a href="${pagesPath}about.html" class="footer-link"><i data-lucide="chevron-right"></i> About Us</a>
              <a href="${pagesPath}pricing.html" class="footer-link"><i data-lucide="chevron-right"></i> Pricing Plans</a>
              <a href="${pagesPath}contact.html" class="footer-link"><i data-lucide="chevron-right"></i> Book Appointment</a>
            </div>
          </div>
          
          <!-- Services -->
          <div class="footer-col">
            <h4>Our Services</h4>
            <div class="footer-links">
              <a href="${pagesPath}services.html?tab=camera" class="footer-link"><i data-lucide="chevron-right"></i> Camera Calibration</a>
              <a href="${pagesPath}services.html?tab=radar" class="footer-link"><i data-lucide="chevron-right"></i> Radar Alignment</a>
              <a href="${pagesPath}services.html?tab=lidar" class="footer-link"><i data-lucide="chevron-right"></i> LiDAR Calibration</a>
              <a href="${pagesPath}services.html?tab=diagnostic" class="footer-link"><i data-lucide="chevron-right"></i> Post-Repair Testing</a>
              <a href="${pagesPath}services.html?tab=mobile" class="footer-link"><i data-lucide="chevron-right"></i> Mobile On-Site Service</a>
            </div>
          </div>
          
          <!-- Contact / Newsletter -->
          <div class="footer-col">
            <h4>Stay Updated</h4>
            <div class="footer-newsletter">
              <p>Subscribe to our newsletter for the latest OEM calibration requirements and industry updates.</p>
              <form class="newsletter-form" onsubmit="event.preventDefault(); alert('Subscribed successfully!');">
                <input type="email" placeholder="Your Email Address" required aria-label="Email Address">
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Bottom copyright bar -->
        <div class="footer-bottom">
          <div class="footer-copyright">
            &copy; ${new Date().getFullYear()} Nexo. All rights reserved. Professional ADAS Solutions.
          </div>
          <button class="back-to-top" aria-label="Back to Top">
            <i data-lucide="chevron-up"></i>
          </button>
        </div>
      </div>
    </footer>
  `;

  const initFooter = () => {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    if (page.includes('dashboard')) {
      return;
    }

    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
      placeholder.outerHTML = footerHtml;
    } else {
      document.body.insertAdjacentHTML('beforeend', footerHtml);
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
  } else {
    initFooter();
  }
})();
