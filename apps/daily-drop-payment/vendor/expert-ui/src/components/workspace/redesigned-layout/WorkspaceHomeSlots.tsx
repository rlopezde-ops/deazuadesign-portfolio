import type { ReactNode } from "react";

import { Box, Flex } from "@mantine/core";

import { ExpertHub } from "@/expert-hub";
import { HubRightPanel } from "@/expert-hub/right-panel/HubRightPanel";

interface MainSlotProps {
    showExpertHub: boolean;
    /** What fills the main area on a call (transcript / chat timeline / EU / training). */
    onCallContent: ReactNode;
}

/**
 * Left-bottom (main) slot for the redesigned voice/chat workspaces: the on-call content, or the
 * Expert Hub (the off-call home) covering it when off call. The hub is absolutely positioned and
 * opaque, so it sits over the on-call content beneath. Shared so both experiences behave identically.
 */
export function WorkspaceMainSlot({ showExpertHub, onCallContent }: MainSlotProps) {
    return (
        <>
            {!showExpertHub && onCallContent}
            {showExpertHub && (
                <Flex pos="absolute" inset={0}>
                    <ExpertHub />
                </Flex>
            )}
        </>
    );
}

interface RightSlotProps {
    showExpertHub: boolean;
    /** Right-top content on a call (Sidecar, or null). */
    onCallContent: ReactNode;
}

/**
 * Right-top slot for the redesigned voice/chat workspaces: the off-call panel when off call, the
 * on-call Sidecar otherwise. The wrapper fills the slot and is a positioning context for the
 * absolutely-positioned Sidecar / HubRightPanel.
 */
export function WorkspaceRightSlot({ showExpertHub, onCallContent }: RightSlotProps) {
    return (
        <Box h="100%" pos="relative">
            {showExpertHub ? <HubRightPanel /> : onCallContent}
        </Box>
    );
}
