'use client'

import { useRef } from 'react'
import { Task } from '@/components/task'
import { ActionDockPrimary, ActionDockSecondary } from '@/components/chat'
import { invalidateDownstreamFrom } from '@/lib/flow-steps'
import { CONFIRM_COPY } from '@/lib/task-content'
import { useConsoleStore } from '@/store/console-store'
import { useDirector } from '@/hooks/use-director'
import { useStatusSequence } from '@/hooks/use-status-sequence'

export function ConfirmActivity({
  review = false,
  persist = false,
}: {
  review?: boolean
  persist?: boolean
}) {
  const activities = useConsoleStore((s) => s.activities)
  const resolutionConfirmedVia = useConsoleStore((s) => s.resolutionConfirmedVia)
  const opportunityUnlocked = useConsoleStore((s) => s.opportunityUnlocked)
  const patch = useConsoleStore((s) => s.patch)
  const { resolveGate } = useDirector()

  const pendingViaRef = useRef<'sms' | 'call' | null>(null)

  const storeDone = review ? false : Boolean(resolutionConfirmedVia) || opportunityUnlocked

  const { phase, begin, isBusy } = useStatusSequence({
    storeDone,
    onResolve: () => {
      const via = pendingViaRef.current ?? 'call'
      patch({
        resolutionConfirmedVia: via,
        opportunityUnlocked: true,
        scene: 'opportunity',
        activities: {
          ...useConsoleStore.getState().activities,
          sales: 'active',
        },
      })
      if (review) {
        invalidateDownstreamFrom('confirm')
        return
      }
      resolveGate()
    },
  })

  if (activities.discovery === 'hidden' && !review && !persist) return null
  if (phase === 'done' && review) return null

  const confirmVia = (via: 'sms' | 'call') => {
    if (isBusy) return
    pendingViaRef.current = via
    begin(true)
  }

  const showInlineStatus = phase === 'pending' || phase === 'success' || (phase === 'done' && persist)

  return (
    <Task cue={showInlineStatus ? false : undefined}>
      <Task.Eyebrow>
        {CONFIRM_COPY.eyebrow}
        {phase === 'done' && persist ? ' · Done' : ''}
      </Task.Eyebrow>
      <Task.Verbatim>{CONFIRM_COPY.verbatim}</Task.Verbatim>
      <Task.Body>
        {showInlineStatus ? (
          <Task.Status
            phase={phase === 'pending' ? 'pending' : 'success'}
            pendingLabel="Confirming…"
            successLabel={CONFIRM_COPY.successConfirm}
          />
        ) : (
          <Task.Footer>
            <ActionDockPrimary onClick={() => confirmVia('sms')}>
              {CONFIRM_COPY.smsCta}
            </ActionDockPrimary>
            <ActionDockSecondary onClick={() => confirmVia('call')}>
              {CONFIRM_COPY.callCta}
            </ActionDockSecondary>
          </Task.Footer>
        )}
      </Task.Body>
    </Task>
  )
}
