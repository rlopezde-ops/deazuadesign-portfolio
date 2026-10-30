'use client'

import { useState } from 'react'
import { Task } from '@/components/task'
import {
  ActionDockPrimary,
  InputWidget,
  MediaSlot,
  SendChannelSlot,
  type SendChannel,
} from '@/components/chat'
import { CUSTOMER } from '@/lib/fixtures'
import { invalidateDownstreamFrom } from '@/lib/flow-steps'
import { ACTIVATION_COPY, SEND_CHANNEL_COPY } from '@/lib/task-content'
import { useConsoleStore } from '@/store/console-store'
import { useDirector } from '@/hooks/use-director'
import { useStatusSequence } from '@/hooks/use-status-sequence'

const STEP_TOTAL = 2
const STEP_INDEX = 1

export function ActivationActivity({
  review = false,
  persist = false,
}: {
  review?: boolean
  persist?: boolean
}) {
  const instructionsSent = useConsoleStore((s) => s.instructionsSent)
  const instructionsChannel = useConsoleStore((s) => s.instructionsChannel)
  const activities = useConsoleStore((s) => s.activities)
  const openWidget = useConsoleStore((s) => s.openWidget)
  const patch = useConsoleStore((s) => s.patch)
  const { resolveGate } = useDirector()

  const hidden = activities.activation === 'hidden'
  const compressed =
    activities.activation === 'compressed' || activities.activation === 'complete'

  if (hidden && !persist && !review) return null
  if (compressed && !persist && !review) return null
  if (hidden && persist && !review) return null

  const storeDone = review ? false : instructionsSent

  const { phase, begin, isBusy } = useStatusSequence({
    storeDone,
    onResolve: () => {
      patch({
        instructionsSent: true,
        openWidget: null,
        activationStep: 2,
        /*
         * Hand the column to Discovery rather than leaving this card up holding a
         * record of what was just sent — the expert's next move is the discovery
         * question while the customer works through the instructions.
         *
         * `instructionsSent` already *completes* this step (see `isStepComplete`
         * in flow-steps), but with nothing downstream started `useLiveStep` falls
         * back to the last completed step and parks here. Starting discovery is
         * what actually moves it on. In review the `invalidateDownstreamFrom`
         * below runs straight after and resets this, which is what should happen
         * when the step is being redone.
         */
        activities: { ...activities, discovery: 'active' },
      })
      if (review) {
        invalidateDownstreamFrom('activate')
        return
      }
      resolveGate()
    },
  })

  const [sendChannel, setSendChannel] = useState<SendChannel | null>(instructionsChannel)

  const step1 = ACTIVATION_COPY.step1
  const destination =
    (instructionsChannel ?? sendChannel) === 'email' ? CUSTOMER.email : CUSTOMER.phone

  const openSendWidget = () => {
    if (isBusy) return
    patch({ openWidget: 'send-instructions' })
  }

  const sendInstructions = () => {
    if (!sendChannel || isBusy) return
    patch({ instructionsChannel: sendChannel })
    begin(true)
  }

  // Held open through `success` so "Instructions sent." lands in the footer the
  // expert just pressed; `done` closes the sheet and advances together.
  const sheetOpen = openWidget === 'send-instructions' && phase !== 'done'
  const showInlineStatus =
    phase === 'pending' ||
    phase === 'success' ||
    ((phase === 'done' || instructionsSent) && (persist || instructionsSent))
  return (
    <Task cue={showInlineStatus && !sheetOpen ? false : undefined}>
      <Task.Eyebrow>
        {ACTIVATION_COPY.eyebrow} · {ACTIVATION_COPY.stepLabel(STEP_INDEX, STEP_TOTAL)}
        {(phase === 'done' || instructionsSent) && persist ? ' · Done' : ''}
      </Task.Eyebrow>
      <Task.Verbatim>{step1.verbatim}</Task.Verbatim>
      <Task.Body>
        <MediaSlot src="/activation-troubleshooting.jpg" alt={CUSTOMER.device} />
        <ol className="task-detail task-steps">
          {step1.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <a
          href="#"
          className="motion-press inline-block text-sm text-[var(--ew-accent-soft)] underline"
          onClick={(e) => e.preventDefault()}
        >
          {step1.ozmoLabel}
        </a>

        {/*
          The live column moves to Discovery the moment the send settles, so this
          branch is only ever seen on the paths with no sheet open: reviewing the
          finished step, or a beat scrubbed from the demo bar.
        */}
        {showInlineStatus && !sheetOpen ? (
          <Task.Status
            phase={phase === 'pending' ? 'pending' : 'success'}
            pendingLabel={step1.sendingStatus}
            successLabel={step1.sentTo(destination)}
          />
        ) : !instructionsSent || review ? (
          <Task.Footer>
            <Task.Action onClick={openSendWidget} disabled={isBusy}>
              {step1.sendCta}
            </Task.Action>
          </Task.Footer>
        ) : null}

        {sheetOpen ? (
          <InputWidget
            title={step1.sendLabel}
            onClose={() => {
              if (!isBusy) patch({ openWidget: null })
            }}
            footer={
              isBusy ? (
                <Task.Status
                  phase={phase === 'pending' ? 'pending' : 'success'}
                  pendingLabel={step1.sendingStatus}
                  successLabel={step1.sentConfirm}
                />
              ) : (
                // Present from the moment the sheet opens; stays disabled until a
                // send channel is chosen rather than popping in on selection.
                <ActionDockPrimary onClick={sendInstructions} disabled={!sendChannel}>
                  {ACTIVATION_COPY.step1.sendCta}
                </ActionDockPrimary>
              )
            }
          >
            <SendChannelSlot
              value={sendChannel}
              onChange={isBusy ? () => undefined : setSendChannel}
              smsDestination={CUSTOMER.phone}
              emailDestination={CUSTOMER.email}
              label={SEND_CHANNEL_COPY.contactLabel}
            />
          </InputWidget>
        ) : null}
      </Task.Body>
    </Task>
  )
}
