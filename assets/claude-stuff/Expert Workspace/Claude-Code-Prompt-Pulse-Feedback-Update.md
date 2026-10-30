# Claude Code prompt: update the Pulse feedback prototype

Paste everything below the line into Claude Code, run from the root of the Pulse feedback prototype repo (the one deployed to pulse-feedback-asurion-v0.vercel.app).

---

## Context

This repo is the Pulse feedback modal prototype. Experts use the modal to report workspace problems mid-call. The prototype has a configuration panel with an **Allow free text** toggle. When it's off, the modal is in **selection only (Verizon)** mode. Verizon, VZCH, and Fios experts can't type free text, for contract and PII reasons, and they make up about 68% of all feedback reports.

We analyzed 2 months of real reports (about 617), the Q4 2025 SUS survey, and the incident channel. The current options produce reports the dev team can't act on, for these reasons:

- One category ("Something isn't working") holds about 70% of Verizon volume, and the problems in it belong to five different teams.
- Chips are vague. "Audio problems" doesn't say direction. "Display issue" appears three times.
- Two top-10 issues have no option: call didn't connect, and callbacks.
- Multi-select leads to select-all reports.
- A lone "Something else" was picked alone 36 times and carries no information.
- No report says how badly the customer was affected or when it happened.

Your job is to restructure the modal around a Where → What happened → Impact and when flow, and apply the decisions below.

## Before you start

1. Run `git status` and read the repo structure. Preserve any uncommitted work. Work on a new branch: `feat/verizon-structured-feedback`.
2. Find and read these before editing:
   - the category/chip config (today it's an array of `{ id, label, description, placeholder, chips: [{ id, label }] }` with categories `broken`, `tool`, `sales`, `idea`);
   - the modal components (header "What's on your mind?", step "What's this about?", the review/auto-capture screen, the thank-you screen);
   - the capture logic (screenshot, errors, userId, sessionId, timestamp, and the `errorLog` store);
   - the configuration panel ("Allow free text", "Simulate capture failure", "Payload preview");
   - the flow map / screen-transitions page ("17 screens", Playwright prompt).
3. Then write a short plan listing the files you'll change, and wait for my approval before you edit.

## Decisions (already made, don't revisit)

1. **Remove "I have an idea" in selection-only mode.** Without text, an idea chip carries no content. In free-text mode, keep the idea category, but take it out of the bug flow. Show it as a separate, quieter entry at the bottom of Step 1: "Share an idea" (a text button, not a card).
2. **Remove the screenshot entirely, in both modes.** The real modal already attaches a FullStory link, which is more useful and is already masked. Delete these:
   - the screenshot capture;
   - the screenshot row and its viewer;
   - the "View screenshot" screen;
   - `screenshot` from the payload.
3. **Replace the screenshot with a FullStory link plus a fallback.** Add a mocked `fullStoryUrl` to the auto-captured data. When it's missing, set `fullStoryMissing: true` and make sure the local event buffer (last 10 UI events + errors) is still included.
4. **One choice per step.** Replace multi-select chips with single choice. Use the word "Choose", never "Select", because this is pick-one.
5. **Same data model in both modes.** The Where → What → Impact flow applies to free-text mode too. Free text only adds an optional "Anything else we should know?" textarea after Step 3. Placeholder: "Don't include customer names, numbers, or account info." In selection-only mode the textarea is never rendered.

## New option tree

Put this in one typed config module, replacing the current category array. Use `as const` objects or union types; no enums. Each area needs `id`, `label`, `sessionTypes`, `owner`, and `options`. Every area ends with a `not-listed` option labelled "Not listed".

### Step 1: "Where did it happen?" (choose one)

Filter by session type. Voice experts never see chat areas and chat experts never see call areas.

| id | Label | sessionTypes | owner |
|---|---|---|---|
| `call-audio` | Call audio | voice | telephony |
| `call-connection` | Call connection | voice | telephony |
| `transfers-callbacks` | Transfers and callbacks | voice | routing |
| `chat-messages` | Chat messages | chat | messaging |
| `status` | My status | voice, chat | status |
| `expert-assist` | Expert Assist | voice, chat | ai-assist |
| `activation-guide` | Activation guide | voice, chat | solve |
| `offers-enrollment` | Offers and enrollment | voice, chat | sales |
| `workspace-screen` | Workspace screen | voice, chat | front-end |

### Step 2: "What happened?" (choose one)

| Area | Options (id: label) |
|---|---|
| call-audio | `customer-cant-hear`: Customer can't hear me · `expert-cant-hear`: I can't hear the customer · `no-audio`: No audio either way · `choppy`: Choppy, robotic, or echo · `cut-out`: Audio cut out mid-call · `not-listed`: Not listed |
| call-connection | `dropped`: Call dropped · `never-connected`: Call never connected · `ghost-call`: Rang but no one was there · `cant-end`: Couldn't end the call · `not-listed` |
| transfers-callbacks | `transfer-failed`: Transfer didn't go through · `destination-missing`: Destination missing from the list · `dropped-in-transfer`: Customer dropped during transfer · `callback-no-dial`: Callback didn't dial · `callback-cant-cancel`: Couldn't cancel a callback · `not-listed` |
| chat-messages | `my-message-failed`: My message didn't send · `customer-message-missing`: Customer's message didn't arrive · `late`: Messages arrived late · `duplicated`: Messages duplicated or unreadable · `false-neglect`: Neglect warning was wrong · `not-listed` |
| status | `stuck-after-call`: Stuck after a call · `changed-on-own`: Changed on its own · `cant-change`: Couldn't change it · `timer`: Timer didn't reset · `not-listed` |
| expert-assist | `no-response`: No response or error · `wrong-answer`: Wrong answer · `outdated`: Outdated info · `slow`: Too slow · `not-listed` |
| activation-guide | `wrong-steps`: Wrong steps for this device · `device-missing`: Device isn't in the list · `step-stuck`: Step won't advance · `step-error`: Error on a step · `not-listed` |
| offers-enrollment | `enrollment-error`: Enrollment error · `eligibility`: Wrong eligibility · `checklist`: Checklist didn't update · `device-not-found`: Couldn't find the customer's device · `wrong-language`: Script in the wrong language · `not-listed` |
| workspace-screen | `froze`: Froze or stopped responding · `slow`: Slow to load · `blank`: Went blank · `missing`: Something's missing · `layout`: Layout looks broken · `not-listed` |

### Step 3: "What happened to the customer?" and "When?" (one screen)

- **Impact** (required, choose one, no default): `lost`: Customer was lost · `waited`: Customer had to wait · `workaround`: I used a workaround · `none`: No customer impact
- **When** (segmented control, default `now`): `now`: Just now · `this-call`: Earlier this call · `today`: Earlier today

Compute `occurredAt` from `when`: submit time for `now`; mocked call start for `this-call`; `null` with `occurredWindow: "today"` for `today`.

## Flow and interaction

- **Steps.** Step 1 → Step 2 → Step 3 → Review → Submit → Thanks.
  - Choosing an option on Step 1 or 2 advances automatically.
  - Each step after Step 1 shows the previous choices as a compact breadcrumb, with a "Change" text button that goes back to that step. Keep the existing "Change" pattern.
  - Changing the area clears the downstream choices. This fixes the chip-carry-over bug, where Sales reports arrived with tech chips.
- **Validation.** Buttons are never disabled. If Submit is clicked without an impact, run validation on click, show an inline error on the impact group, and move focus to it. Message: "Choose what happened to the customer." Changing the impact clears the error.
- **"Not listed".** When chosen, show a one-line note under the options: "Thanks — we'll attach extra details so the team can figure it out." Also set `notListed: true` in the payload.
- **Review screen.** Lead with the summary sentence, e.g. "Call audio · Customer can't hear me · Customer had to wait · Just now". Below it, show the auto-captured block, collapsed by default, with the existing note "Collected automatically to help us look into this. You can't edit these."
- **Keyboard.** Arrow keys move between options and Enter chooses, matching the existing arrow-key handling. Return focus to the trigger when the modal closes.

## Copy

| Where | Selection-only (Verizon) | Free-text mode |
|---|---|---|
| Header | What went wrong? | What went wrong? |
| Subtext | Choose what happened. We'll attach the technical details. | Choose what happened. You can add details at the end. |
| Thanks title | Thanks for reporting this | Thanks for reporting this |
| Thanks body | We use every report to find and fix problems. | same |

Rules for all copy:

- Sentence case.
- No uppercase text and no `tt="uppercase"`.
- Buttons start with a verb ("Submit report", "Close").
- No exclamation marks.

## Auto-captured payload

Update the capture logic and the **Payload preview** so a submitted report looks like this (mock values are fine):

```ts
{
  area: "call-audio", areaLabel: "Call audio", owner: "telephony",
  issue: "customer-cant-hear", issueLabel: "Customer can't hear me",
  notListed: false,
  impact: "waited", when: "now", occurredAt: "2026-10-02T15:04:11Z",
  freeText: null,                       // always null in selection-only mode
  context: {
    partner: "verizon", sessionType: "voice", version: "3.42.0",
    userId, sessionId, callSid, // chatContactId for chat
    callPhase: "in-call",               // pre-call | in-call | wrap-up
    activeTool: "sidecar/offers",
    audio: { inputDevice, micLevel, softphoneState },   // voice only
    statusHistory: [...],
    assistRequestId, assistErrorCode,   // only when area = expert-assist
    enrollmentErrorCode,                // only when area = offers-enrollment
    eventBuffer: [/* last 10 UI events */],
    errors: [/* existing errorLog */],
    fullStoryUrl, fullStoryMissing,
  },
  submittedAt
}
```

Only include area-specific fields when they're relevant. Don't send empty keys.

## Configuration panel changes

- Keep **Allow free text**, and label its off state "Selection only (Verizon)".
- Add **Session type**: Voice / Chat (segmented). It drives the Step 1 filter.
- Replace **Simulate capture failure** with **Simulate FullStory missing**. Description: "FullStory link fails to attach; event buffer still sent."
- Keep **Simulate error** and **Payload preview**.

## Flow map and docs

- Update the screen-transitions / flow map page. Remove the screenshot screens and the idea path in selection-only mode, and add Step 2, Step 3, the validation error, and the "Not listed" state. Update the screen count in the title.
- Update the Playwright prompt text on that page to match the new flow.
- Add a short `FEEDBACK_TAXONOMY.md` next to the config. For each area, record its id, label, owner, and the evidence it comes from (Audio rank 1, Freezing rank 2, Dropped rank 3, Stuck in status rank 6, Call failed to connect rank 7, Callbacks rank 8). It should also explain the "Not listed > 10% means we need a new option" rule.

## Conventions to follow

- Use the repo's existing stack and components (Mantine, the existing store, existing tokens) before adding anything new. Don't add dependencies.
- Phosphor icons only. No text glyphs.
- Pill buttons as set in the theme.
- Compound components where the modal already uses them.
- No disabled buttons; validation runs on click.
- Keep changes scoped. Don't refactor unrelated code.
- Synthetic data only. No real names, numbers, or PII in fixtures.

## Out of scope for this pass

Don't build these yet; leave a `TODO(next)` comment where each would hook in:

- the "N other experts reported this — Me too" banner;
- contextual "Report this" entry from failure points;
- per-session repeat throttling;
- the "Vote on an idea" list.

## Verify before you report back

1. Run the formatter, lint, typecheck, and build. Fix anything you broke.
2. Run the dev server and leave it running. Tell me the URL.
3. Walk these paths in the browser (Playwright if available) and confirm each:
   - **Voice + selection only:** Call audio → Customer can't hear me → Customer had to wait → Submit. The payload matches the shape above, has `freeText: null`, and has no screenshot.
   - **Chat + selection only:** Step 1 shows Chat messages and no call areas, and there's no idea option or textarea anywhere.
   - **Submit without impact:** shows the inline error and moves focus to it; choosing an impact clears it.
   - **Change the area after choosing an issue:** the issue and impact reset.
   - **Not listed:** shows the note and sets `notListed: true`.
   - **Simulate FullStory missing:** sets `fullStoryMissing: true`, and the event buffer is still present.
   - **Free-text mode:** the optional textarea appears after Step 3, and "Share an idea" appears on Step 1.
4. Finish with a short summary covering: files changed, behavior changed, what you validated, and anything you couldn't verify. Don't push or open a PR until I've seen it.
