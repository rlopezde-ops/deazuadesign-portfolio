'use client'

import { Stack, Text } from '@mantine/core'

/**
 * Stands in for `@/sidecar/AssistTab`. Production renders the Gaia-backed assist experience; it is
 * already a wiring-first placeholder inside the Expert Hub right panel, so a static panel loses
 * nothing visually here.
 */
export function AssistTab() {
  return (
    <Stack flex={1} align="center" justify="center" p="xl" gap="xs">
      <Text fw={600}>Ask Assist</Text>
      <Text c="dimmed" ta="center" maw={360} size="sm">
        The assistant is not wired up in this prototype.
      </Text>
    </Stack>
  )
}

/** Also stands in for `@/expert-university/components/PartnerSelectionMenu` (never rendered here). */
export function PartnerSelectionMenu() {
  return null
}

export default AssistTab
