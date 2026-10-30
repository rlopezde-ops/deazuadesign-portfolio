import type { MetricStatus, PacingPhase } from './types'

export const palette = {
  dark0: '#E8E6ED',
  dark1: '#D7D5DB',
  dark2: '#A7A4AE',
  dark3: '#716E78',
  dark4: '#3A3642',
  dark5: '#2A2630',
  dark6: '#221F28',
  dark7: '#1C1A21',
  dark8: '#16141B',
  page: '#0F0D12',
  brandBlack: '#0D0B10',
  accentGreen: '#6EFAC3',
  primary0: '#F7EDFF',
  primary2: '#D0AAF1',
  primary4: '#A053E0',
  primary5: '#933ADC',
  primary7: '#7820C3',
  brandCta: '#8223d2',
  success: '#12B886',
  warn: '#F59E0B',
  error: '#FA5252',
} as const

export const STATUS_LABELS: Record<MetricStatus, string> = {
  'on-track': 'On track',
  'at-risk': 'At risk',
  behind: 'Behind',
}

/**
 * The shared tag treatment: colored text on a solid, opaque same-hue dark fill
 * with moderate rounding (see `rounded-md` / 6px on consumers) and no border.
 * The fills are fully opaque (not alpha tints) so a chip reads the same over the
 * dark page AND over the daily-drop metric illustrations — a low-alpha tint only
 * looks solid on a dark ground and goes see-through over the cake/shield art.
 * One vocabulary for every status chip in the app — contact-history statuses,
 * the pit-stop `StatusBadge`, and the daily-drop `StatusPill` all map onto these
 * tones so a given status reads identically wherever it appears. Text-only by
 * design: no dots, no icons. Amber has no reference swatch but wears the same
 * treatment for the `at-risk` pacing state.
 */
export type TagToneName = 'green' | 'teal' | 'amber' | 'red' | 'neutral'

export const TAG_TONES: Record<TagToneName, { bg: string; text: string }> = {
  green: { bg: '#253b35', text: '#7fe3a3' },
  teal: { bg: '#1e3944', text: '#63d2de' },
  amber: { bg: '#413828', text: '#f0cf6b' },
  red: { bg: '#422932', text: '#f7a3a3' },
  neutral: { bg: '#2e2c37', text: '#c2bfca' },
}

export const PACING_TARGET_SECONDS = 25 * 60

export const PACING_SKIP_SECONDS = 180

export const PIT_STOP_SECONDS = 30

export const PACING_PHASE_STYLES: Record<
  PacingPhase,
  {
    track: string
    border: string
    label: string
    timeBg: string
    timeText: string
    glow: string
    tagBg: string
    tagText: string
    status: MetricStatus
  }
> = {
  // Exact Glow Bar (call pacing v1.5) phase palette from
  // visual-call-pacing-v1-5 /glow-bar. Status labels stay On track / At risk /
  // Behind so Daily Drop and Pit Stop share one vocabulary.
  green: {
    track: '#0d3b28',
    border: '#3ddc97',
    label: '#3ddc97',
    timeBg: '#1d6b4c',
    timeText: '#eafff5',
    glow: 'none',
    tagBg: '#123a2a',
    tagText: '#5fd6a0',
    status: 'on-track',
  },
  yellow: {
    track: '#4a3d0e',
    border: '#e9c548',
    label: '#e9c548',
    timeBg: '#6f5b12',
    timeText: '#fff8e6',
    glow: 'none',
    tagBg: '#493810',
    tagText: '#e9c548',
    status: 'at-risk',
  },
  red: {
    track: '#3a1010',
    border: '#ef5350',
    label: '#ff8a8a',
    timeBg: '#c0392b',
    timeText: '#ffecec',
    glow: '0 0 22px rgba(239, 83, 80, 0.65)',
    tagBg: '#3a1212',
    tagText: '#ff8a8a',
    status: 'behind',
  },
}

export function secondsToPacingPhase(secondsRemaining: number): PacingPhase {
  if (secondsRemaining <= 0) return 'red'
  if (secondsRemaining <= 600) return 'yellow'
  return 'green'
}

export function formatClock(seconds: number): string {
  const negative = seconds < 0
  const abs = Math.abs(seconds)
  const m = Math.floor(abs / 60)
  const s = abs % 60
  return `${negative ? '-' : ''}${m}:${s.toString().padStart(2, '0')}`
}
