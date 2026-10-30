"use client";

import Image from "next/image";
import { ActionCard, Text } from "@asurion-core/mx-asurion-ui-react";
import { quickActions } from "@/lib/dashboard-nav-data";
import { useAppNavigation } from "@/lib/app-navigation";

export function QuickActions() {
  const { goToCheckIn } = useAppNavigation();

  return (
    <section aria-labelledby="quick-actions-heading" data-slot="quick-actions">
      <div className="grid grid-cols-2 gap-[var(--aui-spacing-200)] sm:grid-cols-4">
        {quickActions.map((action) => (
          <ActionCard
            key={action.id}
            variant="button"
            className="quick-action-tile overflow-hidden text-left transition-transform active:scale-[0.96]"
            onClick={
              action.id === "check-in" ? () => goToCheckIn() : undefined
            }
          >
            <div
              className="relative flex aspect-[3/2] w-full items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--aui-gradient-light-stop-1) 0%, var(--aui-primary-soft) 40%, var(--aui-gradient-light-stop-2) 100%)",
              }}
            >
              <Image
                src={action.image}
                alt=""
                width={160}
                height={160}
                className="size-[55%] max-h-[80px] w-auto object-contain mix-blend-lighten"
              />
            </div>
            <div className="bg-transparent px-3 py-3 text-center">
              <ActionCard.Heading
                size={2}
                className="!text-[var(--aui-on-surface)]"
              >
                {action.label}
              </ActionCard.Heading>
            </div>
          </ActionCard>
        ))}
      </div>
    </section>
  );
}
