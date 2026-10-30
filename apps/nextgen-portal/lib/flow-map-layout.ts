import type { FlowNode } from './flow-map-types'

/** Landscape card size for the Flow Map template (desktop placeholder screenshots). */
export const CARD_W = 280
export const CARD_H = 195
export const SCREENSHOT_H = 175

const MOUSE_WHEEL_ZOOM_STEP = 0.3
const TRACKPAD_ZOOM_SCALE = 0.005
const TRACKPAD_ZOOM_MAX_STEP = 0.16

type WheelLike = Pick<WheelEvent, 'deltaY' | 'deltaMode' | 'ctrlKey'>

export function getWheelZoomDelta(e: WheelLike): number {
  const absY = Math.abs(e.deltaY)

  const isMouseWheel =
    e.deltaMode === WheelEvent.DOM_DELTA_LINE ||
    e.deltaMode === WheelEvent.DOM_DELTA_PAGE ||
    (e.deltaMode === WheelEvent.DOM_DELTA_PIXEL && absY >= 48 && !e.ctrlKey)

  if (isMouseWheel) {
    return e.deltaY > 0 ? -MOUSE_WHEEL_ZOOM_STEP : MOUSE_WHEEL_ZOOM_STEP
  }

  const raw = -e.deltaY * TRACKPAD_ZOOM_SCALE
  return Math.max(-TRACKPAD_ZOOM_MAX_STEP, Math.min(TRACKPAD_ZOOM_MAX_STEP, raw))
}

export function getNodeCenter(node: FlowNode) {
  return { x: node.x + CARD_W / 2, y: node.y + CARD_H / 2 }
}

function getAnchorPoint(node: FlowNode, side: string): { x: number; y: number } {
  switch (side) {
    case 'top':
      return { x: node.x + CARD_W / 2, y: node.y }
    case 'bottom':
      return { x: node.x + CARD_W / 2, y: node.y + CARD_H }
    case 'left':
      return { x: node.x, y: node.y + CARD_H / 2 }
    case 'right':
      return { x: node.x + CARD_W, y: node.y + CARD_H / 2 }
    default:
      return { x: node.x + CARD_W / 2, y: node.y + CARD_H / 2 }
  }
}

const GUTTER_PADDING = 50

function buildRoutedPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  fromSide: string,
  toSide: string,
  from: FlowNode,
  to: FlowNode,
  allNodes?: FlowNode[],
): { path: string; midX: number; midY: number } {
  const dx = endX - startX
  const r = 30

  const routeBelowBoth = () => {
    const gutterY = Math.max(from.y + CARD_H, to.y + CARD_H) + GUTTER_PADDING
    // Near-vertical endpoints: nudge the gutter loop so the path isn't a flat line
    const spread = Math.abs(dx) < 10 ? GUTTER_PADDING : 0
    const midX = (startX + endX) / 2
    const dirX = dx > 0 ? 1 : dx < 0 ? -1 : 1
    const path = `M ${startX} ${startY} L ${startX} ${gutterY - r} Q ${startX} ${gutterY}, ${startX + dirX * (r + spread)} ${gutterY} L ${endX - dirX * r} ${gutterY} Q ${endX} ${gutterY}, ${endX} ${gutterY - r} L ${endX} ${endY}`
    return { path, midX: midX + dirX * (spread / 2), midY: gutterY }
  }

  const routeAboveBoth = () => {
    const gutterY = Math.min(from.y, to.y) - GUTTER_PADDING
    const spread = Math.abs(dx) < 10 ? GUTTER_PADDING : 0
    const midX = (startX + endX) / 2
    const dirX = dx > 0 ? 1 : dx < 0 ? -1 : 1
    const path = `M ${startX} ${startY} L ${startX} ${gutterY + r} Q ${startX} ${gutterY}, ${startX + dirX * (r + spread)} ${gutterY} L ${endX - dirX * r} ${gutterY} Q ${endX} ${gutterY}, ${endX} ${gutterY + r} L ${endX} ${endY}`
    return { path, midX: midX + dirX * (spread / 2), midY: gutterY }
  }

  /** Exit/enter on the right: run a gutter to the right of both cards (fixes right→right stacks). */
  const routeRightBoth = () => {
    const gutterX = Math.max(from.x + CARD_W, to.x + CARD_W) + GUTTER_PADDING
    const midY = (startY + endY) / 2
    const dirY = endY >= startY ? 1 : -1
    const path = `M ${startX} ${startY} L ${gutterX - r} ${startY} Q ${gutterX} ${startY}, ${gutterX} ${startY + dirY * r} L ${gutterX} ${endY - dirY * r} Q ${gutterX} ${endY}, ${gutterX - r} ${endY} L ${endX} ${endY}`
    return { path, midX: gutterX, midY }
  }

  /** Exit/enter on the left: run a gutter to the left of both cards. */
  const routeLeftBoth = () => {
    const gutterX = Math.min(from.x, to.x) - GUTTER_PADDING
    const midY = (startY + endY) / 2
    const dirY = endY >= startY ? 1 : -1
    const path = `M ${startX} ${startY} L ${gutterX + r} ${startY} Q ${gutterX} ${startY}, ${gutterX} ${startY + dirY * r} L ${gutterX} ${endY - dirY * r} Q ${gutterX} ${endY}, ${gutterX + r} ${endY} L ${endX} ${endY}`
    return { path, midX: gutterX, midY }
  }

  const hasObstacles = () => {
    if (!allNodes || allNodes.length === 0) return false
    const minX = Math.min(startX, endX) + 5
    const maxX = Math.max(startX, endX) - 5
    const minY = Math.min(startY, endY) - CARD_H / 2
    const maxY = Math.max(startY, endY) + CARD_H / 2
    return allNodes.some((n) => {
      if (n.id === from.id || n.id === to.id) return false
      const nRight = n.x + CARD_W
      const nBottom = n.y + CARD_H
      return n.x < maxX && nRight > minX && n.y < maxY && nBottom > minY
    })
  }

  if (fromSide === 'bottom' && toSide === 'top') {
    if (Math.abs(dx) < 10 && endY > startY) {
      const midY = (startY + endY) / 2
      return {
        path: `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`,
        midX: (startX + endX) / 2,
        midY,
      }
    }
    return routeBelowBoth()
  }

  if (fromSide === 'top' && toSide === 'bottom') {
    if (Math.abs(dx) < 10 && endY < startY) {
      const midY = (startY + endY) / 2
      return {
        path: `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`,
        midX: (startX + endX) / 2,
        midY,
      }
    }
    return routeAboveBoth()
  }

  if (fromSide === 'right' && toSide === 'left') {
    if (hasObstacles() || endX < startX) {
      return routeBelowBoth()
    }
    const midX = (startX + endX) / 2
    const path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
    return { path, midX, midY: (startY + endY) / 2 }
  }

  if (fromSide === 'left' && toSide === 'right') {
    if (hasObstacles() || endX > startX) {
      return routeAboveBoth()
    }
    const midX = (startX + endX) / 2
    const path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
    return { path, midX, midY: (startY + endY) / 2 }
  }

  // Same-side anchors: keep the connector on that outside edge
  if (fromSide === 'right' && toSide === 'right') return routeRightBoth()
  if (fromSide === 'left' && toSide === 'left') return routeLeftBoth()

  // Mixed leftovers
  if (fromSide === 'bottom' || toSide === 'bottom') return routeBelowBoth()
  if (fromSide === 'top' || toSide === 'top') return routeAboveBoth()
  if (fromSide === 'right' || toSide === 'right') return routeRightBoth()
  if (fromSide === 'left' || toSide === 'left') return routeLeftBoth()
  return routeBelowBoth()
}

export function getEdgePath(
  from: FlowNode,
  to: FlowNode,
  fromSide?: string,
  toSide?: string,
  allNodes?: FlowNode[],
) {
  if (fromSide && toSide) {
    const startPt = getAnchorPoint(from, fromSide)
    const endPt = getAnchorPoint(to, toSide)
    const { path, midX, midY } = buildRoutedPath(
      startPt.x,
      startPt.y,
      endPt.x,
      endPt.y,
      fromSide,
      toSide,
      from,
      to,
      allNodes,
    )
    return { path, startX: startPt.x, startY: startPt.y, endX: endPt.x, endY: endPt.y, midX, midY }
  }

  const start = getNodeCenter(from)
  const end = getNodeCenter(to)

  const dx = end.x - start.x
  const dy = end.y - start.y

  const isRowWrap = to.y > from.y + CARD_H / 2 && to.x + CARD_W < from.x
  if (isRowWrap) {
    const startX = from.x + CARD_W / 2
    const startY = from.y + CARD_H
    const endX = to.x + CARD_W / 2
    const endY = to.y
    const gutterY = startY + (endY - startY) * 0.4
    const r = 30
    const path = `M ${startX} ${startY} L ${startX} ${gutterY - r} Q ${startX} ${gutterY}, ${startX - r} ${gutterY} L ${endX + r} ${gutterY} Q ${endX} ${gutterY}, ${endX} ${gutterY + r} L ${endX} ${endY}`
    const midX = (startX + endX) / 2
    const midY = gutterY
    return { path, startX, startY, endX, endY, midX, midY }
  }

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

  const isDiagonal = !isHorizontal && Math.abs(dx) > Math.abs(dy) * 0.8

  if (isHorizontal) {
    const midX = (startX + endX) / 2
    path = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
  } else if (isDiagonal) {
    const midY = (startY + endY) / 2
    path = `M ${startX} ${startY} C ${startX} ${midY + (endY - startY) * 0.3}, ${endX} ${midY - (endY - startY) * 0.3}, ${endX} ${endY}`
  } else {
    const midY = (startY + endY) / 2
    path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`
  }

  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2

  return { path, startX, startY, endX, endY, midX, midY }
}


/** Increment between node `x` / `y` positions (left/top edges). */
export const DESKTOP_NODE_STEP_X = 460
export const DESKTOP_NODE_STEP_Y = 395
export const MOBILE_NODE_STEP_X = 400
export const MOBILE_NODE_STEP_Y = 480
