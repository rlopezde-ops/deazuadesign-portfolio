"use client";

import { useEffect, useState } from "react";
import { Tabs, Text } from "@asurion-core/mx-asurion-ui-react";
import { StoreClosuresView } from "@/components/helpdesk/store-closures-view";
import { HELPDESK_TABS, type HelpdeskTabId } from "@/lib/store-closures-data";
import {
  type FlowScreen,
  isHelpdeskFlowScreen,
  parseFlowScreen,
} from "@/lib/flow-screen";

function tabForScreen(screen: FlowScreen): HelpdeskTabId {
  if (screen === "helpdesk-workorders") return "workorders";
  return "store-closures";
}

type HelpdeskHubProps = {
  flowScreen?: FlowScreen;
};

export function HelpdeskHub({ flowScreen }: HelpdeskHubProps) {
  const screen = flowScreen ?? parseFlowScreen(null);
  const [activeTab, setActiveTab] = useState<HelpdeskTabId>(() =>
    tabForScreen(screen)
  );
  const activeTabIndex = Math.max(
    0,
    HELPDESK_TABS.findIndex((tab) => tab.id === activeTab)
  );

  useEffect(() => {
    if (!isHelpdeskFlowScreen(screen)) return;
    setActiveTab(tabForScreen(screen));
  }, [screen]);

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-[var(--aui-spacing-300)] p-[var(--aui-spacing-300)]">
      <header className="flex flex-col gap-[var(--aui-spacing-200)]">
        <Text as="h1" size={5} weight="base">
          HelpDesk Hub
        </Text>
        <Tabs
          aria-label="HelpDesk Hub features"
          size="medium"
          tabWidth="fill"
          activeTabIndex={activeTabIndex}
          onChange={({ value }) => {
            const next = HELPDESK_TABS[value];
            if (next) setActiveTab(next.id);
          }}
          tabs={HELPDESK_TABS.map((tab) => ({
            title: tab.label,
          }))}
        />
      </header>

      {activeTab === "store-closures" ? (
        <StoreClosuresView flowScreen={screen} />
      ) : (
        <PlaceholderTab
          label={HELPDESK_TABS.find((t) => t.id === activeTab)?.label ?? ""}
        />
      )}
    </div>
  );
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="rounded-[var(--aui-border-radius-200)] border border-dashed border-[var(--aui-outline-soft)] bg-[var(--aui-elevated-level-01)] px-6 py-16 text-center">
      <Text as="p" size={3} weight="base">
        {label}
      </Text>
      <Text
        as="p"
        size={2}
        weight="base"
        color="var(--aui-on-surface-soft)"
        className="mt-[var(--aui-spacing-050)]"
      >
        This HelpDesk Hub feature is not part of the prototype yet.
      </Text>
    </div>
  );
}
