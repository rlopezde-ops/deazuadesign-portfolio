# AT&T HomeTech Protection — Guided Browsing Content Updates

**Purpose:** Apply the legal-review feedback to the AT&T Guided Browsing enrollment experience while keeping the copy human, plain-spoken, and aligned to Asurion's brand voice (Joy).
**Source of feedback:** Verizon Enrollment Flow Legal Review (9/21/2026) + AT&T legal review (9/21/2026) + current Figma (node 7248-16855).
**Voice basis:** Joy customer-facing voice — plain language, sentence case, positive framing, 8th-grade reading level, one idea per line.
**Prepared:** 2026-09-29

> This is proposed copy for design + legal review, not approved final language. Three items below need legal confirmation and are tagged **⚠ Confirm with legal**.

---

## Fix first — inconsistencies in the current design

These are content bugs in the current file, independent of voice. Resolve before anything else.

1. **Claim limit amount is inconsistent.** One frame of the modal reads **"$2,000 per claim"** and another reads **"$3,000 per claim."** Pick one and use it everywhere. The Verizon flow settled on **$3,000 per claim / $5,000 per 12 months** — confirm the correct AT&T figure. **⚠ Confirm with legal.**
2. **Product name is inconsistent.** The flow uses both **"AT&T HomeTech Protection"** and **"AT&T Home Tech Protect."** Standardize on the official product name (**AT&T HomeTech Protection**) in every screen, the plan-summary chip, the modal title, and the checkbox.
3. **"Cancel anytime" vs. "Cancel any time."** The hero sub-bar shows both spellings across frames. Standardize on **"Cancel anytime"** (one word).

---

## Screen 1 — Intro carousel (marketing)

The carousel voice is already close to Joy — warm, plain, benefit-led. Light touch only; keep the spirit.

### Card 1 — Devices  ⚠ Legal flag (Kelly Horejs) — "warranty" in marketing language

| | |
|---|---|
| **Current** | **Go beyond typical warranties** — "Taking care of your home tech doesn't have to be a headache." |
| **Revised (recommended)** | **Hassle-free protection and tech support** — "Caring for your home tech shouldn't be a headache. We make it simple." |
| **Warmer alternate** | **Home tech protection, minus the headaches** — (same body) |
| **Why** | "Go beyond typical warranties" is a comparative claim ("beyond" = better than) that also puts the word *warranty* into marketing copy. Both are the trigger Kelly named. Dropping the warranty reference and the comparison removes the NJ disclosure exposure entirely and leaves nothing to substantiate — while "hassle-free" keeps the original headache-free spirit. Cleaned to sentence case with the hyphen the compound adjective needs. |

### Card 2 — Tech Coach (Mary)  ⚠ Legal flag (Kelly Horejs) — comparative claim + NJ warranty rule

> **Kelly's comment:** *"I don't love 'More protection. Less paperwork.' I assume we mean more protection than a warranty but we don't know that for sure right? Also, there is the NJ regulation about using warranty in marketing language that I think may be implicated here. We are saying it's more protection than a warranty without explicitly saying this is not a warranty, so we might be triggering the NJ regulation about disclosing."*

| | |
|---|---|
| **Current headline** | **More protection. Less paperwork.** |
| **Revised (recommended)** | **One simple plan. No receipts.** |
| **Alternates** | **One plan. Less paperwork.** (closest to original cadence) · **No receipts needed — just protection** (Kelly's option, warmed up) |
| **Current body** | "Don't rely on a collection of warranties. We'll take care of your home tech with one simple plan – no receipts needed." |
| **Revised body** | "No juggling, no separate plans to track. One simple plan covers your home tech — no receipts needed." |
| **Why** | Two concerns, one fix. "More protection" is an unsubstantiated comparative (more than *what*?) and it implies we beat a warranty without disclosing this isn't one — the NJ trigger. Removing the comparison and the word *warranty* clears both. The recommended headline keeps the original's two-beat rhythm and states facts (one plan / no receipts) instead of a claim. **The body carried the same "warranties" reference** — fixed here too, or the exposure stays in the paragraph even after the headline is fixed. |

### Card 3 — What you get

| | |
|---|---|
| **Current** | **Here's what you get** — "Your eligible home tech—covered" · "Fast repairs and replacements" · "24/7 tech support" |
| **Revised** | **Here's what you get** — "Your eligible home tech, covered" · "Fast repairs and replacements" · "24/7 tech support" |
| **Why** | Swap the em dash for a comma so a screen reader and a quick scan both land naturally. Otherwise this card is doing its job — leave it. |

### Hero + plan chip (persistent)

Keep "Protect all your eligible [home tech]" and "Only $25/month plus tax. Cancel anytime." No change beyond the "Cancel anytime" standardization noted above.

---

## Screen 2 — "Review your plan" modal (the legal-heavy screen)

This is where every legal item lands. The current modal already includes most required disclosures — the goal here is to keep the substance intact while making each point one clear, human idea, and to reconcile it with the Verizon-flow legal decisions.

### Title + plan header

| | |
|---|---|
| **Current** | "Review your plan" · "AT&T HomeTech Protection" · "$25/month plus tax." · "Billed monthly through AT&T" |
| **Revised** | Keep as-is. |
| **Why** | Clear hierarchy, one price, one action to come. Nothing to fix. |

### Section label

| | |
|---|---|
| **Current** | **Important plan details** |
| **Revised** | **Before you enroll** |
| **Why** | Tells the customer *why* this section matters and ties it to the decision they're about to make. Matches the framing legal accepted on the Verizon flow. |

### Lead line

| | |
|---|---|
| **Current** | "I understand enrollment in the plan is optional and will continue to renew each month until canceled." |
| **Revised** | "Enrolling is optional. Your plan renews automatically each month until you cancel." |
| **Why** | The first-person "I understand…" attestation is redundant with the agreement checkbox at the bottom. A plain second-person statement is easier to read and keeps the acknowledgment where it belongs (the checkbox). Positive, active, plain. |

### Cancel

| | |
|---|---|
| **Current** | **Cancel anytime.** To avoid recurring charges, cancel before your next billing cycle through your AT&T account at att.com/myatt, call 866-642-4170, or use the other methods described in the Terms and Conditions. |
| **Revised** | **Cancel anytime.** To stop future charges, cancel before your next bill — in your AT&T account at att.com/myatt, by calling 866-642-4170, or through the other methods in the Terms and Conditions. |
| **Why** | "Stop future charges" and "next bill" are plainer than "recurring charges" and "billing cycle." Phone format already matches the style guide (dashes, no parentheses). Substance unchanged. |

### What's covered + when it starts  *(split the overloaded bullet into two)*

| | |
|---|---|
| **Current** | "The plan offers repairs, replacements, or reimbursement on eligible home tech products. Pre-existing conditions aren't covered. Coverage starts on day 31; Tech support is available on day 1." |
| **Revised** | • **We'll repair, replace, or reimburse you** for eligible home tech. Pre-existing problems aren't covered.<br>• **Coverage starts on day 31. Tech support starts on day 1.** |
| **Why** | One bullet was carrying three separate facts. Splitting them makes each scannable and keeps the day-31 / day-1 distinction from getting lost. Active voice ("We'll repair…") is warmer than "The plan offers." Keep the day-31 line until the terms change (see interaction notes). |

### Service fee

| | |
|---|---|
| **Current** | Service fee of up to $99 + tax for each approved claim. |
| **Revised** | **A service fee of up to $99 plus tax applies** to each approved claim. |
| **Why** | Legal preferred the definite "applies" over softer phrasing, and "plus tax" over "+ tax" reads as a sentence rather than a formula. |

### Not insurance / what it covers

| | |
|---|---|
| **Current** | **The plan is not insurance and doesn't cover phones.** It covers malfunctions; and Accidental Damage from Handling ("ADH") on certain portable products. Claim limits are $2,000 per claim and $5,000 for all claims in a 12-month period. |
| **Revised** | • **This isn't insurance, and it doesn't cover phones.** It covers breakdowns — plus drops, spills, and cracked screens (accidental damage from handling, or "ADH") on certain portable devices.<br>• **Claim limits: $3,000 per claim and $5,000 total in any 12-month period.** ⚠ Confirm the per-claim amount with legal. |
| **Why** | "Covers breakdowns, plus drops, spills, and cracked screens" is the human translation legal accepted on the Verizon flow, while the parenthetical keeps the exact legal term "ADH." Pulling the claim limits onto their own line makes the numbers easy to find. Fixes the stray semicolon. **This is also where the $2,000/$3,000 discrepancy must be resolved.** |

### Limits, exclusions, arbitration

| | |
|---|---|
| **Current** | **Limitations and exclusions apply.** Review the Terms and Conditions, which contain arbitration for disputes and a class action waiver. |
| **Revised** | **Limits and exclusions apply.** See the Terms and Conditions for full coverage details, including arbitration for disputes and a class action waiver. |
| **Why** | Keeps the required arbitration + class-action language verbatim in substance; "See … for full coverage details" is friendlier than "Review … which contain." Do not shorten past this — legal treated this disclosure as required. |

### Parts + replacements

| | |
|---|---|
| **Current** | **Repairs may use non-original parts.** Replacements may be new, refurbished, or remanufactured of like kind and quality. |
| **Revised** | **Repairs may use non-original parts.** If we replace a device, it may be new, refurbished, or remanufactured — of similar type and quality. ⚠ Confirm "similar type and quality" can stand in for "like kind and quality." |
| **Why** | "If we replace a device…" is more human than "Replacements may be." "Similar type and quality" is far easier for customers than "like kind and quality," but that phrase may carry specific legal meaning — flagged for confirmation. Keeps all three replacement types (new / refurbished / remanufactured). |

### Electronic communications

| | |
|---|---|
| **Current** | Plan-related communications will be sent electronically according to the Electronic Communications Agreement. |
| **Revised** | **We'll send plan communications electronically,** as described in the Electronic Communications Agreement. |
| **Why** | Active voice, second person, same meaning. Keeps the ECA reference intact. |

### Agreement checkbox

| | |
|---|---|
| **Current** | I want to enroll in AT&T HomeTech Protection. I agree to the Terms & Conditions, Electronic Communications Agreement, and Privacy Notice. |
| **Revised** | Keep as-is (just confirm the product name matches everywhere). |
| **Why** | This is the actual consent action and reads clearly. Leave it. |

### Primary button

| | |
|---|---|
| **Current** | Sign up |
| **Revised** | **Enroll** (recommended) |
| **Why** | The checkbox says "I want to *enroll*," so the button should match the word the customer just agreed to — one clear, consistent action. Optional: if AT&T brand prefers "Sign up" across the flow, keep it consistent everywhere instead. |

---

## Screen 3 — Confirmation

Currently a placeholder ("Existing Confirmation Page Content"). No new copy needed until the real confirmation content is in the file. When it is, mirror the same voice: lead with what's done ("You're covered"), confirm the price and start date, and give one clear next step.

---

## Interaction notes carried over from legal (not copy, but required)

These came out of the legal review and affect the enrollment screen behavior:

1. **Don't keep the checkbox and Enroll button sticky.** Customers should scroll through all disclosures before the enrollment action appears. Use a subtle scroll cue so the page doesn't feel incomplete.
2. **Handle the day-31 line by launch timing.** Keep "Coverage starts on day 31" until the updated Terms and Conditions take effect, then remove it and update every Terms & Conditions link at the same time. (Verizon's equivalent cutover date was 2026-08-27 — confirm AT&T's date.) **⚠ Confirm with legal.**
3. **Prepare both review formats for legal:** the clickable prototype (for interaction + scroll review) and a PDF they can annotate.

---

## Clean copy — "Review your plan" modal (paste-ready)

**Review your plan**

**AT&T HomeTech Protection**
**$25/month** plus tax.
Billed monthly through AT&T

**Before you enroll**

Enrolling is optional. Your plan renews automatically each month until you cancel.

- **Cancel anytime.** To stop future charges, cancel before your next bill — in your AT&T account at att.com/myatt, by calling 866-642-4170, or through the other methods in the Terms and Conditions.
- **We'll repair, replace, or reimburse you** for eligible home tech. Pre-existing problems aren't covered.
- **Coverage starts on day 31. Tech support starts on day 1.**
- **A service fee of up to $99 plus tax applies** to each approved claim.
- **This isn't insurance, and it doesn't cover phones.** It covers breakdowns — plus drops, spills, and cracked screens (accidental damage from handling, or "ADH") on certain portable devices.
- **Claim limits: $3,000 per claim and $5,000 total in any 12-month period.**
- **Limits and exclusions apply.** See the Terms and Conditions for full coverage details, including arbitration for disputes and a class action waiver.
- **Repairs may use non-original parts.** If we replace a device, it may be new, refurbished, or remanufactured — of similar type and quality.
- **We'll send plan communications electronically,** as described in the Electronic Communications Agreement.

☐ I want to enroll in AT&T HomeTech Protection. I agree to the Terms & Conditions, Electronic Communications Agreement, and Privacy Notice.

**[ Enroll ]**
