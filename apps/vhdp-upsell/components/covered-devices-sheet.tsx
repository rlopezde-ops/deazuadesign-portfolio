"use client"

import { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { COVERED_CATEGORIES } from "@/lib/covered-devices"
import { TERMS_URL } from "@/lib/utils"

export function CoveredDevicesSheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div
      aria-hidden={!open}
      className={`absolute inset-0 z-30 flex flex-col justify-end transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Scrim */}
      <button
        type="button"
        aria-label="Close covered devices"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* Sheet */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Covered devices"
        className={`relative flex max-h-[92%] flex-col rounded-t-3xl bg-card shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <header className="flex items-start justify-between px-6 pt-6">
          <BrandLogo className="h-[42px] w-auto object-contain" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-foreground transition-colors hover:bg-muted"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="overflow-y-auto px-6 pt-6">
          <p className="text-pretty text-lg leading-relaxed text-foreground">
            <span className="font-semibold">Verizon Home Device Protect</span>{" "}
            covers thousands of eligible home tech products&mdash;even if you didn&apos;t buy them from Verizon.
          </p>

          <a
            href={TERMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-lg font-medium text-foreground underline underline-offset-4"
          >
            See Terms &amp; Conditions
          </a>

          <div className="mt-4 border-t border-border">
            {COVERED_CATEGORIES.map((cat) => {
              const isOpen = openId === cat.id
              return (
                <div key={cat.id} className="border-b border-border">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : cat.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="text-lg font-bold text-foreground">{cat.title}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-foreground transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </h3>
                  <div
                    className={`grid transition-all duration-200 ease-out ${
                      isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="flex flex-col gap-2.5">
                        {cat.devices.map((device) => (
                          <li key={device} className="text-base leading-relaxed text-muted-foreground">
                            {device}
                          </li>
                        ))}
                      </ul>
                      {cat.note && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cat.note}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="px-6 pb-8 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-brand-black py-4 text-lg font-medium text-white transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </section>
    </div>
  )
}
