/**
 * Stands in for `@expert/app-config/types`. Only the leaderboard types are reachable from the
 * vendored Expert Hub tree; these declarations are copied from
 * expert-workspace/packages/app-config/types.ts so the vendored components typecheck unchanged.
 */
export const leaderboardMetrics = Object.freeze(['calls', 'sales'] as const)
export type LeaderboardMetric = (typeof leaderboardMetrics)[number]

export function isLeaderboardMetric(value: unknown): value is LeaderboardMetric {
  return (leaderboardMetrics as readonly unknown[]).includes(value)
}

export interface LeaderboardConfig {
  controlText: string
  description: string
  metric: LeaderboardMetric
  reminder: string
  sku?: string
}
