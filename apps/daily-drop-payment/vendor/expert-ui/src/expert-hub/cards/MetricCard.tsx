import type { KeyboardEvent, ReactNode } from "react";

import { Box, Card, Group, Skeleton, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconAlertTriangle } from "@tabler/icons-react";
import clsx from "clsx";

import type { MetricTone } from "./targetProgress";

import { activateOnKey } from "./activateOnKey";
import cardContentStyles from "./cardContent.module.css";
import styles from "./metricCard.module.css";

const TONE_CLASS: Record<MetricTone, string> = {
    positive: styles.tonePositive,
    warning: styles.toneWarning,
    negative: styles.toneNegative,
};

// On-track needs no glyph; the two off-target tones lead with a warning icon (per the pill spec).
const TONE_ICON: Partial<Record<MetricTone, typeof IconAlertTriangle>> = {
    warning: IconAlertTriangle,
    negative: IconAlertCircle,
};

// Shared copy for a failed/missing fetch. Centralized so every metric card reads the same word
// (design note: sales used to say "No sales yet." while its siblings said "Unavailable").
const ERROR_VALUE = "Unavailable";

interface Props {
    title: string;
    /** PROTOTYPE DEVIATION: Serve / Solve / Sell category label shown above the metric name. */
    category?: string;
    value: ReactNode;
    footer: ReactNode;
    isLoading: boolean;
    /** The fetch failed or returned no usable data — renders the red error state. Takes priority over isEmpty. */
    isError?: boolean;
    isEmpty: boolean;
    /** Placeholder for the neutral empty state (data loaded, nothing to show). Omit for cards that only ever error. */
    emptyValue?: ReactNode;
    status?: string;
    tone?: MetricTone;
    delta?: string;
    /** When false, render {footer} bare (no "Target: " prefix) for cards without a hard target. */
    showTargetLabel?: boolean;
    /** When provided, the card becomes a button that opens its detail panel. */
    onClick?: () => void;
    /**
     * PROTOTYPE DEVIATION: optional cake illustration path (e.g. `/cakes/love.png`).
     * Renders bottom-right, cropped by `.root { overflow: hidden }`.
     */
    illustration?: string;
    /** PROTOTYPE DEVIATION: optical-balance variant for differently framed cake assets. */
    illustrationVariant?: "love" | "quality" | "sales";
}

export function MetricCard({
    title,
    category,
    value,
    footer,
    isLoading,
    isError = false,
    isEmpty,
    emptyValue,
    status,
    tone,
    delta,
    showTargetLabel = true,
    onClick,
    illustration,
    illustrationVariant,
}: Props) {
    let valueRow: ReactNode;
    if (isLoading) {
        valueRow = <Skeleton height={42} width={120} radius="sm" />;
    } else if (isError) {
        valueRow = <Text className={cardContentStyles.errorState}>{ERROR_VALUE}</Text>;
    } else if (isEmpty) {
        valueRow = <Text className={cardContentStyles.emptyState}>{emptyValue}</Text>;
    } else {
        valueRow = <Box className={styles.value}>{value}</Box>;
    }

    // Status pill lives top-right in the card head; only meaningful once the card has real data.
    const ToneIcon = tone ? TONE_ICON[tone] : undefined;
    const statusBadge =
        !isLoading && !isError && !isEmpty && status && tone ? (
            <Text component="span" className={clsx(styles.statusBadge, TONE_CLASS[tone])}>
                {ToneIcon && <ToneIcon size={14} stroke={2.5} aria-hidden />}
                {status}
            </Text>
        ) : null;

    const interactiveProps = onClick
        ? {
              role: "button",
              tabIndex: 0,
              onClick,
              onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => activateOnKey(event, onClick),
          }
        : {};

    const illustrationClass =
        illustrationVariant === "love"
            ? styles.illustrationLove
            : illustrationVariant === "quality"
              ? styles.illustrationQuality
              : illustrationVariant === "sales"
                ? styles.illustrationSales
                : undefined;

    return (
        <Card classNames={{ root: clsx(styles.root, onClick && styles.interactive) }} {...interactiveProps}>
            {/* PROTOTYPE DEVIATION: decorative cake illustration, cropped off bottom-right. */}
            {illustration ? (
                <img
                    src={illustration}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className={clsx(styles.illustration, illustrationClass)}
                />
            ) : null}
            <Group justify="space-between" align="center" wrap="nowrap" className={clsx(styles.titleRow, styles.content)}>
                {category ? (
                    <div className={styles.labelGroup}>
                        <span className={styles.labelCategory}>{category}</span>
                        <span className={styles.labelSep}>&bull;</span>
                        <span className={styles.labelMetric}>{title}</span>
                    </div>
                ) : (
                    <Title order={3} className={styles.title}>
                        {title}
                    </Title>
                )}
                {statusBadge}
            </Group>
            <Box className={clsx(styles.valueRow, styles.content)}>{valueRow}</Box>
            <Text className={clsx(styles.target, styles.content)}>
                {showTargetLabel ? <>Target: {footer}</> : footer}
            </Text>
            {!isEmpty && !isError && !isLoading && delta && (
                <Text className={clsx(styles.gap, styles.content)}>{delta}</Text>
            )}
        </Card>
    );
}
