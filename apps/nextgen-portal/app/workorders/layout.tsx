"use client";

import { AppNavigationProvider } from "@/lib/app-navigation";
import { StoreHeader } from "@/components/dashboard/store-header";
import { WorkordersSidebar } from "@/components/workorders/workorders-sidebar";

export default function WorkordersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppNavigationProvider>
      <div className="flex h-screen flex-col overflow-hidden">
        <StoreHeader />
        <div className="flex min-h-0 flex-1">
          <WorkordersSidebar />
          <main className="min-w-0 flex-1 overflow-y-auto bg-[var(--aui-sub-surface)]">
            {children}
          </main>
        </div>
      </div>
    </AppNavigationProvider>
  );
}
