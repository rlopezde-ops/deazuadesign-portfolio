'use client'

/**
 * Stands in for `@expert/expert-university`. Training mode is never active in this prototype, so
 * the vendored header always takes its ordinary branch.
 */
export interface ExpertUniversityConfiguration {
  allowedPartners: string[]
  trainingPartner: string | null
  mostRecentSessionId: string | undefined
}

export const useExpertUniversityConfiguration = (): ExpertUniversityConfiguration => ({
  allowedPartners: [],
  trainingPartner: null,
  mostRecentSessionId: undefined,
})

export const partnerEnabledForExpertUniversity = (
  _trainingPartner: string | null,
  _channel: string,
  _isInPilot: boolean | undefined,
): boolean => false
