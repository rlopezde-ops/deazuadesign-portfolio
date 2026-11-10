# Case Study Image Specs: deazuadesign.com

Reference for making case study visuals. Measured from the live Next.js site (`site/app/styles/case-study.css`) by rendering every case study page in Chromium at 360 to 1920px wide.

## How images are placed

- Every image fills a fixed-height box with `object-fit: cover`, centered (`object-position: center`). The image is scaled until it fills the box, and whatever overflows is cut off **evenly on both sides** (left/right or top/bottom).
- Nothing is ever letterboxed. A wrong ratio always means cropping, never empty space.
- Boxes have 24px rounded corners and a 1px border. Keep text and key UI out of the corners.
- On hover the image zooms 3% (heroes) or 2% (feature images), which trims about 1 to 1.5% more from every edge.

## The 2 image slots

There are only 2 slot types. "Top hero" and "full-width" use the same CSS class (`.case-image.image-hero`).

### Slot A: Hero / full-width image (`.case-image.image-hero`)

Used for the hero at the top of every page and for full-width images between sections.

| Screen | Box size (CSS px) | Box ratio |
|---|---|---|
| Desktop ≥1196px | 1098×450 (top hero), 1004×450 (mid-page) | 2.44:1 / 2.23:1 |
| Laptop 1024px | 928×450 | 2.06:1 |
| Tablet 820px | 724×450 | 1.61:1 |
| Phone 390px | 342×450 | 0.76:1 (portrait) |
| Phone 360px | 312×450 | 0.69:1 (portrait) |

Height is always 450px. Only the width changes.

**Make it at: 2200×900 px (2.44:1).** This is 2× the desktop box, so it's sharp on retina screens, and it's what most current heroes use.

Crop on a 2200×900 canvas (height is never cropped; only the sides are):

| Screen | Cropped | Visible width, centered | Safe x-range on the 2200 canvas |
|---|---|---|---|
| Desktop top hero (≥1196) | 0% | 100% | 0–2200 |
| Desktop mid-page (≥1100) | 9% | 91% | 100–2100 |
| Laptop 1024 | 16% | 84% | 175–2025 |
| Narrowest 2-col 901 | 27% | 73% | 297–1903 |
| Tablet 820 | 34% | 66% | 376–1824 |
| Phone 390 | 69% | 31% | 758–1442 |
| Phone 360 | 72% | 28% | 788–1412 |

**Design rules for heroes**
- Full height (0–900) is always visible. Use it.
- The main subject goes in the **center 620px column (x 790–1410)** if it has to read on a phone.
- Anything that only needs to read on desktop and tablet stays inside **x 376–1824**.
- Supporting detail can run to the edges. It shows only on desktop.
- Avoid left-aligned or right-aligned compositions, and wide rows of screens or states. On phones only about the middle third shows.

> Known CSS bug: `case-study.css` has a mobile rule `.image-hero { height: 280px }` at ≤768px, but `.case-image.image-hero { height: 450px }` is more specific and wins, so the phone hero stays a 342×450 portrait box. If that rule worked, phones would show the center 50% (not 31%) of a 2200×900 image. Fix it before designing around the phone crop.

### Slot B: Feature image (`.feature-image.has-image`)

The image half of the side-by-side image + text blocks.

| Screen | Layout | Box size (CSS px) | Box ratio |
|---|---|---|---|
| Desktop ≥1100px | 2 columns | 470×350 | 1.34:1 |
| Laptop 1024px | 2 columns | 432×350 | 1.23:1 |
| 901px (narrowest 2-col) | 2 columns | 370×350 | 1.06:1 |
| 900px (widest stacked) | stacked | 804×280 | 2.87:1 |
| Tablet 820px | stacked | 724×280 | 2.59:1 |
| Tablet 768px | stacked | 720×280 | 2.57:1 |
| Phone 390px | stacked | 342×280 | 1.22:1 |
| Phone 360px | stacked | 312×280 | 1.11:1 |

The ratio swings from about 1:1 to about 2.9:1, so no single canvas avoids cropping everywhere. Design for desktop and use a safe zone.

**Make it at: 1612×1200 px (1.343:1, matches the desktop box exactly).** 940×700 is the 2× minimum. 1612 wide also stays sharp at 2× in the widest stacked tablet box (804px).

Crop on a 1612×1200 canvas:

| Screen | Cropped | What's cut | Visible area, centered |
|---|---|---|---|
| Desktop ≥1100 | 0% | none | full |
| Laptop 1024 | 8% | sides | x 63–1549 |
| 901px | 21% | sides | x 170–1442 |
| 900px stacked | 53% | top/bottom | y 320–880 |
| Tablet 820 | 48% | top/bottom | y 288–912 |
| Phone 390 | 9% | sides | x 73–1539 |
| Phone 360 | 17% | sides | x 137–1475 |

**Safe zone visible at every width: x 170–1442, y 320–880 (1272×560, center 79% wide × 47% tall).**

**Design rules for feature images**
- Put the hero element (the screen, key UI, the "money shot") in the safe zone.
- The stacked tablet layout is the harsh case: it keeps only the middle horizontal band. Tall phone mockups or portrait screenshots lose their top and bottom there.
- Background, device frames and decorative overflow can fill the outer margin.
- Don't use wide banner art (3:1 or wider). It loses about 60% on desktop and phones.

## Crop % by source ratio (for checking existing art)

% of the image area cut off. W = cut from the sides, H = cut from top and bottom.

**In the hero / full-width slot (mid-page box):**

| Source ratio | 1440 | 1024 | 820 | 390 |
|---|---|---|---|---|
| 2.44:1 (2200×900) | 9% W | 16% W | 34% W | 69% W |
| 3.18:1 (2800×880, 1400×440) | 30% W | 35% W | 49% W | 76% W |
| 16:9 | 20% H | 14% H | 9% W | 57% W |
| 1.71:1 (1200×700) | 23% H | 17% H | 6% W | 56% W |
| 3:2 | 33% H | 27% H | 7% H | 49% W |
| 1.4:1 | 37% H | 32% H | 13% H | 46% W |
| 4:3 | 40% H | 35% H | 17% H | 43% W |

**In the feature slot:**

| Source ratio | 1440 | 1024 | 820 | 390 |
|---|---|---|---|---|
| 1.343:1 (1612×1200, recommended) | 0% | 8% W | 48% H | 9% W |
| 4:3 (1440×1080, 1024×768) | 1% H | 7% W | 48% H | 8% W |
| 1.4:1 (1400×1000, 1200×840, 2100×1500) | 4% W | 12% W | 46% H | 13% W |
| 1.45:1 (1400×963) | 8% W | 15% W | 44% H | 16% W |
| 3:2 (1536×1024) | 10% W | 18% W | 42% H | 19% W |
| 1.71:1 (1200×700) | 22% W | 28% W | 34% H | 29% W |
| 16:9 | 24% W | 31% W | 31% H | 31% W |
| 2.44:1 (2200×900) | 45% W | 50% W | 5% H | 50% W |
| 3.18:1 (2800×880, 1400×440) | 58% W | 61% W | 19% W | 62% W |

## Current image inventory

Every image currently on a case study page, with the % of the image cut off at each screen width.

### Visual Call Pacing

| Image | Slot | Source px | Desktop 1440 | Tablet 820 | Phone 390 |
|---|---|---|---|---|---|
| `call-pacing-hero-2200x900.png` | Top hero | 2200×900 | 0% | 34% (sides) | 69% (sides) |
| `call-pacing-first-test.png` | Feature | 1400×963 | 8% (sides) | 44% (top/bottom) | 16% (sides) |
| `call-pacing-targets.png` | Feature | 1200×840 | 6% (sides) | 45% (top/bottom) | 14% (sides) |
| `call-pacing-floor.jpg` | Feature | 1365×768 | 24% (sides) | 31% (top/bottom) | 31% (sides) |
| `call-pacing-before-after.png` | Full-width | 2200×900 | 9% (sides) | 34% (sides) | 69% (sides) |
| `call-pacing-v2.png` | Feature | 1200×840 | 6% (sides) | 45% (top/bottom) | 14% (sides) |

### Disney Guest Service

| Image | Slot | Source px | Desktop 1440 | Tablet 820 | Phone 390 |
|---|---|---|---|---|---|
| `disney-gss-hero-2200x900.png` | Top hero | 2200×900 | 0% | 34% (sides) | 69% (sides) |
| `gss-feature-card-dropdowns.png` | Feature | 2800×880 | 58% (sides) | 19% (sides) | 62% (sides) |
| `castmember.png` | Feature | 1400×1000 | 4% (sides) | 46% (top/bottom) | 13% (sides) |
| `60+apps.png` | Feature | 2101×1501 | 4% (sides) | 46% (top/bottom) | 13% (sides) |
| `disney-gss-hero-2200x900-2.png` | Full-width | 2200×900 | 9% (sides) | 34% (sides) | 69% (sides) |
| `gss-feature-card-guest-interaction.png` | Feature | 2800×880 | 58% (sides) | 19% (sides) | 62% (sides) |
| `gss-feature-card-magic bands.png` | Feature | 2800×880 | 58% (sides) | 19% (sides) | 62% (sides) |
| `gss-feature-card-data-entry.png` | Feature | 2800×880 | 58% (sides) | 19% (sides) | 62% (sides) |

### Expert Workspace

| Image | Slot | Source px | Desktop 1440 | Tablet 820 | Phone 390 |
|---|---|---|---|---|---|
| `asurion-expert-workspace.png` | Top hero | 2200×900 | 0% | 34% (sides) | 69% (sides) |

### Halloween Horror Nights

| Image | Slot | Source px | Desktop 1440 | Tablet 820 | Phone 390 |
|---|---|---|---|---|---|
| `hhn-hero-2200x900-2.png` | Top hero | 2200×900 | 0% | 34% (sides) | 69% (sides) |
| `hhn-mobile-friendly.png` | Feature | 2101×1500 | 4% (sides) | 46% (top/bottom) | 13% (sides) |
| `hhn-beforeandafter.png` | Feature | 2101×1501 | 4% (sides) | 46% (top/bottom) | 13% (sides) |
| `hhn-cohesive-brand.png` | Feature | 1200×700 | 22% (sides) | 34% (top/bottom) | 29% (sides) |
| `hhn-feature-block-1400x440-2.png` | Full-width | 1400×440 | 30% (sides) | 49% (sides) | 76% (sides) |
| `hhn-tickets-new.png` | Feature | 1200×700 | 22% (sides) | 34% (top/bottom) | 29% (sides) |

### In-Store Claims Kiosk

| Image | Slot | Source px | Desktop 1440 | Tablet 820 | Phone 390 |
|---|---|---|---|---|---|
| `claims-hero-2200x900.png` | Top hero | 2200×900 | 0% | 34% (sides) | 69% (sides) |
| `claims-feature-block-compliance-1200x700.png` | Feature | 1200×700 | 22% (sides) | 34% (top/bottom) | 29% (sides) |
| `claims-feature-block-disconnected-1200x700.png` | Feature | 1536×1024 | 10% (sides) | 42% (top/bottom) | 19% (sides) |
| `claims-feature-block-repair-2-1200x700.png` | Feature | 1200×700 | 22% (sides) | 34% (top/bottom) | 29% (sides) |
| `claims-feature-block-service design-1200x700.png` | Feature | 1200×700 | 22% (sides) | 34% (top/bottom) | 29% (sides) |
| `claims-feature-block-pilot-1200x700.png` | Feature | 1200×700 | 22% (sides) | 34% (top/bottom) | 29% (sides) |
| `claims-feature-block-choose-1200x700.png` | Feature | 1200×700 | 22% (sides) | 34% (top/bottom) | 29% (sides) |

### Next-Gen Portal

| Image | Slot | Source px | Desktop 1440 | Tablet 820 | Phone 390 |
|---|---|---|---|---|---|
| `next-gen-hero-2200x900.png` | Top hero | 2200×900 | 0% | 34% (sides) | 69% (sides) |
| `legacy-portal.gif` | Feature | 1440×1080 | 0% | 48% (top/bottom) | 8% (sides) |
| `next-gen-feature-card-legacy-1400x440.png` | Feature | 1400×440 | 58% (sides) | 19% (sides) | 62% (sides) |
| `next-gen-feature-card-tech-training-workflow-1400x440.png` | Feature | 1400×440 | 58% (sides) | 19% (sides) | 62% (sides) |
| `next-gen-feature-card-1400x440.png` | Feature | 1400×440 | 58% (sides) | 19% (sides) | 62% (sides) |
| `next-gen-feature-block-1200x700.png` | Full-width | 1200×700 | 23% (top/bottom) | 6% (sides) | 56% (sides) |
| `customer-search-check-in.gif` | Feature | 960×720 | 0% | 48% (top/bottom) | 8% (sides) |
| `asurion-connected.png` | Feature | 1024×768 | 0% | 48% (top/bottom) | 8% (sides) |

### Vacation Planner

| Image | Slot | Source px | Desktop 1440 | Tablet 820 | Phone 390 |
|---|---|---|---|---|---|
| `cw-hero-2200x900-2.png` | Top hero | 2200×899 | 0% | 34% (sides) | 69% (sides) |
| `cw-feature-card-discoverability.png` | Feature | 2800×880 | 58% (sides) | 19% (sides) | 62% (sides) |
| `cw-feature-card-education-gap.png` | Feature | 2800×880 | 58% (sides) | 19% (sides) | 62% (sides) |
| `cw-feature-card-inventory.png` | Feature | 2800×880 | 58% (sides) | 19% (sides) | 62% (sides) |
| `cw-explore-resort-feature-1200x700.png` | Full-width | 2400×1400 | 23% (top/bottom) | 6% (sides) | 56% (sides) |
| `cw-explore-resort-member.png` | Feature | 2800×880 | 58% (sides) | 19% (sides) | 62% (sides) |
| `cw-explore-resort-prospect.png` | Feature | 2800×880 | 58% (sides) | 19% (sides) | 62% (sides) |

## Worst crops today

- **3.18:1 banners in the feature slot** lose 58–62% on desktop and phones: all 4 Disney GSS feature cards, 3 Next-Gen feature cards, all 5 Vacation Planner feature cards. Re-export these at 1612×1200.
- **`hhn-feature-block-1400x440-2.png` in the full-width slot** loses 30% on desktop and 76% on phones.
- **Filename doesn't match the file:** `claims-feature-block-disconnected-1200x700.png` is really 1536×1024, and `cw-explore-resort-feature-1200x700.png` is 2400×1400 (same ratio, 2× size).

## Quick brief (paste into a prompt)

> Case study visuals for deazuadesign.com. Two formats only:
> 1. HERO / FULL-WIDTH: 2200×900 px. Always shows full height. Sides crop. Phones show only the center x 790–1410, tablets x 376–1824. Center the subject, keep the full height, no left-aligned or right-aligned layouts.
> 2. FEATURE: 1612×1200 px (1.343:1). Shows in full on desktop. Stacked tablet view keeps only the middle band y 320–880. Narrow screens trim up to 170px per side. Keep key content in x 170–1442, y 320–880.
> Both: center-anchored cover crop, 24px rounded corners, dark card background, 2–3% hover zoom, so keep a small edge margin.
