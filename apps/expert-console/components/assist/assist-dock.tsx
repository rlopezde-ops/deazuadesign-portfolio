'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { getAssistChips, getAssistResponse } from '@/lib/assist-responses'
import { ASSIST_MOTION, EASE_PANEL_IN, EASE_PANEL_OUT } from '@/lib/motion'
import type { SceneId } from '@/lib/types'
import { useConsoleStore } from '@/store/console-store'

gsap.registerPlugin(useGSAP)

type Msg = { id: string; role: 'user' | 'assistant'; text: string }

type AssistDockProps = {
  /** Override scene for chips/responses (Daily Drop uses `daily-drop`). */
  scene?: SceneId
}

function openHeightPx() {
  if (typeof window === 'undefined') return 420
  return Math.min(420, window.innerHeight * 0.6)
}

/**
 * Collapsed Ask Assist input that expands in place — same pattern on Daily Drop
 * and in-call. Open state is local so the two surfaces don't share a dock.
 *
 * Expansion is one continuous sheet (Apple Messages–style): height grows from
 * the bottom with a stable capsule radius; chrome fades in after the surface
 * starts moving. No circular → rectangular morph.
 */
export function AssistDock({ scene: sceneProp }: AssistDockProps) {
  const storeScene = useConsoleStore((s) => s.scene)
  const scene = sceneProp ?? storeScene
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const [typing, setTyping] = useState(false)

  const dockRef = useRef<HTMLDivElement>(null)
  const chromeRef = useRef<HTMLDivElement>(null)
  const threadRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const openRef = useRef(open)
  const skipCloseOnMountRef = useRef(true)
  openRef.current = open

  const chips = getAssistChips(scene)

  useGSAP(
    () => {
      const dock = dockRef.current
      const chrome = chromeRef.current
      if (!dock || !chrome) return

      gsap.set(dock, {
        height: ASSIST_MOTION.collapsedHeight,
        borderRadius: ASSIST_MOTION.radiusCollapsed,
        transformOrigin: '50% 100%',
      })
      gsap.set(chrome, { autoAlpha: 0, y: 10, pointerEvents: 'none' })
    },
    { scope: dockRef },
  )

  useGSAP(
    () => {
      const dock = dockRef.current
      const chrome = chromeRef.current
      if (!dock || !chrome) return

      // Mount starts collapsed — don't play a close tween on first sync.
      if (!open && skipCloseOnMountRef.current) {
        skipCloseOnMountRef.current = false
        return
      }
      skipCloseOnMountRef.current = false

      timelineRef.current?.kill()

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (open) {
          gsap.set(dock, {
            height: openHeightPx(),
            borderRadius: ASSIST_MOTION.radiusOpen,
          })
          gsap.set(chrome, { autoAlpha: 1, y: 0, pointerEvents: 'auto' })
        } else {
          gsap.set(dock, {
            height: ASSIST_MOTION.collapsedHeight,
            borderRadius: ASSIST_MOTION.radiusCollapsed,
          })
          gsap.set(chrome, { autoAlpha: 0, y: 10, pointerEvents: 'none' })
        }
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { overwrite: 'auto' },
          onComplete: () => {
            if (timelineRef.current === tl) timelineRef.current = null
          },
        })
        timelineRef.current = tl

        if (open) {
          tl.to(
            dock,
            {
              height: openHeightPx(),
              borderRadius: ASSIST_MOTION.radiusOpen,
              duration: ASSIST_MOTION.openDuration,
              ease: EASE_PANEL_IN,
            },
            0,
          )
          tl.to(
            chrome,
            {
              autoAlpha: 1,
              y: 0,
              pointerEvents: 'auto',
              duration: ASSIST_MOTION.contentIn,
              ease: EASE_PANEL_IN,
            },
            ASSIST_MOTION.contentDelay,
          )

          const chipEls = chrome.querySelectorAll('.assist-chip')
          if (chipEls.length) {
            tl.fromTo(
              chipEls,
              { autoAlpha: 0, y: 8 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.32,
                stagger: ASSIST_MOTION.chipStagger,
                ease: EASE_PANEL_IN,
              },
              ASSIST_MOTION.contentDelay + 0.06,
            )
          }
        } else {
          tl.to(
            chrome,
            {
              autoAlpha: 0,
              y: 8,
              pointerEvents: 'none',
              duration: ASSIST_MOTION.contentOut,
              ease: EASE_PANEL_OUT,
            },
            0,
          )
          tl.to(
            dock,
            {
              height: ASSIST_MOTION.collapsedHeight,
              borderRadius: ASSIST_MOTION.radiusCollapsed,
              duration: ASSIST_MOTION.closeDuration,
              ease: EASE_PANEL_OUT,
            },
            0.06,
          )
        }
      })

      return () => {
        mm.revert()
      }
    },
    { dependencies: [open], scope: dockRef },
  )

  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(() => inputRef.current?.focus(), 80)
    return () => window.clearTimeout(id)
  }, [open])

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    const onResize = () => {
      if (!openRef.current || !dockRef.current) return
      if (timelineRef.current?.isActive()) return
      gsap.set(dockRef.current, { height: openHeightPx() })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const ask = (question: string) => {
    const trimmed = question.trim()
    if (!trimmed || typing) return

    if (!open) setOpen(true)

    const userMsg: Msg = { id: `u-${Date.now()}`, role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    window.setTimeout(() => {
      const reply = getAssistResponse(trimmed, scene)
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text: reply }])
      setTyping(false)
    }, 480 + Math.floor(Math.random() * 320))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    ask(input)
  }

  return (
    <div
      ref={dockRef}
      className="assist-dock"
      data-open={open}
      aria-expanded={open}
    >
      <div ref={chromeRef} className="assist-dock-chrome">
        <div className="assist-dock-header">
          <span className="assist-dock-title">
            <span aria-hidden>✦</span> Expert Assist
          </span>
          <button
            type="button"
            className="assist-dock-close"
            aria-label="Close Assist"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>

        <div ref={threadRef} className="assist-thread">
          {messages.length === 0 && (
            <div className="assist-chips">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  className="assist-chip"
                  onClick={() => ask(chip.query)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`assist-msg ${msg.role === 'user' ? 'user' : 'bot'}`}>
              {msg.role === 'assistant' ? <AssistMarkdown text={msg.text} /> : msg.text}
            </div>
          ))}
          {typing && <div className="assist-msg bot">Thinking…</div>}
          {messages.length > 0 && !typing && (
            <div className="assist-chips">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  className="assist-chip"
                  onClick={() => ask(chip.query)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <form className="assist-input-row" onSubmit={onSubmit}>
        <input
          ref={inputRef}
          className="assist-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Ask Assist anything…"
          aria-label="Ask Assist anything"
        />
        <button
          type="submit"
          className="assist-send"
          aria-label="Send"
          disabled={!input.trim() || typing}
        >
          ↑
        </button>
      </form>
    </div>
  )
}

function AssistMarkdown({ text }: { text: string }) {
  const blocks = text.split('\n\n')
  return (
    <div className="assist-md">
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <p key={i} className="assist-md-h">
              {block.slice(3)}
            </p>
          )
        }
        const lines = block.split('\n')
        return (
          <p key={i} className="assist-md-p">
            {lines.map((line, j) => (
              <span key={j}>
                {j > 0 ? <br /> : null}
                {renderInline(line)}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

function renderInline(line: string) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}
