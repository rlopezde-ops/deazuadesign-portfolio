'use client'

import { useState } from 'react'
import { CONTACT_HISTORY } from '@/lib/fixtures'
import { ContactHistoryCard } from './contact-history-card'

interface HistoryPanelProps {
  /**
   * Room to reserve at the top so the first card clears the floating customer
   * card (an absolute overlay shared with the transcript view).
   */
  spacerHeight: number
}

/**
 * History view — a reverse-chronological list of the customer's prior contacts
 * (claims and tech-support issues). Each entry collapses to a date, issue title,
 * and status, and expands to reveal the case recap plus agent notes. Multi-open
 * accordion — several entries can be expanded at once.
 */
export function HistoryPanel({ spacerHeight }: HistoryPanelProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="motion-surface-in flex-1 overflow-y-auto pb-[16px]">
      {/* Clear the floating customer card. */}
      <div aria-hidden style={{ height: spacerHeight }} />

      <div className="space-y-[12px] px-[16px]">
        <p
          className="text-[11px] font-medium uppercase tracking-wide"
          style={{ color: 'var(--ew-text-faint)' }}
        >
          Previous contacts
        </p>

        <div className="space-y-[8px]">
          {CONTACT_HISTORY.map((entry) => (
            <ContactHistoryCard
              key={entry.id}
              entry={entry}
              isOpen={openIds.has(entry.id)}
              onToggle={() => toggle(entry.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
