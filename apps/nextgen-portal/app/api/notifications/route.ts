import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

const ADMIN_NAME = 'ilya'

export async function GET() {
  const sql = await getDb()
  if (!sql) return NextResponse.json([])
  try {
    const rows = await sql`SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50`
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  const sql = await getDb()
  if (!sql) return NextResponse.json({ error: 'No database configured' }, { status: 503 })

  const body = await req.json()
  const { type, message, author } = body

  if (!message || !author) {
    return NextResponse.json({ error: 'message and author required' }, { status: 400 })
  }

  const rows = await sql`
    INSERT INTO notifications (type, message, author)
    VALUES (${type || 'update'}, ${message}, ${author})
    RETURNING *
  `
  return NextResponse.json(rows[0], { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const sql = await getDb()
  if (!sql) return NextResponse.json({ error: 'No database configured' }, { status: 503 })

  const { searchParams } = new URL(req.url)
  const author = searchParams.get('author')
  const id = searchParams.get('id')

  if (id) {
    await sql`DELETE FROM notifications WHERE id = ${id}`
    return NextResponse.json({ ok: true })
  }

  if (!author || author.toLowerCase() !== ADMIN_NAME) {
    return NextResponse.json({ error: 'Only admin can clear notifications' }, { status: 403 })
  }

  await sql`DELETE FROM notifications`
  return NextResponse.json({ ok: true })
}
