import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

// easeOutExpo / easeInCubic as cubic-beziers — decisive entry, quick exit, no overshoot
// (overshoot on a surface this large reads cheap rather than premium).
export const EASE_PANEL_IN = CustomEase.create('panelIn', '0.16, 1, 0.3, 1')
export const EASE_PANEL_OUT = CustomEase.create('panelOut', '0.32, 0, 0.67, 0')

// Container-morph growth: the Material "standard" accelerate-then-settle. Unlike
// EASE_PANEL_IN (easeOutExpo), which reaches ~90% of its travel in the first
// ~15% of the tween — fine for a panel that should *appear*, but on a box that
// grows by a large factor it reads as a snap-then-creep — this spreads the size
// change across the whole duration so the container visibly travels frame by
// frame from the pill's box into the dialog's, then eases into its final shape.
export const EASE_CONTAINER_MORPH = CustomEase.create('containerMorph', '0.4, 0, 0.2, 1')

export const PANEL_MOTION = {
  inDuration: 0.52,
  outDuration: 0.3,
  scrimIn: 0.3,
  scrimOut: 0.24,
  swapDuration: 0.26,
  rowStagger: 0.03,
  rowStart: 0.14,
} as const

/** Daily Drop → Available content crossfade under a stable TopBar shell. */
export const PHASE_MOTION = {
  outDuration: 0.38,
  inDuration: 0.48,
  overlap: 0.16,
} as const

/**
 * Warm handoff → in-call workspace. Each surface arrives on its own beat rather
 * than the whole screen cutting in as one plane, so the workspace reads as
 * assembling around the expert.
 *
 * Shares `inDuration` with PANEL_MOTION — same surface class, same travel time.
 * The stagger is its own value because PANEL_MOTION.rowStagger (30ms) is tuned
 * for list rows; at this size that spacing collapses into a single event.
 */
export const WORKSPACE_MOTION = {
  inDuration: 0.52,
  stagger: 0.075,
  start: 0.06,
  /** Matches --ew-dist-y-surface: full surfaces travel further than inline bits. */
  riseY: 12,
  /** Just off 1 — enough to feel like it settles forward, not a zoom. */
  fromScale: 0.994,
} as const

/**
 * Morning-paper cold open. The page starts as bare background; the waiting pill
 * arrives dead-center, dwells so the expert reads the countdown promise ("we're
 * about to flip you to Available"), then glides to its resting anchor near the
 * top (the pill morphs up into the warm-handoff dialog from there) while the
 * rest of the page fades up beneath it.
 *
 * The pill (in `waiting-pill.tsx`) and the page content (in `daily-drop-screen.tsx`)
 * run two separate timelines that share these constants, so the content fade
 * begins on the exact frame the pill starts its descent — `pillIn + centerHold`
 * — with no cross-component callback to keep in sync.
 */
export const DAILY_DROP_INTRO = {
  /** Fade + rise the pill into the centered spotlight. */
  pillIn: 0.6,
  /** Seconds the pill dwells at center before dropping — the "read me" beat. */
  centerHold: 2,
  /** Glide from center to the resting anchor near the top (a long travel). */
  descend: 0.95,
  /** Page content fade-up, kicked off as the descent begins. */
  contentIn: 0.7,
  /** Pill rises this far into center on entry (matches surface travel feel). */
  riseY: 16,
  /** Just under 1 so it settles forward rather than zooming. */
  fromScale: 0.98,
} as const

/**
 * Assist dock expand/collapse — same continuous sheet, height grows from the
 * bottom. Radius stays in the capsule family so it never “pops” circle → card.
 */
export const ASSIST_MOTION = {
  collapsedHeight: 48,
  /** Fully rounds a 48px bar; open state stays in the same family. */
  radiusCollapsed: 24,
  radiusOpen: 20,
  openDuration: 0.55,
  closeDuration: 0.42,
  contentIn: 0.34,
  contentOut: 0.18,
  contentDelay: 0.1,
  chipStagger: 0.035,
} as const

/**
 * Team leaderboard strip. Two motions, both pointer-driven.
 *
 * Proximity: the row answers the cursor like a dock. The card under the pointer
 * scales by `lift`, its neighbours by a share of it on a gaussian falloff
 * (`sigma`, measured in card pitches — ~0.85 puts the next card over at about
 * half the lift and the one past that near nothing). Each card's scale is
 * re-targeted through a `gsap.quickTo`, so `follow` reads as a damping time
 * rather than an animation length: the row chases the cursor and settles that
 * long after it stops. `scale` here, not width/height — at 1.1x the 1px border
 * stays believable, it costs no layout on nine cards at pointer rate, and the
 * cards keep their slots so the overflow cues don't jitter. The 12px gutter
 * absorbs the growth, so lifted cards never overlap.
 *
 * Pluck → flip: the card lifts out of its slot (`pluck`), then turns on its Y
 * axis while its box grows into the detail panel (`flip`), and is set back down
 * on close (`land`). The box travels as left/top/width/height per the house rule
 * (see CONTAINER_MORPH) — that change is large enough for scale to smear the
 * border — while the turn rides `rotationY` on the same tween. The two faces
 * swap at 90° via backface-visibility, so the front never has to be faded out.
 */
export const LEADERBOARD_MOTION = {
  lift: 0.1,
  /** Max px the strongest card rises, so growth reads as coming forward. */
  rise: 6,
  sigma: 0.85,
  follow: 0.4,
  pluck: 0.14,
  flip: 0.64,
  flipBack: 0.5,
  /**
   * Fraction of the flip after which the detail content fades up. Set just under
   * the halfway turn: the face is still near edge-on there, so the details are
   * resolving *as* it comes round rather than appearing on a blank card back.
   */
  detailStart: 0.46,
  detailIn: 0.32,
  land: 0.12,
  scrimIn: 0.3,
  scrimOut: 0.24,
  /** The empty slot left behind while a card is lifted out of the row. */
  socketOpacity: 0.16,
} as const

/**
 * Metric card modal flip. Uses LEADERBOARD_MOTION for the pluck-expand-flip
 * choreography so the two card families have identical timing and eases.
 * Only the panel target dimensions differ — metric pay detail is a different
 * content shape than the expert detail card.
 */
export const METRIC_PANEL = { width: 460, height: 460 } as const

/**
 * Container morphs: a ghost overlay grows/shrinks one surface's box into the
 * next across a phase change (pill → warm-handoff dialog → call bar). Driven on
 * `EASE_CONTAINER_MORPH` so the box visibly grows the whole way instead of
 * snapping to size. We tween `left/top/width/height` (never `scale`) so the 1px
 * border and corner radius stay crisp through a large size change, matching the
 * house convention (`waiting-pill.tsx` morphs `width`, not `scale`).
 *
 * Colors track the real surfaces: `#0d0b10` is the pill/call-bar body,
 * `rgba(28,26,33,0.9)` is the dialog's `bg-[#1c1a21]/90`. Radii track the
 * surfaces too: pill `rounded-[26px]`, dialog `rounded-3xl` (24px), call bar
 * effectively `rounded-full` (~35px on the ~70px bar). `border` is the shared
 * `#3a3642` rim on all three.
 *
 * `scrimStart` / `scrimDuration` (pill→dialog only): the warm-handoff background
 * scrim is faded in by the morph timeline, *after* the box has begun growing, so
 * the morning paper stays readable while the pill launches and then dissolves as
 * the box swells toward the dialog — rather than the scrim slamming in at mount
 * (its old 180ms CSS backdrop fade) and hiding the page before the morph reads.
 */
export const CONTAINER_MORPH = {
  pillToDialog:    { duration: 0.72, fromRadius: 26, toRadius: 24, fromBg: '#0d0b10',            toBg: 'rgba(28,26,33,0.9)', scrimStart: 0.26, scrimDuration: 0.4 },
  dialogToCallbar: { duration: 0.72, fromRadius: 24, toRadius: 35, fromBg: 'rgba(28,26,33,0.9)', toBg: '#0d0b10' },
  /** Identical on all three surfaces; kept as one token for the ghost's rim. */
  border: '#3a3642',
  /** Target opacity 0 → 1 over the tween's tail. */
  revealFade: 0.2,
  /** Ghost opacity 1 → 0 over the tween's tail. */
  ghostFadeOut: 0.15,
  /** Workspace surfaces begin their staggered rise as the ghost docks the bar. */
  assembleDelay: 0.6,
} as const
