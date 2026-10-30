import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check } from '@phosphor-icons/react'
import { Lottie } from 'lottie-react'
import { ActionDock } from '@/components/chat'
import { useLiveStep } from '@/lib/flow-steps'
import { useConsoleStore } from '@/store/console-store'
import { JoyAvatar } from './joy-avatar'
import joyAnimation from './joy-avatar.json'
import { Typewriter } from './typewriter'

/**
 * Task guidance primitives.
 *
 * Ported from pulse-proto's compound `Task` API so both prototypes compose
 * guidance the same way, but rendered with this app's CSS classes rather than
 * Mantine — the workspace panel is Tailwind and plain CSS.
 *
 * The shape of a task is always the same, and it comes from the customer-facing
 * chat anatomy: an optional acknowledgement, then the single thing to say or do
 * at 32px, then supporting detail beneath it.
 *
 *   <Task>
 *     <Task.Affirmation>Got it.</Task.Affirmation>
 *     <Task.Verbatim>Let me get that reconnected for you.</Task.Verbatim>
 *     <Task.Body>
 *       <Task.Subtask label="Delivery method">…</Task.Subtask>
 *     </Task.Body>
 *   </Task>
 *
 * Use `Verbatim` only for words the expert reads out loud and `Directive` for
 * instructions to the expert. The two look alike apart from the accent quotes,
 * which is the whole signal — so getting them the wrong way round tells the
 * expert to say an instruction.
 */
/**
 * Every step is laid out as a chat turn from Joy. When the thinking cue is
 * enabled, the avatar sits in the container's top-left corner without reserving
 * a gutter, so the step's copy stays flush-left; the content is held back until
 * the cue fades out, then comes in where the cue was. This resets per guidance
 * step (the cue remounts on step changes, not presenter beat scrubbing). Pass
 * `cue={false}` when the body already owns a thinking indicator (e.g.
 * Task.Status pending).
 */
function TaskRoot({
  children,
  className = '',
  cue = true,
}: {
  children: ReactNode
  className?: string
  /** When false, skip the entrance thinking avatar (Status owns the cue). */
  cue?: boolean
}) {
  const liveStep = useLiveStep()
  const stepFocus = useConsoleStore((s) => s.stepFocus)
  const joyEnabled = useConsoleStore((s) => s.joyAvatarEnabled)
  // Key off the guidance step only — beatIndex changes on transcript-only
  // scrubbing and must not replay the thinking cue.
  const remountKey = stepFocus ?? liveStep
  const showCue = cue && joyEnabled

  // The step whose content is on screen. It trails `remountKey` only while a
  // fresh step's cue is still playing, and catches up the instant the cue fades
  // out (or the fallback fires). Both behaviours we need fall out of this one
  // rule, so "cue is playing" and "content is revealed" can never disagree:
  //   • a genuine new step holds its content until Joy has faded, so the avatar
  //     never overlaps copy; and
  //   • a cue that re-enables within the same step (a settled/done state after a
  //     `cue={false}` pending beat) finds the step already revealed, so Joy does
  //     not replay on top of content that's already up — the source of avatars
  //     appearing behind confirmation text like "Instructions sent to …".
  // Kept in a ref and compared during render so the hold is synchronous: content
  // never flashes for a frame before the cue on a step change (e.g. the Sell
  // banner, whose Task instance persists across sub-steps).
  const revealedStepRef = useRef<string | null>(null)
  const [, bumpReveal] = useState(0)

  // With no cue this step, content is present from the start; a cue toggling off
  // mid-step (pending owns the indicator) likewise settles the step as revealed.
  if (!showCue) {
    revealedStepRef.current = remountKey
  }

  const contentIn = revealedStepRef.current === remountKey
  const renderCue = showCue && !contentIn

  const revealAfterCue = () => {
    revealedStepRef.current = remountKey
    bumpReveal((n) => n + 1)
  }
  useEffect(() => {
    if (contentIn) return
    // Safety net so content is never stuck hidden if the cue's exit callback
    // never arrives (e.g. the avatar unmounts mid-cue).
    const fallback = window.setTimeout(revealAfterCue, 2400)
    return () => window.clearTimeout(fallback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remountKey, contentIn])

  // While the cue plays the content is held back and Joy is out of flow, so the
  // task would otherwise collapse to zero height and MotionTaskShell (which pins
  // to the measured height and clips overflow) would hide the avatar. Reserve
  // the cue's footprint so it stays visible until the content comes in.
  const rootClass = ['task', renderCue ? 'task--cueing' : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={rootClass}>
      {renderCue ? (
        <JoyAvatar
          key={remountKey}
          remountKey={remountKey}
          onExit={revealAfterCue}
        />
      ) : null}
      <div className={`task-content${contentIn ? ' task-content--in' : ''}`}>
        {contentIn ? children : null}
      </div>
    </div>
  )
}

/** Orienting label — states what this step is, never an instruction. */
function TaskEyebrow({ children }: { children: ReactNode }) {
  return <p className="task-eyebrow">{children}</p>
}

/**
 * Guidance lines type in word-by-word as Joy's "response." Only plain-string
 * children get the reveal — interpolated children (e.g. a captured value spliced
 * into a detail line) render straight, since splitting arbitrary nodes into
 * words isn't safe.
 */

/** A 1–3 word acknowledgement that sets tone before the directive. */
function Affirmation({ children }: { children: ReactNode }) {
  return typeof children === 'string' ? (
    <Typewriter className="task-affirmation" text={children} />
  ) : (
    <p className="task-affirmation">{children}</p>
  )
}

/** Words to say out loud. Rendered in accent quotes. */
function Verbatim({ children }: { children: ReactNode }) {
  return typeof children === 'string' ? (
    <Typewriter className="task-verbatim" text={children} />
  ) : (
    <p className="task-verbatim">{children}</p>
  )
}

/** What the expert should do. Same weight as Verbatim, no quotes. */
function Directive({ children }: { children: ReactNode }) {
  return typeof children === 'string' ? (
    <Typewriter className="task-directive" text={children} />
  ) : (
    <p className="task-directive">{children}</p>
  )
}

function TaskBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`task-body ${className}`.trim()}>{children}</div>
}

/** Supporting context under the directive. */
function TaskDetail({ children }: { children: ReactNode }) {
  return typeof children === 'string' ? (
    <Typewriter className="task-detail" text={children} />
  ) : (
    <p className="task-detail">{children}</p>
  )
}

function Subtask({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="subtask">
      {label ? <p className="subtask-label">{label}</p> : null}
      {children}
    </div>
  )
}

function TaskFooter({ children }: { children: ReactNode }) {
  return (
    <div className="task-footer">
      <ActionDock>{children}</ActionDock>
    </div>
  )
}

/** Inline system acknowledgement — Joy thinking cue while pending, check on success. */
function TaskStatus({
  phase,
  pendingLabel,
  successLabel,
}: {
  phase: 'pending' | 'success'
  pendingLabel: string
  successLabel: string
}) {
  if (phase === 'pending') {
    return (
      <div className="task-status" role="status" aria-live="polite">
        <Lottie
          src={joyAnimation}
          loop
          autoplay
          aria-hidden
          className="task-status-thinking"
          style={{ width: 28, height: 28, flexShrink: 0 }}
        />
        <span>{pendingLabel}</span>
      </div>
    )
  }

  return (
    <div className="task-status task-status-success" role="status" aria-live="polite">
      <Check size={16} weight="bold" className="motion-check-pop shrink-0" />
      <span>{successLabel}</span>
    </div>
  )
}

/**
 * Primary and secondary controls. Never disabled on validation — the button
 * stays live and the task reports the problem, matching pulse-proto.
 */
function TaskAction({
  children,
  onClick,
  disabled,
  variant = 'primary',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}) {
  const base = 'motion-press rounded-full px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed'
  const look =
    variant === 'primary'
      ? 'bg-[var(--aui-action-filled-action)] text-[var(--aui-action-on-filled-action)] disabled:bg-[var(--aui-elevated-level-01)] disabled:text-[var(--aui-on-surface-faint)]'
      : 'border border-[var(--aui-outline)] text-[var(--aui-on-surface)] disabled:text-[var(--aui-on-surface-faint)]'

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${look}`}>
      {children}
    </button>
  )
}

/** A finished task, reduced to one line so the live task owns the hierarchy. */
function TaskCollapsed({ children }: { children: ReactNode }) {
  return (
    <div className="task-collapsed motion-enter-inline">
      <Check size={16} weight="bold" className="shrink-0 text-[#5fd48a]" />
      <span className="task-collapsed-label">{children}</span>
    </div>
  )
}

export const Task = Object.assign(TaskRoot, {
  Eyebrow: TaskEyebrow,
  Affirmation,
  Verbatim,
  Directive,
  Body: TaskBody,
  Detail: TaskDetail,
  Subtask,
  Footer: TaskFooter,
  Status: TaskStatus,
  Action: TaskAction,
  Collapsed: TaskCollapsed,
})
