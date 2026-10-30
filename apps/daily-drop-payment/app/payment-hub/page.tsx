'use client'

import dynamic from 'next/dynamic'

const WorkspaceShell = dynamic(
  () => import('~/prototype/WorkspaceShell').then((m) => m.WorkspaceShell),
  { ssr: false },
)

export default function Page() {
  return <WorkspaceShell />
}
