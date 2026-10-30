'use client'

import { useEffect } from 'react'
import { ASSIST_SEND_DETAILS_KEY, getSalesScript } from '@/lib/sales-assist-steps'
import { useConsoleStore } from '@/store/console-store'

/** ~46ms/char — matches rebuttal-sandbox karaoke pacing. */
const MS_PER_CHAR = 46

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Drives karaoke progress for the active sales script key.
 * Snaps to 1 under reduced motion. Stops when settled or key changes.
 */
export function useSalesKaraokeDrive() {
  const activeScriptKey = useConsoleStore((s) => s.activeScriptKey)
  const completedScriptKeys = useConsoleStore((s) => s.completedScriptKeys)
  const skippedScriptKeys = useConsoleStore((s) => s.skippedScriptKeys)
  const setKaraokeProgress = useConsoleStore((s) => s.setKaraokeProgress)

  useEffect(() => {
    if (!activeScriptKey || activeScriptKey === ASSIST_SEND_DETAILS_KEY) return
    if (completedScriptKeys.includes(activeScriptKey) || skippedScriptKeys.includes(activeScriptKey)) {
      setKaraokeProgress(activeScriptKey, 1)
      return
    }

    const def = getSalesScript(activeScriptKey)
    if (!def) return

    const region = def.verbatimText ?? def.script
    if (prefersReducedMotion()) {
      setKaraokeProgress(activeScriptKey, 1)
      return
    }

    setKaraokeProgress(activeScriptKey, 0)
    const durationMs = Math.max(600, region.length * MS_PER_CHAR)
    const startedAt = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / durationMs)
      setKaraokeProgress(activeScriptKey, progress)
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }
    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [activeScriptKey, completedScriptKeys, skippedScriptKeys, setKaraokeProgress])
}
