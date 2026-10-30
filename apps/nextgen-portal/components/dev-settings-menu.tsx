'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useIsMobile } from '@/lib/use-is-mobile'
import { showTemplateTools } from '@/lib/show-template-tools'

type DevStatus = {
  neon: {
    configured: boolean
    connected: boolean
    error: string | null
    maskedUrl: string | null
    source: string | null
  }
  brevo: {
    configured: boolean
    maskedKey: string | null
    senderEmail: string
    fromName: string
    appUrl: string
    source: string | null
  }
  files: { envLocalExists: boolean; runtimeExists: boolean }
  links: {
    neonConsole: string
    neonDocs: string
    brevoSignup: string
    brevoApiKeys: string
  }
  neonSetupPrompt?: string
  brevoSetupPrompt?: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '7px 10px',
  fontSize: 12,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 6,
  background: 'rgba(0,0,0,0.35)',
  color: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
}

const secondaryBtn: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(255,255,255,0.06)',
  borderRadius: 6,
  padding: '6px 10px',
  fontSize: 11,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.85)',
  cursor: 'pointer',
  fontFamily: 'system-ui, sans-serif',
}

const primaryBtn: React.CSSProperties = {
  ...secondaryBtn,
  background: 'rgba(74,222,128,0.15)',
  borderColor: 'rgba(74,222,128,0.45)',
  color: '#4ade80',
}

function StatusDot({ ok, warn }: { ok: boolean; warn?: boolean }) {
  const color = ok ? '#4ade80' : warn ? '#fbbf24' : '#f87171'
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 8px ${color}`,
        flexShrink: 0,
      }}
    />
  )
}

function GearIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export const FLOW_MAP_OPEN_DEV_MENU = 'flow-map-open-dev-menu'

export type DevMenuSection = 'neon' | 'brevo'

/** Open the header Dev integrations menu from anywhere (notes/email setup hints). */
export function openFlowMapDevMenu(section?: DevMenuSection) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent(FLOW_MAP_OPEN_DEV_MENU, { detail: { section: section || null } }),
  )
}

export function DevSettingsMenu({
  fullWidthTrigger = false,
  hideTrigger = false,
}: {
  fullWidthTrigger?: boolean
  /** Keep mounted for openFlowMapDevMenu / sheet, but don't show the Dev button. */
  hideTrigger?: boolean
} = {}) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [panelVisible, setPanelVisible] = useState(false)
  const [status, setStatus] = useState<DevStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [databaseUrl, setDatabaseUrl] = useState('')
  const [brevoKey, setBrevoKey] = useState('')
  const [senderEmail, setSenderEmail] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const [neonOpen, setNeonOpen] = useState(false)
  const [brevoOpen, setBrevoOpen] = useState(false)
  const [showManualNeon, setShowManualNeon] = useState(false)
  const [showManualBrevo, setShowManualBrevo] = useState(false)
  const [whatNeedsWhatOpen, setWhatNeedsWhatOpen] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState<'neon' | 'brevo' | null>(null)
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onOpen = (e: Event) => {
      const section = (e as CustomEvent<{ section?: DevMenuSection | null }>).detail?.section
      setOpen(true)
      if (section === 'neon') {
        setNeonOpen(true)
        setBrevoOpen(false)
      } else if (section === 'brevo') {
        setBrevoOpen(true)
        setNeonOpen(false)
      }
    }
    window.addEventListener(FLOW_MAP_OPEN_DEV_MENU, onOpen)
    return () => window.removeEventListener(FLOW_MAP_OPEN_DEV_MENU, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    window.dispatchEvent(new CustomEvent('flow-map-dev-panel-open'))
  }, [open])

  const copyPrompt = async (kind: 'neon' | 'brevo', text?: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedPrompt(kind)
      setTimeout(() => setCopiedPrompt(null), 1600)
    } catch {
      setError('Clipboard blocked — expand manual setup and use that path instead.')
    }
  }

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/dev/status')
      if (res.status === 404) {
        setStatus(null)
        return
      }
      if (!res.ok) throw new Error('Failed to load status')
      const data = (await res.json()) as DevStatus
      setStatus(data)
      setSenderEmail(data.brevo.senderEmail || '')
      if (!data.neon.configured) setNeonOpen(true)
      if (!data.brevo.configured) setBrevoOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) refresh()
  }, [open, refresh])

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => setPanelVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (isMobile) return // sheet has its own backdrop / close
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, isMobile])

  useEffect(() => {
    if (!isMobile || !open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isMobile, open])

  const postAction = async (action: string, payload: Record<string, string> = {}) => {
    if (process.env.NODE_ENV !== 'development') {
      setError('Setup writes only work in local development — not on the template production deploy.')
      return null
    }
    setBusy(action)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch('/api/dev/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setMessage(data.message || (data.ok ? 'Done' : JSON.stringify(data)))
      if (action === 'save-credentials') {
        setDatabaseUrl('')
        setBrevoKey('')
      }
      await refresh()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
      return null
    } finally {
      setBusy(null)
    }
  }

  if (!showTemplateTools()) return null

  const neonOk = Boolean(status?.neon.connected)
  const neonWarn = Boolean(status?.neon.configured && !status?.neon.connected)
  const brevoOk = Boolean(status?.brevo.configured)
  const localDev = process.env.NODE_ENV === 'development'

  const panelBody = (
    <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: '#fff', fontSize: isMobile ? 16 : 13, fontWeight: 700 }}>Dev integrations</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: isMobile ? 12 : 11, marginTop: 2 }}>
                {localDev
                  ? 'Local setup — Neon + Brevo'
                  : 'Template showcase — status is read-only here; write setup in local dev'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button type="button" onClick={refresh} style={secondaryBtn} disabled={loading}>
                {loading ? '…' : 'Refresh'}
              </button>
              {isMobile && (
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  style={{ ...secondaryBtn, padding: '6px 10px' }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              marginBottom: 12,
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => setWhatNeedsWhatOpen((v) => !v)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                background: 'transparent',
                border: 'none',
                padding: '9px 11px',
                cursor: 'pointer',
                color: '#fff',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700 }}>What needs what</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 500 }}>
                {whatNeedsWhatOpen ? 'Hide' : 'Show'}
              </span>
            </button>
            <div
              style={{
                display: 'grid',
                gridTemplateRows: whatNeedsWhatOpen ? '1fr' : '0fr',
                opacity: whatNeedsWhatOpen ? 1 : 0,
                transition: 'grid-template-rows 0.22s ease, opacity 0.22s ease',
              }}
            >
              <div style={{ overflow: 'hidden', minHeight: 0 }}>
                <div
                  style={{
                    padding: '0 11px 10px',
                    color: 'rgba(255,255,255,0.72)',
                    fontSize: 11,
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Shipped in code (no Neon):</span>{' '}
                    screens, default connectors, and labels you commit in the flow config and deploy to Vercel. Refresh-safe for everyone who opens the link.
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Live edits in the browser (need Neon):</span>{' '}
                    Save Position, connectors you draw here, notes, and in-app notifications. Without a DB those only exist in this session — they won&apos;t stick after reload or show up for teammates.
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Brevo — email alerts (optional):</span>{' '}
                    powers two things: (1) direct emails when someone replies to your note or @mentions you, and (2) the{' '}
                    <span style={{ color: 'rgba(255,255,255,0.85)' }}>Subscribe</span> button, which lets anyone opt in to an
                    email for every new note and reply on the map. Both need Neon too (to store notes + who&apos;s subscribed).
                    Skip Brevo if you don&apos;t care about inbox alerts — in-app notifications still work with just Neon.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Neon */}
          <section
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <button
              type="button"
              onClick={() => setNeonOpen((v) => !v)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              <StatusDot ok={neonOk} warn={neonWarn} />
              <span style={{ fontSize: 12, fontWeight: 700, flex: 1, textAlign: 'left' }}>Neon database</span>
              <span style={{ fontSize: 11, color: neonOk ? '#4ade80' : neonWarn ? '#fbbf24' : '#f87171' }}>
                {neonOk ? 'Connected' : status?.neon.configured ? 'Configured, not connected' : 'Not configured'}
              </span>
            </button>
            <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
              Shared backend for live map edits (positions, drawn connectors, notes). Not required to ship a static flow from code → Vercel.
            </div>

            {status?.neon.maskedUrl && (
              <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'ui-monospace, monospace' }}>
                {status.neon.maskedUrl} · {status.neon.source}
              </div>
            )}
            {status?.neon.error && (
              <div style={{ marginTop: 6, fontSize: 11, color: '#f87171' }}>{status.neon.error}</div>
            )}

            {neonOpen && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div
                  style={{
                    background: 'rgba(74,222,128,0.08)',
                    border: '1px solid rgba(74,222,128,0.28)',
                    borderRadius: 8,
                    padding: '10px 11px',
                  }}
                >
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    Recommended: IDE agent prompt
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, lineHeight: 1.45, marginBottom: 10 }}>
                    Copy this, paste into your IDE agent chat. It will auth Neon / create a DB,
                    write <code style={{ color: 'rgba(255,255,255,0.75)' }}>.env.local</code>, and bootstrap tables.
                    You only intervene if login is required.
                  </div>
                  <button
                    type="button"
                    style={{
                      ...primaryBtn,
                      width: '100%',
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                    disabled={!status?.neonSetupPrompt}
                    onClick={() => copyPrompt('neon', status?.neonSetupPrompt)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    {copiedPrompt === 'neon' ? 'Copied — paste into your IDE' : 'Copy Neon setup prompt'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowManualNeon((v) => !v)}
                  style={{
                    ...secondaryBtn,
                    alignSelf: 'flex-start',
                    background: 'transparent',
                    borderColor: 'rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 500,
                  }}
                >
                  {showManualNeon ? 'Hide manual paste' : 'Or paste connection string manually'}
                </button>

                {showManualNeon && (
                  <>
                    <ol style={{ margin: 0, paddingLeft: 16, color: 'rgba(255,255,255,0.6)', fontSize: 11, lineHeight: 1.55 }}>
                      <li>
                        Create a free Neon project{' '}
                        <a href={status?.links.neonConsole || 'https://console.neon.tech/signup'} target="_blank" rel="noreferrer" style={{ color: '#93c5fd' }}>
                          console.neon.tech <ExternalIcon />
                        </a>
                      </li>
                      <li>Copy the <strong style={{ color: '#fff' }}>pooled</strong> connection string</li>
                      <li>Paste below → Save → Bootstrap tables</li>
                    </ol>
                    <input
                      type="password"
                      value={databaseUrl}
                      onChange={(e) => setDatabaseUrl(e.target.value)}
                      placeholder="postgresql://…neon.tech/neondb?sslmode=require"
                      style={inputStyle}
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      <button
                        type="button"
                        style={primaryBtn}
                        disabled={busy !== null || !databaseUrl.trim()}
                        onClick={() => postAction('save-credentials', { DATABASE_URL: databaseUrl.trim() })}
                      >
                        {busy === 'save-credentials' ? 'Saving…' : 'Save & test'}
                      </button>
                      <button
                        type="button"
                        style={secondaryBtn}
                        disabled={busy !== null || !status?.neon.configured}
                        onClick={() => postAction('bootstrap-tables')}
                      >
                        {busy === 'bootstrap-tables' ? 'Bootstrapping…' : 'Bootstrap tables'}
                      </button>
                      <button
                        type="button"
                        style={secondaryBtn}
                        disabled={busy !== null}
                        onClick={() => postAction('test-neon', databaseUrl.trim() ? { DATABASE_URL: databaseUrl.trim() } : {})}
                      >
                        Test connection
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>

          {/* Brevo */}
          <section
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <button
              type="button"
              onClick={() => setBrevoOpen((v) => !v)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              <StatusDot ok={brevoOk} />
              <span style={{ fontSize: 12, fontWeight: 700, flex: 1, textAlign: 'left' }}>Brevo email API</span>
              <span style={{ fontSize: 11, color: brevoOk ? '#4ade80' : 'rgba(255,255,255,0.45)' }}>
                {brevoOk ? 'Configured' : 'Optional · not set'}
              </span>
            </button>
            <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
              Sends email for note activity (@mentions, replies, subscribe). Purely optional — the map and notes UI work without it.
            </div>

            {status?.brevo.maskedKey && (
              <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'ui-monospace, monospace' }}>
                {status.brevo.maskedKey} · {status.brevo.source}
              </div>
            )}

            {brevoOpen && (
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div
                  style={{
                    background: 'rgba(74,222,128,0.08)',
                    border: '1px solid rgba(74,222,128,0.28)',
                    borderRadius: 8,
                    padding: '10px 11px',
                  }}
                >
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    Recommended: IDE agent prompt
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, lineHeight: 1.45, marginBottom: 10 }}>
                    Copy this into your IDE agent. It will walk Brevo login / API key creation, then write{' '}
                    <code style={{ color: 'rgba(255,255,255,0.75)' }}>.env.local</code> itself.
                    You’ll only paste the key once if the agent can’t reach your Brevo account.
                  </div>
                  <button
                    type="button"
                    style={{
                      ...primaryBtn,
                      width: '100%',
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                    disabled={!status?.brevoSetupPrompt}
                    onClick={() => copyPrompt('brevo', status?.brevoSetupPrompt)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    {copiedPrompt === 'brevo' ? 'Copied — paste into your IDE' : 'Copy Brevo setup prompt'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowManualBrevo((v) => !v)}
                  style={{
                    ...secondaryBtn,
                    alignSelf: 'flex-start',
                    background: 'transparent',
                    borderColor: 'rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 500,
                  }}
                >
                  {showManualBrevo ? 'Hide manual paste' : 'Or paste API key manually'}
                </button>

                {showManualBrevo && (
                  <>
                    <ol style={{ margin: 0, paddingLeft: 16, color: 'rgba(255,255,255,0.6)', fontSize: 11, lineHeight: 1.55 }}>
                      <li>
                        Sign up / open{' '}
                        <a href={status?.links.brevoApiKeys || 'https://app.brevo.com/settings/keys/api'} target="_blank" rel="noreferrer" style={{ color: '#93c5fd' }}>
                          Brevo API keys <ExternalIcon />
                        </a>
                      </li>
                      <li>Create an API key and paste it below</li>
                      <li>Use a verified sender email in your Brevo account</li>
                    </ol>
                    <input
                      type="password"
                      value={brevoKey}
                      onChange={(e) => setBrevoKey(e.target.value)}
                      placeholder="xkeysib-…"
                      style={inputStyle}
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="Sender email (verified in Brevo)"
                      style={{ ...inputStyle, fontFamily: 'system-ui, sans-serif' }}
                    />
                    <button
                      type="button"
                      style={primaryBtn}
                      disabled={busy !== null || (!brevoKey.trim() && !senderEmail.trim())}
                      onClick={() =>
                        postAction('save-credentials', {
                          ...(brevoKey.trim() ? { BREVO_API_KEY: brevoKey.trim() } : {}),
                          ...(senderEmail.trim() ? { BREVO_SENDER_EMAIL: senderEmail.trim() } : {}),
                          NEXT_PUBLIC_APP_URL: status?.brevo.appUrl || 'http://localhost:3007',
                        })
                      }
                    >
                      {busy === 'save-credentials' ? 'Saving…' : 'Save Brevo settings'}
                    </button>
                  </>
                )}
              </div>
            )}
          </section>

          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.45 }}>
            Writes <code style={{ color: 'rgba(255,255,255,0.55)' }}>.env.local</code> +{' '}
            <code style={{ color: 'rgba(255,255,255,0.55)' }}>.flow-map.dev.json</code> (gitignored).
            Runtime file applies immediately; restart <code style={{ color: 'rgba(255,255,255,0.55)' }}>pnpm dev</code> to load env into Next&apos;s process cache.
          </div>

          {message && (
            <div style={{ marginTop: 10, fontSize: 11, color: '#4ade80', lineHeight: 1.4 }}>{message}</div>
          )}
          {error && (
            <div style={{ marginTop: 10, fontSize: 11, color: '#f87171', lineHeight: 1.4 }}>{error}</div>
          )}
    </>
  )

  const mobileSheet =
    mounted &&
    (open || panelVisible) &&
    createPortal(
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(8,8,16,0.72)',
          opacity: open && panelVisible ? 1 : 0,
          transition: 'opacity 0.18s ease',
          pointerEvents: open && panelVisible ? 'auto' : 'none',
        }}
        onClick={() => setOpen(false)}
      >
        <div
          ref={panelRef}
          onClick={(e) => e.stopPropagation()}
          onTransitionEnd={(e) => {
            if (e.propertyName === 'transform' && !open) setPanelVisible(false)
          }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 'max(8vh, env(safe-area-inset-top, 0px))',
            background: 'rgba(20,20,36,0.99)',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 -12px 40px rgba(0,0,0,0.5)',
            padding: '14px 14px calc(18px + env(safe-area-inset-bottom, 0px))',
            overflowX: 'hidden',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            fontFamily: 'system-ui, sans-serif',
            transform: open && panelVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'transform 0.2s ease',
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: '100vw',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
          }}
        >
          {panelBody}
        </div>
      </div>,
      document.body,
    )

  const desktopPanel =
    !isMobile &&
    (open || panelVisible) && (
      <div
        ref={panelRef}
        onTransitionEnd={(e) => {
          if (e.propertyName === 'opacity' && !open) setPanelVisible(false)
        }}
        style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          left: 0,
          width: 420,
          maxWidth: 'min(420px, calc(100vw - 24px))',
          maxHeight: 'min(70vh, 640px)',
          overflowX: 'hidden',
          overflowY: 'auto',
          background: 'rgba(20,20,36,0.98)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 12,
          boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
          padding: 14,
          zIndex: 200,
          fontFamily: 'system-ui, sans-serif',
          opacity: open && panelVisible ? 1 : 0,
          transform: open && panelVisible ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.97)',
          transformOrigin: 'top left',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          pointerEvents: open && panelVisible ? 'auto' : 'none',
          boxSizing: 'border-box',
        }}
      >
        {panelBody}
      </div>
    )

  return (
    <div
      ref={rootRef}
      style={{
        position: 'relative',
        marginLeft: hideTrigger ? 0 : fullWidthTrigger || isMobile ? 0 : 8,
        width: hideTrigger ? 0 : fullWidthTrigger || isMobile ? '100%' : undefined,
        height: hideTrigger ? 0 : undefined,
        overflow: hideTrigger ? 'visible' : undefined,
      }}
    >
      {!hideTrigger && (
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Dev settings"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: fullWidthTrigger || isMobile ? 'space-between' : 'flex-start',
          gap: 6,
          border: open ? '1px solid rgba(251,191,36,0.5)' : '1px solid rgba(255,255,255,0.2)',
          background: open ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.06)',
          borderRadius: fullWidthTrigger || isMobile ? 10 : 8,
          padding: fullWidthTrigger || isMobile ? '10px 14px' : '5px 10px',
          color: open ? '#fbbf24' : 'rgba(255,255,255,0.75)',
          cursor: 'pointer',
          fontSize: fullWidthTrigger || isMobile ? 13 : 11,
          fontWeight: 600,
          fontFamily: 'system-ui, sans-serif',
          width: fullWidthTrigger || isMobile ? '100%' : undefined,
          boxSizing: 'border-box',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <GearIcon size={fullWidthTrigger || isMobile ? 16 : 14} />
          Dev
        </span>
        <span style={{ display: 'flex', gap: 4, marginLeft: 2 }}>
          <StatusDot ok={neonOk} warn={neonWarn} />
          <StatusDot ok={brevoOk} />
        </span>
      </button>
      )}

      {isMobile ? mobileSheet : desktopPanel}
    </div>
  )
}
