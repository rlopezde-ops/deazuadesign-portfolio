import type { NeonQueryFunction } from '@neondatabase/serverless'

/** Create all Flow Map tables needed for persistence (idempotent). */
export async function bootstrapFlowMapTables(sql: NeonQueryFunction<false, false>) {
  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      x DOUBLE PRECISION NOT NULL,
      y DOUBLE PRECISION NOT NULL,
      arrow_x DOUBLE PRECISION,
      arrow_y DOUBLE PRECISION,
      content TEXT DEFAULT '',
      author VARCHAR(255) NOT NULL,
      author_email VARCHAR(255) DEFAULT '',
      items JSONB DEFAULT '[]',
      replies JSONB DEFAULT '[]',
      done BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE notes ADD COLUMN IF NOT EXISTS replies JSONB DEFAULT '[]'`
  await sql`ALTER TABLE notes ADD COLUMN IF NOT EXISTS author_email VARCHAR(255) DEFAULT ''`
  await sql`ALTER TABLE notes ADD COLUMN IF NOT EXISTS done BOOLEAN DEFAULT false`

  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      type VARCHAR(50) NOT NULL,
      message TEXT NOT NULL,
      author VARCHAR(255) NOT NULL,
      target_id UUID,
      target_x DOUBLE PRECISION,
      target_y DOUBLE PRECISION,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS view_positions (
      section_id TEXT PRIMARY KEY,
      pan_x DOUBLE PRECISION NOT NULL,
      pan_y DOUBLE PRECISION NOT NULL,
      zoom DOUBLE PRECISION NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS screen_texts (
      id SERIAL PRIMARY KEY,
      screen_id VARCHAR(100) NOT NULL,
      text_key VARCHAR(200) NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMP DEFAULT NOW(),
      updated_by VARCHAR(100),
      UNIQUE(screen_id, text_key)
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS email_subscribers (
      email VARCHAR(255) PRIMARY KEY,
      subscribed_all BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `

  return [
    'notes',
    'notifications',
    'view_positions',
    'screen_texts',
    'email_subscribers',
  ] as const
}
