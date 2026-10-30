import type { LeaderboardConfig, LeaderboardMetric } from "@expert/app-config/types";

import { Flex, Indicator, Text } from "@mantine/core";
import { type JSX, useState } from "react";

import { getMetricsDateRange } from "../utils/getMetricsDateRange";
import { Leaderboard } from "./Leaderboard";
import { LeaderboardControl } from "./LeaderboardControl";
import classes from "./LeaderboardWidget.module.css";

interface LeaderboardContent {
    controlText: string;
    description: string;
    reminder: string;
}

interface LeaderboardWidgetProps {
    leaderboards: LeaderboardConfig[];
    /**
     * Controlled selected metric. When provided (with `onActiveMetricChange`), selection is owned by
     * the caller so it can be shared (e.g. the Expert Hub summary card); otherwise it's internal.
     */
    activeMetric?: LeaderboardMetric;
    onActiveMetricChange?: (metric: LeaderboardMetric) => void;
}

export function LeaderboardWidget({
    leaderboards,
    activeMetric: controlledActiveMetric,
    onActiveMetricChange,
}: LeaderboardWidgetProps): JSX.Element | null {
    const [internalMetric, setInternalMetric] = useState<LeaderboardMetric>(leaderboards[0]?.metric);

    // No leaderboards configured: render nothing rather than dereferencing an empty metric lookup.
    // LeaderboardWidget is a public export, so callers may pass an empty array.
    if (leaderboards.length === 0) return null;

    const activeMetric = controlledActiveMetric ?? internalMetric;
    const setActiveMetric = onActiveMetricChange ?? setInternalMetric;
    const metricsDateRange = getMetricsDateRange();

    const leaderboardsByMetric = leaderboards.reduce(
        (acc, board) => {
            acc[board.metric] = {
                controlText: board.controlText,
                description: board.description.replace("$METRICS_DATE_RANGE", metricsDateRange),
                reminder: board.reminder,
            };
            return acc;
        },
        {} as Record<LeaderboardMetric, LeaderboardContent>,
    );

    // A controlled activeMetric may not belong to this partner's leaderboards (e.g. a shared/stale
    // selection from a different set); fall back to the first leaderboard so we never dereference an
    // undefined entry, and so the visible board matches the shown copy.
    const effectiveMetric = leaderboardsByMetric[activeMetric] ? activeMetric : leaderboards[0]?.metric;
    const activeLeaderboard = leaderboardsByMetric[effectiveMetric];

    return (
        <Flex className={classes.main} data-testid="leaderboard-widget">
            <Flex direction="column" pt="xxs" pb="xs" px="sm">
                <Flex fw={700} fz="sm" mb="3xs" className={classes.header}>
                    Team leaderboard
                    <Flex pr="3xs" align="center">
                        <Indicator mr="3xs" size={6} processing color="primary.5" />
                        <Text ml="3xs" fz="xxs" c="dark.2">
                            Live
                        </Text>
                    </Flex>
                </Flex>
                {leaderboards.length > 1 && (
                    <LeaderboardControl
                        leaderboards={leaderboards}
                        activeMetric={effectiveMetric}
                        onSetActiveMetric={setActiveMetric}
                    />
                )}
                <Flex c="white" fz="xs" pt="3xs">
                    {activeLeaderboard.description}
                </Flex>
                <Flex c="dark.2" fz="xs">
                    {activeLeaderboard.reminder}
                </Flex>
            </Flex>
            {leaderboards.map((board) => (
                <Leaderboard
                    key={board.metric}
                    isVisible={effectiveMetric === board.metric}
                    metric={board.metric}
                    sku={board.sku}
                />
            ))}
        </Flex>
    );
}
