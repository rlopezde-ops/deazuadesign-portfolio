import { GREETING_SCRIPT } from './fixtures'
import { SALES_SCRIPTS, VHDP_TRANSITION_SCRIPT } from './task-content'
import type { Beat } from './types'

export const SCENE_ORDER = [
  'daily-drop',
  'handoff',
  'clarify',
  'verify',
  'activation',
  'discovery',
  'confirm-solve',
  'opportunity',
  'enrollment',
  'close',
  'pit-stop',
] as const

/** Short labels for the presenter section jumper. */
export const SCENE_LABELS: Record<(typeof SCENE_ORDER)[number], string> = {
  'daily-drop': 'Daily Drop',
  handoff: 'Warm Handoff',
  clarify: 'Clarify',
  verify: 'Verify',
  activation: 'Activation',
  discovery: 'Discovery',
  'confirm-solve': 'Confirm Solve',
  opportunity: 'Opportunity',
  enrollment: 'Enrollment',
  close: 'Close',
  'pit-stop': 'Pit Stop',
}

export const BEATS: Beat[] = [
  {
    id: 'dd-01',
    scene: 'daily-drop',
    effects: [{ type: 'setShiftPhase', value: 'daily-drop' }, { type: 'setScene', value: 'daily-drop' }],
    // Hold here on the morning paper: the pill counts itself down to Available
    // and settles into "Waiting for a call" on its own. The presenter just waits
    // for that, then → brings the first call in.
    gate: true,
    gateLabel: 'Bring the first call in',
  },
  {
    id: 'ho-01',
    scene: 'handoff',
    speaker: 'ivr',
    text: 'Tell me what you need help with today.',
    /*
     * Standby: the modal rises and the whole IVR exchange lands here.
     *
     * The exchange used to be a beat per line, but the handoff modal covers the
     * workspace and nothing renders the transcript while it's up — so those were
     * presses with nothing to show, and then every line appeared at once on the
     * drop into the workspace. The customer's line and the fact it captures still
     * arrive before the expert ever sees them.
     */
    effects: [
      { type: 'setScene', value: 'handoff' },
      { type: 'setShiftPhase', value: 'standby' },
      { type: 'setActivity', id: 'warm-handoff', state: 'active' },
      { type: 'setGreetingOpacity', value: 0.4 },
      { type: 'appendTranscript', speaker: 'ivr', label: 'IVR', text: 'Tell me what you need help with today.' },
      {
        type: 'appendTranscript',
        speaker: 'customer',
        label: 'Maria',
        text: "I'm trying to activate my replacement phone. My son and I tried last night, but we couldn't get it working.",
      },
      { type: 'captureFact', key: 'sonHelped', value: true },
      {
        type: 'appendTranscript',
        speaker: 'ivr',
        label: 'IVR',
        text: "Got it. I'll connect you with an expert who can help finish your iPhone activation.",
      },
    ],
  },
  {
    id: 'ho-02',
    scene: 'handoff',
    /*
     * On air. Its own beat so standby and live are two stops the presenter can sit
     * between — talk over the amber ring for as long as they like, then put
     * themselves on air on cue.
     *
     * That only works because the modal's ring no longer goes live when it finishes
     * draining; it drains and holds (see STANDBY_DURATION_SECONDS in
     * `warm-handoff-modal.tsx`). When the ring owned this, any narration longer
     * than the sweep left this beat with nothing to do and it read as a dead press.
     *
     * `setHandoffLive` also moves shiftPhase to 'on-air' (see apply-beat-effects),
     * which is what turns the ring green, swaps STANDBY → ON AIR, brings the
     * greeting to full opacity and enables Continue.
     */
    effects: [{ type: 'setHandoffLive', value: true }, { type: 'setGreetingOpacity', value: 1 }],
    // Park here: Continue is live now, and resolving this gate drops into the
    // workspace.
    gate: true,
    gateLabel: 'Continue into workspace',
  },
  {
    id: 'ho-03',
    scene: 'handoff',
    effects: [
      { type: 'setShiftPhase', value: 'in-call' },
      { type: 'startCallClock' },
      { type: 'setSidecarTab', value: 'assist' },
      { type: 'setActivity', id: 'warm-handoff', state: 'complete' },
      // Verify is the first guidance step after handoff. Clarify beats still
      // run to populate problemSummary / Wi-Fi facts for the customer card.
      { type: 'setActivity', id: 'clarify', state: 'active' },
    ],
  },
  {
    id: 'cl-01',
    scene: 'clarify',
    speaker: 'expert',
    text: GREETING_SCRIPT,
    effects: [
      { type: 'setScene', value: 'clarify' },
      { type: 'appendTranscript', speaker: 'expert', label: 'Roberto', text: GREETING_SCRIPT },
    ],
  },
  {
    id: 'cl-02',
    scene: 'clarify',
    speaker: 'customer',
    text: "It looked like it was activating, but now it just says SOS and I don't have any service.",
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'customer',
        label: 'Maria',
        text: "It looked like it was activating, but now it just says SOS and I don't have any service.",
      },
      { type: 'setProblem', value: 'Activation attempted → SOS → no cellular service' },
      { type: 'captureFact', key: 'symptom', value: 'sos-no-service' },
    ],
  },
  {
    id: 'cl-03',
    scene: 'clarify',
    speaker: 'expert',
    text: 'Are you connected to Wi-Fi on the iPhone right now?',
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: 'Are you connected to Wi-Fi on the iPhone right now?',
      },
    ],
  },
  {
    id: 'cl-04',
    scene: 'clarify',
    speaker: 'customer',
    text: 'Yes.',
    effects: [
      { type: 'appendTranscript', speaker: 'customer', label: 'Maria', text: 'Yes.' },
      { type: 'captureFact', key: 'wifiConnected', value: true },
      { type: 'setActivity', id: 'clarify', state: 'complete' },
      { type: 'setActivity', id: 'verify', state: 'active' },
    ],
  },
  {
    id: 've-01',
    scene: 'verify',
    speaker: 'expert',
    text: 'Before we go further I need to verify your account.',
    effects: [
      { type: 'setScene', value: 'verify' },
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: 'Before we go further I need to verify your account.',
      },
    ],
  },
  {
    id: 've-02',
    scene: 'verify',
    speaker: 'customer',
    text: "I can't get texts on this phone right now.",
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'customer',
        label: 'Maria',
        text: "I can't get texts on this phone right now.",
      },
    ],
  },
  {
    id: 've-03',
    scene: 'verify',
    speaker: 'expert',
    text: 'No problem. We can use email, or your carrier PIN. Which works better?',
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: 'No problem. We can use email, or your carrier PIN. Which works better?',
      },
    ],
  },
  {
    id: 've-04',
    scene: 'verify',
    speaker: 'customer',
    text: 'I know my PIN.',
    effects: [
      { type: 'appendTranscript', speaker: 'customer', label: 'Maria', text: 'I know my PIN.' },
      { type: 'setVerifyChannel', value: 'pin' },
      { type: 'setOpenWidget', value: 'verify-pin' },
    ],
  },
  {
    id: 've-05',
    scene: 'verify',
    speaker: 'expert',
    text: "Go ahead and give me the PIN when you're ready.",
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: "Go ahead and give me the PIN when you're ready.",
      },
    ],
    gate: true,
    gateLabel: "Enter customer's carrier PIN",
  },
  {
    id: 've-06',
    scene: 'verify',
    effects: [
      { type: 'setVerifyComplete', value: true },
      { type: 'setOpenWidget', value: null },
      { type: 'setActivity', id: 'verify', state: 'compressed' },
    ],
  },
  {
    id: 'dv-01',
    scene: 'activation',
    speaker: 'expert',
    text: 'I see the replacement iPhone 15 on your account. Let’s get it activated for you.',
    effects: [
      { type: 'setScene', value: 'activation' },
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: 'I see the replacement iPhone 15 on your account. Let’s get it activated for you.',
      },
    ],
    gate: true,
    gateLabel: 'Select device',
  },
  {
    id: 'dv-02',
    scene: 'activation',
    speaker: 'customer',
    text: 'Yes, that’s the one.',
    effects: [
      { type: 'appendTranscript', speaker: 'customer', label: 'Maria', text: 'Yes, that’s the one.' },
      { type: 'setSelectedDeviceId', value: 'iphone-15' },
      { type: 'setActivity', id: 'activation', state: 'active' },
      { type: 'setActivationStep', value: 1 },
    ],
  },
  {
    id: 'ac-01',
    scene: 'activation',
    speaker: 'expert',
    text: "Thanks, you're verified. I have the activation steps ready.",
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: "Thanks, you're verified. I have the activation steps ready.",
      },
    ],
  },
  {
    id: 'ac-02',
    scene: 'activation',
    speaker: 'expert',
    text: 'I can walk you through this step by step and send you instructions. Want them by text or email?',
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: 'I can walk you through this step by step and send you instructions. Want them by text or email?',
      },
    ],
  },
  {
    id: 'ac-03',
    scene: 'activation',
    speaker: 'customer',
    text: 'Email works — I still can’t get texts on this phone.',
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'customer',
        label: 'Maria',
        text: 'Email works — I still can’t get texts on this phone.',
      },
      { type: 'setOpenWidget', value: 'send-instructions' },
    ],
    gate: true,
    gateLabel: 'Send activation instructions',
  },
  {
    id: 'ac-04',
    scene: 'activation',
    speaker: 'expert',
    text: "They're on the way to your email. Open the message and follow the steps when you're ready.",
    effects: [
      { type: 'setInstructionsSent', value: true },
      { type: 'setInstructionsChannel', value: 'email' },
      { type: 'setOpenWidget', value: null },
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: "They're on the way to your email. Open the message and follow the steps when you're ready.",
      },
    ],
  },
  {
    id: 'ac-05',
    scene: 'activation',
    speaker: 'customer',
    text: "Okay, I have it. Give me a second — it's loading.",
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'customer',
        label: 'Maria',
        text: "Okay, I have it. Give me a second — it's loading.",
      },
      { type: 'setActivity', id: 'discovery', state: 'active' },
    ],
  },
  {
    id: 'di-01',
    scene: 'discovery',
    speaker: 'expert',
    text: 'Your son helped set this up earlier — does your family use a lot of other devices at home?',
    effects: [
      { type: 'setScene', value: 'discovery' },
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: 'Your son helped set this up earlier — does your family use a lot of other devices at home?',
      },
    ],
  },
  {
    id: 'di-02',
    scene: 'discovery',
    speaker: 'customer',
    text: 'Definitely. We have laptops, tablets, a PlayStation, and a couple of TVs.',
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'customer',
        label: 'Maria',
        text: 'Definitely. We have laptops, tablets, a PlayStation, and a couple of TVs.',
      },
      {
        type: 'captureFact',
        key: 'householdDevices',
        value: ['laptops', 'tablets', 'PlayStation', 'TVs'],
      },
      // The devices land as pins on the customer card rather than a captured
      // line in the guidance panel.
      { type: 'pinItems', items: ['Laptops', 'Tablets', 'PlayStation', 'TVs'] },
      { type: 'setDiscoveryAsked', value: true },
      { type: 'setActivity', id: 'discovery', state: 'complete' },
      { type: 'setActivationStep', value: 2 },
    ],
  },
  {
    id: 'cs-01',
    scene: 'confirm-solve',
    speaker: 'expert',
    text: 'Let’s make sure service is back. I can confirm with a text or a quick test call.',
    effects: [
      { type: 'setScene', value: 'confirm-solve' },
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: 'Let’s make sure service is back. I can confirm with a text or a quick test call.',
      },
    ],
  },
  {
    id: 'cs-02',
    scene: 'confirm-solve',
    speaker: 'customer',
    text: 'Okay... I have bars now.',
    effects: [
      { type: 'appendTranscript', speaker: 'customer', label: 'Maria', text: 'Okay... I have bars now.' },
    ],
  },
  {
    id: 'cs-03',
    scene: 'confirm-solve',
    speaker: 'expert',
    text: "Great. Let's try a quick call to confirm.",
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: "Great. Let's try a quick call to confirm.",
      },
    ],
  },
  {
    id: 'cs-04',
    scene: 'confirm-solve',
    speaker: 'customer',
    text: 'Yep. It went through.',
    effects: [
      { type: 'appendTranscript', speaker: 'customer', label: 'Maria', text: 'Yep. It went through.' },
      { type: 'setResolutionConfirmedVia', value: 'call' },
    ],
  },
  {
    id: 'cs-05',
    scene: 'confirm-solve',
    speaker: 'expert',
    text: 'Perfect. Your replacement iPhone is connected and ready to use.',
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: 'Perfect. Your replacement iPhone is connected and ready to use.',
      },
      { type: 'setActivity', id: 'activation', state: 'compressed' },
      { type: 'setOpportunityUnlocked', value: true },
      { type: 'setActivity', id: 'sales', state: 'active' },
      { type: 'captureFact', key: 'sentiment', value: 'positive' },
      {
        type: 'captureFact',
        key: 'sentimentMoment',
        value: 'Maria relaxed once service came back',
      },
    ],
  },
  {
    id: 'op-01',
    scene: 'opportunity',
    speaker: 'expert',
    text: VHDP_TRANSITION_SCRIPT,
    effects: [
      { type: 'setScene', value: 'opportunity' },
      { type: 'setSidecarTab', value: 'offers' },
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: VHDP_TRANSITION_SCRIPT,
      },
      { type: 'surfaceSalesKey', key: 'transition' },
    ],
  },
  {
    id: 'op-02',
    scene: 'opportunity',
    speaker: 'customer',
    text: 'Okay, sure — what is that?',
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'customer',
        label: 'Maria',
        text: 'Okay, sure — what is that?',
      },
    ],
  },
  {
    id: 'op-03',
    scene: 'opportunity',
    speaker: 'expert',
    text: SALES_SCRIPTS.guide.script,
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: SALES_SCRIPTS.guide.script,
      },
      { type: 'surfaceSalesKey', key: 'guide' },
    ],
  },
  {
    id: 'op-04',
    scene: 'opportunity',
    speaker: 'customer',
    text: 'Yes, go ahead and send it.',
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'customer',
        label: 'Maria',
        text: 'Yes, go ahead and send it.',
      },
      { type: 'settleSalesKey', key: 'guide', mode: 'read' },
      { type: 'settleSalesKey', key: 'send-details', mode: 'read' },
      { type: 'setGuidedBrowsingChannel', value: 'email' },
      { type: 'setGuidedBrowsingStatus', value: 'sent' },
    ],
  },
  {
    id: 'op-04b',
    scene: 'opportunity',
    effects: [{ type: 'setGuidedBrowsingStatus', value: 'opened' }],
  },
  {
    id: 'op-05',
    scene: 'opportunity',
    speaker: 'expert',
    text: SALES_SCRIPTS['offer-1'].script,
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: SALES_SCRIPTS['offer-1'].script,
      },
      { type: 'surfaceSalesKey', key: 'offer-1' },
      { type: 'setGuidedBrowsingStatus', value: 'reviewing' },
    ],
  },
  {
    id: 'op-06',
    scene: 'opportunity',
    speaker: 'expert',
    text: SALES_SCRIPTS['offer-2'].script,
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: SALES_SCRIPTS['offer-2'].script,
      },
      { type: 'surfaceSalesKey', key: 'offer-2' },
    ],
  },
  {
    id: 'op-07',
    scene: 'opportunity',
    speaker: 'customer',
    text: 'We already have protection on our phones…',
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'customer',
        label: 'Maria',
        text: 'We already have protection on our phones…',
      },
    ],
  },
  {
    id: 'op-07b',
    scene: 'opportunity',
    speaker: 'expert',
    text: 'VHDP covers home tech beyond the phone — laptops, tablets, gaming systems, TVs — under one monthly price.',
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: 'VHDP covers home tech beyond the phone — laptops, tablets, gaming systems, TVs — under one monthly price.',
      },
      { type: 'setRebuttalGenerated', value: true },
      { type: 'surfaceSalesKey', key: 'rebuttal' },
    ],
  },
  {
    id: 'op-08',
    scene: 'opportunity',
    speaker: 'expert',
    text: SALES_SCRIPTS['offer-3'].script,
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: SALES_SCRIPTS['offer-3'].script,
      },
      { type: 'surfaceSalesKey', key: 'offer-3' },
    ],
  },
  {
    id: 'op-09',
    scene: 'opportunity',
    speaker: 'expert',
    text: SALES_SCRIPTS['offer-4'].script,
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: SALES_SCRIPTS['offer-4'].script,
      },
      { type: 'surfaceSalesKey', key: 'offer-4' },
    ],
  },
  {
    id: 'op-10',
    scene: 'opportunity',
    speaker: 'expert',
    text: SALES_SCRIPTS['offer-5'].script,
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: SALES_SCRIPTS['offer-5'].script,
      },
      { type: 'surfaceSalesKey', key: 'offer-5' },
    ],
  },
  {
    id: 'op-11',
    scene: 'opportunity',
    speaker: 'expert',
    text: SALES_SCRIPTS['close-ask'].script,
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: SALES_SCRIPTS['close-ask'].script,
      },
      { type: 'surfaceSalesKey', key: 'close-ask' },
    ],
  },
  {
    id: 'op-12',
    scene: 'opportunity',
    speaker: 'customer',
    text: 'Yes, I think so.',
    effects: [
      { type: 'appendTranscript', speaker: 'customer', label: 'Maria', text: 'Yes, I think so.' },
    ],
  },
  {
    id: 'en-01',
    scene: 'enrollment',
    effects: [
      { type: 'setScene', value: 'enrollment' },
      { type: 'setActivity', id: 'enrollment', state: 'active' },
      { type: 'setGuidedBrowsingStatus', value: 'enrolling' },
    ],
    gate: true,
    gateLabel: 'Send enrollment',
  },
  {
    id: 'en-02',
    scene: 'enrollment',
    effects: [
      { type: 'setScene', value: 'close' },
      { type: 'setEnrollmentStatus', value: 'complete' },
    ],
  },
  {
    id: 'cl-07',
    scene: 'close',
    speaker: 'expert',
    text: "You're all set. We got your iPhone connected, and your enrollment is complete. Glad I could help today.",
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: "You're all set. We got your iPhone connected, and your enrollment is complete. Glad I could help today.",
      },
    ],
  },
  {
    id: 'cl-08',
    scene: 'close',
    speaker: 'customer',
    text: 'Thank you so much.',
    effects: [
      { type: 'appendTranscript', speaker: 'customer', label: 'Maria', text: 'Thank you so much.' },
    ],
  },
  {
    id: 'cl-09',
    scene: 'close',
    speaker: 'expert',
    text: "You're welcome. Have a great rest of your day.",
    effects: [
      {
        type: 'appendTranscript',
        speaker: 'expert',
        label: 'Roberto',
        text: "You're welcome. Have a great rest of your day.",
      },
      { type: 'setCallEnded', value: true },
      { type: 'setShiftPhase', value: 'pit-stop' },
      { type: 'setScene', value: 'pit-stop' },
    ],
  },
  {
    id: 'ps-01',
    scene: 'pit-stop',
    effects: [{ type: 'setActivity', id: 'sales', state: 'complete' }],
    gate: true,
    gateLabel: 'Ready for next customer',
  },
  {
    id: 'ps-02',
    scene: 'pit-stop',
    effects: [{ type: 'setShiftPhase', value: 'available' }, { type: 'setScene', value: 'daily-drop' }],
  },
]
