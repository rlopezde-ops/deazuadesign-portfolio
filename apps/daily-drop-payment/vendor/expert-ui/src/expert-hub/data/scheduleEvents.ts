import type { ScheduleEventData } from "@mantine/schedule";

import dayjs from "dayjs";

import type { ScheduleBlockStatus, ScheduleResponse } from "./types";

import { BUSINESS_TIMEZONE } from "./businessDay";

// Status → fallback title, used when a block has no raw `label`.
// Per-status color/icon lives in the view layer (ScheduleView) so the palette stays theme-driven.
const SCHEDULE_BLOCK_TITLE: Record<ScheduleBlockStatus, string> = {
    BREAK: "Break",
    LUNCH: "Lunch",
    MEETING: "Meeting",
    TRAINING: "Training",
    UNKNOWN: "Scheduled",
};

// AgendaView reads these wall-clock strings as-is (no tz conversion), so convert UTC → business tz first.
const SCHEDULE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

function toBusinessTime(isoUtc: string): string {
    return dayjs.utc(isoUtc).tz(BUSINESS_TIMEZONE).format(SCHEDULE_TIME_FORMAT);
}

/** Payload carried on each AgendaView event so the view can render the row (icon, duration, title). */
export interface ScheduleEventPayload {
    status: ScheduleBlockStatus;
    durationMinutes: number;
    label: string;
}

/** Map a schedule response to AgendaView events: one event per block (in the business timezone). */
export function toScheduleEvents(schedule: ScheduleResponse | null): ScheduleEventData[] {
    if (!schedule) return [];

    return schedule.blocks.map((block) => ({
        id: `${block.status}-${block.startTime}`,
        // Known statuses show their friendly title; only UNKNOWN falls back to the raw Aspect label
        // (e.g. "Cancelled Glow Huddle"), so real codes like BRK1/LUNCH never leak into the UI.
        title:
            block.status === "UNKNOWN"
                ? block.label?.trim() || SCHEDULE_BLOCK_TITLE.UNKNOWN
                : SCHEDULE_BLOCK_TITLE[block.status],
        start: toBusinessTime(block.startTime),
        end: toBusinessTime(block.endTime),
        // Required by ScheduleEventData; unused visually since ScheduleView renders custom rows via renderEvent.
        color: "dark",
        payload: {
            status: block.status,
            durationMinutes: block.durationMinutes,
            label: block.label,
        } satisfies ScheduleEventPayload,
    }));
}

/** Business-timezone "h:mm a" label for the shift start (e.g. "10:00 am"), or null with no shift. */
export function getShiftStartLabel(schedule: ScheduleResponse | null): string | null {
    if (!schedule?.workStart) return null;
    return dayjs.utc(schedule.workStart).tz(BUSINESS_TIMEZONE).format("h:mm a");
}
