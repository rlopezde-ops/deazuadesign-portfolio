'use client'

import { ACCESSORY_BY_ID, type PlacedAccessory } from '@/lib/avatar-items'

/*
 * Renders a profile photo with its placed accessories layered on top. It fills
 * its parent, so the caller sizes it (a 36px header chip, a 72px dropdown, or
 * the large stage in the customizer) — accessories are positioned in the
 * catalog's normalized coordinates, so the same composition reads correctly at
 * any size. Accessories overflow the circular photo on purpose (a hat sits
 * above the crown), so keep the parent free of `overflow-hidden`.
 */
export function ComposedAvatar({
  photo,
  accessories,
  className = '',
  photoClassName = '',
}: {
  photo: string
  accessories: PlacedAccessory[]
  /** Applied to the wrapping box. */
  className?: string
  /** Applied to the circular photo (e.g. a ring/border). */
  photoClassName?: string
}) {
  return (
    <span className={`relative block size-full ${className}`}>
      <img
        src={photo}
        alt=""
        draggable={false}
        className={`absolute inset-0 size-full select-none rounded-full object-cover ${photoClassName}`}
      />
      {accessories.map((a) => {
        const d = ACCESSORY_BY_ID[a.defId]
        if (!d) return null
        return (
          <img
            key={a.key}
            src={d.src}
            alt=""
            draggable={false}
            className="pointer-events-none absolute select-none"
            style={{
              left: `${a.x * 100}%`,
              top: `${a.y * 100}%`,
              width: `${a.scale * 100}%`,
              height: 'auto',
              transform: `translate(-50%, -50%) rotate(${a.rot}deg)`,
            }}
          />
        )
      })}
    </span>
  )
}
