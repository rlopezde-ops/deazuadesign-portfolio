import type { MetricStatus } from '@/lib/types'
import { STATUS_LABELS } from '@/lib/tokens'
import classes from './daily-drop.module.css'

/*
 * Daily Drop's status pill. Shares the app-wide tag treatment (colored text +
 * same-hue tint + thin same-hue border, text-only) so On track / At risk /
 * Behind read identically here and on the Pit Stop `StatusBadge`. Tone colors
 * live in daily-drop.module.css and mirror TAG_TONES (green / amber / red).
 */
const TONE: Record<MetricStatus, string> = {
  'on-track': classes.tonePositive,
  'at-risk': classes.toneWarning,
  behind: classes.toneNegative,
}

export function StatusPill({ status }: { status: MetricStatus }) {
  return (
    <span className={`${classes.statusBadge} ${TONE[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
