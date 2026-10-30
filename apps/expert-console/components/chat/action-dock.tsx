'use client'

import type { ReactNode } from 'react'

/**
 * AUI Action Dock — primary + secondary button row at the foot of a Task or
 * Input Widget. Task.Footer delegates here so guidance and overlays share one
 * commit pattern.
 */
export function ActionDock({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`action-dock ${className}`.trim()}>{children}</div>
}

export function ActionDockPrimary({
  children,
  onClick,
  disabled = false,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`motion-press action-dock-primary ${className}`.trim()}
    >
      {children}
    </button>
  )
}

export function ActionDockSecondary({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`motion-press action-dock-secondary ${className}`.trim()}
    >
      {children}
    </button>
  )
}
