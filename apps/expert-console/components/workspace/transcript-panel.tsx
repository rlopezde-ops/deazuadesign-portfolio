'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChatCircle, ClockCounterClockwise, Note } from '@phosphor-icons/react'
import { useConsoleStore } from '@/store/console-store'
import { cn } from '@/lib/utils'
import type { BottomTab, Speaker } from '@/lib/types'
import { CustomerSummaryCard } from './customer-summary-card'
import { NotesPanel } from './notes-panel'
import { HistoryPanel } from './history-panel'
import {
  SELECTION_MENU_WIDTH,
  TranscriptSelectionMenu,
  type TranscriptSelection,
} from './transcript-selection-menu'

/** Gap above the card — flush with sidecar top so the live card shares one top edge. */
const CARD_TOP = 0
/** Slack below the collapsed header before transcript content. */
const CARD_BOTTOM_SLACK = 14
/** Approx. menu height — used to flip it above the selection near the bottom. */
const MENU_EST_HEIGHT = 208
/** Stay pinned to newest lines unless the expert has scrolled up farther than this. */
const STICK_BOTTOM_THRESHOLD_PX = 120

function messageRole(speaker: Speaker): 'expert' | 'customer' | 'system' {
  if (speaker === 'expert') return 'expert'
  if (speaker === 'customer') return 'customer'
  return 'system'
}

function displayLabel(speaker: Speaker, label: string): string {
  if (speaker === 'expert') return 'You'
  if (speaker === 'system' || speaker === 'ivr') return label || 'System'
  return label
}

export function TranscriptPanel() {
  const transcript = useConsoleStore((s) => s.transcript)
  const callClockRunning = useConsoleStore((s) => s.callClockRunning)
  const bottomTab = useConsoleStore((s) => s.bottomTab)
  const pins = useConsoleStore((s) => s.pins)
  const pinItem = useConsoleStore((s) => s.pinItem)
  const patch = useConsoleStore((s) => s.patch)

  const rootRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Collapsed height of the floating card's header, measured by the card itself.
  // Reserves scroll space + sizes the top scrim so the card (an absolute
  // overlay) can expand down over the transcript without reflowing the body.
  const [cardHeaderHeight, setCardHeaderHeight] = useState(150)
  const spacerHeight = CARD_TOP + cardHeaderHeight + CARD_BOTTOM_SLACK

  const [selection, setSelection] = useState<TranscriptSelection | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const stickKey = `${transcript.length}:${callClockRunning ? 1 : 0}`
  const prevStickKey = useRef<string | null>(null)

  // Chat-like stick-to-bottom: newest lines stay at the bottom of the pane.
  // Scroll up to read older lines; new lines re-pin to the bottom.
  useEffect(() => {
    if (bottomTab !== 'transcript') {
      // Remounting the transcript pane should re-pin to the newest line.
      prevStickKey.current = null
      return
    }
    const scroller = scrollRef.current
    const end = endRef.current
    if (!scroller || !end) return

    const keyChanged = prevStickKey.current !== stickKey
    const isFirst = prevStickKey.current === null
    prevStickKey.current = stickKey

    const scrollToLatest = (smooth: boolean) => {
      end.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'end' })
    }

    if (keyChanged) {
      scrollToLatest(!isFirst)
    }

    const ro = new ResizeObserver(() => {
      const distanceFromBottom =
        scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight
      if (distanceFromBottom < STICK_BOTTOM_THRESHOLD_PX) {
        scrollToLatest(false)
      }
    })
    ro.observe(scroller)
    return () => ro.disconnect()
  }, [stickKey, bottomTab])

  const openMenuFromSelection = useCallback(() => {
    const sel = window.getSelection()
    const scroll = scrollRef.current
    const root = rootRef.current
    if (!sel || sel.isCollapsed || sel.rangeCount === 0 || !scroll || !root) {
      setSelection(null)
      return
    }
    // Only react to selections made inside the transcript scroll area.
    if (!scroll.contains(sel.anchorNode) || !scroll.contains(sel.focusNode)) return
    const text = sel.toString().replace(/\s+/g, ' ').trim()
    if (text.length < 2) {
      setSelection(null)
      return
    }
    const rect = sel.getRangeAt(0).getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) {
      setSelection(null)
      return
    }
    const rootRect = root.getBoundingClientRect()
    const maxLeft = rootRect.width - SELECTION_MENU_WIDTH - 8
    const left = Math.max(8, Math.min(rect.left - rootRect.left, maxLeft))
    const below = rect.bottom - rootRect.top + 8
    const above = rect.top - rootRect.top - MENU_EST_HEIGHT - 8
    const top = below + MENU_EST_HEIGHT > rootRect.height && above > 0 ? above : below
    setSelection({ text, top, left })
  }, [])

  const closeMenu = useCallback(() => {
    setSelection(null)
    window.getSelection()?.removeAllRanges()
  }, [])

  const handleCopy = useCallback(() => {
    const text = selection?.text
    if (text) {
      void navigator.clipboard?.writeText(text).catch(() => {})
    }
    closeMenu()
  }, [selection, closeMenu])

  const handlePin = useCallback(() => {
    if (selection) pinItem(selection.text)
    closeMenu()
  }, [selection, pinItem, closeMenu])

  useEffect(() => {
    if (!selection) return
    const onDown = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return
      setSelection(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelection(null)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [selection])

  const selectTab = useCallback(
    (tab: BottomTab) => {
      patch({ bottomTab: tab })
      setSelection(null)
    },
    [patch],
  )

  const tabs: { id: BottomTab; label: string; Icon: typeof ChatCircle }[] = [
    { id: 'transcript', label: 'Transcript', Icon: ChatCircle },
    { id: 'notes', label: 'Notes', Icon: Note },
    { id: 'history', label: 'History', Icon: ClockCounterClockwise },
  ]

  return (
    <div ref={rootRef} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      {bottomTab === 'transcript' ? (
        <div
          ref={scrollRef}
          className="transcript-pane"
          onMouseUp={openMenuFromSelection}
          onScroll={() => {
            if (selection) setSelection(null)
          }}
        >
          {/* Reserve room so the first message clears the floating card. */}
          <div aria-hidden className="shrink-0" style={{ height: spacerHeight }} />

          {transcript.map((line, index) => {
            const role = messageRole(line.speaker)
            return (
              <div
                key={line.id}
                className={`transcript-msg transcript-msg-${role}${index === 0 ? ' transcript-msg-first' : ''}`}
              >
                {role !== 'system' ? (
                  <span className="transcript-msg-who">{displayLabel(line.speaker, line.label)}</span>
                ) : null}
                <p className="transcript-msg-body">{line.text}</p>
              </div>
            )
          })}

          {callClockRunning && (
            <div className="transcript-msg transcript-msg-system">
              <div className="flex items-center justify-center gap-[8px]">
                <Image
                  src="/brand/sound-wave.png"
                  alt=""
                  width={16}
                  height={16}
                  className="size-[16px] shrink-0 object-cover opacity-60"
                />
                <span className="transcript-msg-body">Transcribing…</span>
              </div>
            </div>
          )}

          <div ref={endRef} className="h-px w-full shrink-0" aria-hidden />
        </div>
      ) : bottomTab === 'notes' ? (
        <NotesPanel spacerHeight={spacerHeight} />
      ) : (
        <HistoryPanel spacerHeight={spacerHeight} />
      )}

      {/* Scrim: fades body content out beneath the floating card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
        style={{
          height: spacerHeight + 24,
          background:
            'linear-gradient(to bottom, var(--ew-surface-page) 62%, rgba(26,29,32,0))',
        }}
      />

      {/*
        Floating customer card. Absolute overlay so expanding it covers the
        transcript rather than pushing messages down. The wrapper is
        pointer-events-none so the wheel scrolls the body in the gutters; the
        card itself is interactive.
      */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-[16px] pt-0">
        <div className="pointer-events-auto">
          <CustomerSummaryCard onCollapsedHeightChange={setCardHeaderHeight} />
        </div>
      </div>

      {selection && (
        <TranscriptSelectionMenu
          selection={selection}
          menuRef={menuRef}
          onCopy={handleCopy}
          onTranslate={closeMenu}
          onPin={handlePin}
        />
      )}

      {/* Bottom tab strip — reuses the flow-step pill styling. */}
      <div
        className="flex shrink-0 items-center justify-center gap-[8px] py-[10px]"
        role="tablist"
        aria-label="Panel view"
      >
        {tabs.map(({ id, label, Icon }) => {
          const active = bottomTab === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectTab(id)}
              className={cn('flow-step flow-step-clickable', active && 'flow-step-active')}
            >
              <Icon className="size-[14px]" />
              {label}
              {id === 'notes' && pins.length > 0 && (
                <span
                  className="ml-[2px] inline-flex min-w-[16px] items-center justify-center rounded-full px-[4px] text-[10px] font-semibold tabular-nums text-white"
                  style={{ backgroundColor: '#8223d2' }}
                >
                  {pins.length}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
