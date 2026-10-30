import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

async function ensureTable(sql: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
  await sql`
    CREATE TABLE IF NOT EXISTS email_subscribers (
      email VARCHAR(255) PRIMARY KEY,
      subscribed_all BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
}

export async function GET(req: NextRequest) {
  const sql = await getDb()
  if (!sql) return NextResponse.json({ email: '', subscribed_all: false })

  await ensureTable(sql)
  const email = req.nextUrl.searchParams.get('email')
  if (email) {
    const rows = await sql`SELECT * FROM email_subscribers WHERE email = ${email}`
    return NextResponse.json(rows[0] || { email, subscribed_all: false })
  }
  const rows = await sql`SELECT * FROM email_subscribers WHERE subscribed_all = true`
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const sql = await getDb()
  if (!sql) return NextResponse.json({ error: 'No database configured' }, { status: 503 })

  await ensureTable(sql)
  const { email, subscribed_all } = await req.json()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  await sql`
    INSERT INTO email_subscribers (email, subscribed_all)
    VALUES (${email}, ${subscribed_all ?? false})
    ON CONFLICT (email)
    DO UPDATE SET subscribed_all = ${subscribed_all ?? false}
  `
  return NextResponse.json({ ok: true, email, subscribed_all })
}
