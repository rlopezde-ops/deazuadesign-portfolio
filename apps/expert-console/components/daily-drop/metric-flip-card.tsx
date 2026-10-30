'use client'

import { useState } from 'react'
import type { Metric, MetricId } from '@/lib/daily-drop-data'
import { MetricCard } from './metric-card'
import classes from './daily-drop.module.css'

export function MetricFlipCard({
  metric,
  open,
  onOpen,
}: {
  metric: Metric
  open: boolean
  onOpen: (id: MetricId, event: React.MouseEvent) => void
}) {
  const [playToken, setPlayToken] = useState(0)

  return (
    <button
      type="button"
      className={`${classes.card} ${classes.interactive} ${classes.metricCard} ${classes.metricFlipCard}`}
      data-open={open || undefined}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={`${metric.name} metric, ${metric.status ?? 'no status'}. Show pay detail`}
      onClick={(e) => onOpen(metric.id, e)}
      onMouseEnter={() => setPlayToken((t) => t + 1)}
    >
      <MetricCard metric={metric} playToken={playToken} />
    </button>
  )
}
