'use client'

import { getLogger, type Logger } from '@expert/logging'

/**
 * Stands in for `@/sdk` — in production this wraps the Amazon Connect / Twilio agent SDK, the agent
 * store, and the active task. The prototype has no SDK, so every value here is a constant.
 */

/** The signed-in expert's first name, shown by `Greeting`. */
export const useAgentFriendlyName = (): string => 'Ricardo'

export const useLogger = (_context?: Record<string, unknown>): Logger => getLogger()

/** Fixed session id so `SessionIdCopyButton` renders and copies something realistic. */
export const useSessionId = (): string => '74eb81cd-0fdc-47d1-8df2-18891066c87b'

export const usePartner = (): string => 'verizon'

export interface AgentState {
  /** Off-call is the state the Expert Hub renders in, so the prototype pins it there. */
  activity: string
}

const agentState: AgentState = { activity: 'Available' }

export function useAgentStore<T>(selector: (state: AgentState) => T): T {
  return selector(agentState)
}

export const useActiveTask = () => null

export const useAgentSdk = () => ({ requiresEvl: false })
