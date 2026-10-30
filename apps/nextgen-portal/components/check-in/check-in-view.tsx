"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Action,
  AlertBanner,
  Checkbox,
  Datepicker,
  Dropdown,
  ManualSelectionChips,
  PredictiveTextField,
  Tag,
  Text,
  Textarea,
  TextField,
} from "@asurion-core/mx-asurion-ui-react";
import {
  ArrowRight,
  Barcode,
  BellSimple,
  CalendarCheck,
  Camera,
  Check,
  CheckCircle,
  Clock,
  DeviceMobileCamera,
  Image,
  MagnifyingGlass,
  Microphone,
  PencilSimple,
  Phone,
  Shield,
  Sparkle,
  Spinner,
  ThumbsDown,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  searchCustomers,
  DEVICE_ISSUES,
  getEligibleProtectionOffers,
  getEnrolledProtectionOffer,
  lookupWarranty,
  suggestedParts,
} from "@/lib/check-in-data";
import { inputDateToDate, dateToInputDate } from "@/lib/aui-date";
import { CheckInProvider, useCheckIn } from "@/lib/check-in-context";
import { CartPanel } from "@/components/check-in/cart-panel";
import { CustomerProfileModal } from "@/components/check-in/customer-profile-modal";
import { ProtectionOffersSection } from "@/components/customer/protection-offer-banner";
import { AuiModal } from "@/components/aui/aui-modal";
import { cn } from "@/lib/utils";

// ── Symptom codes (AI mock data) ─────────────────────────────────────────────

type SymptomCode = { id: string; code: string; label: string };

const SYMPTOM_CODES: SymptomCode[] = [
  { id: "lcd-001", code: "LCD-001", label: "LCD / display damage" },
  { id: "bat-002", code: "BAT-002", label: "Battery degradation" },
  { id: "chg-003", code: "CHG-003", label: "Charging system failure" },
  { id: "cam-004", code: "CAM-004", label: "Camera module fault" },
  { id: "pwr-005", code: "PWR-005", label: "Power management fault" },
  { id: "liq-006", code: "LIQ-006", label: "Liquid ingress damage" },
  { id: "gls-007", code: "GLS-007", label: "Glass / cover damage" },
  { id: "spk-008", code: "SPK-008", label: "Speaker / mic failure" },
  { id: "sw-009",  code: "SW-009",  label: "Software / firmware issue" },
  { id: "sim-010", code: "SIM-010", label: "SIM not recognized / can't read" },
  { id: "loc-011", code: "LOC-011", label: "Location display inaccurate" },
  { id: "sig-012", code: "SIG-012", label: "Weak signal / poor coverage" },
  { id: "btn-013", code: "BTN-013", label: "Physical button failure" },
  { id: "vib-014", code: "VIB-014", label: "Vibration motor not working" },
  { id: "fng-015", code: "FNG-015", label: "Fingerprint sensor failure" },
  { id: "fid-016", code: "FID-016", label: "Face ID / facial recognition failure" },
  { id: "nfc-017", code: "NFC-017", label: "NFC not working" },
  { id: "wif-018", code: "WIF-018", label: "Wi-Fi connectivity issue" },
  { id: "bt-019",  code: "BT-019",  label: "Bluetooth not connecting" },
];


const DROPOFF_ACCESSORIES = [
  { id: "sim-tray", label: "SIM tray" },
  { id: "sim-card", label: "SIM card" },
  { id: "case",     label: "Case" },
  { id: "charger",  label: "Charger" },
];

// Popular devices for make/model quick-pick combobox
const POPULAR_DEVICES = [
  { make: "Apple iPhone 16 Pro Max", group: "Apple" },
  { make: "Apple iPhone 16 Pro",     group: "Apple" },
  { make: "Apple iPhone 16",         group: "Apple" },
  { make: "Apple iPhone 15 Pro",     group: "Apple" },
  { make: "Apple iPhone 15",         group: "Apple" },
  { make: "Apple iPhone 14",         group: "Apple" },
  { make: "Apple iPhone SE (3rd)",   group: "Apple" },
  { make: "Samsung Galaxy S25 Ultra",group: "Samsung" },
  { make: "Samsung Galaxy S25+",     group: "Samsung" },
  { make: "Samsung Galaxy S25",      group: "Samsung" },
  { make: "Samsung Galaxy S24 Ultra",group: "Samsung" },
  { make: "Samsung Galaxy Z Flip 6", group: "Samsung" },
  { make: "Google Pixel 9 Pro",      group: "Google" },
  { make: "Google Pixel 9",          group: "Google" },
  { make: "Apple iPad Pro 13\"",     group: "Apple" },
  { make: "Apple iPad Air",          group: "Apple" },
  { make: "Apple MacBook Pro",       group: "Apple" },
  { make: "Apple MacBook Air",       group: "Apple" },
];

const TIME_DROPDOWN_OPTIONS = [
  "8:00 am","9:00 am","10:00 am","11:00 am","12:00 pm",
  "1:00 pm","2:00 pm","3:00 pm","4:00 pm","5:00 pm","6:00 pm","7:00 pm","8:00 pm",
].map((t) => ({ name: t, value: t }));

const ADDRESS_SUGGESTIONS = [
  { street: "123 Congress Ave", city: "Austin", state: "TX", zip: "78701" },
  { street: "456 Lamar Blvd", city: "Austin", state: "TX", zip: "78703" },
  { street: "789 South Lamar Blvd", city: "Austin", state: "TX", zip: "78704" },
  { street: "1010 Barton Springs Rd", city: "Austin", state: "TX", zip: "78704" },
  { street: "2200 Guadalupe St", city: "Austin", state: "TX", zip: "78705" },
  { street: "3300 Speedway", city: "Austin", state: "TX", zip: "78705" },
  { street: "4400 Burnet Rd", city: "Austin", state: "TX", zip: "78756" },
  { street: "5500 Airport Blvd", city: "Austin", state: "TX", zip: "78751" },
  { street: "6601 N Lamar Blvd", city: "Austin", state: "TX", zip: "78752" },
  { street: "7700 Manchaca Rd", city: "Austin", state: "TX", zip: "78745" },
  { street: "8800 Research Blvd", city: "Austin", state: "TX", zip: "78758" },
  { street: "9901 Capital of Texas Hwy", city: "Austin", state: "TX", zip: "78759" },
  { street: "100 Red River St", city: "Austin", state: "TX", zip: "78701" },
  { street: "200 E 6th St", city: "Austin", state: "TX", zip: "78701" },
  { street: "350 W 2nd St", city: "Austin", state: "TX", zip: "78701" },
  { street: "500 E Oltorf St", city: "Austin", state: "TX", zip: "78704" },
  { street: "1500 S 1st St", city: "Austin", state: "TX", zip: "78704" },
  { street: "2500 W Anderson Ln", city: "Austin", state: "TX", zip: "78757" },
  { street: "3500 Bee Cave Rd", city: "West Lake Hills", state: "TX", zip: "78746" },
  { street: "4500 N Lamar Blvd", city: "Austin", state: "TX", zip: "78751" },
].map((a, i) => ({
  id: String(i),
  header: a.street,
  subHeader: `${a.city}, ${a.state} ${a.zip}`,
  value: `${a.street}, ${a.city}, ${a.state} ${a.zip}`,
}));

function searchAddresses(query: string) {
  if (query.trim().length < 2) return [];
  const q = query.toLowerCase();
  return ADDRESS_SUGGESTIONS.filter(
    (a) => a.header.toLowerCase().includes(q) || a.subHeader.toLowerCase().includes(q) || a.value.toLowerCase().includes(q)
  ).slice(0, 6);
}

// ── Root ─────────────────────────────────────────────────────────────────────

// ── Keyboard shortcuts ────────────────────────────────────────────────────────

const SHORTCUTS = [
  { keys: ["Enter"], description: "Advance to next field" },
  { keys: ["⌘", "Enter"], description: "Submit / Continue current step" },
  { keys: ["Tab"], description: "Move to next field" },
  { keys: ["Shift", "Tab"], description: "Move to previous field" },
  { keys: ["Esc"], description: "Close dropdown or overlay" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
];

function ShortcutsHelp({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-[var(--aui-border-radius-100)] bg-[var(--aui-surface)] p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <Text size={3} weight="heavy">Keyboard shortcuts</Text>
          <button type="button" onClick={onClose} className="rounded p-1 hover:bg-[var(--aui-surface-variant)]">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {SHORTCUTS.map((s) => (
            <div key={s.description} className="flex items-center justify-between gap-4">
              <Text size={2} className="text-[var(--aui-on-surface-soft)]">{s.description}</Text>
              <div className="flex shrink-0 items-center gap-1">
                {s.keys.map((k) => (
                  <kbd key={k} className="rounded border border-[var(--aui-outline-soft)] bg-[var(--aui-surface-variant)] px-2 py-0.5 font-mono text-xs">
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function useKeyboardNav(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    function getFocusableInputs(): HTMLElement[] {
      if (!containerRef.current) return [];
      // Only inputs/textareas in the currently active (expanded) step
      const activeStep = containerRef.current.querySelector(".animate-step-expand");
      const scope = activeStep ?? containerRef.current;
      return Array.from(
        scope.querySelectorAll<HTMLElement>("input:not([type=file]):not([disabled]), textarea:not([disabled]), button:not([disabled])")
      ).filter((el) => {
        const style = window.getComputedStyle(el);
        return style.display !== "none" && style.visibility !== "hidden" && el.offsetParent !== null;
      });
    }

    function getContinueButton(): HTMLButtonElement | null {
      if (!containerRef.current) return null;
      const activeStep = containerRef.current.querySelector(".animate-step-expand");
      if (!activeStep) return null;
      return Array.from(activeStep.querySelectorAll<HTMLButtonElement>("button:not([disabled])"))
        .find((b) => b.textContent?.trim() === "Continue") ?? null;
    }

    function handler(e: KeyboardEvent) {
      const active = document.activeElement as HTMLElement | null;
      const isMeta = e.metaKey || e.ctrlKey;

      // ? → show help (only when not typing in an input)
      if (e.key === "?" && active?.tagName !== "INPUT" && active?.tagName !== "TEXTAREA") {
        setShowHelp((v) => !v);
        return;
      }

      // Escape → close help or active dropdown
      if (e.key === "Escape") {
        setShowHelp(false);
        return;
      }

      // Cmd/Ctrl+Enter → click the active step's Continue button
      if (e.key === "Enter" && isMeta) {
        e.preventDefault();
        getContinueButton()?.click();
        return;
      }

      // Enter in a text input → advance to next field
      if (e.key === "Enter" && active?.tagName === "INPUT" && !isMeta) {
        e.preventDefault();
        const focusable = getFocusableInputs();
        const idx = focusable.indexOf(active);
        const next = focusable[idx + 1];
        if (next) {
          next.focus();
        } else {
          getContinueButton()?.click();
        }
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [containerRef]);

  return { showHelp, setShowHelp };
}

export function CheckInView() {
  return (
    <CheckInProvider>
      <CheckInViewInner />
    </CheckInProvider>
  );
}

function CheckInViewInner() {
  const { showProfileModal, checkInComplete, workOrderId, savedDeviceRepairs, reset, device } = useCheckIn();
  const containerRef = useRef<HTMLDivElement>(null);
  const { showHelp, setShowHelp } = useKeyboardNav(containerRef);

  if (checkInComplete) {
    return <CheckInComplete workOrderId={workOrderId} savedDeviceRepairs={savedDeviceRepairs} onReset={reset} />;
  }

  return (
    <div className="flex h-full">
      <div ref={containerRef} className="min-w-0 flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Text as="h1" size={5} weight="heavy">Check-in</Text>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHelp(true)}
              title="Keyboard shortcuts (?)"
              className="flex size-7 items-center justify-center rounded-full border border-[var(--aui-outline-soft)] text-[var(--aui-on-surface-soft)] transition-colors hover:border-[var(--aui-brand-asurion-purple)] hover:text-[var(--aui-brand-asurion-purple)]"
            >
              <span className="text-xs font-bold">?</span>
            </button>
            <SaveDraftButton />
            <CancelCheckInButton />
          </div>
        </div>
        <div className="flex flex-col divide-y divide-[var(--aui-outline-soft)] rounded-[var(--aui-border-radius-100)] bg-[var(--aui-surface)] shadow-[var(--aui-fills-drop-shadow)]">
          <Step1 />
          <Step2 key={device.id} />
          <Step3 key={`s3-${device.id}`} />
          <Step4 key={`s4-${device.id}`} />
        </div>
      </div>
      <CartPanel />
      {showProfileModal ? <CustomerProfileModal /> : null}
      {showHelp && <ShortcutsHelp onClose={() => setShowHelp(false)} />}
    </div>
  );
}

// ── Start over ────────────────────────────────────────────────────────────────

function StartOverButton() {
  const { reset, stepsComplete } = useCheckIn();
  const [confirming, setConfirming] = useState(false);
  if (!stepsComplete.some(Boolean)) return null;

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <Text size={1} className="text-[var(--aui-on-surface-soft)]">Start over?</Text>
        <Action type="button" variant="filled" size="sm"
          onClick={() => { reset(); setConfirming(false); }}>
          Yes, clear all
        </Action>
        <Action type="button" variant="outline" size="sm"
          onClick={() => setConfirming(false)}>
          Cancel
        </Action>
      </div>
    );
  }
  return (
    <Action type="button" variant="outline" size="sm"
      onClick={() => setConfirming(true)}>
      Start over
    </Action>
  );
}

function SaveDraftButton() {
  const { stepsComplete } = useCheckIn();
  const [saved, setSaved] = useState(false);
  if (!stepsComplete.some(Boolean)) return null;
  if (saved) {
    return (
      <div className="flex items-center gap-1 text-[var(--aui-accent-green)]">
        <Check className="size-4" />
        <Text size={1} weight="heavy" className="text-[var(--aui-accent-green)]">Saved</Text>
      </div>
    );
  }
  return (
    <Action type="button" variant="outline" size="sm" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
      Save draft
    </Action>
  );
}

function CancelCheckInButton() {
  const { reset, stepsComplete } = useCheckIn();
  const [confirming, setConfirming] = useState(false);
  if (!stepsComplete.some(Boolean)) return null;
  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <Text size={1} className="text-[var(--aui-on-surface-soft)]">Cancel check-in?</Text>
        <Action type="button" variant="filled" size="sm" onClick={() => { reset(); setConfirming(false); }}>
          Yes, cancel
        </Action>
        <Action type="button" variant="outline" size="sm" onClick={() => setConfirming(false)}>
          Keep going
        </Action>
      </div>
    );
  }
  return (
    <Action type="button" variant="outline" size="sm" onClick={() => setConfirming(true)}>
      Cancel
    </Action>
  );
}

// ── Step shell ────────────────────────────────────────────────────────────────

function StepHeader({ number, label, status, loading, onEdit }: {
  number: number; label: string;
  status: "pending" | "active" | "complete";
  loading?: boolean;
  onEdit?: () => void;
}) {
  return (
    <div className="flex w-full items-center gap-3 px-5 py-4">
      <StepIndicator status={status} number={number} loading={loading} />
      <Text size={3} weight={status === "active" ? "heavy" : undefined}
        className={cn("flex-1", status === "pending" ? "text-[var(--aui-on-surface-soft)]" : undefined)}>
        {label}
      </Text>
      {loading && (
        <Text size={1} className="text-[var(--aui-on-surface-soft)]">Analyzing photos…</Text>
      )}
      {status === "complete" && onEdit ? (
        <Action type="button" variant="flat" size="sm" onClick={onEdit}>
          <PencilSimple className="size-4" />
        </Action>
      ) : null}
    </div>
  );
}

function StepIndicator({ status, number, loading }: { status: "pending" | "active" | "complete"; number: number; loading?: boolean }) {
  if (status === "complete") {
    return (
      <span className="animate-indicator-pop flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--aui-brand-asurion-purple)]">
        <Check className="size-4 text-white" weight="bold" />
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="animate-indicator-pop flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--aui-on-surface)]">
        <ArrowRight className="size-4 text-[var(--aui-surface)]" weight="bold" />
      </span>
    );
  }
  if (loading) {
    return (
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-[var(--aui-brand-asurion-purple)]">
        <Spinner className="size-4 animate-spin text-[var(--aui-brand-asurion-purple)]" />
      </span>
    );
  }
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-[var(--aui-outline-soft)]">
      <Text size={1} className="text-[var(--aui-on-surface-soft)]">{number}</Text>
    </span>
  );
}

function getStatus(idx: number, activeStep: number, done: boolean[]): "pending" | "active" | "complete" {
  if (activeStep === idx + 1) return "active";
  if (done[idx]) return "complete";
  return "pending";
}

function IssueChip({ label }: { label: string }) {
  return (
    <span className="rounded-[var(--aui-border-radius-050)] bg-[var(--aui-surface-variant)] px-3 py-1 text-sm font-medium">
      {label}
    </span>
  );
}

// ── Step 1: Customer info ─────────────────────────────────────────────────────

function Step1() {
  const {
    activeStep, stepsComplete, individual, business, appointment,
    searchQuery, setSearchQuery, openProfileModal,
    newCustomerDraft, updateNewCustomerDraft, confirmNewCustomer,
    editStep,
  } = useCheckIn();

  const status = getStatus(0, activeStep, stepsComplete);
  const results = useMemo(() => searchCustomers(searchQuery), [searchQuery]);
  const searched = searchQuery.trim().length >= 2;
  const newCanContinue = !!(newCustomerDraft.firstName && newCustomerDraft.lastName && newCustomerDraft.phone);
  const enrolledOffer = individual
    ? getEnrolledProtectionOffer(individual)
    : undefined;
  const eligibleOffers = individual
    ? getEligibleProtectionOffers(individual)
    : [];

  return (
    <div>
      <StepHeader number={1} label="Customer" status={status} onEdit={() => editStep(1)} />

      {status === "complete" ? (
        <div className="animate-step-summary-in px-5 pb-4 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Text size={2} weight="heavy">{individual?.name ?? business?.name}</Text>
            <Text size={1} className="text-[var(--aui-on-surface-soft)]">{individual?.primaryPhone ?? business?.phone}</Text>
            {appointment ? (
              <div className="flex items-start gap-2 border-l-2 border-[var(--aui-outline-soft)] pl-2 py-0.5">
                <CalendarCheck className="size-3.5 mt-0.5 shrink-0 text-[var(--aui-on-surface-soft)]" />
                <Text size={1} className="text-[var(--aui-on-surface-soft)]">
                  {(() => {
                    const d = appointment.devices[0];
                    if (!d) return `Appt: ${appointment.label}`;
                    const device = `${d.make} ${d.model}`.trim();
                    const issue = d.issueIds.map((id) => DEVICE_ISSUES.find((i) => i.id === id)?.label ?? id).join(", ");
                    return `${device}${issue ? ` — ${issue}` : ""}`;
                  })()}
                </Text>
              </div>
            ) : null}
          </div>
          {individual ? (
            <ProtectionOffersSection
              enrolled={enrolledOffer}
              eligible={eligibleOffers}
            />
          ) : null}
        </div>
      ) : status === "active" ? (
        <div className="px-5 pb-5 flex flex-col gap-5 animate-step-expand">
          {/* Find existing */}
          <div className="flex flex-col gap-2">

            <div className="relative">
              <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--aui-on-surface-soft)]" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[var(--aui-on-surface-soft)] hover:text-[var(--aui-on-surface)] transition-colors"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
              <TextField label="Search by phone, customer, or business name" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by phone number, customer, or business name"
                className="[&_input]:pl-9 [&_input]:pr-9" autoFocus />
            </div>
            {searched && results.length > 0 ? (
              <ul className="divide-y divide-[var(--aui-outline-soft)] overflow-hidden rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)]">
                {results.map((r) => {
                  const title = r.type === "individual" ? r.customer.name : r.business.name;
                  const q = searchQuery.trim().toLowerCase();
                  const phone = r.type === "individual" ? r.customer.primaryPhone : r.business.phone;
                  const address = r.type === "business" ? r.business.address : undefined;
                  const c = r.type === "individual" ? r.customer : r.business;
                  const highlight = (text: string) => {
                    if (!q) return <>{text}</>;
                    const idx = text.toLowerCase().indexOf(q.toLowerCase());
                    if (idx === -1) return <>{text}</>;
                    return <>{text.slice(0, idx)}<mark className="bg-[var(--aui-primary-soft)] text-[var(--aui-on-surface)] rounded-sm px-0.5">{text.slice(idx, idx + q.length)}</mark>{text.slice(idx + q.length)}</>;
                  };
                  return (
                    <li key={r.type === "individual" ? r.customer.id : r.business.id}>
                      <button type="button" onClick={() => openProfileModal(c)}
                        className="flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition-colors hover:bg-[var(--aui-surface-variant)]">
                        <Text size={2} weight="heavy">{highlight(title)}</Text>
                        {phone && <Text size={1} className="text-[var(--aui-on-surface-soft)]">{highlight(phone)}</Text>}
                        {address && <Text size={1} className="text-[var(--aui-on-surface-soft)]">{highlight(address)}</Text>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : searched ? (
              <Text size={1} className="text-[var(--aui-on-surface-soft)]">No matches found.</Text>
            ) : null}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-[var(--aui-outline-soft)]" />
            <Text size={1} className="text-[var(--aui-on-surface-soft)]">or create a new customer</Text>
            <span className="h-px flex-1 bg-[var(--aui-outline-soft)]" />
          </div>

          {/* New customer */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="min-w-0 flex-1">
                <TextField label="First name" value={newCustomerDraft.firstName}
                  onChange={(e) => updateNewCustomerDraft({ firstName: e.target.value })}
                  className="w-full" />
              </div>
              <div className="min-w-0 flex-1">
                <TextField label="Last name" value={newCustomerDraft.lastName}
                  onChange={(e) => updateNewCustomerDraft({ lastName: e.target.value })}
                  className="w-full" />
              </div>
            </div>
            <TextField label="Phone number" value={newCustomerDraft.phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                let formatted = digits;
                if (digits.length > 6) formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
                else if (digits.length > 3) formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                else if (digits.length > 0) formatted = `(${digits}`;
                updateNewCustomerDraft({ phone: formatted });
              }} />
            <div>
              <Action type="button" disabled={!newCanContinue} onClick={confirmNewCustomer}>
                Continue
              </Action>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ── Step 2: Device info ───────────────────────────────────────────────────────

// Simulated make/model suggestions from a device photo
const PHOTO_IDENTIFIED_MAKES = [
  "Apple iPhone 15 Pro",
  "Apple iPhone 15",
  "Apple iPhone 14 Pro",
];

// Simulated physical damage IDs detected from photo analysis (matching PHYSICAL_DAMAGE_OPTIONS ids)
const PHOTO_DETECTED_DAMAGE_IDS = ["phys-screen", "phys-frame"];

function Step2() {
  const { activeStep, stepsComplete, device, updateDevice, setMediaCount, setPhotoDamageIds, confirmDevice, editStep } = useCheckIn();
  const status = getStatus(1, activeStep, stepsComplete);
  const [showDevicePicker, setShowDevicePicker] = useState(false);
  const [mediaItems, setMediaItems] = useState<{ id: string; dataUrl: string; isVideo: boolean }[]>([]);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [photoSuggestions, setPhotoSuggestions] = useState<string[]>([]);
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [imeiFromPhoto, setImeiFromPhoto] = useState(false);

  const wasPrefilled = useRef(!!device.make);
  const stepBodyRef = useRef<HTMLDivElement>(null);
  const pickerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMediaCount(mediaItems.length); }, [mediaItems.length, setMediaCount]);

  useEffect(() => {
    if (status === "active") {
      stepBodyRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [status]);

  // Close picker on outside click
  useEffect(() => {
    if (!showDevicePicker) return;
    function handler(e: MouseEvent) {
      if (!pickerContainerRef.current?.contains(e.target as Node)) setShowDevicePicker(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDevicePicker]);

  const filteredDevices = useMemo(() => {
    const suggestions = photoSuggestions.length > 0
      ? POPULAR_DEVICES.filter((d) => photoSuggestions.some((s) => d.make.startsWith(s.split(" ").slice(0, 2).join(" "))))
      : [];
    const q = device.make.trim().toLowerCase();
    const rest = q
      ? POPULAR_DEVICES.filter((d) => d.make.toLowerCase().includes(q))
      : POPULAR_DEVICES;
    // Photo suggestions first, no duplicates
    const seenMakes = new Set(suggestions.map((d) => d.make));
    return [...suggestions, ...rest.filter((d) => !seenMakes.has(d.make))];
  }, [device.make, photoSuggestions]);

  const handleMediaUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const isVideo = file.type.startsWith("video/");
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setMediaItems((prev) => {
        const next = [...prev, { id, dataUrl, isVideo }];
        if (next.length === 1 && photoSuggestions.length === 0 && !isIdentifying) {
          setIsIdentifying(true);
          setTimeout(() => {
            setPhotoSuggestions(PHOTO_IDENTIFIED_MAKES);
            setIsIdentifying(false);
            setPhotoDamageIds(PHOTO_DETECTED_DAMAGE_IDS);
          }, 1800);
        }
        return next;
      });
      // OCR: scan for IMEI if the field is currently empty and not in serial mode
      if (!isVideo && !isOcrScanning) {
        setIsOcrScanning(true);
        setTimeout(() => {
          setIsOcrScanning(false);
          updateDevice({ imei: "353012345678901" });
          setImeiFromPhoto(true);
        }, 2200);
      }
    };
    reader.readAsDataURL(file);
  }, [photoSuggestions, isIdentifying, isOcrScanning, updateDevice, setPhotoDamageIds]);

  const identifier = device.imei;
  const warranty = useMemo(() => {
    if (!identifier || identifier.replace(/\D/g, "").length < 4) return null;
    return lookupWarranty(identifier, device.deviceType);
  }, [identifier, device.deviceType]);

  const completedWarranty = useMemo(() => {
    const id = device.imei || device.serial;
    if (!id || id.replace(/\D/g, "").length < 4) return null;
    return lookupWarranty(id, device.deviceType);
  }, [device.imei, device.serial, device.deviceType]);

  const canContinue = Boolean(device.make);

  const makeLC = device.make.toLowerCase();
  const isAppleIphone = makeLC.includes("iphone");
  const isGoogle = makeLC.startsWith("google");
  const isSamsung = makeLC.includes("samsung");
  const supportsOemWarranty = isGoogle || isSamsung;
  const isNonMobile = /ipad|macbook|imac|mac mini|mac pro|surface|chromebook|playstation|xbox|nintendo|galaxy tab|pixel tablet|laptop|tablet|computer/i.test(device.make);

  return (
    <div>
      <StepHeader number={2} label="Device" status={status} onEdit={() => editStep(2)} />

      {status === "complete" ? (
        <div className="animate-step-summary-in px-5 pb-4 flex flex-col gap-1">
          <Text size={2} weight="heavy">{device.make}</Text>
          {device.imei
            ? <Text size={1} className="text-[var(--aui-on-surface-soft)]">IMEI: {device.imei}</Text>
            : device.serial
              ? <Text size={1} className="text-[var(--aui-on-surface-soft)]">S/N: {device.serial}</Text>
              : null}
          {supportsOemWarranty && completedWarranty?.expiresOn ? (() => {
            const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
            return (
              <div className="flex items-center gap-2 border-l-2 border-[var(--aui-outline-soft)] pl-2 py-0.5">
                <Shield className="size-3.5 shrink-0 text-[var(--aui-on-surface-soft)]" />
                <Text size={1} className="text-[var(--aui-on-surface-soft)]">
                  Warranty ends {fmt(completedWarranty.expiresOn)}
                </Text>
              </div>
            );
          })() : null}
          {isAppleIphone && (
            <div className="flex items-start gap-2 border-l-2 border-[var(--aui-accent-orange)] pl-2 py-0.5">
              <BellSimple className="size-3.5 mt-0.5 shrink-0 text-[var(--aui-accent-orange)]" />
              <Text size={1} className="text-[var(--aui-accent-orange)]">
                <strong>Find My iPhone is on</strong> — Ask customer to turn off before repair.
              </Text>
            </div>
          )}
          {isGoogle && (
            <div className="flex items-start gap-2 border-l-2 border-[var(--aui-accent-orange)] pl-2 py-0.5">
              <BellSimple className="size-3.5 mt-0.5 shrink-0 text-[var(--aui-accent-orange)]" />
              <Text size={1} className="text-[var(--aui-accent-orange)]">
                <strong>Enable Repair Mode</strong> on this device before starting work.
              </Text>
            </div>
          )}
        </div>
      ) : status === "active" ? (
        <div ref={stepBodyRef} className="px-5 pb-5 flex flex-col gap-4 animate-step-expand">

          {/* Photos / videos — single upload box + thumbnail strip */}
          <div className="flex flex-col gap-3">
            <Text size={2} weight="heavy">Photos</Text>
            <div className="flex items-start gap-3">
              {/* Single upload trigger */}
              <MediaUploadBox onFile={handleMediaUpload} />
              {/* Uploaded thumbnails */}
              {mediaItems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {mediaItems.map((item) => (
                    <div key={item.id} className="relative size-20 shrink-0 overflow-hidden rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)]">
                      {item.isVideo ? (
                        <video src={item.dataUrl} className="size-full object-cover" />
                      ) : (
                        <img src={item.dataUrl} alt="device" className="size-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => setMediaItems((prev) => prev.filter((m) => m.id !== item.id))}
                        className="absolute right-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {isIdentifying ? (
              <div className="mt-2 flex items-center gap-2 text-[var(--aui-on-surface-soft)]">
                <Spinner className="size-3.5 animate-spin" />
                <Text size={1}>Identifying device…</Text>
              </div>
            ) : photoSuggestions.length > 0 ? (
              <div className="mt-2 flex items-center gap-1.5">
                <Check className="size-3.5 text-[var(--aui-accent-green)]" />
                <Text size={1} className="text-[var(--aui-on-surface-soft)]">
                  Device identified — select below or edit
                </Text>
              </div>
            ) : null}
          </div>

          {/* Make and model — combobox with photo suggestions + popular list */}
          <div ref={pickerContainerRef} className="relative">
            <div className={wasPrefilled.current && device.make ? "animate-prefill-glow rounded-[var(--aui-border-radius-100)]" : undefined}>
              <TextField
                label="Make and model"
                value={device.make}
                onChange={(e) => { updateDevice({ make: e.target.value }); setShowDevicePicker(true); }}
                onFocus={() => setShowDevicePicker(true)}
                placeholder="e.g. Apple iPhone 15"
                className="w-full"
              />
            </div>
            {showDevicePicker && filteredDevices.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] shadow-[var(--aui-fills-drop-shadow)]">
                {photoSuggestions.length > 0 && (
                  <div className="border-b border-[var(--aui-outline-soft)] px-3 pt-2 pb-1">
                    <Text size={1} weight="heavy" className="text-[var(--aui-brand-asurion-purple)]">
                      AI identified from photo
                    </Text>
                  </div>
                )}
                {filteredDevices.map((d, i) => {
                  const isAiSuggested = i < photoSuggestions.length && photoSuggestions.length > 0;
                  return (
                    <button
                      key={d.make}
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-[var(--aui-surface-variant)]",
                        isAiSuggested && i === photoSuggestions.length && "border-t border-[var(--aui-outline-soft)]",
                      )}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        updateDevice({ make: d.make });
                        setShowDevicePicker(false);
                      }}
                    >
                      <Text size={2}>{d.make}</Text>
                      {isAiSuggested ? (
                        <span className="ml-auto shrink-0 rounded-full bg-[var(--aui-primary-soft)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--aui-brand-asurion-purple)]">
                          AI match
                        </span>
                      ) : (
                        <Text size={1} className="ml-auto shrink-0 text-[var(--aui-on-surface-soft)]">{d.group}</Text>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* IMEI + passcode row */}
          <div className="flex gap-3">
            {/* IMEI — always shown */}
            <div className="min-w-0 flex-1 flex flex-col gap-1.5">
              <div className={cn("relative", (wasPrefilled.current && (isNonMobile ? device.serial : device.imei)) || imeiFromPhoto ? "animate-prefill-glow rounded-[var(--aui-border-radius-100)]" : "")}>
                <TextField
                  label={isNonMobile ? "Serial number" : "IMEI"}
                  value={isNonMobile ? device.serial : device.imei}
                  onChange={(e) => {
                    if (isNonMobile) updateDevice({ serial: e.target.value });
                    else { updateDevice({ imei: e.target.value }); setImeiFromPhoto(false); }
                  }}
                  placeholder={isOcrScanning ? "Scanning photo…" : isNonMobile ? "Serial number" : "15-digit IMEI"}
                  disabled={isOcrScanning}
                  className="w-full"
                  helperText={isNonMobile ? "Found in Settings or on the device back panel" :imeiFromPhoto ? "IMEI detected from photo" : "Dial *#06# on the keypad"}
                  fieldStatus={imeiFromPhoto && !isNonMobile ? "success" : "default"}
                />
                {isOcrScanning && (
                  <Spinner className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-[var(--aui-on-surface-soft)]" />
                )}
              </div>
            </div>

            {/* Passcode — always shown, disabled for Google */}
            <div className="min-w-0 flex-1 flex flex-col gap-1.5">
              <TextField
                label="Device passcode"
                value={device.passcode}
                onChange={(e) => !isGoogle && updateDevice({ passcode: e.target.value })}
                placeholder={isGoogle ? "" : "Turn device toward customer"}
                disabled={isGoogle}
                className="w-full"
                helperText={isGoogle ? "Not required for Google device" : "For diagnostic and testing"}
              />
            </div>
          </div>


          <div>
            <Action type="button" disabled={!canContinue} onClick={confirmDevice}>Continue</Action>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ── Step 3: Device issue ──────────────────────────────────────────────────────

const MOCK_AI_CONDITION = [
  { label: "Screen", finding: "Cracked display — visible damage on lower-left corner" },
  { label: "Camera", finding: "Rear lens intact, no visible scratches" },
  { label: "Chassis", finding: "Minor scuffs on back panel, no structural damage" },
  { label: "Ports", finding: "Lightning port appears clear, no visible debris" },
  { label: "Battery", finding: "Unable to assess from photos" },
];

const PHYSICAL_DAMAGE_OPTIONS = [
  { id: "phys-screen",    label: "Screen",             codes: ["LCD-001", "GLS-007"] },
  { id: "phys-backglass", label: "Back glass / cover", codes: ["GLS-007"] },
  { id: "phys-frame",     label: "Frame / Housing",    codes: [] as string[] },
  { id: "phys-camera",    label: "Camera / lens",      codes: ["CAM-004"] },
  { id: "phys-buttons",   label: "Buttons",            codes: [] as string[] },
  { id: "phys-charging",  label: "Charging port",      codes: ["CHG-003"] },
  { id: "phys-other",     label: "Other",              codes: [] as string[] },
];

const COMMON_MALFUNCTIONS = [
  { id: "malf-display",       label: "Screen / display", code: "LCD-001" },
  { id: "malf-battery",       label: "Battery",       code: "BAT-002" },
  { id: "malf-charging",      label: "Charging port", code: "CHG-003" },
  { id: "malf-camera",        label: "Camera",        code: "CAM-004" },
  { id: "malf-audio",         label: "Audio",         code: "SPK-008" },
  { id: "malf-software",      label: "Software",      code: "SW-009"  },
  { id: "malf-connectivity",  label: "Connectivity",  code: "WIF-018" },
  { id: "malf-other",         label: "Other",         code: "" },
];

// Specific sub-issues shown for Samsung / Google devices per malfunction
const SAMSUNG_GOOGLE_SPECIFICS: Record<string, Array<{ id: string; label: string }>> = {
  "malf-display": [
    { id: "lcd-dim",          label: "LCD backlight is dim" },
    { id: "lcd-blank",        label: "LCD blank / no display" },
    { id: "lcd-discolor",     label: "LCD discoloration" },
    { id: "lcd-red-tint",     label: "Reddish / red tint" },
    { id: "lcd-green-tint",   label: "Greenish tint" },
    { id: "lcd-edge-discolor",label: "Edge discoloration" },
  ],
  "malf-touch": [
    { id: "touch-no-response", label: "Touch not responding" },
    { id: "touch-partial",     label: "Partial area unresponsive" },
    { id: "touch-ghost",       label: "Ghost / phantom touches" },
    { id: "touch-delayed",     label: "Touch response delayed" },
    { id: "touch-pressure",    label: "Requires excessive pressure" },
  ],
  "malf-battery": [
    { id: "bat-drain",     label: "Battery drains quickly" },
    { id: "bat-no-charge", label: "Won't charge or hold charge" },
    { id: "bat-swollen",   label: "Battery swollen / bulging" },
    { id: "bat-overheat",  label: "Device overheating" },
    { id: "bat-pct",       label: "Battery percentage inaccurate" },
  ],
  "malf-charging": [
    { id: "chg-no-charge",    label: "Device won't charge" },
    { id: "chg-slow",         label: "Charges slowly" },
    { id: "chg-intermittent", label: "Intermittent / loose connection" },
    { id: "chg-port-damage",  label: "Port physically damaged" },
    { id: "chg-wireless",     label: "Wireless charging not working" },
  ],
  "malf-camera": [
    { id: "cam-blurry",   label: "Camera image blurry" },
    { id: "cam-no-focus", label: "Won't focus" },
    { id: "cam-black",    label: "Camera shows black screen" },
    { id: "cam-front",    label: "Front camera not working" },
    { id: "cam-rear",     label: "Rear camera not working" },
    { id: "cam-flash",    label: "Flash not working" },
  ],
  "malf-audio": [
    { id: "aud-no-sound",   label: "No sound from speaker" },
    { id: "aud-distorted",  label: "Distorted / crackling audio" },
    { id: "aud-mic",        label: "Microphone not working" },
    { id: "aud-earpiece",   label: "Earpiece not working" },
    { id: "aud-bt",         label: "Bluetooth audio issues" },
    { id: "aud-headphone",  label: "Headphone jack not working" },
  ],
};

// Codes already covered by the liquid question, physical damage pills, or named malfunction chips
const COVERED_CODES = new Set([
  "LIQ-006", // liquid damage question
  "GLS-007", // physical damage pills
  "LCD-001", // Display + Touch chips
  "BAT-002", // Battery chip
  "CHG-003", // Charging port chip
  "CAM-004", // Camera chip + physical cracked camera
  "SPK-008", // Audio chip
]);
// "Other" search only shows codes not already reachable via the main UI
const OTHER_SYMPTOM_CODES = SYMPTOM_CODES.filter((s) => !COVERED_CODES.has(s.code));

function InspectionRow({ label, options, value, onChange, disabled }: {
  label?: string;
  options: { label: string; value: string }[];
  value: string | null;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="py-3 flex flex-col gap-3">
      {label && <Text size={2} weight="heavy">{label}</Text>}
      <div className="flex">
        {options.map((opt, i) => {
          const isFirst = i === 0;
          const isLast = i === options.length - 1;
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onChange(opt.value)}
              className={cn(
                "flex items-center gap-1.5 border px-4 py-1.5 text-sm font-medium transition-colors",
                isFirst && "rounded-l-[var(--aui-border-radius-050)]",
                isLast && "rounded-r-[var(--aui-border-radius-050)]",
                !isFirst && "-ml-px",
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                isSelected
                  ? "relative z-10 border-[var(--aui-secondary)] bg-[var(--aui-secondary)] text-[var(--aui-on-surface)]"
                  : "border-[var(--aui-outline-soft)] text-[var(--aui-on-surface)] hover:z-10 hover:border-[var(--aui-secondary)] hover:bg-[var(--aui-secondary)]"
              )}
            >
              {isSelected && <Check className="size-3 shrink-0" weight="bold" />}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const MOCK_SERVICES = [
  { sku: "SVC-CLEAN",   name: "Device cleaning",          price: 19.99 },
  { sku: "SVC-SW-UPD",  name: "Software update",          price: 29.99 },
  { sku: "SVC-DIAG",    name: "Full diagnostic",           price: 39.99 },
  { sku: "SVC-DATA-BCK",name: "Data backup & transfer",   price: 49.99 },
  { sku: "SVC-UNLOCK",  name: "Carrier unlock",            price: 29.99 },
];

const MOCK_ACCESSORIES = [
  { sku: "ACC-SP-PREM",  name: "Premium screen protector", price: 24.99 },
  { sku: "ACC-CASE-SLM", name: "Slim protective case",     price: 19.99 },
  { sku: "ACC-CASE-WAL", name: "Wallet case",              price: 29.99 },
  { sku: "ACC-CHG-20W",  name: "20W fast charger",         price: 22.99 },
  { sku: "ACC-CBL-USB-C",name: "USB-C braided cable",      price: 14.99 },
  { sku: "ACC-WL-STAND", name: "Wireless charging stand",  price: 34.99 },
];


function Step3CompletedSummary({ device, liquidDamage, power, malfunctionResult, completedPhysLabels, completedMalfLabels, selectedPhysicalIds }: {
  device: import("@/lib/check-in-types").DeviceDraft;
  liquidDamage: boolean;
  power: "on" | "off" | null;
  malfunctionResult: "none" | "found" | "unable" | null;
  completedPhysLabels: string[];
  completedMalfLabels: string[];
  selectedPhysicalIds: string[];
}) {
  const makeLC = device.make.toLowerCase();
  const supportsOem = makeLC.startsWith("google") || makeLC.includes("samsung");
  const id = device.imei || device.serial;
  const warranty = supportsOem && id && id.replace(/\D/g, "").length >= 4
    ? lookupWarranty(id, device.deviceType)
    : null;
  const inWarranty = warranty?.status === "manufacturer" || warranty?.status === "extended";
  const hasDamage = !!liquidDamage || selectedPhysicalIds.length > 0;
  const showWarrantyExclusion = inWarranty && hasDamage;
  // Out-of-warranty or warranty undetermined (non-Samsung/Google) + liquid damage
  const showUbifExclusion = !!liquidDamage && !inWarranty;

  return (
    <div className="px-5 pb-4 flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {power === "off" && <IssueChip label="Does not power on" />}
        {liquidDamage && <IssueChip label="Liquid damage" />}
        {completedPhysLabels.map((l) => <IssueChip key={l} label={l} />)}
        {malfunctionResult === "unable" && <IssueChip label="Not tested" />}
        {completedMalfLabels.map((l) => <IssueChip key={l} label={l} />)}
        {power !== "off" && !liquidDamage && completedPhysLabels.length === 0 && malfunctionResult !== "unable" && completedMalfLabels.length === 0 && (
          <Text size={1} className="text-[var(--aui-on-surface-soft)]">No issues found</Text>
        )}
      </div>
      {showWarrantyExclusion && (
        <div className="flex items-start gap-2 border-l-2 border-[var(--aui-accent-orange)] pl-2 py-0.5">
          <WarningCircle className="size-3.5 mt-0.5 shrink-0 text-[var(--aui-accent-orange)]" weight="fill" />
          <Text size={1} className="text-[var(--aui-accent-orange)]">
            The device warranty does not cover physical or liquid damage.
          </Text>
        </div>
      )}
      {showUbifExclusion && (
        <div className="flex items-start gap-2 border-l-2 border-[var(--aui-accent-orange)] pl-2 py-0.5">
          <WarningCircle className="size-3.5 mt-0.5 shrink-0 text-[var(--aui-accent-orange)]" weight="fill" />
          <Text size={1} className="text-[var(--aui-accent-orange)]">
            The UBIF limited warranty does not apply to devices with liquid damage.
          </Text>
        </div>
      )}
    </div>
  );
}

function Step3() {
  const {
    activeStep, stepsComplete,
    device,
    mediaCount,
    photoDamageIds,
    selectedSymptomCodes, otherIssueText,
    setOtherIssueText, toggleSymptomCode,
    confirmIssues, editStep,
  } = useCheckIn();

  const status = getStatus(2, activeStep, stepsComplete);
  const isSamsung = device.make.toLowerCase().includes("samsung");

  // Inspection checklist state
  const [power, setPower] = useState<"on" | "off" | null>(null);
  const [iqcResult, setIqcResult] = useState<"completed" | "not-completed" | null>(null);
  const [iqcReasons, setIqcReasons] = useState<string[]>([]);
  const IQC_REASONS = ["Screen not responsive", "Doesn't power on", "High volume of customers"];
  const liquidDamagePrefilled = device.prefillLiquidDamage === true;
  const [liquidDamageResult, setLiquidDamageResult] = useState<"detected" | "not-detected" | null>(liquidDamagePrefilled ? "detected" : null);
  const [physicalResult, setPhysicalResult] = useState<"none" | "found" | null>(null);
  const [malfunctionResult, setMalfunctionResult] = useState<"none" | "found" | "unable" | null>(null);

  // Physical damage pills
  const [selectedPhysicalIds, setSelectedPhysicalIds] = useState<string[]>([]);

  // Malfunction chips & specifics
  const [selectedMalfIds, setSelectedMalfIds] = useState<string[]>([]);
  const [activeSpecificsId, setActiveSpecificsId] = useState<string | null>(null);
  const [selectedSpecifics, setSelectedSpecifics] = useState<Record<string, string[]>>({});
  const [otherMalfSearch, setOtherMalfSearch] = useState("");

  // Auto-select physical damage when photo analysis detected damage and step becomes active
  const [damageAutoFilled, setDamageAutoFilled] = useState(false);
  useEffect(() => {
    if (activeStep !== 3 || physicalResult !== null || photoDamageIds.length === 0) return;
    setPhysicalResult("found");
    setSelectedPhysicalIds(photoDamageIds);
    setDamageAutoFilled(true);
  }, [activeStep, photoDamageIds, physicalResult]);

  // Additional details
  const [isListening, setIsListening] = useState(false);
  const [textareaActive, setTextareaActive] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recogRef = useRef<any>(null);

  const togglePhysical = (id: string) =>
    setSelectedPhysicalIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

  const isGoogle = device.make.toLowerCase().startsWith("google");
  const showSpecifics = isSamsung || isGoogle;

  const toggleMalf = (id: string) => {
    const isNowSelected = !selectedMalfIds.includes(id);
    setSelectedMalfIds((prev) => isNowSelected ? [...prev, id] : prev.filter((i) => i !== id));
    if (isNowSelected) {
      setActiveSpecificsId(id);
    } else {
      if (activeSpecificsId === id) setActiveSpecificsId(null);
      setSelectedSpecifics((prev) => { const n = { ...prev }; delete n[id]; return n; });
    }
  };

  const toggleSpecific = (malfId: string, specificId: string) => {
    setSelectedSpecifics((prev) => {
      const current = prev[malfId] ?? [];
      return {
        ...prev,
        [malfId]: current.includes(specificId) ? current.filter((s) => s !== specificId) : [...current, specificId],
      };
    });
  };

  const toggleMic = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) return;
    if (isListening) { recogRef.current?.stop(); setIsListening(false); return; }
    const r = new SR();
    r.continuous = true;
    r.interimResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      const t = Array.from(e.results).map((res: any) => res[0].transcript).join(" ");
      setOtherIssueText((otherIssueText + " " + t).trimStart());
    };
    r.onend = () => setIsListening(false);
    r.start();
    recogRef.current = r;
    setIsListening(true);
  }, [isListening, otherIssueText, setOtherIssueText]);

  const generateAIDescription = useCallback(() => {
    setIsGeneratingDescription(true);
    setTimeout(() => {
      const physLabels = selectedPhysicalIds.map((id) => PHYSICAL_DAMAGE_OPTIONS.find((o) => o.id === id)?.label ?? id);
      const malfLabels = selectedMalfIds.flatMap((id) => {
        const m = COMMON_MALFUNCTIONS.find((o) => o.id === id);
        if (!m) return [];
        const specifics = selectedSpecifics[id] ?? [];
        if (specifics.length > 0) {
          return specifics.map((sid) => SAMSUNG_GOOGLE_SPECIFICS[id]?.find((s) => s.id === sid)?.label ?? sid);
        }
        return m.label ? [m.label] : [];
      });
      const lines: string[] = [];

      if (isSamsung) {
        if (iqcResult === "completed") {
          lines.push("IQC: Completed.");
        } else if (iqcResult === "not-completed") {
          const reasons = iqcReasons.length > 0 ? iqcReasons.join(", ") : "reason not specified";
          lines.push(`IQC: Not completed — ${reasons}.`);
        }
        lines.push("");
      }

      if (malfunctionResult === "unable") {
        const reason = power === "off"
          ? "it does not power on"
          : iqcReasons.includes("Doesn't power on")
              ? "it does not power on"
              : iqcReasons.includes("Screen not responsive")
                ? "the touch screen is not responsive"
                : "device functions could not be tested";
        lines.push(`Unable to test device functions because ${reason}.`);
        lines.push("");
      }

      lines.push("Physical & cosmetic condition:");
      if (mediaCount > 0) {
        for (const c of MOCK_AI_CONDITION) lines.push(`  • ${c.label}: ${c.finding}`);
      } else if (physLabels.length > 0) {
        for (const l of physLabels) lines.push(`  • ${l} damage`);
      } else {
        lines.push("  • No physical damage reported");
      }

      lines.push("Reported symptoms:");
      if (liquidDamageResult === "detected") lines.push("  • Liquid damage");
      if (malfunctionResult === "unable") lines.push("  • Unable to test malfunction");
      for (const l of malfLabels) lines.push(`  • ${l} issue`);
      if (liquidDamageResult !== "detected" && malfunctionResult !== "unable" && malfLabels.length === 0) lines.push("  • No malfunctions reported");

      setOtherIssueText(lines.join("\n"));
      setIsGeneratingDescription(false);
    }, 1000);
  }, [selectedPhysicalIds, selectedMalfIds, selectedSpecifics, liquidDamageResult, malfunctionResult, power, iqcResult, iqcReasons, isSamsung, mediaCount, setOtherIssueText]);

  // Sync local selections → context symptom codes on Continue
  const handleContinue = useCallback(() => {
    const needed = new Set<string>();
    if (liquidDamageResult === "detected") needed.add("LIQ-006");
    for (const id of selectedPhysicalIds) {
      PHYSICAL_DAMAGE_OPTIONS.find((o) => o.id === id)?.codes.forEach((c) => needed.add(c));
    }
    for (const id of selectedMalfIds) {
      const code = COMMON_MALFUNCTIONS.find((m) => m.id === id)?.code;
      if (code) needed.add(code);
    }

    const current = new Set(selectedSymptomCodes);
    for (const c of needed) { if (!current.has(c)) toggleSymptomCode(c); }
    for (const c of current) { if (!needed.has(c)) toggleSymptomCode(c); }

    setShowRecommendations(true);
  }, [liquidDamageResult, selectedPhysicalIds, selectedMalfIds, selectedSymptomCodes, toggleSymptomCode]);

  const canContinue = isSamsung
    ? iqcResult !== null && liquidDamageResult !== null && physicalResult !== null && malfunctionResult !== null
    : power !== null && liquidDamageResult !== null && physicalResult !== null && malfunctionResult !== null;

  const filteredOtherCodes = otherMalfSearch.trim()
    ? OTHER_SYMPTOM_CODES.filter(
        (s) => s.label.toLowerCase().includes(otherMalfSearch.toLowerCase()) || s.code.toLowerCase().includes(otherMalfSearch.toLowerCase())
      )
    : OTHER_SYMPTOM_CODES;

  // Summary for completed state — append contextual suffix to distinguish damage vs. malfunction
  const completedPhysLabels = selectedPhysicalIds.map((id) => {
    const label = PHYSICAL_DAMAGE_OPTIONS.find((o) => o.id === id)?.label ?? id;
    return label === "Other" ? label : `${label} damage`;
  });
  const completedMalfLabels = selectedMalfIds.map((id) => {
    const label = COMMON_MALFUNCTIONS.find((m) => m.id === id)?.label ?? id;
    return label === "Other" ? label : `${label} issue`;
  });

  return (
    <div>
      <StepHeader number={3} label="Inspection" status={status} onEdit={() => editStep(3)} />

      {status === "complete" ? (
        <div className="animate-step-summary-in"><Step3CompletedSummary
          device={device}
          liquidDamage={liquidDamageResult === "detected"}
          power={power}
          malfunctionResult={malfunctionResult}
          completedPhysLabels={completedPhysLabels}
          completedMalfLabels={completedMalfLabels}
          selectedPhysicalIds={selectedPhysicalIds}
        /></div>
      ) : status === "active" ? (
        <div className="px-5 pb-5 flex flex-col gap-5 animate-step-expand">

          {/* Inspection checklist */}
          <div className="flex flex-col gap-1">

            {/* Physical damage */}
            <div>
              <div className="py-3 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Text size={2} weight="heavy">Physical damage</Text>
                  {damageAutoFilled && (
                    <div className="flex items-center gap-1.5">
                      <Camera className="size-3.5 shrink-0 text-[var(--aui-on-surface-soft)]" />
                      <Text size={1} className="text-[var(--aui-on-surface-soft)]">Pre-filled from photo analysis — review and adjust</Text>
                    </div>
                  )}
                </div>
                <div className="flex">
                  {[{ label: "Damage found", value: "found" }, { label: "No damage", value: "none" }].map((opt, i, arr) => {
                    const isFirst = i === 0;
                    const isLast = i === arr.length - 1;
                    const isSelected = physicalResult === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { setPhysicalResult(opt.value as "none" | "found"); if (opt.value === "none") setSelectedPhysicalIds([]); }}
                        className={cn(
                          "flex items-center gap-1.5 border px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                          isFirst && "rounded-l-[var(--aui-border-radius-050)]",
                          isLast && "rounded-r-[var(--aui-border-radius-050)]",
                          !isFirst && "-ml-px",
                          isSelected
                            ? "relative z-10 border-[var(--aui-secondary)] bg-[var(--aui-secondary)] text-[var(--aui-on-surface)]"
                            : "border-[var(--aui-outline-soft)] text-[var(--aui-on-surface)] hover:z-10 hover:border-[var(--aui-secondary)] hover:bg-[var(--aui-secondary)]"
                        )}
                      >
                        {isSelected && <Check className="size-3 shrink-0" weight="bold" />}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {physicalResult === "found" && (
                <div className="pb-3 flex flex-col gap-2">
                  <Text size={1} className="text-[var(--aui-on-surface-soft)]">Select physical damage</Text>
                  <ManualSelectionChips
                    size="small"
                    type="selection"
                    layout="wrap"
                    aria-label="Physical damage type"
                    chips={PHYSICAL_DAMAGE_OPTIONS.map((opt) => ({
                      label: opt.label,
                      isSelected: selectedPhysicalIds.includes(opt.id),
                      onClick: () => togglePhysical(opt.id),
                    }))}
                  />
                </div>
              )}
            </div>

            {/* Liquid damage */}
            <InspectionRow
              label="Liquid exposure"
              options={[{ label: "Detected", value: "detected" }, { label: "Not detected", value: "not-detected" }]}
              value={liquidDamageResult}
              onChange={(v) => setLiquidDamageResult(v as "detected" | "not-detected")}
              disabled={liquidDamagePrefilled}
            />

            {/* Power — Samsung uses IQC instead */}
            {isSamsung ? (
              <div>
                <InspectionRow
                  label="IQC"
                  options={[{ label: "Completed", value: "completed" }, { label: "Not completed", value: "not-completed" }]}
                  value={iqcResult}
                  onChange={(v) => {
                    setIqcResult(v as "completed" | "not-completed");
                    if (v === "completed") {
                      setPower("on");
                      setIqcReasons([]);
                    } else {
                      setPower(null);
                    }
                  }}
                />
                {iqcResult === "not-completed" && (
                  <div className="pb-3 flex flex-col gap-2">
                    <Text size={1} className="text-[var(--aui-on-surface-soft)]">Select a reason</Text>
                    <ManualSelectionChips
                      size="small"
                      type="selection"
                      layout="wrap"
                      aria-label="IQC not completed reason"
                      chips={IQC_REASONS.map((reason) => ({
                        label: reason,
                        isSelected: iqcReasons.includes(reason),
                        onClick: () => {
                          const isRemoving = iqcReasons.includes(reason);
                          setIqcReasons((prev) => isRemoving ? prev.filter((r) => r !== reason) : [...prev, reason]);
                          if (reason === "Doesn't power on") {
                            if (!isRemoving) setMalfunctionResult("unable");
                            else setMalfunctionResult(null);
                          }
                        },
                      }))}
                    />
                  </div>
                )}
              </div>
            ) : (
              <InspectionRow
                label="Power"
                options={[{ label: "Powers on", value: "on" }, { label: "Does not power on", value: "off" }]}
                value={power}
                onChange={(v) => {
                  setPower(v as "on" | "off");
                  if (v === "off") setMalfunctionResult("unable");
                  else if (malfunctionResult === "unable") setMalfunctionResult(null);
                }}
              />
            )}

            {/* Malfunction */}
            <div>
              <InspectionRow
                label="Malfunction"
                options={[
                  { label: "Malfunction found", value: "found" },
                  { label: "No malfunction", value: "none" },
                  { label: "Not tested", value: "unable" },
                ]}
                value={malfunctionResult}
                onChange={(v) => {
                  setMalfunctionResult(v as "none" | "found" | "unable");
                  if (v !== "found") { setSelectedMalfIds([]); setActiveSpecificsId(null); setSelectedSpecifics({}); }
                }}
              />
              {malfunctionResult === "found" && (
                <div className="pb-3 flex flex-col gap-3">
                  <Text size={1} className="text-[var(--aui-on-surface-soft)]">Select malfunction</Text>
                  <ManualSelectionChips
                    size="small"
                    type="selection"
                    layout="wrap"
                    aria-label="Malfunction type"
                    chips={COMMON_MALFUNCTIONS.map((m) => ({
                      label: m.label,
                      isSelected: selectedMalfIds.includes(m.id),
                      onClick: () => toggleMalf(m.id),
                    }))}
                  />

                  {/* Specific sub-issues for Samsung / Google */}
                  {showSpecifics && selectedMalfIds.filter((id) => id !== "malf-other" && SAMSUNG_GOOGLE_SPECIFICS[id]).map((malfId) => {
                    const malf = COMMON_MALFUNCTIONS.find((m) => m.id === malfId);
                    const specifics = SAMSUNG_GOOGLE_SPECIFICS[malfId] ?? [];
                    return (
                      <div key={malfId} className="flex flex-col gap-2">
                        <Text size={1} className="text-[var(--aui-on-surface-soft)]">
                          Select {malf?.label.toLowerCase()} issue
                        </Text>
                        <div className="flex flex-col gap-1.5">
                          {specifics.map((spec) => {
                            const checked = (selectedSpecifics[malfId] ?? []).includes(spec.id);
                            return (
                              <label key={spec.id} className="flex items-center gap-2.5 cursor-pointer select-none">
                                <input type="checkbox" checked={checked} onChange={() => toggleSpecific(malfId, spec.id)}
                                  className="size-4 rounded accent-[var(--aui-brand-asurion-purple)]" />
                                <Text size={2}>{spec.label}</Text>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* "Other" symptom code search */}
                  {selectedMalfIds.includes("malf-other") && (
                    <div className="flex flex-col gap-2">
                      <Text size={1} className="text-[var(--aui-on-surface-soft)]">Search symptom codes</Text>
                      <div className="relative">
                        <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--aui-on-surface-soft)]" />
                        <input type="text" value={otherMalfSearch} onChange={(e) => setOtherMalfSearch(e.target.value)}
                          placeholder="Search symptom codes…"
                          className="w-full rounded-[var(--aui-border-radius-050)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface-variant)] py-1.5 pl-9 pr-3 text-sm text-[var(--aui-on-surface)] placeholder:text-[var(--aui-on-surface-soft)] focus:border-[var(--aui-brand-asurion-purple)] focus:outline-none" />
                        {otherMalfSearch && (
                          <button type="button" onClick={() => setOtherMalfSearch("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--aui-on-surface-soft)] hover:text-[var(--aui-on-surface)]">
                            <X className="size-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                        {filteredOtherCodes.map((sc) => {
                          const checked = (selectedSpecifics["malf-other"] ?? []).includes(sc.code);
                          return (
                            <label key={sc.id} className="flex items-center gap-2.5 cursor-pointer select-none">
                              <input type="checkbox" checked={checked} onChange={() => toggleSpecific("malf-other", sc.code)}
                                className="size-4 rounded accent-[var(--aui-brand-asurion-purple)]" />
                              <Text size={2}>{sc.code} · {sc.label}</Text>
                            </label>
                          );
                        })}
                        {filteredOtherCodes.length === 0 && (
                          <Text size={1} className="text-[var(--aui-on-surface-soft)]">No codes match "{otherMalfSearch}"</Text>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Additional details */}
          <div className="flex flex-col gap-3">
            <Textarea
              label="Additional details"
              value={otherIssueText}
              onChange={(e) => setOtherIssueText(e.target.value)}
              placeholder="Describe symptoms in your own words…"
              rows={3}
              onFocus={() => setTextareaActive(true)}
              onBlur={() => setTimeout(() => setTextareaActive(false), 200)}
            />
            {(textareaActive || isListening) && (
              <div className="flex items-center gap-2 flex-wrap">
                <Action type="button" variant="outline" size="sm"
                  onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
                  onClick={toggleMic}
                  aria-label={isListening ? "Stop listening" : "Start voice input"}
                  className="[&>span]:!flex [&>span]:!flex-row [&>span]:!items-center [&>span]:!gap-1.5">
                  <Microphone className={cn("size-4", isListening && "text-[var(--aui-accent-orange)]")} weight={isListening ? "fill" : "regular"} />
                  {isListening ? "Stop" : "Use mic"}
                </Action>
                <Action type="button" variant="outline" size="sm"
                  onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
                  onClick={generateAIDescription} disabled={isGeneratingDescription}
                  className="[&>span]:!flex [&>span]:!flex-row [&>span]:!items-center [&>span]:!gap-1.5">
                  {isGeneratingDescription ? <Spinner className="size-4 animate-spin" /> : <Sparkle className="size-4" />}
                  {isGeneratingDescription ? "Generating…" : "Use AI to draft"}
                </Action>
                {isListening && <Text size={1} className="text-[var(--aui-accent-orange)]">Listening… speak now</Text>}
              </div>
            )}
          </div>

          <div>
            <Action type="button" disabled={!canContinue} onClick={handleContinue}>Continue</Action>
          </div>
        </div>
      ) : null}

      {showRecommendations && (
        <RecommendationsDrawer onDone={() => { setShowRecommendations(false); confirmIssues(); }} />
      )}
    </div>
  );
}

// ── Recommendations drawer ────────────────────────────────────────────────────

type RecommendItem = { sku: string; name: string; price: number; isOem?: boolean };

function RecommendSection({
  title, items, cart, onAdd, onRemove,
}: {
  title: string;
  items: RecommendItem[];
  cart: { sku: string; quantity: number }[];
  onAdd: (item: RecommendItem) => void;
  onRemove: (sku: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Text size={1} weight="heavy" className="text-[var(--aui-on-surface-soft)] uppercase tracking-widest">
        {title}
      </Text>
      <div className="flex flex-col divide-y divide-[var(--aui-outline-soft)] rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)]">
        {items.map((item) => {
          const cartItem = cart.find((c) => c.sku === item.sku);
          const inCart = !!cartItem;
          return (
            <div key={item.sku} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Text size={2}>{item.name}</Text>
                  {item.isOem && (
                    <span className="shrink-0 rounded bg-[var(--aui-primary-soft)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--aui-brand-asurion-purple)]">OEM</span>
                  )}
                </div>
                <Text size={1} className="text-[var(--aui-on-surface-soft)]">${item.price.toFixed(2)}</Text>
              </div>
              <Action
                type="button"
                variant={inCart ? "flat" : "outline"}
                size="sm"
                onClick={() => inCart ? onRemove(item.sku) : onAdd(item)}
                className="[&>span]:!flex [&>span]:!flex-row [&>span]:!items-center [&>span]:!gap-1"
              >
                {inCart ? (
                  <>
                    <Check className="size-3.5 shrink-0" weight="bold" />
                    Added
                  </>
                ) : "Add"}
              </Action>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecommendationsDrawer({ onDone }: { onDone: () => void }) {
  const { device, selectedIssueIds, cart, addPartToCart, removeFromCart } = useCheckIn();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in on next frame
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleDone = () => {
    setVisible(false);
    setTimeout(onDone, 300);
  };

  const parts = useMemo(
    () => suggestedParts(selectedIssueIds, device.deviceType, device.make).slice(0, 4),
    [selectedIssueIds, device.deviceType, device.make]
  );

  const addItem = (item: RecommendItem) => {
    addPartToCart({ sku: item.sku, name: item.name, price: item.price });
  };

  const removeItem = (sku: string) => {
    const cartItem = cart.find((c) => c.sku === sku);
    if (cartItem) removeFromCart(cartItem.id);
  };

  const cartSkus = cart.map((c) => ({ sku: c.sku, quantity: c.quantity }));

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn("fixed inset-0 z-40 bg-black/40 transition-opacity duration-300", visible ? "opacity-100" : "opacity-0")}
        onClick={handleDone}
      />
      {/* Drawer */}
      <div
        className={cn(
          "fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col bg-[var(--aui-surface)] shadow-2xl transition-transform duration-300",
          visible ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--aui-outline-soft)] px-5 py-4">
          <div>
            <Text size={4} weight="heavy">Recommended for {device.make || "this device"}</Text>
          </div>
          <button
            type="button"
            onClick={handleDone}
            className="rounded p-1.5 hover:bg-[var(--aui-surface-variant)]"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">
          {parts.length > 0 && (
            <RecommendSection title="Parts" items={parts} cart={cartSkus} onAdd={addItem} onRemove={removeItem} />
          )}
          <RecommendSection title="Services" items={MOCK_SERVICES} cart={cartSkus} onAdd={addItem} onRemove={removeItem} />
          <RecommendSection title="Accessories" items={MOCK_ACCESSORIES} cart={cartSkus} onAdd={addItem} onRemove={removeItem} />
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--aui-outline-soft)] px-5 py-4 flex items-center justify-between gap-3">
          <Action type="button" variant="outline" onClick={handleDone}>
            Skip
          </Action>
          <Action type="button" variant="filled" onClick={handleDone}>
            Continue to drop off
          </Action>
        </div>
      </div>
    </>
  );
}

function MediaUploadBox({ onFile }: { onFile: (f: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const openCamera = useCallback(async () => {
    setCameraError("");
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setCameraError("Camera access denied or unavailable.");
    }
  }, []);

  const closeCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
    setCameraError("");
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
      onFile(file);
      closeCamera();
    }, "image/jpeg", 0.92);
  }, [onFile, closeCamera]);

  const tileClass = "flex size-20 shrink-0 flex-col items-center justify-center gap-1 rounded-[var(--aui-border-radius-100)] border-2 border-dashed border-[var(--aui-outline-soft)] transition-colors hover:border-[var(--aui-brand-asurion-purple)] hover:bg-[var(--aui-primary-soft)]";

  return (
    <>
      <div className="flex gap-2">
        {/* Upload tile */}
        <button type="button" onClick={() => inputRef.current?.click()} className={tileClass}>
          <Image className="size-6 text-[var(--aui-on-surface-soft)]" />
          <Text size={1} className="text-[var(--aui-on-surface-soft)]">Upload</Text>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => {
              Array.from(e.target.files ?? []).forEach((f) => onFile(f));
              e.target.value = "";
            }}
          />
        </button>

        {/* Take photo tile */}
        <button type="button" onClick={openCamera} className={tileClass}>
          <Camera className="size-6 text-[var(--aui-on-surface-soft)]" />
          <Text size={1} className="text-[var(--aui-on-surface-soft)]">Take photo</Text>
        </button>
      </div>

      {/* Camera capture modal */}
      <AuiModal
        isOpen={cameraOpen}
        title="Take photo"
        onCloseClick={closeCamera}
        primaryButtonLabel={cameraError ? undefined : "Capture"}
        primaryButtonDisabled={!!cameraError}
        secondaryButtonLabel="Cancel"
        onSecondaryClick={closeCamera}
        onPrimaryClick={cameraError ? undefined : capturePhoto}
        showXButton
        width="32rem"
      >
        {cameraError ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Camera className="size-10 text-[var(--aui-on-surface-soft)]" />
            <Text size={2} className="text-[var(--aui-on-surface-soft)]">{cameraError}</Text>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-[var(--aui-border-radius-050)] bg-black"
            style={{ aspectRatio: "4/3", objectFit: "cover" }}
          />
        )}
      </AuiModal>
    </>
  );
}

// ── Step 4: Drop off details ──────────────────────────────────────────────────

const TIME_VALUES = TIME_DROPDOWN_OPTIONS.map((o) => o.value);

function pickupTimeFromNow(): string {
  const now = new Date();
  const target = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  const h = target.getHours();
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const candidate = `${h12}:00 ${ampm}`;
  // find the candidate or the next available slot
  const idx = TIME_VALUES.indexOf(candidate);
  if (idx !== -1) return TIME_VALUES[idx];
  // find next slot after target hour
  for (const t of TIME_VALUES) {
    const [hStr, rest] = t.split(":");
    const [, ap] = rest.split(" ");
    let slotH = parseInt(hStr);
    if (ap === "pm" && slotH !== 12) slotH += 12;
    if (ap === "am" && slotH === 12) slotH = 0;
    if (slotH >= h) return t;
  }
  return TIME_VALUES[TIME_VALUES.length - 1];
}

function Step4() {
  const {
    activeStep, stepsComplete, dropOff, individual, device, cart, cartSubtotal,
    updateDropOff, confirmCheckIn, saveAndAddAnotherDevice, editStep,
  } = useCheckIn();
  const isSamsung = device.make.toLowerCase().includes("samsung");
  const [showTechCare, setShowTechCare] = useState(false);
  const [techCareDeclined, setTechCareDeclined] = useState(false);

  function handleCreateWorkOrder() {
    // Skip pitch if already declined this session or customer is already enrolled
    if (techCareDeclined || individual?.homePlusEnrolled) {
      confirmCheckIn();
    } else {
      setShowTechCare(true);
    }
  }

  const status = getStatus(3, activeStep, stepsComplete);
  const canContinue = Boolean(dropOff.pickupDate && dropOff.pickupTime);

  // Auto-populate pickup date/time (same day, +4 hours) when step first opens
  useEffect(() => {
    if (status === "active" && !dropOff.pickupDate && !dropOff.pickupTime) {
      updateDropOff({
        pickupDate: dateToInputDate(new Date()),
        pickupTime: pickupTimeFromNow(),
      });
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const phone = individual?.primaryPhone ?? "";
  const email = individual?.email ?? "";

  return (
    <div>
      <StepHeader number={4} label="Drop-off" status={status} onEdit={() => editStep(4)} />

      {status === "complete" ? (
        <div className="animate-step-summary-in px-5 pb-4">
          <Text size={1} className="text-[var(--aui-on-surface-soft)]">
            Pickup {dropOff.pickupDate} at {dropOff.pickupTime}
          </Text>
        </div>
      ) : status === "active" ? (
        <div className="px-5 pb-5 flex flex-col gap-5 animate-step-expand">

          {/* Pickup date + time */}
          <div className="flex flex-col gap-3">
            <Text size={2} weight="heavy">Estimated pickup</Text>
            <div className="flex gap-3">
              <div className="min-w-0 flex-1">
                <Datepicker
                  value={inputDateToDate(dropOff.pickupDate)}
                  onChange={(date: Date) => updateDropOff({ pickupDate: dateToInputDate(date) })}
                  textFieldProps={{ label: "Pickup date" }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <Dropdown
                  label="Pickup time"
                  options={TIME_DROPDOWN_OPTIONS}
                  value={dropOff.pickupTime}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateDropOff({ pickupTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Contact information */}
          <div className="flex flex-col gap-3">
            <Text size={2} weight="heavy">Contact</Text>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <div className="min-w-0 flex-1 flex flex-col gap-2">
                  <TextField label="Best contact number" className="w-full"
                    value={dropOff.contactPhone || phone}
                    onChange={(e) => updateDropOff({ contactPhone: e.target.value })} />
                  <Checkbox
                    label="Send text update (Data rate may apply)"
                    checked={dropOff.sendTextUpdate}
                    disabled={!dropOff.contactPhone && !phone}
                    onChange={(e) => updateDropOff({ sendTextUpdate: e.target.checked })}
                  />
                </div>
                <div className="min-w-0 flex-1 flex flex-col gap-2">
                  <TextField label="Email" className="w-full"
                    value={dropOff.contactEmail || email}
                    onChange={(e) => updateDropOff({ contactEmail: e.target.value })} />
                  <Checkbox
                    label="Send tech tips or exclusive offers"
                    checked={dropOff.sendEmailReceipt}
                    disabled={!dropOff.contactEmail && !email}
                    onChange={(e) => updateDropOff({ sendEmailReceipt: e.target.checked })}
                  />
                </div>
              </div>
              {isSamsung && (
                <div className="flex flex-col gap-2">
                  <PredictiveTextField
                    label="Home address"
                    className="w-full"
                    value={dropOff.homeAddress}
                    suggestions={searchAddresses(dropOff.homeAddress ?? "")}
                    handleChange={(val) => updateDropOff({ homeAddress: val })}
                    onSelection={(s) => updateDropOff({ homeAddress: s.value })}
                    placeholder="Street, city, state, ZIP"
                    helperText="Required for Samsung device repair"
                    shouldFilterSuggestions={false}
                    includeSubheader
                  />
                </div>
              )}
            </div>
          </div>

          {/* Accessories */}
          <div className="flex flex-col gap-3">
            <Text size={2} weight="heavy">Accessories on the device</Text>
            <ManualSelectionChips
              size="small"
              type="selection"
              layout="wrap"
              aria-label="Accessories on the device"
              chips={DROPOFF_ACCESSORIES.map((acc) => ({
                label: acc.label,
                isSelected: dropOff.accessories.includes(acc.id),
                onClick: () => updateDropOff({
                  accessories: dropOff.accessories.includes(acc.id)
                    ? dropOff.accessories.filter((a) => a !== acc.id)
                    : [...dropOff.accessories, acc.id],
                }),
              }))}
            />
            <div className="mt-3">
              <TextField label="Other accessories" value={dropOff.accessoryNote}
                onChange={(e) => updateDropOff({ accessoryNote: e.target.value })}
                placeholder="Describe any other accessories…" />
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Action type="button" disabled={!canContinue} onClick={handleCreateWorkOrder}>
              Create work order
            </Action>
            <Action type="button" variant="outline" onClick={saveAndAddAnotherDevice}>
              Save &amp; check in another device
            </Action>
          </div>
        </div>
      ) : null}

      {showTechCare && (
        <TechCarePitchDrawer
          individual={individual}
          device={device}
          cart={cart}
          cartSubtotal={cartSubtotal}
          onEnroll={() => { setShowTechCare(false); confirmCheckIn(); }}
          onDecline={() => { setTechCareDeclined(true); setShowTechCare(false); confirmCheckIn(); }}
          onRemindLater={() => { setShowTechCare(false); confirmCheckIn(); }}
        />
      )}
    </div>
  );
}

// ── Asurion Tech Care pitch drawer ────────────────────────────────────────────

function buildTechCarePitch(
  individual: import("@/lib/check-in-types").IndividualCustomer | null,
  device: import("@/lib/check-in-types").DeviceDraft,
  cartSubtotal: number,
): { headline: string; body: string; discountLabel: string } {
  const firstName = individual?.name?.split(" ")[0] || "your customer";
  const deviceLabel = [device.make, device.model].filter(Boolean).join(" ") || "this device";
  const repairCost = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cartSubtotal);
  const discountPct = cartSubtotal > 0 ? 10 : 0;
  const isLoyal = (individual?.lifetimeValue ?? 0) > 200;

  const headline = cartSubtotal > 0
    ? `Save ${discountPct}% on today's repair — and protect every device at home`
    : `Protect every device in ${firstName}'s home with Asurion Tech Care`;

  const loyalLine = isLoyal
    ? `As a valued customer with a history of repairs with us, ${firstName} is a great fit for a plan that keeps all their devices covered.`
    : `Most households have 5+ devices — Tech Care covers them all under one plan.`;

  const body = [
    cartSubtotal > 0
      ? `${firstName} is already investing ${repairCost} in keeping their ${deviceLabel} running.`
      : `${firstName} brought in their ${deviceLabel} today — a great moment to talk about ongoing protection.`,
    loyalLine,
    "Asurion Tech Care covers unlimited claims, same-day expert support, and identity theft protection — for every device in the home.",
    cartSubtotal > 0
      ? `Enrolling today waives the ${discountPct}% discount on this repair automatically.`
      : "Plans start at just $24.99/mo for the whole household.",
  ].join(" ");

  const discountLabel = cartSubtotal > 0 ? `${discountPct}% off today's repair (${repairCost} → ${new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(cartSubtotal*0.9)})` : "No discount on $0 repair";

  return { headline, body, discountLabel };
}

function TechCarePitchDrawer({
  individual, device, cart, cartSubtotal, onEnroll, onDecline, onRemindLater,
}: {
  individual: import("@/lib/check-in-types").IndividualCustomer | null;
  device: import("@/lib/check-in-types").DeviceDraft;
  cart: import("@/lib/check-in-types").CartItem[];
  cartSubtotal: number;
  onEnroll: () => void;
  onDecline: () => void;
  onRemindLater: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const { headline, body, discountLabel } = buildTechCarePitch(individual, device, cartSubtotal);
  const hasDiscount = cartSubtotal > 0;

  const BENEFITS = [
    { icon: Shield, text: "Unlimited claims, no deductible surprises" },
    { icon: DeviceMobileCamera, text: "Every device in the home — phone, tablet, laptop, TV" },
    { icon: CheckCircle, text: "Same-day expert support, in-store or remote" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onRemindLater}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[var(--aui-surface)] shadow-2xl transition-transform duration-300",
          visible ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--aui-outline-soft)] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Shield className="size-5 text-[var(--aui-brand-asurion-purple)]" weight="fill" />
            <Text size={3} weight="heavy">Asurion Tech Care</Text>
          </div>
          <button type="button" onClick={onRemindLater}
            className="rounded p-1 text-[var(--aui-on-surface-soft)] hover:bg-[var(--aui-surface-variant)]">
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
          {/* Headline */}
          <div>
            <Text as="h2" size={4} weight="heavy" className="leading-snug">{headline}</Text>
          </div>

          {/* Discount callout */}
          {hasDiscount && (
            <AlertBanner
              isOpen
              display="inline"
              alertBannerType="default"
              hideDismissButton
              iconName="tag"
            >
              <strong>Enroll now and save</strong> — {discountLabel}
            </AlertBanner>
          )}

          {/* Pitch body */}
          <p className="text-sm leading-relaxed text-[var(--aui-on-surface-soft)]">{body}</p>

          {/* Benefits */}
          <ul className="flex flex-col gap-3">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <Icon className="mt-0.5 size-4 shrink-0 text-[var(--aui-brand-asurion-purple)]" />
                <p className="text-sm text-[var(--aui-on-surface)]">{text}</p>
              </li>
            ))}
          </ul>

          <p className="text-xs text-[var(--aui-on-surface-soft)]">Plans start at $24.99/mo · Cancel anytime · All devices in the household covered.</p>
        </div>

        {/* Actions */}
        <div className="border-t border-[var(--aui-outline-soft)] px-5 py-4 flex flex-col gap-3">
          <Action type="button" variant="filled" className="w-full justify-center [&>span]:!flex [&>span]:!items-center [&>span]:!gap-2" onClick={onEnroll}>
            <CheckCircle className="size-4 shrink-0" />
            {hasDiscount ? "Enroll now & apply discount" : "Enroll now"}
          </Action>
          <Action type="button" variant="outline" className="w-full justify-center [&>span]:!flex [&>span]:!items-center [&>span]:!gap-2" onClick={onRemindLater}>
            <BellSimple className="size-4 shrink-0" />
            Remind the customer later
          </Action>
          <button
            type="button"
            onClick={onDecline}
            className="flex items-center justify-center gap-2 py-1 text-sm text-[var(--aui-on-surface-soft)] hover:text-[var(--aui-on-surface)] transition-colors"
          >
            <ThumbsDown className="size-3.5" />
            Customer declined — do not offer again
          </button>
        </div>
      </div>
    </>
  );
}

// ── Check-in complete ─────────────────────────────────────────────────────────

function CheckInComplete({ workOrderId, savedDeviceRepairs, onReset }: { workOrderId: string; savedDeviceRepairs: import("@/lib/check-in-types").SavedDeviceRepair[]; onReset: () => void }) {
  const { device, cart, cartSubtotal } = useCheckIn();
  const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  const currentMakeModel = [device.make, device.model].filter(Boolean).join(" ") || "Current device";
  const multiDevice = savedDeviceRepairs.length > 0;

  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-[var(--aui-brand-asurion-purple)]">
          <Check className="size-8 text-white" weight="bold" />
        </span>
        <div className="w-full">
          <Text as="h2" size={5} weight="heavy">Check-in complete</Text>
          {multiDevice ? (
            <Text size={2} className="mt-1 text-[var(--aui-on-surface-soft)]">
              {savedDeviceRepairs.length + (workOrderId ? 1 : 0)} work orders created.
            </Text>
          ) : (
            <Text size={2} className="mt-1 text-[var(--aui-on-surface-soft)]">
              Work order{" "}
              <a href={`/workorders/${workOrderId}`} target="_blank" rel="noreferrer"
                className="font-medium text-[var(--aui-brand-asurion-purple)] hover:opacity-80">
                {workOrderId} ↗
              </a>{" "}created.
            </Text>
          )}
        </div>

        {multiDevice && (
          <div className="w-full rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] divide-y divide-[var(--aui-outline-soft)] text-left">
            {savedDeviceRepairs.map((repair) => (
              <div key={repair.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--aui-on-surface)] leading-snug">{repair.makeModel}</p>
                    {repair.imei && <p className="text-xs text-[var(--aui-on-surface-soft)]">IMEI: {repair.imei}</p>}
                  </div>
                  <p className="shrink-0 text-sm font-bold text-[var(--aui-on-surface)]">{fmt(repair.subtotal)}</p>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <a href={`/workorders/${repair.workOrderId}`} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                    <Tag text={`${repair.workOrderId} ↗`} type="purple" family="bold" size="small" />
                  </a>
                  {repair.cart.length > 0 && (
                    <p className="text-xs text-[var(--aui-on-surface-soft)]">
                      {repair.cart.length} item{repair.cart.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {workOrderId && (
              <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--aui-on-surface)] leading-snug">{currentMakeModel}</p>
                    {device.imei && <p className="text-xs text-[var(--aui-on-surface-soft)]">IMEI: {device.imei}</p>}
                  </div>
                  {cartSubtotal > 0 && <p className="shrink-0 text-sm font-bold text-[var(--aui-on-surface)]">{fmt(cartSubtotal)}</p>}
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <a href={`/workorders/${workOrderId}`} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                    <Tag text={`${workOrderId} ↗`} type="purple" family="bold" size="small" />
                  </a>
                  {cart.length > 0 && (
                    <p className="text-xs text-[var(--aui-on-surface-soft)]">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <Action type="button" variant="outline" onClick={() => window.print()}>Print drop-off receipt</Action>
          <Action type="button" variant="filled" onClick={onReset}>New check-in</Action>
        </div>
      </div>
    </div>
  );
}
