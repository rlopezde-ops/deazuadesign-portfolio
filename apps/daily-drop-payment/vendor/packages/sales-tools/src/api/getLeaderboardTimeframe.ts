import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

/*
 * Leaderboard time frame is currently from saturday -> friday. The entire business runs in CST so we use that TZ
 */
export const getLeaderboardTimeframe = () => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.tz.setDefault("America/Chicago");

    return {
        start: dayjs().day(-1).format("MM-DD-YYYY").concat(" 00:00:00"),
        end: dayjs().day(5).format("MM-DD-YYYY").concat(" 23:59:59"),
    };
};
