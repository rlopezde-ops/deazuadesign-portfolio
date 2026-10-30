"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Signal, Wifi, BatteryFull } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { UpsellSheet } from "@/components/upsell-sheet"
import { CoveredDevicesSheet } from "@/components/covered-devices-sheet"
import { SignupTakeover } from "@/components/signup-takeover"
import { SuccessTakeover } from "@/components/success-takeover"

type Screen = "home" | "upsell" | "covered" | "signup" | "success"

function Prototype() {
  const searchParams = useSearchParams()
  const initScreen = (searchParams.get("screen") as Screen) || "upsell"

  const [upsellOpen, setUpsellOpen] = useState(initScreen === "upsell" || initScreen === "covered")
  const [coveredOpen, setCoveredOpen] = useState(initScreen === "covered")
  const [signupOpen, setSignupOpen] = useState(initScreen === "signup")
  const [successOpen, setSuccessOpen] = useState(initScreen === "success")

  return (
    <main className="flex min-h-dvh items-center justify-center bg-neutral-200 sm:p-6">
      {/* Mobile frame */}
      <div className="relative flex h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-background sm:h-[860px] sm:rounded-[2.5rem] sm:border-8 sm:border-black sm:shadow-2xl">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1 text-sm font-semibold text-foreground">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="h-4 w-4" />
            <Wifi className="h-4 w-4" />
            <BatteryFull className="h-5 w-5" />
          </div>
        </div>

        {/* Content + overlay layers live below the status bar */}
        <div className="relative flex-1 overflow-hidden">
        {/* Background app content — intentionally a blank placeholder.
            The real customer account page is out of scope for this prototype;
            keeping it unstyled means legal/compliance never has to re-review
            a mocked-up account experience as this flow evolves. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <BrandLogo className="h-[42px] w-auto object-contain" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">Customer account page</p>
        </div>

        {/* Layers */}
        <UpsellSheet
          open={upsellOpen && !signupOpen}
          onDecline={() => setUpsellOpen(false)}
          onGetCovered={() => setSignupOpen(true)}
          onSeeCovered={() => setCoveredOpen(true)}
        />

        <CoveredDevicesSheet open={coveredOpen} onClose={() => setCoveredOpen(false)} />

        <SignupTakeover
          open={signupOpen}
          onClose={() => setSignupOpen(false)}
          onEnrolled={() => {
            setSignupOpen(false)
            setUpsellOpen(false)
            setSuccessOpen(true)
          }}
        />

        <SuccessTakeover open={successOpen} onContinue={() => setSuccessOpen(false)} />
        </div>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Prototype />
    </Suspense>
  )
}
