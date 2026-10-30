import type { LeaderboardConfig, LeaderboardMetric } from "@expert/app-config/types";

import { SegmentedControl } from "@mantine/core";

import classes from "./LeaderboardWidget.module.css";

interface LeaderboardControlProps {
    activeMetric: LeaderboardMetric;
    leaderboards: LeaderboardConfig[];
    onSetActiveMetric: (val: LeaderboardMetric) => void;
}

export const LeaderboardControl = ({ activeMetric, leaderboards, onSetActiveMetric }: LeaderboardControlProps) => (
    <SegmentedControl
        classNames={{ label: classes.segmentedControlLabel }}
        value={activeMetric}
        onChange={(val) => onSetActiveMetric(val as LeaderboardMetric)}
        color="primary.5"
        data={leaderboards.map((board) => ({ value: board.metric, label: board.controlText }))}
    />
);
