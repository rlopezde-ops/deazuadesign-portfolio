import type { LeaderboardConfig } from '@expert/app-config/types'
import type { LeaderboardEntry } from '~/vendor/packages/sales-tools/src/api/getCurrentLeaderboard'

/** The signed-in expert in this prototype. Matches `useSalesContext().employeeId`. */
export const PROTOTYPE_EMPLOYEE_ID = 'e-1007'

/**
 * Partner leaderboard configuration, shaped like `LeaderboardConfig` in
 * packages/app-config/types.ts. `$METRICS_DATE_RANGE` is substituted by LeaderboardWidget.
 */
export const LEADERBOARD_CONFIGS: LeaderboardConfig[] = [
  {
    metric: 'sales',
    controlText: 'Sales',
    description: 'Net enrollments for $METRICS_DATE_RANGE.',
    reminder: 'Standings refresh as calls close.',
  },
  {
    metric: 'calls',
    controlText: 'Calls',
    description: 'Total calls handled for $METRICS_DATE_RANGE.',
    reminder: 'Standings refresh as calls close.',
  },
]

const SALES_BOARD: LeaderboardEntry[] = [
  { employeeId: 'e-1001', employeeName: 'Priya Natarajan', score: 42, order: 0 },
  { employeeId: 'e-1002', employeeName: 'Marcus Tolliver', score: 38, order: 1 },
  { employeeId: PROTOTYPE_EMPLOYEE_ID, employeeName: 'Ricardo de Azua', score: 34, order: 2 },
  { employeeId: 'e-1003', employeeName: 'Elena Vasquez', score: 31, order: 3 },
  { employeeId: 'e-1004', employeeName: 'Sam Okonkwo', score: 29, order: 4 },
  { employeeId: 'e-1005', employeeName: 'Dana Whitfield', score: 26, order: 5 },
  { employeeId: 'e-1006', employeeName: 'Tomas Lindqvist', score: 22, order: 6 },
  { employeeId: 'e-1008', employeeName: 'Aisha Bello', score: 19, order: 7 },
  { employeeId: 'e-1009', employeeName: 'Grant Yoshida', score: 15, order: 8 },
]

const CALLS_BOARD: LeaderboardEntry[] = [
  { employeeId: 'e-1004', employeeName: 'Sam Okonkwo', score: 214, order: 0 },
  { employeeId: PROTOTYPE_EMPLOYEE_ID, employeeName: 'Ricardo de Azua', score: 198, order: 1 },
  { employeeId: 'e-1001', employeeName: 'Priya Natarajan', score: 191, order: 2 },
  { employeeId: 'e-1006', employeeName: 'Tomas Lindqvist', score: 187, order: 3 },
  { employeeId: 'e-1002', employeeName: 'Marcus Tolliver', score: 176, order: 4 },
  { employeeId: 'e-1003', employeeName: 'Elena Vasquez', score: 168, order: 5 },
  { employeeId: 'e-1005', employeeName: 'Dana Whitfield', score: 155, order: 6 },
  { employeeId: 'e-1008', employeeName: 'Aisha Bello', score: 142, order: 7 },
  { employeeId: 'e-1009', employeeName: 'Grant Yoshida', score: 131, order: 8 },
]

export function getLeaderboardFixture(metric: string): LeaderboardEntry[] {
  return metric === 'calls' ? CALLS_BOARD : SALES_BOARD
}
