'use client'

import type { Activities } from '@/lib/types'
import { EMPTY_SALES_PROGRESS } from '@/lib/sales-settlement'
import { useConsoleStore, type ConsoleState } from '@/store/console-store'

export type SectionId = 'verify' | 'solve' | 'sell'

export type StepId =
  | 'verify-choices'
  | 'device'
  | 'activate'
  | 'discovery'
  | 'confirm'
  | 'pitch'
  | 'guided-browsing'
  | 'benefits'
  | 'objection'
  | 'success'

export type StepStatus = 'upcoming' | 'active' | 'complete'

export type FlowCursor = { section: SectionId; step: StepId }

export const SECTIONS: {
  id: SectionId
  label: string
  steps: { id: StepId; label: string }[]
}[] = [
  {
    id: 'verify',
    label: 'Verify',
    steps: [
      { id: 'verify-choices', label: 'Verification' },
      { id: 'device', label: 'Select device' },
    ],
  },
  {
    id: 'solve',
    label: 'Solve',
    steps: [
      { id: 'activate', label: 'Activation' },
      { id: 'discovery', label: 'Discovery' },
      { id: 'confirm', label: 'Confirm resolution' },
    ],
  },
  {
    id: 'sell',
    label: 'Sell',
    steps: [
      { id: 'pitch', label: 'Pitch' },
      { id: 'guided-browsing', label: 'Guided Browsing' },
      { id: 'benefits', label: 'Benefits and price' },
      { id: 'objection', label: 'Objection' },
      { id: 'success', label: 'Success' },
    ],
  },
]

export const SECTION_ORDER: SectionId[] = SECTIONS.map((s) => s.id)

export const STEP_ORDER: StepId[] = SECTIONS.flatMap((s) => s.steps.map((st) => st.id))

export function getSectionForStep(step: StepId): SectionId {
  for (const section of SECTIONS) {
    if (section.steps.some((s) => s.id === step)) return section.id
  }
  return 'verify'
}

export function getSectionMeta(section: SectionId) {
  return SECTIONS.find((s) => s.id === section) ?? SECTIONS[0]
}

/** Flat previous step — crosses section boundaries. */
export function getPreviousStep(step: StepId): StepId | null {
  const idx = STEP_ORDER.indexOf(step)
  if (idx <= 0) return null
  return STEP_ORDER[idx - 1]
}

export function getNextStep(step: StepId): StepId | null {
  const idx = STEP_ORDER.indexOf(step)
  if (idx < 0 || idx >= STEP_ORDER.length - 1) return null
  return STEP_ORDER[idx + 1]
}

type FlowState = Pick<
  ConsoleState,
  | 'activities'
  | 'verifyComplete'
  | 'opportunityUnlocked'
  | 'scene'
  | 'selectedDeviceId'
  | 'instructionsSent'
  | 'discoveryAsked'
  | 'resolutionConfirmedVia'
  | 'activeScriptKey'
  | 'enrollmentStatus'
  | 'rebuttalGenerated'
  | 'guidedBrowsingStatus'
  | 'openWidget'
>

/**
 * Sell progress is driven by the sales script key, not by a step flag. These
 * ranks map the real keys in `sales-assist-steps` onto the Sell step pills so
 * the live step advances with the script.
 */
const SALES_RANK = {
  pitch: 0,
  guidedBrowsing: 1,
  benefits: 2,
  objection: 3,
  success: 4,
} as const

function salesKeyRank(key: string | null | undefined): number {
  if (!key) return -1
  if (key === 'transition') return SALES_RANK.pitch
  if (key === 'guide' || key === 'send-details') return SALES_RANK.guidedBrowsing
  if (key.startsWith('offer')) return SALES_RANK.benefits
  if (key === 'rebuttal') return SALES_RANK.objection
  if (key === 'close-ask') return SALES_RANK.success
  return -1
}

function isStepComplete(step: StepId, state: FlowState): boolean {
  const { activities, verifyComplete, opportunityUnlocked, scene } = state
  switch (step) {
    case 'verify-choices':
      // Input Widget overlays stay on this step — only full verify completes it.
      return verifyComplete || activities.verify === 'compressed' || activities.verify === 'complete'
    case 'device':
      return Boolean(state.selectedDeviceId)
    case 'activate':
      return state.instructionsSent || activities.discovery !== 'hidden' || activities.activation === 'complete'
    case 'discovery':
      return state.discoveryAsked !== null || activities.discovery === 'complete'
    case 'confirm':
      return Boolean(state.resolutionConfirmedVia) || opportunityUnlocked
    case 'pitch':
      return salesKeyRank(state.activeScriptKey) > SALES_RANK.pitch || activities.sales === 'complete'
    case 'guided-browsing':
      return (
        state.guidedBrowsingStatus !== 'idle' ||
        salesKeyRank(state.activeScriptKey) > SALES_RANK.guidedBrowsing ||
        activities.sales === 'complete'
      )
    case 'benefits':
      return (
        state.rebuttalGenerated ||
        salesKeyRank(state.activeScriptKey) > SALES_RANK.benefits ||
        activities.sales === 'complete'
      )
    case 'objection':
      return (
        state.enrollmentStatus === 'complete' ||
        state.enrollmentStatus === 'declined' ||
        activities.sales === 'complete' ||
        scene === 'pit-stop'
      )
    case 'success':
      return (
        state.enrollmentStatus === 'complete' ||
        activities.sales === 'complete' ||
        scene === 'pit-stop'
      )
    default:
      return false
  }
}

function isStepStarted(step: StepId, state: FlowState): boolean {
  const { activities, opportunityUnlocked, scene } = state
  switch (step) {
    case 'verify-choices':
      return activities.verify !== 'hidden'
    case 'device':
      return (
        state.verifyComplete ||
        activities.verify === 'compressed' ||
        activities.verify === 'complete'
      )
    case 'activate':
      return Boolean(state.selectedDeviceId) || state.instructionsSent || activities.activation === 'active'
    case 'discovery':
      return activities.discovery !== 'hidden'
    case 'confirm':
      return scene === 'confirm-solve' || Boolean(state.resolutionConfirmedVia)
    case 'pitch':
      return opportunityUnlocked || activities.sales !== 'hidden'
    case 'guided-browsing':
      return (
        salesKeyRank(state.activeScriptKey) === SALES_RANK.guidedBrowsing ||
        state.guidedBrowsingStatus !== 'idle'
      )
    case 'benefits':
      return salesKeyRank(state.activeScriptKey) === SALES_RANK.benefits
    case 'objection':
      return state.activeScriptKey === 'rebuttal' || state.rebuttalGenerated
    case 'success':
      return (
        salesKeyRank(state.activeScriptKey) === SALES_RANK.success ||
        state.enrollmentStatus === 'complete' ||
        state.enrollmentStatus === 'submitted' ||
        scene === 'close'
      )
    default:
      return false
  }
}

export function getStepStatuses(state: FlowState): Record<StepId, StepStatus> {
  const statuses = {} as Record<StepId, StepStatus>
  for (const step of STEP_ORDER) {
    if (isStepComplete(step, state)) statuses[step] = 'complete'
    else if (isStepStarted(step, state)) statuses[step] = 'active'
    else statuses[step] = 'upcoming'
  }
  return statuses
}

export function getLiveStep(state: FlowState): StepId {
  const statuses = getStepStatuses(state)
  const active = STEP_ORDER.find((id) => statuses[id] === 'active')
  if (active) return active
  const lastComplete = [...STEP_ORDER].reverse().find((id) => statuses[id] === 'complete')
  return lastComplete ?? 'verify-choices'
}

export function getLiveSection(state: FlowState): SectionId {
  return getSectionForStep(getLiveStep(state))
}

export function useStepStatuses(): Record<StepId, StepStatus> {
  const activities = useConsoleStore((s) => s.activities)
  const verifyComplete = useConsoleStore((s) => s.verifyComplete)
  const opportunityUnlocked = useConsoleStore((s) => s.opportunityUnlocked)
  const scene = useConsoleStore((s) => s.scene)
  const selectedDeviceId = useConsoleStore((s) => s.selectedDeviceId)
  const instructionsSent = useConsoleStore((s) => s.instructionsSent)
  const discoveryAsked = useConsoleStore((s) => s.discoveryAsked)
  const resolutionConfirmedVia = useConsoleStore((s) => s.resolutionConfirmedVia)
  const activeScriptKey = useConsoleStore((s) => s.activeScriptKey)
  const enrollmentStatus = useConsoleStore((s) => s.enrollmentStatus)
  const rebuttalGenerated = useConsoleStore((s) => s.rebuttalGenerated)
  const guidedBrowsingStatus = useConsoleStore((s) => s.guidedBrowsingStatus)
  const openWidget = useConsoleStore((s) => s.openWidget)
  return getStepStatuses({
    activities,
    verifyComplete,
    opportunityUnlocked,
    scene,
    selectedDeviceId,
    instructionsSent,
    discoveryAsked,
    resolutionConfirmedVia,
    activeScriptKey,
    enrollmentStatus,
    rebuttalGenerated,
    guidedBrowsingStatus,
    openWidget,
  })
}

export function useLiveStep(): StepId {
  const statuses = useStepStatuses()
  const active = STEP_ORDER.find((id) => statuses[id] === 'active')
  if (active) return active
  const lastComplete = [...STEP_ORDER].reverse().find((id) => statuses[id] === 'complete')
  return lastComplete ?? 'verify-choices'
}

export function useLiveSection(): SectionId {
  return getSectionForStep(useLiveStep())
}

/** Prior completed step for the back arrow — review without wiping progress. */
export function getPreviousReviewableStep(
  viewStep: StepId,
  statuses: Record<StepId, StepStatus>,
): StepId | null {
  const idx = STEP_ORDER.indexOf(viewStep)
  for (let i = idx - 1; i >= 0; i -= 1) {
    const id = STEP_ORDER[i]
    if (statuses[id] === 'complete') return id
  }
  return null
}

/**
 * After a breaking edit on a completed step, drop later progress and resume
 * from that step — earlier completed chips stay intact.
 */
export function invalidateDownstreamFrom(step: StepId) {
  const state = useConsoleStore.getState()
  const activities: Activities = { ...state.activities }
  const section = getSectionForStep(step)

  if (section === 'verify') {
    activities.verify = step === 'verify-choices' ? 'active' : 'compressed'
    activities.activation = 'hidden'
    activities.discovery = 'hidden'
    activities.sales = 'hidden'
    activities.enrollment = 'hidden'
    useConsoleStore.getState().patch({
      stepFocus: null,
      activities,
      verifyComplete: step === 'device',
      selectedDeviceId: step === 'device' ? state.selectedDeviceId : null,
      instructionsSent: false,
      discoveryAsked: null,
      resolutionConfirmedVia: null,
      opportunityUnlocked: false,
      activationStep: 1,
      openWidget: null,
      rebuttalGenerated: false,
      guidedBrowsingChannel: null,
      guidedBrowsingStatus: 'idle',
      ...EMPTY_SALES_PROGRESS,
      enrollmentStatus: 'idle',
      disclosuresRead: false,
      scene: step === 'device' ? 'activation' : 'verify',
    })
    return
  }

  if (section === 'solve') {
    activities.verify = 'complete'
    activities.activation = 'active'
    activities.discovery = step === 'discovery' || step === 'confirm' ? 'complete' : 'hidden'
    activities.sales = 'hidden'
    activities.enrollment = 'hidden'
    useConsoleStore.getState().patch({
      stepFocus: null,
      activities,
      verifyComplete: true,
      selectedDeviceId: state.selectedDeviceId ?? 'iphone-15',
      instructionsSent: step !== 'activate' ? state.instructionsSent : false,
      discoveryAsked: step === 'confirm' ? state.discoveryAsked : null,
      resolutionConfirmedVia: null,
      opportunityUnlocked: false,
      activationStep: 1,
      openWidget: null,
      rebuttalGenerated: false,
      guidedBrowsingChannel: null,
      guidedBrowsingStatus: 'idle',
      ...EMPTY_SALES_PROGRESS,
      enrollmentStatus: 'idle',
      disclosuresRead: false,
      scene: step === 'confirm' ? 'confirm-solve' : 'activation',
    })
    return
  }

  // sell — reopen sales without wiping solve
  activities.sales = 'active'
  useConsoleStore.getState().patch({
    stepFocus: null,
    activities,
    ...EMPTY_SALES_PROGRESS,
    activeScriptKey: 'transition',
    surfacedScriptKeys: ['transition'],
    karaokeProgressByKey: { transition: 0 },
    enrollmentStatus: 'idle',
    disclosuresRead: false,
    rebuttalGenerated: false,
    guidedBrowsingChannel: null,
    guidedBrowsingStatus: 'idle',
    openWidget: null,
    scene: 'opportunity',
  })
}

/* ------------------------------------------------------------------ */
/* Back-compat aliases used during the migration of older call sites. */
/* ------------------------------------------------------------------ */

/** @deprecated Use SectionId / StepId */
export type FlowStepId = SectionId
/** @deprecated Use StepStatus */
export type FlowStepStatus = StepStatus

/** @deprecated Use SECTIONS */
export const FLOW_STEPS = SECTIONS.map((s) => ({ id: s.id, label: s.label }))
export const FLOW_STEP_ORDER = SECTION_ORDER

/** @deprecated Prefer getLiveStep */
export function getLiveFlowStep(state: FlowState): SectionId {
  return getLiveSection(state)
}

/** @deprecated Prefer getStepStatuses */
export function getFlowStepStatuses(state: FlowState): Record<SectionId, StepStatus> {
  const stepStatuses = getStepStatuses(state)
  const out = {} as Record<SectionId, StepStatus>
  for (const section of SECTIONS) {
    const statuses = section.steps.map((s) => stepStatuses[s.id])
    if (statuses.every((s) => s === 'complete')) out[section.id] = 'complete'
    else if (statuses.some((s) => s === 'active' || s === 'complete')) out[section.id] = 'active'
    else out[section.id] = 'upcoming'
  }
  return out
}

export function useFlowStepStatuses(): Record<SectionId, StepStatus> {
  return getFlowStepStatuses({
    activities: useConsoleStore((s) => s.activities),
    verifyComplete: useConsoleStore((s) => s.verifyComplete),
    opportunityUnlocked: useConsoleStore((s) => s.opportunityUnlocked),
    scene: useConsoleStore((s) => s.scene),
    selectedDeviceId: useConsoleStore((s) => s.selectedDeviceId),
    instructionsSent: useConsoleStore((s) => s.instructionsSent),
    discoveryAsked: useConsoleStore((s) => s.discoveryAsked),
    resolutionConfirmedVia: useConsoleStore((s) => s.resolutionConfirmedVia),
    activeScriptKey: useConsoleStore((s) => s.activeScriptKey),
    enrollmentStatus: useConsoleStore((s) => s.enrollmentStatus),
    rebuttalGenerated: useConsoleStore((s) => s.rebuttalGenerated),
    guidedBrowsingStatus: useConsoleStore((s) => s.guidedBrowsingStatus),
    openWidget: useConsoleStore((s) => s.openWidget),
  })
}

export function useLiveFlowStep(): SectionId {
  return useLiveSection()
}

/** @deprecated Use named StepId */
export type SolveSubstep = 1 | 2 | 3 | 4

export function getLiveSolveSubstep(
  state: Pick<ConsoleState, 'activities' | 'activationStep' | 'selectedDeviceId' | 'discoveryAsked' | 'resolutionConfirmedVia'>,
): SolveSubstep {
  if (state.resolutionConfirmedVia) return 4
  if (state.discoveryAsked !== null || state.activities.discovery === 'complete') return 3
  if (state.activationStep >= 2 || state.activities.activation === 'compressed') return 4
  if (state.selectedDeviceId) return 2
  return 1
}

export function useLiveSolveSubstep(): SolveSubstep {
  const activities = useConsoleStore((s) => s.activities)
  const activationStep = useConsoleStore((s) => s.activationStep)
  const selectedDeviceId = useConsoleStore((s) => s.selectedDeviceId)
  const discoveryAsked = useConsoleStore((s) => s.discoveryAsked)
  const resolutionConfirmedVia = useConsoleStore((s) => s.resolutionConfirmedVia)
  return getLiveSolveSubstep({
    activities,
    activationStep,
    selectedDeviceId,
    discoveryAsked,
    resolutionConfirmedVia,
  })
}
