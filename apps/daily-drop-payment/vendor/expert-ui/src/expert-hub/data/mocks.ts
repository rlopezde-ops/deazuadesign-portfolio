import dayjs from "dayjs";

import type { PayMetrics, ScheduleResponse } from "./types";

import { BUSINESS_TIMEZONE } from "./businessDay";
import { METRIC_KEYS } from "./metricKeys";

function yesterday(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    d.setHours(11, 30, 0, 0);
    return d.toISOString();
}

export function getMockPayMetrics(): PayMetrics {
    const ts = yesterday();
    return {
        createdOn: ts,
        modifiedOn: ts,
        totals: {
            serve: {
                [METRIC_KEYS.serve.ERP]: { calc: 92.25, payout: 475 }, // ERP 0–100%
                [METRIC_KEYS.serve.CRT]: { calc: 1350, payout: 0 }, // CRT in seconds
            },
            solve: {
                [METRIC_KEYS.solve.TRANSFER_RATE]: { calc: 0.04, payout: 0 }, // decimal fraction (0.04 = 4%)
                [METRIC_KEYS.solve.OCR]: { calc: 0.84, payout: 0 }, // decimal fraction (0.84 = 84%)
            },
            sell: { [METRIC_KEYS.sell.NET_ENROLLS]: { calc: 2, payout: 150 } }, // net count
        },
        clients: {},
    };
}

/** Mock schedule mirroring the design mockup, in the business timezone for the given day. */
export function getMockSchedule(date: string): ScheduleResponse {
    // Build UTC ISO strings from business-tz wall-clock times so the mock displays at the expected times.
    const at = (time: string) => dayjs.tz(`${date} ${time}`, BUSINESS_TIMEZONE).utc().toISOString();
    return {
        employeeId: "mock-employee",
        date,
        workStart: at("10:00"),
        workEnd: at("18:30"),
        blocks: [
            {
                startTime: at("10:00"),
                endTime: at("10:20"),
                status: "MEETING",
                durationMinutes: 20,
                label: "Team huddle",
            },
            { startTime: at("11:30"), endTime: at("11:45"), status: "BREAK", durationMinutes: 15, label: "Break" },
            {
                startTime: at("12:30"),
                endTime: at("12:50"),
                status: "TRAINING",
                durationMinutes: 20,
                label: "Coaching 1:1",
            },
            { startTime: at("14:30"), endTime: at("15:00"), status: "LUNCH", durationMinutes: 30, label: "Lunch" },
            {
                startTime: at("16:00"),
                endTime: at("16:15"),
                status: "BREAK",
                durationMinutes: 15,
                label: "Afternoon break",
            },
        ],
    };
}
