'use client'

import { useState } from 'react'
import { Plus, PushPin, X } from '@phosphor-icons/react'
import { useConsoleStore } from '@/store/console-store'

interface NotesPanelProps {
  /**
   * Room to reserve at the top so the first note clears the floating customer
   * card (an absolute overlay shared with the transcript view).
   */
  spacerHeight: number
}

/** Pin accent — the customer/accent purple. */
const PIN_ACCENT = '#d0aaf1'

/**
 * Notes view — the counterpart to the transcript. It surfaces the same pinned
 * snippets shown as chips on the customer card, but as a fuller list, and adds a
 * composer so the expert can jot notes without highlighting the transcript.
 * Backed by the shared `pins` in the store, so a note added here also appears as
 * a pinned chip on the card and vice-versa.
 */
export function NotesPanel({ spacerHeight }: NotesPanelProps) {
  const pins = useConsoleStore((s) => s.pins)
  const pinItem = useConsoleStore((s) => s.pinItem)
  const unpinItem = useConsoleStore((s) => s.unpinItem)
  const [draft, setDraft] = useState('')

  const addNote = () => {
    const text = draft.trim()
    if (!text) return
    pinItem(text)
    setDraft('')
  }

  const hasNotes = pins.length > 0

  return (
    <div className="motion-surface-in flex-1 overflow-y-auto pb-[16px]">
      {/* Clear the floating customer card. */}
      <div aria-hidden style={{ height: spacerHeight }} />

      <div className="space-y-[16px] px-[16px]">
        {/* Composer */}
        <div
          className="flex items-center gap-[8px] rounded-full py-[6px] pl-[12px] pr-[6px] transition-colors focus-within:border-white/20"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addNote()
              }
            }}
            placeholder="Add a note…"
            aria-label="Add a note"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[var(--ew-text-faint)]"
            style={{ color: 'var(--ew-text-strong)' }}
          />
          <button
            type="button"
            onClick={addNote}
            disabled={!draft.trim()}
            className="motion-press shrink-0 cursor-pointer rounded-full p-[6px] disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: '#8223d2' }}
            aria-label="Add note"
          >
            <Plus className="size-[14px]" weight="bold" style={{ color: '#fff' }} />
          </button>
        </div>

        <p
          className="text-[11px] font-medium uppercase tracking-wide"
          style={{ color: 'var(--ew-text-faint)' }}
        >
          Pinned notes
        </p>

        {hasNotes ? (
          <div className="space-y-[8px]">
            {pins.map((item) => (
              <div
                key={item.id}
                className="motion-enter-inline group flex items-start gap-[10px] rounded-[16px] px-[14px] py-[12px]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <PushPin
                  className="mt-[2px] size-[14px] shrink-0"
                  weight="fill"
                  style={{ color: PIN_ACCENT }}
                />
                <span
                  className="min-w-0 flex-1 text-[14px] leading-relaxed"
                  style={{ color: 'var(--ew-text-strong)' }}
                >
                  {item.text}
                </span>
                <button
                  type="button"
                  onClick={() => unpinItem(item.id)}
                  className="shrink-0 cursor-pointer rounded-full p-[4px] opacity-0 transition-opacity hover:bg-white/[0.10] focus-visible:opacity-100 group-hover:opacity-100"
                  aria-label="Delete note"
                >
                  <X className="size-[14px]" weight="bold" style={{ color: 'var(--ew-text-soft)' }} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-[8px] rounded-[16px] px-[24px] py-[40px] text-center"
            style={{ border: '1px dashed rgba(255, 255, 255, 0.10)' }}
          >
            <PushPin className="size-[24px]" weight="fill" style={{ color: 'var(--ew-text-faint)' }} />
            <p className="text-[14px]" style={{ color: 'var(--ew-text-soft)' }}>
              No pinned notes yet
            </p>
            <p className="text-[12px]" style={{ color: 'var(--ew-text-faint)' }}>
              Highlight transcript text to pin it, or add a note above.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
