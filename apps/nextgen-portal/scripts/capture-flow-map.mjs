/**
 * Capture Flow Map screenshots for NextGen Portal.
 * Requires prototype dev server at http://localhost:3005
 *
 * Usage: pnpm capture:flow-map
 */
import { chromium } from "playwright";
import { mkdirSync, readdirSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "http://localhost:3005";
const VIEWPORT = { width: 1280, height: 800 };
const OUT_DIR = join(__dirname, "..", "public", "screenshots");

mkdirSync(OUT_DIR, { recursive: true });

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/** Clear prior PNGs so re-runs stay idempotent and ordered. */
function clearPngs() {
  for (const name of readdirSync(OUT_DIR)) {
    if (name.endsWith(".png")) unlinkSync(join(OUT_DIR, name));
  }
}

async function shot(page, name, { fullPage = false, setup } = {}) {
  console.log(`  → ${name}`);
  if (setup) await setup(page);
  await page.waitForLoadState("networkidle").catch(() => {});
  await delay(1200);
  await page.screenshot({ path: join(OUT_DIR, name), fullPage });
}

async function gotoScreen(page, screen) {
  await page.goto(`${BASE_URL}/?screen=${screen}`, {
    waitUntil: "networkidle",
  });
  await delay(1000);
}

async function main() {
  clearPngs();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  console.log(`\n📸 NextGen Portal Flow Map capture (${VIEWPORT.width}×${VIEWPORT.height})\n`);

  // Smoke-check the live prototype before capturing.
  const health = await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  if (!health || !health.ok()) {
    throw new Error(
      `Dev server not reachable at ${BASE_URL}. Start it with: pnpm dev --filter=@asurion-core/nextgen-portal`
    );
  }

  await shot(page, "01-dashboard.png", {
    setup: (p) => gotoScreen(p, "dashboard"),
  });

  await shot(page, "02-store-closures.png", {
    setup: (p) => gotoScreen(p, "store-closures"),
  });

  await shot(page, "03-filter-scheduled.png", {
    setup: (p) => gotoScreen(p, "filter-scheduled"),
  });

  await shot(page, "04-helpdesk-workorders.png", {
    setup: (p) => gotoScreen(p, "helpdesk-workorders"),
  });

  await shot(page, "05-close-store.png", {
    setup: (p) => gotoScreen(p, "close-store"),
  });

  await shot(page, "06-confirm-closure.png", {
    setup: (p) => gotoScreen(p, "confirm-closure"),
  });

  await shot(page, "07-row-actions.png", {
    setup: (p) => gotoScreen(p, "row-actions"),
  });

  await shot(page, "08-cancel-closure.png", {
    setup: (p) => gotoScreen(p, "cancel-closure"),
  });

  await shot(page, "09-reopen-store.png", {
    setup: (p) => gotoScreen(p, "reopen-store"),
  });

  await browser.close();
  console.log(`\n✓ Done. Screenshots in apps/nextgen-portal/public/screenshots/\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
