'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { FlowMapConfig, FlowNode, FlowSection, Note, NoteItem, NoteReply } from '@/lib/flow-map-types'
import {
  CARD_H,
  CARD_W,
  SCREENSHOT_H,
  getEdgePath,
  getWheelZoomDelta,
} from '@/lib/flow-map-layout'
import { DevSettingsMenu, openFlowMapDevMenu } from '@/components/dev-settings-menu'
import { PromptExamplePanel } from '@/components/prompt-example-panel'
import { ThemePicker } from '@/components/theme-picker'
import { useIsMobile } from '@/lib/use-is-mobile'
import { showTemplateTools } from '@/lib/show-template-tools'
import {
  DEFAULT_THEME_BG,
  FLOW_THEME_DB_KEY,
  FLOW_THEME_SCREEN_ID,
  buildThemeCssVars,
  loadStoredThemeBg,
  normalizeHex,
  parseHex,
  saveThemeBgLocal,
} from '@/lib/flow-map-theme'

const TITLE_BAR_H = 56
const TITLE_BAR_H_MOBILE = 52
/** Dedicated view-position key for the header Home button. Updated by Save Position. */
const HOME_POSITION_KEY = '__home__'

type FlowMapCanvasProps = FlowMapConfig & {
  sections?: FlowSection[]
  notes?: Note[]
  noteMode?: boolean
  currentAuthor?: string
  currentAuthorEmail?: string
  newNoteId?: string | null
  onNewNoteHandled?: () => void
  onNoteToggle?: () => void
  onCanvasClickForNote?: (x: number, y: number) => void
  onUpdateNote?: (note: Note) => void
  onPositionUpdateNote?: (note: Note) => void
  onDeleteNote?: (id: string) => void
  onRequireAuthor?: () => void
}

function navigateToRoute(route: string, router: ReturnType<typeof useRouter>) {
  if (/^https?:\/\//i.test(route)) {
    window.open(route, '_blank', 'noopener,noreferrer')
    return
  }
  router.push(route)
}

/** Screenshot with shimmer placeholder until the image paints — kills the
 *  blank white flash while PNGs stream in on cold load. */
function ScreenCardImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
  }, [src])

  return (
    <div
      style={{
        width: CARD_W,
        height: SCREENSHOT_H,
        minHeight: SCREENSHOT_H,
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
        background: '#fff',
        border: 'none',
        borderRadius: 4,
        boxShadow: 'none',
      }}
    >
      {!loaded && <div className="fm-screenshot-shimmer" aria-hidden />}
      <Image
        src={src}
        alt={alt}
        width={788}
        height={1700}
        draggable={false}
        onLoad={() => setLoaded(true)}
        onLoadingComplete={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.28s ease',
        }}
        sizes="140px"
      />
    </div>
  )
}

export function FlowMapCanvas({
  title,
  subtitle,
  canvas,
  defaultZoom = 0.7,
  nodes,
  edges,
  groupColors,
  figmaUrl: configFigmaUrl,
  sections = [],
  notes = [],
  noteMode = false,
  currentAuthor = '',
  currentAuthorEmail = '',
  newNoteId,
  onNewNoteHandled,
  onNoteToggle,
  onCanvasClickForNote,
  onUpdateNote,
  onPositionUpdateNote,
  onDeleteNote,
  onRequireAuthor,
}: FlowMapCanvasProps) {
  const router = useRouter()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(defaultZoom)
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [forcedOpenNoteId, setForcedOpenNoteId] = useState<string | null>(null)
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const titleBarH = isMobile ? TITLE_BAR_H_MOBILE : TITLE_BAR_H

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false)
      setMobileSidebarOpen(false)
    }
  }, [isMobile])

  useEffect(() => {
    const onDevOpen = () => setMobileMenuOpen(false)
    window.addEventListener('flow-map-dev-panel-open', onDevOpen)
    return () => window.removeEventListener('flow-map-dev-panel-open', onDevOpen)
  }, [])

  useEffect(() => {
    if (newNoteId) {
      setForcedOpenNoteId(newNoteId)
      onNewNoteHandled?.()
    }
  }, [newNoteId, onNewNoteHandled])
  const [selectedFlowIdx, setSelectedFlowIdx] = useState(0)
  const [lastSaveKey, setLastSaveKey] = useState<string>('')
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
  const [themeBg, setThemeBg] = useState(DEFAULT_THEME_BG)
  const themeVars = buildThemeCssVars(themeBg)
  const themeSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setThemeBg(loadStoredThemeBg())
  }, [])

  const persistThemeBg = useCallback((color: string, immediate = false) => {
    const next = normalizeHex(color)
    setThemeBg(next)
    saveThemeBgLocal(next)
    if (themeSaveTimerRef.current) clearTimeout(themeSaveTimerRef.current)
    const write = () => {
      fetch('/api/screen-texts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screen_id: FLOW_THEME_SCREEN_ID,
          text_key: FLOW_THEME_DB_KEY,
          content: next,
        }),
      }).catch(() => {})
    }
    if (immediate) write()
    else themeSaveTimerRef.current = setTimeout(write, 350)
  }, [])

  useEffect(() => {
    return () => {
      if (themeSaveTimerRef.current) clearTimeout(themeSaveTimerRef.current)
    }
  }, [])
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [savedPositions, setSavedPositions] = useState<Record<string, { pan_x: number; pan_y: number; zoom: number }>>({})
  const [saveFlash, setSaveFlash] = useState(false)
  const [saveHintOpen, setSaveHintOpen] = useState(false)
  const [saveHintVisible, setSaveHintVisible] = useState(false)
  const saveClusterRef = useRef<HTMLDivElement>(null)
  const hasSavedPositionRef = useRef(false)
  // Hide the transform layer until session/DB/default camera is resolved once —
  // otherwise pan jumps: (0,0) → centered default → saved Home.
  const [viewLayoutReady, setViewLayoutReady] = useState(false)
  const [sectionTitles, setSectionTitles] = useState<Record<string, string>>({})
  const [groupLabels, setGroupLabels] = useState<Record<string, string>>({})
  const [mapTitle, setMapTitle] = useState(title)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const [customEdges, setCustomEdges] = useState<{ from: string; to: string; label?: string; fromSide?: string; toSide?: string }[]>([])
  const [draggingFrom, setDraggingFrom] = useState<{ nodeId: string; side: string; startX: number; startY: number } | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const [dragHoverNodeId, setDragHoverNodeId] = useState<string | null>(null)
  const [dragSnapSide, setDragSnapSide] = useState<string | null>(null)
  const [editingEdgeIdx, setEditingEdgeIdx] = useState<number | null>(null)
  const [edgeLabelTemp, setEdgeLabelTemp] = useState('')
  const [editingNodeLabelId, setEditingNodeLabelId] = useState<string | null>(null)
  const [nodeLabelTemp, setNodeLabelTemp] = useState('')
  const [nodeLabels, setNodeLabels] = useState<Record<string, string>>({})
  const [figmaUrls, setFigmaUrls] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    if (configFigmaUrl) initial.main = configFigmaUrl
    for (const section of sections) {
      if (section.figmaUrl) initial[section.id] = section.figmaUrl
    }
    return initial
  })
  const [databaseConfigured, setDatabaseConfigured] = useState(false)
  const [emailConfigured, setEmailConfigured] = useState(false)
  const [isDevEnv, setIsDevEnv] = useState(false)
  const [integrationsLoaded, setIntegrationsLoaded] = useState(false)
  const [notesHintOpen, setNotesHintOpen] = useState(false)
  const [notesHintVisible, setNotesHintVisible] = useState(false)
  const [notesHintMessage, setNotesHintMessage] = useState<string | null>(null)
  const notesClusterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!notesHintOpen) return
    const frame = requestAnimationFrame(() => setNotesHintVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [notesHintOpen])

  useEffect(() => {
    if (!saveHintOpen) return
    const frame = requestAnimationFrame(() => setSaveHintVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [saveHintOpen])

  useEffect(() => {
    if (!notesHintOpen) return
    const onDown = (e: MouseEvent) => {
      if (notesClusterRef.current && !notesClusterRef.current.contains(e.target as Node)) {
        setNotesHintOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotesHintOpen(false)
    }
    // Defer so the opening click doesn't immediately dismiss
    const timer = window.setTimeout(() => {
      document.addEventListener('mousedown', onDown)
    }, 0)
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [notesHintOpen])

  useEffect(() => {
    if (!saveHintOpen) return
    const onDown = (e: MouseEvent) => {
      if (saveClusterRef.current && !saveClusterRef.current.contains(e.target as Node)) {
        setSaveHintOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSaveHintOpen(false)
    }
    const timer = window.setTimeout(() => {
      document.addEventListener('mousedown', onDown)
    }, 0)
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [saveHintOpen])

  useEffect(() => {
    fetch('/api/integrations-status')
      .then((r) => r.json())
      .then((data) => {
        setDatabaseConfigured(Boolean(data.databaseConfigured))
        setEmailConfigured(Boolean(data.emailConfigured))
        setIsDevEnv(Boolean(data.isDev))
      })
      .catch(() => {})
      .finally(() => setIntegrationsLoaded(true))
  }, [])

  useEffect(() => {
    fetch('/api/screen-texts?screen=flow-map-meta')
      .then(r => r.json())
      .then(data => {
        if (data.texts?.title) setMapTitle(data.texts.title)
        const themeFromDb = data.texts?.[FLOW_THEME_DB_KEY]
        if (typeof themeFromDb === 'string' && parseHex(themeFromDb)) {
          const next = normalizeHex(themeFromDb)
          setThemeBg(next)
          saveThemeBgLocal(next)
        }
      })
      .catch(() => {})
    fetch('/api/screen-texts?screen=flow-section-title')
      .then(r => r.json())
      .then(data => {
        if (data.texts) setSectionTitles(data.texts)
      })
      .catch(() => {})
    fetch('/api/screen-texts?screen=flow-custom-edges')
      .then(r => r.json())
      .then(data => {
        if (data.texts?.edges) {
          try { setCustomEdges(JSON.parse(data.texts.edges)) } catch {}
        }
      })
      .catch(() => {})
    fetch('/api/screen-texts?screen=flow-node-labels')
      .then(r => r.json())
      .then(data => {
        if (data.texts) setNodeLabels(data.texts)
      })
      .catch(() => {})
    fetch('/api/screen-texts?screen=flow-group-labels')
      .then(r => r.json())
      .then(data => {
        if (data.texts) setGroupLabels(data.texts)
      })
      .catch(() => {})
    fetch('/api/screen-texts?screen=flow-figma-urls')
      .then(r => r.json())
      .then(data => {
        if (data.texts && typeof data.texts === 'object') {
          setFigmaUrls((prev) => ({ ...prev, ...data.texts }))
        }
      })
      .catch(() => {})
  }, [])

  const saveFigmaUrl = useCallback((key: string, url: string) => {
    setFigmaUrls((prev) => {
      const next = { ...prev }
      if (url.trim()) next[key] = url.trim()
      else delete next[key]
      return next
    })
    fetch('/api/screen-texts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ screen_id: 'flow-figma-urls', text_key: key, content: url.trim() }),
    }).catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false

    const applyDefaultCenter = () => {
      // Use props/titleBarH directly — this effect mounts before the
      // chromeHeight/canvasW aliases below are declared.
      const viewportW = window.innerWidth
      const viewportH = window.innerHeight - titleBarH
      const cW = canvas.width
      const cH = canvas.height
      const firstSectionH = sections.length > 1 ? sections[1].y : cH
      setPan({
        x: (viewportW - cW * defaultZoom) / 2,
        y: (viewportH - firstSectionH * defaultZoom) / 2,
      })
      setZoom(defaultZoom)
    }

    const restoreSessionPosition = () => {
      const stored = sessionStorage.getItem('flow-map-position')
      if (!stored) return false
      try {
        const parsed = JSON.parse(stored)
        hasSavedPositionRef.current = true
        setPan(parsed.pan)
        setZoom(parsed.zoom)
        if (typeof parsed.selectedFlowIdx === 'number') {
          setSelectedFlowIdx(parsed.selectedFlowIdx)
        }
        sessionStorage.removeItem('flow-map-position')
        if (!cancelled) setViewLayoutReady(true)
        return true
      } catch {
        return false
      }
    }

    restoreSessionPosition()

    const onHistoryRestore = () => {
      restoreSessionPosition()
    }
    window.addEventListener('popstate', onHistoryRestore)
    window.addEventListener('pageshow', onHistoryRestore)

    fetch('/api/view-position')
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: { section_id: string; pan_x: number; pan_y: number; zoom: number }[]) => {
        if (cancelled) return
        const map: Record<string, { pan_x: number; pan_y: number; zoom: number }> = {}
        rows.forEach((r) => {
          map[r.section_id] = { pan_x: r.pan_x, pan_y: r.pan_y, zoom: r.zoom }
        })
        setSavedPositions(map)
        if (!hasSavedPositionRef.current) {
          const home = map[HOME_POSITION_KEY]
          const firstSection = sections[0]?.id
          const restore = home || (firstSection ? map[firstSection] : null)
          if (restore) {
            setPan({ x: restore.pan_x, y: restore.pan_y })
            setZoom(restore.zoom)
          } else {
            applyDefaultCenter()
          }
          hasSavedPositionRef.current = true
        }
      })
      .catch(() => {
        if (cancelled) return
        if (!hasSavedPositionRef.current) {
          applyDefaultCenter()
          hasSavedPositionRef.current = true
        }
      })
      .finally(() => {
        if (!cancelled) setViewLayoutReady(true)
      })

    return () => {
      cancelled = true
      window.removeEventListener('popstate', onHistoryRestore)
      window.removeEventListener('pageshow', onHistoryRestore)
    }
    // Resolve camera once on mount. sections/canvas sizes come from static
    // config and are stable for the template; re-running on chromeHeight
    // (mobile detect) is what used to re-center and cause a second jump.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chromeHeight = titleBarH
  const [promptsOpen, setPromptsOpen] = useState(false)

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

  const scrollToSection = useCallback(
    (section: FlowSection) => {
      const viewportW = window.innerWidth
      const viewportH = window.innerHeight - chromeHeight
      const targetZoom = defaultZoom

      setTransitionMs(500)
      setZoom(targetZoom)
      setPan({
        x: (viewportW - canvasW * targetZoom) / 2,
        y: -section.y * targetZoom + 40,
      })
      setTimeout(() => setTransitionMs(0), 500)
    },
    [chromeHeight, defaultZoom, canvasW],
  )

  const navigateToPoint = useCallback(
    (x: number, y: number) => {
      const viewportW = window.innerWidth
      const viewportH = window.innerHeight - chromeHeight
      const targetZoom = 1.2

      setTransitionMs(500)
      setZoom(targetZoom)
      setPan({
        x: viewportW / 2 - x * targetZoom,
        y: viewportH / 2 - y * targetZoom,
      })
      setTimeout(() => setTransitionMs(0), 500)
    },
    [chromeHeight],
  )

  const zoomRef = useRef(zoom)
  const panRef = useRef(pan)
  zoomRef.current = zoom
  panRef.current = pan

  const chromeHeightRef = useRef(chromeHeight)
  chromeHeightRef.current = chromeHeight

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = getWheelZoomDelta(e)

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

  // Attach wheel as a non-passive native listener so preventDefault() can block
  // the browser's own pinch-to-zoom (Mac trackpad fires ctrl+wheel). React's
  // onWheel is passive by default, which silently ignores preventDefault().
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const didDragRef = useRef(false)
  const droppingConnectionRef = useRef(false)
  const mouseDownPos = useRef({ x: 0, y: 0 })
  const lastTouchAtRef = useRef(0)

  // Touch: one-finger pan + two-finger pinch zoom (mobile / tablet). Desktop mouse path unchanged.
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return

    let mode: 'none' | 'pan' | 'pinch' = 'none'
    let panOrigin = { x: 0, y: 0 }
    let panStart = { x: 0, y: 0 }
    let pinchStartDist = 0
    let pinchStartZoom = 1
    let pinchCanvasPoint = { x: 0, y: 0 }

    const touchDist = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX
      const dy = touches[0].clientY - touches[1].clientY
      return Math.hypot(dx, dy) || 1
    }
    const touchMid = (touches: TouchList) => ({
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2 - chromeHeightRef.current,
    })

    const onTouchStart = (e: TouchEvent) => {
      lastTouchAtRef.current = Date.now()
      if (draggingFrom) return
      if (e.touches.length === 1) {
        mode = 'pan'
        didDragRef.current = false
        panStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        panOrigin = { ...panRef.current }
        mouseDownPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        setDragging(true)
      } else if (e.touches.length >= 2) {
        mode = 'pinch'
        setDragging(false)
        pinchStartDist = touchDist(e.touches)
        pinchStartZoom = zoomRef.current
        const mid = touchMid(e.touches)
        pinchCanvasPoint = {
          x: (mid.x - panRef.current.x) / zoomRef.current,
          y: (mid.y - panRef.current.y) / zoomRef.current,
        }
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      lastTouchAtRef.current = Date.now()
      if (mode === 'none') return
      e.preventDefault()

      if (mode === 'pinch' && e.touches.length >= 2) {
        const scale = touchDist(e.touches) / pinchStartDist
        const newZoom = Math.max(0.1, Math.min(5, pinchStartZoom * scale))
        const mid = touchMid(e.touches)
        setZoom(newZoom)
        setPan({
          x: mid.x - pinchCanvasPoint.x * newZoom,
          y: mid.y - pinchCanvasPoint.y * newZoom,
        })
        return
      }

      if (mode === 'pan' && e.touches.length === 1) {
        const dx = e.touches[0].clientX - panStart.x
        const dy = e.touches[0].clientY - panStart.y
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDragRef.current = true
        setPan({ x: panOrigin.x + dx, y: panOrigin.y + dy })
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      lastTouchAtRef.current = Date.now()
      if (e.touches.length === 0) {
        const wasTap = mode === 'pan' && !didDragRef.current
        mode = 'none'
        setDragging(false)
        if (wasTap && noteMode && databaseConfigured && onCanvasClickForNote) {
          const t = e.changedTouches[0]
          if (!t) return
          const rect = el.getBoundingClientRect()
          const mouseX = t.clientX - rect.left
          const mouseY = t.clientY - rect.top
          const canvasX = (mouseX - panRef.current.x) / zoomRef.current
          const canvasY = (mouseY - panRef.current.y) / zoomRef.current
          onCanvasClickForNote(canvasX, canvasY)
        }
        return
      }
      if (e.touches.length === 1) {
        mode = 'pan'
        panStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        panOrigin = { ...panRef.current }
        setDragging(true)
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [draggingFrom, noteMode, databaseConfigured, onCanvasClickForNote])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (Date.now() - lastTouchAtRef.current < 500) return
    if (draggingFrom) return
    e.preventDefault()
    didDragRef.current = false
    mouseDownPos.current = { x: e.clientX, y: e.clientY }
    setDragging(true)
    setDragStart({
      x: e.clientX - panRef.current.x,
      y: e.clientY - panRef.current.y,
    })
  }, [draggingFrom])

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

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    setDragging(false)
    if (noteMode && databaseConfigured && !didDragRef.current && onCanvasClickForNote) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const canvasX = (mouseX - panRef.current.x) / zoomRef.current
      const canvasY = (mouseY - panRef.current.y) / zoomRef.current
      onCanvasClickForNote(canvasX, canvasY)
    }
  }, [noteMode, onCanvasClickForNote, databaseConfigured])

  const goHome = useCallback(() => {
    setTransitionMs(400)
    const home = savedPositions[HOME_POSITION_KEY]
    if (home) {
      setZoom(home.zoom)
      setPan({ x: home.pan_x, y: home.pan_y })
    } else {
      // Fallback: centered default view (same as old Reset) when no home is saved yet
      const resetZoom = defaultZoom
      const viewportW = window.innerWidth
      const viewportH = window.innerHeight - chromeHeight
      const firstSectionH = sections.length > 1 ? sections[1].y : canvasH
      setZoom(resetZoom)
      setPan({
        x: (viewportW - canvasW * resetZoom) / 2,
        y: (viewportH - firstSectionH * resetZoom) / 2,
      })
    }
    setTimeout(() => setTransitionMs(0), 400)
  }, [canvasH, canvasW, chromeHeight, defaultZoom, savedPositions, sections])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '0') goHome()
      if (e.key === '+' || e.key === '=')
        setZoom((z) => Math.min(5, z + 0.1))
      if (e.key === '-') setZoom((z) => Math.max(0.1, z - 0.1))
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goHome])

  const saveCustomEdges = useCallback((newEdges: { from: string; to: string; label?: string; fromSide?: string; toSide?: string }[]) => {
    setCustomEdges(newEdges)
    fetch('/api/screen-texts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ screen_id: 'flow-custom-edges', text_key: 'edges', content: JSON.stringify(newEdges) }),
    }).catch(() => {})
  }, [])

  const allEdges = customEdges.length > 0
    ? customEdges
    : edges.map((e) => ({ from: e.from, to: e.to, label: e.label, fromSide: e.fromSide, toSide: e.toSide }))

  const getAnchorPos = useCallback((nodeId: string, side: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return { x: 0, y: 0 }
    switch (side) {
      case 'top': return { x: node.x + CARD_W / 2, y: node.y }
      case 'bottom': return { x: node.x + CARD_W / 2, y: node.y + CARD_H }
      case 'left': return { x: node.x, y: node.y + CARD_H / 2 }
      case 'right': return { x: node.x + CARD_W, y: node.y + CARD_H / 2 }
      default: return { x: node.x + CARD_W / 2, y: node.y + CARD_H / 2 }
    }
  }, [nodes])

  const handleAnchorMouseDown = useCallback((e: React.MouseEvent, nodeId: string, side: string) => {
    e.stopPropagation()
    e.preventDefault()
    const pos = getAnchorPos(nodeId, side)
    setDraggingFrom({ nodeId, side, startX: pos.x, startY: pos.y })
    setDragPos(pos)
  }, [getAnchorPos])

  useEffect(() => {
    if (!draggingFrom) return
    const DOT_SNAP_RADIUS = 18
    const getAnchorPosForNode = (node: { x: number; y: number }, side: string) => {
      switch (side) {
        case 'top': return { x: node.x + CARD_W / 2, y: node.y }
        case 'bottom': return { x: node.x + CARD_W / 2, y: node.y + CARD_H }
        case 'left': return { x: node.x, y: node.y + CARD_H / 2 }
        case 'right': return { x: node.x + CARD_W, y: node.y + CARD_H / 2 }
        default: return { x: node.x + CARD_W / 2, y: node.y + CARD_H / 2 }
      }
    }
    const handleMove = (e: MouseEvent) => {
      const canvasEl = canvasRef.current
      if (!canvasEl) return
      const rect = canvasEl.getBoundingClientRect()
      const x = (e.clientX - rect.left - pan.x) / zoom
      const y = (e.clientY - rect.top - pan.y) / zoom
      setDragPos({ x, y })
      // Detect which node the cursor is hovering over (excluding source)
      const hoverNode = nodes.find(n =>
        n.id !== draggingFrom.nodeId &&
        x >= n.x - DOT_SNAP_RADIUS && x <= n.x + CARD_W + DOT_SNAP_RADIUS &&
        y >= n.y - DOT_SNAP_RADIUS && y <= n.y + CARD_H + DOT_SNAP_RADIUS
      )
      if (hoverNode) {
        setDragHoverNodeId(hoverNode.id)
        // Check if cursor is near a specific anchor dot
        let closestSide: string | null = null
        let closestDist = DOT_SNAP_RADIUS
        for (const side of ['top', 'right', 'bottom', 'left']) {
          const anchor = getAnchorPosForNode(hoverNode, side)
          const dist = Math.hypot(x - anchor.x, y - anchor.y)
          if (dist < closestDist) {
            closestDist = dist
            closestSide = side
          }
        }
        setDragSnapSide(closestSide)
      } else {
        setDragHoverNodeId(null)
        setDragSnapSide(null)
      }
    }
    const handleUp = (e: MouseEvent) => {
      const canvasEl = canvasRef.current
      if (!canvasEl) { setDraggingFrom(null); setDragPos(null); setDragHoverNodeId(null); setDragSnapSide(null); return }
      const rect = canvasEl.getBoundingClientRect()
      const x = (e.clientX - rect.left - pan.x) / zoom
      const y = (e.clientY - rect.top - pan.y) / zoom
      // Find target node (with generous hit area)
      const targetNode = nodes.find(n =>
        n.id !== draggingFrom.nodeId &&
        x >= n.x - DOT_SNAP_RADIUS && x <= n.x + CARD_W + DOT_SNAP_RADIUS &&
        y >= n.y - DOT_SNAP_RADIUS && y <= n.y + CARD_H + DOT_SNAP_RADIUS
      )
      if (targetNode) {
        // Determine which anchor dot was closest on the target
        let targetSide = 'top'
        let closestDist = Infinity
        for (const side of ['top', 'right', 'bottom', 'left']) {
          const anchor = getAnchorPosForNode(targetNode, side)
          const dist = Math.hypot(x - anchor.x, y - anchor.y)
          if (dist < closestDist) {
            closestDist = dist
            targetSide = side
          }
        }
        const baseEdges = customEdges.length > 0
          ? customEdges
          : edges.map((e) => ({ from: e.from, to: e.to, label: e.label, fromSide: e.fromSide, toSide: e.toSide }))
        const alreadyExists = baseEdges.some(e => e.from === draggingFrom.nodeId && e.to === targetNode.id)
        if (!alreadyExists) {
          const newEdge = { from: draggingFrom.nodeId, to: targetNode.id, label: '', fromSide: draggingFrom.side, toSide: targetSide }
          const updatedEdges = [...baseEdges, newEdge]
          saveCustomEdges(updatedEdges)
          // Auto-open label editor for newly created edge
          setTimeout(() => {
            setEditingEdgeIdx(updatedEdges.length - 1)
            setEdgeLabelTemp('')
          }, 50)
        }
        droppingConnectionRef.current = true
        setTimeout(() => { droppingConnectionRef.current = false }, 100)
      }
      setDraggingFrom(null)
      setDragPos(null)
      setDragHoverNodeId(null)
      setDragSnapSide(null)
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [draggingFrom, pan, zoom, nodes, customEdges, edges, saveCustomEdges])

  const handleNodeClick = useCallback(
    (node: FlowNode) => {
      if (!node.route) return

      sessionStorage.setItem('flow-map-position', JSON.stringify({ pan: panRef.current, zoom: zoomRef.current, selectedFlowIdx }))

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
    [router, skipZoomTransition, chromeHeight, selectedFlowIdx],
  )

  return (
    <div
      className="flow-page"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--fm-bg)',
        position: 'relative',
        color: 'var(--fm-text)',
        ...themeVars,
      }}
    >
      <style>{`
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes noteConfirmIn {
          from { opacity: 0; transform: translateY(5px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fm-screenshot-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .fm-screenshot-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            #ececec 0%,
            #ececec 40%,
            #f5f5f5 50%,
            #ececec 60%,
            #ececec 100%
          );
          background-size: 200% 100%;
          animation: fm-screenshot-shimmer 1.4s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: titleBarH,
          zIndex: 100,
          background: 'var(--fm-surface)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--fm-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 12px' : '0 24px',
          paddingTop: isMobile ? 'env(safe-area-inset-top, 0px)' : undefined,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, minWidth: 0, flex: 1 }}>
          {isMobile && (
            <button
              type="button"
              aria-label="Open flows"
              onClick={() => {
                setMobileSidebarOpen(true)
                setMobileMenuOpen(false)
              }}
              style={{
                ...zoomBtnStyle,
                width: 36,
                height: 36,
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="16" y2="12" /><line x1="4" y1="17" x2="12" y2="17" />
              </svg>
            </button>
          )}
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <EditableMapTitle
              initialTitle={mapTitle}
              onTitleSaved={(t) => setMapTitle(t)}
            />
          </div>
          {!isMobile && showTemplateTools() && (
            <button
              type="button"
              onClick={() => setPromptsOpen((v) => !v)}
              title="Copy a Playwright prompt to recreate this flow map in your own project"
              style={{
                padding: '5px 12px',
                borderRadius: 999,
                border: promptsOpen
                  ? '1px solid rgba(129, 140, 248, 0.8)'
                  : '1px solid var(--fm-control-border)',
                background: promptsOpen
                  ? 'rgba(99, 102, 241, 0.25)'
                  : 'var(--fm-control-bg)',
                color: promptsOpen ? 'var(--fm-text)' : 'var(--fm-text-soft)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              Playwright
            </button>
          )}
          {!isMobile && (
            <span style={{ color: 'var(--fm-text-muted)', fontSize: 13 }}>
              {subtitle ??
                `${nodes.length} screens • ${edges.length} connections`}
            </span>
          )}
          {!isMobile && <DevSettingsMenu />}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, flexShrink: 0 }}>
          {isMobile ? (
            <>
              {databaseConfigured && (
                <NotificationBell authorName={currentAuthor} onNavigateTo={(x, y, noteId) => {
                  navigateToPoint(x, y)
                  if (noteId) setForcedOpenNoteId(noteId)
                }} />
              )}
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => {
                  setMobileMenuOpen((v) => !v)
                  setMobileSidebarOpen(false)
                }}
                style={{ ...zoomBtnStyle, width: 36, height: 36 }}
              >
                {mobileMenuOpen ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
                  </svg>
                )}
              </button>
            </>
          ) : (
          <>
          <ThemePicker color={themeBg} onChange={persistThemeBg} align="left" />
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
              color: 'var(--fm-text)',
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
            onClick={goHome}
            title={
              savedPositions[HOME_POSITION_KEY]
                ? 'Go to saved Home position'
                : 'Go to default Home view (Save Position to set it)'
            }
            style={{ ...zoomBtnStyle, width: 'auto', padding: '4px 10px', fontSize: 11 }}
          >
            Home
          </button>
          <div ref={saveClusterRef} style={{ position: 'relative' }}>
            {(saveHintOpen || saveHintVisible) && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: 320,
                  background: 'var(--fm-surface)',
                  backdropFilter: 'blur(8px)',
                  border: '1.5px solid rgba(251,191,36,0.5)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 12,
                  color: 'var(--fm-text-soft)',
                  lineHeight: 1.45,
                  textAlign: 'left',
                  zIndex: 120,
                  opacity: saveHintOpen && saveHintVisible ? 1 : 0,
                  transform:
                    saveHintOpen && saveHintVisible
                      ? 'translateY(0) scale(1)'
                      : 'translateY(-6px) scale(0.96)',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  pointerEvents: saveHintOpen && saveHintVisible ? 'auto' : 'none',
                  transformOrigin: 'top right',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                }}
                onTransitionEnd={(e) => {
                  if (e.propertyName === 'opacity' && !saveHintOpen) {
                    setSaveHintVisible(false)
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                  <div style={{ color: 'var(--fm-text)', fontWeight: 700 }}>Save Position needs a database</div>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setSaveHintOpen(false)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--fm-text-muted)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      lineHeight: 1,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <div style={{ marginBottom: 8, color: 'var(--fm-text-soft)' }}>
                  Remembers pan + zoom per flow and sets the Home button position so the map reopens where the team left it.
                </div>
                <div style={{ color: 'var(--fm-text-muted)', marginBottom: 8 }}>
                  Optional — browsing still works without it. Connect Neon to persist positions across reloads.
                </div>
                {isDevEnv ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSaveHintOpen(false)
                      openFlowMapDevMenu('neon')
                    }}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      padding: 0,
                      color: '#fbbf24',
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      textDecoration: 'underline',
                      textUnderlineOffset: 3,
                      fontFamily: 'system-ui, sans-serif',
                      lineHeight: 1.45,
                    }}
                  >
                    Open Dev settings → set up Neon
                  </button>
                ) : (
                  <div style={{ color: '#fbbf24', fontWeight: 500 }}>
                    Ask whoever hosts this preview to connect Neon — then Save Position works for everyone.
                  </div>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={async () => {
                if (!integrationsLoaded) return
                if (!databaseConfigured) {
                  setSaveHintOpen((v) => !v)
                  return
                }
                setSaveHintOpen(false)
                const saveKey = lastSaveKey || sections[selectedFlowIdx]?.id
                if (!saveKey) return
                const payload = { pan_x: pan.x, pan_y: pan.y, zoom }
                try {
                  const [sectionRes, homeRes] = await Promise.all([
                    fetch('/api/view-position', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ section_id: saveKey, ...payload }),
                    }),
                    fetch('/api/view-position', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ section_id: HOME_POSITION_KEY, ...payload }),
                    }),
                  ])
                  if (!sectionRes.ok || !homeRes.ok) {
                    const failed = !sectionRes.ok ? sectionRes : homeRes
                    const data = await failed.json().catch(() => ({}))
                    console.error('Save Position failed:', data.error || failed.status)
                    if (failed.status === 503) {
                      setSaveHintOpen(true)
                    }
                    return
                  }
                  setSavedPositions((prev) => ({
                    ...prev,
                    [saveKey]: payload,
                    [HOME_POSITION_KEY]: payload,
                  }))
                  setSaveFlash(true)
                  setTimeout(() => setSaveFlash(false), 1200)
                } catch (err) {
                  console.error(err)
                  setSaveHintOpen(true)
                }
              }}
              title={
                databaseConfigured
                  ? 'Save current pan + zoom (this section + Home)'
                  : 'Needs database setup to persist view position'
              }
              style={{
                ...zoomBtnStyle,
                width: 'auto',
                padding: '4px 10px',
                fontSize: 11,
                background: saveFlash
                  ? 'rgba(80,200,120,0.3)'
                  : !databaseConfigured
                    ? 'rgba(251,191,36,0.12)'
                    : 'var(--fm-control-bg)',
                borderColor: saveFlash
                  ? 'rgba(80,200,120,0.6)'
                  : !databaseConfigured
                    ? 'rgba(251,191,36,0.45)'
                    : 'rgba(255,255,255,0.2)',
                color: !databaseConfigured && !saveFlash ? '#fbbf24' : '#fff',
                transition: 'all 0.3s',
              }}
            >
              {saveFlash ? '✓ Saved' : 'Save Position'}
            </button>
          </div>
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
              background: 'var(--fm-hover)',
              border: '1px solid var(--fm-border)',
              transition: 'all 0.2s',
            }}
          >
            <div
              style={{
                width: 28,
                height: 16,
                borderRadius: 8,
                background: skipZoomTransition
                  ? 'var(--fm-control-border)'
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
                color: 'var(--fm-text-muted)',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Screen transitions
            </span>
          </div>
          {databaseConfigured && (
            <NotificationBell authorName={currentAuthor} onNavigateTo={(x, y, noteId) => {
              navigateToPoint(x, y)
              if (noteId) setForcedOpenNoteId(noteId)
            }} />
          )}
          </>
          )}
        </div>
      </div>

      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 110,
            background: 'rgba(10,10,20,0.55)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(340px, 92vw)',
              background: 'var(--fm-surface)',
              borderLeft: '1px solid var(--fm-border)',
              padding: `${titleBarH + 12}px 14px calc(16px + env(safe-area-inset-bottom, 0px))`,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              boxShadow: '-8px 0 32px rgba(0,0,0,0.45)',
              overflowX: 'hidden',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <div style={{ color: 'var(--fm-text)', fontSize: 15, fontWeight: 700 }}>Menu</div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                style={{ ...zoomBtnStyle, width: 36, height: 36 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div style={{ color: 'var(--fm-text-muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              View
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                  setPan({ x: viewCenterX - canvasX * newZoom, y: viewCenterY - canvasY * newZoom })
                  setTimeout(() => setTransitionMs(0), 200)
                }}
                style={{ ...zoomBtnStyle, flex: 1, width: 'auto', height: 40 }}
              >
                −
              </button>
              <span style={{ color: 'var(--fm-text)', fontSize: 14, minWidth: 52, textAlign: 'center', fontWeight: 600 }}>
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
                  setPan({ x: viewCenterX - canvasX * newZoom, y: viewCenterY - canvasY * newZoom })
                  setTimeout(() => setTransitionMs(0), 200)
                }}
                style={{ ...zoomBtnStyle, flex: 1, width: 'auto', height: 40 }}
              >
                +
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ThemePicker color={themeBg} onChange={persistThemeBg} align="left" />
            </div>
            <button
              type="button"
              onClick={() => { goHome(); setMobileMenuOpen(false) }}
              style={{ ...zoomBtnStyle, width: '100%', height: 40, fontSize: 13 }}
            >
              Home
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!integrationsLoaded) return
                if (!databaseConfigured) {
                  setSaveHintOpen(true)
                  setMobileMenuOpen(false)
                  return
                }
                const saveKey = lastSaveKey || sections[selectedFlowIdx]?.id
                if (!saveKey) return
                const payload = { pan_x: pan.x, pan_y: pan.y, zoom }
                try {
                  const [sectionRes, homeRes] = await Promise.all([
                    fetch('/api/view-position', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ section_id: saveKey, ...payload }),
                    }),
                    fetch('/api/view-position', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ section_id: HOME_POSITION_KEY, ...payload }),
                    }),
                  ])
                  if (!sectionRes.ok || !homeRes.ok) {
                    setSaveHintOpen(true)
                    setMobileMenuOpen(false)
                    return
                  }
                  setSavedPositions((prev) => ({
                    ...prev,
                    [saveKey]: payload,
                    [HOME_POSITION_KEY]: payload,
                  }))
                  setSaveFlash(true)
                  setTimeout(() => setSaveFlash(false), 1200)
                  setMobileMenuOpen(false)
                } catch {
                  setSaveHintOpen(true)
                  setMobileMenuOpen(false)
                }
              }}
              style={{
                ...zoomBtnStyle,
                width: '100%',
                height: 40,
                fontSize: 13,
                background: saveFlash ? 'rgba(80,200,120,0.3)' : !databaseConfigured ? 'rgba(251,191,36,0.12)' : 'var(--fm-control-bg)',
                borderColor: saveFlash ? 'rgba(80,200,120,0.6)' : !databaseConfigured ? 'rgba(251,191,36,0.45)' : 'var(--fm-control-border)',
                color: !databaseConfigured && !saveFlash ? '#fbbf24' : '#fff',
              }}
            >
              {saveFlash ? '✓ Saved' : 'Save Position'}
            </button>
            <button
              type="button"
              onClick={() => {
                const next = !skipZoomTransition
                setSkipZoomTransition(next)
                localStorage.setItem('flow-skip-transitions', String(next))
              }}
              style={{
                ...zoomBtnStyle,
                width: '100%',
                height: 40,
                fontSize: 13,
                justifyContent: 'space-between',
                padding: '0 14px',
                background: skipZoomTransition ? 'var(--fm-hover)' : 'rgba(80,200,120,0.15)',
              }}
            >
              <span>Screen transitions</span>
              <span style={{ color: skipZoomTransition ? 'var(--fm-text-muted)' : '#50c878', fontWeight: 700 }}>
                {skipZoomTransition ? 'Off' : 'On'}
              </span>
            </button>
            <div style={{ height: 1, background: 'var(--fm-control-bg)', margin: '4px 0' }} />
            <div style={{ color: 'var(--fm-text-muted)', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Tools
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileSidebarOpen(true)
                setMobileMenuOpen(false)
              }}
              style={{ ...zoomBtnStyle, width: '100%', height: 40, fontSize: 13 }}
            >
              Flows & sections
            </button>
            {showTemplateTools() && (
              <button
                type="button"
                onClick={() => {
                  setPromptsOpen(true)
                  setMobileMenuOpen(false)
                }}
                style={{ ...zoomBtnStyle, width: '100%', height: 40, fontSize: 13 }}
              >
                Playwright
              </button>
            )}
            {showTemplateTools() && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  openFlowMapDevMenu()
                }}
                style={{
                  ...zoomBtnStyle,
                  width: '100%',
                  height: 44,
                  fontSize: 13,
                  justifyContent: 'space-between',
                  padding: '0 14px',
                  border: '1px solid rgba(251,191,36,0.45)',
                  background: 'rgba(251,191,36,0.1)',
                  color: '#fbbf24',
                }}
              >
                <span>Dev integrations</span>
                <span style={{ fontSize: 11, opacity: 0.8 }}>Open →</span>
              </button>
            )}
            <div style={{ color: 'var(--fm-text-faint)', fontSize: 11, lineHeight: 1.4, marginTop: 4 }}>
              Pinch to zoom · Drag with one finger to pan
            </div>
          </div>
        </div>
      )}

      {isMobile && showTemplateTools() && (
        <DevSettingsMenu hideTrigger />
      )}

      {showTemplateTools() && (
        <PromptExamplePanel
          open={promptsOpen}
          onClose={() => setPromptsOpen(false)}
          anchorTop={titleBarH}
        />
      )}

      {/* Add a Note — always visible; prompt DB setup when Neon isn't connected */}
      {onNoteToggle && (
        <div
          ref={notesClusterRef}
          style={{
            position: 'fixed',
            bottom: isMobile ? 'calc(16px + env(safe-area-inset-bottom, 0px))' : 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            width: isMobile ? 'min(340px, calc(100vw - 24px))' : undefined,
          }}
        >
          {(notesHintOpen || notesHintVisible) && (
            <div
              style={{
                background: 'var(--fm-surface)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(251,191,36,0.5)',
                borderRadius: 12,
                padding: '12px 14px',
                fontSize: 12,
                color: 'var(--fm-text-soft)',
                maxWidth: 340,
                lineHeight: 1.45,
                textAlign: 'left',
                opacity: notesHintOpen && notesHintVisible ? 1 : 0,
                transform:
                  notesHintOpen && notesHintVisible
                    ? 'translateY(0) scale(1)'
                    : 'translateY(8px) scale(0.96)',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
                pointerEvents: notesHintOpen && notesHintVisible ? 'auto' : 'none',
                transformOrigin: 'bottom center',
              }}
              onTransitionEnd={(e) => {
                if (e.propertyName === 'opacity' && !notesHintOpen) {
                  setNotesHintVisible(false)
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                <div style={{ color: 'var(--fm-text)', fontWeight: 700 }}>Team notes on the flow</div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setNotesHintOpen(false)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--fm-text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    lineHeight: 1,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div style={{ marginBottom: 8, color: 'var(--fm-text-soft)' }}>
                Drop sticky comments on any screen — feedback, open questions, and @mentions your teammates can reply to. Handy for async design reviews.
              </div>
              <div style={{ color: 'var(--fm-text-muted)', marginBottom: 8 }}>
                Optional — browsing the map works fine without this. A free Neon DB just makes notes persist for the whole team.
              </div>
              {isDevEnv ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setNotesHintOpen(false)
                    openFlowMapDevMenu('neon')
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    color: '#fbbf24',
                    fontWeight: 600,
                    fontSize: 12,
                    cursor: 'pointer',
                    textAlign: 'left',
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                    fontFamily: 'system-ui, sans-serif',
                    lineHeight: 1.45,
                  }}
                >
                  Open Dev settings → set up Neon
                </button>
              ) : (
                <div style={{ color: '#fbbf24', fontWeight: 500 }}>{notesHintMessage}</div>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              if (!integrationsLoaded) return
              if (!databaseConfigured) {
                if (notesHintOpen) {
                  setNotesHintOpen(false)
                  return
                }
                if (!isDevEnv) {
                  setNotesHintMessage(
                    'Ask whoever hosts this preview to connect Neon — then notes unlock for everyone.',
                  )
                } else {
                  setNotesHintMessage(null)
                }
                setNotesHintOpen(true)
                return
              }
              setNotesHintOpen(false)
              onNoteToggle()
            }}
            title={
              databaseConfigured
                ? noteMode
                  ? 'Click anywhere to place note'
                  : 'Add a Note'
                : 'Optional: sticky team notes — needs database setup'
            }
            style={{
              padding: '10px 24px',
              borderRadius: 24,
              border: !databaseConfigured
                ? '1.5px solid rgba(251,191,36,0.45)'
                : noteMode
                  ? '1.5px solid #fbbf24'
                  : '1.5px solid var(--fm-control-border)',
              background: !databaseConfigured
                ? 'rgba(251,191,36,0.12)'
                : noteMode
                  ? 'rgba(251,191,36,0.2)'
                  : 'var(--fm-surface)',
              backdropFilter: 'blur(8px)',
              color: !databaseConfigured || noteMode ? '#fbbf24' : 'var(--fm-text-soft)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
              boxShadow:
                noteMode && databaseConfigured
                  ? '0 4px 20px rgba(251,191,36,0.3)'
                  : '0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 0L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            {!databaseConfigured
              ? 'Notes (optional)'
              : noteMode
                ? 'Click anywhere to place note'
                : 'Add a Note'}
          </button>
        </div>
      )}

      {/* Email subscribe — hide in prod when Brevo isn't configured; in dev show setup hint */}
      {currentAuthorEmail && integrationsLoaded && (emailConfigured || isDevEnv) && (
        <EmailSubscribeToggle email={currentAuthorEmail} />
      )}

      {/* Unified Left Panel — Flows + Legend (drawer on mobile) */}
      {isMobile && mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 115,
            background: 'rgba(10,10,20,0.5)',
          }}
        />
      )}
      <div
        key={isMobile ? 'flow-sidebar-mobile' : 'flow-sidebar-desktop'}
        style={{
          position: 'fixed',
          top: isMobile ? 0 : chromeHeight + 20,
          left: isMobile ? (mobileSidebarOpen ? 0 : -320) : 20,
          right: 'auto',
          bottom: isMobile ? 0 : 'auto',
          height: isMobile ? 'auto' : `calc(100vh - ${chromeHeight + 40}px)`,
          maxHeight: isMobile ? 'none' : `calc(100vh - ${chromeHeight + 40}px)`,
          background: 'var(--fm-surface)',
          backdropFilter: 'blur(8px)',
          border: isMobile ? 'none' : '1px solid var(--fm-border)',
          borderRight: '1px solid var(--fm-border)',
          borderRadius: isMobile ? 0 : 12,
          padding: isMobile
            ? `${titleBarH + 12}px 16px calc(16px + env(safe-area-inset-bottom, 0px))`
            : '14px 16px',
          zIndex: isMobile ? 120 : 100,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          width: isMobile ? 'min(300px, 86vw)' : 200,
          boxSizing: 'border-box',
          overflow: 'hidden',
          transition: isMobile ? 'left 0.22s ease' : 'none',
          boxShadow: isMobile && mobileSidebarOpen ? '8px 0 28px rgba(0,0,0,0.4)' : 'none',
          pointerEvents: isMobile && !mobileSidebarOpen ? 'none' : 'auto',
          transform: 'none',
        }}
      >
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ color: 'var(--fm-text)', fontSize: 14, fontWeight: 700 }}>Flows</span>
            <button
              type="button"
              aria-label="Close flows"
              onClick={() => setMobileSidebarOpen(false)}
              style={{ ...zoomBtnStyle, width: 32, height: 32 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        {/* Flows section */}
        {!isMobile && (
        <span style={{ color: 'var(--fm-text-muted)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          Flows
        </span>
        )}
        {sections.map((section, idx) => (
          <button
            key={section.id}
            onClick={() => {
              setSelectedFlowIdx(idx)
              setLastSaveKey(section.id)
              const saved = savedPositions[section.id]
              if (saved) {
                setTransitionMs(500)
                setPan({ x: saved.pan_x, y: saved.pan_y })
                setZoom(saved.zoom)
                setTimeout(() => setTransitionMs(0), 500)
              } else {
                scrollToSection(section)
              }
              if (isMobile) setMobileSidebarOpen(false)
            }}
            style={{
              background: selectedFlowIdx === idx ? 'rgba(251,191,36,0.1)' : 'transparent',
              border: 'none',
              color: 'var(--fm-text)',
              fontSize: isMobile ? 14 : 12,
              fontWeight: selectedFlowIdx === idx ? 600 : 500,
              cursor: 'pointer',
              padding: isMobile ? '10px 10px' : '6px 10px',
              borderRadius: 6,
              textAlign: 'left',
              transition: 'background 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => { if (selectedFlowIdx !== idx) (e.currentTarget as HTMLElement).style.background = 'var(--fm-hover)' }}
            onMouseLeave={(e) => { if (selectedFlowIdx !== idx) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <span style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: selectedFlowIdx === idx ? 'rgba(251,191,36,0.2)' : 'var(--fm-hover)',
              border: `1.5px solid ${selectedFlowIdx === idx ? '#fbbf24' : 'var(--fm-border)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 700,
              color: selectedFlowIdx === idx ? '#fbbf24' : 'var(--fm-text-muted)',
              flexShrink: 0,
            }}>
              {idx + 1}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              {(sectionTitles[section.id] || section.title).replace(/^Archetype \d+ — /, '')}
            </span>
            <span
              data-flow-status={section.upToDate ? 'up-to-date' : 'not-updated'}
              title={section.upToDate ? 'Up to date' : 'Not updated yet'}
              aria-label={section.upToDate ? 'Up to date' : 'Not updated yet'}
              style={{
                flexShrink: 0,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: section.upToDate ? '#34d399' : 'var(--fm-text-faint)',
                boxShadow: section.upToDate
                  ? '0 0 0 3px rgba(52,211,153,0.18)'
                  : '0 0 0 3px var(--fm-hover)',
              }}
            />
          </button>
        ))}

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--fm-control-bg)', margin: '12px 0' }} />

        {/* Legend — dynamic per selected flow */}
        <span style={{ color: 'var(--fm-text-muted)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
          Sections
        </span>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          {Object.entries(groupColors)
            .filter(([key]) => {
              const activeSection = sections[selectedFlowIdx]
              if (!activeSection?.groups || activeSection.groups.length === 0) return true
              return activeSection.groups.includes(key)
            })
            .map(([key, val]) => (
            <div
              key={key}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') focusGroup(key)
              }}
              onClick={() => {
                const sectionId = sections[selectedFlowIdx]?.id
                const saveKey = sectionId ? `${sectionId}:${key}` : key
                setLastSaveKey(saveKey)
                const saved = savedPositions[saveKey]
                if (saved) {
                  setTransitionMs(500)
                  setPan({ x: saved.pan_x, y: saved.pan_y })
                  setZoom(saved.zoom)
                  setTimeout(() => setTransitionMs(0), 500)
                } else {
                  focusGroup(key)
                }
                if (isMobile) setMobileSidebarOpen(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                padding: isMobile ? '8px 6px' : '5px 6px',
                borderRadius: 6,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = 'var(--fm-hover)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: val.bg,
                  border: `2px solid ${val.border}`,
                  flexShrink: 0,
                }}
              />
              <EditableGroupLabel
                groupKey={key}
                initialLabel={groupLabels[key] || val.label}
                onLabelSaved={(k, label) => setGroupLabels((prev) => ({ ...prev, [k]: label }))}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 10, flexShrink: 0 }}>
          {!isMobile ? (
          <div
            style={{
              color: 'var(--fm-text-faint)',
              fontSize: 10,
              marginBottom: 8,
            }}
          >
            Scroll to zoom • Drag to pan • '0' for Home
          </div>
          ) : (
          <div
            style={{
              color: 'var(--fm-text-faint)',
              fontSize: 11,
              marginBottom: 8,
              lineHeight: 1.4,
            }}
          >
            Pinch to zoom • Drag to pan
          </div>
          )}
          <FigmaSourceLink
            storageKey="main"
            initialUrl={figmaUrls.main || configFigmaUrl || ''}
            variant="sidebar"
            onSave={saveFigmaUrl}
          />
        </div>
      </div>

      {/* Canvas */}
      <div
        className="flow-canvas-inner"
        style={{
          position: 'fixed',
          top: chromeHeight,
          left: 0,
          width: '100%',
          height: `calc(100vh - ${chromeHeight}px)`,
          overflow: 'hidden',
          cursor: noteMode ? 'crosshair' : dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragStart={(e) => e.preventDefault()}
        ref={canvasRef}
        data-flow-viewport=""
      >
        {!viewLayoutReady && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <div
              className="fm-screenshot-shimmer"
              style={{
                position: 'relative',
                width: 120,
                height: 8,
                borderRadius: 999,
                opacity: 0.7,
                background: 'linear-gradient(90deg, var(--fm-control-bg) 0%, var(--fm-control-bg) 40%, var(--fm-border) 50%, var(--fm-control-bg) 60%, var(--fm-control-bg) 100%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        )}
        <div
          className="flow-canvas-inner"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            width: canvasW,
            height: canvasH,
            position: 'relative',
            opacity: viewLayoutReady ? 1 : 0,
            transition:
              transitionMs > 0
                ? `transform ${transitionMs}ms ${transitionEasing}`
                : viewLayoutReady
                  ? 'opacity 0.2s ease'
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
              overflow: 'visible',
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
                <polygon points="0 0, 5 2, 0 4" fill="var(--fm-text-muted)" />
              </marker>
            </defs>
            {allEdges.map((edge, i) => {
              const fromNode = nodes.find((n) => n.id === edge.from)
              const toNode = nodes.find((n) => n.id === edge.to)
              if (!fromNode || !toNode) return null
              const { path } = getEdgePath(fromNode, toNode, edge.fromSide, edge.toSide, nodes)
              return (
                <path
                  key={i}
                  d={path}
                  stroke={'var(--fm-text-faint)'}
                  strokeWidth={1.5}
                  fill="none"
                  markerEnd="url(#arrow)"
                />
              )
            })}
            {draggingFrom && dragPos && (() => {
              const sx = draggingFrom.startX
              const sy = draggingFrom.startY
              // Snap endpoint to target dot if hovering near one
              let ex = dragPos.x
              let ey = dragPos.y
              if (dragHoverNodeId && dragSnapSide) {
                const anchor = getAnchorPos(dragHoverNodeId, dragSnapSide)
                if (anchor.x !== 0 || anchor.y !== 0) {
                  ex = anchor.x
                  ey = anchor.y
                }
              }
              const dx = ex - sx
              const dy = ey - sy
              const offset = Math.max(40, Math.min(120, Math.hypot(dx, dy) * 0.4))
              // Use directional control points based on anchor sides
              let cp1x = sx, cp1y = sy, cp2x = ex, cp2y = ey
              const fromSide = draggingFrom.side
              if (fromSide === 'top') { cp1y = sy - offset }
              else if (fromSide === 'bottom') { cp1y = sy + offset }
              else if (fromSide === 'left') { cp1x = sx - offset }
              else if (fromSide === 'right') { cp1x = sx + offset }
              if (dragSnapSide === 'top') { cp2y = ey - offset }
              else if (dragSnapSide === 'bottom') { cp2y = ey + offset }
              else if (dragSnapSide === 'left') { cp2x = ex - offset }
              else if (dragSnapSide === 'right') { cp2x = ex + offset }
              else { cp2x = ex - dx * 0.3; cp2y = ey }
              const curvePath = `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`
              return (
                <path
                  d={curvePath}
                  stroke={dragSnapSide ? '#22c55e' : '#fbbf24'}
                  strokeWidth={2}
                  strokeDasharray={dragSnapSide ? 'none' : '6 3'}
                  fill="none"
                  markerEnd="url(#arrow)"
                />
              )
            })()}
          </svg>

          {/* Edge label editor overlay */}
          {editingEdgeIdx !== null && (() => {
            const edge = allEdges[editingEdgeIdx]
            if (!edge) return null
            const fromNode = nodes.find(n => n.id === edge.from)
            const toNode = nodes.find(n => n.id === edge.to)
            if (!fromNode || !toNode) return null
            const { midX, midY } = getEdgePath(fromNode, toNode, edge.fromSide, edge.toSide, nodes)
            const isCustom = true
            return (
              <div
                style={{
                  position: 'absolute',
                  left: midX - 100,
                  top: midY - 40,
                  zIndex: 50,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  autoFocus
                  value={edgeLabelTemp}
                  onChange={(e) => setEdgeLabelTemp(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (isCustom) {
                        const customIdx = editingEdgeIdx
                        const updated = [...allEdges]
                        updated[customIdx] = { ...updated[customIdx], label: edgeLabelTemp }
                        saveCustomEdges(updated)
                      }
                      setEditingEdgeIdx(null)
                    }
                    if (e.key === 'Escape') setEditingEdgeIdx(null)
                  }}
                  placeholder="Action label..."
                  style={{
                    width: 160,
                    padding: '4px 8px',
                    fontSize: 11,
                    fontFamily: 'system-ui, sans-serif',
                    border: '1px solid var(--fm-border-strong)',
                    borderRadius: 4,
                    background: 'var(--fm-surface)',
                    color: 'var(--fm-text)',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => {
                    if (isCustom) {
                      const customIdx = editingEdgeIdx
                      const updated = [...allEdges]
                      updated[customIdx] = { ...updated[customIdx], label: edgeLabelTemp }
                      saveCustomEdges(updated)
                    }
                    setEditingEdgeIdx(null)
                  }}
                  title="Save"
                  style={{
                    border: '1px solid var(--fm-control-border)',
                    background: 'var(--fm-surface)',
                    borderRadius: 3,
                    padding: '5px 7px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4ade80',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
                <button
                  onClick={() => setEditingEdgeIdx(null)}
                  title="Cancel"
                  style={{
                    border: '1px solid var(--fm-control-border)',
                    background: 'var(--fm-surface)',
                    borderRadius: 3,
                    padding: '5px 7px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--fm-text-soft)',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
                {isCustom && (
                  <button
                    onClick={() => {
                      const customIdx = editingEdgeIdx
                      const updated = allEdges.filter((_, i) => i !== customIdx)
                      saveCustomEdges(updated)
                      setEditingEdgeIdx(null)
                    }}
                    title="Delete connection"
                    style={{
                      border: '1px solid var(--fm-control-border)',
                      background: 'var(--fm-surface)',
                      borderRadius: 3,
                      padding: '5px 7px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f87171',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                )}
              </div>
            )
          })()}

          {/* Section titles */}
          {sections.map((section) => (
            <div
              key={section.id}
              style={{
                position: 'absolute',
                left: 60,
                top: section.y,
                zIndex: 5,
              }}
            >
              <EditableSectionTitle sectionId={section.id} initialTitle={sectionTitles[section.id] || section.title} onTitleSaved={(id, t) => setSectionTitles(prev => ({ ...prev, [id]: t }))} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                {section.subtitle && (
                  <span style={{ color: 'var(--fm-text-muted)', fontSize: 12, fontFamily: 'system-ui, sans-serif' }}>
                    {resolveGroupNamesInText(section.subtitle, groupColors, groupLabels)}
                  </span>
                )}
                <FigmaSourceLink
                  storageKey={section.id}
                  initialUrl={figmaUrls[section.id] || section.figmaUrl || ''}
                  variant="inline"
                  onSave={saveFigmaUrl}
                />
              </div>
              {section.y > 0 && (
                <div style={{
                  position: 'absolute',
                  top: -20,
                  left: 0,
                  width: 2200,
                  height: 1,
                  background: 'var(--fm-control-bg)',
                }} />
              )}
            </div>
          ))}

          {nodes.map((node) => {
            const isHovered = hoveredNode === node.id
            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  if (didDragRef.current) return
                  if (droppingConnectionRef.current) return
                  if (noteMode) return
                  if (editingNodeId) return
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
                <ScreenCardImage src={node.screenshot} alt={node.label} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {editingNodeLabelId === node.id ? (
                    <input
                      type="text"
                      autoFocus
                      value={nodeLabelTemp}
                      onChange={(e) => setNodeLabelTemp(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        e.stopPropagation()
                        if (e.key === 'Enter') {
                          setNodeLabels(prev => ({ ...prev, [node.id]: nodeLabelTemp }))
                          fetch('/api/screen-texts', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ screen_id: 'flow-node-labels', text_key: node.id, content: nodeLabelTemp }),
                          }).catch(() => {})
                          setEditingNodeLabelId(null)
                        }
                        if (e.key === 'Escape') setEditingNodeLabelId(null)
                      }}
                      onBlur={() => {
                        setNodeLabels(prev => ({ ...prev, [node.id]: nodeLabelTemp }))
                        fetch('/api/screen-texts', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ screen_id: 'flow-node-labels', text_key: node.id, content: nodeLabelTemp }),
                        }).catch(() => {})
                        setEditingNodeLabelId(null)
                      }}
                      style={{
                        flex: 1,
                        fontSize: 11,
                        fontWeight: 400,
                        fontFamily: 'system-ui, sans-serif',
                        padding: '1px 4px',
                        border: '1px solid var(--fm-border-strong)',
                        borderRadius: 3,
                        background: 'var(--fm-control-bg)',
                        color: 'var(--fm-text)',
                        outline: 'none',
                        minWidth: 0,
                      }}
                    />
                  ) : (
                    <span
                      onClick={(e) => { e.stopPropagation(); setEditingNodeLabelId(node.id); setNodeLabelTemp(nodeLabels[node.id] || node.label) }}
                      style={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: 'var(--fm-text-soft)',
                        fontFamily: 'system-ui, sans-serif',
                        paddingLeft: 2,
                        flex: 1,
                        cursor: 'text',
                      }}
                    >
                      {nodeLabels[node.id] || node.label}
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingNodeId(editingNodeId === node.id ? null : node.id) }}
                    title={editingNodeId === node.id ? 'Done editing connections' : 'Edit connections'}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: editingNodeId === node.id ? '#4ade80' : 'var(--fm-text-faint)',
                      cursor: 'pointer',
                      padding: 2,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.15s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => { if (editingNodeId !== node.id) (e.currentTarget as HTMLElement).style.color = 'var(--fm-text-soft)' }}
                    onMouseLeave={(e) => { if (editingNodeId !== node.id) (e.currentTarget as HTMLElement).style.color = 'var(--fm-text-faint)' }}
                  >
                    {editingNodeId === node.id ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    )}
                  </button>
                </div>
                {(editingNodeId === node.id || (draggingFrom && dragHoverNodeId === node.id)) && (
                  <>
                    {['top', 'right', 'bottom', 'left'].map((side) => {
                      const isHoverTarget = draggingFrom && dragHoverNodeId === node.id
                      const isSnapped = isHoverTarget && dragSnapSide === side
                      const dotStyle: React.CSSProperties = {
                        position: 'absolute',
                        width: isSnapped ? 14 : 10,
                        height: isSnapped ? 14 : 10,
                        borderRadius: '50%',
                        background: isSnapped ? '#22c55e' : '#fbbf24',
                        border: isSnapped ? '2px solid #fff' : '2px solid #fff',
                        cursor: isHoverTarget ? 'default' : 'crosshair',
                        zIndex: 20,
                        transition: 'all 0.15s ease',
                        boxShadow: isSnapped ? '0 0 8px rgba(34,197,94,0.6)' : 'none',
                        ...(side === 'top' && { top: isSnapped ? -7 : -5, left: '50%', transform: 'translateX(-50%)' }),
                        ...(side === 'bottom' && { bottom: CARD_H - SCREENSHOT_H - (isSnapped ? 25 : 26), left: '50%', transform: 'translateX(-50%)' }),
                        ...(side === 'left' && { left: isSnapped ? -7 : -5, top: SCREENSHOT_H / 2 - (isSnapped ? 7 : 5) }),
                        ...(side === 'right' && { right: isSnapped ? -7 : -5, top: SCREENSHOT_H / 2 - (isSnapped ? 7 : 5) }),
                      }
                      return (
                        <div
                          key={side}
                          style={dotStyle}
                          onMouseDown={(e) => !isHoverTarget && handleAnchorMouseDown(e, node.id, side)}
                        />
                      )
                    })}
                  </>
                )}
              </div>
            )
          })}
          {/* Edge labels — rendered as divs on top of node cards for clickability */}
          {allEdges.map((edge, i) => {
            const fromNode = nodes.find((n) => n.id === edge.from)
            const toNode = nodes.find((n) => n.id === edge.to)
            if (!fromNode || !toNode) return null
            // Hide empty labels unless editing that node's connections
            const showEmptyLabel = editingNodeId === edge.from || editingNodeId === edge.to
            if (!edge.label && !showEmptyLabel) return null
            const { midX, midY } = getEdgePath(fromNode, toNode, edge.fromSide, edge.toSide, nodes)
            const labelText = edge.label || '+ label'
            return (
              <div
                key={`edge-label-${i}`}
                style={{
                  position: 'absolute',
                  left: midX,
                  top: midY - 28,
                  transform: 'translateX(-50%)',
                  zIndex: 10,
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                }}
                onClick={(e) => { e.stopPropagation(); setEditingEdgeIdx(i); setEdgeLabelTemp(edge.label || '') }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div style={{
                  background: 'rgba(17, 17, 30, 0.9)',
                  borderRadius: 4,
                  padding: '3px 8px',
                  fontSize: 11,
                  fontFamily: 'system-ui, sans-serif',
                  color: edge.label ? 'var(--fm-text-soft)' : 'var(--fm-text-muted)',
                  whiteSpace: 'nowrap',
                }}>
                  {labelText}
                </div>
              </div>
            )
          })}
          {/* Sticky Notes */}
          {/* Notes are rendered outside the transform in the parent */}
        </div>

        {/* Notes overlay — only when DB can store them */}
        {databaseConfigured && (notes || []).map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            pan={pan}
            zoom={zoom}
            currentAuthor={currentAuthor}
            currentAuthorEmail={currentAuthorEmail}
            forceOpen={forcedOpenNoteId === note.id}
            onForceOpenHandled={() => setForcedOpenNoteId(null)}
            onUpdate={onUpdateNote}
            onPositionUpdate={onPositionUpdateNote}
            onDelete={onDeleteNote}
            onRequireAuthor={onRequireAuthor}
          />
        ))}
      </div>
    </div>
  )
}

function NotificationBell({ authorName, onNavigateTo }: { authorName: string; onNavigateTo?: (x: number, y: number, noteId?: string) => void }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<{ id: string; type: string; message: string; author: string; created_at: string; target_id?: string; target_x?: number; target_y?: number }[]>([])
  const [loading, setLoading] = useState(false)

  const isAdmin = authorName.toLowerCase() === 'ilya'

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      setNotifications(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const clearAll = async () => {
    try {
      await fetch(`/api/notifications?author=${encodeURIComponent(authorName)}`, { method: 'DELETE' })
      setNotifications([])
    } catch (e) {
      console.error(e)
    }
  }

  const dismissOne = async (id: string) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' })
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 15000)
    return () => clearInterval(interval)
  }, [])

  const NotifIcon = ({ type }: { type: string }) => {
    const props = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
    switch (type) {
      case 'note_added':
        return <svg {...props} style={{ color: '#4ade80' }}><path d="M12 5v14M5 12h14"/></svg>
      case 'note_updated':
        return <svg {...props} style={{ color: '#fbbf24' }}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      case 'note_deleted':
        return <svg {...props} style={{ color: '#ef4444' }}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      case 'note_done':
        return <svg {...props} style={{ color: '#4ade80' }}><polyline points="20 6 9 17 4 12"/></svg>
      default:
        return <svg {...props} style={{ color: '#94a3b8' }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => { setOpen(!open); if (!open) fetchNotifications() }}
        style={{
          background: open ? 'var(--fm-control-bg)' : 'transparent',
          border: '1px solid var(--fm-control-border)',
          borderRadius: 8,
          padding: '5px 10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--fm-text)',
          fontSize: 12,
          position: 'relative',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {notifications.length > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#ef4444',
            color: '#fff',
            fontSize: 9,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      <style>{`
        .flow-notif-scroll::-webkit-scrollbar { width: 8px; }
        .flow-notif-scroll::-webkit-scrollbar-track { background: transparent; }
        .flow-notif-scroll::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.18); border-radius: 8px; border: 2px solid transparent; background-clip: padding-box; }
        .flow-notif-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(255,255,255,0.32); }
      `}</style>

      <div className="flow-notif-scroll" style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 8,
        width: 300,
        maxHeight: 400,
        overflow: open ? 'auto' : 'hidden',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.18) transparent',
        background: 'var(--fm-surface)',
        border: '1px solid var(--fm-border)',
        borderRadius: 12,
        boxShadow: 'var(--fm-shadow)',
        zIndex: 200,
        padding: '12px 0',
        opacity: open ? 1 : 0,
        transform: open ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-8px)',
        transformOrigin: 'top right',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        pointerEvents: open ? 'auto' : 'none',
      }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 14px 10px', borderBottom: '1px solid var(--fm-divider)' }}>
            <span style={{ color: 'var(--fm-text)', fontSize: 13, fontWeight: 600 }}>Notifications</span>
            {isAdmin && notifications.length > 0 && (
              <button
                onClick={clearAll}
                style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '3px 8px', fontSize: 10, color: '#ef4444', cursor: 'pointer', fontWeight: 500 }}
              >
                Clear all
              </button>
            )}
          </div>
          {loading && notifications.length === 0 && (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--fm-text-faint)', fontSize: 12 }}>Loading...</div>
          )}
          {!loading && notifications.length === 0 && (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--fm-text-faint)', fontSize: 12 }}>No notifications yet</div>
          )}
          {notifications.map((n) => {
            const hasTarget = n.target_x != null && n.target_y != null
            return (
              <div
                key={n.id}
                onClick={() => {
                  if (hasTarget && onNavigateTo) {
                    onNavigateTo(n.target_x!, n.target_y!, n.target_id || undefined)
                    setOpen(false)
                  }
                }}
                style={{
                  padding: '8px 14px',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: hasTarget ? 'pointer' : 'default',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => { if (hasTarget) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <span style={{ marginTop: 2, flexShrink: 0 }}><NotifIcon type={n.type} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'var(--fm-text-soft)', fontSize: 12, lineHeight: 1.4 }}>
                    {n.message}
                    {hasTarget && <span style={{ color: 'var(--fm-text-faint)', fontSize: 10, marginLeft: 6 }}>→ go to</span>}
                  </div>
                  <div style={{ color: 'var(--fm-text-faint)', fontSize: 10, marginTop: 3 }}>
                    {new Date(n.created_at).toLocaleDateString()} · {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dismissOne(n.id) }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--fm-text-faint)', cursor: 'pointer', padding: '2px 4px', fontSize: 14, lineHeight: 1, flexShrink: 0, marginTop: 2 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ef4444' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--fm-text-faint)' }}
                  title="Dismiss"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
    </div>
  )
}

const zoomBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: '1px solid var(--fm-control-border)',
  background: 'var(--fm-control-bg)',
  color: 'var(--fm-text)',
  fontSize: 16,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const noteConfirmAnimStyle: React.CSSProperties = {
  animation: 'noteConfirmIn 0.2s ease forwards',
  transformOrigin: 'center',
}

function EmailSubscribeToggle({ email }: { email: string }) {
  const isMobile = useIsMobile()
  const [subscribed, setSubscribed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [showEmailField, setShowEmailField] = useState(false)
  const [inputEmail, setInputEmail] = useState(email)
  const [banner, setBanner] = useState<{ text: string; tone: 'ok' | 'warn' | 'error' } | null>(null)
  const [emailConfigured, setEmailConfigured] = useState(false)
  const [databaseConfigured, setDatabaseConfigured] = useState(false)
  const [isDev, setIsDev] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/integrations-status')
      .then((r) => r.json())
      .then((data) => {
        setEmailConfigured(Boolean(data.emailConfigured))
        setDatabaseConfigured(Boolean(data.databaseConfigured))
        setIsDev(Boolean(data.isDev))
      })
      .catch(() => {})

    fetch(`/api/subscribers?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data) => {
        setSubscribed(data.subscribed_all || false)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [email])

  useEffect(() => {
    if (!showEmailField) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowEmailField(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showEmailField])

  const showBanner = (text: string, tone: 'ok' | 'warn' | 'error' = 'ok') => {
    setBanner({ text, tone })
    setTimeout(() => setBanner(null), 9000)
  }

  const configHint = isDev
    ? 'To enable: Dev (gear in the header) → Brevo email API → add your API key.'
    : 'Ask whoever hosts this preview to set BREVO_API_KEY.'

  const openBrevoSetup = () => {
    if (isDev) openFlowMapDevMenu('brevo')
  }

  const SetupBrevoLink = ({ children }: { children: React.ReactNode }) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        openBrevoSetup()
      }}
      style={{
        border: 'none',
        background: 'transparent',
        padding: 0,
        color: '#fbbf24',
        fontWeight: 600,
        fontSize: 'inherit',
        cursor: isDev ? 'pointer' : 'default',
        textAlign: 'left',
        textDecoration: isDev ? 'underline' : 'none',
        textUnderlineOffset: 3,
        fontFamily: 'system-ui, sans-serif',
        lineHeight: 1.45,
      }}
    >
      {children}
    </button>
  )

  const handleSubscribe = async () => {
    if (!inputEmail.trim() || !inputEmail.includes('@')) return

    if (!databaseConfigured) {
      showBanner(
        isDev
          ? 'Database isn’t configured — connect Neon in Dev settings before subscribing.'
          : 'Database isn’t configured — subscriptions can’t be saved.',
        'error',
      )
      return
    }

    if (!emailConfigured) {
      showBanner(
        isDev
          ? 'EMAIL_SETUP'
          : `Email delivery isn’t configured, so you won’t get messages yet. ${configHint}`,
        'warn',
      )
      setShowEmailField(false)
      return
    }

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail, subscribed_all: true }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        showBanner(data.error || 'Could not save subscription.', 'error')
        return
      }
      setSubscribed(true)
      setShowEmailField(false)
      showBanner(`Subscribed. You’ll get emails at ${inputEmail} for new comments and replies.`, 'ok')
    } catch {
      showBanner('Could not save subscription.', 'error')
    }
  }

  const handleUnsubscribe = async () => {
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEmail, subscribed_all: false }),
      })
      if (!res.ok) {
        showBanner('Could not unsubscribe.', 'error')
        return
      }
      setSubscribed(false)
      setShowEmailField(false)
      showBanner('Unsubscribed. You will no longer receive email notifications.', 'ok')
    } catch {
      showBanner('Could not unsubscribe.', 'error')
    }
  }

  if (!loaded) return null
  // Prod: don't tease a feature that can't deliver mail
  if (!emailConfigured && !isDev) return null

  const emailsBroken = !emailConfigured
  const bannerBorder =
    banner?.tone === 'error'
      ? 'rgba(248,113,113,0.5)'
      : banner?.tone === 'warn'
        ? 'rgba(251,191,36,0.5)'
        : 'rgba(34,197,94,0.4)'

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: isMobile ? 'calc(72px + env(safe-area-inset-bottom, 0px))' : 24,
        right: isMobile ? 12 : 24,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      {banner && (
        <div
          role={banner.text === 'EMAIL_SETUP' && isDev ? 'button' : undefined}
          onClick={() => {
            if (banner.text === 'EMAIL_SETUP' && isDev) openBrevoSetup()
          }}
          style={{
          background: 'var(--fm-surface)',
          backdropFilter: 'blur(8px)',
          border: `1.5px solid ${bannerBorder}`,
          borderRadius: 10,
          padding: '10px 14px',
          fontSize: 12,
          color: 'var(--fm-text-soft)',
          maxWidth: isMobile ? 'min(280px, calc(100vw - 24px))' : 340,
          lineHeight: 1.45,
          animation: 'fadeIn 0.2s ease-out',
          cursor: banner.text === 'EMAIL_SETUP' && isDev ? 'pointer' : 'default',
        }}>
          {banner.text === 'EMAIL_SETUP' ? (
            <span>
              Email alerts need Brevo first.{' '}
              <span style={{ color: '#fbbf24', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                Open Dev settings → set up Brevo
              </span>
            </span>
          ) : (
            banner.text
          )}
        </div>
      )}
      <div style={{
        overflow: 'hidden',
        maxHeight: showEmailField ? (emailsBroken ? 320 : 280) : 0,
        opacity: showEmailField ? 1 : 0,
        transform: showEmailField ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
        transition: 'max-height 0.25s ease, opacity 0.2s ease, transform 0.2s ease',
        transformOrigin: 'bottom right',
      }}>
        <div style={{ background: 'var(--fm-surface)', backdropFilter: 'blur(8px)', border: '1.5px solid var(--fm-control-border)', borderRadius: 12, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 240 }}>
          {emailsBroken ? (
            <div style={{ fontSize: 11, lineHeight: 1.45 }}>
              <div style={{ color: 'var(--fm-text)', fontWeight: 700, marginBottom: 6 }}>Email alerts for flow comments</div>
              <div style={{ color: 'var(--fm-text-soft)', marginBottom: 8 }}>
                Optional notifications when someone drops a note, replies, or @mentions you — so you don’t miss review feedback.
              </div>
              <div style={{ color: 'var(--fm-text-muted)', marginBottom: 8 }}>
                Completely optional. The flow map works without email.
              </div>
              {isDev ? (
                <SetupBrevoLink>Open Dev settings → set up Brevo</SetupBrevoLink>
              ) : (
                <div style={{ color: '#fbbf24', fontWeight: 500 }}>{configHint}</div>
              )}
            </div>
          ) : (
            <label style={{ fontSize: 11, color: 'var(--fm-text-muted)', fontWeight: 500 }}>
              Get notified when someone adds a comment, reply, or @mentions you
            </label>
          )}
          <input
            autoFocus={showEmailField}
            type="email"
            value={inputEmail}
            onChange={(e) => setInputEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
            placeholder="you@asurion.com"
            disabled={emailsBroken}
            style={{
              background: 'var(--fm-control-bg)',
              border: '1px solid var(--fm-control-border)',
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 13,
              color: emailsBroken ? 'var(--fm-text-faint)' : 'var(--fm-text)',
              outline: 'none',
              width: '100%',
              opacity: emailsBroken ? 0.6 : 1,
            }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            {!emailsBroken && (
              <button
                onClick={handleSubscribe}
                style={{ flex: 1, background: '#22c55e', border: 'none', borderRadius: 6, padding: '6px 10px', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer' }}
              >
                {subscribed ? 'Update' : 'Subscribe'}
              </button>
            )}
            {subscribed && (
              <button
                onClick={handleUnsubscribe}
                style={{
                  flex: emailsBroken ? 1 : undefined,
                  background: 'rgba(239,68,68,0.2)',
                  border: '1px solid #ef4444',
                  borderRadius: 6,
                  padding: '6px 10px',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#ef4444',
                  cursor: 'pointer',
                }}
              >
                Unsubscribe
              </button>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          if (emailsBroken && !subscribed) {
            if (isDev) {
              showBanner('EMAIL_SETUP', 'warn')
            } else {
              showBanner(
                `Email alerts (optional): get notified when teammates leave notes, replies, or @mention you on this flow. Skip it if you only need the map. ${configHint}`,
                'warn',
              )
            }
          }
          setShowEmailField(!showEmailField)
        }}
        title={
          emailsBroken
            ? 'Optional email alerts — needs Brevo setup'
            : subscribed
              ? 'Subscribed — click to manage'
              : 'Subscribe to note activity emails'
        }
        style={{
          padding: '10px 16px',
          borderRadius: 999,
          border: emailsBroken
            ? '1.5px solid rgba(251,191,36,0.45)'
            : subscribed
              ? '1.5px solid #22c55e'
              : '1.5px solid var(--fm-control-border)',
          background: emailsBroken
            ? 'rgba(251,191,36,0.12)'
            : subscribed
              ? 'rgba(34,197,94,0.15)'
              : 'var(--fm-surface)',
          backdropFilter: 'blur(8px)',
          color: emailsBroken ? '#fbbf24' : subscribed ? '#22c55e' : 'var(--fm-text-soft)',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'all 0.2s',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        {emailsBroken ? (isMobile ? 'Email' : 'Email alerts (optional)') : subscribed ? 'Subscribed' : (isMobile ? 'Subscribe' : 'Subscribe')}
      </button>
    </div>
  )
}

function extractMentions(text: string): string[] {
  const matches = text.match(/@([\w.+-]+@[\w.-]+\.\w+)/g)
  if (!matches) return []
  return matches.map(m => m.slice(1))
}

async function sendEmailNotification(payload: {
  type: string
  noteAuthorEmail?: string
  actorName: string
  actorEmail: string
  content?: string
  mentions?: string[]
}) {
  fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {})
}

function StickyNote({
  note,
  pan,
  zoom,
  currentAuthor,
  currentAuthorEmail,
  forceOpen,
  onForceOpenHandled,
  onUpdate,
  onPositionUpdate,
  onDelete,
  onRequireAuthor,
}: {
  note: Note
  pan: { x: number; y: number }
  zoom: number
  currentAuthor: string
  currentAuthorEmail: string
  forceOpen?: boolean
  onForceOpenHandled?: () => void
  onUpdate?: (note: Note) => void
  onPositionUpdate?: (note: Note) => void
  onDelete?: (id: string) => void
  onRequireAuthor?: () => void
}) {
  const isOwner = currentAuthor.toLowerCase() === note.author.toLowerCase()
  const isAdmin = currentAuthor.toLowerCase() === 'ilya'
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(note.content)
  const [items, setItems] = useState<NoteItem[]>(note.items || [])
  const [replies, setReplies] = useState<NoteReply[]>(note.replies || [])
  const [replyText, setReplyText] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmDone, setConfirmDone] = useState(false)
  const [appeared, setAppeared] = useState(false)
  const [knownUsers, setKnownUsers] = useState<Array<{email: string; name: string}>>([])
  const [mentionQuery, setMentionQuery] = useState('')
  const [showMentionDropdown, setShowMentionDropdown] = useState(false)
  const [mentionCursorPos, setMentionCursorPos] = useState(0)
  const [selectedMentions, setSelectedMentions] = useState<string[]>([])
  const [replyMentions, setReplyMentions] = useState<string[]>([])
  const [editingReplyIdx, setEditingReplyIdx] = useState<number | null>(null)
  const [editReplyText, setEditReplyText] = useState('')
  const [confirmDeleteReplyIdx, setConfirmDeleteReplyIdx] = useState<number | null>(null)
  const [hoveredReplyIdx, setHoveredReplyIdx] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setKnownUsers).catch(() => {})
  }, [])

  useEffect(() => {
    if (forceOpen) {
      setEditing(true)
      onForceOpenHandled?.()
    }
  }, [forceOpen, onForceOpenHandled])

  useEffect(() => {
    requestAnimationFrame(() => setAppeared(true))
  }, [])
  const [arrowPos, setArrowPos] = useState({ x: note.arrow_x ?? note.x, y: note.arrow_y ?? note.y + 60 })
  const [notePos, setNotePos] = useState({ x: note.x, y: note.y })
  const notePosRef = useRef(notePos)
  const arrowPosRef = useRef(arrowPos)

  useEffect(() => { notePosRef.current = notePos }, [notePos])
  useEffect(() => { arrowPosRef.current = arrowPos }, [arrowPos])

  const isDirty = content !== note.content || JSON.stringify(items) !== JSON.stringify(note.items || []) || JSON.stringify(replies) !== JSON.stringify(note.replies || [])

  const save = useCallback(async () => {
    if (isDirty) {
      const contentChanged = content !== note.content
      const mentions = selectedMentions.length > 0 ? selectedMentions : extractMentions(content)
      if (mentions.length > 0) {
        sendEmailNotification({ type: 'mention', noteAuthorEmail: note.authorEmail, actorName: currentAuthor, actorEmail: currentAuthorEmail, content, mentions })
      } else if (contentChanged && content.trim()) {
        sendEmailNotification({ type: 'new_note', noteAuthorEmail: note.authorEmail, actorName: currentAuthor, actorEmail: currentAuthorEmail, content })
      }
      onUpdate?.({ ...note, x: notePos.x, y: notePos.y, content, items, replies, arrow_x: arrowPos.x, arrow_y: arrowPos.y })
      setSelectedMentions([])
    }
    setEditing(false)
  }, [note, notePos, content, items, replies, arrowPos, onUpdate, isDirty, currentAuthor, currentAuthorEmail, selectedMentions])

  const addItem = () => {
    setItems([...items, { text: '', checked: false }])
  }

  const toggleItem = (idx: number) => {
    const updated = items.map((item, i) => i === idx ? { ...item, checked: !item.checked } : item)
    setItems(updated)
    onUpdate?.({ ...note, x: notePos.x, y: notePos.y, content, items: updated, replies, arrow_x: arrowPos.x, arrow_y: arrowPos.y })
  }

  const updateItemText = (idx: number, text: string) => {
    setItems(items.map((item, i) => i === idx ? { ...item, text } : item))
  }

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx))
  }

  const postReply = async () => {
    if (!replyText.trim()) return
    if (!currentAuthor.trim()) {
      onRequireAuthor?.()
      return
    }
    const newReply: NoteReply = {
      author: currentAuthor.trim(),
      text: replyText.trim(),
      created_at: new Date().toISOString(),
    }
    const updatedReplies = [...replies, newReply]
    setReplies(updatedReplies)
    const mentions = replyMentions.length > 0 ? replyMentions : extractMentions(replyText)
    if (mentions.length > 0) {
      sendEmailNotification({ type: 'mention', noteAuthorEmail: note.authorEmail, actorName: currentAuthor, actorEmail: currentAuthorEmail, content: replyText.trim(), mentions })
    } else {
      sendEmailNotification({ type: 'reply', noteAuthorEmail: note.authorEmail, actorName: currentAuthor, actorEmail: currentAuthorEmail, content: replyText.trim() })
    }
    setReplyText('')
    setReplyMentions([])
    onUpdate?.({ ...note, x: notePos.x, y: notePos.y, content, items, replies: updatedReplies, arrow_x: arrowPos.x, arrow_y: arrowPos.y })
  }

  const isReplyAuthor = (reply: NoteReply) =>
    !!currentAuthor.trim() &&
    currentAuthor.toLowerCase() === (reply.author || '').toLowerCase()

  const canManageReply = (reply: NoteReply) => isReplyAuthor(reply) || isAdmin

  const startEditReply = (idx: number) => {
    if (!currentAuthor.trim()) {
      onRequireAuthor?.()
      return
    }
    setEditingReplyIdx(idx)
    setEditReplyText(replies[idx]?.text || '')
    setConfirmDeleteReplyIdx(null)
  }

  const cancelEditReply = () => {
    setEditingReplyIdx(null)
    setEditReplyText('')
  }

  const saveEditReply = (idx: number) => {
    const nextText = editReplyText.trim()
    if (!nextText) return
    const updatedReplies = replies.map((reply, i) =>
      i === idx ? { ...reply, text: nextText } : reply,
    )
    setReplies(updatedReplies)
    setEditingReplyIdx(null)
    setEditReplyText('')
    onUpdate?.({ ...note, x: notePos.x, y: notePos.y, content, items, replies: updatedReplies, arrow_x: arrowPos.x, arrow_y: arrowPos.y })
  }

  const deleteReply = (idx: number) => {
    const updatedReplies = replies.filter((_, i) => i !== idx)
    setReplies(updatedReplies)
    setConfirmDeleteReplyIdx(null)
    if (editingReplyIdx === idx) cancelEditReply()
    else if (editingReplyIdx !== null && editingReplyIdx > idx) setEditingReplyIdx(editingReplyIdx - 1)
    onUpdate?.({ ...note, x: notePos.x, y: notePos.y, content, items, replies: updatedReplies, arrow_x: arrowPos.x, arrow_y: arrowPos.y })
  }

  const screenX = notePos.x * zoom + pan.x
  const screenY = notePos.y * zoom + pan.y
  const arrowScreenX = arrowPos.x * zoom + pan.x
  const arrowScreenY = arrowPos.y * zoom + pan.y

  const didDragNoteRef = useRef(false)

  const handleNoteDrag = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    didDragNoteRef.current = false
    const startX = e.clientX
    const startY = e.clientY
    const startPos = { ...notePos }

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        didDragNoteRef.current = true
      }
      const newPos = {
        x: startPos.x + (ev.clientX - startX) / zoom,
        y: startPos.y + (ev.clientY - startY) / zoom,
      }
      setNotePos(newPos)
      notePosRef.current = newPos
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      if (!didDragNoteRef.current) {
        setEditing(true)
      } else {
        const p = notePosRef.current
        const a = arrowPosRef.current
        onPositionUpdate?.({ ...note, x: p.x, y: p.y, content, items, replies, arrow_x: a.x, arrow_y: a.y })
      }
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const handleArrowDrag = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const startArrow = { ...arrowPos }

    const onMove = (ev: MouseEvent) => {
      const newArrow = {
        x: startArrow.x + (ev.clientX - startX) / zoom,
        y: startArrow.y + (ev.clientY - startY) / zoom,
      }
      setArrowPos(newArrow)
      arrowPosRef.current = newArrow
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      const p = notePosRef.current
      const a = arrowPosRef.current
      onPositionUpdate?.({ ...note, x: p.x, y: p.y, content, items, replies, arrow_x: a.x, arrow_y: a.y })
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <>
      {/* Arrow line */}
      <svg
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 50, opacity: appeared ? 1 : 0, transition: 'opacity 0.3s ease' }}
      >
        <line
          x1={screenX + 12}
          y1={screenY + 12}
          x2={arrowScreenX}
          y2={arrowScreenY}
          stroke={note.done ? '#4ade80' : '#fbbf24'}
          strokeWidth={2}
          strokeDasharray="4 3"
          opacity={0.8}
        />
      </svg>

      {/* Arrow endpoint — draggable */}
      <div
        style={{
          position: 'absolute',
          left: arrowScreenX - 7,
          top: arrowScreenY - 7,
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: note.done ? '#4ade80' : '#fbbf24',
          border: `2px solid ${note.done ? '#166534' : '#000'}`,
          cursor: 'move',
          zIndex: 55,
          opacity: appeared ? 1 : 0,
          transition: 'opacity 0.3s ease',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}
        onMouseDown={handleArrowDrag}
      />

      {/* Note body */}
      <div
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          left: screenX,
          top: screenY,
          zIndex: 60,
          opacity: appeared ? 1 : 0,
          transform: appeared ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        {/* Collapsed pin */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'move',
            position: editing ? 'absolute' : 'relative',
            opacity: editing ? 0 : 1,
            transform: editing ? 'scale(0.8)' : 'scale(1)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            pointerEvents: editing ? 'none' : 'auto',
          }}
          onMouseDown={handleNoteDrag}
        >
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: note.done ? '#4ade80' : '#fbbf24',
              border: `2px solid ${note.done ? '#166534' : '#000'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              cursor: 'pointer',
              position: 'relative',
            }}>
              {note.done ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              )}
              {replies.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#ef4444',
                  color: 'var(--fm-text)',
                  fontSize: 9,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--fm-bg)',
                }}>
                  {replies.length}
                </div>
              )}
            </div>
            <span style={{
              color: 'var(--fm-text-muted)',
              fontSize: 10,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}>
              {note.author}
            </span>
          </div>
        {/* Expanded card */}
          <div style={{
            background: note.done ? '#d1fae5' : '#ffeb8a',
            border: `1px solid ${note.done ? 'rgba(22,163,74,0.28)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: 14,
            padding: '14px 14px 12px',
            boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            width: 268,
            maxWidth: 'calc(100vw - 24px)',
            boxSizing: 'border-box',
            overflow: 'hidden',
            opacity: editing ? 1 : 0,
            transform: editing ? 'scale(1)' : 'scale(0.9)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            pointerEvents: editing ? 'auto' : 'none',
            position: editing ? 'relative' : 'absolute',
            color: '#1c1917',
          }}>
            {/* Drag handle + header */}
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, cursor: 'move' }}
              onMouseDown={handleNoteDrag}
            >
              <span style={{ fontSize: 13, color: '#1c1917', fontWeight: 650, letterSpacing: '-0.01em' }}>
                {note.author}
              </span>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {isOwner && (
                  <button
                    onClick={save}
                    disabled={!isDirty || (!content.trim() && items.every(i => !i.text.trim()))}
                    style={{ background: isDirty && (content.trim() || items.some(i => i.text.trim())) ? (note.done ? '#4ade80' : '#fbbf24') : 'rgba(0,0,0,0.1)', border: 'none', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: isDirty ? 'pointer' : 'default', color: isDirty && (content.trim() || items.some(i => i.text.trim())) ? (note.done ? '#166534' : '#1c1917') : 'rgba(0,0,0,0.35)', transition: 'all 0.15s' }}
                  >
                    Save
                  </button>
                )}
                {(isOwner || isAdmin) && !confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    title="Delete note"
                    style={{ background: 'transparent', border: 'none', borderRadius: 6, padding: '4px', fontSize: 11, color: 'rgba(0,0,0,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                ) : (isOwner || isAdmin) && confirmDelete ? (
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', ...noteConfirmAnimStyle }}>
                    <button
                      onClick={() => onDelete?.(note.id)}
                      style={{ background: '#dc2626', border: 'none', borderRadius: 999, padding: '4px 10px', fontSize: 10, fontWeight: 600, color: '#fff', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      style={{ background: 'transparent', border: 'none', borderRadius: 6, padding: '4px 6px', fontSize: 10, color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : null}
                <button
                  onClick={() => {
                    if (!content.trim() && items.every(i => !i.text.trim())) {
                      onDelete?.(note.id)
                    } else {
                      setEditing(false)
                    }
                  }}
                  title="Close"
                  style={{ background: 'transparent', border: 'none', borderRadius: 6, padding: '4px', fontSize: 14, lineHeight: 1, color: 'rgba(0,0,0,0.35)', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            {isOwner ? (<>
              <textarea
                ref={(el) => {
                  if (el) {
                    el.style.height = 'auto'
                    el.style.height = el.scrollHeight + 'px'
                  }
                }}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  const el = e.target
                  el.style.height = 'auto'
                  el.style.height = el.scrollHeight + 'px'
                  const cursor = el.selectionStart || 0
                  const textBefore = e.target.value.slice(0, cursor)
                  const atMatch = textBefore.match(/@(\S*)$/)
                  if (atMatch) {
                    setMentionQuery(atMatch[1].toLowerCase())
                    setMentionCursorPos(cursor)
                    setShowMentionDropdown(true)
                  } else {
                    setShowMentionDropdown(false)
                  }
                }}
                placeholder="Write your note..."
                style={{
                  width: '100%',
                  minHeight: 44,
                  border: 'none',
                  borderRadius: 0,
                  padding: '2px 0',
                  fontSize: 13,
                  lineHeight: 1.45,
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  background: 'transparent',
                  color: '#1c1917',
                }}
              />
              {/* @mention dropdown for note content */}
              {showMentionDropdown && (() => {
                const filtered = knownUsers.filter(u =>
                  u.name.toLowerCase().includes(mentionQuery) ||
                  u.email.toLowerCase().includes(mentionQuery)
                )
                if (filtered.length === 0) return null
                return (
                  <div style={{
                    background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)', maxHeight: 120, overflowY: 'auto',
                    marginTop: 4, position: 'relative', zIndex: 10,
                  }}>
                    {filtered.slice(0, 5).map(user => (
                      <div
                        key={user.email}
                        onClick={() => {
                          const before = content.slice(0, content.lastIndexOf('@'))
                          const after = content.slice(mentionCursorPos)
                          setContent(`${before}@${user.name} ${after}`)
                          setSelectedMentions(prev => [...prev, user.email])
                          setShowMentionDropdown(false)
                        }}
                        style={{
                          padding: '8px 10px', cursor: 'pointer', fontSize: 11,
                          borderBottom: '1px solid rgba(0,0,0,0.05)',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                      >
                        <span style={{ fontWeight: 600, color: '#1c1917' }}>{user.name}</span>
                        <span style={{ color: 'rgba(0,0,0,0.4)', fontSize: 10 }}>{user.email}</span>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </>) : (
              <div style={{
                width: '100%',
                minHeight: 30,
                border: 'none',
                padding: '2px 0',
                fontSize: 13,
                lineHeight: 1.45,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                background: 'transparent',
                color: '#1c1917',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {content || <span style={{ color: 'rgba(0,0,0,0.35)', fontStyle: 'italic' }}>No content</span>}
              </div>
            )}

            {/* Checklist items */}
            <div style={{ marginTop: 10, overflow: 'hidden' }}>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(idx)}
                    style={{ cursor: 'pointer', accentColor: '#1c1917', flexShrink: 0, marginTop: 3 }}
                  />
                  {isOwner ? (
                    <textarea
                      value={item.text}
                      ref={(el) => {
                        if (el) {
                          el.style.height = 'auto'
                          el.style.height = el.scrollHeight + 'px'
                        }
                      }}
                      onChange={(e) => {
                        updateItemText(idx, e.target.value)
                        const el = e.target
                        el.style.height = 'auto'
                        el.style.height = el.scrollHeight + 'px'
                      }}
                      placeholder="Task item..."
                      rows={1}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        border: 'none',
                        borderBottom: '1px solid rgba(0,0,0,0.12)',
                        padding: '2px 0',
                        fontSize: 12,
                        background: 'transparent',
                        outline: 'none',
                        resize: 'none',
                        overflow: 'hidden',
                        fontFamily: 'inherit',
                        textDecoration: item.checked ? 'line-through' : 'none',
                        color: item.checked ? 'rgba(0,0,0,0.38)' : '#1c1917',
                        lineHeight: '1.4',
                      }}
                    />
                  ) : (
                    <span style={{
                      flex: 1,
                      minWidth: 0,
                      padding: '2px 0',
                      fontSize: 12,
                      fontFamily: 'inherit',
                      textDecoration: item.checked ? 'line-through' : 'none',
                      color: item.checked ? 'rgba(0,0,0,0.38)' : '#1c1917',
                      lineHeight: '1.4',
                    }}>
                      {item.text || 'Task item...'}
                    </span>
                  )}
                  {isOwner && (
                    <button
                      onClick={() => removeItem(idx)}
                      style={{ border: 'none', background: 'transparent', color: 'rgba(0,0,0,0.3)', cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1, flexShrink: 0, marginTop: 2 }}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add item button — owner only */}
            {isOwner && (
              <button
                onClick={addItem}
                style={{
                  marginTop: 4,
                  border: 'none',
                  background: 'transparent',
                  borderRadius: 0,
                  padding: '4px 0',
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'rgba(0,0,0,0.45)',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                + Add checkbox item
              </button>
            )}

            {/* Replies section */}
            {replies.length > 0 && (
              <div style={{ marginTop: 12, borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.4)', marginBottom: 8 }}>
                  Replies ({replies.length})
                </div>
                {replies.map((reply, idx) => {
                  const canManage = canManageReply(reply)
                  const isEditingThis = editingReplyIdx === idx
                  const confirmingDelete = confirmDeleteReplyIdx === idx
                  const showMeta = hoveredReplyIdx === idx || isEditingThis || confirmingDelete
                  const replyStamp = `${new Date(reply.created_at).toLocaleDateString()} · ${new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  return (
                  <div
                    key={idx}
                    style={{ marginBottom: 10, padding: 0, background: 'transparent', position: 'relative' }}
                    onMouseEnter={() => setHoveredReplyIdx(idx)}
                    onMouseLeave={() => setHoveredReplyIdx((prev) => (prev === idx ? null : prev))}
                    title={!showMeta ? replyStamp : undefined}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1c1917', letterSpacing: '-0.01em' }}>
                        {reply.author?.trim() || 'Anonymous'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, minHeight: 16, position: 'relative' }}>
                        <div style={{
                          position: 'absolute',
                          right: '100%',
                          marginRight: 6,
                          fontSize: 9,
                          color: 'rgba(0,0,0,0.35)',
                          whiteSpace: 'nowrap',
                          opacity: showMeta ? 1 : 0,
                          transform: showMeta ? 'translateY(0)' : 'translateY(1px)',
                          transition: 'opacity 0.2s ease, transform 0.2s ease',
                          pointerEvents: 'none',
                        }}>
                          {replyStamp}
                        </div>
                        {canManage && !isEditingThis && !confirmingDelete && (
                          <>
                            <button
                              type="button"
                              onClick={() => startEditReply(idx)}
                              title="Edit reply"
                              aria-label="Edit reply"
                              style={{ border: 'none', background: 'transparent', padding: 2, color: 'rgba(0,0,0,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteReplyIdx(idx)}
                              title="Delete reply"
                              aria-label="Delete reply"
                              style={{ border: 'none', background: 'transparent', padding: 2, color: 'rgba(0,0,0,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    {isEditingThis ? (
                      <div style={{ marginTop: 4, ...noteConfirmAnimStyle }}>
                        <textarea
                          value={editReplyText}
                          autoFocus
                          onChange={(e) => {
                            setEditReplyText(e.target.value)
                            const el = e.target
                            el.style.height = 'auto'
                            el.style.height = el.scrollHeight + 'px'
                          }}
                          ref={(el) => {
                            if (el) {
                              el.style.height = 'auto'
                              el.style.height = el.scrollHeight + 'px'
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              saveEditReply(idx)
                            }
                            if (e.key === 'Escape') cancelEditReply()
                          }}
                          rows={2}
                          style={{
                            width: '100%',
                            border: 'none',
                            borderBottom: '1px solid rgba(0,0,0,0.18)',
                            borderRadius: 0,
                            padding: '4px 0',
                            fontSize: 12,
                            lineHeight: 1.4,
                            outline: 'none',
                            fontFamily: 'inherit',
                            background: 'transparent',
                            color: '#1c1917',
                            resize: 'none',
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                          }}
                        />
                        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                          <button
                            type="button"
                            onClick={() => saveEditReply(idx)}
                            disabled={!editReplyText.trim()}
                            style={{
                              border: 'none',
                              background: note.done ? '#4ade80' : '#fbbf24',
                              borderRadius: 999,
                              padding: '4px 10px',
                              fontSize: 10,
                              fontWeight: 600,
                              cursor: editReplyText.trim() ? 'pointer' : 'default',
                              color: note.done ? '#166534' : '#1c1917',
                              opacity: editReplyText.trim() ? 1 : 0.5,
                            }}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditReply}
                            style={{ border: 'none', background: 'transparent', borderRadius: 999, padding: '4px 8px', fontSize: 10, fontWeight: 500, color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : confirmingDelete ? (
                      <div style={{ marginTop: 6, display: 'flex', gap: 6, alignItems: 'center', ...noteConfirmAnimStyle }}>
                        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.55)' }}>Delete this reply?</span>
                        <button
                          type="button"
                          onClick={() => deleteReply(idx)}
                          style={{ border: 'none', background: '#dc2626', borderRadius: 999, padding: '4px 10px', fontSize: 10, fontWeight: 600, color: '#fff', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteReplyIdx(null)}
                          style={{ border: 'none', background: 'transparent', borderRadius: 999, padding: '4px 8px', fontSize: 10, color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.72)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.4, marginTop: 3 }}>{reply.text}</div>
                    )}
                  </div>
                  )
                })}
              </div>
            )}

            {/* Add reply — only show if note was already saved with content */}
            {note.content.trim() && (<>
            <div style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'center', borderTop: replies.length === 0 ? '1px solid rgba(0,0,0,0.1)' : 'none', paddingTop: replies.length === 0 ? 10 : 0 }}>
              <input
                type="text"
                value={replyText}
                onChange={(e) => {
                  const val = e.target.value
                  setReplyText(val)
                  const cursor = e.target.selectionStart || 0
                  const textBefore = val.slice(0, cursor)
                  const atMatch = textBefore.match(/@(\S*)$/)
                  if (atMatch) {
                    setMentionQuery(atMatch[1].toLowerCase())
                    setMentionCursorPos(cursor)
                    setShowMentionDropdown(true)
                  } else {
                    setShowMentionDropdown(false)
                  }
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    await postReply()
                  }
                }}
                onFocus={() => {
                  if (!currentAuthor.trim()) onRequireAuthor?.()
                }}
                placeholder="Add a reply..."
                style={{
                  flex: 1,
                  border: 'none',
                  borderBottom: '1px solid rgba(0,0,0,0.14)',
                  borderRadius: 0,
                  padding: '6px 0',
                  fontSize: 12,
                  outline: 'none',
                  fontFamily: 'inherit',
                  background: 'transparent',
                  color: '#1c1917',
                }}
              />
              <button
                onClick={() => { void postReply() }}
                style={{
                  border: 'none',
                  background: note.done ? '#4ade80' : '#fbbf24',
                  borderRadius: 999,
                  padding: '5px 12px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: note.done ? '#166534' : '#1c1917',
                  flexShrink: 0,
                }}
              >
                Reply
              </button>
            </div>

            {/* @mention autocomplete dropdown */}
            {showMentionDropdown && (() => {
              const filtered = knownUsers.filter(u =>
                u.name.toLowerCase().includes(mentionQuery) ||
                u.email.toLowerCase().includes(mentionQuery)
              )
              if (filtered.length === 0) return null
              return (
                <div style={{
                  background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)', maxHeight: 120, overflowY: 'auto',
                  marginTop: 4, position: 'relative', zIndex: 10,
                }}>
                  {filtered.slice(0, 5).map(user => (
                    <div
                      key={user.email}
                      onClick={() => {
                        const before = replyText.slice(0, replyText.lastIndexOf('@'))
                        const after = replyText.slice(mentionCursorPos)
                        setReplyText(`${before}@${user.name} ${after}`)
                        setReplyMentions(prev => [...prev, user.email])
                        setShowMentionDropdown(false)
                      }}
                      style={{
                        padding: '8px 10px', cursor: 'pointer', fontSize: 11,
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                    >
                      <span style={{ fontWeight: 600, color: '#1c1917' }}>{user.name}</span>
                      <span style={{ color: 'rgba(0,0,0,0.4)', fontSize: 10 }}>{user.email}</span>
                    </div>
                  ))}
                </div>
              )
            })()}
            </>)}

            {/* Mark As Done — bottom button with confirmation */}
            {note.content.trim() && (
              !confirmDone ? (
                <button
                  onClick={() => setConfirmDone(true)}
                  style={{
                    marginTop: 12,
                    width: '100%',
                    border: 'none',
                    background: note.done ? 'rgba(22,163,74,0.18)' : 'rgba(0,0,0,0.08)',
                    borderRadius: 999,
                    padding: '8px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: note.done ? '#166534' : '#1c1917',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {note.done ? 'Marked as Done' : 'Mark As Done'}
                </button>
              ) : (
                <div style={{ marginTop: 12, display: 'flex', gap: 6, justifyContent: 'center', ...noteConfirmAnimStyle }}>
                  <button
                    onClick={async () => {
                      const updated = { ...note, x: notePos.x, y: notePos.y, content, items, replies, arrow_x: arrowPos.x, arrow_y: arrowPos.y, done: !note.done }
                      if (!note.done) {
                        sendEmailNotification({ type: 'mark_complete', noteAuthorEmail: note.authorEmail, actorName: currentAuthor, actorEmail: currentAuthorEmail })
                      }
                      onUpdate?.(updated)
                      setConfirmDone(false)
                    }}
                    style={{ flex: 1, background: '#16a34a', border: 'none', borderRadius: 999, padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer' }}
                  >
                    {note.done ? 'Undo' : 'Yes, done'}
                  </button>
                  <button
                    onClick={() => setConfirmDone(false)}
                    style={{ flex: 1, background: 'transparent', border: 'none', borderRadius: 999, padding: '8px 12px', fontSize: 12, fontWeight: 500, color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }}
                  >
                    No
                  </button>
                </div>
              )
            )}

            {/* Timestamp */}
            <div style={{ marginTop: 10, fontSize: 10, color: 'rgba(0,0,0,0.35)' }}>
              {new Date(note.created_at).toLocaleDateString()} · {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
      </div>
    </>
  )
}

function EditableMapTitle({
  initialTitle,
  onTitleSaved,
}: {
  initialTitle: string
  onTitleSaved?: (title: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [displayTitle, setDisplayTitle] = useState(initialTitle)
  const [tempTitle, setTempTitle] = useState(initialTitle)

  useEffect(() => {
    setDisplayTitle(initialTitle)
    setTempTitle(initialTitle)
  }, [initialTitle])

  const save = () => {
    const next = tempTitle.trim() || displayTitle
    setDisplayTitle(next)
    setTempTitle(next)
    setEditing(false)
    onTitleSaved?.(next)
    fetch('/api/screen-texts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ screen_id: 'flow-map-meta', text_key: 'title', content: next }),
    }).catch(() => {})
  }

  const iconBtnStyle: React.CSSProperties = {
    border: '1px solid var(--fm-control-border)',
    background: 'var(--fm-surface)',
    borderRadius: 3,
    padding: '4px 6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  }

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {editing ? (
        <>
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') {
                setTempTitle(displayTitle)
                setEditing(false)
              }
            }}
            autoFocus
            style={{
              width: Math.min(320, Math.max(140, tempTitle.length * 10 + 24)),
              padding: '4px 10px',
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'system-ui, sans-serif',
              border: '1px solid var(--fm-border-strong)',
              borderRadius: 6,
              background: 'var(--fm-control-bg)',
              color: 'var(--fm-text)',
              outline: 'none',
            }}
          />
          <button type="button" onClick={save} title="Save" style={{ ...iconBtnStyle, color: '#4ade80' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => {
              setTempTitle(displayTitle)
              setEditing(false)
            }}
            title="Cancel"
            style={{ ...iconBtnStyle, color: 'var(--fm-text-soft)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </>
      ) : (
        <>
          <span
            style={{
              color: 'var(--fm-text)',
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {displayTitle}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            title="Edit title"
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--fm-text-faint)',
              cursor: 'pointer',
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = 'var(--fm-text-soft)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color = 'var(--fm-text-faint)'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

function resolveGroupNamesInText(
  text: string,
  groupColors: Record<string, { label: string }>,
  groupLabels: Record<string, string>,
) {
  let out = text
  for (const [key, val] of Object.entries(groupColors)) {
    const display = groupLabels[key] || val.label
    if (val.label && display !== val.label) {
      out = out.split(val.label).join(display)
    }
  }
  return out
}

function EditableGroupLabel({
  groupKey,
  initialLabel,
  onLabelSaved,
}: {
  groupKey: string
  initialLabel: string
  onLabelSaved?: (key: string, label: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [label, setLabel] = useState(initialLabel)
  const [temp, setTemp] = useState(initialLabel)

  useEffect(() => {
    setLabel(initialLabel)
    setTemp(initialLabel)
  }, [initialLabel])

  const save = () => {
    const next = temp.trim() || label
    setLabel(next)
    setTemp(next)
    setEditing(false)
    onLabelSaved?.(groupKey, next)
    fetch('/api/screen-texts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ screen_id: 'flow-group-labels', text_key: groupKey, content: next }),
    }).catch(() => {})
  }

  if (editing) {
    return (
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <input
          type="text"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') {
              setTemp(label)
              setEditing(false)
            }
          }}
          autoFocus
          style={{
            flex: 1,
            minWidth: 0,
            padding: '2px 6px',
            fontSize: 11,
            fontWeight: 500,
            border: '1px solid var(--fm-border-strong)',
            borderRadius: 4,
            background: 'var(--fm-control-bg)',
            color: 'var(--fm-text)',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={save}
          style={{ border: 'none', background: '#fbbf24', borderRadius: 3, padding: '2px 6px', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}
        >
          ✓
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
      <span style={{ color: 'var(--fm-text)', fontSize: 11, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setEditing(true)
        }}
        onMouseDown={(e) => e.stopPropagation()}
        title="Edit section name"
        style={{
          border: 'none',
          background: 'transparent',
          color: 'var(--fm-text-faint)',
          cursor: 'pointer',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--fm-text-soft)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--fm-text-faint)' }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
    </div>
  )
}

function EditableSectionTitle({ sectionId, initialTitle, onTitleSaved }: { sectionId: string; initialTitle: string; onTitleSaved?: (id: string, title: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const [tempTitle, setTempTitle] = useState(initialTitle)

  useEffect(() => {
    setTitle(initialTitle)
    setTempTitle(initialTitle)
  }, [initialTitle])

  const save = () => {
    setTitle(tempTitle)
    setEditing(false)
    onTitleSaved?.(sectionId, tempTitle)
    fetch('/api/screen-texts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ screen_id: 'flow-section-title', text_key: sectionId, content: tempTitle }),
    }).catch(() => {})
  }

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {editing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
              if (e.key === 'Escape') { setTempTitle(title); setEditing(false) }
            }}
            autoFocus
            style={{
              width: 360,
              padding: '4px 10px',
              fontSize: 20,
              fontWeight: 700,
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '-0.02em',
              border: '1px solid var(--fm-border-strong)',
              borderRadius: 6,
              background: 'var(--fm-control-bg)',
              color: 'var(--fm-text)',
              outline: 'none',
            }}
          />
          <button
            onClick={save}
            style={{ border: 'none', background: '#fbbf24', borderRadius: 4, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            ✓
          </button>
          <button
            onClick={() => { setTempTitle(title); setEditing(false) }}
            style={{ border: '1px solid var(--fm-control-border)', background: 'transparent', borderRadius: 4, padding: '4px 10px', fontSize: 12, color: 'var(--fm-text-muted)', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      ) : (
        <>
          <h2 style={{
            color: 'var(--fm-text)',
            fontSize: 22,
            fontWeight: 700,
            fontFamily: 'system-ui, sans-serif',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            {title}
          </h2>
          <button
            onClick={() => setEditing(true)}
            title="Edit title"
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--fm-text-faint)',
              cursor: 'pointer',
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--fm-text-soft)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--fm-text-faint)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

function FigmaIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 57" fill="none">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
    </svg>
  )
}

function FigmaSourceLink({
  storageKey,
  initialUrl,
  variant = 'inline',
  onSave,
}: {
  storageKey: string
  initialUrl: string
  variant?: 'inline' | 'sidebar'
  onSave: (key: string, url: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [url, setUrl] = useState(initialUrl)
  const [tempUrl, setTempUrl] = useState(initialUrl)

  useEffect(() => {
    setUrl(initialUrl)
    if (!editing) setTempUrl(initialUrl)
  }, [initialUrl, editing])

  const commit = () => {
    const next = tempUrl.trim()
    setUrl(next)
    setEditing(false)
    onSave(storageKey, next)
  }

  const cancel = () => {
    setTempUrl(url)
    setEditing(false)
  }

  const isSidebar = variant === 'sidebar'
  const hasUrl = Boolean(url.trim())

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: isSidebar ? 8 : 6, width: isSidebar ? '100%' : undefined }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {editing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: isSidebar ? '100%' : undefined }}>
          <input
            type="text"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit()
              if (e.key === 'Escape') cancel()
            }}
            autoFocus
            placeholder="https://www.figma.com/design/..."
            style={{
              flex: isSidebar ? 1 : undefined,
              width: isSidebar ? undefined : 280,
              padding: isSidebar ? '7px 8px' : '3px 6px',
              fontSize: isSidebar ? 11 : 10,
              fontFamily: 'system-ui, sans-serif',
              border: '1px solid var(--fm-border-strong)',
              borderRadius: isSidebar ? 8 : 4,
              background: 'var(--fm-control-bg)',
              color: 'var(--fm-text)',
              outline: 'none',
              minWidth: 0,
            }}
          />
          <button
            onClick={commit}
            style={{ border: 'none', background: '#fbbf24', borderRadius: 3, padding: '2px 6px', fontSize: 9, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
          >
            ✓
          </button>
          <button
            onClick={cancel}
            style={{ border: '1px solid var(--fm-control-border)', background: 'transparent', borderRadius: 3, padding: '2px 6px', fontSize: 9, color: 'var(--fm-text-muted)', cursor: 'pointer', flexShrink: 0 }}
          >
            ✕
          </button>
        </div>
      ) : hasUrl ? (
        <>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isSidebar ? 8 : 4,
              padding: isSidebar ? '7px 10px' : '2px 8px',
              borderRadius: isSidebar ? 8 : 4,
              border: '1px solid var(--fm-border)',
              background: 'var(--fm-hover)',
              color: isSidebar ? '#a78bfa' : 'var(--fm-text-muted)',
              fontSize: isSidebar ? 11 : 10,
              fontWeight: isSidebar ? 500 : 400,
              textDecoration: 'none',
              fontFamily: 'system-ui, sans-serif',
              transition: 'all 0.15s',
              flex: isSidebar ? 1 : undefined,
              minWidth: 0,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              if (isSidebar) {
                el.style.background = 'rgba(167,139,250,0.1)'
                el.style.borderColor = 'rgba(167,139,250,0.3)'
              } else {
                el.style.background = 'rgba(255,255,255,0.1)'
                el.style.color = '#fff'
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              if (isSidebar) {
                el.style.background = 'rgba(255,255,255,0.04)'
                el.style.borderColor = 'rgba(255,255,255,0.12)'
              } else {
                el.style.background = 'rgba(255,255,255,0.05)'
                el.style.color = 'rgba(255,255,255,0.6)'
              }
            }}
          >
            <FigmaIcon size={isSidebar ? 13 : 10} />
            {isSidebar ? 'Figma Source' : 'Figma'}
            {isSidebar && (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', opacity: 0.6 }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            )}
          </a>
          <button
            onClick={() => setEditing(true)}
            title="Edit Figma URL"
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--fm-text-faint)',
              cursor: 'pointer',
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--fm-text-soft)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--fm-text-faint)' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </>
      ) : (
        <button
          onClick={() => setEditing(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isSidebar ? 8 : 4,
            padding: isSidebar ? '7px 10px' : '2px 8px',
            borderRadius: isSidebar ? 8 : 4,
            border: '1px dashed var(--fm-control-border)',
            background: 'transparent',
            color: isSidebar ? 'rgba(167,139,250,0.85)' : 'var(--fm-text-muted)',
            fontSize: isSidebar ? 11 : 10,
            fontWeight: isSidebar ? 500 : 400,
            cursor: 'pointer',
            fontFamily: 'system-ui, sans-serif',
            width: isSidebar ? '100%' : undefined,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(167,139,250,0.45)'
            el.style.color = '#a78bfa'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(255,255,255,0.2)'
            el.style.color = isSidebar ? 'rgba(167,139,250,0.85)' : 'rgba(255,255,255,0.45)'
          }}
        >
          <FigmaIcon size={isSidebar ? 13 : 10} />
          {isSidebar ? '+ Add Figma Source' : '+ Figma'}
        </button>
      )}
    </div>
  )
}
