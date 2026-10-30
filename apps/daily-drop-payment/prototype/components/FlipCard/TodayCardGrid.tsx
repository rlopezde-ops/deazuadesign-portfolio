import type { ReactNode } from 'react'

import { SimpleGrid } from '@mantine/core'
import { useIsPacingActive } from '@expert/sales-tools'
import { motion } from 'framer-motion'

import { TodayPaceCard } from '@/expert-hub/metrics/TodayPaceCard'
import { TodaySalesCard } from '@/expert-hub/metrics/TodaySalesCard'
import { TodayTotalCallsCard } from '@/expert-hub/metrics/TodayTotalCallsCard'

function AnimatedCard({ children, index }: { children: ReactNode; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: index * 0.06,
          duration: 0.22,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
      }}
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  )
}

export function TodayCardGrid() {
  const isPacingActive = useIsPacingActive()

  return (
    <SimpleGrid
      type="container"
      cols={isPacingActive ? { base: 1, '440px': 2, '680px': 3 } : { base: 1, '440px': 2 }}
      spacing="md"
    >
      <AnimatedCard index={0}>
        <TodayTotalCallsCard />
      </AnimatedCard>
      {isPacingActive && (
        <AnimatedCard index={1}>
          <TodayPaceCard />
        </AnimatedCard>
      )}
      <AnimatedCard index={isPacingActive ? 2 : 1}>
        <TodaySalesCard />
      </AnimatedCard>
    </SimpleGrid>
  )
}
