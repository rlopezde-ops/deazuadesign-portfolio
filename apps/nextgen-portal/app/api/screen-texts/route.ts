import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

async function ensureTable(sql: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
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
}

export async function GET(req: NextRequest) {
  const sql = await getDb()
  if (!sql) return NextResponse.json({ texts: {} })

  await ensureTable(sql)
  const screenId = req.nextUrl.searchParams.get('screen')

  if (screenId) {
    const rows = await sql`
      SELECT text_key, content, updated_by, updated_at
      FROM screen_texts
      WHERE screen_id = ${screenId}
    `
    const texts: Record<string, string> = {}
    for (const row of rows) texts[row.text_key] = row.content
    return NextResponse.json({ screen_id: screenId, texts })
  }

  const rows = await sql`SELECT screen_id, text_key, content FROM screen_texts ORDER BY screen_id, text_key`
  const grouped: Record<string, Record<string, string>> = {}
  for (const row of rows) {
    if (!grouped[row.screen_id]) grouped[row.screen_id] = {}
    grouped[row.screen_id][row.text_key] = row.content
  }
  return NextResponse.json(grouped)
}

export async function PUT(req: NextRequest) {
  const sql = await getDb()
  if (!sql) return NextResponse.json({ error: 'No database configured' }, { status: 503 })

  await ensureTable(sql)
  const body = await req.json()
  const { screen_id, text_key, content, author } = body

  if (!screen_id || !text_key) {
    return NextResponse.json({ error: 'screen_id and text_key are required' }, { status: 400 })
  }

  await sql`
    INSERT INTO screen_texts (screen_id, text_key, content, updated_by, updated_at)
    VALUES (${screen_id}, ${text_key}, ${content || ''}, ${author || 'anonymous'}, NOW())
    ON CONFLICT (screen_id, text_key)
    DO UPDATE SET content = ${content || ''}, updated_by = ${author || 'anonymous'}, updated_at = NOW()
  `

  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest) {
  const sql = await getDb()
  if (!sql) return NextResponse.json({ error: 'No database configured' }, { status: 503 })

  await ensureTable(sql)
  const body = await req.json()
  const { screen_id, texts, author } = body

  if (!screen_id || !texts || typeof texts !== 'object') {
    return NextResponse.json({ error: 'screen_id and texts object are required' }, { status: 400 })
  }

  for (const [text_key, content] of Object.entries(texts)) {
    await sql`
      INSERT INTO screen_texts (screen_id, text_key, content, updated_by, updated_at)
      VALUES (${screen_id}, ${text_key}, ${content as string}, ${author || 'anonymous'}, NOW())
      ON CONFLICT (screen_id, text_key)
      DO UPDATE SET content = ${content as string}, updated_by = ${author || 'anonymous'}, updated_at = NOW()
    `
  }

  return NextResponse.json({ ok: true, count: Object.keys(texts).length })
}
