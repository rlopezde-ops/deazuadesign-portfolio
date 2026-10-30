'use client'

import { useEffect, useRef, useState } from 'react'
import { Tooltip } from '@mantine/core'
import { Question } from '@phosphor-icons/react'
import type { Metric } from '@/lib/daily-drop-data'
import {
  PAY_CONFIG,
  computeCurrentPayout,
  formatTierAmount,
  formatTierThreshold,
  getBackLabel,
  getCurrentTier,
  getHowItWorksText,
  getTierName,
  isMaxTier,
} from '@/lib/pay-model'
import { StatusPill } from './status-pill'
import classes from './daily-drop.module.css'

export function MetricPayBack({ metric }: { metric: Metric }) {
  const config = PAY_CONFIG[metric.id]
  const calcNormalized = metric.payValue * config.calcMultiplier
  const currentTier = getCurrentTier(config, calcNormalized)
  const currentPayout = computeCurrentPayout(config, calcNormalized)
  const hasPay = currentPayout > 0
  const backLabel = getBackLabel(metric.name, config.model)
  const howItWorks = getHowItWorksText(config, calcNormalized)
  const atMax = isMaxTier(config, calcNormalized)

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
    return () => {
      el.removeEventListener('scroll', check)
      ro.disconnect()
    }
  }, [])

  return (
    <div className={classes.payBackFace}>
      <div className={classes.payBackContent}>
        <div className={classes.metricCategoryRow}>
          <span className={classes.metricCategoryLabel}>{metric.category}</span>
          <span className={classes.metricCategorySep}>·</span>
          <span className={classes.metricCategoryName}>{backLabel}</span>
          {metric.status && (
            <span className={classes.metricStatusRight}>
              <StatusPill status={metric.status} />
            </span>
          )}
        </div>

        {hasPay ? (
          <div className={classes.payAmountRow}>
            <span className={classes.metricValue}>
              {metric.value}
              {metric.unit && <span className={classes.metricUnit}>{metric.unit}</span>}
            </span>
            <span className={classes.payDivider}>|</span>
            <span className={classes.payAmountValue}>
              ${currentPayout.toLocaleString()}
            </span>
          </div>
        ) : (
          <div className={`${classes.payAmount} ${classes.payAmountNone}`}>
            Not earning yet
          </div>
        )}

        {howItWorks && (
          <Tooltip label={howItWorks} withArrow multiline w={260} position="bottom-start">
            <span className={classes.howItWorksTip}>
              <Question size={14} weight="bold" />
              How it works
            </span>
          </Tooltip>
        )}

        <div
          className={`${classes.tierContainer} ${fadeRight ? classes.tierFadeRight : ''} ${fadeLeft ? classes.tierFadeLeft : ''}`}
        >
          <div ref={tierScrollRef} className={classes.tierScroll}>
            <div className={classes.tierLabelRow}>
              {config.tiers.map((tier) => {
                const isActive = currentTier?.tier === tier.tier
                return (
                  <div
                    key={tier.tier}
                    className={`${classes.tierItem} ${isActive ? classes.tierItemActive : ''}`}
                  >
                    <span className={classes.tierName}>
                      {getTierName(tier.tier, config.tiers.length)}
                    </span>
                    <span className={classes.tierAmount}>
                      {formatTierAmount(config, tier)}
                    </span>
                    <span className={classes.tierThreshold}>
                      {formatTierThreshold(config, tier)}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className={classes.trackRow}>
              {currentTier &&
                (() => {
                  const n = config.tiers.length
                  const idx = config.tiers.findIndex((t) => t.tier === currentTier.tier)
                  const fillPct = ((2 * idx + 1) / (2 * n)) * 100
                  return <div className={classes.trackFill} style={{ width: `${fillPct}%` }} />
                })()}
              {(() => {
                const activeIdx = currentTier
                  ? config.tiers.findIndex((t) => t.tier === currentTier.tier)
                  : -1
                return config.tiers.map((tier, i) => {
                  const isActive = currentTier?.tier === tier.tier
                  const isCompleted = activeIdx >= 0 && i < activeIdx
                  return (
                    <div
                      key={tier.tier}
                      className={`${classes.trackDot} ${isActive ? classes.trackDotActive : ''} ${isCompleted ? classes.trackDotCompleted : ''}`}
                    >
                      {isActive && <span className={classes.youreHere}>You're here</span>}
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        </div>

        {metric.supportingStats.length > 0 && (
          <div className={classes.paySupporting}>
            <span className={classes.paySupportingHeader}>Supporting stats</span>
            {metric.supportingStats.map((stat) => (
              <div key={stat.label} className={classes.paySupportingRow}>
                <span className={classes.paySupportingLabel}>{stat.label}</span>
                <span className={classes.paySupportingValue}>{stat.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
