'use client'

import { useState } from 'react'
import type { MetricCardData, MetricStatus } from '@/lib/types'
import { HoverPlayLottie } from './hover-play-lottie'
import { StatusPill } from '@/components/daily-drop/status-pill'

/** Per-asset optical balance — subjects aren't framed identically. */
const ILLUSTRATION_TWEAKS: Record<string, string> = {
  '/cakes/love.png': 'metric-card-illustration--love',
  '/cakes/quality.png': 'metric-card-illustration--quality',
  '/cakes/sales.png': 'metric-card-illustration--sales',
  '/cakes/time.png': 'metric-card-illustration--time',
}

/** Only the primary value uses status color; supporting copy stays on-surface. */
const VALUE_COLOR: Record<MetricStatus, string> = {
  'on-track': '#7fe3a3',
  'at-risk': '#f0cf6b',
  behind: '#f7a3a3',
}

/**
 * Pit Stop / shared metric card. Anatomy matches Daily Drop: Name + StatusPill
 * on one row, then Value+Unit, then supporting lines.
 */
export function MetricCard({
  metric,
  playOnMount = false,
}: {
  metric: MetricCardData
  playOnMount?: boolean
}) {
  const illustrationClass = metric.illustration
    ? ILLUSTRATION_TWEAKS[metric.illustration] ?? ''
    : ''
  const [playToken, setPlayToken] = useState(0)

  return (
    <div
      className="metric-card"
      onMouseEnter={() => setPlayToken((token) => token + 1)}
    >
      {metric.lottieSrc ? (
        <HoverPlayLottie
          src={metric.lottieSrc}
          playToken={playToken}
          playOnMount={playOnMount}
          className={`metric-card-illustration ${illustrationClass}`}
        />
      ) : metric.illustration ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={metric.illustration}
          alt=""
          aria-hidden="true"
          className={`metric-card-illustration ${illustrationClass}`}
          draggable={false}
        />
      ) : null}
      <div className="metric-card-content">
        <StatusPill status={metric.status} />
        <div className="metric-card-title-row">
          <span className="metric-card-title">{metric.name}</span>
        </div>
        <div className="metric-card-value-row">
          <span className="metric-card-value" style={{ color: VALUE_COLOR[metric.status] }}>
            {metric.value}
          </span>
          {metric.unit && <span className="metric-card-unit">{metric.unit}</span>}
        </div>
        {metric.target && <p className="metric-card-target">{metric.target}</p>}
        {metric.level && <p className="metric-card-level">{metric.level}</p>}
      </div>
    </div>
  )
}
