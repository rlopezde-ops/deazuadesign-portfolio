import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Payment Hub · Expert Hub Prototype',
  description: 'Expert Hub off-call home with the daily drop payment flow integrated in-context.',
}

export default function PaymentHubLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
