"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  Action,
  ActionCard,
  Dropdown,
  Tag,
  Text,
  TextField,
} from "@asurion-core/mx-asurion-ui-react";
import {
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Clock,
  DotsThreeVertical,
  Prohibit,
} from "@phosphor-icons/react";
import {
  CloseStorePanel,
  ConfirmClosureModal,
  SuccessToast,
  draftToClosures,
  type CloseStoreDraft,
} from "@/components/helpdesk/close-store-panel";
import { CancelClosureModal } from "@/components/helpdesk/cancel-closure-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FlowScreen } from "@/lib/flow-screen";
import {
  countByStatus,
  formatStoreLabel,
  initialStoreClosures,
  isDateInFuture,
  toInputDate,
  type ClosureStatus,
  type StoreClosure,
} from "@/lib/store-closures-data";
import { cn } from "@/lib/utils";

type SortKey = "store" | "status" | "closingOn" | "reopensOn";
type SortDir = "asc" | "desc";

const STATUS_SORT_ORDER: Record<ClosureStatus, number> = {
  scheduled: 0,
  temporary: 1,
  permanent: 2,
};

const statusMeta: Record<
  ClosureStatus,
  {
    label: string;
    shortLabel: string;
    icon: typeof CalendarBlank;
    iconName: string;
    iconBg: string;
    iconColor: string;
    tagType: "orange" | "teal" | "error";
  }
> = {
  scheduled: {
    label: "Scheduled to close",
    shortLabel: "Scheduled",
    icon: CalendarBlank,
    iconName: "calendar-blank",
    iconBg: "var(--aui-accent-orange-soft)",
    iconColor: "var(--aui-accent-orange)",
    tagType: "orange",
  },
  temporary: {
    label: "Temporarily closed",
    shortLabel: "Temporary",
    icon: Clock,
    iconName: "clock",
    iconBg: "var(--aui-accent-teal-soft)",
    iconColor: "var(--aui-accent-teal)",
    tagType: "teal",
  },
  permanent: {
    label: "Permanently closed",
    shortLabel: "Permanent",
    icon: Prohibit,
    iconName: "prohibit",
    iconBg: "var(--aui-status-error-soft)",
    iconColor: "var(--aui-status-error)",
    tagType: "error",
  },
};

function sortableDateValue(display: string | null) {
  if (!display) return null;
  return toInputDate(display);
}

const DEMO_CONFIRM_DRAFT: CloseStoreDraft = {
  closureType: "temporary",
  effectiveDate: "2026-08-10",
  endDate: "2026-08-12",
  impactScope: "specific",
  selectedStores: [
    { storeName: "Pine Crest", storeId: "1011", storeType: "corporate" },
  ],
  reason: "Facility maintenance",
  notes: "HVAC repair — reopen after inspection.",
};

type StoreClosuresViewProps = {
  flowScreen?: FlowScreen;
};

export function StoreClosuresView({ flowScreen }: StoreClosuresViewProps) {
  const [closures, setClosures] = useState<StoreClosure[]>(initialStoreClosures);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClosureStatus | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("closingOn");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<CloseStoreDraft | null>(
    null
  );
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [cancelOpen, setCancelOpen] = useState(false);
  const [canceling, setCanceling] = useState<StoreClosure | null>(null);

  useEffect(() => {
    if (!flowScreen) return;

    setQuery("");
    setPage(0);
    setToastOpen(false);

    const scheduled = initialStoreClosures.find((c) => c.status === "scheduled");
    const temporary = initialStoreClosures.find((c) => c.status === "temporary");

    switch (flowScreen) {
      case "store-closures":
        setStatusFilter(null);
        setPanelOpen(false);
        setConfirmOpen(false);
        setPendingDraft(null);
        setCancelOpen(false);
        setCanceling(null);
        setOpenMenuId(null);
        break;
      case "filter-scheduled":
        setStatusFilter("scheduled");
        setPanelOpen(false);
        setConfirmOpen(false);
        setPendingDraft(null);
        setCancelOpen(false);
        setCanceling(null);
        setOpenMenuId(null);
        break;
      case "close-store":
        setStatusFilter(null);
        setPanelOpen(true);
        setConfirmOpen(false);
        setPendingDraft(null);
        setCancelOpen(false);
        setCanceling(null);
        setOpenMenuId(null);
        break;
      case "confirm-closure":
        setStatusFilter(null);
        setPanelOpen(true);
        setPendingDraft(DEMO_CONFIRM_DRAFT);
        setConfirmOpen(true);
        setCancelOpen(false);
        setCanceling(null);
        setOpenMenuId(null);
        break;
      case "row-actions":
        setStatusFilter(null);
        setPanelOpen(false);
        setConfirmOpen(false);
        setPendingDraft(null);
        setCancelOpen(false);
        setCanceling(null);
        setOpenMenuId(scheduled?.id ?? null);
        break;
      case "cancel-closure":
        setStatusFilter(null);
        setPanelOpen(false);
        setConfirmOpen(false);
        setPendingDraft(null);
        setOpenMenuId(null);
        setCanceling(scheduled ?? null);
        setCancelOpen(Boolean(scheduled));
        break;
      case "reopen-store":
        setStatusFilter(null);
        setPanelOpen(false);
        setConfirmOpen(false);
        setPendingDraft(null);
        setOpenMenuId(null);
        setCanceling(temporary ?? null);
        setCancelOpen(Boolean(temporary));
        break;
      default:
        break;
    }
  }, [flowScreen]);

  const counts = useMemo(() => countByStatus(closures), [closures]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...closures];
    if (statusFilter) {
      list = list.filter((c) => c.status === statusFilter);
    }
    if (q) {
      list = list.filter((c) =>
        `${c.storeName} ${c.storeId} ${c.reason} ${c.closedBy} ${statusMeta[c.status].label}`
          .toLowerCase()
          .includes(q)
      );
    }

    const direction = sortDir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "store":
          cmp = a.storeName.localeCompare(b.storeName, undefined, {
            sensitivity: "base",
          });
          if (cmp === 0) cmp = a.storeId.localeCompare(b.storeId);
          break;
        case "status":
          cmp = STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status];
          break;
        case "closingOn": {
          const aDate = sortableDateValue(a.closingOn) ?? "";
          const bDate = sortableDateValue(b.closingOn) ?? "";
          cmp = aDate.localeCompare(bDate);
          break;
        }
        case "reopensOn": {
          const aDate = sortableDateValue(a.reopensOn);
          const bDate = sortableDateValue(b.reopensOn);
          if (aDate === null && bDate === null) cmp = 0;
          else if (aDate === null) cmp = 1;
          else if (bDate === null) cmp = -1;
          else cmp = aDate.localeCompare(bDate);
          break;
        }
      }
      if (cmp === 0) {
        return a.storeName.localeCompare(b.storeName, undefined, {
          sensitivity: "base",
        });
      }
      return cmp * direction;
    });

    return list;
  }, [closures, query, statusFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "store" || key === "status" ? "asc" : "desc");
    }
    setPage(0);
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(
    safePage * pageSize,
    safePage * pageSize + pageSize
  );
  const rangeStart = filtered.length === 0 ? 0 : safePage * pageSize + 1;
  const rangeEnd = Math.min(filtered.length, (safePage + 1) * pageSize);

  const dismissToast = useCallback(() => setToastOpen(false), []);

  useEffect(() => {
    if (!openMenuId) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as HTMLElement | null;
      if (target?.closest(`[data-row-menu="${openMenuId}"]`)) return;
      setOpenMenuId(null);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenMenuId(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [openMenuId]);

  function openCreate() {
    setPanelOpen(true);
    setOpenMenuId(null);
  }

  function toggleStatusFilter(status: ClosureStatus) {
    setStatusFilter((current) => (current === status ? null : status));
    setPage(0);
  }

  function requestCancelClosure(closure: StoreClosure) {
    setCanceling(closure);
    setCancelOpen(true);
    setOpenMenuId(null);
  }

  function confirmCancelClosure(payload?: { reopenDate?: string }) {
    if (!canceling) return;
    const wasScheduled = canceling.status === "scheduled";
    setClosures((prev) => prev.filter((c) => c.id !== canceling.id));
    setToastMessage(
      wasScheduled
        ? `Scheduled closure canceled for ${formatStoreLabel(canceling)}.`
        : `${formatStoreLabel(canceling)} has been reopened${
            payload?.reopenDate ? ` effective ${payload.reopenDate}` : ""
          }.`
    );
    setToastOpen(true);
    setCancelOpen(false);
    setCanceling(null);
  }

  function handleRequestConfirm(draft: CloseStoreDraft) {
    setPendingDraft(draft);
    setConfirmOpen(true);
  }

  function handleConfirmSubmit() {
    if (!pendingDraft) return;
    const rows = draftToClosures(pendingDraft);
    const stamp = Date.now();
    setClosures((prev) => [
      ...rows.map((row, i) => ({ ...row, id: `sc-${stamp}-${i}` })),
      ...prev,
    ]);
    const count = rows.length;
    const typeLabel =
      pendingDraft.closureType === "temporary" ? "Temporary" : "Permanent";
    const scheduled = isDateInFuture(pendingDraft.effectiveDate);
    setToastMessage(
      count === 1
        ? `${typeLabel} closure ${scheduled ? "scheduled" : "submitted"} for ${rows[0].storeName} (#${rows[0].storeId}).`
        : `${typeLabel} closure ${scheduled ? "scheduled" : "submitted"} for ${count} stores.`
    );
    setToastOpen(true);
    setConfirmOpen(false);
    setPendingDraft(null);
    setPanelOpen(false);
    setPage(0);
  }

  const emptyMessage =
    closures.length === 0
      ? "No store closures yet."
      : "No store closures match your filters.";

  const showEmptyCta = closures.length === 0 && !query.trim() && !statusFilter;

  return (
    <div className="flex flex-col gap-[var(--aui-spacing-300)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Text as="h2" size={2} weight="base">
            Store closures
          </Text>
          <Text
            as="p"
            size={1}
            weight="base"
            color="var(--aui-on-surface-soft)"
            className="mt-[var(--aui-spacing-050)] max-w-xl text-pretty"
          >
            Review stores that are closed or scheduled to close, and manage their
            closures.
          </Text>
        </div>
        <Action type="button" variant="filled" onClick={openCreate}>
          Close store
        </Action>
      </div>

      <div className="grid gap-[var(--aui-spacing-200)] sm:grid-cols-3">
        {(
          [
            ["scheduled", counts.scheduled],
            ["temporary", counts.temporary],
            ["permanent", counts.permanent],
          ] as const
        ).map(([status, count]) => {
          const meta = statusMeta[status];
          const Icon = meta.icon;
          const selected = statusFilter === status;
          return (
            <ActionCard
              key={status}
              variant="button"
              aria-pressed={selected}
              onClick={() => toggleStatusFilter(status)}
              className={cn(
                selected &&
                  "!border-[var(--aui-accent-purple)] !bg-[var(--aui-accent-purple-soft)]"
              )}
            >
              <ActionCard.Leading>
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full"
                  style={{ background: meta.iconBg, color: meta.iconColor }}
                >
                  <Icon className="size-5" weight="fill" />
                </span>
              </ActionCard.Leading>
              <ActionCard.Heading size={2}>
                {meta.label}
              </ActionCard.Heading>
              <ActionCard.SupportiveText
                size={5}
                className="!mt-1 !font-medium !tabular-nums !leading-none !text-[var(--aui-on-surface)]"
              >
                {count}
              </ActionCard.SupportiveText>
            </ActionCard>
          );
        })}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-[220px] flex-1 max-w-sm">
          <TextField
            label="Search store"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search store"
          />
        </div>

        <div className="w-[140px]">
          <Dropdown
            label="Items per page"
            value={String(pageSize)}
            options={[5, 10, 25].map((n) => ({
              name: String(n),
              value: String(n),
            }))}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setPageSize(Number(e.target.value));
              setPage(0);
            }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-elevated-level-01)]">
        <Table className="min-w-[840px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <SortableColumn
                  label="Store"
                  active={sortKey === "store"}
                  direction={sortDir}
                  onClick={() => toggleSort("store")}
                />
              </TableHead>
              <TableHead>
                <SortableColumn
                  label="Status"
                  active={sortKey === "status"}
                  direction={sortDir}
                  onClick={() => toggleSort("status")}
                />
              </TableHead>
              <TableHead>
                <SortableColumn
                  label="Closing on"
                  active={sortKey === "closingOn"}
                  direction={sortDir}
                  onClick={() => toggleSort("closingOn")}
                />
              </TableHead>
              <TableHead>
                <SortableColumn
                  label="Reopens on"
                  active={sortKey === "reopensOn"}
                  direction={sortDir}
                  onClick={() => toggleSort("reopensOn")}
                />
              </TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Closed by</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-[var(--aui-on-surface-soft)]"
                >
                  <div className="flex flex-col items-center gap-3">
                    <p>{emptyMessage}</p>
                    {showEmptyCta ? (
                      <Action type="button" size="sm" variant="filled" onClick={openCreate}>
                        Close store
                      </Action>
                    ) : statusFilter || query.trim() ? (
                      <Action
                        type="button"
                        size="sm"
                        variant="flat"
                        onClick={() => {
                          setStatusFilter(null);
                          setQuery("");
                          setPage(0);
                        }}
                      >
                        Clear filters
                      </Action>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((closure) => {
                const meta = statusMeta[closure.status];
                return (
                  <TableRow key={closure.id}>
                    <TableCell>
                      <span className="font-medium">
                        {formatStoreLabel(closure)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Tag
                        text={meta.shortLabel}
                        type={meta.tagType}
                        size="small"
                        family="soft"
                        iconName={meta.iconName}
                        title={meta.label}
                      />
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {closure.closingOn}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {closure.reopensOn ?? "—"}
                    </TableCell>
                    <TableCell>{closure.reason}</TableCell>
                    <TableCell>{closure.closedBy}</TableCell>
                    <TableCell className="text-right">
                      <RowActionsMenu
                        closure={closure}
                        open={openMenuId === closure.id}
                        onOpenChange={(open) =>
                          setOpenMenuId(open ? closure.id : null)
                        }
                        onAction={() => requestCancelClosure(closure)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-end gap-3 border-t border-[var(--aui-outline-soft)] px-[var(--aui-spacing-200)] py-[var(--aui-spacing-150)]">
          <span className="text-sm tabular-nums text-[var(--aui-on-surface-soft)]">
            Items {rangeStart}-{rangeEnd} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <Action
              type="button"
              size="sm"
              variant="outline"
              aria-label="Previous page"
              disabled={safePage <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <CaretLeft className="size-4" weight="bold" />
            </Action>
            <Action
              type="button"
              size="sm"
              variant="outline"
              aria-label="Next page"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              <CaretRight className="size-4" weight="bold" />
            </Action>
          </div>
        </div>
      </div>

      <CloseStorePanel
        open={panelOpen}
        onClose={() => {
          setPanelOpen(false);
          setConfirmOpen(false);
          setPendingDraft(null);
        }}
        onRequestConfirm={handleRequestConfirm}
      />
      <ConfirmClosureModal
        open={confirmOpen}
        draft={pendingDraft}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDraft(null);
        }}
        onConfirm={handleConfirmSubmit}
      />
      <CancelClosureModal
        open={cancelOpen}
        closure={canceling}
        onClose={() => {
          setCancelOpen(false);
          setCanceling(null);
        }}
        onConfirm={confirmCancelClosure}
      />
      <SuccessToast
        open={toastOpen}
        message={toastMessage}
        onDismiss={dismissToast}
      />
    </div>
  );
}

function RowActionsMenu({
  closure,
  open,
  onOpenChange,
  onAction,
}: {
  closure: StoreClosure;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    openUp: boolean;
  } | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    function updatePosition() {
      const button = buttonRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const menuWidth = 168;
      const estimatedHeight = 44;
      const gap = 4;
      const openUp =
        rect.bottom + gap + estimatedHeight > window.innerHeight - 8;
      const left = Math.min(
        Math.max(8, rect.right - menuWidth),
        window.innerWidth - menuWidth - 8
      );
      setCoords({
        top: openUp ? rect.top - gap : rect.bottom + gap,
        left,
        openUp,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  return (
    <div data-row-menu={closure.id} className="inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Actions for ${formatStoreLabel(closure)}`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => onOpenChange(!open)}
        className="inline-flex size-8 items-center justify-center rounded-[var(--aui-border-radius-100)] text-[var(--aui-on-surface-soft)] transition-colors hover:bg-[var(--aui-nav-hover-bg)] hover:text-[var(--aui-on-surface)]"
      >
        <DotsThreeVertical className="size-5" weight="bold" />
      </button>
      {open && coords
        ? createPortal(
            <div
              data-row-menu={closure.id}
              role="menu"
              className="fixed z-[80] min-w-[160px] overflow-hidden rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-elevated-level-03)] py-1 shadow-[0_8px_24px_var(--aui-fills-drop-shadow)]"
              style={{
                top: coords.top,
                left: coords.left,
                transform: coords.openUp ? "translateY(-100%)" : undefined,
              }}
            >
              <button
                type="button"
                role="menuitem"
                className={cn(
                  "block w-full px-3 py-2 text-left text-sm hover:bg-[var(--aui-nav-hover-bg)]",
                  closure.status === "scheduled"
                    ? "text-[var(--aui-status-error)]"
                    : "text-[var(--aui-on-surface)]"
                )}
                onClick={() => {
                  onOpenChange(false);
                  onAction();
                }}
              >
                {closure.status === "scheduled" ? "Cancel closure" : "Reopen"}
              </button>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

function SortableColumn({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: SortDir;
  onClick: () => void;
}) {
  const SortIcon = direction === "asc" ? CaretUp : CaretDown;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Sort by ${label}${
        active ? `, currently ${direction === "asc" ? "ascending" : "descending"}` : ""
      }`}
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--aui-border-radius-100)] transition-colors hover:text-[var(--aui-on-surface)]",
        active
          ? "text-[var(--aui-on-surface)]"
          : "text-[var(--aui-on-surface-soft)]"
      )}
    >
      {label}
      <SortIcon
        className={cn("size-3.5 shrink-0", active ? "opacity-100" : "opacity-40")}
        weight="bold"
        aria-hidden
      />
    </button>
  );
}
