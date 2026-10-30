'use client'

import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Copy, PushPin, Sparkle, Translate } from '@phosphor-icons/react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'

export interface TranscriptSelection {
  /** The highlighted text. */
  text: string
  /** Top offset (px) within the transcript root, just below the selection. */
  top: number
  /** Left offset (px) within the transcript root. */
  left: number
}

/** Fixed menu width — used by TranscriptPanel to clamp `left` within the panel. */
export const SELECTION_MENU_WIDTH = 272

/** Accent for the AI/pin affordances — the customer/accent purple. */
const ACCENT = '#d0aaf1'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

// ---------------------------------------------------------------------------
// Canned "Assist" insight. Stands in for a real generation: a small keyword map
// keyed to THIS call's subject matter (a replacement iPhone 15 stuck on SOS /
// no service during activation), with a generic fallback. Ordered most-specific
// first — the first matching pattern wins.
// ---------------------------------------------------------------------------

const INSIGHTS: { match: RegExp; body: string }[] = [
  {
    match: /sos( only)?|no (cellular )?service|no signal|searching/i,
    body: '“SOS” or “No Service” means the iPhone can’t reach a cellular network. On a just-activated replacement it usually clears once the line finishes provisioning and the phone re-registers — often after a restart or an airplane-mode toggle.',
  },
  {
    match: /activat/i,
    body: 'Activating a replacement device moves the customer’s line onto the new phone. It can take a few minutes to provision on Verizon’s network, and a restart helps the iPhone pick up service once that completes.',
  },
  {
    match: /esim|sim card|\bsim\b/i,
    body: 'The replacement iPhone 15 uses an eSIM — there’s no physical SIM to swap. The line transfers digitally, so if service doesn’t appear the eSIM may need to be re-provisioned from the account.',
  },
  {
    match: /imei/i,
    body: 'The IMEI is a device’s unique 15-digit identifier, used to confirm the exact hardware on the account and check warranty or replacement eligibility.',
  },
  {
    match: /home device protect|verizon home|vhdp/i,
    body: 'Verizon Home Device Protect is a flat $25/month plan covering eligible tech across the home — TVs, laptops, tablets, smart-home devices. It doesn’t cover phones, which run through mobile device protection.',
  },
  {
    match: /liquid|water damage|replacement/i,
    body: 'This replacement iPhone 15 came from a prior liquid-damage claim, so it’s new to the account. Today’s call is about getting the line activated on it.',
  },
  {
    match: /iphone 15|iphone/i,
    body: 'The iPhone 15 activates over eSIM in the US. Once the line provisions, the phone drops the SOS indicator and picks up Verizon service — a restart speeds that along.',
  },
  {
    match: /restart|reboot|airplane mode/i,
    body: 'Restarting or toggling airplane mode forces the iPhone to re-register on the cellular network — a common last step after a line is activated on a new device.',
  },
]

const FALLBACK =
  'This came up in the live conversation — pin it to keep it handy, or Assist can pull related account details and documentation on request.'

function generateInsight(text: string): string {
  const hit = INSIGHTS.find((i) => i.match.test(text))
  return hit ? hit.body : FALLBACK
}

/** Truncate the echoed prompt so the header stays on one tidy line. */
function truncate(text: string, max = 44): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean
}

// ---------------------------------------------------------------------------

interface TranscriptSelectionMenuProps {
  selection: TranscriptSelection
  menuRef: RefObject<HTMLDivElement | null>
  onCopy: () => void
  onTranslate: () => void
  onPin: () => void
}

/**
 * Floating context menu shown when the expert highlights transcript text.
 * Offers Copy / Translate / Pin actions and a preemptive "Tell me more about …"
 * insight generated from the selection.
 */
export function TranscriptSelectionMenu({
  selection,
  menuRef,
  onCopy,
  onTranslate,
  onPin,
}: TranscriptSelectionMenuProps) {
  const insight = generateInsight(selection.text)
  const answerRef = useRef<HTMLParagraphElement>(null)
  const [loading, setLoading] = useState(true)

  // Brief "generating" beat before the answer lands, so it doesn't feel canned.
  useEffect(() => {
    setLoading(true)
    const id = window.setTimeout(() => setLoading(false), 450 + Math.random() * 300)
    return () => window.clearTimeout(id)
  }, [selection.text])

  // Fade the answer in once the loading beat ends.
  useGSAP(
    () => {
      if (loading) return
      const el = answerRef.current
      if (!el) return
      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1, y: 0 })
        return
      }
      gsap.fromTo(el, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' })
    },
    { dependencies: [loading], scope: menuRef },
  )

  // Pop in from just under the selection whenever the target text changes.
  useGSAP(
    () => {
      const el = menuRef.current
      if (!el) return
      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1, y: 0, scale: 1 })
        return
      }
      gsap.fromTo(
        el,
        { opacity: 0, y: -6, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.18, ease: 'power2.out' },
      )
    },
    { dependencies: [selection.text, selection.top, selection.left], scope: menuRef },
  )

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Transcript selection actions"
      className="pointer-events-auto absolute z-30 overflow-hidden rounded-[12px]"
      style={{
        top: selection.top,
        left: selection.left,
        width: SELECTION_MENU_WIDTH,
        transformOrigin: 'top left',
        backgroundColor: '#38323F',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 18px 44px -14px rgba(0,0,0,0.65), 0 4px 12px rgba(0,0,0,0.35)',
      }}
      // Keep the browser selection alive while interacting with the menu.
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="flex flex-col p-[4px]">
        <MenuAction icon={<Copy className="size-[16px]" />} label="Copy" onClick={onCopy} />
        <MenuAction
          icon={<Translate className="size-[16px]" />}
          label="Translate"
          onClick={onTranslate}
        />
        <MenuAction icon={<PushPin className="size-[16px]" />} label="Pin" onClick={onPin} />
      </div>

      <div className="h-px w-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

      <div className="flex flex-col gap-[6px] px-[12px] py-[10px]" aria-busy={loading}>
        <div className="flex items-center gap-[6px]">
          <Sparkle
            className={cn('size-[14px] shrink-0', loading && 'animate-pulse')}
            weight="fill"
            style={{ color: ACCENT }}
          />
          <span className="text-[11px] leading-none" style={{ color: 'var(--ew-text-faint)' }}>
            Tell me more about “{truncate(selection.text)}”
          </span>
        </div>
        {loading ? (
          <div className="flex flex-col gap-[6px] pt-[4px]" aria-hidden>
            <span
              className="h-[10px] w-full animate-pulse rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            />
            <span
              className="h-[10px] w-2/3 animate-pulse rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            />
            <span className="sr-only">Generating response…</span>
          </div>
        ) : (
          <p
            ref={answerRef}
            className="text-[13px] leading-relaxed"
            style={{ color: 'var(--ew-text-soft)' }}
          >
            {insight}
          </p>
        )}
      </div>
    </div>
  )
}

function MenuAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-[10px] rounded-[8px] px-[10px] py-[8px] text-left text-[14px] transition-colors hover:bg-white/[0.06]"
      style={{ color: 'var(--ew-text-strong)' }}
    >
      <span className="shrink-0" style={{ color: 'var(--ew-text-soft)' }}>
        {icon}
      </span>
      {label}
    </button>
  )
}
