'use client'

import { useState, type CSSProperties } from 'react'
import { PinInput } from '@mantine/core'
import { Task } from '@/components/task'
import {
  ActionDockPrimary,
  ActionSlot,
  InputWidget,
} from '@/components/chat'
import { CUSTOMER } from '@/lib/fixtures'
import { invalidateDownstreamFrom } from '@/lib/flow-steps'
import { VERIFY_COPY } from '@/lib/task-content'
import { useConsoleStore } from '@/store/console-store'
import { useDirector } from '@/hooks/use-director'
import { useStatusSequence } from '@/hooks/use-status-sequence'

const PIN_LENGTH = 4
const CODE_LENGTH = CUSTOMER.otp.length

function VerifyPinFields({
  value,
  onChange,
  inputKey,
  length = PIN_LENGTH,
  ariaLabel = VERIFY_COPY.pinLabel,
  disabled = false,
}: {
  value: string
  onChange: (value: string) => void
  inputKey?: string | number
  length?: number
  ariaLabel?: string
  disabled?: boolean
}) {
  return (
    <div className="verify-code">
      <PinInput
        key={inputKey}
        classNames={{
          root: 'verify-code__row',
          pinInput: 'verify-code__pin',
          input: 'verify-code__cell',
        }}
        styles={{
          root: {
            '--pin-input-size': '52px',
          } as CSSProperties,
        }}
        length={length}
        type="number"
        gap={8}
        radius={16}
        autoFocus={!disabled}
        disabled={disabled}
        value={value}
        onChange={onChange}
        ariaLabel={ariaLabel}
        placeholder=""
      />
    </div>
  )
}

export function VerifyActivity({
  review = false,
  persist = false,
}: {
  review?: boolean
  persist?: boolean
}) {
  const verifyComplete = useConsoleStore((s) => s.verifyComplete)
  const activities = useConsoleStore((s) => s.activities)
  const pinInput = useConsoleStore((s) => s.pinInput)
  const verifyChannel = useConsoleStore((s) => s.verifyChannel)
  const openWidget = useConsoleStore((s) => s.openWidget)
  const patch = useConsoleStore((s) => s.patch)
  const { resolveGate } = useDirector()

  const reallyDone =
    verifyComplete || activities.verify === 'compressed' || activities.verify === 'complete'
  const storeDone = review ? false : reallyDone

  const { phase, begin, isBusy } = useStatusSequence({
    storeDone,
    onResolve: () => {
      patch({ verifyComplete: true, openWidget: null })
      if (review) {
        invalidateDownstreamFrom('verify-choices')
        return
      }
      resolveGate()
    },
  })

  const [attempts, setAttempts] = useState(0)
  /** Bumped on every clear so the box input remounts empty and refocuses. */
  const [entryKey, setEntryKey] = useState(0)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [channelChoice, setChannelChoice] = useState<'sms' | 'email' | 'pin' | null>(
    verifyChannel,
  )

  if (activities.verify === 'hidden' && !review && !persist) return null
  if (phase === 'done' && !review && !persist) return null
  if (phase === 'done' && review) return null

  // Held open through `success`, not just `pending`: the confirmation belongs in
  // the footer the expert was just looking at. `done` is what closes the sheet,
  // and it arrives on the same commit that advances the flow.
  const showPinSheet =
    (openWidget === 'verify-pin' || channelChoice === 'pin') && phase !== 'done'
  const showCodeSheet =
    (openWidget === 'verify-code' || channelChoice === 'sms' || channelChoice === 'email') &&
    phase !== 'done'

  // The PIN is the carrier's 4 digits; the texted or emailed code is 5.
  const entryLength = showPinSheet || channelChoice === 'pin' ? PIN_LENGTH : CODE_LENGTH
  const expectedEntry =
    showPinSheet || channelChoice === 'pin' ? CUSTOMER.pin : CUSTOMER.otp
  const sendDestination = channelChoice === 'email' ? CUSTOMER.email : CUSTOMER.phone
  const pendingLabel =
    channelChoice === 'pin' ? VERIFY_COPY.verifyingPin : VERIFY_COPY.verifyingCode

  const clearEntry = () => {
    setEntryKey((current) => current + 1)
    patch({ pinInput: '' })
  }

  const closeWidget = () => {
    if (isBusy) return
    patch({ openWidget: null, verifyChannel: null, pinInput: '' })
    setChannelChoice(null)
    setCodeError(null)
    setAttempts(0)
  }

  const selectChannel = (value: string) => {
    if (isBusy) return
    const next = value as 'sms' | 'email' | 'pin'
    setChannelChoice(next)
    setCodeError(null)
    setAttempts(0)
    clearEntry()
    patch({
      verifyChannel: next,
      // Picking a channel sends the code — the sheet collects it, no confirm step.
      openWidget: next === 'pin' ? 'verify-pin' : 'verify-code',
      pinInput: '',
    })
  }

  const submitCode = () => {
    if (isBusy) return
    if (pinInput.length !== entryLength) return
    if (pinInput !== expectedEntry) {
      const nextAttempts = attempts + 1
      const secondTry = nextAttempts >= 2
      setAttempts(nextAttempts)
      setCodeError(
        showPinSheet || channelChoice === 'pin'
          ? secondTry
            ? VERIFY_COPY.pinWrongSecond
            : VERIFY_COPY.pinWrong
          : secondTry
            ? VERIFY_COPY.codeWrongSecond
            : VERIFY_COPY.codeWrong,
      )
      clearEntry()
      return
    }
    setCodeError(null)
    begin(true)
  }

  // Resending starts the customer over, so the error ladder resets with it.
  const resendCode = () => {
    if (isBusy) return
    setCodeError(null)
    setAttempts(0)
    clearEntry()
  }

  const showInlineStatus = phase === 'pending' || phase === 'success' || (phase === 'done' && persist)
  const sheetOpen = showPinSheet || showCodeSheet

  // The sheets overlay the verify turn — the choices and script stay behind them
  // until the expert commits. The whole status beat, pending *and* confirmation,
  // plays in the sheet footer; the sheet then closes on the same commit that
  // advances the flow, so the confirmation never re-appears on the card behind
  // it. The inline branch below is for the paths with no sheet open: a persisted
  // record in review, or a beat scrubbed from the demo bar.
  return (
    <Task cue={showInlineStatus && !sheetOpen ? false : undefined}>
      <Task.Eyebrow>
        {VERIFY_COPY.eyebrow}
        {phase === 'done' && persist ? ' · Done' : ''}
      </Task.Eyebrow>
      <Task.Verbatim>{VERIFY_COPY.verbatim}</Task.Verbatim>
      <Task.Body>
        {showInlineStatus && !sheetOpen ? (
          <Task.Status
            phase={phase === 'pending' ? 'pending' : 'success'}
            pendingLabel={pendingLabel}
            successLabel={VERIFY_COPY.successConfirm}
          />
        ) : (
          <ActionSlot
            onSelect={selectChannel}
            options={[
              {
                value: 'sms',
                title: VERIFY_COPY.textOption,
                subtitle: CUSTOMER.phone,
              },
              {
                value: 'email',
                title: VERIFY_COPY.emailOption,
                subtitle: CUSTOMER.email,
              },
              {
                // The carrier-PIN fallback, now a third card — selecting it still
                // routes through the same verify-pin sheet as the old link did.
                value: 'pin',
                title: VERIFY_COPY.pinOption,
                subtitle: VERIFY_COPY.pinOptionHint,
              },
            ]}
          />
        )}

        {sheetOpen ? (
          <InputWidget
            title={showPinSheet ? VERIFY_COPY.pinLabel : VERIFY_COPY.codeLabel}
            onClose={closeWidget}
            footer={
              isBusy ? (
                <Task.Status
                  phase={phase === 'pending' ? 'pending' : 'success'}
                  pendingLabel={pendingLabel}
                  successLabel={VERIFY_COPY.successConfirm}
                />
              ) : (
                // Present from the moment the sheet opens; stays disabled until
                // the full PIN/code is entered rather than popping in on the last
                // keystroke.
                <ActionDockPrimary
                  onClick={submitCode}
                  disabled={pinInput.length !== entryLength}
                >
                  {VERIFY_COPY.pinCta}
                </ActionDockPrimary>
              )
            }
          >
            {showCodeSheet ? (
              <p className="task-detail text-center">
                {VERIFY_COPY.codeSentTo(sendDestination)}
              </p>
            ) : null}
            <VerifyPinFields
              inputKey={entryKey}
              length={entryLength}
              ariaLabel={showPinSheet ? VERIFY_COPY.pinLabel : VERIFY_COPY.codeLabel}
              value={pinInput}
              onChange={(value) => patch({ pinInput: value })}
              disabled={isBusy}
            />
            {codeError && !isBusy ? (
              <p className="task-detail text-center text-[var(--aui-error)]">{codeError}</p>
            ) : null}
            {showCodeSheet && !isBusy ? (
              <button
                type="button"
                className="motion-press text-sm font-medium text-[var(--aui-on-surface-soft)] underline"
                onClick={resendCode}
              >
                {VERIFY_COPY.sendAgain}
              </button>
            ) : null}
          </InputWidget>
        ) : null}
      </Task.Body>
    </Task>
  )
}
