'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@phosphor-icons/react'
import { ActionDock } from './action-dock'

/** Bottom-sheet host rendered once by the sidecar, above the Assist composer. */
export const INPUT_WIDGET_LAYER_ID = 'input-widget-layer'

/** Long enough to cover the exit animation if `animationend` never fires. */
const EXIT_SWEEP_MS = 500

export function InputWidgetLayer() {
  return <div id={INPUT_WIDGET_LAYER_ID} className="input-widget-layer" />
}

/**
 * AUI Input Widget — the bottom sheet that rises over the guidance column and
 * sits above the Assist composer, matching Figma `Composer / Chat › Input
 * Widget`. Portaled into the sidecar layer, never out of `.workspace-panel`,
 * so the Sell BorderBeam and edge veil keep clipping correctly. Closing hands
 * control back to the conversation behind it.
 */
export function InputWidget({
  title,
  onClose,
  children,
  footer,
  className = '',
}: {
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  className?: string
}) {
  const [layer, setLayer] = useState<HTMLElement | null>(null)
  // A callback ref rather than a plain one: React detaches refs while unmounting,
  // and the exit below needs the node on the way out.
  const sheetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setLayer(document.getElementById(INPUT_WIDGET_LAYER_ID))
  }, [])

  /**
   * Exit. Every caller renders this sheet conditionally, so when an action settles
   * the whole subtree unmounts and React drops the node — a component can't defer
   * its own unmount, and the verify sheet's owner returns null on the same commit
   * anyway. So on the way out we hand a static clone to the layer and let CSS sink
   * and fade it (`.input-widget-exit`), then drop it. A snapshot is all the exit
   * needs: nothing in it is interactive any more, and `inert` keeps it out of the
   * tab order and the a11y tree while it plays.
   *
   * It's deliberately quicker than the rise, so it's gone well before the next
   * sheet's loader arrives. Under reduced motion there's no clone at all — the
   * sheet just goes, as it always did.
   */
  useLayoutEffect(
    () => () => {
      const sheet = sheetRef.current
      const host = document.getElementById(INPUT_WIDGET_LAYER_ID)
      if (!sheet || !host) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const ghost = sheet.cloneNode(true) as HTMLElement
      ghost.classList.add('input-widget-exit')
      ghost.removeAttribute('role')
      ghost.removeAttribute('aria-label')
      ghost.setAttribute('aria-hidden', 'true')
      ghost.setAttribute('inert', '')
      // Appended as a flex child, exactly where the original sat. Both mutations
      // land in one commit, so the two never paint side by side.
      host.appendChild(ghost)

      const drop = () => {
        window.clearTimeout(sweep)
        ghost.remove()
      }
      const sweep = window.setTimeout(drop, EXIT_SWEEP_MS)
      ghost.addEventListener('animationend', drop, { once: true })
    },
    [],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  if (!layer) return null

  return createPortal(
    <div
      ref={(node) => {
        if (node) sheetRef.current = node
      }}
      className={`input-widget ${className}`.trim()}
      role="dialog"
      aria-label={title}
    >
      <div className="input-widget-header">
        <p className="input-widget-title">{title}</p>
        <button
          type="button"
          className="input-widget-close motion-press"
          aria-label="Close"
          onClick={onClose}
        >
          <X size={20} weight="regular" />
        </button>
      </div>
      <div className="input-widget-body">{children}</div>
      {footer ? <ActionDock className="input-widget-footer">{footer}</ActionDock> : null}
    </div>,
    layer,
  )
}
