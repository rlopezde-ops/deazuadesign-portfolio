# Proactive Guidance - Design Alignment Meeting Summary

**Date:** August 18  
**Purpose:** Align on the proactive-guidance response taxonomy, identify the response types to prioritize for MVP, and review the initial UI direction before the larger cross-functional discussion.  
**Status:** The response taxonomy is close to final. The voting was used to prioritize which response types the team should focus on for MVP - not to decide whether each type belongs in the taxonomy. The main remaining work is defining how each type behaves and appears in the experience.  
**Source:** [Proactive Guidance - Design Alignment FigJam](https://www.figma.com/board/ZWGBnlL9YkfNmC8fCrSZpb/Proactive-Guidance---Design-Alignment-%E2%80%94-Response-Taxonomy--Aug-18-?node-id=26-263)

## Executive summary

The team reached broad alignment on a near-final response taxonomy for proactive guidance. The taxonomy gives the system a shared language for identifying what kind of support it is providing, while allowing the UI to render each type in a way that is appropriate for the expert's task.

The voting exercise was primarily an MVP prioritization activity. The resulting MVP focus areas are:

1. **Step-by-step guidance**
2. **Scripting — combining verbatim and general scripting**
3. **Quick actions**
4. **Account or customer details**
5. **Escalation**

Scripting should be treated as a core MVP workstream. Because it was divided into **Verbatim script** and **General scripting** in the taxonomy, its votes were split across two cards and do not fully represent the overall level of interest. It was also one of the most consistently discussed opportunity areas throughout the workshop. Participants repeatedly asked for guidance that removes preambles, uses natural read-aloud language, tells the expert exactly what to say, and clearly distinguishes spoken language from technical actions.

The remaining response types stay in the taxonomy, but the vote indicates that they should receive less design and implementation focus in the first MVP unless a specific requirement makes them necessary.

Across the discussion, the team consistently reinforced that proactive guidance must be short, conversational, scannable, and usable while an expert is actively talking with a customer. The current prototype produces too much long-form instructional prose and often combines scripts, technical steps, warnings, and escalation logic in one paragraph.

## MVP response-type priorities

### 1. Step-by-step guidance

This received the most support in the voting.

For MVP, step-by-step guidance should:

- Use short, scannable technical instructions.
- Break long troubleshooting paths into smaller steps or progressive responses.
- Keep active instructions visible while the expert still needs them.
- Avoid showing every conditional branch at once.
- Use knowledge-base content, source links, and visual media when available.
- Clearly communicate the current step and what happens next.

### 2. Scripting — verbatim and general

Scripting is an MVP priority even though the votes were divided between two taxonomy types. Taken together with the volume and consistency of workshop comments, scripting represents one of the clearest gaps between the current prototype output and the experience the team wants to create.

The current system primarily tells the expert what to do. It rarely gives the expert concise language they can naturally say to the customer. During the workshop, the team repeatedly emphasized that proactive guidance should "say the thing," remove instructional preambles, use conversational headers and copy, and be readable as-is while the expert is actively talking.

For MVP, scripting should:

- Support **verbatim scripts** for required compliance, legal, business-rule, or other exact-language moments.
- Support **general scripting** for discovery questions, empathy, hold language, transitions, explanations, and other conversational moments where exact wording is helpful but not mandatory.
- Use dynamic variables such as customer name, device model, or issue context when appropriate.
- Present the sentence the expert can say rather than instructions such as "Ask the customer..." or "Have the customer..."
- Keep language short, natural, and easy to scan during a live conversation.
- Make "say this" immediately distinguishable from "do this," even when both appear within the same task card.
- Avoid over-scripting routine moments where silence or a technical action is more useful.

Scripting is important for MVP because it directly reduces the translation work the expert must do between system guidance and customer-facing language. It supports the Expert Workspace principles of **Less typey, more talkey**, **Keep up with the conversation**, and **Don't make me think** by giving the expert usable language at the moment it is needed. The prototype direction reinforces this opportunity: guidance sits alongside the live interaction, so scripts must be immediately readable and usable without pulling the expert's attention away from the customer.

### 3. Quick actions

Quick actions should function as contextual next-best actions, not generic shortcuts shown under every card.

For MVP, quick actions should:

- Be specific to the current guidance or flow step.
- Usually show two or three clear options.
- Let the expert report an outcome, move to the next step, or open the relevant tool or workflow.
- Reveal conditional guidance only after the expert identifies what happened.
- Avoid assuming a failure state before the expert confirms it.

Example: instead of including installation-failure instructions in the original response, provide an action such as **The installation failed** and show the recovery guidance only after it is selected.

### 4. Account or customer details

The system should automatically capture relevant information from the conversation and available customer context.

For MVP, this response type should:

- Surface details such as customer name, mobile number, device, IMEI, EID, plan, or other relevant account information.
- Ask the expert to verify or correct information rather than enter it manually.
- Make it clear which information came from the transcript, account data, or another source.
- Provide a fast correction interaction when the system is wrong.
- Avoid asking the customer to repeat information the system already knows.

### 5. Escalation

Escalation should be treated as a distinct response type because the next action is handing off the interaction rather than continuing to resolve it.

For MVP, escalation guidance should:

- Tell the expert when escalation is appropriate.
- Identify the correct transfer or handoff path.
- Summarize the troubleshooting already completed.
- Pre-populate the customer, device, line, and issue details needed by the receiving team.
- Help the expert clearly explain the handoff to the customer.

## Near-final response taxonomy

The working taxonomy is close to final and includes:

- **Verbatim script:** Exact language the expert reads aloud, with dynamic variables filled from call context.
- **General scripting:** Conversational language for empathy, probing questions, hold announcements, or other non-verbatim moments.
- **Step-by-step guidance:** Technical instructions that tell the expert what to do.
- **Quick actions:** Contextual actions connected to the current response or flow step.
- **Caution or warning:** A distinct signal that identifies a risky or inappropriate action.
- **Escalation:** Guidance for when, where, and how to hand off the interaction.
- **Account or customer details:** Information captured automatically for the expert to verify or correct.
- **Additional details:** A targeted request for information the system still needs to resolve the issue.
- **Abstain:** A deliberate decision to show no guidance when context is insufficient, confidence is too low, or interruption would not be useful.

The lower-voted types are not being removed from the taxonomy. The vote indicates where the team should concentrate MVP design, engineering, and validation effort first. For MVP planning, **Verbatim script** and **General scripting** should remain distinct taxonomy types but be treated as one coordinated scripting workstream.

## Experience and content alignment

The team aligned around the following experience principles:

- **Remove preambles.** Start with the exact language, action, or next step the expert needs.
- **Use conversational language.** Most proactive content should sound natural if the expert reads it aloud.
- **Keep responses short.** Experts are reading and talking at the same time; long paragraphs increase cognitive load and may lead to hold time or longer calls.
- **Make content scannable.** Use clear hierarchy, short sections, and limited emphasis rather than a wall of text.
- **Distinguish content by purpose.** The expert should be able to tell what to say, what to do, what to verify, and what requires caution.
- **Use progressive guidance.** Complex troubleshooting and conditional logic should unfold as the conversation develops.
- **Keep useful guidance available.** Content should not disappear while the expert is still completing the task.
- **Use intent detection.** The system should infer the device, issue, and customer goal from the live conversation when possible.
- **Treat silence as valid.** The system should abstain rather than show low-confidence, repetitive, or unnecessary guidance.

This direction supports the broader Expert Workspace principles of bringing the next step to the expert, keeping pace with the conversation, showing useful context, maintaining a single pane of focus, and reducing the amount of reading and decision-making required during a live interaction.

## Structured task-card direction

The proposed structured task card remains the leading design direction. It improves on the current AI Assist panel by supporting:

- Separate treatments for mandatory verbatim scripts and suggested conversational scripts, with dynamic variable insertion
- Short, structured instructions instead of unformatted prose
- Auto-populated details for verification rather than manual entry
- Separate treatments for warnings and cautions
- Contextual quick actions
- A visible listening or processing state
- Richer content such as source links, knowledge-base material, or images when available

The card is a starting point rather than a final component design. The team still needs to define how the prioritized MVP response types share a common structure while remaining visually distinct.

## Open UX and behavior questions

These questions are about how the taxonomy is expressed in the product, not whether the response types belong in the taxonomy.

### Say vs. do

The MVP should make "say this" and "do this" immediately distinguishable. The remaining design question is whether those modes appear as separate surfaces or as clearly structured sections within one card. The discussion leaned toward keeping related guidance together while preserving a strong visual distinction.

### Guidance persistence and progression

The team needs to define:

- How long a response remains visible
- What advances or dismisses it
- How experts return to a prior step
- How completed steps and current selections are shown
- How guidance updates without disappearing in the middle of a task

### Latency

The prototype showed approximately 20 seconds of p95 latency between relevant conversation context and displayed guidance. The UI needs to communicate that the system is listening or processing without distracting the expert or creating false expectations.

The team also discussed the possibility of using a faster, lighter response for immediate moments and deeper processing for more complex guidance.

### Trust and correction

When the system captures customer or device details, the expert needs to understand:

- Where the information came from
- Whether the system is confident in it
- How to verify or correct it quickly
- When the system should ask a targeted follow-up question instead of presenting uncertain information

### Quick-action behavior

The team still needs to define exactly what each action can do, including:

- Advancing the guidance flow
- Reporting a troubleshooting outcome
- Opening a tool or workflow
- Triggering a conditional branch
- Recording a completed action

## Prototype data reviewed

- **30** Verizon calls replayed in real time
- **145** guidance messages generated
- Approximately **5 guidance cards per 10-minute call**
- **15** deliberate abstains
- **1,725** messages suppressed through cadence or deduplication rules
- **0** errors and **0** circuit-breaker trips
- Approximately **20 seconds p95 latency** for guidance that fired

The current system output was overwhelmingly step-by-step guidance. It did not produce standalone scripts, and cautions were generally embedded inside longer instructional messages rather than emitted as their own response type.

## Knowledge-grounding note

The run initially reported degraded knowledge-base retrieval, with all 145 messages generated without knowledge-base grounding. A later board note clarified that this was attributed to the sample data set and that the proof of concept is configured to use the knowledge base and web search.

The team should verify grounding and source-link behavior with representative call data before using pilot results to assess guidance quality.

## Recommended next steps

- [ ] Treat the taxonomy as the working final structure unless a critical gap is identified.
- [ ] Translate the voting results into explicit MVP scope and sequencing.
- [ ] Prioritize design and implementation for step-by-step guidance, scripting, quick actions, account or customer details, and escalation.
- [ ] Define the MVP behavior and visual treatment for both verbatim and general scripting, including when each should appear.
- [ ] Identify the compliance, legal, and business-rule moments that require exact verbatim language.
- [ ] Define a reusable card structure and the visual treatment for each prioritized response type.
- [ ] Rewrite prototype outputs to remove preambles and reduce content length.
- [ ] Prototype progressive guidance for long and conditional troubleshooting flows.
- [ ] Define quick-action behavior and how actions advance the guidance state.
- [ ] Define persistence, completion, history, and return-to-previous-step behavior.
- [ ] Define the listening or processing state for the latency window.
- [ ] Define verification, correction, confidence, and source patterns for AI-populated information.
- [ ] Verify knowledge-base and web-search grounding with representative data.
- [ ] Test the prioritized response patterns with experts for scanability, conversational flow, trust, and impact on call time.
- [ ] Test scripts for natural read-aloud delivery, timing, accuracy, and whether they reduce the expert's need to translate instructions into customer-facing language.
