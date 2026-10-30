import { Text } from "@mantine/core";

import type { CustomerRatingMetricsView } from "../data/types";

import styles from "./cardContent.module.css";
import { MetricCard } from "./MetricCard";
import { computeDirectProgress, computeMetricStatus, computeMetricTone } from "./targetProgress";
import { CUSTOMER_RATING_ERP_TARGET, CUSTOMER_RATING_NPS_TARGET } from "./targets";

interface Props {
    view: CustomerRatingMetricsView;
    metricType: "fiveStarRating" | "entireRepPerformance";
    onClick?: () => void;
}

export function CustomerRatingCard({ view, metricType, onClick }: Props) {
    const rating = view.recentRating;
    const hasRating = rating !== null;

    const isERP = metricType === "entireRepPerformance";
    const title = isERP ? "ERP" : "Expert 5 Star";
    const target = isERP ? CUSTOMER_RATING_ERP_TARGET : CUSTOMER_RATING_NPS_TARGET;
    const displayValue = rating?.toFixed(1);
    const displayTarget = isERP ? `${target}%` : target;

    const progress = hasRating ? computeDirectProgress(rating, target) : 0;
    const status = hasRating ? computeMetricStatus(progress) : undefined;
    const tone = hasRating ? computeMetricTone(progress) : undefined;
    return (
        <MetricCard
            title={title}
            category="Serve"
            isLoading={view.isLoading}
            isError={view.isError}
            isEmpty={!hasRating}
            emptyValue="No recent reviews."
            value={
                <>
                    <Text component="span" className={styles.bigNumber}>
                        {displayValue}
                    </Text>
                    {isERP && (
                        <Text component="span" className={styles.unit}>
                            %
                        </Text>
                    )}
                </>
            }
            footer={<>{displayTarget} or higher</>}
            status={status}
            tone={tone}
            onClick={onClick}
            // PROTOTYPE DEVIATION: cake illustration (heart → ERP / customer rating)
            illustration="/cakes/love.png"
            illustrationVariant="love"
        />
    );
}
