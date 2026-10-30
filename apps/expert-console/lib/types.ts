export type MetricStatus = 'on-track' | 'at-risk' | 'behind'

export type ShiftPhase =
  | 'notification-gate'
  | 'daily-drop'
  | 'available'
  | 'standby'
  | 'on-air'
  | 'in-call'
  | 'pit-stop'

/**
 * A single container-morph request. A ghost overlay animates one surface's
 * measured box into the next surface's box across a phase change where no DOM
 * node survives (pill → warm-handoff dialog, dialog → call bar). Set atomically
 * with the phase flip in `advance()`, consumed and cleared by
 * `components/motion/container-morph.tsx`. `from` is the source's viewport rect
 * (`getBoundingClientRect`); `nonce` keys the overlay's layout effect so each
 * request runs exactly once.
 */
export type ContainerMorphKind = 'pill-to-dialog' | 'dialog-to-callbar'
export interface ContainerMorphRequest {
  kind: ContainerMorphKind
  nonce: number
  from: { left: number; top: number; width: number; height: number }
}

/**
 * Agent presence, chosen from the top-bar status control. Independent of
 * shiftPhase: going Available surfaces the "waiting for call" pill over the
 * morning paper without advancing the demo.
 */
export type AgentStatus = 'offline' | 'available' | 'auxiliary' | 'training'

export type SceneId =
  | 'daily-drop'
  | 'handoff'
  | 'clarify'
  | 'verify'
  | 'activation'
  | 'discovery'
  | 'confirm-solve'
  | 'opportunity'
  | 'enrollment'
  | 'close'
  | 'pit-stop'

export type Speaker = 'ivr' | 'customer' | 'expert' | 'system'

export type SidecarTab = 'assist' | 'customer' | 'offers' | 'guided'

export type ActivityId =
  | 'warm-handoff'
  | 'clarify'
  | 'verify'
  | 'activation'
  | 'discovery'
  | 'sales'
  | 'enrollment'

export type ActivityState = 'hidden' | 'active' | 'compressed' | 'complete'

export type EnrollmentStatus =
  | 'idle'
  | 'sent'
  | 'opened'
  | 'plan-details-viewed'
  | 'submitted'
  | 'complete'
  | 'declined'

export type PacingPhase = 'green' | 'yellow' | 'red'

export type Sentiment = 'positive' | 'neutral' | 'negative'

export interface TranscriptLine {
  id: string
  speaker: Speaker
  label: string
  text: string
  timestamp: string
}

export interface MetricCardData {
  id: string
  name: string
  value: string
  unit?: string
  /** Supporting lines shown on the daily-drop cards; omitted by the leaner pit-stop cards. */
  target?: string
  level?: string
  status: MetricStatus
  /** Public path to cake illustration (e.g. /cakes/love.png) */
  illustration?: string
  /**
   * Public path to a Lottie played once on card hover (resting on frame 1
   * otherwise). When set, `illustration` still supplies the static fallback and
   * the per-asset optical-balance class. Fetched from /public, not bundled.
   */
  lottieSrc?: string
}

export interface Facts {
  symptom?: string
  wifiConnected?: boolean
  sonHelped?: boolean
  householdDevices?: string[]
  sentiment?: Sentiment
  sentimentMoment?: string
}

export interface Activities {
  warmHandoff: ActivityState
  clarify: ActivityState
  verify: ActivityState
  activation: ActivityState
  discovery: ActivityState
  sales: ActivityState
  enrollment: ActivityState
}

export type BeatEffect =
  | { type: 'setShiftPhase'; value: ShiftPhase }
  | { type: 'setScene'; value: SceneId }
  | { type: 'appendTranscript'; speaker: Speaker; label: string; text: string }
  | { type: 'setProblem'; value: string }
  | { type: 'captureFact'; key: keyof Facts; value: Facts[keyof Facts] }
  /** Pin one chip per item to the customer card (deduped by text). */
  | { type: 'pinItems'; items: string[] }
  | { type: 'setActivity'; id: ActivityId; state: ActivityState }
  | { type: 'setSidecarTab'; value: SidecarTab }
  | { type: 'setHandoffLive'; value: boolean }
  | { type: 'setGreetingOpacity'; value: number }
  | { type: 'startCallClock' }
  | { type: 'setOpportunityUnlocked'; value: boolean }
  | { type: 'setEnrollmentStatus'; value: EnrollmentStatus }
  /** Surface + focus a sales script/action key (hybrid director path). */
  | { type: 'surfaceSalesKey'; key: string }
  /** Settle a sales key as read (director auto-complete). */
  | { type: 'settleSalesKey'; key: string; mode?: 'read' | 'skip' }
  | { type: 'setActivationStep'; value: 1 | 2 }
  | { type: 'setVerifyComplete'; value: boolean }
  | { type: 'setInstructionsSent'; value: boolean }
  | { type: 'setCallEnded'; value: boolean }
  | { type: 'setSelectedDeviceId'; value: string | null }
  | { type: 'setInstructionsChannel'; value: 'sms' | 'email' | null }
  | { type: 'setDiscoveryAsked'; value: boolean | null }
  | { type: 'setResolutionConfirmedVia'; value: 'sms' | 'call' | null }
  | { type: 'setRebuttalGenerated'; value: boolean }
  | { type: 'setGuidedBrowsingChannel'; value: 'sms' | 'email' | null }
  | {
      type: 'setGuidedBrowsingStatus'
      value: 'idle' | 'sent' | 'opened' | 'reviewing' | 'enrolling'
    }
  | {
      type: 'setOpenWidget'
      value: null | 'verify-pin' | 'verify-code' | 'device-detail' | 'send-instructions' | 'more-products'
    }
  | { type: 'setVerifyChannel'; value: 'sms' | 'email' | 'pin' | null }

export interface Beat {
  id: string
  scene: SceneId
  speaker?: Speaker
  text?: string
  effects: BeatEffect[]
  gate?: boolean
  gateLabel?: string
}

// ---------------------------------------------------------------------------
// Left-panel call features (ported from summary-v1): pinning, notes/history
// tabs, and the floating customer summary card.
// ---------------------------------------------------------------------------

/** A pinned transcript snippet or note. Shared across card chips + Notes tab. */
export interface PinnedItem {
  id: string
  text: string
}

/** Which body the left transcript panel is showing under the customer card. */
export type BottomTab = 'transcript' | 'notes' | 'history'

/** A line on the customer's Verizon account (revealed in the expanded card). */
export interface AccountLine {
  phone: string
  device: string
  holder: string
  /** Device render shown as the line's thumbnail (path under `public/`). */
  image: string
  imei: string
}

/** The customer's active protection plan, shown in the expanded card and device step. */
export interface ProtectionPlan {
  name: string
  status: string
  detail: string
  coveredSince?: string
  carrier?: string
  totalSlots?: number
}

export type ContactChannel = 'Claim' | 'Tech support'
export type ContactStatus = 'Resolved' | 'Not resolved' | 'Complete'

/** A prior contact (claim or tech-support call) shown in the History tab. */
export interface ContactHistoryEntry {
  id: string
  date: string
  channel: ContactChannel
  title: string
  status: ContactStatus
  summary: string
  notes: string[]
}
