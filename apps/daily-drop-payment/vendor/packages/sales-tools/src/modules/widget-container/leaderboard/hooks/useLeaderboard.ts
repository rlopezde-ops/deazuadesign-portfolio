// PROTOTYPE STAND-IN — not verbatim upstream. See prototype/DEVIATIONS.md.
// Upstream this is a @tanstack/react-query hook fetching the live leaderboard. Here it returns
// fixture rows synchronously and honours the prototype's loading/error/empty state switcher.
'use client'

import type { LeaderboardMetric } from '@expert/app-config/types'
import type { LeaderboardEntry } from '../../../../api/getCurrentLeaderboard'

import { getLeaderboardFixture } from '~/prototype/fixtures/leaderboard'
import { useDataFlags } from '~/prototype/state/usePrototypeState'

export const useLeaderboard = (metric: LeaderboardMetric, _sku?: string) => {
  const { isLoading, isError, isEmpty } = useDataFlags()

  let data: LeaderboardEntry[] | undefined
  if (isLoading || isError) data = undefined
  else if (isEmpty) data = []
  else data = getLeaderboardFixture(metric)

  return { data, isLoading, isError }
}
