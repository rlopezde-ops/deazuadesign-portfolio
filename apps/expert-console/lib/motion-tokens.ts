/**
 * Canonical motion values for the Expert Console.
 *
 * Biased to the short end of the motion quality bar: the conversation is the
 * benchmark, so nothing here should make an expert wait for a transition.
 * Mirrored as `--ew-*` custom properties in `app/globals.css`.
 */
export const ewMotion = {
  duration: {
    /** Hover, press, selection, focus. Should read as instant. */
    micro: 100,
    /** Inline reveals: PIN field, send controls, status tags, success copy. */
    inline: 170,
    /** Task cards expanding, compressing, or swapping content. */
    task: 190,
    /** Larger surfaces: warm handoff, Pit Stop, opportunity unlock. */
    surface: 240,
    /** Backdrop fade behind a rising surface. */
    backdrop: 180,
  },
  delay: {
    /** Beat between a solve resolving and the sales opportunity rising. */
    unlockBeat: 80,
    /** Per-card stagger for metric groups. Total spread stays under ~90ms. */
    cardStagger: 30,
    /** Per-row stagger for checklists. Capped by `maxStagger`. */
    rowStagger: 30,
    /** Hard ceiling on any staggered group so the last item is never late. */
    maxStagger: 120,
    /** "Verifying…" acknowledgement before a result resolves. */
    pending: 80,
  },
  distance: {
    /** Standard vertical travel for task cards. */
    y: 10,
    /** Micro nudge for text swaps and transcript lines. */
    yMicro: 4,
    /** Vertical travel for full surfaces rising into place. */
    ySurface: 12,
    /**
     * Deeper travel for a sequenced surface entrance (warm handoff): the panel
     * rises after the backdrop fades in, so the extra distance reads as a
     * deliberate second step. Delayed by `duration.backdrop`.
     */
    ySurfaceDeep: 28,
  },
  scale: {
    /** Pressed state for buttons and pills. */
    press: 0.98,
    /** Starting scale for a checkmark popping in. No overshoot. */
    checkFrom: 0.86,
    /** Exit scale for a dismissing surface. */
    surfaceExit: 0.98,
  },
  easing: {
    /** Primary curve: moves immediately, settles cleanly, no overshoot. */
    settle: 'cubic-bezier(0.2, 0, 0, 1)',
    /** Exits and dismissals. */
    release: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

/** Staggered delay in ms for item `index`, clamped so groups never drag. */
export function staggerDelay(index: number, step = ewMotion.delay.rowStagger) {
  return Math.min(index * step, ewMotion.delay.maxStagger)
}
