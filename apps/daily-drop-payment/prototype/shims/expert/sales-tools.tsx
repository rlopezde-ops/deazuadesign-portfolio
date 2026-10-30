'use client'

/**
 * Stands in for the `@expert/sales-tools` package barrel.
 *
 * The leaderboard UI is re-exported from the real vendored components (they are byte-identical to
 * upstream); only the hooks that would hit the gamification API are replaced with fixture-backed
 * equivalents that keep the upstream return shapes:
 *
 *   useTodaySales()         -> { data: { salesCount }, isLoading, isError }
 *   useTotalCallCount()     -> { data: { callCount }, isLoading, isError }
 *   useTodayPacingMetrics() -> { data: PacingMetricsResponse, isLoading, isError }
 *   useIsPacingActive()     -> boolean
 *   useLeaderboardStanding()-> { rank, total, isLoading }   (vendored verbatim)
 *
 * `ChecklistSummary` is a static placeholder — see prototype/DEVIATIONS.md.
 */
import { Stack, Text } from '@mantine/core'

import {
  getPacingFixture,
  getEmptyPacingFixture,
  getTodaySalesFixture,
  getTotalCallCountFixture,
} from '../../fixtures/today'
import { usePrototypeState, useDataFlags } from '../../state/usePrototypeState'

export { LeaderboardWidget } from '~/vendor/packages/sales-tools/src/modules/widget-container/leaderboard/components/LeaderboardWidget'
export { useLeaderboardStanding } from '~/vendor/packages/sales-tools/src/modules/widget-container/leaderboard/hooks/useLeaderboardStanding'
export type { LeaderboardStanding } from '~/vendor/packages/sales-tools/src/modules/widget-container/leaderboard/hooks/useLeaderboardStanding'

/** Copied from packages/sales-tools/src/api/getPerformanceMetrics.ts. */
export interface TechSupportMetrics {
  totalCalls?: number
  callResolutionTime?: number
  oneCallResolution?: number
  resolutionRate?: number
  transferRate?: number
  perfectSurveys?: number
  fiveStarRating?: number
  entireRepPerformance?: number
  salesPer100?: number
  cancellationRate?: number
  netEnrolls?: number
  totalCallsLastUpdated?: string
}

export const useTodaySales = () => {
  const tone = usePrototypeState((s) => s.tone)
  const { isLoading, isError, isEmpty } = useDataFlags()
  if (isLoading || isError) return { data: undefined, isLoading, isError }
  return {
    data: isEmpty ? { salesCount: 0 } : getTodaySalesFixture(tone),
    isLoading,
    isError,
  }
}

export const useTotalCallCount = () => {
  const tone = usePrototypeState((s) => s.tone)
  const { isLoading, isError, isEmpty } = useDataFlags()
  if (isLoading || isError) return { data: undefined, isLoading, isError }
  return {
    data: isEmpty ? { callCount: 0 } : getTotalCallCountFixture(tone),
    isLoading,
    isError,
  }
}

export const useTodayPacingMetrics = () => {
  const tone = usePrototypeState((s) => s.tone)
  const { isLoading, isError, isEmpty } = useDataFlags()
  if (isLoading || isError) return { data: undefined, isLoading, isError }
  return {
    data: isEmpty ? getEmptyPacingFixture() : getPacingFixture(tone),
    isLoading,
    isError,
  }
}

/** Upstream: features.isPacingEnabled && partnerConfig.pacingTargets?.enabled. Pinned on here. */
export const useIsPacingActive = (): boolean => true

/**
 * Static stand-in for the real `ChecklistSummary`, which lives inside a ~4,000-line
 * product-sale-flow module. Renders the panel's chrome only.
 */
export function ChecklistSummary() {
  return (
    <Stack flex={1} align="center" justify="center" p="xl" gap="xs">
      <Text fw={600}>Sales checklist</Text>
      <Text c="dimmed" ta="center" maw={360} size="sm">
        The sales checklist is not wired up in this prototype.
      </Text>
    </Stack>
  )
}
