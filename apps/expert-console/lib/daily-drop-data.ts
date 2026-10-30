import { ACCESSORY_BY_ID, type PlacedAccessory } from './avatar-items'
import type { MetricStatus } from './types'

export type SupportingStat = {
  label: string
  value: string
}

export type MetricId = 'erp' | 'transfer-rate' | 'net-sales'

export type MetricCategory = 'Serve' | 'Solve' | 'Sell'

export type Metric = {
  id: MetricId
  level: 'Customer experience' | 'Call efficiency' | 'Sales'
  category: MetricCategory
  name: string
  description: string
  value: string
  unit?: string
  target: string
  status?: MetricStatus
  supportingStats: SupportingStat[]
  payValue: number
}

/**
 * Cake illustration per metric, cropped off the card's bottom-right corner. Keyed by metric id so
 * both days share one mapping.
 */
export const METRIC_ILLUSTRATIONS: Record<
  MetricId,
  { src: string; variant: 'love' | 'quality' | 'sales'; lottieSrc?: string }
> = {
  // `lottieSrc`, when set, is a Lottie played once on card hover (resting on frame 1 otherwise);
  // `src` stays as the static fallback while it loads. Fetched from /public, not bundled.
  erp: { src: '/cakes/love.png', variant: 'love', lottieSrc: '/lottie/heart.json' },
  'transfer-rate': { src: '/cakes/quality.png', variant: 'quality', lottieSrc: '/lottie/retro-phone.json' },
  'net-sales': { src: '/cakes/sales.png', variant: 'sales', lottieSrc: '/lottie/wallet.json' },
}

export type DayKey = 'yesterday' | 'today'

export const lastUpdated: Record<DayKey, string> = {
  yesterday: 'Last updated yesterday 11:30am',
  today: 'Last updated today 11:30am',
}

export const metricsByDay: Record<DayKey, Metric[]> = {
  yesterday: [
    {
      id: 'erp',
      level: 'Customer experience',
      category: 'Serve',
      name: 'ERP',
      description: 'Effective resolution performance across your calls',
      value: '92.3',
      unit: '%',
      target: 'Target: 95% or higher',
      status: 'at-risk',
      payValue: 92.3,
      supportingStats: [
        { label: 'CSAT', value: '4.2 / 5' },
        { label: 'First contact resolution', value: '78%' },
        { label: 'Repeat contact rate', value: '11%' },
      ],
    },
    {
      id: 'transfer-rate',
      level: 'Call efficiency',
      category: 'Solve',
      name: 'Transfer rate',
      description: 'Share of calls transferred out',
      value: '4',
      unit: '%',
      target: 'Target: 12% or lower',
      status: 'on-track',
      payValue: 4,
      supportingStats: [
        { label: 'Resolution rate', value: '84%' },
        { label: 'Call resolution time', value: '1350s' },
      ],
    },
    {
      id: 'net-sales',
      level: 'Sales',
      category: 'Sell',
      name: 'Net sales',
      description: 'Completed sales after returns and cancellations',
      value: '2',
      target: 'Target: 10 sales',
      status: 'behind',
      payValue: 2,
      supportingStats: [
        { label: 'Attach rate', value: '9%' },
        { label: 'Offers presented', value: '18' },
        { label: 'Cancels', value: '0' },
      ],
    },
  ],
  today: [
    {
      id: 'erp',
      level: 'Customer experience',
      category: 'Serve',
      name: 'ERP',
      description: 'Effective resolution performance across your calls',
      value: '95.8',
      unit: '%',
      target: 'Target: 95% or higher',
      status: 'on-track',
      payValue: 95.8,
      supportingStats: [
        { label: 'CSAT', value: '4.6 / 5' },
        { label: 'First contact resolution', value: '83%' },
        { label: 'Repeat contact rate', value: '8%' },
      ],
    },
    {
      id: 'transfer-rate',
      level: 'Call efficiency',
      category: 'Solve',
      name: 'Transfer rate',
      description: 'Share of calls transferred out',
      value: '9',
      unit: '%',
      target: 'Target: 12% or lower',
      status: 'on-track',
      payValue: 9,
      supportingStats: [
        { label: 'Resolution rate', value: '81%' },
        { label: 'Call resolution time', value: '1180s' },
      ],
    },
    {
      id: 'net-sales',
      level: 'Sales',
      category: 'Sell',
      name: 'Net sales',
      description: 'Completed sales after returns and cancellations',
      value: '6',
      target: 'Target: 10 sales',
      status: 'at-risk',
      payValue: 6,
      supportingStats: [
        { label: 'Attach rate', value: '14%' },
        { label: 'Offers presented', value: '31' },
        { label: 'Cancels', value: '0' },
      ],
    },
  ],
}

/** Prose forms of the metric names for mid-sentence use (ERP stays an acronym). */
export const METRIC_PROSE: Record<MetricId, string> = {
  erp: 'ERP',
  'transfer-rate': 'transfer rate',
  'net-sales': 'net sales',
}

/** Emoji prefix per metric, shown inline in the Venmo-feed greeting. */
export const METRIC_EMOJI: Record<MetricId, string> = {
  erp: '⭐',
  'transfer-rate': '📲',
  'net-sales': '🛍️',
}

/** "a", "a and b", "a, b, and c". */
function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

/**
 * One- or two-sentence read on the day's numbers for the morning-paper greeting:
 * lead with what's on target, then name what to focus on. Derived from the same
 * metric statuses shown on the cards below, so the sentence always matches the
 * data — including when the expert toggles Yesterday/Today.
 */
export function performanceSummary(metrics: Metric[]): string {
  const wins = metrics.filter((m) => m.status === 'on-track').map((m) => METRIC_PROSE[m.id])
  // Below-target metrics, worst first: 'behind' before 'at-risk'.
  const focus = metrics
    .filter((m) => m.status === 'behind' || m.status === 'at-risk')
    .sort((a, b) => (a.status === 'behind' ? 0 : 1) - (b.status === 'behind' ? 0 : 1))
    .map((m) => METRIC_PROSE[m.id])

  if (focus.length === 0) {
    return "You're hitting target across the board — a strong day all around."
  }
  const focusVerb = focus.length > 1 ? 'are' : 'is'
  if (wins.length === 0) {
    return `${capitalize(joinNames(focus))} ${focusVerb} below target — let's make them today's focus.`
  }
  const winsVerb = wins.length > 1 ? 'are' : 'is'
  return `${capitalize(joinNames(wins))} ${winsVerb} on track. ${capitalize(joinNames(focus))} ${focusVerb} where to focus today.`
}

export type ScheduleItem = {
  time: string
  duration: string
  title: string
  range: string
  kind: 'meeting' | 'break' | 'training' | 'lunch'
}

export const schedule: ScheduleItem[] = [
  { time: '10:00', duration: '20m', title: 'Meeting', range: '10:00–10:20 am', kind: 'meeting' },
  { time: '11:30', duration: '15m', title: 'Break', range: '11:30–11:45 am', kind: 'break' },
  { time: '12:30', duration: '20m', title: 'Training', range: '12:30–12:50 pm', kind: 'training' },
  { time: '2:30', duration: '30m', title: 'Lunch', range: '2:30–3:00 pm', kind: 'lunch' },
  { time: '4:00', duration: '15m', title: 'Break', range: '4:00–4:15 pm', kind: 'break' },
]

export type LeaderboardMetric = 'sales' | 'calls'

export type LeaderboardRow = {
  id: string
  /** Full name; the standings list abbreviates it to "First L.". */
  name: string
  score: number
  /** Public path to a face-safe square crop shown as a circular avatar. */
  photo: string
  /**
   * Places moved since the last refresh. Positive = climbed, negative = dropped,
   * 0 = held. Shown as a small momentum cue next to the score.
   */
  delta: number
  /** Crown + "Last week's leader" badge — one per board. */
  lastWeekWinner?: boolean
  /**
   * Accessories placed on this expert's leaderboard avatar (display flair). The
   * signed-in expert's row ("You") ignores this and mirrors their live avatar
   * from the store instead — this is only for the other, static experts.
   */
  accessories?: PlacedAccessory[]
}

export type LeaderboardConfig = {
  metric: LeaderboardMetric
  controlText: string
  /**
   * What the score counts, sentence-cased for the dashboard strip's subhead
   * ("Net enrollments · Sep 5–11"). Naming the unit once in the header is what
   * lets the cards themselves carry a bare number.
   */
  boardLabel: string
  /** `$METRICS_DATE_RANGE` is substituted with the current Saturday–Friday window. */
  description: string
  reminder: string
}

/** The signed-in expert. Their row renders as "You" and gets the highlight treatment. */
export const YOU_ID = 'e-1007'

export const leaderboardConfigs: LeaderboardConfig[] = [
  {
    metric: 'sales',
    controlText: 'Sales',
    boardLabel: 'Net enrollments',
    description: 'Net enrollments for $METRICS_DATE_RANGE.',
    reminder: 'Standings refresh as calls close.',
  },
  {
    metric: 'calls',
    controlText: 'Calls',
    boardLabel: 'Calls handled',
    description: 'Total calls handled for $METRICS_DATE_RANGE.',
    reminder: 'Standings refresh as calls close.',
  },
]

/** Ordered best-to-worst; rank is the array index + 1. */
export const leaderboards: Record<LeaderboardMetric, LeaderboardRow[]> = {
  sales: [
    {
      id: 'e-1001',
      name: 'Priya Natarajan',
      score: 42,
      photo: '/experts/priya.jpg',
      delta: 1,
      lastWeekWinner: true,
    },
    { id: 'e-1002', name: 'Marcus Tolliver', score: 38, photo: '/experts/marcus.jpg', delta: -1 },
    { id: YOU_ID, name: 'Roberto Morales', score: 34, photo: '/experts/jason.jpg', delta: 2 },
    { id: 'e-1003', name: 'Elena Vasquez', score: 31, photo: '/experts/elena.jpg', delta: 0 },
    { id: 'e-1004', name: 'Sam Okonkwo', score: 29, photo: '/experts/sam.jpg', delta: 1 },
    { id: 'e-1005', name: 'Dana Whitfield', score: 26, photo: '/experts/dana.jpg', delta: -2 },
    { id: 'e-1006', name: 'Tomas Lindqvist', score: 22, photo: '/experts/tomas.jpg', delta: 0 },
    { id: 'e-1008', name: 'Raul Mendoza', score: 19, photo: '/experts/raul.jpg', delta: 3 },
    { id: 'e-1009', name: 'Grant Yoshida', score: 15, photo: '/experts/grant.jpg', delta: -1 },
  ],
  calls: [
    {
      id: 'e-1004',
      name: 'Sam Okonkwo',
      score: 214,
      photo: '/experts/sam.jpg',
      delta: 0,
      lastWeekWinner: true,
    },
    { id: YOU_ID, name: 'Roberto Morales', score: 198, photo: '/experts/jason.jpg', delta: 1 },
    { id: 'e-1001', name: 'Priya Natarajan', score: 191, photo: '/experts/priya.jpg', delta: -1 },
    { id: 'e-1006', name: 'Tomas Lindqvist', score: 187, photo: '/experts/tomas.jpg', delta: 2 },
    { id: 'e-1002', name: 'Marcus Tolliver', score: 176, photo: '/experts/marcus.jpg', delta: -2 },
    { id: 'e-1003', name: 'Elena Vasquez', score: 168, photo: '/experts/elena.jpg', delta: 0 },
    { id: 'e-1005', name: 'Dana Whitfield', score: 155, photo: '/experts/dana.jpg', delta: 1 },
    { id: 'e-1008', name: 'Raul Mendoza', score: 142, photo: '/experts/raul.jpg', delta: -1 },
    { id: 'e-1009', name: 'Grant Yoshida', score: 131, photo: '/experts/grant.jpg', delta: 0 },
  ],
}

/**
 * What the back of an expert's leaderboard card shows. Keyed by expert id and
 * shared across both boards, because all three facts are about the person rather
 * than the metric:
 *
 * - `spotsChange` is the move since the last pay period — a longer horizon than
 *   `delta`, which is places moved since the last refresh.
 * - `trend` is eight twice-weekly samples over the past month, oldest first. The
 *   sparkline normalises them and draws no axis, so it reads as shape and
 *   direction only.
 * - `quote` is one real-sounding customer verbatim, attributed the way customers
 *   are named elsewhere in the console (first name, last initial). The name leads
 *   the testimonial card, so `author` is its headline rather than a sign-off.
 */
export type ExpertDetail = {
  spotsChange: number
  trend: number[]
  quote: string
  author: string
}

/**
 * The product every testimonial came in on, shown under the customer's name. One
 * plan across the demo rather than a per-expert field: it's the protection plan
 * the whole morning paper is selling.
 */
export const TESTIMONIAL_PLAN = 'Verizon Home Device Protect'

export const expertDetails: Record<string, ExpertDetail> = {
  'e-1001': {
    spotsChange: 1,
    trend: [34, 36, 35, 39, 38, 41, 40, 42],
    quote: 'Priya stayed on the line until my new phone was actually working. No hand-offs.',
    author: 'Denise K.',
  },
  'e-1002': {
    spotsChange: -1,
    trend: [41, 40, 42, 39, 40, 38, 39, 38],
    quote: 'Marcus found the protection plan I already had and saved me the deductible.',
    author: 'Theo A.',
  },
  [YOU_ID]: {
    spotsChange: 3,
    trend: [22, 25, 24, 27, 29, 28, 32, 34],
    quote: 'Roberto helped me solve my Samsung issue fast so I could get back to my kids.',
    author: 'Rachel S.',
  },
  'e-1003': {
    spotsChange: 0,
    trend: [30, 31, 29, 32, 30, 31, 30, 31],
    quote: 'Elena explained the claim twice without making me feel slow. That mattered.',
    author: 'Miriam L.',
  },
  'e-1004': {
    spotsChange: 2,
    trend: [21, 23, 22, 25, 26, 25, 28, 29],
    quote: 'Sam had my replacement ordered before I finished my coffee.',
    author: 'Curtis B.',
  },
  'e-1005': {
    spotsChange: -2,
    trend: [33, 31, 32, 29, 30, 28, 27, 26],
    quote: 'Dana called me back exactly when she said she would.',
    author: 'Yolanda P.',
  },
  'e-1006': {
    spotsChange: 1,
    trend: [18, 19, 21, 20, 22, 21, 23, 22],
    quote: "Tomas backed up my laptop before the repair. I'd have lost every photo.",
    author: 'Ben O.',
  },
  'e-1008': {
    spotsChange: 4,
    trend: [9, 11, 13, 12, 15, 16, 18, 19],
    quote: 'Raul set up my new tablet over the phone with my mom on the call too.',
    author: 'Ana V.',
  },
  'e-1009': {
    spotsChange: -1,
    trend: [19, 18, 17, 18, 16, 17, 15, 15],
    quote: "Grant didn't rush me. He checked the coverage on all three of our lines.",
    author: 'Pete R.',
  },
}

/** Build display-only placed accessories from catalog ids at their default placement. */
function preset(...ids: string[]): PlacedAccessory[] {
  return ids.flatMap((defId, i) => {
    const d = ACCESSORY_BY_ID[defId]
    return d ? [{ key: `preset-${defId}-${i}`, defId, ...d.place }] : []
  })
}

/**
 * A little flair on a handful of experts' leaderboard avatars so "You" isn't the
 * only decorated face. Keyed by expert id and shared across both boards; winners
 * (who already carry the crown badge) get non-hat pieces so the corner stays clear.
 */
const EXPERT_ACCESSORIES: Record<string, PlacedAccessory[]> = {
  'e-1001': preset('sunglasses'), // Priya — sales leader
  'e-1002': preset('fedora'), // Marcus
  'e-1004': preset('headphones'), // Sam — calls leader
  'e-1005': preset('cat-ears'), // Dana
  'e-1008': preset('cap', 'fire'), // Raul — climbing fast
}

for (const board of Object.values(leaderboards)) {
  for (const row of board) {
    if (EXPERT_ACCESSORIES[row.id]) row.accessories = EXPERT_ACCESSORIES[row.id]
  }
}

/**
 * The leaderboard window runs Saturday through Friday, so "Sep 5–11" on a Thursday. Mirrors
 * `getLeaderboardTimeframe` + `getMetricsDateRange` upstream without pulling in dayjs.
 */
export function getMetricsDateRange(now: Date = new Date()): string {
  const dayOfWeek = now.getDay()
  const start = new Date(now)
  start.setDate(now.getDate() - dayOfWeek - 1)
  const end = new Date(now)
  end.setDate(now.getDate() + (5 - dayOfWeek))

  const month = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' })
  if (month(start) === month(end)) {
    return `${month(start)} ${start.getDate()}–${end.getDate()}`
  }
  return `${month(start)} ${start.getDate()}–${month(end)} ${end.getDate()}`
}

/**
 * Dates for the `trend` samples, oldest first and ending today — "Aug 27" style,
 * spread evenly across the past four weeks. Derived rather than stored for the
 * same reason as `getMetricsDateRange`: a fixture would go stale and the chart's
 * axis would start claiming the wrong month.
 */
export function getTrendDates(count: number, now: Date = new Date()): string[] {
  const stepDays = 28 / Math.max(1, count - 1)
  return Array.from({ length: count }, (_, i) => {
    const day = new Date(now)
    day.setDate(now.getDate() - Math.round((count - 1 - i) * stepDays))
    return day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })
}

/** "First L." — matches the upstream leaderboard's name abbreviation. */
export function abbreviateName(name: string): string {
  const [first, last] = name.split(' ')
  return last ? `${first} ${last.charAt(0)}.` : first
}
