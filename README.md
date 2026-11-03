# De Azua Design Portfolio

Personal portfolio website showcasing design leadership work at Disney, Universal, Travel+Leisure, and Asurion.

## Documentation

- **`docs/PROJECT_DOCS.md`** — Conventions, patterns, and structure. Reference before making changes.

## Project Structure

`site/` holds the live site. The tree below shows the legacy static files and the shared `assets/` folder.

```
deazuadesign-portfolio/
├── site/                  # Next.js app (deployed)
├── index.html              # Homepage
├── README.md               # This file
├── .gitignore
│
├── assets/
│   └── images/
│       ├── logo.png
│       └── projects/
│           └── nextgen/    # Next-Gen Portal images
│
├── css/
│   ├── main.css           # Global styles
│   └── case-study.css     # Case study page styles
│
├── js/
│   └── main.js            # Main JavaScript
│
├── projects/              # Case study pages
│   ├── case-study-expert-workspace.html
│   ├── case-study-nextgen-portal.html
│   ├── case-study-disney-guest-service.html
│   ├── case-study-halloween-horror-nights.html
│   ├── case-study-instore-kiosk.html
│   └── case-study-vacation-planner.html
│
├── docs/
│   └── PROJECT_DOCS.md    # Conventions & patterns
│
└── .private/              # Not tracked in git
    └── access-keys.txt    # Password reference
```

## Local Development

```bash
cd site
npm install
npm run dev

# Open in browser
open http://localhost:3000
```

## Password Protected Pages

Some case studies are password protected. Contact Ricardo for access.

## Technologies

- Next.js static export (`site/`)
- shadcn/ui and Tailwind CSS
- Existing CSS custom properties for theming
- Intersection Observer for scroll animations

## Deployment

GitHub Actions builds `site/` and deploys it to GitHub Pages on every push to `main`. The root HTML, `css/` and `js/` files are the legacy static site and no longer deploy.
