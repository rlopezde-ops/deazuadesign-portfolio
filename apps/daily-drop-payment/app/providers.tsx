'use client'

import type { ReactNode } from 'react'

import { GlobalThemeProvider } from '@expert/theme'

/**
 * Wraps the app in the real, vendored Asurion Mantine theme (`@expert/theme`), which supplies the
 * `asurion` palette, the Apercu font stack, the custom spacing/font scales, and the
 * `--exwo-color-*` CSS variables that the vendored CSS modules depend on.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <GlobalThemeProvider forceColorScheme="dark">{children}</GlobalThemeProvider>
}
