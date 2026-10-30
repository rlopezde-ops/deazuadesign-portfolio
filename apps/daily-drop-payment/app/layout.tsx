import type { Metadata, Viewport } from 'next'

import { Analytics } from '@vercel/analytics/next'
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'

// Mantine's layered stylesheet must load before the vendored CSS modules that override it.
import '@mantine/core/styles.layer.css'
import '@mantine/schedule/styles.layer.css'
import './globals.css'

import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Daily Drop · Payment Prototypes',
  description: 'Prototype gallery for the daily-drop payment experience.',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript forceColorScheme="dark" />
      </head>
      <body>
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
