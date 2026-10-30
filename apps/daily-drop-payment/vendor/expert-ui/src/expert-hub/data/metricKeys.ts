/**
 * Dataverse pay-metrics keys (v1/pay-metrics), grouped by bucket. Centralized so a backend
 * rename is a one-line change, and a typo can't silently surface as "no data" in a card.
 */
export const METRIC_KEYS = {
    serve: {
        ERP: "ERP",
        EXPERT_5STAR: "Expert 5Star",
        CRT: "CRT",
        /** PROTOTYPE DEVIATION: supporting metrics for detail panel. */
        VERBATIM: "Verbatim",
        FCR: "FCR",
    },
    solve: {
        TRANSFER_RATE: "Transfer Rate",
        OCR: "OCR",
        /** PROTOTYPE DEVIATION: supporting metrics for detail panel. */
        CALL_PACING: "Call Pacing",
    },
    sell: {
        NET_ENROLLS: "Net Enrolls",
        /** PROTOTYPE DEVIATION: supporting metric for detail panel. */
        TRANSFERS: "Transfers",
    },
} as const;
