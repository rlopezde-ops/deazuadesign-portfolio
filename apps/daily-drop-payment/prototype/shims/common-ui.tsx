/**
 * Stands in for the `@/common-ui` barrel (apps/expert-ui/src/common-ui), which in production
 * re-exports a large component library. Only the workspace logo is reachable from the vendored
 * header, so this re-exports the real vendored SVG and nothing else.
 */
export { AsurionWorkspaceLogo } from '~/vendor/expert-ui/src/common-ui/assets/image/AsurionWorkspaceLogo'
