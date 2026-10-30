"use client";

import { MetricsOverview } from "@/components/dashboard/metrics-overview";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TodosPanel } from "@/components/dashboard/todos-panel";

export function DashboardMain() {
  return (
    <div className="mx-auto flex max-w-[880px] flex-col gap-[var(--aui-spacing-400)] p-[var(--aui-spacing-300)]">
      <QuickActions />
      <TodosPanel />
      <MetricsOverview />
    </div>
  );
}
