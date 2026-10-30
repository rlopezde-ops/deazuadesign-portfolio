'use client'

import { AsurionLogoDark } from '@expert/common-ui/assets/AsurionLogoDark'
import { Flex, ScrollArea, Stack, UnstyledButton } from '@mantine/core'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { useAgentFriendlyName } from '@/sdk'
import { usePartnerConfig } from '@/partner/usePartnerConfig'
import { LeaderboardSummaryCard } from '@/expert-hub/cards/LeaderboardSummaryCard'
import { usePayMetrics } from '@/expert-hub/data/usePayMetrics'
import { Greeting } from '@/expert-hub/greeting/Greeting'
import { type MetricsTab, MyMetricsHeader } from '@/expert-hub/metrics/MyMetricsHeader'
import { useHubPanelStore } from '@/expert-hub/right-panel/useHubPanelStore'
import styles from '@/expert-hub/expertHub.module.css'

import { FlipMetricGrid } from './components/FlipCard/FlipMetricGrid'
import { TodayCardGrid } from './components/FlipCard/TodayCardGrid'

const TAB_TRANSITION = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.14 } },
}

export function CardFlipHub() {
  const firstName = useAgentFriendlyName()
  const { payMetrics, isLoading, isError } = usePayMetrics()
  const { leaderboards } = usePartnerConfig()
  const togglePanel = useHubPanelStore((s) => s.togglePanel)
  const [activeTab, setActiveTab] = useState<MetricsTab>('recent')

  return (
    <Flex className={styles.root} role="region" aria-label="Off-call hub">
      <ScrollArea classNames={{ root: styles.scrollRoot, viewport: styles.scrollViewport }} type="auto">
        <Stack className={styles.content} gap="xl">
          <Greeting name={firstName} />

          {leaderboards.length > 0 && (
            <LeaderboardSummaryCard
              leaderboards={leaderboards}
              onClick={() => togglePanel('leaderboard')}
            />
          )}

          <Stack gap="md">
            <MyMetricsHeader
              value={activeTab}
              onChange={setActiveTab}
              modifiedOn={payMetrics?.modifiedOn ?? null}
            />
            <AnimatePresence mode="sync">
              {activeTab === 'recent' ? (
                <motion.div key="yesterday" {...TAB_TRANSITION}>
                  <FlipMetricGrid payMetrics={payMetrics ?? null} isLoading={isLoading} isError={isError} />
                </motion.div>
              ) : (
                <motion.div key="today" {...TAB_TRANSITION}>
                  <TodayCardGrid />
                </motion.div>
              )}
            </AnimatePresence>
          </Stack>
        </Stack>
      </ScrollArea>

      <UnstyledButton
        className={styles.assistButton}
        onClick={() => togglePanel('assist')}
        aria-label="Ask Assist"
      >
        <AsurionLogoDark />
      </UnstyledButton>
    </Flex>
  )
}
