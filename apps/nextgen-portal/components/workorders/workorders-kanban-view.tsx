"use client";

import { Action, Icon, Text } from "@asurion-core/mx-asurion-ui-react";
import { useMemo, useState, useEffect } from "react";
import {
  WORK_ORDERS,
  WO_STATUS_LABELS,
  WO_PROGRAMS,
  WO_DEVICE_TYPE_LABELS,
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

const WAITING_STATUSES: WOStatus[] = ["awaiting-item", "awaiting-callback"];
const WORK_STARTED_STATUSES: WOStatus[] = ["work-in-progress", "diagnostics", "quality-check", "repair-summary"];

type KanbanColumn = {
  id: string;
  label: string;
  statuses: WOStatus[];
  accent: string;
  accentSoft: string;
  accentText: string;
};

const COLUMNS: KanbanColumn[] = [
  {
    id: "ready-for-work",
    label: "Ready to start",
    statuses: ["ready-for-work"],
    accent: "var(--aui-accent-blue)",
    accentSoft: "var(--aui-accent-blue-soft)",
    accentText: "var(--aui-accent-blue)",
  },
  {
    id: "work-in-progress",
    label: "Work started",
    statuses: [...WORK_STARTED_STATUSES, ...WAITING_STATUSES],
    accent: "var(--aui-accent-teal)",
    accentSoft: "var(--aui-accent-teal-soft)",
    accentText: "var(--aui-accent-teal)",
  },
  {
    id: "need-to-order",
    label: "Need to order",
    statuses: ["need-to-order"],
    accent: "var(--aui-accent-orange)",
    accentSoft: "var(--aui-accent-orange-soft)",
    accentText: "var(--aui-accent-orange)",
  },
  {
    id: "ready-for-pickup",
    label: "Ready for pickup",
    statuses: ["ready-for-pickup"],
    accent: "var(--aui-accent-green)",
    accentSoft: "var(--aui-accent-green-soft)",
    accentText: "var(--aui-accent-green)",
  },
];

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

export const REPAIR_COSTS: Record<string, number> = {
  "500067911": 129,
  "500068798": 149,
  "500069463": 199,
  "500070075": 89,
  "500070127": 229,
  "500070197": 179,
  "500070682": 99,
  "500071100": 249,
  "500071201": 319,
  "500071350": 289,
  "500071402": 159,
  "500071510": 209,
  "500071625": 139,
  "500071700": 119,
  "500071815": 349,
  "500071920": 189,
  "500072010": 79,
  "500072105": 269,
  "500072220": 109,
  "500072315": 219,
  "500072410": 299,
  "500072505": 389,
  "500072600": 169,
  "500072715": 199,
  "500072820": 129,
  "500072935": 239,
  "500073040": 159,
  "500073150": 429,
  "500073260": 89,
  "500073370": 149,
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

const CARD_STATE_STYLES: Record<UpdateState, string> = {
  "delayed":  "border-l-4 border-l-[#FFADAD] border-t-transparent border-r-transparent border-b-transparent bg-[#FFADAD]/10",
  "at-risk":  "border-l-4 border-l-[#FFD966] border-t-transparent border-r-transparent border-b-transparent bg-[#FFD966]/10",
  "on-time":  "border-l-4 border-l-[#6EE7A8] border-t-transparent border-r-transparent border-b-transparent bg-[#6EE7A8]/10",
};

function KanbanCard({ wo }: { wo: WorkOrder }) {
  const state = getUpdateState(wo);
  const created = new Date(wo.createdAt);
  const daysSinceCreated = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
  const cost = REPAIR_COSTS[wo.id];

  return (
    <a
      href={`/workorders/${wo.id}`}
      target="_blank"
      rel="noreferrer"
      className={cn("flex flex-col gap-2 rounded-[var(--aui-border-radius-100)] border p-3 transition-colors hover:opacity-90 cursor-pointer", CARD_STATE_STYLES[state])}
    >
      {/* Customer + alert icon */}
      <div className="flex items-start justify-between gap-2">
        <Text size={2} weight="heavy" className="leading-snug">{wo.customer}</Text>
        {state === "delayed" && (
          <Icon.Phosphor name="warning-circle" size="small" weight="regular" aria-label="Delayed" className="shrink-0 mt-0.5 text-[#FFADAD]" />
        )}
        {state === "at-risk" && (
          <Icon.Phosphor name="warning" size="small" weight="regular" aria-label="At risk" className="shrink-0 mt-0.5 text-[#FFD966]" />
        )}
        {state === "on-time" && (
          <Icon.Phosphor name="check-circle" size="small" weight="regular" aria-label="On time" className="shrink-0 mt-0.5 text-[#6EE7A8]" />
        )}
      </div>

      {/* Device */}
      <div className="flex items-center gap-1.5 min-w-0">
        <Icon.Phosphor
          name={DEVICE_ICONS[wo.deviceType] ?? "cube"}
          size="small"
          aria-hidden
          className="shrink-0 text-[var(--aui-on-surface-soft)]"
        />
        <Text size={1} color="var(--aui-on-surface-soft)" className="truncate">{wo.device}</Text>
      </div>

      {/* Issue + price */}
      <div className="flex items-center justify-between gap-2">
        <Text size={1} color="var(--aui-on-surface-soft)" className="truncate">{wo.issue}</Text>
        {wo.total != null && (
          <Text size={1} className="shrink-0 text-[var(--aui-on-surface-soft)]">${wo.total.toFixed(2)}</Text>
        )}
      </div>

      {/* Footer: program + age */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--aui-outline-soft)]">
        <Text size={1} color="var(--aui-on-surface-soft)" className="truncate">{wo.program}</Text>
        <div className="flex items-center gap-1 text-[11px] text-[var(--aui-on-surface-soft)] shrink-0">
          <Icon.Phosphor name="clock" size="small" aria-hidden className="!h-3 !w-3" />
          {daysSinceCreated}d
        </div>
      </div>
    </a>
  );
}

const PAGE_SIZE = 20;

function KanbanColumn({ col, wos, colDelay = 0 }: { col: KanbanColumn; wos: WorkOrder[]; colDelay?: number }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const STATE_ORDER: Record<UpdateState, number> = { delayed: 0, "at-risk": 1, "on-time": 2 };
  const sorted = [...wos].sort((a, b) => STATE_ORDER[getUpdateState(a)] - STATE_ORDER[getUpdateState(b)]);
  const delayedCount = wos.filter((w) => getUpdateState(w) === "delayed").length;
  const atRiskCount = wos.filter((w) => getUpdateState(w) === "at-risk").length;
  const visible = sorted.slice(0, visibleCount);
  const remaining = sorted.length - visibleCount;

  const hidden = colDelay < 0;

  return (
    <div
      className="kb-col flex min-w-0 flex-1 flex-col gap-3"
      style={hidden ? { opacity: 0 } : { animationDelay: `${colDelay}ms` }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface-variant)] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--aui-on-surface)]">{col.label}</span>
          <span className="rounded-full bg-[var(--aui-surface)] px-1.5 py-0.5 text-[11px] font-semibold leading-none text-[var(--aui-on-surface-soft)]">
            {wos.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {delayedCount > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-[#FFADAD]">
              <Icon.Phosphor name="warning-circle" size="small" weight="regular" aria-hidden className="!h-3 !w-3" />
              {delayedCount} delayed
            </span>
          )}
          {atRiskCount > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-[#FFD966]">
              <Icon.Phosphor name="warning" size="small" weight="regular" aria-hidden className="!h-3 !w-3" />
              {atRiskCount} at risk
            </span>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="rounded-[var(--aui-border-radius-100)] border border-dashed border-[var(--aui-outline-soft)] px-3 py-6 text-center text-sm text-[var(--aui-on-surface-soft)]">
            No work orders
          </div>
        ) : (
          <>
            {visible.map((wo, i) => (
                <div
                  key={wo.id}
                  className="kb-card"
                  style={{ animationDelay: `${(hidden ? 0 : colDelay) + 120 + Math.min(i, 10) * 40}ms` }}
                >
                  <KanbanCard wo={wo} />
                </div>
              ))}
            {remaining > 0 && (
              <Action
                type="button"
                variant="flat"
                size="sm"
                className="!w-fit"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                Show {Math.min(remaining, PAGE_SIZE)} more
              </Action>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 appearance-none rounded-[var(--aui-border-radius-050)] border border-[var(--aui-outline)] bg-[var(--aui-surface)] pl-3 pr-7 text-sm text-[var(--aui-on-surface)] focus:outline-none focus:ring-1 focus:ring-[var(--aui-primary)] cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg aria-hidden className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--aui-on-surface-soft)]" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export function WorkordersKanbanView() {
  const [mounted, setMounted] = useState(false);
  const [programFilter, setProgramFilter] = useState("");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  useEffect(() => { setMounted(true); }, []);

  const activeWOs = useMemo(
    () => WORK_ORDERS.filter((w) => ACTIVE_STATUSES.includes(w.status)),
    []
  );

  const filteredWOs = useMemo(() => activeWOs.filter((w) => {
    if (programFilter && w.program !== programFilter) return false;
    if (deviceTypeFilter && w.deviceType !== deviceTypeFilter) return false;
    if (statusFilter && w.status !== statusFilter) return false;
    return true;
  }), [activeWOs, programFilter, deviceTypeFilter, statusFilter]);

  const programOptions = WO_PROGRAMS.map((p) => ({ value: p, label: p === "Out Of Warranty" ? "OOW" : p }));
  const deviceTypeOptions = Object.entries(WO_DEVICE_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const statusOptions = ACTIVE_STATUSES.map((s) => ({ value: s, label: WO_STATUS_LABELS[s] }));

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {/* Filter toolbar */}
      <div className="shrink-0 flex items-center gap-3 border-b border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-6 py-3">
        <FilterSelect
          value={programFilter}
          onChange={setProgramFilter}
          options={[{ value: "", label: "All programs" }, ...programOptions]}
        />
        <FilterSelect
          value={deviceTypeFilter}
          onChange={setDeviceTypeFilter}
          options={[{ value: "", label: "All devices" }, ...deviceTypeOptions]}
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[{ value: "", label: "All statuses" }, ...statusOptions]}
        />
      </div>
    <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto p-6">
      <style>{`
        @keyframes kb-col-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes kb-card-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .kb-col  { animation: kb-col-in  0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .kb-card { animation: kb-card-in 0.3s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>
      {COLUMNS.map((col, colIdx) => {
        const wos = filteredWOs.filter((w) => col.statuses.includes(w.status));
        return (
          <KanbanColumn
            key={col.id}
            col={col}
            wos={wos}
            colDelay={mounted ? colIdx * 80 : -1}
          />
        );
      })}
    </div>
    </div>
  );
}
