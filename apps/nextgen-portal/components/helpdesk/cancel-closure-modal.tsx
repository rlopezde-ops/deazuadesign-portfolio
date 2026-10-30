"use client";

import { useEffect, useState } from "react";
import { Datepicker } from "@asurion-core/mx-asurion-ui-react";
import { AuiModal } from "@/components/aui/aui-modal";
import { dateToInputDate, inputDateToDate } from "@/lib/aui-date";
import {
  formatStoreLabel,
  toDisplayDate,
  todayInputDate,
  type StoreClosure,
} from "@/lib/store-closures-data";

type CancelClosureModalProps = {
  open: boolean;
  closure: StoreClosure | null;
  onClose: () => void;
  onConfirm: (payload?: { reopenDate?: string }) => void;
};

export function CancelClosureModal({
  open,
  closure,
  onClose,
  onConfirm,
}: CancelClosureModalProps) {
  const [reopenDate, setReopenDate] = useState(todayInputDate);

  useEffect(() => {
    if (!open) return;
    setReopenDate(todayInputDate());
  }, [open, closure?.id]);

  if (!closure) {
    return (
      <AuiModal
        isOpen={false}
        title=""
        onCloseClick={onClose}
        onSecondaryClick={onClose}
      />
    );
  }

  const isScheduled = closure.status === "scheduled";
  const instruction = isScheduled
    ? "Canceling this scheduled closure will remove it before it takes effect. The store will remain open and no changes will be applied to internal or external systems."
    : "Reopening a store will make it active in all internal and external systems. The store will resume normal operations and become available for customer-facing services where applicable.";

  const canConfirm = isScheduled || Boolean(reopenDate);

  return (
    <AuiModal
      isOpen={open}
      title={isScheduled ? "Cancel scheduled closure?" : "Reopen store?"}
      primaryButtonLabel={isScheduled ? "Cancel closure" : "Reopen store"}
      secondaryButtonLabel={isScheduled ? "Keep closure" : "Keep closed"}
      primaryButtonDisabled={!canConfirm}
      onCloseClick={onClose}
      onSecondaryClick={onClose}
      onPrimaryClick={() =>
        onConfirm(
          isScheduled
            ? undefined
            : { reopenDate: toDisplayDate(reopenDate) }
        )
      }
    >
      <div className="flex flex-col gap-[var(--aui-spacing-200)]">
        <p className="text-sm text-[var(--aui-on-surface-soft)]">
          {formatStoreLabel(closure)} · Closing on{" "}
          <span className="tabular-nums">{closure.closingOn}</span>
        </p>
        <p className="text-sm text-[var(--aui-on-surface-soft)] text-pretty">
          {instruction}
        </p>
        {!isScheduled ? (
          <Datepicker
            id="reopen-store-date"
            value={inputDateToDate(reopenDate)}
            onChange={(date: Date) => setReopenDate(dateToInputDate(date))}
            textFieldProps={{
              label: "Reopen date",
              required: true,
            }}
          />
        ) : null}
      </div>
    </AuiModal>
  );
}
