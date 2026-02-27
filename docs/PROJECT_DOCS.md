# Project Documentation

Single source of truth for structure, conventions, and patterns. **Reference this before making changes.**

---

## Project Structure

```
deazuadesign-portfolio/
├── index.html              # Homepage with work cards
├── leadership.html         # Leadership philosophy page (linked from About)
├── assets/
│   └── images/
│       ├── logo.png
│       └── projects/
│           ├── gss/        # Disney Guest Service Suite
│           ├── claims/     # In-Store Claims Kiosk
│           │   ├── claims-hero-2200x900.png
│           │   ├── claims-feature-block-compliance-1200x700.png   # Challenge 01
│           │   ├── claims-feature-block-disconnected-1200x700.png # Challenge 02
│           │   ├── claims-feature-block-repair-2-1200x700.png     # Challenge 03 (alternate)
│           │   ├── claims-feature-block-repair-1200x700.png       # Challenge 03
│           │   ├── claims-feature-block-choose-1200x700.png       # Evolution (Kiosk to Handheld)
│           │   ├── claims-feature-block-service design-1200x700.png # Process (Service design)
│           │   └── claims-feature-block-pilot-1200x700.png        # Process (Store pilot)
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

### iOS Safe Area Support

All pages must include `viewport-fit=cover` in the viewport meta tag so `env(safe-area-inset-*)` resolves correctly on notch devices (Dynamic Island, etc.).

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

### Leadership Page

Standalone page at `leadership.html` (root level). Linked from the About section on the homepage. Uses same design system as case studies: `case-hero`, `case-section`, `highlight-grid`, `highlight-card`, `testimonial`, `next-project`. Four themed sections: Building Teams, Ownership & Clarity, Growth & Innovation, Driving Impact. Each section includes a testimonial quote from check-ins.

### Typographic Quotes (Semantic + Accessible)

Use semantic HTML for all quotations. Never use raw straight `"` for visible quotation marks.

- **Block-level quotes** (testimonials, case-quote callouts): Use `<blockquote>` with class `testimonial` or `case-quote`. CSS adds curly open/close quotes via `::before`/`::after` pseudo-elements.
- **Inline quotations** (persona voices in highlight cards, quoted phrases in body text): Use `<q>`. Browsers generate proper curly quotes via the CSS `quotes` property.
- Quote characters: Open `\201C` ("), close `\201D` ("). Defined in `main.css` (base `q` rule) and `case-study.css` (`.case-quote p`, `.highlight-text q`).

---

## CSS Classes Reference

| Class | Location | Purpose |
|-------|----------|---------|
| `hero-floating-icons` | main.css | Decorative icon layer in homepage hero |
| `hero-float-icon` | main.css | Individual floating icon (position, size, parallax) |
| `hero-float-icon--accent` | main.css | Accent icon (primary-light color; same 64px size) |
| `case-quote` | case-study.css | Block quote callout (use with `<blockquote>`) |
| `case-image image-hero` | case-study.css | Hero image container (450px height) |
| `card-image has-image` | main.css | Homepage card with image |
| `about-leadership-link` | main.css | About section link to leadership.html |
| `leadership-cta-links` | main.css | Dual CTA container on leadership page |
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

**Password visibility toggle:** An eye icon (Iconoir `iconoir-eye` / `iconoir-eye-closed`) lets users show or hide the password. Implemented in `main.js` via `initPasswordToggle()`. Follows WCAG: `aria-pressed`, `aria-controls`, constant `aria-label="Show password"`, optional live region. Input is restored to `type="password"` before form submit to avoid autocomplete saving plain text.

**Z-index:** Custom cursor uses `z-index: 10002` so it remains visible above the password overlay (`z-index: 10001`). Password input uses `caret-color: var(--primary)` for visible text caret.

---

## Iconoir Icons

Icons are provided by [Iconoir](https://iconoir.com/) (1500+ SVG icons, MIT license). Loaded via `@import` in `main.css` from the CDN.

**Usage:** Wrap the icon in the appropriate container class:

```html
<span class="expertise-icon"><i class="iconoir-design-nib"></i></span>
<div class="highlight-icon"><i class="iconoir-spark"></i></div>
<div class="feature-image-icon"><i class="iconoir-search"></i></div>
<span class="link-icon"><i class="iconoir-linkedin"></i></span>
```

- Browse icons: [iconoir.com](https://iconoir.com/)
- Icons inherit font size and `color` (styled via CSS mask)
- Container classes: `expertise-icon`, `highlight-icon`, `feature-image-icon`, `link-icon`
- `highlight-icon` (larger cards): 48px, color `#A0A0B8`, stroke-width 1

**Icon mapping:** Emojis have been replaced with Iconoir icons across the site. Placeholder cards (Expert Workspace, Halloween Horror Nights) and their image-placeholder sections keep emojis. Key mappings: `design-nib` (Brand), `color-filter` (Product), `community` (Culture), `spark` (Craft), `chat-bubble`, `shield-check`, `archery`, `link`, `leaf`, `flash`, `graph-up`, `search`, `user`, `umbrella`, `plus`, `light-bulb-on`, `wristwatch`, `edit-pencil`, `clipboard-check`, `candlestick-chart`, `smartphone-device`, `component`, `precision-tool`, `ease-curve-control-points`, `keyframes`, `eye`, `page`, `book-stack`, `linkedin`, `dribbble`, `mail`.

### Hero Floating Icons (Homepage Only)

Decorative inline SVG icons float around the hero headline "Crafting Experiences That Matter" on the homepage. Implemented in `index.html`, `main.css`, and `main.js` via `initHeroFloatingIcons()`.

**Icons:** Custom thin-stroke SVGs (exported from Iconoir at `stroke-width: 0.8`). Source files in `assets/images/hero-icons/`: `peace-hand.svg`, `keyframes.svg`, `ease-curve-control-points.svg`, `substract.svg`, `box3d-center.svg`. Inlined in HTML for `currentColor` inheritance.

**Structure:** `.hero-floating-icons` (sibling of `.hero-content`, `aria-hidden="true"`) contains exactly 5 `.hero-float-icon` spans. Each icon has an inner `.hero-float-icon-inner` with an inline `<svg>`; the outer span handles cursor parallax.

**Size convention:** All icons 64px (uniform). Colors: `var(--text-secondary)` for base, `var(--primary-light)` for accent (`.hero-float-icon--accent`).

**Opacity behavior:** Icons start at 25% on page load and ramp to 45% as the user scrolls. Formula: `opacity = 0.25 + min(1, scrollProgress / 0.33) * 0.20`, where `scrollProgress = max(0, -heroTop / heroHeight)`.

**Motion style (Refined):** Float (vertical drift + micro-rotate -4deg to +4deg) + subtle horizontal cursor parallax (±6px max, lerp-smoothed). No scale pulse.

**Reduced motion:** When `prefers-reduced-motion: reduce`, `.hero-floating-icons` is hidden via CSS and `initHeroFloatingIcons()` exits early—no float, scroll opacity, or cursor parallax.

**Pointer behavior:** Cursor parallax runs only on `(hover: hover) and (pointer: fine)`. On touch devices, only the passive float animation runs.

---

## Feature Flags

| Flag | Location | Purpose |
|------|----------|---------|
| `testimonialSection` | `js/main.js` → `FEATURE_FLAGS` | Hides homepage testimonial. Set to `true` when new quotes and design are ready. |

---

## Local Development

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

---

## Updating This Doc

When you add a convention, pattern, or structural change, update this file so the next change can reference it instead of rebuilding.
