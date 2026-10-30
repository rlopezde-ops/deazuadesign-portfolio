/**
 * Stands in for `@/config` (apps/expert-ui/src/config) — the real module reads Vite env vars and
 * backend URLs. This prototype makes no network calls, so it only needs the three fields the
 * vendored components actually read: `isProdMode`, `channel`, `commitHash`.
 *
 * `isProdMode: false` is what puts the vendored hooks on their non-prod branches, which is exactly
 * the behaviour an engineer sees running expert-ui locally.
 */
export const env = {
  isProdMode: false,
  channel: 'voice' as 'voice' | 'chat',
  commitHash: 'prototype',
}
