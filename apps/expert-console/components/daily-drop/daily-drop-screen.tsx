'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Box, Group, SegmentedControl, SimpleGrid, Stack, Text } from '@mantine/core'
import { ExpertAvatar } from '@/components/shared/expert-avatar'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { EXPERT } from '@/lib/fixtures'
import {
  lastUpdated,
  metricsByDay,
  METRIC_EMOJI,
  METRIC_PROSE,
  type DayKey,
  type Metric,
  type MetricId,
} from '@/lib/daily-drop-data'
import { computeTotalEarnings } from '@/lib/pay-model'
import {
  DAILY_DROP_INTRO,
  EASE_CONTAINER_MORPH,
  EASE_PANEL_IN,
  LEADERBOARD_MOTION as M,
  METRIC_PANEL,
} from '@/lib/motion'
import { useConsoleStore } from '@/store/console-store'
import { useHubPanelStore } from '@/store/hub-panel-store'
import { TopBar } from '@/components/shared/top-bar'
import { HubRightPanel } from './hub-right-panel'
import { LeaderboardStrip } from './leaderboard-strip'
import { LiveBadge } from './live-badge'
import { MetricCard } from './metric-card'
import { MetricFlipCard } from './metric-flip-card'
import { MetricPayBack } from './metric-pay-back'
import { WaitingPill } from './waiting-pill'
import classes from './daily-drop.module.css'

gsap.registerPlugin(useGSAP)

const OFF_CALL = new Set(['daily-drop', 'available'])

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function renderGreetingSummary(metrics: Metric[]) {
  const wins = metrics.filter((m) => m.status === 'on-track')
  const focus = metrics
    .filter((m) => m.status === 'behind' || m.status === 'at-risk')
    .sort((a, b) => (a.status === 'behind' ? 0 : 1) - (b.status === 'behind' ? 0 : 1))

  const tag = (m: Metric) => `${METRIC_EMOJI[m.id]} ${cap(METRIC_PROSE[m.id])}`

  const joinTags = (items: Metric[]) => {
    if (items.length === 1) return tag(items[0])
    if (items.length === 2) return `${tag(items[0])} and ${tag(items[1])}`
    return `${items.slice(0, -1).map(tag).join(', ')}, and ${tag(items[items.length - 1])}`
  }

  if (focus.length === 0) {
    return (
      <span className={classes.metricOnTrack}>
        All your metrics are on track — great day!
      </span>
    )
  }

  const focusVerb = focus.length > 1 ? 'are' : 'is'

  if (wins.length === 0) {
    return (
      <>
        {'Your '}
        <span className={classes.metricAtRisk}>
          {joinTags(focus)} {focusVerb} at risk
        </span>
        .
      </>
    )
  }

  const winsVerb = wins.length > 1 ? 'are' : 'is'
  return (
    <>
      {'Your '}
      <span className={classes.metricOnTrack}>
        {joinTags(wins)} {winsVerb} on track
      </span>
      {', but your '}
      <span className={classes.metricAtRisk}>
        {joinTags(focus)} {focusVerb} at risk
      </span>
      .
    </>
  )
}

export function DailyDropScreen() {
  const shiftPhase = useConsoleStore((s) => s.shiftPhase)
  const agentStatus = useConsoleStore((s) => s.agentStatus)
  const accessories = useConsoleStore((s) => s.avatarAccessories)
  const patch = useConsoleStore((s) => s.patch)
  const [day, setDay] = useState<DayKey>('yesterday')

  const contentRef = useRef<HTMLDivElement>(null)

  const closePanel = useHubPanelStore((s) => s.closePanel)

  const metrics = metricsByDay[day]

  const totalEarnings = computeTotalEarnings(
    Object.fromEntries(metrics.map((m) => [m.id, m.payValue])) as Partial<Record<MetricId, number>>,
  )

  // Modal flip state — same openId/mountedId pair as the leaderboard.
  const [openId, setOpenId] = useState<MetricId | null>(null)
  const [mountedId, setMountedId] = useState<MetricId | null>(null)

  const sourceRef = useRef<HTMLElement | null>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const titleId = useId()

  const openMetric = mountedId != null ? metrics.find((m) => m.id === mountedId) : undefined

  const openCard = useCallback(
    (id: MetricId, event: React.MouseEvent) => {
      if (openId != null) return
      sourceRef.current = (event.currentTarget as HTMLElement).closest('button')
      setMountedId(id)
      setOpenId(id)
    },
    [openId],
  )

  const requestClose = useCallback(() => setOpenId(null), [])

  // Close on day change.
  const prevDayRef = useRef(day)
  useEffect(() => {
    if (day !== prevDayRef.current) {
      prevDayRef.current = day
      setOpenId(null)
    }
  }, [day])

  const isOffCall = OFF_CALL.has(shiftPhase)

  useEffect(() => {
    if (!isOffCall) closePanel()
  }, [isOffCall, closePanel])

  // Body scroll-lock while a card is open.
  useLayoutEffect(() => {
    if (mountedId == null) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mountedId])

  // Pluck-expand-flip — mirrors leaderboard-strip.tsx.
  useLayoutEffect(() => {
    const panel = panelRef.current
    const scrim = scrimRef.current
    const body = bodyRef.current
    const source = sourceRef.current
    if (!panel || !scrim || !body || !source) return

    tlRef.current?.kill()
    const reduced = prefersReducedMotion()
    const base = scrim.getBoundingClientRect()
    const toLocal = (rect: DOMRect) => ({
      left: rect.left - base.left,
      top: rect.top - base.top,
      width: rect.width,
      height: rect.height,
    })
    const width = Math.min(METRIC_PANEL.width, base.width - 40)
    const height = Math.min(METRIC_PANEL.height, base.height - 48)
    const target = {
      left: (base.width - width) / 2,
      top: (base.height - height) / 2,
      width,
      height,
    }

    if (openId != null) {
      const from = toLocal(source.getBoundingClientRect())

      gsap.set(panel, {
        position: 'fixed',
        margin: 0,
        transformPerspective: 900,
        ...from,
        rotationY: 0,
        scale: 1,
        y: 0,
        opacity: 1,
      })
      gsap.set(scrim, { opacity: reduced ? 1 : 0 })
      gsap.set(body, { autoAlpha: reduced ? 1 : 0, y: reduced ? 0 : 8 })

      if (reduced) {
        gsap.set(panel, { ...target, rotationY: 180 })
        panel.focus()
        return
      }

      const tl = gsap.timeline({ onComplete: () => panel.focus() })
      tl.to(scrim, { opacity: 1, duration: M.scrimIn, ease: 'power1.out' }, 0)
      tl.to(panel, { y: -14, scale: 1.06, duration: M.pluck, ease: 'power2.out' }, 0)
      tl.to(
        panel,
        {
          ...target,
          rotationY: 180,
          y: 0,
          scale: 1,
          duration: M.flip,
          ease: EASE_CONTAINER_MORPH,
        },
        M.pluck,
      )
      tl.to(
        body,
        { autoAlpha: 1, y: 0, duration: M.detailIn, ease: EASE_PANEL_IN },
        M.pluck + M.flip * M.detailStart,
      )
      tlRef.current = tl
    } else {
      const back = toLocal(source.getBoundingClientRect())
      const restore = () => {
        ;(source as HTMLElement).focus()
        setMountedId(null)
      }

      if (reduced) {
        restore()
        return
      }

      const tl = gsap.timeline({ onComplete: restore })
      tl.to(body, { autoAlpha: 0, y: 6, duration: 0.16, ease: 'power1.in' }, 0)
      tl.to(
        panel,
        {
          ...back,
          rotationY: 0,
          y: -10,
          scale: 1.04,
          duration: M.flipBack,
          ease: EASE_CONTAINER_MORPH,
        },
        0,
      )
      tl.to(panel, { y: 0, scale: 1, duration: M.land, ease: 'power2.in' }, M.flipBack)
      tl.to(scrim, { opacity: 0, duration: M.scrimOut, ease: 'power1.in' }, M.flipBack * 0.5)
      tlRef.current = tl
    }

    return () => {
      tlRef.current?.kill()
    }
  }, [openId])

  useLayoutEffect(
    () => () => {
      tlRef.current?.kill()
    },
    [],
  )

  useGSAP(
    () => {
      if (!isOffCall) return
      const el = contentRef.current
      if (!el) return

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(el, { autoAlpha: 1 })
        return
      }

      gsap
        .timeline()
        .set(el, { autoAlpha: 0 })
        .to(
          el,
          {
            autoAlpha: 1,
            duration: DAILY_DROP_INTRO.contentIn,
            ease: EASE_PANEL_IN,
            onComplete: () => {
              gsap.set(el, { clearProps: 'opacity,visibility' })
            },
          },
          DAILY_DROP_INTRO.pillIn + DAILY_DROP_INTRO.centerHold,
        )
    },
    { dependencies: [isOffCall], revertOnUpdate: true },
  )

  if (!isOffCall) return null

  return (
    <Box className={classes.page}>
      <div ref={contentRef} className={classes.pageContent}>
        <TopBar />

        <div className={classes.phaseStage}>
          <div className={classes.phaseLayer}>
            <Box className={classes.body}>
              <Box component="main" className={classes.hub}>
                <Box className={classes.hubScroll}>
                  <Box className={classes.hubContent}>
                    <div className={classes.greeting}>
                      <p className={classes.greetingText}>
                        <span className={classes.greetingName}>
                          Hi,{' '}
                          <button
                            type="button"
                            aria-label="Customize your photo"
                            onClick={() => patch({ avatarCustomizerOpen: true })}
                            className={`motion-press ${classes.greetingAvatarInline}`}
                          >
                            <ExpertAvatar photo={EXPERT.photo} accessories={accessories} size="md" />
                          </button>{' '}
                          {EXPERT.firstName}.
                        </span>{' '}
                        {renderGreetingSummary(metrics)}
                      </p>
                    </div>

                    <Stack gap="md">
                      <Stack gap="sm" className={classes.metricsHeader}>
                        <Group gap={10} align="baseline" wrap="nowrap" style={{ minWidth: 0 }}>
                          <Text className={classes.metricsTitle}>My stats</Text>
                          {totalEarnings > 0 && (
                            <Text className={classes.metricsEarnings}>
                              · ${totalEarnings.toLocaleString()} earned this pay period
                            </Text>
                          )}
                        </Group>
                        <Group justify="space-between" align="center" wrap="nowrap">
                          <SegmentedControl
                            classNames={{
                              root: classes.segmented,
                              label: classes.segmentedLabel,
                              indicator: classes.segmentedIndicator,
                            }}
                            value={day}
                            onChange={(value) => setDay(value as DayKey)}
                            data={[
                              { label: 'Yesterday', value: 'yesterday' },
                              { label: 'Today', value: 'today' },
                            ]}
                          />
                          {day === 'today' ? (
                            <LiveBadge />
                          ) : (
                            <Text className={classes.lastUpdated}>{lastUpdated[day]}</Text>
                          )}
                        </Group>
                      </Stack>

                      <SimpleGrid type="container" cols={{ base: 1, '440px': 2, '680px': 3 }} spacing="md">
                        {metrics.map((metric) => (
                          <MetricFlipCard
                            key={metric.id}
                            metric={metric}
                            open={openId === metric.id}
                            onOpen={openCard}
                          />
                        ))}
                      </SimpleGrid>
                    </Stack>

                    <LeaderboardStrip />
                  </Box>
                </Box>
              </Box>

              <div className={classes.railDivider} />
              <Box component="aside" className={classes.rail}>
                <HubRightPanel day={day} />
              </Box>
            </Box>

            {openMetric && (
              <div
                ref={scrimRef}
                className={classes.metricScrim}
                onClick={(event) => {
                  if (event.target === event.currentTarget && !tlRef.current?.isActive())
                    requestClose()
                }}
              >
                <div
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={titleId}
                  tabIndex={-1}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      event.preventDefault()
                      requestClose()
                    }
                  }}
                  className={classes.metricModal}
                >
                  <div
                    className={`${classes.metricModalFace} ${classes.card} ${classes.metricCard}`}
                    aria-hidden
                  >
                    <MetricCard metric={openMetric} />
                  </div>

                  <div className={`${classes.metricModalFace} ${classes.metricModalBack}`}>
                    <div ref={bodyRef} className={classes.metricModalBody}>
                      <MetricPayBack metric={openMetric} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {(agentStatus === 'offline' || agentStatus === 'available') && <WaitingPill />}
    </Box>
  )
}
