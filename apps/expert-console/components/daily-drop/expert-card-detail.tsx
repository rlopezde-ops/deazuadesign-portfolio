'use client'

import { useId, type RefObject } from 'react'
import { CaretDown, CaretUp, Crown, X } from '@phosphor-icons/react'
import {
  Area,
  ComposedChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ComposedAvatar } from '@/components/shared/composed-avatar'
import type { PlacedAccessory } from '@/lib/avatar-items'
import {
  abbreviateName,
  expertDetails,
  getTrendDates,
  type LeaderboardRow,
  TESTIMONIAL_PLAN,
  YOU_ID,
} from '@/lib/daily-drop-data'
import classes from './daily-drop.module.css'

/** Plot plus the date axis beneath it. */
const GRAPH_HEIGHT = 112

/** Hover readout: the sample's date and what the score was on it. */
function TrendTooltip({
  active,
  payload,
  label,
  boardLabel,
}: {
  active?: boolean
  // Loose on purpose: Recharts types a payload entry's `dataKey` as possibly an
  // accessor function and its `value` as string | number | array, so narrowing
  // here is cheaper than restating their generics.
  payload?: ReadonlyArray<{ dataKey?: unknown; value?: unknown }>
  label?: string | number
  boardLabel: string
}) {
  const score = payload?.find((entry) => entry.dataKey === 'value')?.value
  if (!active || typeof score !== 'number') return null

  return (
    <div className={classes.detailTooltip}>
      <p className={classes.detailTooltipDate}>{label}</p>
      <p className={classes.detailTooltipValue}>
        {score} <span className={classes.detailTooltipUnit}>{boardLabel}</span>
      </p>
    </div>
  )
}

/**
 * Four weeks of twice-weekly samples: a filled line for how the month went, a
 * dashed least-squares fit for where it's heading, and dated ticks so the shape is
 * anchored to actual points in time. Hovering reads out the sample under the
 * pointer — the values are net enrollments, which is sound because the strip this
 * card opens from is pinned to that board (`STRIP_BOARD`).
 *
 * The y-axis stays hidden: the dates orient the reader, the numbers come from the
 * tooltip, and an axis of unlabelled gridlines would only crowd a panel this size.
 */
function TrendGraph({ trend, boardLabel }: { trend: number[]; boardLabel: string }) {
  // useId can contain characters that aren't safe in a url(#…) reference.
  const gradientId = `trendFill${useId().replace(/[^a-zA-Z0-9]/g, '')}`

  const n = trend.length
  const dates = getTrendDates(n)

  const sumI = ((n - 1) * n) / 2
  const sumV = trend.reduce((total, v) => total + v, 0)
  const sumII = trend.reduce((total, _, i) => total + i * i, 0)
  const sumIV = trend.reduce((total, v, i) => total + i * v, 0)
  const slope = (n * sumIV - sumI * sumV) / (n * sumII - sumI * sumI)
  const intercept = (sumV - slope * sumI) / n

  const data = trend.map((value, i) => ({
    date: dates[i],
    value,
    fit: Number((intercept + slope * i).toFixed(2)),
  }))

  // Headroom so the line and its fit never touch the plot's edges.
  const min = Math.min(...trend, ...data.map((d) => d.fit))
  const max = Math.max(...trend, ...data.map((d) => d.fit))
  const headroom = Math.max(1, (max - min) * 0.2)

  return (
    <div className={classes.detailGraph}>
      <ResponsiveContainer width="100%" height={GRAPH_HEIGHT}>
        <ComposedChart data={data} margin={{ top: 8, right: 6, bottom: 0, left: 6 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b233ff" stopOpacity={0.34} />
              <stop offset="100%" stopColor="#b233ff" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#716e78', fontSize: 10 }}
            // Thin the eight samples down to whatever fits rather than jamming
            // every date in; start and end always survive so the window reads.
            interval="preserveStartEnd"
            minTickGap={26}
            tickMargin={6}
          />
          <YAxis hide domain={[min - headroom, max + headroom]} />

          <Tooltip
            content={(props) => <TrendTooltip {...props} boardLabel={boardLabel} />}
            cursor={{ stroke: 'rgba(232, 230, 237, 0.24)', strokeWidth: 1 }}
          />

          {/* Three passes to keep the old layering: fill, then the fit, then the
              score line on top of both. */}
          <Area
            type="linear"
            dataKey="value"
            stroke="none"
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
          <Line
            type="linear"
            dataKey="fit"
            stroke="rgba(232, 230, 237, 0.28)"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
          <Line
            type="linear"
            dataKey="value"
            stroke="#b233ff"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#ffffff', stroke: '#b233ff', strokeWidth: 2 }}
            isAnimationActive={false}
          />

          {/* "Now" — the marker the hand-rolled sparkline ended on. Last in the
              children so it paints over the series. */}
          <ReferenceDot
            x={dates[n - 1]}
            y={trend[n - 1]}
            r={3.5}
            fill="#ffffff"
            stroke="#221f28"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * The back of a leaderboard card: who it is, how their pay period went, the past
 * month as a shape, and one customer's words. Sized by the panel that flips to
 * reveal it (`leaderboard-strip.tsx`), so it lays out to whatever box it's given.
 */
export function ExpertCardDetail({
  row,
  rank,
  boardLabel,
  youAccessories,
  titleId,
  closeRef,
  onClose,
}: {
  row: LeaderboardRow
  rank: number
  /** The board's unit, e.g. "net enrollments". */
  boardLabel: string
  youAccessories: PlacedAccessory[]
  titleId: string
  closeRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
}) {
  const isYou = row.id === YOU_ID
  const detail = expertDetails[row.id]
  const name = isYou ? 'You' : abbreviateName(row.name)
  const spots = detail?.spotsChange ?? 0
  const moved = Math.abs(spots)

  return (
    <>
      <header className={classes.detailCardHeader}>
        <div className={classes.detailAvatar}>
          {row.lastWeekWinner && (
            <span className={classes.expertCrown} aria-hidden>
              <Crown size={12} weight="fill" />
            </span>
          )}
          <ComposedAvatar
            photo={row.photo}
            accessories={isYou ? youAccessories : row.accessories ?? []}
            photoClassName={isYou ? classes.expertPhotoYou : ''}
          />
        </div>

        <div className={classes.detailIdentity}>
          <h2 id={titleId} className={classes.detailName}>
            {name}
          </h2>
          <p className={classes.detailMeta}>
            Rank {rank} · {row.score} {boardLabel}
          </p>
        </div>

        <button
          ref={closeRef}
          type="button"
          aria-label="Close card"
          onClick={onClose}
          className={classes.detailClose}
        >
          <X size={16} />
        </button>
      </header>

      <div className={classes.detailStat}>
        <span
          className={`${classes.detailSpots} ${
            spots > 0
              ? classes.standingsMomentumUp
              : spots < 0
                ? classes.standingsMomentumDown
                : classes.standingsMomentumFlat
          }`}
        >
          {spots > 0 && <CaretUp size={12} weight="fill" aria-hidden />}
          {spots < 0 && <CaretDown size={12} weight="fill" aria-hidden />}
          {/* Own span so the flex gap only separates it from the caret. */}
          <span>
            {spots === 0
              ? 'Even'
              : `${spots > 0 ? '+' : '−'}${moved} spot${moved === 1 ? '' : 's'}`}
          </span>
        </span>
        <span className={classes.detailStatCaption}>
          {spots === 0 ? 'since last pay period' : 'from last pay period'}
        </span>
      </div>

      <section className={classes.detailTrend}>
        <h3 className={classes.detailSectionLabel}>Past month</h3>
        {detail && <TrendGraph trend={detail.trend} boardLabel={boardLabel} />}
      </section>

      {/*
        Testimonial card: who said it, what they're on, then what they said — the
        caption leads the figure (legal as its first child) so the reading order
        matches. A raised surface inside the panel rather than a rule, which is how
        this reads as a quote lifted out of a review feed.
      */}
      {detail && (
        <figure className={classes.detailQuote}>
          <figcaption>
            <span className={classes.detailQuoteName}>{detail.author}</span>
            <span className={classes.detailQuotePlan}>{TESTIMONIAL_PLAN}</span>
          </figcaption>
          <blockquote className={classes.detailQuoteText}>
            {`“${detail.quote}”`}
          </blockquote>
        </figure>
      )}
    </>
  )
}
