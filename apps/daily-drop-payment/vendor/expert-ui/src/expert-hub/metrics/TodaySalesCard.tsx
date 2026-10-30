import { useTodaySales } from "@expert/sales-tools";
import { Text } from "@mantine/core";

import sharedStyles from "../cards/cardContent.module.css";
import { MetricCard } from "../cards/MetricCard";
import { LIVE_SALES_TARGET } from "../cards/targets";
import { useHubPanelStore } from "../right-panel/useHubPanelStore";

/**
 * Real-Time tab: today's sales count for the logged-in expert, read straight from the gamification
 * sales table. Fetched on mount/tab (no polling), so it carries no LIVE badge; progress is measured
 * against LIVE_SALES_TARGET (at least one sale today).
 */
export function TodaySalesCard() {
    const { data, isLoading, isError } = useTodaySales();
    const togglePanel = useHubPanelStore((s) => s.togglePanel);
    const salesCount = data?.salesCount ?? null;
    // A real zero-sales day comes back as salesCount: 0 and renders "0"; a null count means the fetch
    // failed or returned nothing, so this card has no neutral empty state — only the error state.
    const hasError = !isLoading && (isError || salesCount === null);
    const targetUnit = LIVE_SALES_TARGET === 1 ? "sale" : "sales";

    return (
        <MetricCard
            title="Sales"
            isLoading={isLoading}
            isError={hasError}
            isEmpty={false}
            value={
                <Text component="span" className={sharedStyles.bigNumber}>
                    {salesCount}
                </Text>
            }
            footer={
                <>
                    {LIVE_SALES_TARGET} {targetUnit}
                </>
            }
            onClick={() => togglePanel("today-sales")}
        />
    );
}
