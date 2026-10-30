'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { CONTAINER_MORPH, EASE_CONTAINER_MORPH } from '@/lib/motion'
import { useConsoleStore } from '@/store/console-store'
import type { ContainerMorphKind } from '@/lib/types'

/**
 * The single persistent morph layer. It is always mounted (in `expert-console-app`)
 * but renders nothing unless a `morph` request is live, so it never lingers in
 * the tree between transitions.
 *
 * A container morph spans a phase change where the source surface unmounts and a
 * structurally different target mounts — no DOM node survives, so an in-place
 * morph (or GSAP Flip) is impossible. Instead we paint one styled "ghost" box at
 * the source's measured rect (captured in `advance()` before it unmounted) and
 * tween its geometry + background-color + border-radius into the target's rect,
 * then crossfade the real target in and the ghost out at the tail.
 *
 * Boxes are axis-aligned with no rotation, so we animate `left/top/width/height`
 * directly — never `scale`, which would smear the 1px border and distort the
 * radius across a large size change (the house convention; see `waiting-pill`).
 */
const TARGET_ATTR: Record<ContainerMorphKind, string> = {
  'pill-to-dialog': '[data-morph-target="dialog"]',
  'dialog-to-callbar': '[data-morph-target="callbar"]',
}

function tokenFor(kind: ContainerMorphKind) {
  return kind === 'pill-to-dialog' ? CONTAINER_MORPH.pillToDialog : CONTAINER_MORPH.dialogToCallbar
}

export function ContainerMorph() {
  const morph = useConsoleStore((s) => s.morph)
  const ghostRef = useRef<HTMLDivElement>(null)

  // Keyed on `morph?.nonce` so each request runs its morph exactly once. The
  // target renders hidden (`opacity: 0`) from first paint, so there is never a
  // painted frame of it at full size before the ghost lands.
  useLayoutEffect(() => {
    if (!morph) return
    const ghost = ghostRef.current
    if (!ghost) return

    const targetEl = document.querySelector<HTMLElement>(TARGET_ATTR[morph.kind])
    const patch = useConsoleStore.getState().patch
    if (!targetEl) {
      // Target not in the tree (degrades to today's hard swap): clear the gate
      // so the target — wherever it is — becomes visible.
      patch({ morph: null })
      return
    }

    const token = tokenFor(morph.kind)
    const rect = targetEl.getBoundingClientRect()

    // The warm-handoff background scrim (the radial-gradient on the modal's outer
    // div). Only pill→dialog has a full-screen scrim to drive; the callbar morph
    // docks onto the assembling workspace, which has no scrim. The morph fades it
    // in partway through the growth so it lands *after* the pill starts animating.
    const scrimEl =
      morph.kind === 'pill-to-dialog'
        ? document.querySelector<HTMLElement>('[data-morph-scrim="dialog"]')
        : null

    // On a clean finish the timeline lands the target at autoAlpha 1 and hands
    // it back to CSS; reverting then would restore the tween's *recorded* start
    // (React's gate `opacity: 0`) and re-hide it. So revert only on genuine
    // interruption — a new nonce or an unmount mid-flight — never on completion.
    let completed = false
    const ctx = gsap.context(() => {
      gsap.set(ghost, {
        left: morph.from.left,
        top: morph.from.top,
        width: morph.from.width,
        height: morph.from.height,
        borderRadius: token.fromRadius,
        backgroundColor: token.fromBg,
        autoAlpha: 1,
      })
      // Scrim starts transparent (React also gates it to 0), so the morning paper
      // is fully readable as the ghost launches from the pill.
      if (scrimEl) gsap.set(scrimEl, { opacity: 0 })
      const tl = gsap.timeline({
        onComplete: () => {
          // Hand opacity/visibility back to CSS, then clear the request. When
          // `morph` clears, React drops the target's inline `opacity: 0`
          // (→ undefined → CSS default 1), so there is no re-hide flicker.
          completed = true
          gsap.set(targetEl, { clearProps: 'opacity,visibility' })
          if (scrimEl) gsap.set(scrimEl, { clearProps: 'opacity' })
          patch({ morph: null })
        },
      })
      tl.to(
        ghost,
        {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          borderRadius: token.toRadius,
          backgroundColor: token.toBg,
          duration: token.duration,
          ease: EASE_CONTAINER_MORPH,
        },
        0,
      )
      // Fade the scrim in only once the box has visibly begun growing — the
      // morning paper dissolves *behind* the swelling ghost, not before it moves.
      // Values read from the concrete pill→dialog token (scrimEl is null for the
      // callbar morph, so this branch never runs for the other shape).
      if (scrimEl) {
        tl.to(
          scrimEl,
          { opacity: 1, duration: CONTAINER_MORPH.pillToDialog.scrimDuration, ease: 'power1.inOut' },
          CONTAINER_MORPH.pillToDialog.scrimStart,
        )
      }
      tl.to(
        targetEl,
        { autoAlpha: 1, duration: CONTAINER_MORPH.revealFade },
        token.duration - CONTAINER_MORPH.revealFade,
      ).to(
        ghost,
        { autoAlpha: 0, duration: CONTAINER_MORPH.ghostFadeOut },
        token.duration - CONTAINER_MORPH.ghostFadeOut,
      )
    })
    // Revert on interruption (a new nonce, or unmount) so a cut-short morph
    // never leaves the ghost or target mid-tween. A completed morph skips this
    // so the landed, now-visible target is not reverted back to its gate state.
    return () => {
      if (!completed) ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [morph?.nonce])

  if (!morph) return null
  const token = tokenFor(morph.kind)
  return (
    <div
      ref={ghostRef}
      aria-hidden
      data-morph-ghost={morph.kind}
      className="pointer-events-none fixed z-[85] shadow-2xl"
      style={{
        left: morph.from.left,
        top: morph.from.top,
        width: morph.from.width,
        height: morph.from.height,
        boxSizing: 'border-box',
        borderRadius: token.fromRadius,
        backgroundColor: token.fromBg,
        border: `1px solid ${CONTAINER_MORPH.border}`,
      }}
    />
  )
}
