"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type AppView =
  | "dashboard"
  | "helpdesk-hub"
  | "check-in"
  | "customer-profile"
  | "workorders";

export type PendingCheckInCustomer =
  | { type: "individual"; id: string }
  | { type: "business"; id: string };

export type SelectedCustomerProfile =
  | { type: "individual"; id: string }
  | { type: "business"; id: string };

type CheckInOrigin = {
  view: Exclude<AppView, "check-in">;
  selectedCustomerProfile: SelectedCustomerProfile | null;
  activeNavId: string;
  activeMoreId: string | null;
  moreOpen: boolean;
};

type AppNavigationContextValue = {
  view: AppView;
  activeNavId: string;
  activeMoreId: string | null;
  moreOpen: boolean;
  pendingCheckInCustomer: PendingCheckInCustomer | null;
  selectedCustomerProfile: SelectedCustomerProfile | null;
  setMoreOpen: (open: boolean) => void;
  goToDashboard: () => void;
  goToCheckIn: () => void;
  goToCheckInWithCustomer: (customer: PendingCheckInCustomer) => void;
  exitCheckIn: () => void;
  clearPendingCheckInCustomer: () => void;
  goToCustomerProfile: (customer: SelectedCustomerProfile) => void;
  goToMoreItem: (id: string) => void;
  goToWorkorders: () => void;
};

const AppNavigationContext = createContext<AppNavigationContextValue | null>(
  null
);

export function AppNavigationProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AppView>("dashboard");
  const [activeNavId, setActiveNavId] = useState("dashboard");
  const [activeMoreId, setActiveMoreId] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [pendingCheckInCustomer, setPendingCheckInCustomer] =
    useState<PendingCheckInCustomer | null>(null);
  const [selectedCustomerProfile, setSelectedCustomerProfile] =
    useState<SelectedCustomerProfile | null>(null);
  const [checkInOrigin, setCheckInOrigin] = useState<CheckInOrigin | null>(
    null
  );

  const navSnapshotRef = useRef({
    view,
    activeNavId,
    activeMoreId,
    moreOpen,
    selectedCustomerProfile,
  });
  navSnapshotRef.current = {
    view,
    activeNavId,
    activeMoreId,
    moreOpen,
    selectedCustomerProfile,
  };

  const captureCheckInOrigin = useCallback(() => {
    const snap = navSnapshotRef.current;
    if (snap.view === "check-in") return;
    setCheckInOrigin({
      view: snap.view,
      selectedCustomerProfile: snap.selectedCustomerProfile,
      activeNavId: snap.activeNavId,
      activeMoreId: snap.activeMoreId,
      moreOpen: snap.moreOpen,
    });
  }, []);

  const goToDashboard = useCallback(() => {
    setView("dashboard");
    setActiveNavId("dashboard");
    setActiveMoreId(null);
    setPendingCheckInCustomer(null);
    setSelectedCustomerProfile(null);
    setCheckInOrigin(null);
  }, []);

  const goToCheckIn = useCallback(() => {
    captureCheckInOrigin();
    setView("check-in");
    setActiveNavId("dashboard");
    setActiveMoreId(null);
  }, [captureCheckInOrigin]);

  const goToCheckInWithCustomer = useCallback(
    (customer: PendingCheckInCustomer) => {
      captureCheckInOrigin();
      setPendingCheckInCustomer(customer);
      setView("check-in");
      setActiveNavId("dashboard");
      setActiveMoreId(null);
    },
    [captureCheckInOrigin]
  );

  const exitCheckIn = useCallback(() => {
    const origin = checkInOrigin;
    setPendingCheckInCustomer(null);
    setCheckInOrigin(null);

    if (!origin) {
      setView("dashboard");
      setActiveNavId("dashboard");
      setActiveMoreId(null);
      setSelectedCustomerProfile(null);
      return;
    }

    setView(origin.view);
    setActiveNavId(origin.activeNavId);
    setActiveMoreId(origin.activeMoreId);
    setMoreOpen(origin.moreOpen);
    setSelectedCustomerProfile(origin.selectedCustomerProfile);
  }, [checkInOrigin]);

  const clearPendingCheckInCustomer = useCallback(() => {
    setPendingCheckInCustomer(null);
  }, []);

  const goToCustomerProfile = useCallback(
    (customer: SelectedCustomerProfile) => {
      setSelectedCustomerProfile(customer);
      setPendingCheckInCustomer(null);
      setCheckInOrigin(null);
      setView("customer-profile");
      setActiveNavId("dashboard");
      setActiveMoreId(null);
    },
    []
  );

  const goToMoreItem = useCallback((id: string) => {
    setActiveMoreId(id);
    setActiveNavId("more");
    setMoreOpen(true);
    setPendingCheckInCustomer(null);
    setSelectedCustomerProfile(null);
    setCheckInOrigin(null);
    if (id === "helpdesk-hub") {
      setView("helpdesk-hub");
    } else {
      setView("dashboard");
    }
  }, []);

  const goToWorkorders = useCallback(() => {
    setView("workorders");
    setActiveNavId("workorders");
    setActiveMoreId(null);
    setPendingCheckInCustomer(null);
    setSelectedCustomerProfile(null);
    setCheckInOrigin(null);
  }, []);

  const value = useMemo(
    () => ({
      view,
      activeNavId,
      activeMoreId,
      moreOpen,
      pendingCheckInCustomer,
      selectedCustomerProfile,
      setMoreOpen,
      goToDashboard,
      goToCheckIn,
      goToCheckInWithCustomer,
      exitCheckIn,
      clearPendingCheckInCustomer,
      goToCustomerProfile,
      goToMoreItem,
      goToWorkorders,
    }),
    [
      view,
      activeNavId,
      activeMoreId,
      moreOpen,
      pendingCheckInCustomer,
      selectedCustomerProfile,
      goToDashboard,
      goToCheckIn,
      goToCheckInWithCustomer,
      exitCheckIn,
      clearPendingCheckInCustomer,
      goToCustomerProfile,
      goToMoreItem,
      goToWorkorders,
    ]
  );

  return (
    <AppNavigationContext.Provider value={value}>
      {children}
    </AppNavigationContext.Provider>
  );
}

export function useAppNavigation() {
  const ctx = useContext(AppNavigationContext);
  if (!ctx) {
    throw new Error("useAppNavigation must be used within AppNavigationProvider");
  }
  return ctx;
}
