"use client";

import { Icon, Text } from "@asurion-core/mx-asurion-ui-react";
import { agedWOs } from "@/lib/dashboard-data";

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

function daysConfig(days: number): { className: string; icon: string } {
  if (days >= 21) return { className: "bg-[#7A1E1E] text-[#FFADAD]", icon: "warning-circle" };
  return                  { className: "bg-[#4A3800] text-[#FFD966]", icon: "warning" };
}

export function AgedWOList() {
  return (
    <ul className="flex flex-col divide-y divide-[var(--aui-outline-soft)]">
      {agedWOs.map((wo) => {
        const days = daysSince(wo.lastUpdatedAt);
        const cfg = daysConfig(days);
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
                <Text size={1} color="var(--aui-on-surface-soft)" className="truncate">{wo.issue}</Text>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${cfg.className}`}>
                  <Icon.Phosphor name={cfg.icon} size="xsmall" weight="regular" aria-hidden />
                  {days}d
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
