'use client'

import { Tooltip } from '@mantine/core'
import { Info } from '@phosphor-icons/react'
import { SelectionSlot } from './selection-slot'
import { SEND_CHANNEL_COPY } from '@/lib/task-content'

export type SendChannel = 'sms' | 'email'

/**
 * Canonical text-or-email channel picker. Used for verification codes,
 * activation instructions, and Guided Browsing — one label pair, one SOS
 * tooltip, one Selection Slot shape.
 */
export function SendChannelSlot({
  value,
  onChange,
  smsDestination,
  emailDestination,
  showSosHint = true,
  label,
  className = '',
}: {
  value: SendChannel | null
  onChange: (value: SendChannel) => void
  smsDestination: string
  emailDestination: string
  showSosHint?: boolean
  label?: string
  className?: string
}) {
  return (
    <SelectionSlot
      className={className}
      label={label ?? SEND_CHANNEL_COPY.contactLabel}
      value={value}
      onChange={(v) => onChange(v as SendChannel)}
      options={[
        {
          value: 'sms',
          title: (
            <span className="inline-flex items-center gap-1.5">
              {SEND_CHANNEL_COPY.smsLabel}
              {showSosHint ? (
                <Tooltip label={SEND_CHANNEL_COPY.sosTooltip} withArrow multiline w={260}>
                  <span className="inline-flex" aria-label="SMS delivery note">
                    <Info size={14} weight="regular" />
                  </span>
                </Tooltip>
              ) : null}
            </span>
          ),
          subtitle: smsDestination,
        },
        {
          value: 'email',
          title: SEND_CHANNEL_COPY.emailLabel,
          subtitle: emailDestination,
        },
      ]}
    />
  )
}
