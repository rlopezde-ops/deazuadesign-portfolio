'use client'

import { Fragment } from 'react'
import { CaretRight } from '@phosphor-icons/react'
import {
  getSectionForStep,
  getSectionMeta,
  useLiveSection,
  useLiveStep,
  useStepStatuses,
  type StepId,
} from '@/lib/flow-steps'
import { useConsoleStore } from '@/store/console-store'

export type { StepId as FlowStepId }

/**
 * Section heading + step pills for the active section only (AUI flow strip).
 */
export function FlowSteps() {
  const statuses = useStepStatuses()
  const liveStep = useLiveStep()
  const liveSection = useLiveSection()
  const stepFocus = useConsoleStore((s) => s.stepFocus) as StepId | null
  const flowFocus = useConsoleStore((s) => s.flowFocus)
  const patch = useConsoleStore((s) => s.patch)

  const focusedStep = stepFocus ?? liveStep
  const displaySection =
    flowFocus ??
    (stepFocus ? getSectionForStep(stepFocus) : liveSection)
  const sectionMeta = getSectionMeta(displaySection)
  const steps = sectionMeta.steps

  return (
    <div className="flow-steps-block">
      <p className="flow-section-heading">{sectionMeta.label}</p>
      <div className="flow-steps" role="list" aria-label={`${sectionMeta.label} steps`}>
        {steps.map((step, index) => {
          const state = statuses[step.id]
          const isReviewing = stepFocus === step.id
          const isLive = liveStep === step.id && stepFocus === null
          const isActiveVisual = isLive || isReviewing
          const canOpenReview = state === 'complete' && !isReviewing
          const canReturnLive = stepFocus !== null && step.id === liveStep
          const clickable = canOpenReview || canReturnLive

          return (
            <Fragment key={step.id}>
              <button
                type="button"
                role="listitem"
                className={[
                  'flow-step',
                  isActiveVisual ? 'flow-step-active' : '',
                  !isActiveVisual && state === 'complete' ? 'flow-step-complete' : '',
                  !isActiveVisual && state === 'upcoming' ? 'flow-step-upcoming' : '',
                  !isActiveVisual && state === 'active' && !isLive ? 'flow-step-complete' : '',
                  clickable ? 'flow-step-clickable' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-current={isActiveVisual ? 'step' : undefined}
                aria-label={
                  canReturnLive
                    ? `${step.label}, current step — return here`
                    : canOpenReview
                      ? `${step.label}, completed — review this step`
                      : step.label
                }
                disabled={!clickable}
                onClick={() => {
                  if (canReturnLive) {
                    patch({ stepFocus: null, flowFocus: null, salesFocusKey: null })
                    return
                  }
                  if (canOpenReview) {
                    patch({
                      stepFocus: step.id,
                      flowFocus: getSectionForStep(step.id),
                      salesFocusKey: null,
                    })
                  }
                }}
              >
                <span className="flow-step-label">{step.label}</span>
              </button>
              {index < steps.length - 1 ? (
                <CaretRight
                  className="flow-step-chevron"
                  size={12}
                  weight="bold"
                  aria-hidden
                />
              ) : null}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
