'use client'

import { useCallback } from 'react'
import { applyBeatEffects, undoBeatEffects } from '@/lib/apply-beat-effects'
import { BEATS, SCENE_ORDER } from '@/lib/script'
import type { ContainerMorphKind, ContainerMorphRequest, SceneId } from '@/lib/types'
import { initialState, useConsoleStore, type ConsoleState } from '@/store/console-store'

/**
 * Snapshot the source surface's box for a container morph, if this exact forward
 * step crosses a morph boundary. Returns null on SSR, under reduced motion, on
 * any non-morph step, or when the source element isn't in the tree (e.g. the
 * pill is hidden in an auxiliary status) — every such case is a clean cut,
 * exactly as before. `getBoundingClientRect` is read *before* the phase patch
 * commits and unmounts the source, and bakes in every ancestor transform (the
 * pill's resting `y`, its `-translate-x-1/2`), so we never use `offset*`.
 */
function captureMorph(
  state: ConsoleState,
  patch: Partial<ConsoleState>,
): ContainerMorphRequest | null {
  if (typeof window === 'undefined') return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null

  let kind: ContainerMorphKind
  let selector: string
  if (
    patch.shiftPhase === 'standby' &&
    (state.shiftPhase === 'daily-drop' || state.shiftPhase === 'available')
  ) {
    kind = 'pill-to-dialog'
    selector = '[data-morph-source="pill"]'
  } else if (
    patch.shiftPhase === 'in-call' &&
    (state.shiftPhase === 'on-air' || state.shiftPhase === 'standby')
  ) {
    kind = 'dialog-to-callbar'
    selector = '[data-morph-source="dialog"]'
  } else {
    return null
  }

  const el = document.querySelector(selector)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return {
    kind,
    nonce: Date.now(),
    from: { left: r.left, top: r.top, width: r.width, height: r.height },
  }
}

export function useDirector() {
  const store = useConsoleStore()

  const currentBeat = store.beatIndex >= 0 ? BEATS[store.beatIndex] : null

  const advance = useCallback(() => {
    const state = useConsoleStore.getState()
    const nextIndex = state.beatIndex + 1
    if (nextIndex >= BEATS.length) return

    const beat = BEATS[nextIndex]
    const patch = applyBeatEffects(state, beat.effects, 'forward')
    // Capture the source rect *before* this patch commits and unmounts it. Only
    // merge `morph` when one is captured, so a later transcript-beat advance
    // never clobbers an in-flight ghost — the overlay owns clearing it.
    const morph = captureMorph(state, patch)
    useConsoleStore.getState().patch({ beatIndex: nextIndex, ...patch, ...(morph && { morph }) })
  }, [])

  const retreat = useCallback(() => {
    const state = useConsoleStore.getState()
    if (state.beatIndex < 0) return
    const beat = BEATS[state.beatIndex]
    const undo = undoBeatEffects(state, beat.effects)
    useConsoleStore.getState().patch({ beatIndex: state.beatIndex - 1, ...undo })
  }, [])

  /**
   * Jump to the first beat of a scene by replaying every beat up to that point
   * from a clean state — keeps activities, transcript, and phase consistent.
   */
  const jumpToScene = useCallback((targetScene: SceneId) => {
    const targetBeatIndex = BEATS.findIndex((b) => b.scene === targetScene)
    if (targetBeatIndex < 0) return

    // The "f" fast-forward (skipPacing) is a live presenter input, not a scripted
    // beat, so a clean replay would erase it. Carry the call's elapsed time across
    // the jump so a call pushed into the yellow/red survives — e.g. jumping ahead
    // to the pit stop after showing the call bar go long, where the "Call length"
    // card reads this same callElapsedSeconds and must show that last known time.
    const prev = useConsoleStore.getState()
    const carriedCallElapsedSeconds = prev.callElapsedSeconds

    useConsoleStore.setState({
      ...initialState,
      notificationDismissed: true,
      demoBarVisible: prev.demoBarVisible,
      autoPlay: false,
    })

    for (let i = 0; i <= targetBeatIndex; i++) {
      const state = useConsoleStore.getState()
      const patch = applyBeatEffects(state, BEATS[i].effects, 'forward')
      useConsoleStore.getState().patch({ ...patch, beatIndex: i })
    }

    // Only re-apply the pacing once the call has actually begun at the target
    // (its clock started, or it already ended). Jumping to a pre-call scene keeps
    // the clean zero so a fresh play-through starts the call at 0:00. Replay reset
    // callStartedAt to "now", so fold the whole carried time into pacingSkipMs —
    // the running-clock formula (now - callStartedAt + pacingSkipMs) then resumes
    // exactly where the presenter left off (and stays put once the call ended).
    const afterReplay = useConsoleStore.getState()
    const callHasBegun = afterReplay.callStartedAt !== null || afterReplay.callEnded
    if (callHasBegun && carriedCallElapsedSeconds > 0) {
      useConsoleStore.getState().patch({
        callElapsedSeconds: carriedCallElapsedSeconds,
        pacingSkipMs: carriedCallElapsedSeconds * 1000,
      })
    }
  }, [])

  const jumpScene = useCallback(
    (direction: 'prev' | 'next') => {
      const state = useConsoleStore.getState()
      const currentScene = state.scene
      const idx = SCENE_ORDER.indexOf(currentScene as (typeof SCENE_ORDER)[number])
      const targetIdx =
        direction === 'prev' ? Math.max(0, idx - 1) : Math.min(SCENE_ORDER.length - 1, idx + 1)
      jumpToScene(SCENE_ORDER[targetIdx])
    },
    [jumpToScene],
  )

  const resolveGate = useCallback(() => {
    advance()
  }, [advance])

  const reset = useCallback(() => {
    useConsoleStore.getState().reset()
  }, [])

  return {
    currentBeat,
    beatIndex: store.beatIndex,
    totalBeats: BEATS.length,
    advance,
    retreat,
    jumpScene,
    jumpToScene,
    resolveGate,
    reset,
  }
}
