import type { KeyboardEvent, ReactNode } from 'react'

import { motion } from 'framer-motion'
import clsx from 'clsx'

import { activateOnKey } from '@/expert-hub/cards/activateOnKey'

import styles from './FlipCard.module.css'

interface Props {
  front: ReactNode
  back: ReactNode
  flipped: boolean
  onFlip: () => void
  className?: string
}

const SPRING = { type: 'spring' as const, stiffness: 180, damping: 26, mass: 0.9 }

export function FlipCard({ front, back, flipped, onFlip, className }: Props) {
  return (
    <div
      className={clsx(styles.scene, className)}
      onClick={onFlip}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => activateOnKey(e, onFlip)}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={flipped ? 'Show metric' : 'Show payment details'}
    >
      <motion.div
        className={styles.card}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={SPRING}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className={styles.face}>{front}</div>
        <div className={clsx(styles.face, styles.back)}>{back}</div>
      </motion.div>
    </div>
  )
}
