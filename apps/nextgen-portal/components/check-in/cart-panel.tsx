"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Action, Text } from "@asurion-core/mx-asurion-ui-react";
import { DeviceMobile, Minus, Plus, Tag, Trash, X } from "@phosphor-icons/react";
import { useCheckIn } from "@/lib/check-in-context";
import { searchParts } from "@/lib/check-in-data";
import type { PartSku, SavedDeviceRepair } from "@/lib/check-in-types";

// Mock valid codes → discount %
const VALID_CODES: Record<string, number> = {
  "SAVE10":  0.10,
  "SAVE20":  0.20,
  "VIP15":   0.15,
  "STAFF25": 0.25,
};

export function CartPanel() {
  const {
    cart,
    savedDeviceRepairs,
    discountCode,
    cartSubtotal,
    cartTax,
    device,
    addToCartBySku,
    addPartToCart,
    removeFromCart,
    setCartQty,
    setDiscountCode,
  } = useCheckIn();

  const [scanInput, setScanInput] = useState("");
  const [scanFeedback, setScanFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchResults = useMemo<PartSku[]>(() => {
    if (!scanInput.trim()) return [];
    return searchParts(scanInput, device.deviceType || undefined, device.make || undefined).slice(0, 8);
  }, [scanInput, device.deviceType, device.make]);

  useEffect(() => {
    setShowDropdown(searchResults.length > 0);
  }, [searchResults]);
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [draftCode, setDraftCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const scanRef = useRef<HTMLInputElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);

  function handleScanSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = scanInput.trim();
    if (!val) return;
    if (searchResults.length === 1) {
      addPartToCart({ sku: searchResults[0].sku, name: searchResults[0].name, price: searchResults[0].price });
      setScanFeedback({ msg: "Added to estimate", ok: true });
    } else {
      const found = addToCartBySku(val);
      setScanFeedback({ msg: found ? "Added to estimate" : "Item not found", ok: found });
    }
    setScanInput("");
    setShowDropdown(false);
    setTimeout(() => setScanFeedback(null), 2000);
    scanRef.current?.focus();
  }

  function handleSelectResult(part: PartSku) {
    addPartToCart({ sku: part.sku, name: part.name, price: part.price });
    setScanInput("");
    setShowDropdown(false);
    setScanFeedback({ msg: "Added to estimate", ok: true });
    setTimeout(() => setScanFeedback(null), 2000);
    scanRef.current?.focus();
  }

  function openDiscountInput() {
    setDraftCode("");
    setDiscountError("");
    setShowDiscountInput(true);
    setTimeout(() => discountRef.current?.focus(), 50);
  }

  function applyDiscount() {
    const code = draftCode.trim().toUpperCase();
    if (!code) { setDiscountError("Enter a discount code"); return; }
    if (!VALID_CODES[code]) { setDiscountError("Invalid or expired code"); return; }
    setDiscountCode(code);
    setShowDiscountInput(false);
    setDraftCode("");
    setDiscountError("");
  }

  function removeDiscount() {
    setDiscountCode("");
    setShowDiscountInput(false);
  }

  function cancelDiscount() {
    setShowDiscountInput(false);
    setDraftCode("");
    setDiscountError("");
  }

  const savedSubtotal = savedDeviceRepairs.reduce((s, r) => s + r.subtotal, 0);
  const allSubtotal = cartSubtotal + savedSubtotal;
  const discountRate = discountCode ? (VALID_CODES[discountCode.toUpperCase()] ?? 0) : 0;
  const discountAmount = allSubtotal * discountRate;
  const discountedSubtotal = allSubtotal - discountAmount;
  const tax = Math.round(discountedSubtotal * 0.0825 * 100) / 100;
  const total = discountedSubtotal + tax;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  return (
    <aside className="flex w-[26rem] shrink-0 flex-col border-l border-[var(--aui-outline-soft)] bg-[var(--aui-surface)]">
      {/* Header */}
      <div className="flex items-baseline justify-between px-4 pt-4 pb-2">
        <Text size={3} weight="heavy">Estimate</Text>
        <Text size={1} className="text-[var(--aui-on-surface-soft)]">
          {savedDeviceRepairs.length > 0
            ? `${savedDeviceRepairs.length + (cart.length > 0 ? 1 : 0)} device${savedDeviceRepairs.length + (cart.length > 0 ? 1 : 0) !== 1 ? "s" : ""}`
            : `${cart.reduce((s, c) => s + c.quantity, 0)} item${cart.reduce((s, c) => s + c.quantity, 0) !== 1 ? "s" : ""}`}
        </Text>
      </div>

      {/* Scan / search */}
      <form onSubmit={handleScanSubmit} className="relative px-4 pb-3">
        <input
          ref={scanRef}
          value={scanInput}
          onChange={(e) => setScanInput(e.target.value)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
          placeholder="Search or scan an item"
          className="w-full rounded-[var(--aui-border-radius-050)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface-variant)] px-3 py-2 text-sm text-[var(--aui-on-surface)] placeholder:text-[var(--aui-on-surface-soft)] focus:border-[var(--aui-brand-asurion-purple)] focus:outline-none"
        />
        {showDropdown && (
          <ul className="absolute left-4 right-4 z-50 mt-1 overflow-hidden rounded-[var(--aui-border-radius-050)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] shadow-lg">
            {searchResults.map((part) => (
              <li key={part.sku}>
                <button
                  type="button"
                  onMouseDown={() => handleSelectResult(part)}
                  className="flex w-full items-start justify-between gap-2 px-3 py-2.5 text-left hover:bg-[var(--aui-surface-variant)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--aui-on-surface)]">{part.name}</p>
                    <p className="text-xs text-[var(--aui-on-surface-soft)]">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(part.price)}
                    </p>
                  </div>
                  {part.isOem && (
                    <span className="shrink-0 self-center rounded bg-[var(--aui-primary-soft)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--aui-brand-asurion-purple)]">OEM</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
        {scanFeedback ? (
          <Text size={1} className={`mt-1 ${scanFeedback.ok ? "text-[var(--aui-accent-green)]" : "text-[var(--aui-accent-orange)]"}`}>
            {scanFeedback.msg}
          </Text>
        ) : null}
      </form>

      {/* Cart items */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Saved device repair cards */}
        {savedDeviceRepairs.map((repair) => (
          <SavedRepairCard key={repair.id} repair={repair} fmt={fmt} />
        ))}

        {cart.length === 0 && savedDeviceRepairs.length === 0 ? (
          <p className="px-4 py-2 text-sm text-[var(--aui-on-surface-soft)]">No items yet.</p>
        ) : cart.length === 0 ? null : (
          <ul className="flex flex-col divide-y divide-[var(--aui-outline-soft)]">
            {cart.map((item) => (
              <li key={item.id} className="flex items-start gap-2 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div><Text size={2} weight="heavy" className="leading-snug">{item.name}</Text></div>
                  <div><Text size={2} className="text-[var(--aui-on-surface)]">{fmt(item.price * item.quantity)}</Text></div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <button type="button" onClick={() => setCartQty(item.id, item.quantity - 1)}
                      className="flex size-6 items-center justify-center rounded-full border border-[var(--aui-outline-soft)] hover:bg-[var(--aui-surface-variant)]">
                      <Minus className="size-3" />
                    </button>
                    <Text size={2}>{item.quantity}</Text>
                    <button type="button" onClick={() => setCartQty(item.id, item.quantity + 1)}
                      className="flex size-6 items-center justify-center rounded-full border border-[var(--aui-outline-soft)] hover:bg-[var(--aui-surface-variant)]">
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
                <button type="button" onClick={() => removeFromCart(item.id)}
                  className="shrink-0 text-[var(--aui-on-surface-soft)] hover:text-[var(--aui-accent-orange)]">
                  <Trash className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Totals */}
      <div className="border-t border-[var(--aui-outline-soft)] px-4 py-4 flex flex-col gap-3">

        {/* Discount section */}
        {showDiscountInput ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-2">
              <input
                ref={discountRef}
                value={draftCode}
                onChange={(e) => { setDraftCode(e.target.value); setDiscountError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") applyDiscount(); if (e.key === "Escape") cancelDiscount(); }}
                placeholder="Enter code (e.g. SAVE10)"
                className="min-w-0 flex-1 rounded-[var(--aui-border-radius-050)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface-variant)] px-3 py-1.5 text-sm uppercase text-[var(--aui-on-surface)] placeholder:normal-case placeholder:text-[var(--aui-on-surface-soft)] focus:border-[var(--aui-brand-asurion-purple)] focus:outline-none"
              />
              <button type="button" onClick={cancelDiscount}
                className="rounded p-1.5 text-[var(--aui-on-surface-soft)] hover:bg-[var(--aui-surface-variant)]">
                <X className="size-4" />
              </button>
            </div>
            {discountError && (
              <Text size={1} className="text-[var(--aui-accent-orange)]">{discountError}</Text>
            )}
            <Action type="button" size="sm" variant="filled" onClick={applyDiscount}>
              Apply code
            </Action>
          </div>
        ) : discountCode ? (
          <div className="flex items-center justify-between rounded-[var(--aui-border-radius-050)] bg-[var(--aui-primary-soft)] px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Tag className="size-3.5 text-[var(--aui-brand-asurion-purple)]" />
              <Text size={1} weight="heavy" className="text-[var(--aui-brand-asurion-purple)]">
                {discountCode} — {Math.round(discountRate * 100)}% off
              </Text>
            </div>
            <button type="button" onClick={removeDiscount}
              className="text-[var(--aui-brand-asurion-purple)] hover:opacity-70">
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <button type="button" onClick={openDiscountInput}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--aui-brand-asurion-purple)] hover:opacity-80">
            <Tag className="size-4" />
            Apply discount
          </button>
        )}

        {/* Line items */}
        <div className="flex flex-col gap-1">
          <Row label="Subtotal" value={fmt(allSubtotal)} />
          {discountAmount > 0 && (
            <Row label={`Discount (${Math.round(discountRate * 100)}%)`} value={`−${fmt(discountAmount)}`} accent />
          )}
          <Row label="Tax (8.25%)" value={fmt(tax)} />
          <div className="mt-1 border-t border-[var(--aui-outline-soft)] pt-2">
            <Row label="Total" value={fmt(total)} bold />
          </div>
        </div>
      </div>
    </aside>
  );
}

function SavedRepairCard({ repair, fmt }: { repair: SavedDeviceRepair; fmt: (n: number) => string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mx-3 mb-3 rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface-variant)]">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left"
      >
        <DeviceMobile className="mt-0.5 size-4 shrink-0 text-[var(--aui-brand-asurion-purple)]" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-snug text-[var(--aui-on-surface)]">{repair.makeModel}</p>
          {repair.imei && (
            <p className="text-xs text-[var(--aui-on-surface-soft)]">IMEI: {repair.imei}</p>
          )}
          <p className="text-xs text-[var(--aui-on-surface-soft)]">{repair.workOrderId}</p>
        </div>
        <p className="shrink-0 text-sm font-bold text-[var(--aui-on-surface)]">{fmt(repair.subtotal)}</p>
      </button>
      {expanded && repair.cart.length > 0 && (
        <ul className="border-t border-[var(--aui-outline-soft)] px-3 py-2 flex flex-col gap-1.5">
          {repair.cart.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate text-xs text-[var(--aui-on-surface-soft)]">
                {item.quantity > 1 ? `${item.quantity}× ` : ""}{item.name}
              </p>
              <p className="shrink-0 text-xs text-[var(--aui-on-surface-soft)]">
                {fmt(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <Text size={2} weight={bold ? "heavy" : undefined}
        className={accent ? "text-[var(--aui-accent-green)]" : undefined}>
        {label}
      </Text>
      <Text size={2} weight={bold ? "heavy" : undefined}
        className={accent ? "text-[var(--aui-accent-green)]" : undefined}>
        {value}
      </Text>
    </div>
  );
}
