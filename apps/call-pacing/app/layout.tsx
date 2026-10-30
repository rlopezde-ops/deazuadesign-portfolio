import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Call Pacing | Asurion',
  description: 'Asurion Expert Workspace - Visual call pacing prototypes',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://assets.asurion-ui.my.asurion53.com/fonts/font-families.css"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap"
        />
      </head>
      <body className="font-sans antialiased bg-[var(--aui-background-primary)] text-[var(--aui-text-primary)]" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
