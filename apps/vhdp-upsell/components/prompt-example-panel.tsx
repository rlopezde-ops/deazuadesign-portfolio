'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  PLAYWRIGHT_FLOW_MAP_PROMPT,
  PLAYWRIGHT_PROMPT_DESCRIPTION,
} from '@/lib/prompt-examples'

type PromptExamplePanelProps = {
  open: boolean
  onClose: () => void
  anchorTop: number
}

export function PromptExamplePanel({
  open,
  onClose,
  anchorTop,
}: PromptExamplePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const panelHeight = `calc(100vh - ${anchorTop + 16}px)`

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const onPointerDown = (e: PointerEvent) => {
      if (panelRef.current?.contains(e.target as Node)) return
      onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open, onClose])

  const copyPrompt = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PLAYWRIGHT_FLOW_MAP_PROMPT)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [])

  const stopWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation()
  }, [])

  if (!open) return null

  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 109,
          background: 'rgba(0, 0, 0, 0.45)',
        }}
        onWheel={stopWheel}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Playwright prompt"
        onWheel={stopWheel}
        style={{
          position: 'fixed',
          top: anchorTop + 8,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(960px, calc(100vw - 32px))',
          height: panelHeight,
          maxHeight: panelHeight,
          zIndex: 110,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(22, 22, 40, 0.98)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span
            style={{
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Playwright prompt
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={copyPrompt}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.2)',
                background: copied
                  ? 'rgba(80, 200, 120, 0.2)'
                  : 'rgba(255,255,255,0.1)',
                color: copied ? '#86efac' : '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {copied ? 'Copied' : 'Copy prompt'}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                border: 'none',
                background: 'transparent',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                fontSize: 22,
                lineHeight: 1,
                padding: 4,
              }}
            >
              ×
            </button>
          </div>
        </div>

        <p
          style={{
            flexShrink: 0,
            margin: 0,
            padding: '12px 20px',
            color: 'rgba(255,255,255,0.45)',
            fontSize: 12,
            lineHeight: 1.45,
            fontFamily: 'system-ui, sans-serif',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {PLAYWRIGHT_PROMPT_DESCRIPTION} Replace{' '}
          <code style={{ color: 'rgba(255,255,255,0.65)' }}>[YOUR_APP_NAME]</code>,{' '}
          <code style={{ color: 'rgba(255,255,255,0.65)' }}>[YOUR_APP_FOLDER]</code>,{' '}
          <code style={{ color: 'rgba(255,255,255,0.65)' }}>[DEV_PORT]</code> before
          sending.
        </p>

        <pre
          onWheel={stopWheel}
          style={{
            flex: 1,
            minHeight: 0,
            margin: 0,
            padding: '16px 20px 20px',
            overflow: 'auto',
            overscrollBehavior: 'contain',
            background: 'rgba(0,0,0,0.25)',
            color: 'rgba(255,255,255,0.88)',
            fontSize: 12,
            lineHeight: 1.55,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
        >
          {PLAYWRIGHT_FLOW_MAP_PROMPT}
        </pre>
      </div>
    </>
  )
}
