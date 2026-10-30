import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

async function ensureNotesTables(sql: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
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
}

async function ensureRepliesColumn(sql: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
  await ensureNotesTables(sql)
}

async function notify(
  sql: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  type: string,
  message: string,
  author: string,
  targetId?: string,
  targetX?: number,
  targetY?: number,
) {
  await sql`
    INSERT INTO notifications (type, message, author, target_id, target_x, target_y)
    VALUES (${type}, ${message}, ${author}, ${targetId || null}, ${targetX ?? null}, ${targetY ?? null})
  `
}

export async function GET() {
  const sql = await getDb()
  if (!sql) return NextResponse.json([])

  await ensureRepliesColumn(sql)
  const rows = await sql`SELECT * FROM notes ORDER BY created_at ASC`
  return NextResponse.json(
    rows.map((r) => ({
      ...r,
      authorEmail: r.author_email,
      replies: r.replies || [],
      items: r.items || [],
    })),
  )
}

export async function POST(req: NextRequest) {
  const sql = await getDb()
  if (!sql) return NextResponse.json({ error: 'No database configured' }, { status: 503 })

  await ensureRepliesColumn(sql)
  const body = await req.json()
  const { x, y, arrow_x, arrow_y, content, author, items, authorEmail } = body

  if (!author || author.trim() === '') {
    return NextResponse.json({ error: 'Author name is required' }, { status: 400 })
  }

  const rows = await sql`
    INSERT INTO notes (x, y, arrow_x, arrow_y, content, author, items, replies, author_email)
    VALUES (
      ${x}, ${y}, ${arrow_x}, ${arrow_y}, ${content || ''}, ${author},
      ${JSON.stringify(items || [])}, '[]', ${authorEmail || ''}
    )
    RETURNING *
  `
  await notify(sql, 'note_added', `${author} added a note`, author, rows[0].id, x, y)
  return NextResponse.json({ ...rows[0], authorEmail: rows[0].author_email, replies: [] }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const sql = await getDb()
  if (!sql) return NextResponse.json({ error: 'No database configured' }, { status: 503 })

  await ensureRepliesColumn(sql)
  const body = await req.json()
  const {
    id,
    x,
    y,
    content,
    items,
    arrow_x,
    arrow_y,
    done,
    author,
    contentChanged,
    replies,
    replyAdded,
  } = body

  const rows = await sql`
    UPDATE notes
    SET
      content = ${content},
      items = ${JSON.stringify(items || [])},
      arrow_x = ${arrow_x},
      arrow_y = ${arrow_y},
      x = ${x},
      y = ${y},
      done = ${done ?? false},
      replies = ${JSON.stringify(replies || [])},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  const noteAuthor = author || rows[0]?.author || 'unknown'
  if (replyAdded) {
    const lastReply = Array.isArray(replies) && replies.length > 0 ? replies[replies.length - 1] : null
    const replyAuthor = (lastReply && typeof lastReply === 'object' && 'author' in lastReply && String(lastReply.author || '').trim()) || noteAuthor
    await notify(sql, 'note_added', `${replyAuthor} replied to a note`, replyAuthor, id, x, y)
  } else if (done && contentChanged) {
    await notify(sql, 'note_done', `${noteAuthor} marked a note as done`, noteAuthor, id, x, y)
  } else if (contentChanged) {
    await notify(sql, 'note_added', `${noteAuthor} updated a note`, noteAuthor, id, x, y)
  }
  return NextResponse.json({
    ...rows[0],
    authorEmail: rows[0].author_email,
    replies: rows[0].replies || [],
  })
}

export async function DELETE(req: NextRequest) {
  const sql = await getDb()
  if (!sql) return NextResponse.json({ error: 'No database configured' }, { status: 503 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await sql`DELETE FROM notes WHERE id = ${id}`
  return NextResponse.json({ ok: true })
}
