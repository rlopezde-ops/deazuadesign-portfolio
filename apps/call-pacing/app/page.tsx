import Link from "next/link"
import { ArrowRight, Timer, Swatches, TrendUp } from "@phosphor-icons/react/dist/ssr"

interface PrototypeCard {
  id: string
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

const prototypes: PrototypeCard[] = [
  {
    id: 'egg-timer',
    title: 'Egg Timer Call Bar (v1)',
    description: 'A single call bar with a countdown pill and a shrinking timer-bar background. Counts 30:00 down to zero, then keeps counting into the negative, shifting green → yellow → red as time runs out.',
    href: '/egg-timer',
    icon: <Timer weight="duotone" className="w-6 h-6" />,
  },
  {
    id: 'static-bar',
    title: 'Static Bar Call Bar (v2)',
    description: 'Same countdown pill and threshold states as v1, but the call bar stays fully filled the whole call. Only its color shifts green → yellow → red as time runs out — no shrinking bar.',
    href: '/static-bar',
    icon: <Swatches weight="duotone" className="w-6 h-6" />,
  },
  {
    id: 'growing-bar',
    title: 'Growing Bar Call Bar (v3)',
    description: 'Same countdown pill and threshold states as v1, but the timer bar grows from left to right as the call elapses — filling up instead of draining down — shifting green → yellow → red as time runs out.',
    href: '/growing-bar',
    icon: <TrendUp weight="duotone" className="w-6 h-6" />,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--aui-background-primary)] font-sans">
      {/* Header */}
      <header className="border-b border-[var(--aui-border-secondary)] bg-[var(--aui-background-secondary)]">
        <div className="max-w-[1280px] mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-[var(--aui-interactive-primary)] font-bold text-lg">asurion</span>
            <span className="text-[var(--aui-text-primary)] font-normal text-lg">workspace</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-[var(--aui-text-primary)] font-bold text-3xl mb-2">
            Call Pacing Prototypes
          </h1>
          <p className="text-[var(--aui-text-secondary)] text-base max-w-2xl">
            Iterations of a visual call-pacing tool for the expert Workspace. Each prototype
            explores a different way to help experts sense how a call is tracking against time.
          </p>
        </div>

        {/* Prototype Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prototypes.map((prototype) => (
            <Link
              key={prototype.id}
              href={prototype.href}
              className="group relative flex flex-col p-5 rounded-lg border transition-all duration-200 bg-[var(--aui-background-secondary)] border-[var(--aui-border-secondary)] hover:border-[var(--aui-interactive-primary)] hover:bg-[var(--aui-background-tertiary)] cursor-pointer"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-[var(--aui-interactive-primary)]/15 text-[var(--aui-interactive-primary)]">
                {prototype.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h2 className="text-[var(--aui-text-primary)] font-semibold text-base mb-2">
                  {prototype.title}
                </h2>
                <p className="text-[var(--aui-text-secondary)] text-sm leading-relaxed">
                  {prototype.description}
                </p>
              </div>

              {/* Arrow */}
              <div className="absolute top-5 right-5 text-[var(--aui-text-tertiary)] group-hover:text-[var(--aui-interactive-primary)] transition-colors">
                <ArrowRight weight="bold" className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-[var(--aui-text-tertiary)] text-xs mt-8 text-center">
          Executive Demo Prototypes - For internal review only
        </p>
      </main>
    </div>
  )
}
