# Expert Hub prototype (daily-drop-payment)

A static, dummy-data mirror of the production **Expert Hub** off-call home from
[`expert-workspace`](https://github.com/asurion/expert-workspace), running as a standalone Next.js
app so PMs and engineers can click through it without a workspace environment.

It is a **pure mirror**: the UI is production's, not a redesign. 68 of the 77 vendored files are
byte-identical to upstream.

## Run it

```bash
pnpm install --ignore-workspace
pnpm dev        # http://localhost:3010
```

Opening `http://localhost:3010` shows the prototype gallery. Click **Launch** on the Payment Hub
card (or go straight to `http://localhost:3010/payment-hub`) to reach the prototype.

This app is deliberately excluded from the parent pnpm workspace and depends only on public npm
packages — no `@asurion-core` registry access and no `NODE_AUTH_TOKEN` needed.

## Layout

| Path | What it is |
|---|---|
| `vendor/` | Production source, at upstream paths. Byte-identical except for the nine files in [`prototype/DEVIATIONS.md`](prototype/DEVIATIONS.md). **Don't hand-edit.** |
| `prototype/shims/` | Tiny local stand-ins for `@expert/*` and `@/*` infrastructure modules. Same shapes, no network. |
| `prototype/fixtures/` | All the dummy data. |
| `prototype/state/` | The state switcher store. |
| `prototype/variants.ts` | Registry of all prototype variants shown on the gallery landing page. |
| `app/` | Next.js entry: theme provider, fonts, gallery landing page, and per-prototype routes. |
| `app/payment-hub/` | The Payment Hub prototype (previously at `/`). |

`tsconfig.json` `paths` point `@/*` at `vendor/expert-ui/src/*` and each `@expert/*` package at its
shim, which is why the vendored files need no import rewriting.

## State switcher

There is no data layer, so loading / error / empty and the performance tone are chosen locally.
Use the control in the bottom-left corner, or link straight to a state:

| URL | Shows |
|---|---|
| [`/payment-hub?state=ready&tone=on-track`](http://localhost:3010/payment-hub?state=ready&tone=on-track) | Everything green — "On track" badges |
| [`/payment-hub?state=ready&tone=at-risk`](http://localhost:3010/payment-hub?state=ready&tone=at-risk) | "At risk" badges (uses production's own mock numbers) |
| [`/payment-hub?state=ready&tone=behind`](http://localhost:3010/payment-hub?state=ready&tone=behind) | "Off track" badges |
| [`/payment-hub?state=loading`](http://localhost:3010/payment-hub?state=loading) | Skeletons across cards and the schedule rail |
| [`/payment-hub?state=error`](http://localhost:3010/payment-hub?state=error) | "Unavailable" cards; right rail collapses |
| [`/payment-hub?state=empty`](http://localhost:3010/payment-hub?state=empty) | Data returned but blank — each card's empty copy |

`state` defaults to `ready`, `tone` to `at-risk`. Changing the control rewrites the URL, so any
state you land on is shareable.

The tone presets only move the **numbers**. The badges are still computed by production's
`computeMetricStatus` / `computeMetricTone` against the real thresholds in
`vendor/expert-ui/src/expert-hub/cards/targetProgress.ts` — which is why "behind" renders as
production's "Off track" label rather than the preset's name.

The Yesterday/Today tab and the right panel are ordinary in-app interactions, unchanged from
production.

## Staying in sync with expert-workspace

```bash
pnpm sync:vendor --check   # report drift against a local expert-workspace checkout
pnpm sync:vendor           # pull upstream over vendor/
```

Set `EXPERT_WORKSPACE` if your checkout isn't at `~/Documents/GitHub/expert-workspace`. The nine
documented stand-ins are skipped by both modes.
