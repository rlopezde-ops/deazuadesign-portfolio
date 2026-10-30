import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

// All "today" / "yesterday" decisions for off-call hub are pinned to the business
// timezone so experts in other zones (or on Citrix machines reporting unexpected
// locales) get a consistent day window matching the gamification API's day boundary.
export const BUSINESS_TIMEZONE = "America/Chicago";

export function getBusinessToday(): string {
    return dayjs().tz(BUSINESS_TIMEZONE).format("YYYY-MM-DD");
}
