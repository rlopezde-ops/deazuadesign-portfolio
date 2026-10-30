/**
 * Hardcoded MVP targets shown beneath each metric card. These will move to a
 * server-driven source once product/backend defines a target API.
 */
export const CUSTOMER_RATING_ERP_TARGET = 95; // Percentage (0-100)
export const CUSTOMER_RATING_NPS_TARGET = 4.8; // 5-star rating (0-5)

/** CRT target in seconds (22 minutes 30 seconds). */
export const CRT_TARGET_SECONDS = 1350;

/** Transfer rate target (percentage, lower is better). */
export const TRANSFER_RATE_TARGET = 12;

// PROTOTYPE DEVIATION — aligned with Net Enrolls "Target" pay tier (was 10).
export const SALES_TARGET: number = 6;

export const LIVE_SALES_TARGET: number = 1;

/** On-target call-pace goal (percentage, 0-100) for the Real-Time tab. */
export const PACE_TARGET_PERCENT = 80;
