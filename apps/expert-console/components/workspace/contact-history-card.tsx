'use client'

import { CaretDown, ShieldCheck, Wrench } from '@phosphor-icons/react'
import { TAG_TONES, type TagToneName } from '@/lib/tokens'
import type { ContactChannel, ContactHistoryEntry, ContactStatus } from '@/lib/types'

/** Contact status → shared tag tone (colored text + same-hue tint + border, text-only). */
const STATUS_TONE: Record<ContactStatus, TagToneName> = {
  Resolved: 'green',
  Complete: 'teal',
  'Not resolved': 'red',
}

const CHANNEL_ICON: Record<ContactChannel, typeof ShieldCheck> = {
  Claim: ShieldCheck,
  'Tech support': Wrench,
}

/**
 * A single prior-contact card: icon + issue title + status pill collapsed,
 * expanding to reveal the case recap and agent notes. Controlled — the parent
 * owns `isOpen`, so the History tab runs a multi-open accordion. Expansion uses
 * a CSS `grid-template-rows: 0fr → 1fr` transition (no height measuring needed).
 */
export function ContactHistoryCard({
  entry,
  isOpen,
  onToggle,
}: {
  entry: ContactHistoryEntry
  isOpen: boolean
  onToggle: () => void
}) {
  const tone = TAG_TONES[STATUS_TONE[entry.status]]
  const ChannelIcon = CHANNEL_ICON[entry.channel]
  const detailsId = `history-details-${entry.id}`

  return (
    <div
      className="overflow-hidden rounded-[16px] text-left"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={detailsId}
        className="flex w-full cursor-pointer items-start gap-[12px] px-[14px] py-[12px] text-left transition-colors hover:bg-white/[0.02]"
      >
        <span
          className="mt-[2px] flex size-[28px] shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(208, 170, 241, 0.14)' }}
        >
          <ChannelIcon
            className="size-[14px]"
            weight={entry.channel === 'Claim' ? 'fill' : undefined}
            style={{ color: '#d0aaf1' }}
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-[8px]">
            <span
              className="text-[14px] font-medium leading-snug"
              style={{ color: 'var(--ew-text-strong)' }}
            >
              {entry.title}
            </span>
            <span
              className="inline-flex shrink-0 items-center rounded-sm px-[4px] text-[12px]"
              style={{ backgroundColor: tone.bg, color: tone.text }}
            >
              {entry.status}
            </span>
          </span>

          <span
            className="mt-[4px] flex items-center gap-[6px] text-[11px]"
            style={{ color: 'var(--ew-text-faint)' }}
          >
            <span>{entry.channel}</span>
            <span aria-hidden>·</span>
            <span className="tabular-nums">{entry.date}</span>
            <CaretDown
              className="ml-auto size-[12px] transition-transform duration-300 motion-reduce:transition-none"
              weight="bold"
              style={{
                color: 'var(--ew-text-soft)',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </span>
        </span>
      </button>

      {/* Expandable body — grid 0fr→1fr animates height without measuring. */}
      <div
        id={detailsId}
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div
            className="space-y-[12px] px-[14px] pb-[14px] pl-[54px] pt-[14px]"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            <div className="space-y-[4px]">
              <p
                className="text-[10px] font-medium uppercase tracking-wide"
                style={{ color: 'var(--ew-text-faint)' }}
              >
                Summary
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--ew-text-soft)' }}>
                {entry.summary}
              </p>
            </div>

            {entry.notes.length > 0 && (
              <div className="space-y-[6px]">
                <p
                  className="text-[10px] font-medium uppercase tracking-wide"
                  style={{ color: 'var(--ew-text-faint)' }}
                >
                  Notes
                </p>
                <ul className="space-y-[6px]">
                  {entry.notes.map((note, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-[8px] text-[13px] leading-relaxed"
                      style={{ color: 'var(--ew-text-soft)' }}
                    >
                      <span
                        className="mt-[7px] size-[4px] shrink-0 rounded-full"
                        style={{ backgroundColor: '#d0aaf1' }}
                      />
                      <span className="min-w-0 flex-1">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
