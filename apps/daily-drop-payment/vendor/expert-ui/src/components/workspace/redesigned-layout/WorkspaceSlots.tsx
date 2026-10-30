import type { ReactNode } from "react";

import { Flex, Paper, ScrollArea } from "@mantine/core";
import { ErrorBoundary } from "react-error-boundary";

import { PanelErrorFallback } from "@/panels/modules/panels/components/PanelErrorFallback";

import styles from "./WorkspaceSlots.module.css";

/** Fixed width of the left widget sidebar (chat queue rail). */
export const SIDEBAR_WIDTH = "240px";

/**
 * Presentational slot pieces used by `WorkspaceLayoutV2` (the v2 workspace shell). Kept separate so
 * the shell file carries only layout wiring.
 */

/** Fixed-width left sidebar bar (mounts/unmounts; never a resizable pane). */
export function WorkspaceSidebar({ children }: { children: ReactNode }) {
    return (
        <Paper radius={0} flex={`0 0 ${SIDEBAR_WIDTH}`} w={SIDEBAR_WIDTH} className={styles.panelContainer}>
            <ScrollArea className={styles.scrollArea}>
                <ErrorBoundary fallbackRender={PanelErrorFallback}>{children}</ErrorBoundary>
            </ScrollArea>
        </Paper>
    );
}

/** The left column: optional fixed-height top bar (call controls) over a filling bottom region. */
export function WorkspaceLeftMain({
    leftTop,
    leftTopOpen,
    leftTopHeight = "56px",
    leftBottom,
}: {
    leftTop?: ReactNode;
    leftTopOpen: boolean;
    leftTopHeight?: string;
    leftBottom: ReactNode;
}) {
    return (
        <Flex direction="column" h="100%">
            {leftTopOpen && (
                <Paper radius={0} flex={`0 0 ${leftTopHeight}`} h={leftTopHeight} className={styles.panelContainer}>
                    <ScrollArea className={styles.scrollArea}>
                        <ErrorBoundary fallbackRender={PanelErrorFallback}>{leftTop}</ErrorBoundary>
                    </ScrollArea>
                </Paper>
            )}
            <Paper radius={0} flex="1 1 0" mih={0} className={styles.panelContainer}>
                <ErrorBoundary fallbackRender={PanelErrorFallback}>{leftBottom}</ErrorBoundary>
            </Paper>
        </Flex>
    );
}

/** The right-top region content wrapper. */
export function WorkspaceRightTop({ children }: { children: ReactNode }) {
    return (
        <Paper radius={0} h="100%" className={styles.panelContainer}>
            <ErrorBoundary fallbackRender={PanelErrorFallback}>{children}</ErrorBoundary>
        </Paper>
    );
}
