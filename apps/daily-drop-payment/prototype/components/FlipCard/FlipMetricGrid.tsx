import { SimpleGrid, Stack, Text } from '@mantine/core'
import { useMemo } from 'react'

import type { PayMetrics } from '@/expert-hub/data/types'
import { PAY_CONFIG } from '@/expert-hub/data/payTiers'
import { METRIC_KEYS } from '@/expert-hub/data/metricKeys'
import { getMetricValue } from '@/expert-hub/data/utils'

import { FlipMetricCard } from './FlipMetricCard'
import { computeCurrentPayout } from './payModel'

import styles from './FlipMetricGrid.module.css'

interface Props {
  payMetrics: PayMetrics | null
  isLoading: boolean
  isError?: boolean
}

export function FlipMetricGrid({ payMetrics, isLoading, isError = false }: Props) {
  const serveMetricKey = useMemo(() => {
    if (!payMetrics) return 'erp' as const
    const erpCalc = getMetricValue(payMetrics.totals.serve, METRIC_KEYS.serve.ERP)
    return erpCalc !== null ? ('erp' as const) : ('expert-5star' as const)
  }, [payMetrics])

  const total = useMemo(() => {
    if (!payMetrics) return null
    const serveKey = serveMetricKey === 'erp' ? METRIC_KEYS.serve.ERP : METRIC_KEYS.serve.EXPERT_5STAR
    const serveCalc = getMetricValue(payMetrics.totals.serve, serveKey)
    const solveCalc = getMetricValue(payMetrics.totals.solve, METRIC_KEYS.solve.TRANSFER_RATE)
    const sellCalc = getMetricValue(payMetrics.totals.sell, METRIC_KEYS.sell.NET_ENROLLS)

    const servePay = serveCalc !== null
      ? computeCurrentPayout(PAY_CONFIG[serveMetricKey], serveCalc * PAY_CONFIG[serveMetricKey].calcMultiplier)
      : 0
    const solvePay = solveCalc !== null
      ? computeCurrentPayout(PAY_CONFIG['transfer-rate'], solveCalc * PAY_CONFIG['transfer-rate'].calcMultiplier)
      : 0
    const sellPay = sellCalc !== null
      ? computeCurrentPayout(PAY_CONFIG['net-enrolls'], sellCalc * PAY_CONFIG['net-enrolls'].calcMultiplier)
      : 0

    return servePay + solvePay + sellPay
  }, [payMetrics, serveMetricKey])

  const showTotal = !isLoading && !isError && total !== null && total > 0

  return (
    <Stack gap="md">
      {showTotal && (
        <div className={styles.totalBlock}>
          <Text className={styles.totalAmount}>
            You've earned ${total.toLocaleString()} this pay period
          </Text>
          <Text className={styles.totalSub}>Pay period through yesterday</Text>
        </div>
      )}
      <SimpleGrid type="container" cols={{ base: 1, '440px': 2, '680px': 3 }} spacing="md">
        <FlipMetricCard
          metricKey={serveMetricKey}
          payMetrics={payMetrics}
          isLoading={isLoading}
          isError={isError}
        />
        <FlipMetricCard
          metricKey="transfer-rate"
          payMetrics={payMetrics}
          isLoading={isLoading}
          isError={isError}
        />
        <FlipMetricCard
          metricKey="net-enrolls"
          payMetrics={payMetrics}
          isLoading={isLoading}
          isError={isError}
        />
      </SimpleGrid>
    </Stack>
  )
}
