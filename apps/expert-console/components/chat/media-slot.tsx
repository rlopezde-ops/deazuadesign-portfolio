'use client'

import type { CSSProperties } from 'react'

/**
 * AUI Media Slot — illustration / device visual block inside a Task body
 * (activation walkthrough, offer card art).
 */
export function MediaSlot({
  src,
  alt,
  className = '',
  style,
}: {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={`media-slot ${className}`.trim()} style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="media-slot-img" />
    </div>
  )
}
