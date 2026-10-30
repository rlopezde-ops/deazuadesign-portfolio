import { useTotalCallCount } from "@expert/sales-tools";
import { Text } from "@mantine/core";

import sharedStyles from "../cards/cardContent.module.css";
import { MetricCard } from "../cards/MetricCard";

/** Real-Time tab: pay-period call count from the gamification service — updates live during calls. */
export function TodayTotalCallsCard() {
    const { data, isLoading, isError } = useTotalCallCount();
    const callCount = data?.callCount ?? null;
    // Zero calls comes back as callCount: 0 and renders "0"; a null count means the fetch failed or
    // returned nothing, so this card has no neutral empty state — only the error state.
    const hasError = !isLoading && (isError || callCount === null);

    return (
        <MetricCard
            title="Total calls"
            isLoading={isLoading}
            isError={hasError}
            isEmpty={false}
            value={
                <Text component="span" className={sharedStyles.bigNumber}>
                    {callCount}
                </Text>
            }
            footer="No hard target"
            showTargetLabel={false}
        />
    );
}
