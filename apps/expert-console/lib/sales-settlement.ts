import {
  ASSIST_SEND_DETAILS_KEY,
  appendSurfacedKey,
  getNextNavKey,
} from '@/lib/sales-assist-steps'
import type { ConsoleState } from '@/store/console-store'

export type SalesSettleMode = 'read' | 'skip'

function uniquePush(list: readonly string[], key: string): string[] {
  if (list.includes(key)) return [...list]
  return [...list, key]
}

/** Surface + focus a sales key (director or settlement advance). */
export function surfaceSalesKeyPatch(state: ConsoleState, key: string): Partial<ConsoleState> {
  const prior = state.activeScriptKey
  const patch: Partial<ConsoleState> = {
    surfacedScriptKeys: appendSurfacedKey(state.surfacedScriptKeys, key),
    activeScriptKey: key,
    salesFocusKey: null,
  }

  // When the director jumps ahead, treat the prior unsettled key as read.
  if (prior && prior !== key) {
    patch.surfacedScriptKeys = appendSurfacedKey(patch.surfacedScriptKeys!, prior)
    const priorSettled =
      state.completedScriptKeys.includes(prior) || state.skippedScriptKeys.includes(prior)
    if (!priorSettled) {
      patch.completedScriptKeys = uniquePush(state.completedScriptKeys, prior)
      patch.karaokeProgressByKey = { ...state.karaokeProgressByKey, [prior]: 1 }
    }
  }

  const alreadySettled =
    state.completedScriptKeys.includes(key) ||
    state.skippedScriptKeys.includes(key) ||
    (patch.completedScriptKeys?.includes(key) ?? false)

  patch.karaokeProgressByKey = {
    ...state.karaokeProgressByKey,
    ...patch.karaokeProgressByKey,
    [key]: alreadySettled ? 1 : 0,
  }

  return patch
}

/** Expert (or director) settles a key, then advances to the next nav key. */
export function settleSalesKeyPatch(
  state: ConsoleState,
  key: string,
  mode: SalesSettleMode,
): Partial<ConsoleState> {
  if (state.completedScriptKeys.includes(key) || state.skippedScriptKeys.includes(key)) {
    return {}
  }

  const completedScriptKeys =
    mode === 'read' ? uniquePush(state.completedScriptKeys, key) : [...state.completedScriptKeys]
  const skippedScriptKeys =
    mode === 'skip' ? uniquePush(state.skippedScriptKeys, key) : [...state.skippedScriptKeys]

  let guideDetailsSent = state.guideDetailsSent
  if (key === ASSIST_SEND_DETAILS_KEY) {
    guideDetailsSent = mode === 'read'
  }

  const mid: ConsoleState = {
    ...state,
    completedScriptKeys,
    skippedScriptKeys,
    guideDetailsSent,
    karaokeProgressByKey: { ...state.karaokeProgressByKey, [key]: 1 },
    surfacedScriptKeys: appendSurfacedKey(state.surfacedScriptKeys, key),
    activeScriptKey: key,
  }

  const nextKey = getNextNavKey(key)
  if (!nextKey) {
    return {
      completedScriptKeys,
      skippedScriptKeys,
      guideDetailsSent,
      karaokeProgressByKey: mid.karaokeProgressByKey,
      surfacedScriptKeys: mid.surfacedScriptKeys,
      activeScriptKey: key,
      salesFocusKey: null,
    }
  }

  const advanced = surfaceSalesKeyPatch(mid, nextKey)
  return {
    completedScriptKeys,
    skippedScriptKeys,
    guideDetailsSent,
    salesFocusKey: null,
    ...advanced,
  }
}

export function setKaraokeProgressPatch(
  state: ConsoleState,
  key: string,
  progress: number,
): Partial<ConsoleState> {
  const clamped = Math.max(0, Math.min(1, progress))
  if (state.karaokeProgressByKey[key] === clamped) return {}
  return {
    karaokeProgressByKey: { ...state.karaokeProgressByKey, [key]: clamped },
  }
}

/** Empty sales progress — used by reset / invalidateDownstream. */
export const EMPTY_SALES_PROGRESS = {
  activeScriptKey: null as string | null,
  surfacedScriptKeys: [] as string[],
  completedScriptKeys: [] as string[],
  skippedScriptKeys: [] as string[],
  karaokeProgressByKey: {} as Record<string, number>,
  guideDetailsSent: null as boolean | null,
  salesFocusKey: null as string | null,
}
