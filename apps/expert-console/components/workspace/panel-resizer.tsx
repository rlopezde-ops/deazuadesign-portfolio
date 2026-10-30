'use client'

import type { PointerEvent as ReactPointerEvent } from 'react'
import { SPLIT_MAX, SPLIT_MIN } from '@/hooks/use-panel-split'

interface PanelResizerProps {
  split: number
  isDragging: boolean
  onNudge: (delta: number) => void
  onReset: () => void
  handlers: {
    onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void
    onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void
    onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void
    onPointerCancel: (event: ReactPointerEvent<HTMLDivElement>) => void
  }
}

/** The 16px gutter between the transcript and the sidecar, doubling as the grab target. */
export function PanelResizer({ split, isDragging, onNudge, onReset, handlers }: PanelResizerProps) {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize transcript and assist panels"
      aria-valuenow={Math.round(split)}
      aria-valuemin={SPLIT_MIN}
      aria-valuemax={SPLIT_MAX}
      tabIndex={0}
      onDoubleClick={onReset}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          onNudge(-2)
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          onNudge(2)
        } else if (event.key === 'Home') {
          event.preventDefault()
          onReset()
        }
      }}
      {...handlers}
      className="group flex w-[16px] shrink-0 cursor-col-resize touch-none items-center justify-center outline-none"
    >
      <span
        data-dragging={isDragging}
        className="panel-resizer-grip h-[32px] w-[2px] rounded-full bg-transparent group-hover:bg-white/15 group-focus-visible:bg-[#a053e0] data-[dragging=true]:bg-[#a053e0]"
      />
    </div>
  )
}
