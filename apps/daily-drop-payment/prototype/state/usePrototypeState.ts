'use client'

import { create } from 'zustand'

/**
 * Which artificial data state every dummy hook should report. There is no network layer in this
 * prototype, so these are the only way to reach the loading / error / empty branches that the
 * production components render.
 */
export type DataState = 'ready' | 'loading' | 'error' | 'empty'

/**
 * Drives the *values* in the fixtures (not the badges directly). The production
 * `computeMetricStatus` / `computeMetricTone` still derive the badge from these numbers, so the
 * thresholds being exercised are the real ones.
 */
export type TonePreset = 'on-track' | 'at-risk' | 'behind'

export interface PrototypeState {
  dataState: DataState
  tone: TonePreset
  setDataState: (value: DataState) => void
  setTone: (value: TonePreset) => void
}

const DATA_STATES: DataState[] = ['ready', 'loading', 'error', 'empty']
const TONES: TonePreset[] = ['on-track', 'at-risk', 'behind']

function readParam<T extends string>(key: string, allowed: T[], fallback: T): T {
  if (typeof window === 'undefined') return fallback
  const raw = new URLSearchParams(window.location.search).get(key)
  return allowed.includes(raw as T) ? (raw as T) : fallback
}

/** Reflect the current selection into the URL so a state is shareable as a link. */
function writeParam(key: string, value: string) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.searchParams.set(key, value)
  window.history.replaceState(null, '', url.toString())
}

export const usePrototypeState = create<PrototypeState>((set) => ({
  dataState: readParam('state', DATA_STATES, 'ready'),
  tone: readParam('tone', TONES, 'at-risk'),
  setDataState: (value) => {
    writeParam('state', value)
    set({ dataState: value })
  },
  setTone: (value) => {
    writeParam('tone', value)
    set({ tone: value })
  },
}))

/** Convenience for the dummy hooks: the loading/error flags every `use*` shim reports. */
export function useDataFlags() {
  const dataState = usePrototypeState((s) => s.dataState)
  return {
    dataState,
    isLoading: dataState === 'loading',
    isError: dataState === 'error',
    isEmpty: dataState === 'empty',
    hasData: dataState === 'ready',
  }
}
