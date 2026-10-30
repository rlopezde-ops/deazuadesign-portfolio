import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { getEnv } from '@/lib/dev-env'

export async function getDb(): Promise<NeonQueryFunction<false, false> | null> {
  const DATABASE_URL = getEnv('DATABASE_URL')
  if (!DATABASE_URL) return null
  return neon(DATABASE_URL)
}
