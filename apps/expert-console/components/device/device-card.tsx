'use client'

import type { ReactNode } from 'react'
import { Info, Plus, ShieldCheck } from '@phosphor-icons/react'

export type DeviceOrientation = 'vertical' | 'horizontal'

export type DeviceAsset = {
  id: string
  name: string
  /** Masked identifier shown under the image, e.g. `(***) *** – 9778`. */
  maskedId: string
  imageSrc: string
  primary?: boolean
  protected?: boolean
  /** Full device description, e.g. `Apple iPhone 16 Pro—128 GB Titanium`. */
  description?: string
  serial?: string
}

/**
 * Device selection card with orientation variants.
 * Vertical matches the customer-facing Account Devices grid; horizontal keeps
 * the pulse-proto row layout available for denser lists. Lives only in
 * expert-console — pulse-proto is read-only reference.
 */
export function DeviceCard({
  asset,
  orientation = 'vertical',
  selected = false,
  onSelect,
}: {
  asset: DeviceAsset
  orientation?: DeviceOrientation
  selected?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className="device-card"
      data-orientation={orientation}
      data-selected={selected ? 'true' : undefined}
      onClick={onSelect}
    >
      {asset.protected ? (
        <ShieldCheck size={18} weight="fill" className="device-card-shield" aria-hidden />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.imageSrc}
        alt={asset.name}
        width={orientation === 'vertical' ? 88 : 56}
        height={orientation === 'vertical' ? 88 : 56}
        className="device-card-image"
      />
      <div className="device-card-meta">
        <p className="device-card-id">{asset.maskedId}</p>
        {asset.primary ? <span className="aui-tag aui-tag--purple">Primary device</span> : null}
        {orientation === 'horizontal' ? (
          <p className="device-card-id" style={{ fontWeight: 500, color: 'var(--aui-on-surface-soft)' }}>
            {asset.name}
          </p>
        ) : null}
      </div>
    </button>
  )
}

export function EmptySlotCard({
  orientation = 'vertical',
  label = 'Add device',
  onAdd,
}: {
  orientation?: DeviceOrientation
  label?: string
  onAdd: () => void
}) {
  return (
    <button
      type="button"
      className="device-card device-card-empty"
      data-orientation={orientation}
      onClick={onAdd}
    >
      <div className="device-card-empty-inner">
        <span className="device-card-empty-plus" aria-hidden>
          <Plus size={22} weight="regular" />
        </span>
        <span className="device-card-id">{label}</span>
      </div>
    </button>
  )
}

export function SlotSummary({
  claimed,
  total,
}: {
  claimed: number
  total: number
}) {
  return (
    <p className="device-slot-summary">
      <ShieldCheck size={16} weight="fill" aria-hidden />
      <span>
        {claimed}/{total} devices claimed
      </span>
      <Info size={14} weight="regular" aria-hidden />
    </p>
  )
}

export function DeviceGrid({ children }: { children: ReactNode }) {
  return <div className="device-grid">{children}</div>
}
