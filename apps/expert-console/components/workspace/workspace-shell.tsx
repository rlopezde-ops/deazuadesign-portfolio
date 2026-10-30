'use client'

import { useRef, type CSSProperties } from 'react'
import { BorderBeam } from 'border-beam'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { usePanelSplit } from '@/hooks/use-panel-split'
import { CONTAINER_MORPH, EASE_PANEL_IN, WORKSPACE_MOTION } from '@/lib/motion'
import { useConsoleStore } from '@/store/console-store'
import { CallBarGlow } from './call-bar-glow'
import { PanelResizer } from './panel-resizer'
import { Sidecar } from './sidecar'
import { TopBar } from '@/components/shared/top-bar'
import { TranscriptPanel } from './transcript-panel'

gsap.registerPlugin(useGSAP)

/** Matches `.workspace-panel` `--ew-radius-panel` (16px). */
const SIDECAR_BEAM_RADIUS = 16
/** Slower lap so the glow stays readable on the tall vertical edges. */
const SIDECAR_BEAM_DURATION = 11

export function WorkspaceShell() {
  const shiftPhase = useConsoleStore((s) => s.shiftPhase)
  const opportunityUnlocked = useConsoleStore((s) => s.opportunityUnlocked)
  const morph = useConsoleStore((s) => s.morph)
  const { rowRef, split, isDragging, animating, endAnimation, nudge, reset, handlers } =
    usePanelSplit()
  const containerRef = useRef<HTMLDivElement>(null)

  // Keyed on `shiftPhase`, not on mount: the shell stays mounted for the whole
  // shift and renders null off-call, so entering `in-call` is the only signal
  // that the warm handoff has cleared. Each `data-enter` surface rises in
  // document order — chrome, call bar, transcript, tasks — on the same
  // easeOutExpo curve the Daily Drop rail uses.
  useGSAP(
    () => {
      if (shiftPhase !== 'in-call') return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // Read the morph at entry time (not the live selector): if this call bar
      // was docked by the dialog→call-bar ghost, exclude it from the rise so it
      // stays put where the ghost landed, and delay the other surfaces so they
      // assemble beneath it as the ghost docks. No latch needed — this effect is
      // keyed on `shiftPhase`, so it reads the value once per entry into in-call.
      const arrivedByMorph = useConsoleStore.getState().morph?.kind === 'dialog-to-callbar'
      const surfaces = gsap.utils.toArray<HTMLElement>(
        '[data-enter]' + (arrivedByMorph ? ':not([data-morph-dock])' : ''),
      )
      if (!surfaces.length) return

      gsap.fromTo(
        surfaces,
        { autoAlpha: 0, y: WORKSPACE_MOTION.riseY, scale: WORKSPACE_MOTION.fromScale },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: WORKSPACE_MOTION.inDuration,
          ease: EASE_PANEL_IN,
          stagger: WORKSPACE_MOTION.stagger,
          delay: arrivedByMorph ? CONTAINER_MORPH.assembleDelay : WORKSPACE_MOTION.start,
          // Hand the panels back to CSS once they land. A lingering transform
          // would leave each one a containing block for anything positioned
          // inside it.
          onComplete: () => {
            gsap.set(surfaces, { clearProps: 'transform,opacity,visibility' })
          },
        },
      )
    },
    { dependencies: [shiftPhase], revertOnUpdate: true, scope: containerRef },
  )

  if (shiftPhase !== 'in-call') return null

  return (
    <div
      ref={containerRef}
      className="flex h-screen w-full flex-col overflow-hidden bg-[var(--ew-surface-page)]"
    >
      {/* Wrappers carry the entrance so the animated node is never the same one
          CallBarGlow drives with its own pulse timelines. */}
      <div data-enter className="shrink-0">
        <TopBar />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-[8px] pb-[8px]">
        {/* Morph #2's landing dock. During the dialog→call-bar morph the ghost
            docks onto this wrapper (its rect equals the bar's — the bar fills it
            with no padding/border/margin), so it starts hidden and is excluded
            from the rise; the other surfaces assemble beneath it afterward. */}
        <div
          data-enter
          data-morph-dock
          data-morph-target="callbar"
          className="shrink-0"
          style={{ opacity: morph?.kind === 'dialog-to-callbar' ? 0 : undefined }}
        >
          <CallBarGlow />
        </div>

        <div ref={rowRef} className="flex min-h-0 flex-1 pt-[16px]">
          {/* Transcript sits on the page background — no Paper / workspace-panel. */}
          <div
            data-enter
            data-animating={animating}
            onTransitionEnd={endAnimation}
            className="flex min-w-0 flex-col overflow-hidden"
            style={{
              flex: `0 0 calc(${split}% - 8px)`,
              minWidth: 320,
            }}
          >
            <TranscriptPanel />
          </div>

          <PanelResizer
            split={split}
            isDragging={isDragging}
            onNudge={nudge}
            onReset={reset}
            handlers={handlers}
          />

          {/*
            Large sidecar perimeter: one beam looks spotty on the long L/R edges.
            Primary beam is brighter/slower; a phase-offset companion keeps a soft
            glow traveling the opposite side so the rim stays continuous.
          */}
          <div
            data-enter
            className="relative flex min-h-0 min-w-0 flex-1 flex-col"
            style={{ minWidth: 480 }}
          >
            <BorderBeam
              active={opportunityUnlocked}
              duration={SIDECAR_BEAM_DURATION}
              size="md"
              colorVariant="ocean"
              theme="dark"
              saturation={1.55}
              brightness={1.62}
              hueRange={16}
              strength={1}
              borderRadius={SIDECAR_BEAM_RADIUS}
              className="sidecar-border-beam relative z-0 flex h-full min-h-0 min-w-0 flex-1 flex-col"
            >
              <div
                className="workspace-panel flex h-full min-h-0 min-w-0 flex-1 flex-col"
                data-sell={opportunityUnlocked ? 'true' : undefined}
              >
                <Sidecar />
              </div>
            </BorderBeam>

            {opportunityUnlocked ? (
              <div
                className="sidecar-border-beam-secondary pointer-events-none absolute inset-0 z-[1]"
                aria-hidden
                style={
                  {
                    '--sidecar-beam-duration': `${SIDECAR_BEAM_DURATION}s`,
                  } as CSSProperties
                }
              >
                <BorderBeam
                  active
                  duration={SIDECAR_BEAM_DURATION}
                  size="md"
                  colorVariant="ocean"
                  theme="dark"
                  saturation={1.5}
                  brightness={1.48}
                  hueRange={16}
                  strength={0.68}
                  borderRadius={SIDECAR_BEAM_RADIUS}
                  className="h-full w-full"
                >
                  <div
                    className="h-full w-full"
                    style={{ borderRadius: SIDECAR_BEAM_RADIUS }}
                  />
                </BorderBeam>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
