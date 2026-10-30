import type { LeaderboardMetric } from "@expert/app-config/types";

import { Divider, Flex, ScrollArea, Skeleton } from "@mantine/core";
import { Reorder } from "framer-motion";

import { useSalesContext } from "../../../../sales-context/SalesContext";
import { useLeaderboard } from "../hooks/useLeaderboard";
import classes from "./Leaderboard.module.css";

const splitName = (name: string) => {
    const names = name.split(" ");
    if (!names[1]) return names[0];
    return `${names[0]} ${names[1].charAt(0)}.`;
};

interface LeaderboardProps {
    isVisible: boolean;
    metric: LeaderboardMetric;
    sku?: string;
}

export function Leaderboard({ isVisible, metric, sku }: LeaderboardProps) {
    const { employeeId } = useSalesContext();
    const { data, isLoading } = useLeaderboard(metric, sku);

    // NOTE: Live leaderboard updates via websocket (ws_calls-event, ws_enrollment-event)
    // are handled by the event bridge in Workspace.tsx, which refetches the query cache.
    // This component just reads from TanStack Query — no direct websocket subscriptions.

    if (!isVisible) return null;
    return (
        <ScrollArea type="never">
            <Flex direction="column">
                <Divider />
                {isLoading ? (
                    <Flex direction="column" justify="space-between" w="188px">
                        {Array.from({ length: 12 }, () => (
                            <Skeleton key={Math.random().toString(33)} mb="4xs" h="xl" mx="md" />
                        ))}
                    </Flex>
                ) : data && data.length > 0 ? (
                    <Reorder.Group as="div" values={data} onReorder={() => undefined}>
                        {data.map((info) => (
                            <Reorder.Item as="div" dragListener={false} key={info.employeeId} value={info}>
                                <Flex
                                    key={info.employeeId}
                                    justify="space-between"
                                    fz="xs"
                                    align="center"
                                    h={36}
                                    py="3xs"
                                    px="lg"
                                    className={employeeId === info.employeeId ? classes.purple : ""}
                                >
                                    <Flex>
                                        {info.order + 1}.{" "}
                                        {info.employeeId === employeeId ? "You" : splitName(info.employeeName)}
                                    </Flex>
                                    <Flex pl="xl">{info.score}</Flex>
                                </Flex>
                                <Divider />
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                ) : (
                    <Flex
                        direction="column"
                        mt="3rem"
                        align="center"
                        justify="center"
                        p="md"
                        fw={400}
                        c="dark.2"
                        fz="xs"
                    >
                        Leaderboard data unavailable.
                    </Flex>
                )}
            </Flex>
        </ScrollArea>
    );
}
