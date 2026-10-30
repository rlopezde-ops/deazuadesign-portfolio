# Conversational UI Reference — Customer-Facing Patterns

This file captures reference material pulled from a customer-facing Figma file, "💠 Conversational UI":
https://www.figma.com/design/z4NF7x3ox3WA7nqkFzR5Js/💠-Conversational-UI?m=dev&node-id=61-13715

There's no Figma connector set up in this Claude project, so this is a distilled snapshot from screenshots (shared 2026-09-10) — not something Claude can refetch or verify against the live file. If the Figma file changes, this file can go stale; check the source if something here seems off.

**Why this is here:** these screens are customer-facing (the AI/Joy talking directly to the customer through "Schedule repair" and issue-intake flows), not Expert-facing. They're included as a *tone and phrasing reference*, not a structural template — per Ashley, Expert-facing verbatims should mirror this voice, and Expert-facing headers should be "reminiscent of what's on web." Expert-facing screens serve a coaching/guidance function (helping the agent help the customer), not a direct customer conversation, so don't force the same structural pattern onto Expert screens just because it's the customer-facing default.

## Modular anatomy of a conversational screen

Named components, top to bottom: **Topic**, **Topic Context**, **Affirmation**, **Directive**, **Directive detail** (Markdown), **Actions** (Primary), **Suggestions** (Secondary), **Prompt input** — plus Media upload / Text input / Live mode toggles at the bottom of the input bar.

Topic/Topic Context is the header/label layer; Affirmation/Directive is the actual scripted line. Keeping these two layers distinct matters for Expert-facing copy too — see the "Headers vs. verbatim script lines" section in `working-conventions.md`.

## Named interaction patterns (each has a documented guideline in the file)

- **Natural Language** — use when the user can answer in their own words and the AI can interpret/infer/clarify (device type, issue details, symptoms, damage description). Avoid turning these into dropdowns/forms too early. Guideline: *"Use chat for expression. Let the AI collect messy input first, then clarify only when needed."*
- **Single Selection** — one question, small set of clear options, no need for a full widget. Guideline: *"If it is one question and one decision, use the Selection Slot instead of opening an Input Widget."*
- **Multi-Selection** — default to natural language for multi-part issue details; use multi-select only when explicit selection/rejection/structured capture is legally or diagnostically required. Guideline: *"Default to natural language for multi-part issue details. Use multi-select only when explicit selection, rejection, or structured capture is required."*
- **Structured Input (Input Widget)** — for location, scheduling, contact info, verification codes, consent, payment, final review. Avoid opening it for a single open-ended question. Guideline: *"Use the Input Widget when structure makes the task easier, safer, or more actionable, and part of a flow."*
- **More Details (Dialog)** — supplemental explanation only, never primary decision-making, never hides critical info. Guideline: *"Keep the main choice lightweight. Use details to support confidence, not to carry the whole experience."*
- **Specific Date** — start with lightweight quick choices (Today / Yesterday / Another date); escalate to a full calendar picker only when precision is needed. Guideline: *"Start with the simplest useful input. Escalate to structured selection only when precision is needed."*

## Tone phrase bank (Affirmation → Directive rhythm)

A short acknowledgment beat — usually 1–3 words, never effusive or over-apologetic — comes before the bolded question/directive. Observed across many screens:

"Got it." · "Understood." · "Okay." · "Oh bummer. We can definitely help." · "Oof, that's rough." · "So sorry to hear that." · "Alright. Let's get a bit more info." · "Awesome." · "Perfect." · "Great, we've got a couple options."

Use this bank as a reference point when checking whether an Expert-facing verbatim line or header sounds like it belongs in the same voice.

## Open question

Some flow comparisons show "Current (Joy)" vs. "Proposed (Chai + Joy)" — a second AI/system called **Chai** appears to be getting layered in for some flows. Scope isn't clear yet from what's been shared. Flag this if it becomes relevant to tone consistency, or ask Ashley directly.
