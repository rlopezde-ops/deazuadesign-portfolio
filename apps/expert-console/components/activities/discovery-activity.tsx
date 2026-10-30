'use client'

import { useRef, useState } from 'react'
import { Task } from '@/components/task'
import { ActionDockPrimary, ActionDockSecondary } from '@/components/chat'
import { DISCOVERY_COPY } from '@/lib/task-content'
import { useConsoleStore } from '@/store/console-store'
import { useDirector } from '@/hooks/use-director'
import { useStatusSequence } from '@/hooks/use-status-sequence'

const HOUSEHOLD_DEVICES = ['Laptop', 'Tablet', 'Gaming system', 'TV']
/** Hold the success check briefly before advancing — no spinner for a local pick. */
const INSTANT_SUCCESS_MS = 600

export function DiscoveryActivity({
  review = false,
  persist = false,
}: {
  review?: boolean
  persist?: boolean
}) {
  const activities = useConsoleStore((s) => s.activities)
  const facts = useConsoleStore((s) => s.facts)
  const discoveryAsked = useConsoleStore((s) => s.discoveryAsked)
  const patch = useConsoleStore((s) => s.patch)
  const { resolveGate } = useDirector()

  const [pendingChoice, setPendingChoice] = useState<'asked' | 'skipped' | null>(null)
  const pendingChoiceRef = useRef<'asked' | 'skipped' | null>(null)

  const storeDone = review ? false : discoveryAsked !== null

  const { phase, begin, isBusy } = useStatusSequence({
    storeDone,
    skipPending: true,
    successMs: INSTANT_SUCCESS_MS,
    onResolve: () => {
      const asked = pendingChoiceRef.current === 'asked'
      patch({
        discoveryAsked: asked,
        facts: asked
          ? {
              ...useConsoleStore.getState().facts,
              householdDevices:
                useConsoleStore.getState().facts.householdDevices ?? HOUSEHOLD_DEVICES,
            }
          : useConsoleStore.getState().facts,
        activities: {
          ...useConsoleStore.getState().activities,
          discovery: 'complete',
        },
        scene: 'confirm-solve',
      })
      resolveGate()
    },
  })

  if (activities.discovery === 'hidden' && !review && !persist) return null
  if (activities.discovery === 'hidden' && persist && !review) return null
  if (discoveryAsked !== null && !review && !persist && phase === 'done') return null

  if (review && discoveryAsked === null && !facts.householdDevices && phase === 'idle') {
    return (
      <Task className="motion-enter">
        <Task.Eyebrow>{DISCOVERY_COPY.eyebrow}</Task.Eyebrow>
        <Task.Detail>No discovery notes captured on this call yet.</Task.Detail>
      </Task>
    )
  }

  const markAsked = () => {
    if (isBusy) return
    pendingChoiceRef.current = 'asked'
    setPendingChoice('asked')
    begin(true)
  }

  const markSkipped = () => {
    if (isBusy) return
    pendingChoiceRef.current = 'skipped'
    setPendingChoice('skipped')
    begin(true)
  }

  const showInlineStatus = phase === 'pending' || phase === 'success' || (phase === 'done' && persist)
  const successLabel =
    pendingChoice === 'skipped' || discoveryAsked === false
      ? DISCOVERY_COPY.skippedConfirm
      : DISCOVERY_COPY.successConfirm

  return (
    <Task className="motion-enter" cue={showInlineStatus ? false : undefined}>
      <Task.Eyebrow>
        {DISCOVERY_COPY.eyebrow}
        {discoveryAsked !== null || phase === 'done' ? ' · Done' : ''}
      </Task.Eyebrow>
      <Task.Verbatim>{DISCOVERY_COPY.verbatim}</Task.Verbatim>
      <Task.Body>
        {showInlineStatus ? (
          <Task.Status phase="success" pendingLabel="" successLabel={successLabel} />
        ) : discoveryAsked === null && !review ? (
          <Task.Footer>
            <ActionDockPrimary onClick={markAsked}>{DISCOVERY_COPY.askedCta}</ActionDockPrimary>
            <ActionDockSecondary onClick={markSkipped}>{DISCOVERY_COPY.skipCta}</ActionDockSecondary>
          </Task.Footer>
        ) : null}
      </Task.Body>
    </Task>
  )
}
