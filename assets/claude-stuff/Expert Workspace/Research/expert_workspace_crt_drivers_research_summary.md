# Expert Workspace CRT and long-call drivers

**Cross-research synthesis for the CRT Hackathon**  
**Last updated:** August 3, 2026

## Purpose

This document brings together findings from Expert Workspace field research, expert and coach focus groups, call reviews, issue logs, surveys, and product briefs. It is intended to:

- Give the hackathon team a shared summary of the recurring drivers behind long calls.
- Separate avoidable workflow friction from legitimate customer or device wait time.
- Provide direct links to the source material so the team can review the evidence in more detail.
- Make the current evidence gaps explicit so qualitative findings are not mistaken for a statistically ranked list.

## Executive summary

Across the research, long calls are rarely explained by experts simply moving too slowly. They are more often created by several forms of friction stacking together:

1. **Device and activation guidance is incomplete or unreliable.** Unsupported devices, Android and eSIM edge cases, outdated instructions, and failed activation flows force experts to search other systems or finish the process in carrier tools.
2. **Work is fragmented across disconnected tools.** Experts switch among Expert Workspace, ACSS, Opus, Ozmo, Helix, Info Manager, remote-access tools, and personal notes. Each switch adds search time, duplicate entry, and recovery effort.
3. **Guidance is sometimes generic, late, or triggered for the wrong issue.** Experts repeat completed steps, click through irrelevant flows, or ignore recommendations that do not match the conversation.
4. **Customer and prior-call context does not reliably carry forward.** Experts and customers repeat information, reconstruct what has already been tried, and manually preserve important details outside the system.
5. **Callbacks, transfers, and escalation paths can turn routine interruptions into long or unresolved interactions.** Activation-related disconnects, callback timing, voicemail loops, transfer failures, and Tier 2 waits compound the original issue.
6. **Some long-call time is legitimate dependency time.** Software updates, content transfer, reboots, weak connectivity, low battery, customer technical ability, language needs, and the need for human reassurance can determine the pace of the call.

Real-time pacing can help an expert recognize that a call is off track, but pacing alone does not remove these underlying causes. The stronger opportunity is to help the system identify **why** the call is running long and provide the right next step, tool, context, or escalation path.

## Evidence strength at a glance

### Strong, repeated evidence across multiple studies

- Incomplete or unreliable device and activation support
- Fragmented tools and manual information transfer
- Generic, inaccurate, mistimed, or irrelevant guidance
- Missing customer and prior-call context

### Moderate evidence that appears across several sources

- Callback and dropped-call recovery friction
- Transfer and escalation delays
- Customer technical ability, language, and accessibility needs
- Required device wait states such as updates, reboots, and content transfer

### Emerging contributors that need more validation

- Experts completing irrelevant flows because usage is measured
- Experts remaining connected after a transfer to ensure the customer reaches the right team
- Sales, compliance, and rapport time extending the call after the solve is complete
- The exact relationship between expert tenure and each driver

---

## 1. Incomplete or unreliable device and activation guidance

### What happens

Experts do not consistently receive a usable path for the device and activation scenario in front of them. The issue is broader than missing content for a few phone brands. The current experience can fail at several points:

- The device is not supported.
- The activation flow appears after the expert has already started in another system.
- Android physical-SIM or eSIM logic does not match the real scenario.
- The expert must choose an inaccurate answer to progress.
- A claim check or backend action fails.
- The flow does not show enough status information to verify that activation succeeded.
- The expert has guidance only in English while supporting a Spanish-language call.

### Supporting evidence

- The Orlando onsite found that the device selector primarily supported Apple and Samsung, while experts had to find separate instructions for other devices.
- The **AT&T Device Activation focus group** included seven experts across four sessions. Participants reported limited support for Pixel, Motorola, tablets, and smartwatches, plus frequent Android and eSIM problems. When the flow worked, experts estimated activation could take roughly **5 to 7 minutes instead of 8 to 15 minutes**. This is self-reported, not a controlled measurement.
- The **Expert Assist survey**, with more than 320 voice responses, found repeated complaints about newer devices not being recognized, outdated operating-system steps, incorrect Android paths, and generic troubleshooting.
- A July 2026 Philippines debrief based on roughly 24 conversations identified expansion of device activation guidance to additional devices as a top priority.
- The Clark coach and operations focus group repeated requests for Pixel and smartwatch support.

### How this increases call length

1. The expert identifies that the available path does not match the device or scenario.
2. They search Ozmo, Opus, ACSS, Info Manager, Helix, or another source.
3. They translate or adapt the instructions to the customer’s device.
4. They return to another system to complete or verify the activation.
5. If activation disconnects the call, the expert enters a callback and recovery loop.

### Stronger driver statement

> Activation calls take longer when Expert Workspace cannot identify, complete, and verify the correct device-specific path end to end, forcing experts to search or finish the process in carrier systems.

### Dig deeper

- [AT&T Device Activation - focus group summary](https://app.notion.com/p/2429532a1f868098a32bc5cecdf17593?pvs=1)
- [Expert Assist survey feedback Q3 2025](https://app.notion.com/p/2809532a1f868073aba7fd560d677d92?pvs=1)
- [7.20 Philippines feedback and action planning](https://app.notion.com/p/3ae9532a1f8680f8b01de3fde8219111?pvs=1)
- [Clark Expert Workspace Guided Flow coach and OM focus group](https://app.notion.com/p/3989532a1f868035b92ce2b5f57d7719?pvs=1)
- [Auto-Pop IMEI for Verizon replacement device activation](https://app.notion.com/p/2c59532a1f86808cb89bc36f4ffc706f?pvs=1)

---

## 2. Fragmented tools and manual information transfer

### What happens

Expert Workspace is intended to be the primary work surface, but experts still rely on carrier systems, knowledge tools, remote-support tools, messaging, and personal notes to complete calls.

Observed tool paths included repeated switching among:

- Expert Workspace
- ACSS
- Opus
- Ozmo
- Helix
- Info Manager
- LogMeIn or Rescue
- Outlook or Notepad
- External websites and client systems

The problem is not only the number of tabs. Experts must decide which source is trustworthy, remember where they were in the call, move information between systems, and monitor call state while working elsewhere.

### Supporting evidence

- The Orlando current-state workshop documented a repeated path of `Expert Workspace > ACSS > Ozmo > ACSS > Expert Workspace > ACSS` and rated the issue high in frequency and severity.
- Orlando experts used external notes because they did not trust important information to persist.
- The AT&T activation research found that experts returned to Opus when Guided Flow failed or when they needed to verify eSIM status.
- Philippines field research reported slow-loading or unavailable systems, outdated device content, and repeated demand for consolidated tools and resources.
- The callback issue log found that experts could miss the callback scheduling window while toggled into ACSS.

### How this increases call length

- Search time across systems
- Duplicate data entry and reformatting
- Repeated verification or troubleshooting
- Loss of conversational context after switching
- Missed call-state or callback signals
- Additional recovery when a system fails or loads the wrong information

### Stronger driver statement

> Long calls are extended by the work required to find, move, verify, and recover information across disconnected systems, not just by the troubleshooting itself.

### Dig deeper

- [Orlando Current State Journey Map](https://app.notion.com/p/3119532a1f8680cdbf7de82e96a1f243?pvs=1)
- [Workspace Research - Orlando Call Center 01/22/26](https://app.notion.com/p/2f19532a1f868076b309c4a7057bdc5f?pvs=1)
- [Philippines March 2025 field research](https://app.notion.com/p/1b99532a1f8680f8bb95e87d4a282ded?pvs=1)
- [Orlando Site Visit - Expert Workspace Engineering Q&A](https://app.notion.com/p/2879532a1f8680178d55c7283bba06fc?pvs=1)
- [Expert Workspace Unification](https://app.notion.com/p/3519532a1f86809c85dacd30a659b995?pvs=1)

---

## 3. Guidance that is generic, late, irrelevant, or forced

### What happens

Guidance can add time instead of saving it when it:

- Repeats troubleshooting that has already been completed
- Uses outdated or incorrect device steps
- Appears after the expert has already started solving elsewhere
- Triggers for the wrong call driver
- Requires the expert to click through irrelevant steps
- Does not provide a clear way to dismiss or replace the recommendation

### Supporting evidence

- Orlando experts described Expert Assist as an escape hatch they used after basic troubleshooting failed, only to receive many of the same basic steps again.
- The Clark focus group found that the Network and Connectivity flow sometimes triggered when networking was not the primary problem. Experts asked for a way to confirm or discard the suggested flow.
- A five-call Verizon onboarding review showed experts manually clicking through irrelevant activation steps, including one call with more than 15 unnecessary steps, apparently because flow use was being measured.
- The Expert Assist survey found generic answers, weak context retention, outdated steps, and irrelevant responses.

### Important counterexample

The research also shows that the right guidance can improve outcomes. Clark coaches said well-matched flows reduce unnecessary restarts, standardize troubleshooting, clarify when to transfer, and can improve CRT and resolution. The problem is not guided flows as a concept. It is **accuracy, timing, relevance, and control**.

### Stronger driver statement

> Guidance increases CRT when it does not recognize the real issue, the work already completed, or the expert’s current path, causing unnecessary steps and parallel troubleshooting.

### Dig deeper

- [Clark Expert Workspace Guided Flow coach and OM focus group](https://app.notion.com/p/3989532a1f868035b92ce2b5f57d7719?pvs=1)
- [Verizon Onboarding Call Review](https://app.notion.com/p/3599532a1f868086bccdfcedc3a7459f?pvs=1)
- [Expert Assist survey feedback Q3 2025](https://app.notion.com/p/2809532a1f868073aba7fd560d677d92?pvs=1)
- [Workspace Research - Orlando Call Center 01/22/26](https://app.notion.com/p/2f19532a1f868076b309c4a7057bdc5f?pvs=1)

---

## 4. Missing context and repeated discovery

### What happens

Experts often begin or resume a call without enough trusted context about:

- Who the customer is
- The device and line involved
- Why the customer is calling
- What they already told the IVR
- What another expert already attempted
- Whether the customer has already received or declined an offer
- The latest account, activation, or escalation state

Customers then repeat themselves, while experts rebuild the issue from notes, transcripts, or another system.

### Supporting evidence

- The Previous Session Summary brief reports that **40% of analyzed Verizon Soluto calls** were associated with a customer who had a previous call, while 10.7% of customers had a previous call. This establishes broad exposure to repeat-contact context, but does not quantify time saved.
- Philippines research found recurring customer frustration about repeating information and troubleshooting across contacts.
- Clark coaches asked for previous-session visibility because of repeat callers and the need to know whether an offer had already been declined.
- The Warm Handoff brief identifies discovery time spent re-asking for information already collected by the IVR.
- Orlando experts manually recorded customer details and prior steps because they did not trust the system to retain them.

### How this increases call length

- Repeating identity, issue, and device questions
- Reconstructing the troubleshooting path
- Repeating failed steps
- Searching prior notes or systems
- Starting the call with confusion instead of a confident confirmation

### Stronger driver statement

> Missing handoff and historical context creates a repeated-discovery tax before an expert can make new progress.

### Dig deeper

- [Previous Session Summary](https://app.notion.com/p/795042f52a0f416f90ffcac3e77f6344?pvs=1)
- [Warm Handoff](https://app.notion.com/p/3579532a1f8680a9835bdf88454e94cb?pvs=1)
- [Philippines March 2025 field research](https://app.notion.com/p/1b99532a1f8680f8bb95e87d4a282ded?pvs=1)
- [Orlando Current State Journey Map](https://app.notion.com/p/3119532a1f8680cdbf7de82e96a1f243?pvs=1)

---

## 5. Callback, transfer, and escalation friction

### What happens

A device reboot, reset, activation, weak connection, or transfer can interrupt the interaction. The recovery path can then become longer than the original step:

- The customer disconnects during activation.
- The expert schedules an immediate callback.
- The callback routes to voicemail or fails.
- The expert retries, waits, or asks the customer to call back.
- Transfer controls freeze, disappear, or fail to send IVR input.
- The expert waits for Tier 2 or stays connected to make sure the customer reaches the correct team.

### Supporting evidence

- The Verizon onboarding review observed activation-related disconnects and immediate callbacks that went to voicemail.
- A callback recovery issue log consolidated more than 15 examples of dropped-call-to-voicemail behavior. The later investigation found mixed causes, including customer connectivity and experts missing the scheduling window while working in ACSS.
- The Orlando engineering Q&A documented callback failures, frozen transfers, disappearing controls, DTMF and dial-pad problems, and incorrect account state.
- The Tier 2 support analysis identifies waiting for reactive Helix support and lack of systematic insight into recurring escalation topics.
- A cold-transfer investigation contains extreme examples of experts staying connected after transfer. That page labels its own evidence strength as low, so this should be treated as a long-tail hypothesis rather than a proven broad pattern.

### Stronger driver statement

> Routine interruptions become long or unresolved calls when callback, transfer, and escalation paths do not preserve context or provide a dependable recovery path.

### Dig deeper

- [No Callback Recovery Path After VoIP or QR-Code Call Drops](https://app.notion.com/p/3799532a1f86811589cdef8b0c3df304?pvs=1)
- [Orlando Site Visit - Expert Workspace Engineering Q&A](https://app.notion.com/p/2879532a1f8680178d55c7283bba06fc?pvs=1)
- [Cold Transfers - What process are experts following?](https://app.notion.com/p/2889532a1f8680fab652fbf2b7186d31?pvs=1)
- [Tech Leads Tier 2 Support Analysis](https://app.notion.com/p/15f9532a1f868003bf75f90a54067362?pvs=1)
- [Verizon Onboarding Call Review](https://app.notion.com/p/3599532a1f868086bccdfcedc3a7459f?pvs=1)

---

## 6. Required device wait time and customer pace

### What happens

Some long-call time is not caused by a poor expert workflow. The customer or device determines the pace because the interaction requires:

- Operating-system updates
- Device reboots or subscriber sync
- Content transfer
- App downloads and remote-access setup
- Charging a low-battery device
- Recovery from weak Wi-Fi or cellular service
- Step-by-step support for a less technical customer
- Reassurance while completing a high-risk setup or reset

### Supporting evidence

- In one Verizon onboarding call, roughly 40 minutes were observed as dead air while an iPhone update completed. Content transfer did not begin until after the one-hour mark.
- The same call review showed multi-person calls, low battery, repeated setup, remote access, and customers who wanted the expert to remain present for reassurance.
- Philippines Staples research found that calls with older, less technically experienced customers frequently lasted one to two hours.
- Orlando experts described subscriber-sync and reboot timing that could exceed callback constraints, especially on Android devices.

### Why this distinction matters

A timer should not treat 40 minutes waiting for a required software update the same as 40 minutes spent searching through tools or repeating ineffective troubleshooting. Long-call interventions need to distinguish:

- **Active solve time**
- **Avoidable system friction**
- **Required wait time**
- **Customer-guidance and reassurance time**

### Stronger driver statement

> Part of the long-call tail is created by device and customer dependencies that cannot be eliminated, but can be better predicted, managed, communicated, or moved into a safer callback or asynchronous path.

### Dig deeper

- [Verizon Onboarding Call Review](https://app.notion.com/p/3599532a1f868086bccdfcedc3a7459f?pvs=1)
- [Philippines March 2025 field research](https://app.notion.com/p/1b99532a1f8680f8bb95e87d4a282ded?pvs=1)
- [Orlando Call Center Onsite research hub](https://app.notion.com/p/30d9532a1f8680d4a48ac9d2b25ab83d?pvs=1)

---

## 7. Language, accessibility, and technical-confidence barriers

### What happens

The same troubleshooting path can take substantially longer when:

- Guidance is available only in English.
- Device labels differ across Apple, Samsung, Motorola, Pixel, or older operating systems.
- The customer has limited technical familiarity.
- The customer has a disability, cannot travel to a store, or cannot easily receive a verification code.
- Remote-access installation requires many steps.
- The expert is translating instructions while maintaining a natural conversation.

### Supporting evidence

- Orlando experts said Ozmo guidance was not available in Spanish and that device settings differed significantly by brand.
- Philippines research identified language barriers for experts who speak English as a second language and difficult remote-access setup for older customers.
- Activation research documented verification barriers for single-line customers and customers who could not receive a one-time code on the device being activated.

### Stronger driver statement

> Long calls increase when the guidance assumes a fluent, technically confident customer with a supported device and an easy verification path.

### Dig deeper

- [Philippines March 2025 field research](https://app.notion.com/p/1b99532a1f8680f8bb95e87d4a282ded?pvs=1)
- [AT&T Device Activation - focus group summary](https://app.notion.com/p/2429532a1f868098a32bc5cecdf17593?pvs=1)
- [Orlando Call Center Onsite research hub](https://app.notion.com/p/30d9532a1f8680d4a48ac9d2b25ab83d?pvs=1)

---

## 8. Sales, compliance, and other non-solve time

### What happens

CRT includes more than troubleshooting. Calls can continue after the technical issue is resolved because experts must:

- Deliver required sales or compliance language
- Build rapport and transition into an offer
- Repeat language when automated detection does not recognize completion
- Complete required flow steps or dispositions
- Wait for the customer to review or act on a sales link

Some experts also reported intentionally slowing a fast activation call to preserve rapport and create a natural sales opportunity. This may support revenue while increasing CRT, so it should not automatically be classified as waste.

### Supporting evidence

- Orlando journey mapping connected long troubleshooting and sales language to CRT and called for shorter, easier-to-comprehend wording.
- AT&T activation participants said faster activation created more room to sell, but some intentionally slowed the conversation to build rapport.
- The proposed Expert Call Segment Analysis exists specifically because the team does not yet have a reliable breakdown of rapport, solving, waiting, selling, and other call segments.

### Stronger driver statement

> Total call length reflects a tradeoff among solve time, customer reassurance, compliance, and sales behavior. Reducing CRT without segment-level visibility risks removing valuable time along with waste.

### Dig deeper

- [Expert Call Segment Analysis](https://app.notion.com/p/12e9532a1f868063921ad653acda2afd?pvs=1)
- [AT&T Device Activation - focus group summary](https://app.notion.com/p/2429532a1f868098a32bc5cecdf17593?pvs=1)
- [Orlando Current State Journey Map](https://app.notion.com/p/3119532a1f8680cdbf7de82e96a1f243?pvs=1)

---

## How to frame the drivers

### Avoidable system and workflow friction

- Unsupported or unreliable device paths
- Tool switching and manual data transfer
- Repeated or irrelevant troubleshooting
- Missing handoff and prior-call context
- Broken callback, transfer, or escalation recovery
- Manual lookups, verification, and note-taking

### Legitimate dependency time

- Updates, reboots, sync, and content transfer
- Weak connectivity or low battery
- Customer technical ability and accessibility needs
- Human reassurance during setup, reset, or activation

### Behavioral and operational contributors to validate

- Completing irrelevant flows for usage credit
- Remaining connected during transfers
- Delaying escalation or repeating familiar steps
- Extending rapport or sales time
- Lack of awareness that the call is off target

---

## What this suggests for the hackathon

The strongest opportunity is not simply another timer. It is a system that can detect the likely reason a call is running long and respond differently based on that reason.

A useful prototype could distinguish signals such as:

- Unsupported or incorrectly identified device
- Repeated troubleshooting step
- Expert leaving Workspace for another tool
- Required update or content-transfer wait state
- Activation likely to disconnect the customer
- Callback or transfer recovery risk
- Repeat caller with prior troubleshooting history
- Call moving from solve into sales or compliance

The system could then provide a targeted next action, preserve context, recommend the correct tool or escalation path, and capture the driver as structured data. That direction supports the Expert Workspace principles of bringing the right guidance and context into one focus area, keeping up with the conversation, showing why a recommendation is being made, and removing repetitive work.

---

## Evidence caveat

This research supports a set of **recurring qualitative drivers**, but it does not yet provide a defensible enterprise-wide ranking of which driver adds the most minutes or affects the most calls.

Important limitations:

- The sources use different methods, populations, clients, and time periods.
- Several findings come from small call-review samples or individual examples.
- Some activation-time improvements are expert-reported rather than measured through a controlled test.
- Some operational metrics are team-reported and do not use a consistent denominator or comparison group.
- Product briefs may contain opportunity estimates, such as the estimated 110 seconds for IMEI auto-population, rather than observed post-launch results.
- Callback and transfer problems can combine product defects, carrier behavior, customer connectivity, and expert process gaps.
- A long call is not automatically a bad call. Some time reflects necessary device processing, accessibility support, reassurance, compliance, or revenue-generating behavior.
- Visual Call Pacing has a promising pilot readout, including a reported 47-second handle-time improvement, but the cohort and study design limit causal certainty.

The current evidence is strong enough to identify and prototype around the recurring problems. It is **not** strong enough to claim a precise causal ranking or predict the total CRT reduction from solving any one driver.

## Research gaps to close

1. **Classify long calls by driver.** Review a representative sample of calls above the long-call threshold and assign one or more reason codes.
2. **Measure call segments.** Separate discovery, active troubleshooting, tool search, waiting, escalation, sales, compliance, and after-call work.
3. **Quantify frequency and added time.** Determine how often each driver occurs and the median or P95 time associated with it.
4. **Connect drivers to outcomes.** Measure resolution, repeat contact, transfer, sales, customer satisfaction, and expert tenure alongside CRT.
5. **Instrument the workflow.** Capture tool switches, flow triggers, flow dismissals, callback attempts, transfer attempts, wait states, and repeated steps.
6. **Validate across call types and devices.** Activation, network, application, account-management, hardware, and onboarding calls may have very different long-call patterns.
7. **Distinguish wait from waste.** Build reporting that separates required device or customer time from avoidable system friction.

The proposed [Expert Call Segment Analysis](https://app.notion.com/p/12e9532a1f868063921ad653acda2afd?pvs=1) would help answer several of these questions, but its Notion brief currently lists it as not started.

---

## Primary research and evidence links

### Orlando research

- [Orlando Call Center Onsite - full research hub](https://app.notion.com/p/30d9532a1f8680d4a48ac9d2b25ab83d?pvs=1) - Field-study database, expert and coach sessions, workshops, call notes, and supporting resources.
- [Current State Journey Map](https://app.notion.com/p/3119532a1f8680cdbf7de82e96a1f243?pvs=1) - Synthesized current-state workflow, pain points, and future-state discussion.
- [Workspace Research - Orlando Call Center 01/22/26](https://app.notion.com/p/2f19532a1f868076b309c4a7057bdc5f?pvs=1) - Earlier observation visit with a concise overview, TL;DR, and opportunity areas.
- [Orlando Site Visit - Expert Workspace Engineering Q&A](https://app.notion.com/p/2879532a1f8680178d55c7283bba06fc?pvs=1) - Platform, callback, audio, transfer, and call-control issues.

### Device activation and guidance

- [AT&T Device Activation - focus group summary](https://app.notion.com/p/2429532a1f868098a32bc5cecdf17593?pvs=1) - Seven participants across four sessions; Android, eSIM, device coverage, reliability, verification, and Opus fallback.
- [Verizon Onboarding Call Review](https://app.notion.com/p/3599532a1f868086bccdfcedc3a7459f?pvs=1) - Five detailed activation and setup call reviews.
- [Clark Expert Workspace Guided Flow coach and OM focus group](https://app.notion.com/p/3989532a1f868035b92ce2b5f57d7719?pvs=1) - Guided Flow adoption, trigger relevance, device requests, escalation, and coach needs.
- [Expert Assist survey feedback Q3 2025](https://app.notion.com/p/2809532a1f868073aba7fd560d677d92?pvs=1) - More than 320 voice responses plus messaging feedback.
- [Auto-Pop IMEI for Verizon replacement device activation](https://app.notion.com/p/2c59532a1f86808cb89bc36f4ffc706f?pvs=1) - Manual identifier lookup problem and estimated opportunity.

### Broader field research

- [Philippines March 2025](https://app.notion.com/p/1b99532a1f8680f8bb95e87d4a282ded?pvs=1) - Call listening and focus groups across Verizon Soluto, McAfee, Staples, and other programs.
- [7.20 Philippines feedback and action planning](https://app.notion.com/p/3ae9532a1f8680f8b01de3fde8219111?pvs=1) - Debrief from roughly 24 conversations and Q3 prioritization.

### Context, recovery, and measurement

- [Previous Session Summary](https://app.notion.com/p/795042f52a0f416f90ffcac3e77f6344?pvs=1) - Repeat-contact prevalence and historical-context opportunity.
- [Warm Handoff](https://app.notion.com/p/3579532a1f8680a9835bdf88454e94cb?pvs=1) - Repeated discovery between the IVR and expert.
- [No Callback Recovery Path After VoIP or QR-Code Call Drops](https://app.notion.com/p/3799532a1f86811589cdef8b0c3df304?pvs=1) - Callback evidence, process gaps, and monitoring status.
- [Cold Transfers - What process are experts following?](https://app.notion.com/p/2889532a1f8680fab652fbf2b7186d31?pvs=1) - Low-confidence examples of experts staying connected after transfer.
- [Tech Leads Tier 2 Support Analysis](https://app.notion.com/p/15f9532a1f868003bf75f90a54067362?pvs=1) - Escalation wait and recurring support-content gaps.
- [Expert Workspace weekly metrics digest - July 13, 2026](https://app.notion.com/p/39c9532a1f868048840acb3f8b995caf?pvs=1) - Visual Call Pacing and Guided Flow metrics, plus measurement limitations.
- [Expert Call Segment Analysis](https://app.notion.com/p/12e9532a1f868063921ad653acda2afd?pvs=1) - Proposed approach to separating rapport, solving, selling, and other call time.
