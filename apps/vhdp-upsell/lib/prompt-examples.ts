/**
 * Single copy-paste prompt for Cursor — Playwright capture + auto-populate Flow Map.
 * Replace bracket placeholders before sending.
 */
export const PROMPT_PLACEHOLDERS = {
  appName: '[YOUR_APP_NAME]',
  appFolder: '[YOUR_APP_FOLDER]',
  devPort: '[DEV_PORT]',
} as const

export const PLAYWRIGHT_FLOW_MAP_PROMPT = `Automate Flow Map for my prototype using Playwright. Use the existing Flow Map template in apps/flow-map/ — do NOT build a new flow map UI, canvas component, or /flow page anywhere else.

## Read first (do not skip)
1. apps/flow-map/README.md — canonical guide (Playwright example, layout rules, checklist). If you are in another monorepo, read this file from asurion-core/aui-design first.
2. apps/flow-map/lib/flow-map-types.ts
3. apps/flow-map/data/template.flow.ts
4. apps/flow-map/scripts/capture-flow-map.example.mjs
5. apps/flow-map/flow-map.config.ts
6. All routes and interactive states in apps/${PROMPT_PLACEHOLDERS.appFolder}/app/ (pages, layouts, modals, drawers, tabs, query-param states)

## My app
- Name: ${PROMPT_PLACEHOLDERS.appName}
- Folder: apps/${PROMPT_PLACEHOLDERS.appFolder}/
- Dev server (must already be running): http://localhost:${PROMPT_PLACEHOLDERS.devPort}

## Your deliverables (all automated — I will not edit files manually)

### 1. Playwright capture script
Create \`apps/${PROMPT_PLACEHOLDERS.appFolder}/scripts/capture-flow-map.mjs\` (ESM, like other .mjs scripts in the repo).

The script must:
- Launch chromium headless via \`playwright\`
- Use viewport 1280×800 unless a specific state needs \`fullPage: true\`
- \`mkdir -p\` apps/flow-map/public/screenshots/
- Walk every meaningful screen and UI state in the prototype:
  - each route under app/
  - modals, drawers, side panels, dropdowns, tabs, provider/variant branches
  - reach states by real navigation/clicks — read the code for selectors, do NOT guess
- For each state:
  - navigate or interact to reach it
  - \`waitForLoadState('networkidle')\` then a short delay (~800–1500ms)
  - save PNG to apps/flow-map/public/screenshots/ with ordered names (01-sign-in.png, 02-otp.png, …)
- Log each step to the console
- Be idempotent and safe to re-run
- Add to apps/${PROMPT_PLACEHOLDERS.appFolder}/package.json:
  \`"capture:flow-map": "node scripts/capture-flow-map.mjs"\`
- Document in a one-line comment at top: requires dev server on port ${PROMPT_PLACEHOLDERS.devPort}

Install playwright in the app package if missing (\`pnpm add -D playwright --filter=...\`).

### 2. Run the script
- Confirm dev server is up on http://localhost:${PROMPT_PLACEHOLDERS.devPort}
- Run the capture script and fix failures until all PNGs are generated
- Do not fabricate screenshots — every PNG must come from the running prototype

### 3. Populate data/template.flow.ts (after capture)
Replace apps/flow-map/data/template.flow.ts with the full flow:
- \`title\`: my product name
- \`groupColors\`: one entry per journey section (legend)
- \`nodes[]\`: every captured state — id, label, screenshot path (/screenshots/…), route (matching my app paths), x/y layout on canvas, group
- \`edges[]\`: transitions between nodes with optional action labels on arrows
- \`canvas\`: width/height large enough for the layout
- Keep flow-map.config.ts pointing at template.flow.ts

Layout the nodes logically (left-to-right for linear flows, branches for splits) — similar to a birds-eye journey map, not a random grid.

### 4. Do NOT touch
- components/flow-map-canvas.tsx
- components/prompt-example-panel.tsx
- lib/flow-map-layout.ts
(unless fixing a bug you introduced)

## Done when
- \`pnpm capture:flow-map\` regenerates all screenshots
- Flow Map at apps/flow-map dev server shows every screen with real thumbnails and clickable routes into my prototype
- No manual steps left for me`

export const PLAYWRIGHT_PROMPT_DESCRIPTION =
  'Copy this into Cursor. It generates the Playwright script, runs capture, and fills data/template.flow.ts — no manual editing.'

/**
 * Use this when you are in ANOTHER monorepo and Flow Map is not set up yet.
 * Paste into Cursor chat from your prototype project.
 */
export const BOOTSTRAP_FLOW_MAP_PROMPT = `Set up Flow Map for my prototype in THIS monorepo. Copy the standalone template from AUI Design — do NOT invent a new flow map UI.

## Source of truth (read before writing code)
GitHub: https://github.com/asurion-core/aui-design
Path: apps/flow-map/

Read these files from that repo (clone or fetch if you do not have them locally):
1. apps/flow-map/README.md — follow it exactly
2. apps/flow-map/scripts/capture-flow-map.example.mjs
3. apps/flow-map/lib/flow-map-types.ts
4. apps/flow-map/data/template.flow.ts

## My prototype (this monorepo)
- App name: ${PROMPT_PLACEHOLDERS.appName}
- App folder: apps/${PROMPT_PLACEHOLDERS.appFolder}/
- Package name: @asurion-core/${PROMPT_PLACEHOLDERS.appFolder} (or read from package.json)
- Dev server port: ${PROMPT_PLACEHOLDERS.devPort} (http://localhost:${PROMPT_PLACEHOLDERS.devPort})

## Your job (all automated — I will not edit files manually)

### Step 1 — Copy Flow Map template
If apps/flow-map/ does NOT exist in this monorepo yet:
- Copy the entire apps/flow-map/ folder from asurion-core/aui-design into this monorepo's apps/
- Ensure pnpm-workspace.yaml includes apps/*
- Run pnpm install from monorepo root
- Register flow-map in this monorepo's docs if needed

Do NOT rebuild the canvas — copy components/flow-map-canvas.tsx and related files as-is.

### Step 2 — Playwright capture script
In apps/${PROMPT_PLACEHOLDERS.appFolder}/scripts/capture-flow-map.mjs:
- Follow apps/flow-map/scripts/capture-flow-map.example.mjs and apps/flow-map/README.md
- Capture every route and major UI state (pages, modals, drawers, tabs)
- Output PNGs to apps/flow-map/public/screenshots/
- Use real selectors from my app code — do not guess
- Add "capture:flow-map": "node scripts/capture-flow-map.mjs" to my app's package.json
- Install playwright in my app package if missing

### Step 3 — Run capture
- Start my prototype dev server on port ${PROMPT_PLACEHOLDERS.devPort}
- Run pnpm capture:flow-map --filter=… until all PNGs exist
- Do not fabricate screenshots

### Step 4 — Populate Flow Map data
Replace apps/flow-map/data/template.flow.ts with the full journey:
- title, groupColors, nodes (screenshot paths, routes, layout), edges, canvas size
- Follow layout guidelines in apps/flow-map/README.md

### Step 5 — Verify
- pnpm dev --filter=@asurion-core/flow-map (port 3007)
- Flow Map shows all screens; clicking nodes opens my prototype routes

## Do NOT
- Build a new /flow page or canvas component outside apps/flow-map/
- Ask me to manually edit template.flow.ts or screenshots
- Modify flow-map UI components unless fixing a bug you introduced

## Done when
Flow Map runs at localhost:3007 with real screenshots of my entire app flow.`
