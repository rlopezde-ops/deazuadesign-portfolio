import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { getEnv } from '@/lib/dev-env'

export async function POST(req: NextRequest) {
  const APP_URL = getEnv('NEXT_PUBLIC_APP_URL') || 'http://localhost:3007'
  const FROM_EMAIL = getEnv('BREVO_SENDER_EMAIL') || 'noreply@asurion.com'
  const FROM_NAME = getEnv('BREVO_FROM_NAME') || 'Flow Map'
  const BREVO_API_KEY = getEnv('BREVO_API_KEY')

  const body = await req.json()
  const { type, noteAuthorEmail, actorName, actorEmail, content, mentions } = body

  if (!BREVO_API_KEY) {
    return NextResponse.json({ sent: 0, skipped: 'BREVO_API_KEY not configured' })
  }

  const sql = await getDb()
  const recipients: string[] = []

  if (mentions && mentions.length > 0) {
    recipients.push(...mentions)
  }

  if ((type === 'reply' || type === 'mark_complete') && noteAuthorEmail && noteAuthorEmail !== actorEmail) {
    if (!recipients.includes(noteAuthorEmail)) recipients.push(noteAuthorEmail)
  }

  if (sql) {
    try {
      const subscribers = await sql`SELECT email FROM email_subscribers WHERE subscribed_all = true`
      for (const sub of subscribers) {
        if (sub.email !== actorEmail && !recipients.includes(sub.email)) {
          recipients.push(sub.email)
        }
      }
    } catch {
      // Table may not exist yet
    }
  }

  if (recipients.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  const flowUrl = `${APP_URL}/`
  let subject = ''
  let htmlBody = ''

  switch (type) {
    case 'mention':
      subject = `${actorName} mentioned you in a comment`
      htmlBody = `
        <div style="font-family: system-ui, sans-serif; max-width: 480px;">
          <p style="font-size: 15px; color: #333;"><strong>${actorName}</strong> mentioned you in a comment:</p>
          <blockquote style="border-left: 3px solid #6366f1; padding: 8px 12px; margin: 12px 0; background: #f8f9fa; border-radius: 4px;">
            ${content || '(no text)'}
          </blockquote>
          <a href="${flowUrl}" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background: #6366f1; color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View in Flow Map</a>
        </div>
      `
      break
    case 'reply':
      subject = `${actorName} replied to your note`
      htmlBody = `
        <div style="font-family: system-ui, sans-serif; max-width: 480px;">
          <p style="font-size: 15px; color: #333;"><strong>${actorName}</strong> replied to your note:</p>
          <blockquote style="border-left: 3px solid #fbbf24; padding: 8px 12px; margin: 12px 0; background: #f8f9fa; border-radius: 4px;">
            ${content || '(no text)'}
          </blockquote>
          <a href="${flowUrl}" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background: #6366f1; color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View in Flow Map</a>
        </div>
      `
      break
    case 'mark_complete':
      subject = `${actorName} marked your note as complete`
      htmlBody = `
        <div style="font-family: system-ui, sans-serif; max-width: 480px;">
          <p style="font-size: 15px; color: #333;"><strong>${actorName}</strong> marked your note as complete ✓</p>
          <a href="${flowUrl}" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background: #22c55e; color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View in Flow Map</a>
        </div>
      `
      break
    case 'new_note':
      subject = `${actorName} added a new comment`
      htmlBody = `
        <div style="font-family: system-ui, sans-serif; max-width: 480px;">
          <p style="font-size: 15px; color: #333;"><strong>${actorName}</strong> added a new comment:</p>
          <blockquote style="border-left: 3px solid #6366f1; padding: 8px 12px; margin: 12px 0; background: #f8f9fa; border-radius: 4px;">
            ${content || '(no text)'}
          </blockquote>
          <a href="${flowUrl}" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background: #6366f1; color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View in Flow Map</a>
        </div>
      `
      break
    default:
      subject = 'New activity on Flow Map'
      htmlBody = `
        <div style="font-family: system-ui, sans-serif; max-width: 480px;">
          <p style="font-size: 15px; color: #333;"><strong>${actorName}</strong> left a comment:</p>
          <blockquote style="border-left: 3px solid #6366f1; padding: 8px 12px; margin: 12px 0; background: #f8f9fa; border-radius: 4px;">
            ${content || '(no text)'}
          </blockquote>
          <a href="${flowUrl}" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background: #6366f1; color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View in Flow Map</a>
        </div>
      `
  }

  try {
    const { BrevoClient } = await import('@getbrevo/brevo')
    const client = new BrevoClient({ apiKey: BREVO_API_KEY })

    await client.transactionalEmails.sendTransacEmail({
      sender: { email: FROM_EMAIL, name: FROM_NAME },
      to: recipients.map((email) => ({ email })),
      subject,
      htmlContent: htmlBody,
    })

    return NextResponse.json({ sent: recipients.length, recipients })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    console.error('Brevo email error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
