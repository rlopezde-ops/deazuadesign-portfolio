"use client";

import { Icon, Text } from "@asurion-core/mx-asurion-ui-react";
import { useMemo, useState, useEffect } from "react";
import { WORK_ORDERS, WO_STATUS_LABELS, WO_PROGRAMS, WO_DEVICE_TYPE_LABELS, formatWODate } from "@/lib/check-in-data";
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

type HealthFilter = "all" | "delayed" | "at-risk" | "on-time";

type SortCol = "health" | "customer" | "device" | "status" | "nextUpdate" | "created" | "program" | "total" | "id";
type SortDir = "asc" | "desc";

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

const DEVICE_ICONS: Record<string, string> = {
  mobile: "device-mobile",
  tablet: "device-tablet",
  computer: "laptop",
  wearable: "watch",
  hearable: "headphones",
  "game-console": "game-controller",
  other: "cube",
};

const TILE_CONFIG: Record<HealthFilter, {
  label: string;
  bg: string;
  border: string;
  countColor: string;
  icon: string;
  iconColor: string;
}> = {
  all: {
    label: "All",
    bg: "bg-[var(--aui-surface-variant)]",
    border: "border-[var(--aui-outline-soft)]",
    countColor: "text-[var(--aui-on-surface)]",
    icon: "list",
    iconColor: "text-[var(--aui-on-surface-soft)]",
  },
  delayed: {
    label: "Delayed",
    bg: "bg-[#FFADAD]/10",
    border: "border-[#FFADAD]/40",
    countColor: "text-[#FFADAD]",
    icon: "warning-circle",
    iconColor: "text-[#FFADAD]",
  },
  "at-risk": {
    label: "At risk",
    bg: "bg-[#FFD966]/10",
    border: "border-[#FFD966]/40",
    countColor: "text-[#FFD966]",
    icon: "warning",
    iconColor: "text-[#FFD966]",
  },
  "on-time": {
    label: "On time",
    bg: "bg-[#6EE7A8]/10",
    border: "border-[#6EE7A8]/40",
    countColor: "text-[#6EE7A8]",
    icon: "check-circle",
    iconColor: "text-[#6EE7A8]",
  },
};

const HEALTH_FILTERS: HealthFilter[] = ["all", "delayed", "at-risk", "on-time"];

const PER_PAGE_OPTIONS = [25, 50, 100];

function FilterSelect({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
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
        <svg
          aria-hidden
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--aui-on-surface-soft)]"
          width="12" height="12" viewBox="0 0 12 12" fill="none"
        >
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export function WorkordersTilesView() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [activeFilter, setActiveFilter] = useState<HealthFilter>("all");
  const [sortCol, setSortCol] = useState<SortCol>("health");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [programFilter, setProgramFilter] = useState("");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(1);

  function handleSort(col: SortCol) {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  function resetPage() { setPage(1); }

  const activeWOs = useMemo(
    () => WORK_ORDERS.filter((w) => ACTIVE_STATUSES.includes(w.status)),
    []
  );

  const counts = useMemo(() => ({
    all: activeWOs.length,
    delayed: activeWOs.filter((w) => getUpdateState(w) === "delayed").length,
    "at-risk": activeWOs.filter((w) => getUpdateState(w) === "at-risk").length,
    "on-time": activeWOs.filter((w) => getUpdateState(w) === "on-time").length,
  }), [activeWOs]);

  const filtered = useMemo(() => {
    const HEALTH_ORDER: Record<UpdateState, number> = { delayed: 0, "at-risk": 1, "on-time": 2 };
    const base = activeWOs.filter((w) => {
      if (activeFilter !== "all" && getUpdateState(w) !== activeFilter) return false;
      if (programFilter && w.program !== programFilter) return false;
      if (deviceTypeFilter && w.deviceType !== deviceTypeFilter) return false;
      if (statusFilter && w.status !== statusFilter) return false;
      return true;
    });
    return [...base].sort((a, b) => {
      let cmp = 0;
      switch (sortCol) {
        case "health":    cmp = HEALTH_ORDER[getUpdateState(a)] - HEALTH_ORDER[getUpdateState(b)]; break;
        case "customer":  cmp = a.customer.localeCompare(b.customer); break;
        case "device":    cmp = a.device.localeCompare(b.device); break;
        case "status":    cmp = a.status.localeCompare(b.status); break;
        case "nextUpdate":cmp = (a.nextUpdate ?? "").localeCompare(b.nextUpdate ?? ""); break;
        case "created":   cmp = a.createdAt.localeCompare(b.createdAt); break;
        case "program":   cmp = a.program.localeCompare(b.program); break;
        case "total":     cmp = (a.total ?? 0) - (b.total ?? 0); break;
        case "id":        cmp = a.id.localeCompare(b.id); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [activeWOs, activeFilter, programFilter, deviceTypeFilter, statusFilter, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageWOs = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const programOptions = WO_PROGRAMS.map((p) => ({ value: p, label: p }));
  const deviceTypeOptions = Object.entries(WO_DEVICE_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const statusOptions = ACTIVE_STATUSES.map((s) => ({ value: s, label: WO_STATUS_LABELS[s] ?? s }));

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <style>{`
        @keyframes wo-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wo-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes wo-row-in {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .wo-tile { animation: wo-fade-up 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .wo-toolbar { animation: wo-fade-in 0.3s ease both; }
        .wo-row { animation: wo-row-in 0.25s ease both; }
      `}</style>

      {/* Tiles */}
      <div className="shrink-0 grid grid-cols-4 gap-4 border-b border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-6 py-4">
        {HEALTH_FILTERS.map((filter, i) => {
          const cfg = TILE_CONFIG[filter];
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => { setActiveFilter(filter); resetPage(); }}
              className={cn(
                "wo-tile flex flex-col gap-2 rounded-[var(--aui-border-radius-100)] border p-4 text-left transition-all",
                cfg.bg,
                cfg.border,
                isActive ? "ring-2 ring-[var(--aui-primary)] ring-offset-1 ring-offset-[var(--aui-surface)]" : "hover:opacity-80"
              )}
              style={mounted ? { animationDelay: `${i * 70}ms` } : { opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--aui-on-surface-soft)]">
                  {cfg.label}
                </span>
                <Icon.Phosphor name={cfg.icon} size="small" aria-hidden className={cfg.iconColor} />
              </div>
              <span className={cn("text-3xl font-bold leading-none", cfg.countColor)}>
                {counts[filter]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters toolbar */}
      <div
        className="wo-toolbar shrink-0 flex items-center gap-4 border-b border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-6 py-3"
        style={mounted ? { animationDelay: "320ms" } : { opacity: 0 }}
      >
        <FilterSelect value={programFilter} onChange={(v) => { setProgramFilter(v); resetPage(); }}
          options={[{ value: "", label: "All programs" }, ...programOptions]} />
        <FilterSelect value={deviceTypeFilter} onChange={(v) => { setDeviceTypeFilter(v); resetPage(); }}
          options={[{ value: "", label: "All devices" }, ...deviceTypeOptions]} />
        <FilterSelect value={statusFilter} onChange={(v) => { setStatusFilter(v); resetPage(); }}
          options={[{ value: "", label: "All statuses" }, ...statusOptions]} />
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-[var(--aui-on-surface-soft)]">Per page</span>
          <FilterSelect value={String(perPage)} onChange={(v) => { setPerPage(Number(v)); resetPage(); }}
            options={PER_PAGE_OPTIONS.map((n) => ({ value: String(n), label: String(n) }))} />
        </div>
      </div>

      {/* Work order list */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--aui-surface)]">
            <tr className="border-b border-[var(--aui-outline-soft)]">
              {([
                { label: "Status",       col: "health"     },
                { label: "Customer",     col: "customer"   },
                { label: "Device / Issue", col: "device"   },
                { label: "Created",      col: "created"    },
                { label: "Next update",  col: "nextUpdate" },
                { label: "Program",      col: "program"    },
                { label: "Total",        col: "total"      },
                { label: "WO #",         col: "id"         },
              ] as { label: string; col: SortCol }[]).map(({ label, col }) => (
                <th
                  key={col}
                  className={cn("whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--aui-on-surface-soft)]", col === "total" ? "text-right" : "text-left")}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(col)}
                    className={cn("flex items-center gap-1 hover:text-[var(--aui-on-surface)] transition-colors", col === "total" && "ml-auto")}
                  >
                    {label}
                    {sortCol === col ? (
                      <Icon.Phosphor
                        name={sortDir === "asc" ? "caret-up" : "caret-down"}
                        size="small"
                        aria-hidden
                        className="shrink-0 text-[var(--aui-primary)]"
                      />
                    ) : (
                      <Icon.Phosphor
                        name="caret-up-down"
                        size="small"
                        aria-hidden
                        className="shrink-0 opacity-30"
                      />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageWOs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-[var(--aui-on-surface-soft)]">
                  No work orders match this filter.
                </td>
              </tr>
            ) : (
              pageWOs.map((wo, i) => <TilesRow key={wo.id} wo={wo} index={i} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {totalPages > 1 && (
        <div className="shrink-0 flex items-center justify-between border-t border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-6 py-3">
          <Text size={1} className="text-[var(--aui-on-surface-soft)]">
            Showing {(safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} of {filtered.length}
          </Text>
          <div className="flex items-center gap-1">
            <PaginationButton onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} aria-label="Previous page">
              <Icon.Phosphor name="caret-left" size="small" aria-hidden />
            </PaginationButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`e-${i}`} className="px-1 text-[var(--aui-on-surface-soft)]">…</span>
                ) : (
                  <PaginationButton key={p} onClick={() => setPage(p as number)} active={p === safePage}>
                    {p}
                  </PaginationButton>
                )
              )}
            <PaginationButton onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} aria-label="Next page">
              <Icon.Phosphor name="caret-right" size="small" aria-hidden />
            </PaginationButton>
          </div>
        </div>
      )}
    </div>
  );
}

function PaginationButton({ children, onClick, active, disabled, "aria-label": ariaLabel }: {
  children: React.ReactNode; onClick: () => void; active?: boolean; disabled?: boolean; "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-sm font-medium transition-colors",
        active ? "bg-[var(--aui-primary)] text-white"
          : disabled ? "cursor-not-allowed text-[var(--aui-on-surface-soft)] opacity-40"
          : "text-[var(--aui-on-surface)] hover:bg-[var(--aui-surface-variant)]"
      )}
    >
      {children}
    </button>
  );
}

function TilesRow({ wo, index = 0 }: { wo: WorkOrder; index?: number }) {
  const state = getUpdateState(wo);
  const created = formatWODate(wo.createdAt);
  const nextUpdate = wo.nextUpdate ? formatWODate(wo.nextUpdate) : null;

  const STATE_CONFIG: Record<UpdateState, { label: string; className: string; icon: string }> = {
    delayed: { label: "Delayed", className: "bg-[#7A1E1E] text-[#FFADAD]", icon: "warning-circle" },
    "at-risk": { label: "At risk", className: "bg-[#4A3800] text-[#FFD966]", icon: "warning" },
    "on-time": { label: "On time", className: "bg-[#0A4A2E] text-[#6EE7A8]", icon: "check-circle" },
  };
  const cfg = STATE_CONFIG[state];

  return (
    <tr
      className="wo-row border-b border-[var(--aui-outline-soft)] hover:bg-[var(--aui-surface-variant)] transition-colors cursor-pointer"
      style={{ animationDelay: `${380 + Math.min(index, 15) * 30}ms` }}
      onClick={() => window.location.href = `/workorders/${wo.id}`}
    >
      {/* Status (health-colored) */}
      <td className="px-4 py-3">
        <span className={cn("inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold", cfg.className)}>
          <Icon.Phosphor name={cfg.icon} size="small" aria-hidden className="!h-3 !w-3" />
          {WO_STATUS_LABELS[wo.status] ?? wo.status}
        </span>
      </td>
      {/* Customer */}
      <td className="px-4 py-3 font-medium text-[var(--aui-on-surface)]">{wo.customer}</td>
      {/* Device / Issue */}
      <td className="px-4 py-3">
        <div className="flex items-start gap-2">
          <Icon.Phosphor
            name={DEVICE_ICONS[wo.deviceType] ?? "cube"}
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
      {/* Created */}
      <td className="px-4 py-3">
        <div>
          <div className="text-[var(--aui-on-surface)]">{created.date}</div>
          <div className="text-[11px] text-[var(--aui-on-surface-soft)]">{created.time}</div>
        </div>
      </td>
      {/* Next update */}
      <td className="px-4 py-3 text-[var(--aui-on-surface-soft)]">
        {nextUpdate ? (
          <div>
            <div className="text-[var(--aui-on-surface)]">{nextUpdate.date}</div>
            <div className="text-[11px]">{nextUpdate.time}</div>
          </div>
        ) : (
          <span>—</span>
        )}
      </td>
      {/* Program */}
      <td className="px-4 py-3 text-[var(--aui-on-surface-soft)]">{wo.program}</td>
      {/* Total */}
      <td className="px-4 py-3 text-right font-medium text-[var(--aui-on-surface)]">
        {wo.total != null ? `$${wo.total.toFixed(2)}` : "—"}
      </td>
      {/* WO # */}
      <td className="px-4 py-3 font-mono text-sm text-[var(--aui-on-surface)]">{wo.id}</td>
    </tr>
  );
}
