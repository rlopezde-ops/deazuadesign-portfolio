"use client";

import { Icon, Text } from "@asurion-core/mx-asurion-ui-react";
import { pickupReminderWOs } from "@/lib/dashboard-data";

function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function PickupRemindersList() {
  const urgentWOs = pickupReminderWOs.filter((wo) => daysSince(wo.workCompletedAt) >= 3);

  return (
    <ul className="flex flex-col divide-y divide-[var(--aui-outline-soft)]">
      {urgentWOs.map((wo) => {
        const days = daysSince(wo.workCompletedAt);
        const isDelayed = days >= 7;
        const isAtRisk = days >= 3 && days < 7;

        return (
          <li key={wo.id}>
            <a
              href={`/workorders/${wo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between gap-3 py-3 px-2 -mx-2 rounded-[var(--aui-border-radius-100)] transition-colors hover:bg-[var(--aui-surface-variant)]"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <Text size={2} weight="heavy">{wo.customer}</Text>
                <Text size={1} color="var(--aui-on-surface-soft)" className="truncate">{wo.device}</Text>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Icon.Phosphor name="phone" size="xsmall" weight="regular" className="text-[var(--aui-on-surface-soft)]" aria-hidden />
                    <Text size={1} color="var(--aui-on-surface-soft)">{wo.phone}</Text>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon.Phosphor name="currency-dollar" size="xsmall" weight="regular" className="text-[var(--aui-on-surface-soft)]" aria-hidden />
                    <Text size={1} color="var(--aui-on-surface-soft)">${wo.amountDue.toFixed(2)} due</Text>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${
                  isDelayed ? "bg-[#7A1E1E] text-[#FFADAD]" :
                  isAtRisk  ? "bg-[#4A3800] text-[#FFD966]" :
                              "bg-[#0A4A2E] text-[#6EE7A8]"
                }`}>
                  <Icon.Phosphor
                    name={isDelayed ? "warning-circle" : isAtRisk ? "warning" : "check-circle"}
                    size="xsmall"
                    weight="regular"
                    aria-hidden
                  />
                  {days === 0 ? "Today" : `${days}d`}
                </span>
                <Icon.Phosphor name="arrow-square-out" size="xsmall" weight="regular" className="text-[var(--aui-on-surface-soft)]" aria-hidden />
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
