import type { LeaderboardMetric } from "@expert/app-config/types";

import { createSimpleStore } from "@expert/state-utils";

interface LeaderboardSelectionState {
    /** Selected leaderboard metric, or null to fall back to the partner's first leaderboard. */
    metric: LeaderboardMetric | null;
    setMetric: (metric: LeaderboardMetric) => void;
}

/**
 * Shared selection for the off-call leaderboard, so the Expert Hub summary card's rank and the
 * slide-in standings panel (`LeaderboardWidget`) stay on the same metric — they live far apart in the
 * tree, so a store beats threading the selection through both slots.
 */
export const useLeaderboardSelectionStore = createSimpleStore<LeaderboardSelectionState>({
    devtools: {
        store: "leaderboard-selection",
        name: "expert-hub/leaderboard-selection",
        // PROTOTYPE DEVIATION: upstream reads `import.meta.env.VITE_ENV_TYPE === "production"`,
        // which is a Vite-only global unavailable under Next/Turbopack. See prototype/DEVIATIONS.md.
        isProd: false,
    },
})((set) => ({
    metric: null,
    setMetric: (metric) => set({ metric }),
}));
