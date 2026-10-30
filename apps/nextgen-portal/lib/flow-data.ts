import type { FlowMapConfig, FlowSection } from "./flow-map-types";
import {
  DESKTOP_NODE_STEP_X,
  DESKTOP_NODE_STEP_Y,
} from "./flow-map-layout";

/** Desktop layout steps from flow-map-layout.ts */
const X0 = 60;
const X1 = X0 + DESKTOP_NODE_STEP_X;
const X2 = X1 + DESKTOP_NODE_STEP_X;
const X3 = X2 + DESKTOP_NODE_STEP_X;

const Y1 = 80;
const Y2 = Y1 + DESKTOP_NODE_STEP_Y;
const Y3 = Y2 + DESKTOP_NODE_STEP_Y;

export const flowSections: FlowSection[] = [
  {
    id: "browse",
    title: "Store closures",
    subtitle: "4 screens • Dashboard entry, list & filters",
    y: 0,
    groups: ["dashboard", "closures"],
    upToDate: true,
  },
  {
    id: "create",
    title: "Close store",
    subtitle: "2 screens • Create flow",
    y: Y2 - 80,
    groups: ["create"],
    upToDate: true,
  },
  {
    id: "manage",
    title: "Cancel / reopen",
    subtitle: "3 screens • Row actions",
    y: Y3 - 80,
    groups: ["manage"],
    upToDate: true,
  },
];

/**
 * Populated after Playwright capture. Screenshot paths must match
 * `public/screenshots/` output from `pnpm capture:flow-map`.
 */
export const flowMapConfig: FlowMapConfig = {
  title: "NextGen Portal — Flow Map",
  subtitle: "9 screens • 7 connections • desktop",
  canvas: { width: 2000, height: 1400 },
  defaultZoom: 0.65,
  groupColors: {
    dashboard: { bg: "#f0f9ff", border: "#bae6fd", label: "Dashboard" },
    closures: { bg: "#f0fdf4", border: "#86efac", label: "Store closures" },
    create: { bg: "#fefce8", border: "#fde047", label: "Close store" },
    manage: { bg: "#faf5ff", border: "#d8b4fe", label: "Cancel / reopen" },
  },
  nodes: [
    {
      id: "dashboard",
      label: "Store dashboard",
      screenshot: "/screenshots/01-dashboard.png",
      route: "/?screen=dashboard",
      x: X0,
      y: Y1,
      group: "dashboard",
    },
    {
      id: "store-closures",
      label: "Store closures",
      screenshot: "/screenshots/02-store-closures.png",
      route: "/?screen=store-closures",
      x: X1,
      y: Y1,
      group: "closures",
    },
    {
      id: "filter-scheduled",
      label: "Filter: scheduled",
      screenshot: "/screenshots/03-filter-scheduled.png",
      route: "/?screen=filter-scheduled",
      x: X2,
      y: Y1,
      group: "closures",
    },
    {
      id: "helpdesk-workorders",
      label: "HelpDesk placeholder",
      screenshot: "/screenshots/04-helpdesk-workorders.png",
      route: "/?screen=helpdesk-workorders",
      x: X3,
      y: Y1,
      group: "closures",
    },
    {
      id: "close-store",
      label: "Close store panel",
      screenshot: "/screenshots/05-close-store.png",
      route: "/?screen=close-store",
      x: X1,
      y: Y2,
      group: "create",
    },
    {
      id: "confirm-closure",
      label: "Confirm closure",
      screenshot: "/screenshots/06-confirm-closure.png",
      route: "/?screen=confirm-closure",
      x: X2,
      y: Y2,
      group: "create",
    },
    {
      id: "row-actions",
      label: "Row actions menu",
      screenshot: "/screenshots/07-row-actions.png",
      route: "/?screen=row-actions",
      x: X0,
      y: Y3,
      group: "manage",
    },
    {
      id: "cancel-closure",
      label: "Cancel scheduled",
      screenshot: "/screenshots/08-cancel-closure.png",
      route: "/?screen=cancel-closure",
      x: X1,
      y: Y3,
      group: "manage",
    },
    {
      id: "reopen-store",
      label: "Reopen store",
      screenshot: "/screenshots/09-reopen-store.png",
      route: "/?screen=reopen-store",
      x: X2,
      y: Y3,
      group: "manage",
    },
  ],
  edges: [
    { from: "dashboard", to: "store-closures", label: "More → HelpDesk Hub" },
    { from: "store-closures", to: "filter-scheduled", label: "Status card" },
    { from: "store-closures", to: "helpdesk-workorders", label: "Other tab" },
    { from: "store-closures", to: "close-store", label: "Close store" },
    { from: "close-store", to: "confirm-closure", label: "Submit" },
    { from: "row-actions", to: "cancel-closure", label: "Cancel closure" },
    { from: "row-actions", to: "reopen-store", label: "Reopen" },
  ],
};
