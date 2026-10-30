import type { BeatEffect } from '@/lib/types'
import { settleSalesKeyPatch, surfaceSalesKeyPatch } from '@/lib/sales-settlement'
import type { ConsoleState } from '@/store/console-store'

let transcriptCounter = 0

function nextTranscriptId() {
  transcriptCounter += 1
  return `t-${transcriptCounter}`
}

function formatTimestamp(elapsedSeconds: number) {
  const m = Math.floor(elapsedSeconds / 60)
  const s = elapsedSeconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// Scripted pins get a deterministic, text-derived id so a clean replay
// (jumpToScene) rebuilds the same pins and never collides with the store's
// interactive `pin-${n}` ids.
function scriptedPinId(text: string) {
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `pin-fx-${slug}`
}

const cleanPinText = (text: string) => text.replace(/\s+/g, ' ').trim()

export function applyBeatEffects(
  state: ConsoleState,
  effects: BeatEffect[],
  direction: 'forward' | 'backward',
): Partial<ConsoleState> {
  const patch: Partial<ConsoleState> = {}

  for (const effect of effects) {
    if (direction === 'backward') {
      continue
    }

    switch (effect.type) {
      case 'setShiftPhase':
        patch.shiftPhase = effect.value
        break
      case 'setScene':
        patch.scene = effect.value
        break
      case 'appendTranscript': {
        const lines = [...(patch.transcript ?? state.transcript)]
        lines.push({
          id: nextTranscriptId(),
          speaker: effect.speaker,
          label: effect.label,
          text: effect.text,
          timestamp: formatTimestamp(state.callElapsedSeconds),
        })
        patch.transcript = lines
        break
      }
      case 'setProblem':
        patch.problemSummary = effect.value
        break
      case 'captureFact':
        patch.facts = {
          ...(patch.facts ?? state.facts),
          [effect.key]: effect.value,
        }
        break
      case 'pinItems': {
        const next = [...(patch.pins ?? state.pins)]
        for (const raw of effect.items) {
          const text = cleanPinText(raw)
          if (!text) continue
          if (next.some((p) => p.text === text)) continue
          next.push({ id: scriptedPinId(text), text })
        }
        patch.pins = next
        break
      }
      case 'setActivity':
        patch.activities = {
          ...(patch.activities ?? state.activities),
          [mapActivityKey(effect.id)]: effect.state,
        }
        break
      case 'setSidecarTab':
        patch.sidecarTab = effect.value
        break
      case 'setHandoffLive':
        patch.handoffLive = effect.value
        if (effect.value) {
          patch.shiftPhase = 'on-air'
        }
        break
      case 'setGreetingOpacity':
        patch.greetingOpacity = effect.value
        break
      case 'startCallClock':
        patch.callClockRunning = true
        patch.callStartedAt = Date.now()
        break
      case 'setOpportunityUnlocked':
        patch.opportunityUnlocked = effect.value
        break
      case 'setEnrollmentStatus':
        patch.enrollmentStatus = effect.value
        break
      case 'surfaceSalesKey': {
        const merged = { ...state, ...patch } as ConsoleState
        Object.assign(patch, surfaceSalesKeyPatch(merged, effect.key))
        break
      }
      case 'settleSalesKey': {
        const merged = { ...state, ...patch } as ConsoleState
        Object.assign(patch, settleSalesKeyPatch(merged, effect.key, effect.mode ?? 'read'))
        break
      }
      case 'setActivationStep':
        patch.activationStep = effect.value
        break
      case 'setVerifyComplete':
        patch.verifyComplete = effect.value
        break
      case 'setInstructionsSent':
        patch.instructionsSent = effect.value
        break
      case 'setCallEnded':
        patch.callEnded = effect.value
        patch.callClockRunning = false
        break
      case 'setSelectedDeviceId':
        patch.selectedDeviceId = effect.value
        break
      case 'setInstructionsChannel':
        patch.instructionsChannel = effect.value
        break
      case 'setDiscoveryAsked':
        patch.discoveryAsked = effect.value
        break
      case 'setResolutionConfirmedVia':
        patch.resolutionConfirmedVia = effect.value
        break
      case 'setRebuttalGenerated':
        patch.rebuttalGenerated = effect.value
        break
      case 'setGuidedBrowsingChannel':
        patch.guidedBrowsingChannel = effect.value
        break
      case 'setGuidedBrowsingStatus':
        patch.guidedBrowsingStatus = effect.value
        break
      case 'setOpenWidget':
        patch.openWidget = effect.value
        break
      case 'setVerifyChannel':
        patch.verifyChannel = effect.value
        break
      default:
        break
    }
  }

  return patch
}

function mapActivityKey(id: string) {
  const map = {
    'warm-handoff': 'warmHandoff',
    clarify: 'clarify',
    verify: 'verify',
    activation: 'activation',
    discovery: 'discovery',
    sales: 'sales',
    enrollment: 'enrollment',
  } as const
  return map[id as keyof typeof map]
}

export function undoBeatEffects(
  state: ConsoleState,
  effects: BeatEffect[],
): Partial<ConsoleState> {
  const patch: Partial<ConsoleState> = {}

  for (const effect of [...effects].reverse()) {
    switch (effect.type) {
      case 'appendTranscript':
        // Chain through the patch, as the forward case does: a beat may append
        // more than one line (the handoff plays the whole IVR exchange on one),
        // and reading `state` each time would drop only the last of them and
        // leave the rest stranded when stepping backwards.
        patch.transcript = (patch.transcript ?? state.transcript).slice(0, -1)
        break
      case 'setProblem':
        patch.problemSummary = ''
        break
      case 'captureFact':
        patch.facts = { ...state.facts }
        delete (patch.facts as Record<string, unknown>)[effect.key]
        break
      case 'pinItems': {
        const removed = new Set(effect.items.map(cleanPinText))
        patch.pins = state.pins.filter((p) => !removed.has(p.text))
        break
      }
      case 'setOpportunityUnlocked':
        patch.opportunityUnlocked = false
        break
      case 'setVerifyComplete':
        patch.verifyComplete = false
        break
      case 'setInstructionsSent':
        patch.instructionsSent = false
        break
      case 'setCallEnded':
        patch.callEnded = false
        patch.callClockRunning = true
        break
      default:
        break
    }
  }

  return patch
}
