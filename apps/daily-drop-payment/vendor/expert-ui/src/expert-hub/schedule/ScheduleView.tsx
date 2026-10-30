import type { ScheduleEventData } from "@mantine/schedule";
import type { ComponentType, ReactElement } from "react";

import { Badge, Box, Flex, Group, Skeleton, Stack, Text } from "@mantine/core";
import { AgendaView } from "@mantine/schedule";
import {
    IconCalendarEvent,
    IconCoffee,
    IconToolsKitchen2,
    IconUsers,
    type IconProps,
    IconSchool,
} from "@tabler/icons-react";
import dayjs from "dayjs";

import type { ScheduleEventPayload } from "../data/scheduleEvents";
import type { ScheduleBlockStatus } from "../data/types";

import { getShiftStartLabel } from "../data/scheduleEvents";
import { useSchedule } from "../data/useSchedule";
import styles from "./ScheduleView.module.css";

// Per-status icon. Colors are handled in CSS (data-status) so the palette stays theme-driven.
const STATUS_ICON: Record<ScheduleBlockStatus, ComponentType<IconProps>> = {
    BREAK: IconCoffee,
    LUNCH: IconToolsKitchen2,
    MEETING: IconUsers,
    TRAINING: IconSchool,
    UNKNOWN: IconCalendarEvent,
};

// Styles API map + renderEvent hoisted to module scope for referential stability.
const AGENDA_CLASSNAMES = {
    agendaView: styles.agendaView,
    agendaViewHeader: styles.agendaHeader,
    agendaViewBody: styles.agendaBody,
    agendaViewDateHeader: styles.dateGroupHeader,
    agendaViewNoEvents: styles.noEvents,
};

// One agenda row, matching the design mockup: [start time + duration] · accent bar · [icon + title, range].
function renderScheduleRow(event: ScheduleEventData): ReactElement {
    const payload = event.payload as ScheduleEventPayload | undefined;
    const status = payload?.status ?? "UNKNOWN";
    const Icon = STATUS_ICON[status] ?? STATUS_ICON.UNKNOWN;
    const start = dayjs(event.start);
    const end = dayjs(event.end);
    const durationMinutes = payload?.durationMinutes ?? end.diff(start, "minute");
    // Show the start's am/pm only when it differs from the end's, so a block crossing noon isn't ambiguous.
    const startFormat = start.format("a") === end.format("a") ? "h:mm" : "h:mm a";
    return (
        <Group gap="sm" align="stretch" wrap="nowrap" className={styles.row} data-status={status}>
            <Stack gap={2} w={46}>
                <Text size="sm" fw={600}>
                    {start.format("h:mm")}
                </Text>
                <Text size="xs" c="dimmed">
                    {durationMinutes}m
                </Text>
            </Stack>
            <Box className={styles.accent} />
            <Stack gap={2} flex={1} miw={0}>
                <Group gap="xs" wrap="nowrap">
                    <Icon className={styles.rowIcon} size={16} stroke={2} />
                    <Text size="sm" fw={500} truncate>
                        {event.title}
                    </Text>
                </Group>
                <Text size="xs" c="dimmed">
                    {`${start.format(startFormat)}–${end.format("h:mm a")}`}
                </Text>
            </Stack>
        </Group>
    );
}

/**
 * The expert's daily schedule — the default content of the off-call Expert Hub right panel.
 * Renders Mantine's `@mantine/schedule` AgendaView (read-only) as a compact time-list for the current
 * business day, matching the workspace design mockup: a date/shift header over per-block rows.
 */
export function ScheduleView() {
    const { schedule, events, date, isLoading, isMock } = useSchedule();

    if (isLoading && !schedule) {
        return (
            <Stack gap="sm" p="md">
                <Skeleton height={20} width="55%" radius="sm" />
                <Skeleton height={320} radius="sm" />
            </Stack>
        );
    }

    const shiftStartLabel = getShiftStartLabel(schedule);

    return (
        <Flex direction="column" h="100%">
            <Stack gap={2} px="md" pt="md" pb="xs">
                <Text className={styles.dateHeader}>
                    <span className={styles.today}>Today</span>
                    {` · ${dayjs(date).format("dddd · MMMM D")}`}
                </Text>
                {shiftStartLabel && <Text className={styles.shiftLine}>Shift starts at {shiftStartLabel}</Text>}
                {isMock && (
                    <Group gap="xs" mt={4}>
                        <Badge size="xs" variant="light" color="gray">
                            Mock data
                        </Badge>
                    </Group>
                )}
            </Stack>
            <AgendaView
                classNames={AGENDA_CLASSNAMES}
                rangeStart={date}
                rangeEnd={date}
                events={events}
                mode="static"
                renderEvent={renderScheduleRow}
            />
        </Flex>
    );
}
