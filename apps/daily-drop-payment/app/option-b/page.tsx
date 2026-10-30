'use client'

import Link from 'next/link'
import { Button, Center, Stack, Text, Title } from '@mantine/core'

export default function Page() {
  return (
    <Center h="100dvh">
      <Stack align="center" gap="md">
        <Title order={2}>Coming Soon</Title>
        <Text c="dimmed">This prototype is still being built.</Text>
        <Button component={Link} href="/" variant="subtle">
          ← Back to prototypes
        </Button>
      </Stack>
    </Center>
  )
}
