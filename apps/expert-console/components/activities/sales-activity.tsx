'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Task } from '@/components/task'
import { SalesKaraokeText } from '@/components/sales/sales-karaoke-text'
import {
  ActionDockPrimary,
  InputWidget,
  SendChannelSlot,
  type SendChannel,
} from '@/components/chat'
import { useSalesKaraokeDrive } from '@/hooks/use-sales-karaoke-drive'
import { useStatusSequence } from '@/hooks/use-status-sequence'
import { fireEnrollmentConfetti } from '@/lib/confetti'
import type { StepId } from '@/lib/flow-steps'
import {
  ASSIST_SEND_DETAILS_KEY,
  getBeatEyebrowLabel,
  getSalesScript,
} from '@/lib/sales-assist-steps'
import { CUSTOMER, VHDP_OFFER } from '@/lib/fixtures'
import { SALES_COPY } from '@/lib/task-content'
import { OfferCard } from '@/components/device'
import { useConsoleStore } from '@/store/console-store'
import { useDirector } from '@/hooks/use-director'
import { MotionTaskShell } from '../motion/motion-task-shell'

/** Demo dwell while the customer finishes enrollment on their device. */
const ENROLLMENT_WAIT_MS = 2800

function isSettled(key: string, completed: readonly string[], skipped: readonly string[]) {
  return completed.includes(key) || skipped.includes(key)
}

export function SalesActivity({
  review = false,
  persist = false,
  stepId,
}: {
  review?: boolean
  persist?: boolean
  stepId?: StepId
}) {
  const opportunityUnlocked = useConsoleStore((s) => s.opportunityUnlocked)
  const activeScriptKey = useConsoleStore((s) => s.activeScriptKey)
  const salesFocusKey = useConsoleStore((s) => s.salesFocusKey)
  const completedScriptKeys = useConsoleStore((s) => s.completedScriptKeys)
  const skippedScriptKeys = useConsoleStore((s) => s.skippedScriptKeys)
  const karaokeProgressByKey = useConsoleStore((s) => s.karaokeProgressByKey)
  const enrollmentStatus = useConsoleStore((s) => s.enrollmentStatus)
  const rebuttalGenerated = useConsoleStore((s) => s.rebuttalGenerated)
  const openWidget = useConsoleStore((s) => s.openWidget)
  const guidedBrowsingChannel = useConsoleStore((s) => s.guidedBrowsingChannel)
  const settleSalesKey = useConsoleStore((s) => s.settleSalesKey)
  const patch = useConsoleStore((s) => s.patch)
  const { resolveGate } = useDirector()
  const celebratedRef = useRef(false)

  const [sendChannel, setSendChannel] = useState<SendChannel | null>(guidedBrowsingChannel)
  const [showSendWidget, setShowSendWidget] = useState(false)
  const sendChannelRef = useRef(sendChannel)
  sendChannelRef.current = sendChannel

  const sendDetailsSettled = isSettled(
    ASSIST_SEND_DETAILS_KEY,
    completedScriptKeys,
    skippedScriptKeys,
  )

  const {
    phase: sendPhase,
    begin: beginSend,
    isBusy: sendBusy,
  } = useStatusSequence({
    storeDone: sendDetailsSettled && guidedBrowsingChannel !== null,
    onResolve: () => {
      const channel = sendChannelRef.current
      patch({
        guidedBrowsingChannel: channel,
        guidedBrowsingStatus: 'sent',
      })
      setShowSendWidget(false)
      settleSalesKey(ASSIST_SEND_DETAILS_KEY, 'read')
    },
  })

  useSalesKaraokeDrive()

  // Sheet → card handoff for Guided Browsing send-link.
  useEffect(() => {
    if (sendPhase === 'success' && showSendWidget) {
      setShowSendWidget(false)
    }
  }, [sendPhase, showSendWidget])

  useEffect(() => {
    if (enrollmentStatus !== 'sent') return
    if (salesFocusKey) return

    const timer = window.setTimeout(() => {
      const lines = useConsoleStore.getState().transcript
      patch({
        enrollmentStatus: 'complete',
        transcript: [
          ...lines,
          {
            id: `t-enroll-${Date.now()}`,
            speaker: 'customer',
            label: 'Maria',
            text: 'Okay, I finished it.',
            timestamp: '',
          },
        ],
        activities: {
          ...useConsoleStore.getState().activities,
          enrollment: 'complete',
        },
      })
      if (!celebratedRef.current) {
        celebratedRef.current = true
        fireEnrollmentConfetti()
      }
      resolveGate()
    }, ENROLLMENT_WAIT_MS)

    return () => window.clearTimeout(timer)
  }, [enrollmentStatus, salesFocusKey, patch, resolveGate])

  useEffect(() => {
    if (enrollmentStatus === 'complete' && !celebratedRef.current) {
      celebratedRef.current = true
      fireEnrollmentConfetti()
    }
  }, [enrollmentStatus])

  if (!opportunityUnlocked && !review && !persist) return null

  if ((review || persist) && !opportunityUnlocked) {
    return (
      <Task className="motion-enter">
        <Task.Eyebrow>{SALES_COPY.unlocked.label}</Task.Eyebrow>
        <Task.Detail>Sell unlocks after Solve is complete.</Task.Detail>
      </Task>
    )
  }

  const viewKey = salesFocusKey ?? activeScriptKey
  const reviewingScript = salesFocusKey !== null
  const live = !reviewingScript && !review

  const sendEnrollment = () => {
    const state = useConsoleStore.getState()
    if (!isSettled('close-ask', state.completedScriptKeys, state.skippedScriptKeys)) {
      state.settleSalesKey('close-ask', 'read')
    }
    const next = useConsoleStore.getState()
    next.patch({
      enrollmentStatus: 'sent',
      salesFocusKey: null,
      activities: {
        ...next.activities,
        enrollment: 'active',
      },
    })
  }

  const declineEnrollment = () => {
    const state = useConsoleStore.getState()
    if (!isSettled('close-ask', state.completedScriptKeys, state.skippedScriptKeys)) {
      state.settleSalesKey('close-ask', 'skip')
    }
    const next = useConsoleStore.getState()
    next.patch({
      enrollmentStatus: 'declined',
      salesFocusKey: null,
      activities: {
        ...next.activities,
        enrollment: 'complete',
      },
    })
    resolveGate()
  }

  const generateRebuttal = () => {
    patch({
      rebuttalGenerated: true,
      activeScriptKey: 'rebuttal',
      surfacedScriptKeys: [
        ...new Set([...useConsoleStore.getState().surfacedScriptKeys, 'rebuttal']),
      ],
    })
  }

  const confirmSendLink = () => {
    if (!sendChannel || sendBusy) return
    beginSend(true)
  }

  const showEnrollmentComplete =
    live &&
    (stepId === 'success' || stepId === undefined) &&
    enrollmentStatus === 'complete'

  const showEnrollmentDeclined =
    live &&
    (stepId === 'success' || stepId === undefined) &&
    enrollmentStatus === 'declined'

  const showObjection =
    stepId === 'objection' || viewKey === 'rebuttal' || (live && rebuttalGenerated && viewKey === 'rebuttal')

  const sendShowStatus =
    sendPhase === 'pending' || sendPhase === 'success' || (sendPhase === 'done' && sendDetailsSettled)
  // Held open through `success` so "Link sent." lands in the footer; `onResolve`
  // drops `showSendWidget` on the same commit that settles the step.
  const sheetOpen = showSendWidget && sendPhase !== 'done'
  /**
   * Settled, sheet gone: the card keeps a muted record of where the link went, not
   * a second green check — that already played in the sheet footer. An in-flight
   * run with no sheet open (a scrubbed beat) still shows the live status below.
   */
  const sendRecord =
    !sendBusy && (sendPhase === 'done' || sendDetailsSettled) && guidedBrowsingChannel !== null
  const sendDestination = guidedBrowsingChannel === 'email' ? CUSTOMER.email : CUSTOMER.phone

  return (
    <div className="flex flex-col gap-6">
      <div className="motion-enter-unlock flex flex-col gap-3">
        <OfferCard
          name={VHDP_OFFER.name}
          price={VHDP_OFFER.price}
          cancelNote={VHDP_OFFER.cancelNote}
        />
        <button
          type="button"
          className="aui-text-action"
          onClick={() => patch({ openWidget: openWidget === 'more-products' ? null : 'more-products' })}
        >
          {SALES_COPY.moreProducts}
        </button>
        {openWidget === 'more-products' ? (
          <InputWidget
            title={SALES_COPY.moreProducts}
            onClose={() => patch({ openWidget: null })}
          >
            <Task.Detail>Additional Verizon products will appear here in production.</Task.Detail>
          </InputWidget>
        ) : null}
      </div>

      {viewKey === ASSIST_SEND_DETAILS_KEY &&
      (stepId === 'guided-browsing' || stepId === undefined) ? (
        <MotionTaskShell>
          <Task cue={sendShowStatus && !sheetOpen ? false : undefined}>
            <Task.Eyebrow>{SALES_COPY.sendDetails.eyebrow}</Task.Eyebrow>
            <Task.Verbatim>{SALES_COPY.sendDetails.verbatim}</Task.Verbatim>
            <Task.Directive>{SALES_COPY.sendDetails.directive}</Task.Directive>
            <Task.Body>
              {sendRecord ? (
                <p className="task-detail">
                  {SALES_COPY.sendDetails.sentRecord(sendDestination)}
                </p>
              ) : sendShowStatus && !sheetOpen ? (
                <Task.Status
                  phase={sendPhase === 'pending' ? 'pending' : 'success'}
                  pendingLabel={SALES_COPY.sendDetails.sendingStatus}
                  successLabel={SALES_COPY.sendDetails.sentConfirm}
                />
              ) : live && !sendDetailsSettled ? (
                <Task.Footer>
                  <Task.Action onClick={() => setShowSendWidget(true)} disabled={sendBusy}>
                    {SALES_COPY.sendDetails.sendCta}
                  </Task.Action>
                  {rebuttalGenerated ? (
                    <Task.Action
                      variant="secondary"
                      onClick={() => settleSalesKey(viewKey, 'skip')}
                      disabled={sendBusy}
                    >
                      {SALES_COPY.sendDetails.declineCta}
                    </Task.Action>
                  ) : null}
                </Task.Footer>
              ) : null}

              {sheetOpen ? (
                <InputWidget
                  title={SALES_COPY.sendDetails.sendCta}
                  onClose={() => {
                    if (!sendBusy) setShowSendWidget(false)
                  }}
                  footer={
                    sendBusy ? (
                      <Task.Status
                        phase={sendPhase === 'pending' ? 'pending' : 'success'}
                        pendingLabel={SALES_COPY.sendDetails.sendingStatus}
                        successLabel={SALES_COPY.sendDetails.sentConfirm}
                      />
                    ) : sendChannel ? (
                      <ActionDockPrimary onClick={confirmSendLink}>
                        {SALES_COPY.sendDetails.sendCta}
                      </ActionDockPrimary>
                    ) : null
                  }
                >
                  <SendChannelSlot
                    value={sendChannel}
                    onChange={sendBusy ? () => undefined : setSendChannel}
                    smsDestination={CUSTOMER.phone}
                    emailDestination={CUSTOMER.email}
                  />
                </InputWidget>
              ) : null}
            </Task.Body>
          </Task>
        </MotionTaskShell>
      ) : null}

      {showObjection && (stepId === 'objection' || viewKey === 'rebuttal') ? (
        <MotionTaskShell>
          <Task>
            <Task.Eyebrow>{SALES_COPY.objection.eyebrow}</Task.Eyebrow>
            <Task.Detail>{SALES_COPY.objection.customerLine}</Task.Detail>
            {rebuttalGenerated ? (
              <>
                <Task.Verbatim>{SALES_COPY.objection.rebuttal}</Task.Verbatim>
                {live ? (
                  <Task.Footer>
                    <Task.Action onClick={() => settleSalesKey('rebuttal', 'read')}>
                      {SALES_COPY.readCta}
                    </Task.Action>
                  </Task.Footer>
                ) : null}
              </>
            ) : live ? (
              <Task.Footer>
                <Task.Action onClick={generateRebuttal}>{SALES_COPY.generateRebuttalCta}</Task.Action>
              </Task.Footer>
            ) : null}
          </Task>
        </MotionTaskShell>
      ) : null}

      {viewKey && viewKey !== ASSIST_SEND_DETAILS_KEY && viewKey !== 'rebuttal'
        ? (() => {
            const def = getSalesScript(viewKey)
            if (!def) return null

            const settled = isSettled(viewKey, completedScriptKeys, skippedScriptKeys)
            const isLiveActive = live && activeScriptKey === viewKey && !settled
            const isCloseAsk = viewKey === 'close-ask'
            const progress = karaokeProgressByKey[viewKey] ?? (settled ? 1 : 0)
            const tagEyebrow = SALES_COPY.tagEyebrow[def.tag as keyof typeof SALES_COPY.tagEyebrow]
            const beatLabel = getBeatEyebrowLabel(viewKey)
            const enrollmentWaiting = isCloseAsk && live && enrollmentStatus === 'sent'

            const stepMatches =
              stepId === undefined ||
              (stepId === 'pitch' && viewKey === 'transition') ||
              (stepId === 'guided-browsing' &&
                (viewKey === 'guide' || viewKey === ASSIST_SEND_DETAILS_KEY)) ||
              (stepId === 'benefits' && viewKey.startsWith('offer')) ||
              (stepId === 'success' && isCloseAsk)

            if (stepId && !stepMatches) return null

            // Celebration / declined take over the live success step.
            if (isCloseAsk && live && (enrollmentStatus === 'complete' || enrollmentStatus === 'declined')) {
              return null
            }

            return (
              <MotionTaskShell>
                <Task cue={enrollmentWaiting ? false : undefined}>
                  <Task.Eyebrow>
                    {enrollmentWaiting
                      ? SALES_COPY.enrollment.eyebrow
                      : `${tagEyebrow} · ${beatLabel}`}
                  </Task.Eyebrow>
                  {enrollmentWaiting ? null : (
                    <Task.Verbatim>
                      <SalesKaraokeText
                        script={def.script}
                        verbatimText={def.verbatimText}
                        emphasisPhrases={def.emphasisPhrases}
                        progress={progress}
                      />
                    </Task.Verbatim>
                  )}
                  {def.grounding && !enrollmentWaiting ? (
                    <Task.Detail>{SALES_COPY.groundingDetail(def.grounding.quote)}</Task.Detail>
                  ) : null}
                  {enrollmentWaiting ? (
                    <Task.Body>
                      <Task.Status
                        phase="pending"
                        pendingLabel={SALES_COPY.enrollment.waiting}
                        successLabel={SALES_COPY.enrollment.success}
                      />
                    </Task.Body>
                  ) : null}
                  {isLiveActive && isCloseAsk && enrollmentStatus === 'idle' ? (
                    <Task.Footer>
                      <Task.Action onClick={sendEnrollment}>{SALES_COPY.enrollment.sendCta}</Task.Action>
                      {rebuttalGenerated ? (
                        <Task.Action variant="secondary" onClick={declineEnrollment}>
                          {SALES_COPY.enrollment.declineCta}
                        </Task.Action>
                      ) : null}
                    </Task.Footer>
                  ) : null}
                  {isLiveActive && !isCloseAsk ? (
                    <Task.Footer>
                      <Task.Action onClick={() => settleSalesKey(viewKey, 'read')}>
                        {SALES_COPY.readCta}
                      </Task.Action>
                      {(viewKey === 'transition' || viewKey === 'offer-5') && !rebuttalGenerated ? (
                        <Task.Action variant="secondary" onClick={generateRebuttal}>
                          {SALES_COPY.generateRebuttalCta}
                        </Task.Action>
                      ) : null}
                      {def.tag === 'Recommended' && viewKey !== 'offer-5' ? (
                        <Task.Action variant="secondary" onClick={() => settleSalesKey(viewKey, 'skip')}>
                          {SALES_COPY.skipCta}
                        </Task.Action>
                      ) : null}
                    </Task.Footer>
                  ) : null}
                </Task>
              </MotionTaskShell>
            )
          })()
        : null}

      {showEnrollmentComplete ? (
        <div className="enrollment-success motion-enter">
          <Image
            src="/cakes/success.png"
            alt=""
            width={120}
            height={120}
            className="enrollment-success-illustration"
            draggable={false}
          />
          <h2 className="enrollment-success-heading">
            {SALES_COPY.enrollment.successHeading}
          </h2>
          <p className="enrollment-success-detail">
            {SALES_COPY.enrollment.successDetail}
          </p>
        </div>
      ) : null}

      {showEnrollmentDeclined ? (
        <MotionTaskShell>
          <Task cue={false}>
            <Task.Eyebrow>{SALES_COPY.enrollment.eyebrow}</Task.Eyebrow>
            <Task.Detail>{SALES_COPY.enrollment.declined}</Task.Detail>
          </Task>
        </MotionTaskShell>
      ) : null}
    </div>
  )
}
