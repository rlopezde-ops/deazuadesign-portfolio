import type {
  AccountLine,
  ContactHistoryEntry,
  MetricCardData,
  ProtectionPlan,
} from './types'

export const EXPERT = {
  firstName: 'Roberto',
  lastName: 'Morales',
  initials: 'RM',
  rank: 3,
  // The expert's profile photo. This is the same asset shown for them in the
  // leaderboard (the YOU row in `daily-drop-data`); the upcoming avatar
  // "customize" feature will let them pick a different one.
  photo: '/experts/jason.jpg',
}

export const CUSTOMER = {
  name: 'Maria Rodriguez',
  firstName: 'Maria',
  phone: '(615) 480-1640',
  carrier: 'Verizon',
  device: 'Replacement iPhone 15',
  email: 'maria.r@email.com',
  /** 4-digit carrier account PIN (PIN path). */
  pin: '1234',
  /** 5-digit OTP the prototype accepts after Send code. */
  otp: '48291',
  avatar: '/customer-avatar.png',
}

export const GREETING_SCRIPT =
  'Hi Maria, thanks for calling Verizon Tech Coach. My name is Roberto. I see you ran into an issue activating your iPhone 15. I can help with that. Can you tell me a little more about what you\'re seeing?'

// The action phrase to visually highlight (green marker) inside the greeting,
// mirroring the reference prototype's treatment of "setting up your new iPhone."
// Must be an exact substring of GREETING_SCRIPT.
export const GREETING_HIGHLIGHT = 'activating your iPhone 15'

export const DAILY_DROP_METRICS: MetricCardData[] = [
  {
    id: 'performance',
    name: 'Overall performance',
    value: '92',
    unit: '%',
    target: 'Target: 90% or higher',
    level: 'Strong start to your shift',
    status: 'on-track',
    illustration: '/cakes/love.png',
  },
  {
    id: 'transfer',
    name: 'Transfer rate',
    value: '4',
    unit: '%',
    target: 'Target: 5% or lower',
    level: 'Keep customers with you',
    status: 'on-track',
    illustration: '/cakes/quality.png',
  },
  {
    id: 'sales',
    name: 'Net sales',
    value: '6',
    target: 'Target: 3 sales',
    level: 'One more could help your rank',
    status: 'on-track',
    illustration: '/cakes/sales.png',
  },
]

export const SCHEDULE = [
  { time: '8:00am', label: 'Shift start', detail: 'Daily Drop + coaching' },
  { time: '10:30am', label: 'Team huddle', detail: 'VHDP refresh' },
  { time: '12:00pm', label: 'Lunch', detail: '30 min' },
  { time: '2:00pm', label: 'Coach check-in', detail: 'Discovery questions' },
]

export const COACHING_NOTE =
  'Focus on asking one discovery question during natural wait time today. It unlocks better VHDP conversations after the solve.'

export const VHDP_DISCLOSURES = [
  'Verizon Home Device Protect is $25/month plus tax, billed to your Verizon account.',
  'Coverage starts on day 31. Tech support is available from day 1.',
  'Service fees are $0, $49, or $99 plus tax per approved claim.',
  'There is a $3,000 claim limit and a $5,000 limit over 12 months.',
  'This plan does not cover phones. You can cancel anytime with a prorated refund.',
]

export const AFTER_CALL_ITEMS = [
  'Call notes saved',
  'Disposition set',
  'Call summary generated',
  'Activation record updated',
  'VHDP enrollment recorded',
]

/**
 * Pit Stop full call summary for an integrated client (Verizon). The summary
 * is sent automatically into the client system — no copy step. Spans are
 * colored in the UI: `good` → green, `focus` → red/at-risk, plain → muted.
 */
export const PIT_STOP_SUMMARY = {
  integrated: true as const,
  clientLabel: 'Verizon',
  /** Plain-text full summary (disposition / notes systems). */
  plainText:
    "Fixed Maria's iPhone 15 activation (Wi-Fi + carrier), verified with PIN fallback, and enrolled Verizon Home Device Protect. Sentiment stayed positive. Call length ran over target — tighten the solve on the next one.",
}

// ---------------------------------------------------------------------------
// Customer summary card + History tab data. Re-skinned around the running demo
// customer (Maria Rodriguez / Verizon / iPhone 15) so the transcript, card,
// and history stay consistent. Ported/adapted from summary-v1's call-data.ts.
// ---------------------------------------------------------------------------

/**
 * Lines on Maria's Verizon account. The primary line carries the replacement
 * iPhone 15 she's activating on today's call (ties to `CUSTOMER.device`); the
 * other two are household lines. Each line shows a real device render (pulled
 * from the summary-v1 prototype into `public/devices/`), mapped to the closest
 * available phone image.
 */
export const ACCOUNT_LINES: AccountLine[] = [
  {
    phone: '(615) 480-1640',
    device: 'Replacement iPhone 15',
    holder: 'Maria Rodriguez',
    image: '/devices/iphone-14-pro.png',
    imei: '35 674209 812345 6',
  },
  {
    phone: '(615) 480-2288',
    device: 'iPhone 14',
    holder: 'Diego Rodriguez',
    image: '/devices/iphone-13.png',
    imei: '35 902184 556677 1',
  },
  {
    phone: '(615) 480-3095',
    device: 'Samsung Galaxy S23',
    holder: 'Sofia Rodriguez',
    image: '/devices/samsung-galaxy-s24.png',
    imei: '35 118273 449021 8',
  },
]

/** Maria's active mobile protection plan. */
export const PROTECTION_PLAN: ProtectionPlan = {
  name: 'Verizon Mobile Protect Multi-device',
  status: 'Active',
  detail: 'Covers eligible tech across the home',
  coveredSince: 'April 2, 2026',
  carrier: 'Verizon',
  totalSlots: 4,
}

/** The VHDP product being offered during the Sell flow. */
export const VHDP_OFFER = {
  name: 'Verizon Home Device Protect',
  price: '$25/month plus tax.',
  cancelNote: 'Cancel Anytime',
} as const

/**
 * Maria's prior contacts, newest-first. The most recent is the claim that
 * produced the replacement iPhone 15 she's activating today; older entries are
 * a mix of household tech-support calls and a family-line claim. Phone claims
 * run through mobile device protection (VHDP explicitly excludes phones), so
 * they're not attributed to the home plan above.
 */
export const CONTACT_HISTORY: ContactHistoryEntry[] = [
  {
    id: 'ch-1',
    date: 'Sep 10, 2026',
    channel: 'Claim',
    title: 'Liquid damage — iPhone 15',
    status: 'Resolved',
    summary:
      'Maria’s iPhone 15 stopped powering on after liquid exposure. A replacement claim was filed under her mobile device protection and a replacement iPhone 15 was approved and shipped.',
    notes: [
      'Confirmed the device stayed unresponsive after drying and a forced restart.',
      'Verified coverage and processed the replacement; service fee collected.',
      'Replacement iPhone 15 shipped next-day — the device on today’s activation call.',
    ],
  },
  {
    id: 'ch-2',
    date: 'Jun 3, 2026',
    channel: 'Tech support',
    title: 'Living-room TV buffering at peak hours',
    status: 'Resolved',
    summary:
      'The smart TV buffered every evening. It was on the 2.4GHz band competing with several other devices during peak use.',
    notes: [
      'Moved the TV to the 5GHz band and separated the network names.',
      'Ran a stream test end-to-end with no rebuffering.',
      'Follow-up two days later confirmed the fix held.',
    ],
  },
  {
    id: 'ch-3',
    date: 'Mar 18, 2026',
    channel: 'Tech support',
    title: 'Email stopped syncing after a password change',
    status: 'Resolved',
    summary:
      'After changing the account password, Mail kept prompting for credentials and would not pull new messages.',
    notes: [
      'Removed and re-added the mail account with the new password.',
      'Enabled Fetch and sent a test message to confirm delivery.',
    ],
  },
  {
    id: 'ch-4',
    date: 'Dec 12, 2025',
    channel: 'Claim',
    title: 'Cracked screen — iPhone 14',
    status: 'Resolved',
    summary:
      'Diego’s line: the screen shattered after a drop. A repair was filed under device protection and completed by mail-in.',
    notes: [
      'Verified coverage on the line and collected the service fee.',
      'Next-day mail-in repair kit sent; device returned in working order.',
    ],
  },
  {
    id: 'ch-5',
    date: 'Sep 27, 2025',
    channel: 'Tech support',
    title: 'New tablet won’t join the home Wi-Fi',
    status: 'Not resolved',
    summary:
      'A newly set-up tablet repeatedly failed to join the 5GHz network. Basic troubleshooting did not connect it before the call ended.',
    notes: [
      'Confirmed the band and re-entered the network password.',
      'Suggested a router reboot to try off-call; no follow-up was received.',
    ],
  },
]

/**
 * Maps a captured `facts.symptom` to a friendly phrase for the customer card's
 * issue-reveal stage (includes its own article). Falls back to a generic phrase
 * so the card still reads naturally for symptoms without a mapping.
 */
export const ISSUE_LABELS: Record<string, string> = {
  'sos-no-service': 'an activation issue',
}

export const ISSUE_LABEL_FALLBACK = 'an issue'
