import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core'
import '@mantine/core/styles.css'
import './globals.css'
import { theme, cssVariablesResolver } from '@/lib/theme'

const apercu = localFont({
  src: [
    { path: './fonts/Apercu-Light-Pro.otf', weight: '300', style: 'normal' },
    { path: './fonts/Apercu-Regular-Pro.otf', weight: '400', style: 'normal' },
    { path: './fonts/Apercu-Bold-Pro.otf', weight: '700', style: 'normal' },
    { path: './fonts/Apercu-Black-Pro.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-apercu',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Expert Console · Asurion Workspace',
  description:
    'A scaffolded expert-facing prototype for the Asurion expert-design monorepo.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1c1a21',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={apercu.variable} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript forceColorScheme="dark" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <MantineProvider
          theme={theme}
          cssVariablesResolver={cssVariablesResolver}
          forceColorScheme="dark"
        >
          {children}
        </MantineProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
