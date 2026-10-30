'use client'

import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import { Group, Stack, Text } from '@mantine/core'
import { CaretLeft, CaretRight, Crown } from '@phosphor-icons/react'
import gsap from 'gsap'
import { ComposedAvatar } from '@/components/shared/composed-avatar'
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
import { EASE_CONTAINER_MORPH, EASE_PANEL_IN, LEADERBOARD_MOTION as M } from '@/lib/motion'
import { useConsoleStore } from '@/store/console-store'
import { useHubPanelStore } from '@/store/hub-panel-store'
import { ExpertCardDetail } from './expert-card-detail'
import { Momentum } from './leaderboard-panel'
import { LiveBadge } from './live-badge'
import classes from './daily-drop.module.css'

/**
 * Detail panel at rest, clamped to the stage on short or narrow viewports.
 *
 * The height is cut to what the content needs — header 40 · stat 38 · trend 110 ·
 * testimonial card 120 (two lines at its longest quote), inside 18/20 padding and
 * 16px gaps = 440. The body is clipped rather than scrolled, so trimming this cuts
 * the bottom off the testimonial; and the card is floored, so extra height opens a
 * gap above it rather than padding the panel.
 */
const PANEL = { width: 480, height: 464 }

/**
 * Presenter shortcuts (`usePresenterKeys`) listen on `window` and their typing
 * guard won't exempt a dialog's controls, so while a card is open these are
 * stopped at the panel: React's root listener fires before `window`. Escape is
 * handled explicitly and is deliberately absent — it isn't a presenter key.
 */
const PRESENTER_KEYS = new Set([' ', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'f', 'F', 'r', 'R', 'h', 'H'])

/**
 * The board the page strip shows, fixed.
 *
 * It used to follow `useLeaderboardSelectionStore` alongside the rail's standings,
 * so switching the rail's Sales/Calls tabs re-sorted the row behind the sidebar —
 * the cards resequenced, the subhead changed unit, and the row snapped back to
 * rank 1 under a panel the expert was reading. Those tabs now only change the
 * rail's own list; the page stays put.
 */
const STRIP_BOARD: LeaderboardMetric = 'sales'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * A card's face: rank + momentum on the shoulder line, the portrait, who it is,
 * then the score. The number carries no unit — the strip header names the board
 * once, which keeps nine cards from repeating it nine times.
 *
 * Rendered both in the row and on the front of the flip panel, so the card that
 * lifts out is the same card you clicked.
 */
function ExpertCardFace({
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
  // The winner's badge outranks your own name — you already know your name.
  const sub = row.lastWeekWinner ? "Last week's leader" : isYou ? abbreviateName(row.name) : null

  return (
    <>
      <div className={classes.expertCardShoulder}>
        <span className={classes.expertRank}>{rank}</span>
        {/* Momentum sizes itself to its container; give it the slot it expects. */}
        <span className={classes.expertDeltaSlot}>
          <Momentum delta={row.delta} />
        </span>
      </div>

      {/*
        No `overflow: hidden` anywhere on this stack: accessories deliberately
        overhang the photo (a hat sits above the crown of the head), and the
        card's padding + shoulder line leave them room.
      */}
      <div className={classes.expertAvatar}>
        {row.lastWeekWinner && (
          <span className={classes.expertCrown} aria-hidden>
            <Crown size={12} weight="fill" />
          </span>
        )}
        <ComposedAvatar
          photo={row.photo}
          accessories={accessories}
          photoClassName={isYou ? classes.expertPhotoYou : ''}
        />
      </div>

      <div className={classes.expertIdentity}>
        <span className={classes.expertName}>{isYou ? 'You' : abbreviateName(row.name)}</span>
        {sub && (
          <span
            className={`${classes.expertSub} ${row.lastWeekWinner ? classes.expertSubWinner : ''}`}
          >
            {sub}
          </span>
        )}
      </div>

      <span className={classes.expertScore}>{row.score}</span>
    </>
  )
}

/**
 * Team leaderboard on the morning paper: the whole board as a horizontal strip
 * of expert cards, so the expert reads the shape of the race (who leads, where
 * they sit in it) without opening anything.
 *
 * Three behaviours ride on the row:
 *
 * 1. Overflow. The strip scrolls rather than wraps — a second row would read as
 *    a separate group and break the single ranked line. The edge it continues
 *    past fades out and an arrow appears on that side only, both driven from one
 *    measurement (`sync`) re-run on scroll and resize.
 * 2. Proximity. The row answers the cursor like a dock (see LEADERBOARD_MOTION):
 *    the card under the pointer grows most, its neighbours a little, all through
 *    `gsap.quickTo` so the row chases the pointer and settles behind it.
 * 3. Pluck. Clicking a card lifts it out of its slot and flips it over into a
 *    detail panel, leaving a dimmed socket in the row behind it.
 *
 * Full standings live in the right rail, and its Sales/Calls tabs stay there:
 * the strip is fixed to `STRIP_BOARD` and doesn't answer them.
 */
export function LeaderboardStrip() {
  const youAccessories = useConsoleStore((s) => s.avatarAccessories)
  const togglePanel = useHubPanelStore((s) => s.togglePanel)

  const rows = leaderboards[STRIP_BOARD]
  const config = leaderboardConfigs.find((c) => c.metric === STRIP_BOARD) ?? leaderboardConfigs[0]

  const trackRef = useRef<HTMLOListElement>(null)
  // Which directions have more cards. Both false until measured, so the first
  // paint of a strip that fits shows no chrome at all.
  const [more, setMore] = useState({ left: false, right: false })

  // `openId` carries intent and direction; `mountedId` keeps the panel in the DOM
  // through the closing flip (the hub-right-panel idiom).
  const [openId, setOpenId] = useState<string | null>(null)
  const [mountedId, setMountedId] = useState<string | null>(null)

  const sourceRef = useRef<HTMLLIElement | null>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  // One re-targetable tween per card, so a pointermove costs a re-target rather
  // than a new tween. Keyed by element, so reordering the row (switching boards
  // reuses the same nine nodes) can't stale it.
  const quickRef = useRef(new WeakMap<Element, gsap.QuickToFunc>())
  const pointerRef = useRef<number | null>(null)

  const titleId = useId()

  const openRow = mountedId != null ? rows.find((row) => row.id === mountedId) : undefined
  const openRank = mountedId != null ? rows.findIndex((row) => row.id === mountedId) + 1 : 0

  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    // `scrollWidth` is safe to trust here only because the track's 20px lift
    // padding is wider than a lifted card's overhang: a transform that spilled
    // past the padding edge would enlarge the scrollable area and flicker the
    // cues on hover (which is why this once measured layout offsets instead).
    const max = Math.max(0, el.scrollWidth - el.clientWidth)
    // 1px slack: fractional container widths never settle exactly on `max`.
    const next = { left: el.scrollLeft > 1, right: el.scrollLeft < max - 1 }
    setMore((prev) => (prev.left === next.left && prev.right === next.right ? prev : next))
  }, [])

  /**
   * Re-target every card toward its distance from the pointer; pass null to send
   * the row back to rest.
   *
   * Each card gets one tween, and it runs on a plain `{ lift: 0 }` proxy rather
   * than on the element: concurrent tweens (or quick-setters) for `scale` and `y`
   * each rewrite the same transform and the last write wins, which leaves the
   * rise without the growth. Damping a single number and writing one transform
   * string from it keeps growth and rise locked together by construction.
   *
   * Distances come from layout offsets (`offsetLeft`), which transforms don't
   * touch, so a lifted card can't feed its own growth back into the next frame.
   */
  const proximity = useCallback((clientX: number | null) => {
    const el = trackRef.current
    if (!el) return
    const cards = el.children
    const first = cards[0] as HTMLElement | undefined
    if (!first) return

    const pitch =
      cards.length > 1 ? (cards[1] as HTMLElement).offsetLeft - first.offsetLeft : first.offsetWidth
    const x = clientX == null ? null : clientX - el.getBoundingClientRect().left + el.scrollLeft

    for (let i = 0; i < cards.length; i += 1) {
      const card = cards[i] as HTMLElement
      let quick = quickRef.current.get(card)
      if (!quick) {
        const state = { lift: 0 }
        quick = gsap.quickTo(state, 'lift', {
          duration: M.follow,
          ease: 'power3.out',
          onUpdate: () => {
            const scale = 1 + M.lift * state.lift
            card.style.transform = `translate3d(0, ${-M.rise * state.lift}px, 0) scale(${scale})`
          },
        })
        quickRef.current.set(card, quick)
      }

      if (x == null || pitch <= 0) {
        quick(0)
        continue
      }

      const distance = (x - (card.offsetLeft + card.offsetWidth / 2)) / pitch
      quick(Math.exp(-(distance * distance) / (2 * M.sigma * M.sigma)))
    }
  }, [])

  const onPointerMove = (event: React.PointerEvent) => {
    if (openId != null || event.pointerType === 'touch' || prefersReducedMotion()) return
    pointerRef.current = event.clientX
    proximity(event.clientX)
  }

  const onPointerLeave = () => {
    pointerRef.current = null
    if (!prefersReducedMotion()) proximity(null)
  }

  // Measure before paint so an overflowing strip renders its arrow immediately
  // rather than fading one in a frame later.
  useLayoutEffect(() => {
    const el = trackRef.current
    if (!el) return
    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => observer.disconnect()
  }, [sync])

  // Body scroll-lock, declared before the morph so it runs first and the panel's
  // target is measured against the scrollbar-gone layout.
  useLayoutEffect(() => {
    if (mountedId == null) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mountedId])

  /**
   * Pluck and flip. One layout effect with open and close branches (not useGSAP,
   * whose revert-on-update fights a two-directional imperative morph), running
   * before paint so the panel is pinned over the source card before the browser
   * ever shows it at its resting size.
   *
   * Coordinates: an ancestor with `will-change: transform` (`.phaseLayer`) is the
   * containing block for our fixed panel, so viewport rects can't be used as
   * `left`/`top` directly. The scrim is `inset: 0` of that same containing block,
   * which makes its own rect the conversion basis — and the frame to centre in.
   */
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
    const width = Math.min(PANEL.width, base.width - 40)
    const height = Math.min(PANEL.height, base.height - 48)
    const target = {
      left: (base.width - width) / 2,
      top: (base.height - height) / 2,
      width,
      height,
    }

    if (openId != null) {
      // Flatten the row behind the scrim. Measured first: the source is still
      // lifted from the hover that preceded the click, and starting there is
      // what makes the pluck continuous.
      const from = toLocal(source.getBoundingClientRect())
      proximity(null)

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
        gsap.set(source, { opacity: M.socketOpacity })
        closeRef.current?.focus()
        return
      }

      const tl = gsap.timeline({ onComplete: () => closeRef.current?.focus() })
      tl.to(scrim, { opacity: 1, duration: M.scrimIn, ease: 'power1.out' }, 0)
      tl.to(source, { opacity: M.socketOpacity, duration: 0.26, ease: 'power1.out' }, 0)
      // Lift clear of the row first, then turn and grow — the pluck's rise and
      // overshoot unwind inside the flip so the panel lands flat and crisp.
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
      // Close: re-measure the card's live slot (it's back at rest now, and the
      // row may have scrolled) and set the panel down into it.
      const back = toLocal(source.getBoundingClientRect())
      const restore = () => {
        gsap.set(source, { clearProps: 'opacity' })
        source.querySelector('button')?.focus()
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
        { ...back, rotationY: 0, y: -10, scale: 1.04, duration: M.flipBack, ease: EASE_CONTAINER_MORPH },
        0,
      )
      tl.to(panel, { y: 0, scale: 1, duration: M.land, ease: 'power2.in' }, M.flipBack)
      tl.to(source, { opacity: 1, duration: 0.2 }, M.flipBack * 0.6)
      tl.to(scrim, { opacity: 0, duration: M.scrimOut, ease: 'power1.in' }, M.flipBack * 0.5)
      tlRef.current = tl
    }

    return () => {
      tlRef.current?.kill()
    }
  }, [openId, proximity])

  // Kill anything in flight if the strip itself goes away.
  useLayoutEffect(
    () => () => {
      tlRef.current?.kill()
    },
    [],
  )

  const openCard = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    if (openId != null) return
    sourceRef.current = event.currentTarget.closest('li')
    setMountedId(id)
    setOpenId(id)
  }

  const requestClose = () => setOpenId(null)

  const onPanelKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      requestClose()
      return
    }

    if (event.key === 'Tab') {
      // The panel holds a single control, so the trap is just "stay here".
      event.preventDefault()
      closeRef.current?.focus()
      return
    }

    if (PRESENTER_KEYS.has(event.key)) event.stopPropagation()
  }

  /**
   * One click travels a screenful minus a card, so the card you were reading
   * stays on screen as an anchor. The step is measured off the live track (card
   * pitch = the offset between the first two cards) and the destination is
   * quantised to it, so cards always come to rest on their own edge.
   */
  const nudge = (direction: 1 | -1) => {
    const el = trackRef.current
    const first = el?.firstElementChild as HTMLElement | undefined
    if (!el || !first) return
    const second = first.nextElementSibling as HTMLElement | null
    const pitch = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth
    if (pitch <= 0) return

    const perView = Math.max(1, Math.floor(el.clientWidth / pitch) - 1)
    const max = Math.max(0, el.scrollWidth - el.clientWidth)
    const from = Math.round(el.scrollLeft / pitch)
    el.scrollTo({
      left: Math.min(Math.max((from + direction * perView) * pitch, 0), max),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    <Stack gap="md">
      {/*
        The row wraps as a unit (Live + the link drop to a second line) rather
        than letting labels break mid-phrase when the hub column gets tight; the
        subhead truncates before that happens.
      */}
      <Group justify="space-between" align="center" className={classes.metricsHeader}>
        <Group gap={10} align="baseline" wrap="nowrap" style={{ minWidth: 0 }}>
          <Text className={classes.metricsTitle}>Team leaderboard</Text>
          <Text className={classes.expertBoardLabel}>
            {config.boardLabel} · {getMetricsDateRange()}
          </Text>
        </Group>
        <Group gap="lg" align="center" wrap="nowrap">
          <LiveBadge />
          <button
            type="button"
            onClick={() => togglePanel('leaderboard')}
            className={`${classes.expertStandingsLink} ${classes.leaderboardAction}`}
          >
            View full standings
            <CaretRight size={15} aria-hidden />
          </button>
        </Group>
      </Group>

      <div
        className={classes.expertStripViewport}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <ol
          ref={trackRef}
          className={classes.expertStripTrack}
          onScroll={() => {
            sync()
            // The row moved under a stationary pointer; keep the lift with it.
            if (openId == null) proximity(pointerRef.current)
          }}
        >
          {rows.map((row, index) => (
            <li key={row.id} className={classes.expertCard}>
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={openId === row.id}
                aria-label={`${row.id === YOU_ID ? 'You' : abbreviateName(row.name)}, rank ${
                  index + 1
                }, ${row.score}. Open card`}
                onClick={(event) => openCard(event, row.id)}
                className={`${classes.expertCardSurface} ${classes.expertCardButton} ${
                  row.id === YOU_ID ? classes.expertCardYou : ''
                }`}
              >
                <ExpertCardFace row={row} rank={index + 1} youAccessories={youAccessories} />
              </button>
            </li>
          ))}
        </ol>

        {/* Purely decorative overflow cues; the arrows below carry the affordance. */}
        <div
          className={`${classes.expertStripFade} ${classes.expertStripFadeLeft}`}
          data-shown={more.left}
          aria-hidden
        />
        <div
          className={`${classes.expertStripFade} ${classes.expertStripFadeRight}`}
          data-shown={more.right}
          aria-hidden
        />

        {/*
          Kept mounted and `disabled` rather than unmounted, so the appear/
          disappear can transition and so "you can't go further" is announced
          instead of silently vanishing from the tab order.
        */}
        <button
          type="button"
          aria-label="Show earlier ranks"
          disabled={!more.left}
          onClick={() => nudge(-1)}
          className={`${classes.expertStripArrow} ${classes.expertStripArrowLeft}`}
        >
          <CaretLeft size={16} weight="bold" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Show later ranks"
          disabled={!more.right}
          onClick={() => nudge(1)}
          className={`${classes.expertStripArrow} ${classes.expertStripArrowRight}`}
        >
          <CaretRight size={16} weight="bold" aria-hidden />
        </button>
      </div>

      {openRow && (
        <div
          ref={scrimRef}
          className={classes.detailScrim}
          onClick={(event) => {
            // Ignore clicks mid-flip so a double-click can't open then close.
            if (event.target === event.currentTarget && !tlRef.current?.isActive()) requestClose()
          }}
        >
          {/*
            The flip stage: no background, border or overflow of its own —
            `overflow` would collapse `transform-style`, and each face carries its
            own surface so the 12px card and the 20px panel can differ without a
            radius tween. Their swap at 90° is backface-visibility's job.
          */}
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            onKeyDown={onPanelKeyDown}
            className={classes.detailPanel}
          >
            <div
              className={`${classes.expertCardSurface} ${classes.detailFace} ${
                openRow.id === YOU_ID ? classes.expertCardYou : ''
              }`}
              aria-hidden
            >
              <ExpertCardFace row={openRow} rank={openRank} youAccessories={youAccessories} />
            </div>

            <div className={`${classes.detailFace} ${classes.detailBack}`}>
              <div ref={bodyRef} className={classes.detailBody}>
                <ExpertCardDetail
                  row={openRow}
                  rank={openRank}
                  boardLabel={config.boardLabel.toLowerCase()}
                  youAccessories={youAccessories}
                  titleId={titleId}
                  closeRef={closeRef}
                  onClose={requestClose}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Stack>
  )
}
