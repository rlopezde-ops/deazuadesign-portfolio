'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { FlowMapConfig, FlowNode } from '@/lib/flow-map-types'
import {
  CARD_H,
  CARD_W,
  SCREENSHOT_H,
  getEdgePath,
  getWheelZoomDelta,
} from '@/lib/flow-map-layout'
import { PromptExamplePanel } from '@/components/prompt-example-panel'

const TITLE_BAR_H = 56

type FlowMapCanvasProps = FlowMapConfig

function navigateToRoute(route: string, router: ReturnType<typeof useRouter>) {
  if (/^https?:\/\//i.test(route)) {
    window.open(route, '_blank', 'noopener,noreferrer')
    return
  }
  router.push(route)
}

export function FlowMapCanvas({
  title,
  subtitle,
  canvas,
  defaultZoom = 0.7,
  nodes,
  edges,
  groupColors,
}: FlowMapCanvasProps) {
  const router = useRouter()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(defaultZoom)
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [transitionMs, setTransitionMs] = useState(0)
  const [transitionEasing, setTransitionEasing] = useState(
    'cubic-bezier(0.25, 0.1, 0.25, 1)',
  )
  const [skipZoomTransition, setSkipZoomTransition] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('flow-skip-transitions') === 'true'
    }
    return false
  })
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [promptsOpen, setPromptsOpen] = useState(false)

  const chromeHeight = TITLE_BAR_H

  const canvasW = canvas.width
  const canvasH = canvas.height

  const focusGroup = useCallback(
    (groupKey: string) => {
      const groupNodes = nodes.filter((n) => n.group === groupKey)
      if (groupNodes.length === 0) return

      const minX = Math.min(...groupNodes.map((n) => n.x))
      const maxX = Math.max(...groupNodes.map((n) => n.x + CARD_W))
      const minY = Math.min(...groupNodes.map((n) => n.y))
      const maxY = Math.max(...groupNodes.map((n) => n.y + CARD_H))

      const centerX = (minX + maxX) / 2
      const centerY = (minY + maxY) / 2

      const viewportW = window.innerWidth
      const viewportH = window.innerHeight - chromeHeight

      const groupW = maxX - minX + 120
      const groupH = maxY - minY + 120
      const targetZoom = Math.min(
        1.2,
        Math.min(viewportW / groupW, viewportH / groupH),
      )

      setTransitionMs(500)
      setZoom(targetZoom)
      setPan({
        x: viewportW / 2 - centerX * targetZoom,
        y: viewportH / 2 - centerY * targetZoom,
      })
      setTimeout(() => setTransitionMs(0), 500)
    },
    [nodes, chromeHeight],
  )

  const zoomRef = useRef(zoom)
  const panRef = useRef(pan)
  zoomRef.current = zoom
  panRef.current = pan

  const chromeHeightRef = useRef(chromeHeight)
  chromeHeightRef.current = chromeHeight

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = getWheelZoomDelta(e.nativeEvent)

    setTransitionMs(150)
    if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current)
    wheelTimerRef.current = setTimeout(() => setTransitionMs(0), 200)

    const prevZoom = zoomRef.current
    const prevPan = panRef.current
    const newZoom = Math.max(0.1, Math.min(5, prevZoom + delta))

    const mouseX = e.clientX
    const mouseY = e.clientY - chromeHeightRef.current

    const canvasX = (mouseX - prevPan.x) / prevZoom
    const canvasY = (mouseY - prevPan.y) / prevZoom

    setZoom(newZoom)
    setPan({
      x: mouseX - canvasX * newZoom,
      y: mouseY - canvasY * newZoom,
    })
  }, [])

  const didDragRef = useRef(false)
  const mouseDownPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    didDragRef.current = false
    mouseDownPos.current = { x: e.clientX, y: e.clientY }
    setDragging(true)
    setDragStart({
      x: e.clientX - panRef.current.x,
      y: e.clientY - panRef.current.y,
    })
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return
      const dx = e.clientX - mouseDownPos.current.x
      const dy = e.clientY - mouseDownPos.current.y
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        didDragRef.current = true
      }
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    },
    [dragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setDragging(false)
  }, [])

  const resetView = useCallback(() => {
    setTransitionMs(400)
    const resetZoom = defaultZoom
    const viewportW = window.innerWidth
    const viewportH = window.innerHeight - chromeHeight
    setZoom(resetZoom)
    setPan({
      x: (viewportW - canvasW * resetZoom) / 2,
      y: (viewportH - canvasH * resetZoom) / 2,
    })
    setTimeout(() => setTransitionMs(0), 400)
  }, [canvasH, canvasW, chromeHeight, defaultZoom])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '0') resetView()
      if (e.key === '+' || e.key === '=')
        setZoom((z) => Math.min(5, z + 0.1))
      if (e.key === '-') setZoom((z) => Math.max(0.1, z - 0.1))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [resetView])

  useEffect(() => {
    const viewportW = window.innerWidth
    const viewportH = window.innerHeight - chromeHeight
    setPan({
      x: (viewportW - canvasW * defaultZoom) / 2,
      y: (viewportH - canvasH * defaultZoom) / 2,
    })
    setZoom(defaultZoom)
  }, [canvasH, canvasW, chromeHeight, defaultZoom])

  const handleNodeClick = useCallback(
    (node: FlowNode) => {
      if (!node.route) return

      if (skipZoomTransition) {
        navigateToRoute(node.route, router)
        return
      }

      const targetZoom = 5
      const viewportW = window.innerWidth
      const viewportH = window.innerHeight - chromeHeight
      const nodeCenterX = node.x + CARD_W / 2
      const nodeCenterY = node.y + SCREENSHOT_H / 2
      setTransitionEasing('cubic-bezier(0.4, 0, 1, 1)')
      setTransitionMs(200)
      setZoom(targetZoom)
      setPan({
        x: viewportW / 2 - nodeCenterX * targetZoom,
        y: viewportH / 2 - nodeCenterY * targetZoom,
      })
      setTimeout(() => {
        setTransitionEasing('cubic-bezier(0.25, 0.1, 0.25, 1)')
        navigateToRoute(node.route!, router)
      }, 180)
    },
    [router, skipZoomTransition, chromeHeight],
  )

  return (
    <div
      className="flow-page"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#1a1a2e',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: TITLE_BAR_H,
          zIndex: 100,
          background: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {title}
          </span>
          <button
            type="button"
            onClick={() => setPromptsOpen((v) => !v)}
            style={{
              padding: '5px 12px',
              borderRadius: 999,
              border: promptsOpen
                ? '1px solid rgba(129, 140, 248, 0.8)'
                : '1px solid rgba(255,255,255,0.2)',
              background: promptsOpen
                ? 'rgba(99, 102, 241, 0.25)'
                : 'rgba(255,255,255,0.08)',
              color: promptsOpen ? '#fff' : 'rgba(255,255,255,0.75)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Playwright
          </button>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            {subtitle ??
              `${nodes.length} screens • ${edges.length} connections`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => {
              setTransitionMs(200)
              const viewCenterX = window.innerWidth / 2
              const viewCenterY = (window.innerHeight - chromeHeight) / 2
              const newZoom = Math.max(0.1, zoom - 0.1)
              const canvasX = (viewCenterX - pan.x) / zoom
              const canvasY = (viewCenterY - pan.y) / zoom
              setZoom(newZoom)
              setPan({
                x: viewCenterX - canvasX * newZoom,
                y: viewCenterY - canvasY * newZoom,
              })
              setTimeout(() => setTransitionMs(0), 200)
            }}
            style={zoomBtnStyle}
          >
            −
          </button>
          <span
            style={{
              color: '#fff',
              fontSize: 13,
              minWidth: 40,
              textAlign: 'center',
            }}
          >
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => {
              setTransitionMs(200)
              const viewCenterX = window.innerWidth / 2
              const viewCenterY = (window.innerHeight - chromeHeight) / 2
              const newZoom = Math.min(5, zoom + 0.1)
              const canvasX = (viewCenterX - pan.x) / zoom
              const canvasY = (viewCenterY - pan.y) / zoom
              setZoom(newZoom)
              setPan({
                x: viewCenterX - canvasX * newZoom,
                y: viewCenterY - canvasY * newZoom,
              })
              setTimeout(() => setTransitionMs(0), 200)
            }}
            style={zoomBtnStyle}
          >
            +
          </button>
          <button
            type="button"
            onClick={resetView}
            style={{ ...zoomBtnStyle, width: 'auto', padding: '4px 12px' }}
          >
            Reset
          </button>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                const next = !skipZoomTransition
                setSkipZoomTransition(next)
                localStorage.setItem('flow-skip-transitions', String(next))
              }
            }}
            onClick={() => {
              const next = !skipZoomTransition
              setSkipZoomTransition(next)
              localStorage.setItem('flow-skip-transitions', String(next))
            }}
            style={{
              marginLeft: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '4px 12px',
              borderRadius: 20,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              transition: 'all 0.2s',
            }}
          >
            <div
              style={{
                width: 28,
                height: 16,
                borderRadius: 8,
                background: skipZoomTransition
                  ? 'rgba(255,255,255,0.2)'
                  : '#50c878',
                position: 'relative',
                transition: 'background 0.2s',
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 2,
                  left: skipZoomTransition ? 2 : 14,
                  transition: 'left 0.2s',
                }}
              />
            </div>
            <span
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Screen transitions
            </span>
          </div>
        </div>
      </div>

      <PromptExamplePanel
        open={promptsOpen}
        onClose={() => setPromptsOpen(false)}
        anchorTop={TITLE_BAR_H}
      />

      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          background: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: '16px 20px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {Object.entries(groupColors).map(([key, val]) => (
          <div
            key={key}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') focusGroup(key)
            }}
            onClick={() => focusGroup(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 6,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.background =
                'rgba(255,255,255,0.08)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                background: val.bg,
                border: `2px solid ${val.border}`,
              }}
            />
            <span style={{ color: '#fff', fontSize: 12 }}>{val.label}</span>
          </div>
        ))}
        <div
          style={{
            marginTop: 8,
            color: 'rgba(255,255,255,0.4)',
            fontSize: 11,
          }}
        >
          Click group to focus • Scroll to zoom • Drag to pan • `0` to reset
        </div>
      </div>

      <div
        className="flow-canvas-inner"
        style={{
          position: 'fixed',
          top: chromeHeight,
          left: 0,
          width: '100%',
          height: `calc(100vh - ${chromeHeight}px)`,
          overflow: 'hidden',
          cursor: dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragStart={(e) => e.preventDefault()}
        ref={canvasRef}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            width: canvasW,
            height: canvasH,
            position: 'relative',
            transition:
              transitionMs > 0
                ? `transform ${transitionMs}ms ${transitionEasing}`
                : 'none',
          }}
        >
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: canvasW,
              height: canvasH,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <defs>
              <marker
                id="arrow"
                markerWidth="5"
                markerHeight="4"
                refX="4.5"
                refY="2"
                orient="auto-start-reverse"
              >
                <polygon points="0 0, 5 2, 0 4" fill="rgba(255,255,255,0.5)" />
              </marker>
            </defs>
            {edges.map((edge, i) => {
              const fromNode = nodes.find((n) => n.id === edge.from)
              const toNode = nodes.find((n) => n.id === edge.to)
              if (!fromNode || !toNode) return null
              const { path, midX, midY } = getEdgePath(fromNode, toNode)
              return (
                <g key={i}>
                  <path
                    d={path}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={1.5}
                    fill="none"
                    markerEnd="url(#arrow)"
                  />
                  {edge.label ? (
                    <>
                      <rect
                        x={midX - edge.label.length * 3.5 - 6}
                        y={midY - 18}
                        width={edge.label.length * 7 + 12}
                        height={18}
                        rx={4}
                        fill="rgba(26, 26, 46, 0.85)"
                      />
                      <text
                        x={midX}
                        y={midY - 6}
                        fill="rgba(255,255,255,0.75)"
                        fontSize={11}
                        textAnchor="middle"
                        fontFamily="system-ui, sans-serif"
                      >
                        {edge.label}
                      </text>
                    </>
                  ) : null}
                </g>
              )
            })}
          </svg>

          {nodes.map((node) => {
            const colors = groupColors[node.group] ?? {
              bg: '#f4f4f5',
              border: '#d4d4d8',
              label: node.group,
            }
            const isHovered = hoveredNode === node.id
            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  if (didDragRef.current) return
                  handleNodeClick(node)
                }}
                style={{
                  position: 'absolute',
                  left: node.x,
                  top: node.y,
                  width: CARD_W,
                  height: CARD_H,
                  cursor: node.route ? 'pointer' : 'default',
                  transition: 'transform 0.15s',
                  transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                  zIndex: isHovered ? 10 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: SCREENSHOT_H,
                    overflow: 'hidden',
                    position: 'relative',
                    background: '#fff',
                    border: `2px solid ${isHovered ? '#fff' : colors.border}`,
                    borderRadius: 4,
                    boxShadow: isHovered
                      ? '0 8px 32px rgba(0,0,0,0.4)'
                      : '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <Image
                    src={node.screenshot}
                    alt={node.label}
                    fill
                    draggable={false}
                    style={{
                      objectFit: 'contain',
                      background: '#fff',
                      pointerEvents: 'none',
                    }}
                    sizes="140px"
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.8)',
                    fontFamily: 'system-ui, sans-serif',
                    paddingLeft: 2,
                  }}
                >
                  {node.label}
                </span>
                {node.hint && isHovered ? (
                  <span
                    style={{
                      fontSize: 10,
                      color: 'rgba(255,255,255,0.45)',
                      fontFamily: 'monospace',
                      paddingLeft: 2,
                      marginTop: -4,
                    }}
                  >
                    {node.hint}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const zoomBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: 16,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
