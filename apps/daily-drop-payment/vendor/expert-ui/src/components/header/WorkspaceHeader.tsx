import { partnerEnabledForExpertUniversity, useExpertUniversityConfiguration } from "@expert/expert-university";
import { Badge, Flex } from "@mantine/core";

import { AsurionWorkspaceLogo } from "@/common-ui";
import { env } from "@/config";
import { useAgentStore, usePartner } from "@/sdk";
import { useFeatureFlag } from "@/shared-utils";

import { HeaderControls } from "./HeaderControls";
import { PartnerBadge } from "./PartnerBadge";
import classes from "./WorkspaceHeader.module.css";

/* TODO: If we ever want to surface the partner badge in prod,
 we will want to consider clearer display options for multi-partner experts with no active task, 
 and multi-partner support for chat experts */

export function WorkspaceHeader() {
    // PROTOTYPE DEVIATION: session ID removed from the top bar (product is dropping it).
    const partner = usePartner();
    const currentActivity = useAgentStore((state) => state.activity);
    const { data: isInExpertUniversityPilot } = useFeatureFlag("isInExpertUniversityPilot");
    const trainingBadge = "Training Mode";
    const { trainingPartner } = useExpertUniversityConfiguration();
    const isExpertUniversityEnabled =
        partnerEnabledForExpertUniversity(trainingPartner, env.channel, isInExpertUniversityPilot) &&
        (currentActivity === "Training" || currentActivity === "Residency");
    return (
        <Flex p="xxs" align="center" className={classes.headerContainer}>
            <Flex>
                <Flex className={classes.logo}>
                    <AsurionWorkspaceLogo />
                </Flex>
                {!env.isProdMode && <PartnerBadge partner={partner || "unknown"} />}
                {isExpertUniversityEnabled && (
                    <Badge fz="xs" ml="sm" mt="0.3rem" className={classes.trainingHeaderContainer}>
                        {trainingBadge}
                    </Badge>
                )}
            </Flex>
            <HeaderControls />
        </Flex>
    );
}
