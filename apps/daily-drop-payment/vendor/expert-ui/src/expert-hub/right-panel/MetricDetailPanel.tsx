import { Skeleton, Stack, Text } from "@mantine/core";

import type { PayMetrics } from "../data/types";

import { TRANSFER_RATE_TARGET } from "../cards/targets";
import { METRIC_KEYS } from "../data/metricKeys";
import { getMetricValue } from "../data/utils";
import styles from "./MetricDetailPanel.module.css";

interface SupportingStat {
    label: string;
    value: string;
}

interface Props {
    payMetrics: PayMetrics | null;
    isLoading: boolean;
}

function getSupportingStats(payMetrics: PayMetrics | null): SupportingStat[] {
    if (!payMetrics) return [];

    const { serve, solve } = payMetrics.totals;
    const stats: SupportingStat[] = [];
    const ocr = solve[METRIC_KEYS.solve.OCR];
    if (ocr != null) {
        stats.push({ label: "Resolution rate", value: `${(ocr.calc * 100).toFixed(0)}%` });
    }
    const crt = serve[METRIC_KEYS.serve.CRT];
    if (crt != null) {
        stats.push({ label: "Call resolution time", value: `${Math.round(crt.calc)}s` });
    }
    return stats;
}

export function MetricDetailPanel({ payMetrics, isLoading }: Props) {
    const raw = payMetrics ? getMetricValue(payMetrics.totals.solve, METRIC_KEYS.solve.TRANSFER_RATE) : null;
    const value = raw !== null ? raw * 100 : null;
    const hasValue = value !== null;
    const supportingStats = getSupportingStats(payMetrics);

    return (
        <Stack gap={0}>
            <Stack gap={4} className={styles.primary}>
                <Text className={styles.metricLabel}>Transfer rate</Text>
                <Text className={styles.metricSubtitle}>Share of calls transferred out</Text>

                {isLoading ? (
                    <Skeleton height={42} width={120} radius="sm" mt="sm" />
                ) : hasValue ? (
                    <Text className={styles.bigValue}>
                        {value.toFixed(0)}
                        <Text component="span" className={styles.bigValueUnit}>
                            {" "}
                            %
                        </Text>
                    </Text>
                ) : (
                    <Text className={styles.emptyValue}>No data available yet.</Text>
                )}

                <Text className={styles.target}>Target: {TRANSFER_RATE_TARGET}% or lower</Text>
            </Stack>

            {!isLoading && supportingStats.length > 0 && (
                <Stack gap={0} className={styles.supporting}>
                    <Text className={styles.supportingHeader}>Supporting stats</Text>
                    {supportingStats.map((stat) => (
                        <div key={stat.label} className={styles.statRow}>
                            <Text className={styles.statLabel}>{stat.label}</Text>
                            <Text className={styles.statValue}>{stat.value}</Text>
                        </div>
                    ))}
                </Stack>
            )}
        </Stack>
    );
}
