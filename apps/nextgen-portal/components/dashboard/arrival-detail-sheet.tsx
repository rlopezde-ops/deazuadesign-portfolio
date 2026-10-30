"use client";

import { Action, Icon, Text } from "@asurion-core/mx-asurion-ui-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ArrivalRecord } from "@/lib/dashboard-data";

type Props = {
  arrival: ArrivalRecord | null;
  onClose: () => void;
};

function formatAppointmentRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const dateStr = s.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  const startTime = s.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const endTime = e.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return `${dateStr} ${startTime} – ${endTime}`;
}

export function ArrivalDetailSheet({ arrival, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!arrival) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [arrival, onClose]);

  useEffect(() => {
    if (!arrival) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [arrival]);

  if (!arrival || !mounted) return null;

  const isConfirmed = arrival.confirmationStatus === "confirmed";

  return createPortal(
    <div className="fixed inset-0 z-[200] flex justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Dismiss panel"
        className="absolute inset-0 bg-[var(--aui-scrim-overlay)] backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Customer arrival"
        className="relative z-10 flex h-full w-[500px] flex-col bg-[var(--aui-surface)] shadow-2xl animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--aui-outline-soft)] px-6 py-4">
          <Text size={3} weight="heavy">Customer arrival</Text>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full hover:bg-[var(--aui-surface-variant)] transition-colors"
          >
            <Icon.Phosphor name="x" size="small" weight="bold" aria-hidden />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-5 px-6 py-5">

            {/* Customer info */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--aui-surface-variant)]">
                  <Text size={2} weight="heavy" className="text-[var(--aui-on-surface-soft)]">
                    {arrival.initials}
                  </Text>
                </div>
                <div className="flex flex-col gap-0.5">
                  <Text size={3} weight="heavy">{arrival.customerName}</Text>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-sm text-[var(--aui-on-surface-soft)]">
                      <Icon.Phosphor name="envelope" size="xsmall" weight="regular" aria-hidden />
                      {arrival.email}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-[var(--aui-on-surface-soft)]">
                      <Icon.Phosphor name="phone" size="xsmall" weight="regular" aria-hidden />
                      {arrival.phone}
                    </span>
                    <Icon.Phosphor name="chat-circle" size="xsmall" weight="regular" className="text-[var(--aui-primary)]" aria-hidden />
                  </div>
                  <Text size={1} color="var(--aui-on-surface-soft)">{arrival.address}</Text>
                </div>
              </div>
              <Text size={1} color="var(--aui-on-surface-soft)" className="shrink-0">Source: {arrival.source}</Text>
            </div>

            {/* Preferred contact method */}
            <div className="rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] px-4 py-3 flex flex-col gap-1.5">
              <Text size={2} weight="heavy">Preferred contact method</Text>
              <div className="flex items-center gap-2">
                <div className="flex size-4 items-center justify-center rounded border border-[var(--aui-outline-soft)] bg-[var(--aui-surface-variant)]">
                  <Icon.Phosphor name="check" size="xsmall" weight="bold" className="text-[var(--aui-on-surface-soft)]" aria-hidden />
                </div>
                <Text size={2} color="var(--aui-on-surface-soft)" className="capitalize">{arrival.preferredContact}</Text>
              </div>
              <Text size={1} color="var(--aui-on-surface-soft)">
                By continuing, customer agrees to the{" "}
                <span className="underline cursor-pointer">Terms of Service</span> and{" "}
                <span className="underline cursor-pointer">Privacy Policy</span>. Data rates may apply.
              </Text>
            </div>

            <div className="border-t border-[var(--aui-outline-soft)]" />

            {/* Device */}
            <div className="flex items-start gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded border border-[var(--aui-outline-soft)] bg-[var(--aui-surface-variant)]">
                <Icon.Phosphor name="device-mobile" size="small" weight="regular" className="text-[var(--aui-on-surface-soft)]" aria-hidden />
              </div>
              <div className="flex flex-col gap-1">
                <Text size={2} weight="heavy">{arrival.device}</Text>
                <div className="flex items-center gap-2 flex-wrap">
                  <Text size={1} color="var(--aui-on-surface-soft)">IMEI: {arrival.imei}</Text>
                  <span className="rounded bg-[var(--aui-surface-variant)] px-2 py-0.5 text-xs font-semibold text-[var(--aui-on-surface)]">
                    {arrival.servicePlan}
                  </span>
                </div>
              </div>
            </div>

            {/* Appointment time */}
            <div className="flex items-center gap-2">
              <Icon.Phosphor name="calendar-check" size="small" weight="regular" className="text-[var(--aui-on-surface-soft)]" aria-hidden />
              <Text size={2} color="var(--aui-on-surface-soft)">
                {formatAppointmentRange(arrival.appointmentStart, arrival.appointmentEnd)}
              </Text>
              <span
                className={`rounded px-2 py-0.5 text-xs font-semibold ${
                  isConfirmed
                    ? "bg-[#0A4A2E] text-[#6EE7A8]"
                    : "bg-[#4A3800] text-[#FFD966]"
                }`}
              >
                {isConfirmed ? "Confirmed" : "Not confirmed"}
              </span>
            </div>

            <div className="border-t border-[var(--aui-outline-soft)]" />

            {/* Notes */}
            <div className="flex flex-col gap-3">
              {arrival.notes.map((note) => (
                <div key={note.id} className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--aui-surface-variant)]">
                    <Icon.Phosphor name="note" size="xsmall" weight="regular" className="text-[var(--aui-on-surface-soft)]" aria-hidden />
                  </div>
                  <div className="flex-1 rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] px-4 py-3 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Text size={2} weight="heavy">Auto note</Text>
                        <Text size={1} color="var(--aui-on-surface-soft)">{note.timestamp}</Text>
                      </div>
                      <span className="rounded bg-[var(--aui-surface-variant)] px-2 py-0.5 text-xs font-semibold text-[var(--aui-on-surface)]">
                        {note.category}
                      </span>
                    </div>
                    <Text size={1} color="var(--aui-on-surface-soft)">{note.body}</Text>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[var(--aui-outline-soft)] px-6 py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Action type="button" size="sm" variant="outline" onClick={onClose}>
              Save arrival
            </Action>
            <Action type="button" size="sm" variant="filled">
              Check-in
            </Action>
            <Action type="button" size="sm" variant="outline">
              Confirm appointment
            </Action>
          </div>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full border border-[var(--aui-outline-soft)] hover:bg-[var(--aui-surface-variant)] transition-colors"
            aria-label="More actions"
          >
            <Icon.Phosphor name="dots-three" size="small" weight="bold" aria-hidden />
          </button>
        </div>
      </aside>
    </div>,
    document.body
  );
}
