export type ClosureStatus = "scheduled" | "temporary" | "permanent";

export type ClosureType = "temporary" | "permanent";

export type StoreType = "corporate" | "franchise";

export type ImpactScope =
  | "all-corporate"
  | "all-franchise"
  | "all-stores"
  | "specific";

export type SampleStore = {
  storeName: string;
  storeId: string;
  storeType: StoreType;
};

export type StoreClosure = {
  id: string;
  storeName: string;
  storeId: string;
  status: ClosureStatus;
  closingOn: string;
  reopensOn: string | null;
  reason: string;
  closedBy: string;
  notes?: string;
};

export const HELPDESK_TABS = [
  { id: "workorders", label: "Workorders" },
  { id: "arrivals", label: "Arrivals" },
  { id: "carts", label: "Carts" },
  { id: "on-board-user", label: "On board user" },
  { id: "store-closures", label: "Store closures" },
] as const;

export type HelpdeskTabId = (typeof HELPDESK_TABS)[number]["id"];

export const TEMPORARY_CLOSURE_REASONS = [
  "Weather / natural disaster",
  "Facility maintenance",
  "Staffing shortage",
  "Holiday",
  "Health & safety",
  "Utility outage",
  "Other",
] as const;

export const PERMANENT_CLOSURE_REASONS = [
  "Lease ended / not renewed",
  "Underperforming location",
  "Relocation / consolidation",
  "Market exit",
  "Building / property sold",
  "Franchise agreement terminated",
  "Other",
] as const;

export const SAMPLE_STORES: SampleStore[] = [
  { storeName: "Pine Crest", storeId: "1011", storeType: "corporate" },
  { storeName: "Lakeview", storeId: "1007", storeType: "franchise" },
  { storeName: "Gulch", storeId: "1001", storeType: "corporate" },
  { storeName: "Downtown", storeId: "1002", storeType: "corporate" },
  { storeName: "Midtown", storeId: "1014", storeType: "franchise" },
  { storeName: "Riverside", storeId: "1009", storeType: "corporate" },
  { storeName: "West End", storeId: "1005", storeType: "franchise" },
  { storeName: "Eastside", storeId: "1018", storeType: "corporate" },
  { storeName: "Harbor", storeId: "1022", storeType: "franchise" },
  { storeName: "Oak Lawn", storeId: "1030", storeType: "corporate" },
];

export function storesByType(type: StoreType) {
  return SAMPLE_STORES.filter((s) => s.storeType === type);
}

export function reasonsForClosureType(type: ClosureType) {
  return type === "temporary"
    ? TEMPORARY_CLOSURE_REASONS
    : PERMANENT_CLOSURE_REASONS;
}

export const initialStoreClosures: StoreClosure[] = [
  {
    id: "sc-1",
    storeName: "Pine Crest",
    storeId: "1011",
    status: "scheduled",
    closingOn: "08/03/2026",
    reopensOn: null,
    reason: "Lease ended / not renewed",
    closedBy: "Sam Rivera",
  },
  {
    id: "sc-2",
    storeName: "Lakeview",
    storeId: "1007",
    status: "scheduled",
    closingOn: "07/17/2026",
    reopensOn: "07/24/2026",
    reason: "Holiday",
    closedBy: "Priya Nair",
  },
  {
    id: "sc-3",
    storeName: "Gulch",
    storeId: "1001",
    status: "temporary",
    closingOn: "07/10/2026",
    reopensOn: "07/19/2026",
    reason: "Facility maintenance",
    closedBy: "Jordan Lee",
  },
  {
    id: "sc-4",
    storeName: "Downtown",
    storeId: "1002",
    status: "permanent",
    closingOn: "07/08/2026",
    reopensOn: null,
    reason: "Underperforming location",
    closedBy: "Sam Rivera",
  },
];

export function countByStatus(closures: StoreClosure[]) {
  return {
    scheduled: closures.filter((c) => c.status === "scheduled").length,
    temporary: closures.filter((c) => c.status === "temporary").length,
    permanent: closures.filter((c) => c.status === "permanent").length,
  };
}

export function formatStoreLabel(
  closure: Pick<StoreClosure, "storeName" | "storeId">
) {
  return `${closure.storeName} (#${closure.storeId})`;
}

export function toInputDate(display: string) {
  const [mm, dd, yyyy] = display.split("/");
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

export function toDisplayDate(input: string) {
  const [yyyy, mm, dd] = input.split("-");
  return `${mm}/${dd}/${yyyy}`;
}

export function todayInputDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** YYYY-MM-DD compares lexicographically. */
export function isDateInFuture(inputDate: string) {
  return Boolean(inputDate) && inputDate > todayInputDate();
}

export function impactScopeLabel(scope: ImpactScope): string {
  switch (scope) {
    case "all-corporate":
      return "all corporate stores";
    case "all-franchise":
      return "all franchise stores";
    case "all-stores":
      return "all corporate and franchise stores";
    case "specific":
      return "selected stores";
  }
}
