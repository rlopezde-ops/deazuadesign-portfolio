# Expert Workspace — Future Vision Walkthrough Script

**Length:** ~8 min · **Delivery:** hybrid (verbatim for opens/closes and the "why" moments, talking points for the walkthrough)
**Audiences:** Design team (Wed) · CPO — **Kamil** — (Thu). `CPO:` notes mark where to lean into cost, resolution time, and consistency, and hold the lines addressed to Kamil directly.
**Note:** Dan introduces the demo and hands off to me — so my open can be light; don't re-do the full setup Dan just gave.

**Legend:** 🗣️ = say close to verbatim · ▸ = talking point, riff in your own words · ⟶ = presenter action (advance/click) · 📊 = research point (weave in for credibility, or drop for time) · `CPO:` = emphasis note for Thursday / Kamil

---

## 0 · Intro (~25s)

🗣️ "Thanks Dan. This is our vision for the Expert Workspace — the screen an Expert lives in for their whole shift. I'm not going to tour features. I'll walk one real call, start to finish — Maria, activating a replacement phone — and talk about why we built it this way.

Today the screen is busy. It waits for the Expert to ask what to do next. We flipped that. We hear the call, and we've handled this same call thousands of times, so the system does that work — the Expert doesn't have to. Let's get into it."

⟶ Start the demo.

▸ *Hold in your pocket* — the five jobs everything ladders up to, to weave in as they show up: faster calls, know the customer, understand the problem fast, tailor the offer so it sticks, and make it easy enough that a new Expert is great on day one.

`CPO:` When job one comes up, land the equation — *less handle time = lower cost per call AND higher CSAT.* They usually trade off; here they move together. That's the headline.

---

## 1 · Daily Drop — why it exists (~55s)

⟶ Open on Daily Drop.

▸ Note to self: room's never seen this. Lead with the problem, not the layout.

🗣️ "This is the Daily Drop. Right now, an Expert has almost no visibility into their own day — their schedule, where they rank, how they're performing, even how they get paid. It's all scattered across different tools."

▸ Today they're bouncing between the Workspace, PowerBI, and Teams just to figure out how their day is going.

🗣️ "The Daily Drop puts it all in one place, and it's easy to read — grouped into Serve, Solve, and Sell, with what's going well and what needs work called out. They start the day knowing their two or three things to focus on. And they come back here between every call, so it's not a once-a-day thing."

▸ Reads in seconds — less time in dashboards, more time ready for the customer. Roberto's at #3 on the team; the competitive nudge is there, but the real point is clarity.

📊 The tool-sprawl isn't a guess — in our Orlando onsite, Experts were bouncing across Workspace, ACSS, Ozmo, and personal notes just to run a single call, and they used external notes because they didn't trust the system to hold onto anything. We rated that friction high on both frequency and severity. Same instinct here: stop making them assemble their own day out of three different systems.

`CPO:` The business case is folded into the story above: the transparency gap, the tool-sprawl (Workspace → PowerBI → Teams), and raising feedback frequency so coaching happens continuously, not once a week.

---

## 2 · Warm handoff — a moment to prepare (~55s)

⟶ Trigger the incoming call → warm handoff modal (STANDBY → ON AIR).

▸ Two sides to this moment — the customer's and the Expert's.

🗣️ "On the customer's side, Maria just explained what she needs to ConvoIVR. Joy — our AI — summarizes it for the Expert, so Maria doesn't repeat herself and we're not wasting time re-collecting what we already know."

🗣️ "On the Expert's side, they get ten or fifteen seconds to see who they're talking to, what they need, and get ready before they're live. Today a call just hits you cold — a ring, and you're on."

🗣️ "This is the other side of the warm transfer we showed at Next. Experts love it. It hands back the first 30 seconds of every call — the part they'd normally spend re-collecting what we already know — so the customer gets helped faster and the Expert understands the problem sooner."

📊 Two findings sit under this. In Verizon Soluto calls, about 40% were tied to a customer who had already called before — yet that prior context almost never carried forward, so Experts and customers rebuilt it from scratch. And our Warm Handoff research named the exact tax: discovery time spent re-asking for what the IVR already collected. This moment is the fix for both.

---

## 3 · The live call — anatomy of the workspace (~70s)

⟶ Continue → live call opens.

▸ Quick on the layout — it's organized by how much attention each part deserves.

**Top — the call bar.** ▸ Every call type has a pacing target — this activation is 25 minutes. The bar fills as the call runs, green to yellow to red. We're not policing anyone; we're giving the Expert the awareness a great one already has — "am I spending too long here?" — without making them do the math.

📊 Our pacing pilot — Visual Call Pacing — read out a roughly 47-second handle-time improvement. Early cohort, so I'd call that directional rather than a guarantee, but the signal is real: giving Experts the awareness moves the number.

`CPO:` Pacing visibility is the most direct lever on handle time and cost. Same green/yellow/red vocabulary as the morning metrics, so pace is legible without training.

**Left — the passive side.** ▸ This is reference, not action. The customer card that fills in as we learn more, and the live transcript. The Expert glances left when they *choose* to — if they're a non-native speaker, if they missed a word, if they want to pin something Maria said. It never demands attention.

**Right — the Sidecar, the proactive side.** ▸ Don't sell the panel, sell the need. Just like Joy anticipates needs in the *customer* app, the Sidecar anticipates the *Expert's*: it surfaces the next best action — what to say, the next step — based on what it's hearing and what we know about this call type. It takes the guesswork out of serving the customer, one step at a time.

▸ Two things worth naming, both grounded in our **Easy** principle. First, it's *tap-based* — we're deliberately not making the Expert type their way through a call. Second (⟶ especially if Kamil raises it): the typescale. We heard the earlier feedback that it was hard to read — we've increased it and aligned it to Joy's typescale, so it's legible at a glance mid-call.

📊 "Tap-based" comes straight from the proactive-guidance research — the principles the team aligned on are *"less typey, more talkey"* and *"don't make me think."* So guidance reads like something you'd say out loud, not instructions to decode. In the proof-of-concept that was about five cards over a ten-minute call — and when confidence was low, the system deliberately stayed silent rather than interrupt. Restraint is a feature.

▸ And the escape hatch — Expert Assist. If they need something that's off the guided path, they ask, they don't go hunting through articles.

📊 That escape hatch is exactly how Experts described using Assist in Orlando — the catch was it often handed back the same basic steps. So the bar here is accuracy, timing, and relevance, not just having a chat box.

🗣️ "Left is what they can reference, right is what to do next. The Expert isn't holding the whole call in their head — the system is."

---

## 4 · Solve — fixing the problem *with* the customer (~55s)

⟶ Walk the Solve steps: Verify → Select device → Activation.

▸ Watch how the Sidecar just walks it: verify the account, select the replacement iPhone, then activate. The Expert isn't deciding *what* to do — they're deciding *when* to say it.

🗣️ "The Expert isn't just reading steps out loud. We send Maria the actual how-to — an article, a video — so she can follow along on her own screen. They're both looking at the same thing."

▸ This is the "understand and resolve fast" job. Co-browsing kills the "no, tap the other button" back-and-forth that eats minutes on activation calls.

📊 Activation is where this pays off most. AT&T Experts told us that when the path actually fits the device, activation drops from 8–15 minutes to 5–7. The problem today: the device selector mostly covers Apple and Samsung, so anything else sends them hunting in other tools. And notice Maria's on a temporary SOS phone with PIN 1234 — that's the exact verification dead-end our research flagged, where the customer can't receive a code on the very device they're trying to activate. The system routing around that is the point.

`CPO:` This directly attacks resolution time and repeat contacts — the fix is guided *and* documented (instructions land in Maria's inbox), which lifts first-contact resolution.

---

## 5 · Sell — the next best action (~85s)

⟶ Resolution confirmed → Sell opportunity unlocks.

🗣️ "The problem's solved. This next part isn't 'the sales section' — it's the next best action. Sometimes that's an offer, sometimes it's something else, like getting them set up on the app. It depends on the client and what's actually useful to this customer."

▸ Why this is a *better* sale: it's built on real context. We pull in Maria's devices, the program she's on, and Customer 360 — plus what she just told us on the call. She mentioned laptops, tablets, a PlayStation, TVs, a whole household. So Verizon Home Device Protect isn't a generic pitch; the card is grounded in her own words — "based on: PlayStation 5."

▸ We've also deliberately *simplified* this whole section. Less reading, more instantly recognizable — because over time Experts build their own playbooks. They don't need the full script every time; mostly they just need to know what's eligible to sell, and we make that obvious at a glance.

📊 There's a real reason to keep it light. AT&T Experts told us faster activation literally creates the room to sell — and separately, over-scripting and compliance language is one of the things that stretches calls after the problem's already solved. So we lock only the words that legally have to be verbatim, and let everything else collapse into a playbook.

🗣️ "When there's legal language they have to say word-for-word, we lock it and show it in order. A new Expert doesn't go hunting for the right disclosure — the right words, in the right order, are just there. Consistent and compliant, without months of training."

🗣️ "We also show the product instead of just describing it — we send Maria a link so she can see it herself. It's hard to buy something you can only hear about. Seeing it builds trust, and that's what makes it stick."

▸ (brief) That shared second screen works across the call: earlier it can push visuals during the solve and show the Expert's identity, and after the call it's where star ratings come back.

🗣️ "And it learns. When Maria pushes back, we hand the Expert a rebuttal — and over time we learn which ones actually work. It's not a static script library; it gets better every call."

`CPO:` The stick-rate story in one line — offers grounded in real Customer-360 signal, shown not just told, sold with locked compliance, and improving over time. That's higher attach, lower cancels, lower risk.

---

## 6 · Pit Stop — bookending the call (~50s)

⟶ Close the sale → confetti → Pit Stop.

▸ The sale's made, and we give the Expert a beat before the next call. This is the Pit Stop.

🗣️ "Remember those three metrics from this morning — Serve, Solve, Sell? Here's how this one call moved them. Did they make the sale? Did they stay inside the pacing target? How did the customer feel — which we can pick up from the call itself."

▸ Learn a little, every call. One honest, encouraging line of feedback, then it drops them back to the Daily Drop, a little sharper for the next one. And the disposition goes to the client automatically — no copy-paste wrap-up.

📊 The pacing read has to be fair, and our research is blunt about why: not every long call is a bad one. Forty minutes waiting on an iPhone update isn't waste. So the feedback separates *wait* from *waste* — it doesn't punish an Expert for time the device or the customer controlled. That's what makes it a coach and not a stopwatch.

`CPO:` Tie it back to where we started —
🗣️ "Kamil, like you saw in the Daily Drop, we're giving Experts feedback more often. Same idea here — real transparency into performance, coached with AI, right after every call." *(Daily Drop to Pit Stop is one continuous coaching loop — consistent behavior at scale, without adding QA headcount.)*

---

## 7 · Close (~40s)

🗣️ "That was one call, but it's really one idea repeated everywhere: **the system carries the load, so the Expert can do the thing only a person can — build trust with the customer.**

We took a busy screen that made the Expert figure out what to do next, and made it proactive. It knows the customer, so Maria doesn't repeat herself. It knows the call, so it guides the next step. It paces the call, so we resolve faster — cheaper for us, better for her. And it learns as it goes, so a new Expert is good on day one and everyone keeps getting better.

That's the vision. In every moment, the system quietly has your back."

`CPO:` One-line takeaway to end on for Thursday: *"This is how we take cost out of the call and put resolution and consistency in — at the same time, at our scale."*

---

### Timing map (~8 min)
| Section | Target |
|---|---|
| 0 · Intro | 0:25 *(light — Dan set up the demo)* |
| 1 · Daily Drop | 0:55 |
| 2 · Warm handoff | 0:55 |
| 3 · Live call anatomy | 1:15 |
| 4 · Solve | 0:55 |
| 5 · Sell | 1:25 |
| 6 · Pit Stop | 0:55 |
| 7 · Close | 0:40 |
| **Total** | **~7:25** |

*The 📊 research points are additive — the timings above are for the spoken script without them. Weaving in all seven adds roughly 60–75 seconds. For the Wed design-team run you can read them all; for the ~8-minute Kamil version, keep the two strongest (Warm-handoff 40% repeat-caller stat, and the activation 8–15 → 5–7 min) and drop the rest.*

*If you're running long, trim first: the second-screen aside in Sell (§5), and the pacing/left-right detail in §3. Protect the Warm-handoff "other side of Next" line and the Pit-Stop Kamil close — those are the moments Dan flagged.*

---

### Research sources

Every 📊 point traces to internal research. Strongest-cited below; all live in Notion (linked from the two synthesis docs in `Expert Workspace/Research/`).

- **Repeat-caller context (40% / 10.7%)** — *Previous Session Summary* brief; *Warm Handoff* brief (IVR re-asking tax).
- **Activation 8–15 → 5–7 min; Apple/Samsung-only selector; verification dead-end** — *AT&T Device Activation* focus group (7 experts, 4 sessions, self-reported); *Orlando Call Center Onsite*.
- **Tool-sprawl (Workspace → ACSS → Ozmo → notes), rated high frequency/severity** — *Orlando Current State Journey Map*; *Workspace Research — Orlando 01/22/26*.
- **Visual Call Pacing ~47s AHT improvement** — *Expert Workspace weekly metrics digest, July 13 2026* (early cohort — directional, not causal).
- **"Less typey, more talkey" / "don't make me think"; ~5 cards per 10-min call; deliberate abstain; Assist as escape hatch** — *Proactive Guidance — Design Alignment* (Aug 18, 30-call POC).
- **Faster solve creates sales room; over-scripting/compliance extends CRT** — *AT&T Device Activation* focus group; *Orlando Current State Journey Map*.
- **Wait vs. waste (40-min update ≠ waste)** — *Verizon Onboarding Call Review*; *Expert Workspace CRT & long-call drivers* synthesis.

*Caveat for the room: these are recurring qualitative drivers plus a few small-sample or self-reported measures — strong enough to design around, not a controlled causal ranking. Say so if pushed; it builds trust rather than undercutting the story.*
