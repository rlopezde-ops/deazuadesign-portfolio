import { AsurionLogoDark } from "@expert/common-ui/assets/AsurionLogoDark";
import { Flex, ScrollArea, Stack, UnstyledButton } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

import { useAnalytics } from "@/analytics";
import { env } from "@/config";
import { usePartnerConfig } from "@/partner/usePartnerConfig";
import { useAgentFriendlyName, useLogger } from "@/sdk";

import { LeaderboardSummaryCard } from "./cards/LeaderboardSummaryCard";
import { usePayMetrics } from "./data/usePayMetrics";
import styles from "./expertHub.module.css";
import { Greeting } from "./greeting/Greeting";
import { type MetricsTab, MyMetricsHeader } from "./metrics/MyMetricsHeader";
import { TodayMetrics } from "./metrics/TodayMetrics";
import { YesterdayMetrics } from "./metrics/YesterdayMetrics";
import { useHubPanelStore } from "./right-panel/useHubPanelStore";

// The hub is now the persistent off-call home, so it mounts every time the expert leaves a call.
// Dedupe the "shown" business event to once per browser session *per channel* (survives remounts and
// reloads): voice and chat are separate hubs, so each should count once — "reached this hub this
// session" rather than every off-call visit.
const EXPERT_HUB_SHOWN_SESSION_KEY_PREFIX = "expertHub:shown";

/**
 * The Expert Hub is the expert's off-call home screen, rendered as the main workspace area
 * whenever there is no active call/chat. The leaderboard card and the floating assist button open the
 * right panel (see {@link useHubPanelStore}); the metric cards are display-only for now
 * (per-metric expanded panels are not built yet).
 */
export function ExpertHub() {
    const firstName = useAgentFriendlyName();
    const { payMetrics } = usePayMetrics();
    const { dispatcher } = useAnalytics();
    const logger = useLogger({ module: "ExpertHub" });
    const { leaderboards } = usePartnerConfig();
    const togglePanel = useHubPanelStore((s) => s.togglePanel);
    const [activeTab, setActiveTab] = useState<MetricsTab>("recent");
    const hasDispatchedShown = useRef(false);

    // Chat has no leaderboard concept, so hide it in the chat channel even if the (partner-level)
    // config carries voice leaderboards. Non-chat channels keep the existing behavior.
    const showLeaderboard = env.channel !== "chat" && leaderboards.length > 0;

    // Fire once per browser session (see EXPERT_HUB_SHOWN_SESSION_KEY_PREFIX): the hub is the persistent
    // off-call home and remounts on every off-call visit, so a per-mount dispatch would multiply the
    // count. NOTE for analytics owners: "shown" now means "reached the home this session".
    useEffect(() => {
        if (hasDispatchedShown.current) return;
        hasDispatchedShown.current = true;
        const key = `${EXPERT_HUB_SHOWN_SESSION_KEY_PREFIX}:${env.channel}`;
        if (globalThis.sessionStorage.getItem(key)) return;
        globalThis.sessionStorage.setItem(key, "1");
        logger.info("Off-call hub: dispatching shown event");
        void dispatcher.dispatchBusinessEvent("ExpertHubShown", { channel: env.channel });
    }, [dispatcher, logger]);

    return (
        <Flex className={styles.root} role="region" aria-label="Off-call hub">
            <ScrollArea classNames={{ root: styles.scrollRoot, viewport: styles.scrollViewport }} type="auto">
                <Stack className={styles.content} gap="xl">
                    <Greeting name={firstName} />

                    {showLeaderboard && (
                        <LeaderboardSummaryCard
                            leaderboards={leaderboards}
                            onClick={() => {
                                // Only an open transition is a real "opened" — a toggle-close (leaderboard
                                // already showing) must not inflate the metric.
                                if (useHubPanelStore.getState().view !== "leaderboard") {
                                    void dispatcher.dispatchBusinessEvent("ExpertHubLeaderboardOpened", {
                                        channel: env.channel,
                                    });
                                }
                                togglePanel("leaderboard");
                            }}
                        />
                    )}

                    <Stack gap="md">
                        <MyMetricsHeader
                            value={activeTab}
                            onChange={setActiveTab}
                            modifiedOn={payMetrics?.modifiedOn ?? null}
                        />
                        {activeTab === "recent" ? <YesterdayMetrics /> : <TodayMetrics />}
                    </Stack>
                </Stack>
            </ScrollArea>

            <UnstyledButton
                className={styles.assistButton}
                onClick={() => togglePanel("assist")}
                aria-label="Ask Assist"
            >
                <AsurionLogoDark />
            </UnstyledButton>
        </Flex>
    );
}
