'use client'

import { Flex } from '@mantine/core'

import { WorkspaceHeader } from '@/components/header/WorkspaceHeader'
import { useWorkspaceHomeState } from '@/components/workspace/redesigned-layout/hooks/useWorkspaceHomeState'
import {
  WorkspaceMainSlot,
  WorkspaceRightSlot,
} from '@/components/workspace/redesigned-layout/WorkspaceHomeSlots'
import { WorkspaceLayoutV2 } from '@/components/workspace/redesigned-layout/WorkspaceLayoutV2'
import styles from '@/components/workspace/workspace.module.css'

import { DevPanel } from './DevPanel'

/**
 * Composes the production workspace the way `Workspace.tsx` and
 * `VoiceWorkspaceContentRedesignedV2.tsx` do: the fixed `WorkspaceHeader`, then the vendored
 * `.container` (absolutely positioned below the header) holding the v2 splitter shell.
 *
 * The one simplification: the expert is permanently off-call, so `isOffCall` is pinned to `true`
 * and the on-call slots are empty. Everything else is the vendored production code.
 */
export function WorkspaceShell() {
  const { showExpertHub, rightTopOpen, rightTopSize, rightTopMin, rightTopMax } =
    useWorkspaceHomeState({ isOffCall: true, baseRightTopOpen: false })

  return (
    <>
      <WorkspaceHeader />

      <Flex className={styles.container}>
        <WorkspaceLayoutV2
          leftTopOpen={false}
          leftBottom={<WorkspaceMainSlot showExpertHub={showExpertHub} onCallContent={null} />}
          rightTop={<WorkspaceRightSlot showExpertHub={showExpertHub} onCallContent={null} />}
          rightTopOpen={rightTopOpen}
          rightTopSize={rightTopSize}
          rightTopMin={rightTopMin}
          rightTopMax={rightTopMax}
        />
      </Flex>

      <DevPanel />
    </>
  )
}
