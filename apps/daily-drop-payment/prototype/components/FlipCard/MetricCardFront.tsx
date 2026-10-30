import { Box, Divider, Skeleton, Text } from '@mantine/core'
import { IconAlertCircle, IconAlertTriangle } from '@tabler/icons-react'
import clsx from 'clsx'

import type { MetricTone } from '@/expert-hub/cards/targetProgress'

import styles from './MetricCardFront.module.css'

const TONE_CLASS: Record<MetricTone, string> = {
  positive: styles.tonePositive,
  warning: styles.toneWarning,
  negative: styles.toneNegative,
}

const TONE_ICON: Partial<Record<MetricTone, typeof IconAlertTriangle>> = {
  warning: IconAlertTriangle,
  negative: IconAlertCircle,
}

interface Props {
  category: string
  title: string
  value: string
  unit?: string
  status?: string
  tone?: MetricTone
  target: string
  earned?: string
  actionLine?: string | null
  isLoading: boolean
  isError?: boolean
  isEmpty: boolean
  emptyText?: string
  illustration: string
  supportingStats?: Array<{ label: string; value: string }>
}

export function MetricCardFront({
  category,
  title,
  value,
  unit,
  status,
  tone,
  target,
  earned,
  actionLine,
  isLoading,
  isError = false,
  isEmpty,
  emptyText = 'No data yet.',
  illustration,
  supportingStats,
}: Props) {
  const ToneIcon = tone ? TONE_ICON[tone] : undefined
  const hasData = !isLoading && !isError && !isEmpty

  return (
    <div className={styles.root}>
      {/* Image zone — gradient background, no badge */}
      <div className={styles.imageZone}>
        <img src={illustration} alt="" aria-hidden="true" draggable={false} className={styles.illustration} />
      </div>

      {/* Content zone */}
      <div className={styles.content}>
        {/* Title row: "Serve • ERP" left, status badge right — AUI MetricCard pattern */}
        <div className={styles.titleRow}>
          <div className={styles.labelGroup}>
            <span className={styles.labelCategory}>{category}</span>
            <span className={styles.labelSep}>•</span>
            <span className={styles.labelMetric}>{title}</span>
          </div>
          {hasData && status && tone && (
            <Text component="span" className={clsx(styles.badge, TONE_CLASS[tone])}>
              {ToneIcon && <ToneIcon size={12} stroke={2.5} aria-hidden />}
              {status}
            </Text>
          )}
        </div>

        {isLoading ? (
          <Skeleton height={34} width={100} radius="sm" />
        ) : isError ? (
          <Text className={styles.errorText}>Unavailable</Text>
        ) : isEmpty ? (
          <Text className={styles.emptyText}>{emptyText}</Text>
        ) : (
          <Box className={styles.valueRow}>
            <Text component="span" className={styles.value}>{value}</Text>
            {unit && <Text component="span" className={styles.unit}>{unit}</Text>}
          </Box>
        )}

        {!isLoading && !isError && (
          <Text className={styles.target}>{target}</Text>
        )}

        {/* Money block — current $ and tier-jump action */}
        {hasData && earned && (
          <div className={styles.moneyBlock}>
            <span className={styles.earned}>{earned}</span>
            {actionLine && <span className={styles.actionLine}>{actionLine}</span>}
          </div>
        )}

        {/* Supporting stats — separated by divider, pushed to bottom */}
        {hasData && supportingStats && supportingStats.length > 0 && (
          <div className={styles.stats}>
            <Divider className={styles.statsDivider} />
            {supportingStats.map((s) => (
              <div key={s.label} className={styles.statRow}>
                <span className={styles.statLabel}>{s.label}</span>
                <span className={styles.statValue}>{s.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flip affordance cue */}
      {hasData && (
        <div className={styles.flipCta} aria-hidden="true">See how it's paid →</div>
      )}
    </div>
  )
}
