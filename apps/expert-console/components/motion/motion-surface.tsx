'use client'

import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'

/**
 * Full-screen surface: the backdrop fades while the panel rises a short
 * distance and settles. Nothing here gates on `animationend`, so the expert can
 * act on the panel the moment it renders.
 *
 * `panelRef` exposes the panel element so callers can drive it with GSAP
 * (e.g. a go-live glow flash) without wrapping it in an extra node.
 *
 * `sequenced` splits the entrance into two steps: the backdrop fades in first,
 * then the panel rises from a slightly deeper offset once the fade has settled.
 * Used for the warm handoff arriving over the morning paper.
 *
 * `suppressPanelEntrance` drops the panel's CSS rise class so a container morph
 * can own the panel's arrival instead. `suppressBackdrop` does the same for the
 * outer scrim — dropping its `motion-backdrop-in` fade so the morph timeline can
 * fade the scrim in on its own schedule (after the box starts growing) instead
 * of the scrim slamming in at mount. `panelStyle` / `panelProps` and
 * `backdropProps` are spread onto the panel / outer element so a caller can gate
 * opacity (a morph surface starts hidden) and tag it as a morph source/target.
 * Props spread *before* the explicit className/style so the surface's own class
 * and any gate style always win.
 */
export function MotionSurface({
  className = '',
  style,
  panelClassName = '',
  panelRef,
  sequenced = false,
  suppressPanelEntrance = false,
  suppressBackdrop = false,
  panelStyle,
  panelProps,
  backdropProps,
  children,
}: {
  className?: string
  style?: CSSProperties
  panelClassName?: string
  panelRef?: Ref<HTMLDivElement>
  sequenced?: boolean
  suppressPanelEntrance?: boolean
  suppressBackdrop?: boolean
  panelStyle?: CSSProperties
  // Intersect a data-* index signature: React only permits data-attributes via
  // JSX, so a bare HTMLAttributes object literal would reject them as excess.
  panelProps?: HTMLAttributes<HTMLDivElement> & { [dataAttr: `data-${string}`]: string }
  backdropProps?: HTMLAttributes<HTMLDivElement> & { [dataAttr: `data-${string}`]: string }
  children: ReactNode
}) {
  const panelEnter = suppressPanelEntrance
    ? ''
    : sequenced
      ? 'motion-surface-in-sequenced'
      : 'motion-surface-in'
  const backdropEnter = suppressBackdrop ? '' : 'motion-backdrop-in'
  return (
    <div {...backdropProps} className={`${backdropEnter} ${className}`} style={style}>
      <div
        ref={panelRef}
        {...panelProps}
        className={`${panelEnter} ${panelClassName}`}
        style={panelStyle}
      >
        {children}
      </div>
    </div>
  )
}
