import dayjs from "dayjs";

import { getLeaderboardTimeframe } from "../../../../api/getLeaderboardTimeframe";

export const getMetricsDateRange = (): string => {
    const { start, end } = getLeaderboardTimeframe();
    const startDate = dayjs(start);
    const endDate = dayjs(end);

    const startMonth = startDate.format("MMM");
    const startDay = startDate.format("D");
    const endMonth = endDate.format("MMM");
    const endDay = endDate.format("D");

    if (startMonth === endMonth) {
        return `${startMonth} ${startDay}–${endDay}`;
    }
    return `${startMonth} ${startDay}–${endMonth} ${endDay}`;
};
