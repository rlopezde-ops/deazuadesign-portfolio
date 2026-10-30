/**
 * Stands in for `@expert/logging` (pino-backed in production). Console-backed here so vendored
 * components keep their real logging call sites.
 */
export interface Logger {
  debug: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
}

const noopLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: (...args) => console.error('[prototype]', ...args),
}

export const getLogger = (_context?: Record<string, unknown>): Logger => noopLogger
