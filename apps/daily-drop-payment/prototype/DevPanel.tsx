'use client'

import { ActionIcon, Paper, SegmentedControl, Stack, Text, Tooltip, Transition } from '@mantine/core'
import { IconAdjustmentsHorizontal, IconX } from '@tabler/icons-react'
import { useState } from 'react'

import type { DataState, TonePreset } from './state/usePrototypeState'

import { usePrototypeState } from './state/usePrototypeState'

const DATA_STATE_OPTIONS = [
  { value: 'ready', label: 'Ready' },
  { value: 'loading', label: 'Loading' },
  { value: 'error', label: 'Error' },
  { value: 'empty', label: 'Empty' },
]

const TONE_OPTIONS = [
  { value: 'on-track', label: 'On track' },
  { value: 'at-risk', label: 'At risk' },
  { value: 'behind', label: 'Behind' },
]

/**
 * Prototype-only control for demoing states that would normally come from the backend. Not part of
 * production Expert Hub. Selections are mirrored into the URL (`?state=…&tone=…`) so a particular
 * state can be shared as a link.
 */
export function DevPanel() {
  const [open, setOpen] = useState(false)
  const { dataState, tone, setDataState, setTone } = usePrototypeState()

  return (
    <>
      <Transition mounted={open} transition="pop-bottom-left" duration={120}>
        {(style) => (
          <Paper
            style={{ ...style, position: 'fixed', left: 16, bottom: 64, zIndex: 1200, width: 260 }}
            shadow="md"
            radius="md"
            withBorder
            p="sm"
            bg="var(--exwo-color-panel-bg)"
          >
            <Stack gap="xs">
              <Text fz="xs" fw={700} tt="uppercase" c="dimmed">
                Prototype states
              </Text>

              <Stack gap={4}>
                <Text fz="xs" c="dimmed">
                  Data state
                </Text>
                <SegmentedControl
                  size="xs"
                  fullWidth
                  value={dataState}
                  data={DATA_STATE_OPTIONS}
                  onChange={(v) => setDataState(v as DataState)}
                />
              </Stack>

              <Stack gap={4}>
                <Text fz="xs" c="dimmed">
                  Performance
                </Text>
                <SegmentedControl
                  size="xs"
                  fullWidth
                  value={tone}
                  data={TONE_OPTIONS}
                  onChange={(v) => setTone(v as TonePreset)}
                />
              </Stack>

              <Text fz={10} c="dimmed">
                Badges are still computed by production&apos;s computeMetricStatus / computeMetricTone
                from these fixture values.
              </Text>
            </Stack>
          </Paper>
        )}
      </Transition>

      <Tooltip label={open ? 'Hide prototype controls' : 'Prototype controls'} position="right">
        <ActionIcon
          size="lg"
          radius="xl"
          variant="filled"
          color="asurion"
          aria-label="Toggle prototype state controls"
          style={{ position: 'fixed', left: 16, bottom: 16, zIndex: 1201 }}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconX size={18} /> : <IconAdjustmentsHorizontal size={18} />}
        </ActionIcon>
      </Tooltip>
    </>
  )
}
