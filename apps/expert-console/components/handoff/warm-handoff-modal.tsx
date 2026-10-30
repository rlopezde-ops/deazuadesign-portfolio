'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CUSTOMER, GREETING_SCRIPT, GREETING_HIGHLIGHT } from '@/lib/fixtures'
import { useConsoleStore } from '@/store/console-store'
import { useDirector } from '@/hooks/use-director'
import { disableSound, enableSound, playSound } from '@/lib/sounds'
import { MotionSurface } from '../motion/motion-surface'
import { VerizonLogo } from './verizon-logo'

// Split the greeting around the highlighted action phrase so it can be wrapped
// in a green marker span, the way the reference prototype does.
const [GREETING_BEFORE, GREETING_AFTER = ''] = GREETING_SCRIPT.split(GREETING_HIGHLIGHT)

const CIRC = 2 * Math.PI * 72
/**
 * How long the amber standby ring takes to drain. Pacing only — the ring holds
 * empty when it gets there and the `ho-02` beat is what puts the expert on air, so
 * this no longer decides anything about the demo's progress. (The reference
 * randomizes 8–12s; we keep a fixed length and drive it with GSAP's smooth 60fps
 * sweep instead of the old 10fps ticks.)
 */
const STANDBY_DURATION_SECONDS = 9

export function WarmHandoffModal() {
  const shiftPhase = useConsoleStore((s) => s.shiftPhase)
  const handoffLive = useConsoleStore((s) => s.handoffLive)
  const greetingOpacity = useConsoleStore((s) => s.greetingOpacity)
  const morph = useConsoleStore((s) => s.morph)
  const { resolveGate } = useDirector()

  const panelRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<SVGCircleElement>(null)
  const greetingRef = useRef<HTMLDivElement>(null)

  // Did this dialog instance arrive via the pill→dialog container morph? These
  // surfaces are always mounted and render null off-phase (they don't unmount),
  // so a mount-time `useState` initializer would freeze at the notification-gate
  // state (morph null) forever. Instead latch on the inactive→active edge: each
  // fresh entry into standby/on-air re-reads whether a morph is driving it, and
  // staying true through the morph's completion (when `morph` clears) keeps the
  // CSS entrance suppressed so it can't replay as a late fade-in.
  const isActive = shiftPhase === 'standby' || shiftPhase === 'on-air'
  const [prevActive, setPrevActive] = useState(false)
  const [arrivedByMorph, setArrivedByMorph] = useState(false)
  if (isActive !== prevActive) {
    setPrevActive(isActive)
    if (isActive) setArrivedByMorph(useConsoleStore.getState().morph?.kind === 'pill-to-dialog')
  }

  // GSAP owns the ring's stroke-dashoffset. On standby it drains the ring over a
  // fixed duration, then patches the store to go on air — the exact transition
  // the app has always made. On air it snaps the ring full + green and fires the
  // reference's go-live flourishes (greeting scale pop + panel glow flash).
  useGSAP(
    () => {
      if (shiftPhase !== 'standby' && shiftPhase !== 'on-air') return

      const prefersReducedMotion =
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (handoffLive) {
        // Expert goes live on air — the "on air" chime marks the state change.
        // Fired before the ring/reduced-motion early returns so it always plays
        // when the modal flips standby → on air, regardless of motion prefs.
        playSound('onAir')
        const ringEl = ringRef.current
        if (!ringEl) return
        gsap.set(ringEl, { strokeDashoffset: 0 })
        if (prefersReducedMotion) return

        if (greetingRef.current) {
          gsap.fromTo(greetingRef.current, { scale: 0.99 }, { scale: 1, duration: 0.4, ease: 'power2.out' })
        }
        if (panelRef.current) {
          gsap.fromTo(
            panelRef.current,
            { boxShadow: '0 0 0 0 rgba(18,184,134,0)' },
            {
              boxShadow: '0 0 0 3px rgba(18,184,134,0.55)',
              duration: 0.35,
              yoyo: true,
              repeat: 1,
              ease: 'power2.out',
              // Restore the panel's Tailwind shadow-2xl once the flash settles.
              onComplete: () => {
                gsap.set(panelRef.current, { clearProps: 'boxShadow' })
              },
            },
          )
        }
        return
      }

      // Standby: the call has connected and the automated intro is playing.
      playSound('connect')
      const ringEl = ringRef.current
      if (!ringEl) return
      gsap.set(ringEl, { strokeDasharray: CIRC, strokeDashoffset: 0 })

      // Nothing to sweep under reduced motion; the ring simply waits full.
      if (prefersReducedMotion) return

      // Drains, then holds empty in standby. It deliberately does *not* put the
      // expert on air at the end — that's the `ho-02` beat's job, so the presenter
      // can narrate over the amber ring for as long as they want. When this sweep
      // owned going live, it fired on a 9s timer and left that beat with nothing
      // left to change.
      const proxy = { t: 0 }
      gsap.to(proxy, {
        t: 1,
        duration: STANDBY_DURATION_SECONDS,
        ease: 'none',
        onUpdate: () => {
          gsap.set(ringEl, { strokeDashoffset: CIRC * proxy.t })
        },
      })
    },
    { dependencies: [shiftPhase, handoffLive], revertOnUpdate: true },
  )

  if (shiftPhase !== 'standby' && shiftPhase !== 'on-air') return null

  const stroke = handoffLive ? '#12B886' : '#F59E0B'

  return (
    <MotionSurface
      sequenced
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{
        background:
          'radial-gradient(1200px 800px at 50% -10%, #20262d 0%, #101317 60%, #0b0d10 100%)',
        // Morph arrival: start the scrim transparent so the morning paper stays
        // readable while the pill launches; the overlay fades it in partway
        // through the growth, then clears `morph` and this gate releases to 1.
        opacity: morph?.kind === 'pill-to-dialog' ? 0 : undefined,
      }}
      panelRef={panelRef}
      // Morph #1's target and morph #2's source are the same element (both tags).
      // When arriving by morph the ghost owns the entrance, so suppress the CSS
      // rise/backdrop fade and start the panel + scrim hidden; the overlay
      // crossfades them in and clears `morph`, dropping these inline opacities
      // back to the CSS default.
      suppressPanelEntrance={arrivedByMorph}
      suppressBackdrop={arrivedByMorph}
      panelStyle={{ opacity: morph?.kind === 'pill-to-dialog' ? 0 : undefined }}
      panelProps={{ 'data-morph-target': 'dialog', 'data-morph-source': 'dialog' }}
      backdropProps={{ 'data-morph-scrim': 'dialog' }}
      panelClassName="relative w-full max-w-3xl rounded-3xl border border-[#3a3642] bg-[#1c1a21]/90 px-8 py-9 shadow-2xl backdrop-blur"
    >
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={CUSTOMER.avatar}
            alt={CUSTOMER.name}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-white/10"
          />
          <div>
            <p className="text-lg font-semibold text-white">{CUSTOMER.name}</p>
            <p className="text-sm text-[#a7a4ae]">{CUSTOMER.device}</p>
          </div>
        </div>
        <VerizonLogo className="h-14 w-auto" />

      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative h-44 w-44">
          {/* overflow-visible so the standby ringGlow drop-shadow blooms past the
              viewBox instead of being clipped flat at the SVG edge. */}
          <svg className="h-44 w-44 -rotate-90 overflow-visible" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="72" fill="none" stroke="#3A3642" strokeWidth="6" />
            <circle
              ref={ringRef}
              cx="80"
              cy="80"
              r="72"
              fill="none"
              stroke={stroke}
              strokeWidth="6"
              strokeLinecap="round"
              className={handoffLive ? '' : 'ring-standby'}
              strokeDasharray={CIRC}
            />
          </svg>
          {/* Keyed so the whole standby/on-air label swaps as one change, not piece by piece. */}
          <div
            key={handoffLive ? 'live' : 'standby'}
            className="motion-enter-inline absolute inset-0 flex flex-col items-center justify-center"
          >
            {!handoffLive ? (
              <div className="inline-flex items-center gap-2 text-base font-semibold text-[#f59e0b]">
                <span className="dot-standby h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                STANDBY
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-base font-bold text-[#12b886]">
                <span className="dot-live h-2.5 w-2.5 rounded-full bg-[#12b886]" />
                ON AIR
              </div>
            )}
          </div>
        </div>

        {/*<p
          key={handoffLive ? 'live-copy' : 'standby-copy'}
          className="motion-enter-inline mt-6 max-w-lg text-sm leading-relaxed text-[#a7a4ae]"
        >
          {handoffLive ? (
            <>
              You&apos;re live — <span className="font-semibold text-[#12b886]">the customer can hear you now.</span>
            </>
          ) : (
            <>
              You&apos;re <b className="text-[#e8e6ed]">muted</b>. Get ready to greet the customer.
            </>
          )}
        </p>*/}
      </div>

      <div
        ref={greetingRef}
        className="motion-greeting mt-8 border-l-4 px-6 py-5"
        style={{
          opacity: greetingOpacity,
          borderColor: handoffLive ? '#12B886' : '#3A3642',
          background: 'rgba(20, 23, 28, 0.7)',
        }}
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#716e78]">Say this greeting</p>
        <p className="text-xl leading-relaxed text-white">
          &ldquo;{GREETING_BEFORE}
          <span className="rounded bg-[#12b886]/50 px-1 box-decoration-clone">{GREETING_HIGHLIGHT}</span>
          {GREETING_AFTER}&rdquo;
        </p>
      </div>

      <div className="mt-7 flex items-center justify-end">
        <button
          type="button"
          disabled={!handoffLive}
          onClick={resolveGate}
          className="motion-press rounded-full px-7 py-2.5 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#2a2630] disabled:text-[#716e78]"
          style={{ backgroundColor: handoffLive ? '#8223d2' : undefined }}
        >
          Continue
        </button>
      </div>
    </MotionSurface>
  )
}

export function NotificationGate() {
  const shiftPhase = useConsoleStore((s) => s.shiftPhase)
  const patch = useConsoleStore((s) => s.patch)

  if (shiftPhase !== 'notification-gate') return null

  // The click is the user gesture that unlocks audio autoplay. "Allow" primes
  // and enables the notification sounds; "Not now" leaves them off.
  const dismiss = (withSound: boolean) => {
    if (withSound) enableSound()
    else disableSound()
    patch({ shiftPhase: 'daily-drop', beatIndex: 0 })
  }

  return (
    <MotionSurface
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(1200px 800px at 50% -10%, #20262d 0%, #101317 60%, #0b0d10 100%)',
      }}
      panelClassName="w-full max-w-md rounded-3xl border border-[#3a3642] bg-[#1c1a21]/90 px-8 py-9 text-center shadow-2xl backdrop-blur"
    >
      <h1 className="mt-5 text-2xl font-semibold text-white">Turn on notifications</h1>
      <p className="mt-3 text-sm leading-relaxed text-[#a7a4ae]">
        Asurion Workspace wants to alert you when a customer connects and when you go live on air.
      </p>
      <div className="mt-7 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => dismiss(true)}
          className="motion-press w-full rounded-full bg-[#933adc] py-3 text-sm font-semibold text-white"
        >
          Allow notifications
        </button>
        <button
          type="button"
          onClick={() => dismiss(false)}
          className="motion-press w-full rounded-full py-2.5 text-sm font-medium text-[#a7a4ae]"
        >
          Not now
        </button>
      </div>
    </MotionSurface>
  )
}
