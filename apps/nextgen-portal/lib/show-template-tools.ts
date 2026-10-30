/**
 * Show Playwright + Dev chrome in the Flow Map UI.
 *
 * - Always on in local development
 * - In production only when this is the Flow Map template showcase
 *   (`NEXT_PUBLIC_FLOW_MAP_TEMPLATE_TOOLS=1` on the Flow Map Vercel project)
 *
 * When copying Flow Map into another prototype, do NOT set this flag — keep
 * Playwright/Dev gated to development only.
 */
export function showTemplateTools() {
  return (
    process.env.NEXT_PUBLIC_FLOW_MAP_TEMPLATE_TOOLS === '1' ||
    process.env.NODE_ENV === 'development'
  )
}
