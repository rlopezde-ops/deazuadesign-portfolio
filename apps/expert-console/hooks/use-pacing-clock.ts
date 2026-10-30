'use client'

import { useEffect } from 'react'
import { useConsoleStore } from '@/store/console-store'

export function usePacingClock() {
  const callClockRunning = useConsoleStore((s) => s.callClockRunning)
  const callStartedAt = useConsoleStore((s) => s.callStartedAt)
  const pacingSkipMs = useConsoleStore((s) => s.pacingSkipMs)
  const tickCallClock = useConsoleStore((s) => s.tickCallClock)

  useEffect(() => {
    if (!callClockRunning || !callStartedAt) return

    const id = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - callStartedAt + pacingSkipMs) / 1000)
      tickCallClock(elapsed)
    }, 250)

    return () => window.clearInterval(id)
  }, [callClockRunning, callStartedAt, pacingSkipMs, tickCallClock])
}
