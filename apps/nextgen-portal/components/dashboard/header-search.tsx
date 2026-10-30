"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Action, Icon, Text, TextField } from "@asurion-core/mx-asurion-ui-react";
import {
  searchCustomers,
  type CustomerSearchResult,
} from "@/lib/check-in-data";
import { useAppNavigation } from "@/lib/app-navigation";
import { cn } from "@/lib/utils";

export function HeaderSearch({ disabled }: { disabled?: boolean }) {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const { goToCustomerProfile } = useAppNavigation();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => searchCustomers(query), [query]);
  const individuals = results.filter((r) => r.type === "individual");
  const businesses = results.filter((r) => r.type === "business");
  const flatResults = useMemo(
    () => [...individuals, ...businesses],
    [individuals, businesses]
  );
  const searched = query.trim().length >= 2;

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        close();
      }
    }

    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }

  function openSearch() {
    setOpen(true);
  }

  function selectResult(result: CustomerSearchResult) {
    if (result.type === "individual") {
      goToCustomerProfile({ type: "individual", id: result.customer.id });
    } else {
      goToCustomerProfile({ type: "business", id: result.business.id });
    }
    close();
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (flatResults.length === 0) return;
      setActiveIndex((i) => (i + 1) % flatResults.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (flatResults.length === 0) return;
      setActiveIndex((i) => (i - 1 + flatResults.length) % flatResults.length);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const hit = flatResults[activeIndex];
      if (hit) selectResult(hit);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <Action
        type="button"
        size="sm"
        variant="flat"
        aria-label="Search customers"
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        className={`!inline-flex !items-center !justify-start !gap-2 !px-3 ![text-decoration:none] [&_span]:[text-decoration:none] disabled:cursor-not-allowed ${disabled ? "!opacity-40" : ""}`}
        onClick={() => !disabled && (open ? close() : openSearch())}
      >
        <Icon.Phosphor
          name="magnifying-glass"
          size="small"
          aria-hidden
          className="!mr-2 !block shrink-0"
        />
        <span className="leading-none">Search</span>
      </Action>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Customer search"
          className={cn(
            "absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(28rem,calc(100vw-2rem))]",
            "overflow-hidden rounded-[var(--aui-border-radius-100)]",
            "border border-[var(--aui-outline-soft)] bg-[var(--aui-elevated-level-03)]",
            "shadow-[0_8px_28px_0_var(--aui-fills-drop-shadow)]"
          )}
        >
          <div className="border-b border-[var(--aui-outline-soft)] p-[var(--aui-spacing-200)]">
            <TextField
              label="Search customers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Name, phone, business, or address…"
              className="w-full"
              autoFocus
            />
            <Text
              size={1}
              className="mt-[var(--aui-spacing-100)] text-[var(--aui-on-surface-soft)]"
            >
              Try Jordan, 555-0142, Brightside, or Congress Ave
            </Text>
          </div>

          <div className="max-h-[22rem] overflow-y-auto p-[var(--aui-spacing-100)]">
            {!searched ? (
              <div className="px-[var(--aui-spacing-200)] py-[var(--aui-spacing-300)]">
                <Text size={2} className="text-[var(--aui-on-surface-soft)]">
                  Search by customer name, phone number, business name, or
                  address.
                </Text>
              </div>
            ) : null}

            {searched && flatResults.length === 0 ? (
              <div className="px-[var(--aui-spacing-200)] py-[var(--aui-spacing-300)]">
                <Text size={2} weight="heavy">
                  No customers found
                </Text>
                <Text
                  size={2}
                  className="mt-1 text-[var(--aui-on-surface-soft)] text-pretty"
                >
                  Check the spelling, or try a phone number or street name.
                </Text>
              </div>
            ) : null}

            {individuals.length > 0 ? (
              <ResultGroup title="Individuals">
                {individuals.map((r) => {
                  if (r.type !== "individual") return null;
                  const index = flatResults.indexOf(r);
                  return (
                    <ResultRow
                      key={r.customer.id}
                      active={index === activeIndex}
                      title={r.customer.name}
                      subtitle={`${r.customer.primaryPhone} · ${r.customer.email}`}
                      badge="Individual"
                      onClick={() => selectResult(r)}
                      onMouseEnter={() => setActiveIndex(index)}
                    />
                  );
                })}
              </ResultGroup>
            ) : null}

            {businesses.length > 0 ? (
              <ResultGroup title="Businesses">
                {businesses.map((r) => {
                  if (r.type !== "business") return null;
                  const index = flatResults.indexOf(r);
                  return (
                    <ResultRow
                      key={r.business.id}
                      active={index === activeIndex}
                      title={r.business.name}
                      subtitle={r.business.address}
                      badge="Business"
                      onClick={() => selectResult(r)}
                      onMouseEnter={() => setActiveIndex(index)}
                    />
                  );
                })}
              </ResultGroup>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ResultGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-[var(--aui-spacing-100)] last:mb-0">
      <Text
        size={1}
        weight="heavy"
        className="px-[var(--aui-spacing-200)] py-[var(--aui-spacing-100)] uppercase tracking-wide text-[var(--aui-on-surface-soft)]"
      >
        {title}
      </Text>
      <ul>{children}</ul>
    </section>
  );
}

function ResultRow({
  title,
  subtitle,
  badge,
  active,
  onClick,
  onMouseEnter,
}: {
  title: string;
  subtitle: string;
  badge: string;
  active: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className={cn(
          "flex w-full items-start gap-[var(--aui-spacing-150)] rounded-[var(--aui-border-radius-050)] px-[var(--aui-spacing-200)] py-[var(--aui-spacing-150)] text-left transition-colors",
          active
            ? "bg-[var(--aui-primary-soft)]"
            : "hover:bg-[var(--aui-surface-variant)]"
        )}
      >
        <span className="min-w-0 flex-1">
          <Text size={2} weight="heavy" className="truncate">
            {title}
          </Text>
          <Text
            size={1}
            className="truncate text-[var(--aui-on-surface-soft)]"
          >
            {subtitle}
          </Text>
        </span>
        <span className="shrink-0 rounded-full bg-[var(--aui-surface-variant)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--aui-on-surface-soft)]">
          {badge}
        </span>
      </button>
    </li>
  );
}
