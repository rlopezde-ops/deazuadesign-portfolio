'use client'

import { Box } from '@mantine/core'
import { METRIC_ILLUSTRATIONS, type Metric } from '@/lib/daily-drop-data'
import { PAY_CONFIG, computeActionLine, formatEarned } from '@/lib/pay-model'
import { HoverPlayLottie } from '../shared/hover-play-lottie'
import { StatusPill } from './status-pill'
import classes from './daily-drop.module.css'

const ILLUSTRATION_VARIANT = {
  love: classes.illustrationLove,
  quality: classes.illustrationQuality,
  sales: classes.illustrationSales,
} as const

/**
 * Front face of a metric card. Pure visual — interaction (click, keyboard,
 * aria) lives on the parent wrapper.
 */
export function MetricCard({ metric, playToken = 0 }: { metric: Metric; playToken?: number }) {
  const illustration = METRIC_ILLUSTRATIONS[metric.id]
  const config = PAY_CONFIG[metric.id]
  const calcNormalized = metric.payValue * config.calcMultiplier
  const earned = formatEarned(config, calcNormalized)
  const actionLine = computeActionLine(config, calcNormalized)

  return (
    <>
      {illustration &&
        (illustration.lottieSrc ? (
          <HoverPlayLottie
            src={illustration.lottieSrc}
            playToken={playToken}
            className={`${classes.illustration} ${ILLUSTRATION_VARIANT[illustration.variant]}`}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={illustration.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={`${classes.illustration} ${ILLUSTRATION_VARIANT[illustration.variant]}`}
          />
        ))}

      <div className={classes.metricCategoryRow}>
        <span className={classes.metricCategoryLabel}>{metric.category}</span>
        <span className={classes.metricCategorySep}>·</span>
        <span className={classes.metricCategoryName}>{metric.name}</span>
        {metric.status && (
          <span className={classes.metricStatusRight}>
            <StatusPill status={metric.status} />
          </span>
        )}
      </div>

      <Box className={`${classes.metricValue} ${classes.content}`}>
        {metric.value}
        {metric.unit && <span className={classes.metricUnit}>{metric.unit}</span>}
      </Box>

      <Box component="p" className={`${classes.metricTarget} ${classes.content}`} m={0}>
        {metric.target}
      </Box>

      <div className={classes.metricEarned}>
        <span className={classes.metricEarnedValue}>{earned}</span>
        {actionLine && <span className={classes.metricActionLine}>{actionLine}</span>}
      </div>

      <div className={classes.metricFlipCta} aria-hidden="true">
        See how it's paid →
      </div>
    </>
  )
}
