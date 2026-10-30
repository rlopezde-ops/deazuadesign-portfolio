import { CUSTOMER } from './fixtures'

/**
 * Expert-facing task copy, in one place so it can be reviewed as writing rather
 * than hunted through JSX.
 *
 * Written against the `voice-and-tone-writing` skill. The rules that shaped
 * these strings:
 *
 * - **Eyebrows are labels, not instructions.** An eyebrow that opens with a
 *   verb ("Verify customer", "Understand the issue") reads to an expert as one
 *   more line to recite. They are declarative noun phrases or third-person
 *   orienting questions instead.
 * - **`verbatim` is spoken, `directive` is done.** Anything under `verbatim` is
 *   read to the customer and is held to the one-breath rule — roughly 10–25
 *   words, up to ~40 when the information is genuinely complex.
 * - **Affirmation before directive.** A 1–3 word acknowledgement sets tone
 *   without tipping into over-apology.
 * - Sentence case throughout; title case only for the plan name, which is a
 *   formal product name.
 * - Asurion terminology: "device", "coverage", "start a claim".
 */

export const CLARIFY_COPY = {
  eyebrow: `What ${CUSTOMER.firstName} reported`,
  listening: 'Listening for the symptom…',
  affirmation: 'Got it.',
} as const

export const VERIFY_COPY = {
  eyebrow: "Let's verify the customer",
  // affirmation: 'Quick security step.',
  // One ask per prompt — channel choice is the decision; the spoken line
  // signals verification without bundling the channel question.
  verbatim: 'Before we go further I need to verify your account. Can I text you a verification code?',
  /** Header over the three verification cards — text, email, or account PIN. */
  // channelLabel: 'Choose a verification method',
  /** Card titles — each names the action, so the header can stay method-neutral. */
  textOption: 'Send via text',
  emailOption: 'Send via email',
  pinOption: 'Use account PIN',
  /** PIN card's subtitle — the old fallback rationale, now that it's a card not a link. */
  pinOptionHint: "When a code can't be sent",
  pinLabel: "Customer's carrier PIN",
  pinCta: 'Verify',
  /** Texted or emailed code — picking a channel sends it and opens this sheet. */
  codeLabel: 'Enter the code',
  codeSentTo: (destination: string) => `Code sent to ${destination}`,
  sendAgain: 'Send a new code',
  verifyingCode: 'Verifying code…',
  verifyingPin: 'Verifying PIN…',
  successConfirm: 'Account verified.',
  complete: 'Customer verified',
  /** Wrong PIN — first rungs of the error ladder. */
  pinWrong: "That PIN didn't match. Want to try again?",
  pinWrongSecond: 'Still not matching. You can try once more, or we can text or email a code instead.',
  codeWrong: "That code didn't match. Want to try again?",
  codeWrongSecond: 'Still not matching. I can send a new code, or we can use the carrier PIN.',
  codeNotReceived:
    "If the code hasn't arrived, I can send a new one — or we can use the carrier PIN.",
} as const

/** Canonical text-or-email labels shared by verify, activation, and Guided Browsing. */
export const SEND_CHANNEL_COPY = {
  contactLabel: 'Send to',
  smsLabel: 'Text',
  emailLabel: 'Email',
  sosTooltip:
    'Text may not reach this device yet, so email or the carrier PIN are the best options.',
  sendCta: 'Send',
} as const

export const DEVICE_COPY = {
  eyebrow: 'Select device',
  // affirmation: 'One device on the account.',
  verbatim: 'I see the replacement iPhone 15 on your account. Let’s get it activated for you.',
  activateCta: 'Activate device',
  somethingElse: "It's something else",
  addDevice: 'Add device',
  /** Inline confirmation after the expert picks the device for this call. */
  successConfirm: 'Device selected.',
} as const

export const ACTIVATION_COPY = {
  eyebrow: 'Active their device',
  stepLabel: (step: number, total: number) => `Step ${step} of ${total}`,
  step1: {
    // affirmation: "Let's get it connected.",
    // Spoken line — no visual-only path shorthand.
    verbatim:
      'I can walk you through this step by step and send you instructions. Want them by text or email?',
    directive: `Walk ${CUSTOMER.firstName} through adding the eSIM.`,
    steps: ['Open Settings', 'Tap Cellular', 'Tap Add eSIM'],
    ozmoLabel: 'Open in Ozmo',
    sendLabel: 'Send activation instructions',
    sendCta: 'Send instructions',
    sendAgain: 'Send again',
    sendingStatus: 'Sending instructions…',
    sentConfirm: 'Instructions sent.',
    /** Only seen reviewing the finished step — the live column moves to Discovery. */
    sentTo: (destination: string) => `Instructions sent to ${destination}`,
  },
  complete: 'Activation complete',
  completeDetail: `${CUSTOMER.firstName}'s iPhone shows Verizon service.`,
} as const

export const DISCOVERY_COPY = {
  eyebrow: 'Conversation starter',
  // Constrained choice at the decision point — ask + I asked it / Skip.
  verbatim:
    'Your son helped set this up earlier — does your family use a lot of other devices at home?',
  askedCta: 'I asked it',
  skipCta: 'Skip',
  /** Inline confirmation after the expert marks the seed asked or skipped. */
  successConfirm: 'Noted.',
  skippedConfirm: 'Skipped.',
} as const

export const CONFIRM_COPY = {
  eyebrow: 'Confirm resolution',
  // affirmation: 'Almost there.',
  // Implicit confirmation for a recoverable check — spoken ask, then channel.
  verbatim: 'Let’s make sure service is back. I can confirm with a text or a quick test call.',
  smsCta: 'Confirm via SMS',
  callCta: 'Confirm via call',
  successConfirm: 'Activation complete.',
} as const

export type SalesScriptTag = 'Read verbatim' | 'Recommended'

export interface SalesScriptGrounding {
  sourcePhrase: string
  quote: string
}

export interface SalesScriptDef {
  tag: SalesScriptTag
  script: string
  /** Substring that receives karaoke; defaults to full script. */
  verbatimText?: string
  /** Compliance phrases underlined in the karaoke region. */
  emphasisPhrases?: readonly string[]
  grounding?: SalesScriptGrounding
  fallbackScript?: string
}

/** Verbatim region of the transition script — compliance locked. */
export const VHDP_TRANSITION_VERBATIM =
  "I'd like to talk to you about a separate coverage from your mobile device insurance called Verizon Home Device Protect."

/** compliance — do not edit */
export const VHDP_TRANSITION_SCRIPT = `Thanks for holding! Before we wrap up, ${VHDP_TRANSITION_VERBATIM}`

/**
 * Keyed VHDP sales catalog for the Sell beat stack.
 * `Read verbatim` keys are compliance-locked. `Recommended` keys were reviewed
 * against the voice-and-tone-writing skill (one-breath, plain language, "start a claim").
 */
export const SALES_SCRIPTS = {
  // compliance — do not edit
  transition: {
    tag: 'Read verbatim',
    script: VHDP_TRANSITION_SCRIPT,
    verbatimText: VHDP_TRANSITION_VERBATIM,
    emphasisPhrases: [VHDP_TRANSITION_VERBATIM],
  },
  // Recommended — voice pass: confirm-before-send, one breath
  guide: {
    tag: 'Recommended',
    script: 'Mind if I send you a link so you can look over the plan details?',
  },
  // compliance — do not edit
  'offer-1': {
    tag: 'Read verbatim',
    script:
      'Exactly! This plan covers breakdowns on all eligible products for one monthly price no matter when or where they were purchased. For families with devices being used throughout the week, that can be a convenient way to help manage unexpected issues.\n\nThe products you currently own are covered and future purchases are automatically included; No receipts or registration required.',
    emphasisPhrases: [
      'This plan covers breakdowns on all eligible products for one monthly price no matter when or where they were purchased.',
      'The products you currently own are covered and future purchases are automatically included; No receipts or registration required.',
    ],
  },
  // Recommended — voice pass: conversational, one breath
  'offer-2': {
    tag: 'Recommended',
    script: "So you won't have to chase paperwork as you add eligible devices later.",
    fallbackScript:
      'Eligible products you own today are covered, and future purchases can be included automatically — no receipts or registration needed.',
  },
  // compliance — do not edit
  'offer-3': {
    tag: 'Read verbatim',
    script:
      'A service fee of no more than $99+ tax is required per claim, and your home tech will be repaired, replaced, or reimbursed.',
    emphasisPhrases: [
      'A service fee of no more than $99+ tax is required per claim, and your home tech will be repaired, replaced, or reimbursed.',
    ],
  },
  // Recommended — voice pass: grounded example; "start a claim" terminology
  'offer-4': {
    tag: 'Recommended',
    script:
      'Say your PlayStation 5 stopped working out of nowhere — you could start a claim and get help with repair, replacement, or reimbursement.',
    fallbackScript:
      'Say eligible home tech stopped working out of nowhere — you could start a claim and get help with repair, replacement, or reimbursement.',
    grounding: {
      sourcePhrase: 'PlayStation 5',
      quote: 'PlayStation 5',
    },
  },
  // compliance — do not edit
  'offer-5': {
    tag: 'Read verbatim',
    script: "It's $25 plus tax, per month.",
    emphasisPhrases: ["It's $25 plus tax, per month."],
  },
  // compliance — do not edit
  'close-ask': {
    tag: 'Read verbatim',
    script: 'Would you like to enroll today?',
    emphasisPhrases: ['Would you like to enroll today?'],
  },
} as const satisfies Record<string, SalesScriptDef>

export type SalesScriptKey = keyof typeof SALES_SCRIPTS

export const SALES_COPY = {
  unlocked: {
    label: 'Opportunity unlocked',
    detail: `${CUSTOMER.firstName} mentioned laptops, tablets, gaming systems, TVs, and multiple family members.`,
  },
  tagEyebrow: {
    'Read verbatim': 'Read verbatim',
    Recommended: 'Recommended script',
  } as const satisfies Record<SalesScriptTag, string>,
  beatLabel: (label: string) => label,
  groundingDetail: (quote: string) => `Based on: ${quote}`,
  readCta: 'I read it',
  generateRebuttalCta: 'Generate rebuttal',
  skipCta: 'Skip',
  moreProducts: 'See more products',
  sendDetails: {
    eyebrow: 'Guided Browsing',
    directive: `Send ${CUSTOMER.firstName} a link to review the plan.`,
    verbatim: 'Can I send you a link so we can review the plan and everything it covers?',
    sendCta: 'Send link',
    declineCta: 'No thanks',
    sendingStatus: 'Sending link…',
    sentConfirm: 'Link sent.',
    /**
     * Muted record this card keeps after the sheet's confirmation. Unlike the
     * activation step — which hands the column straight to Discovery — the Sell
     * card stays on screen through the rest of the pitch, so it answers "where did
     * the link go?" without repeating the green check from the sheet footer.
     */
    sentRecord: (destination: string) => `Sent to ${destination}`,
    declinedConfirm: 'Skipped sending the link.',
  },
  enrollment: {
    eyebrow: 'Enrollment',
    sendCta: 'Continue enrollment',
    resendCta: 'Resend enrollment',
    declineCta: 'Declined',
    waiting: 'Waiting for enrollment…',
    success: 'Enrollment complete.',
    successHeading: 'Enrollment successful!',
    successDetail: `${CUSTOMER.firstName} is now enrolled in Verizon Home Device Protect.`,
    declined: 'Enrollment declined.',
  },
  objection: {
    eyebrow: 'Objection',
    customerLine: 'We already have protection on our phones…',
    rebuttal:
      'VHDP covers home tech beyond the phone — laptops, tablets, gaming systems, TVs — under one monthly price.',
  },
} as const

export const ACCOUNT_DEVICES = [
  {
    id: 'iphone-15',
    name: "Maria's iPhone 15",
    maskedId: '(***) *** – 9778',
    imageSrc: '/devices/mobile-phone.png',
    primary: true,
    protected: true,
    description: 'Apple iPhone 15—128 GB Black',
    serial: 'F2LZK1YQ8L4X',
  },
  {
    id: 'ipad',
    name: 'iPad',
    maskedId: 'Wi-Fi',
    imageSrc: '/devices/tablet.png',
    primary: false,
    protected: true,
  },
] as const
