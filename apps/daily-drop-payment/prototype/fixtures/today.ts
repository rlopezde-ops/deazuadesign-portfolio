import type { TonePreset } from '../state/usePrototypeState'

/** Mirrors `TodaySalesResponse` in packages/sales-tools/src/api/getTodaySales.ts */
export interface TodaySalesFixture {
  salesCount: number
}

/** Mirrors the response of packages/sales-tools/src/api/getTotalCallCount.ts */
export interface TotalCallCountFixture {
  callCount: number
}

/** Mirrors `PacingMetricsResponse` in packages/sales-tools/src/api/getPacingMetrics.ts */
export interface PacingFixture {
  totalSessions: number
  onTargetCount: number
  onTargetRate: number
  avgOverageSeconds: number
}

/**
 * Today-tab fixtures. The pace card compares `onTargetRate` against PACE_TARGET_PERCENT (80), so
 * these rates land deliberately either side of the 100% / 75% tier boundaries in targetProgress.ts.
 */
const BY_TONE: Record<TonePreset, { sales: TodaySalesFixture; calls: TotalCallCountFixture; pacing: PacingFixture }> = {
  // 0.86 -> 86% of an 80% target = 108% progress -> On track.
  'on-track': {
    sales: { salesCount: 4 },
    calls: { callCount: 31 },
    pacing: { totalSessions: 31, onTargetCount: 27, onTargetRate: 0.86, avgOverageSeconds: 42 },
  },
  // 0.68 -> 68% of 80 = 85% progress -> At risk.
  'at-risk': {
    sales: { salesCount: 2 },
    calls: { callCount: 24 },
    pacing: { totalSessions: 24, onTargetCount: 16, onTargetRate: 0.68, avgOverageSeconds: 138 },
  },
  // 0.41 -> 41% of 80 = 51% progress -> Off track.
  behind: {
    sales: { salesCount: 0 },
    calls: { callCount: 12 },
    pacing: { totalSessions: 12, onTargetCount: 5, onTargetRate: 0.41, avgOverageSeconds: 297 },
  },
}

export const getTodaySalesFixture = (tone: TonePreset) => BY_TONE[tone].sales
export const getTotalCallCountFixture = (tone: TonePreset) => BY_TONE[tone].calls
export const getPacingFixture = (tone: TonePreset) => BY_TONE[tone].pacing

/** "Empty" state for the pace card: data arrived, but no sessions yet -> "No calls today". */
export const getEmptyPacingFixture = (): PacingFixture => ({
  totalSessions: 0,
  onTargetCount: 0,
  onTargetRate: 0,
  avgOverageSeconds: 0,
})
