import type { Partner } from "@expert/shared-types";
import type { JSX } from "react";

import { Pill } from "@mantine/core";

export function PartnerBadge({ partner }: { partner: Partner }): JSX.Element | null {
    return (
        <Pill data-testid="partner-tag" size="md" radius="sm" ml="sm" bg="dark.4" fw="var(--mantine-font-weight-heavy)">
            {partner}
        </Pill>
    );
}
