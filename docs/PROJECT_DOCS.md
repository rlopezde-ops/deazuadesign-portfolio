# Project Documentation

Single source of truth for structure, conventions, and patterns. **Reference this before making changes.**

---

## Project Structure

```
deazuadesign-portfolio/
├── index.html              # Homepage with work cards
├── assets/
│   └── images/
│       ├── logo.png
│       └── projects/
│           ├── gss/        # Disney Guest Service Suite
│           ├── nextgen/    # Next-Gen Portal
│           │   ├── next-gen-hero-2200x900.png
│           │   ├── next-gen-feature-block-1200x700.png  # Final design
│           │   ├── next-gen-feature-card-1400x440.png  # Service blueprint
│           │   └── next-gen-feature-card-legacy-1400x440.png  # Legacy system (Challenge 02)
│           ├── universal/  # Halloween Horror Nights
│           └── wyndham/    # Vacation Planner
├── css/
│   ├── main.css            # Global styles, variables, layout
│   └── case-study.css      # Case study page styles
├── js/
│   └── main.js             # Main JavaScript
├── projects/               # Case study HTML pages
│   ├── case-study-expert-workspace.html
│   ├── case-study-nextgen-portal.html
│   ├── case-study-disney-guest-service.html
│   ├── case-study-halloween-horror-nights.html
│   ├── case-study-instore-kiosk.html
│   └── case-study-vacation-planner.html
└── docs/
    └── PROJECT_DOCS.md     # This file
```

---

## Conventions

### Hero Image + Homepage Card (Always Sync)

When adding or updating a **hero image** on a case study page:

1. **Case study page** (`projects/case-study-*.html`): Add/update the hero image in the `<!-- Hero Image -->` section.
2. **Homepage** (`index.html`): Update the matching work card to use the same image.

Both must stay in sync. See "Hero Image Pattern" below.

### Image Paths

- **From `index.html`**: `assets/images/projects/{project}/filename.ext`
- **From `projects/*.html`**: `../assets/images/projects/{project}/filename.ext`

### Hero Image Pattern

**Case study hero** (in `projects/case-study-*.html`):

```html
<div class="case-content">
  <div class="case-image image-hero">
    <img src="../assets/images/projects/nextgen/next-gen-hero-2200x900.png" alt="Next-Gen Portal dashboard hero">
  </div>
</div>
```

**Homepage card** (in `index.html`):

```html
<div class="card-image has-image" style="background: linear-gradient(...);">
  <img src="assets/images/projects/nextgen/next-gen-hero-2200x900.png" alt="Next-Gen Portal dashboard">
</div>
```

- Use simple `<img src="..." alt="...">`—no extra attributes.
- `case-image image-hero` for case study; `card-image has-image` for homepage cards.

### Case Study Page Structure

1. Password overlay (if protected)
2. Nav
3. Case hero (title, intro, meta)
4. Hero image
5. Sections (Challenge, Approach, Solution, etc.)
6. Next project CTA
7. Footer

---

## CSS Classes Reference

| Class | Location | Purpose |
|-------|----------|---------|
| `case-image image-hero` | case-study.css | Hero image container (450px height) |
| `card-image has-image` | main.css | Homepage card with image |
| `feature-image has-image` | case-study.css | Feature block with image |
| `image-placeholder` | case-study.css | Placeholder when no image yet |

---

## Password-Protected Case Studies

| Case Study | Page | Password |
|------------|------|----------|
| Expert Workspace | `case-study-expert-workspace.html` | `exwo` |
| Next-Gen Portal | `case-study-nextgen-portal.html` | `portal` |
| Disney Guest Service Suite | `case-study-disney-guest-service.html` | `genie` |

Passwords are stored in sessionStorage—users enter once per browser session.

---

## Local Development

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

---

## Updating This Doc

When you add a convention, pattern, or structural change, update this file so the next change can reference it instead of rebuilding.
