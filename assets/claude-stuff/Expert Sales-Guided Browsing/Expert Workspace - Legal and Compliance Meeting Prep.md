# Expert Workspace - Legal and Compliance Meeting Prep

## User

I have a meeting and I want you to help me prepare for this meeting with legal, compliance, and then my design leadership. The goal of the meeting is to go through a prototype that I've worked on and made updates to. And basically what I'd want to do is walk through the prototype, walk through the changes I've made based on their feedback. So the prototype starts at a one-page landing page. They can see plan benefits there. And from there, the customer would select Get Covered Today. From clicking Get Covered Today, they would be able to see important plan details that include some terms. The two things that I've added are a bullet about this being a subscription product, and it will continue renewing until canceled, but they can cancel any time. And then how to cancel, the other bullets, how to cancel. So it gives them a phone number and a page address where they can cancel online. But basically the goal would be go through each step of the process, and then go through each step of the process and then show them, and then have them give me details on if there are any things that need to be changed or adjusted in order to get this approved. The goal would be to get it approved today. If we can't get it approved today, we'll probably set up more time, take screenshots of different steps in the experience, and have them review it and give us some recommendations. But the idea would be like, hey, these are kind of the areas that we'll need to continue to make changes to, or this looks good, approved.

## ChatGPT

# Run this as an approval session, not an open-ended design review

The meeting should end with one of two explicit outcomes:

1. **Approved:** Legal and compliance approve the current wording, placement, and flow for a clearly defined small-cohort test.
2. **Not yet approved:** You leave with a complete list of blockers, exact required changes, named approvers, and a specific review path and deadline.

Be careful not to conflate approval for a limited test with approval for a full production launch. Get the scope stated aloud and captured in the notes.

## Recommended 30-minute agenda

| Time | Topic | Desired result |
|---|---|---|
| 0–3 min | Frame the purpose and decision | Everyone agrees on what is being approved |
| 3–6 min | Recap the prior feedback | Confirm you addressed the right concerns |
| 6–14 min | Uninterrupted prototype walkthrough | Everyone sees the complete customer journey |
| 14–23 min | Review the changed screens | Legal and compliance assess wording, placement, and prominence |
| 23–27 min | Resolve or document remaining blockers | No vague or unassigned feedback |
| 27–30 min | Confirm the decision and next steps | Approval or a concrete path to approval |

Ask everyone to let you complete one uninterrupted walkthrough before discussing individual screens. That allows them to judge the overall customer experience rather than reacting to isolated phrases.

# Opening script

> Thanks, everyone. The goal today is to review the updated enrollment experience and determine whether it is ready for approval for a limited customer test.
>
> In our previous review, the main concern was that simplifying the Important Plan Details could leave gaps in what customers understand before enrolling.
>
> I’ve updated the prototype based on that feedback. In particular, the experience now explicitly explains that this is a subscription product that continues renewing until canceled, that the customer can cancel at any time, and exactly how they can cancel by phone or online.
>
> I’ll first walk through the experience exactly as a customer would see it. Then I’d like to return to the relevant screens and review three things: the language, where it appears in the flow, and how prominently it is presented.
>
> By the end, I’d like us to either confirm approval for the limited test or identify the exact remaining blockers and the changes required to resolve them.

# Prototype walkthrough talk track

## 1. Landing page

> This is the initial one-page experience. It introduces the plan and allows the customer to review the primary benefits without navigating through several different pages.
>
> There is one clear primary action: **Get Covered Today**.

Do not spend too much time defending the visual design here. Briefly explain the intent and move forward.

The rationale is consistent with the Expert Workspace principles: keep the experience focused, show people the information they need when they need it, and build clarity into the interaction rather than overwhelming them all at once. fileciteturn0file0

## 2. “Get Covered Today”

> When the customer selects **Get Covered Today**, they do not immediately complete enrollment. They are first shown the Important Plan Details.

Pause long enough for everyone to see that the disclosures are part of the path before enrollment.

The button treatment also supports the Asurion guidance of using one clear, action-oriented primary action rather than multiple competing calls to action. fileciteturn0file1

## 3. Important Plan Details

> This is the screen that contains the changes made in response to the previous feedback.
>
> The first new point explicitly tells the customer that this is a subscription product, that it will continue renewing until it is canceled, and that the customer can cancel at any time.
>
> The second new point explains how to cancel and gives the customer both the phone number and the online page address.
>
> I’d like us to assess the complete treatment here: whether the wording is sufficient, whether this is the correct point in the journey, and whether the information has the appropriate prominence.

Do not paraphrase the disclosure for too long. Read the actual on-screen language exactly as written so legal and compliance are reviewing the real copy.

## 4. Complete the remaining flow

Continue through the rest of the prototype without skipping anything.

> I’m going to complete the remaining steps so we can confirm that the customer cannot unintentionally bypass the Important Plan Details and that the experience remains clear through the final action.

At the end:

> That is the complete customer journey. I’ll now return to the individual screens so we can make a decision on each area.

# Questions that will produce actionable feedback

Avoid asking only, “Does anyone have feedback?” That usually produces opinions instead of decisions.

Ask these questions directly:

### Subscription and renewal

> Does the current language sufficiently communicate that this is a subscription and that it continues renewing until canceled?

> Is any specific legally approved wording required, or is the current plain-language treatment acceptable?

### Cancellation

> Are the phone number and online cancellation address sufficient?

> Does the cancellation information need to appear anywhere else in the journey?

> Are there any requirements around making the number or address clickable, adding hours of operation, or identifying the destination more specifically?

### Placement and prominence

> Is presenting this information in Important Plan Details before the customer proceeds acceptable?

> Does any part of the disclosure require different prominence, such as a different position, persistent visibility, or an additional customer acknowledgment?

> Is there anything about font size, hierarchy, scrolling, or proximity to the enrollment action that prevents approval?

### Landing-page claims

> Are there any benefit statements or product claims on the landing page that legal or compliance believes must be changed before this can be tested?

### Approval

Ask this plainly:

> Based on the flow we reviewed, can legal and compliance approve this version for the proposed limited test?

Then clarify scope:

> To be precise, is that approval for the copy, its placement in the experience, and the overall customer flow?

# How to handle vague or expanding feedback

Use these phrases to keep the discussion productive.

When someone says something “might need work”:

> Is that a blocker to approval, a recommended improvement, or something we can evaluate during the test?

When someone asks for different language:

> Can we agree on the exact acceptable wording during this meeting, or identify who will provide the final language?

When test requirements and launch requirements become mixed:

> Is that requirement necessary for this limited test, or is it a requirement for broader production launch?

When a change would substantially complicate the experience:

> Can you help me understand the specific customer or regulatory risk the current treatment creates? That will help us solve the requirement without introducing unnecessary complexity.

When legal and compliance provide different guidance:

> Before we change the prototype, can we align on one requirement and one approver so we do not address conflicting directions?

This is where your design leadership can help: not by reopening general visual exploration, but by helping distinguish required changes from subjective preferences and protecting the clarity of the customer experience.

# Closing script when approved

> To confirm the decision: legal and compliance approve this prototype version for the limited test, including the current subscription and renewal language, cancellation information, placement of Important Plan Details, and overall flow, subject to the conditions we documented. Is that an accurate statement of the approval?

Then capture:

- The exact prototype version or date.
- The approved testing scope.
- Any conditions or monitoring requirements.
- Whether another review is required before production launch.
- The person who has final approval authority.

# Closing script when it is not approved

> It sounds like we still have a few items preventing approval. Before we close, I’d like to document each blocker by screen, the exact change required, who will approve it, and whether that approval can happen through annotated screenshots rather than another full meeting.

Then say:

> I’ll send screenshots of the relevant states with the disclosure text visible. For each item, I’ll include the current treatment and a place for the recommended wording or presentation change. Once those specific changes are resolved, can the updated screenshots be approved asynchronously?

Only schedule another meeting when there is a genuine unresolved discussion. Do not leave with “legal will take another look.” Get a person, deliverable, and date.

# Decision log to keep on screen

Use this during the final ten minutes:

| Area | Decision needed | Status | Required change | Approver | Due date |
|---|---|---|---|---|---|
| Landing-page benefits | Claims acceptable | Approved / Blocked |  |  |  |
| Get Covered Today action | Placement and meaning acceptable | Approved / Blocked |  |  |  |
| Important Plan Details | Correct point in journey | Approved / Blocked |  |  |  |
| Subscription and renewal | Wording and prominence sufficient | Approved / Blocked |  |  |  |
| Cancellation methods | Phone and online path sufficient | Approved / Blocked |  |  |  |
| Remaining enrollment flow | Disclosures cannot be bypassed | Approved / Blocked |  |  |  |
| Limited test | Legal/compliance authorization | Approved / Blocked | Conditions |  |  |

# What to prepare before the meeting

Have the following ready:

- The live prototype opened at the starting screen in a clean browser window.
- Static screenshots of every relevant state as a backup.
- A side-by-side view of the previous and updated Important Plan Details.
- The exact phone number and online cancellation address, ready for legal and compliance to verify.
- The decision log above, open and visible.
- A named facilitator or note-taker so you can focus on presenting.
- A clear description of the proposed test: audience, approximate cohort size, duration, and what will be measured.
- The exact approval scope you are requesting: **limited test**, not an implied full-launch approval.

The broader [Expert Workspace prototype video](sandbox:/mnt/data/expert-workspace-prototype-16x9.mp4) is useful for reinforcing the guided, focused interaction model. For legal approval, however, the live customer flow and static screenshots should be the source of truth because they allow the team to inspect the exact wording, placement, visibility, and sequence of each disclosure.

## User

`Export all contents of this chat word for word as a transcript into a downloadable markdown file. In the transcript, label me as “User” or “You” and label your turns/response as “ChatGPT.” The file name for the transcript should match the name of this chat. If this chat is in project, the file name should be named <project name> - <chat name>.md. Once the markdown file is prepared, present all files attached or generated in the thread so I can download them easily.`

## ChatGPT

I’ll compile the visible User and ChatGPT turns into a Markdown transcript, then verify every attached file path before linking them.
