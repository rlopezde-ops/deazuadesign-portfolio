'use client'

import { useEffect, useRef, useState } from 'react'
import { Text } from '@mantine/core'
import clsx from 'clsx'

import type { MetricTone } from '@/expert-hub/cards/targetProgress'
import type { PayableMetricKey } from '@/expert-hub/data/payTiers'
import type { PayMetrics } from '@/expert-hub/data/types'

import { computeDirectProgress, computeInverseProgress, computeMetricTone } from '@/expert-hub/cards/targetProgress'
import { CUSTOMER_RATING_ERP_TARGET, CUSTOMER_RATING_NPS_TARGET, SALES_TARGET, TRANSFER_RATE_TARGET } from '@/expert-hub/cards/targets'
import { PAY_CONFIG, getCurrentTier } from '@/expert-hub/data/payTiers'
import { METRIC_KEYS } from '@/expert-hub/data/metricKeys'
import { getMetricValue } from '@/expert-hub/data/utils'

import styles from './PayDetailBack.module.css'
import {
  computeCurrentPayout,
  formatTierAmount,
  formatTierThreshold,
  getBackLabel,
  getHowItWorksText,
  getTierName,
} from './payModel'

const PAY_TONE_CLASS: Record<MetricTone, string> = {
  positive: styles.tonePositive,
  warning: styles.toneWarning,
  negative: styles.toneNegative,
}

interface MetricBackConfig {
  title: string
  bucket: 'serve' | 'solve' | 'sell'
  bucketKey: string
  computeProgress: (calc: number) => number
}

const BACK_CONFIG: Record<PayableMetricKey, MetricBackConfig> = {
  erp: {
    title: 'ERP',
    bucket: 'serve',
    bucketKey: METRIC_KEYS.serve.ERP,
    computeProgress: (c) => computeDirectProgress(c, CUSTOMER_RATING_ERP_TARGET),
  },
  'expert-5star': {
    title: 'Expert 5 Star',
    bucket: 'serve',
    bucketKey: METRIC_KEYS.serve.EXPERT_5STAR,
    computeProgress: (c) => computeDirectProgress(c, CUSTOMER_RATING_NPS_TARGET),
  },
  'transfer-rate': {
    title: 'Transfer rate',
    bucket: 'solve',
    bucketKey: METRIC_KEYS.solve.TRANSFER_RATE,
    computeProgress: (c) => computeInverseProgress({ actual: c * 100, target: TRANSFER_RATE_TARGET }),
  },
  'net-enrolls': {
    title: 'Net enrolls',
    bucket: 'sell',
    bucketKey: METRIC_KEYS.sell.NET_ENROLLS,
    computeProgress: (c) => computeDirectProgress(c, SALES_TARGET),
  },
}

interface Props {
  category: string
  metricKey: PayableMetricKey
  payMetrics: PayMetrics | null
  isLoading: boolean
}

export function PayDetailBack({ category, metricKey, payMetrics, isLoading }: Props) {
  const cfg = BACK_CONFIG[metricKey]
  const payConfig = PAY_CONFIG[metricKey]

  const totals = payMetrics?.totals
  const bucket = totals?.[cfg.bucket]
  const calc = getMetricValue(bucket as Parameters<typeof getMetricValue>[0], cfg.bucketKey)

  const hasData = calc !== null

  const progress = hasData ? cfg.computeProgress(calc) : 0
  const tone = hasData ? computeMetricTone(progress) : undefined

  const calcNormalized = hasData ? calc * payConfig.calcMultiplier : 0
  const currentTier = hasData ? getCurrentTier(payConfig, calcNormalized) : null
  const currentPayout = hasData ? computeCurrentPayout(payConfig, calcNormalized) : 0
  const hasPay = currentPayout > 0

  const backLabel = getBackLabel(cfg.title, payConfig.model)
  const howItWorks = hasData ? getHowItWorksText(payConfig, calcNormalized) : null

  const tierScrollRef = useRef<HTMLDivElement>(null)
  const [fadeRight, setFadeRight] = useState(false)
  const [fadeLeft, setFadeLeft] = useState(false)

  useEffect(() => {
    const el = tierScrollRef.current
    if (!el) return
    const check = () => {
      const gap = el.scrollWidth - el.clientWidth
      setFadeRight(gap > 20 && el.scrollLeft + el.clientWidth + 4 < el.scrollWidth)
      setFadeLeft(gap > 20 && el.scrollLeft > 4)
    }
    check()
    el.addEventListener('scroll', check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', check); ro.disconnect() }
  }, [])

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.labelGroup}>
          <span className={styles.labelCategory}>{category}</span>
          <span className={styles.labelSep}>•</span>
          <span className={styles.labelMetric}>{backLabel}</span>
        </div>

        {hasPay ? (
          <Text component="div" className={clsx(styles.payAmount, tone && PAY_TONE_CLASS[tone])}>
            ${currentPayout.toLocaleString()}
          </Text>
        ) : (
          <Text className={styles.emptyText}>No pay data yet</Text>
        )}

        {/* Tier ladder — Min / Target / Max / Overdrive with dot track */}
        <div className={clsx(styles.tierContainer, fadeRight && styles.tierFadeRight, fadeLeft && styles.tierFadeLeft)}>
          <div ref={tierScrollRef} className={styles.tierScroll}>
          <div className={styles.tierLabelRow}>
            {payConfig.tiers.map((tier) => {
              const isActive = currentTier?.tier === tier.tier
              return (
                <div
                  key={tier.tier}
                  className={clsx(styles.tierItem, isActive && styles.tierItemActive)}
                >
                  <span className={styles.tierName}>
                    {getTierName(tier.tier, payConfig.tiers.length)}
                  </span>
                  <span className={styles.tierAmount}>
                    {formatTierAmount(payConfig, tier)}
                  </span>
                  <span className={styles.tierThreshold}>
                    {formatTierThreshold(payConfig, tier)}
                  </span>
                </div>
              )
            })}
          </div>
          <div className={styles.trackRow}>
            {currentTier && (() => {
              const n = payConfig.tiers.length
              const idx = payConfig.tiers.findIndex(t => t.tier === currentTier.tier)
              const fillPct = ((2 * idx + 1) / (2 * n)) * 100
              return <div className={styles.trackFill} style={{ width: `${fillPct}%` }} />
            })()}
            {payConfig.tiers.map((tier) => {
              const isActive = currentTier?.tier === tier.tier
              return (
                <div
                  key={tier.tier}
                  className={clsx(styles.trackDot, isActive && styles.trackDotActive)}
                >
                  {isActive && (
                    <span className={styles.youreHere}>You're here</span>
                  )}
                </div>
              )
            })}
          </div>
          </div>
        </div>

        {/* How it works */}
        {howItWorks && (
          <Text className={styles.howItWorks}>{howItWorks}</Text>
        )}
      </div>

      <div className={styles.flipCta} aria-hidden="true">← Metric</div>
    </div>
  )
}
