# Expert Workspace - Verizon Enrollment Flow Legal Review

## User

![image.png](attachments/01-initial-plan-review.png)

Review the notes and transcript from my meeting with legal ([https://app.notion.com/p/asurionproduct/3bc9532a1f86801b9909f2fa4273340e?source=copy_link)](https://app.notion.com/p/asurionproduct/3bc9532a1f86801b9909f2fa4273340e?source=copy_link\)) and help me

---

## ChatGPT

I reviewed the meeting notes and transcript and compared them with this screen. Your request appears to cut off after “help me,” so I do not want to guess the final deliverable. Here is the immediate readout.

### What is already aligned

The two additions from the earlier legal feedback are present:

- Enrollment is identified as optional and monthly renewal continues until canceled.
- Customers are told how to cancel, including MyVerizon and the phone number.

### What still needs to change

1. **State the claim limits explicitly.**  
   Replace the generic “Claim limits … apply” language with:

   **Claim limits are $3,000 per claim and $5,000 total in any 12-month period.**

2. **Remove uncertainty from the service-fee disclosure.**  
   Current:

   > Service fees up to $99 plus tax may apply.

   Agreed change:

   > **A service fee up to $99 plus tax applies.**

3. **Add the repair and replacement disclosure.**  
   The screen currently does not disclose non-original parts, refurbished replacements, or reimbursement. The meeting’s working language was:

   > **Repairs may use non-original parts. Replacements may be new or refurbished of like kind and quality, or we may reimburse you.**

   The transcript suggests this wording still needs final legal confirmation, particularly the reimbursement clause.

4. **Clarify what type of damage is covered.**  
   “Coverage for eligible home tech” is too broad. Legal preferred framing coverage as breakdown protection and separately identifying accidental damage for certain portable devices:

   - **Breakdowns for eligible home tech**
   - **Drops, spills, and cracked screens for certain portable devices**

5. **Add the arbitration and class-action disclosure.**  
   The final Terms & Conditions bullet should say:

   > **See the Terms & Conditions for complete coverage details, including arbitration provisions and a class action waiver.**

6. **Handle the 30-day language according to launch timing.**  
   “Protection for eligible devices begins after 30 days” should remain until **August 27, 2026**. On August 27, remove that bullet and update every Terms & Conditions link to the new version.

7. **Place enrollment controls after every disclosure.**  
   In the interactive prototype, the checkbox and Sign up button should not remain sticky. Customers must scroll through all disclosures before reaching the enrollment action. A subtle scroll cue or brief movement can communicate that more content is below without adding another instruction-heavy component.

8. **Prepare both review formats.**  
   Legal expects the revised clickable prototype for interaction and scroll review, plus a PDF they can annotate. fileciteturn1file0

The resulting experience should still feel like one focused review step rather than a legal-document wall: clear hierarchy, only relevant information, and one obvious action after the customer has received the required context. That is consistent with the Expert Workspace principles of building clarity into the interaction, reducing cognitive load, and maintaining a single pane of focus. fileciteturn0file0

What should I produce next: the final revised copy for this entire screen, a precise Figma change list, or the package/message to send back to legal?

---

## User

Review the notes and transcript from my meeting with legal https://app.notion.com/p/asurionproduct/3bc9532a1f86801b9909f2fa4273340e?source=copy_link and help me update the content. The content should be super easy for customers to understand the terms and i also need them written as succinctly as possible.

---

## ChatGPT

I reviewed the notes and transcript against the current screen. The current version is still missing several items legal treated as required: the specific claim limits, the non-original-parts/refurbished-device/reimbursement disclosure, coverage for certain portable-device damage, and the arbitration/class-action language. “May apply” also needs to become “applies.” fileciteturn1file0 fileciteturn1file3

I’d merge the first two overlapping coverage bullets, then keep each disclosure focused on one idea. That supports the design principles of showing only relevant information, reducing cognitive load, and making the next step clear. It also follows the Asurion guidance to use plain, helpful language and precise action labels. fileciteturn2file0 fileciteturn2file1

### Recommended customer-facing copy

:::writing{variant="standard" id="63842"}
**Review your plan**

**Verizon Home Device Protect**

**$25/month, plus tax**  
Billed through Verizon

**What’s included**

- Repairs or replacements for breakdowns on eligible home tech
- Drops, spills, and cracked screens for certain portable devices
- 24/7 expert tech support
- 2 in-home expert visits every 12 months

**Before you enroll**

- This optional plan automatically renews each month until canceled.
- Cancel anytime through My Verizon or by calling 855-730-7169.
- Coverage starts 30 days after enrollment.
- Phones aren’t covered.
- A service fee up to $99 plus tax applies.
- Claim limits: $3,000 per claim; $5,000 total per 12 months.
- Repairs may use non-original parts. Replacements may be new or refurbished and of like kind and quality, or we may reimburse you.
- See the Terms & Conditions for complete coverage details, including arbitration provisions and a class action waiver.

- [ ] I want to enroll in Verizon Home Device Protect. I agree to the Terms & Conditions, Electronic Communications Agreement, and Privacy Notice.

**Enroll**
:::

### Important implementation notes

**On August 27**, remove “Coverage starts 30 days after enrollment” and update the Terms & Conditions links at the same time. Legal specifically said not to remove that disclosure before the new terms take effect. fileciteturn1file0

Keep the checkbox and **Enroll** button after all disclosures rather than in a sticky footer. Legal wanted customers to reach the end of the content before the action appears. A subtle “Scroll to continue” cue can prevent the page from feeling broken. This also matches the prototype video’s guided, single-focus progression: one clear decision and one clear next action. fileciteturn1file0

Two wording choices should be explicitly confirmed in the next legal review:

- I used **“total”** instead of the more legalistic **“aggregate”** in the claim-limit bullet. It is much easier for customers to understand while preserving the amounts.
- The agreed portable-device phrase is concise, but the transcript clarifies that purely cosmetic damage is not covered when the device still works. A more precise alternative for legal to consider is: **“Breakdowns caused by drops, spills, or cracked screens on certain portable devices.”**

I would not shorten the remaining legal bullets further. Each communicates a separate decision-critical fact, and combining them would make the page shorter but materially harder to understand. This is the version I would send back in the clickable prototype and PDF for final legal confirmation—not present as approved copy yet.

---

## User

Can you clarify and potentially shorten this line so it's clear and concise, follows legal recommendations, and asurion content best practices?
"Repairs may use non-original parts. Replacements may be new or refurbished and of like kind and quality, or we may reimburse you."

---

## ChatGPT

**Recommended:**

> Repairs may use non-original parts. We may provide a new or refurbished replacement of like kind and quality, or reimburse you.

This is clearer because it:

- Separates repairs from replacement outcomes.
- Uses direct, active language.
- Preserves every point legal asked to disclose: non-original parts, new or refurbished replacements, like kind and quality, and reimbursement. fileciteturn1file0
- Keeps two short sentences so customers can scan it quickly, consistent with Asurion’s guidance to use plain language and reduce cognitive load. fileciteturn2file0 fileciteturn2file1

I would not shorten it further without legal approval. Phrases such as “like kind and quality” appear to carry specific legal meaning, and the meeting notes described the reimbursement wording as still needing refinement.

---

## User

![image.png](attachments/02-updated-plan-review.png)

Check this for any additional simplifications or reductions in content for the sake of customer understanding and experience.

---

## ChatGPT

This is close. I would make **six small copy changes** and stop there. Cutting more would start removing disclosures legal treated as necessary: the exact claim limits, service fee, repair and replacement outcomes, reimbursement, arbitration, and class-action waiver. fileciteturn1file0

## Recommended reductions

1. **Included with your plan** → **What’s included**  
   Shorter and more conversational.

2. **Covers drops, spills, and cracked screens for certain portable devices** →  
   **Drops, spills, and cracked screens for certain portable devices**  
   “Covers” is redundant beneath the section heading, and the shorter version matches the language discussed with legal.

3. **Two in-home expert visits every 12 months** →  
   **2 in-home expert visits every 12 months**  
   Easier to scan and consistent with “24/7.”

4. **Important plan details** → **Before you enroll**  
   This tells customers why the information matters and connects it directly to their decision.

5. **Enrollment in the plan is optional and renews each month until canceled.** →  
   **This optional plan automatically renews monthly until canceled.**  
   It is shorter while making automatic renewal more explicit.

6. **Cancel anytime on MyVerizon or by calling 855-730-7169.** →  
   **Cancel anytime on MyVerizon or call 855-730-7169.**

Two additional corrections:

- Change **“Service fees up to $99 plus tax applies”** to **“A service fee up to $99 plus tax applies.”** The current version has a subject-verb agreement error, and legal specifically recommended the singular wording.
- Replace the semicolon in the claim-limit statement with **“and.”** It reads more naturally aloud and is easier to understand.

These changes support the design principle of reducing cognitive load and showing only what is relevant, while the Asurion content guidance favors plain, helpful language and specific action labels. fileciteturn2file0 fileciteturn2file1

## Tightened version

### What’s included

- Repairs or replacements for breakdowns on eligible home tech
- Drops, spills, and cracked screens for certain portable devices
- 24/7 expert tech support
- 2 in-home expert visits every 12 months

### Before you enroll

- This optional plan automatically renews monthly until canceled.
- Cancel anytime on MyVerizon or call 855-730-7169.
- Phones aren’t covered.
- A service fee up to $99 plus tax applies.
- Claim limits: $3,000 per claim and $5,000 total per 12-month period.
- Repairs may use non-original parts. We may provide a new or refurbished replacement of like kind and quality, or reimburse you.
- See the Terms & Conditions for complete coverage details, including arbitration provisions and a class action waiver.

I would change the button from **Sign up** to **Enroll**. It is more precise, matches the language in the checkbox, and follows the prototype’s pattern of presenting one clear, context-specific next action.

## Content I would not shorten further

Keep the repair and replacement disclosure as written. It is the longest bullet, but each part carries a distinct meaning:

- Repairs can use non-original parts.
- Replacements can be new or refurbished.
- Replacements are of like kind and quality.
- Reimbursement is another possible resolution.

Likewise, keep the complete arbitration and class-action sentence unless legal supplies shorter approved language. That specific disclosure was called out as necessary in the meeting. fileciteturn1file0

## Two legal and interaction checks

The current screen does not include the 30-day coverage disclosure. Legal said that line should remain until **August 27, 2026**, and be removed only when the updated Terms & Conditions go live. This omission is correct only if the prototype intentionally represents the post–August 27 experience. fileciteturn1file0

Also verify that the checkbox and **Enroll** button are not sticky. The static screen looks like it may use a fixed footer. Legal asked that customers receive all disclosures before reaching the enrollment action. Keep the action at the end of the scroll, using a subtle scroll cue if customers might otherwise think the page is incomplete. fileciteturn1file0

---

## User

Is there another way to say: "Replacements are of like kind and quality." that reads more clearly and humanely?

---

## ChatGPT

**Recommended plain-language version:**

> **We may replace your device with a new or refurbished one of similar type and quality, or reimburse you.**

“Similar type and quality” is easier to understand than “like kind and quality,” while preserving the meaning legal asked you to communicate. It also uses active voice and connects the replacement directly to the customer’s device. fileciteturn1file0

A slightly more formal alternative is:

> **We may provide a new or refurbished replacement comparable in type and quality, or reimburse you.**

I prefer the first version for customers. I would still have legal confirm that **“similar type and quality”** can replace the more technical phrase, since the meeting established the required concept but did not explicitly approve that wording. The simpler construction aligns with Asurion’s direction to use plain, friendly language and reduce cognitive load. fileciteturn2file0 fileciteturn2file1

---

## User

`Export all contents of this chat word for word as a transcript into a downloadable markdown file. In the transcript, label me as “User” or “You” and label your turns/response as “ChatGPT.” The file name for the transcript should match the name of this chat. If this chat is in project, the file name should be named <project name> - <chat name>.md. Once the markdown file is prepared, present all files attached or generated in the thread so I can download them easily.`
