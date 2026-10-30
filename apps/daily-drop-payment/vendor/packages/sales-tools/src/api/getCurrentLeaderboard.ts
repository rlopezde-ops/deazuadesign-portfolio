// PROTOTYPE STAND-IN — not verbatim upstream. See prototype/DEVIATIONS.md.
// Upstream this issues a ky GET to /v2/leaderboards/{metric}. The prototype makes no network
// calls, so only the response type survives; fixtures are served by ../modules/.../useLeaderboard.

export interface LeaderboardEntry {
  employeeId: string
  employeeName: string
  score: number
  order: number
}
