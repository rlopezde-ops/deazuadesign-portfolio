import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { bootstrapFlowMapTables } from '@/lib/bootstrap-schema'
import {
  assertDev,
  getEnv,
  isDevMode,
  mergeEnvLocal,
  mergeRuntimeEnv,
  type DevRuntimeEnv,
} from '@/lib/dev-env'
import { getDb } from '@/lib/db'

function unavailable() {
  return NextResponse.json({ error: 'Not available' }, { status: 404 })
}

export async function POST(req: NextRequest) {
  if (!isDevMode()) return unavailable()
  try {
    assertDev()
  } catch {
    return unavailable()
  }

  const body = await req.json()
  const action = body.action as string

  if (action === 'save-credentials') {
    const updates: DevRuntimeEnv = {}
    if (typeof body.DATABASE_URL === 'string') updates.DATABASE_URL = body.DATABASE_URL.trim()
    if (typeof body.BREVO_API_KEY === 'string') updates.BREVO_API_KEY = body.BREVO_API_KEY.trim()
    if (typeof body.BREVO_SENDER_EMAIL === 'string') updates.BREVO_SENDER_EMAIL = body.BREVO_SENDER_EMAIL.trim()
    if (typeof body.BREVO_FROM_NAME === 'string') updates.BREVO_FROM_NAME = body.BREVO_FROM_NAME.trim()
    if (typeof body.NEXT_PUBLIC_APP_URL === 'string') updates.NEXT_PUBLIC_APP_URL = body.NEXT_PUBLIC_APP_URL.trim()

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No credentials provided' }, { status: 400 })
    }

    // Runtime file → active on next request (no restart required for server routes)
    mergeRuntimeEnv(updates)
    // .env.local → persists across `pnpm dev` restarts
    mergeEnvLocal(updates)

    let neonOk = false
    let neonError: string | null = null
    const dbUrl = updates.DATABASE_URL || getEnv('DATABASE_URL')
    if (dbUrl) {
      try {
        const sql = neon(dbUrl)
        await sql`SELECT 1 AS ok`
        neonOk = true
      } catch (err) {
        neonError = err instanceof Error ? err.message : 'Connection failed'
      }
    }

    return NextResponse.json({
      ok: true,
      neonOk,
      neonError,
      message: 'Saved to .env.local and .flow-map.dev.json. Server routes pick this up immediately. Restart `pnpm dev` if a client/env cache looks stale.',
    })
  }

  if (action === 'test-neon') {
    const url = (typeof body.DATABASE_URL === 'string' && body.DATABASE_URL.trim()) || getEnv('DATABASE_URL')
    if (!url) {
      return NextResponse.json({ ok: false, error: 'DATABASE_URL not set' }, { status: 400 })
    }
    try {
      const sql = neon(url)
      await sql`SELECT 1 AS ok`
      return NextResponse.json({ ok: true })
    } catch (err) {
      return NextResponse.json({
        ok: false,
        error: err instanceof Error ? err.message : 'Connection failed',
      }, { status: 400 })
    }
  }

  if (action === 'bootstrap-tables') {
    const sql = await getDb()
    if (!sql) {
      return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 400 })
    }
    try {
      const tables = await bootstrapFlowMapTables(sql)
      return NextResponse.json({ ok: true, tables })
    } catch (err) {
      return NextResponse.json({
        ok: false,
        error: err instanceof Error ? err.message : 'Bootstrap failed',
      }, { status: 500 })
    }
  }

  if (action === 'clear-runtime') {
    mergeRuntimeEnv({
      DATABASE_URL: '',
      BREVO_API_KEY: '',
      BREVO_SENDER_EMAIL: '',
      BREVO_FROM_NAME: '',
      NEXT_PUBLIC_APP_URL: '',
    })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
}
