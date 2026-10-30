'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu } from '@mantine/core'
import {
  CaretDown,
  Gear,
  SignOut,
  User,
} from '@phosphor-icons/react'
import { EXPERT } from '@/lib/fixtures'
import type { AgentStatus } from '@/lib/types'
import { useConsoleStore } from '@/store/console-store'
import { ExpertAvatar } from './expert-avatar'
import { AvatarCustomizer } from './avatar-customizer'

/*
 * Agent presence states shown in the top-bar status control. Available reads
 * "on" (green); everything else is a not-taking-work state (offline is muted
 * gray, the aux states share the salmon "away" tone).
 */
const STATUSES: { value: AgentStatus; label: string; color: string }[] = [
  { value: 'offline', label: 'Offline', color: '#716e78' },
  { value: 'available', label: 'Available', color: '#12b886' },
  { value: 'auxiliary', label: 'Auxiliary', color: '#ff8787' },
  { value: 'training', label: 'Training', color: '#ff8787' },
]

export function TopBar() {
  // Presence lives in the store: going Available surfaces the waiting pill over
  // the morning paper without touching the demo's beat/scene position.
  const status = useConsoleStore((s) => s.agentStatus)
  const patch = useConsoleStore((s) => s.patch)
  const accessories = useConsoleStore((s) => s.avatarAccessories)
  // Customizer open state lives in the store so the morning-paper greeting photo
  // can open this same modal instance (see daily-drop-screen).
  const customizerOpen = useConsoleStore((s) => s.avatarCustomizerOpen)
  const [opened, setOpened] = useState(false)
  // The account menu is controlled so opening the customizer can dismiss it.
  const [accountOpened, setAccountOpened] = useState(false)
  const current = STATUSES.find((s) => s.value === status) ?? STATUSES[0]

  const handleSelect = (value: AgentStatus) => {
    patch({ agentStatus: value })
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between p-[8px] pl-4">
      <div className="flex shrink-0 items-start justify-center gap-[2.672px] pb-[4.009px] pt-[1.336px]">
        <Image
          src="/brand/asurion-logo.svg"
          alt="Asurion"
          width={81}
          height={21}
          className="h-[21.38px] w-[80.51px]"
          priority
        />
        <span className="text-[24.359px] leading-[0.975] text-[#a053e0]">workspace</span>
      </div>

      <div className="flex shrink-0 items-center justify-center gap-[24px]">
        <div className="flex shrink-0 items-center gap-[16px]">
          <Menu
            opened={opened}
            onChange={setOpened}
            position="bottom-end"
            offset={10}
            width={260}
            classNames={{
              dropdown: 'rounded-xl border border-[#3a3642] bg-[#221f28] p-[8px] shadow-2xl',
              label: 'px-[12px] pb-[6px] pt-[8px] text-[13px] font-normal text-[#716e78]',
              item: 'rounded-[10px] px-[12px] py-[12px] text-[16px] text-[#d7d5db] data-[hovered]:bg-[#2a2630]',
            }}
          >
            <Menu.Target>
              <button
                type="button"
                aria-label="Set status"
                className="motion-press flex shrink-0 cursor-pointer items-center gap-[10px] rounded-full border border-[#3a3642] px-[20px] py-[10px] transition-colors hover:bg-[#221f28]"
              >
                <span
                  className="size-[10px] shrink-0 rounded-full"
                  style={{ backgroundColor: current.color }}
                />
                <span className="whitespace-nowrap text-[16px] leading-[1.5] text-[#d7d5db]">
                  {current.label}
                </span>
                <CaretDown
                  size={20}
                  className={`shrink-0 text-[#a7a4ae] transition-transform ${opened ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Set status</Menu.Label>
              {STATUSES.map((option) => (
                <Menu.Item
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  leftSection={
                    <span
                      className="size-[10px] shrink-0 rounded-full"
                      style={{ backgroundColor: option.color }}
                    />
                  }
                >
                  {option.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          <div className="flex h-[48px] w-[139px] shrink-0 items-center justify-end gap-[10px] px-[8px] py-[6px]">
            <button
              type="button"
              className="motion-press flex shrink-0 items-center rounded-full bg-[#221f28] px-[12px] py-[8px]"
            >
              <span className="flex items-center px-[8px] py-[4px]">
                <Image
                  src="/brand/trophy.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="size-[24px] shrink-0"
                />
                <span className="flex items-center px-[8px]">
                  <span className="whitespace-nowrap text-[16px] font-bold leading-[1.5] text-[#d7d5db]">
                    #{EXPERT.rank}
                  </span>
                </span>
              </span>
            </button>

            <Menu
              opened={accountOpened}
              onChange={setAccountOpened}
              position="bottom-end"
              offset={10}
              width={288}
              classNames={{
                dropdown: 'rounded-xl border border-[#3a3642] bg-[#221f28] p-[8px] shadow-2xl',
                divider: 'border-[#3a3642]',
                item: 'rounded-[10px] px-[12px] py-[12px] text-[16px] text-[#d7d5db] data-[hovered]:bg-[#2a2630]',
              }}
            >
              <Menu.Target>
                <button
                  type="button"
                  aria-label="Account menu"
                  className="motion-press flex shrink-0 cursor-pointer rounded-full border border-[#3a3642] transition-colors hover:border-[#5a5563]"
                >
                  <ExpertAvatar photo={EXPERT.photo} accessories={accessories} size="sm" />
                </button>
              </Menu.Target>
              <Menu.Dropdown>
                {/* Profile header: the full photo, larger than the header avatar,
                    with an icon-only "customize" affordance opening the builder. */}
                <div className="flex flex-col items-center gap-[10px] px-[12px] pb-[12px] pt-[8px]">
                  <ExpertAvatar
                    photo={EXPERT.photo}
                    accessories={accessories}
                    size="lg"
                    edit
                    onEdit={() => {
                      setAccountOpened(false)
                      patch({ avatarCustomizerOpen: true })
                    }}
                  />
                  <div className="text-center">
                    <div className="text-[16px] font-bold leading-[1.4] text-[#f2f1f5]">
                      {EXPERT.firstName} {EXPERT.lastName}
                    </div>
                    <div className="text-[13px] leading-[1.4] text-[#a7a4ae]">
                      Expert · #{EXPERT.rank}
                    </div>
                  </div>
                </div>
                <Menu.Divider />
                <Menu.Item leftSection={<User size={20} className="text-[#a7a4ae]" aria-hidden />}>
                  My Profile
                </Menu.Item>
                <Menu.Item
                  leftSection={<Gear size={20} className="text-[#a7a4ae]" aria-hidden />}
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  leftSection={<SignOut size={20} className="text-[#ff8787]" aria-hidden />}
                >
                  <span className="text-[#ff8787]">Log out</span>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </div>

      <AvatarCustomizer open={customizerOpen} onClose={() => patch({ avatarCustomizerOpen: false })} />
    </header>
  )
}
