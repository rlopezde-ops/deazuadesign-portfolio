'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ewMotion } from '@/lib/motion-tokens'

export type MotionPhase = 'idle' | 'pending' | 'success'

/**
 * Gives an action a brief acknowledgement phase ("Verifying…") before its
 * result lands, so the expert sees a response immediately without waiting on a
 * spinner. The pending window is deliberately short — the success state and the
 * card compression that follows still land inside a single 200-250ms beat.
 */
export function useMotionPhase(pendingMs: number = ewMotion.delay.pending) {
  const [phase, setPhase] = useState<MotionPhase>('idle')
  const timerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    },
    [],
  )

  const run = useCallback(
    (onResolve: () => void) => {
      if (phase !== 'idle') return
      setPhase('pending')
      timerRef.current = window.setTimeout(() => {
        setPhase('success')
        onResolve()
      }, pendingMs)
    },
    [phase, pendingMs],
  )

  return { phase, run }
}
