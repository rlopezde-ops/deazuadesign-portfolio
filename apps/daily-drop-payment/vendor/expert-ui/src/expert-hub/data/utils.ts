import type { MetricBucket } from "./types";

export function getMetricValue(bucket: MetricBucket | null | undefined, key: string): number | null {
    return bucket?.[key]?.calc ?? null;
}

export function getMetricPayout(bucket: MetricBucket | null | undefined, key: string): number | null {
    const entry = bucket?.[key];
    if (!entry) return null;
    return entry.payout;
}

export function getMetricPrev(bucket: MetricBucket | null | undefined, key: string): number | null {
    return bucket?.[key]?.prev ?? null;
}
