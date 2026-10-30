import { Group } from "@mantine/core";

import styles from "./liveBadge.module.css";

export function LiveBadge() {
    return (
        <Group gap={5} align="center" wrap="nowrap" className={styles.badge}>
            <span className={styles.dot} />
            Live
        </Group>
    );
}
