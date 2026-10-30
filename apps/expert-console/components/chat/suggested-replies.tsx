'use client'

import type { ReactNode } from 'react'

/**
 * AUI suggested-reply chips — outlined pills that constrain a response without
 * blocking free text. Used above the Assist composer and inside guidance when
 * a quick path is offered.
 */
export function SuggestedReplies({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`suggested-replies ${className}`.trim()}>{children}</div>
}

export function SuggestedReply({
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
      className={`motion-press suggested-reply ${className}`.trim()}
    >
      {children}
    </button>
  )
}
