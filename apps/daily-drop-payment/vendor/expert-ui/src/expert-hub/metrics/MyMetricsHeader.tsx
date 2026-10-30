import { Group, SegmentedControl, Stack, Text, Title } from "@mantine/core";
import dayjs from "dayjs";

import { LiveBadge } from "../cards/LiveBadge";
import styles from "./myMetricsHeader.module.css";

/** Which metrics window the hub is showing: rolling 48-hour (employee API) or live pay-period (gamification). */
export type MetricsTab = "recent" | "realtime";

interface MetricsHeaderProps {
    value: MetricsTab;
    onChange: (tab: MetricsTab) => void;
    modifiedOn: string | null;
}

// PROTOTYPE DEVIATION — "Yesterday" → "Pay period" to match card-flip variant.
const SEGMENT_DATA = [
    { value: "recent", label: "Pay period" },
    { value: "realtime", label: "Today" },
];

function formatRelativeDay(date: string): string {
    const d = dayjs(date);
    const now = dayjs();
    if (d.isSame(now, "day")) return `today ${d.format("h:mma")}`;
    if (d.isSame(now.subtract(1, "day"), "day")) return `yesterday ${d.format("h:mma")}`;
    return d.format("MMM D h:mma");
}

export function MyMetricsHeader({ value, onChange, modifiedOn }: MetricsHeaderProps) {
    return (
        <Stack className={styles.root} gap="sm">
            {/* PROTOTYPE DEVIATION — "My stats" → "My metrics" for card-flip variant. */}
            <Title order={2} className={styles.title}>
                My metrics
            </Title>
            <Group justify="space-between" align="center" wrap="nowrap">
                <SegmentedControl
                    classNames={{
                        root: styles.segmented,
                        label: styles.segmentedLabel,
                        indicator: styles.segmentedIndicator,
                    }}
                    value={value}
                    data={SEGMENT_DATA}
                    onChange={(next) => onChange(next as MetricsTab)}
                />
                <Group gap={6} align="center" wrap="nowrap">
                    {value === "realtime" ? (
                        <LiveBadge />
                    ) : (
                        modifiedOn != null && (
                            <Text className={styles.lastUpdatedText}>Last updated {formatRelativeDay(modifiedOn)}</Text>
                        )
                    )}
                </Group>
            </Group>
        </Stack>
    );
}
