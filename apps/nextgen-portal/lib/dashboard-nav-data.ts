"use client";

/**
 * Sidebar / dashboard nav config.
 * Icons use AUI `Icon.Phosphor` names (Phosphor set via Asurion CDN).
 */

export type SidebarNavItem = {
  id: string;
  label: string;
  /** Phosphor icon name for `Icon.Phosphor` (kebab-case). */
  iconName?: string;
  /** Optional local / CDN SVG for icons missing from the AUI Phosphor CDN. */
  iconSrc?: string;
  active?: boolean;
  hasChevron?: boolean;
};

export type MoreMenuItem = {
  id: string;
  label: string;
};

export type QuickAction = {
  id: string;
  label: string;
  image: string;
};

export const sidebarNav: SidebarNavItem[] = [
  { id: "dashboard", label: "Dashboard", iconName: "house", active: true },
  { id: "arrivals", label: "Arrivals", iconName: "calendar" },
  { id: "workorders", label: "Workorders", iconName: "wrench" },
  { id: "sales", label: "Sales", iconName: "shopping-cart" },
  { id: "inventory", label: "Inventory", iconName: "package" },
  { id: "knowledge", label: "Knowledge base", iconName: "graduation-cap" },
  { id: "reports", label: "Reports", iconName: "chart-pie" },
  { id: "remote-tech", label: "Remote tech", iconName: "van" },
  { id: "more", label: "More", iconName: "dots-nine", hasChevron: true },
];

/** Secondary items revealed when "More" is expanded (matches store Ops menu). */
export const moreMenuItems: MoreMenuItem[] = [
  { id: "my-store", label: "My store" },
  { id: "devices", label: "Devices" },
  { id: "services", label: "Services" },
  { id: "device-issues", label: "Device issues" },
  { id: "program-attributes", label: "Program attributes" },
  { id: "helpdesk-hub", label: "HelpDesk Hub" },
  { id: "incident-advisor", label: "Incident advisor" },
  { id: "price-calculator-admin", label: "Price calculator admin" },
  { id: "global-configurations", label: "Global configurations" },
  { id: "business-clients", label: "Business clients" },
  { id: "wave", label: "WAVE" },
];

export const quickActions: QuickAction[] = [
  {
    id: "check-in",
    label: "Check-in",
    image: "/images/quick-check-in.png",
  },
  {
    id: "checkout",
    label: "Checkout",
    image: "/images/quick-checkout.png",
  },
  {
    id: "estimates",
    label: "Estimates",
    image: "/images/quick-estimates.png",
  },
  {
    id: "metrics",
    label: "Metrics",
    image: "/images/quick-metrics.png",
  },
];
