'use client'

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import {
  ArrowClockwise,
  ArrowsOut,
  ArrowUp,
  Sparkle,
  Trash,
  X,
} from '@phosphor-icons/react'
import {
  ACCESSORIES_BY_CATEGORY,
  ACCESSORY_BY_ID,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type AccessoryCategory,
} from '@/lib/avatar-items'
import { EXPERT } from '@/lib/fixtures'
import { useConsoleStore } from '@/store/console-store'

/*
 * Profile-photo avatar customizer — a game-style "dress up your avatar" dialog,
 * kept in the app's dark Mantine idiom rather than a loud game UI. Two panes:
 * a live stage where placed accessories can be dragged, resized, rotated, and
 * restacked, and a category-tabbed tray of stickers to add.
 *
 * The stage's `photoBox` IS the normalized coordinate reference used across the
 * app (see `lib/avatar-items.ts`): accessories are positioned as a fraction of
 * that box, so what you arrange here reads identically at 36px in the header.
 * The box is only ~60% of the stage so tall hats and low necklaces have room to
 * overflow the photo without being clipped by the stage frame.
 */

// Fraction of the (square) stage the circular photo occupies. The rest is
// breathing room for accessories that sit above the crown / below the collar.
const PHOTO_FRAC = 0.6

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

type DragSession = {
  key: string
  startX: number
  startY: number
  pointerX: number
  pointerY: number
  boxW: number
  boxH: number
}

type ResizeSession = {
  key: string
  centerX: number
  centerY: number
  startDist: number
  startScale: number
}

const MIN_SCALE = 0.1
const MAX_SCALE = 1.4

export function AvatarCustomizer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const accessories = useConsoleStore((s) => s.avatarAccessories)
  const addAccessory = useConsoleStore((s) => s.addAccessory)
  const updateAccessory = useConsoleStore((s) => s.updateAccessory)
  const removeAccessory = useConsoleStore((s) => s.removeAccessory)
  const clearAccessories = useConsoleStore((s) => s.clearAccessories)
  const bringAccessoryToFront = useConsoleStore((s) => s.bringAccessoryToFront)

  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<AccessoryCategory>(CATEGORY_ORDER[0])

  const photoBoxRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragSession | null>(null)
  const resizeRef = useRef<ResizeSession | null>(null)

  // Escape to close; lock the page scroll behind the overlay while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const selected = accessories.find((a) => a.key === selectedKey) ?? null

  const handleAdd = (defId: string) => {
    addAccessory(defId)
    // The action mints the key internally; grab the just-added item (the last
    // in the list) so it starts out selected and ready to nudge.
    const list = useConsoleStore.getState().avatarAccessories
    const last = list[list.length - 1]
    if (last) setSelectedKey(last.key)
  }

  const startDrag = (e: ReactPointerEvent<HTMLElement>, key: string, x: number, y: number) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedKey(key)
    const rect = photoBoxRef.current?.getBoundingClientRect()
    if (!rect) return
    dragRef.current = {
      key,
      startX: x,
      startY: y,
      pointerX: e.clientX,
      pointerY: e.clientY,
      boxW: rect.width,
      boxH: rect.height,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onDragMove = (e: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const dx = (e.clientX - drag.pointerX) / drag.boxW
    const dy = (e.clientY - drag.pointerY) / drag.boxH
    updateAccessory(drag.key, {
      x: clamp(drag.startX + dx, -0.3, 1.3),
      y: clamp(drag.startY + dy, -0.3, 1.3),
    })
  }

  const endDrag = (e: ReactPointerEvent<HTMLElement>) => {
    dragRef.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  // Corner resize: scale tracks the pointer's distance from the accessory
  // center, so dragging the handle outward grows it and inward shrinks it —
  // rotation-invariant, so it feels right even on a rotated item.
  const startResize = (
    e: ReactPointerEvent<HTMLElement>,
    key: string,
    x: number,
    y: number,
    scale: number,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedKey(key)
    const rect = photoBoxRef.current?.getBoundingClientRect()
    if (!rect) return
    const centerX = rect.left + x * rect.width
    const centerY = rect.top + y * rect.height
    const startDist = Math.hypot(e.clientX - centerX, e.clientY - centerY) || 1
    resizeRef.current = { key, centerX, centerY, startDist, startScale: scale }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onResizeMove = (e: ReactPointerEvent<HTMLElement>) => {
    const rs = resizeRef.current
    if (!rs) return
    const dist = Math.hypot(e.clientX - rs.centerX, e.clientY - rs.centerY)
    updateAccessory(rs.key, {
      scale: clamp((rs.startScale * dist) / rs.startDist, MIN_SCALE, MAX_SCALE),
    })
  }

  const endResize = (e: ReactPointerEvent<HTMLElement>) => {
    resizeRef.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <div
      className="motion-backdrop-in fixed inset-0 z-[60] flex items-center justify-center px-4 py-8"
      style={{
        background:
          'radial-gradient(1200px 800px at 50% -10%, #241f2c 0%, #14121a 60%, #0b0a0f 100%)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="motion-surface-in relative flex max-h-[calc(100vh-64px)] w-full max-w-[900px] flex-col overflow-hidden rounded-3xl border border-[#3a3642] bg-[#1c1a21]/95 shadow-2xl backdrop-blur">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2630] px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#933adc]/15 text-[#b87fe8]">
              <Sparkle size={20} aria-hidden />
            </span>
            <div>
              <h2 className="text-[18px] font-bold leading-tight text-[#f2f1f5]">
                Customize your photo
              </h2>
              <p className="text-[13px] leading-tight text-[#a7a4ae]">
                Add flair, then drag to place it just right.
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="motion-press flex size-9 items-center justify-center rounded-full text-[#a7a4ae] transition-colors hover:bg-[#2a2630] hover:text-[#e8e6ed]"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        {/* Body */}
        <div className="flex min-h-0 flex-1 flex-col gap-5 p-6 md:flex-row">
          {/* Left: stage + per-item controls */}
          <div className="flex shrink-0 flex-col gap-4 md:w-[360px]">
            <div
              className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#3a3642]"
              style={{
                background:
                  'radial-gradient(360px 360px at 50% 42%, #26222e 0%, #17151d 70%, #131118 100%)',
              }}
              onPointerDown={() => setSelectedKey(null)}
            >
              <div
                ref={photoBoxRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ width: `${PHOTO_FRAC * 100}%`, height: `${PHOTO_FRAC * 100}%` }}
              >
                <img
                  src={EXPERT.photo}
                  alt=""
                  draggable={false}
                  className="absolute inset-0 size-full select-none rounded-full object-cover ring-1 ring-[#3a3642]"
                />
                {accessories.map((a) => {
                  const d = ACCESSORY_BY_ID[a.defId]
                  if (!d) return null
                  const isSel = a.key === selectedKey
                  return (
                    <div
                      key={a.key}
                      onPointerDown={(e) => startDrag(e, a.key, a.x, a.y)}
                      onPointerMove={onDragMove}
                      onPointerUp={endDrag}
                      className="absolute cursor-grab touch-none active:cursor-grabbing"
                      style={{
                        left: `${a.x * 100}%`,
                        top: `${a.y * 100}%`,
                        width: `${a.scale * 100}%`,
                        transform: `translate(-50%, -50%) rotate(${a.rot}deg)`,
                        zIndex: isSel ? 50 : undefined,
                        outline: isSel ? '2px dashed #b87fe8' : undefined,
                        outlineOffset: '3px',
                      }}
                    >
                      <img
                        src={d.src}
                        alt={d.label}
                        draggable={false}
                        className="pointer-events-none block w-full select-none"
                      />
                      {isSel && (
                        <>
                          {/* Delete — top-right corner of the item. */}
                          <button
                            type="button"
                            aria-label={`Remove ${d.label}`}
                            title="Remove"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation()
                              removeAccessory(a.key)
                              setSelectedKey(null)
                            }}
                            className="motion-press absolute -right-2.5 -top-2.5 flex size-5 items-center justify-center rounded-full border border-[#1c1a21] bg-[#ff8787] text-[#1c1a21] shadow-md"
                          >
                            <X size={12} weight="bold" aria-hidden />
                          </button>
                          {/* Resize — drag the bottom-right corner. */}
                          <span
                            role="button"
                            aria-label={`Resize ${d.label}`}
                            title="Drag to resize"
                            onPointerDown={(e) => startResize(e, a.key, a.x, a.y, a.scale)}
                            onPointerMove={onResizeMove}
                            onPointerUp={endResize}
                            className="absolute -bottom-2.5 -right-2.5 flex size-5 cursor-nwse-resize touch-none items-center justify-center rounded-full border border-[#1c1a21] bg-[#b87fe8] text-[#1c1a21] shadow-md"
                          >
                            <ArrowsOut size={12} weight="bold" aria-hidden />
                          </span>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Controls for the selected accessory, or a hint. */}
            {selected ? (
              <div className="motion-enter-inline flex flex-col gap-3 rounded-2xl border border-[#3a3642] bg-[#221f28] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-[#e8e6ed]">
                    {ACCESSORY_BY_ID[selected.defId]?.label ?? 'Item'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Bring to front"
                      title="Bring to front"
                      onClick={() => bringAccessoryToFront(selected.key)}
                      className="motion-press flex size-8 items-center justify-center rounded-lg border border-[#3a3642] text-[#a7a4ae] transition-colors hover:border-[#5a5563] hover:text-[#e8e6ed]"
                    >
                      <ArrowUp size={16} aria-hidden />
                    </button>
                    <button
                      type="button"
                      aria-label="Remove"
                      title="Remove"
                      onClick={() => {
                        removeAccessory(selected.key)
                        setSelectedKey(null)
                      }}
                      className="motion-press flex size-8 items-center justify-center rounded-lg border border-[#3a3642] text-[#ff8787] transition-colors hover:border-[#ff8787]/60 hover:bg-[#ff8787]/10"
                    >
                      <Trash size={16} aria-hidden />
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-3">
                  <ArrowsOut size={16} className="shrink-0 text-[#716e78]" aria-hidden />
                  <input
                    type="range"
                    min={0.1}
                    max={1.4}
                    step={0.01}
                    value={selected.scale}
                    onChange={(e) =>
                      updateAccessory(selected.key, { scale: Number(e.target.value) })
                    }
                    className="h-1 w-full cursor-pointer accent-[#933adc]"
                  />
                </label>

                <label className="flex items-center gap-3">
                  <ArrowClockwise size={16} className="shrink-0 text-[#716e78]" aria-hidden />
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={selected.rot}
                    onChange={(e) => updateAccessory(selected.key, { rot: Number(e.target.value) })}
                    className="h-1 w-full cursor-pointer accent-[#933adc]"
                  />
                </label>
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-[#3a3642] px-4 py-3 text-center text-[13px] leading-relaxed text-[#716e78]">
                {accessories.length
                  ? 'Tap an item on the photo to resize, rotate, or remove it.'
                  : 'Pick something from the right to get started.'}
              </p>
            )}
          </div>

          {/* Right: category tabs + sticker tray */}
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {CATEGORY_ORDER.map((cat) => {
                const isActive = cat === activeCategory
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`motion-press rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                      isActive
                        ? 'bg-[#933adc] text-white'
                        : 'bg-[#2a2630] text-[#a7a4ae] hover:text-[#e8e6ed]'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                )
              })}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-[#2a2630] bg-[#16141b] p-3">
              <div className="grid grid-cols-4 gap-2">
                {(ACCESSORIES_BY_CATEGORY.find((g) => g.category === activeCategory)?.items ?? []).map(
                  (item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAdd(item.id)}
                      title={item.label}
                      aria-label={`Add ${item.label}`}
                      className="motion-press group flex flex-col items-center gap-1 rounded-xl border border-[#2a2630] bg-[#221f28] p-2 transition-colors hover:border-[#5a5563] hover:bg-[#2a2630]"
                    >
                      <span className="flex aspect-square w-full items-center justify-center">
                        <img
                          src={item.src}
                          alt=""
                          draggable={false}
                          className="max-h-full max-w-full select-none object-contain drop-shadow"
                        />
                      </span>
                      <span className="w-full truncate text-center text-[10px] leading-tight text-[#a7a4ae] group-hover:text-[#d7d5db]">
                        {item.label}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#2a2630] px-6 py-4">
          <button
            type="button"
            onClick={() => {
              clearAccessories()
              setSelectedKey(null)
            }}
            disabled={accessories.length === 0}
            className="motion-press rounded-full px-4 py-2 text-[14px] text-[#a7a4ae] transition-colors enabled:hover:text-[#ff8787] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear all
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-[#716e78]">
              {accessories.length} {accessories.length === 1 ? 'item' : 'items'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="motion-press rounded-full bg-[#8223d2] px-6 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#933adc]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
