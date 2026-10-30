"use client";

import Image from "next/image";
import { Action, Icon } from "@asurion-core/mx-asurion-ui-react";
import { HeaderSearch } from "@/components/dashboard/header-search";
import { storeLocation } from "@/lib/dashboard-data";

function HeaderIcon({
  name,
  weight = "regular",
  withLabel = false,
}: {
  name: string;
  weight?: "regular" | "fill";
  withLabel?: boolean;
}) {
  return (
    <Icon.Phosphor
      name={name}
      size="small"
      weight={weight}
      aria-hidden
      className={withLabel ? "!mr-2 !inline-block shrink-0 self-center" : "!inline-block shrink-0 self-center"}
    />
  );
}

export function StoreHeader() {
  return (
    <header
      data-slot="store-header"
      className="relative z-40 flex h-14 shrink-0 items-center gap-4 border-b border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-[var(--aui-spacing-200)]"
    >
      <div className="flex min-w-0 shrink-0 items-center gap-3">
        <Image
          src="/images/ubif-logo.png"
          alt="ubreakifix by asurion"
          width={140}
          height={28}
          priority
          className="h-7 w-auto object-contain object-left brightness-0 invert"
        />
        <HeaderSearch disabled />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Action
          type="button"
          size="sm"
          variant="outline"
          className="!inline-flex !items-center !gap-2"
        >
          <HeaderIcon name="headset" withLabel />
          <span className="leading-none">UBIF support</span>
        </Action>

        <Action
          type="button"
          size="sm"
          variant="outline"
          className="!inline-flex !items-center !gap-2"
        >
          <HeaderIcon name="map-pin" weight="fill" withLabel />
          <span className="leading-none">{storeLocation}</span>
        </Action>

        <Action type="button" size="sm" variant="outline">
          <span className="leading-none">Close store</span>
        </Action>

        <Action
          type="button"
          size="sm"
          variant="flat"
          aria-label="Chat"
          className="!inline-flex !items-center !justify-center"
        >
          <HeaderIcon name="chat-circle" />
        </Action>

        <Action
          type="button"
          size="sm"
          variant="flat"
          aria-label="Notifications"
          className="!inline-flex !items-center !justify-center"
        >
          <HeaderIcon name="bell" />
        </Action>

        <Action
          type="button"
          size="sm"
          variant="flat"
          aria-label="User menu"
          className="!size-9 !min-w-9 !rounded-full !bg-[var(--aui-accent-purple-soft)] !p-0 !text-[var(--aui-accent-purple)]"
        >
          <span className="leading-none">Y</span>
        </Action>
      </div>
    </header>
  );
}
