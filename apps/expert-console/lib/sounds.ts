'use client'

// Warm-handoff notification sounds, ported from the reference prototype
// (warm-handoff/index3d.html). Two clips:
//   connect → call connects (the warm-handoff modal appears / standby begins)
//   onAir   → the expert goes live on air
//
// Browsers block programmatic audio until a user gesture. We prime both clips
// inside the notification-gate click (play muted, then pause/reset) so later
// state-driven plays are allowed. "Allow notifications" enables sound; "Not
// now" leaves them off — the same split the reference makes.
//
// Preference is stored in sessionStorage so a Fast Refresh / remount does not
// silently mute the handoff after the expert already allowed notifications.

type SoundName = 'connect' | 'onAir'

const SOURCES: Record<SoundName, string> = {
  connect: '/sounds/alert1.mp3',
  onAir: '/sounds/alert2.mp3',
}

const STORAGE_KEY = 'expert-console-sound-enabled'

let clips: Record<SoundName, HTMLAudioElement> | null = null
let enabled = false
let reprimeBound = false

function readPreference(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writePreference(on: boolean) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(STORAGE_KEY, on ? '1' : '0')
  } catch {
    /* private mode / blocked storage — in-memory flag still works for the session */
  }
}

function getClips() {
  if (typeof window === 'undefined') return null
  if (!clips) {
    clips = {
      connect: new Audio(SOURCES.connect),
      onAir: new Audio(SOURCES.onAir),
    }
    for (const clip of Object.values(clips)) clip.preload = 'auto'
  }
  return clips
}

function primeClips() {
  const c = getClips()
  if (!c) return
  for (const clip of Object.values(c)) {
    // Muted + volume 0 so the priming play is truly silent — the "Allow" click
    // itself must make no sound. `muted` guarantees no output even if the
    // volume restore below wins the race with the play() promise; the gesture-
    // initiated play still unlocks later programmatic playback.
    clip.muted = true
    clip.volume = 0
    clip
      .play()
      .then(() => {
        clip.pause()
        clip.currentTime = 0
        clip.volume = 1
        clip.muted = false
      })
      .catch(() => {
        clip.volume = 1
        clip.muted = false
      })
  }
}

/** After HMR, Audio elements are new and locked again — re-prime on the next gesture. */
function bindReprimeOnGesture() {
  if (typeof window === 'undefined' || reprimeBound) return
  reprimeBound = true
  const onGesture = () => {
    if (readPreference()) primeClips()
  }
  window.addEventListener('pointerdown', onGesture, { capture: true })
}

/**
 * Call from within a user gesture (the notification-gate click). Primes both
 * clips silently so subsequent programmatic plays are allowed, and enables
 * playback.
 */
export function enableSound() {
  writePreference(true)
  enabled = true
  primeClips()
  bindReprimeOnGesture()
}

/** Disable playback (the user chose "Not now" on the notification gate). */
export function disableSound() {
  writePreference(false)
  enabled = false
}

function isSoundEnabled() {
  if (enabled) return true
  if (readPreference()) {
    enabled = true
    bindReprimeOnGesture()
    return true
  }
  return false
}

/** Play a clip if sound was enabled at the gate. No-op otherwise. */
export function playSound(name: SoundName) {
  if (!isSoundEnabled()) return
  const c = getClips()
  if (!c) return
  const audio = c[name]
  audio.currentTime = 0
  audio.play().catch(() => {
    // Autoplay may still be locked after a remount — next pointerdown re-primes.
    bindReprimeOnGesture()
  })
}

// Restore preference across Fast Refresh so handoff chimes keep working mid-session.
if (typeof window !== 'undefined' && readPreference()) {
  enabled = true
  bindReprimeOnGesture()
}
