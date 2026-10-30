# Deviations from expert-workspace

Everything under `vendor/` mirrors upstream file paths from
`/Users/ricardo.deazua/Documents/GitHub/expert-workspace`. **All but the nine files listed below are
byte-identical to upstream** and can be diffed or pulled back directly.

Verify at any time with:

```bash
pnpm sync:vendor --check
```

Every stand-in file carries a `PROTOTYPE STAND-IN` or `PROTOTYPE DEVIATION` comment at the point of
change, so nothing is a silent edit.

---

## 1. Data hooks replaced with fixtures (4 files)

The prototype makes no network calls. These hooks keep their **exact exported types and signatures**,
so every component that consumes them is untouched — only the body changed.

| File | Upstream | Here |
|---|---|---|
| `vendor/expert-ui/src/expert-hub/data/usePayMetrics.ts` | react-query against `/api/gamification/v1/pay-metrics` | returns `prototype/fixtures/payMetrics.ts` synchronously |
| `vendor/expert-ui/src/expert-hub/data/useSchedule.ts` | react-query against `/v1/schedule` | returns upstream's own `getMockSchedule()` synchronously |
| `vendor/packages/sales-tools/src/modules/widget-container/leaderboard/hooks/useLeaderboard.ts` | react-query against `/v2/leaderboards/{metric}` | returns `prototype/fixtures/leaderboard.ts` |
| `vendor/packages/sales-tools/src/sales-context/SalesContext.tsx` | ky API clients, partner config, feature flags via context | only `employeeId`, used to highlight "You" |

Four upstream files were **deleted** rather than stubbed, because they are pure network code with no
presentational role: `expert-hub/data/getPayMetrics.ts`, `getSchedule.ts`,
`getRecentPerformanceMetrics.ts`, `getRecentMetricsTimeframe.ts`.

`vendor/packages/sales-tools/src/api/getCurrentLeaderboard.ts` is reduced to just its
`LeaderboardEntry` interface (the ky call is gone).

## 2. `import.meta.env` is Vite-only (2 files, one line each)

`useHubPanelStore.ts` and `useLeaderboardSelectionStore.ts` both pass
`isProd: import.meta.env.VITE_ENV_TYPE === "production"` to `createSimpleStore`. `import.meta.env` does
not exist under Next/Turbopack and fails the type check, so both read `isProd: false`.

This is the single change that would need re-applying on every sync.

## 3. `HeaderControls` rewritten as static chrome (1 file)

`vendor/expert-ui/src/components/header/HeaderControls.tsx`.

Upstream composes `@expert/solve-tools`'s `NotificationCenter`, the Expert University partner menu,
EVL connection status, `AgentStatus`, `FeedbackButton` and `Profile` — all bound to the agent SDK,
websockets and the flag service. Mirroring it faithfully would have meant reproducing that entire
stack, so this renders the same visual row (notification bell, feedback, status pill, avatar)
statically.

Note that `PartnerBadge.tsx`, `SessionIdCopyButton.tsx` and `WorkspaceHeader.module.css` around it
**are** still byte-identical; `WorkspaceHeader.tsx` itself now has a prototype deviation (see §9).

## 4. Next.js rejects "impure" CSS Module selectors (1 file)

`vendor/packages/theme/overrides/components.module.css` has two bare attribute selectors,
`[data-variant="reactive"]` and `[data-variant="proactive"]`. Vite allows them; Next.js CSS Modules
require every selector to contain a local class. Both are wrapped in `:global(...)`. No rules changed.

## 5. Components too coupled to mirror (prototype-only, not in `vendor/`)

Two panel views are static placeholders in `prototype/shims/`:

- **`ChecklistSummary`** (the `today-sales` panel view) lives inside a ~4,000-line product-sale-flow
  module upstream.
- **`AssistTab`** is already a wiring-first placeholder in production, so nothing is lost visually.

## 6. Fonts

The theme sets `fontFamily: "Apercu"`, so the family name must literally be `Apercu` — which rules
out `next/font/local` (it generates a hashed name). `app/globals.css` declares the `@font-face` rules
by hand against the OTF files in `public/fonts/`.

`vendor/packages/theme/global.css` is vendored for reference but **not imported**: it points at a
WOFF2/WOFF pair this repo does not ship. `ApercuMono` is not shipped either and falls back.

## 7. Tests not vendored

`*.test.ts(x)` files were excluded, since they pull in `@expert/testing-utils` and vitest. The sync
script excludes them too.

## 8. Cake illustrations on recent-performance metric cards (4 files)

Prototype-only Asurion “cake” illustrations on the Recent tab cards, cropped off the bottom-right
edge to match the design mockup. Assets live in `public/cakes/` (`love.png`, `quality.png`,
`sales.png`) with black backgrounds removed to transparent alpha.

| File | Change |
|---|---|
| `vendor/expert-ui/src/expert-hub/cards/MetricCard.tsx` | optional `illustration` + `illustrationVariant` props; decorative `<img>` |
| `vendor/expert-ui/src/expert-hub/cards/metricCard.module.css` | `.illustration*` positioning / per-asset optical balance |
| `vendor/expert-ui/src/expert-hub/cards/CustomerRatingCard.tsx` | passes `/cakes/love.png` (`love`) |
| `vendor/expert-ui/src/expert-hub/cards/TransferRateCard.tsx` | passes `/cakes/quality.png` (`quality`) |
| `vendor/expert-ui/src/expert-hub/cards/SalesCard.tsx` | passes `/cakes/sales.png` (`sales`) |

Today-tab cards (`TodayPaceCard`, `TodaySalesCard`, `TodayTotalCallsCard`) intentionally omit
illustrations — only the three Recent metrics that match the mockup get cakes.

## 9. Session ID removed from WorkspaceHeader (1 file)

`vendor/expert-ui/src/components/header/WorkspaceHeader.tsx` no longer imports or renders
`SessionIdCopyButton` / `useSessionId`. Product is dropping the session ID from the top bar; the
logo + partner badge + right-side controls still lay out cleanly with no empty gap. The unused
`SessionIdCopyButton.tsx` file is left in place so sync diffs stay focused.

## 10. Card-flip pay model — tier data and targets (2 vendor files)

Pay tier thresholds and payout amounts updated to match the PSS-Verizon COL Power BI export
(2026-09), translated to USD proxy values for prototype clarity. Net Enrolls switched from flat
payout to a rate-accelerator model (`model: 'rate'`).

| File | Change |
|---|---|
| `vendor/expert-ui/src/expert-hub/data/payTiers.ts` | Added `model: 'threshold' \| 'rate'` to `MetricPayConfig`; added optional `rate?: number` to `PayTier`; updated ERP/Transfer Rate/Net Enrolls tier thresholds and payouts from export; added `getTierName`, `computeRateTotal`, `getDeltaToNext` helpers for `/payment-hub` variant |
| `vendor/expert-ui/src/expert-hub/cards/targets.ts` | `SALES_TARGET` 10 → 6 to align with Net Enrolls Target pay tier threshold |

## 11. Card-flip header copy changes (1 vendor file)

| File | Change |
|---|---|
| `vendor/expert-ui/src/expert-hub/metrics/MyMetricsHeader.tsx` | "Yesterday" → "Pay period" segment label; "My stats" → "My metrics" heading |

## 12. PayDetailPanel redesign — progress line, action line, how-it-works (2 files)

| File | Change |
|---|---|
| `vendor/expert-ui/src/expert-hub/right-panel/PayDetailPanel.tsx` | Removed `TierPopover`. Block 2 now has: Min/Target/Max/Overdrive progress line (trackFill/trackDot from Card Flip back), verb-first tier-jump action line, rate-accelerator display for net enrolls ($X/sale × count), plain-English "How it works" section. |
| `vendor/expert-ui/src/expert-hub/right-panel/PayDetailPanel.module.css` | Removed popover styles. Added progress line, action line, "You're here" marker, how-it-works styles. |

## 13. Pay-period total banner above Yesterday grid (2 files)

| File | Change |
|---|---|
| `vendor/expert-ui/src/expert-hub/metrics/YesterdayMetrics.tsx` | Sums ERP + Transfer Rate + Net Enrolls payouts, renders "You've earned $X this pay period" banner above the card grid. Yesterday/Pay-period tab only, hidden during loading/error/empty. |
| `vendor/expert-ui/src/expert-hub/metrics/yesterdayMetrics.module.css` | New file — banner styles. |
