import { Text } from "@mantine/core";

import type { TransferRateMetricsView } from "../data/types";

import styles from "./cardContent.module.css";
import { MetricCard } from "./MetricCard";
import { computeInverseProgress, computeMetricStatus, computeMetricTone } from "./targetProgress";
import { TRANSFER_RATE_TARGET } from "./targets";

interface Props {
    view: TransferRateMetricsView;
    onClick?: () => void;
}

export function TransferRateCard({ view, onClick }: Props) {
    const rate = view.transferRate;
    const hasRate = rate !== null;

    // calc arrives as a decimal fraction (e.g. 0.04 = 4%); convert before comparing to target
    const ratePercent = hasRate ? rate * 100 : null;
    const progress =
        ratePercent !== null ? computeInverseProgress({ actual: ratePercent, target: TRANSFER_RATE_TARGET }) : 0;
    const status = hasRate ? computeMetricStatus(progress) : undefined;
    const tone = hasRate ? computeMetricTone(progress) : undefined;
    return (
        <MetricCard
            title="Transfer rate"
            category="Solve"
            isLoading={view.isLoading}
            isError={view.isError}
            isEmpty={!hasRate}
            emptyValue="No recent call data."
            value={
                <>
                    <Text component="span" className={styles.bigNumber}>
                        {ratePercent !== null ? ratePercent.toFixed(0) : null}
                    </Text>
                    <Text component="span" className={styles.unit}>
                        %
                    </Text>
                </>
            }
            footer={<>{TRANSFER_RATE_TARGET}% or lower</>}
            status={status}
            tone={tone}
            onClick={onClick}
            // PROTOTYPE DEVIATION: cake illustration (shield → transfer rate)
            illustration="/cakes/quality.png"
            illustrationVariant="quality"
        />
    );
}
