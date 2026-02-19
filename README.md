# De Azua Design Portfolio

Personal portfolio website showcasing design leadership work at Disney, Universal, Travel+Leisure, and Asurion.

## Documentation

- **`docs/PROJECT_DOCS.md`** — Conventions, patterns, and structure. Reference before making changes.

## Project Structure

```
deazuadesign-portfolio/
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
# Start a local server
python3 -m http.server 8082

# Open in browser
open http://localhost:8082
```

## Password Protected Pages

Some case studies are password protected. Contact Ricardo for access.

## Technologies

- Vanilla HTML, CSS, JavaScript
- No build tools or frameworks required
- Responsive design with CSS Grid and Flexbox
- CSS custom properties for theming
- Intersection Observer for scroll animations

## Deployment

The site is deployed via GitHub Pages from the `main` branch.
