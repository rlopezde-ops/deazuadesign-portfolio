'use client'

import dynamic from 'next/dynamic'

const CardFlipShell = dynamic(
  () => import('~/prototype/CardFlipShell').then((m) => m.CardFlipShell),
  { ssr: false },
)

export default function Page() {
  return <CardFlipShell />
}
