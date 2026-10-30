export type PrototypeStatus = 'ready' | 'in-progress' | 'coming-soon'

export interface Prototype {
  slug: string
  title: string
  description: string
  status: PrototypeStatus
}

export const PROTOTYPES: Prototype[] = [
  {
    slug: 'payment-hub',
    title: 'Payment Hub',
    description:
      'Baseline — Expert Hub with the daily drop payment flow integrated in-context.',
    status: 'ready',
  },
  {
    slug: 'card-flip',
    title: 'Card Flip',
    description: 'Card flip pattern — metrics front, pay details back. No side panel.',
    status: 'ready',
  },
]
