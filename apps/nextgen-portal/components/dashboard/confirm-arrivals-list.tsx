"use client";

import { useState } from "react";
import { Icon, Text } from "@asurion-core/mx-asurion-ui-react";
import { mockArrivals, type ArrivalRecord } from "@/lib/dashboard-data";
import { ArrivalDetailSheet } from "./arrival-detail-sheet";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ConfirmArrivalsList() {
  const [selected, setSelected] = useState<ArrivalRecord | null>(null);

  return (
    <>
      <ul className="flex flex-col divide-y divide-[var(--aui-outline-soft)]">
        {mockArrivals.map((arrival) => {
          return (
            <li key={arrival.id}>
              <button
                type="button"
                onClick={() => setSelected(arrival)}
                className="flex w-full items-start justify-between gap-3 py-3 text-left transition-colors hover:bg-[var(--aui-surface-variant)] rounded-[var(--aui-border-radius-100)] px-2 -mx-2"
              >
                {/* Left: avatar + info */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--aui-surface-variant)]">
                    <Text size={1} weight="heavy" className="text-[var(--aui-on-surface-soft)]">
                      {arrival.initials}
                    </Text>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <Text size={2} weight="heavy">{arrival.customerName}</Text>
                    <Text size={1} color="var(--aui-on-surface-soft)" className="truncate">{arrival.device}</Text>
                    <div className="flex items-center gap-1.5">
                      <Icon.Phosphor name="calendar" size="xsmall" weight="regular" className="text-[var(--aui-on-surface-soft)]" aria-hidden />
                      <Text size={1} color="var(--aui-on-surface-soft)">
                        {formatDate(arrival.appointmentStart)}, {formatTime(arrival.appointmentStart)} – {formatTime(arrival.appointmentEnd)}
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Right: chevron */}
                <Icon.Phosphor name="caret-right" size="xsmall" weight="bold" className="text-[var(--aui-on-surface-soft)] shrink-0" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>

      <ArrivalDetailSheet arrival={selected} onClose={() => setSelected(null)} />
    </>
  );
}
