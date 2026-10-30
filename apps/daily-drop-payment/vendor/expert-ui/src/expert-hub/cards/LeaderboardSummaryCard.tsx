import type { LeaderboardConfig } from "@expert/app-config/types";

import { useLeaderboardStanding } from "@expert/sales-tools";
import { Card, Group, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

import { useLeaderboardSelectionStore } from "../right-panel/useLeaderboardSelectionStore";
import { activateOnKey } from "./activateOnKey";
import styles from "./leaderboardSummaryCard.module.css";
import { LiveBadge } from "./LiveBadge";

interface Props {
    /** Non-empty; the caller only renders this card when the partner has leaderboards. */
    leaderboards: LeaderboardConfig[];
    onClick: () => void;
}

/**
 * Compact leaderboard entry on the Expert Hub: the expert's standing (e.g. "#3 of 25") for the
 * selected leaderboard, shared with the slide-in standings panel via {@link useLeaderboardSelectionStore}.
 * Clicking opens the full standings.
 */
export function LeaderboardSummaryCard({ leaderboards, onClick }: Props) {
    const selectedMetric = useLeaderboardSelectionStore((s) => s.metric);
    const board = leaderboards.find((b) => b.metric === selectedMetric) ?? leaderboards[0];
    const { rank, total } = useLeaderboardStanding(board.metric, board.sku);

    return (
        <Card
            classNames={{ root: styles.root }}
            radius="md"
            role="button"
            tabIndex={0}
            aria-label="Open team leaderboard"
            onClick={onClick}
            onKeyDown={(event) => activateOnKey(event, onClick)}
        >
            <Group justify="space-between" align="center" wrap="nowrap">
                <Group gap="md" align="baseline" wrap="nowrap">
                    <Text className={styles.title}>Team leaderboard</Text>
                    {rank != null && total != null && (
                        <Group gap={5} align="baseline" wrap="nowrap">
                            <Text className={styles.rank}>#{rank}</Text>
                            <Text className={styles.unit}>of {total}</Text>
                        </Group>
                    )}
                </Group>
                <Group gap="lg" align="center" wrap="nowrap">
                    <LiveBadge />
                    <Group gap={6} align="center" wrap="nowrap" className={styles.action}>
                        View full standings
                        <IconChevronRight size={15} />
                    </Group>
                </Group>
            </Group>
        </Card>
    );
}
