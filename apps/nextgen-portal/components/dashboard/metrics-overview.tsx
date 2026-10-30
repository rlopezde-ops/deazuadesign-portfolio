"use client";

import { Action, Text } from "@asurion-core/mx-asurion-ui-react";
import { metricCards } from "@/lib/dashboard-data";

function ProgressBar({ value, max }: { value: number; max: number }) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div
      className="mt-[var(--aui-spacing-150)] h-2 w-full overflow-hidden rounded-[var(--aui-border-radius-round)] bg-[var(--aui-progress-track)]"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full rounded-[var(--aui-border-radius-round)] bg-[var(--aui-progress-fill)] transition-[width] duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function MetricsOverview() {
  return (
    <section aria-labelledby="metrics-heading" style={{ marginBottom: "-1rem" }}>
      <div className="mb-[var(--aui-spacing-300)] flex items-center justify-between gap-4">
        <Text id="metrics-heading" as="h2" size={2} weight="base">
          Metrics overview
        </Text>
        <Action type="button" size="sm" variant="filled">
          View all
        </Action>
      </div>

      <div className="grid gap-[var(--aui-spacing-200)] sm:grid-cols-2">
        {metricCards.map((metric) => (
          <article
            key={metric.id}
            className="rounded-[var(--aui-border-radius-200)] border border-[var(--aui-outline-soft)] bg-[var(--aui-card-surface)] p-[var(--aui-spacing-200)]"
          >
            <Text as="h3" size={1} color="var(--aui-on-surface-soft)">
              {metric.label}
            </Text>
            <p className="mt-1 text-2xl font-medium tabular-nums text-[var(--aui-on-surface)]">
              {metric.prefix}
              {metric.current.toLocaleString()}
              <span className="text-[var(--aui-on-surface-soft)]">
                {" "}
                / {metric.prefix}
                {metric.goal.toLocaleString()}
              </span>
            </p>
            <ProgressBar value={metric.current} max={metric.goal} />
          </article>
        ))}
      </div>
    </section>
  );
}
