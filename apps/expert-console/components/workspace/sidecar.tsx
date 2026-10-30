'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import { InputWidgetLayer } from '@/components/chat'
import { useConsoleStore } from '@/store/console-store'
import {
  getPreviousReviewableStep,
  getSectionForStep,
  useLiveStep,
  useStepStatuses,
  type StepId,
} from '@/lib/flow-steps'
import { ActivationActivity } from '../activities/activation-activity'
import { ConfirmActivity } from '../activities/confirm-activity'
import { DeviceActivity } from '../activities/device-activity'
import { DiscoveryActivity } from '../activities/discovery-activity'
import { SalesActivity } from '../activities/sales-activity'
import { VerifyActivity } from '../activities/verify-activity'
import { AssistDock } from '../assist/assist-dock'
import { MotionTaskShell } from '../motion/motion-task-shell'
import { FlowSteps } from './flow-steps'

const SELL_STEPS: StepId[] = ['pitch', 'guided-browsing', 'benefits', 'objection', 'success']

function isSellStep(step: StepId): boolean {
  return SELL_STEPS.includes(step)
}

/**
 * One step at a time in the guidance column; back walks completed steps via
 * `getPreviousReviewableStep`.
 */
export function Sidecar() {
  const stepFocus = useConsoleStore((s) => s.stepFocus) as StepId | null
  const liveStep = useLiveStep()
  const statuses = useStepStatuses()
  const patch = useConsoleStore((s) => s.patch)
  const activities = useConsoleStore((s) => s.activities)
  const activationStep = useConsoleStore((s) => s.activationStep)
  const instructionsSent = useConsoleStore((s) => s.instructionsSent)
  const verifyComplete = useConsoleStore((s) => s.verifyComplete)
  const selectedDeviceId = useConsoleStore((s) => s.selectedDeviceId)
  const discoveryAsked = useConsoleStore((s) => s.discoveryAsked)
  const resolutionConfirmedVia = useConsoleStore((s) => s.resolutionConfirmedVia)
  const activeScriptKey = useConsoleStore((s) => s.activeScriptKey)
  const salesFocusKey = useConsoleStore((s) => s.salesFocusKey)
  const surfacedScriptKeys = useConsoleStore((s) => s.surfacedScriptKeys)
  const enrollmentStatus = useConsoleStore((s) => s.enrollmentStatus)
  const openWidget = useConsoleStore((s) => s.openWidget)
  const opportunityUnlocked = useConsoleStore((s) => s.opportunityUnlocked)

  const viewStep = stepFocus ?? liveStep
  const reviewing = stepFocus !== null
  const previousStep = getPreviousReviewableStep(viewStep, statuses)
  const canGoBack = Boolean(previousStep)

  const scrollKey = [
    viewStep,
    activities.verify,
    activities.activation,
    activities.discovery,
    activities.sales,
    activationStep,
    instructionsSent,
    verifyComplete,
    selectedDeviceId,
    discoveryAsked,
    resolutionConfirmedVia,
    activeScriptKey,
    salesFocusKey,
    surfacedScriptKeys.length,
    enrollmentStatus,
    openWidget,
    opportunityUnlocked,
  ].join(':')

  const goBack = () => {
    if (!previousStep) return
    if (previousStep === liveStep) {
      patch({ stepFocus: null, flowFocus: null, salesFocusKey: null, openWidget: null })
      return
    }
    patch({
      stepFocus: previousStep,
      flowFocus: getSectionForStep(previousStep),
      salesFocusKey: null,
      openWidget: null,
    })
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="flow-steps-bar">
        <FlowSteps />
        <div className="flow-back-row">
          {canGoBack ? (
            <button
              type="button"
              className="flow-back-btn"
              aria-label="Back to previous step"
              onClick={goBack}
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="flow-back-spacer" aria-hidden />
          )}
        </div>
      </div>

      <div className="sidecar-stage">
        <StepScrollColumn scrollKey={scrollKey}>
          {viewStep === 'verify-choices' ? (
            <MotionTaskShell>
              <VerifyActivity review={reviewing} persist />
            </MotionTaskShell>
          ) : null}

          {viewStep === 'device' ? (
            <MotionTaskShell>
              <DeviceActivity review={reviewing} persist />
            </MotionTaskShell>
          ) : null}

          {viewStep === 'activate' ? (
            <MotionTaskShell>
              <ActivationActivity review={reviewing} persist />
            </MotionTaskShell>
          ) : null}

          {viewStep === 'discovery' ? (
            <MotionTaskShell>
              <DiscoveryActivity review={reviewing} persist />
            </MotionTaskShell>
          ) : null}

          {viewStep === 'confirm' ? (
            <MotionTaskShell>
              <ConfirmActivity review={reviewing} persist />
            </MotionTaskShell>
          ) : null}

          {isSellStep(viewStep) ? (
            <SalesActivity review={reviewing} persist stepId={viewStep} />
          ) : null}
        </StepScrollColumn>

        <InputWidgetLayer />
      </div>

      <div className="pointer-events-auto shrink-0">
        <AssistDock />
      </div>
    </div>
  )
}

function StepScrollColumn({
  children,
  scrollKey,
}: {
  children: ReactNode
  scrollKey: string
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const prevKey = useRef(scrollKey)

  useEffect(() => {
    const scroller = scrollerRef.current
    const end = endRef.current
    if (!scroller || !end) return

    const keyChanged = prevKey.current !== scrollKey
    prevKey.current = scrollKey

    const scrollToLatest = (smooth: boolean) => {
      end.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'end' })
    }

    if (keyChanged) {
      scrollToLatest(true)
    }

    const ro = new ResizeObserver(() => {
      const distanceFromBottom =
        scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight
      if (distanceFromBottom < 120) {
        scrollToLatest(false)
      }
    })
    ro.observe(scroller)
    return () => ro.disconnect()
  }, [scrollKey])

  return (
    <div ref={scrollerRef} className="sidecar-reading">
      <div className="sidecar-reading-inner">
        {children}
        <div ref={endRef} className="h-px w-full shrink-0" aria-hidden />
      </div>
    </div>
  )
}
