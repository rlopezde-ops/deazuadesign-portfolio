import { Stack, Text, Title } from "@mantine/core";

import styles from "./greeting.module.css";

interface Props {
    name: string;
}

export function Greeting({ name }: Props) {
    const displayName = name.trim().length > 0 ? name : "there";

    return (
        <Stack className={styles.root} gap="sm" align="flex-start">
            <Title order={1} className={styles.heading}>
                Hi, {displayName}.
            </Title>
            <Text className={styles.subtitle}>
                Here’s your performance snapshot for the day. See where you’re doing well and what to focus on today.
            </Text>
        </Stack>
    );
}
