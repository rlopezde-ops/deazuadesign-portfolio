# Expert Workspace - Orlando Call Center CRT Drivers

## Transcript

### User

go through my orlando call center visit notes and identify a few long crt or call length drivers. One driver I remember is that experts dont have easy ways to guide them or help them activate devices that arent iphone or samsung phones. This created situations where experts had to look for the activation steps in a separate system and it made it take longer

### ChatGPT

Yes, your memory is accurate. The clearest version of that finding is:

> **Incomplete device-specific guidance makes activation and troubleshooting slower, especially for phones outside Apple and Samsung.**

An expert said the Toolbox device selector **“only shows Samsung, Apple”** and does not show other devices. Experts also described activation guidance that does not trigger when needed; by the time it appears, they may already be halfway through the activation in Opus. For Spanish calls, device-specific differences across Samsung, Motorola, and iPhone become even harder because Osmo only provides English guidance. [Supporting excerpts from the Orlando notes](sandbox:/mnt/data/orlando_crt_driver_evidence.md)

## The strongest call-length drivers I found

### 1. Incomplete device and activation guidance

Experts do not consistently get guidance for the device in front of them. When the device is unsupported, the activation flow does not appear, or the guidance is not available in the customer’s language, experts have to search another system, translate instructions, rely on memory, or ask another expert.

This adds time through:

- Searching for the right device instructions
- Switching to Opus, Osmo, Helix, or Info Manager
- Manually adapting steps to the customer’s device
- Completing a guided flow that may not actually help, but is still required for performance credit

This is broader than simply “we need more device content.” The system is not reliably identifying the device, presenting the relevant path, or giving the expert a usable fallback.

### 2. Constant switching between disconnected tools

This was one of the most consistently supported drivers. The workshop documented the repeated path:

> **Expert Workspace → ACSS → Osmo → ACSS → Expert Workspace → ACSS**

The research rated this as **high frequency and high severity**. Observed calls also involved Outlook or Notepad, ACSS, guided flows, Expert Assist, Osmo, Info Manager, customer disclosures, and external websites.

Each switch introduces small delays, but the bigger cost is that experts must remember where they were, manually transfer information, and decide which tool to use next. That decision-making burden becomes especially costly during unfamiliar or complex calls. [Supporting excerpts from the Orlando notes](sandbox:/mnt/data/orlando_crt_driver_evidence.md)

### 3. Troubleshooting guidance repeats work or arrives too late

Expert Assist was described as an “escape hatch” experts use after basic troubleshooting fails. But it often repeats steps they have already completed instead of advancing them to deeper diagnosis. The workshop explicitly associated this problem with **average handle time**.

Related examples included:

- Quick Solve refreshing every 60 seconds with irrelevant suggestions
- Guided flows that do not match the actual conversation
- Experts clicking through flows primarily to satisfy usage metrics
- Coaches saying experts need better probing questions to narrow the issue faster
- Experienced experts relying on tribal knowledge because the system does not provide deeper troubleshooting

A useful driver statement would be:

> **The system does not reliably narrow the problem or recognize what has already been tried, causing experts to repeat steps, take unnecessary branches, and rely on external knowledge.**

### 4. Authentication rules create activation dead ends

For activation calls, experts said a customer PIN can be sufficient to access the account but is not sufficient to activate the device. Activation requires a verification text sent to a number already on the account.

This becomes a major problem when:

- The phone being activated cannot receive a text
- A new multi-line customer has several unactivated devices
- The customer is calling from a different phone
- The customer is elderly, disabled, or unable to travel to a store

Experts may then contact Verizon Customer Care, search for a store, explain the limitation, or attempt another workaround. This is both a **call-length driver and a first-contact-resolution driver** because some calls end without resolution.

### 5. Reboot, subscriber-sync, callback, and dropped-call mechanics add waiting and rework

The notes contain several concrete timing problems:

- Subscriber sync can take approximately **2.5 minutes**, while the callback timer maxes out at **2 minutes**
- Experts have to stop, wait for the callback cycle, and schedule another callback
- Android phones can take longer to reboot than Apple phones
- Dropped calls may provide no notification
- A callback-pending loop can prevent the expert from reconnecting and require a full system restart
- Scheduled callbacks cannot always be canceled when no longer needed

These delays are not caused by the expert’s troubleshooting behavior. They are built into the interaction mechanics. The standardized call-flow discussion estimated that roughly **30% of calls involve callbacks during the interaction**, making this more than an edge case. [Supporting excerpts from the Orlando notes](sandbox:/mnt/data/orlando_crt_driver_evidence.md)

### 6. Missing context causes experts and customers to repeat work

Experts manually record IMEIs, PINs, phone numbers, previous troubleshooting, and call reasons because they do not trust the information to persist. Customers transferred from another team may still have to explain what happened and confirm which steps were already completed.

The notes also described:

- Customers becoming frustrated after multiple contacts
- Experts asking customers to recount what they already tried
- Phone numbers being manually reformatted for another system
- “No summary available” appearing when previous-call context should be present
- Experts copying information from personal notes back into the system

This produces a recurring **rediscovery tax** at the start and throughout the call.

## A secondary driver: too much required reading

The journey-mapping discussion directly connected excessive troubleshooting and sales language to CRT. Long instructions take experts longer to interpret, especially when English is not their first language. Long verbatim sales scripts then extend the call after the issue has already been resolved, and unreliable detection can cause experts to repeat language so the system checks it off.

## How I would summarize the findings

The strongest qualitative finding is not simply that experts need a better timer or need to “move faster.” Long calls often result from the system making experts do extra work:

> **Experts spend too much time finding the right guidance, moving information between systems, recovering from process limitations, and repeating work the system should already understand.**

For prioritization, I would treat these as the top three systemic drivers:

1. **Fragmented tools and manual information transfer**
2. **Incomplete or mistimed device-specific guidance**
3. **Troubleshooting that does not recognize context or advance the expert toward resolution**

Authentication and callback mechanics are narrower, but likely create some of the most severe individual long-call and unresolved-call scenarios.

These findings reinforce the Expert Workspace principles of bringing guidance and tools into one focus area, showing relevant context, and removing repetitive work so the expert can stay engaged with the customer. fileciteturn0file0

[Review the complete evidence summary](sandbox:/mnt/data/orlando_crt_driver_evidence.md)

### User

what's the link to the notion file with all the notes in case people want to dig deeper

### ChatGPT

Use this as the main “dig deeper” link:

**[Orlando Call Center Onsite — full research hub](https://app.notion.com/p/30d9532a1f8680d4a48ac9d2b25ab83d?pvs=1)**

It includes the research plan, interview and observation guide, supporting resources, and the linked **Orlando Call Center Onsite — Field Study** database containing the detailed notes. fileciteturn6file0

### User

where are the insights or the exec summary?

### ChatGPT

You’re right to question it. **The link I sent is primarily the research hub. It does not have a clear executive summary at the top.** I should not have implied that it did.

### Closest thing to the onsite insights

**[Current State Journey Map](https://app.notion.com/p/3119532a1f8680cdbf7de82e96a1f243?pvs=1)**  
Notion path: **Orlando Call Center Onsite → AI Meeting notes → Current State Journey Map**

This page contains the workshop **Overview**, synthesized current-state pain points, barriers, and the two-year vision organized around each part of the call. It also identifies activations, network connectivity, and device hardware as top call drivers that require experts to use carrier tools. fileciteturn8file0 fileciteturn11file2

It is the best existing synthesis of the February onsite, but it is still a detailed meeting summary—not a polished, concise executive summary.

### A more polished summary, but from the earlier visit

**[Workspace Research — Orlando Call Center 01/22/26](https://app.notion.com/p/2f19532a1f868076b309c4a7057bdc5f?pvs=1)**

This page has a proper structure near the top:

- Overview
- TL;DR
- Core Opportunity
- Key Observations
- Opportunity Areas

However, it summarizes the **January 22 observation visit**, not the complete February onsite and workshop. fileciteturn5file0

### Where all the raw notes live

**[Orlando Call Center Onsite — research hub](https://app.notion.com/p/30d9532a1f8680d4a48ac9d2b25ab83d?pvs=1)**

This is where people can access the field-study database, individual expert observations, workshops, feedback sessions, agenda, and other supporting material. fileciteturn6file0

For the CRT-driver work, I would share the links like this:

> **Research synthesis:** [Current State Journey Map](https://app.notion.com/p/3119532a1f8680cdbf7de82e96a1f243?pvs=1)  
> **Full notes and supporting evidence:** [Orlando Call Center Onsite](https://app.notion.com/p/30d9532a1f8680d4a48ac9d2b25ab83d?pvs=1)

There does **not appear to be one consolidated executive-summary page for the full February onsite**. The insights we just identified are currently distributed across the journey-map synthesis, expert feedback sessions, coach feedback, and individual observation notes.

### User

Any other expert workspace research that can help show other drivers or add more context to the ones identified?

### ChatGPT

Yes. The Orlando findings are **not isolated**. Other Expert Workspace research strengthens several drivers and adds two important ones: **customer/device dependency time** and **transfer/escalation behavior**.

The larger pattern is:

> **Long CRT is usually a stack of problems:** incomplete guidance leads to tool switching, tool switching creates recovery or transfer friction, and all of that is compounded by device wait time and the customer’s ability to follow technical instructions.

## 1. Activation and device coverage is the strongest cross-study driver

The [AT&T Device Activation focus-group summary](https://app.notion.com/p/2429532a1f868098a32bc5cecdf17593?pvs=1) is the strongest supporting research. It included seven experts across four sessions and found:

- Device support was largely limited to iPhone and Samsung, leaving Pixel, Motorola, tablets, and smartwatches unsupported.
- Android physical-SIM and eSIM activations frequently did not follow the expected path.
- Experts sometimes had to select an inaccurate option just to progress through the flow.
- Experts fell back to Opus when claim checks, verification, or activation failed.
- Experts still opened Opus to confirm eSIM status because Workspace did not show whether it was linked, installed, released, or deleted.
- When the flow worked, experts self-reported activation times of roughly **5–7 minutes instead of 8–15 minutes**.

The [Expert Assist survey](https://app.notion.com/p/2809532a1f868073aba7fd560d677d92?pvs=1), with more than 320 voice responses, reinforces this. Experts reported missing newer devices, outdated operating-system steps, incorrect Android menu paths, and generic guidance instead of complete device-specific instructions. A July 2026 Philippines debrief based on roughly 24 conversations also identified expanding activation coverage to more devices as a top priority. fileciteturn18file0 fileciteturn24file0 fileciteturn19file0

I would strengthen the original driver to:

> **Activation calls take longer when guidance is unavailable, unreliable, or unable to complete and verify the action end-to-end, forcing experts to search or finish the process in carrier tools.**

That is more accurate than framing it only as missing content for non-Apple and non-Samsung devices.

## 2. Irrelevant or forced guidance creates a “guidance tax”

The [Clark Guided Flow focus group](https://app.notion.com/p/3989532a1f868035b92ce2b5f57d7719?pvs=1) found that the Network & Connectivity flow often appeared when networking was not the primary issue. Its open rate was rising, but completion remained low. Experts specifically asked for a way to **confirm or dismiss** the suggested flow.

The [Verizon Onboarding Call Review](https://app.notion.com/p/3599532a1f868086bccdfcedc3a7459f?pvs=1), a small five-call sample, showed the behavioral consequence. Experts manually clicked through irrelevant activation steps, sometimes more than 15 of them, apparently because flow usage was measured. The flow did not advance the resolution, but it still consumed attention and clicks.

This adds a distinct driver:

> **Guidance that triggers for the wrong problem, arrives after the expert has already started solving, or must be completed for measurement purposes adds work instead of removing it.**

The Clark research also provides the counterexample: when the right flow appears, coaches said it reduces unnecessary troubleshooting, helps experts know when to escalate, and can improve CRT and resolution. The issue is not “guided flows are slow.” It is **trigger accuracy, timing, and relevance**. fileciteturn21file0 fileciteturn20file0

## 3. Tool switching and callback failures compound each other

The callback problem is more systemic than a broken callback button.

The [callback recovery issue log](https://app.notion.com/p/3799532a1f86811589cdef8b0c3df304?pvs=1) documents more than 15 dropped-call-to-voicemail examples from Clark. Its later investigation found an important process interaction: experts sometimes switch away from Workspace into ACSS, miss the callback window while working there, and return too late to schedule the callback.

The Verizon onboarding calls showed the same sequence from another angle:

1. Activation or device reset causes the call to disconnect.
2. The expert schedules an immediate callback.
3. The callback goes to voicemail.
4. The expert retries or waits.
5. The original resolution path loses momentum.

This means context switching is not merely a cognitive-load problem. It can directly interfere with the telephony recovery path. fileciteturn36file0 fileciteturn20file0

A more useful driver statement is:

> **When solving requires experts to leave Workspace, they can lose visibility into call state, callback timing, or recovery controls, turning a routine restart or activation disconnect into repeated attempts or an unresolved interaction.**

## 4. Device wait time and customer technical ability explain part of the long-call tail

This is an important addition because **not every long call represents wasted expert time**.

The Verizon onboarding review observed:

- Approximately **40 minutes of dead air** while an iPhone update completed.
- Content transfer beginning only after the one-hour mark.
- Customers needing to repeat setup because a store had already partially configured the device.
- Low battery interrupting troubleshooting.
- Multi-person calls involving spouses or family members.
- Customers preferring an expert to remain present for reassurance, even while they completed routine setup choices.

The broader [Philippines field research](https://app.notion.com/p/1b99532a1f8680f8bb95e87d4a282ded?pvs=1) found that Staples calls involving older or less technically experienced customers frequently lasted **one to two hours**. It also found that remote-access setup was particularly difficult for elderly customers, and that a failed install was especially costly because it happened after many setup steps. fileciteturn20file0 fileciteturn29file0

I would separate this from avoidable workflow friction:

> **Some calls run long because updates, data transfers, restarts, weak connectivity, and customer technical ability determine the pace. Experts are often providing confidence and reassurance during that wait, not actively troubleshooting the entire time.**

That distinction matters for Visual Call Pacing. A timer should not treat 40 minutes waiting for a required operating-system update the same as 40 minutes spent searching through tools or repeating ineffective steps.

## 5. Transfers and escalation behavior may create extreme outliers

The [Orlando engineering Q&A](https://app.notion.com/p/2879532a1f8680178d55c7283bba06fc?pvs=1) documented transfer friction including:

- Dial-pad and DTMF failures during IVR transfers
- Frozen transfer states
- Call controls disappearing
- The original line failing to disconnect
- Incorrect routing or failed Tier 2 handoffs

The operations notes also said experts may remain on the line during a transfer because they are worried the customer will reach the wrong department, particularly after previous transfer failures or with an upset customer.

A separate [cold-transfer investigation](https://app.notion.com/p/2889532a1f8680fab652fbf2b7186d31?pvs=1) contains examples of experts remaining connected after transferring, including one interaction where an expert reportedly stayed on hold for more than two hours. That page explicitly labels its evidence strength as low, so I would treat this as a **candidate long-tail driver**, not a proven enterprise-wide pattern. fileciteturn25file0 fileciteturn27file0

The hypothesis is:

> **Unreliable transfers and unclear accountability encourage experts to stay connected until another team resolves the issue, adding large amounts of non-solving time to a small number of calls.**

This is worth validating quantitatively because even a low-frequency behavior could disproportionately affect the CRT average.

## 6. Missing previous-call context has much broader exposure than the Orlando notes alone suggest

The [Previous Session Summary](https://app.notion.com/p/795042f52a0f416f90ffcac3e77f6344?pvs=1) brief reports that, across its analyzed Verizon Soluto data:

- **10.7% of customers** had a previous call.
- **40% of calls** were associated with a customer who had a previous call.

The Philippines research separately found repeated frustration from customers having to explain their issue and redo steps with multiple experts. The Clark focus group also asked to restore previous-session visibility because teams were seeing many repeat callers. fileciteturn35file0 fileciteturn29file0 fileciteturn21file0

That strengthens the original context driver:

> **Lost history creates a rediscovery tax: experts must reconstruct the problem, identify what has already been attempted, and avoid repeating failed steps before they can make progress.**

The prevalence data is strong. What is still missing is a measured estimate of how many seconds or minutes previous-session context saves.

## 7. Pacing awareness appears to be a contributing factor, but not a root cause

The [July 13 metrics digest](https://app.notion.com/p/39c9532a1f868048840acb3f8b995caf?pvs=1) reports that the Visual Call Pacing pilot was associated with:

- A **47-second handle-time improvement** versus the Orlando baseline
- A **3% resolution-rate increase**
- A **1% transfer-rate decrease**
- On-target pacing increasing from roughly **61% to 75.4%**

The document also cautions that the pilot included many lower-tenure experts, limiting causal certainty. fileciteturn30file0

This suggests that some excess time can be reduced through awareness and coaching. But pacing does not solve the underlying reasons the call runs long. It helps experts recognize when they are off course and seek a different path sooner.

## Recommended cross-research framing

I would now organize the CRT drivers into three groups:

### Avoidable workflow friction

1. Incomplete or unreliable device and activation support  
2. Irrelevant, late, or forced guidance  
3. Tool switching and manual information transfer  
4. Broken callback, transfer, and escalation recovery  
5. Lost prior-call and customer context  

### Legitimate dependency time

1. Software updates, reboots, and content transfers  
2. Weak connectivity or low device battery  
3. Customer technical ability and accessibility needs  
4. Human reassurance during high-risk setup or activation  

### Behavioral or operational contributors needing more validation

1. Experts continuing through irrelevant flows for measurement credit  
2. Remaining on the line after transfers  
3. Delaying escalation or repeating familiar troubleshooting  
4. Lack of real-time awareness that the call is substantially off target  

The clearest executive-level conclusion would be:

> **Long calls are not caused by experts simply moving too slowly. Across multiple research studies, experts lose time when the system cannot provide or complete the right device-specific path, sends irrelevant guidance, forces work into disconnected tools, or loses the customer’s prior context. The longest calls are further amplified by transfers, callback recovery, required device wait time, and customers who need hands-on reassurance.**

## Evidence caveat

The research supports these as **recurring drivers**, but it does not yet provide a defensible ranking by total minutes or enterprise impact. The current metrics define 2,700 seconds, or 45 minutes, as roughly the Verizon Saludo 90th percentile and about 10% of calls, but they do not explain what happened during those calls. The proposed [Expert Call Segment Analysis](https://app.notion.com/p/12e9532a1f868063921ad653acda2afd?pvs=1) would help attribute time to discovery, troubleshooting, waiting, selling, and escalation, but that initiative is currently listed as not started. fileciteturn30file0 fileciteturn22file0

The strongest research package to share alongside the Orlando findings is the [AT&T activation focus group](https://app.notion.com/p/2429532a1f868098a32bc5cecdf17593?pvs=1), [Expert Assist survey](https://app.notion.com/p/2809532a1f868073aba7fd560d677d92?pvs=1), [Philippines field research](https://app.notion.com/p/1b99532a1f8680f8bb95e87d4a282ded?pvs=1), [Verizon onboarding call review](https://app.notion.com/p/3599532a1f868086bccdfcedc3a7459f?pvs=1), and [Clark Guided Flow focus group](https://app.notion.com/p/3989532a1f868035b92ce2b5f57d7719?pvs=1).

### User

great context. I'd like to update the research documentation I shared with the hackathon slack channel so everyone has access to the summary and links to dig deeper. Keep the evidence caveat as it's helpful to understand the gaps in our research

### ChatGPT

## Updated research documentation

I expanded the original Orlando evidence pack into a broader **Expert Workspace CRT and long-call research synthesis**. It now includes:

- An executive summary of the recurring long-call drivers
- Evidence-strength labels so stronger patterns are separated from emerging hypotheses
- Eight detailed drivers with supporting evidence and direct Notion links
- A distinction between **avoidable workflow friction**, **legitimate device or customer wait time**, and **behavioral or operational contributors**
- Hackathon implications focused on identifying *why* a call is long, rather than only showing elapsed time
- The full evidence caveat, including small samples, self-reported results, opportunity estimates, mixed root causes, and the lack of a statistically defensible ranking

The expanded evidence includes the AT&T activation focus groups, the 320-plus-response Expert Assist survey, Philippines field research, Verizon onboarding call reviews, Clark Guided Flow feedback, prior-session context data, callback issue logs, and Visual Call Pacing results. fileciteturn18file0L1-L1 fileciteturn24file0L1-L1 fileciteturn20file0L1-L1 fileciteturn21file0L1-L1

The evidence caveat explicitly notes that the current work identifies recurring qualitative drivers, but does not yet tell us how frequently each occurs, how many minutes each adds, or how they rank enterprise-wide. It also preserves the limits around the Visual Call Pacing pilot and points to the currently unstarted call-segment analysis as a key research gap. fileciteturn30file0L1-L1 fileciteturn22file0L1-L1

[Download the updated Expert Workspace CRT research summary](sandbox:/mnt/data/expert_workspace_crt_drivers_research_summary.md)

I also updated the original filename with the same content:

[Download the updated original evidence file](sandbox:/mnt/data/orlando_crt_driver_evidence.md)

The hackathon framing connects the findings to the Expert Workspace principles of keeping up with the conversation, showing context, creating a single pane of focus, and removing repetitive work. The document is structured to stay direct and scannable for a broad Slack audience. fileciteturn39file0 fileciteturn39file1

### Slack message to share with the update

> I updated the CRT research summary with supporting evidence from Orlando, AT&T activation research, Philippines field visits, Expert Assist feedback, Guided Flow focus groups, and call reviews. It groups the long-call drivers into avoidable workflow friction, legitimate customer or device wait time, and operational behaviors that still need validation. I also added direct links to the source research and kept an evidence caveat so we’re clear about what the research supports and what still needs quantitative validation.  
>  
> **Updated research:** [attach or link the Markdown document]

### User

can you just write me an updated research summary with the different problem areas and links to the notion docs references so i can copy and paste them into slack?

### ChatGPT

Here’s a Slack-ready version:

```text
*Expert Workspace research: recurring long-call / CRT drivers*

I pulled together supporting evidence from the Orlando onsite, AT&T activation research, the Expert Assist survey, Philippines field research, Guided Flow focus groups, and call reviews.

This is not a ranked list. The consistent pattern is that long calls are usually caused by several layers of friction, not one isolated issue.

*1. Incomplete or unreliable device and activation guidance*

Support is strongest for iPhone and Samsung, but experts regularly encounter Pixel, Motorola, smartwatches, tablets, and more complex Android or eSIM scenarios.

When the flow does not support the device, fails a claim check, or cannot confirm activation status, experts have to fall back to Opus, Ozmo, carrier tools, or their own memory. Experts also reported having to select inaccurate answers to move through some Android activation paths.

When the Guided Flow works correctly, experts reported activation times closer to 5–7 minutes instead of 8–15 minutes.

Dig deeper:
• AT&T Device Activation focus-group summary:
https://app.notion.com/p/2429532a1f868098a32bc5cecdf17593?pvs=1

• Expert Assist survey feedback, 320+ voice responses:
https://app.notion.com/p/2809532a1f868073aba7fd560d677d92?pvs=1

• Philippines field research:
https://app.notion.com/p/1b99532a1f8680f8bb95e87d4a282ded?pvs=1


*2. Guidance can be irrelevant, late, or forced*

Guided Flows sometimes trigger for the wrong issue or appear after the expert has already started solving the problem in another system.

Experts also appear to click through irrelevant steps because flow usage or completion is measured. In the Verizon onboarding call review, experts manually progressed through flows that did not apply to the customer’s situation.

This creates a “guidance tax”: the system adds clicks and attention without moving the call closer to resolution.

Dig deeper:
• Clark Guided Flow Coach/OM focus group:
https://app.notion.com/p/3989532a1f868035b92ce2b5f57d7719?pvs=1

• Verizon Onboarding Call Review:
https://app.notion.com/p/3599532a1f868086bccdfcedc3a7459f?pvs=1


*3. Fragmented tools and manual information transfer*

Experts regularly move between Expert Workspace, ACSS, Opus, Ozmo, Helix, Notepad, carrier websites, and other tools.

Each switch adds search time and cognitive load. Experts also manually move phone numbers, IMEIs, troubleshooting notes, verification details, and other information between systems.

Leaving Workspace can create additional operational problems. For example, experts may miss a callback window while working in ACSS or fail to notice that a call has dropped while focused on another screen.

Dig deeper:
• Orlando Call Center research summary:
https://app.notion.com/p/2f19532a1f868076b309c4a7057bdc5f?pvs=1

• Orlando Current State Journey Map:
https://app.notion.com/p/3119532a1f8680cdbf7de82e96a1f243?pvs=1

• Full Orlando onsite research hub:
https://app.notion.com/p/30d9532a1f8680d4a48ac9d2b25ab83d?pvs=1


*4. Missing customer and previous-call context creates repeated work*

Customers frequently have to repeat who they are, why they called, and what troubleshooting they already completed.

When that history is not visible or trusted, experts have to reconstruct the problem before they can make progress. They may also repeat steps that already failed on a previous call.

Previous Session Summary research found that, in the analyzed Verizon Soluto dataset, 40% of calls were associated with a customer who had a previous call.

Dig deeper:
• Previous Session Summary:
https://app.notion.com/p/795042f52a0f416f90ffcac3e77f6344?pvs=1

• Warm Handoff:
https://app.notion.com/p/3579532a1f8680a9835bdf88454e94cb?pvs=1


*5. Callback, transfer, and escalation friction adds rework*

Activations, device resets, weak connectivity, and switching between phones can cause calls to disconnect.

Experts may then have to schedule a callback, retry when the call goes to voicemail, recollect information, or restart the troubleshooting process. Some experts also miss the callback window while working in another system.

Transfer issues include frozen controls, IVRs not recognizing dial-pad input, incorrect routing, and failed Tier 2 handoffs. There are also examples of experts remaining on the line after a transfer to make sure the customer reaches the correct team.

The “remaining on the line” behavior currently has limited evidence, so it should be treated as a long-tail hypothesis rather than a proven enterprise-wide driver.

Dig deeper:
• Callback recovery issue:
https://app.notion.com/p/3799532a1f86811589cdef8b0c3df304?pvs=1

• Orlando Site Visit engineering Q&A:
https://app.notion.com/p/2879532a1f8680178d55c7283bba06fc?pvs=1

• Cold-transfer investigation:
https://app.notion.com/p/2889532a1f8680fab652fbf2b7186d31?pvs=1


*6. Some long-call time is driven by the device or customer, not expert behavior*

Not every long call represents inefficient troubleshooting.

Calls can include required operating-system updates, content transfers, device reboots, low battery, poor connectivity, or customers who need slower, step-by-step help.

In one Verizon onboarding call, approximately 40 minutes were spent waiting for an iPhone update before the expert could continue with content transfer. Philippines research also found that some calls with older or less technically experienced customers regularly lasted one to two hours.

Experts may be providing reassurance and confidence during this time, even when they are not actively troubleshooting.

This is important for pacing: the system should distinguish between avoidable workflow friction and legitimate waiting or accessibility needs.

Dig deeper:
• Verizon Onboarding Call Review:
https://app.notion.com/p/3599532a1f868086bccdfcedc3a7459f?pvs=1

• Philippines field research:
https://app.notion.com/p/1b99532a1f8680f8bb95e87d4a282ded?pvs=1


*7. Limited pacing awareness and late escalation may amplify the other drivers*

Experts do not always know when a call is far outside its expected path or when they should change strategies, seek help, or escalate.

Visual Call Pacing has promising early results:
• 47-second handle-time improvement compared with the Orlando baseline
• 3% increase in resolution rate
• 1% decrease in transfer rate
• On-target pacing increased from approximately 61% to 75.4%

However, pacing is a signal, not the root-cause solution. A timer can show that a call is long, but it does not provide the missing device guidance, recover a dropped call, restore prior context, or complete a carrier action.

Dig deeper:
• Expert Workspace weekly metrics digest:
https://app.notion.com/p/39c9532a1f868048840acb3f8b995caf?pvs=1


*What this may mean for the hackathon*

The opportunity is bigger than simply showing how long the call has lasted.

A stronger solution could help identify *why* the call is running long and recommend the right intervention, such as:
• Surface the correct device-specific path
• Let the expert confirm or dismiss a suggested guide
• Bring forward previous troubleshooting and customer context
• Distinguish active troubleshooting from unavoidable device wait time
• Detect repeated or ineffective troubleshooting
• Recommend escalation at the right moment
• Preserve context and provide a recovery path after a drop or transfer


*Evidence caveat*

The research shows recurring qualitative patterns, but it does not yet provide a statistically defensible ranking of the drivers.

The sources include different clients, call types, dates, and sample sizes. Some findings are based on direct call observations, while others are expert or coach reports. Several product briefs describe estimated benefits rather than measured post-launch outcomes.

We cannot yet say:
• How frequently each driver occurs across the enterprise
• How many minutes each driver adds
• Which drivers account for the largest share of total excess CRT
• Whether every reported feature outcome was caused by the feature itself

The Visual Call Pacing results are promising, but the pilot population and lack of a clean control comparison limit causal certainty.

The proposed Expert Call Segment Analysis could help quantify time spent in discovery, troubleshooting, waiting, selling, and escalation, but that work is currently listed as not started:
https://app.notion.com/p/12e9532a1f868063921ad653acda2afd?pvs=1
```

The activation, Guided Flow, prior-context, callback, customer-wait, and pacing findings above are grounded in the linked research and call-review documents. fileciteturn18file0 fileciteturn20file0 fileciteturn21file0 fileciteturn24file0 fileciteturn29file0 fileciteturn30file0

### User

`Export all contents of this chat word for word as a transcript into a downloadable markdown file. In the transcript, label me as “User” or “You” and label your turns/response as “ChatGPT.” The file name for the transcript should match the name of this chat. If this chat is in project, the file name should be named <project name> - <chat name>.md. Once the markdown file is prepared, present all files attached or generated in the thread so I can download them easily.`
