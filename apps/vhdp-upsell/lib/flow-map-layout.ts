import type { FlowNode } from './flow-map-types'

export const CARD_W = 140
export const CARD_H = 320
export const SCREENSHOT_H = 300

/**
 * Increment between node `x` / `y` positions (left/top edges).
 * Step = card size + label gap so edge text (“Send message”, etc.) is not clipped.
 */
export const DESKTOP_NODE_STEP_X = 460
export const DESKTOP_NODE_STEP_Y = 395
export const MOBILE_NODE_STEP_X = 400
export const MOBILE_NODE_STEP_Y = 480

/** Mouse wheel notch — unchanged from original Flow Map behavior. */
const MOUSE_WHEEL_ZOOM_STEP = 0.3

/** Trackpad: scale pixel deltaY into a gentle zoom step (pinch + two-finger scroll). */
const TRACKPAD_ZOOM_SCALE = 0.005
const TRACKPAD_ZOOM_MAX_STEP = 0.16

type WheelLike = Pick<WheelEvent, 'deltaY' | 'deltaMode' | 'ctrlKey'>

export function getWheelZoomDelta(e: WheelLike): number {
  const absY = Math.abs(e.deltaY)

  // Line/page mode, or chunky pixel steps = physical mouse wheel.
  const isMouseWheel =
    e.deltaMode === WheelEvent.DOM_DELTA_LINE ||
    e.deltaMode === WheelEvent.DOM_DELTA_PAGE ||
    (e.deltaMode === WheelEvent.DOM_DELTA_PIXEL && absY >= 48 && !e.ctrlKey)

  if (isMouseWheel) {
    return e.deltaY > 0 ? -MOUSE_WHEEL_ZOOM_STEP : MOUSE_WHEEL_ZOOM_STEP
  }

  // Trackpad pinch (ctrlKey) or fine pixel scroll — proportional, capped per event.
  const raw = -e.deltaY * TRACKPAD_ZOOM_SCALE
  return Math.max(-TRACKPAD_ZOOM_MAX_STEP, Math.min(TRACKPAD_ZOOM_MAX_STEP, raw))
}

export function getNodeCenter(node: FlowNode) {
  return { x: node.x + CARD_W / 2, y: node.y + CARD_H / 2 }
}

export function getEdgePath(from: FlowNode, to: FlowNode) {
  const start = getNodeCenter(from)
  const end = getNodeCenter(to)

  const dx = end.x - start.x
  const dy = end.y - start.y

  let startX: number, startY: number, endX: number, endY: number

  const isHorizontal = Math.abs(dx) > Math.abs(dy) * 3

  if (isHorizontal) {
    startX = dx > 0 ? from.x + CARD_W : from.x
    startY = start.y
    endX = dx > 0 ? to.x : to.x + CARD_W
    endY = end.y
  } else {
    startX = start.x
    startY = dy > 0 ? from.y + CARD_H : from.y
    endX = end.x
    endY = dy > 0 ? to.y : to.y + CARD_H
  }

  let path: string

  if (isHorizontal) {
    const midX = (startX + endX) / 2
    path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
  } else {
    const midY = (startY + endY) / 2
    path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`
  }

  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2

  return { path, startX, startY, endX, endY, midX, midY }
}
