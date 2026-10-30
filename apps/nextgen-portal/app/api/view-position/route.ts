import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

async function ensureTable(sql: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
  await sql`CREATE TABLE IF NOT EXISTS view_positions (
    section_id TEXT PRIMARY KEY,
    pan_x DOUBLE PRECISION NOT NULL,
    pan_y DOUBLE PRECISION NOT NULL,
    zoom DOUBLE PRECISION NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
  )`
}

export async function GET() {
  const sql = await getDb()
  if (!sql) return NextResponse.json([])
  await ensureTable(sql)
  const rows = await sql`SELECT * FROM view_positions`
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const sql = await getDb()
  if (!sql) return NextResponse.json({ error: 'No database configured' }, { status: 503 })

  await ensureTable(sql)
  const body = await req.json()
  const { section_id, pan_x, pan_y, zoom } = body

  await sql`INSERT INTO view_positions (section_id, pan_x, pan_y, zoom, updated_at)
    VALUES (${section_id}, ${pan_x}, ${pan_y}, ${zoom}, NOW())
    ON CONFLICT (section_id) DO UPDATE SET
      pan_x = ${pan_x},
      pan_y = ${pan_y},
      zoom = ${zoom},
      updated_at = NOW()`

  return NextResponse.json({ ok: true })
}
