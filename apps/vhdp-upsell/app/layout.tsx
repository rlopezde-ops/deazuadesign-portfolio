import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const apercu = localFont({
  variable: '--font-apercu',
  display: 'swap',
  src: [
    {
      path: '../fonts/Apercu-Light-Pro.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/Apercu-Regular-Pro.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Apercu-Bold-Pro.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Apercu-Black-Pro.otf',
      weight: '900',
      style: 'normal',
    },
  ],
})

export const metadata: Metadata = {
  title: 'Verizon Home Device Protect',
  description: 'Protect all your eligible home tech with one plan.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: 'white',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light ${apercu.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
