import { useNotification } from "@expert/common-ui";
import { Button, Tooltip, useMatches } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";

import classes from "./WorkspaceHeader.module.css";

/**
 * Button to display and copy the current session ID to clipboard.
 * Shows different text layouts and tooltips based on screen size.
 */
export function SessionIdCopyButton({ sessionId }: { sessionId: string }) {
    const clipboard = useClipboard({ timeout: 500 });
    const notification = useNotification();

    // Always show the full session ID so it is never truncated in reduced-width
    // layouts (e.g. split screen). The "Session ID: " label is dropped at smaller
    // widths to save horizontal room, but the ID itself stays complete.
    const displaySessionId = useMatches({
        lg: `Session ID: ${sessionId}`,
        base: sessionId,
    });

    const tooltipLabel = useMatches({
        lg: "Click to copy",
        base: "Click to copy session ID",
    });

    const copyToClipboard = () => {
        clipboard.copy(sessionId);
        notification.success("Session ID copied to clipboard");
    };

    const button = (
        <Button
            variant="transparent"
            onClick={copyToClipboard}
            className={classes.sessionIdText}
            size="xs"
            fz="xs"
            aria-label={`Copy session ID: ${sessionId}`}
        >
            {displaySessionId}
        </Button>
    );
    return (
        <Tooltip label={tooltipLabel} zIndex="var(--mantine-priority-highest)">
            {button}
        </Tooltip>
    );
}
