'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

// Lightning-fast per-word reveal for guidance text — the words land one after
// another as Joy "types" the response, but fast enough that the expert never
// waits to read it.
//
// We only animate OPACITY: every word occupies its final wrapped position from
// the first frame, so the staggered reveal never reflows the task. That matters
// because the task sits inside MotionTaskShell, whose ResizeObserver animates
// height — a width/word-count reflow mid-reveal would make the shell jitter.
//
// Runs once when the text first mounts (deps: [text]) and holds fully visible.
// GSAP mutates the DOM opacity directly, so unrelated React re-renders don't
// reset it (the JSX opacity:0 never changes, so React never re-touches it).
const WORD_DURATION = 0.14
const WORD_STAGGER = 0.018

export function Typewriter({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const words = el.querySelectorAll<HTMLElement>('[data-tw-word]')
      if (words.length === 0) return

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(words, { opacity: 1 })
        return
      }

      gsap.fromTo(
        words,
        { opacity: 0 },
        { opacity: 1, duration: WORD_DURATION, ease: 'none', stagger: WORD_STAGGER },
      )
    },
    { dependencies: [text] },
  )

  // Split on whitespace, keeping the separators so spacing and wrapping are
  // byte-for-byte what a plain <p>{text}</p> would produce.
  const tokens = text.split(/(\s+)/)

  return (
    <p ref={ref} className={className}>
      {tokens.map((tok, i) =>
        tok === '' || /^\s+$/.test(tok) ? (
          tok
        ) : (
          <span key={i} data-tw-word style={{ opacity: 0 }}>
            {tok}
          </span>
        ),
      )}
    </p>
  )
}
