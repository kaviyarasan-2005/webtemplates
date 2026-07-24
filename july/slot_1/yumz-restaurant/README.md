# YUMZ Restaurant Website Template

YUMZ is a modern, bold, and fully responsive HTML5 website template designed specifically for local pizzerias, fast-food restaurants, and casual dining establishments. Built entirely from scratch without any external CSS frameworks, it prioritises high performance, accessibility, and a premium user experience.

## Features

- **11 Complete HTML Pages:** Carefully crafted layouts for every aspect of a restaurant business.
- **Pure Vanilla Tech Stack:** Built with HTML5, CSS3 (using modern Custom Variables), and ES6+ JavaScript. No Tailwind, no Bootstrap — completely custom code.
- **Dark Mode Support:** A sleek, fully realised dark theme (`#121212`) that toggles seamlessly and saves user preference via `localStorage`.
- **RTL (Right-to-Left) Support:** Built-in RTL override stylesheet and toggle for multi-language compatibility (Arabic, Hebrew, etc.).
- **High Performance:** Minimal, modular JavaScript and CSS ensure lightning-fast load times.
- **Accessible (A11Y):** Built with semantic HTML, ARIA attributes, keyboard navigation support, and proper contrast ratios.
- **Responsive Design:** Mobile-first approach that looks stunning on phones, tablets, and large desktop screens.
- **Dynamic Interactions:** Built-in smooth scrolling, Intersection Observer animations, custom modal/lightbox functionality, and live form validation.

## Page Structure

1. **`index.html`** - Home 1 (The Classic Experience)
2. **`home-2.html`** - Home 2 (The Modern Bite, with countdown timers)
3. **`about.html`** - About Us (Timeline, Mission, Team, Careers)
4. **`services.html`** - Menu & Services (Sticky tabs, full menu breakdown)
5. **`service-details.html`** - Product Details (Dynamic price calculator, nutrition tabs)
6. **`pricing.html`** - Pricing & Deals (Combo toggles, catering, loyalty programme)
7. **`blog.html`** - Blog Listing (Category filtering, pagination)
8. **`blog-details.html`** - Blog Post (Author bios, comments section)
9. **`contact.html`** - Contact Us (Live open/closed status, validated form)
10. **`404.html`** - Error Page (Custom animated 404)
11. **`coming-soon.html`** - Coming Soon (Countdown, subscribe form)

**SEO & Utility:**
- **`sitemap.xml`**
- **`robots.txt`**

## Architecture

The project is structured modularly for easy maintenance:

```text
/yumz-restaurant
├── index.html
├── (all other html pages)
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/
    │   ├── style.css       (Core design system & layout)
    │   ├── dark-mode.css   (Dark theme overrides)
    │   └── rtl.css         (Right-to-left overrides)
    ├── js/
    │   ├── main.js         (Core state, theme, nav, modals)
    │   ├── animations.js   (Intersection observers, smooth scroll)
    │   └── validation.js   (Form validation logic)
    └── images/
        └── (placeholder for local images, currently using Unsplash)
```

## How to Use

1. **Local Development:** 
   No build step is required. Simply open `index.html` in any modern browser, or use a local server like VS Code Live Server for the best experience.
2. **Customising Colors:** 
   Open `assets/css/style.css` and modify the variables in the `:root` pseudo-class under `/* ===================== DESIGN SYSTEM (TOKENS) ===================== */`.
3. **Adding Content:** 
   Replace the placeholder text and Unsplash image URLs with your actual brand assets.

## Built With

- **Icons:** Font Awesome 6 (via CDN)
- **Fonts:** Google Fonts (Poppins & Inter)
- **Images:** Unsplash API (for demonstration purposes)

## Best Practices Observed

- **Semantic HTML5:** Using `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` tags.
- **Accessibility:** `aria-label`, `aria-hidden`, `role`, and proper focus management.
- **CSS Variables:** Used extensively for colors, spacing, typography, and theme switching.
- **BEM-ish Naming:** A clean, predictable CSS class naming convention (`block__element--modifier`).
