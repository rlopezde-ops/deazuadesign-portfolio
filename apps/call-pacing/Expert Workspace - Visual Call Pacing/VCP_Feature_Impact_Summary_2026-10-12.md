# Visual Call Pacing — Feature Impact Summary

*Prepared October 12, 2026. Sources: Power BI VCP Trended Summary (Verizon, 9/28–10/11), Exec Listening 8.14 deck, VCP Initiative Review (SharePoint), Notion VCP product page, VCP 1.5 brief, VCP CS Hub, HUB Initiative Review notes (7/28, 9/22).*

## Bottom line

VCP works as a nudge: making the target visible moves behavior with no change to scripts or coaching. VCP 1.0 delivered a modest but real CRT reduction (about 10 seconds blended across the enterprise, roughly 14–51 seconds where it could be isolated), with sales, resolution and transfers holding or improving. VCP 1.5, the more visible countdown UI, is beating the 1.0 UI by about 21 seconds per call in a clean 50/50 test on Verizon. A slight sales dip needs watching before it scales.

## 1. Pre-VCP → VCP 1.0

| Measure | Result | Source / caveat |
|---|---|---|
| Enterprise CRT impact | **~10 sec** in aggregate | Exec deck; "still taking shape" |
| VZ pilot CRT (vs. Clark site, pre 4/1–5/17 → post 5/18–5/31, n=119) | **−14 sec incremental** (VCP +34s vs. Clark +48s) | Initiative Review deck |
| VZ pilot sales | **+0.4 pts incremental** (+1.2 vs. +0.8) | Same |
| VZ pilot transfers | **−4 pts vs. Clark** (−2 vs. +2) | Same |
| VZ pilot resolution | **Stable at 85%** | Same |
| ERP lift | +6 pts in the ERP-overlap cohort vs. **+1 pt VCP-only** | Most of the lift came from ERP, not VCP |
| On-target rate (pilot) | 64.9% vs. 52.1% control; 66.7% across the first 550 sessions; deck says 75.4% (up from ~61%) | Three different cuts, so align on one before the readout |
| AT&T at scale (vs. pre-launch) | **−51 sec CRT**, +2.7% hit CRT goal, SP100 +0.2 pts, transfers flat, resolution −0.8% | Deck appendix; Cebu is heavy on new hires, so some of the gain is ramp |
| Verizon at scale | CRT flat with a downward trend; slight ERP and resolution gains; no sales hit | Sara Handa, 7/17. ~150k extra calls/week from volume shocks hide the VCP effect |

**Data flag:** the hidden appendix slide (10) shows Verizon at "−56 sec CRT," but the same slide says "CRT increased across most categories" and "No visible CRT impact yet." The number's sign is probably wrong. Fix it before this slide goes in front of anyone.

## 2. VCP 1.0 → VCP 1.5 (A/B test, Verizon Soluto, 9/28–10/11)

Treatment = `glow_bar` (1.5 countdown UI); control = `pill` (1.0 UI). The split is clean: ~85.8k calls in each arm.

| Metric | VCP 1.5 (glow_bar) | VCP 1.0 (pill) | Δ |
|---|---|---|---|
| Inbound calls | 85,751 | 85,804 | balanced |
| CRT (sec) | **1,650** | 1,671 | **−21 sec (−1.3%)** |
| % sessions on target | **52%** | 51% | **+1 pt** |
| SP100 | 4.54 | 4.60 | **−0.06 (−1.3%)** ⚠️ |

**Weekly CRT gap (1.5 vs. 1.0):** −15s (week of 10/02), −31s (10/09), −17s (10/16, partial). 1.5 won every week.

**Daily:** 1.5 won 9 of the 11 visible days. The biggest gaps came on the weekend of 10/03–10/04 (−78s each day). The two misses were 10/01 (+2s) and 10/11 (+55s).

**Watch items:**

- **SP100 is a bit lower for 1.5 in every week** (4.39 vs. 4.50, 4.64 vs. 4.67, 4.64 vs. 4.74). The gap is small, but it points the same way every time. Treat it as a guardrail before scaling.
- **CRT is rising in both arms** (~1,600 → ~1,700 over the two weeks). That's an environmental trend, not a VCP effect. The test isolates the 1.5 vs. 1.0 delta, but absolute CRT is moving the wrong way.
- **On-target rate (~51–52%) is far below the pilot's 65–75%.** It isn't the default targets: unclassified calls hit target *more* often (55%) than classified ones (50%). The on-target rate tracks how tight each target is against current call time (see section 3).
- **The intent mismatch** (timer intent vs. customer panel) is the main expert and coach complaint. It's the reason 1.5 is held in A/B (10/7 review).

**Sizing (directional):** Verizon Soluto runs about 85.8k calls a week. At −21s per call, 1.5 across the full population is worth about **500 handle-hours a week (~26k hours a year)** over the 1.0 UI. About half of that (~250 hrs/week) is the extra gain from moving the control half over.

## 3. Why on-target is ~50%: call category breakdown (Verizon, 9/28–10/11, both arms)

| Category | Share of calls | Share of misses | On target | Target ÷ current CRT | Avg secs over target |
|---|---|---|---|---|---|
| No Results Available | 27.0% | 26.9% | 52% | 0.82 | +298 |
| Device Activation | 22.7% | 24.7% | 47% | 0.80 | +408 |
| Connectivity & Network | 9.9% | 10.3% | 49% | 0.87 | +225 |
| Insurance & Claims | 7.7% | 7.7% | 51% | 0.83 | +209 |
| Not Enough Information | 8.5% | 6.1% | 65% | 1.01 | −13 |
| All other categories (10) | 24.2% | 24.3% | 43–57% | 0.73–0.97 | +44 to +603 |

- **Targets are the driver.** The tighter the target against today's call time, the lower the on-target rate. Targets were set ~20% below average call time and haven't moved while call times rose.
- **Two categories are half the problem.** No Results Available and Device Activation together are ~50% of calls and ~52% of missed targets.
- **Sales-heavy calls outgrow the +2 min buffer.** Security & Privacy has the highest sales rate (SP100 10.28), the lowest on-target rate (43%) and runs +603s over target. This supports VCP 2.0.

## 4. Action plan: fix the two biggest call types

**Goal:** cut handle time on the two call types that account for half of all missed targets. The numbers to move are each call type's **CRT gap to target** and **on-target rate**. Raising the on-target rate by loosening targets doesn't count as a win.

| | No Results Available | Device Activation |
|---|---|---|
| Weekly volume | ~23,100 calls | ~19,500 calls |
| Today | 52% on target · +298s over | 47% on target · +408s over |
| Proposed goal (by end of Nov) | Share of calls ≤15% (from 27%) | Gap ≤200s (from 408s) |
| Value if goal is hit | Unlocks real targets for ~12% of calls; time saved sized after A1 | **~1,100 handle-hours/week** (204s × 19.5k calls) |

*Goals and owners are proposals. Confirm them at the next HUB Initiative Review.*

### Track A — No Results Available: "Why can't we identify the call type?"

| # | Action | Owner (proposed) | Due | Output | Decision it unlocks |
|---|---|---|---|---|---|
| A1 | Cross-tab No Results calls by the **expert-tagged** category (VCP already logs `gaiaCallCategory` and `CallCategory`) | Sara Handa | Fri 10/16 | What these calls actually are, by volume | Which fix in A2 applies to how much volume |
| A2 | Split No Results into its root causes: (a) GAIA never got confident, (b) category returned but has no target configured (e.g., `DEVICE_REPLACEMENT`, `DEVICE_DAMAGE`), (c) multi-issue calls, (d) IVR vs. GAIA conflict | Sara Handa + Crystal Thomas | Fri 10/16 | % of No Results volume per cause | Which fix to build first |
| A3 | **Quick win:** configure targets for any category found in A2(b) | Crystal Thomas (config) | Within 1 week of A2 | Targets live for those categories | None; a config change, not a model change |
| A4 | Confirm what target No Results calls receive today (avg 1,352s doesn't match the 15:00 Verizon default) | Crystal Thomas | Fri 10/16 | Documented target logic | Whether the current target is even correct |
| A5 | Use the Convo IVR intent as an early fallback when GAIA isn't confident. Tie this to the single-intent-model decision already blocking 1.5 | Crystal Thomas + Austin (data) | Proposal by Fri 10/23 | Recommendation + LOE | Pick one intent model; unblocks 1.5 scale too |

### Track B — Device Activation: data transfer + guided flows

| # | Action | Owner (proposed) | Due | Output | Decision it unlocks |
|---|---|---|---|---|---|
| B1 | Break Device Activation call time into segments: test call, data transfer hold, everything else | Sara Handa | Fri 10/16 | Seconds per segment | How much of the 408s gap each fix can close |
| B2 | Pull Device Activation call time and volume **by device manufacturer** (Apple, Samsung, other) | Sara Handa | Fri 10/16 | Call-time gap for non-Apple/Samsung | Whether new guided flows are worth building |
| B3 | Launch the **Smart Activations SMS confirmation** pilot. It replaces the live test call (20s–10+ min) and is ready to go | Product (confirm owner after Heather's departure) + Daniel Foster (pilot group) | Pilot live by 10/26 | Activation call time + confirmation time, pilot vs. control | Scale or iterate |
| B4 | Set a clear **data-transfer rule**: when the expert can end the call once a transfer is running. Track it with the proposed 4th OAI moment ("expert stays through transfer") | Ops + Kristi Turner (coaching) + Sara (OAI moment) | Rule drafted by 10/23 | Coaching guidance + tracking | Whether to explore a mid-transfer handoff to messaging |
| B5 | **If B2 confirms a gap:** prioritize guided flows in Logic Builder for the highest-volume non-Apple/Samsung devices | Logic Builder / CI team | Backlog by 10/30 | Ranked device list + build plan | Build order |
| B6 | Lift adoption of the **existing** activation guide (~65% usage, ~48% completion; 90% of audited calls strayed from the flow) before or alongside new flows | CI team + Ops | Plan by 10/30 | Fixes for the known UX issues (guide tab hidden behind other tools; can't jump in mid-flow) | Whether new flows will actually get used |

### Guardrails (both tracks)

Resolution, transfers, SP100, and customer survey results, tracked weekly for each call type. Don't change targets while these fixes are being measured. Change one variable at a time so the impact can be attributed.

### This week's checklist

1. Sara: A1, A2, B1, B2 data pulls (one request, due Fri 10/16).
2. Crystal: A4 target logic, plus confirm the Smart Activations owner.
3. Daniel: add both tracks to the next HUB Initiative Review agenda as a decision item.

## 5. What this means for the next updates

1. **Scale 1.5 once two things are true:** the SP100 gap is confirmed as noise, or explained by call mix, and one intent model is chosen for both the display and the trigger.
2. **Tune targets by category.** The pilot showed Billing and Voicemail targets are too loose, and Software, Messaging and Phone Calls run over. The AT&T default timer was too easy (later tightened from 1200s to 900s).
3. **VCP 2.0 (Solve + Sales timer) is the bigger CRT lever.** It tightens targets on sales-ineligible calls and protects sell time on eligible ones. Build it on the 1.5 UI.
4. **Pair VCP with coaching.** About 49 AT&T pilot experts trended the wrong way; access alone didn't change their behavior. Honeycomb VCP indicators and CRT alerts close that loop.
5. **Expand reach.** VCP in Alpha (Verizon Mobility/Protection claims, 4 Nuvali teams) has its functional test 10/14 and goes live 10/15. AT&T 1.5 is still on hold, and AT&T NAC is a fast-follow.
