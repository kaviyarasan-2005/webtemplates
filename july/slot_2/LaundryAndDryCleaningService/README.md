# WASH — Premium Laundry & Dry Cleaning Service Website

WASH is a premium, luxury, and modern static website built for a laundry and dry cleaning enterprise. The application is developed with a **framework-less approach** using vanilla technologies to achieve ultimate page load performance, visual aesthetics, and micro-interactions.

---

## 🎨 Global Design System & Brand Identity

WASH uses a strict, curated tri-color system to maintain an elegant, premium look and feel across all pages:
*   **Primary Accent Color:** Burnt Amber (`#D48C2E`) — used for brand marks, highlights, and primary CTA buttons.
*   **Secondary Color:** Warm Stone (`#F5F0EB`) — used for page sections, cards, and contrasting backgrounds.
*   **Background / Structural Color:** Warm Charcoal (`#2A2A2E`) — utilized for heavy text, navbars, and structural elements (which becomes the dominant background in dark mode).

### Key Architectural Styles:
*   **Typography:** Google Fonts import of `Outfit` (headings) and `Inter` (body) for clean, geometric readability.
*   **No Gradients:** The design strictly avoids gradients, using solid accent block backgrounds or layered high-quality photography to maintain visual hierarchy.
*   **Glassmorphism:** Subtly applied to navigation bars and floating card elements to create an elevated luxury feel.
*   **SEO Optimization:** Complete semantic HTML5 structure with single `<h1>` hierarchy, custom descriptive meta tags, and structured JSON-LD Schema markup on the homepage.

---

## 🚀 Advanced Features & Interactions

*   **🌓 Dark Mode Integration:** Dynamic theme switcher using native CSS custom properties. Remembers user preference using `localStorage`.
*   **🌐 Right-to-Left (RTL) Layout Toggler:** Complete support for LTR and RTL text directions (e.g., for Arabic layouts). Mirroring is handled instantly in pure CSS via `rtl.css`.
*   **📊 Interactive Dashboards:** 
    *   **Admin Dashboard:** Features real-time stat summaries, a sortable operations log table with status filters, and interactive operational charts powered by **Chart.js** (Line/Area weekly revenue chart, and Donut order status chart).
    *   **User Dashboard:** Customer portal with garment statistics counters, monthly spending bar charts, saved address cards, and an interactive pickup scheduler booking form.
*   **✨ Soap Bubble 404 Screen:** The 404 error page features custom floating rise-animation soap bubbles created using pure CSS keyframes.
*   **⏳ Launch Countdown Timer:** The Coming Soon launching screen features a live countdown timer powered by a robust JavaScript interval controller.
*   **🖼️ Masonry Partner Showcase & Lightbox:** Alternating masonry layout grids on Services/Partners pages with built-in interactive click-to-expand image lightboxes.
*   **📝 Live Client-Side Validation:** Form handlers built in custom JS (`auth.js` & `main.js`) with immediate field-level error messages, phone/email validation, and visual password strength gauges.

---

## 📂 File Directory Structure

```
LaundryAndDryCleaningService/
├── assets/
│   ├── css/
│   │   ├── style.css         # Main stylesheet (4000+ lines defining components)
│   │   ├── dark-mode.css     # Dark mode theme color overrides
│   │   └── rtl.css           # RTL layout alignment mirror styles
│   ├── js/
│   │   ├── main.js           # Core website logic (Transitions, togglers, lightbox)
│   │   ├── dashboard.js      # Dashboard Chart.js & sorting table logic
│   │   └── auth.js           # Login/Register validation & strength indicator
│   └── images/
│       └── favicon.svg       # Minimalist brand logo file
├── 404.html              # Custom misplaced garments theme error page
├── about.html            # About Us (Story, team, facility specs)
├── admin-dashboard.html  # Operations dashboard for staff
├── assets/
│   ├── css/
│   │   ├── style.css         # Main stylesheet (4000+ lines defining components)
│   │   ├── dark-mode.css     # Dark theme overrides
│   │   └── rtl.css           # RTL layout alignment mirror styles
│   ├── js/
│   │   ├── main.js           # Core website logic (Transitions, togglers, lightbox)
│   │   ├── dashboard.js      # Dashboard Chart.js & sorting table logic
│   │   └── auth.js           # Login/Register validation & strength indicator
│   └── images/
│       └── favicon.svg       # Minimalist brand logo file
├── blog-details.html     # Blog post detail (Formatted contents, comment forms)
├── blog.html             # Blog list (Articles, category filters, tag cloud)
├── coming-soon.html      # Countdown launching page
├── contact.html          # Contact Us (Interactive forms, static Google Map)
├── home-2.html           # Home Page 2 (Corporate & Subscriptions)
├── index.html            # Home Page 1 (Main marketing & CTA)
├── login.html            # Login screen (Split layout, brand preview)
├── pricing.html          # Pricing page (Subscription comparison & per-item rates)
├── register.html         # Signup screen (Live password strength meter)
├── service-details.html  # Service Details (Detailed specs, pricing & FAQ)
├── services.html         # Services Grid (6 specialized services)
└── user-dashboard.html   # Customer Portal & pickup scheduler
```

---

## 🛠️ Installation & Execution

Since the project is built completely on vanilla client-side files, it requires **no build tool step or server side compilation**:
1.  Clone this repository or open the project folder in your IDE.
2.  Open any page in the root directory (e.g., `index.html`) using a web browser.
3.  Alternatively, spin up a local development server such as **Live Server** in VS Code or run `npx http-server` to view the pages dynamically.
