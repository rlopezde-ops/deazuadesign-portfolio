'use client'

import type { DeviceAsset } from './device-card'

export function DeviceDetailCard({ asset }: { asset: DeviceAsset }) {
  return (
    <div className="device-detail-card">
      <div className="device-detail-card-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.imageSrc}
          alt={asset.name}
          width={120}
          height={120}
        />
      </div>
      <div className="device-detail-card-info">
        <p className="device-detail-card-id">{asset.maskedId}</p>
        {asset.description ? (
          <p className="device-detail-card-desc">{asset.description}</p>
        ) : null}
        {asset.serial ? (
          <p className="device-detail-card-serial">Serial {asset.serial}</p>
        ) : null}
        <button type="button" className="device-detail-card-edit">
          Edit
        </button>
      </div>
    </div>
  )
}
