// PROTOTYPE DEVIATION — progress line, action line, how-it-works, rate-accelerator
// model for net enrolls. See prototype/DEVIATIONS.md.

import { Group, Skeleton, Stack, Text } from "@mantine/core";
import { IconAlertCircle, IconAlertTriangle } from "@tabler/icons-react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

import type { MetricTone } from "../cards/targetProgress";
import type { MetricPayConfig, PayableMetricKey } from "../data/payTiers";
import type { MetricBucket, PayMetrics } from "../data/types";

import { computeDirectProgress, computeInverseProgress, computeMetricStatus, computeMetricTone } from "../cards/targetProgress";
import { CUSTOMER_RATING_ERP_TARGET, CUSTOMER_RATING_NPS_TARGET, SALES_TARGET, TRANSFER_RATE_TARGET } from "../cards/targets";
import { PAY_CONFIG, computeRateTotal, getCurrentTier, getDeltaToNext, getGapToNext, getNextTier, getTierName } from "../data/payTiers";
import { METRIC_KEYS } from "../data/metricKeys";
import { getMetricPayout, getMetricPrev, getMetricValue } from "../data/utils";
import styles from "./PayDetailPanel.module.css";

// ─── Tone → CSS class maps ─────────────────────────────────────────────────────

const BADGE_CLASS: Record<MetricTone, string> = {
    positive: styles.badgePositive,
    warning: styles.badgeWarning,
    negative: styles.badgeNegative,
};

const PAY_TONE_CLASS: Record<MetricTone, string> = {
    positive: styles.tonePositive,
    warning: styles.toneWarning,
    negative: styles.toneNegative,
};

const BADGE_ICON: Partial<Record<MetricTone, typeof IconAlertTriangle>> = {
    warning: IconAlertTriangle,
    negative: IconAlertCircle,
};

// ─── Per-metric display config ─────────────────────────────────────────────────

interface SupportingMetricConfig {
    bucket: "serve" | "solve" | "sell";
    bucketKey: string;
    label: string;
    formatValue: (calc: number) => string;
}

interface MetricDisplayConfig {
    label: string;
    category: string;
    bucket: "serve" | "solve" | "sell";
    bucketKey: string;
    formatValue: (calc: number) => string;
    unit: string;
    computeProgress: (calc: number) => number;
    formatTarget: () => string;
    formatDelta: (calc: number, prev: number | null) => string;
    illustration: string;
    supportingMetrics: SupportingMetricConfig[];
}

const DISPLAY_CONFIG: Record<PayableMetricKey, MetricDisplayConfig> = {
    erp: {
        label: "ERP",
        category: "Serve",
        bucket: "serve",
        bucketKey: METRIC_KEYS.serve.ERP,
        formatValue: (c) => c.toFixed(1),
        unit: "%",
        computeProgress: (c) => computeDirectProgress(c, CUSTOMER_RATING_ERP_TARGET),
        formatTarget: () => `${CUSTOMER_RATING_ERP_TARGET}% or higher`,
        formatDelta: (c, prev) => {
            if (prev === null) return "";
            const diff = c - prev;
            const sign = diff >= 0 ? "+" : "";
            return `${sign}${diff.toFixed(1)}% vs last week`;
        },
        illustration: "/cakes/love.png",
        supportingMetrics: [
            { bucket: "serve", bucketKey: METRIC_KEYS.serve.VERBATIM, label: "Verbatim", formatValue: (c) => c.toFixed(1) },
            { bucket: "serve", bucketKey: METRIC_KEYS.serve.FCR, label: "First call resolution", formatValue: (c) => `${c.toFixed(1)}%` },
        ],
    },
    "expert-5star": {
        label: "Expert 5 Star",
        category: "Serve",
        bucket: "serve",
        bucketKey: METRIC_KEYS.serve.EXPERT_5STAR,
        formatValue: (c) => c.toFixed(1),
        unit: "",
        computeProgress: (c) => computeDirectProgress(c, CUSTOMER_RATING_NPS_TARGET),
        formatTarget: () => `${CUSTOMER_RATING_NPS_TARGET} or higher`,
        formatDelta: (c, prev) => {
            if (prev === null) return "";
            const diff = c - prev;
            const sign = diff >= 0 ? "+" : "";
            return `${sign}${diff.toFixed(1)} vs last week`;
        },
        illustration: "/cakes/love.png",
        supportingMetrics: [
            { bucket: "serve", bucketKey: METRIC_KEYS.serve.VERBATIM, label: "Verbatim", formatValue: (c) => c.toFixed(1) },
            { bucket: "serve", bucketKey: METRIC_KEYS.serve.FCR, label: "First call resolution", formatValue: (c) => `${c.toFixed(1)}%` },
        ],
    },
    "transfer-rate": {
        label: "Transfer rate",
        category: "Solve",
        bucket: "solve",
        bucketKey: METRIC_KEYS.solve.TRANSFER_RATE,
        formatValue: (c) => (c * 100).toFixed(0),
        unit: "%",
        computeProgress: (c) => computeInverseProgress({ actual: c * 100, target: TRANSFER_RATE_TARGET }),
        formatTarget: () => `${TRANSFER_RATE_TARGET}% or lower`,
        formatDelta: (c, prev) => {
            if (prev === null) return "";
            const diff = (c - prev) * 100;
            const sign = diff >= 0 ? "+" : "";
            return `${sign}${diff.toFixed(0)}% vs last week`;
        },
        illustration: "/cakes/quality.png",
        supportingMetrics: [
            { bucket: "serve", bucketKey: METRIC_KEYS.serve.CRT, label: "CRT", formatValue: (c) => `${Math.round(c)}s` },
            { bucket: "solve", bucketKey: METRIC_KEYS.solve.CALL_PACING, label: "Call pacing", formatValue: (c) => `${Math.round(c)}%` },
        ],
    },
    "net-enrolls": {
        label: "Net sales",
        category: "Sell",
        bucket: "sell",
        bucketKey: METRIC_KEYS.sell.NET_ENROLLS,
        formatValue: (c) => String(Math.round(c)),
        unit: "",
        computeProgress: (c) => computeDirectProgress(c, SALES_TARGET),
        formatTarget: () => `${SALES_TARGET} sales`,
        formatDelta: (c, prev) => {
            if (prev === null) return "";
            const diff = Math.round(c) - Math.round(prev);
            const sign = diff >= 0 ? "+" : "";
            return `${sign}${diff} vs last week`;
        },
        illustration: "/cakes/sales.png",
        supportingMetrics: [
            { bucket: "sell", bucketKey: METRIC_KEYS.sell.TRANSFERS, label: "Transfers", formatValue: (c) => String(Math.round(c)) },
        ],
    },
};

// ─── Action-line builder ──────────────────────────────────────────────────────

function buildActionLine(
    payConfig: MetricPayConfig,
    calcNormalized: number,
    metricKey: PayableMetricKey,
): string | null {
    const next = getNextTier(payConfig, calcNormalized);
    const delta = getDeltaToNext(payConfig, calcNormalized);
    if (!next || delta === null) return null;

    const nextName = getTierName(next.tier, payConfig.tiers.length);

    if (metricKey === "net-enrolls") {
        const gap = getGapToNext(payConfig, calcNormalized);
        const salesWord = gap === 1 ? "sale" : "sales";
        return `Make ${gap} more ${salesWord} → +$${delta.toLocaleString()} (${nextName})`;
    }

    if (metricKey === "transfer-rate") {
        return `Get under ${next.threshold}% → +$${delta.toLocaleString()} (${nextName})`;
    }

    return `Hit ${next.threshold}% → +$${delta.toLocaleString()} (${nextName})`;
}

// ─── How-it-works text ────────────────────────────────────────────────────────

function buildHowItWorks(
    payConfig: MetricPayConfig,
    currentTier: ReturnType<typeof getCurrentTier>,
    calcNormalized: number,
    metricKey: PayableMetricKey,
): string {
    const totalTiers = payConfig.tiers.length;

    if (payConfig.model === "rate") {
        const rate = currentTier?.rate ?? 0;
        const count = Math.round(calcNormalized);
        const total = count * rate;
        const next = getNextTier(payConfig, calcNormalized);
        if (next?.rate && currentTier) {
            return `You earn a set amount per sale, and it climbs as you sell more — the higher rate pays out on every sale this period. You're at $${rate}/sale (${count} sales = $${total.toLocaleString()}). Reach ${next.threshold} sales for $${next.rate}/sale = $${(next.threshold * next.rate).toLocaleString()}.`;
        }
        if (currentTier) {
            return `You earn a set amount per sale, and it climbs as you sell more — the higher rate pays out on every sale this period. You're at $${rate}/sale (${count} sales = $${total.toLocaleString()}). Top rate reached.`;
        }
        return `You earn a set amount per sale, and it climbs as you sell more — the higher rate pays out on every sale this period.`;
    }

    const currentName = currentTier ? getTierName(currentTier.tier, totalTiers) : null;
    const currentPayout = currentTier?.payout ?? 0;
    const next = getNextTier(payConfig, calcNormalized);

    if (currentTier && next) {
        const nextName = getTierName(next.tier, totalTiers);
        if (metricKey === "transfer-rate") {
            return `You earn a fixed bonus at each level — get under the next threshold to earn more. You're at ${currentName} ($${currentPayout.toLocaleString()}). Get under ${next.threshold}% to reach ${nextName} ($${next.payout.toLocaleString()}).`;
        }
        return `You earn a fixed bonus at each level — cross the next threshold to earn more. You're at ${currentName} ($${currentPayout.toLocaleString()}). Reach ${next.threshold}% to jump to ${nextName} ($${next.payout.toLocaleString()}).`;
    }
    if (currentTier) {
        return `You earn a fixed bonus at each level. You're at ${currentName} ($${currentPayout.toLocaleString()}) — top level reached.`;
    }
    const first = payConfig.tiers[0];
    if (first) {
        const firstName = getTierName(first.tier, totalTiers);
        if (metricKey === "transfer-rate") {
            return `You earn a fixed bonus at each level. Get under ${first.threshold}% to unlock ${firstName} ($${first.payout.toLocaleString()}).`;
        }
        return `You earn a fixed bonus at each level. Reach ${first.threshold}% to unlock ${firstName} ($${first.payout.toLocaleString()}).`;
    }
    return "You earn a fixed bonus at each level.";
}

// ─── Tier display helpers (matched to Card Flip payModel.ts) ─────────────────

function formatTierThreshold(config: MetricPayConfig, tier: { threshold: number }): string {
    if (config.model === "rate") return `${tier.threshold}+ sales`;
    if (!config.higherIsBetter) return `≤${tier.threshold}${config.gapUnit}`;
    return `${tier.threshold}${config.gapUnit}`;
}

function formatTierAmount(config: MetricPayConfig, tier: { payout: number; rate?: number }): string {
    if (config.model === "rate") return `$${tier.rate ?? 0}/sale`;
    return `$${tier.payout.toLocaleString()}`;
}

// ─── Progress line (matched to Card Flip PayDetailBack) ──────────────────────

function TierProgressLine({
    payConfig,
    currentTier,
}: {
    payConfig: MetricPayConfig;
    currentTier: ReturnType<typeof getCurrentTier>;
}) {
    const { tiers } = payConfig;
    const totalTiers = tiers.length;

    const currentIdx = currentTier ? tiers.findIndex((t) => t.tier === currentTier.tier) : -1;
    const fillPct = currentIdx >= 0 ? ((2 * currentIdx + 1) / (2 * totalTiers)) * 100 : 0;

    const tierScrollRef = useRef<HTMLDivElement>(null);
    const [fadeRight, setFadeRight] = useState(false);
    const [fadeLeft, setFadeLeft] = useState(false);

    useEffect(() => {
        const el = tierScrollRef.current;
        if (!el) return;
        const check = () => {
            const gap = el.scrollWidth - el.clientWidth;
            setFadeRight(gap > 20 && el.scrollLeft + el.clientWidth + 4 < el.scrollWidth);
            setFadeLeft(gap > 20 && el.scrollLeft > 4);
        };
        check();
        el.addEventListener("scroll", check, { passive: true });
        const ro = new ResizeObserver(check);
        ro.observe(el);
        return () => { el.removeEventListener("scroll", check); ro.disconnect(); };
    }, []);

    return (
        <div className={clsx(styles.tierContainer, fadeRight && styles.tierFadeRight, fadeLeft && styles.tierFadeLeft)}>
            <div ref={tierScrollRef} className={styles.tierScroll}>
                <div className={styles.tierLabelRow}>
                    {tiers.map((tier) => {
                        const isActive = currentTier?.tier === tier.tier;
                        return (
                            <div
                                key={tier.tier}
                                className={clsx(styles.tierItem, isActive && styles.tierItemActive)}
                            >
                                <span className={styles.tierName}>{getTierName(tier.tier, totalTiers)}</span>
                                <span className={styles.tierAmount}>{formatTierAmount(payConfig, tier)}</span>
                                <span className={styles.tierThreshold}>{formatTierThreshold(payConfig, tier)}</span>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.trackRow}>
                    {currentIdx >= 0 && <div className={styles.trackFill} style={{ width: `${fillPct}%` }} />}
                    {tiers.map((tier) => {
                        const isActive = currentTier?.tier === tier.tier;
                        return (
                            <div
                                key={tier.tier}
                                className={clsx(styles.trackDot, isActive && styles.trackDotActive)}
                            >
                                {isActive && (
                                    <span className={styles.youreHere}>You're here</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ─── Supporting metrics row ───────────────────────────────────────────────────

function SupportingMetricRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <Group justify="space-between" align="center" wrap="nowrap" className={styles.supportingRow}>
            <Text className={styles.supportingLabel}>{label}</Text>
            <Text className={styles.supportingValue}>{value}</Text>
        </Group>
    );
}

// ─── Main component ────────────────────────────────────────────────────────────

interface Props {
    payMetrics: PayMetrics | null;
    metricKey: PayableMetricKey | null;
    isLoading: boolean;
}

export function PayDetailPanel({ payMetrics, metricKey, isLoading }: Props) {
    if (!metricKey) return null;

    const display = DISPLAY_CONFIG[metricKey];
    const payConfig: MetricPayConfig = PAY_CONFIG[metricKey];

    const totals = payMetrics?.totals;
    const bucket = totals?.[display.bucket] as MetricBucket | undefined;
    const calc = getMetricValue(bucket, display.bucketKey);
    const payout = getMetricPayout(bucket, display.bucketKey);
    const prev = getMetricPrev(bucket, display.bucketKey);

    const hasData = calc !== null;
    const hasPay = payout !== null && payout > 0;

    const progress = hasData ? display.computeProgress(calc) : 0;
    const status = hasData ? computeMetricStatus(progress) : undefined;
    const tone = hasData ? computeMetricTone(progress) : undefined;

    const calcNormalized = hasData ? calc * payConfig.calcMultiplier : 0;
    const currentTier = hasData ? getCurrentTier(payConfig, calcNormalized) : null;

    const isRate = payConfig.model === "rate";
    const perSaleRate = isRate && currentTier?.rate ? currentTier.rate : null;

    const actionLine = hasData ? buildActionLine(payConfig, calcNormalized, metricKey) : null;
    const howItWorks = hasData ? buildHowItWorks(payConfig, currentTier, calcNormalized, metricKey) : null;

    const ToneIcon = tone ? BADGE_ICON[tone] : undefined;

    const supportingValues = display.supportingMetrics.map((sm) => {
        const smBucket = totals?.[sm.bucket] as MetricBucket | undefined;
        const smCalc = getMetricValue(smBucket, sm.bucketKey);
        return {
            label: sm.label,
            value: smCalc !== null ? sm.formatValue(smCalc) : "—",
        };
    });

    return (
        <Stack gap={0}>
            {/* ── Block 1: Metric ── */}
            <Stack gap={0} className={styles.block}>
                <img src={display.illustration} alt="" aria-hidden="true" draggable={false} className={styles.illustration} />

                {/* PROTOTYPE DEVIATION: compound category heading (Serve • ERP) */}
                <Group justify="space-between" align="center" wrap="nowrap" mb={4}>
                    <div className={styles.labelGroup}>
                        <span className={styles.labelCategory}>{display.category}</span>
                        <span className={styles.labelSep}>&bull;</span>
                        <span className={styles.labelMetric}>{display.label}</span>
                    </div>
                    {!isLoading && status && tone && (
                        <Text component="span" className={clsx(styles.statusBadge, BADGE_CLASS[tone])}>
                            {ToneIcon && <ToneIcon size={14} stroke={2.5} aria-hidden />}
                            {status}
                        </Text>
                    )}
                </Group>

                {isLoading ? (
                    <Skeleton height={42} width={120} radius="sm" mt={4} mb={4} />
                ) : hasData ? (
                    <Text component="div" className={styles.bigValue}>
                        {display.formatValue(calc)}
                        {display.unit && (
                            <Text component="span" className={styles.bigValueUnit}>
                                {" "}
                                {display.unit}
                            </Text>
                        )}
                    </Text>
                ) : (
                    <Text c="dimmed" fz="sm" mt={4}>
                        No data available yet.
                    </Text>
                )}

                {!isLoading && (
                    <Text className={styles.target} mt={2}>
                        {display.formatTarget()}
                    </Text>
                )}
                {!isLoading && hasData && (
                    <Text className={styles.delta}>{display.formatDelta(calc, prev)}</Text>
                )}
            </Stack>

            {/* ── Block 2: Supporting Metrics ── */}
            {!isLoading && hasData && supportingValues.length > 0 && (
                <Stack gap={0} className={clsx(styles.block, styles.blockSupporting)}>
                    <Text className={styles.supportingHeading}>Supporting metrics</Text>
                    {supportingValues.map((sv) => (
                        <SupportingMetricRow key={sv.label} label={sv.label} value={sv.value} />
                    ))}
                </Stack>
            )}

            {/* ── Block 3: Pay + Tier ── */}
            {!isLoading && (
                <Stack gap={0} className={clsx(styles.block, styles.blockPay)}>
                    {hasPay ? (
                        <>
                            <Text className={styles.payLabel}>Earned this period</Text>
                            <Text
                                component="div"
                                className={clsx(styles.payAmount, tone && PAY_TONE_CLASS[tone])}
                            >
                                ${payout.toLocaleString()}
                            </Text>

                            {isRate && perSaleRate !== null && (
                                <Text className={styles.rateSubtext}>
                                    ${perSaleRate}/sale × {Math.round(calcNormalized)} sales
                                </Text>
                            )}

                            {actionLine ? (
                                <Text className={styles.actionLine}>{actionLine}</Text>
                            ) : (
                                <Text className={styles.topTierText}>
                                    {isRate
                                        ? `Top rate — $${perSaleRate}/sale`
                                        : "Max bonus earned"}
                                </Text>
                            )}

                            <TierProgressLine payConfig={payConfig} currentTier={currentTier} />

                            {howItWorks && (
                                <Text className={styles.howItWorks}>{howItWorks}</Text>
                            )}
                        </>
                    ) : hasData ? (
                        <>
                            <Text className={styles.payLabel}>Earned this period</Text>
                            <Text component="div" className={styles.payAmount}>$0</Text>

                            {(() => {
                                const first = payConfig.tiers[0];
                                if (!first) return null;
                                const firstName = getTierName(first.tier, payConfig.tiers.length);
                                if (metricKey === "transfer-rate") {
                                    return <Text className={styles.actionLine}>Get under {first.threshold}% → +${first.payout.toLocaleString()} ({firstName})</Text>;
                                }
                                if (metricKey === "net-enrolls") {
                                    const salesWord = first.threshold === 1 ? "sale" : "sales";
                                    const total = first.threshold * (first.rate ?? 0);
                                    return <Text className={styles.actionLine}>Make {first.threshold} {salesWord} → +${total.toLocaleString()} ({firstName})</Text>;
                                }
                                return <Text className={styles.actionLine}>Hit {first.threshold}% → +${first.payout.toLocaleString()} ({firstName})</Text>;
                            })()}

                            <TierProgressLine payConfig={payConfig} currentTier={null} />

                            {howItWorks && (
                                <Text className={styles.howItWorks}>{howItWorks}</Text>
                            )}
                        </>
                    ) : (
                        <Text c="dimmed" fz="xs">
                            Pay data unavailable
                        </Text>
                    )}
                </Stack>
            )}
        </Stack>
    );
}
