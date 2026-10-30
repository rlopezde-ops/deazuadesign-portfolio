import type { LeaderboardMetric } from "@expert/app-config/types";

import { useMemo } from "react";

import { useSalesContext } from "../../../../sales-context/SalesContext";
import { useLeaderboard } from "./useLeaderboard";

export interface LeaderboardStanding {
    /** The current expert's 1-based position on the leaderboard, or null if they aren't ranked yet. */
    rank: number | null;
    /** Total participants on the leaderboard, or null while loading / unavailable. */
    total: number | null;
    isLoading: boolean;
}

/**
 * The current expert's standing (rank + field size) for a leaderboard metric — e.g. "#3 of 25".
 * Reads the same ranked data as {@link Leaderboard}; the entry's `order` is the 0-based rank.
 */
export function useLeaderboardStanding(metric: LeaderboardMetric, sku?: string): LeaderboardStanding {
    const { employeeId } = useSalesContext();
    const { data, isLoading } = useLeaderboard(metric, sku);
    const self = data?.find((entry) => entry.employeeId === employeeId);

    // Memoized so consumers can safely list this result in effect/memo dependency arrays.
    return useMemo(
        () => ({
            rank: self ? self.order + 1 : null,
            total: data?.length ?? null,
            isLoading,
        }),
        [self, data, isLoading],
    );
}
