/**
 * PROTOTYPE DEVIATION — pay tier definitions for Card Flip metric cards.
 * Source: One Stop Pay Shop Power BI export (PSS-Verizon, 2026-09-22), translated
 * to representative USD amounts for design-intent communication. Thresholds match
 * the export; dollar amounts are proportional approximations, not production values.
 *
 * Two payout archetypes:
 *   threshold — cross a value threshold → one flat lump sum (ERP, Transfer Rate)
 *   rate      — $-per-sale rate that climbs with volume; total = count × rate(count),
 *               re-applied to ALL sales for the period (Net Enrolls)
 */

export type PayableMetricKey = 'erp' | 'expert-5star' | 'transfer-rate' | 'net-enrolls'

export interface PayTier {
    tier: number
    threshold: number
    /** Flat bonus (threshold model). Set to 0 for rate-model tiers. */
    payout: number
    /** Per-sale rate (rate model only). */
    rate?: number
}

export interface MetricPayConfig {
    tiers: PayTier[]
    /** Display unit for the gap-to-next hint (e.g. '%', ' sales', ''). */
    gapUnit: string
    /** true = higher calc is better (ERP, enrolls); false = lower is better (transfer rate). */
    higherIsBetter: boolean
    /**
     * Multiply the raw calc value before comparing against tier thresholds.
     * Transfer rate arrives as a decimal fraction (0.14 = 14%) so needs ×100.
     * All other metrics arrive in their display unit already.
     */
    calcMultiplier: number
    /** 'threshold' = flat lump-sum bonus; 'rate' = per-unit rate × count. */
    model: 'threshold' | 'rate'
}

// ─── ERP ──────────────────────────────────────────────────────────────────────
// Export: PSS-Verizon COL — min 85→COP 70K, target 90→COP 400K, max 95→COP 1.5M.
// USD proxy: $25 / $100 / $250.
const ERP_TIERS: PayTier[] = [
    { tier: 1, threshold: 85, payout: 25  },
    { tier: 2, threshold: 90, payout: 100 },
    { tier: 3, threshold: 95, payout: 250 },
]

// ─── Transfer Rate ─────────────────────────────────────────────────────────────
// Export: PSS-Verizon COL — min ≤15%→COP 30K, target ≤12%→COP 200K, max ≤8%→COP 500K.
// USD proxy: $25 / $100 / $250.
const TRANSFER_RATE_TIERS: PayTier[] = [
    { tier: 1, threshold: 15, payout: 25  },
    { tier: 2, threshold: 12, payout: 100 },
    { tier: 3, threshold: 8,  payout: 250 },
]

// ─── Net Enrolls (rate accelerator) ───────────────────────────────────────────
// Export: PSS-Verizon COL — min 2→COP 25K/sale, target 6→COP 100K, max 10→COP 250K,
// overdrive 15→COP 275K. USD proxy rates: $10 / $25 / $50 / $60 per sale.
// Total = count × rate(count). The higher rate re-applies to ALL sales for the period.
const NET_ENROLLS_TIERS: PayTier[] = [
    { tier: 1, threshold: 2,  payout: 0, rate: 10 },
    { tier: 2, threshold: 6,  payout: 0, rate: 25 },
    { tier: 3, threshold: 10, payout: 0, rate: 50 },
    { tier: 4, threshold: 15, payout: 0, rate: 60 },
]

export const PAY_CONFIG: Record<PayableMetricKey, MetricPayConfig> = {
    erp: {
        tiers: ERP_TIERS,
        gapUnit: '%',
        higherIsBetter: true,
        calcMultiplier: 1,
        model: 'threshold',
    },
    'expert-5star': {
        tiers: ERP_TIERS,
        gapUnit: '',
        higherIsBetter: true,
        calcMultiplier: 1,
        model: 'threshold',
    },
    'transfer-rate': {
        tiers: TRANSFER_RATE_TIERS,
        gapUnit: '%',
        higherIsBetter: false,
        calcMultiplier: 100,
        model: 'threshold',
    },
    'net-enrolls': {
        tiers: NET_ENROLLS_TIERS,
        gapUnit: ' sales',
        higherIsBetter: true,
        calcMultiplier: 1,
        model: 'rate',
    },
}

// ─── Tier names ───────────────────────────────────────────────────────────────

const TIER_NAMES_3 = ['Min', 'Target', 'Max'] as const
const TIER_NAMES_4 = ['Min', 'Target', 'Max', 'Overdrive'] as const

export function getTierName(tierNumber: number, totalTiers: number): string {
    const names = totalTiers === 4 ? TIER_NAMES_4 : TIER_NAMES_3
    return names[tierNumber - 1] ?? `Tier ${tierNumber}`
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
// All helpers receive the already-normalized calc (raw × calcMultiplier).

/** Returns the highest qualifying tier, or null if below all thresholds. */
export function getCurrentTier(config: MetricPayConfig, calcNormalized: number): PayTier | null {
    const sorted = [...config.tiers].sort((a, b) => b.tier - a.tier)
    if (config.higherIsBetter) {
        return sorted.find((t) => calcNormalized >= t.threshold) ?? null
    } else {
        return sorted.find((t) => calcNormalized <= t.threshold) ?? null
    }
}

/** Returns the next tier above the current, or Tier 1 if below all thresholds, or null if already at top. */
export function getNextTier(config: MetricPayConfig, calcNormalized: number): PayTier | null {
    const current = getCurrentTier(config, calcNormalized)
    if (!current) {
        return [...config.tiers].sort((a, b) => a.tier - b.tier)[0] ?? null
    }
    return config.tiers.find((t) => t.tier === current.tier + 1) ?? null
}

/** Returns the gap between current calc and the next tier threshold, or null if at the top. */
export function getGapToNext(config: MetricPayConfig, calcNormalized: number): number | null {
    const next = getNextTier(config, calcNormalized)
    if (!next) return null
    return config.higherIsBetter
        ? next.threshold - calcNormalized
        : calcNormalized - next.threshold
}

/** For rate model: total payout = count × per-unit rate of current tier. Returns 0 if below all tiers. */
export function computeRateTotal(config: MetricPayConfig, count: number): number {
    const tier = getCurrentTier(config, count)
    if (!tier || !tier.rate) return 0
    return count * tier.rate
}

/**
 * Dollar delta to the next tier. Threshold model: nextPayout − currentPayout.
 * Rate model: (nextThreshold × nextRate) − (currentCount × currentRate).
 */
export function getDeltaToNext(config: MetricPayConfig, calcNormalized: number): number | null {
    const current = getCurrentTier(config, calcNormalized)
    const next = getNextTier(config, calcNormalized)
    if (!next) return null
    if (config.model === 'rate') {
        const currentRate = current?.rate ?? 0
        const nextRate = next.rate ?? 0
        return (next.threshold * nextRate) - (calcNormalized * currentRate)
    }
    return next.payout - (current?.payout ?? 0)
}
