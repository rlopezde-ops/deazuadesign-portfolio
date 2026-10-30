"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { X, Check, ChevronDown } from "lucide-react"
import { TERMS_URL, ELECTRONIC_COMMUNICATIONS_URL, PRIVACY_NOTICE_URL } from "@/lib/utils"

const INCLUDED = [
  "Repairs or replacements for breakdowns on eligible home tech",
  "Covers drops, spills, and cracked screens for certain portable devices",
  "24/7 expert tech support",
  "2 in-home expert visits every 12 months",
]

export function SignupTakeover({
  open,
  onClose,
  onEnrolled,
}: {
  open: boolean
  onClose: () => void
  onEnrolled: () => void
}) {
  const [agreed, setAgreed] = useState(false)
  const [highlight, setHighlight] = useState(false)
  const [hasMoreBelow, setHasMoreBelow] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const ackRef = useRef<HTMLDivElement>(null)

  const updateScrollState = useCallback(() => {
    const el = bodyRef.current
    if (!el) return
    const remaining = el.scrollHeight - el.scrollTop - el.clientHeight
    setHasMoreBelow(remaining > 8)
  }, [])

  useEffect(() => {
    if (!open) return
    updateScrollState()
    window.addEventListener("resize", updateScrollState)
    return () => window.removeEventListener("resize", updateScrollState)
  }, [open, updateScrollState])

  function handleSignUp() {
    if (!agreed) {
      ackRef.current?.classList.remove("animate-shake")
      // Force reflow so the shake animation can retrigger on repeated taps.
      void ackRef.current?.offsetWidth
      ackRef.current?.classList.add("animate-shake")
      setHighlight(true)
      return
    }
    onEnrolled()
  }

  function handleAgreedChange(checked: boolean) {
    setAgreed(checked)
    if (checked) setHighlight(false)
  }

  return (
    <div
      aria-hidden={!open}
      className={`absolute inset-0 z-40 flex flex-col bg-card transition-transform duration-300 ease-out ${
        open ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Review your plan"
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-5">
        <h2 className="text-2xl font-bold text-foreground">Review your plan</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1 text-foreground transition-colors hover:bg-muted"
        >
          <X className="h-6 w-6" />
        </button>
      </header>

      {/* Body */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={bodyRef}
          onScroll={updateScrollState}
          className="h-full overflow-y-auto px-6 py-6"
        >
          <h3 className="text-pretty text-3xl font-medium text-foreground">Verizon Home Device Protect</h3>
          <p className="mt-3 text-2xl text-foreground">
            <span className="font-bold">$25/month</span> plus tax.
          </p>
          <p className="mt-1 text-base text-muted-foreground">Billed through Verizon</p>

          <h4 className="mt-8 text-lg font-bold text-foreground">Included with your plan</h4>
          <ul className="mt-4 flex flex-col gap-3">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-foreground" strokeWidth={2.5} />
                <span className="text-base leading-relaxed text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>

          <h4 className="mt-8 text-lg font-bold text-foreground">Important plan details</h4>
          <ul className="mt-4 flex flex-col gap-4 text-base leading-relaxed text-muted-foreground">
            <li className="flex gap-2">
              <span aria-hidden>&bull;</span>
              <span>Enrollment is optional and renews monthly until canceled.</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>&bull;</span>
              <span>Cancel anytime on MyVerizon or call 855-730-7169.</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>&bull;</span>
              <span>Phones aren&apos;t covered.</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>&bull;</span>
              <span>A service fee up to $99 plus tax applies per claim.</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>&bull;</span>
              <span>Claim limits: $3,000 per claim and $5,000 total per 12 month period.</span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>&bull;</span>
              <span>
                Repairs may use non-original parts. We may provide a new or refurbished replacement of
                like kind and quality, or reimburse you.
              </span>
            </li>
            <li className="flex gap-2">
              <span aria-hidden>&bull;</span>
              <span>
                See the{" "}
                <a
                  href={TERMS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  Terms &amp; Conditions
                </a>{" "}
                for complete coverage details, including arbitration provisions and a class action
                waiver.
              </span>
            </li>
          </ul>

          {/* Acknowledgement — lives in the scroll flow on purpose, after all the terms above */}
          <div
            ref={ackRef}
            className={`mt-8 rounded-xl border p-4 transition-colors ${
              highlight ? "border-red-500 bg-red-50" : "border-border bg-muted/40"
            }`}
          >
            <label
              htmlFor="vhdp-enroll-checkbox"
              className="flex min-h-11 cursor-pointer items-start gap-3"
            >
              <span className="relative mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center">
                <input
                  id="vhdp-enroll-checkbox"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => handleAgreedChange(e.target.checked)}
                  className={`peer h-6 w-6 cursor-pointer appearance-none rounded-md border-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black checked:border-brand-black checked:bg-brand-black ${
                    highlight && !agreed
                      ? "border-red-500 bg-card"
                      : "border-muted-foreground/50 bg-card"
                  }`}
                />
                <Check
                  aria-hidden
                  className="pointer-events-none absolute inset-0 m-auto h-4 w-4 text-white opacity-0 peer-checked:opacity-100"
                  strokeWidth={3}
                />
              </span>
              <span className="pt-0.5 text-base leading-relaxed text-foreground">
                I want to enroll in Verizon Home Device Protect.
              </span>
            </label>

            <p className="mt-2 text-sm leading-relaxed text-foreground">
              By enrolling, I agree to the{" "}
              <a
                href={TERMS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Terms &amp; Conditions
              </a>
              ,{" "}
              <a
                href={ELECTRONIC_COMMUNICATIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Electronic Communications Agreement
              </a>
              , and{" "}
              <a
                href={PRIVACY_NOTICE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                Privacy Notice
              </a>
              .
            </p>
          </div>

          {highlight && (
            <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-600">
              Select the checkbox above to continue.
            </p>
          )}

          <button
            type="button"
            onClick={handleSignUp}
            className="mt-6 w-full rounded-full bg-brand-black py-4 text-lg font-medium text-white transition-opacity hover:opacity-90"
          >
            Sign up
          </button>
        </div>

        {/* Scroll cue: fades in whenever there's unread content below the fold */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 flex h-16 items-end justify-center bg-gradient-to-t from-card via-card/90 to-transparent pb-1 transition-opacity duration-200 ${
            hasMoreBelow ? "opacity-100" : "opacity-0"
          }`}
        >
          <ChevronDown className="h-5 w-5 animate-bounce text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}
