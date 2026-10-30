import { Box, Group, Stack, Text } from '@mantine/core'
import {
  Coffee,
  ForkKnife,
  GraduationCap,
  Users,
} from '@phosphor-icons/react'
import { schedule, type ScheduleItem } from '@/lib/daily-drop-data'
import classes from './daily-drop.module.css'

const kindConfig: Record<
  ScheduleItem['kind'],
  { color: string; Icon: typeof Users }
> = {
  meeting: { color: '#4c8dff', Icon: Users },
  break: { color: '#3fbf8f', Icon: Coffee },
  training: { color: '#e8973a', Icon: GraduationCap },
  lunch: { color: '#c06cf0', Icon: ForkKnife },
}

export function SchedulePanel() {
  return (
    // The rail has no padding of its own (expanded views are edge-to-edge), so pad here.
    <Stack gap={22} className={classes.scheduleView}>
      <Box>
        <Text fz={16} fw={600}>
          <Box component="span" c="asurion.3">
            Today
          </Box>
          <Box component="span" c="dark.2">
            {' '}
            · Tuesday · September 8
          </Box>
        </Text>
        <Text fz={14} c="dark.3" mt={4}>
          Shift starts at 10:00 am
        </Text>
      </Box>

      <Stack gap={20}>
        {schedule.map((item) => {
          const { color, Icon } = kindConfig[item.kind]
          return (
            <Group key={`${item.time}-${item.title}`} gap={16} align="stretch" wrap="nowrap">
              <Box style={{ width: 52, flexShrink: 0 }}>
                <Text fz={15} fw={700} c="dark.1" lh={1.2}>
                  {item.time}
                </Text>
                <Text fz={13} c="dark.3">
                  {item.duration}
                </Text>
              </Box>
              <Box className={classes.timelineBar} style={{ backgroundColor: color }} />
              <Group gap={10} align="center" wrap="nowrap">
                <Icon size={18} color={color} />
                <Box>
                  <Text fz={15} fw={600} c="dark.1" lh={1.2}>
                    {item.title}
                  </Text>
                  <Text fz={13} c="dark.3">
                    {item.range}
                  </Text>
                </Box>
              </Group>
            </Group>
          )
        })}
      </Stack>
    </Stack>
  )
}
