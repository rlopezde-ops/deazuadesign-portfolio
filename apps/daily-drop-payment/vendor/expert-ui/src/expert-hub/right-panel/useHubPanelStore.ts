import { createSimpleStore } from "@expert/state-utils";

/** Which off-call expanded panel the right rail is showing (`null` = the default schedule). */
export type HubPanelView = "leaderboard" | "assist" | "transfer-rate" | "today-sales" | "pay-detail";

interface OffCallPanelState {
    view: HubPanelView | null;
    togglePanel: (view: HubPanelView) => void;
    closePanel: () => void;
}

/**
 * Controls the hub's right slide-in panel. The triggers live deep inside the Expert Hub (leaderboard
 * card, floating assist button) while the consumer (`HubRightPanel`) sits elsewhere in the tree, so a
 * store beats threading callbacks + lifted state through several layers.
 *
 * Off-call the panel shows the schedule by default (`view === null`) when open; the layout collapses it
 * to the full-width hub when there's no shift (see `useWorkspaceHomeState`). `togglePanel` swaps to a
 * view; toggling the same trigger again (or `closePanel`) returns to the schedule.
 */
export const useHubPanelStore = createSimpleStore<OffCallPanelState>({
    devtools: {
        store: "hub-right-panel",
        name: "expert-hub/right-panel",
        // PROTOTYPE DEVIATION: upstream reads `import.meta.env.VITE_ENV_TYPE === "production"`,
        // which is a Vite-only global and throws under Next/Turbopack. See prototype/DEVIATIONS.md.
        isProd: false,
    },
})((set) => ({
    view: null,
    togglePanel: (view) => set((state) => ({ view: state.view === view ? null : view })),
    closePanel: () => set({ view: null }),
}));
