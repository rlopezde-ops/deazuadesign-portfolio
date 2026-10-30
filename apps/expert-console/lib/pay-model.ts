/**
 * Pay tier definitions and payout computation for the daily drop metric cards.
 *
 * Ported from apps/daily-drop-payment (prototype), adapted to the production
 * MetricId keys. Two payout archetypes:
 *
 *   threshold — cross a value threshold → one flat lump-sum bonus (ERP, Transfer Rate)
 *   rate      — per-sale rate that climbs with volume; total = count × rate(count),
 *               re-applied to ALL sales for the period (Net Sales / Net Enrolls)
 *
 * Thresholds match the One Stop Pay Shop Power BI export (PSS-Verizon);
 * dollar amounts are proportional approximations for design-intent communication.
 */

import type { MetricId } from './daily-drop-data'

export interface PayTier {
  tier: number
  threshold: number
  payout: number
  rate?: number
}

export interface MetricPayConfig {
  tiers: PayTier[]
  gapUnit: string
  higherIsBetter: boolean
  calcMultiplier: number
  model: 'threshold' | 'rate'
}

const ERP_TIERS: PayTier[] = [
  { tier: 1, threshold: 85, payout: 25 },
  { tier: 2, threshold: 90, payout: 100 },
  { tier: 3, threshold: 95, payout: 250 },
]

const TRANSFER_RATE_TIERS: PayTier[] = [
  { tier: 1, threshold: 15, payout: 25 },
  { tier: 2, threshold: 12, payout: 100 },
  { tier: 3, threshold: 8, payout: 250 },
]

const NET_SALES_TIERS: PayTier[] = [
  { tier: 1, threshold: 2, payout: 0, rate: 10 },
  { tier: 2, threshold: 6, payout: 0, rate: 25 },
  { tier: 3, threshold: 10, payout: 0, rate: 50 },
  { tier: 4, threshold: 15, payout: 0, rate: 60 },
]

export const PAY_CONFIG: Record<MetricId, MetricPayConfig> = {
  erp: {
    tiers: ERP_TIERS,
    gapUnit: '%',
    higherIsBetter: true,
    calcMultiplier: 1,
    model: 'threshold',
  },
  'transfer-rate': {
    tiers: TRANSFER_RATE_TIERS,
    gapUnit: '%',
    higherIsBetter: false,
    calcMultiplier: 1,
    model: 'threshold',
  },
  'net-sales': {
    tiers: NET_SALES_TIERS,
    gapUnit: ' sales',
    higherIsBetter: true,
    calcMultiplier: 1,
    model: 'rate',
  },
}

// ── Tier helpers ─────────────────────────────────────────────────────────────

const NAMES_3 = ['Min', 'Target', 'Max'] as const
const NAMES_4 = ['Min', 'Target', 'Max', 'Overdrive'] as const

export function getTierName(tierNumber: number, totalTiers: number): string {
  const names = totalTiers === 4 ? NAMES_4 : NAMES_3
  return names[tierNumber - 1] ?? `Tier ${tierNumber}`
}

export function getCurrentTier(config: MetricPayConfig, calcNormalized: number): PayTier | null {
  const sorted = [...config.tiers].sort((a, b) => b.tier - a.tier)
  if (config.higherIsBetter) {
    return sorted.find((t) => calcNormalized >= t.threshold) ?? null
  }
  return sorted.find((t) => calcNormalized <= t.threshold) ?? null
}

export function isMaxTier(config: MetricPayConfig, calcNormalized: number): boolean {
  const current = getCurrentTier(config, calcNormalized)
  if (!current) return false
  return !config.tiers.some((t) => t.tier === current.tier + 1)
}

export function getNextTier(config: MetricPayConfig, calcNormalized: number): PayTier | null {
  const current = getCurrentTier(config, calcNormalized)
  if (!current) {
    return [...config.tiers].sort((a, b) => a.tier - b.tier)[0] ?? null
  }
  return config.tiers.find((t) => t.tier === current.tier + 1) ?? null
}

// ── Payout computation ───────────────────────────────────────────────────────

export function computeCurrentPayout(config: MetricPayConfig, calcNormalized: number): number {
  const tier = getCurrentTier(config, calcNormalized)
  if (!tier) return 0
  if (config.model === 'rate') return Math.round(calcNormalized) * (tier.rate ?? 0)
  return tier.payout
}

export function formatEarned(config: MetricPayConfig, calcNormalized: number): string {
  const payout = computeCurrentPayout(config, calcNormalized)
  if (payout <= 0) return 'Not earning yet'
  return `$${payout.toLocaleString()} earned`
}

export function computeActionLine(config: MetricPayConfig, calcNormalized: number): string | null {
  const nextTier = getNextTier(config, calcNormalized)

  if (!nextTier) {
    if (config.model === 'rate') {
      const tier = getCurrentTier(config, calcNormalized)
      return `Top rate — $${tier?.rate ?? 0}/sale`
    }
    return 'Max bonus earned'
  }

  const currentPayout = computeCurrentPayout(config, calcNormalized)
  const nextPayout =
    config.model === 'rate' ? nextTier.threshold * (nextTier.rate ?? 0) : nextTier.payout
  const delta = nextPayout - currentPayout
  const tierName = getTierName(nextTier.tier, config.tiers.length)

  let verb: string
  if (config.model === 'rate') {
    const gap = nextTier.threshold - Math.round(calcNormalized)
    verb = `${gap} more sale${gap === 1 ? '' : 's'}`
  } else if (config.higherIsBetter) {
    verb = `Hit ${nextTier.threshold}${config.gapUnit}`
  } else {
    verb = `Get under ${nextTier.threshold}${config.gapUnit}`
  }

  return `${verb} > +$${delta.toLocaleString()} (${tierName})`
}

// ── Back face helpers ────────────────────────────────────────────────────────

export function getBackLabel(metricTitle: string, model: 'threshold' | 'rate'): string {
  return model === 'rate' ? `${metricTitle} pay` : `${metricTitle} bonus`
}

export function formatTierThreshold(config: MetricPayConfig, tier: PayTier): string {
  if (config.model === 'rate') return `${tier.threshold}+ sales`
  if (!config.higherIsBetter) return `≤${tier.threshold}${config.gapUnit}`
  return `${tier.threshold}${config.gapUnit}`
}

export function formatTierAmount(config: MetricPayConfig, tier: PayTier): string {
  if (config.model === 'rate') return `$${tier.rate ?? 0}/sale`
  return `$${tier.payout.toLocaleString()}`
}

export function getHowItWorksText(config: MetricPayConfig, calcNormalized: number): string {
  const currentTier = getCurrentTier(config, calcNormalized)
  const nextTier = getNextTier(config, calcNormalized)
  const n = config.tiers.length

  if (config.model === 'rate') {
    const count = Math.round(calcNormalized)
    const rate = currentTier?.rate ?? 0
    const total = count * rate
    let text = 'Your rate applies to every sale this period — a higher tier re-pays all of them.'
    if (currentTier && nextTier) {
      text += ` You're at $${rate}/sale (${count} sale${count === 1 ? '' : 's'} = $${total.toLocaleString()}).`
      text += ` Reach ${nextTier.threshold} sales for $${nextTier.rate}/sale = $${(nextTier.threshold * (nextTier.rate ?? 0)).toLocaleString()}.`
    } else if (currentTier) {
      text += ` You're at the top rate: $${rate}/sale (${count} sale${count === 1 ? '' : 's'} = $${total.toLocaleString()}).`
    } else {
      text += ` Reach ${config.tiers[0].threshold} sales to start earning $${config.tiers[0].rate}/sale.`
    }
    return text
  }

  let text = 'You earn a one-time bonus when you reach each tier.'
  if (currentTier && nextTier) {
    const name = getTierName(currentTier.tier, n)
    const nextName = getTierName(nextTier.tier, n)
    text += ` You're at ${name} ($${currentTier.payout.toLocaleString()}).`
    const verb = config.higherIsBetter
      ? `Reach ${nextTier.threshold}${config.gapUnit}`
      : `Get under ${nextTier.threshold}${config.gapUnit}`
    text += ` ${verb} to jump to ${nextName} ($${nextTier.payout.toLocaleString()}).`
  } else if (currentTier) {
    const name = getTierName(currentTier.tier, n)
    text += ` You're at ${name} ($${currentTier.payout.toLocaleString()}) — the top tier.`
  } else {
    const min = config.tiers[0]
    const verb = config.higherIsBetter
      ? `Reach ${min.threshold}${config.gapUnit}`
      : `Get under ${min.threshold}${config.gapUnit}`
    text += ` ${verb} to unlock Min ($${min.payout.toLocaleString()}).`
  }
  return text
}

// ── Aggregate ────────────────────────────────────────────────────────────────

export function computeTotalEarnings(
  payValues: Partial<Record<MetricId, number>>,
): number {
  let total = 0
  for (const [id, value] of Object.entries(payValues) as [MetricId, number][]) {
    const config = PAY_CONFIG[id]
    if (!config || value == null) continue
    const calc = value * config.calcMultiplier
    total += computeCurrentPayout(config, calc)
  }
  return total
}
