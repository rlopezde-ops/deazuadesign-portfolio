# Expert Console

End-to-end **Expert Console** shift prototype for the Maria Rodriguez iPhone activation journey. Design / UX prototype — all data is fixture-driven; no real customer systems.

## Journey

1. **Notification gate** — allow notifications to start the shift
2. **Daily Drop** — performance snapshot (Yesterday / Today metrics, schedule, leaderboard)
3. **Available** — waiting for next customer
4. **Warm handoff** — Standby → On Air
5. **In-call workspace** — live transcript + assist sidecar, pacing call bar
6. **Pit Stop** — after-call wrap-up

Presenter controls (bottom demo bar / keyboard): advance beats, jump to a scene, play/pause, reset.

## Call workspace chrome

Matched to Figma (`Tech Support and Claims`):

- Nav bar — Asurion logo SVG, `Available` status, rank pill, avatar
- Call bar — phone (`1rem` semibold), Device activation timer pill (green / at risk / behind), call controls, End call
- Transcript + sidecar — floating `8px` panels with a soft edge, inset shine, and lift shadow
- Sidecar flow pills — one chip = one scroll column of subtasks. Completed guidance stays above and auto-scrolls up as new guidance appears; click a completed chip to review that step without losing progress

- Draggable center divider (28–72%, persists to `localStorage`)

Shared surface tokens (`--ew-surface-*`) keep Daily Drop cards and workspace panels at the same elevation. Warm handoff → in-call uses a GSAP stagger (`WORKSPACE_MOTION` in `lib/motion.ts`) so each surface arrives on its own beat.

## Task primitives & chat anatomy

Sidecar guidance is composed from the compound `Task` API in [`components/task/`](./components/task/). Structure mirrors [`apps/pulse-proto`](../pulse-proto/) and the customer-facing **Conversational UI** chat anatomy in Figma:

[Conversational UI — chat anatomy](https://www.figma.com/design/z4NF7x3ox3WA7nqkFzR5Js/%F0%9F%92%A0-Conversational-UI?node-id=366-12535)

Dark-mode panel exploration: [`apps/pulse-html-prototypes/task-pattern-nav-c-claim-v3.html`](../pulse-html-prototypes/task-pattern-nav-c-claim-v3.html).

**Rule:** a box has to earn its edge. Affirmation, Directive, Verbatim, and detail are plain type on the surface. Radius is reserved for interactive affordances (inputs, pill buttons, Assist card/dock) and the outer workspace panels — not for sectioning.

| Part | Role | Type (in-panel) |
|------|------|-----------------|
| `Task.Eyebrow` | Orienting label — never an imperative | 12px / faint / sentence case |
| `Task.Affirmation` | 1–3 word acknowledgement before the ask | 20px / soft |
| `Task.Verbatim` | Words to say out loud (accent curly quotes) | 24px / strong |
| `Task.Directive` | What the expert should do (no quotes) | 24px / strong |
| `Task.Body` / `Task.Detail` | Supporting context | 16px / soft |
| `Task.Subtask` | Labeled group inside the body | — |
| `Task.Footer` / `Task.Action` | Commit controls | pill CTA |
| `Task.Status` | Inline pending loader → success confirmation after a commit | 16px |
| `Task.Collapsed` | Optional one-line finished state (flow pills are the primary progress signal) | 14px |

```tsx
import { Task } from '@/components/task'

<Task>
  <Task.Eyebrow>Customer verification</Task.Eyebrow>
  <Task.Affirmation>Quick security step.</Task.Affirmation>
  <Task.Verbatim>Before we go further I need to verify your account. Can I email you a code?</Task.Verbatim>
  <Task.Body>
    <Task.Subtask label="Verizon account PIN">
      {/* input + Task.Action */}
    </Task.Subtask>
  </Task.Body>
</Task>
```

Copy for every activity lives in [`lib/task-content.ts`](./lib/task-content.ts) — edit there, not inline in JSX.

## Expert Assist

Same Ask Assist dock on Daily Drop (schedule rail) and in-call (sidecar): collapsed input at the bottom of the panel; focus expands the thread. Replies from [`lib/assist-responses.ts`](./lib/assist-responses.ts) with scene-aware chips. No FAB — the dock is the entry point.

## Voice & tone (AI content skill)

Expert-facing copy is governed by the **voice-and-tone-writing** skill:

- Repo: [`.cursor/skills/voice-and-tone-writing/SKILL.md`](../../.cursor/skills/voice-and-tone-writing/SKILL.md)
- Local Cursor library: `~/.cursor/skills/voice-and-tone-writing/SKILL.md`

Load it whenever drafting or rewriting headers, verbatim lines, coaching nudges, or Assist responses. Quick rules that shaped this app:

- **Eyebrows orient** (third-person / status) — never lead with “Ask…” / “Say…”
- **Verbatim vs Directive** — spoken lines get quotes; instructions to the expert do not
- **Affirmation → Directive** rhythm (a short acknowledgement before the ask)
- One-breath rule on spoken lines; Asurion terminology (`device`, `coverage`, `start a claim`)

## Stack

- Next.js 16 · React 19 · TypeScript
- Mantine 9 (Daily Drop)
- Tailwind CSS v4
- Zustand
- GSAP (`gsap` + `@gsap/react`) — warm handoff + workspace entrance
- Apercu Pro (local fonts)

## Run

This app is **excluded** from the parent pnpm workspace (own lockfile). From the app folder:

```bash
cd apps/expert-console
pnpm install
pnpm dev
```

Open [http://localhost:3011/](http://localhost:3011/)

| Script | Command |
|--------|---------|
| Dev | `pnpm dev` |
| Build | `pnpm build` |
| Start | `pnpm start` |
| Clean | `pnpm clean` |

## Layout

```
app/                    Next.js App Router + fonts + globals
components/
  daily-drop/           Daily Drop screen (Mantine)
  workspace/            Top bar, call bar, transcript, sidecar, panel resizer
  activities/           Clarify, verify, activation, discovery, sales
  task/                 Task compound primitives
  assist/               Ask Assist dock
  handoff/              Warm handoff modal
  pit-stop/             After-call screen
  motion/               Motion surface / task shell primitives
  presenter/            Demo bar (scene jump + beat scrub)
hooks/                  Director, presenter keys, panel split, motion phase
lib/                    Script beats, task-content, assist-responses, fixtures, tokens
public/brand/           Logo, chevron, trophy, waveform assets
store/                  Zustand console store
.cursor/skills/         voice-and-tone-writing (mirrored at repo root)
```

## Notes

- Port `3011` also used by `@asurion-core/expert-guided-browsing` — run only one at a time.
- Daily Drop reference app: [`apps/daily-drop-payment/`](../daily-drop-payment/).
- Task / Assist reference: [`apps/pulse-proto`](../pulse-proto/), [`apps/pulse-html-prototypes`](../pulse-html-prototypes/).
