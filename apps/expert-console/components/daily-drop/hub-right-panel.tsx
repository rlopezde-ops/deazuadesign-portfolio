'use client'

import { useRef, useState } from 'react'
import { ActionIcon, Group, Paper, ScrollArea, Title } from '@mantine/core'
import { X } from '@phosphor-icons/react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { DayKey } from '@/lib/daily-drop-data'
import { EASE_PANEL_IN, EASE_PANEL_OUT, PANEL_MOTION } from '@/lib/motion'
import { HUB_PANEL_TITLES, useHubPanelStore, type HubPanelView } from '@/store/hub-panel-store'
import { AssistDock } from '@/components/assist/assist-dock'
import { LeaderboardPanel } from './leaderboard-panel'
import { LiveBadge } from './live-badge'
import { SchedulePanel } from './schedule-panel'
import classes from './daily-drop.module.css'

gsap.registerPlugin(useGSAP)

/**
 * Right rail: schedule stays mounted underneath; expanded views ride a floating Paper that slides
 * in from the right with a scrim and a subtle push-back on the schedule.
 */
export function HubRightPanel({ day }: { day: DayKey }) {
  const view = useHubPanelStore((s) => s.view)
  const closePanel = useHubPanelStore((s) => s.closePanel)

  const railRef = useRef<HTMLDivElement>(null)
  const scheduleRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const prevViewRef = useRef<HubPanelView | null>(null)
  const tweenRef = useRef<gsap.core.Timeline | null>(null)
  // Keeps panel body mounted through the exit animation after the store clears `view`.
  const [renderedView, setRenderedView] = useState<HubPanelView | null>(view)

  useGSAP(
    () => {
      const panel = panelRef.current
      const scrim = scrimRef.current
      const schedule = scheduleRef.current
      const body = bodyRef.current
      if (!panel || !scrim || !schedule) return

      const parkClosed = () => {
        gsap.set(panel, {
          xPercent: 104,
          scale: 0.97,
          autoAlpha: 0,
          pointerEvents: 'none',
        })
        gsap.set(scrim, { autoAlpha: 0, pointerEvents: 'none' })
        gsap.set(schedule, { x: 0, scale: 1, transformOrigin: '50% 50%' })
      }

      const openSettled = () => {
        gsap.set(panel, {
          xPercent: 0,
          scale: 1,
          autoAlpha: 1,
          pointerEvents: 'auto',
        })
        gsap.set(scrim, { autoAlpha: 1, pointerEvents: 'auto' })
        gsap.set(schedule, { x: -8, scale: 0.985, transformOrigin: '50% 50%' })
      }

      const staggerRows = (fromY: number, duration: number, delay = 0) => {
        const rows = body?.querySelectorAll('[data-panel-row]')
        if (!rows?.length) return
        gsap.fromTo(
          rows,
          { y: fromY, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration,
            stagger: PANEL_MOTION.rowStagger,
            ease: EASE_PANEL_IN,
            delay,
          },
        )
      }

      const mm = gsap.matchMedia()
      mm.add(
        {
          isMotion: '(prefers-reduced-motion: no-preference)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const reduceMotion = Boolean(
            (context.conditions as { reduceMotion?: boolean } | undefined)?.reduceMotion,
          )
          const prev = prevViewRef.current
          const next = view

          tweenRef.current?.kill()
          tweenRef.current = null

          // Initial / no-op settle
          if (prev === next) {
            if (next == null) parkClosed()
            else openSettled()
            return
          }

          // Enter
          if (prev == null && next != null) {
            setRenderedView(next)
            prevViewRef.current = next
            if (reduceMotion) {
              openSettled()
              return
            }
            gsap.set(panel, {
              xPercent: 104,
              scale: 0.97,
              autoAlpha: 0,
              pointerEvents: 'auto',
            })
            gsap.set(scrim, { autoAlpha: 0, pointerEvents: 'auto' })
            gsap.set(schedule, { x: 0, scale: 1, transformOrigin: '50% 50%' })

            const tl = gsap.timeline()
            tweenRef.current = tl
            tl.to(scrim, { autoAlpha: 1, duration: PANEL_MOTION.scrimIn, ease: 'power2.out' }, 0)
            tl.to(
              schedule,
              {
                x: -8,
                scale: 0.985,
                duration: PANEL_MOTION.inDuration,
                ease: EASE_PANEL_IN,
              },
              0,
            )
            tl.to(
              panel,
              {
                xPercent: 0,
                scale: 1,
                autoAlpha: 1,
                duration: PANEL_MOTION.inDuration,
                ease: EASE_PANEL_IN,
              },
              0,
            )
            // Wait a frame so the new body rows are in the DOM for the stagger.
            gsap.delayedCall(0.02, () => staggerRows(12, 0.36, PANEL_MOTION.rowStart))
            return
          }

          // Exit
          if (prev != null && next == null) {
            prevViewRef.current = null
            if (reduceMotion) {
              parkClosed()
              setRenderedView(null)
              return
            }
            const tl = gsap.timeline({
              onComplete: () => {
                setRenderedView(null)
                parkClosed()
              },
            })
            tweenRef.current = tl
            tl.to(
              panel,
              {
                xPercent: 104,
                scale: 0.97,
                autoAlpha: 0,
                duration: PANEL_MOTION.outDuration,
                ease: EASE_PANEL_OUT,
              },
              0,
            )
            tl.to(scrim, { autoAlpha: 0, duration: PANEL_MOTION.scrimOut, ease: 'power2.in' }, 0)
            tl.to(
              schedule,
              {
                x: 0,
                scale: 1,
                duration: PANEL_MOTION.outDuration,
                ease: EASE_PANEL_OUT,
              },
              0,
            )
            return
          }

          // Swap
          if (prev != null && next != null) {
            setRenderedView(next)
            prevViewRef.current = next
            openSettled()
            if (reduceMotion) return
            gsap.delayedCall(0.02, () => staggerRows(8, PANEL_MOTION.swapDuration))
          }
        },
      )

      return () => {
        tweenRef.current?.kill()
        mm.revert()
      }
    },
    { dependencies: [view], scope: railRef },
  )

  const title = renderedView != null ? HUB_PANEL_TITLES[renderedView] : ''

  return (
    <div ref={railRef} className={classes.railInner}>
      <div ref={scheduleRef} className={classes.scheduleLayer}>
        <SchedulePanel />
      </div>

      <div className={classes.railAssist}>
        <AssistDock scene="daily-drop" />
      </div>

      <button
        type="button"
        ref={scrimRef}
        className={classes.railScrim}
        aria-label="Close panel"
        onClick={closePanel}
      />

      <div ref={panelRef} className={classes.floatingPanel}>
        <Paper radius={16} withBorder shadow="none" className={classes.floatingPanelSurface}>
          <Group
            gap="xs"
            h={56}
            wrap="nowrap"
            justify="space-between"
            className={classes.panelHeader}
            data-panel-row
          >
            <Group gap="sm" align="center" wrap="nowrap" style={{ minWidth: 0 }}>
              <Title order={4} className={classes.panelHeaderTitle}>
                {title}
              </Title>
              {renderedView === 'leaderboard' && <LiveBadge />}
            </Group>
            <ActionIcon variant="subtle" color="dark" aria-label="Close" onClick={closePanel}>
              <X size={18} />
            </ActionIcon>
          </Group>

          {/* No `offsetScrollbars`: it reserves a right gutter that breaks the 16px inset. */}
          <ScrollArea className={classes.panelScroll} type="hover" scrollbars="y">
            <div ref={bodyRef} className={classes.panelBody}>
              {renderedView === 'leaderboard' && <LeaderboardPanel />}
            </div>
          </ScrollArea>
        </Paper>
      </div>
    </div>
  )
}
