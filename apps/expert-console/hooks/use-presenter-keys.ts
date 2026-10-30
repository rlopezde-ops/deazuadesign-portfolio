'use client'

import { useEffect } from 'react'
import { BEATS } from '@/lib/script'
import { PACING_SKIP_SECONDS } from '@/lib/tokens'
import { useConsoleStore } from '@/store/console-store'
import { useDirector } from './use-director'

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName.toLowerCase()
  return tag === 'input' || tag === 'textarea' || target.isContentEditable
}

export function usePresenterKeys() {
  const { advance, retreat, jumpScene, reset } = useDirector()
  const autoPlay = useConsoleStore((s) => s.autoPlay)
  const demoBarVisible = useConsoleStore((s) => s.demoBarVisible)
  const patch = useConsoleStore((s) => s.patch)
  const skipPacing = useConsoleStore((s) => s.skipPacing)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault()
          advance()
          break
        case 'ArrowLeft':
          event.preventDefault()
          retreat()
          break
        case 'ArrowUp':
          event.preventDefault()
          jumpScene('prev')
          break
        case 'ArrowDown':
          event.preventDefault()
          jumpScene('next')
          break
        case 'f':
        case 'F':
          event.preventDefault()
          skipPacing(PACING_SKIP_SECONDS)
          break
        case ' ':
          event.preventDefault()
          patch({ autoPlay: !autoPlay })
          break
        case 'r':
        case 'R':
          event.preventDefault()
          reset()
          break
        case 'h':
        case 'H':
          event.preventDefault()
          patch({ demoBarVisible: !demoBarVisible })
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [advance, retreat, jumpScene, reset, autoPlay, demoBarVisible, patch, skipPacing])

  useEffect(() => {
    if (!autoPlay) return
    const id = window.setInterval(() => {
      const { beatIndex } = useConsoleStore.getState()
      const beat = beatIndex >= 0 ? BEATS[beatIndex] : null
      if (beat?.gate) return
      advance()
    }, 2800)
    return () => window.clearInterval(id)
  }, [autoPlay, advance])
}
