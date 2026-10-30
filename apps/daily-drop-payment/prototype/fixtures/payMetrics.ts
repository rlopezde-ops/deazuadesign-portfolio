import type { PayMetrics } from '@/expert-hub/data/types'
import type { TonePreset } from '../state/usePrototypeState'

import { METRIC_KEYS } from '@/expert-hub/data/metricKeys'

/**
 * Pay-metrics fixtures per tone preset.
 *
 * Calc values push badges across the thresholds in `cards/targetProgress.ts`
 * (>=100% of target = "On track", >=75% = "At risk", <75% = "Off track").
 *
 * SALES_TARGET is 6 (Target pay tier). At-risk NE = 5 → 5/6 = 83% → At risk.
 * Payouts for net enrolls use rate-accelerator model: count × rate(count).
 */
const CALC_BY_TONE: Record<TonePreset, { erp: number; crt: number; transferRate: number; ocr: number; netEnrolls: number }> = {
  // ERP 96.4/95=101%→On track. TR 3%≤12%→100%→On track. NE 11/6=183%→On track.
  'on-track': { erp: 96.4, crt: 1180, transferRate: 0.03, ocr: 0.91, netEnrolls: 11 },
  // ERP 92.25/95=97%→At risk. TR 14% inv 12/14=86%→At risk. NE 5/6=83%→At risk.
  'at-risk': { erp: 92.25, crt: 1350, transferRate: 0.14, ocr: 0.84, netEnrolls: 5 },
  // ERP 68/95=72%→Off track. TR 22% inv 12/22=55%→Off track. NE 2/6=33%→Off track.
  behind: { erp: 68, crt: 1985, transferRate: 0.22, ocr: 0.61, netEnrolls: 2 },
}

const PREV_BY_TONE: Record<TonePreset, { erp: number; transferRate: number; netEnrolls: number }> = {
  'on-track': { erp: 94.1, transferRate: 0.05, netEnrolls: 9 },
  'at-risk': { erp: 93.8, transferRate: 0.11, netEnrolls: 8 },
  behind: { erp: 75.2, transferRate: 0.18, netEnrolls: 4 },
}

const SUPPORTING_BY_TONE: Record<TonePreset, {
  verbatim: number; fcr: number;
  callPacing: number;
  transfers: number;
}> = {
  'on-track': { verbatim: 4.7, fcr: 88.3, callPacing: 92, transfers: 3 },
  'at-risk': { verbatim: 4.2, fcr: 79.5, callPacing: 74, transfers: 5 },
  behind: { verbatim: 3.4, fcr: 62.1, callPacing: 58, transfers: 9 },
}

// Payouts reconciled against One Stop Pay Shop export (PSS-Verizon, 2026-09-22, USD proxy).
// Threshold metrics: flat payout from tier. Rate metrics: count × rate(count).
const PAYOUT_BY_TONE: Record<TonePreset, { erp: number; netEnrolls: number; transferRate: number }> = {
  'on-track': { erp: 250, netEnrolls: 550, transferRate: 250 },  // ERP≥95→Max $250, NE 11×$50=550, TR≤8%→Max $250
  'at-risk':  { erp: 100, netEnrolls: 50,  transferRate: 25  },  // ERP≥90→Target $100, NE 5×$10=50, TR≤15%→Min $25
  behind:     { erp: 0,   netEnrolls: 20,  transferRate: 0   },  // ERP 68<85→$0, NE 2×$10=20, TR 22%>15%→$0
}

/** Yesterday 11:30am, matching production's mock timestamp so "Last updated" reads naturally. */
function yesterdayTimestamp(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  d.setHours(11, 30, 0, 0)
  return d.toISOString()
}

export function getPayMetricsFixture(tone: TonePreset): PayMetrics {
  const ts = yesterdayTimestamp()
  const calc = CALC_BY_TONE[tone]
  const prev = PREV_BY_TONE[tone]
  const payout = PAYOUT_BY_TONE[tone]
  const supporting = SUPPORTING_BY_TONE[tone]

  return {
    createdOn: ts,
    modifiedOn: ts,
    totals: {
      serve: {
        [METRIC_KEYS.serve.ERP]: { calc: calc.erp, payout: payout.erp, prev: prev.erp },
        [METRIC_KEYS.serve.CRT]: { calc: calc.crt, payout: 0 },
        [METRIC_KEYS.serve.VERBATIM]: { calc: supporting.verbatim, payout: 0 },
        [METRIC_KEYS.serve.FCR]: { calc: supporting.fcr, payout: 0 },
      },
      solve: {
        [METRIC_KEYS.solve.TRANSFER_RATE]: { calc: calc.transferRate, payout: payout.transferRate, prev: prev.transferRate },
        [METRIC_KEYS.solve.OCR]: { calc: calc.ocr, payout: 0 },
        [METRIC_KEYS.solve.CALL_PACING]: { calc: supporting.callPacing, payout: 0 },
      },
      sell: {
        [METRIC_KEYS.sell.NET_ENROLLS]: { calc: calc.netEnrolls, payout: payout.netEnrolls, prev: prev.netEnrolls },
        [METRIC_KEYS.sell.TRANSFERS]: { calc: supporting.transfers, payout: 0 },
      },
    },
    clients: {},
  }
}

/** The "empty" state: metrics came back, but every bucket is blank -> cards show their empty copy. */
export function getEmptyPayMetrics(): PayMetrics {
  return {
    createdOn: yesterdayTimestamp(),
    modifiedOn: yesterdayTimestamp(),
    totals: { serve: {}, solve: {}, sell: {} },
    clients: {},
  }
}
