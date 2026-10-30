'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CheckCircle } from '@phosphor-icons/react'
import { CUSTOMER, EXPERT, PIT_STOP_SUMMARY } from '@/lib/fixtures'
import { ExpertAvatar } from '@/components/shared/expert-avatar'
import { ewMotion, staggerDelay } from '@/lib/motion-tokens'
import {
  PACING_PHASE_STYLES,
  PACING_TARGET_SECONDS,
  PIT_STOP_SECONDS,
  formatClock,
  secondsToPacingPhase,
} from '@/lib/tokens'
import { useConsoleStore } from '@/store/console-store'
import { MetricCard } from '../shared/metric-card'
import { MotionSurface } from '../motion/motion-surface'
import type { MetricCardData, MetricStatus } from '@/lib/types'
import { useDirector } from '@/hooks/use-director'
import classes from './pit-stop.module.css'

// Small countdown ring embedded in the primary button, mirroring the daily-drop
// waiting pill. Drawn in a 10x-oversized viewBox (same trick as waiting-pill) so
// the sweep resolves sub-pixel and glides between the timer's whole-second ticks.
const BTN_RING_VIEW = 240
const BTN_RING_C = BTN_RING_VIEW / 2
const BTN_RING_R = 90
const BTN_RING_SW = 30
const BTN_RING_CIRC = 2 * Math.PI * BTN_RING_R

// Avatar size for the overlapping stack (ExpertAvatar `lg` = 72px).
const AVATAR_PX = 72
// Resting overlap via -ml-4 (16px). Center-to-center = 72 − 16 = 56 → half = 28.
const AVATAR_SPLIT = 28

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function coachingLine(status: MetricStatus, onTrack: string, needsWork: string) {
  return status === 'on-track' ? onTrack : needsWork
}

export function PitStopScreen() {
  const shiftPhase = useConsoleStore((s) => s.shiftPhase)
  const pitStopRemaining = useConsoleStore((s) => s.pitStopRemaining)
  const callElapsedSeconds = useConsoleStore((s) => s.callElapsedSeconds)
  const facts = useConsoleStore((s) => s.facts)
  const accessories = useConsoleStore((s) => s.avatarAccessories)
  const { resolveGate } = useDirector()

  const customerRef = useRef<HTMLDivElement>(null)
  const expertRef = useRef<HTMLDivElement>(null)

  // The reveal: customer alone, centered and on top, then the expert pops out
  // from behind — sliding right into view while the customer is nudged left to
  // the resting overlap. Keyed to shiftPhase so it fires each time we enter the
  // pit stop (the component is always mounted and returns null otherwise, so a
  // mount-only effect would never see the avatars).
  useGSAP(
    () => {
      if (shiftPhase !== 'pit-stop') return
      const customer = customerRef.current
      const expert = expertRef.current
      if (!customer || !expert) return

      if (prefersReducedMotion()) {
        gsap.set([customer, expert], { x: 0, autoAlpha: 1, scale: 1 })
        return
      }

      // Start coincident and centered: the customer shifts right to sit dead
      // center, the expert hides directly behind her at the same point.
      gsap.set(customer, { x: AVATAR_SPLIT, autoAlpha: 1, scale: 1 })
      gsap.set(expert, { x: -AVATAR_SPLIT, autoAlpha: 0, scale: 0.82 })

      // Dwell on the lone customer for a moment, then split apart.
      gsap
        .timeline({ delay: 1.5 })
        .to(expert, { x: 0, autoAlpha: 1, scale: 1, duration: 0.55, ease: 'power3.out' })
        .to(customer, { x: 0, duration: 1, ease: 'power3.out' }, '<0.08')
    },
    { dependencies: [shiftPhase], revertOnUpdate: true },
  )

  if (shiftPhase !== 'pit-stop') return null

  const pacingPhase = secondsToPacingPhase(PACING_TARGET_SECONDS - callElapsedSeconds)
  const pacingStatus = PACING_PHASE_STYLES[pacingPhase].status
  const sentimentStatus: MetricStatus =
    facts.sentiment === 'positive' ? 'on-track' : 'at-risk'
  const saleStatus: MetricStatus = 'on-track'

  const cards: MetricCardData[] = [
    {
      id: 'erp',
      name: 'Sentiment',
      value: facts.sentiment === 'positive' ? 'Positive' : facts.sentiment === 'negative' ? 'Negative' : 'Neutral',
      target: 'Target: positive or neutral',
      level: coachingLine(
        sentimentStatus,
        'Great rapport — keep that energy 🎉',
        'Rebuild trust early on the next call',
      ),
      status: sentimentStatus,
      illustration: '/cakes/love.png',
      lottieSrc: '/lottie/heart.json',
    },
    {
      id: 'pace',
      name: 'Call length',
      value: formatClock(callElapsedSeconds),
      target: 'Target: 25:00 or less',
      level: coachingLine(
        pacingStatus,
        'You held pace through activation 🎉',
        'Tighten the solve on the next one',
      ),
      status: pacingStatus,
      illustration: '/cakes/time.png',
      lottieSrc: '/lottie/stopwatch.json',
    },
    {
      id: 'sale',
      name: 'Sales',
      value: 'Enrolled',
      target: 'Target: enroll when the solve fits',
      level: coachingLine(
        saleStatus,
        'Nice enrollment — one more moves you up 🎉',
        'Look for one natural VHDP opening',
      ),
      status: saleStatus,
      illustration: '/cakes/sales.png',
      lottieSrc: '/lottie/wallet.json',
    },
  ]

  const progress = 1 - pitStopRemaining / PIT_STOP_SECONDS
  const callRanLong = pacingStatus !== 'on-track'
  const sentimentGood = sentimentStatus === 'on-track'

  const summaryText = callRanLong
    ? `You fixed ${CUSTOMER.firstName}'s iPhone activation and enrolled Verizon Home Device Protect. ${
        sentimentGood ? 'Sentiment stayed positive' : 'Sentiment needed more care'
      }, but call length ran long — tighten the solve under 25:00 next time.`
    : `You fixed ${CUSTOMER.firstName}'s iPhone activation and enrolled Verizon Home Device Protect. ${
        sentimentGood ? 'Sentiment stayed positive' : 'Sentiment needed more care'
      } and you held pace under 25:00.`

  return (
    <MotionSurface
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-6"
      style={{
        background:
          'radial-gradient(1200px 800px at 50% -10%, #20262d 0%, #101317 60%, #0b0d10 100%)',
      }}
      panelClassName="mx-auto w-full max-w-4xl rounded-3xl border border-[#3a3642] bg-[#1c1a21]/90 px-5 py-7 shadow-2xl backdrop-blur sm:my-auto sm:px-8 sm:py-9"
    >
      <div className="flex flex-col items-center text-center">
        {/* The two people who were just on the call, as an overlapping social-avatar
            stack. The customer leads (left, on top); the expert tucks in behind on
            the right. An opaque ring in the panel color cuts the clean overlap notch.
            GSAP animates the reveal — see the useGSAP above. */}
        <div className="flex items-center">
          <div ref={customerRef} className="relative z-20">
            <Image
              src={CUSTOMER.avatar}
              alt={CUSTOMER.name}
              width={AVATAR_PX}
              height={AVATAR_PX}
              className="h-[72px] w-[72px] rounded-full object-cover ring-[3px] ring-[#1c1a21]"
            />
          </div>
          <div ref={expertRef} className="relative z-10 -ml-4">
            <ExpertAvatar
              photo={EXPERT.photo}
              accessories={accessories}
              size="lg"
              photoClassName="ring-[3px] ring-[#1c1a21]"
            />
          </div>
        </div>

        <p className={classes.eyebrow}>Call complete</p>

        {/* Full call summary — hero. Plain on-surface text; color lives on cards. */}
        <p className={`mt-3 ${classes.summaryHero}`}>{summaryText}</p>

        {PIT_STOP_SUMMARY.integrated ? (
          <span className={classes.sentBadge} role="status">
            <CheckCircle size={14} weight="fill" aria-hidden />
            Sent automatically to {PIT_STOP_SUMMARY.clientLabel}
          </span>
        ) : null}

        {/* Screen-reader / disposition-system plain text lives in the fixture. */}
        <span className="sr-only">{PIT_STOP_SUMMARY.plainText}</span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="motion-enter"
            style={{ animationDelay: `${staggerDelay(index, ewMotion.delay.cardStagger)}ms` }}
          >
            <MetricCard metric={card} playOnMount />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center sm:mt-8">
        <button
          type="button"
          onClick={resolveGate}
          className={`motion-press ${classes.readyButton}`}
        >
          {/* Auto-advance countdown, drained like the daily-drop waiting pill —
              same 1s-step data that used to drive the top ring; the sweep glides
              via .motion-sweep-ring. Turns amber in the final 5s as the next
              call nears. Clicking skips ahead early. */}
          <span className="relative flex size-5 shrink-0 items-center justify-center">
            <svg
              className="size-5 -rotate-90 overflow-visible"
              viewBox={`0 0 ${BTN_RING_VIEW} ${BTN_RING_VIEW}`}
              aria-hidden
            >
              <circle
                cx={BTN_RING_C}
                cy={BTN_RING_C}
                r={BTN_RING_R}
                fill="none"
                stroke="rgba(255,255,255,0.28)"
                strokeWidth={BTN_RING_SW}
              />
              <circle
                cx={BTN_RING_C}
                cy={BTN_RING_C}
                r={BTN_RING_R}
                fill="none"
                stroke={pitStopRemaining <= 5 ? '#F59E0B' : '#ffffff'}
                strokeWidth={BTN_RING_SW}
                strokeLinecap="round"
                className="motion-sweep-ring"
                strokeDasharray={BTN_RING_CIRC}
                strokeDashoffset={BTN_RING_CIRC * progress}
              />
            </svg>
          </span>
          Ready for next customer
        </button>
      </div>
    </MotionSurface>
  )
}
