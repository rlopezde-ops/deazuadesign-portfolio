import type { MetricStatus } from '@/lib/types'
import { STATUS_LABELS, TAG_TONES, type TagToneName } from '@/lib/tokens'

// Pacing status → shared tag tone. Matches Daily Drop `StatusPill` (12px,
// 2×8 padding, 6px radius, text-only) so On track / At risk / Behind read
// identically wherever either chip appears.
const STATUS_TONE: Record<MetricStatus, TagToneName> = {
  'on-track': 'green',
  'at-risk': 'amber',
  behind: 'red',
}

export function StatusBadge({ status }: { status: MetricStatus }) {
  const tone = TAG_TONES[STATUS_TONE[status]]
  return (
    <span
      className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-bold leading-[1.3] whitespace-nowrap"
      style={{ backgroundColor: tone.bg, color: tone.text }}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
