'use client'

/**
 * Stands in for the `@expert/common-ui` barrel. Only `useNotification` is reachable from the
 * vendored header (SessionIdCopyButton) and `useWorkspaceHomeState`. This prototype has no
 * notification system, so toasts become console lines.
 *
 * Note: `@expert/common-ui/assets/*` deep imports resolve to the real vendored SVG components and
 * are NOT shimmed — see tsconfig paths.
 */
export interface NotificationOptions {
  id?: string
  title?: string
  autoClose?: number | false
}

export const useNotification = () => ({
  success: (message: string, _options?: NotificationOptions) =>
    console.debug('[prototype notification] success:', message),
  error: (message: string, _options?: NotificationOptions) =>
    console.debug('[prototype notification] error:', message),
  info: (message: string, _options?: NotificationOptions) =>
    console.debug('[prototype notification] info:', message),
})
