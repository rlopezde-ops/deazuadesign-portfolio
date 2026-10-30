# Verizon Home Device Protect — Upsell Micro Experience

A mobile-first prototype of the Verizon Home Device Protect (VHDP) customer upsell and enrollment
flow. Built for design review, legal/compliance sign-off, stakeholder demos, and as a reference
implementation for production hand-off.

| | |
| --- | --- |
| **Package** | `@asurion-core/vhdp-upsell` |
| **Folder** | `apps/vhdp-upsell/` |
| **Local port** | `3005` |
| **Stack** | Next.js 16 · React 19 · Tailwind CSS v4 · lucide-react |
| **Related app** | Guided Browsing marketing page (`apps/guided-browsing/vhdp-home-device-protect`) — distinct from this enrollment flow |

---

## Contents

1. [Jobs to be Done (JTBD)](#1-jobs-to-be-done-jtbd)
2. [Product Requirements (PRD)](#2-product-requirements-prd)
3. [Flow Map](#3-flow-map)
4. [Key interaction details](#4-key-interaction-details)
5. [Engineering](#5-engineering)
6. [Deployment](#6-deployment)
7. [Deep linking](#7-deep-linking)
8. [Status & notes](#8-status--notes)

---

## 1. Jobs to be Done (JTBD)

### Primary customer job

> When I am offered Verizon Home Device Protect in MyVerizon (or a similar account surface),  
> I want to understand what is covered, what it costs, and what I am agreeing to,  
> so I can enroll with confidence — or decline — without feeling tricked or rushed past the terms.

### Supporting jobs

| Actor | Job | Outcome |
| --- | --- | --- |
| **Customer** | See price and core benefits before committing | Can decide whether VHDP is worth $25/mo + tax |
| **Customer** | Know which home tech is eligible | Can open covered-device categories without leaving the offer |
| **Customer** | Review plan details and legal terms before signing up | Scrolls past claim limits, cancellation, arbitration, etc. |
| **Customer** | Explicitly consent to enrollment and agreements | Native checkbox + separate agreement links; cannot enroll silently |
| **Customer** | Confirm enrollment succeeded | Sees confirmation, next steps (email within 72 hours), and **Add devices** |
| **Legal / compliance** | Ensure terms are visible and acknowledgement is unambiguous | Checkbox is not sticky; error persists until checked; links are independent |
| **Design / product** | Share a reviewable, clickable prototype | `/flow` map + `?screen=` deep links for demos and QA |
| **Engineering** | Hand off an accessible, documented reference UI | Native controls, clear structure, monorepo deploy path |

### Non-goals (this prototype)

- Real billing, account creation, or device inventory APIs
- Full MyVerizon account UI (background is intentionally a blank “Customer account page”)
- Expert/agent assist tooling (see `rebuttal-sandbox` for call-assist prototypes)

---

## 2. Product Requirements (PRD)

### Problem

Customers offered VHDP need a clear, mobile enrollment path: value proposition → covered devices →
plan details / legal → explicit acknowledgement → confirmation. Ambiguous checkboxes, sticky CTAs
that skip reading terms, or mocked account chrome create legal and UX risk.

### Goals

1. Present a co-branded Verizon | Asurion offer at **$25/month plus tax**.
2. Let customers inspect covered categories without leaving the offer context.
3. Require scrolling through important plan details before the enrolment control.
4. Separate **enrollment intent** (checkbox) from **agreement documents** (independent links).
5. Keep primary CTAs visually enabled and keyboard-reachable; validate on submit.
6. Confirm enrollment and guide the next step (**Add devices**).

### Personas

- **Verizon customer** considering optional home-tech protection on a mobile viewport.
- **Internal reviewers** (design, product, legal) validating copy, links, and a11y before prod.

### Functional requirements

| ID | Requirement | Status in prototype |
| --- | --- | --- |
| FR-1 | Default entry opens the upsell (“Get covered”) experience | ✅ `/?` → upsell |
| FR-2 | Primary CTA **Get covered today** opens Review your plan | ✅ |
| FR-3 | Secondary CTA **No, thanks** dismisses the offer to the account placeholder | ✅ |
| FR-4 | **and more** (in coverage body copy) opens Covered devices sheet | ✅ |
| FR-5 | Covered devices: accordion categories with text device lists | ✅ |
| FR-6 | Review your plan: included benefits + important plan details + legal T&C link | ✅ |
| FR-7 | Enrolment: native checkbox + label; agreement disclosure below with 3 links | ✅ |
| FR-8 | Sign up blocked until checkbox checked; error stays until checked | ✅ |
| FR-9 | Success: confirmation copy + **Add devices** CTA → account placeholder | ✅ |
| FR-10 | Legal URLs open in a new tab (Terms, Electronic Communications, Privacy) | ✅ |

### Content requirements (enrollment card)

- Checkbox label: **“I want to enroll in Verizon Home Device Protect.”**
- Disclosure (14px / `text-sm`): **“By enrolling, I agree to the Terms & Conditions, Electronic Communications Agreement, and Privacy Notice.”**
- Links must not live inside the `<label>` and must not toggle the checkbox.

Legal destinations (see `lib/utils.ts`):

| Document | Constant |
| --- | --- |
| Terms & Conditions | `TERMS_URL` |
| Electronic Communications Agreement | `ELECTRONIC_COMMUNICATIONS_URL` |
| Privacy Notice | `PRIVACY_NOTICE_URL` |

### Non-functional requirements

| ID | Requirement |
| --- | --- |
| NFR-1 | Mobile-first; desktop review uses a phone frame (~420px / 860px) |
| NFR-2 | Native checkbox keyboard behavior (Tab, Space); links focusable (Enter) |
| NFR-3 | Comfortable checkbox row touch target (~44px / `min-h-11`) |
| NFR-4 | Visible focus styles on the checkbox |
| NFR-5 | Typography: Apercu (Asurion design system); brand colors via theme tokens |

### Out of scope for production hand-off (unless product expands)

- Persisting enrollment to Verizon/Asurion backends
- Real “Add devices” inventory flow
- Analytics event taxonomy beyond `@vercel/analytics` presence

---

## 3. Flow Map

### Customer journey (logical)

```
Customer account (placeholder)
        │
        │  auto-open / View offer
        ▼
┌───────────────────┐     and more      ┌────────────────────┐
│  Upsell sheet     │ ───────────────▶  │ Covered devices    │
│  Get covered /    │ ◀───────────────  │ (accordion)        │
│  No, thanks       │       back        └────────────────────┘
└─────────┬─────────┘
          │ Get covered today
          ▼
┌───────────────────┐
│ Review your plan  │  ← scroll past terms → checkbox → Sign up
└─────────┬─────────┘
          │ Sign up (ack required)
          ▼
┌───────────────────┐
│ You're enrolled   │  → Add devices → Customer account
└───────────────────┘
```

### Interactive Flow Map (reviewers)

Route: **[`/flow`](http://localhost:3005/flow)**

Bird’s-eye view of the experience using the shared AUI Design flow-map template. Each node is a
**real Playwright screenshot** of the prototype, with labeled edges for customer actions. Click a
node to deep-link into that screen.

| Node | Screen | Deep link |
| --- | --- | --- |
| Home / account | Placeholder account page | `/?screen=home` |
| Upsell bottom sheet | Offer + price + benefits | `/?screen=upsell` |
| Covered devices | Category accordion | `/?screen=covered` |
| Sign-up takeover | Review your plan | `/?screen=signup` |
| You’re enrolled | Success confirmation | `/?screen=success` |

Edges (from `lib/flow-data.ts`):

| From | To | Label |
| --- | --- | --- |
| Home | Upsell | View offer |
| Upsell | Sign-up | Get covered today |
| Upsell | Covered devices | Covered devices |
| Covered devices | Upsell | (back) |
| Sign-up | Success | Sign up |

Regenerate screenshots after UI changes (dev server on port 3005):

```bash
pnpm --filter=@asurion-core/vhdp-upsell capture:flow-map
```

Screenshots land in `public/screenshots/`.

---

## 4. Key interaction details

Worth calling out for QA and production teams:

- **Upsell opens by default** on `/` (init screen `upsell`).
- **Covered devices** opens from the underlined **and more** link in “TVs, laptops, gaming devices, and more” — not a row chevron.
- **Acknowledgement gate:** **Sign up** stays visually enabled. Enrollment uses a **native checkbox** with a **separate** agreement-disclosure line. Tapping Sign up early shakes/highlights the card and shows an alert; the error **stays until the checkbox is checked**.
- **Scroll-to-sign-up, by design:** Checkbox and Sign up sit at the **end** of scrollable plan details (not sticky). A bouncing chevron fades in when more content is below the fold.
- **Success:** Confirmation email within 72 hours; CTA is **Add devices** (returns to the blank account placeholder).
- **Account chrome:** Intentionally blank (“Customer account page”) so legal/compliance do not re-review a mocked account UI as the flow evolves.

### Design system

- **Typography:** Apercu Light / Regular / Bold / Black (local).
- **Color:** Verizon red + Asurion blue in co-branded logo; black primary buttons; neutrals for surfaces.
- **Logo:** Consistent size and top-left placement across screens.

---

## 5. Engineering

### Run locally

From the **expert-design** monorepo root:

```bash
pnpm install
pnpm --filter=@asurion-core/vhdp-upsell dev
```

Open [http://localhost:3005](http://localhost:3005).

Other scripts:

```bash
pnpm --filter=@asurion-core/vhdp-upsell build    # production build
pnpm --filter=@asurion-core/vhdp-upsell lint     # eslint
pnpm --filter=@asurion-core/vhdp-upsell capture:flow-map
```

### Project structure

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Orchestrates sheets/takeovers; `?screen=` deep links |
| `app/flow/page.tsx` | Flow Map review route |
| `app/globals.css` | Theme tokens, fonts, shake animation |
| `components/upsell-sheet.tsx` | Offer bottom sheet |
| `components/covered-devices-sheet.tsx` | Covered devices accordion |
| `components/signup-takeover.tsx` | Review your plan + acknowledgement |
| `components/success-takeover.tsx` | Enrollment success |
| `components/brand-logo.tsx` | Verizon \| Asurion logo |
| `components/flow-map-canvas.tsx` | Flow-map canvas template |
| `lib/covered-devices.ts` | Categories and device lists |
| `lib/flow-data.ts` | Flow Map nodes, edges, screenshots |
| `lib/utils.ts` | `cn()` + legal document URLs |
| `scripts/capture-flow-map.mjs` | Playwright capture for `/flow` |
| `public/screenshots/` | Flow Map screenshot assets |

### Architecture notes

- Client-side React state in `app/page.tsx` drives which layer is open (upsell, covered, signup, success).
- No backend: enrollment only advances UI state.
- Legal PDFs/URLs are constants in `lib/utils.ts` — update there for compliance link changes.
- Covered-device copy lives in `lib/covered-devices.ts`.

### Accessibility checklist (enrollment card)

- [x] Native `<input type="checkbox">` with associated `<label>`
- [x] Agreement links **outside** the label
- [x] No card-level `onClick` that toggles the checkbox
- [x] Tab → checkbox and each link; Space toggles; Enter activates link
- [x] Visible focus ring on checkbox
- [x] Validation alert (`role="alert"`) when Sign up pressed without agreement

---

## 6. Deployment

This app lives in the **expert-design** monorepo. Follow the monorepo standard: **one Vercel project
per app**, with Root Directory pointing at this folder — not the repo root.

### Recommended setup (Vercel / v0)

1. In the **Asurion-v0** Vercel team, create (or reuse) a project for this app only.
2. Connect the GitHub repo `asurion-core/expert-design`.
3. Set **Root Directory** to `apps/vhdp-upsell`.
4. Framework: Next.js (auto-detected).
5. Production branch: `main` (merging a PR into `main` triggers production).
6. Preview deployments: each PR / branch gets a preview URL.

Full monorepo deploy guidance (CLI, `NODE_AUTH_TOKEN`, v0 import):

- [docs/MONOREPO-GETTING-STARTED.md](../../docs/MONOREPO-GETTING-STARTED.md) — Step 8
- [docs/GITHUB-TOKEN-SETUP.md](../../docs/GITHUB-TOKEN-SETUP.md) — Vercel env for private packages

> This app does **not** currently depend on private `@asurion-core` npm packages for the build.
> If that changes, add `NODE_AUTH_TOKEN` on the Vercel project.

### CLI deploy (from Cursor / terminal)

```bash
# From monorepo root — link once to the vhdp-upsell Vercel project
cd apps/vhdp-upsell
vercel link   # pick Asurion-v0 + the dedicated project

# Preview
vercel

# Production
vercel --prod
```

Or use the prebuilt flow documented in the monorepo getting-started guide
(`vercel build` then `vercel deploy --prebuilt`).

### Shipping checklist

1. Land changes on a feature branch; open a PR into `main`.
2. Verify the **preview** deployment (upsell, covered, signup ack, success).
3. Merge the PR.
4. Confirm the **production** deployment for the vhdp-upsell Vercel project succeeded.
5. Spot-check production with `/?screen=signup` and `/flow`.

---

## 7. Deep linking

| URL | Opens |
| --- | --- |
| `/` | Upsell sheet (default) |
| `/?screen=home` | Account placeholder only |
| `/?screen=upsell` | Upsell bottom sheet |
| `/?screen=covered` | Covered devices sheet |
| `/?screen=signup` | Sign-up / Review your plan |
| `/?screen=success` | Success page |
| `/flow` | Interactive Flow Map |

---

## 8. Status & notes

- **Front-end prototype only** — no real billing, enrollment API, or email delivery.
- Copy, pricing, terms links, and covered-device lists should be reconfirmed with legal/product
  before production use.
- Covered-device list was sourced from the public Asurion VHDP “What’s covered” content and shown as
  simple text lists per design direction.
- Distinct from the Guided Browsing **marketing** page; this app owns the **review-and-enroll**
  micro experience (offer sheet → terms → ack → confirmation).
