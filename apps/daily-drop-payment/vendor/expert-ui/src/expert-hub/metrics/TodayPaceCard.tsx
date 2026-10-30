import { useTodayPacingMetrics } from "@expert/sales-tools";
import { Text } from "@mantine/core";

import sharedStyles from "../cards/cardContent.module.css";
import { MetricCard } from "../cards/MetricCard";
import { computeDirectProgress, computeMetricStatus, computeMetricTone } from "../cards/targetProgress";
import { PACE_TARGET_PERCENT } from "../cards/targets";

/**
 * Real-Time tab: share of calls kept on pace, from the gamification service — updates live.
 * Rendered for every partner with pacing (gated by {@link TodayMetrics}, which owns the column count).
 * Before any sessions land today it shows an empty state ("No calls today") rather than hiding,
 * so the card keeps its place in the grid from the start of shift.
 */
export function TodayPaceCard() {
    const { data, isLoading, isError } = useTodayPacingMetrics();

    // "No calls today" is only honest when we actually have data showing zero sessions (neutral empty
    // state). A failed or missing fetch is the red error state ("Unavailable" from MetricCard), so a
    // service blip doesn't read as an expert with no activity.
    const hasNoSessions = !!data && data.totalSessions === 0;
    const hasError = !isLoading && (isError || !data);
    const isEmpty = !isLoading && !hasError && hasNoSessions;

    const pct = data && data.totalSessions > 0 ? Math.round(data.onTargetRate * 100) : null;
    const progress = computeDirectProgress(pct, PACE_TARGET_PERCENT);
    const status = pct !== null ? computeMetricStatus(progress) : undefined;
    const tone = pct !== null ? computeMetricTone(progress) : undefined;

    return (
        <MetricCard
            title="On-target call pace"
            isLoading={isLoading}
            isError={hasError}
            isEmpty={isEmpty}
            emptyValue="No calls today"
            value={
                pct !== null ? (
                    <>
                        <Text component="span" className={sharedStyles.bigNumber}>
                            {pct}
                        </Text>
                        <Text component="span" className={sharedStyles.unit}>
                            %
                        </Text>
                    </>
                ) : null
            }
            footer={`${PACE_TARGET_PERCENT}% or higher`}
            status={status}
            tone={tone}
        />
    );
}
