'use client'

import { Box, Flex, SegmentedControl, Text } from '@mantine/core'
import { CaretDown, CaretUp, Crown } from '@phosphor-icons/react'
import type { PlacedAccessory } from '@/lib/avatar-items'
import {
  abbreviateName,
  getMetricsDateRange,
  leaderboardConfigs,
  leaderboards,
  type LeaderboardMetric,
  type LeaderboardRow,
  YOU_ID,
} from '@/lib/daily-drop-data'
import { useConsoleStore } from '@/store/console-store'
import { useLeaderboardSelectionStore } from '@/store/leaderboard-store'
import { ExpertAvatar } from '@/components/shared/expert-avatar'
import classes from './daily-drop.module.css'

/**
 * Places moved since the last refresh: green climb, red drop, grey hold.
 *
 * Exported so the dashboard strip (`leaderboard-strip.tsx`) shows the same cue
 * with the same colours. It fills its container's width and right-aligns, so a
 * caller that isn't the 52px metrics column should wrap it in a sized slot.
 */
export function Momentum({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <span className={`${classes.standingsMomentum} ${classes.standingsMomentumFlat}`} aria-hidden>
        —
      </span>
    )
  }
  const up = delta > 0
  return (
    <span
      className={`${classes.standingsMomentum} ${up ? classes.standingsMomentumUp : classes.standingsMomentumDown}`}
    >
      {up ? <CaretUp size={10} weight="fill" aria-hidden /> : <CaretDown size={10} weight="fill" aria-hidden />}
      <span className={classes.standingsMomentumValue}>{Math.abs(delta)}</span>
    </span>
  )
}

/**
 * One competitive row on a shared 4-column grid:
 * rank (quiet) · avatar · identity · score + momentum (primary).
 */
function StandingRow({
  row,
  rank,
  youAccessories,
}: {
  row: LeaderboardRow
  rank: number
  /** Live avatar accessories for the signed-in expert, mirrored from the store. */
  youAccessories: PlacedAccessory[]
}) {
  const isYou = row.id === YOU_ID
  // "You" mirrors the live avatar from the customizer; everyone else is static.
  const accessories = isYou ? youAccessories : row.accessories ?? []

  return (
    <div
      data-panel-row
      className={`${classes.standingsRow} ${isYou ? classes.standingsRowYou : ''}`}
    >
      <span className={classes.standingsRank}>{rank}</span>

      <div className={classes.standingsAvatarWrap}>
        {row.lastWeekWinner && (
          <span className={classes.standingsCrown} aria-hidden>
            <Crown size={11} />
          </span>
        )}
        <ExpertAvatar photo={row.photo} accessories={accessories} size="sm" />
      </div>

      <div className={classes.standingsIdentity}>
        <span className={classes.standingsName}>{isYou ? 'You' : abbreviateName(row.name)}</span>
        {row.lastWeekWinner && (
          <span className={classes.standingsWinnerBadge}>Last week&apos;s leader</span>
        )}
      </div>

      <div className={classes.standingsMetrics}>
        <span className={classes.standingsScore}>{row.score}</span>
        <Momentum delta={row.delta} />
      </div>
    </div>
  )
}

/**
 * Full standings for the floating rail.
 *
 * Hierarchy for motivation:
 * 1. Score (primary) + rank (quiet anchor)
 * 2. Face + name
 * 3. Momentum / last-week badge / Live in header
 */
export function LeaderboardPanel() {
  const metric = useLeaderboardSelectionStore((s) => s.metric)
  const setMetric = useLeaderboardSelectionStore((s) => s.setMetric)
  // The signed-in expert's row reflects whatever they've placed in the customizer.
  const youAccessories = useConsoleStore((s) => s.avatarAccessories)

  const config = leaderboardConfigs.find((c) => c.metric === metric) ?? leaderboardConfigs[0]
  const rows = leaderboards[config.metric]
  const description = config.description.replace('$METRICS_DATE_RANGE', getMetricsDateRange())

  return (
    <Flex direction="column" className={classes.standings}>
      <Box className={classes.standingsIntro} data-panel-row>
        {leaderboardConfigs.length > 1 && (
          <SegmentedControl
            classNames={{
              root: classes.segmented,
              label: classes.segmentedLabel,
              indicator: classes.segmentedIndicator,
            }}
            value={config.metric}
            onChange={(value) => setMetric(value as LeaderboardMetric)}
            data={leaderboardConfigs.map((board) => ({
              value: board.metric,
              label: board.controlText,
            }))}
          />
        )}

        <Text className={classes.standingsDescription}>{description}</Text>
      </Box>

      <div className={classes.standingsList}>
        {rows.map((row, index) => (
          <StandingRow key={row.id} row={row} rank={index + 1} youAccessories={youAccessories} />
        ))}
      </div>
    </Flex>
  )
}
