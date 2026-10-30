'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { CaretDown, PushPin, X } from '@phosphor-icons/react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { BorderBeam } from 'border-beam'
import { PlanCard } from '@/components/device'
import {
  ACCOUNT_LINES,
  CUSTOMER,
  ISSUE_LABEL_FALLBACK,
  ISSUE_LABELS,
  PROTECTION_PLAN,
} from '@/lib/fixtures'
import { useConsoleStore } from '@/store/console-store'
import { cn } from '@/lib/utils'
import type { PinnedItem } from '@/lib/types'

// Progressive reveal, wired to this app's director rather than an intake form.
// Name + device are known from the account at connect, so the card starts at
// "is calling about…", auto-fills the device a beat later, and lands on the
// issue once the discovery beat sets `problemSummary` (facts.symptom). The card
// itself is expandable from mount — the reveal only drives the header sentence.
/** Quick beam for the device fill-in. */
const DEVICE_BEAM_MS = 900
/** Longer beam for the issue reveal, so the change reads as significant. */
const ISSUE_BEAM_MS = 1800
/** Delay before the device auto-fills in, so stage 0 registers first. */
const INTRO_DELAY_S = 1.4

/** Dark palette — the card sits on the dark transcript surface. */
const T = {
  cardBg: '#38323F',
  border: 'rgba(255, 255, 255, 0.08)',
  /* Elevation above the transcript — matches / exceeds sidecar panel depth. */
  shadow:
    '0 2px 5px -2px rgba(10, 8, 14, 0.55), 0 16px 40px -12px rgba(10, 8, 14, 0.75), 0 4px 12px rgba(0, 0, 0, 0.35)',
  shadowExpanded:
    '0 4px 10px -2px rgba(10, 8, 14, 0.6), 0 28px 64px -16px rgba(10, 8, 14, 0.8), 0 8px 20px rgba(0, 0, 0, 0.45)',
  metaMuted: 'rgba(255, 255, 255, 0.45)',
  metaStrong: 'rgba(255, 255, 255, 0.7)',
  name: '#fafafa',
  connector: 'rgba(255, 255, 255, 0.5)',
  dots: 'rgba(255, 255, 255, 0.4)',
  fallbackBg: 'rgba(255, 255, 255, 0.12)',
  fallbackText: 'rgba(255, 255, 255, 0.85)',
  divider: 'rgba(255, 255, 255, 0.08)',
  sectionLabel: 'rgba(255, 255, 255, 0.4)',
  detailMuted: 'rgba(255, 255, 255, 0.55)',
  thumbBg: 'rgba(255, 255, 255, 0.06)',
} as const

// Pinned-chip accent — the app's customer/accent purple (--ew-accent-soft).
const PIN_ACCENT = '#d0aaf1'
const PIN_CHIP_BG = 'rgba(208, 170, 241, 0.14)'
const PIN_PLACEHOLDER_BG = 'rgba(208, 170, 241, 0.06)'
const PIN_PLACEHOLDER_OUTLINE = 'rgba(208, 170, 241, 0.6)'
/*
 * A pin's arrival, and the gap between successive ones.
 *
 * The discovery beat pins four household devices at once, so these two are tuned
 * together: the tween is slow enough that a chip reads as landing rather than
 * blinking into place, and the stagger stays well inside it — each chip starts
 * about a third of the way into the one before — so a batch cascades as one wave
 * instead of four separate pops. Four chips land over ~1s.
 */
const PIN_IN_S = 1
const PIN_STAGGER_S = 0.16
/*
 * How long capture holds back before the chips appear.
 *
 * The discovery beat pins the household devices on the exact frame the line
 * lands, which reads as the system already knowing rather than noticing — so the
 * whole group waits a beat and then cascades in. The delay is on the pins
 * *reaching the card*, not just their animation: holding them at opacity 0 would
 * still reserve their space, leaving a "PINNED" heading over a blank row for a
 * second, which looks like a rendering fault rather than a pause for thought.
 */
const PIN_DETECT_DELAY_S = 1

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface CustomerSummaryCardProps {
  /** Reports the collapsed header height so the transcript can reserve space. */
  onCollapsedHeightChange?: (height: number) => void
}

/**
 * Floating "Venmo-style" customer summary card. Sits as an absolute overlay at
 * the top of the transcript panel. Clicking toggles an expanded state — available
 * from the moment the workspace opens — that grows the card slightly and drops
 * the protection-plan and account-line details down over the transcript.
 */
export function CustomerSummaryCard({ onCollapsedHeightChange }: CustomerSummaryCardProps) {
  const problemSummary = useConsoleStore((s) => s.problemSummary)
  const symptom = useConsoleStore((s) => s.facts.symptom)
  const pins = useConsoleStore((s) => s.pins)
  const unpinItem = useConsoleStore((s) => s.unpinItem)
  const reorderPins = useConsoleStore((s) => s.reorderPins)

  /*
   * What the card actually shows — the store's pins, held back by
   * PIN_DETECT_DELAY_S so capture reads as the system catching what was said.
   *
   * Only *additions* wait. Removing or reordering a chip is the expert's own
   * click or drag, so those land at once; a delay there would feel broken. The
   * delay isn't a motion effect either, so it stands under reduced motion too —
   * the chips just appear rather than cascade.
   */
  const [shownPins, setShownPins] = useState(pins)
  const shownIdsRef = useRef<Set<string>>(new Set(pins.map((pin) => pin.id)))

  useEffect(() => {
    const commit = () => {
      shownIdsRef.current = new Set(pins.map((pin) => pin.id))
      setShownPins(pins)
    }
    if (!pins.some((pin) => !shownIdsRef.current.has(pin.id))) {
      commit()
      return
    }
    const call = gsap.delayedCall(PIN_DETECT_DELAY_S, commit)
    return () => {
      call.kill()
    }
  }, [pins])

  const displayName = CUSTOMER.name
  const deviceName = CUSTOMER.device
  const issue = (symptom && ISSUE_LABELS[symptom]) || ISSUE_LABEL_FALLBACK
  const hasProblem = problemSummary.trim().length > 0

  const [expanded, setExpanded] = useState(false)
  // Displayed reveal stage (0..2). Drives only the header sentence
  // (name → +device → +issue); the card is expandable at every stage.
  //
  // Seed it from the director's state rather than always 0, so a *remount* —
  // the presenter jumping sections (`jumpToScene` replays from a clean state,
  // round-tripping `shiftPhase` back through `in-call`) or the workspace
  // otherwise leaving and re-entering the call — lands the card fully filled
  // out instead of restarting at "…is calling about". A genuine first entry to
  // the call has no problem captured yet, so it still starts at 0 and plays the
  // staged reveal forward. Stage only ever climbs, so once filled it stays.
  const initialStage = hasProblem ? 2 : 0
  const [stage, setStage] = useState(initialStage)
  const [beaming, setBeaming] = useState(false)
  const [beamMs, setBeamMs] = useState(ISSUE_BEAM_MS)
  const [introReady, setIntroReady] = useState(false)

  // Where the card *should* be, derived from the director's state. Reconciled
  // toward by `advanceToStage` (with a border-beam pulse on each step up).
  const targetStage = hasProblem ? 2 : introReady ? 1 : 0

  const cardRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const detailsInnerRef = useRef<HTMLDivElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)
  const didMountRef = useRef(false)
  const metaRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const stageMountRef = useRef(false)
  const stageRef = useRef(initialStage)
  const beamingRef = useRef(false)
  const beamTimerRef = useRef<number | null>(null)

  // Reserve transcript space for the (wrap-aware) collapsed header height.
  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el || !onCollapsedHeightChange) return
    const report = () => onCollapsedHeightChange(el.offsetHeight)
    report()
    const ro = new ResizeObserver(report)
    ro.observe(el)
    return () => ro.disconnect()
  }, [onCollapsedHeightChange])

  // The device fills in a beat after connect so stage 0 registers first. Under
  // reduced motion there's no beam anyway, so make it ready immediately.
  useEffect(() => {
    if (prefersReducedMotion()) {
      setIntroReady(true)
      return
    }
    const call = gsap.delayedCall(INTRO_DELAY_S, () => setIntroReady(true))
    return () => {
      call.kill()
    }
  }, [])

  // Advance the displayed stage up to `target`, running the beam first. Guards
  // against re-entrancy so overlapping triggers don't stack beams.
  const advanceToStage = useCallback((target: number, durationMs: number) => {
    if (beamingRef.current) return
    if (target <= stageRef.current) return

    if (prefersReducedMotion()) {
      stageRef.current = target
      setStage(target)
      return
    }

    beamingRef.current = true
    setBeamMs(durationMs)
    setBeaming(true)
    beamTimerRef.current = window.setTimeout(() => {
      beamTimerRef.current = null
      beamingRef.current = false
      setBeaming(false)
      stageRef.current = target
      setStage(target)
    }, durationMs)
  }, [])

  // Reconcile displayed → target. Re-runs when the beam clears, so a target that
  // arrived mid-beam (e.g. the issue landing during the device fill) still fires.
  useEffect(() => {
    if (beaming) return
    if (targetStage <= stage) return
    advanceToStage(targetStage, targetStage >= 2 ? ISSUE_BEAM_MS : DEVICE_BEAM_MS)
  }, [targetStage, beaming, stage, advanceToStage])

  useEffect(() => {
    return () => {
      if (beamTimerRef.current != null) window.clearTimeout(beamTimerRef.current)
    }
  }, [])

  // Animate freshly-swapped stage content in (fires right as the beam ends).
  useGSAP(
    () => {
      const targets = [metaRef.current, bodyRef.current].filter(Boolean) as HTMLElement[]
      if (targets.length === 0) return
      if (!stageMountRef.current) {
        stageMountRef.current = true
        return
      }
      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 })
        return
      }
      const tl = gsap.timeline()
      tl.fromTo(
        targets,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'expo.out',
          stagger: 0.06,
          // Hand the transform back to CSS instead of resting on an identity
          // matrix. A transform — even `translate(0, 0)` — keeps the element on
          // its own composited layer, which costs subpixel antialiasing and
          // leaves the text looking soft in Safari.
          onComplete: () => {
            gsap.set(targets, { clearProps: 'transform' })
          },
        },
      )
      return () => {
        tl.kill()
      }
    },
    { dependencies: [stage], scope: cardRef },
  )

  // Expand / collapse: grow the card slightly, drop the details height 0→auto.
  useGSAP(
    () => {
      const card = cardRef.current
      const details = detailsRef.current
      const inner = detailsInnerRef.current
      const caret = caretRef.current
      if (!card || !details || !inner) return

      /*
       * The expanded card used to also sit at `scale: 1.012` — a permanent
       * fractional scale, which Safari renders by rasterizing the layer once and
       * scaling it, so every glyph inside (and the thin-stroke Verizon mark worst
       * of all) went soft. The depth cue is the shadow's job now; the height
       * reveal and the caret carry the rest. Same reason the morphs in this app
       * tween geometry rather than scale.
       */

      // First render: settle into the closed state without animating.
      if (!didMountRef.current) {
        didMountRef.current = true
        gsap.set(details, { height: 0 })
        gsap.set(inner, { opacity: 0, y: 10 })
        if (caret) gsap.set(caret, { rotate: 0 })
        return
      }

      if (prefersReducedMotion()) {
        gsap.set(details, { height: expanded ? 'auto' : 0 })
        gsap.set(inner, { opacity: expanded ? 1 : 0, clearProps: 'transform' })
        gsap.set(card, { boxShadow: expanded ? T.shadowExpanded : T.shadow })
        if (caret) gsap.set(caret, { rotate: expanded ? 180 : 0 })
        return
      }

      const tl = gsap.timeline()

      if (expanded) {
        gsap.set(details, { height: 'auto' })
        const target = details.offsetHeight
        gsap.set(details, { height: 0 })

        tl.to(card, { boxShadow: T.shadowExpanded, duration: 0.55, ease: 'expo.out' }, 0)
        tl.to(
          details,
          {
            height: target,
            duration: 0.55,
            ease: 'expo.out',
            onComplete: () => {
              gsap.set(details, { height: 'auto' })
            },
          },
          0,
        )
        tl.to(
          inner,
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            ease: 'power2.out',
            // Resting with no transform keeps the plan card's text and logo on the
            // page's own pixel grid rather than a composited layer's.
            onComplete: () => {
              gsap.set(inner, { clearProps: 'transform' })
            },
          },
          0.14,
        )
        if (caret) tl.to(caret, { rotate: 180, duration: 0.55, ease: 'expo.out' }, 0)
      } else {
        gsap.set(details, { height: details.offsetHeight })

        tl.to(inner, { opacity: 0, y: 8, duration: 0.18, ease: 'power2.in' }, 0)
        tl.to(details, { height: 0, duration: 0.42, ease: 'power3.inOut' }, 0.04)
        tl.to(card, { boxShadow: T.shadow, duration: 0.44, ease: 'power3.inOut' }, 0)
        if (caret) tl.to(caret, { rotate: 0, duration: 0.44, ease: 'power3.inOut' }, 0)
      }

      return () => {
        tl.kill()
      }
    },
    { dependencies: [expanded], scope: cardRef },
  )

  const toggle = () => {
    setExpanded((v) => !v)
  }

  return (
    <BorderBeam
      active={beaming}
      duration={beamMs / 1000}
      size="md"
      colorVariant="ocean"
      theme="dark"
      // Beam's outer corner radius = borderRadius - beamWidth (1px for "md").
      // Card is rounded-[28px], so pass 29 to hug the 28px corner.
      borderRadius={29}
      className="block w-full"
      style={{ width: '100%' }}
    >
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onClick={toggle}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggle()
          }
        }}
        className="cursor-pointer overflow-hidden rounded-[28px] outline-none"
        style={{
          backgroundColor: T.cardBg,
          border: `1px solid ${T.border}`,
          boxShadow: T.shadow,
          boxSizing: 'border-box',
        }}
        data-slot="customer-summary-card"
        data-expanded={expanded}
        data-stage={stage}
      >
        <div ref={headerRef} className="p-[16px] sm:p-[20px]">
          <div className="flex items-center justify-between">
            <div
              ref={metaRef}
              className="flex items-center gap-[8px] text-[13px]"
              style={{ color: T.metaMuted }}
            >
              <span
                className="size-[6px] shrink-0 rounded-full animate-pulse"
                style={{ backgroundColor: '#22C55E' }}
              />
              <span className="font-medium" style={{ color: T.metaStrong }}>
                Live call
              </span>
            </div>
            <span ref={caretRef} className="inline-flex">
              <CaretDown className="size-[16px]" style={{ color: T.dots }} />
            </span>
          </div>

          <div ref={bodyRef}>
            <div className="mt-[12px] flex items-center gap-[12px]">
              <div
                className="relative size-[44px] shrink-0 overflow-hidden rounded-full"
                style={{ backgroundColor: T.fallbackBg }}
              >
                <span
                  className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold"
                  style={{ color: T.fallbackText }}
                  aria-hidden
                >
                  {getInitials(displayName)}
                </span>
                <Image
                  src={CUSTOMER.avatar}
                  alt={displayName}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <p className="text-[16px] leading-snug" style={{ color: T.connector }}>
                {stage === 0 && (
                  <>
                    <span className="font-semibold" style={{ color: T.name }}>
                      {displayName}
                    </span>{' '}
                    is calling about…
                  </>
                )}
                {stage === 1 && (
                  <>
                    <span className="font-semibold" style={{ color: T.name }}>
                      {displayName}
                    </span>{' '}
                    is calling about their{' '}
                    <span className="font-semibold" style={{ color: T.name }}>
                      {deviceName}
                    </span>
                  </>
                )}
                {stage === 2 && (
                  <>
                    <span className="font-semibold" style={{ color: T.name }}>
                      {displayName}
                    </span>{' '}
                    is calling about{' '}
                    <span className="font-semibold" style={{ color: T.name }}>
                      {issue}
                    </span>{' '}
                    on their{' '}
                    <span className="font-semibold" style={{ color: T.name }}>
                      {deviceName}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {shownPins.length > 0 && (
            <div className="mt-[14px]" onClick={(e) => e.stopPropagation()}>
              <p
                className="mb-[6px] text-[11px] font-medium uppercase tracking-wide"
                style={{ color: T.sectionLabel }}
              >
                Pinned
              </p>
              <PinnedList items={shownPins} onRemove={unpinItem} onReorder={reorderPins} />
            </div>
          )}
        </div>

        <div ref={detailsRef} className="overflow-hidden" style={{ height: 0 }} aria-hidden={!expanded}>
          <div ref={detailsInnerRef} className="space-y-[16px] px-[16px] pb-[16px] sm:px-[20px] sm:pb-[20px]">
            <div className="h-px w-full" style={{ backgroundColor: T.divider }} />

            {/*
              The same plan card the device step shows, so the account's coverage
              reads identically wherever it appears. It stops click propagation
              because it carries its own control — "Coverage details" would
              otherwise collapse the whole card on the way up.
            */}
            <div onClick={(e) => e.stopPropagation()}>
              <PlanCard plan={PROTECTION_PLAN} smallAction />
            </div>

            <div className="h-px w-full" style={{ backgroundColor: T.divider }} />

            <div>
              <p
                className="mb-[10px] text-[11px] font-medium uppercase tracking-wide"
                style={{ color: T.sectionLabel }}
              >
                Devices
              </p>
              <div className="space-y-[12px]">
                {ACCOUNT_LINES.map((line) => (
                  <div key={line.phone} className="flex items-center gap-[12px]">
                    <div
                      className="flex h-[48px] w-[36px] shrink-0 items-center justify-center overflow-hidden rounded-md"
                      style={{ backgroundColor: T.thumbBg }}
                    >
                      <Image
                        src={line.image}
                        alt={line.device}
                        width={36}
                        height={48}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium" style={{ color: T.name }}>
                        {line.device}
                      </p>
                      <p className="truncate text-[12px]" style={{ color: T.detailMuted }}>
                        {line.holder} · {line.phone}
                      </p>
                      <p className="mt-[2px] font-mono text-[11px]" style={{ color: T.sectionLabel }}>
                        IMEI {line.imei}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BorderBeam>
  )
}

// ---------------------------------------------------------------------------
// Pinned snippets — a small sortable list. Native HTML5 drag-and-drop with a
// live reorder: the dragged row becomes a dashed placeholder marking the drop
// zone, and the other rows glide out of the way (FLIP) to make room. Insertion
// is midpoint-based so adjacent rows don't jitter back and forth.
// ---------------------------------------------------------------------------

function PinnedList({
  items,
  onRemove,
  onReorder,
}: {
  items: PinnedItem[]
  onRemove: (id: string) => void
  onReorder: (fromId: string, toId: string) => void
}) {
  const [dragId, setDragId] = useState<string | null>(null)
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const prevRects = useRef<Map<string, DOMRect>>(new Map())
  /**
   * Rows that have finished arriving, so the entrance plays once per row and an
   * interrupted tween can never strand one invisible.
   *
   * Flagged on the tween's *completion*, not when it's created. This effect kills
   * in-flight tweens and settles every row at the top of each pass, so a row
   * flagged up front would be settled by the next pass — and Strict Mode
   * double-invokes layout effects in dev — with the guard then refusing to
   * recreate it. The pins landed instantly for exactly that reason. Marking on
   * completion means a killed entrance is simply started again.
   */
  const mountedIds = useRef<Set<string>>(new Set())

  // FLIP + mount: after any order/membership change, glide each row from its
  // previous position to the new one; fade brand-new rows in. The dragged row
  // (the placeholder) is left to jump straight to the current drop slot.
  useLayoutEffect(() => {
    const prev = prevRects.current
    const mounted = mountedIds.current
    const reduce = prefersReducedMotion()
    // Walk in items (reading) order, not Map insertion order, so a batch of new
    // pins staggers in left-to-right. `newArrivals` counts brand-new rows seen
    // so far this pass — each gets a longer delay than the last.
    let newArrivals = 0
    items.forEach((item) => {
      const id = item.id
      const el = rowRefs.current.get(id)
      if (!el) return
      gsap.killTweensOf(el)
      // Settle to the visible resting state first — killing any in-flight tween
      // (Strict Mode re-invoke, rapid reorder) must never leave opacity < 1.
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 })
      const rect = el.getBoundingClientRect()
      const old = prev.get(id)
      if (!reduce) {
        if (!mounted.has(id)) {
          gsap.fromTo(
            // A touch more travel than the old 4px: over this duration a 4px
            // drop reads as a slow fade rather than the chip arriving.
            el,
            { opacity: 0, y: -8, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              duration: PIN_IN_S,
              ease: 'power2.out',
              delay: newArrivals * PIN_STAGGER_S,
              onComplete: () => {
                mounted.add(id)
              },
            },
          )
          newArrivals += 1
        } else if (id !== dragId && old) {
          // Chips flow in a wrapping row, so a reorder can shift a tag on both
          // axes — glide from the old position on x and y.
          const dx = old.left - rect.left
          const dy = old.top - rect.top
          if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            gsap.fromTo(el, { x: dx, y: dy }, { x: 0, y: 0, duration: 0.22, ease: 'power2.out' })
          }
        }
      } else {
        // Nothing animates under reduced motion, so the row has "arrived" now.
        mounted.add(id)
      }
      prev.set(id, rect)
    })
    for (const id of Array.from(prev.keys())) {
      if (!rowRefs.current.has(id)) {
        prev.delete(id)
        mounted.delete(id)
      }
    }
  }, [items, dragId])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!dragId) return
    const dragIndex = items.findIndex((i) => i.id === dragId)
    if (dragIndex === -1) return
    // Where would the dragged chip land? Reading-order hit test across the
    // wrapping row: the pointer is "before" a chip if it sits on an earlier
    // line, or on the same line to the left of the chip's horizontal midpoint.
    let insertIndex = items.length
    for (let idx = 0; idx < items.length; idx++) {
      const el = rowRefs.current.get(items[idx].id)
      if (!el) continue
      const r = el.getBoundingClientRect()
      const beforeLine = e.clientY < r.top
      const onLine = e.clientY <= r.bottom
      if (beforeLine || (onLine && e.clientX < r.left + r.width / 2)) {
        insertIndex = idx
        break
      }
    }
    // Boundaries directly above/below the dragged row are no-ops — the guard
    // that keeps the list from ping-ponging between two adjacent slots.
    if (insertIndex === dragIndex || insertIndex === dragIndex + 1) return
    const targetId = insertIndex < dragIndex ? items[insertIndex].id : items[insertIndex - 1].id
    onReorder(dragId, targetId)
  }

  const endDrag = () => setDragId(null)

  return (
    <div
      className="flex flex-wrap gap-[6px]"
      onDragOver={handleDragOver}
      onDrop={(e) => {
        e.preventDefault()
        endDrag()
      }}
      onDragEnd={endDrag}
    >
      {items.map((item) => {
        const isPlaceholder = item.id === dragId
        return (
          <div
            key={item.id}
            ref={(el) => {
              if (el) rowRefs.current.set(item.id, el)
              else rowRefs.current.delete(item.id)
            }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move'
              // Firefox won't start a drag unless some data is set.
              e.dataTransfer.setData('text/plain', item.id)
              const el = rowRefs.current.get(item.id)
              if (el) {
                const r = el.getBoundingClientRect()
                // Keep the full-content ghost under the cursor even though the
                // in-list row is about to become an empty placeholder.
                e.dataTransfer.setDragImage(el, e.clientX - r.left, e.clientY - r.top)
              }
              setDragId(item.id)
            }}
            className="group inline-flex max-w-full cursor-grab items-center gap-[6px] rounded-full px-[10px] py-[4px] active:cursor-grabbing"
            style={
              isPlaceholder
                ? {
                    backgroundColor: PIN_PLACEHOLDER_BG,
                    outline: `1.5px dashed ${PIN_PLACEHOLDER_OUTLINE}`,
                    outlineOffset: '-1.5px',
                  }
                : { backgroundColor: PIN_CHIP_BG }
            }
          >
            <div className={cn('inline-flex min-w-0 items-center gap-[6px]', isPlaceholder && 'invisible')}>
              <PushPin className="size-[12px] shrink-0" weight="fill" style={{ color: PIN_ACCENT }} />
              <span
                className="min-w-0 truncate text-[13px] leading-snug"
                style={{ color: T.name }}
                title={item.text}
              >
                {item.text}
              </span>
            </div>
            <button
              type="button"
              draggable={false}
              onClick={(e) => {
                e.stopPropagation()
                onRemove(item.id)
              }}
              className={cn(
                '-mr-[2px] shrink-0 cursor-pointer rounded-full p-[2px] opacity-50 transition-opacity hover:bg-white/[0.10] hover:opacity-100 focus-visible:opacity-100',
                isPlaceholder && 'invisible',
              )}
              aria-label="Remove pinned item"
            >
              <X className="size-[12px]" weight="bold" style={{ color: T.detailMuted }} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
