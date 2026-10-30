# Build prompt — AT&T HomeTech Protection upsell (Guided Browsing)

> Paste the section below ("PROMPT") into Claude Code. It builds an AT&T upsell prototype that mirrors the newest **Verizon Home Device Protect** upsell flow in layout, style, and content direction, changing only the AT&T-specific terms, services, and coverages. Reference screenshots of the Verizon flow are in `Expert-Workspace/vhdp-upsell-experience/` (Upsell page.pdf, 🟢 Modal.pdf, vhdp-covered-devices.pdf, VHDP_Guided-Browsing_Test.pdf).

---

## PROMPT

### Goal & mode
Prototype Mode. Build a **high-fidelity, mobile-first** interactive prototype of the **AT&T HomeTech Protection** Guided Browsing upsell experience. It must mirror the existing Verizon Home Device Protect upsell flow (layout, spacing, type hierarchy, interactions, voice) and differ only in the AT&T-specific content called out under "Verizon → AT&T changes." This is a demo/validation prototype, not production — fake all data and navigation; no real billing or enrollment.

### Design system — source of truth
Follow the **Asurion design system**. The component library lives at `/Users/ricardo.deazua/Documents/GitHub/asurion-ui` (browsable Storybook: https://ui.asurion.com). Read it before building and prefer real components over hand-rolled ones. If the repo isn't wired into this prototype, **approximate** the Asurion system — its spacing scale (`--aui-spacing-*`), radius tokens, sentence-case labels, Apercu type ramp, and restrained neutral palette. Do not default to a generic Tailwind/Bootstrap look, and do not invent a new visual language.

- Stack: React + TypeScript. Single mobile viewport (~390–400px wide), centered on a neutral canvas, like the reference.
- Layout is **neutral black-on-white** with a black primary pill button and a plain text secondary link — exactly like the Verizon reference. The only brand color is the carrier logo.
- Co-brand lockup in the header: **AT&T logo** (blue globe + "AT&T") + divider + **asurion** wordmark. (Verizon reference uses the red verizon logo in this slot — swap it for AT&T.)

### Flow — 4 screens/states (mirror the Verizon flow exactly)

**1) Upsell page (entry)**
- Header: AT&T | asurion co-brand lockup.
- Plan summary bar: left "Plan summary" / "AT&T HomeTech Protection"; right "$25/month plus tax" with a chevron (expandable — can be visual-only in the prototype).
- H1: **"One plan for all your eligible home tech."**
- Hero image: the device-spread photo (reuse the same asset family as the reference — tablet, laptop, game console, smart speaker, thermostat, smartwatch).
- Price block: **"$25/month plus tax."** / **"Cancel anytime."**
- Three checkmark benefits (title + supporting line):
  1. **Coverage for eligible home tech** — "TVs, laptops, gaming devices, and more" ("and more" is a link → opens the Covered devices modal)
  2. **Help anytime, not just when something breaks** — "24/7 expert support plus 2 in-home visits each year"
  3. **Protect devices you already own** — "No receipts required for eligible devices"
- Footer actions (fixed to bottom): secondary text link **"No, thanks"** + primary black pill **"Get covered today"** → opens the Review your plan modal.

**2) Covered devices modal (from the "and more" link)**
- Header: AT&T | asurion lockup + close (X).
- Intro: **"AT&T HomeTech Protection covers thousands of eligible home tech products — even if you didn't buy them from AT&T."**
- **"See Terms & Conditions"** link.
- Accordion list, each row = thumbnail + category name + chevron (expandable; placeholder device lists inside are fine):
  Home entertainment · Computers & office · Smart home · Smart home security · Healthcare tech and wearables
- Primary black pill **"Done"** closes the modal.

**3) Review your plan modal (from "Get covered today")**
- Header: **"Review your plan"** + close (X).
- Title **"AT&T HomeTech Protection"**, then **"$25/month plus tax."** and subtle **"Billed through AT&T."**
- Section **"Included with your plan"** (checkmark list):
  - Repairs or replacements for breakdowns on eligible home tech
  - Covers drops, spills, and cracked screens — accidental damage from handling ("ADH") — on certain portable devices
  - 24/7 expert tech support
  - 2 in-home expert visits every 12 months
- Section **"Important plan details"** (bulleted list):
  - Enrollment is optional and renews monthly until canceled.
  - Cancel anytime in your AT&T account at att.com/myatt or call 866-642-4170.
  - Coverage starts on day 31. Tech support starts on day 1.
  - This isn't insurance, and it doesn't cover phones.
  - Pre-existing conditions aren't covered.
  - A service fee up to $99 plus tax applies.
  - Claim limits: $2,000 per claim and $5,000 total per 12 month period.
  - Repairs may use non-original parts. We may provide a new, refurbished, or remanufactured replacement of like kind and quality, or reimburse you.
  - See the Terms & Conditions for complete coverage details, including arbitration provisions and a class action waiver.
  - Plan communications are sent electronically, as described in the Electronic Communications Agreement.
- Enrollment checkbox (in a subtle filled container): **"I want to enroll in AT&T HomeTech Protection. I agree to the Terms & Conditions, Electronic Communications Agreement, and Privacy Notice."** (the three agreement names are links)
- Primary black pill **"Sign up"**, **disabled until the checkbox is checked** → opens the confirmation screen.

**4) Confirmation ("You're enrolled")**
- Header co-brand + plan summary bar (same as the upsell page).
- Hero device-spread image.
- H1: **"You're enrolled — welcome aboard!"**
- Sub: **"You'll get a confirmation email with plan details within 72 hours."**
- Three icon benefits (shield / headset / wrench):
  - **Cover your most important tech** — "Covers TVs, laptops, gaming, and more!"
  - **24/7 tech support** — "Priority help from experts who can answer virtually any home tech question."
  - **Hassle-free repairs** — "Covers products you already own and future purchases, no receipts required."
- Primary black pill **"Register my devices"**.

### Verizon → AT&T changes (apply only these; everything else is identical)
1. **Brand/logo:** red verizon → **AT&T** (blue globe + "AT&T"), co-branded with asurion. Layout and colors otherwise unchanged (neutral, black button).
2. **Product name:** "Verizon Home Device Protect" → **"AT&T HomeTech Protection"** everywhere (header, plan summary, both modals, checkbox, confirmation). Use this exact spelling consistently.
3. **Billing line:** "Billed through Verizon" → **"Billed through AT&T."**
4. **Cancel path:** "MyVerizon or call 855-730-7169" → **"your AT&T account at att.com/myatt or call 866-642-4170."**
5. **Covered-devices intro:** "didn't buy them from Verizon" → **"didn't buy them from AT&T."**
6. **Claim limit:** Verizon's "$3,000 per claim" → **"$2,000 per claim"** (the $5,000 / 12-month total is unchanged).
7. **AT&T carries extra disclosures Verizon's current modal doesn't show** — include all of them: "Coverage starts on day 31. Tech support starts on day 1," "This isn't insurance, and it doesn't cover phones," "Pre-existing conditions aren't covered," the "ADH" term in the coverage line, "remanufactured" as a third replacement option, and the standalone Electronic Communications bullet.
8. Unchanged from Verizon: $25/month plus tax, 2 in-home visits/year, 24/7 support, service fee up to $99 plus tax, arbitration + class-action language, overall structure, voice, button styles, and the confirmation screen.

### Interactions & states (prototype scope)
- Upsell → "Get covered today" opens Review-your-plan modal; "and more" opens Covered-devices modal; "No, thanks" can be a no-op or a simple dismissed state.
- Review-your-plan: **Sign up is disabled until the checkbox is checked**; checking it enables the button; Sign up → confirmation screen. X closes back to the upsell page.
- Covered-devices: accordion rows expand/collapse; "Done" and X close back to the upsell page.
- Modals: present as bottom-sheet/overlay consistent with Asurion `BottomSheet`/`Dialog`. Dim scrim behind. The enrollment action should sit after the disclosures (don't make the Sign up button sticky over unread content).
- Keep motion minimal and functional (modal in/out, accordion expand). No decorative animation.

### Voice & content rules (do not violate)
- Asurion voice: sentence case for all headings/labels/buttons, second person, active voice, 8th-grade plain language, serial (Oxford) comma. Buttons are verb-first with no punctuation.
- Phone numbers: dashes, no parentheses (866-642-4170). Currency: "$25", "$2,000", "$5,000". "Cancel anytime" as one word.
- **Do NOT use the word "warranty" anywhere, and do not make comparative claims (e.g. "more protection than a warranty").** AT&T marketing copy must avoid this — it can trigger a New Jersey regulation about using warranty language in marketing without disclosure, and comparatives are unsubstantiated. The Verizon reference already avoids this; keep it that way.

### Flags to surface in the build (leave visible as code comments or a NOTES block)
- **Claim limit = $2,000 per claim** per current direction — confirm against final AT&T Terms & Conditions before any real use.
- **"Coverage starts on day 31"** should remain only until the updated AT&T Terms & Conditions take effect; after the cutover date (TBD — confirm with legal), remove this line and update every Terms & Conditions link.
- **"like kind and quality"** is kept as the legal phrasing; a plainer "similar type and quality" is preferred for customers but needs legal sign-off before swapping.

### Fidelity, responsiveness, accessibility
- High-fi, matching the Verizon reference's polish. Mobile viewport first; keep it usable if the window is wider (center the device frame).
- Accessible by default: real heading hierarchy, labeled controls, visible focus states, checkbox with an associated label, sufficient contrast, non-directional language. Modals trap focus and are dismissible via the X and Escape.
- Use realistic content (the strings above), not lorem ipsum.

### Deliverable & what's rough
- A runnable React prototype with the four screens/states wired together. Note in a short README what's faked (links go nowhere, no real enrollment/billing, device-category lists inside the accordions are placeholder, plan-summary expand is visual-only).
- When done, show the running prototype and a one-line note on anything rough; don't present it as production-ready.
```
