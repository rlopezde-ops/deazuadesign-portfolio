'use client'

import { ActionIcon, Group, Menu, Text, Tooltip } from '@mantine/core'
import {
  ArrowsClockwise,
  CaretDown,
  CaretLeft,
  CaretRight,
  Pause,
  Play,
  Sparkle,
} from '@phosphor-icons/react'
import { BEATS, SCENE_LABELS, SCENE_ORDER } from '@/lib/script'
import type { SceneId } from '@/lib/types'
import { useConsoleStore } from '@/store/console-store'
import { useDirector } from '@/hooks/use-director'

const SECTION_OPTIONS = SCENE_ORDER.map((id) => ({
  value: id,
  label: SCENE_LABELS[id],
}))

export function DemoBar() {
  const demoBarVisible = useConsoleStore((s) => s.demoBarVisible)
  const autoPlay = useConsoleStore((s) => s.autoPlay)
  const joyAvatarEnabled = useConsoleStore((s) => s.joyAvatarEnabled)
  const scene = useConsoleStore((s) => s.scene)
  const patch = useConsoleStore((s) => s.patch)
  const { beatIndex, totalBeats, advance, retreat, reset, jumpToScene } = useDirector()

  if (!demoBarVisible) return null

  const current = BEATS[Math.max(0, beatIndex)]
  const beatLabel = `${Math.max(0, beatIndex + 1)}/${totalBeats}`
  const sectionLabel =
    SCENE_LABELS[scene as (typeof SCENE_ORDER)[number]] ?? scene

  return (
    <div className="fixed bottom-4 left-4 z-[90] flex max-w-[min(320px,calc(100%-2rem))] flex-col gap-1.5">
      <div className="flex items-center gap-1 rounded-xl border border-[#3a3642] bg-[#1c1a21]/92 py-1 pl-1 pr-1.5 shadow-xl backdrop-blur">
        <Menu
          shadow="md"
          width={200}
          position="top-start"
          offset={8}
          classNames={{
            dropdown: 'border border-[#3a3642] bg-[#1c1a21] p-1',
            item: 'rounded-md text-[12px] text-[#e8e6ed] data-[hovered]:bg-[#3a3642]',
          }}
        >
          <Menu.Target>
            <button
              type="button"
              className="motion-press flex min-w-0 max-w-[148px] items-center gap-1 rounded-lg px-2 py-1 hover:bg-[#2a2630]"
              aria-label="Jump to section"
            >
              <Text fz={11} fw={600} c="#e8e6ed" lineClamp={1} className="min-w-0">
                {sectionLabel}
              </Text>
              <CaretDown size={12} className="shrink-0 text-[#716e78]" aria-hidden />
            </button>
          </Menu.Target>
          <Menu.Dropdown>
            {SECTION_OPTIONS.map((option) => (
              <Menu.Item
                key={option.value}
                onClick={() => jumpToScene(option.value as SceneId)}
                rightSection={
                  option.value === scene ? (
                    <Text fz={10} c="#b233ff" fw={600}>
                      Now
                    </Text>
                  ) : undefined
                }
              >
                {option.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>

        <div className="mx-0.5 h-4 w-px shrink-0 bg-[#3a3642]" aria-hidden />

        <Text
          fz={11}
          fw={600}
          c="#a7a4ae"
          style={{ fontVariantNumeric: 'tabular-nums', minWidth: 36 }}
          className="shrink-0 text-center"
        >
          {beatLabel}
        </Text>

        <Group gap={2} wrap="nowrap" className="shrink-0">
          <Tooltip label="Previous beat" position="top" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              radius="md"
              aria-label="Previous beat"
              onClick={retreat}
              className="motion-press"
            >
              <CaretLeft size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={autoPlay ? 'Pause' : 'Play'} position="top" withArrow>
            <ActionIcon
              variant="filled"
              color="asurion.5"
              size="sm"
              radius="md"
              aria-label={autoPlay ? 'Pause' : 'Play'}
              onClick={() => patch({ autoPlay: !autoPlay })}
              className="motion-press"
            >
              {autoPlay ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Next beat" position="top" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              radius="md"
              aria-label="Next beat"
              onClick={advance}
              className="motion-press"
            >
              <CaretRight size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Reset" position="top" withArrow>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              radius="md"
              aria-label="Reset"
              onClick={reset}
              className="motion-press"
            >
              <ArrowsClockwise size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <div className="mx-0.5 h-4 w-px shrink-0 bg-[#3a3642]" aria-hidden />

        <Tooltip label={joyAvatarEnabled ? 'Hide Joy avatar' : 'Show Joy avatar'} position="top" withArrow>
          <ActionIcon
            variant={joyAvatarEnabled ? 'filled' : 'subtle'}
            color={joyAvatarEnabled ? 'asurion.5' : 'gray'}
            size="sm"
            radius="md"
            aria-label={joyAvatarEnabled ? 'Hide Joy avatar' : 'Show Joy avatar'}
            aria-pressed={joyAvatarEnabled}
            onClick={() => patch({ joyAvatarEnabled: !joyAvatarEnabled })}
            className="motion-press shrink-0"
          >
            <Sparkle size={15} />
          </ActionIcon>
        </Tooltip>
      </div>

      {current?.gateLabel && (
        <div className="rounded-lg border border-[#5113a1]/50 bg-[#200270]/80 px-2.5 py-1 backdrop-blur">
          <Text fz={11} fw={600} c="#d0aaf1" lineClamp={1}>
            {current.gateLabel}
          </Text>
        </div>
      )}
    </div>
  )
}
