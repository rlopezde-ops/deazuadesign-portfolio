export interface CustomerRatingMetricsView {
    recentRating: number | null;
    isLoading: boolean;
    isError: boolean;
}

export interface ResolutionTimeMetricsView {
    callResolutionTimeSeconds: number | null;
    isLoading: boolean;
    isError: boolean;
}

export interface TransferRateMetricsView {
    /** Transfer rate as a decimal fraction (0–1). `null` = no data. */
    transferRate: number | null;
    isLoading: boolean;
    isError: boolean;
}

export interface SalesMetricsView {
    /** `null` = no metrics returned; `0` = had calls but no sales. */
    sales: number | null;
    isLoading: boolean;
    isError: boolean;
}

// ---------- Pay metrics (v1/pay-metrics) ----------

export interface MetricCalcEntry {
    calc: number;
    payout: number;
    /** PROTOTYPE DEVIATION: previous pay-period value for week-over-week comparison. */
    prev?: number;
}

export type MetricBucket = Record<string, MetricCalcEntry>;

export interface ClientMetrics {
    serve: MetricBucket;
    solve: MetricBucket;
    sell: MetricBucket;
}

export interface PayMetrics {
    createdOn: string | null;
    modifiedOn: string | null;
    totals: ClientMetrics;
    clients?: Record<string, ClientMetrics>;
}

// ---------- Schedule (v1/schedule) ----------

export type ScheduleBlockStatus = "BREAK" | "LUNCH" | "MEETING" | "TRAINING" | "UNKNOWN";

export interface ScheduleBlock {
    /** ISO-8601 UTC. */
    startTime: string;
    /** ISO-8601 UTC. */
    endTime: string;
    status: ScheduleBlockStatus;
    durationMinutes: number;
    /** Raw Aspect label (e.g. "Team huddle", "Cancelled Glow Huddle"); used as the event title when non-blank, for any status. */
    label: string;
}

export interface ScheduleResponse {
    employeeId: string;
    /** YYYY-MM-DD (the queried business day). */
    date: string;
    /** ISO-8601 UTC; `null` when there's no shift. Available/working time is the span between blocks. */
    workStart: string | null;
    workEnd: string | null;
    blocks: ScheduleBlock[];
}
