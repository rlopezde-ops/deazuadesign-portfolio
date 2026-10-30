"use client";

import { Action, Icon } from "@asurion-core/mx-asurion-ui-react";
import { moreMenuItems, sidebarNav } from "@/lib/dashboard-nav-data";
import { useAppNavigation } from "@/lib/app-navigation";
import { cn } from "@/lib/utils";

function NavIcon({
  iconName,
  iconSrc,
  weight = "regular",
  size = "medium",
  className,
}: {
  iconName?: string;
  iconSrc?: string;
  weight?: "regular" | "fill";
  size?: "small" | "medium";
  className?: string;
}) {
  if (iconSrc) {
    return (
      <Icon src={iconSrc} size={size} className={className} aria-hidden />
    );
  }
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

export function StoreSidebar() {
  const {
    activeNavId,
    activeMoreId,
    moreOpen,
    setMoreOpen,
    goToDashboard,
    goToMoreItem,
    goToWorkorders,
  } = useAppNavigation();

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
          const isMore = item.id === "more";

          if (isMore) {
            return (
              <div key={item.id} className="flex flex-col gap-0.5">
                <Action
                  type="button"
                  size="sm"
                  variant="flat"
                  onClick={() => setMoreOpen(!moreOpen)}
                  aria-expanded={moreOpen}
                  aria-controls="sidebar-more-menu"
                  className={cn(
                    navActionClass,
                    "!inline-flex !items-center",
                    moreOpen || activeNavId === "more"
                      ? "!bg-[var(--aui-nav-hover-bg)] !text-[var(--aui-on-surface)]"
                      : "!text-[var(--aui-on-surface-soft)] hover:!bg-[var(--aui-nav-hover-bg)] hover:!text-[var(--aui-on-surface)]"
                  )}
                >
                  <NavIcon
                    iconName={item.iconName}
                    iconSrc={item.iconSrc}
                    className="!mr-2 shrink-0"
                  />
                  <span className="flex-1 leading-none">{item.label}</span>
                  <Icon.Phosphor
                    name="caret-down"
                    size="small"
                    weight="regular"
                    aria-hidden
                    className={cn(
                      "opacity-70 transition-transform duration-200",
                      moreOpen && "rotate-180"
                    )}
                  />
                </Action>

                {moreOpen ? (
                  <div
                    id="sidebar-more-menu"
                    role="group"
                    aria-label="More menu"
                    className="ml-4 flex flex-col gap-0.5 border-l border-[var(--aui-outline-soft)] pl-2"
                  >
                    {moreMenuItems.map((sub) => {
                      const isActive = activeMoreId === sub.id;
                      return (
                        <Action
                          key={sub.id}
                          type="button"
                          size="sm"
                          variant="flat"
                          onClick={() => goToMoreItem(sub.id)}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            navActionClass,
                            "!py-2",
                            isActive
                              ? "!bg-[var(--aui-nav-active-bg)] !text-[var(--aui-nav-active-text)]"
                              : "!text-[var(--aui-on-surface-soft)] hover:!bg-[var(--aui-nav-hover-bg)] hover:!text-[var(--aui-on-surface)]"
                          )}
                        >
                          <span className="leading-none">{sub.label}</span>
                        </Action>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          }

          const isActive =
            (item.id === "dashboard" && activeNavId === "dashboard") ||
            (item.id === "workorders" && activeNavId === "workorders");

          return (
            <Action
              key={item.id}
              type="button"
              size="sm"
              variant="flat"
              onClick={() => {
                if (item.id === "dashboard") goToDashboard();
                else if (item.id === "workorders") goToWorkorders();
              }}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                navActionClass,
                "!inline-flex !items-center",
                isActive
                  ? "!bg-[var(--aui-nav-active-bg)] !text-[var(--aui-nav-active-text)]"
                  : "!text-[var(--aui-on-surface-soft)] hover:!bg-[var(--aui-nav-hover-bg)] hover:!text-[var(--aui-on-surface)]"
              )}
            >
              <NavIcon
                iconName={item.iconName}
                iconSrc={item.iconSrc}
                weight={isActive ? "fill" : "regular"}
                className="!mr-2 shrink-0"
              />
              <span className="flex-1 leading-none">{item.label}</span>
            </Action>
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
          <Icon.Phosphor
            name="caret-double-left"
            size="small"
            weight="regular"
            aria-hidden
          />
        </Action>
      </div>
    </aside>
  );
}
