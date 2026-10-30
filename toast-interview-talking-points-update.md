Toast Principal Designer — Interview Talking Points

---

## Expert Workspace (Asurion)

**Problem**
- Call center/messaging agents using multiple disconnected tools (internal + client systems like Verizon) → constant context-switching
- Cluttered UI: AI chat, customer info, sales leaderboard, offers all visible at once regardless of relevance
- AI was reactive only — agent had to type questions, no proactive guidance
- ~2 weeks onboarding-level cognitive overload for new agents

**Goals (2026 OKRs)**
- Sales: improve SP100 (sales per 100) by 117% — from 4.6 to 10.0
- Efficiency: reduce average call duration from 24.3 to 20.0 minutes (18% reduction)
- Leadership's original ask behind these targets: improve solve rate, sell rate, and customer experience — not "ship another feature"
- Quantitative measurement still ongoing as Morning Paper/Sidecar pilots scale — no results to cite against these targets yet
- Early qualitative signal: faster call prep reported after Morning Paper rollout, reduced reliance on external knowledge tabs during Sidecar pilots

**Process**
- Went to Orlando call center repeatedly — observed live calls, shadowed agents, mapped current-state experience
- Ran a 2-day workshop with product/eng/sales/ops leadership to align on design principles: guided, simple, single pane of glass
- From workshop, identified 3 features to ship in 6 months: Morning Paper, Sidecar, After-Call Summary

**What shipped / in progress**
- Morning Paper (live, phase 1 MVP): daily context — schedule, metrics, canned coaching message. Learned data is only fresh by ~11am (not real "morning" data) — working with data team on latency.
- Sidecar (live pilot): consolidated AI assist + customer + offers into one panel w/ tabs, 50/50 split with call transcript, auto-switches customer→AI panel. Hid leaderboard during calls based on direct agent feedback (they only check it post-call) — replaced with small always-visible indicator near username.
- Phase 2 (next ~3 months): making AI proactive — listening to calls in real time, surfacing next-best-action/scripting without agent prompting. Biggest current challenge: AI responses too long/wordy for live-call context; working with a systems-thinking designer to define response types (scripting, guidance, instructions) and a consistent format for each.

**Key talking point / philosophy**
- Start with vision and principles, work backwards — align stakeholders early so future decisions have a shared reference point
- Ship real value incrementally even when infrastructure isn't perfect (data latency), rather than waiting for the ideal state
- Validate assumptions directly with users (leaderboard decision came from watching behavior + asking directly, not guessing)

---

## Stores Portal / Next-Gen Portal (Asurion)

**Problem**
- Scale: 680+ franchisee-owned uBreakiFix stores nationwide
- Legacy monolith: 10 years of band-aided features, 2-week training just to learn it
- Not integrated with Asurion's inventory/supply chain → manual workarounds, data inconsistencies

**Goals**
- Cut new-technician training time significantly and make onboarding new partners/programs a matter of days-to-weeks, not months
- Achieved: 50% reduction in training time; new partners (Amazon, Google, AT&T in-store pickup) onboard in ~1 week vs. 2 months

**Process**
- Went to stores directly — interviewed technicians, owners, customers throughout the project, not just at kickoff
- Built service blueprints with product/ops/engineering to map the full journey
- Ran workshops with technicians, owners, and execs from both Asurion and uBreakiFix to align on 5 design principles (adaptable/scalable, guided/helpful, simple/efficient, smart/proactive, reliable)
- Pushed for continuous early prototype sharing over big reveals — kept product/eng iterating together

**What shipped / outcome**
- New platform built on Microsoft D365 — single source of truth for parts, pricing, inventory
- Instant price estimates, Pay by Link, faster search
- Live across 680+ stores

**Key talking point / leadership moment**
- Product/ops wanted to rebuild the legacy system feature-for-feature — pushed back using the design principles as shared language, not just opinion
- Engineering ran waterfall, expected fully-resolved designs before code — advocated ship→learn→adjust instead
- By launch, design had moved from a service function to a strategic partner consulted on roadmap/exec decisions
- Reflection: wish we'd shipped faster and taken more risk — earlier, imperfect launches would've given signal sooner

---

## In-Store Claims Kiosk (Asurion)

**Problem**
- 2019 rebrand: uBreakiFix stores became Asurion-branded → customers expected in-store claims help
- Employees legally couldn't file claims for customers (not licensed adjusters) — risk of fraud classification
- Store systems had zero visibility into the claims platform
- Techs spending up to 45 min/customer trying to help anyway

**Goals**
- Cut in-store claim resolution time dramatically and shift volume to self-service to protect technician time
- Achieved: claim resolution time down to under 10 min (from 45 min); 10,000+ customers/month self-serving; $100K+ saved in call/chat deflection

**Process**
- In-store visits, technician interviews, direct feedback from store owners
- Built current-state + future-state service blueprints to align stakeholders who were initially at odds
- Piloted in 20 stores to test form factor: standing kiosk vs. handheld tablet
- Design wanted handheld (Apple Store/Warby Parker model); ops wanted standing kiosk over theft concerns

**What shipped / outcome**
- Warm hand-off model: tech identifies protection plan status → hands customer to tablet for self-service
- Removed friction: location auto-defaults to current store, simplified ID verification
- Scaled from 20-store pilot to all corporate stores with handheld tablets

**Key talking point / leadership moment**
- Pilot data — not opinion — resolved the kiosk-vs-tablet disagreement: customers didn't realize they could self-serve at the standing kiosk, so techs kept walking over anyway, proving kiosk-only self-service wasn't enough
- That evidence made the case for shifting to handheld post-pilot — a call the full team made together, not a top-down decision
- Reinforced that frontline involvement surfaces insights no desk research can uncover

---

## Guest Service Suite (Disney)

**Problem**
- Cast Members juggling 60+ disconnected apps just to help guests
- 60%+ of in-park staff had only mobile/tablet access, but tools weren't built for it
- Incident reports required 11 dropdown selections, some with hundreds of options
- Staff relied on paper flyers and the guest's own app for information — no unified system

**Goals**
- Meaningfully improve Cast Member efficiency and consolidate a fragmented 60+ app toolset into one experience
- Achieved: ~25% efficiency improvement; 80% positive Cast response across 30,000+ staff in 5 parks

**Process**
- Led design on Guest Interaction Tracking specifically
- Research with front-line, guest services, and call center staff
- Sketch-boarding and user testing throughout
- Aligned team around 3 principles: Inform, Simplify, Empower
- Grew team from 2 to 4 designers over the project

**What shipped / outcome**
- Consolidated 60+ legacy apps into 4 sections: Guest Interaction Tracking, Guest Itinerary & Scheduling, Tickets & Media, Admin
- Redesigned incident reporting flow, eliminating the 11-dropdown process
- Responsive across desktop, tablet, and mobile

**Key talking point / leadership moment**
- Interface adapts to how Cast actually works (chronological vs. grouped-by-incident view) — built from direct observation, not assumption
- Success came from involving Cast Members throughout — research, testing, working sessions — rather than designing in isolation
- Reflection: adoption follows naturally when you build with users, not just for them

---

## Questions for the Director of Product

**Question 1:**
"The role is described as a highly visible IC role working across product, engineering, data science, and go-to-market. Can you tell me more about how the design team is structured around Toast IQ and who this role would be collaborating with most closely?"

**Question 2:**
"The job description mentions launching and gating premium features and driving adoption — it sounds like Toast IQ is at an inflection point. What does success look like for this role in the first six months?"
