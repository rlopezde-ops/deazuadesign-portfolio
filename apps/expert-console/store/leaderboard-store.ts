'use client'

import { create } from 'zustand'
import type { LeaderboardMetric } from '@/lib/daily-drop-data'

/**
 * Which board the full standings panel in the right rail is showing. Its Sales/Calls
 * tabs write here and nothing else reads it — deliberately: the page's leaderboard
 * strip is pinned to one board (see `STRIP_BOARD` in `leaderboard-strip.tsx`) so
 * switching tabs in the rail can't resequence the row behind it.
 *
 * A store rather than state inside the panel because the rail unmounts the panel on
 * close, and the choice should survive reopening it.
 */
interface LeaderboardSelectionState {
  metric: LeaderboardMetric
  setMetric: (metric: LeaderboardMetric) => void
}

export const useLeaderboardSelectionStore = create<LeaderboardSelectionState>((set) => ({
  metric: 'sales',
  setMetric: (metric) => set({ metric }),
}))
