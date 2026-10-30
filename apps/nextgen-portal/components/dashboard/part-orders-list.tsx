"use client";

import { Icon, Text } from "@asurion-core/mx-asurion-ui-react";
import { partOrders } from "@/lib/dashboard-data";

export function PartOrdersList() {
  return (
    <ul className="flex flex-col divide-y divide-[var(--aui-outline-soft)]">
      {partOrders.map((part) => (
        <li key={part.id} className="flex items-start justify-between gap-3 py-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <Text size={2} weight="heavy">{part.partName}</Text>
            <div className="flex items-center gap-1.5">
              <Icon.Phosphor name="hash" size="xsmall" weight="regular" className="text-[var(--aui-on-surface-soft)]" aria-hidden />
              <Text size={1} color="var(--aui-on-surface-soft)">{part.partNumber}</Text>
            </div>
            <a
              href={`/workorders/${part.woId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 mt-0.5 w-fit"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon.Phosphor name="arrow-square-out" size="xsmall" weight="regular" className="text-[var(--aui-primary)]" aria-hidden />
              <Text size={1} color="var(--aui-primary)">WO {part.woId}</Text>
            </a>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold ${
                part.type === "distro"
                  ? "bg-[#1A2E4A] text-[#93C5FD]"
                  : "bg-[#2A1A4A] text-[#C4B5FD]"
              }`}
            >
              {part.type === "distro" ? "Distro" : "3rd Party"}
            </span>
            <div className="flex items-center gap-1">
              <Icon.Phosphor name="package" size="xsmall" weight="regular" className="text-[var(--aui-on-surface-soft)]" aria-hidden />
              <Text size={1} color="var(--aui-on-surface-soft)">Qty: {part.quantity}</Text>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
