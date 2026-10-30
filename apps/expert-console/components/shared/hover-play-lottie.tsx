'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { Lottie, type LottieHandle } from 'lottie-react'

/**
 * A Lottie that rests on its first frame and plays through exactly once each
 * time `playToken` changes, then settles back on the first frame. Generic on
 * purpose: hand it any animation and drive it from a parent's hover / focus /
 * click — this file knows nothing about hearts or stat cards.
 *
 * `src` is a path fetched at runtime (kept out of the JS bundle), or parsed
 * animation data. It loads with `autoplay` off, so the first frame is what
 * shows at rest. With `playOnMount`, it also plays a single pass as soon as the
 * animation is loaded (e.g. when a screen appears), then rests on frame 1.
 */
export function HoverPlayLottie({
  src,
  playToken,
  playOnMount = false,
  className,
  style,
}: {
  src: string | object
  /** Bump this (e.g. on mouse-enter) to play the animation once. */
  playToken: number
  /** Play a single pass once the animation loads, then rest on frame 1. */
  playOnMount?: boolean
  className?: string
  style?: CSSProperties
}) {
  const lottieRef = useRef<LottieHandle>(null)
  // The token's value at mount — so the initial render rests on frame 1 and
  // only a later change (a real hover) triggers a play-through.
  const restingToken = useRef(playToken)
  // Guards the load-time play so it fires exactly once per mount.
  const playedOnMount = useRef(false)

  useEffect(() => {
    if (playToken === restingToken.current) return
    const lottie = lottieRef.current
    if (!lottie) return
    // Always start from the first frame, even if a prior play-through is still
    // mid-flight, so every hover is a clean single pass.
    lottie.seek(0)
    lottie.play()
  }, [playToken])

  return (
    <Lottie
      lottieRef={lottieRef}
      src={src}
      autoplay={false}
      loop={false}
      aria-hidden="true"
      className={className}
      style={style}
      subscriptions={{
        // Loaded and ready: kick off the one-time entrance play if asked.
        ready: () => {
          if (!playOnMount || playedOnMount.current) return
          playedOnMount.current = true
          lottieRef.current?.seek(0)
          lottieRef.current?.play()
        },
        // One pass done → return to (and pause on) the first frame.
        complete: () => lottieRef.current?.stop(),
      }}
    />
  )
}
