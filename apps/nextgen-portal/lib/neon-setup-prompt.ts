/**
 * Copy-paste prompts for an IDE agent to wire Flow Map integrations
 * with minimal manual steps.
 */

type PromptOpts = {
  appPath?: string
  appPackage?: string
  port?: number
}

function optsWithDefaults(opts?: PromptOpts) {
  return {
    appRoot: opts?.appPath || 'apps/flow-map',
    pkg: opts?.appPackage || '@asurion-core/flow-map',
    port: opts?.port ?? 3007,
  }
}

export function buildNeonSetupPrompt(opts?: PromptOpts) {
  const { appRoot, pkg, port } = optsWithDefaults(opts)

  return `Set up Neon Postgres for the Flow Map app in this monorepo. Do the work end-to-end. There is exactly ONE step only I can do (authorize/create the database) — do everything else with tools and stop asking me anything you can figure out yourself.

## Target app
- Path: ${appRoot}/
- Package: ${pkg}
- Local URL: http://localhost:${port}
- Persist via: DATABASE_URL (Neon **pooled** connection string, ends with \`-pooler…sslmode=require\`)

## Read this first — how this actually gets done (verified)
The whole thing is created through the **Neon MCP plugin** (\`plugin-neon-postgres-neon\`) that lives in the IDE. Once that plugin is authenticated ONCE, an agent creates the project, runs the schema, and reads the connection string with zero manual pasting. This is exactly how the other Neon-backed apps in this monorepo (e.g. amazon-embedded-ux) were set up.

Hard constraints (don't fight them, they waste time):
1. **You CANNOT copy DATABASE_URL from another Vercel project or store.** Connection strings are stored as Vercel \`sensitive\` (write-only) vars — the REST API, store secrets, and \`vercel env pull\` all return them EMPTY/masked. Don't try to read amazon-embedded-ux or existing Neon stores; you'll get blanks. Create a fresh DB instead.
2. **Provisioning a Neon store via the raw Vercel API fails** with "Authorization ID must be specified for marketplace installations" — even on free. No headless API for it. Use the MCP plugin (below), not the Vercel API.
3. **The only human step is a ONE-TIME plugin login.** If the Neon MCP is already authenticated in the IDE, there is NOTHING for me to do — just run it. If it's not, it needs a single browser OAuth, then it stays authenticated.

## Required outcome
1. A dedicated Neon project exists (free tier is fine — do NOT reuse another product's DB; \`CREATE TABLE IF NOT EXISTS\` would collide with their \`notes\`/\`notifications\`/\`screen_texts\` schema and data).
2. \`${appRoot}/.env.local\` contains DATABASE_URL=… (**pooled**, sslmode=require).
3. \`${appRoot}/.flow-map.dev.json\` also contains { "DATABASE_URL": "…" } so Next API routes pick it up without a restart.
4. Tables bootstrapped: notes, notifications, view_positions, screen_texts, email_subscribers.
5. Verify: GET http://localhost:${port}/api/dev/status → neon.connected === true
6. NEVER commit .env.local, .flow-map.dev.json, or any connection string (all gitignored — keep it that way). Do NOT hardcode the string as a fallback in source (a past project did this — it leaks credentials to anyone with repo access).

## Fastest path — Neon MCP plugin (do this first, no pasting)
1. Check the MCP plugin \`plugin-neon-postgres-neon\` is installed and authenticated in the IDE.
   - If its only exposed tool is \`mcp_auth\` (i.e. it's in an error/unauthenticated state), call \`mcp_auth\` once. A Neon OAuth browser tab opens — tell me to complete the login, then continue. This is the single interactive step, and only if it isn't already authed.
2. Once authed, run these tools directly:
   - \`list_projects\` — see if an \`aui-flow-map\` project already exists (reuse it) or not.
   - \`create_project\` with name \`aui-flow-map\` → returns a project id + connection string.
   - \`get_connection_string\` (pooled) — grab the **pooled** URI (host contains \`-pooler\`, ends \`sslmode=require\`).
   - \`run_sql\` — create the 5 tables (or just POST bootstrap-tables below after writing env).
3. Write env + bootstrap (see "Write + bootstrap"). Done — no manual paste.

## Fallback paths (only if the MCP plugin is unavailable / can't be installed)
A) Neon CLI — \`npx neonctl auth\` (I complete the browser login once), then \`npx neonctl projects create --name aui-flow-map\` and read the pooled connection URI for the default branch.
B) Vercel Storage — if the app is Vercel-linked: dashboard → flow-map project → **Storage → Create Database → Neon → Free → Create** (one authorize click from me), then \`vercel env pull ${appRoot}/.env.local\` (marketplace-integration vars ARE pullable, unlike hand-added sensitive vars).
C) Manual paste (last resort) — send me this one line only: "Create a free project at https://console.neon.tech, copy the **Pooled** connection string, and paste it here." The moment I paste it, do the write + bootstrap yourself.
D) Already have ANY Neon connection string for the account but the MCP/CLI login is blocked? You don't need the console — connect with that string on the **direct** (non-\`-pooler\`) host and \`CREATE DATABASE flowmap\` to carve out an isolated database in the existing project (own tables, no collision with other apps). Then use the pooled URL pointed at \`/flowmap\`. (This is the path that unblocked this repo when interactive auth wasn't available.)

## Write + bootstrap (do this with tools, never ask me to edit files)
Preferred — POST to the app's own dev endpoint (writes BOTH files + tests + creates tables):
  POST http://localhost:${port}/api/dev/setup { "action": "save-credentials", "DATABASE_URL": "<pooled url>" }
  POST http://localhost:${port}/api/dev/setup { "action": "bootstrap-tables" }
Fallback — merge DATABASE_URL into \`${appRoot}/.env.local\` (keep existing Brevo keys), write/merge \`${appRoot}/.flow-map.dev.json\`, and call \`bootstrapFlowMapTables\` from \`${appRoot}/lib/bootstrap-schema.ts\`.

## Done checklist
- [ ] Dedicated Neon DB created (not a shared/other-product DB)
- [ ] DATABASE_URL in .env.local AND .flow-map.dev.json (both gitignored)
- [ ] /api/dev/status → neon.connected: true
- [ ] Bootstrap succeeded (5 tables)
- [ ] Save Position / notes / connectors persist across reload
- [ ] No secrets committed`
}

export function buildBrevoSetupPrompt(opts?: PromptOpts) {
  const { appRoot, pkg, port } = optsWithDefaults(opts)

  return `Set up Brevo (Sendinblue) transactional email for the Flow Map app in this monorepo so note @mentions / subscribe notifications actually send.

## Target app
- Path: ${appRoot}/
- Package: ${pkg}
- Local URL: http://localhost:${port}
- Env keys: BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_FROM_NAME, NEXT_PUBLIC_APP_URL

## Hard limit (be honest with me)
There is no Brevo MCP that can invent an API key without my account. Your job is to minimize friction:
1. Open the right Brevo pages / give me 1–2 exact clicks
2. As soon as I provide (or you can read) the API key, YOU write the env files and verify — do not make me edit .env.local by hand

## Required outcome
1. \`${appRoot}/.env.local\` contains:
   - BREVO_API_KEY=…
   - BREVO_SENDER_EMAIL=… (must be a sender verified in Brevo; default suggestion noreply@asurion.com only if already verified)
   - BREVO_FROM_NAME=Flow Map
   - NEXT_PUBLIC_APP_URL=http://localhost:${port}
2. Same keys merged into \`${appRoot}/.flow-map.dev.json\` so API routes work without restart.
3. Verify: GET http://localhost:${port}/api/integrations-status → emailConfigured === true
   Also GET http://localhost:${port}/api/dev/status → brevo.configured === true
4. Confirm Subscribe UI no longer says "Email not configured".
5. NEVER commit .env.local, .flow-map.dev.json, or the API key.

## Automation steps (verified flow — no guessing the sender)
A) Check if BREVO_API_KEY already exists in the environment, \`${appRoot}/.env.local\`, or \`.flow-map.dev.json\`. If yes, skip to D and verify.
   - Note: nothing to copy from other Vercel projects — the reference apps only store DATABASE_URL, not a Brevo key. Go straight to me for the key.
B) If missing, open (or ask me to open) https://app.brevo.com/settings/keys/api
   - Sign up / log in if needed (pause for interactive auth)
   - Create an API key (looks like \`xkeysib-…\`) or reuse an existing one
   - Ask me to paste the key here ONCE — then you write the files
C) Sender email — DETECT it, don't ask blindly:
   - Validate the key + read the account: \`curl -s https://api.brevo.com/v3/account -H "api-key: <KEY>"\` (confirms the key works, shows the account email).
   - List verified senders: \`curl -s https://api.brevo.com/v3/senders -H "api-key: <KEY>"\` → pick an entry with \`active: true\` and use its \`email\` as BREVO_SENDER_EMAIL.
   - If NO active sender exists, tell me to verify one at https://app.brevo.com/senders (unverified senders fail silently / bounce). Only then continue.
D) Write env via tools (never make me edit files):
   - POST http://localhost:${port}/api/dev/setup
     { "action": "save-credentials", "BREVO_API_KEY": "…", "BREVO_SENDER_EMAIL": "<verified sender>", "BREVO_FROM_NAME": "Flow Map", "NEXT_PUBLIC_APP_URL": "http://localhost:${port}" }
   - (Writes both \`${appRoot}/.env.local\` and \`.flow-map.dev.json\`, preserving DATABASE_URL / Neon keys.)
E) VERIFY for real (don't trust the config flag alone):
   - GET http://localhost:${port}/api/integrations-status → emailConfigured === true
   - GET http://localhost:${port}/api/dev/status → brevo.configured === true
   - Send a live test to the verified sender's own inbox:
     POST http://localhost:${port}/api/send-email
     { "type": "mention", "actorName": "Flow Map Setup", "actorEmail": "setup@local", "content": "Brevo verification.", "mentions": ["<verified sender email>"] }
     → expect { "sent": 1 }. Tell me to check that inbox.

## Code that consumes Brevo
- \`${appRoot}/app/api/send-email/route.ts\` — uses \`@getbrevo/brevo\` BrevoClient; skips sends when BREVO_API_KEY is missing
- Subscribe UI uses \`/api/integrations-status\` and must show configured after setup

## Done checklist
- [ ] BREVO_API_KEY in .env.local + .flow-map.dev.json (both gitignored)
- [ ] Sender is a verified \`active\` sender from /v3/senders (not a guess)
- [ ] /api/integrations-status emailConfigured: true
- [ ] Live test email delivered (sent: 1)
- [ ] Subscribe button is no longer "Email not configured"
- [ ] No secrets committed

If Brevo login is required, pause with the exact URL and what I should click, then continue the moment I paste the API key.`
}
