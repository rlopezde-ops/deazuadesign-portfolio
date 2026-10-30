"use client";

import { useEffect, useId, type ReactNode } from "react";
import { Action, Icon, Text } from "@asurion-core/mx-asurion-ui-react";
import { cn } from "@/lib/utils";

export type SlideOutPanelFooterAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

type SlideOutPanelProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  primaryAction?: SlideOutPanelFooterAction;
  secondaryAction?: SlideOutPanelFooterAction;
  className?: string;
  /** Panel width; defaults to AUI-like form drawer width. */
  widthClassName?: string;
};

/**
 * Right-edge slide-out panel styled like AUI Drawer, using dark AUI tokens.
 */
export function SlideOutPanel({
  open,
  title,
  onClose,
  children,
  primaryAction,
  secondaryAction,
  className,
  widthClassName = "max-w-md",
}: SlideOutPanelProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      data-slot="slide-out-panel"
    >
      <button
        type="button"
        aria-label="Dismiss panel"
        className="absolute inset-0 bg-[var(--aui-scrim-overlay)] backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative z-10 flex h-full w-full flex-col",
          "border-l border-[var(--aui-outline-soft)]",
          "bg-[var(--aui-elevated-level-02)] text-[var(--aui-on-surface)]",
          "shadow-[0_0_48px_var(--aui-fills-drop-shadow)]",
          "animate-slide-in-right",
          widthClassName,
          className
        )}
      >
        <header className="relative flex shrink-0 items-center border-b border-[var(--aui-outline-soft)] px-[var(--aui-spacing-300)] py-[var(--aui-spacing-200)] pr-14">
          <Text
            id={titleId}
            as="h2"
            size={3}
            weight="base"
            className="text-balance"
          >
            {title}
          </Text>
          <Action
            type="button"
            size="sm"
            variant="flat"
            aria-label="Close"
            onClick={onClose}
            className="!absolute !right-3 !top-1/2 !inline-flex !-translate-y-1/2 !items-center !justify-center !p-2"
          >
            <Icon.Phosphor name="x" size="small" weight="bold" aria-hidden />
          </Action>
        </header>

        <div className="flex-1 overflow-x-hidden overflow-y-auto px-[var(--aui-spacing-300)] py-[var(--aui-spacing-300)]">
          {children}
        </div>

        {primaryAction || secondaryAction ? (
          <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-[var(--aui-outline-soft)] px-[var(--aui-spacing-300)] py-[var(--aui-spacing-200)]">
            {secondaryAction ? (
              <Action
                type="button"
                size="sm"
                variant="outline"
                disabled={secondaryAction.disabled}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Action>
            ) : null}
            {primaryAction ? (
              <Action
                type="button"
                size="sm"
                variant="filled"
                disabled={primaryAction.disabled}
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Action>
            ) : null}
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
