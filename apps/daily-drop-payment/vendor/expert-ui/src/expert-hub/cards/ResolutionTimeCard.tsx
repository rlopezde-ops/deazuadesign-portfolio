import { Text } from "@mantine/core";

import type { ResolutionTimeMetricsView } from "../data/types";

import sharedStyles from "./cardContent.module.css";
import { MetricCard } from "./MetricCard";
import styles from "./resolutionTimeCard.module.css";
import { computeInverseProgress, computeMetricStatus, computeMetricTone } from "./targetProgress";
import { CRT_TARGET_SECONDS } from "./targets";

interface Props {
    view: ResolutionTimeMetricsView;
    onClick?: () => void;
}

export function ResolutionTimeCard({ view, onClick }: Props) {
    const crt = view.callResolutionTimeSeconds;
    const hasCrt = crt !== null;

    const progress = computeInverseProgress({ actual: crt, target: CRT_TARGET_SECONDS });
    const status = hasCrt ? computeMetricStatus(progress) : undefined;
    const tone = hasCrt ? computeMetricTone(progress) : undefined;
    const delta = hasCrt
        ? `${Math.abs(crt - CRT_TARGET_SECONDS)}s ${crt > CRT_TARGET_SECONDS ? "above" : "below"} target`
        : undefined;

    return (
        <MetricCard
            title="Quality and efficiency"
            isLoading={view.isLoading}
            isError={view.isError}
            isEmpty={!hasCrt}
            emptyValue="No recent calls."
            value={
                <>
                    <Text component="span" className={sharedStyles.bigNumber}>
                        {crt !== null ? Math.round(crt) : null}
                    </Text>
                    <Text component="span" className={styles.smallNumber}>
                        sec
                    </Text>
                </>
            }
            footer={<>{CRT_TARGET_SECONDS}s or lower</>}
            status={status}
            tone={tone}
            delta={delta}
            onClick={onClick}
        />
    );
}
