'use client'

import { PencilSimple } from '@phosphor-icons/react'
import { ComposedAvatar } from './composed-avatar'
import type { PlacedAccessory } from '@/lib/avatar-items'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

const SIZE_PX: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 72,
  xl: 96,
}

const BADGE_PX: Record<AvatarSize, number> = {
  sm: 14,
  md: 18,
  lg: 26,
  xl: 30,
}

const ICON_PX: Record<AvatarSize, number> = {
  sm: 7,
  md: 9,
  lg: 13,
  xl: 15,
}

export function ExpertAvatar({
  photo,
  accessories,
  size = 'md',
  edit = false,
  onEdit,
  className = '',
  photoClassName = '',
}: {
  photo: string
  accessories: PlacedAccessory[]
  size?: AvatarSize
  edit?: boolean
  onEdit?: () => void
  className?: string
  photoClassName?: string
}) {
  return (
    <span
      className={`relative block shrink-0 ${className}`}
      style={{ width: SIZE_PX[size], height: SIZE_PX[size] }}
    >
      <ComposedAvatar photo={photo} accessories={accessories} photoClassName={photoClassName} />
      {edit && onEdit && (
        <button
          type="button"
          aria-label="Customize photo"
          onClick={onEdit}
          className="motion-press absolute -bottom-[2px] -right-[2px] z-10 flex items-center justify-center rounded-full border-2 border-[#221f28] bg-[#933adc] text-[#f7edff] transition-colors hover:bg-[#a053e0]"
          style={{ width: BADGE_PX[size], height: BADGE_PX[size] }}
        >
          <PencilSimple size={ICON_PX[size]} aria-hidden />
        </button>
      )}
    </span>
  )
}
