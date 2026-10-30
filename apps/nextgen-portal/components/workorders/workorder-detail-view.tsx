"use client";

import { useState } from "react";
import { Action, AlertBanner, Icon, Modal, Text, TextField } from "@asurion-core/mx-asurion-ui-react";
import { WORK_ORDERS, WO_STATUS_LABELS, formatWODate } from "@/lib/check-in-data";
import { cn } from "@/lib/utils";

// ── Delay alert ───────────────────────────────────────────────────────────────

type AlertSeverity = "delayed" | "at-risk";

const DELAY_REASONS: Record<string, string> = {
  "awaiting-item":     "Parts not arrived on time.",
  "awaiting-callback": "No callback for 2 days.",
  "need-to-order":     "Part did not arrive on time.",
  "work-in-progress":  "Repair is taking longer than expected.",
  "quality-check":     "Quality check taking longer than expected.",
  "diagnostics":       "Diagnostics taking longer than expected.",
  "ready-for-work":    "Work not started in 24 hours.",
};

function getAlertSeverity(nextUpdate: string | undefined): AlertSeverity | null {
  if (!nextUpdate) return null;
  const now = new Date();
  const due = new Date(nextUpdate);
  if (due < now) return "delayed";
  if (due.getTime() - now.getTime() < 24 * 60 * 60 * 1000) return "at-risk";
  return null;
}

export function getPickupAlertSeverity(workCompleted: string | undefined): AlertSeverity | null {
  if (!workCompleted) return null;
  const daysSince = (Date.now() - new Date(workCompleted).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince >= 7) return "delayed";
  if (daysSince >= 3) return "at-risk";
  return null;
}

type DateTimePickerModalProps = {
  currentValue: string | undefined;
  onClose: () => void;
  onSave: (value: string) => void;
};

function DateTimePickerModal({ currentValue, onClose, onSave }: DateTimePickerModalProps) {
  const initial = currentValue
    ? new Date(currentValue).toISOString().slice(0, 16)
    : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const [value, setValue] = useState(initial);
  const [notes, setNotes] = useState("");

  return (
    <Modal
      isOpen
      title="Change next update"
      primaryButtonLabel="Save"
      secondaryButtonLabel="Cancel"
      onCloseClick={onClose}
      onPrimaryClick={() => onSave(new Date(value).toISOString())}
      onSecondaryClick={onClose}
      showXButton
    >
      <TextField
        label="Date & time"
        type="datetime-local"
        value={value}
        onChange={(e) => setValue((e.target as HTMLInputElement).value)}
        containerClassName="mt-2"
      />
      <div className="mt-4 flex flex-col gap-1">
        <label className="text-sm font-medium text-[var(--aui-on-surface)]">Notes</label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add a note about the delay..."
          className="w-full resize-none rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline)] bg-[var(--aui-surface)] px-3 py-2 text-sm text-[var(--aui-on-surface)] placeholder:text-[var(--aui-on-surface-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--aui-primary)]"
        />
      </div>
    </Modal>
  );
}

type DelayAlertBannerProps = {
  severity: AlertSeverity;
  reason: string;
  onChangeNextUpdate: () => void;
  onDismiss: () => void;
};

function DelayAlertBanner({ severity, reason, onChangeNextUpdate, onDismiss }: DelayAlertBannerProps) {
  const isDelayed = severity === "delayed";
  return (
    <AlertBanner
      isOpen
      alertBannerType={isDelayed ? "error" : "warn"}
      display="inline"
      iconName="warning"
      onCloseClick={onDismiss}
      button={{
        text: "Change next update",
        onClick: onChangeNextUpdate,
        variant: "flat",
        size: "small",
      }}
    >
      <span className="font-semibold">{isDelayed ? "Delayed" : "At risk"}</span>
      {" — "}
      {reason}
    </AlertBanner>
  );
}

// ── Mock part line items ──────────────────────────────────────────────────────

type PartStatus = "reserved" | "ordered" | "received" | "installed";

type PartLineItem = {
  id: string;
  name: string;
  sku: string;
  status: PartStatus;
  price: number;
  priceNote?: string;
  labor: number;
  credit: number;
};

const PART_STATUS_LABELS: Record<PartStatus, string> = {
  reserved: "Reserved",
  ordered: "Ordered",
  received: "Received",
  installed: "Installed",
};

const PART_STATUS_COLORS: Record<PartStatus, string> = {
  reserved: "bg-[#0A3A6B] text-[#7EC8FF]",
  ordered: "bg-[#3B1F7A] text-[#C4A8FF]",
  received: "bg-[#0A4A2E] text-[#6EE7A8]",
  installed: "bg-[var(--aui-on-surface-soft)] text-white",
};

type WONote = {
  id: string;
  author: string;
  authorInitials: string;
  createdAt: string;
  body: string;
  status: string;
};

// Mock parts per WO id
const MOCK_PARTS: Record<string, PartLineItem[]> = {
  "500070127": [
    {
      id: "1",
      name: "iPhone 12 Glass/LCD, APA-IPH12-1000-KIT, OEM",
      sku: "215461-0000010236",
      status: "reserved",
      price: 26.0,
      labor: 24.0,
      credit: 0.0,
    },
  ],
};

const MOCK_NOTES: Record<string, WONote[]> = {
  "500070127": [
    {
      id: "1",
      author: "timothy k",
      authorInitials: "TK",
      createdAt: "2026-07-01T09:56:00Z",
      body: "sdaf as dfasd fsd fadsf asdfds",
      status: "Work In Progress",
    },
  ],
};

function fallbackParts(woId: string): PartLineItem[] {
  return MOCK_PARTS[woId] ?? [];
}

function fallbackNotes(woId: string): WONote[] {
  return MOCK_NOTES[woId] ?? [];
}

// ── Status badge ──────────────────────────────────────────────────────────────

const WO_STATUS_COLORS: Record<string, string> = {
  "need-to-order":     "bg-[#3B1F7A] text-[#C4A8FF]",
  "ready-for-work":    "bg-[#0A3A6B] text-[#7EC8FF]",
  "diagnostics":       "bg-[#0A3A6B] text-[#7EC8FF]",
  "work-in-progress":  "bg-[#0A3A6B] text-[#7EC8FF]",
  "repair-summary":    "bg-[#0A3A6B] text-[#7EC8FF]",
  "quality-check":     "bg-[var(--aui-on-surface)] text-[var(--aui-surface)]",
  "awaiting-item":     "bg-[#4A3800] text-[#FFD966]",
  "awaiting-callback": "bg-[#4A3800] text-[#FFD966]",
  "ready-for-pickup":  "bg-[#0A4A2E] text-[#6EE7A8]",
};

// ── Progress timeline ─────────────────────────────────────────────────────────

// Which segment the dynamic step appears in
type DynamicPlacement = "pre-work" | "post-work" | "post-completed";

// Statuses that appear as a dynamic step, and where they go
const DYNAMIC_STEP_LABELS: Record<string, string> = {
  "ready-for-work":    "Ready for work",
  "diagnostics":       "Diagnostics",
  "work-in-progress":  "Work in progress",
  "quality-check":     "Quality check",
  "repair-summary":    "Repair summary",
  "need-to-order":     "Need to order",
  "awaiting-item":     "Awaiting item",
  "awaiting-callback": "Awaiting callback",
  "ready-for-pickup":  "Ready for pickup",
};

const DYNAMIC_STEP_PLACEMENT: Record<string, DynamicPlacement> = {
  "ready-for-work":    "pre-work",
  "diagnostics":       "post-work",
  "work-in-progress":  "post-work",
  "quality-check":     "post-work",
  "repair-summary":    "post-work",
  "ready-for-pickup":  "post-completed",
};

// These can appear in either segment — placement derived from whether work has started
const CONTEXT_SENSITIVE_STATUSES = new Set(["need-to-order", "awaiting-item", "awaiting-callback"]);

type MilestoneData = {
  woCreated?: string;
  workStarted?: string;
  workCompleted?: string;
  pickupDate?: string;
  salesComplete?: string;
  statusChangedAt?: string;
};

type StepKind = "milestone" | "dynamic";

type TimelineStep = {
  kind: StepKind;
  label: string;
  timestamp?: string;
  pickupDate?: string;
};

type ResolvedStep = TimelineStep & { isComplete: boolean };

function resolveSteps(steps: TimelineStep[]): ResolvedStep[] {
  const now = new Date();
  return steps.map((s) => {
    if (s.kind === "dynamic") return { ...s, isComplete: false };
    const ts = s.timestamp ? new Date(s.timestamp) : null;
    return { ...s, isComplete: ts !== null && ts <= now };
  });
}

function buildTimelineSteps(milestones: MilestoneData, woStatus: string): TimelineStep[] {
  const fixed: TimelineStep[] = [
    { kind: "milestone", label: "WO created",      timestamp: milestones.woCreated },
    { kind: "milestone", label: "Work started",    timestamp: milestones.workStarted },
    { kind: "milestone", label: "Work completed",  timestamp: milestones.workCompleted },
    { kind: "milestone", label: "Sales complete",  timestamp: milestones.salesComplete },
  ];

  let placement = DYNAMIC_STEP_PLACEMENT[woStatus];

  // Context-sensitive statuses: post-work if workStarted milestone is set, else pre-work
  if (!placement && CONTEXT_SENSITIVE_STATUSES.has(woStatus)) {
    placement = milestones.workStarted ? "post-work" : "pre-work";
  }

  if (!placement) return fixed;

  const dynamic: TimelineStep = {
    kind: "dynamic",
    label: DYNAMIC_STEP_LABELS[woStatus] ?? woStatus,
    pickupDate: woStatus === "ready-for-pickup" ? milestones.pickupDate : undefined,
  };

  if (placement === "pre-work")       return [fixed[0], dynamic, fixed[1], fixed[2], fixed[3]];
  if (placement === "post-completed") return [fixed[0], fixed[1], fixed[2], dynamic, fixed[3]];
  return [fixed[0], fixed[1], dynamic, fixed[2], fixed[3]];
}

// Mock milestone data per WO id
export const MOCK_MILESTONES: Record<string, MilestoneData> = {
  // Scenario 1: WO created → Awaiting item (alert) → Work started → Ready for pickup → Sales complete
  "500070127": {
    woCreated: "2026-07-01T08:00:00Z",
    pickupDate: "2026-07-05T14:00:00Z",
  },
  // Scenario 2: WO created → Work started → Work completed → Ready for pickup (alert: no pickup for 7+ days) → Sales complete
  "500067911": {
    woCreated: "2026-08-01T08:00:00Z",
    workStarted: "2026-08-01T10:30:00Z",
    workCompleted: "2026-08-15T10:00:00Z",
    pickupDate: "2026-08-18T14:00:00Z",
  },
  // Scenario 3: WO created → Work started → Awaiting callback (alert: no callback for 2 days) → Ready for pickup → Sales complete
  "500071201": {
    woCreated: "2026-04-19T11:30:00Z",
    workStarted: "2026-04-20T09:00:00Z",
    pickupDate: "2026-04-26T14:00:00Z",
  },
  // Scenario 4: WO created → Work started → Quality check (on time) → Ready for pickup → Sales complete
  "500072010": {
    woCreated: "2026-04-23T11:00:00Z",
    workStarted: "2026-04-23T14:00:00Z",
    pickupDate: "2026-04-28T11:00:00Z",
  },
  // Scenario 5: WO created → Work started → Diagnostics (on time) → Ready for pickup → Sales complete
  "500069463": {
    woCreated: "2026-03-13T04:51:00Z",
    workStarted: "2026-03-13T09:00:00Z",
    statusChangedAt: "2026-03-13T10:15:00Z",
    pickupDate: "2026-03-18T10:00:00Z",
  },
  // Scenario 6: WO created → Work started → Work in progress (on time) → Ready for pickup → Sales complete
  "500071510": {
    woCreated: "2026-04-21T10:20:00Z",
    workStarted: "2026-04-21T13:00:00Z",
    statusChangedAt: "2026-04-21T13:45:00Z",
    pickupDate: "2026-04-26T10:00:00Z",
  },
  // Scenario 7: WO created → Work started → Repair summary (on time) → Ready for pickup → Sales complete
  "500070075": {
    woCreated: "2026-03-30T08:31:00Z",
    workStarted: "2026-03-30T11:00:00Z",
    statusChangedAt: "2026-03-30T14:20:00Z",
    pickupDate: "2026-04-04T14:00:00Z",
  },
  // Scenario 8: WO created → Ready to start (alert: work not started in 24 hours) → Work started → Ready for pickup → Sales complete
  "500073370": {
    woCreated: "2026-04-27T14:00:00Z",
    pickupDate: "2026-05-04T14:00:00Z",
  },
  // RFP at-risk: workCompleted 4 days ago (3–7 day window → yellow warning)
  "500068798": {
    woCreated: "2026-08-18T09:00:00Z",
    workStarted: "2026-08-18T11:00:00Z",
    workCompleted: "2026-08-22T10:00:00Z",
  },
  // RFP on-time: workCompleted 1 day ago (< 3 days → no alert)
  "500070682": {
    woCreated: "2026-08-23T09:00:00Z",
    workStarted: "2026-08-23T11:30:00Z",
    workCompleted: "2026-08-25T10:00:00Z",
  },
  // Work in progress, at-risk
  "500072315": {
    woCreated: "2026-08-25T06:00:00Z",
    workStarted: "2026-08-26T09:00:00Z",
    statusChangedAt: "2026-08-26T11:30:00Z",
  },
};

const DEFAULT_MILESTONES: MilestoneData = {
  pickupDate: "2026-07-10T10:00:00Z",
};

function formatTs(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase(),
  };
}

type WOTimelineProps = {
  milestones: MilestoneData;
  woStatus: string;
  estimatedPickup?: string | null;
  nextUpdate?: string | null;
  alertSeverity?: AlertSeverity | null;
  alertReason?: string;
  onChangeNextUpdate?: () => void;
  onContactCustomer?: () => void;
};

function WOTimeline({ milestones, woStatus, estimatedPickup, nextUpdate, alertSeverity, alertReason, onChangeNextUpdate, onContactCustomer }: WOTimelineProps) {
  const isDelayed = alertSeverity === "delayed";
  const hasAlert = alertSeverity === "delayed" || alertSeverity === "at-risk";
  const steps = buildTimelineSteps(milestones, woStatus);
  const resolved = resolveSteps(steps);

  return (
    <div className="flex items-start">

      {resolved.map((step, i) => {
        const isLast = i === resolved.length - 1;
        const ts = step.timestamp ? formatTs(step.timestamp) : null;
        const isDynamic = step.kind === "dynamic";
        const hasStepAlert = hasAlert && isDynamic;

        // Left connector is filled if the previous step is a complete milestone
        const prev = i > 0 ? resolved[i - 1] : null;
        const leftFilled = prev !== null && prev.kind === "milestone" && prev.isComplete;
        // Right connector is filled if this step is a complete milestone
        const rightFilled = step.kind === "milestone" && step.isComplete;

        const dotClass = cn(
          "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          hasStepAlert && isDelayed   && "border-[#FFADAD] bg-[#7A1E1E]",
          hasStepAlert && !isDelayed  && "border-[#FFD966] bg-[#4A3800]",
          !hasStepAlert && isDynamic  && "border-[#6EE7A8] bg-[#0A4A2E]",
          !hasStepAlert && !isDynamic && step.isComplete  && "border-[var(--aui-primary)] bg-[var(--aui-primary)]",
          !hasStepAlert && !isDynamic && !step.isComplete && "border-[var(--aui-outline-soft)] bg-transparent"
        );

        const labelClass = cn(
          "mt-2 text-[11px] font-semibold leading-tight",
          hasStepAlert && isDelayed   && "text-[#FFADAD]",
          hasStepAlert && !isDelayed  && "text-[#FFD966]",
          !hasStepAlert && isDynamic  && "text-[#6EE7A8]",
          !hasStepAlert && !isDynamic && step.isComplete  && "text-[var(--aui-on-surface)]",
          !hasStepAlert && !isDynamic && !step.isComplete && "text-[var(--aui-on-surface-soft)]"
        );

        return (
          <div key={step.label} className="flex flex-1 flex-col items-center">
            {/* Dot row */}
            <div className="flex w-full items-center">
              <div className={cn("h-0.5 flex-1", leftFilled ? "bg-[var(--aui-primary)]" : i === 0 ? "bg-transparent" : "bg-[var(--aui-outline-soft)]")} />

              <div className={dotClass}>
                {hasStepAlert && (
                  <Icon.Phosphor name={isDelayed ? "warning-circle" : "warning"} size="small" weight="fill" aria-hidden
                    className={cn("!h-3.5 !w-3.5", isDelayed ? "text-[#FFADAD]" : "text-[#FFD966]")} />
                )}
                {!hasStepAlert && isDynamic && (
                  <Icon.Phosphor name="clock" size="small" weight="fill" aria-hidden className="!h-3 !w-3 text-[#6EE7A8]" />
                )}
                {!isDynamic && step.isComplete && (
                  <Icon.Phosphor name="check" size="small" weight="bold" aria-hidden className="!h-3 !w-3 text-white" />
                )}
              </div>

              <div className={cn("h-0.5 flex-1", rightFilled ? "bg-[var(--aui-primary)]" : isLast ? "bg-transparent" : "bg-[var(--aui-outline-soft)]")} />
            </div>

            {/* Label + sub-text */}
            <div className="flex flex-col items-center gap-0.5 px-1 text-center">
              <span className={labelClass}>{step.label}</span>
              {ts && <span className="text-[10px] text-[var(--aui-on-surface-soft)]">{ts.date} {ts.time}</span>}
              {/* Pickup date under Work completed step */}
              {step.label === "Work completed" && !step.isComplete && estimatedPickup && (() => {
                const p = formatTs(estimatedPickup);
                return (
                  <span className="mt-0.5 text-[10px] text-[var(--aui-on-surface-soft)]">
                    <span className="italic">Est. </span>{p.date} {p.time}
                  </span>
                );
              })()}
              {/* Alert callout below the alerted step */}
              {hasStepAlert && alertReason && (
                <div className={cn(
                  "mt-1.5 rounded-md px-2.5 py-1.5 text-[10px] leading-snug text-center max-w-[160px]",
                  isDelayed ? "bg-[#7A1E1E] text-[#FFADAD]" : "bg-[#4A3800] text-[#FFD966]"
                )}>
                  <span className="font-semibold">{isDelayed ? "Delayed" : "At risk"}: </span>
                  {alertReason}
                  {(woStatus === "ready-for-pickup" || woStatus === "awaiting-callback") && onContactCustomer ? (
                    <>{" · "}<button type="button" onClick={onContactCustomer} className="font-semibold underline-offset-1 hover:underline">Contact customer</button></>
                  ) : onChangeNextUpdate ? (
                    <>{" · "}<button type="button" onClick={onChangeNextUpdate} className="font-semibold underline-offset-1 hover:underline">Update</button></>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type DetailTab = "parts" | "notes" | "customer";

export function WorkOrderDetailView({ id }: { id: string }) {
  const wo = WORK_ORDERS.find((w) => w.id === id);
  const [activeTab, setActiveTab] = useState<DetailTab>("parts");
  const [nextUpdateOverride, setNextUpdateOverride] = useState<string | undefined>(undefined);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [workResumed, setWorkResumed] = useState(false);

  const parts = fallbackParts(id);
  const notes = fallbackNotes(id);
  const latestNote = notes[0] ?? null;

  const totalCost = parts.reduce((sum, p) => sum + p.price + p.labor - p.credit, 0);

  if (!wo) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--aui-sub-surface)]">
        <div className="text-center">
          <Text size={3} weight="heavy" className="text-[var(--aui-on-surface)]">
            Work order not found
          </Text>
          <Text size={2} className="mt-2 text-[var(--aui-on-surface-soft)]">
            WO #{id} does not exist or has been removed.
          </Text>
        </div>
      </div>
    );
  }

  const milestones: MilestoneData = {
    woCreated: wo.createdAt,
    ...(MOCK_MILESTONES[id] ?? DEFAULT_MILESTONES),
  };

  const effectiveNextUpdate = nextUpdateOverride ?? wo.nextUpdate;
  const nextUpdate = effectiveNextUpdate ? formatWODate(effectiveNextUpdate) : null;
  const isRFP = wo.status === "ready-for-pickup";
  const alertSeverity = alertDismissed ? null
    : isRFP
      ? getPickupAlertSeverity(milestones.workCompleted)
      : getAlertSeverity(effectiveNextUpdate ?? undefined);
  const alertReason = isRFP
    ? (alertSeverity === "delayed" ? "No pickup for 7 days." : "No pickup for 3 days.")
    : (DELAY_REASONS[wo.status] ?? "This work order requires attention.");
  const statusColor = WO_STATUS_COLORS[wo.status] ?? "bg-[var(--aui-on-surface-soft)] text-white";
  const statusLabel = WO_STATUS_LABELS[wo.status] ?? wo.status;

  return (
    <div className="flex flex-col">
      {/* Page header */}
      <div className="shrink-0 border-b border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <Text size={4} weight="heavy" className="leading-tight text-[var(--aui-on-surface)]">
                Work order #{wo.id}
              </Text>
              <span className="text-[var(--aui-on-surface-soft)]">|</span>
              <Text size={4} weight="heavy" className="leading-tight text-[var(--aui-on-surface)]">
                {wo.customer}
              </Text>
              <button
                type="button"
                aria-label="Comments"
                className="text-[var(--aui-on-surface-soft)] hover:text-[var(--aui-on-surface)] transition-colors"
              >
                <Icon.Phosphor name="chat-circle" size="medium" aria-hidden />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Tag>{wo.program}</Tag>
              <Tag>{wo.issue}</Tag>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="More options"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--aui-outline-soft)] text-[var(--aui-on-surface)] hover:bg-[var(--aui-surface-variant)] transition-colors"
              >
                <Icon.Phosphor name="dots-three" size="medium" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setWorkResumed((v) => !v)}
                className="flex items-center gap-2 rounded-full bg-[var(--aui-primary)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity active:scale-95"
              >
                <Icon.Phosphor
                  name={workResumed ? "pause" : "play"}
                  size="small"
                  weight="fill"
                  aria-hidden
                />
                {workResumed ? "Pause work" : wo.status === "ready-for-work" ? "Start work" : "Resume work"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress tracker (alert integrated) */}
      <div className="shrink-0 border-b border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-0 py-5">
        <WOTimeline
          milestones={milestones}
          woStatus={wo.status}
          nextUpdate={effectiveNextUpdate}
          estimatedPickup={wo.estimatedPickup}
          alertSeverity={alertSeverity}
          alertReason={alertReason}
          onChangeNextUpdate={() => setShowDatePicker(true)}
          onContactCustomer={() => {/* contact customer action */}}
        />
      </div>

      {/* Change next update modal */}
      {showDatePicker && (
        <DateTimePickerModal
          currentValue={effectiveNextUpdate ?? undefined}
          onClose={() => setShowDatePicker(false)}
          onSave={(v) => {
            setNextUpdateOverride(v);
            setAlertDismissed(false);
            setShowDatePicker(false);
          }}
        />
      )}

      {/* Body */}
      <div className="p-6">
        {/* Device + latest note row */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Device card */}
          <div className="rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--aui-outline-soft)] bg-[var(--aui-surface-variant)]">
                  <Icon.Phosphor name="device-mobile" size="medium" aria-hidden className="text-[var(--aui-on-surface-soft)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Text size={2} weight="heavy" className="text-[var(--aui-on-surface)]">
                      {wo.device}
                    </Text>
                    <span className="rounded-md bg-[#0A4A2E] px-2 py-0.5 text-[11px] font-semibold text-[#6EE7A8]">
                      FMiP is off
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-col gap-0.5">
                    <Text size={1} className="text-[var(--aui-on-surface-soft)]">IMEI: 419044786452626</Text>
                    <Text size={1} className="text-[var(--aui-on-surface-soft)]">Serial: 1234567</Text>
                    <Text size={1} className="text-[var(--aui-on-surface-soft)]">
                      Accessory: SIM Card, Sim Tray, Case, Other1, Other2
                    </Text>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-[var(--aui-on-surface-soft)]">
                <button type="button" aria-label="Lock" className="hover:text-[var(--aui-on-surface)] transition-colors">
                  <Icon.Phosphor name="lock-key" size="small" aria-hidden />
                </button>
                <button type="button" aria-label="Edit" className="hover:text-[var(--aui-on-surface)] transition-colors">
                  <Icon.Phosphor name="pencil" size="small" aria-hidden />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-[var(--aui-outline-soft)] pt-3">
              <Text size={1} className="text-[var(--aui-on-surface-soft)]">Password:</Text>
              <span className="flex-1 tracking-widest text-[var(--aui-on-surface-soft)] text-sm">············</span>
              <Text size={1} className="text-[var(--aui-on-surface-soft)]">Location: N/A</Text>
            </div>
          </div>

          {/* Latest note */}
          {latestNote ? (
            <div className="rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--aui-primary)] text-sm font-bold text-white">
                    {latestNote.authorInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Text size={2} weight="heavy" className="text-[var(--aui-on-surface)]">
                        {latestNote.author}
                      </Text>
                      <Text size={1} className="text-[var(--aui-on-surface-soft)]">
                        {formatWODate(latestNote.createdAt).date} at {formatWODate(latestNote.createdAt).time}
                      </Text>
                    </div>
                    <Text size={2} className="mt-2 text-[var(--aui-on-surface)]">
                      {latestNote.body}
                    </Text>
                  </div>
                </div>
                <span className="shrink-0 rounded-md bg-[var(--aui-on-surface)] px-2.5 py-1 text-[11px] font-semibold text-[var(--aui-surface)]">
                  {latestNote.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-[var(--aui-border-radius-100)] border border-dashed border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] p-6 text-[var(--aui-on-surface-soft)]">
              <Text size={2}>No notes yet</Text>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] overflow-hidden">
          <div className="flex border-b border-[var(--aui-outline-soft)] px-4" role="tablist">
            {(
              [
                { id: "parts", label: "Parts and services", icon: "tag" },
                { id: "notes", label: "Notes", icon: "notepad" },
                { id: "customer", label: "Customer information", icon: "user" },
              ] as { id: DetailTab; label: string; icon: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "border-[var(--aui-primary)] text-[var(--aui-on-surface)]"
                    : "border-transparent text-[var(--aui-on-surface-soft)] hover:text-[var(--aui-on-surface)]"
                )}
              >
                <Icon.Phosphor name={tab.icon} size="small" aria-hidden />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Parts and services tab */}
          {activeTab === "parts" && (
            <div>
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--aui-outline-soft)]">
                <Text size={2} weight="heavy" className="text-[var(--aui-on-surface)]">
                  Cost to customer: ${totalCost.toFixed(2)}
                </Text>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-sm font-medium text-[var(--aui-on-surface)] hover:text-[var(--aui-primary)] transition-colors"
                  >
                    <Icon.Phosphor name="barcode" size="small" aria-hidden />
                    Scan label
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-sm font-medium text-[var(--aui-primary)] hover:opacity-80 transition-opacity"
                  >
                    <Icon.Phosphor name="plus" size="small" aria-hidden />
                    Find item
                  </button>
                </div>
              </div>

              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--aui-outline-soft)]">
                    {["Item", "Status", "Price", "Labor", "Credit", "Subtotal", ""].map((col, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[var(--aui-on-surface-soft)]"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-[var(--aui-on-surface-soft)]">
                        No parts or services added yet.
                      </td>
                    </tr>
                  ) : (
                    parts.map((part) => (
                      <tr key={part.id} className="border-b border-[var(--aui-outline-soft)] last:border-0">
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-2">
                            <Icon.Phosphor name="wrench" size="small" aria-hidden className="mt-0.5 shrink-0 text-[var(--aui-on-surface-soft)]" />
                            <div>
                              <Text size={2} className="text-[var(--aui-on-surface)]">{part.name}</Text>
                              <Text size={1} className="text-[var(--aui-on-surface-soft)]">{part.sku}</Text>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-semibold",
                              PART_STATUS_COLORS[part.status]
                            )}
                          >
                            {PART_STATUS_LABELS[part.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <Text size={2} className="text-[var(--aui-on-surface)]">${part.price.toFixed(2)}</Text>
                            {part.priceNote && (
                              <Text size={1} className="text-[var(--aui-on-surface-soft)]">{part.priceNote}</Text>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[var(--aui-on-surface)]">${part.labor.toFixed(2)}</td>
                        <td className="px-4 py-3 text-[var(--aui-on-surface)]">${part.credit.toFixed(2)}</td>
                        <td className="px-4 py-3 font-semibold text-[var(--aui-on-surface)]">
                          ${(part.price + part.labor - part.credit).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button type="button" aria-label="More options" className="text-[var(--aui-on-surface-soft)] hover:text-[var(--aui-on-surface)]">
                            <Icon.Phosphor name="dots-three-vertical" size="small" aria-hidden />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Notes tab */}
          {activeTab === "notes" && (
            <div className="p-4">
              {notes.length === 0 ? (
                <div className="py-10 text-center text-[var(--aui-on-surface-soft)]">
                  <Text size={2}>No notes yet.</Text>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {notes.map((note) => (
                    <div key={note.id} className="flex items-start gap-3 rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--aui-primary)] text-sm font-bold text-white">
                        {note.authorInitials}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Text size={2} weight="heavy">{note.author}</Text>
                          <Text size={1} className="text-[var(--aui-on-surface-soft)]">
                            {formatWODate(note.createdAt).date} at {formatWODate(note.createdAt).time}
                          </Text>
                          <span className="ml-auto rounded-md bg-[var(--aui-on-surface)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--aui-surface)]">
                            {note.status}
                          </span>
                        </div>
                        <Text size={2} className="mt-2 text-[var(--aui-on-surface)]">{note.body}</Text>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Customer information tab */}
          {activeTab === "customer" && (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <InfoRow label="Customer" value={wo.customer} />
                <InfoRow label="Program" value={wo.program} />
                <InfoRow label="Location" value={wo.location} />
                <InfoRow label="Device" value={wo.device} />
                <InfoRow label="Issue" value={wo.issue} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-[var(--aui-outline-soft)] px-2 py-0.5 text-xs font-medium text-[var(--aui-on-surface-soft)]">
      {children}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text size={1} className="text-[var(--aui-on-surface-soft)]">{label}</Text>
      <Text size={2} weight="heavy" className="mt-0.5 text-[var(--aui-on-surface)]">{value}</Text>
    </div>
  );
}
