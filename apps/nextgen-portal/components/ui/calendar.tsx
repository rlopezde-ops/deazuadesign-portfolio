"use client";

import { DayPicker, type DayPickerProps } from "react-day-picker";
import { cn } from "@/lib/utils";

type CalendarProps = DayPickerProps;

function AuiChevron({ orientation }: { orientation?: "left" | "right" | "up" | "down" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "block size-[0.55rem] border-solid border-[var(--aui-on-surface)]",
        "border-t-[var(--aui-stroke-selected-card-hover)] border-l-[var(--aui-stroke-selected-card-hover)] border-r-0 border-b-0",
        orientation === "left" ? "rotate-[135deg]" : "-rotate-45"
      )}
    />
  );
}

/**
 * Calendar styled to match the AUI datepicker look used in Close Store.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  modifiers,
  modifiersClassNames,
  formatters,
  components,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      data-slot="aui-calendar"
      className={cn("aui-calendar", className)}
      formatters={{
        formatWeekdayName: (date) =>
          date.toLocaleDateString("en-US", { weekday: "short" }),
        ...formatters,
      }}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      classNames={{
        root: "aui-calendar",
        months: "aui-calendar__months",
        month: "aui-calendar__month",
        month_caption: "aui-calendar__caption",
        caption_label: "aui-calendar__caption-label",
        nav: "aui-calendar__nav",
        button_previous: "aui-calendar__nav-btn",
        button_next: "aui-calendar__nav-btn",
        month_grid: "aui-calendar__grid",
        weekdays: "aui-calendar__weekdays",
        weekday: "aui-calendar__weekday",
        week: "aui-calendar__week",
        day: "aui-calendar__day",
        day_button: "aui-calendar__day-btn",
        selected: "aui-calendar__day--selected",
        range_start: "aui-calendar__day--range-start",
        range_middle: "aui-calendar__day--range-middle",
        range_end: "aui-calendar__day--range-end",
        today: "aui-calendar__day--today",
        outside: "aui-calendar__day--outside",
        disabled: "aui-calendar__day--disabled",
        hidden: "aui-calendar__day--hidden",
        ...classNames,
      }}
      components={{
        Chevron: AuiChevron,
        ...components,
      }}
      {...props}
    />
  );
}
