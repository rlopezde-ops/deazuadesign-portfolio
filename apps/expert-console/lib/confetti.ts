'use client'

import confetti from 'canvas-confetti'

const ENROLLMENT_COLORS = ['#D4BBFF', '#F8EEF9', '#34D399', '#FFD584', '#8AD4FF'] as const

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/** Celebratory burst when VHDP enrollment completes. */
export function fireEnrollmentConfetti() {
  if (typeof window === 'undefined') return
  if (prefersReducedMotion()) return

  const colors = ENROLLMENT_COLORS as unknown as string[]

  confetti({
    particleCount: 140,
    spread: 100,
    startVelocity: 55,
    gravity: 0.9,
    ticks: 280,
    colors,
    scalar: 1.1,
    zIndex: 99999,
    origin: { x: 0.72, y: 0.3 },
    angle: 120,
  })

  window.setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 120,
      startVelocity: 45,
      gravity: 0.9,
      ticks: 280,
      colors,
      scalar: 1,
      zIndex: 99999,
      origin: { x: 0.45, y: 0.35 },
      angle: 80,
    })
  }, 100)

  window.setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 140,
      startVelocity: 38,
      gravity: 0.85,
      ticks: 300,
      colors,
      scalar: 0.9,
      zIndex: 99999,
      origin: { x: 0.6, y: 0.25 },
      angle: 95,
    })
  }, 220)

  window.setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 100,
      startVelocity: 30,
      gravity: 0.8,
      ticks: 260,
      colors,
      scalar: 1.2,
      zIndex: 99999,
      origin: { x: 0.35, y: 0.4 },
      angle: 70,
    })
  }, 380)
}
