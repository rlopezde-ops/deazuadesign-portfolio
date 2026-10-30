# Setup Instructions

Follow these steps to recreate the "Voice & Tone" project in your own Claude account.

## 1. Create a new Project

In Claude, go to **Projects** → **Create project**. Name it something like "Voice & Tone" (or whatever you'd like — the name doesn't need to match).

## 2. Add the custom instructions

Open `project-instructions.md` in this package. Copy everything between the two `---` lines and paste it into the project's **Instructions** field (found under the project's settings, or the box shown when you first create a project).

Don't edit the wording — it defines the role (Lead Content & AI Voice designer), what feedback to give, and the exact output format Claude should use.

## 3. Upload the knowledge files

Upload these files to the project's **Knowledge** section (drag-and-drop or the "Add content" button):

- `Core Identity.md`
- `Core Identity Final(ish) Draft.md`
- `WIP Joy for Experts.md`
- `AI Personality Wiki.md`
- `Expert Workspace flow examples.md`
- `working-conventions.md`
- `conversational-ui-patterns.md`

All seven can be dropped in together — order doesn't matter.

## 4. Know where the live source lives

`AI Personality Wiki.md` links out to a Notion workspace, which is the maintained, canonical version of the brand voice material (the local files here can lag behind it). If you have Notion access and want Claude to reference it directly rather than relying on the static files, connect the Notion MCP/connector in your Claude settings and mention in your prompts that Notion is available. Otherwise, the uploaded files are a reliable snapshot.

## 5. Test it

Paste in a screenshot or a snippet of Expert-facing copy and ask for feedback. You should get back a table (Header/Element | Issue | Fix), grouped by screen if there are multiple screens, using the color-coded tag legend in `working-conventions.md` — with no summary underneath. If that's not what comes back, double check the instructions pasted correctly in step 2.

## Files in this package

| File | Purpose |
|---|---|
| `README.md` | What this package is and why each file is included |
| `SETUP-INSTRUCTIONS.md` | This file |
| `project-instructions.md` | The exact text to paste into the Claude project's Instructions field |
| `working-conventions.md` | Feedback formatting conventions (table format, color-coded tags, headers-vs-verbatim rule, source-of-truth notes) |
| `conversational-ui-patterns.md` | Customer-facing tone/pattern reference pulled from the Conversational UI Figma file, for calibrating Expert-facing headers/verbatims |
| `Core Identity.md` | Short summary of Joy's core identity + 5 traits + always/never list |
| `Core Identity Final(ish) Draft.md` | Full style guide — formatting rules, terminology, conversational principles, guardrails |
| `WIP Joy for Experts.md` | The Expert-facing persona doc — coaching tone by tenure, coaching modes, conversation patterns |
| `AI Personality Wiki.md` | Index linking out to the canonical Notion workspace |
| `Expert Workspace flow examples.md` | Figma links for the Expert Claims flow |
