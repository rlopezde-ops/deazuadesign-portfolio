"use client";

import { useState } from "react";
import { Icon, Text } from "@asurion-core/mx-asurion-ui-react";
import { todoItems } from "@/lib/dashboard-data";
import { ConfirmArrivalsList } from "./confirm-arrivals-list";
import { FollowUpList } from "./follow-up-list";
import { PickupRemindersList } from "./pickup-reminders-list";
import { AgedWOList } from "./aged-wo-list";
import { PartOrdersList } from "./part-orders-list";

function SectionContent({ id }: { id: string }) {
  switch (id) {
    case "contact":    return <ConfirmArrivalsList />;
    case "started":    return <FollowUpList />;
    case "pickup":     return <PickupRemindersList />;
    case "ready-work": return <AgedWOList />;
    case "order":      return <PartOrdersList />;
    default:           return null;
  }
}

export function TodosPanel() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section aria-labelledby="todos-heading">
      <Text
        id="todos-heading"
        as="h2"
        size={2}
        weight="base"
        style={{ marginBottom: "0.75rem" }}
      >
        Action items
      </Text>

      <div className="flex flex-col divide-y divide-[var(--aui-outline-soft)] rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)]">
        {todoItems.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-[var(--aui-surface-variant)]"
              >
                <Text as="span" size={2} weight="base">
                  {item.label}{" "}
                  <Text as="span" size={2} color="var(--aui-on-surface-soft)">
                    ({item.count})
                  </Text>
                </Text>
                <Icon.Phosphor
                  name={isOpen ? "caret-up" : "caret-down"}
                  size="small"
                  weight="bold"
                  className="shrink-0 text-[var(--aui-on-surface-soft)]"
                  aria-hidden
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1">
                  <SectionContent id={item.id} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
