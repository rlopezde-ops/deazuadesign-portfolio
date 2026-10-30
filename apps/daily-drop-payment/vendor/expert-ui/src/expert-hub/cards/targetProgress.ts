const isUsableNumber = (n: number | null | undefined): n is number => typeof n === "number" && Number.isFinite(n);

const clampPercent = (value: number): number => Math.max(0, Math.min(100, value));

export function computeDirectProgress(actual: number | null | undefined, target: number): number {
    if (!isUsableNumber(actual) || !isUsableNumber(target) || target <= 0) return 0;
    return clampPercent((actual / target) * 100);
}

interface InverseProgressParams {
    actual: number | null | undefined;
    target: number;
}

export function computeInverseProgress({ actual, target }: InverseProgressParams): number {
    if (!isUsableNumber(actual) || !isUsableNumber(target) || target <= 0) return 0;
    if (actual <= target) return 100;
    return clampPercent((target / actual) * 100);
}

/** Semantic color tone for a metric's status badge (green / gold / red). */
export type MetricTone = "positive" | "warning" | "negative";

// Progress falls into one tier; label and tone are then pure lookups off that tier, so the
// two can never drift apart and the thresholds live in exactly one place.
const ON_TRACK_MIN = 100;
const AT_RISK_MIN = 75;

type MetricTier = "onTrack" | "atRisk" | "offTrack";

function metricTier(progress: number): MetricTier {
    if (progress >= ON_TRACK_MIN) return "onTrack";
    if (progress >= AT_RISK_MIN) return "atRisk";
    return "offTrack";
}

const STATUS_BY_TIER: Record<MetricTier, string> = {
    onTrack: "On track",
    atRisk: "At risk",
    offTrack: "Off track",
};

const TONE_BY_TIER: Record<MetricTier, MetricTone> = {
    onTrack: "positive",
    atRisk: "warning",
    offTrack: "negative",
};

/** Status label for a metric's progress; pairs 1:1 with {@link computeMetricTone} via the shared tier. */
export function computeMetricStatus(progress: number): string {
    return STATUS_BY_TIER[metricTier(progress)];
}

/** Semantic tone for a metric's status badge; pairs 1:1 with {@link computeMetricStatus} via the shared tier. */
export function computeMetricTone(progress: number): MetricTone {
    return TONE_BY_TIER[metricTier(progress)];
}
