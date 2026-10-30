// PROTOTYPE STAND-IN — not verbatim upstream. See prototype/DEVIATIONS.md.
// Upstream this provides ky API clients, partner config, and feature flags through React context.
// The prototype has no API clients, so only `employeeId` (used to highlight "You" in the
// leaderboard) is provided.
'use client'

import { PROTOTYPE_EMPLOYEE_ID } from '~/prototype/fixtures/leaderboard'

export interface SalesContextValue {
  employeeId: string
}

export function useSalesContext(): SalesContextValue {
  return { employeeId: PROTOTYPE_EMPLOYEE_ID }
}
