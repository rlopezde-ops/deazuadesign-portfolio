/**
 * Copy-paste prompts for an IDE agent — bootstrap Flow Map into a prototype
 * and capture real screens with Playwright.
 * Replace bracket placeholders before sending.
 */
export const PROMPT_PLACEHOLDERS = {
  appName: 'NextGen Portal',
  appFolder: 'nextgen-portal',
  devPort: '3005',
  viewport: 'desktop',
} as const

/**
 * Prompt copied by the header **Playwright** button.
 * This is the full agent handoff — not just "run a capture script".
 */
export const PLAYWRIGHT_FLOW_MAP_PROMPT = `Set up Flow Map for my prototype and fill it with real Playwright screenshots. Follow the AUI Design Flow Map template exactly — do NOT invent a new flow map UI, canvas, or layout.

## Source of truth (required — do not skip)
- GitHub folder: https://github.com/asurion-core/aui-design/tree/main/apps/flow-map
- README (read first): https://github.com/asurion-core/aui-design/blob/main/apps/flow-map/README.md
- Repo: asurion-core/aui-design · Branch: main · Path: apps/flow-map/

A bare link is NOT enough without the placeholders below filled in. Read the README + the files listed there before writing code. Never reconstruct Flow Map from memory.

## Access
This is a private Asurion GitHub org repo (SSO). You need either:
- a local clone of asurion-core/aui-design with apps/flow-map/, OR
- authenticated GitHub/gh access to fetch that path.
If you cannot read those files, STOP and say so — do not fabricate components.

## My prototype (fill these before running)
- App name: ${PROMPT_PLACEHOLDERS.appName}
- App folder: apps/${PROMPT_PLACEHOLDERS.appFolder}/
- Package: @asurion-core/${PROMPT_PLACEHOLDERS.appFolder} (or read from package.json)
- Dev server (must already be running): http://localhost:${PROMPT_PLACEHOLDERS.devPort}
- Viewport: ${PROMPT_PLACEHOLDERS.viewport}  → mobile = 390×844 cards; desktop = 1280×800 cards

## Critical rules
1. Copy Flow Map **INTO** my prototype app as a \`/flow\` route. Do NOT create a separate \`apps/flow-map/\` sibling at the monorepo root.
2. Do NOT rebuild \`flow-map-canvas.tsx\` from scratch — copy the real files from apps/flow-map/.
3. Screenshots must come from MY running prototype via Playwright — never invent PNG paths or copy random images.
4. The header **Playwright** button and **Dev** menu are for the Flow Map *template* workflow. In copies you apply into YOUR prototype, gate them with \`process.env.NODE_ENV === 'development'\` (or \`showTemplateTools()\` without setting \`NEXT_PUBLIC_FLOW_MAP_TEMPLATE_TOOLS\`) so they do NOT appear in your production deploy. The canonical Flow Map showcase may set \`NEXT_PUBLIC_FLOW_MAP_TEMPLATE_TOOLS=1\` so those buttons stay visible on the template site itself.
5. Neon / notes / Brevo email are OPTIONAL. For the default setup, ship the canvas + Playwright population only. If I want the collaboration layer later, copy \`app/api/*\` + \`lib/db.ts\` / \`dev-env.ts\` / \`bootstrap-schema.ts\` and set DATABASE_URL / BREVO_* separately (see Dev menu + README).
6. Do not ask me to hand-edit screenshots, nodes, or \`flow-data.ts\`.

## Step 1 — Copy template INTO my app
From \`apps/flow-map/\` (in aui-design, or cloned), copy into \`apps/${PROMPT_PLACEHOLDERS.appFolder}/\`:

\`\`\`
apps/${PROMPT_PLACEHOLDERS.appFolder}/
├── components/
│   ├── flow-map-canvas.tsx
│   └── prompt-example-panel.tsx
├── lib/
│   ├── flow-map-types.ts
│   ├── flow-map-layout.ts
│   ├── prompt-examples.ts
│   └── flow-data.ts               ← rename from data/template.flow.ts export
├── app/
│   └── flow/
│       └── page.tsx               ← renders <FlowMapCanvas {...flowMapConfig} />
└── public/
    └── screenshots/               ← Playwright output lands here
\`\`\`

\`app/flow/page.tsx\` should look like:
\`\`\`tsx
import { FlowMapCanvas } from '@/components/flow-map-canvas'
import { flowMapConfig } from '@/lib/flow-data'
export default function FlowPage() {
  return <FlowMapCanvas {...flowMapConfig} />
}
\`\`\`

## Step 2 — Deep-linking (only if needed)
If my prototype is a single-page / GSAP / state-driven app (no real URL per screen), add \`?screen=X\` support so Playwright can load each state directly. Skip this if I already have real routes (\`/sign-in\`, \`/dashboard\`, …).

## Step 3 — Playwright capture script
Create \`apps/${PROMPT_PLACEHOLDERS.appFolder}/scripts/capture-flow-map.mjs\` (follow \`apps/flow-map/scripts/capture-flow-map.example.mjs\` and the README examples).

Must:
- launch chromium headless via \`playwright\`
- use viewport 390×844 if mobile, 1280×800 if desktop
- discover every meaningful screen/state from \`apps/${PROMPT_PLACEHOLDERS.appFolder}/app/\` + components (routes, modals, drawers, tabs, query params)
- use real selectors from my source — NO guessing
- \`waitForLoadState('networkidle')\` + ~800–1500ms delay before each shot
- write ordered PNGs to \`apps/${PROMPT_PLACEHOLDERS.appFolder}/public/screenshots/\` (01-….png, 02-….png, …)
- be idempotent / safe to re-run
- add \`"capture:flow-map": "node scripts/capture-flow-map.mjs"\` to my app's package.json
- document at top of script: requires dev server on port ${PROMPT_PLACEHOLDERS.devPort}

Install playwright in my package if missing (\`pnpm add -D playwright --filter=...\`).

## Step 4 — Run capture
- Confirm http://localhost:${PROMPT_PLACEHOLDERS.devPort} is up
- Run capture until all PNGs exist and show correct content
- Do not fabricate screenshots

## Step 5 — Populate lib/flow-data.ts
After PNGs exist, fill the full journey per README layout rules:
- title / subtitle, groupColors, nodes (id, label, screenshot \`/screenshots/…\`, route, x/y, group), edges with action labels, canvas size
- spacing: mobile MOBILE_NODE_STEP_*, desktop DESKTOP_NODE_STEP_* from flow-map-layout.ts
- routes: real paths OR \`/?screen=X\` for animated single-page prototypes — never bare \`http://localhost:PORT\`

## Step 6 — Verify
Open http://localhost:${PROMPT_PLACEHOLDERS.devPort}/flow — every node shows a real thumbnail; clicking navigates to that screen in my prototype.

## Done when
- [ ] Flow Map lives INSIDE \`apps/${PROMPT_PLACEHOLDERS.appFolder}/\` as \`/flow\` (no sibling apps/flow-map)
- [ ] Header **Playwright** button is gated to development only (hidden in production, like **Dev**)
- [ ] \`pnpm capture:flow-map\` regenerates all PNGs from the live prototype
- [ ] \`lib/flow-data.ts\` lists every captured state with matching routes
- [ ] \`/flow\` shows real screenshots and clickable routes
- [ ] I did not hand-edit screenshots or node positions
- [ ] You did NOT invent a new canvas UI`

export const PLAYWRIGHT_PROMPT_DESCRIPTION =
  'Copy into your IDE agent. It pulls Flow Map from GitHub, copies it INTO your prototype as /flow, runs Playwright capture, and fills flow-data.ts. Replace the [PLACEHOLDERS] first. Neon/email are optional and separate.'

/**
 * Longer bootstrap variant (same rules). Prefer PLAYWRIGHT_FLOW_MAP_PROMPT —
 * that is what the header button copies.
 */
export const BOOTSTRAP_FLOW_MAP_PROMPT = PLAYWRIGHT_FLOW_MAP_PROMPT
