'use client'

import { Flex } from '@mantine/core'

import { WorkspaceHeader } from '@/components/header/WorkspaceHeader'
import { useWorkspaceHomeState } from '@/components/workspace/redesigned-layout/hooks/useWorkspaceHomeState'
import { WorkspaceLayoutV2 } from '@/components/workspace/redesigned-layout/WorkspaceLayoutV2'
import { WorkspaceRightSlot } from '@/components/workspace/redesigned-layout/WorkspaceHomeSlots'
import styles from '@/components/workspace/workspace.module.css'

import { CardFlipHub } from './CardFlipHub'
import { DevPanel } from './DevPanel'

export function CardFlipShell() {
  const { showExpertHub, rightTopOpen, rightTopSize, rightTopMin, rightTopMax } =
    useWorkspaceHomeState({ isOffCall: true, baseRightTopOpen: false })

  return (
    <>
      <WorkspaceHeader />

      <Flex className={styles.container}>
        <WorkspaceLayoutV2
          leftTopOpen={false}
          leftBottom={
            showExpertHub ? (
              <Flex pos="absolute" inset={0}>
                <CardFlipHub />
              </Flex>
            ) : null
          }
          rightTop={<WorkspaceRightSlot showExpertHub={showExpertHub} onCallContent={null} />}
          rightTopOpen={rightTopOpen}
          rightTopSize={rightTopSize}
          rightTopMin="260px"
          rightTopMax={rightTopMax}
        />
      </Flex>

      <DevPanel />
    </>
  )
}
