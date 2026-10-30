/**
 * Stands in for `@/analytics`. Business events are logged to the console instead of dispatched, so
 * the vendored components keep their real call sites and an engineer can still see the event names
 * and payloads fire in devtools.
 */
interface Dispatcher {
  dispatchBusinessEvent: (name: string, payload?: Record<string, unknown>) => Promise<void>
}

const dispatcher: Dispatcher = {
  dispatchBusinessEvent: async (name, payload) => {
    // eslint-disable-next-line no-console
    console.debug('[prototype analytics]', name, payload ?? {})
  },
}

export const useAnalytics = () => ({ dispatcher })
export const getRootDispatcher = (): Dispatcher => dispatcher
