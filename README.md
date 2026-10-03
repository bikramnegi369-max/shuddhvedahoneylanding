# ShuddhVeda Honey Landing Page

A high-converting, performance-oriented landing page for **ShuddhVeda Honey** built with pure HTML5, modern Vanilla CSS, and lightweight JavaScript.

---

## 📁 Architecture Overview

```text
shuddhvedahoney landing/
├── assets/                  # Static media and design assets
│   ├── docs/                # Lab test results and certificates (PDF)
│   └── images/              # Highly optimized responsive web images (.webp, .png)
│       ├── choose_us/       # Why Choose section imagery
│       ├── footer/          # Responsive footer backgrounds and brand logo
│       ├── hero/            # Hero section desktop & responsive mobile visuals
│       ├── honey_journey/   # Responsive visual storytelling graphic
│       ├── honey_pick/      # Six floral varieties cards & background
│       ├── intro/           # Brand introduction imagery
│       └── products/        # Product jars showcase
├── css/                     # Stylesheets (modular architecture)
│   ├── variables.css        # CSS Custom Properties (colors, spacing, typography)
│   ├── reset.css            # Modern reset / normalize
│   ├── components.css       # Reusable UI elements (cards, carousels, forms, badges)
│   └── style.css            # Primary entrypoint importing partials & layout styles
├── js/                      # Frontend JavaScript ES modules
│   ├── countdown.js         # Live launch countdown timer with drift correction
│   ├── slider.js            # Dual seamless infinite carousels (drag + touch + auto)
│   ├── subscribe.js         # REST API lead capture & validation handlers
│   └── main.js              # Core orchestration & DOMContentLoaded hook
├── design-inputs/           # Marketing briefs, copy decks, and wireframe specs
│   └── briefs/
│       └── BRIEF_TEMPLATE.md
├── index.html               # Main entrypoint with semantic HTML5 and SEO meta
└── README.md                # Project documentation and architectural guide
```

---

## 🛠️ Development & Deployment
- Simply serve with any static web server (e.g., Live Server, `npx serve`, or Python's `http.server`).
- Production-ready: Can be deployed to Netlify, Vercel, GitHub Pages, or Cloudflare Pages without a complex build pipeline.
