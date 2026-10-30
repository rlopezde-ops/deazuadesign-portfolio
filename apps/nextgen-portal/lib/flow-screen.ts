/** Deep-link screen ids for Playwright + Flow Map (`/?screen=…`). */
export const FLOW_SCREENS = [
  "dashboard",
  "store-closures",
  "close-store",
  "confirm-closure",
  "row-actions",
  "cancel-closure",
  "reopen-store",
  "filter-scheduled",
  "helpdesk-workorders",
] as const;

export type FlowScreen = (typeof FLOW_SCREENS)[number];

export function parseFlowScreen(value: string | null): FlowScreen {
  if (value && (FLOW_SCREENS as readonly string[]).includes(value)) {
    return value as FlowScreen;
  }
  return "dashboard";
}

export function isHelpdeskFlowScreen(screen: FlowScreen) {
  return screen !== "dashboard";
}
