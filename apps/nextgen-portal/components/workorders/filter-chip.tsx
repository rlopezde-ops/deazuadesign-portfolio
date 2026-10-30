"use client";

import { cn } from "@/lib/utils";
import { useId } from "react";

type FilterChipProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "small" | "medium";
};

export function FilterChip({ label, checked, onChange, size = "small" }: FilterChipProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={cn(
        "relative inline-flex cursor-pointer select-none items-center overflow-hidden whitespace-nowrap rounded-full transition-all",
        "min-h-[24px]",
        size === "small" ? "px-[var(--aui-spacing-100)] py-[var(--aui-spacing-050)]" : "px-[var(--aui-spacing-200)] py-[var(--aui-spacing-150)]",
        checked
          ? "bg-[var(--aui-secondary)] shadow-[0_0_0_1px_var(--aui-secondary)_inset]"
          : "bg-[var(--aui-surface)] shadow-[0_0_0_1px_var(--aui-outline)_inset] hover:shadow-[0_0_0_1px_var(--aui-on-surface)_inset]"
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={cn(
        "px-[var(--aui-spacing-050)] text-[var(--aui-on-surface)]",
        size === "small" ? "text-xs" : "text-sm"
      )}>
        {label}
      </span>
    </label>
  );
}
