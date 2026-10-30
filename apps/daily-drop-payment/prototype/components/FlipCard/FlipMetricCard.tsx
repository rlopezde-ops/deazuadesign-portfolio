import { useState } from 'react'

import type { PayableMetricKey } from '@/expert-hub/data/payTiers'
import type { PayMetrics } from '@/expert-hub/data/types'
import {
  computeDirectProgress,
  computeInverseProgress,
  computeMetricStatus,
  computeMetricTone,
} from '@/expert-hub/cards/targetProgress'
import {
  CUSTOMER_RATING_ERP_TARGET,
  CUSTOMER_RATING_NPS_TARGET,
  SALES_TARGET,
  TRANSFER_RATE_TARGET,
} from '@/expert-hub/cards/targets'
import { PAY_CONFIG } from '@/expert-hub/data/payTiers'
import { METRIC_KEYS } from '@/expert-hub/data/metricKeys'
import { getMetricValue } from '@/expert-hub/data/utils'

import { FlipCard } from './FlipCard'
import { MetricCardFront } from './MetricCardFront'
import { PayDetailBack } from './PayDetailBack'
import { formatEarned, computeActionLine } from './payModel'

interface FrontConfig {
  category: string
  title: string
  illustration: string
  formatValue: (calc: number) => string
  unit: string
  computeProgress: (calc: number) => number
  formatTarget: () => string
  getCalc: (payMetrics: PayMetrics) => number | null
}

const FRONT_CONFIG: Record<PayableMetricKey, FrontConfig> = {
  erp: {
    category: 'Serve',
    title: 'ERP',
    illustration: '/cakes/love.png',
    formatValue: (c) => c.toFixed(1),
    unit: '%',
    computeProgress: (c) => computeDirectProgress(c, CUSTOMER_RATING_ERP_TARGET),
    formatTarget: () => `Target ${CUSTOMER_RATING_ERP_TARGET}% or higher`,
    getCalc: (m) => getMetricValue(m.totals.serve, METRIC_KEYS.serve.ERP),
  },
  'expert-5star': {
    category: 'Serve',
    title: 'Expert 5 Star',
    illustration: '/cakes/love.png',
    formatValue: (c) => c.toFixed(1),
    unit: '',
    computeProgress: (c) => computeDirectProgress(c, CUSTOMER_RATING_NPS_TARGET),
    formatTarget: () => `Target ${CUSTOMER_RATING_NPS_TARGET} or higher`,
    getCalc: (m) => getMetricValue(m.totals.serve, METRIC_KEYS.serve.EXPERT_5STAR),
  },
  'transfer-rate': {
    category: 'Solve',
    title: 'Transfer Rate',
    illustration: '/cakes/quality.png',
    formatValue: (c) => (c * 100).toFixed(0),
    unit: '%',
    computeProgress: (c) => computeInverseProgress({ actual: c * 100, target: TRANSFER_RATE_TARGET }),
    formatTarget: () => `Target ${TRANSFER_RATE_TARGET}% or lower`,
    getCalc: (m) => getMetricValue(m.totals.solve, METRIC_KEYS.solve.TRANSFER_RATE),
  },
  'net-enrolls': {
    category: 'Sell',
    title: 'Net enrolls',
    illustration: '/cakes/sales.png',
    formatValue: (c) => String(Math.round(c)),
    unit: '',
    computeProgress: (c) => computeDirectProgress(c, SALES_TARGET),
    formatTarget: () => `Target ${SALES_TARGET} sales`,
    getCalc: (m) => getMetricValue(m.totals.sell, METRIC_KEYS.sell.NET_ENROLLS),
  },
}

// Shared stat computation for serve-bucket metrics (ERP, Expert 5 Star, Transfer Rate)
function getServeSupportingStats(m: PayMetrics): Array<{ label: string; value: string }> {
  const stats: Array<{ label: string; value: string }> = []
  const ocr = getMetricValue(m.totals.solve, METRIC_KEYS.solve.OCR)
  if (ocr !== null) stats.push({ label: 'Resolution rate', value: `${(ocr * 100).toFixed(0)}%` })
  const crt = getMetricValue(m.totals.serve, METRIC_KEYS.serve.CRT)
  if (crt !== null) stats.push({ label: 'Call time', value: `${Math.round(crt)}s` })
  return stats
}

const SUPPORTING_STATS_FN: Partial<Record<PayableMetricKey, (m: PayMetrics) => Array<{ label: string; value: string }>>> = {
  erp: getServeSupportingStats,
  'expert-5star': getServeSupportingStats,
  'transfer-rate': getServeSupportingStats,
}

interface Props {
  metricKey: PayableMetricKey
  payMetrics: PayMetrics | null
  isLoading: boolean
  isError?: boolean
}

export function FlipMetricCard({ metricKey, payMetrics, isLoading, isError = false }: Props) {
  const [flipped, setFlipped] = useState(false)

  const cfg = FRONT_CONFIG[metricKey]
  const calc = payMetrics ? cfg.getCalc(payMetrics) : null
  const hasData = calc !== null

  const progress = hasData ? cfg.computeProgress(calc) : 0
  const status = hasData ? computeMetricStatus(progress) : undefined
  const tone = hasData ? computeMetricTone(progress) : undefined

  const supportingStats =
    payMetrics && SUPPORTING_STATS_FN[metricKey]
      ? SUPPORTING_STATS_FN[metricKey]!(payMetrics)
      : []

  const payConfig = PAY_CONFIG[metricKey]
  const calcNormalized = hasData ? calc * payConfig.calcMultiplier : 0
  const earned = hasData ? formatEarned(payConfig, calcNormalized) : undefined
  const actionLine = hasData ? computeActionLine(payConfig, calcNormalized) : undefined

  return (
    <FlipCard
      flipped={flipped}
      onFlip={() => setFlipped((f) => !f)}
      front={
        <MetricCardFront
          category={cfg.category}
          title={cfg.title}
          value={hasData ? cfg.formatValue(calc) : ''}
          unit={cfg.unit || undefined}
          status={status}
          tone={tone}
          target={cfg.formatTarget()}
          earned={earned}
          actionLine={actionLine}
          illustration={cfg.illustration}
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && !hasData}
          supportingStats={supportingStats}
        />
      }
      back={
        <PayDetailBack
          category={cfg.category}
          metricKey={metricKey}
          payMetrics={payMetrics}
          isLoading={isLoading}
        />
      }
    />
  )
}
