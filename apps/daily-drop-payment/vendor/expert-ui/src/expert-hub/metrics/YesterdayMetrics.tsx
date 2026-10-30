// PROTOTYPE DEVIATION — pay-period total banner above grid. See prototype/DEVIATIONS.md.

import { SimpleGrid, Text } from "@mantine/core";
import { useEffect, useMemo, useRef } from "react";

import { useLogger } from "@/sdk";

import { CustomerRatingCard } from "../cards/CustomerRatingCard";
import { SalesCard } from "../cards/SalesCard";
import { TransferRateCard } from "../cards/TransferRateCard";
import { METRIC_KEYS } from "../data/metricKeys";
import { usePayMetrics } from "../data/usePayMetrics";
import { getMetricPayout, getMetricValue } from "../data/utils";
import { useHubPanelStore } from "../right-panel/useHubPanelStore";
import { usePayDetailStore } from "../right-panel/usePayDetailStore";
import styles from "./yesterdayMetrics.module.css";

export function YesterdayMetrics() {
    const { payMetrics, isLoading, isError } = usePayMetrics();
    const view = useHubPanelStore((s) => s.view);
    const togglePanel = useHubPanelStore((s) => s.togglePanel);
    const setMetricKey = usePayDetailStore((s) => s.setMetricKey);

    const openPayDetail = (key: Parameters<typeof setMetricKey>[0]) => {
        setMetricKey(key);
        if (view !== "pay-detail") togglePanel("pay-detail");
    };
    const logger = useLogger({ module: "YesterdayMetrics" });
    const hasCheckedMetrics = useRef(false);

    const { serveCalc, serveMetricType, solveCalc, sellCalc, hasTransferRateSupporting, totalPayout } = useMemo(() => {
        const totals = payMetrics?.totals;
        const erpCalc = totals ? getMetricValue(totals.serve, METRIC_KEYS.serve.ERP) : null;
        const expertStarCalc = totals ? getMetricValue(totals.serve, METRIC_KEYS.serve.EXPERT_5STAR) : null;

        const erpPayout = totals ? getMetricPayout(totals.serve, METRIC_KEYS.serve.ERP) : null;
        const trPayout = totals ? getMetricPayout(totals.solve, METRIC_KEYS.solve.TRANSFER_RATE) : null;
        const nePayout = totals ? getMetricPayout(totals.sell, METRIC_KEYS.sell.NET_ENROLLS) : null;

        return {
            serveCalc: erpCalc ?? expertStarCalc,
            serveMetricType: erpCalc !== null ? ("entireRepPerformance" as const) : ("fiveStarRating" as const),
            solveCalc: totals ? getMetricValue(totals.solve, METRIC_KEYS.solve.TRANSFER_RATE) : null,
            sellCalc: totals ? getMetricValue(totals.sell, METRIC_KEYS.sell.NET_ENROLLS) : null,
            hasTransferRateSupporting:
                totals != null &&
                (totals.solve[METRIC_KEYS.solve.OCR] != null || totals.serve[METRIC_KEYS.serve.CRT] != null),
            totalPayout: (erpPayout ?? 0) + (trPayout ?? 0) + (nePayout ?? 0),
        };
    }, [payMetrics]);

    useEffect(() => {
        if (isLoading || hasCheckedMetrics.current) return;
        hasCheckedMetrics.current = true;
        if (serveCalc == null && solveCalc == null && sellCalc == null) {
            logger.debug({ serveCalc, solveCalc, sellCalc }, "pay-metrics API returned no data for yesterday's stats");
        }
    }, [isLoading, logger, serveCalc, solveCalc, sellCalc]);

    return (
        <>
            {!isLoading && !isError && totalPayout > 0 && (
                <div className={styles.payPeriodBanner}>
                    <Text className={styles.bannerAmount}>
                        You've earned ${totalPayout.toLocaleString()} this pay period
                    </Text>
                    <Text className={styles.bannerSubtext}>Pay period through yesterday</Text>
                </div>
            )}

            <SimpleGrid type="container" cols={{ base: 1, "440px": 2, "680px": 3 }} spacing="md">
                <CustomerRatingCard
                    view={{ recentRating: serveCalc, isLoading, isError }}
                    metricType={serveMetricType}
                    onClick={() => openPayDetail(serveMetricType === "entireRepPerformance" ? "erp" : "expert-5star")}
                />
                <TransferRateCard
                    view={{ transferRate: solveCalc, isLoading, isError }}
                    onClick={() => openPayDetail("transfer-rate")}
                />
                <SalesCard
                    view={{ sales: sellCalc, isLoading, isError }}
                    onClick={() => openPayDetail("net-enrolls")}
                />
            </SimpleGrid>
        </>
    );
}
