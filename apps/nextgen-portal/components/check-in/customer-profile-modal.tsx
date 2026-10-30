"use client";

import React from "react";
import { Text } from "@asurion-core/mx-asurion-ui-react";
import {
  ArrowRight,
  CalendarCheck,
  Desktop,
  DeviceMobile,
  DeviceTablet,
  Drop,
  GameController,
  Headphones,
  Laptop,
  Plus,
  Watch,
  X,
} from "@phosphor-icons/react";
import {
  DEVICE_ISSUES,
  getEligibleProtectionOffers,
  getEnrolledProtectionOffer,
  historyForCustomer,
} from "@/lib/check-in-data";
import { useCheckIn } from "@/lib/check-in-context";
import { cn } from "@/lib/utils";
import type { DeviceType, HistoryDevice } from "@/lib/check-in-types";
import { ProtectionOffersSection } from "@/components/customer/protection-offer-banner";

function deviceIcon(type: DeviceType) {
  switch (type) {
    case "mobile": return DeviceMobile;
    case "tablet": return DeviceTablet;
    case "computer": return Laptop;
    case "game-console": return GameController;
    case "wearable": return Watch;
    case "hearable": return Headphones;
    default: return Desktop;
  }
}

export function CustomerProfileModal() {
  const {
    individual,
    business,
    relatedAppointments,
    closeProfileModal,
    confirmFromModal,
  } = useCheckIn();

  const [isClosing, setIsClosing] = React.useState(false);

  const handleCheckIn = React.useCallback(
    (opts: Parameters<typeof confirmFromModal>[0]) => {
      setIsClosing(true);
      setTimeout(() => confirmFromModal(opts), 180);
    },
    [confirmFromModal],
  );

  const customerId = individual?.id ?? business?.id;
  const history: HistoryDevice[] = customerId ? historyForCustomer(customerId) : [];

  const name = individual?.name ?? business?.name ?? "Customer";
  const phone = individual?.primaryPhone ?? business?.phone ?? "";
  const clientSinceYear = individual?.clientSinceYear ?? null;
  const techCareOfferCount = individual?.techCareOfferCount ?? 0;
  const techCareDeclined = individual?.techCareDeclined ?? false;
  const enrolledOffer = individual
    ? getEnrolledProtectionOffer(individual)
    : undefined;
  const eligibleOffers = individual
    ? getEligibleProtectionOffers(individual)
    : [];
  const showOfferHistory = !enrolledOffer && techCareOfferCount > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 ${isClosing ? "animate-modal-fade-out" : ""}`}
        onClick={closeProfileModal}
      />

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 flex w-[500px] flex-col bg-[var(--aui-surface)] shadow-2xl ${isClosing ? "animate-slide-out-right" : "animate-slide-in-right"}`}>
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-[var(--aui-outline-soft)] px-6 py-4 shrink-0">
          <Text size={3} weight="heavy">Customer profile</Text>
          <button
            type="button"
            onClick={closeProfileModal}
            className="flex size-8 items-center justify-center rounded-full hover:bg-[var(--aui-surface-variant)]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 overflow-y-auto">
          <div className="w-full px-6 py-6 flex flex-col gap-6">

          {/* Customer summary */}
          <section className="rounded-[var(--aui-border-radius-100)] bg-[var(--aui-surface-variant)] p-5">
            <Text as="h2" size={5} weight="heavy">{name}</Text>
            <Text size={2} className="mt-1 text-[var(--aui-on-surface-soft)]">
              {phone}
              {clientSinceYear ? ` · Customer since ${clientSinceYear}` : ""}
            </Text>
            {business && (
              <Text size={2} className="text-[var(--aui-on-surface-soft)]">
                {business.address}
              </Text>
            )}
            {showOfferHistory && (
              <div className="mt-3 flex items-center gap-1.5 text-sm text-[var(--aui-on-surface-soft)]">
                <span>Asurion Tech Care offered <strong className="text-[var(--aui-on-surface)]">{techCareOfferCount}×</strong></span>
                {techCareDeclined && (
                  <span className="rounded bg-[var(--aui-accent-orange-soft,#fff7ed)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--aui-accent-orange,#c2410c)]">
                    Declined
                  </span>
                )}
              </div>
            )}
            {individual ? (
              <div className="mt-4">
                <ProtectionOffersSection
                  enrolled={enrolledOffer}
                  eligible={eligibleOffers}
                />
              </div>
            ) : null}
          </section>

          {/* Appointments */}
          {relatedAppointments.length > 0 ? (
            <section className="flex flex-col gap-2">
              <Text
                size={1}
                weight="heavy"
                className="uppercase tracking-wide text-[var(--aui-on-surface-soft)]"
              >
                Upcoming appointments
              </Text>
              <ul className="flex flex-col gap-2">
                {relatedAppointments.map((appt) => (
                  <li key={appt.id}>
                    <button
                      type="button"
                      onClick={() => handleCheckIn({ appointment: appt })}
                      className={cn(
                        "flex w-full items-start justify-between gap-4 rounded-[var(--aui-border-radius-100)]",
                        "border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-4 py-4",
                        "transition-colors hover:border-[var(--aui-brand-asurion-purple)] hover:bg-[var(--aui-primary-soft)]"
                      )}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <CalendarCheck
                          className="mt-0.5 size-5 shrink-0 text-[var(--aui-brand-asurion-purple)]"
                          weight="duotone"
                        />
                        <div className="min-w-0 text-left flex flex-col gap-1">
                          {appt.devices[0] && (
                            <Text as="p" size={2} weight="heavy">
                              {appt.devices[0].make} {appt.devices[0].model}
                            </Text>
                          )}
                          {appt.devices[0]?.issueIds.length > 0 && (
                            <Text as="p" size={1} className="text-[var(--aui-on-surface-soft)]">
                              {appt.devices[0].issueIds.map((id) => DEVICE_ISSUES.find((i) => i.id === id)?.label ?? id).join(", ")}
                            </Text>
                          )}
                          <Text as="p" size={1} className="text-[var(--aui-on-surface-soft)]">
                            {appt.whenLabel}
                          </Text>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 text-[var(--aui-brand-asurion-purple)]">
                        <Text size={2} weight="heavy" className="text-[var(--aui-brand-asurion-purple)]">
                          Check in
                        </Text>
                        <ArrowRight className="size-4" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Devices */}
          <section className="flex flex-col gap-2">
            <Text
              size={1}
              weight="heavy"
              className="uppercase tracking-wide text-[var(--aui-on-surface-soft)]"
            >
              Devices
            </Text>
            <ul className="flex flex-col gap-2">
              {/* New device — always first */}
              <li>
                <button
                  type="button"
                  onClick={() => handleCheckIn({ newDevice: true })}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[var(--aui-border-radius-100)]",
                    "border border-dashed border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-4 py-3",
                    "transition-colors hover:border-[var(--aui-brand-asurion-purple)] hover:bg-[var(--aui-primary-soft)]"
                  )}
                >
                  <Plus className="size-5 shrink-0 text-[var(--aui-on-surface-soft)]" />
                  <Text size={2} weight="heavy">Check in a new device</Text>
                </button>
              </li>

              {history.map((device) => {
                const Icon = deviceIcon(device.deviceType);
                return (
                  <li key={device.id}>
                    <button
                      type="button"
                      onClick={() => handleCheckIn({ historyDevice: device })}
                      className={cn(
                        "flex w-full items-start justify-between gap-4 rounded-[var(--aui-border-radius-100)]",
                        "border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-4 py-4",
                        "transition-colors hover:border-[var(--aui-brand-asurion-purple)] hover:bg-[var(--aui-primary-soft)]"
                      )}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <Icon
                          className="mt-0.5 size-5 shrink-0 text-[var(--aui-on-surface-soft)]"
                          weight="duotone"
                        />
                        <div className="min-w-0 text-left flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Text as="p" size={2} weight="heavy">
                              {device.make} {device.model}
                            </Text>
                            {device.liquidDamage && (
                              <span className="flex items-center gap-0.5 rounded bg-[var(--aui-accent-blue-soft,#dbeafe)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--aui-accent-blue,#1d4ed8)]">
                                <Drop className="size-2.5" weight="fill" />
                                Liquid damage
                              </span>
                            )}
                          </div>
                          {(device.imei || device.serial) && (
                            <Text as="p" size={1} className="text-[var(--aui-on-surface-soft)]">
                              {device.imei ? `IMEI ${device.imei}` : `S/N ${device.serial}`}
                            </Text>
                          )}
                          {device.lastRepair && (
                            <Text as="p" size={1} className="text-[var(--aui-on-surface-soft)]">
                              Last repair: {device.lastRepair}
                            </Text>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 text-[var(--aui-brand-asurion-purple)]">
                        <Text size={2} weight="heavy" className="text-[var(--aui-brand-asurion-purple)]">
                          Check in
                        </Text>
                        <ArrowRight className="size-4" />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
          </div>
        </div>
      </div>
    </>
  );
}
