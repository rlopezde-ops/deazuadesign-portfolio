import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { existsSync } from 'fs'
import {
  envLocalPath,
  getEnv,
  allowDevStatusApi,
  maskSecret,
  readRuntimeEnv,
  runtimeEnvPath,
} from '@/lib/dev-env'
import { buildNeonSetupPrompt, buildBrevoSetupPrompt } from '@/lib/neon-setup-prompt'

export async function GET() {
  if (!allowDevStatusApi()) {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const databaseUrl = getEnv('DATABASE_URL')
  const brevoKey = getEnv('BREVO_API_KEY')
  const runtime = readRuntimeEnv()

  let neonConnected = false
  let neonError: string | null = null
  if (databaseUrl) {
    try {
      const sql = neon(databaseUrl)
      await sql`SELECT 1 AS ok`
      neonConnected = true
    } catch (err) {
      neonError = err instanceof Error ? err.message : 'Connection failed'
    }
  }

  return NextResponse.json({
    neon: {
      configured: Boolean(databaseUrl),
      connected: neonConnected,
      error: neonError,
      maskedUrl: maskSecret(databaseUrl),
      source: process.env.DATABASE_URL
        ? 'process.env'
        : runtime.DATABASE_URL
          ? 'runtime'
          : null,
    },
    brevo: {
      configured: Boolean(brevoKey),
      maskedKey: maskSecret(brevoKey),
      senderEmail: getEnv('BREVO_SENDER_EMAIL') || 'noreply@asurion.com',
      fromName: getEnv('BREVO_FROM_NAME') || 'Flow Map',
      appUrl: getEnv('NEXT_PUBLIC_APP_URL') || 'http://localhost:3007',
      source: process.env.BREVO_API_KEY
        ? 'process.env'
        : runtime.BREVO_API_KEY
          ? 'runtime'
          : null,
    },
    files: {
      envLocalExists: existsSync(envLocalPath()),
      runtimeExists: existsSync(runtimeEnvPath()),
    },
    links: {
      neonConsole: 'https://console.neon.tech/signup',
      neonDocs: 'https://neon.tech/docs/get-started-with-neon/signing-up',
      brevoSignup: 'https://app.brevo.com/account/register',
      brevoApiKeys: 'https://app.brevo.com/settings/keys/api',
    },
    neonSetupPrompt: buildNeonSetupPrompt({
      appPath: 'apps/flow-map',
      appPackage: '@asurion-core/flow-map',
      port: 3007,
    }),
    brevoSetupPrompt: buildBrevoSetupPrompt({
      appPath: 'apps/flow-map',
      appPackage: '@asurion-core/flow-map',
      port: 3007,
    }),
  })
}
