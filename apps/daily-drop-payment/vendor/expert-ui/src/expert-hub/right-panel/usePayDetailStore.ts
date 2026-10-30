import type { PayableMetricKey } from "../data/payTiers";

import { createSimpleStore } from "@expert/state-utils";

interface PayDetailState {
    metricKey: PayableMetricKey | null;
    setMetricKey: (key: PayableMetricKey) => void;
}

export const usePayDetailStore = createSimpleStore<PayDetailState>({
    devtools: {
        store: "pay-detail",
        name: "expert-hub/pay-detail",
        isProd: false,
    },
})((set) => ({
    metricKey: null,
    setMetricKey: (key) => set({ metricKey: key }),
}));
