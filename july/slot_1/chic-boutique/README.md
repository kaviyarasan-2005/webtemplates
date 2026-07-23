# CHIC — Fashion Boutique Website

A premium, 11-page fashion boutique website built with pure **HTML5**, **CSS3**, and **Vanilla JavaScript (ES6+)**. No external CSS frameworks. All styling is hand-written using CSS custom properties for full theming control.

---

## Project Structure

```
chic-boutique/
├── assets/
│   ├── css/
│   │   ├── style.css          # Master stylesheet — all components & utilities
│   │   ├── dark-mode.css      # Dark mode overrides (data-theme="dark")
│   │   └── rtl.css            # RTL layout overrides (dir="rtl")
│   ├── js/
│   │   └── main.js            # All JS: nav, theme, RTL, modal, forms, animations
│   ├── images/                # Images served from Unsplash CDN
│   └── fonts/                 # Google Fonts (loaded via CDN)
├── pages/
│   ├── index.html             # Home 1 — General Boutique Landing
│   ├── home-2.html            # Home 2 — Editorial & Occasion Focus
│   ├── about.html             # About Us — Brand Story & Heritage
│   ├── services.html          # Services — Atelier Offerings
│   ├── service-details.html   # Service Details — Bespoke Evening Wear
│   ├── pricing.html           # Pricing — Styling Package Tiers
│   ├── blog.html              # Blog — The Journal
│   ├── blog-details.html      # Blog Details — Article View
│   ├── contact.html           # Contact — Enquiry & Directions
│   ├── 404.html               # 404 Error — Standalone, no nav/footer
│   └── coming-soon.html       # Coming Soon — Standalone, no nav/footer
├── documentation/
│   └── index.html             # Design system reference
├── sitemap.xml
├── robots.txt
└── README.md
```

---

## Design System

| Token              | Value                              |
|--------------------|-------------------------------------|
| Primary            | `#0F0F0F` (Obsidian)               |
| Secondary          | `#D4AF37` (Champagne Gold)         |
| Accent             | `#FAFAFA` (Pearl)                  |
| Heading Font       | Playfair Display (serif)            |
| Body Font          | Inter (sans-serif)                  |
| Icon Library       | Phosphor Icons v2.1.1 (CDN)        |
| Base Spacing Unit  | 8px scale                           |
| Container Max      | 1280px                              |
| Navbar Height      | 72px desktop / 60px mobile          |

---

## Pages & Features

| Page               | Key Features                                                      |
|--------------------|-------------------------------------------------------------------|
| Home 1             | Hero parallax, product grid, category explorer, seasonal banner   |
| Home 2             | Editorial hero, JS carousel, masonry lookbook, testimonials       |
| About              | Brand chronicle, team cards, press accolades, JSON-LD org schema  |
| Services           | 2×2 service grid, 4-step timeline, pricing teasers               |
| Service Details    | Two-col narrative, vanilla lightbox gallery, size guide table     |
| Pricing            | 3-tier pricing cards, comparison grid, transformation stories     |
| Blog               | Featured article, JS category filter pills, trending reads        |
| Blog Details       | Article content, author card, comments, social share buttons      |
| Contact            | Validated form, Google Maps embed, hours table, LocalBusiness LD  |
| 404                | Full-screen error hero, wayfinder links, search input             |
| Coming Soon        | JS countdown timer, early access form, sneak peek images          |

---

## Global Features

- **Dark Mode** — System preference detection on first load; toggle persists in `localStorage`
- **RTL/LTR Toggle** — Switches `dir` attribute on `<html>`; persists in `localStorage`
- **Book Now Modal** — Appointment enquiry form with client-side validation; no page redirect
- **Scroll Reveal** — `IntersectionObserver`-based fade-up with stagger delays
- **Hero Parallax** — `background-position` parallax; disabled with `prefers-reduced-motion`
- **Keyboard Navigation** — Full tab-order support; focus trapped in modal and mobile menu
- **ARIA** — Landmarks, labels, and live regions throughout
- **WCAG 2.1 AA** — Contrast compliant in both light and dark modes

---

## Responsive Breakpoints

| Breakpoint  | Width     | Layout             |
|-------------|-----------|--------------------|
| Mobile      | < 640px   | 1-col, hamburger   |
| Tablet      | 640–1024px| 2–3 col grids      |
| Desktop     | 1024–1280px| Full layouts      |
| Large       | > 1280px  | Max-width capped   |

---

## Quick Start

No build tools required. Open any page directly in a browser:

```bash
# Just open the file in your browser
open pages/index.html
```

Or serve locally with any static server:

```bash
# Python 3
python -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080/pages/index.html`

---

## SEO

- Unique `<title>` (≤ 60 chars) and `<meta name="description">` (150–160 chars) on every page
- JSON-LD `Organization` schema on `about.html`
- JSON-LD `LocalBusiness` schema on `contact.html`
- XML sitemap at `sitemap.xml`
- `robots.txt` with sitemap reference
- All images have descriptive `alt` text and explicit `width`/`height`

---

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## Credits

- **Fonts** — [Google Fonts](https://fonts.google.com) (Playfair Display, Inter)
- **Icons** — [Phosphor Icons](https://phosphoricons.com)
- **Images** — [Unsplash](https://unsplash.com) (CDN embed links, no download required)

---

*CHIC Boutique — Redefine Your Elegance.*
