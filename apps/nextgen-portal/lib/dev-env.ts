import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export type DevRuntimeEnv = {
  DATABASE_URL?: string
  BREVO_API_KEY?: string
  BREVO_SENDER_EMAIL?: string
  BREVO_FROM_NAME?: string
  NEXT_PUBLIC_APP_URL?: string
}

const RUNTIME_FILE = '.flow-map.dev.json'
const ENV_LOCAL = '.env.local'

export function isDevMode() {
  return process.env.NODE_ENV === 'development'
}

/** Read-only Dev status OK for template showcase prod; setup writes stay assertDev(). */
export function allowDevStatusApi() {
  return (
    process.env.NEXT_PUBLIC_FLOW_MAP_TEMPLATE_TOOLS === '1' || isDevMode()
  )
}

export function assertDev() {
  if (!isDevMode()) {
    throw new Error('Dev endpoints are only available in development')
  }
}

function appRoot() {
  return process.cwd()
}

export function runtimeEnvPath() {
  return join(appRoot(), RUNTIME_FILE)
}

export function envLocalPath() {
  return join(appRoot(), ENV_LOCAL)
}

export function readRuntimeEnv(): DevRuntimeEnv {
  try {
    const raw = readFileSync(runtimeEnvPath(), 'utf8')
    return JSON.parse(raw) as DevRuntimeEnv
  } catch {
    return {}
  }
}

export function getEnv(key: keyof DevRuntimeEnv): string | undefined {
  const fromProcess = process.env[key]
  if (fromProcess) return fromProcess
  if (!isDevMode()) return undefined
  const runtime = readRuntimeEnv()
  const value = runtime[key]
  return value?.trim() || undefined
}

export function mergeEnvLocal(updates: DevRuntimeEnv) {
  const path = envLocalPath()
  let existing = ''
  if (existsSync(path)) {
    existing = readFileSync(path, 'utf8')
  }

  const lines = existing.split(/\r?\n/)
  const keys = Object.keys(updates) as (keyof DevRuntimeEnv)[]
  const seen = new Set<string>()

  const nextLines = lines
    .map((line) => {
      const match = line.match(/^([A-Z0-9_]+)=/)
      if (!match) return line
      const key = match[1] as keyof DevRuntimeEnv
      if (!(key in updates)) return line
      seen.add(key)
      const value = updates[key]
      if (value === undefined || value === '') return null
      return `${key}=${value}`
    })
    .filter((line): line is string => line !== null)

  for (const key of keys) {
    const value = updates[key]
    if (value === undefined || value === '' || seen.has(key)) continue
    nextLines.push(`${key}=${value}`)
  }

  const content = `${nextLines.filter((l) => l.trim().length > 0 || l === '').join('\n').replace(/\n*$/, '\n')}`
  writeFileSync(path, content, 'utf8')
}

export function mergeRuntimeEnv(updates: DevRuntimeEnv) {
  const current = readRuntimeEnv()
  const next: DevRuntimeEnv = { ...current }
  for (const [key, value] of Object.entries(updates) as [keyof DevRuntimeEnv, string | undefined][]) {
    if (value === undefined) continue
    if (value === '') {
      delete next[key]
    } else {
      next[key] = value
    }
  }
  writeFileSync(runtimeEnvPath(), `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  return next
}

export function maskSecret(value?: string) {
  if (!value) return null
  if (value.length <= 8) return '••••••••'
  return `${value.slice(0, 4)}…${value.slice(-4)}`
}
