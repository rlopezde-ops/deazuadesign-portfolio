import { Text } from "@mantine/core";

import type { SalesMetricsView } from "../data/types";

import styles from "./cardContent.module.css";
import { MetricCard } from "./MetricCard";
import { SALES_TARGET } from "./targets";

interface Props {
    view: SalesMetricsView;
    onClick?: () => void;
}

export function SalesCard({ view, onClick }: Props) {
    const sales = view.sales;
    const hasSales = sales !== null;
    const targetUnit = SALES_TARGET === 1 ? "sale" : "sales";
    return (
        <MetricCard
            title="Net sales"
            category="Sell"
            isLoading={view.isLoading}
            isError={view.isError}
            isEmpty={!hasSales}
            emptyValue="No recent sales data."
            value={
                <Text component="span" className={styles.bigNumber}>
                    {sales}
                </Text>
            }
            footer={
                <>
                    {SALES_TARGET} {targetUnit}
                </>
            }
            onClick={onClick}
            // PROTOTYPE DEVIATION: cake illustration (wallet → net sales)
            illustration="/cakes/sales.png"
            illustrationVariant="sales"
        />
    );
}
