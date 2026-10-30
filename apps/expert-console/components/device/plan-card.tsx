'use client'

import { ShieldCheck } from '@phosphor-icons/react'
import { VerizonLogo } from '@/components/handoff/verizon-logo'
import type { ProtectionPlan } from '@/lib/types'

/**
 * The account's protection plan. Shown on the device step and, expanded, on the
 * customer summary card — one plan treatment in both places.
 */
export function PlanCard({
  plan,
  smallAction = false,
}: {
  plan: ProtectionPlan
  /** Take the action down a size — for the card nested in the customer summary. */
  smallAction?: boolean
}) {
  return (
    <div className="plan-card">
      <div className="plan-card-header">
        {/*
          The carrier's real mark — the same SVG the warm-handoff dialog uses —
          rather than the red italic text stand-in it replaced.

          Both numbers come out of that viewBox's padding: the glyph is ~40% of the
          box height, so `h-7` draws an ~11px mark (sitting just under the plan name
          below it), and it starts ~12% in from the left, so the negative margin is
          what pulls the visible mark flush with the name rather than indented from
          it. Retune both together if the height changes.
        */}
        {plan.carrier ? <VerizonLogo className="-ml-[8px] h-7 w-auto" /> : null}
        <span className="aui-tag aui-tag--success">
          <ShieldCheck size={12} weight="fill" aria-hidden />
          {plan.status}
        </span>
      </div>
      <p className="plan-card-name">{plan.name}</p>
      {plan.coveredSince ? (
        <p className="plan-card-detail">Covered since {plan.coveredSince}</p>
      ) : null}
      <button
        type="button"
        className={`plan-card-details-btn${smallAction ? ' plan-card-details-btn--small' : ''}`}
      >
        Coverage details
      </button>
    </div>
  )
}
