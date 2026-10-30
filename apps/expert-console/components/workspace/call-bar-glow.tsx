'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import {
  CaretDown,
  DotsNine,
  Microphone,
  Pause,
  PhoneCall,
  Plus,
  Warning,
  WarningCircle,
} from '@phosphor-icons/react'
import { CUSTOMER } from '@/lib/fixtures'
import {
  PACING_PHASE_STYLES,
  PACING_TARGET_SECONDS,
  STATUS_LABELS,
  formatClock,
  secondsToPacingPhase,
} from '@/lib/tokens'
import { useConsoleStore } from '@/store/console-store'

gsap.registerPlugin(useGSAP)

const CALL_CONTROLS = [
  { id: 'transfer', label: 'Transfer', Icon: Plus },
  { id: 'dialpad', label: 'Dialpad', Icon: DotsNine },
  { id: 'callback', label: 'Callback', Icon: PhoneCall },
  { id: 'hold', label: 'Hold', Icon: Pause },
  { id: 'mute', label: 'Mute', Icon: Microphone },
] as const

/** Last three minutes of the target — matches v1.5 Glow Bar pill pulse window. */
const PILL_PULSE_REMAINING_SECONDS = 180

/** Resting edge — solid warm border (same family as top-bar / waiting pill) so
 *  the near-black bar reads against the page; white/8 matches the sidecar but
 *  disappears on this darker surface. */
const CALL_BAR_BORDER = '#3a3642'

export function CallBarGlow() {
  const callElapsedSeconds = useConsoleStore((s) => s.callElapsedSeconds)
  const callEnded = useConsoleStore((s) => s.callEnded)
  const fillRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLDivElement>(null)
  const pillPulseDelayRef = useRef<string | undefined>(undefined)
  const barPulseDelayRef = useRef<string | undefined>(undefined)
  // Fill stays empty until the single initiation pulse finishes — avoids the
  // full→empty flash that stole focus on first paint (default scaleX is 1).
  const [fillArmed, setFillArmed] = useState(false)

  const remaining = PACING_TARGET_SECONDS - callElapsedSeconds
  const phase = secondsToPacingPhase(remaining)
  const style = PACING_PHASE_STYLES[phase]
  const behind = phase === 'red'
  const pillPulse = fillArmed && remaining <= PILL_PULSE_REMAINING_SECONDS
  const StatusIcon = phase === 'red' ? WarningCircle : phase === 'yellow' ? Warning : null

  // Keep the pill and outer-glow keyframes phase-locked once each starts,
  // the same way the v1.5 Glow Bar seeds animation-delay from the clock.
  if (pillPulse) {
    if (!pillPulseDelayRef.current) {
      pillPulseDelayRef.current = `-${Math.round(performance.now() % 2400)}ms`
    }
  } else {
    pillPulseDelayRef.current = undefined
  }
  if (behind) {
    if (!barPulseDelayRef.current) {
      barPulseDelayRef.current = `-${Math.round(performance.now() % 2400)}ms`
    }
  } else {
    barPulseDelayRef.current = undefined
  }

  // One green initiation beat on land: outer bar border pulse (no glow).
  // Explicit rise → soft fall so the border eases out instead of snapping;
  // rgba values so GSAP can interpolate color smoothly.
  useGSAP(
    () => {
      const fill = fillRef.current
      const bar = barRef.current
      if (!fill || !bar || callEnded) return

      let cancelled = false
      gsap.set(fill, { scaleX: 0, transformOrigin: 'left center', backgroundColor: style.track })

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        setFillArmed(true)
        return
      }

      const finishIntro = () => {
        if (cancelled) return
        // Settle on the subtle resting border (red pulse can override later).
        gsap.set(bar, { borderColor: CALL_BAR_BORDER, boxShadow: 'none' })
        setFillArmed(true)
      }

      const tl = gsap.timeline({ onComplete: finishIntro })

      // Outer bar — border-only pulse; same rise/fall envelope, no box-shadow.
      tl.fromTo(
        bar,
        {
          borderColor: CALL_BAR_BORDER,
        },
        {
          borderColor: 'rgba(61, 220, 151, 0.55)',
          duration: 0.55,
          ease: 'sine.out',
        },
        0,
      )
      tl.to(
        bar,
        {
          borderColor: CALL_BAR_BORDER,
          duration: 0.65,
          ease: 'sine.inOut',
        },
        0.55,
      )

      return () => {
        cancelled = true
        tl.kill()
      }
    },
    { dependencies: [callEnded], scope: barRef },
  )

  // GSAP owns the growing fill after the intro pulse. Prefer scaleX (compositor)
  // over width — same approach as the warm-handoff ring. The director clock
  // advances one second at a time, so each tween carries the bar across that
  // second linearly.
  useGSAP(
    () => {
      const fill = fillRef.current
      if (!fill || callEnded || !fillArmed) return

      const fraction = Math.min(1, Math.max(0, callElapsedSeconds / PACING_TARGET_SECONDS))
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (prefersReducedMotion) {
        gsap.set(fill, { scaleX: fraction, backgroundColor: style.track, transformOrigin: 'left center' })
        return
      }

      gsap.set(fill, { transformOrigin: 'left center' })
      gsap.to(fill, {
        scaleX: fraction,
        duration: 1,
        ease: 'none',
        overwrite: 'auto',
      })
      gsap.to(fill, {
        backgroundColor: style.track,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    },
    { dependencies: [fillArmed, callElapsedSeconds, callEnded, style.track], scope: barRef, revertOnUpdate: false },
  )

  if (callEnded) return null

  return (
    <div
      ref={barRef}
      className={`relative h-[70px] shrink-0 overflow-hidden rounded-full border bg-[#0d0b10] ${behind ? 'bar-outer-glow-red' : ''}`}
      style={{
        borderColor: CALL_BAR_BORDER,
        ['--glow-color' as string]: '#9a3838',
        animationDelay: barPulseDelayRef.current,
      }}
    >
      <div
        ref={fillRef}
        className={`absolute inset-y-0 left-0 w-full origin-left will-change-transform ${behind ? 'bar-pulse-red' : ''}`}
        style={{
          backgroundColor: style.track,
          animationDelay: barPulseDelayRef.current,
          // Empty on first paint so we never flash a full green track.
          // Dropped once fillArmed so GSAP can own transform without React
          // rewriting scaleX(0) on every clock tick.
          ...(fillArmed ? {} : { transform: 'scaleX(0)' }),
        }}
      />

      <div className="relative flex h-full items-center justify-between px-[24px]">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[1rem] font-semibold leading-[1.3] text-white">{CUSTOMER.phone}</p>
        </div>

        {/* Fixed 38px height so AT RISK / BEHIND tags never grow the bar. */}
        <div
          ref={pillRef}
          className={`motion-pacing-pill flex h-[38px] shrink-0 items-center overflow-hidden rounded-[32px] border-2 bg-black/40 pl-[16px] ${pillPulse ? 'pill-pulse' : ''}`}
          style={{
            borderColor: style.border,
            // While the keyframe pulse owns box-shadow, skip the static glow
            // so the two don't fight — same rule as the v1.5 Glow Bar.
            boxShadow: pillPulse ? undefined : style.glow,
            animationDelay: pillPulseDelayRef.current,
            ['--pulse-color' as string]: style.border,
          }}
        >
          <span
            className="flex items-center gap-2 whitespace-nowrap text-[14px] leading-none"
            style={{ color: style.label }}
          >
            Device activation
            {phase !== 'green' && (
              <span
                className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none"
                style={{ color: style.tagText, backgroundColor: style.tagBg }}
              >
                {StatusIcon ? <StatusIcon size={10} aria-hidden /> : null}
                {STATUS_LABELS[style.status]}
              </span>
            )}
          </span>
          <span
            className="ml-[10px] flex h-full w-[77px] shrink-0 items-center justify-center rounded-r-[32px] border-l border-white/15 pl-[15px] pr-[18px] font-mono text-[14px] leading-none tabular-nums"
            style={{ backgroundColor: style.timeBg, color: style.timeText }}
          >
            {formatClock(remaining)}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-[12px]">
          {CALL_CONTROLS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              className="motion-press flex size-[32px] shrink-0 items-center justify-center rounded-full text-[#d7d5db] hover:bg-white/8"
            >
              <Icon size={id === 'transfer' ? 24 : 16} />
            </button>
          ))}
          <button
            type="button"
            className="motion-press flex h-[32px] shrink-0 items-center justify-center gap-[8px] rounded-full bg-[#fa5252] px-[16px] text-[14px] leading-[16px] text-[#fff5f5]"
          >
            End call
            <CaretDown size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
