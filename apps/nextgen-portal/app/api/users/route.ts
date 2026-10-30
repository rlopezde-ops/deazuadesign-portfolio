import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const sql = await getDb()
  if (!sql) return NextResponse.json([])

  try {
    const noteAuthors = await sql`
      SELECT DISTINCT author, author_email
      FROM notes
      WHERE author_email IS NOT NULL AND author_email != ''
    `
    const subscribers = await sql`SELECT email FROM email_subscribers`

    const users: Record<string, string> = {}

    for (const row of noteAuthors) {
      if (row.author_email) users[row.author_email] = row.author
    }
    for (const row of subscribers) {
      if (row.email && !users[row.email]) {
        const local = row.email.split('@')[0]
        const name = local.split(/[._-]/)[0]
        users[row.email] = name.charAt(0).toUpperCase() + name.slice(1)
      }
    }

    return NextResponse.json(Object.entries(users).map(([email, name]) => ({ email, name })))
  } catch {
    return NextResponse.json([])
  }
}
