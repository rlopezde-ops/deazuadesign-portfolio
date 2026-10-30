"use client";

import { Icon, Text } from "@asurion-core/mx-asurion-ui-react";
import { followUpWOs, type ContactReason } from "@/lib/dashboard-data";

const CONTACT_REASON_STYLES: Record<ContactReason, string> = {
  "Repair estimate":  "bg-[#1A2E4A] text-[#93C5FD]",
  "Price change":     "bg-[#4A3800] text-[#FFD966]",
  "Additional issue": "bg-[#2A1A4A] text-[#C4B5FD]",
  "Other":            "bg-[var(--aui-surface-variant)] text-[var(--aui-on-surface-soft)]",
};

export function FollowUpList() {
  return (
    <ul className="flex flex-col divide-y divide-[var(--aui-outline-soft)]">
      {followUpWOs.map((wo) => {
        const reasonClass = CONTACT_REASON_STYLES[wo.contactReason];
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
                <span className={`rounded px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${reasonClass}`}>
                  {wo.contactReason}
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
