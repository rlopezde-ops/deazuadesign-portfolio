'use client'

import { LEADERBOARD_CONFIGS } from '../fixtures/leaderboard'

/**
 * Stands in for `@/partner/usePartnerConfig`. Production resolves this from partner app-config;
 * here it is a constant so the leaderboard surfaces render.
 */
export const usePartnerConfig = () => ({
  leaderboards: LEADERBOARD_CONFIGS,
})

export const usePartnerFeatureConfigured = () => ({
  feedback: true,
  feedbackType: 'standard' as const,
})
