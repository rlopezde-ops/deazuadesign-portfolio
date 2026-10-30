"use client";

import { useMemo, useState } from "react";
import { Action, Icon, Text } from "@asurion-core/mx-asurion-ui-react";
import { WorkordersKanbanView } from "./workorders-kanban-view";
import { WorkordersTilesView } from "./workorders-tiles-view";
import {
  WORK_ORDERS,
  WO_STATUS_LABELS,
  WO_PROGRAMS,
  WO_DEVICE_TYPE_LABELS,
  formatWODate,
} from "@/lib/check-in-data";
import type { WOStatus, WorkOrder } from "@/lib/check-in-types";
import { cn } from "@/lib/utils";
import { MOCK_MILESTONES, getPickupAlertSeverity } from "./workorder-detail-view";

const ACTIVE_STATUSES: WOStatus[] = [
  "need-to-order",
  "ready-for-work",
  "diagnostics",
  "work-in-progress",
  "repair-summary",
  "quality-check",
  "awaiting-item",
  "awaiting-callback",
  "ready-for-pickup",
];

// Statuses grouped under the "Waiting" tab
const WAITING_STATUSES: WOStatus[] = ["awaiting-item", "awaiting-callback"];

// Statuses grouped under the "Work started" tab
const WORK_STARTED_STATUSES: WOStatus[] = ["work-in-progress", "diagnostics", "quality-check", "repair-summary"];

type Tab = "today" | "needs-attention" | WOStatus;

const TABS: { id: Tab; label: string }[] = [
  { id: "today", label: "All" },
  { id: "needs-attention", label: "Needs attention" },
  { id: "need-to-order", label: "Need to order" },
  { id: "ready-for-work", label: "Ready to start" },
  { id: "work-in-progress", label: "Work started" },
  { id: "awaiting-item", label: "Waiting" },
  { id: "ready-for-pickup", label: "Ready for pickup" },
];

type ActionReason = "blocked" | "customer-update-overdue" | "aging" | "order-parts" | "partner-sla-risk";

const ACTION_REASON_LABELS: Record<ActionReason, string> = {
  "blocked":                "Blocked - awaiting item",
  "customer-update-overdue": "Customer update overdue",
  "aging":                  "Aging - open 21+ days",
  "order-parts":            "Order parts",
  "partner-sla-risk":       "At risk of missing partner SLA",
};

const ACTION_REASON_COLORS: Record<ActionReason, string> = {
  "blocked":                "bg-[#4A2800] text-[#FFB347]",
  "customer-update-overdue": "bg-[#7A1E1E] text-[#FFADAD]",
  "aging":                  "bg-[#4A3800] text-[#FFD966]",
  "order-parts":            "bg-[#1A2E4A] text-[#93C5FD]",
  "partner-sla-risk":       "bg-[#2A1A4A] text-[#C4B5FD]",
};

function getActionReasons(wo: WorkOrder): ActionReason[] {
  const daysSinceCreated = Math.floor((Date.now() - new Date(wo.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const now = new Date();
  const reasons: ActionReason[] = [];
  if (wo.status === "need-to-order") reasons.push("order-parts");
  if (wo.status === "awaiting-item" || wo.status === "awaiting-callback") reasons.push("blocked");
  if (wo.nextUpdate && new Date(wo.nextUpdate) < now) reasons.push("customer-update-overdue");
  if (daysSinceCreated >= 21) reasons.push("aging");
  if (wo.nextUpdate) {
    const msUntilDue = new Date(wo.nextUpdate).getTime() - now.getTime();
    if (msUntilDue > 0 && msUntilDue < 8 * 60 * 60 * 1000) reasons.push("partner-sla-risk");
  }
  return reasons;
}

function getActionReason(wo: WorkOrder): ActionReason | null {
  const reasons = getActionReasons(wo);
  return reasons.length > 0 ? reasons[0] : null;
}

function isTodayActionable(wo: WorkOrder): boolean {
  return getActionReason(wo) !== null;
}

// ── Status lane config for the Today overview ────────────────────────────────

type LaneColors = { border: string; bg: string; titleText: string };

type StatusLane = {
  status: WOStatus;
  statuses?: WOStatus[];
  accentBg: string;
  accentText: string;
  overdueWarning?: boolean;
};

const LANE_COLORS: Record<string, LaneColors> = {
  "ready-for-work":   { border: "border-[var(--aui-accent-blue-soft)]",   bg: "bg-[var(--aui-accent-blue-soft)]/20",   titleText: "text-[var(--aui-accent-blue)]" },
  "work-in-progress": { border: "border-[var(--aui-accent-teal-soft)]",   bg: "bg-[var(--aui-accent-teal-soft)]/20",   titleText: "text-[var(--aui-accent-teal)]" },
  "diagnostics":      { border: "border-[var(--aui-accent-teal-soft)]",   bg: "bg-[var(--aui-accent-teal-soft)]/20",   titleText: "text-[var(--aui-accent-teal)]" },
  "quality-check":    { border: "border-[var(--aui-accent-teal-soft)]",   bg: "bg-[var(--aui-accent-teal-soft)]/20",   titleText: "text-[var(--aui-accent-teal)]" },
  "repair-summary":   { border: "border-[var(--aui-accent-teal-soft)]",   bg: "bg-[var(--aui-accent-teal-soft)]/20",   titleText: "text-[var(--aui-accent-teal)]" },
  "ready-for-pickup": { border: "border-[var(--aui-accent-green-soft)]",  bg: "bg-[var(--aui-accent-green-soft)]/20",  titleText: "text-[var(--aui-accent-green)]" },
  "need-to-order":    { border: "border-[var(--aui-accent-orange-soft)]", bg: "bg-[var(--aui-accent-orange-soft)]/20", titleText: "text-[var(--aui-accent-orange)]" },
  "awaiting-item":    { border: "border-[var(--aui-accent-tennis-soft)]", bg: "bg-[var(--aui-accent-tennis-soft)]/20", titleText: "text-[var(--aui-accent-tennis)]" },
  "awaiting-callback":{ border: "border-[var(--aui-accent-tennis-soft)]", bg: "bg-[var(--aui-accent-tennis-soft)]/20", titleText: "text-[var(--aui-accent-tennis)]" },
};

const STATUS_LANES: StatusLane[] = [
  { status: "ready-for-work",    accentBg: "bg-[#0A3A6B]", accentText: "text-[#7EC8FF]", overdueWarning: true },
  { status: "work-in-progress",  statuses: WORK_STARTED_STATUSES, accentBg: "bg-[#0A3A6B]", accentText: "text-[#7EC8FF]", overdueWarning: true },
  { status: "ready-for-pickup",  accentBg: "bg-[#0A4A2E]", accentText: "text-[#6EE7A8]", overdueWarning: true },
  { status: "need-to-order",     accentBg: "bg-[#3B1F7A]", accentText: "text-[#C4A8FF]", overdueWarning: true },
  { status: "awaiting-item",     statuses: WAITING_STATUSES, accentBg: "bg-[#4A3800]", accentText: "text-[#FFD966]", overdueWarning: true },
];

// ─────────────────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<WOStatus, string> = {
  "need-to-order":     "bg-[#6B2FD9] text-white",
  "ready-for-work":    "bg-[#0A6CFF] text-white",
  "diagnostics":       "bg-[#0A6CFF] text-white",
  "work-in-progress":  "bg-[#0A6CFF] text-white",
  "repair-summary":    "bg-[#0A6CFF] text-white",
  "quality-check":     "bg-[#00875A] text-white",
  "awaiting-item":     "bg-[#8C6D0A] text-white",
  "awaiting-callback": "bg-[#8C6D0A] text-white",
  "ready-for-pickup":  "bg-[#00875A] text-white",
};

const DEVICE_ICONS: Record<string, string> = {
  mobile: "device-mobile",
  tablet: "device-tablet",
  computer: "laptop",
  wearable: "watch",
  hearable: "headphones",
  "game-console": "game-controller",
  other: "cube",
};

const PER_PAGE_OPTIONS = [10, 25, 50];

function StatusBadge({ status }: { status: WOStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none whitespace-nowrap",
        STATUS_COLORS[status]
      )}
    >
      {WO_STATUS_LABELS[status]}
    </span>
  );
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-8 appearance-none rounded-[var(--aui-border-radius-050)]",
          "border border-[var(--aui-outline-soft)]",
          "bg-[var(--aui-surface)] text-[var(--aui-on-surface)]",
          "pl-3 pr-8 text-sm font-medium",
          "focus:outline-none focus:ring-1 focus:ring-[var(--aui-primary)]"
        )}
        aria-label={label}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg aria-hidden className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-60 text-[var(--aui-on-surface)]" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ── Today overview ───────────────────────────────────────────────────────────

function TodayOverview({ activeWOs }: { activeWOs: WorkOrder[]; onDrillDown: (tab: Tab) => void }) {
  const [selected, setSelected] = useState<string>("all");

  const allTiles = [
    {
      id: "all",
      label: "All",
      count: activeWOs.length,
      border: "border-[var(--aui-outline-soft)]",
      bg: "bg-[var(--aui-surface-variant)]",
      countColor: "text-[var(--aui-on-surface)]",
    },
    ...STATUS_LANES.map((lane) => {
      const laneStatuses = lane.statuses ?? [lane.status];
      const laneColors = LANE_COLORS[lane.status] ?? { border: "border-[var(--aui-outline-soft)]", bg: "bg-[var(--aui-surface)]", titleText: "text-[var(--aui-on-surface)]" };
      return {
        id: lane.status,
        label: WO_STATUS_LABELS[lane.status],
        count: activeWOs.filter((w) => laneStatuses.includes(w.status)).length,
        border: laneColors.border,
        bg: laneColors.bg,
        countColor: laneColors.titleText,
      };
    }),
  ];

  return (
    <div className="overflow-y-auto p-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {allTiles.map((tile) => (
          <button
            key={tile.id}
            type="button"
            onClick={() => setSelected(tile.id)}
            className={cn(
              "flex flex-col gap-2 rounded-[var(--aui-border-radius-100)] border-2 p-4 text-left transition-all hover:opacity-80",
              tile.border, tile.bg,
              selected === tile.id ? "ring-2 ring-[var(--aui-primary)] ring-offset-1 ring-offset-[var(--aui-background)]" : ""
            )}
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--aui-on-surface-soft)]">
              {tile.label}
            </span>
            <span className={cn("text-3xl font-bold leading-none", tile.countColor)}>
              {tile.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function WorkordersView() {
  const [viewMode, setViewMode] = useState<"kanban" | "tiles">("kanban");

  const activeWOs = useMemo(
    () => WORK_ORDERS.filter((w) => ACTIVE_STATUSES.includes(w.status)),
    []
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Page header */}
      <div className="shrink-0 border-b border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-6 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Text size={4} weight="heavy" className="leading-none">
              Work orders
            </Text>
            <span className="flex items-center gap-1 rounded-md border border-[var(--aui-outline-soft)] px-2 py-1 text-sm font-medium text-[var(--aui-on-surface)]">
              Active
              <Icon.Phosphor name="caret-down" size="small" aria-hidden className="opacity-60" />
            </span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
          {/* View toggle */}
          <div className="flex items-center rounded-[var(--aui-border-radius-050)] border border-[var(--aui-outline-soft)] overflow-hidden">
            <button
              type="button"
              aria-label="Kanban view"
              onClick={() => setViewMode("kanban")}
              className={cn(
                "flex items-center justify-center px-2.5 py-1.5 transition-colors",
                viewMode === "kanban"
                  ? "bg-[var(--aui-primary)]/20 text-[var(--aui-primary)]"
                  : "bg-[var(--aui-surface)] text-[var(--aui-on-surface-soft)] hover:bg-[var(--aui-surface-variant)]"
              )}
            >
              <Icon.Phosphor name="columns" size="small" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Tiles view"
              onClick={() => setViewMode("tiles")}
              className={cn(
                "flex items-center justify-center px-2.5 py-1.5 transition-colors border-l border-[var(--aui-outline-soft)]",
                viewMode === "tiles"
                  ? "bg-[var(--aui-primary)]/20 text-[var(--aui-primary)]"
                  : "bg-[var(--aui-surface)] text-[var(--aui-on-surface-soft)] hover:bg-[var(--aui-surface-variant)]"
              )}
            >
              <Icon.Phosphor name="list" size="small" aria-hidden />
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Kanban view */}
      {viewMode === "kanban" && (
        <div className="min-h-0 flex-1 overflow-hidden">
          <WorkordersKanbanView />
        </div>
      )}

      {/* Tiles view */}
      {viewMode === "tiles" && (
        <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
          <WorkordersTilesView />
        </div>
      )}


    </div>
  );
}

type UpdateState = "delayed" | "at-risk" | "on-time";

function getUpdateState(wo: WorkOrder): UpdateState {
  if (wo.status === "ready-for-pickup") {
    const milestones = MOCK_MILESTONES[wo.id];
    const severity = getPickupAlertSeverity(milestones?.workCompleted);
    if (severity === "delayed") return "delayed";
    if (severity === "at-risk") return "at-risk";
    return "on-time";
  }
  if (!wo.nextUpdate) return "on-time";
  const now = new Date();
  const due = new Date(wo.nextUpdate);
  if (due < now) return "delayed";
  if (due.getTime() - now.getTime() < 24 * 60 * 60 * 1000) return "at-risk";
  return "on-time";
}

const UPDATE_STATE_CONFIG: Record<UpdateState, { label: string; className: string; icon: string }> = {
  "delayed":  { label: "Delayed",  className: "bg-[#7A1E1E] text-[#FFADAD]", icon: "warning-circle" },
  "at-risk":  { label: "At risk",  className: "bg-[#4A3800] text-[#FFD966]", icon: "warning" },
  "on-time":  { label: "On time",  className: "bg-[#0A4A2E] text-[#6EE7A8]", icon: "check-circle" },
};

function WorkOrderRow({ wo, showAction }: { wo: WorkOrder; showAction?: boolean }) {
  const created = formatWODate(wo.createdAt);
  const nextUpdate = wo.nextUpdate ? formatWODate(wo.nextUpdate) : null;
  const iconName = DEVICE_ICONS[wo.deviceType] ?? "cube";
  const reasons = showAction ? getActionReasons(wo) : [];
  const updateState = getUpdateState(wo);
  const stateConfig = UPDATE_STATE_CONFIG[updateState];

  return (
    <tr
      className="border-b border-[var(--aui-outline-soft)] hover:bg-[var(--aui-surface-variant)] transition-colors cursor-pointer"
      onClick={() => window.location.href = `/workorders/${wo.id}`}
    >
      {/* Needs attention (first col when on needs-attention tab) */}
      {showAction && (
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {reasons.map((r) => (
              <span
                key={r}
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-none whitespace-nowrap",
                  ACTION_REASON_COLORS[r]
                )}
              >
                {ACTION_REASON_LABELS[r]}
              </span>
            ))}
          </div>
        </td>
      )}
      {/* Next update */}
      <td className="px-4 py-3 text-[var(--aui-on-surface-soft)]">
        {nextUpdate ? (
          <div>
            <div className="text-[var(--aui-on-surface)]">{nextUpdate.date}</div>
            <div className="text-[11px] text-[var(--aui-on-surface-soft)]">{nextUpdate.time}</div>
          </div>
        ) : (
          <span className="text-[var(--aui-on-surface-soft)]">—</span>
        )}
      </td>
      {/* Created */}
      <td className="px-4 py-3">
        <div>
          <div className="text-[var(--aui-on-surface)]">{created.date}</div>
          <div className="text-[11px] text-[var(--aui-on-surface-soft)]">{created.time}</div>
        </div>
      </td>
      {/* Customer */}
      <td className="px-4 py-3 font-medium text-[var(--aui-on-surface)]">
        {wo.customer}
      </td>
      {/* Device / Issue */}
      <td className="px-4 py-3">
        <div className="flex items-start gap-2">
          <Icon.Phosphor
            name={iconName}
            size="small"
            aria-hidden
            className="mt-0.5 shrink-0 text-[var(--aui-on-surface-soft)]"
          />
          <div>
            <div className="text-[var(--aui-on-surface)]">{wo.device}</div>
            <div className="text-[11px] text-[var(--aui-on-surface-soft)]">{wo.issue}</div>
          </div>
        </div>
      </td>
      {/* Status */}
      <td className="px-4 py-3">
        <span className={cn(
          "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
          LANE_COLORS[wo.status]?.titleText ?? "text-[var(--aui-on-surface)]",
          LANE_COLORS[wo.status] ? (LANE_COLORS[wo.status].bg + " " + LANE_COLORS[wo.status].border + " border") : "bg-[var(--aui-surface-variant)]"
        )}>
          {WO_STATUS_LABELS[wo.status] ?? wo.status}
        </span>
      </td>
      {/* Program */}
      <td className="px-4 py-3 text-[var(--aui-on-surface-soft)]">
        {wo.program}
      </td>
      {/* WO # */}
      <td className="px-4 py-3 font-mono text-sm text-[var(--aui-on-surface)]">
        {wo.id}
      </td>
    </tr>
  );
}

function PageButton({
  children,
  onClick,
  active,
  disabled,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-[var(--aui-primary)] text-white"
          : disabled
          ? "cursor-not-allowed text-[var(--aui-on-surface-soft)] opacity-40"
          : "text-[var(--aui-on-surface)] hover:bg-[var(--aui-surface-variant)]"
      )}
    >
      {children}
    </button>
  );
}
