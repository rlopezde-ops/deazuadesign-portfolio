import type { MetricPayConfig, PayTier } from '@/expert-hub/data/payTiers'
import { getCurrentTier, getNextTier } from '@/expert-hub/data/payTiers'

// ── Tier names (derived from config length, not hardcoded per metric) ─────────
const NAMES_3 = ['Min', 'Target', 'Max'] as const
const NAMES_4 = ['Min', 'Target', 'Max', 'Overdrive'] as const

export function getTierName(tierNumber: number, totalTiers: number): string {
  const names = totalTiers === 4 ? NAMES_4 : NAMES_3
  return names[tierNumber - 1] ?? `Tier ${tierNumber}`
}

// ── Payout computation ────────────────────────────────────────────────────────
export function computeCurrentPayout(config: MetricPayConfig, calcNormalized: number): number {
  const tier = getCurrentTier(config, calcNormalized)
  if (!tier) return 0
  if (config.model === 'rate') {
    return Math.round(calcNormalized) * (tier.rate ?? 0)
  }
  return tier.payout
}

// ── Earned line (front card) ──────────────────────────────────────────────────
export function formatEarned(config: MetricPayConfig, calcNormalized: number): string {
  const payout = computeCurrentPayout(config, calcNormalized)
  if (payout <= 0) return 'Not earning yet'
  return `$${payout.toLocaleString()} earned`
}

// ── Action line (front card) ──────────────────────────────────────────────────
export function computeActionLine(
  config: MetricPayConfig,
  calcNormalized: number,
): string | null {
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
    config.model === 'rate'
      ? nextTier.threshold * (nextTier.rate ?? 0)
      : nextTier.payout
  const delta = nextPayout - currentPayout
  const tierName = getTierName(nextTier.tier, config.tiers.length)

  let verb: string
  if (config.model === 'rate') {
    const gap = nextTier.threshold - Math.round(calcNormalized)
    verb = `Make ${gap} more sale${gap === 1 ? '' : 's'}`
  } else if (config.higherIsBetter) {
    verb = `Hit ${nextTier.threshold}${config.gapUnit}`
  } else {
    verb = `Get under ${nextTier.threshold}${config.gapUnit}`
  }

  return `${verb} → +$${delta.toLocaleString()} (${tierName})`
}

// ── Back card: eyebrow suffix ─────────────────────────────────────────────────
export function getBackLabel(metricTitle: string, model: 'threshold' | 'rate'): string {
  return model === 'rate' ? `${metricTitle} pay` : `${metricTitle} bonus`
}

// ── Back card: tier display helpers ───────────────────────────────────────────
export function formatTierThreshold(config: MetricPayConfig, tier: PayTier): string {
  if (config.model === 'rate') return `${tier.threshold}+ sales`
  if (!config.higherIsBetter) return `≤${tier.threshold}${config.gapUnit}`
  return `${tier.threshold}${config.gapUnit}`
}

export function formatTierAmount(config: MetricPayConfig, tier: PayTier): string {
  if (config.model === 'rate') return `$${tier.rate ?? 0}/sale`
  return `$${tier.payout.toLocaleString()}`
}

// ── Back card: how it works ───────────────────────────────────────────────────
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
      text += ` You’re at $${rate}/sale (${count} sale${count === 1 ? '' : 's'} = $${total.toLocaleString()}).`
      text += ` Reach ${nextTier.threshold} sales for $${nextTier.rate}/sale = $${(nextTier.threshold * (nextTier.rate ?? 0)).toLocaleString()}.`
    } else if (currentTier) {
      text += ` You’re at the top rate: $${rate}/sale (${count} sale${count === 1 ? '' : 's'} = $${total.toLocaleString()}).`
    } else {
      text += ` Reach ${config.tiers[0].threshold} sales to start earning $${config.tiers[0].rate}/sale.`
    }
    return text
  }

  let text = 'You earn a one-time bonus when you reach each tier.'
  if (currentTier && nextTier) {
    const name = getTierName(currentTier.tier, n)
    const nextName = getTierName(nextTier.tier, n)
    text += ` You’re at ${name} ($${currentTier.payout.toLocaleString()}).`
    const verb = config.higherIsBetter
      ? `Reach ${nextTier.threshold}${config.gapUnit}`
      : `Get under ${nextTier.threshold}${config.gapUnit}`
    text += ` ${verb} to jump to ${nextName} ($${nextTier.payout.toLocaleString()}).`
  } else if (currentTier) {
    const name = getTierName(currentTier.tier, n)
    text += ` You’re at ${name} ($${currentTier.payout.toLocaleString()}) — the top tier.`
  } else {
    const min = config.tiers[0]
    const verb = config.higherIsBetter
      ? `Reach ${min.threshold}${config.gapUnit}`
      : `Get under ${min.threshold}${config.gapUnit}`
    text += ` ${verb} to unlock Min ($${min.payout.toLocaleString()}).`
  }
  return text
}
