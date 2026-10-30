import type { WorkspaceFeatures } from "@expert/features";

import { useFeatures } from "@expert/features";
import { ChecklistSummary, LeaderboardWidget } from "@expert/sales-tools";
import { ActionIcon, Flex, Group, Stack, Text, Title } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import { usePartnerConfig } from "@/partner/usePartnerConfig";
import { AssistTab } from "@/sidecar/AssistTab";

import { usePayMetrics } from "../data/usePayMetrics";
import { ScheduleView } from "../schedule/ScheduleView";
import styles from "./HubRightPanel.module.css";
import { MetricDetailPanel } from "./MetricDetailPanel";
import { PayDetailPanel } from "./PayDetailPanel";
import { type HubPanelView, useHubPanelStore } from "./useHubPanelStore";
import { useLeaderboardSelectionStore } from "./useLeaderboardSelectionStore";
import { usePayDetailStore } from "./usePayDetailStore";
import type { PayableMetricKey } from "../data/payTiers";

/**
 * Content of the hub's right slide-in panel. The panel's open/close (and its width animation) is
 * owned by the layout via `rightTopOpen`; this component only renders the current view and the
 * close button to dismiss it.
 *
 * AI assist is a placeholder for now (wiring-first); the leaderboard reuses the real
 * {@link LeaderboardWidget} full standings.
 */
const PANEL_TITLES: Record<HubPanelView, string> = {
    leaderboard: "Team leaderboard",
    assist: "Ask Assist",
    "transfer-rate": "Transfer rate",
    "today-sales": "Sales",
    "pay-detail": "Pay details",
};

const PAY_DETAIL_TITLES: Record<PayableMetricKey, { category: string; label: string }> = {
    erp: { category: "Serve", label: "ERP" },
    "expert-5star": { category: "Serve", label: "Expert 5 Star" },
    "transfer-rate": { category: "Solve", label: "Transfer rate" },
    "net-enrolls": { category: "Sell", label: "Net sales" },
};

export function HubRightPanel() {
    const view = useHubPanelStore((s) => s.view);
    const closePanel = useHubPanelStore((s) => s.closePanel);
    const selectedMetric = useLeaderboardSelectionStore((s) => s.metric);
    const setSelectedMetric = useLeaderboardSelectionStore((s) => s.setMetric);
    const payDetailMetricKey = usePayDetailStore((s) => s.metricKey);
    const { leaderboards } = usePartnerConfig();
    const { payMetrics, isLoading } = usePayMetrics();
    const {
        features: { isExpertHubScheduleEnabled },
    } = useFeatures<WorkspaceFeatures>();

    return (
        <Flex direction="column" h="100%">
            {/* The schedule (null view) renders its own date header; expanded panels get the title + close bar. */}
            {view != null && (
                <Group gap="xs" px="md" h={56} wrap="nowrap" justify="space-between" className={styles.header}>
                    <Title order={4} fz="md" className={styles.headerTitle}>
                        {view === "pay-detail" && payDetailMetricKey
                            ? `${PAY_DETAIL_TITLES[payDetailMetricKey].category} · ${PAY_DETAIL_TITLES[payDetailMetricKey].label}`
                            : PANEL_TITLES[view]}
                    </Title>
                    <ActionIcon variant="subtle" color="gray" aria-label="Close" onClick={closePanel}>
                        <IconX size={18} />
                    </ActionIcon>
                </Group>
            )}

            <Flex key={view ?? "empty"} flex={1} pos="relative" direction="column" className={styles.body}>
                {view == null && isExpertHubScheduleEnabled && <ScheduleView />}

                {view === "leaderboard" &&
                    (leaderboards.length > 0 ? (
                        <LeaderboardWidget
                            leaderboards={leaderboards}
                            activeMetric={selectedMetric ?? leaderboards[0].metric}
                            onActiveMetricChange={setSelectedMetric}
                        />
                    ) : (
                        <PlaceholderBody message="No leaderboard is configured for your team yet." />
                    ))}

                {view === "assist" && <AssistTab />}

                {view === "today-sales" && <ChecklistSummary />}

                {view === "transfer-rate" && <MetricDetailPanel payMetrics={payMetrics} isLoading={isLoading} />}

                {view === "pay-detail" && (
                    <PayDetailPanel
                        payMetrics={payMetrics}
                        metricKey={payDetailMetricKey}
                        isLoading={isLoading}
                    />
                )}
            </Flex>
        </Flex>
    );
}

function PlaceholderBody({ message }: { message: string }) {
    return (
        <Stack flex={1} align="center" justify="center" p="xl">
            <Text c="dimmed" ta="center" maw={360}>
                {message}
            </Text>
        </Stack>
    );
}
