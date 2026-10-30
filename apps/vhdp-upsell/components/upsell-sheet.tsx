"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"

const FEATURES = [
  {
    title: "Coverage for eligible home tech",
    sub: "TVs, laptops, gaming devices, and more",
    linkLabel: "and more",
  },
  {
    title: "Help anytime, not just when something breaks",
    sub: "24/7 expert support plus 2 in-home visits each year",
  },
  {
    title: "Protect devices you already own",
    sub: "No receipts required for eligible devices",
  },
]

export function UpsellSheet({
  open,
  onDecline,
  onGetCovered,
  onSeeCovered,
}: {
  open: boolean
  onDecline: () => void
  onGetCovered: () => void
  onSeeCovered: () => void
}) {
  return (
    <div
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Verizon Home Device Protect offer"
      className={`absolute inset-0 z-20 flex flex-col bg-card transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="flex-1 overflow-y-auto px-6 pt-6">
          <div className="flex items-start">
            <BrandLogo className="h-[42px] w-auto object-contain" />
          </div>

          <p className="mt-6 text-lg font-medium text-foreground">Verizon Home Device Protect</p>
          <h2 className="mt-1 text-pretty text-4xl font-black leading-[1.1] tracking-tight text-foreground">
            One plan for all your eligible home tech.
          </h2>

          <Image
            src="/upsell-header-image.png"
            alt="Tablet, laptop, gaming device, thermostat, speaker and smartwatch"
            width={720}
            height={400}
            priority
            className="mt-6 h-auto w-full"
          />

          <p className="mt-6 text-2xl text-foreground">
            <span className="font-bold">$25/month</span> plus tax.
          </p>
          <p className="mt-1 text-base text-muted-foreground">Cancel any time.</p>

          <ul className="mt-6 flex flex-col gap-5">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <Check className="mt-1 h-5 w-5 shrink-0 text-brand-black" strokeWidth={3} />
                <div className="flex-1">
                  <p className="text-lg font-medium leading-snug text-foreground">{f.title}</p>
                  <p className="mt-0.5 text-base text-muted-foreground">
                    {f.linkLabel ? (
                      <>
                        {f.sub.slice(0, -f.linkLabel.length)}
                        <button
                          type="button"
                          onClick={onSeeCovered}
                          className="underline underline-offset-2 hover:text-foreground"
                        >
                          {f.linkLabel}
                        </button>
                      </>
                    ) : (
                      f.sub
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border px-6 pb-8 pt-6">
        <button
          type="button"
          onClick={onDecline}
          className="px-2 text-lg font-medium text-foreground underline underline-offset-4"
        >
          No, thanks
        </button>
        <button
          type="button"
          onClick={onGetCovered}
          className="rounded-full bg-brand-black px-8 py-4 text-lg font-medium text-white transition-opacity hover:opacity-90"
        >
          Get covered today
        </button>
      </div>
    </div>
  )
}
