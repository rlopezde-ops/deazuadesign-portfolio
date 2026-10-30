import { useIsPacingActive } from "@expert/sales-tools";
import { SimpleGrid } from "@mantine/core";

import { TodayPaceCard } from "./TodayPaceCard";
import { TodaySalesCard } from "./TodaySalesCard";
import { TodayTotalCallsCard } from "./TodayTotalCallsCard";

export function TodayMetrics() {
    const isPacingActive = useIsPacingActive();

    return (
        <SimpleGrid
            type="container"
            cols={isPacingActive ? { base: 1, "440px": 2, "680px": 3 } : { base: 1, "440px": 2 }}
            spacing="md"
        >
            <TodayTotalCallsCard />
            {isPacingActive && <TodayPaceCard />}
            <TodaySalesCard />
        </SimpleGrid>
    );
}
