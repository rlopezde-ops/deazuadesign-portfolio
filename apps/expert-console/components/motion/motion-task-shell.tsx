'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/** Long enough to cover the exit animation if `animationend` never fires. */
const EXIT_SWEEP_MS = 600

/**
 * Wraps a sidecar task so its height animates when the content swaps between a
 * full form and a compressed summary. Keeps the column below it moving
 * continuously instead of jumping, and lets a card compress while the next one
 * expands in the same beat.
 *
 * It also owns the step's exit: on the way out the card floats up and off the top
 * of the column, the mirror of `.task-content--in` rising in from below, so the
 * guidance column reads like a chat timeline without being one.
 */
export function MotionTaskShell({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  // A callback ref rather than a plain one: React detaches refs while unmounting,
  // and the exit below needs the node on the way out.
  const shellRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<Element | null>(null)
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    const inner = innerRef.current
    if (!inner) return

    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height)
    })
    observer.observe(inner)
    return () => observer.disconnect()
  }, [])

  /**
   * Exit. The step is unmounted the instant `viewStep` changes, so there's nothing
   * left in the tree to animate — as with the input sheet, we hand a static clone
   * to the stage and let CSS play it (`.task-exit`). A snapshot is all it needs;
   * `inert` keeps it out of the tab order and the a11y tree while it plays.
   *
   * Absolutely positioned at the card's last box, so the arriving step doesn't
   * wait for it to leave. Parented to `.sidecar-stage`, which is what keeps this
   * honest: when the whole workspace tears down, the stage goes in that same
   * commit and takes the clone with it, so a clone only ever paints on a real step
   * swap. A detached card measures 0×0, which is also how a shell that already
   * emptied out is skipped.
   */
  useLayoutEffect(() => {
    stageRef.current = shellRef.current?.closest('.sidecar-stage') ?? null

    return () => {
      const node = shellRef.current
      const stage = stageRef.current
      if (!node || !stage) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const box = node.getBoundingClientRect()
      if (box.height === 0) return
      const origin = stage.getBoundingClientRect()

      const ghost = node.cloneNode(true) as HTMLElement
      ghost.classList.add('task-exit')
      ghost.setAttribute('aria-hidden', 'true')
      ghost.setAttribute('inert', '')
      ghost.style.position = 'absolute'
      ghost.style.left = `${box.left - origin.left}px`
      ghost.style.top = `${box.top - origin.top}px`
      ghost.style.width = `${box.width}px`
      ghost.style.height = `${box.height}px`
      stage.appendChild(ghost)

      const drop = () => {
        window.clearTimeout(sweep)
        ghost.remove()
      }
      const sweep = window.setTimeout(drop, EXIT_SWEEP_MS)
      ghost.addEventListener('animationend', drop, { once: true })
    }
  }, [])

  if (children == null) return null

  return (
    <div
      ref={(node) => {
        if (node) shellRef.current = node
      }}
      className={`motion-task-shell ${className}`}
      data-measured={height === null ? 'false' : 'true'}
      style={height === null ? undefined : { height }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  )
}
