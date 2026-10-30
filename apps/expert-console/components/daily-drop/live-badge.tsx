import { Group } from '@mantine/core'
import classes from './daily-drop.module.css'

export function LiveBadge() {
  return (
    <Group gap={5} align="center" wrap="nowrap" className={classes.liveBadge}>
      <span className={classes.liveDot} />
      Live
    </Group>
  )
}
