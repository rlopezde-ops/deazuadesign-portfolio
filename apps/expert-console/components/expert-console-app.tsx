'use client'

import { useCallback } from 'react'
import { useDirector } from '@/hooks/use-director'
import { usePacingClock } from '@/hooks/use-pacing-clock'
import { usePitStopTimer } from '@/hooks/use-pit-stop-timer'
import { usePresenterKeys } from '@/hooks/use-presenter-keys'
import { useConsoleStore } from '@/store/console-store'
import { DailyDropScreen } from './daily-drop/daily-drop-screen'
import { NotificationGate, WarmHandoffModal } from './handoff/warm-handoff-modal'
import { ContainerMorph } from './motion/container-morph'
import { PitStopScreen } from './pit-stop/pit-stop-screen'
import { DemoBar } from './presenter/demo-bar'
import { WorkspaceShell } from './workspace/workspace-shell'

export function ExpertConsoleApp() {
  const shiftPhase = useConsoleStore((s) => s.shiftPhase)
  const { resolveGate } = useDirector()

  usePresenterKeys()
  usePacingClock()

  const onPitStopComplete = useCallback(() => {
    resolveGate()
  }, [resolveGate])

  usePitStopTimer(onPitStopComplete)

  return (
    <>
      <NotificationGate />
      <DailyDropScreen />
      <WarmHandoffModal />
      <WorkspaceShell />
      <PitStopScreen />
      <DemoBar />
      {/* Last sibling: its layout effect runs after the targets' so it can
          measure them, and its z-[85] ghost sits above the surfaces it morphs. */}
      <ContainerMorph />
    </>
  )
}
