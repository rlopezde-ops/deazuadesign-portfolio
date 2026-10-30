'use client'

/**
 * Stands in for `@expert/features`. Production reads these from a feature-flag service; the
 * prototype pins the flags that gate Expert Hub surfaces to `true` so everything is visible.
 */
export interface WorkspaceFeatures {
  isExpertHubScheduleEnabled: boolean
  isPacingEnabled: boolean
  isChallengeEnabled: boolean
  isChecklistSummaryEnabled: boolean
}

const FEATURES: WorkspaceFeatures = {
  isExpertHubScheduleEnabled: true,
  isPacingEnabled: true,
  isChallengeEnabled: true,
  isChecklistSummaryEnabled: true,
}

export function useFeatures<T = WorkspaceFeatures>(): { features: T } {
  return { features: FEATURES as T }
}
