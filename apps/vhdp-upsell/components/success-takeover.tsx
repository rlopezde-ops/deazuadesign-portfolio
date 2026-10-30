"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, ShieldCheck, Headphones, Wrench } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"

const benefits = [
  {
    icon: ShieldCheck,
    title: "Cover your most important tech",
    description: "Covers tvs, laptops, gaming & more!",
  },
  {
    icon: Headphones,
    title: "24/7 tech support",
    description: "Priority help from experts who can answer virtually any home tech question.",
  },
  {
    icon: Wrench,
    title: "Hassle-free repairs",
    description: "Covers products you already own and future purchases, no receipts required.",
  },
]

export function SuccessTakeover({
  open,
  onContinue,
}: {
  open: boolean
  onContinue: () => void
}) {
  const [summaryOpen, setSummaryOpen] = useState(false)

  return (
    <div
      className={`absolute inset-0 z-30 flex flex-col bg-background transition-transform duration-300 ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!open}
    >
      {/* Top nav */}
      <div className="shrink-0 border-b border-border px-6 py-4">
        <BrandLogo className="h-[42px] w-auto object-contain" />
      </div>

      {/* Plan summary bar */}
      <button
        type="button"
        onClick={() => setSummaryOpen((v) => !v)}
        className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-6 py-4 text-left"
      >
        <div>
          <p className="text-sm text-muted-foreground">Plan summary</p>
          <p className="text-base font-bold text-foreground">Verizon Home Device Protect</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="whitespace-nowrap text-right">
            <span className="text-lg font-bold text-foreground">$25</span>
            <span className="text-base text-foreground">/month</span>
            <br />
            <span className="text-sm text-muted-foreground">plus tax</span>
          </p>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-foreground transition-transform ${summaryOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {summaryOpen && (
        <div className="shrink-0 border-b border-border bg-muted/40 px-6 py-4 text-sm leading-relaxed text-muted-foreground">
          One plan that covers thousands of eligible home tech products. Cancel any time. Billed through Verizon.
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pt-6">
        <Image
          src="/upsell-header-image.png"
          alt="Tablet, laptop, gaming device, thermostat, speaker and smartwatch"
          width={720}
          height={400}
          className="h-auto w-full"
        />

        <h1 className="mt-6 text-pretty text-4xl font-black leading-[1.1] tracking-tight text-foreground">
          You&apos;re enrolled &mdash; welcome aboard!
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          You&apos;ll get a confirmation email with plan details within 72 hours.
        </p>

        <ul className="mt-8 flex flex-col gap-6">
          {benefits.map((benefit) => (
            <li key={benefit.title} className="flex items-start gap-4">
              <benefit.icon className="mt-0.5 h-7 w-7 shrink-0 text-foreground" strokeWidth={1.5} />
              <div>
                <p className="text-lg font-bold text-foreground">{benefit.title}</p>
                <p className="mt-1 text-base leading-relaxed text-muted-foreground">{benefit.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-6" />
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border bg-card px-6 py-5">
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-full bg-brand-black py-4 text-lg font-medium text-white transition-opacity hover:opacity-90"
        >
          Add devices
        </button>
      </div>
    </div>
  )
}
