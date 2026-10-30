'use client'

/**
 * Stands in for `@/shared-utils`. Only `useFeatureFlag` is reachable from the vendored header, and
 * this prototype has no flag service — everything reads as disabled so the header renders its
 * ordinary (non-Expert-University) state.
 */
export const useFeatureFlag = (_flag: string) => ({ data: false, isLoading: false })
