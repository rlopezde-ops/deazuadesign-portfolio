'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'ew:panel-split'
/** Pulse WorkspaceShell defaults transcript nearer ~30%. */
const DEFAULT_SPLIT = 35
export const SPLIT_MIN = 20
export const SPLIT_MAX = 72

export const TRANSCRIPT_MIN_PX = 320
export const SIDECAR_MIN_PX = 480

function clampPercent(value: number) {
  return Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, value))
}

/** Clamp split so neither pane drops below pulse px floors when the row is wide enough. */
export function clampSplitForWidth(percent: number, rowWidth: number) {
  const base = clampPercent(percent)
  if (rowWidth <= 0) return base

  const minPct = (TRANSCRIPT_MIN_PX / rowWidth) * 100
  const maxPct = 100 - (SIDECAR_MIN_PX / rowWidth) * 100

  if (minPct >= maxPct) {
    // Viewport too narrow for both floors — bias toward the midpoint of the conflict.
    return clampPercent((minPct + maxPct) / 2)
  }

  return Math.min(maxPct, Math.max(minPct, base))
}

/**
 * Owns the transcript's share of the panel row as a percentage. The row element
 * is measured on every pointer move so the handle tracks the cursor 1:1.
 */
export function usePanelSplit() {
  const rowRef = useRef<HTMLDivElement>(null)
  const [split, setSplit] = useState(DEFAULT_SPLIT)
  const draggingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [animating, setAnimating] = useState(false)

  const measureWidth = useCallback(() => rowRef.current?.getBoundingClientRect().width ?? 0, [])

  const applySplit = useCallback(
    (next: number) => clampSplitForWidth(next, measureWidth()),
    [measureWidth],
  )

  useEffect(() => {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY))
    if (Number.isFinite(saved) && saved > 0) {
      setSplit(clampSplitForWidth(saved, measureWidth()))
    }
  }, [measureWidth])

  useEffect(() => {
    const onResize = () => {
      setSplit((current) => applySplit(current))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [applySplit])

  useEffect(() => {
    if (!isDragging) return
    const { body } = document
    const prevCursor = body.style.cursor
    const prevSelect = body.style.userSelect
    body.style.cursor = 'col-resize'
    body.style.userSelect = 'none'
    return () => {
      body.style.cursor = prevCursor
      body.style.userSelect = prevSelect
    }
  }, [isDragging])

  const commit = useCallback((next: number) => {
    window.localStorage.setItem(STORAGE_KEY, String(next))
  }, [])

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Capture is an optimization; the drag still works without it.
    }
    draggingRef.current = true
    setAnimating(false)
    setIsDragging(true)
  }, [])

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return
      const row = rowRef.current
      if (!row) return
      const rect = row.getBoundingClientRect()
      if (rect.width === 0) return
      setSplit(clampSplitForWidth(((event.clientX - rect.left) / rect.width) * 100, rect.width))
    },
    [],
  )

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return
      draggingRef.current = false
      try {
        event.currentTarget.releasePointerCapture(event.pointerId)
      } catch {
        // Nothing to release if capture never took.
      }
      setIsDragging(false)
      setSplit((current) => {
        const next = applySplit(current)
        commit(next)
        return next
      })
    },
    [applySplit, commit],
  )

  const nudge = useCallback(
    (delta: number) => {
      setAnimating(true)
      setSplit((current) => {
        const next = applySplit(current + delta)
        commit(next)
        return next
      })
    },
    [applySplit, commit],
  )

  const reset = useCallback(() => {
    setAnimating(true)
    const next = applySplit(DEFAULT_SPLIT)
    setSplit(next)
    commit(next)
  }, [applySplit, commit])

  const endAnimation = useCallback(() => setAnimating(false), [])

  return {
    rowRef,
    split,
    isDragging,
    animating,
    endAnimation,
    nudge,
    reset,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  }
}
