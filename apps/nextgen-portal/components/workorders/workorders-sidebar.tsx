"use client";

import { Action, Icon } from "@asurion-core/mx-asurion-ui-react";
import { sidebarNav, moreMenuItems } from "@/lib/dashboard-nav-data";
import { cn } from "@/lib/utils";

function NavIcon({
  iconName,
  weight = "regular",
  size = "medium",
  className,
}: {
  iconName?: string;
  weight?: "regular" | "fill";
  size?: "small" | "medium";
  className?: string;
}) {
  return (
    <Icon.Phosphor
      name={iconName}
      size={size}
      weight={weight}
      className={className}
      aria-hidden
    />
  );
}

const navActionClass =
  "!h-auto !w-full !justify-start !gap-3 !rounded-[var(--aui-border-radius-100)] !border-0 !px-3 !py-2.5 !text-left !text-sm !font-medium !normal-case ![text-decoration:none] [&_span]:[text-decoration:none]";

export function WorkordersSidebar() {
  return (
    <aside
      data-slot="store-sidebar"
      className="flex w-[220px] shrink-0 flex-col border-r border-[var(--aui-outline-soft)] bg-[var(--aui-surface)]"
    >
      <nav
        className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-[var(--aui-spacing-100)] pt-[var(--aui-spacing-200)]"
        aria-label="Store"
      >
        {sidebarNav.map((item) => {
          if (item.id === "more") {
            return (
              <Action
                key={item.id}
                type="button"
                size="sm"
                variant="flat"
                className={cn(
                  navActionClass,
                  "!inline-flex !items-center !text-[var(--aui-on-surface-soft)] hover:!bg-[var(--aui-nav-hover-bg)] hover:!text-[var(--aui-on-surface)]"
                )}
              >
                <NavIcon iconName={item.iconName} className="!mr-2 shrink-0" />
                <span className="flex-1 leading-none">{item.label}</span>
                <Icon.Phosphor name="caret-down" size="small" weight="regular" aria-hidden className="opacity-70" />
              </Action>
            );
          }

          const isActive = item.id === "workorders";
          const href = item.id === "workorders" ? "/?view=workorders" : "/";

          return (
            <a
              key={item.id}
              href={href}
              className={cn(
                navActionClass,
                "inline-flex items-center rounded-[var(--aui-border-radius-100)] px-3 py-2.5 text-sm font-medium no-underline transition-colors",
                isActive
                  ? "bg-[var(--aui-nav-active-bg)] text-[var(--aui-nav-active-text)]"
                  : "text-[var(--aui-on-surface-soft)] hover:bg-[var(--aui-nav-hover-bg)] hover:text-[var(--aui-on-surface)]"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <NavIcon
                iconName={item.iconName}
                weight={isActive ? "fill" : "regular"}
                className="!mr-2 shrink-0"
              />
              <span className="flex-1 leading-none">{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="border-t border-[var(--aui-outline-soft)] p-[var(--aui-spacing-100)]">
        <Action
          type="button"
          size="sm"
          variant="flat"
          aria-label="Collapse sidebar"
          className="!ml-auto !inline-flex !items-center !justify-end !px-3 !py-2"
        >
          <Icon.Phosphor name="caret-double-left" size="small" weight="regular" aria-hidden />
        </Action>
      </div>
    </aside>
  );
}
