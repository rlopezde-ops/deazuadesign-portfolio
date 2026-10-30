'use client'

import { Stack, Text } from '@mantine/core'

/**
 * Stands in for `@/panels/.../PanelErrorFallback`. Same react-error-boundary `fallbackRender`
 * signature as production so the vendored `WorkspaceSlots` error boundaries compile unchanged.
 */
export function PanelErrorFallback({ error }: { error: unknown }) {
  return (
    <Stack align="center" justify="center" h="100%" p="xl" gap="xs">
      <Text fw={600}>Something went wrong in this panel.</Text>
      <Text c="dimmed" size="sm" ta="center">
        {error instanceof Error ? error.message : 'Unknown error'}
      </Text>
    </Stack>
  )
}
