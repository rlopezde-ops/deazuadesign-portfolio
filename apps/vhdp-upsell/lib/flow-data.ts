import type { FlowMapConfig } from "@/lib/flow-map-types"

/**
 * Verizon Home Device Protect — upsell micro experience flow map.
 * Screenshots captured by scripts/capture-flow-map.mjs (mobile 390×844).
 * Routes deep-link into the prototype via ?screen=X.
 */
export const flowMapConfig: FlowMapConfig = {
  title: "Home Device Protect — Flow Map",
  subtitle: "Upsell micro experience • 5 screens • 5 connections",
  canvas: { width: 1500, height: 950 },
  defaultZoom: 0.7,
  groupColors: {
    app: { bg: "#f0f9ff", border: "#bae6fd", label: "App" },
    offer: { bg: "#fefce8", border: "#fde047", label: "Offer" },
    enroll: { bg: "#f0fdf4", border: "#86efac", label: "Enrollment" },
  },
  nodes: [
    {
      id: "home",
      label: "Home / account",
      screenshot: "/screenshots/01-home.png",
      route: "/?screen=home",
      x: 60,
      y: 60,
      group: "app",
    },
    {
      id: "upsell",
      label: "Upsell bottom sheet",
      screenshot: "/screenshots/02-upsell.png",
      route: "/?screen=upsell",
      x: 460,
      y: 60,
      group: "offer",
    },
    {
      id: "signup",
      label: "Sign-up takeover",
      screenshot: "/screenshots/04-signup.png",
      route: "/?screen=signup",
      x: 860,
      y: 60,
      group: "enroll",
    },
    {
      id: "success",
      label: "You're enrolled",
      screenshot: "/screenshots/05-success.png",
      route: "/?screen=success",
      x: 1260,
      y: 60,
      group: "enroll",
    },
    {
      id: "covered",
      label: "Covered devices",
      screenshot: "/screenshots/03-covered.png",
      route: "/?screen=covered",
      x: 460,
      y: 540,
      group: "offer",
    },
  ],
  edges: [
    { from: "home", to: "upsell", label: "View offer" },
    { from: "upsell", to: "signup", label: "Get covered today" },
    { from: "signup", to: "success", label: "Sign up" },
    { from: "upsell", to: "covered", label: "Covered devices" },
    { from: "covered", to: "upsell" },
  ],
}
