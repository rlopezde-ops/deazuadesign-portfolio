'use client'

import type { ReactNode } from 'react'
import { CaretRight } from '@phosphor-icons/react'

export type ActionOption = {
  value: string
  title: ReactNode
  subtitle?: ReactNode
  leading?: ReactNode
}

/**
 * Action cards — the Selection Slot card shape for rows that open an Input
 * Widget instead of committing a choice. A caret replaces the radio, since the
 * sheet that follows is where the expert actually decides.
 */
export function ActionSlot({
  label,
  options,
  onSelect,
  className = '',
}: {
  label?: string
  options: ActionOption[]
  onSelect: (value: string) => void
  className?: string
}) {
  return (
    <div className={`selection-slot ${className}`.trim()}>
      {label ? <p className="selection-slot-label">{label}</p> : null}
      <div className="action-slot-list">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="motion-press action-slot-card"
            onClick={() => onSelect(option.value)}
          >
            {option.leading}
            <span className="action-slot-text">
              <span className="action-slot-title">{option.title}</span>
              {option.subtitle ? (
                <span className="action-slot-subtitle">{option.subtitle}</span>
              ) : null}
            </span>
            <CaretRight size={20} weight="bold" className="action-slot-caret" />
          </button>
        ))}
      </div>
    </div>
  )
}
