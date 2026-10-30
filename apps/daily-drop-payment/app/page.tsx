'use client'

import Link from 'next/link'
import { Badge, Button, Card, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'

import { PROTOTYPES, type PrototypeStatus } from '~/prototype/variants'

const STATUS_COLOR: Record<PrototypeStatus, string> = {
  ready: 'green',
  'in-progress': 'yellow',
  'coming-soon': 'gray',
}

const STATUS_LABEL: Record<PrototypeStatus, string> = {
  ready: 'Ready to review',
  'in-progress': 'In progress',
  'coming-soon': 'Coming soon',
}

export default function LandingPage() {
  return (
    <Container size="md" py={64}>
      <Stack gap={40}>
        <Stack gap={8}>
          <Title order={1} fz={28}>
            Daily Drop · Payment Prototypes
          </Title>
          <Text c="dimmed">Choose a prototype to explore.</Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {PROTOTYPES.map((proto) => (
            <Card
              key={proto.slug}
              padding="lg"
              radius="md"
              withBorder
              style={{ background: 'var(--exwo-color-panel-bg)' }}
            >
              <Stack gap="sm" h="100%">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Title order={3} fz={16}>
                    {proto.title}
                  </Title>
                  <Badge color={STATUS_COLOR[proto.status]} variant="light" size="sm">
                    {STATUS_LABEL[proto.status]}
                  </Badge>
                </Group>
                <Text c="dimmed" size="sm" style={{ flex: 1 }}>
                  {proto.description}
                </Text>
                <Button
                  component={Link}
                  href={`/${proto.slug}`}
                  variant="light"
                  disabled={proto.status === 'coming-soon'}
                  fullWidth
                >
                  Launch
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
