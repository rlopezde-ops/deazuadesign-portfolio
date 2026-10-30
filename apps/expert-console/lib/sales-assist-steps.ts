import { SALES_SCRIPTS, type SalesScriptDef, type SalesScriptKey } from '@/lib/task-content'

export type AssistStepKind = 'script' | 'action'

export interface AssistStep {
  id: string
  label: string
  kind: AssistStepKind
  caption?: string
  reviewLabel?: string
  scriptKeys: readonly string[]
  preview: string
}

/** Action key after Guide — no script body; expert sends or declines product details. */
export const ASSIST_SEND_DETAILS_KEY = 'send-details'

const OFFER_KEYS = ['offer-1', 'offer-2', 'offer-3', 'offer-4', 'offer-5'] as const

function truncatePreview(text: string, max = 72): string {
  const singleLine = text.replace(/\s+/g, ' ').trim()
  if (singleLine.length <= max) return singleLine
  return `${singleLine.slice(0, max - 1).trimEnd()}…`
}

/**
 * High-level Sell progress inside the Sell flow chip.
 * Rebuttal is intentionally not a step in this pass.
 */
export const ASSIST_STEPS: readonly AssistStep[] = [
  {
    id: 'transition',
    label: 'Transition',
    reviewLabel: 'Transition statement',
    kind: 'script',
    scriptKeys: ['transition'],
    preview: 'Introduce Verizon Home Device Protect before wrapping up.',
  },
  {
    id: 'guide',
    label: 'Guide',
    caption: 'Send product details',
    reviewLabel: 'Guided browsing',
    kind: 'script',
    scriptKeys: ['guide', ASSIST_SEND_DETAILS_KEY],
    preview: truncatePreview(SALES_SCRIPTS.guide.script),
  },
  {
    id: 'offer',
    label: 'Offer',
    kind: 'script',
    scriptKeys: OFFER_KEYS,
    preview: truncatePreview(SALES_SCRIPTS['offer-1'].script),
  },
  {
    id: 'enrollment',
    label: 'Enroll',
    reviewLabel: 'Closing ask',
    kind: 'script',
    scriptKeys: ['close-ask'],
    preview: SALES_SCRIPTS['close-ask'].script,
  },
] as const

/** Flat ordered list of every navigable sales key. */
export const ASSIST_NAV_KEYS: readonly string[] = ASSIST_STEPS.flatMap((step) => [...step.scriptKeys])

export function getAssistStepIndexForScriptKey(scriptKey: string | null | undefined): number {
  if (!scriptKey) return -1
  return ASSIST_STEPS.findIndex((step) => step.scriptKeys.includes(scriptKey))
}

export function getAssistNavIndex(scriptKey: string | null | undefined): number {
  if (!scriptKey) return -1
  return ASSIST_NAV_KEYS.indexOf(scriptKey)
}

export function isAssistStepCompleted(
  stepIndex: number,
  completedKeys: readonly string[],
  skippedKeys: readonly string[] = [],
): boolean {
  const step = ASSIST_STEPS[stepIndex]
  if (!step) return false
  return step.scriptKeys.every((key) => completedKeys.includes(key) || skippedKeys.includes(key))
}

/** Previous key among those already surfaced — drives Sell back-arrow review. */
export function getPreviousSurfacedKey(
  currentKey: string | null | undefined,
  surfacedKeys: readonly string[],
): string | null {
  if (!currentKey || surfacedKeys.length === 0) return null
  const currentIdx = surfacedKeys.indexOf(currentKey)
  if (currentIdx <= 0) return null
  return surfacedKeys[currentIdx - 1] ?? null
}

export function getNextSurfacedKey(
  currentKey: string | null | undefined,
  surfacedKeys: readonly string[],
): string | null {
  if (!currentKey || surfacedKeys.length === 0) return null
  const currentIdx = surfacedKeys.indexOf(currentKey)
  if (currentIdx < 0 || currentIdx >= surfacedKeys.length - 1) return null
  return surfacedKeys[currentIdx + 1] ?? null
}

export function appendSurfacedKey(surfacedKeys: readonly string[], key: string): string[] {
  if (surfacedKeys.includes(key)) return [...surfacedKeys]
  return [...surfacedKeys, key]
}

/** Next key in the full nav order after `currentKey`. */
export function getNextNavKey(currentKey: string | null | undefined): string | null {
  const idx = getAssistNavIndex(currentKey)
  if (idx < 0 || idx >= ASSIST_NAV_KEYS.length - 1) return null
  return ASSIST_NAV_KEYS[idx + 1] ?? null
}

export function getSalesScript(key: string): SalesScriptDef | undefined {
  if (!(key in SALES_SCRIPTS)) return undefined
  return SALES_SCRIPTS[key as SalesScriptKey] as SalesScriptDef
}

/** Offer beat label like "Offer 2/5"; single-card steps use reviewLabel. */
export function getBeatEyebrowLabel(scriptKey: string): string {
  const step = ASSIST_STEPS.find((s) => s.scriptKeys.includes(scriptKey))
  if (!step) return 'Script'
  const cardKeys = step.scriptKeys.filter((k) => k !== ASSIST_SEND_DETAILS_KEY && getSalesScript(k))
  if (cardKeys.length > 1) {
    const index = cardKeys.indexOf(scriptKey)
    return `${step.label} ${index + 1}/${cardKeys.length}`
  }
  return step.reviewLabel ?? step.label
}
