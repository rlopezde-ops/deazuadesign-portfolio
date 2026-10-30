'use client'

import type { ReactNode } from 'react'
import { Box, Checkbox, Group, Radio, Stack, Text } from '@mantine/core'

export type SelectionOption = {
  value: string
  title: ReactNode
  subtitle?: ReactNode
  leading?: ReactNode
  trailing?: ReactNode
}

type BaseProps = {
  label?: string
  options: SelectionOption[]
  /** Container-aware grid min column width. Omit for a vertical stack. */
  minColWidth?: number
  className?: string
}

type SingleProps = BaseProps & {
  mode?: 'single'
  value: string | null
  onChange: (value: string) => void
}

type MultiProps = BaseProps & {
  mode: 'multi'
  value: string[]
  onChange: (value: string[]) => void
}

export type SelectionSlotProps = SingleProps | MultiProps

/** Cards read as separate choices, not one fused block. */
const CARD_GAP = 'var(--aui-spacing-200)'

/**
 * AUI Selection Slot — labeled stack (or container-aware grid) of choice cards.
 * Wraps Mantine Radio.Card / Checkbox.Card. Use for one question with a small
 * set of clear options (device, channel, path). Prefer this over Input Widget
 * when the ask is a single lightweight decision.
 */
export function SelectionSlot(props: SelectionSlotProps) {
  const { label, options, minColWidth, className = '' } = props
  const isMulti = props.mode === 'multi'

  const items = options.map((o) => {
    if (isMulti) {
      const checked = props.value.includes(o.value)
      return (
        <Checkbox.Card
          key={o.value}
          value={o.value}
          checked={checked}
          onClick={() => {
            const next = checked
              ? props.value.filter((v) => v !== o.value)
              : [...props.value, o.value]
            props.onChange(next)
          }}
          p="sm"
          radius="sm"
          className="selection-slot-card"
        >
          <Group align="flex-start" gap="sm" wrap="nowrap">
            {o.leading}
            <Checkbox.Indicator />
            <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
              <Text size="md" fw={600} c="var(--aui-on-surface)">
                {o.title}
              </Text>
              {o.subtitle ? (
                <Text size="sm" c="var(--aui-on-surface-soft)">
                  {o.subtitle}
                </Text>
              ) : null}
            </Stack>
            {o.trailing}
          </Group>
        </Checkbox.Card>
      )
    }

    return (
      <Radio.Card
        key={o.value}
        value={o.value}
        p="sm"
        radius="sm"
        className="selection-slot-card"
      >
        <Group align="flex-start" gap="sm" wrap="nowrap">
          {o.leading}
          <Radio.Indicator />
          <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
            <Text size="md" fw={600} c="var(--aui-on-surface)">
              {o.title}
            </Text>
            {o.subtitle ? (
              <Text size="sm" c="var(--aui-on-surface-soft)">
                {o.subtitle}
              </Text>
            ) : null}
          </Stack>
          {o.trailing}
        </Group>
      </Radio.Card>
    )
  })

  const body = minColWidth ? (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`,
        gap: CARD_GAP,
      }}
    >
      {items}
    </Box>
  ) : (
    <Stack gap={CARD_GAP}>{items}</Stack>
  )

  return (
    <div className={`selection-slot ${className}`.trim()}>
      {label ? <p className="selection-slot-label">{label}</p> : null}
      {isMulti ? (
        body
      ) : (
        <Radio.Group
          value={props.value ?? ''}
          onChange={props.onChange}
          name={typeof label === 'string' ? label : 'selection'}
        >
          {body}
        </Radio.Group>
      )}
    </div>
  )
}
