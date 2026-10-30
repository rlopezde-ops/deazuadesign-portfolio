import type { StateCreator, StoreApi, UseBoundStore } from 'zustand'

import { create } from 'zustand'

/**
 * Stands in for `@expert/state-utils`. The real package layers Redux devtools, immer, and persist
 * middleware onto zustand. The vendored hub stores only need plain zustand, so this keeps the same
 * `createSimpleStore(options)(initializer)` curried signature and drops the middleware.
 */
export interface DevtoolsConfig {
  store: string
  name: string
  isProd: boolean
}

export interface StoreOptions<T> {
  devtools?: DevtoolsConfig | false
  persist?: unknown
  _phantom?: T
}

export function createSimpleStore<T>(_options?: StoreOptions<T>) {
  return (initializer: StateCreator<T, [], []>): UseBoundStore<StoreApi<T>> =>
    create<T>()(initializer)
}

export const createImmerStore = createSimpleStore
