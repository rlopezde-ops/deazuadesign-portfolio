import { NextResponse } from 'next/server'
import { getEnv, isDevMode } from '@/lib/dev-env'

/** Public status — no secrets. Used by Subscribe UI so it doesn't lie. */
export async function GET() {
  return NextResponse.json({
    databaseConfigured: Boolean(getEnv('DATABASE_URL')),
    emailConfigured: Boolean(getEnv('BREVO_API_KEY')),
    isDev: isDevMode(),
  })
}
