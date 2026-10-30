# Pulse feedback: options for the selection-only (Verizon) version

Review of the v0 prototype (pulse-feedback-asurion-v0.vercel.app) against 2 months of #expert-workspace-feedback, the Q4 2025 SUS, and #expert-workspace-solve-incidents. Counts and ranks come from `EW-Feedback-Analysis-Aug-Sep-2026.xlsx`.

## What the prototype does today

The modal asks "What's this about?" and offers four categories. Each category has a set of chips you can pick more than one of. Verizon mode hides the text box. Screenshot, errors, user ID, session ID, and time are captured automatically.

| Category | Chips |
|---|---|
| Something isn't working | Freezing or not responding · Audio problems · Calls dropping · Messages delayed · Transfers broken · Stuck in a status · Display issue · Something else |
| A tool needs attention | Inaccurate responses · Not responding · Device not recognized · Unhelpful suggestions · Wrong or missing steps · Display issue |
| Sales or enrollment issue | Enrollment failed · Wrong eligibility · Device not detected · Checklist not updating · Display issue · Something else |
| I have an idea | New feature · Improve a tool · Workflow change · Something else |

## Remove "I have an idea" from Verizon mode

Agreed, it should go. Without a text box, "New feature" or "Workflow change" tells the team only that the expert has an idea. It doesn't say what the idea is. In the free-text data, only about 10 of the reports were real feature requests, and that was with typing allowed. As a chip, the category would produce reports nobody can act on and give experts false hope that someone heard them.

If you still want Verizon experts to have a say in the roadmap, a better fit is a separate "Vote on an idea" list outside the bug flow. Product would refresh it monthly with the top asks from the SUS and from free-text partners: Dialpad, notepad always visible, a grammar-check toggle, and transcript placement. Experts tap to +1 an idea, and there's nothing to type. This can come later; it isn't required for launch.

In Verizon mode, also change the header copy. "What's on your mind?" and "issues or ideas" invite exactly the input the modal can't take. Suggested header: "What went wrong?" with the subtext "Choose what happened. We'll attach the technical details."

## Problems with the current options, from a dev-team view

**1. One bucket covers about 70% of Verizon volume and five different owners.** "Something isn't working" mixes telephony (audio, drops, transfers), chat delivery, status, and the UI shell. The first question the team asks about any report is "whose problem is this?", and this category doesn't answer it. The first step should be *where* it happened, since that maps to who owns it.

**2. The highest-volume chips don't say what happened.** "Audio problems" is the #1 issue (rank 1, 82 mentions), but devs can't tell one-way from no audio, or customer side from expert side. The fix differs for each.

**3. Two top-10 issues are missing.**

- *Call didn't connect* is rank 7 (44 mentions). It's a different failure from "Calls dropping".
- *Callbacks* are rank 8 (34 mentions) and have no chip anywhere.

**4. Chat needs more than "Messages delayed".** Today's data has three separate chat failures: my message didn't send, the customer's message never arrived, and duplicated or unreadable messages. These are rank 8, 13, and 18, and "Messages delayed" covers only one of them.

**5. "Display issue" shows up three times and means nothing on its own.** Replace it with specific symptoms: froze, went blank, something's missing, layout broken. The system can capture which region was active, so the expert doesn't have to say.

**6. "A tool needs attention" mixes two tools and two teams.** "Inaccurate responses" only applies to Expert Assist. "Wrong or missing steps" only applies to activation guides. Split them so each chip list fits its tool.

**7. Two chips are almost duplicates.** "Device not recognized" (tool) and "Device not detected" (sales) read as the same thing in two places. Rename each by what it means. For guides: "Device isn't in the list." For offers: "Couldn't find the customer's device."

**8. Multi-select brings back the select-all problem.** One expert picked every chip about 14 times, and one expert filed about 90 reports in 11 days. When five chips arrive together, devs can't tell which one is real. Make it one choice per step ("Choose one"). If more than one thing broke, that's a second report, or a "Me too" on someone else's.

**9. A lone "Something else" carries no information.** It showed up alone 36 times in two months. Keep the option so experts aren't forced into the wrong chip, but call it "Not listed" and treat it as a signal. Auto-capture should be heavier on these reports. If more than about 10% of an area's reports are "Not listed", that tells you a chip is missing.

**10. Nothing captures severity or timing.** A visual glitch and a lost customer look the same in the queue. Also, the session ID is only useful if the issue happened in this session. Add impact and timing.

## Recommended option tree, Verizon mode

The flow is Where → What happened → Impact and when. That's three taps, with one choice per step. Filter the "Where" list by session type, so chat experts never see Call options and voice experts never see Chat messages. This also fixes the chip sets carrying over between types.

### Step 1: Where did it happen? (choose one)

| Area | Shown for | Owner it routes to |
|---|---|---|
| Call audio | Voice | Telephony |
| Call connection | Voice | Telephony |
| Transfers and callbacks | Voice | Telephony / routing |
| Chat messages | Chat | Messaging |
| My status | Both | Status / WFM integration |
| Expert Assist | Both | AI assist |
| Activation guide | Both | Solve |
| Offers and enrollment | Both | Sales / Smart Offer |
| Workspace screen | Both | Shell / front end |

### Step 2: What happened? (choose one)

| Area | Options | Evidence |
|---|---|---|
| Call audio | Customer can't hear me · I can't hear the customer · No audio either way · Choppy, robotic, or echo · Audio cut out mid-call · Not listed | Rank 1; direction and side are what the fix depends on |
| Call connection | Call dropped · Call never connected · Rang but no one was there · Couldn't end the call · Not listed | Ranks 3 and 7 |
| Transfers and callbacks | Transfer didn't go through · Destination missing from the list · Customer dropped during transfer · Callback didn't dial · Couldn't cancel a callback · Not listed | Transfers rank 15, callbacks rank 8; missing destinations confirmed in free text |
| Chat messages | My message didn't send · Customer's message didn't arrive · Messages arrived late · Messages duplicated or unreadable · Neglect warning was wrong · Not listed | Ranks 8, 11, 13, 18 |
| My status | Stuck after a call · Changed on its own · Couldn't change it · Timer didn't reset · Not listed | Rank 6 |
| Expert Assist | No response or error · Wrong answer · Outdated info · Too slow · Not listed | Ranks 10, 17, 20; "Couldn't get a response" outage Sep 30 to Oct 1 |
| Activation guide | Wrong steps for this device · Device isn't in the list · Step won't advance · Error on a step · Not listed | Ranks 22 and 27; AT&T phone-number loss incident Sep 23–26 |
| Offers and enrollment | Enrollment error · Wrong eligibility · Checklist didn't update · Couldn't find the customer's device · Script in the wrong language · Not listed | Ranks 20, 24, 31 |
| Workspace screen | Froze or stopped responding · Slow to load · Went blank · Something's missing · Layout looks broken · Not listed | Rank 2; the system captures which region was active |

### Step 3: Impact and when (one screen, two segmented controls)

| Question | Options | Default |
|---|---|---|
| What happened to the customer? | Customer was lost · Customer had to wait · I used a workaround · No customer impact | None (required) |
| When? | Just now · Earlier this call · Earlier today | Just now |

The submit button is never disabled. If impact is missing, follow the existing pattern: run validation on click and show the inline error.

## Auto-capture additions

The prototype already captures errors, user ID, session ID, and time. The screenshot is being replaced by the FullStory link. Devs also asked for, or would need, the following:

| Field | Why |
|---|---|
| FullStory link, plus a flag when it's missing | Replaces the screenshot; the flag shows when quota ran out |
| Partner and workspace version | Already in today's bot posts. Keep them. |
| Call SID or chat contact ID | Needed to pull telephony logs. Session ID alone isn't enough. |
| Call phase and active tab or tool | Replaces "Display issue". The AT&T bug only happened on a tab switch. |
| Last 10 UI events, console errors, and network errors | Reproduces freezes, and fills the gap when FullStory quota runs out (Sep 8) |
| Audio device, mic level, EVL / softphone state | Makes the audio reports usable |
| Status history for the session | Makes the status reports usable |
| Expert Assist request ID and error code; enrollment error code | Ties a report to a specific backend failure |
| Same-issue count across experts in the last 30 minutes | Lets the team spot outages and powers "Me too" |
| Time of the issue | Taken from the "When" answer, not the submit time |

**Screenshot removed (decision, Oct 2 2026).** The existing modal already attaches a FullStory link, which shows the whole session with customer data masked, not one frame. It also avoids the PII problem a raw screenshot would create for Verizon. The risk is that FullStory has gaps. On Sep 8 the quota ran out, and those reports had no session at all. Keep the local buffer of the last 10 UI events and errors as a fallback, and add a "FullStory: missing" flag to the payload so devs can see when a report has no session behind it.

## Things that cut noise without adding questions

- **Show who else is reporting it.** When others have reported the same area and option in the last 30 minutes, show "3 other experts reported this in the last 30 minutes" with a one-tap "Me too". Outages currently arrive as dozens of separate reports.
- **Report from where it failed.** When the system already sees an Expert Assist error, a dropped call, or an enrollment error, offer a one-tap "Report this" that fills in Steps 1 and 2.
- **Throttle repeats.** Limit how often the same expert can send the same area and option in one session. A repeat becomes a count on the earlier report instead of a new report.
