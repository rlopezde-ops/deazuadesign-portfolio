'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus, Grid3x3, PhoneForwarded, Pause, Mic, ChevronDown } from 'lucide-react'

const TOTAL_SECONDS = 30 * 60 // 30:00
const SKIP_SECONDS = Math.round(TOTAL_SECONDS * 0.1) // ~10% jump for the dev shortcut

type Phase = 'green' | 'yellow' | 'red'

interface PhaseStyle {
  /** Colored track that fills the call bar from the left. */
  track: string
  /** Pill border + label color. */
  border: string
  label: string
  /** Filled segment behind the time value. */
  timeBg: string
  timeText: string
  /** Outer glow around the pill (used to punch up the red / over-time state). */
  glow: string
}

const PHASE_STYLES: Record<Phase, PhaseStyle> = {
  green: {
    track: '#0d3b28',
    border: '#3ddc97',
    label: '#3ddc97',
    timeBg: '#268a63',
    timeText: '#eafff5',
    glow: 'none',
  },
  yellow: {
    track: '#4a3d0e',
    border: '#e9c548',
    label: '#e9c548',
    timeBg: '#9c811d',
    timeText: '#fff8e6',
    glow: 'none',
  },
  red: {
    track: '#3a1010',
    border: '#ef5350',
    label: '#ff8a8a',
    timeBg: '#c0392b',
    timeText: '#ffecec',
    glow: '0 0 22px rgba(239, 83, 80, 0.65)',
  },
}

function getPhase(secondsLeft: number): Phase {
  const fraction = secondsLeft / TOTAL_SECONDS
  if (fraction > 0.5) return 'green'
  if (fraction > 0.25) return 'yellow'
  return 'red'
}

function formatTime(secondsLeft: number): string {
  const isNegative = secondsLeft < 0
  const abs = Math.abs(secondsLeft)
  const minutes = Math.floor(abs / 60)
  const seconds = abs % 60
  return `${isNegative ? '-' : ''}${minutes}:${seconds.toString().padStart(2, '0')}`
}

const TOTAL_MS = TOTAL_SECONDS * 1000

export function CallBarGrowing() {
  const fillRef = useRef<HTMLDivElement>(null)
  const startRef = useRef(0) // performance.now() at mount
  const skipMsRef = useRef(0) // accumulated dev-skip time
  // The number + phase re-render per whole second; the bar itself is driven by a
  // single long CSS transition (below) so it glides as one continuous motion.
  const [displaySeconds, setDisplaySeconds] = useState(TOTAL_SECONDS)
  const [phase, setPhase] = useState<Phase>('green')

  const remainingMs = () => TOTAL_MS - (performance.now() - startRef.current) - skipMsRef.current

  // (Re)arm the bar: jump to the current elapsed fraction, then let the compositor
  // glide it linearly up to full over the remaining time. This variant grows from
  // left to right (scaleX 0 → 1) as time elapses, the inverse of the shrinking v1.
  // scaleX is rendered sub-pixel, so the motion is smooth rather than snapping
  // pixel by pixel the way an animated `width` does.
  const armBar = () => {
    const fill = fillRef.current
    if (!fill) return
    const ms = remainingMs()
    const elapsedFraction = Math.min(1, Math.max(0, 1 - ms / TOTAL_MS))
    fill.style.transition = 'none'
    fill.style.transform = `scaleX(${elapsedFraction})`
    void fill.offsetWidth // flush the jump before starting the glide
    if (ms > 0) {
      fill.style.transition = `transform ${ms / 1000}s linear, background-color 0.4s ease`
      fill.style.transform = 'scaleX(1)'
    } else {
      fill.style.transition = 'background-color 0.4s ease'
    }
  }

  const syncLabels = () => {
    const secs = remainingMs() / 1000
    setDisplaySeconds(Math.ceil(secs))
    setPhase(getPhase(secs))
  }

  useEffect(() => {
    startRef.current = performance.now()
    armBar()
    syncLabels()
    const id = window.setInterval(syncLabels, 250)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Dev shortcut: "f" skips ahead ~10% of the total, then re-arms the glide and
  // labels from the new position so a crossed threshold restyles immediately.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'f') {
        skipMsRef.current += SKIP_SECONDS * 1000
        armBar()
        syncLabels()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const style = PHASE_STYLES[phase]
  const iconClass = 'h-5 w-5 text-white/75'

  return (
    <div className="relative h-16 w-full overflow-hidden rounded-xl bg-black">
      {/* Growing timer bar — scaleX tracks elapsed time, color tracks phase. */}
      <div
        ref={fillRef}
        className="absolute inset-y-0 left-0 w-full origin-left"
        style={{ backgroundColor: style.track }}
      />

      {/* Content row */}
      <div className="relative flex h-full items-center justify-between px-6">
        {/* Left: phone number */}
        <span className="text-lg font-medium text-white">(615) 480-1640</span>

        {/* Right: call controls */}
        <div className="flex items-center gap-5">
          <button type="button" aria-label="Add" className="text-white/75 transition-colors hover:text-white">
            <Plus className={iconClass} />
          </button>
          <button type="button" aria-label="Keypad" className="text-white/75 transition-colors hover:text-white">
            <Grid3x3 className={iconClass} />
          </button>
          <button type="button" aria-label="Transfer" className="text-white/75 transition-colors hover:text-white">
            <PhoneForwarded className={iconClass} />
          </button>
          <button type="button" aria-label="Hold" className="text-white/75 transition-colors hover:text-white">
            <Pause className={iconClass} />
          </button>
          <button type="button" aria-label="Mute" className="text-white/75 transition-colors hover:text-white">
            <Mic className={iconClass} />
          </button>

          <button
            type="button"
            className="flex items-center rounded-full bg-[#e5484d] pl-4 pr-2.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#d43b40]"
          >
            End call
            <span className="ml-2 border-l border-white/30 pl-2">
              <ChevronDown className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>

      {/* Center: countdown pill (the "egg timer") */}
      {/* Centered via flexbox rather than translate(-50%,-50%): a half-pixel
          transform offset promotes a compositor layer that blurs the pill text. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center overflow-hidden rounded-full border-2 bg-black/40"
          style={{
            borderColor: style.border,
            boxShadow: style.glow,
            transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          }}
        >
          <span
            className="py-1 pl-3.5 pr-2.5 text-[13px] font-medium"
            style={{ color: style.label, transition: 'color 0.4s ease' }}
          >
            Device activation
          </span>
          <span
            className="flex items-center gap-1.5 border-l border-white/15 px-3 py-1 text-[13px] font-mono tabular-nums"
            style={{
              backgroundColor: style.timeBg,
              color: style.timeText,
              transition: 'background-color 0.4s ease, color 0.4s ease',
            }}
          >
            {formatTime(displaySeconds)}
            {phase === 'red' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                aria-hidden="true"
                fill="#ffffff"
                className="h-3.5 w-3.5 shrink-0"
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z" />
              </svg>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}
