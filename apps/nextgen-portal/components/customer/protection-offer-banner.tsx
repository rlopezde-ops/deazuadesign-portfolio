"use client";

import { useState } from "react";
import { Action, Icon, Tag, Text } from "@asurion-core/mx-asurion-ui-react";
import { formatEnrollmentTenure } from "@/lib/check-in-data";
import type { ProtectionProductOffer } from "@/lib/check-in-types";
import { cn } from "@/lib/utils";

function DeviceCollage() {
  return (
    <div
      aria-hidden
      className="relative hidden h-[5.5rem] w-[9rem] shrink-0 sm:block md:h-[6.25rem] md:w-[10.5rem]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/upsell-device-collage.png"
        alt=""
        className="absolute inset-0 h-full w-full object-contain object-right"
      />
    </div>
  );
}

function OfferChrome({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[8px] p-[2px]",
        "bg-[linear-gradient(135deg,var(--aui-accent-teal)_0%,var(--aui-accent-blue)_49%,var(--aui-primary)_100%)]"
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-between gap-3 overflow-hidden",
          "rounded-[6px]",
          "bg-[linear-gradient(315deg,var(--aui-gradient-light-stop-1)_0%,var(--aui-gradient-light-stop-2)_100%)]",
          "px-[var(--aui-spacing-300)] py-[var(--aui-spacing-200)]"
        )}
      >
        {children}
        <DeviceCollage />
      </div>
    </div>
  );
}

export function EligibleProtectionBanner({
  offer,
}: {
  offer: ProtectionProductOffer;
}) {
  const [pitched, setPitched] = useState(false);

  return (
    <OfferChrome>
      <div className="relative z-[1] flex min-w-0 flex-1 flex-col items-start gap-[var(--aui-spacing-150)]">
        <Text
          as="p"
          size={3}
          weight="heavy"
          color="var(--aui-on-surface)"
          className="!leading-tight text-balance"
        >
          {offer.name}
        </Text>
        <Action
          type="button"
          variant="tonal"
          size="sm"
          state={pitched ? "readonly" : "enabled"}
          onClick={() => setPitched(true)}
        >
          <Icon.Phosphor name="sparkle" weight="fill" aria-hidden />
          {pitched ? "Pitch started" : "Help me pitch"}
        </Action>
      </div>
    </OfferChrome>
  );
}

export function EnrolledProtectionBanner({
  offer,
}: {
  offer: ProtectionProductOffer;
}) {
  const tenure = offer.enrolledSince
    ? formatEnrollmentTenure(offer.enrolledSince)
    : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-[var(--aui-spacing-300)] py-[var(--aui-spacing-200)]">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <Text size={2} weight="heavy" className="text-balance">
            {offer.name}
          </Text>
          <Tag
            text="Enrolled"
            type="success"
            size="small"
            family="soft"
            iconName="shield-check"
          />
        </div>
        {tenure ? (
          <Text size={1} className="text-[var(--aui-on-surface-soft)]">
            Enrolled for {tenure}
          </Text>
        ) : null}
      </div>
    </div>
  );
}

export function ProtectionOffersSection({
  enrolled,
  eligible,
}: {
  enrolled?: ProtectionProductOffer;
  eligible: ProtectionProductOffer[];
}) {
  if (!enrolled && eligible.length === 0) return null;

  return (
    <div className="flex flex-col gap-[var(--aui-spacing-200)]">
      {enrolled ? <EnrolledProtectionBanner offer={enrolled} /> : null}
      {!enrolled
        ? eligible.map((offer) => (
            <EligibleProtectionBanner key={offer.id} offer={offer} />
          ))
        : null}
    </div>
  );
}
