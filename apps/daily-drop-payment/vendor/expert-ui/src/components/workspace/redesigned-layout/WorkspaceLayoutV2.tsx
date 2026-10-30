import type { SplitterPaneSize } from "@mantine/hooks";
import type { ReactNode } from "react";

import { Flex, Splitter } from "@mantine/core";
import { useRef, useState } from "react";

import styles from "./WorkspaceLayoutV2.module.css";
import { WorkspaceLeftMain, WorkspaceRightTop, WorkspaceSidebar } from "./WorkspaceSlots";

/** Resize floors for the one draggable boundary (left-main ↔ right-top). */
const LEFT_MAIN_MIN = "400px";
const RIGHT_TOP_MIN = "440px";

export interface WorkspaceLayoutV2Props {
    /** Optional: when omitted (e.g. voice v2, which has no widget sidebar) no sidebar is rendered. */
    leftSidebar?: ReactNode;
    leftSidebarOpen?: boolean;
    leftSidebarHidden?: boolean;
    leftTop?: ReactNode;
    leftTopOpen: boolean;
    leftTopHeight?: string;
    leftBottom: ReactNode;
    rightTop: ReactNode;
    rightTopOpen: boolean;
    /** Override the right-top default width (e.g. the Expert Hub wants a 30% panel). */
    rightTopSize?: string;
    /** Override the right-top min width; falls back to {@link RIGHT_TOP_MIN} when omitted (on-call). */
    rightTopMin?: string;
    /** Cap the right-top width so a wide viewport doesn't sprawl the panel; uncapped when omitted. */
    rightTopMax?: string;
}

/**
 * Plain, non-animated workspace shell built on Mantine's `Splitter`. Only the left-main ↔ right-top
 * boundary is user-resizable; the sidebar and left-top call-controls bar are fixed-size bars that
 * simply mount/unmount, so they are plain Boxes rather than resizable panes. This is the v2 redesign
 * shell (chat/voice v2); the v1 redesign uses the react-resizable-panels {@link WorkspaceLayout}.
 *
 *     ┌─────────────┬───────────────────────────┬─────────────────────┐
 *     │             │        Left Top (bar)     │                     │
 *     │  Left       ├───────────────────────────┤      Right Top      │
 *     │  Sidebar    │                           │   (resizable vs     │
 *     │  (fixed)    │        Left Bottom        │    left-main)       │
 *     └─────────────┴───────────────────────────┴─────────────────────┘
 */
export function WorkspaceLayoutV2({
    leftSidebar,
    leftSidebarOpen = false,
    leftSidebarHidden = false,
    leftTop,
    leftTopOpen,
    leftTopHeight = "56px",
    leftBottom,
    rightTop,
    rightTopOpen,
    rightTopSize,
    rightTopMin,
    rightTopMax,
}: WorkspaceLayoutV2Props) {
    const sidebarVisible = leftSidebarOpen && !leftSidebarHidden;
    const leftMainDefaultSize: SplitterPaneSize = !leftSidebarOpen ? "50%" : sidebarVisible ? "45%" : "60%";
    const rightTopDefaultSize = (rightTopSize ?? (leftSidebarOpen ? "40%" : "50%")) as SplitterPaneSize;

    // Mantine's Splitter snapshots its internal size array from the pane count on first mount and never
    // grows it (useSplitter seeds useUncontrolled once). We keep the Splitter mounted across toggles so
    // left-main never remounts, so a right pane added on open would read an undefined size and render at
    // zero width — the panel would look like it never opens. Drive `sizes` as a controlled prop so the
    // array length always matches the rendered pane count. Local state preserves a within-session drag;
    // toggling the panel re-seeds the defaults (the layout never persisted a drag across toggles — it
    // used to remount on every one).
    const paneSizes = (open: boolean): SplitterPaneSize[] =>
        open ? [leftMainDefaultSize, rightTopDefaultSize] : [leftMainDefaultSize];
    const [sizes, setSizes] = useState<SplitterPaneSize[]>(() => paneSizes(rightTopOpen));
    const prevRightTopOpen = useRef(rightTopOpen);
    if (prevRightTopOpen.current !== rightTopOpen) {
        prevRightTopOpen.current = rightTopOpen;
        setSizes(paneSizes(rightTopOpen));
    }

    const leftMain = (
        <WorkspaceLeftMain
            leftTop={leftTop}
            leftTopOpen={leftTopOpen}
            leftTopHeight={leftTopHeight}
            leftBottom={leftBottom}
        />
    );

    return (
        <Flex h="100%" w="100%">
            {sidebarVisible && <WorkspaceSidebar>{leftSidebar}</WorkspaceSidebar>}

            {/*
             * Always render the Splitter so left-main keeps a stable parent (Flex > Splitter > Pane[0])
             * across right-top toggles — swapping the container type would remount the whole left-main →
             * ExpertHub subtree, losing its tab/scroll state. `sizes` is controlled (see above) so the
             * pane added on open is sized correctly; closed, the lone pane fills 100% with no handle.
             */}
            <Splitter
                flex="1 1 0"
                miw={0}
                h="100%"
                withHandle={false}
                lineSize={1}
                handleColor="dark.5"
                classNames={{ handle: styles.handle }}
                sizes={sizes}
                onSizeChange={setSizes}
            >
                {/* `defaultSize` is required by the pane type but ignored while `sizes` is controlled. */}
                <Splitter.Pane defaultSize={leftMainDefaultSize} min={LEFT_MAIN_MIN}>
                    {leftMain}
                </Splitter.Pane>
                {rightTopOpen && (
                    <Splitter.Pane
                        defaultSize={rightTopDefaultSize}
                        min={(rightTopMin ?? RIGHT_TOP_MIN) as SplitterPaneSize}
                        max={rightTopMax as SplitterPaneSize | undefined}
                        // The pane size is a percentage but the min/max are pixels, which puts Mantine's
                        // Splitter in "pixel mode" — there the percentage renders as a flex-grow weight with
                        // no CSS max-width, so the px `max` is only clamped mid-drag and gets re-encoded as a
                        // percentage tied to the drag-time width. That makes the effective cap drift on every
                        // window resize. Enforce the off-call band as real CSS on the flex item so the browser
                        // holds it continuously. Undefined on-call (raw props, not the RIGHT_TOP_MIN fallback),
                        // so the on-call pane stays uncapped/unfloored as before.
                        miw={rightTopMin}
                        maw={rightTopMax}
                    >
                        <WorkspaceRightTop>{rightTop}</WorkspaceRightTop>
                    </Splitter.Pane>
                )}
            </Splitter>
        </Flex>
    );
}
