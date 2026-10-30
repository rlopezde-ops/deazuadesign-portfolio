"use client";

import {
  useEffect,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  Action,
  ActionCard,
  Datepicker,
  Dropdown,
  Textarea,
  Toast,
} from "@asurion-core/mx-asurion-ui-react";
import { CaretDown, CaretUp, Warning } from "@phosphor-icons/react";
import { AuiModal } from "@/components/aui/aui-modal";
import { DateRangeField } from "@/components/ui/date-range-field";
import { SlideOutPanel } from "@/components/ui/slide-out-panel";
import { ImpactedStoresField } from "@/components/helpdesk/impacted-stores-field";
import { dateToInputDate, inputDateToDate } from "@/lib/aui-date";
import {
  impactScopeLabel,
  isDateInFuture,
  reasonsForClosureType,
  SAMPLE_STORES,
  storesByType,
  toDisplayDate,
  type ClosureType,
  type ImpactScope,
  type SampleStore,
  type StoreClosure,
} from "@/lib/store-closures-data";

export type CloseStoreDraft = {
  closureType: ClosureType;
  effectiveDate: string;
  endDate: string;
  impactScope: ImpactScope;
  selectedStores: SampleStore[];
  reason: string;
  notes: string;
};

type CloseStorePanelProps = {
  open: boolean;
  onClose: () => void;
  onRequestConfirm: (draft: CloseStoreDraft) => void;
};

const emptyDraft = (): CloseStoreDraft => ({
  closureType: "temporary",
  effectiveDate: "",
  endDate: "",
  impactScope: "specific",
  selectedStores: [],
  reason: "",
  notes: "",
});

export function CloseStorePanel({
  open,
  onClose,
  onRequestConfirm,
}: CloseStorePanelProps) {
  const dateRangeId = useId();
  const [draft, setDraft] = useState<CloseStoreDraft>(emptyDraft);

  useEffect(() => {
    if (!open) return;
    setDraft(emptyDraft());
  }, [open]);

  const reasons = reasonsForClosureType(draft.closureType);

  const resolvedStores = useMemo(
    () => resolveImpactedStores(draft),
    [draft]
  );

  const canSubmit =
    Boolean(draft.effectiveDate) &&
    Boolean(draft.reason) &&
    resolvedStores.length > 0;

  function setClosureType(closureType: ClosureType) {
    if (closureType === draft.closureType) return;

    setDraft((d) => ({
      ...d,
      closureType,
      reason: "",
      endDate: closureType === "permanent" ? "" : d.endDate,
      impactScope: closureType === "permanent" ? "specific" : d.impactScope,
    }));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    const endDate =
      draft.closureType === "temporary"
        ? draft.endDate || draft.effectiveDate
        : "";
    onRequestConfirm({
      ...draft,
      endDate,
      selectedStores: resolvedStores,
      impactScope:
        draft.closureType === "permanent" ? "specific" : draft.impactScope,
    });
  }

  const reasonOptions = [
    { name: "Select a reason", value: "" },
    ...reasons.map((reason) => ({ name: reason, value: reason })),
  ];

  return (
    <SlideOutPanel
      open={open}
      title="Close store"
      onClose={onClose}
      secondaryAction={{ label: "Cancel", onClick: onClose }}
      primaryAction={{
        label: "Submit",
        disabled: !canSubmit,
        onClick: handleSubmit,
      }}
    >
      <div className="flex flex-col gap-[var(--aui-spacing-300)]">
        <Field label="Closure type">
          <div
            className="grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-label="Closure type"
          >
            {(
              [
                ["temporary", "Temporary"],
                ["permanent", "Permanent"],
              ] as const
            ).map(([value, label]) => (
              <ActionCard
                key={value}
                variant="radio"
                name="closure-type"
                value={value}
                checked={draft.closureType === value}
                onChange={() => setClosureType(value)}
              >
                <ActionCard.Heading size={2}>{label}</ActionCard.Heading>
              </ActionCard>
            ))}
          </div>
        </Field>

        <Field label="Impacted stores">
          <div className="relative z-[110]">
            <ImpactedStoresField
              closureType={draft.closureType}
              impactScope={draft.impactScope}
              selectedStores={draft.selectedStores}
              onImpactScopeChange={(impactScope) =>
                setDraft((d) => ({
                  ...d,
                  impactScope,
                  selectedStores:
                    impactScope === "specific" ? d.selectedStores : [],
                }))
              }
              onSelectedStoresChange={(selectedStores) =>
                setDraft((d) => ({
                  ...d,
                  selectedStores,
                }))
              }
            />
          </div>
        </Field>

        {draft.closureType === "temporary" ? (
          <DateRangeField
            id={dateRangeId}
            label="When"
            required
            value={{ from: draft.effectiveDate, to: draft.endDate }}
            onChange={({ from, to }) =>
              setDraft((d) => ({
                ...d,
                effectiveDate: from,
                endDate: to,
              }))
            }
          />
        ) : (
          <Datepicker
            id="close-store-effective-date"
            value={inputDateToDate(draft.effectiveDate)}
            onChange={(date: Date) =>
              setDraft((d) => ({
                ...d,
                effectiveDate: dateToInputDate(date),
              }))
            }
            textFieldProps={{
              label: "When",
              required: true,
            }}
          />
        )}

        <Dropdown
          label="Reason for closure"
          options={reasonOptions}
          value={draft.reason}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setDraft((d) => ({ ...d, reason: e.target.value }))
          }
        />

        <Textarea
          label="Notes (optional)"
          rows={3}
          value={draft.notes}
          onChange={(e) =>
            setDraft((d) => ({ ...d, notes: e.target.value }))
          }
          resize
        />
      </div>
    </SlideOutPanel>
  );
}

export function ConfirmClosureModal({
  open,
  draft,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  draft: CloseStoreDraft | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [storesExpanded, setStoresExpanded] = useState(false);

  useEffect(() => {
    if (!open) setStoresExpanded(false);
  }, [open]);

  if (!draft) {
    return (
      <AuiModal
        isOpen={false}
        title=""
        onCloseClick={onCancel}
        onSecondaryClick={onCancel}
        onPrimaryClick={onConfirm}
      />
    );
  }

  const stores = resolveImpactedStores(draft);
  const count = stores.length;
  const isTemporary = draft.closureType === "temporary";
  const isBulk = isTemporary && draft.impactScope !== "specific";
  const isAllStores = draft.impactScope === "all-stores";
  const takesEffectFuture = isDateInFuture(draft.effectiveDate);
  const notes = draft.notes.trim();

  const title = isTemporary
    ? "Confirm temporary closure"
    : "Confirm permanent closure";

  const closurePhrase = isTemporary
    ? "temporary closure"
    : "permanent closure";

  const actionVerb = takesEffectFuture ? "schedule a" : "apply a";

  return (
    <AuiModal
      isOpen={open}
      title={title}
      primaryButtonLabel="Confirm"
      secondaryButtonLabel="Go back"
      onCloseClick={onCancel}
      onSecondaryClick={onCancel}
      onPrimaryClick={onConfirm}
    >
      <div className="flex flex-col gap-[var(--aui-spacing-200)]">
        <p className="text-sm text-[var(--aui-on-surface-soft)] text-pretty">
          You are about to {actionVerb}{" "}
          <span className="font-medium text-[var(--aui-on-surface)]">
            {closurePhrase}
          </span>{" "}
          for{" "}
          {isBulk ? (
            <>
              <span className="font-medium text-[var(--aui-on-surface)]">
                {impactScopeLabel(draft.impactScope)}
              </span>{" "}
              (
              <span className="font-medium tabular-nums text-[var(--aui-on-surface)]">
                {count}
              </span>
              )
            </>
          ) : (
            <span className="font-medium text-[var(--aui-on-surface)]">
              {count} store{count === 1 ? "" : "s"}
            </span>
          )}{" "}
          effective{" "}
          <span className="font-medium tabular-nums text-[var(--aui-on-surface)]">
            {toDisplayDate(draft.effectiveDate)}
          </span>
          {isTemporary &&
          draft.endDate &&
          draft.endDate !== draft.effectiveDate
            ? ` through ${toDisplayDate(draft.endDate)}`
            : ""}
          . Reason: {draft.reason}.
        </p>

        {isAllStores ? (
          <p
            role="status"
            className="flex items-start gap-2 rounded-[var(--aui-border-radius-100)] border border-[var(--aui-accent-orange)]/40 bg-[var(--aui-accent-orange-soft)] px-3 py-2 text-xs text-[var(--aui-on-surface)]"
          >
            <Warning
              className="mt-0.5 size-4 shrink-0 text-[var(--aui-accent-orange)]"
              weight="fill"
            />
            <span>
              This affects every store in the catalog ({count} total).
              Double-check before confirming.
            </span>
          </p>
        ) : isBulk ? (
          <p className="text-xs text-[var(--aui-on-surface-soft)]">
            Impact scope:{" "}
            <span className="font-medium text-[var(--aui-on-surface)]">
              {impactScopeLabel(draft.impactScope)}
            </span>{" "}
            · {count} store{count === 1 ? "" : "s"}
          </p>
        ) : null}

        {!isBulk && count > 0 && count <= 5 ? (
          <ul className="max-h-32 overflow-y-auto text-sm text-[var(--aui-on-surface-soft)]">
            {stores.map((s) => (
              <li key={s.storeId}>
                {s.storeName} (#{s.storeId})
              </li>
            ))}
          </ul>
        ) : null}

        {!isBulk && count > 5 ? (
          <div>
            <Action
              type="button"
              size="sm"
              variant="flat"
              onClick={() => setStoresExpanded((v) => !v)}
            >
              {storesExpanded ? (
                <>
                  Hide store list
                  <CaretUp className="ml-1 size-3.5" />
                </>
              ) : (
                <>
                  Show all {count} stores
                  <CaretDown className="ml-1 size-3.5" />
                </>
              )}
            </Action>
            {storesExpanded ? (
              <ul className="mt-2 max-h-40 overflow-y-auto text-sm text-[var(--aui-on-surface-soft)]">
                {stores.map((s) => (
                  <li key={s.storeId}>
                    {s.storeName} (#{s.storeId})
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {notes ? (
          <div className="rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface-variant)] px-3 py-2">
            <p className="text-xs font-medium text-[var(--aui-on-surface-soft)]">
              Notes
            </p>
            <p className="mt-1 max-h-24 overflow-y-auto text-sm text-[var(--aui-on-surface)] text-pretty">
              {notes}
            </p>
          </div>
        ) : null}
      </div>
    </AuiModal>
  );
}

export function SuccessToast({
  open,
  message,
  onDismiss,
}: {
  open: boolean;
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(onDismiss, 4000);
    return () => window.clearTimeout(t);
  }, [open, onDismiss]);

  return (
    <Toast
      isOpen={open}
      message={message}
      toastType="success"
      onCloseClick={onDismiss}
      buttonAriaLabel="Dismiss"
    />
  );
}

export function draftToClosures(draft: CloseStoreDraft): Omit<StoreClosure, "id">[] {
  const stores = resolveImpactedStores(draft);
  const closingOn = toDisplayDate(draft.effectiveDate);
  const reopensOn =
    draft.closureType === "temporary"
      ? toDisplayDate(draft.endDate || draft.effectiveDate)
      : null;
  const status: StoreClosure["status"] =
    isDateInFuture(draft.effectiveDate)
      ? "scheduled"
      : draft.closureType === "permanent"
        ? "permanent"
        : "temporary";

  return stores.map((store) => ({
    storeName: store.storeName,
    storeId: store.storeId,
    status,
    closingOn,
    reopensOn,
    reason: draft.reason,
    closedBy: "You",
    notes: draft.notes.trim() || undefined,
  }));
}

function resolveImpactedStores(draft: CloseStoreDraft): SampleStore[] {
  if (draft.closureType === "permanent" || draft.impactScope === "specific") {
    return draft.selectedStores;
  }
  if (draft.impactScope === "all-corporate") {
    return storesByType("corporate");
  }
  if (draft.impactScope === "all-franchise") {
    return storesByType("franchise");
  }
  return SAMPLE_STORES;
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {htmlFor ? (
        <label
          htmlFor={htmlFor}
          className="text-base font-normal text-[var(--aui-on-surface)]"
        >
          {label}
        </label>
      ) : (
        <span className="text-base font-normal text-[var(--aui-on-surface)]">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
