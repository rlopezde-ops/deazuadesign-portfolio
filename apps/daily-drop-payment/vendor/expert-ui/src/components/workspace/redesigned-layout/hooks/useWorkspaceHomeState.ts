import type { WorkspaceFeatures } from "@expert/features";

import { useNotification } from "@expert/common-ui";
import { useFeatures } from "@expert/features";
import { useEffect, useMemo } from "react";

import { useSchedule } from "@/expert-hub/data/useSchedule";
import { useHubPanelStore } from "@/expert-hub/right-panel/useHubPanelStore";

// Off-call the right panel is a 30% rail beside the 70% Expert Hub.
const OFF_CALL_PANEL_SIZE = "30%";
// Off-call sizing band: a narrower floor than the on-call default so the hub's 3-col grid isn't
// squished on small laptops (at 440px the panel eats ~43% of a 1024px screen), plus a hard cap so
// the panel doesn't sprawl on wide monitors. On-call keeps the layout's own min and no cap.
const OFF_CALL_PANEL_MIN = "360px";
const OFF_CALL_PANEL_MAX = "480px";

interface WorkspaceHomeStateParams {
    /** No active call/chat (and not in an Expert University / training takeover). */
    isOffCall: boolean;
    /** Whether the on-call right panel would be open (e.g. `!expertUniversityActive` / `canShowChatDetails`). */
    baseRightTopOpen: boolean;
}

interface WorkspaceHomeState {
    /** True when the Expert Hub should occupy the main area (i.e. off-call in the v2 workspace). */
    showExpertHub: boolean;
    /** Effective right-top open state: the off-call hub panel off-call, the on-call panel otherwise. */
    rightTopOpen: boolean;
    /** Right-top target width: a 30% rail off-call, default sizing on-call. */
    rightTopSize?: string;
    /** Off-call min/max width band for the hub rail; undefined on-call (layout default min, no cap). */
    rightTopMin?: string;
    rightTopMax?: string;
}

/**
 * Shared off-call↔on-call state for the redesigned voice/chat workspaces. Owns the Expert Hub gate
 * and the off-call panel's 70-30 behavior, so voice and chat stay in lockstep instead of hand-syncing
 * the same logic. Off-call the panel opens to show the schedule when the expert has a shift (or an
 * expanded panel is open) and collapses to the full-width hub otherwise. Going on-call clears any open
 * expanded panel so returning off-call shows the schedule again.
 */
export function useWorkspaceHomeState({ isOffCall, baseRightTopOpen }: WorkspaceHomeStateParams): WorkspaceHomeState {
    // v2 is the Expert Hub workspace, so being off-call is the only gate — the hub is the home.
    const showExpertHub = isOffCall;
    const hasExpandedPanel = useHubPanelStore((s) => s.view != null);
    const closeHubPanel = useHubPanelStore((s) => s.closePanel);
    const notification = useNotification();
    const {
        features: { isExpertHubScheduleEnabled },
    } = useFeatures<WorkspaceFeatures>();
    // Deduped with ScheduleView's useSchedule by React Query key.
    const {
        hasShift,
        isLoading: scheduleLoading,
        isError: scheduleError,
    } = useSchedule({ enabled: showExpertHub && isExpertHubScheduleEnabled, reportScheduleReceived: true });

    // On going on-call, clear any open expanded panel so returning off-call shows the schedule again.
    useEffect(() => {
        if (!showExpertHub && hasExpandedPanel) {
            closeHubPanel();
        }
    }, [showExpertHub, hasExpandedPanel, closeHubPanel]);

    // Alert on fetch failure so the collapse isn't silent. Non-prod shows mock data, so this only fires in prod.
    // Uses the shared error helper (bottom-right, standardized red + icon) so it matches other error toasts.
    useEffect(() => {
        if (showExpertHub && scheduleError && !hasShift && !scheduleLoading) {
            notification.error("We couldn't load your schedule right now. It'll retry automatically.", {
                id: "expert-hub-schedule-error",
                title: "Schedule unavailable",
                autoClose: 5000,
            });
        }
    }, [showExpertHub, scheduleError, hasShift, scheduleLoading, notification]);

    // Show the schedule when the flag is on and the expert has a shift — or is still loading it. Staying
    // open through the initial fetch avoids a collapse→open flicker for the common (has-shift) case; a
    // shift-less expert briefly opens to the skeleton, then collapses.
    const showSchedule = isExpertHubScheduleEnabled && (scheduleLoading || hasShift);
    const rightTopOpen = showExpertHub ? showSchedule || hasExpandedPanel : baseRightTopOpen;

    return useMemo(
        () => ({
            showExpertHub,
            rightTopOpen,
            rightTopSize: showExpertHub ? OFF_CALL_PANEL_SIZE : undefined,
            rightTopMin: showExpertHub ? OFF_CALL_PANEL_MIN : undefined,
            rightTopMax: showExpertHub ? OFF_CALL_PANEL_MAX : undefined,
        }),
        [showExpertHub, rightTopOpen],
    );
}
