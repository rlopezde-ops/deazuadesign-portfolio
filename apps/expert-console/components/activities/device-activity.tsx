'use client'

import { useEffect, useRef, useState } from 'react'
import { Task } from '@/components/task'
import {
  ActionDockPrimary,
  ActionDockSecondary,
  InputWidget,
} from '@/components/chat'
import {
  DeviceCard,
  DeviceDetailCard,
  DeviceGrid,
  EmptySlotCard,
  PlanCard,
} from '@/components/device'
import { invalidateDownstreamFrom } from '@/lib/flow-steps'
import { PROTECTION_PLAN } from '@/lib/fixtures'
import { ACCOUNT_DEVICES, DEVICE_COPY } from '@/lib/task-content'
import { useConsoleStore } from '@/store/console-store'
import { useDirector } from '@/hooks/use-director'
import { useStatusSequence } from '@/hooks/use-status-sequence'

const DEFAULT_DEVICE_ID = 'iphone-15'
/** Hold the success check briefly before advancing — no spinner for a local pick. */
const INSTANT_SUCCESS_MS = 600

export function DeviceActivity({
  review = false,
  persist = false,
}: {
  review?: boolean
  persist?: boolean
}) {
  const activities = useConsoleStore((s) => s.activities)
  const selectedDeviceId = useConsoleStore((s) => s.selectedDeviceId)
  const openWidget = useConsoleStore((s) => s.openWidget)
  const patch = useConsoleStore((s) => s.patch)
  const { resolveGate } = useDirector()

  const [uiSelectedId, setUiSelectedId] = useState<string | null>(
    selectedDeviceId ?? DEFAULT_DEVICE_ID,
  )
  const pendingIdRef = useRef<string | null>(null)

  const storeDone = review ? false : Boolean(selectedDeviceId)

  const { phase, begin, isBusy } = useStatusSequence({
    storeDone,
    skipPending: true,
    successMs: INSTANT_SUCCESS_MS,
    onResolve: () => {
      const id = pendingIdRef.current ?? uiSelectedId
      if (!id) return
      patch({
        selectedDeviceId: id,
        openWidget: null,
        activities: {
          ...useConsoleStore.getState().activities,
          activation: 'active',
        },
        scene: 'activation',
      })
      if (review) {
        invalidateDownstreamFrom('device')
        return
      }
      resolveGate()
    },
  })

  useEffect(() => {
    if (selectedDeviceId === null && !review) {
      setUiSelectedId(DEFAULT_DEVICE_ID)
    }
  }, [selectedDeviceId, review])

  useEffect(() => {
    if (selectedDeviceId || review || isBusy) return
    const timer = setTimeout(() => {
      patch({ openWidget: 'device-detail' })
    }, 300)
    return () => clearTimeout(timer)
  }, [selectedDeviceId, review, patch, isBusy])

  if (activities.activation === 'hidden' && !review && !persist) {
    // After verify, activation stays hidden until a device is confirmed —
    // still render when this step is the live view (sidecar passes persist).
    return null
  }

  // Through `success`, not just `pending`: this sequence skips pending, so the
  // check in the footer is the only confirmation the expert gets, and it belongs
  // where they clicked. `done` closes the sheet and advances the flow together.
  const sheetOpen = openWidget === 'device-detail' && phase !== 'done'
  const detailDevice =
    sheetOpen && uiSelectedId ? ACCOUNT_DEVICES.find((d) => d.id === uiSelectedId) : null

  const openDetail = (deviceId: string) => {
    if (isBusy) return
    setUiSelectedId(deviceId)
    patch({ openWidget: 'device-detail' })
  }

  const activateDevice = () => {
    if (!uiSelectedId || isBusy) return
    pendingIdRef.current = uiSelectedId
    begin(true)
  }

  const dismissDetail = () => {
    if (isBusy) return
    patch({ openWidget: null })
  }

  const showInlineStatus = phase === 'pending' || phase === 'success' || (phase === 'done' && persist)

  return (
    <Task cue={showInlineStatus && !sheetOpen ? false : undefined}>
      <Task.Eyebrow>
        {DEVICE_COPY.eyebrow}
        {phase === 'done' && persist ? ' · Done' : ''}
      </Task.Eyebrow>
      <Task.Verbatim>{DEVICE_COPY.verbatim}</Task.Verbatim>
      <Task.Body>
        <div className="plan-device-section">
          <PlanCard plan={PROTECTION_PLAN} />
          <div className="plan-card-divider" />
          <DeviceGrid>
            <EmptySlotCard
              orientation="vertical"
              label={DEVICE_COPY.addDevice}
              onAdd={() => openDetail(DEFAULT_DEVICE_ID)}
            />
            {ACCOUNT_DEVICES.map((asset) => (
              <DeviceCard
                key={asset.id}
                asset={asset}
                orientation="vertical"
                selected={uiSelectedId === asset.id}
                onSelect={() => openDetail(asset.id)}
              />
            ))}
          </DeviceGrid>
        </div>

        {showInlineStatus && !sheetOpen ? (
          <Task.Status
            phase="success"
            pendingLabel=""
            successLabel={DEVICE_COPY.successConfirm}
          />
        ) : null}

        {sheetOpen && detailDevice ? (
          <InputWidget
            title={detailDevice.name}
            onClose={dismissDetail}
            footer={
              isBusy ? (
                <Task.Status
                  phase="success"
                  pendingLabel=""
                  successLabel={DEVICE_COPY.successConfirm}
                />
              ) : (
                <>
                  <ActionDockPrimary onClick={activateDevice}>
                    {DEVICE_COPY.activateCta}
                  </ActionDockPrimary>
                  <ActionDockSecondary onClick={dismissDetail}>
                    {DEVICE_COPY.somethingElse}
                  </ActionDockSecondary>
                </>
              )
            }
          >
            <DeviceDetailCard asset={detailDevice} />
          </InputWidget>
        ) : null}
      </Task.Body>
    </Task>
  )
}
