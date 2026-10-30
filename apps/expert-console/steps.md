# Demo run sheet

**49 beats. 5 places you touch the screen.** Everything else is one key: `→`

Generated from `lib/script.ts` and verified by driving the demo end to end.

---

## Legend

| | |
|---|---|
| `→` | Press right arrow. Plays the next beat. |
| 🗣 **YOU** | Roberto's line — you say it, it types into the transcript |
| 👤 Maria | Customer's line — just press `→`, it types itself |
| 🤖 IVR | Automated line before you pick up |
| ⏸ **STOP** | Gate. Autoplay parks here. This is where you act. |
| 🖱 | Click something |
| ⌨ | Type something |
| ⚙️ | No line — the app changes state |

---

## The 5 things you actually do

Memorize this. Everything between them is `→`.

| Beat | Do this |
|---:|---|
| **3** | 🖱 **Continue** — on the ON AIR handoff modal |
| **13** | ⌨ **1234** then 🖱 **Verify** |
| **15** | 🖱 **Activate device** |
| **19** | 🖱 **Email** then 🖱 **Send instructions** |
| **48** | 🖱 **Ready for next customer** |

Two other gates (**1** and **43**) park autoplay but have nothing to click — just `→`.

> **Tip for practice:** hit `Space` for autoplay. It runs every talking beat for you and
> stops dead at all 7 gates, so the gates *are* your cue sheet. Press `Space` again to
> resume after you've done the click.

---

## 1 · Morning paper
Beats 1 · scene `daily-drop`

| # | | What happens |
|---:|---|---|
| **1** | ⏸ **STOP** | Waiting pill counts down and flips itself to **Available**. Let it land, talk over the leaderboard, then `→` to bring the call in. |

---

## 2 · Warm handoff
Beats 2–4 · scene `handoff`

| # | | What happens |
|---:|---|---|
| **2** | ⚙️ 🤖👤🤖 | Modal rises in **STANDBY**, amber ring drains over 9s then holds. All three IVR lines land in the transcript now, hidden behind the modal:<br>🤖 "Tell me what you need help with today."<br>👤 "I'm trying to activate my replacement phone. My son and I tried last night, but we couldn't get it working."<br>🤖 "Got it. I'll connect you with an expert who can help finish your iPhone activation." |
| **3** | ⏸ **STOP** | `→` flips you **ON AIR** — ring goes green, greeting brightens, Continue enables.<br>🖱 **Continue** |
| **4** | ⚙️ | Workspace assembles, call clock starts, the IVR transcript appears. |

---

## 3 · Clarify
Beats 5–8 · scene `clarify` · all `→`

| # | | Line |
|---:|---|---|
| **5** | 🗣 **YOU** | "Hi Maria, thanks for calling Verizon Tech Coach. My name is Roberto. I see you ran into an issue **activating your iPhone 15**. I can help with that. Can you tell me a little more about what you're seeing?" |
| **6** | 👤 Maria | "It looked like it was activating, but now it just says SOS and I don't have any service." → sets the problem summary |
| **7** | 🗣 **YOU** | "Are you connected to Wi-Fi on the iPhone right now?" |
| **8** | 👤 Maria | "Yes." → Wi-Fi fact captured, Verify opens up |

---

## 4 · Verify
Beats 9–14 · scene `verify`

| # | | Line / action |
|---:|---|---|
| **9** | 🗣 **YOU** | "Before we go further I need to verify your account." |
| **10** | 👤 Maria | "I can't get texts on this phone right now." |
| **11** | 🗣 **YOU** | "No problem. We can use email, or your carrier PIN. Which works better?" |
| **12** | 👤 Maria | "I know my PIN." → **the PIN drawer opens by itself** |
| **13** | ⏸ **STOP**<br>🗣 **YOU** | "Go ahead and give me the PIN when you're ready."<br>⌨ **1234** → 🖱 **Verify**<br>Watch the footer: Joy loader "Verifying code…" → ✓ "Account verified." → drawer sinks away |
| **14** | ⚙️ | Verify collapses to a done summary. Nothing lands in the main area. |

---

## 5 · Pick the device
Beats 15–16 · scene `activation`

| # | | Line / action |
|---:|---|---|
| **15** | ⏸ **STOP**<br>🗣 **YOU** | "I see the replacement iPhone 15 on your account. Let's get it activated for you."<br>The device drawer is already open — 🖱 **Activate device** |
| **16** | 👤 Maria | "Yes, that's the one." — lands as the click advances. Confirmation shows in the drawer footer, not the page. |

---

## 6 · Send activation instructions
Beats 17–21 · scene `activation`

| # | | Line / action |
|---:|---|---|
| **17** | 🗣 **YOU** | "Thanks, you're verified. I have the activation steps ready." |
| **18** | 🗣 **YOU** | "I can walk you through this step by step and send you instructions. Want them by text or email?" |
| **19** | ⏸ **STOP**<br>👤 Maria | "Email works — I still can't get texts on this phone." → **send drawer opens**<br>🖱 **Email** → 🖱 **Send instructions**<br>Footer: "Sending instructions…" → ✓ "Instructions sent." → drawer sinks |
| **20** | 🗣 **YOU** | "They're on the way to your email. Open the message and follow the steps when you're ready." → card keeps a quiet "Sent to maria.r@email.com" |
| **21** | 👤 Maria | "Okay, I have it. Give me a second — it's loading." → Discovery opens up |

---

## 7 · Discovery
Beats 22–23 · scene `discovery` · all `→`

| # | | Line |
|---:|---|---|
| **22** | 🗣 **YOU** | "Your son helped set this up earlier — does your family use a lot of other devices at home?" |
| **23** | 👤 Maria | "Definitely. We have laptops, tablets, a PlayStation, and a couple of TVs."<br>**Watch for:** 4 pins land on the customer card — Laptops · Tablets · PlayStation · TVs |

---

## 8 · Confirm the fix
Beats 24–28 · scene `confirm-solve` · all `→`

| # | | Line |
|---:|---|---|
| **24** | 🗣 **YOU** | "Let's make sure service is back. I can confirm with a text or a quick test call." |
| **25** | 👤 Maria | "Okay... I have bars now." |
| **26** | 🗣 **YOU** | "Great. Let's try a quick call to confirm." |
| **27** | 👤 Maria | "Yep. It went through." |
| **28** | 🗣 **YOU** | "Perfect. Your replacement iPhone is connected and ready to use."<br>**Watch for:** this unlocks the Sell opportunity |

---

## 9 · The pitch
Beats 29–42 · scene `opportunity` · all `→` · sidecar switches to **Offers**

| # | | Line |
|---:|---|---|
| **29** | 🗣 **YOU** *verbatim* | "Thanks for holding! Before we wrap up, I'd like to talk to you about a separate coverage from your mobile device insurance called **Verizon Home Device Protect**." |
| **30** | 👤 Maria | "Okay, sure — what is that?" |
| **31** | 🗣 **YOU** | "Mind if I send you a link so you can look over the plan details?" |
| **32** | 👤 Maria | "Yes, go ahead and send it." → link sent by email, Guided Browsing marked sent |
| **33** | ⚙️ | Customer opens the link — no line |
| **34** | 🗣 **YOU** *verbatim* | "Exactly! This plan covers breakdowns on all eligible products for one monthly price no matter when or where they were purchased…" |
| **35** | 🗣 **YOU** | "So you won't have to chase paperwork as you add eligible devices later." |
| **36** | 👤 Maria | "We already have protection on our phones…" ← **the objection** |
| **37** | 🗣 **YOU** | "VHDP covers home tech beyond the phone — laptops, tablets, gaming systems, TVs — under one monthly price." ← rebuttal generates |
| **38** | 🗣 **YOU** *verbatim* | "A service fee of no more than $99+ tax is required per claim, and your home tech will be repaired, replaced, or reimbursed." |
| **39** | 🗣 **YOU** | "Say your **PlayStation 5** stopped working out of nowhere — you could start a claim and get help with repair, replacement, or reimbursement." ← grounded in her own pin |
| **40** | 🗣 **YOU** *verbatim* | "It's $25 plus tax, per month." |
| **41** | 🗣 **YOU** *verbatim* | "Would you like to enroll today?" |
| **42** | 👤 Maria | "Yes, I think so." |

> **Optional, for show:** each Sell card has an **"I read it"** button. Clicking it settles
> that card and walks the step strip along — Pitch › Guided Browsing › Benefits and price ›
> Objection › Success. The beats surface the cards either way, so this is polish, not required.

---

## 10 · Enrollment
Beats 43–44 · scene `enrollment`

| # | | What happens |
|---:|---|---|
| **43** | ⏸ **STOP** | Gate reads "Send enrollment" but there's nothing to click on this path — just `→`. |
| **44** | ⚙️ | **Enrollment completes — confetti + "Enrollment successful!"** Let this land before talking. |

---

## 11 · Close
Beats 45–47 · scene `close` · all `→`

| # | | Line |
|---:|---|---|
| **45** | 🗣 **YOU** | "You're all set. We got your iPhone connected, and your enrollment is complete. Glad I could help today." |
| **46** | 👤 Maria | "Thank you so much." |
| **47** | 🗣 **YOU** | "You're welcome. Have a great rest of your day." → **call ends, Pit Stop appears** |

---

## 12 · Pit stop
Beats 48–49 · scene `pit-stop`

| # | | What happens |
|---:|---|---|
| **48** | ⏸ **STOP** | 🖱 **Ready for next customer** (its ring also auto-advances if you wait) |
| **49** | ⚙️ | Back to the morning paper, status **Available**. Loop closed. |

---

## Presenter keys

| Key | |
|---|---|
| `→` / `←` | Next / previous beat |
| `Space` | Autoplay on/off — parks at every gate |
| `↑` / `↓` | Jump between sections |
| `f` | Skip the current pacing dwell |
| `r` | Reset to the top |
| `h` | Hide/show the demo bar |

Keys are ignored while you're typing in a field, so the PIN boxes won't move the demo.

---

## Gotchas

- **`→` blows through a gate.** Pressing `→` at beat 13 skips the PIN entry entirely and the
  drawer just closes. If you're demoing the interaction, stop and click.
- **The handoff ring no longer goes live on its own.** It drains in ~9s then holds in STANDBY.
  Beat 3 is what puts you ON AIR, so you can talk over standby as long as you like.
- **Confirmations live in the drawer footer**, not the page. After each drawer action the
  footer shows the loader then the green check, the drawer sinks away, and the flow advances —
  nothing pops up in the main column.
- **`←` won't rebuild the modal.** Stepping backwards out of the workspace leaves you in the
  workspace with the counter walking back. Use `↑`/`↓` to jump sections instead — that replays
  cleanly from the top.
- **PIN is `1234`.** A wrong PIN shows an error and lets you retry; it never advances.
