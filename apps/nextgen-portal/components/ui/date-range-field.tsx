"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Calendar,
  type Day,
  type DayRange,
  type DayValue,
} from "@hassanmojab/react-modern-calendar-datepicker";
import { TextField } from "@asurion-core/mx-asurion-ui-react";
// Reuse AUI Datepicker chrome so the calendar matches the official component.
import StyleContainer from "@asurion-core/mx-asurion-ui-react/dist/components/Datepicker/StyleContainer.js";
import {
  DatepickerContainer,
  TextfieldWrapper,
} from "@asurion-core/mx-asurion-ui-react/dist/components/Datepicker/elements/index.js";
import { createGlobalStyle } from "styled-components";
import { cn } from "@/lib/utils";

/**
 * Airbnb-style range selection (react-dates / current Airbnb calendar):
 * - Mid days: continuous track fill on the cell
 * - Start/end: same track on the cell + circular endpoint layered on top
 * - Row wraps: pill caps via border-radius on first/last day in the week
 * Dark-mode tokens only. No negative z-index (that hid the track).
 */
const RangeFieldCalendarStyle = createGlobalStyle`
  /* Don't let closed date fields cover PredictiveTextField suggestions (AUI uses z-index:100). */
  [data-slot="date-range-field"] .DatePicker {
    z-index: 1;
  }

  [data-slot="date-range-field"] [data-aui="datepicker"] {
    --range-track: color-mix(in srgb, var(--aui-on-surface) 24%, transparent);
    --range-endpoint: var(--aui-on-surface);
    --range-endpoint-fg: var(--aui-elevated-level-03);
    --range-day-size: 2.35em;
  }

  /* Shared: kill borders/gaps that break the continuous pill */
  [data-slot="date-range-field"] [data-aui="datepicker"] .Calendar__day.-selectedBetween,
  [data-slot="date-range-field"] [data-aui="datepicker"] .Calendar__day.-selectedStart,
  [data-slot="date-range-field"] [data-aui="datepicker"] .Calendar__day.-selectedEnd,
  [data-slot="date-range-field"] [data-aui="datepicker"] .Calendar__day.-selected {
    border-color: transparent !important;
    box-shadow: none !important;
  }

  /* —— Mid-range track —— */
  [data-slot="date-range-field"] [data-aui="datepicker"] .Calendar__day.-selectedBetween {
    border-radius: 0 !important;
    background: var(--range-track) !important;
    color: var(--aui-on-surface) !important;
    font-weight: 500;
  }

  [data-slot="date-range-field"] [data-aui="datepicker"]
    .Calendar__weekRow
    .Calendar__day.-selectedBetween:first-child {
    border-radius: 100em 0 0 100em !important;
  }

  [data-slot="date-range-field"] [data-aui="datepicker"]
    .Calendar__weekRow
    .Calendar__day.-selectedBetween:last-child {
    border-radius: 0 100em 100em 0 !important;
  }

  /* —— Endpoint circle (incomplete or complete range) —— */
  [data-slot="date-range-field"] [data-aui="datepicker"] .Calendar__day.-selectedStart,
  [data-slot="date-range-field"] [data-aui="datepicker"] .Calendar__day.-selectedEnd,
  [data-slot="date-range-field"] [data-aui="datepicker"] .Calendar__day.-ltr.-selectedStart,
  [data-slot="date-range-field"] [data-aui="datepicker"] .Calendar__day.-ltr.-selectedEnd,
  [data-slot="date-range-field"] [data-aui="datepicker"] .Calendar__day.-rtl.-selectedStart,
  [data-slot="date-range-field"] [data-aui="datepicker"] .Calendar__day.-rtl.-selectedEnd,
  [data-slot="date-range-field"] [data-aui="datepicker"] .Calendar__day.-selected {
    position: relative;
    z-index: 1;
    border-radius: 0 !important;
    background-color: transparent !important;
    background-image: radial-gradient(
      circle closest-side,
      var(--range-endpoint) 99%,
      transparent 100%
    ) !important;
    background-size: var(--range-day-size) var(--range-day-size) !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    color: var(--range-endpoint-fg) !important;
    font-weight: 600;
  }

  /* —— Complete range: add track under the endpoint circles —— */
  [data-slot="date-range-field"] [data-aui="datepicker"][data-range-complete]
    .Calendar__day.-selectedStart,
  [data-slot="date-range-field"] [data-aui="datepicker"][data-range-complete]
    .Calendar__day.-ltr.-selectedStart {
    background-color: var(--range-track) !important;
    background-image: radial-gradient(
      circle closest-side,
      var(--range-endpoint) 99%,
      transparent 100%
    ) !important;
    background-size: var(--range-day-size) var(--range-day-size) !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    border-radius: 100em 0 0 100em !important;
  }

  [data-slot="date-range-field"] [data-aui="datepicker"][data-range-complete]
    .Calendar__day.-selectedEnd,
  [data-slot="date-range-field"] [data-aui="datepicker"][data-range-complete]
    .Calendar__day.-ltr.-selectedEnd {
    background-color: var(--range-track) !important;
    background-image: radial-gradient(
      circle closest-side,
      var(--range-endpoint) 99%,
      transparent 100%
    ) !important;
    background-size: var(--range-day-size) var(--range-day-size) !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    border-radius: 0 100em 100em 0 !important;
  }

  /* Start/end on week edges: fully rounded pill for that row segment */
  [data-slot="date-range-field"] [data-aui="datepicker"][data-range-complete]
    .Calendar__weekRow
    .Calendar__day.-selectedStart:last-child {
    border-radius: 100em !important;
  }

  [data-slot="date-range-field"] [data-aui="datepicker"][data-range-complete]
    .Calendar__weekRow
    .Calendar__day.-selectedEnd:first-child {
    border-radius: 100em !important;
  }

  /* Same-day range: circle only */
  [data-slot="date-range-field"] [data-aui="datepicker"]
    .Calendar__day.-selectedStart.-selectedEnd,
  [data-slot="date-range-field"] [data-aui="datepicker"][data-range-complete]
    .Calendar__day.-selectedStart.-selectedEnd {
    background-color: transparent !important;
    border-radius: 0 !important;
  }
`;

type DateRangeValue = {
  from: string;
  to: string;
};

type DateRangeFieldProps = {
  id?: string;
  label: string;
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  /** Disallow dates before this YYYY-MM-DD (defaults to today). */
  minDate?: string;
};

function makeLocale(language: string) {
  return {
    months: Array.from({ length: 12 }, (_, i) =>
      new Date(Date.UTC(1970, i, 1)).toLocaleString(language, {
        month: "long",
        timeZone: "UTC",
      })
    ),
    weekDays: Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.UTC(1970, 0, i + 4));
      return {
        name: date.toLocaleString(language, {
          weekday: "long",
          timeZone: "UTC",
        }),
        short: date.toLocaleString(language, {
          weekday: "short",
          timeZone: "UTC",
        }),
        isWeekend: [0, 6].includes(i),
      };
    }),
    weekStartingIndex: 0,
    getToday(gregorianTodayObject: Day) {
      return gregorianTodayObject;
    },
    toNativeDate(date: Day) {
      return new Date(date.year, date.month - 1, date.day);
    },
    getMonthLength(date: Day) {
      return new Date(date.year, date.month, 0).getDate();
    },
    transformDigit(digit: string | number) {
      return digit;
    },
    nextMonth: "Next month",
    previousMonth: "Previous month",
    openMonthSelector: "Open month selector",
    openYearSelector: "Open year selector",
    closeMonthSelector: "Close month selector",
    closeYearSelector: "Close year selector",
    defaultPlaceholder: "Select...",
    from: "from",
    to: "to",
    digitSeparator: ",",
    yearLetterSkip: 0,
    isRtl: false,
  };
}

function inputToDay(value: string): DayValue {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
}

function dayToInput(day: DayValue): string {
  if (!day) return "";
  const mm = String(day.month).padStart(2, "0");
  const dd = String(day.day).padStart(2, "0");
  return `${day.year}-${mm}-${dd}`;
}

function dayToLongDate(day: Day, language = "en-US") {
  return new Date(day.year, day.month - 1, day.day).toLocaleString(language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function valueToDayRange(value: DateRangeValue): DayRange {
  return {
    from: inputToDay(value.from),
    to: inputToDay(value.to),
  };
}

function todayDay(): Day {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

function formatCommittedDisplay(value: DateRangeValue, language = "en-US") {
  const from = inputToDay(value.from);
  const to = inputToDay(value.to);
  if (!from) return "";
  const fromLabel = dayToLongDate(from, language);
  if (
    !to ||
    (to.year === from.year && to.month === from.month && to.day === from.day)
  ) {
    return fromLabel;
  }
  return `${fromLabel} – ${dayToLongDate(to, language)}`;
}

/**
 * Date field built on the same calendar engine + AUI styles as AUI Datepicker.
 * First click commits a single day to the input; second click expands to a range.
 * Dismiss by clicking outside (or Escape).
 */
export function DateRangeField({
  id,
  label,
  value,
  onChange,
  required,
  disabled,
  className,
  helperText,
  minDate,
}: DateRangeFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const locale = useMemo(() => makeLocale("en-US"), []);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DayRange>(() => valueToDayRange(value));

  useEffect(() => {
    if (!open) setDraft(valueToDayRange(value));
  }, [value.from, value.to, open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target || rootRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const displayValue = formatCommittedDisplay(value);
  const minimumDate = inputToDay(minDate ?? "") ?? todayDay();

  function openCalendar() {
    if (disabled) return;
    setDraft(valueToDayRange(value));
    setOpen(true);
  }

  function handleCalendarChange(next: DayRange) {
    setDraft(next);
    if (!next.from) {
      onChange({ from: "", to: "" });
      return;
    }
    const from = dayToInput(next.from);
    // First click: only `from` — show a single date (to mirrors from for form state).
    // Second click: both ends — show the range.
    const to = dayToInput(next.to ?? next.from);
    onChange({ from, to });
  }

  return (
    <div
      ref={rootRef}
      className={cn("w-full", className)}
      data-slot="date-range-field"
    >
      <StyleContainer />
      <RangeFieldCalendarStyle />
      <DatepickerContainer
        data-aui="datepicker"
        data-range-complete={
          draft.from && draft.to ? "true" : undefined
        }
      >
        <div className="DatePicker calendar-wrapper" role="presentation">
          <TextfieldWrapper>
            <TextField
              id={fieldId}
              label={label}
              value={displayValue}
              readOnly
              required={required}
              disabled={disabled}
              helperText={helperText}
              placeholder=" "
              affixRight="calendar"
              affixRightClickable={!disabled}
              onAffixRightClick={openCalendar}
              inputClassName="Datepicker-input"
              labelClassName="Datepicker-label"
              onFocus={openCalendar}
              onClick={openCalendar}
            />
          </TextfieldWrapper>
          {open ? (
            <div
              className="DatePicker__calendarContainer"
              data-testid="calendar-container"
              role="presentation"
              // Keep focus on the input while interacting with the calendar.
              onMouseDown={(e) => e.preventDefault()}
            >
              <Calendar
                value={draft}
                onChange={handleCalendarChange}
                locale={locale}
                minimumDate={minimumDate}
                // React 19 ignores function-component defaultProps; set these
                // explicitly so day rendering does not call .find on undefined.
                disabledDays={[]}
                customDaysClassName={[]}
                colorPrimary="var(--aui-on-surface)"
                colorPrimaryLight="color-mix(in srgb, var(--aui-on-surface) 22%, transparent)"
                calendarClassName="DateRangeField-calendar"
                renderFooter={() => null}
              />
            </div>
          ) : null}
        </div>
      </DatepickerContainer>
    </div>
  );
}
