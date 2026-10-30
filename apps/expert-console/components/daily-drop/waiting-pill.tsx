'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { BorderBeam } from 'border-beam'
import { DAILY_DROP_INTRO, EASE_PANEL_IN } from '@/lib/motion'
import { useConsoleStore } from '@/store/console-store'

gsap.registerPlugin(useGSAP)

// The pill appears on its own when the morning paper opens and counts down from
// here, then flips the agent to Available by itself. Kept in seconds so the ring
// sweep and the "…in Ns" copy stay in lockstep.
const COUNTDOWN_SECONDS = 30
// Ring geometry lives in a 10x-oversized coordinate space (240 viewBox, drawn at
// 22px) purely for smoothness: the sweep only travels ~1.9px/sec on screen, so at
// a 24-unit viewBox each whole-unit step of stroke-dashoffset is ~0.9px and reads
// as a per-second tick. At 10x, one unit is ~0.09px — sub-pixel, so it glides.
// Proportions match the old r=9/strokeWidth=3 ring exactly, so it renders identically.
const RING_VIEW = 240
const RING_C = RING_VIEW / 2
const RING_R = 90
const RING_SW = 30
const RING_CIRC = 2 * Math.PI * RING_R

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Dynamic-island-style pill pinned near the top of the morning paper, with
 * two states it morphs between:
 *
 *  - Counting (agent Offline): shows automatically, with a draining ring and
 *    "You'll be available for calls in Ns" running down from 30s. At zero it
 *    patches the agent to Available on its own — the countdown is the only thing
 *    that touches `agentStatus`, keeping the director/beats fully decoupled.
 *  - Waiting (agent Available): the border-beam glow ignites and the copy
 *    becomes "Waiting for a call" — the ambient "listening for work" cue.
 *
 * A single GSAP tween owns the countdown: it writes the ring sweep and the
 * seconds label straight to the DOM every frame (no per-frame React state), so
 * the ring glides continuously while the label steps down a whole second at a
 * time (30, 29, … 1) — both read off the same clock, so they never drift.
 * Fixed positioning lets the page scroll behind it.
 *
 * On the morning-paper cold open the pill also plays a one-time intro: it fades
 * up dead-center of the screen, dwells there so the expert reads the "you'll be
 * available in Ns" promise, then glides up to its resting top anchor. That
 * spotlight is the whole point — it makes the impending state change legible
 * before the page fills in around it. The intro drives only `introRef` (an inner
 * wrapper); horizontal centering stays on the outer div's CSS `-translate-x-1/2`
 * so there's no transform tug-of-war and no pre-paint flash of an off-center pill.
 */
export function WaitingPill() {
  const agentStatus = useConsoleStore((s) => s.agentStatus)
  const isAvailable = agentStatus === 'available'

  const introRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const secondsRef = useRef<HTMLSpanElement>(null)
  const firstMorph = useRef(true)

  // Countdown → auto-Available. Re-runs whenever we (re)enter the Offline state,
  // so a manual flip back to Offline in the TopBar restarts it from 30s.
  useGSAP(
    () => {
      if (isAvailable) return

      const reduce = prefersReducedMotion()
      const ring = ringRef.current
      const label = secondsRef.current

      if (ring) gsap.set(ring, { strokeDasharray: RING_CIRC, strokeDashoffset: 0 })
      if (label) label.textContent = String(COUNTDOWN_SECONDS)

      const goAvailable = () =>
        useConsoleStore.getState().patch({ agentStatus: 'available' })

      const proxy = { t: 0 }
      gsap.to(proxy, {
        t: 1,
        duration: COUNTDOWN_SECONDS,
        ease: 'none',
        onUpdate: () => {
          const secs = Math.max(0, (1 - proxy.t) * COUNTDOWN_SECONDS)
          // Whole-second countdown: ceil holds each number for its full second
          // (30 shows until 29s remain) and lands on 0 exactly at completion.
          if (label) label.textContent = String(Math.ceil(secs))
          // Positive offset drains counter-clockwise from the 12 o'clock anchor,
          // matching the warm-handoff and pit-stop rings (both `+CIRC * t`).
          // Held full under reduced motion (no continuous sweep).
          if (ring && !reduce) gsap.set(ring, { strokeDashoffset: RING_CIRC * proxy.t })
        },
        onComplete: goAvailable,
      })
    },
    { dependencies: [isAvailable], revertOnUpdate: true },
  )

  // Morph the pill width between the two states so the island grows/shrinks
  // around its content instead of hard-cutting. `contentRef` is `w-max`, so its
  // offsetWidth is always the natural width regardless of the pill's set width.
  useGSAP(
    () => {
      const pill = pillRef.current
      const content = contentRef.current
      if (!pill || !content) return

      const target = content.offsetWidth
      if (firstMorph.current || prefersReducedMotion()) {
        gsap.set(pill, { width: target })
      } else {
        gsap.to(pill, { width: target, duration: 0.42, ease: 'power3.out' })
      }
      firstMorph.current = false
    },
    { dependencies: [isAvailable] },
  )

  // Morning-paper cold open, played once per pill mount (deps: []). Runs last so
  // the width morph above has already sized the pill — the rest-position measure
  // below then reflects the real box. We move only y/opacity/scale on `introRef`;
  // horizontal centering is the outer div's CSS translate, so the glide's
  // vertical travel can't clobber it. No clearProps: the pill sits at its resting
  // transform for the rest of the session (it must stay put when it later flips
  // to Available, whose own width morph targets `pillRef`, not this wrapper).
  useGSAP(
    () => {
      const inner = introRef.current
      if (!inner) return

      if (prefersReducedMotion()) {
        gsap.set(inner, { y: 0, autoAlpha: 1, scale: 1 })
        return
      }

      // Measured while the pill is at rest (y:0), so `rect` is the resting box.
      // centerY is the translateY that lifts the pill's center to the viewport's.
      const rect = inner.getBoundingClientRect()
      const centerY = window.innerHeight / 2 - (rect.top + rect.height / 2)

      gsap
        .timeline()
        .set(inner, {
          y: centerY + DAILY_DROP_INTRO.riseY,
          autoAlpha: 0,
          scale: DAILY_DROP_INTRO.fromScale,
        })
        .to(inner, {
          y: centerY,
          autoAlpha: 1,
          scale: 1,
          duration: DAILY_DROP_INTRO.pillIn,
          ease: EASE_PANEL_IN,
        })
        // Dwell at center, then glide up to rest. The gap here is the same
        // `centerHold` the page-content fade waits out, so the page rises up
        // on the exact frame this glide begins.
        .to(
          inner,
          { y: 0, duration: DAILY_DROP_INTRO.descend, ease: EASE_PANEL_IN },
          `+=${DAILY_DROP_INTRO.centerHold}`,
        )
    },
    { dependencies: [] },
  )

  return (
    // Rests centered within the h-16 TopBar band (52px pill in a 64px header →
    // top:6px), tucked in the empty gap between the logo and the status controls
    // so it clears the morning-paper headline beneath. The intro glide and the
    // pill→dialog morph both measure this resting box, so they follow the anchor.
    <div className="fixed top-5 left-1/2 z-40 -translate-x-1/2">
      <div ref={introRef}>
        <BorderBeam active={isAvailable} duration={6} size="md" colorVariant="ocean" theme="dark" borderRadius={27}>
          <div
            ref={pillRef}
            data-morph-source="pill"
            className="h-[52px] overflow-hidden rounded-[26px] border border-[#3a3642] bg-[#0d0b10] shadow-2xl"
          >
            <div ref={contentRef} className="flex h-full w-max items-center px-[22px]">
              {/* Keyed so the ring/dot + copy swap as one change, with a soft cross-fade. */}
              <div
                key={isAvailable ? 'waiting' : 'counting'}
                className="motion-enter-inline flex items-center gap-[12px]"
              >
                {isAvailable ? (
                  <>
                    <span className="relative flex size-[10px] shrink-0 items-center justify-center">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#12b886]/70" />
                      <span className="relative inline-flex size-[10px] rounded-full bg-[#12b886]" />
                    </span>
                    <span className="whitespace-nowrap text-[15px] font-medium leading-none text-[#d7d5db]">
                      Waiting for a call
                    </span>
                  </>
                ) : (
                  <>
                    <span className="relative flex size-[22px] shrink-0 items-center justify-center">
                      {/* overflow-visible + -rotate-90 so the ring drains from 12 o'clock.
                          viewBox is 10x the 22px render size (see RING_* above) so the
                          stroke-dashoffset sweep resolves sub-pixel and glides. */}
                      <svg
                        className="size-[22px] -rotate-90 overflow-visible"
                        viewBox={`0 0 ${RING_VIEW} ${RING_VIEW}`}
                        aria-hidden
                      >
                        <circle cx={RING_C} cy={RING_C} r={RING_R} fill="none" stroke="#3a3642" strokeWidth={RING_SW} />
                        <circle
                          ref={ringRef}
                          cx={RING_C}
                          cy={RING_C}
                          r={RING_R}
                          fill="none"
                          stroke="#12b886"
                          strokeWidth={RING_SW}
                          strokeLinecap="round"
                          strokeDasharray={RING_CIRC}
                        />
                      </svg>
                    </span>
                    <span className="whitespace-nowrap text-[15px] font-medium leading-none text-[#d7d5db]">
                      You&apos;ll be available for calls in{' '}
                      {/* GSAP writes this every frame. No fixed width, so the number
                          stays tight against "s" with no gap; tabular-nums keeps every
                          two-digit value the same width, so "s" only nudges once at the
                          10 → 9 boundary (trailing space inside the fixed-width pill). */}
                      <span ref={secondsRef} className="tabular-nums text-[#e8e6ed]">
                        30
                      </span>
                      s
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </BorderBeam>
      </div>
    </div>
  )
}
