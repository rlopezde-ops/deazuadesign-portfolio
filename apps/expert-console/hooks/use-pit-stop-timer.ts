'use client'

import { useEffect } from 'react'
import { PIT_STOP_SECONDS } from '@/lib/tokens'
import { useConsoleStore } from '@/store/console-store'

export function usePitStopTimer(onComplete: () => void) {
  const shiftPhase = useConsoleStore((s) => s.shiftPhase)
  const pitStopRemaining = useConsoleStore((s) => s.pitStopRemaining)
  const tickPitStop = useConsoleStore((s) => s.tickPitStop)

  useEffect(() => {
    if (shiftPhase !== 'pit-stop') return

    tickPitStop(PIT_STOP_SECONDS)
    const started = Date.now()
    const id = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - started) / 1000)
      const remaining = Math.max(0, PIT_STOP_SECONDS - elapsed)
      tickPitStop(remaining)
      if (remaining === 0) onComplete()
    }, 250)

    return () => window.clearInterval(id)
  }, [shiftPhase, onComplete, tickPitStop])
}
