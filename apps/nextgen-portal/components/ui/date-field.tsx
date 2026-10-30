"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarBlank } from "@phosphor-icons/react";
import { Calendar } from "@/components/ui/calendar";
import { toDisplayDate } from "@/lib/store-closures-data";
import { cn } from "@/lib/utils";

type DateFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  className?: string;
  "aria-label"?: string;
  placeholder?: string;
};

function parseInputDate(value: string): Date | undefined {
  if (!value) return undefined;
  const [yyyy, mm, dd] = value.split("-").map(Number);
  if (!yyyy || !mm || !dd) return undefined;
  return new Date(yyyy, mm - 1, dd);
}

function toInputDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Single-date popover calendar matching DateRangeField styling (AUI + Phosphor).
 */
export function DateField({
  id,
  value,
  onChange,
  required,
  disabled,
  min,
  className,
  "aria-label": ariaLabel,
  placeholder = "Select a date",
}: DateFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const selected = useMemo(() => parseInputDate(value), [value]);
  const displayLabel = value ? toDisplayDate(value) : "";

  const disabledMatcher = useMemo(() => {
    const minDate = parseInputDate(min ?? "") ?? startOfDay(new Date());
    return { before: minDate };
  }, [min]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const width = 304; // 19rem
      let left = rect.left;
      if (left + width > window.innerWidth - 8) {
        left = Math.max(8, window.innerWidth - width - 8);
      }
      const preferredTop = rect.bottom + 6;
      const estimatedHeight = 360;
      const top =
        preferredTop + estimatedHeight > window.innerHeight - 8
          ? Math.max(8, rect.top - estimatedHeight - 6)
          : preferredTop;
      setPosition({ top, left });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  function closePopover() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      closePopover();
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closePopover();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        id={fieldId}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel ?? "Date"}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-required={required}
        onClick={() => {
          if (disabled) return;
          setOpen((v) => !v);
        }}
        className={cn(
          "flex h-10 w-full items-center rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface-variant)] py-2 pl-3 pr-10 text-left text-sm outline-none transition-colors",
          "focus-visible:border-[var(--aui-accent-purple)]",
          disabled && "cursor-not-allowed opacity-40",
          open && "border-[var(--aui-accent-purple)]"
        )}
      >
        <span
          className={cn(
            "truncate tabular-nums",
            displayLabel
              ? "text-[var(--aui-on-surface)]"
              : "text-[var(--aui-on-surface-soft)]"
          )}
        >
          {displayLabel || placeholder}
        </span>
        <span className="absolute inset-y-0 right-0 flex w-10 items-center justify-center">
          <CalendarBlank
            className="size-4 shrink-0"
            weight="regular"
            style={{ color: "var(--aui-on-surface-soft)" }}
            aria-hidden
          />
        </span>
      </button>

      {mounted && open && position
        ? createPortal(
            <div
              ref={popoverRef}
              role="dialog"
              aria-label="Select a date"
              className="fixed z-[80] w-[19rem] overflow-hidden rounded-[var(--aui-border-radius-100)] bg-[var(--aui-elevated-level-03)] shadow-[0_1px_4px_0_var(--aui-fills-actions-pressed-shadow)]"
              style={{
                top: position.top,
                left: position.left,
              }}
            >
              <div className="px-0 pt-[var(--aui-spacing-300)] pb-[var(--aui-spacing-200)]">
                <Calendar
                  mode="single"
                  numberOfMonths={1}
                  selected={selected}
                  onSelect={(date) => {
                    onChange(date ? toInputDate(date) : "");
                  }}
                  defaultMonth={selected ?? startOfDay(new Date())}
                  disabled={disabledMatcher}
                />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-[var(--aui-outline-soft)] px-3 py-2">
                <p className="text-xs text-[var(--aui-on-surface-soft)]">
                  {value
                    ? toDisplayDate(value)
                    : "Select an effective date"}
                </p>
                <div className="flex items-center gap-3">
                  {value ? (
                    <button
                      type="button"
                      className="text-xs font-medium text-[var(--aui-on-surface-soft)] hover:text-[var(--aui-on-surface)]"
                      onClick={() => onChange("")}
                    >
                      Clear
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={!value}
                    className="rounded-full bg-[var(--aui-primary)] px-3 py-1 text-xs font-medium text-[var(--aui-on-primary)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={closePopover}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
