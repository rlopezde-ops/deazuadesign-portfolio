export const FLOW_THEME_STORAGE_KEY = 'flow-map-theme-bg'
export const FLOW_THEME_DB_KEY = 'theme-bg'
export const FLOW_THEME_SCREEN_ID = 'flow-map-meta'
/** Original Flow Map field — default. */
export const DEFAULT_THEME_BG = '#1a1a2e'

export type ThemePreset = {
  id: string
  label: string
  mode: 'dark' | 'light'
  color: string
}

/**
 * Tight, usable field colors — not pastel junk / not near-identical blacks.
 * Dark: deep neutrals that keep screens readable.
 * Light: clean gallery surfaces (near-white, not muddy gray-green).
 */
export const THEME_PRESETS: ThemePreset[] = [
  { id: 'classic', label: 'Classic', mode: 'dark', color: '#1a1a2e' },
  { id: 'void', label: 'Void', mode: 'dark', color: '#0c0c0e' },
  { id: 'graphite', label: 'Graphite', mode: 'dark', color: '#1e1e22' },
  { id: 'slate', label: 'Slate', mode: 'dark', color: '#171c24' },
  { id: 'snow', label: 'Snow', mode: 'light', color: '#ffffff' },
  { id: 'sky', label: 'Sky', mode: 'light', color: '#d7e6fb' },
  { id: 'mint', label: 'Mint', mode: 'light', color: '#d5f0e3' },
  { id: 'sand', label: 'Sand', mode: 'light', color: '#f3e2c7' },
]

export type FlowThemeCssVars = Record<`--fm-${string}`, string>

function clampByte(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}

export function parseHex(color: string): { r: number; g: number; b: number } | null {
  const raw = color.trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    return {
      r: parseInt(raw[0] + raw[0], 16),
      g: parseInt(raw[1] + raw[1], 16),
      b: parseInt(raw[2] + raw[2], 16),
    }
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) {
    return {
      r: parseInt(raw.slice(0, 2), 16),
      g: parseInt(raw.slice(2, 4), 16),
      b: parseInt(raw.slice(4, 6), 16),
    }
  }
  return null
}

export function hexToRgba(color: string, alpha: number): string {
  const rgb = parseHex(color)
  if (!rgb) return color
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

/** Relative luminance (WCAG). */
export function relativeLuminance(color: string): number {
  const rgb = parseHex(color)
  if (!rgb) return 0
  const lin = [rgb.r, rgb.g, rgb.b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

export function isLightColor(color: string): boolean {
  return relativeLuminance(color) > 0.55
}

export function normalizeHex(color: string): string {
  const rgb = parseHex(color)
  if (!rgb) return DEFAULT_THEME_BG
  return `#${[rgb.r, rgb.g, rgb.b].map((n) => clampByte(n).toString(16).padStart(2, '0')).join('')}`
}

export function loadStoredThemeBg(): string {
  if (typeof window === 'undefined') return DEFAULT_THEME_BG
  try {
    const stored = localStorage.getItem(FLOW_THEME_STORAGE_KEY)?.trim()
    if (stored && parseHex(stored)) return normalizeHex(stored)
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME_BG
}

export function saveThemeBgLocal(color: string) {
  try {
    localStorage.setItem(FLOW_THEME_STORAGE_KEY, normalizeHex(color))
  } catch {
    /* ignore */
  }
}

/** CSS variables for Flow Map chrome, canvas field, sidebar, notifications. */
export function buildThemeCssVars(bgInput: string): FlowThemeCssVars {
  const bg = normalizeHex(bgInput)
  const light = isLightColor(bg)

  if (light) {
    return {
      '--fm-bg': bg,
      '--fm-surface': hexToRgba(bg, 0.97),
      '--fm-surface-solid': bg,
      '--fm-text': '#141414',
      '--fm-text-muted': 'rgba(20, 20, 20, 0.55)',
      '--fm-text-faint': 'rgba(20, 20, 20, 0.38)',
      '--fm-text-soft': 'rgba(20, 20, 20, 0.78)',
      '--fm-border': 'rgba(0, 0, 0, 0.1)',
      '--fm-border-strong': 'rgba(0, 0, 0, 0.18)',
      '--fm-control-bg': 'rgba(0, 0, 0, 0.05)',
      '--fm-control-border': 'rgba(0, 0, 0, 0.12)',
      '--fm-hover': 'rgba(0, 0, 0, 0.05)',
      '--fm-divider': 'rgba(0, 0, 0, 0.07)',
      '--fm-shadow': '0 8px 28px rgba(0, 0, 0, 0.1)',
      '--fm-mode': 'light',
    }
  }

  return {
    '--fm-bg': bg,
    '--fm-surface': hexToRgba(bg, 0.95),
    '--fm-surface-solid': bg,
    '--fm-text': '#ffffff',
    '--fm-text-muted': 'rgba(255, 255, 255, 0.5)',
    '--fm-text-faint': 'rgba(255, 255, 255, 0.35)',
    '--fm-text-soft': 'rgba(255, 255, 255, 0.8)',
    '--fm-border': 'rgba(255, 255, 255, 0.12)',
    '--fm-border-strong': 'rgba(255, 255, 255, 0.2)',
    '--fm-control-bg': 'rgba(255, 255, 255, 0.1)',
    '--fm-control-border': 'rgba(255, 255, 255, 0.2)',
    '--fm-hover': 'rgba(255, 255, 255, 0.08)',
    '--fm-divider': 'rgba(255, 255, 255, 0.08)',
    '--fm-shadow': '0 8px 32px rgba(0, 0, 0, 0.5)',
    '--fm-mode': 'dark',
  }
}
