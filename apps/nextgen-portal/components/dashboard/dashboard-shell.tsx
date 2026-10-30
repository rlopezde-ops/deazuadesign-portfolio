"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrivalsPanel } from "@/components/dashboard/arrivals-panel";
import { CheckInView } from "@/components/check-in/check-in-view";
import { CustomerProfileView } from "@/components/customer/customer-profile-view";
import { DashboardMain } from "@/components/dashboard/dashboard-main";
import { StoreHeader } from "@/components/dashboard/store-header";
import { StoreSidebar } from "@/components/dashboard/store-sidebar";
import { HelpdeskHub } from "@/components/helpdesk/helpdesk-hub";
import { WorkordersView } from "@/components/workorders/workorders-view";
import { AppNavigationProvider, useAppNavigation } from "@/lib/app-navigation";
import {
  isHelpdeskFlowScreen,
  parseFlowScreen,
} from "@/lib/flow-screen";

function DashboardShellInner() {
  const searchParams = useSearchParams();
  const screen = parseFlowScreen(searchParams.get("screen"));
  const customerId = searchParams.get("customer");
  const { view, goToDashboard, goToMoreItem, goToCustomerProfile, goToWorkorders } =
    useAppNavigation();
  const showArrivals = view === "dashboard";
  const showSidebar = true;

  useEffect(() => {
    if (customerId) {
      const isBusiness = customerId.startsWith("biz-");
      goToCustomerProfile({
        type: isBusiness ? "business" : "individual",
        id: customerId,
      });
      return;
    }
    if (searchParams.get("view") === "workorders") {
      goToWorkorders();
      return;
    }
    if (isHelpdeskFlowScreen(screen)) {
      goToMoreItem("helpdesk-hub");
    } else if (!searchParams.get("screen")) {
      return;
    } else {
      goToDashboard();
    }
  }, [
    screen,
    customerId,
    searchParams,
    goToDashboard,
    goToMoreItem,
    goToCustomerProfile,
    goToWorkorders,
  ]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <StoreHeader />

      <div className="flex min-h-0 flex-1">
        {showSidebar ? <StoreSidebar /> : null}

        <main
          data-slot="dashboard-main"
          className="min-w-0 flex-1 overflow-y-auto bg-[var(--aui-sub-surface)]"
        >
          {view === "helpdesk-hub" ? (
            <HelpdeskHub flowScreen={screen} />
          ) : view === "check-in" ? (
            <CheckInView />
          ) : view === "customer-profile" ? (
            <CustomerProfileView />
          ) : view === "workorders" ? (
            <WorkordersView />
          ) : (
            <DashboardMain />
          )}
        </main>

        {showArrivals ? <ArrivalsPanel /> : null}
      </div>
    </div>
  );
}

export function DashboardShell() {
  return (
    <AppNavigationProvider>
      <Suspense fallback={null}>
        <DashboardShellInner />
      </Suspense>
    </AppNavigationProvider>
  );
}
