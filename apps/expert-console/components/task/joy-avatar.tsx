'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Lottie } from 'lottie-react'
import { useConsoleStore } from '@/store/console-store'
import joyAnimation from './joy-avatar.json'

gsap.registerPlugin(useGSAP)

/**
 * Joy's thinking avatar for each guided step.
 *
 * Absolutely positioned at the container's top-left corner — never participates
 * in layout and reserves no gutter, so the step's copy sits flush-left. It
 * overlaps that corner while it plays, then hands off: `onExit` fires as it
 * fades out so the Task can bring the step's content in where the cue was.
 * Choreography when new guidance lands:
 *
 *   1. fade in + quick pulse,
 *   2. draw the squiggle once (frames 0–192),
 *   3. hold a beat, then fade out.
 *
 * Remounts when the guidance step changes (keyed from live/focus step in Task),
 * not on presenter beat scrubbing — transcript-only beats between actions must
 * not replay the cue. Abrupt step swaps mid-cue still ghost-fade so the exit
 * never hard-cuts.
 *
 * Gated on `joyAvatarEnabled` (on by default; toggle from the demo bar).
 */

const PAUSE_FRAME = 192
const DRAW_SEGMENT = [0, PAUSE_FRAME] as const
const DRAW_SPEED = 2
const REDUCED_MOTION_SPEED = 50

// Authoring rate is 120fps; at DRAW_SPEED 2 the draw takes ~0.8s.
const DRAW_DURATION = PAUSE_FRAME / 120 / DRAW_SPEED

const FADE_IN = 0.35
const PULSE_UP = 0.18
const PULSE_DOWN = 0.14
const PULSE_SCALE = 1.18
const HOLD_AFTER_DRAW = 0.25
const FADE_OUT = 0.28
const REST_SCALE = 0.8
const SLOT_SIZE = 46

const EXIT_MIN_LIFETIME_MS = 150

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function JoyAvatar({
  remountKey = 0,
  onExit,
}: {
  remountKey?: number | string
  /** Fires once when the cue has faded out, so the Task can reveal its content. */
  onExit?: () => void
}) {
  const enabled = useConsoleStore((s) => s.joyAvatarEnabled)
  const slotRef = useRef<HTMLDivElement>(null)
  const elRef = useRef<HTMLElement>(null)
  const mountedAtRef = useRef(0)
  const goneRef = useRef(false)
  const [gone, setGone] = useState(false)

  // Latest callback without re-arming the cue timeline when the parent
  // re-renders (onExit is a fresh closure each render).
  const onExitRef = useRef(onExit)
  onExitRef.current = onExit
  useEffect(() => {
    if (gone) onExitRef.current?.()
  }, [gone])

  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    goneRef.current = false
    setGone(false)
  }, [remountKey, enabled])

  useGSAP(
    () => {
      const slot = slotRef.current
      const el = elRef.current
      if (!slot) return

      let cancelled = false
      let tl: gsap.core.Timeline | null = null
      let reducedTimer: number | undefined

      const run = (node: HTMLElement) => {
        if (cancelled || goneRef.current) return

        if (prefersReducedMotion()) {
          gsap.set(node, { opacity: 1, scale: REST_SCALE })
          reducedTimer = window.setTimeout(() => {
            goneRef.current = true
            setGone(true)
          }, 400)
          return
        }

        // Opacity/scale only — never width/margin, so content never shifts.
        gsap.set(node, { opacity: 0, scale: REST_SCALE, transformOrigin: '50% 50%' })

        tl = gsap.timeline({
          onComplete: () => {
            goneRef.current = true
            setGone(true)
          },
        })

        tl.to(node, { opacity: 1, duration: FADE_IN, ease: 'power2.out' })
          .to(node, { scale: REST_SCALE * PULSE_SCALE, duration: PULSE_UP, ease: 'power1.out' })
          .to(node, { scale: REST_SCALE, duration: PULSE_DOWN, ease: 'power1.in' })
          .to({}, { duration: Math.max(0, DRAW_DURATION - FADE_IN - PULSE_UP - PULSE_DOWN) })
          .to({}, { duration: HOLD_AFTER_DRAW })
          .to(node, { opacity: 0, duration: FADE_OUT, ease: 'power1.out' })
      }

      if (el) {
        run(el)
      } else {
        const raf = requestAnimationFrame(() => {
          const late = elRef.current
          if (late) run(late)
        })
        return () => {
          cancelled = true
          cancelAnimationFrame(raf)
          if (reducedTimer) window.clearTimeout(reducedTimer)
          tl?.kill()
        }
      }

      return () => {
        cancelled = true
        if (reducedTimer) window.clearTimeout(reducedTimer)
        tl?.kill()
      }
    },
    { dependencies: [enabled, remountKey], scope: slotRef },
  )

  useIsomorphicLayoutEffect(() => {
    mountedAtRef.current = performance.now()
    return () => {
      const el = elRef.current
      if (!el || prefersReducedMotion() || goneRef.current) return
      if (performance.now() - mountedAtRef.current < EXIT_MIN_LIFETIME_MS) return
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const clone = el.cloneNode(true) as HTMLElement
      Object.assign(clone.style, {
        position: 'fixed',
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: '0',
        opacity: '1',
        transform: 'none',
        pointerEvents: 'none',
        zIndex: '30',
      })
      clone.setAttribute('aria-hidden', 'true')
      document.body.appendChild(clone)
      gsap.to(clone, {
        opacity: 0,
        duration: FADE_OUT,
        ease: 'power1.out',
        onComplete: () => clone.remove(),
      })
    }
  }, [])

  if (!enabled || gone) return null

  return (
    <div ref={slotRef} className="task-joy-slot" aria-hidden>
      <Lottie
        ref={elRef}
        src={joyAnimation}
        segment={DRAW_SEGMENT}
        loop={false}
        autoplay
        speed={reducedMotion ? REDUCED_MOTION_SPEED : DRAW_SPEED}
        aria-hidden
        className="task-joy"
        style={{ width: SLOT_SIZE, height: SLOT_SIZE }}
      />
    </div>
  )
}
