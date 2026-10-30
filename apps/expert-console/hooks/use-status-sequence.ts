'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export type StatusSequencePhase = 'idle' | 'pending' | 'success' | 'done'

const DEFAULT_PENDING_MS = 900
const DEFAULT_SUCCESS_MS = 750

/**
 * Shared pending → success → done beat for commit actions (verify, send, etc.).
 * When `storeDone` flips true while still idle, the same sequence plays without
 * calling `onResolve` (demo-bar / beat scrub path).
 *
 * Pass `skipPending` for instant local choices (device select, discovery) so the
 * sequence opens on success with no spinner — a pending state would be a lie.
 */
export function useStatusSequence({
  storeDone,
  onResolve,
  pendingMs = DEFAULT_PENDING_MS,
  successMs = DEFAULT_SUCCESS_MS,
  skipPending = false,
}: {
  storeDone: boolean
  onResolve?: () => void
  pendingMs?: number
  successMs?: number
  /** Jump straight to success (no pending spinner). */
  skipPending?: boolean
}) {
  const [phase, setPhase] = useState<StatusSequencePhase>(() => (storeDone ? 'done' : 'idle'))
  const timersRef = useRef<number[]>([])
  const runningRef = useRef(false)
  const prevStoreDoneRef = useRef(storeDone)
  const onResolveRef = useRef(onResolve)
  onResolveRef.current = onResolve

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  const begin = useCallback(
    (shouldResolve: boolean) => {
      if (runningRef.current) return
      runningRef.current = true
      clearTimers()

      const finish = () => {
        const toDone = window.setTimeout(() => {
          if (shouldResolve) onResolveRef.current?.()
          setPhase('done')
          runningRef.current = false
        }, successMs)
        timersRef.current.push(toDone)
      }

      if (skipPending) {
        setPhase('success')
        finish()
        return
      }

      setPhase('pending')
      const toSuccess = window.setTimeout(() => {
        setPhase('success')
        finish()
      }, pendingMs)
      timersRef.current.push(toSuccess)
    },
    [clearTimers, pendingMs, successMs, skipPending],
  )

  useEffect(() => () => clearTimers(), [clearTimers])

  useLayoutEffect(() => {
    const wasDone = prevStoreDoneRef.current
    prevStoreDoneRef.current = storeDone

    if (storeDone && phase === 'idle') {
      begin(false)
      return
    }

    if (wasDone && !storeDone) {
      clearTimers()
      runningRef.current = false
      setPhase('idle')
    }
  }, [storeDone, phase, begin, clearTimers])

  return { phase, begin, isBusy: phase === 'pending' || phase === 'success' }
}
