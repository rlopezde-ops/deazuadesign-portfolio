"use client";

import { Action, Icon } from "@asurion-core/mx-asurion-ui-react";
import {
  arrivalSlots,
  arrivalsDateLabel,
  type ArrivalAppointment,
} from "@/lib/dashboard-data";

const accentColors: Record<ArrivalAppointment["accent"], string> = {
  yellow: "var(--aui-status-warning)",
  green: "var(--aui-status-success)",
  purple: "var(--aui-accent-purple)",
};

function AppointmentCard({ appointment }: { appointment: ArrivalAppointment }) {
  return (
    <article className="relative min-w-0 flex-1 overflow-hidden rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-elevated-level-02)] p-2">
      <div
        className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full"
        style={{ background: accentColors[appointment.accent] }}
        aria-hidden
      />
      <p className="truncate pl-2 text-xs font-medium capitalize text-[var(--aui-on-surface)]">
        {appointment.name}
      </p>
      <p className="truncate pl-2 text-[11px] text-[var(--aui-on-surface-soft)]">
        {appointment.device}
      </p>
      <span className="mt-1.5 ml-2 inline-block max-w-full truncate rounded-[var(--aui-border-radius-round)] bg-[var(--aui-accent-purple-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--aui-accent-purple)]">
        {appointment.service}
      </span>
    </article>
  );
}

export function ArrivalsPanel() {
  return (
    <aside
      data-slot="arrivals-panel"
      className="flex w-[320px] shrink-0 flex-col border-l border-[var(--aui-outline-soft)] bg-[var(--aui-surface-variant)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--aui-outline-soft)] px-[var(--aui-spacing-200)] py-[var(--aui-spacing-200)]">
        <h2 className="text-base font-medium text-[var(--aui-on-surface)]">
          Arrivals
        </h2>
        <Action
          type="button"
          size="sm"
          variant="tonal"
          className="!inline-flex !items-center"
        >
          <Icon.Phosphor
            name="plus"
            size="small"
            weight="bold"
            aria-hidden
            className="!mr-1.5 !block shrink-0"
          />
          <span className="leading-none">Add new</span>
        </Action>
      </div>

      <div className="flex items-center justify-between border-b border-[var(--aui-outline-soft)] px-[var(--aui-spacing-200)] py-[var(--aui-spacing-150)]">
        <div className="flex items-center gap-1">
          <Action
            type="button"
            size="sm"
            variant="flat"
            aria-label="Previous day"
            className="!inline-flex !items-center !justify-center !p-1.5"
          >
            <Icon.Phosphor name="caret-left" size="small" aria-hidden />
          </Action>
          <Action
            type="button"
            size="sm"
            variant="flat"
            aria-label="Next day"
            className="!inline-flex !items-center !justify-center !p-1.5"
          >
            <Icon.Phosphor name="caret-right" size="small" aria-hidden />
          </Action>
        </div>
        <span className="text-sm font-medium text-[var(--aui-on-surface)]">
          {arrivalsDateLabel}
        </span>
        <Action type="button" size="sm" variant="outline">
          Today
        </Action>
      </div>

      <div className="flex-1 overflow-y-auto">
        {arrivalSlots.map((slot) => (
          <div
            key={slot.hour}
            className="grid grid-cols-[52px_1fr_auto] gap-2 border-b border-[var(--aui-outline-soft)] px-[var(--aui-spacing-150)] py-[var(--aui-spacing-150)]"
          >
            <span className="pt-1 text-xs text-[var(--aui-on-surface-soft)]">
              {slot.hour}
            </span>
            <div className="flex min-w-0 gap-1.5">
              {slot.appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </div>
            <Action
              type="button"
              size="sm"
              variant="flat"
              className="!self-start !whitespace-nowrap"
            >
              +{slot.moreCount} more
            </Action>
          </div>
        ))}
      </div>
    </aside>
  );
}
