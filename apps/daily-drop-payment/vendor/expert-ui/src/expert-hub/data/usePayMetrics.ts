// PROTOTYPE STAND-IN — not verbatim upstream. See prototype/DEVIATIONS.md.
// Upstream this is a @tanstack/react-query hook against /api/gamification/v1/pay-metrics, merged
// with dev mocks when !env.isProdMode. Here it returns fixtures synchronously. The exported types
// and the `usePayMetrics()` signature are unchanged, so every consuming card is untouched.
'use client'

import type { PayMetrics } from './types'

import { getEmptyPayMetrics, getPayMetricsFixture } from '~/prototype/fixtures/payMetrics'
import { usePrototypeState, useDataFlags } from '~/prototype/state/usePrototypeState'

export interface PayMetricsResult {
  payMetrics: PayMetrics | null
  isLoading: boolean
  isError: boolean
}

export function usePayMetrics(): PayMetricsResult {
  const tone = usePrototypeState((s) => s.tone)
  const { isLoading, isError, isEmpty } = useDataFlags()

  let payMetrics: PayMetrics | null = null
  if (isLoading || isError) payMetrics = null
  else if (isEmpty) payMetrics = getEmptyPayMetrics()
  else payMetrics = getPayMetricsFixture(tone)

  return { payMetrics, isLoading, isError }
}
