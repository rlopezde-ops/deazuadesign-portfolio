// PROTOTYPE STAND-IN — not verbatim upstream. See prototype/DEVIATIONS.md.
// Upstream this composes @expert/solve-tools NotificationCenter, the Expert University partner
// menu, EVL connection status, AgentStatus, FeedbackButton and Profile — all of which are bound to
// the agent SDK, websockets and the feature-flag service. This renders the same visual row of
// controls statically so the header chrome matches production without any of that wiring.
'use client'

import { ActionIcon, Avatar, Badge, Group, Indicator, Tooltip, useMatches } from '@mantine/core'
import { IconBell, IconMessageCircle2 } from '@tabler/icons-react'

export function HeaderControls() {
  const buttonGroupGap = useMatches({ base: 'xs', md: 'sm', lg: 'md' })

  return (
    <Group wrap="nowrap" align="center" pr="lg" gap="lg">
      <Group gap={buttonGroupGap} id="header-controls-group" wrap="nowrap" align="center">
        <Tooltip label="Notifications">
          <Indicator size={6} color="primary.5" offset={4}>
            <ActionIcon variant="subtle" color="gray" aria-label="Notifications">
              <IconBell size={18} />
            </ActionIcon>
          </Indicator>
        </Tooltip>

        <Tooltip label="Send feedback">
          <ActionIcon variant="subtle" color="gray" aria-label="Send feedback">
            <IconMessageCircle2 size={18} />
          </ActionIcon>
        </Tooltip>

        <Badge size="sm" radius="sm" variant="light" color="teal">
          Available
        </Badge>

        <Avatar size={28} radius="xl" color="asurion" variant="filled">
          R
        </Avatar>
      </Group>
    </Group>
  )
}
