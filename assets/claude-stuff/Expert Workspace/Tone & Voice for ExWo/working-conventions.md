# Working Conventions — Voice & Tone Reviews

These aren't part of the official brand docs — they're conventions that developed through use, from working with this Claude project over time. Sharing them so your setup behaves the same way.

## Source of truth

Notion is the canonical, maintained source for Joy's brand voice material. The local markdown files in this package (Core Identity.md, Core Identity Final(ish) Draft.md, WIP Joy for Experts.md, etc.) may be drafts or exports and could lag behind Notion. If the local files ever conflict with Notion, defer to Notion.

The Notion workspace covers each style-guide section plus three pillar-specific personas: **Customer**, **Client**, and **Expert**. `AI Personality Wiki.md` is the index that links out to those Notion pages — check it for the current links, since Notion URLs aren't reproduced here.

## How feedback should be formatted

When reviewing screenshots, Figma links, or pasted content for header/scripting/content feedback, format the response as a table only — grouped by screen if there are multiple screens. Columns: **Header/Element | Issue | Fix**.

Do not add a closing recap, summary list, or "here's everything together" wrap-up after the table. The table alone is the deliverable.

**Issue column format:** use a colored emoji swatch + a short tag in inline code formatting, rather than a plain-text description, so issue types are scannable at a glance. Use this legend consistently — don't reassign colors without checking first:

- 🟢 `Approved` — no change needed
- 🟠 `Case` — sentence case / title case violations
- 🔵 `Terminology` — wrong word choice per terminology do's/don'ts
- 🟣 `Tone/voice` — doesn't match Joy's core traits or the Expert persona voice
- 🔴 `Clarity/error handling` — unclear, confusing, or violates the error-message formula
- 🟡 `Punctuation/formatting` — dashes, commas, number/date/time/phone formatting per the style guide
- ⚪ `Other` — anything that doesn't fit the above; use a plain-text note if needed

If a new issue type comes up that doesn't fit the legend, pick the next unused color and note the new mapping — or just ask before assigning it.

## Expert-facing tone specifically

This project is scoped to Expert-facing experiences (call center agents), not the direct customer-facing voice. Ground feedback in two layers together:

1. The Core Identity / style guide rules — plain language, 8th-grade reading level, terminology, punctuation and formatting.
2. The Expert-specific coaching patterns from `WIP Joy for Experts.md` — Expert-facing copy should read as "guided execution" or "meta-coaching" tone (helping the expert help the customer), not the warmer, direct customer-facing conversational voice.

`WIP Joy for Experts.md` also covers adapting coaching tone/depth by expert tenure (new hire / mid-tenure / veteran) and three coaching modes (Performance, Mentorship, Efficiency) — worth keeping in mind when copy is meant to coach the expert rather than just inform them.

## Headers vs. verbatim script lines

Don't lead section headers or context-clue labels with imperative verbs like "Ask..." or "Say..." — that verb-first shape is reserved for actual verbatim lines meant to be read/paraphrased to the customer (e.g., "Say: 'How can I help today?'"). A header phrased that way reads to an Expert as another line to recite, not a label. Fixed headers should read as context clues instead:

- Third-person orienting questions ("What device are they having issues with?")
- Declarative/status labels ("Device for this call: unconfirmed")

Reserve the imperative "Ask:"/"Say:" construction strictly for genuine verbatim lines. A coaching nudge (as opposed to a scripted line) should also avoid mimicking that Say:/Ask: prefix shape unless it's actually using that convention on purpose.

## Calibrating tone against the customer-facing product

See `conversational-ui-patterns.md` — a reference pulled from the customer-facing Conversational UI Figma file: named interaction patterns (Natural Language, Single Selection, Multi-Selection, Structured Input, More Details, Specific Date) and an Affirmation → Directive tone phrase bank ("Got it.", "Oof, that's rough.", etc.). Use it to check that Expert-facing headers/verbatims mirror the web voice — without assuming the same *structural* pattern applies, since Expert screens coach the agent rather than converse with the customer directly.
