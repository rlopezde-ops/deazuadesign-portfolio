/**
 * Flow Map capture — Verizon Home Device Protect upsell prototype (mobile).
 * Requires the prototype dev server running at http://localhost:[DEV_PORT] (default 3000).
 *
 * Usage:
 *   pnpm capture:flow-map
 *
 * Output PNGs → public/screenshots/ (consumed by lib/flow-data.ts + /flow route).
 * Every screen is reached via ?screen=X deep-linking (state-based mobile prototype).
 */
import { chromium } from "playwright"
import { mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = `http://localhost:${process.env.DEV_PORT || 3000}`
const VIEWPORT = { width: 390, height: 844 }

const OUT = join(__dirname, "..", "public", "screenshots")
mkdirSync(OUT, { recursive: true })

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function snap(page, screen, name) {
  console.log(`  → ${name} (?screen=${screen})`)
  await page.goto(`${BASE}/?screen=${screen}`)
  await page.waitForLoadState("networkidle").catch(() => {})
  await wait(1200)
  await page.screenshot({ path: join(OUT, name), fullPage: false })
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()

  console.log(`\n📸 Capture (mobile ${VIEWPORT.width}×${VIEWPORT.height}) from ${BASE}\n`)

  await snap(page, "home", "01-home.png")
  await snap(page, "upsell", "02-upsell.png")
  await snap(page, "covered", "03-covered.png")
  await snap(page, "signup", "04-signup.png")
  await snap(page, "success", "05-success.png")

  await browser.close()
  console.log("\n✓ Done. Screenshots in public/screenshots/\n")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
