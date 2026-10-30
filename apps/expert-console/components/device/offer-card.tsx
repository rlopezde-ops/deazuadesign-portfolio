'use client'

import Image from 'next/image'

export interface OfferCardProps {
  name: string
  price: string
  priceSuffix?: string
  cancelNote?: string
}

export function OfferCard({ name, price, cancelNote }: OfferCardProps) {
  return (
    <div className="offer-card">
      <div className="offer-card-image">
        <span className="aui-tag aui-tag--success-soft offer-card-eligible">Eligible</span>
        <Image
          src="/devices/vhdp-devices.png"
          alt="Eligible home devices"
          width={280}
          height={200}
          className="offer-card-devices-img"
          draggable={false}
        />
      </div>
      <div className="offer-card-body">
        <p className="offer-card-name">{name}</p>
        <p className="offer-card-price">
          {price}
          {cancelNote ? <span className="offer-card-cancel"> {cancelNote}</span> : null}
        </p>
        <button type="button" className="aui-text-action">
          View coverage details
        </button>
      </div>
    </div>
  )
}
