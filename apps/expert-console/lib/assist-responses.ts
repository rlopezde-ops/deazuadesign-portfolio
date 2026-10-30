import type { SceneId } from '@/lib/types'

export type AssistChip = {
  /** Short label (2–3 words) shown in UI. */
  label: string
  /** Full query sent when the chip is clicked. */
  query: string
}

type ResponseCategory =
  | 'troubleshoot'
  | 'say'
  | 'next'
  | 'coverage'
  | 'pin'
  | 'esim'
  | 'opportunity'
  | 'unknown'

function classifyCategory(question: string): ResponseCategory {
  const q = question.toLowerCase()
  if (q.includes('say') || q.includes('tell') || q.includes('script') || q.includes('phrase')) return 'say'
  if (q.includes('pin') || q.includes('verify') || q.includes('code')) return 'pin'
  if (q.includes('esim') || q.includes('activation') || q.includes('cellular') || q.includes('sos')) return 'esim'
  if (q.includes('protect') || q.includes('vhdp') || q.includes('home device') || q.includes('coverage')) {
    return 'coverage'
  }
  if (q.includes('offer') || q.includes('opportunity') || q.includes('sell')) return 'opportunity'
  if (q.includes('next') || q.includes('what should') || q.includes('now what')) return 'next'
  if (q.includes('troubleshoot') || q.includes('fix') || q.includes('steps')) return 'troubleshoot'
  return 'unknown'
}

export function getAssistChips(scene: SceneId): AssistChip[] {
  switch (scene) {
    case 'daily-drop':
      return [
        { label: 'Focus today', query: 'What should I focus on today based on my stats?' },
        { label: 'ERP tips', query: 'How can I improve my ERP before my shift starts?' },
        { label: 'Next step', query: 'What is the next best action before I go available?' },
      ]
    case 'clarify':
      return [
        { label: 'What to say', query: 'What should I say next to confirm the SOS / no-service symptom?' },
        { label: 'Wi-Fi check', query: 'Give me a short script to confirm Wi-Fi is connected.' },
        { label: 'Next step', query: 'What is the next best action after clarifying the issue?' },
      ]
    case 'verify':
      return [
        { label: 'PIN script', query: 'Write a short script to ask for the Verizon account PIN.' },
        { label: 'Email option', query: 'How do I explain that SMS is unavailable and offer email?' },
        { label: 'What to say', query: 'What should I tell Maria while we verify the account?' },
      ]
    case 'activation':
      return [
        { label: 'eSIM steps', query: 'Give the Settings → Cellular → Add eSIM steps in one breath.' },
        { label: 'What to say', query: 'What should I say while Maria finishes activation?' },
        { label: 'Test call', query: 'How do I confirm service is back with a test call?' },
      ]
    case 'discovery':
    case 'confirm-solve':
      return [
        { label: 'Devices ask', query: 'Write a natural question about other devices at home.' },
        { label: 'What to say', query: 'What should I say once service comes back?' },
        { label: 'Next step', query: 'What is the next best action after confirming the fix?' },
      ]
    case 'opportunity':
    case 'enrollment':
      return [
        { label: 'VHDP overview', query: 'Give a one-breath overview of Verizon Home Device Protect.' },
        { label: 'Price script', query: 'How should I explain the $25/month price and service fees?' },
        { label: 'What to say', query: 'Write a short script to ask if she wants a quick overview.' },
      ]
    default:
      return [
        { label: 'What to say', query: 'What should I say next on this call?' },
        { label: 'Next step', query: 'What is the next best action right now?' },
        { label: 'Recap', query: 'Give me a short recap I can share with the customer.' },
      ]
  }
}

export function getAssistResponse(question: string, scene: SceneId): string {
  const category = classifyCategory(question)

  if (category === 'pin' || (scene === 'verify' && category === 'say')) {
    return `## What to say

Say: "I can't text this phone while it's on SOS — can I use the Verizon account PIN instead?"

## Next step

Enter the PIN, confirm it matches, then move into guided activation.`
  }

  if (category === 'esim' || scene === 'activation') {
    return `## Steps

1. Open **Settings**
2. Tap **Cellular**
3. Tap **Add eSIM**

## What to say

Say: "I'll walk you through three taps — Settings, Cellular, then Add eSIM. I'll stay with you."

## Next step

Send the instructions to her email, then wait for Verizon bars to return.`
  }

  if (category === 'coverage' || category === 'opportunity' || scene === 'opportunity' || scene === 'enrollment') {
    return `## Overview

Verizon Home Device Protect helps cover eligible home tech — laptops, tablets, TVs, gaming systems — in one plan. Phones stay on the phone plan.

## What to say

Say: "Want a quick overview of a plan that can help protect the other devices at home?"

## Next step

If she says yes, walk the three script steps, then cover required plan details before enrollment.`
  }

  if (category === 'say') {
    return `## What to say

Keep it one breath and warm:

Say: "Got it — thanks for that. Here's what we'll do next."

## Next step

Mirror her words, then move to the next guided step on screen.`
  }

  if (category === 'next' || category === 'troubleshoot') {
    const byScene: Partial<Record<SceneId, string>> = {
      'daily-drop': 'Review your at-risk metrics, then go Available when you are ready for the next call.',
      clarify: 'Confirm Wi-Fi, capture the SOS symptom, then open verification.',
      verify: 'Offer email or the account PIN — SMS will fail on SOS.',
      activation: 'Walk Add eSIM, send instructions, confirm bars + a test call.',
      discovery: 'Ask about other home devices once the phone is settling.',
      'confirm-solve': 'Confirm service, then decide whether to offer VHDP.',
      opportunity: 'Deliver the overview script, then required plan details.',
      enrollment: 'Send the enrollment link, then wait while she finishes on her phone.',
    }
    return `## Next step

${byScene[scene] ?? 'Follow the live task on the right — it is the next best action.'}

## What to say

Say: "Here's what we'll do next — I'll stay with you through it."`
  }

  if (scene === 'daily-drop') {
    return `## Focus

Start with anything marked **at risk** or **behind** on My stats. ERP is the highest-leverage lever before you go Available.

## Next step

Review the schedule rail, then flip Available when you are ready for the next customer.`
  }

  return `## Assist

I can help with what to say, the next best action, eSIM steps, PIN verification, or a VHDP overview.

Try a chip below, or ask something specific about this call.`
}
