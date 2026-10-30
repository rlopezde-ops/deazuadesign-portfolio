'use client'

import { create } from 'zustand'
import { DAILY_DROP_METRICS } from '@/lib/fixtures'
import {
  EMPTY_SALES_PROGRESS,
  setKaraokeProgressPatch,
  settleSalesKeyPatch,
  surfaceSalesKeyPatch,
  type SalesSettleMode,
} from '@/lib/sales-settlement'
import { PACING_TARGET_SECONDS } from '@/lib/tokens'
import { ACCESSORY_BY_ID, type PlacedAccessory } from '@/lib/avatar-items'
import type {
  Activities,
  AgentStatus,
  BottomTab,
  ContainerMorphRequest,
  EnrollmentStatus,
  Facts,
  MetricCardData,
  PinnedItem,
  SceneId,
  ShiftPhase,
  SidecarTab,
  TranscriptLine,
} from '@/lib/types'

export type FlowFocusStep = 'verify' | 'solve' | 'sell'

export type OpenWidget =
  | null
  | 'verify-pin'
  | 'verify-code'
  | 'device-detail'
  | 'send-instructions'
  | 'more-products'

export type GuidedBrowsingStatus = 'idle' | 'sent' | 'opened' | 'reviewing' | 'enrolling'

export interface ConsoleState {
  shiftPhase: ShiftPhase
  /**
   * Transient container-morph request, set in `advance()` on the same commit as
   * a morph-boundary phase flip and cleared by the ghost overlay when the morph
   * completes. Null except during a ~0.7s morph; rebuilt to null by reset/jump.
   */
  morph: ContainerMorphRequest | null
  /** Top-bar presence. Drives the "waiting for call" pill on the morning paper. */
  agentStatus: AgentStatus
  scene: SceneId
  beatIndex: number
  autoPlay: boolean
  demoBarVisible: boolean
  /** Presenter toggle for Joy's animated per-step avatar. Off by default. */
  joyAvatarEnabled: boolean
  /**
   * Accessories the expert has placed on their profile photo via the avatar
   * customizer. A display preference, not story state — survives Reset.
   */
  avatarAccessories: PlacedAccessory[]
  /**
   * Whether the avatar customizer dialog is open. Lifted to the store so both
   * the top-bar profile menu and the morning-paper greeting photo open the one
   * modal instance (rendered by the TopBar). Transient UI — resets to closed.
   */
  avatarCustomizerOpen: boolean
  transcript: TranscriptLine[]
  problemSummary: string
  facts: Facts
  activities: Activities
  sidecarTab: SidecarTab
  handoffLive: boolean
  greetingOpacity: number
  callClockRunning: boolean
  callStartedAt: number | null
  callElapsedSeconds: number
  pacingSkipMs: number
  opportunityUnlocked: boolean
  enrollmentStatus: EnrollmentStatus
  /** Currently focused sales script/action key. */
  activeScriptKey: string | null
  /** Progressive disclosure order of sales keys the expert has seen. */
  surfacedScriptKeys: string[]
  completedScriptKeys: string[]
  skippedScriptKeys: string[]
  /** 0→1 spoken progress per script key for karaoke highlight. */
  karaokeProgressByKey: Record<string, number>
  /** Guide send-details outcome: true sent, false declined, null unset. */
  guideDetailsSent: boolean | null
  /**
   * When set, Sell shows this script for review (back-arrow). Null = live
   * `activeScriptKey`. Cleared when the call advances or Sell chip returns live.
   */
  salesFocusKey: string | null
  activationStep: 1 | 2
  verifyComplete: boolean
  instructionsSent: boolean
  callEnded: boolean
  pinInput: string
  disclosuresRead: boolean
  metrics: MetricCardData[]
  pitStopRemaining: number
  notificationDismissed: boolean
  /** When set, sidecar shows that completed section for review without wiping progress. */
  flowFocus: FlowFocusStep | null
  /** Fine-grained step review cursor (overrides live step when set). */
  stepFocus: string | null
  /** Pinned transcript snippets + notes — one shared list across card + Notes tab. */
  pins: PinnedItem[]
  /** Which body the left transcript panel shows under the floating customer card. */
  bottomTab: BottomTab
  /** Selected account device for activation. */
  selectedDeviceId: string | null
  /** Channel used for activation instructions. */
  instructionsChannel: 'sms' | 'email' | null
  /** Discovery seed: true = asked, false = skipped, null = unset. */
  discoveryAsked: boolean | null
  /** How resolution was confirmed. */
  resolutionConfirmedVia: 'sms' | 'call' | null
  /** Sell: rebuttal has been generated (gates Declined). */
  rebuttalGenerated: boolean
  guidedBrowsingChannel: 'sms' | 'email' | null
  guidedBrowsingStatus: GuidedBrowsingStatus
  /** Input Widget overlay currently open inside the sidecar panel. */
  openWidget: OpenWidget
  /** Verification channel choice before PIN/OTP. */
  verifyChannel: 'sms' | 'email' | 'pin' | null
}

const initialActivities: Activities = {
  warmHandoff: 'hidden',
  clarify: 'hidden',
  verify: 'hidden',
  activation: 'hidden',
  discovery: 'hidden',
  sales: 'hidden',
  enrollment: 'hidden',
}

export const initialState: ConsoleState = {
  shiftPhase: 'notification-gate',
  morph: null,
  agentStatus: 'offline',
  scene: 'daily-drop',
  beatIndex: -1,
  autoPlay: false,
  demoBarVisible: true,
  joyAvatarEnabled: true,
  avatarAccessories: [],
  avatarCustomizerOpen: false,
  transcript: [],
  problemSummary: '',
  facts: {},
  activities: initialActivities,
  sidecarTab: 'assist',
  handoffLive: false,
  greetingOpacity: 0.4,
  callClockRunning: false,
  callStartedAt: null,
  callElapsedSeconds: 0,
  pacingSkipMs: 0,
  opportunityUnlocked: false,
  enrollmentStatus: 'idle',
  ...EMPTY_SALES_PROGRESS,
  activationStep: 1,
  verifyComplete: false,
  instructionsSent: false,
  callEnded: false,
  pinInput: '',
  disclosuresRead: false,
  metrics: DAILY_DROP_METRICS,
  pitStopRemaining: 30,
  notificationDismissed: false,
  flowFocus: null,
  stepFocus: null,
  pins: [],
  bottomTab: 'transcript',
  selectedDeviceId: null,
  instructionsChannel: null,
  discoveryAsked: null,
  resolutionConfirmedVia: null,
  rebuttalGenerated: false,
  guidedBrowsingChannel: null,
  guidedBrowsingStatus: 'idle',
  openWidget: null,
  verifyChannel: null,
}

interface ConsoleActions {
  patch: (partial: Partial<ConsoleState>) => void
  reset: () => void
  skipPacing: (seconds: number) => void
  tickCallClock: (elapsed: number) => void
  tickPitStop: (remaining: number) => void
  /** Pin a snippet/note. Whitespace-normalized and deduped by text. */
  pinItem: (text: string) => void
  unpinItem: (id: string) => void
  /** Move `fromId` to occupy `toId`'s slot (drag-reorder of pinned chips). */
  reorderPins: (fromId: string, toId: string) => void
  /** Add an accessory to the profile photo at its catalog default placement. */
  addAccessory: (defId: string) => void
  /** Nudge an existing placed accessory (position/scale/rotation). */
  updateAccessory: (key: string, patch: Partial<Omit<PlacedAccessory, 'key' | 'defId'>>) => void
  /** Restack an accessory to the top of the pile (last = drawn last = on top). */
  bringAccessoryToFront: (key: string) => void
  removeAccessory: (key: string) => void
  clearAccessories: () => void
  surfaceSalesKey: (key: string) => void
  settleSalesKey: (key: string, mode: SalesSettleMode) => void
  setKaraokeProgress: (key: string, progress: number) => void
}

// Monotonic id source for pins — mirrors summary-v1's counter so ids stay
// stable and unique across a session regardless of add/remove churn.
let pinCounter = 0

// Same idea for placed avatar accessories: a stable per-instance key so the
// same accessory can be added multiple times and dragged independently.
let accessoryCounter = 0

export const useConsoleStore = create<ConsoleState & ConsoleActions>((set) => ({
  ...initialState,
  patch: (partial) => set((state) => ({ ...state, ...partial })),
  reset: () =>
    set((state) => ({
      ...initialState,
      notificationDismissed: true,
      shiftPhase: 'daily-drop',
      beatIndex: 0,
      flowFocus: null,
      // A presenter display preference, not story state — survives Reset.
      joyAvatarEnabled: state.joyAvatarEnabled,
      // Likewise the expert's profile-photo accessories are a profile
      // preference, not part of the call story — survive Reset.
      avatarAccessories: state.avatarAccessories,
    })),
  pinItem: (text) =>
    set((state) => {
      const clean = text.replace(/\s+/g, ' ').trim()
      if (!clean) return state
      if (state.pins.some((p) => p.text === clean)) return state
      return { pins: [...state.pins, { id: `pin-${pinCounter++}`, text: clean }] }
    }),
  unpinItem: (id) => set((state) => ({ pins: state.pins.filter((p) => p.id !== id) })),
  reorderPins: (fromId, toId) =>
    set((state) => {
      const from = state.pins.findIndex((p) => p.id === fromId)
      const to = state.pins.findIndex((p) => p.id === toId)
      if (from === -1 || to === -1 || from === to) return state
      const next = state.pins.slice()
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return { pins: next }
    }),
  addAccessory: (defId) =>
    set((state) => {
      const d = ACCESSORY_BY_ID[defId]
      if (!d) return state
      const placed: PlacedAccessory = {
        key: `acc-${accessoryCounter++}`,
        defId,
        ...d.place,
      }
      return { avatarAccessories: [...state.avatarAccessories, placed] }
    }),
  updateAccessory: (key, patch) =>
    set((state) => ({
      avatarAccessories: state.avatarAccessories.map((a) =>
        a.key === key ? { ...a, ...patch } : a,
      ),
    })),
  bringAccessoryToFront: (key) =>
    set((state) => {
      const i = state.avatarAccessories.findIndex((a) => a.key === key)
      if (i === -1 || i === state.avatarAccessories.length - 1) return state
      const next = state.avatarAccessories.slice()
      const [moved] = next.splice(i, 1)
      next.push(moved)
      return { avatarAccessories: next }
    }),
  removeAccessory: (key) =>
    set((state) => ({
      avatarAccessories: state.avatarAccessories.filter((a) => a.key !== key),
    })),
  clearAccessories: () => set({ avatarAccessories: [] }),
  skipPacing: (seconds) =>
    set((state) => ({
      pacingSkipMs: state.pacingSkipMs + seconds * 1000,
      callElapsedSeconds: state.callElapsedSeconds + seconds,
    })),
  tickCallClock: (elapsed) => set({ callElapsedSeconds: elapsed }),
  tickPitStop: (remaining) => set({ pitStopRemaining: remaining }),
  surfaceSalesKey: (key) => set((state) => ({ ...state, ...surfaceSalesKeyPatch(state, key) })),
  settleSalesKey: (key, mode) => set((state) => ({ ...state, ...settleSalesKeyPatch(state, key, mode) })),
  setKaraokeProgress: (key, progress) =>
    set((state) => ({ ...state, ...setKaraokeProgressPatch(state, key, progress) })),
}))

export function getPacingRemaining(state: ConsoleState) {
  return PACING_TARGET_SECONDS - state.callElapsedSeconds
}
