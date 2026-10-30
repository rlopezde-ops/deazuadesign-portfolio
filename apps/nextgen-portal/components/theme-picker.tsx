'use client'

import { useEffect, useRef, useState } from 'react'
import {
  THEME_PRESETS,
  isLightColor,
  normalizeHex,
  type ThemePreset,
} from '@/lib/flow-map-theme'

type ThemePickerProps = {
  color: string
  onChange: (color: string) => void
  triggerStyle?: React.CSSProperties
  align?: 'left' | 'right'
}

const PRESET_SIZE = 22
const SWATCH_SIZE = 10
const PANEL_MS = 200

function PresetDot({
  preset,
  selected,
  onSelect,
}: {
  preset: ThemePreset
  selected: boolean
  onSelect: () => void
}) {
  const light = isLightColor(preset.color)
  return (
    <button
      type="button"
      title={preset.label}
      aria-label={preset.label}
      aria-pressed={selected}
      onClick={onSelect}
      style={{
        width: PRESET_SIZE,
        height: PRESET_SIZE,
        borderRadius: '50%',
        border: selected
          ? light
            ? '1.5px solid #141414'
            : '1.5px solid #fff'
          : light
            ? '1px solid rgba(0,0,0,0.14)'
            : '1px solid rgba(255,255,255,0.22)',
        background: preset.color,
        cursor: 'pointer',
        padding: 0,
        boxShadow: selected ? '0 0 0 1.5px rgba(251,191,36,0.85)' : 'none',
        flexShrink: 0,
      }}
    />
  )
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--fm-text-muted)',
  marginBottom: 8,
}

export function ThemePicker({
  color,
  onChange,
  triggerStyle,
  align = 'left',
}: ThemePickerProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const normalized = normalizeHex(color)
  const lightSwatch = isLightColor(normalized)
  const darkPresets = THEME_PRESETS.filter((p) => p.mode === 'dark')
  const lightPresets = THEME_PRESETS.filter((p) => p.mode === 'light')

  const showPanel = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setOpen(true)
    setMounted(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
  }

  const hidePanel = () => {
    setOpen(false)
    setVisible(false)
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setMounted(false)
      closeTimerRef.current = null
    }, PANEL_MS)
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) hidePanel()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hidePanel()
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <button
        type="button"
        aria-label="Theme"
        aria-expanded={open}
        title="Background theme"
        onClick={() => (open ? hidePanel() : showPanel())}
        style={{
          height: 28,
          borderRadius: 6,
          border: '1px solid var(--fm-control-border)',
          background: open ? 'var(--fm-hover)' : 'var(--fm-control-bg)',
          color: 'var(--fm-text)',
          fontSize: 11,
          fontWeight: 600,
          fontFamily: 'system-ui, sans-serif',
          cursor: 'pointer',
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          flexShrink: 0,
          boxShadow: open ? '0 0 0 1px rgba(251,191,36,0.55)' : 'none',
          ...triggerStyle,
        }}
      >
        <span
          aria-hidden
          style={{
            width: SWATCH_SIZE,
            height: SWATCH_SIZE,
            borderRadius: '50%',
            background: normalized,
            border: lightSwatch
              ? '1px solid rgba(0,0,0,0.2)'
              : '1px solid rgba(255,255,255,0.35)',
            flexShrink: 0,
          }}
        />
        Theme
      </button>

      {mounted && (
        <div
          role="dialog"
          aria-label="Choose background"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            [align === 'right' ? 'right' : 'left']: 0,
            width: 232,
            background: 'var(--fm-surface)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--fm-border)',
            borderRadius: 12,
            padding: '12px 14px',
            zIndex: 160,
            boxShadow: 'var(--fm-shadow)',
            color: 'var(--fm-text)',
            fontFamily: 'system-ui, sans-serif',
            opacity: visible ? 1 : 0,
            transform: visible
              ? 'translateY(0) scale(1)'
              : 'translateY(-8px) scale(0.96)',
            transformOrigin: align === 'right' ? 'top right' : 'top left',
            transition: `opacity ${PANEL_MS}ms ease, transform ${PANEL_MS}ms ease`,
            pointerEvents: visible ? 'auto' : 'none',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
            Background
          </div>

          <div style={sectionLabelStyle}>Dark</div>
          <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
            {darkPresets.map((preset) => (
              <PresetDot
                key={preset.id}
                preset={preset}
                selected={normalized === normalizeHex(preset.color)}
                onSelect={() => onChange(preset.color)}
              />
            ))}
          </div>

          <div style={sectionLabelStyle}>Light</div>
          <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
            {lightPresets.map((preset) => (
              <PresetDot
                key={preset.id}
                preset={preset}
                selected={normalized === normalizeHex(preset.color)}
                onSelect={() => onChange(preset.color)}
              />
            ))}
          </div>

          <div style={sectionLabelStyle}>Custom</div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
            }}
          >
            <input
              type="color"
              value={normalized}
              onChange={(e) => onChange(e.target.value)}
              style={{
                width: 32,
                height: 24,
                padding: 0,
                border: '1px solid var(--fm-border)',
                borderRadius: 6,
                background: 'transparent',
                cursor: 'pointer',
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: 'var(--fm-text-muted)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {normalized.toUpperCase()}
            </span>
          </label>
        </div>
      )}
    </div>
  )
}
