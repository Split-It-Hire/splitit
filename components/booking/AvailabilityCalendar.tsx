"use client";

import { useState, useEffect, useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  addDays,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
  parseISO,
  differenceInDays,
  isFriday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface CalendarDay {
  date: string;
  status: "available" | "booked" | "blocked" | "buffer";
}

interface Props {
  onSelect: (start: Date, end: Date, price: PriceResult) => void;
  rates: { daily: number; weekend: number; weekly: number };
}

interface PriceResult {
  hireType: "daily" | "weekend" | "weekly";
  numberOfDays: number;
  hireRate: number;
  hireFeeTotal: number;
}

function calcPrice(start: Date, end: Date, rates: Props["rates"]): PriceResult {
  const numberOfDays = differenceInDays(end, start) + 1;

  if (numberOfDays >= 7) {
    const weeks = Math.floor(numberOfDays / 7);
    const rem = numberOfDays % 7;
    return {
      hireType: "weekly",
      numberOfDays,
      hireRate: rates.weekly,
      hireFeeTotal: weeks * rates.weekly + rem * rates.daily,
    };
  }

  if (numberOfDays === 3 && isFriday(start)) {
    return {
      hireType: "weekend",
      numberOfDays,
      hireRate: rates.weekend,
      hireFeeTotal: rates.weekend,
    };
  }

  return {
    hireType: "daily",
    numberOfDays,
    hireRate: rates.daily,
    hireFeeTotal: numberOfDays * rates.daily,
  };
}

export default function AvailabilityCalendar({ onSelect, rates }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data: CalendarDay[]) => {
        setAvailability(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const availSet = new Set(
    availability.filter((d) => d.status === "available").map((d) => d.date)
  );
  const unavailSet = new Set(
    availability.filter((d) => d.status !== "available").map((d) => d.date)
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function getStatus(date: Date): "available" | "unavailable" | "past" {
    if (isBefore(date, today)) return "past";
    const key = format(date, "yyyy-MM-dd");
    if (unavailSet.has(key)) return "unavailable";
    return "available";
  }

  function isInRange(date: Date): boolean {
    const anchor = startDate;
    const end = endDate ?? hoverDate;
    if (!anchor || !end) return false;
    return isAfter(date, anchor) && isBefore(date, end);
  }

  function rangeHasUnavailable(start: Date, end: Date): boolean {
    let d = addDays(start, 1);
    while (isBefore(d, end) || isSameDay(d, end)) {
      if (getStatus(d) === "unavailable") return true;
      d = addDays(d, 1);
    }
    return false;
  }

  function handleDayClick(date: Date) {
    const status = getStatus(date);
    if (status === "past" || status === "unavailable") return;

    // State: both set = a range is confirmed. Start fresh with new first click.
    if (startDate && endDate) {
      setStartDate(date);
      setEndDate(null);                          // null = awaiting second click
      const price = calcPrice(date, date, rates);
      onSelect(date, date, price);               // register as 1-day so wizard accepts it
      return;
    }

    // State: no selection at all. First click — register as 1-day, await extension.
    if (!startDate) {
      setStartDate(date);
      setEndDate(null);
      const price = calcPrice(date, date, rates);
      onSelect(date, date, price);
      return;
    }

    // State: startDate set, endDate null — this is the second click to extend.
    // Clicking the same day confirms 1-day.
    if (isSameDay(date, startDate)) {
      setEndDate(date);
      const price = calcPrice(startDate, date, rates);
      onSelect(startDate, date, price);
      return;
    }

    // Clicked before start — treat as a new first click on that date.
    if (isBefore(date, startDate)) {
      setStartDate(date);
      setEndDate(null);
      const price = calcPrice(date, date, rates);
      onSelect(date, date, price);
      return;
    }

    // Clicked after start — check no unavailable dates in between.
    if (rangeHasUnavailable(startDate, date)) {
      // Can't span the range — restart from the clicked date.
      setStartDate(date);
      setEndDate(null);
      const price = calcPrice(date, date, rates);
      onSelect(date, date, price);
      return;
    }

    // Valid multi-day range confirmed.
    setEndDate(date);
    const price = calcPrice(startDate, date, rates);
    onSelect(startDate, date, price);
  }

  function renderDays() {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startWeek = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endWeek = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startWeek;

    while (day <= endWeek) {
      for (let i = 0; i < 7; i++) {
        const d = day;
        const status = getStatus(d);
        const isStart = startDate && isSameDay(d, startDate);
        const isEnd = endDate && isSameDay(d, endDate);
        const inRange = isInRange(d);
        const isCurrentMonth = isSameMonth(d, currentMonth);

        let cls =
          "relative h-10 w-10 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all select-none ";

        if (!isCurrentMonth) {
          cls += "text-gray-200 cursor-default";
        } else if (status === "past") {
          cls += "text-gray-300 cursor-default";
        } else if (status === "unavailable") {
          cls += "bg-red-50 text-red-300 cursor-not-allowed line-through";
        } else if (isStart || isEnd) {
          cls += "bg-green-700 text-white cursor-pointer font-bold shadow";
        } else if (inRange) {
          cls += "bg-green-100 text-green-800 cursor-pointer rounded-none";
        } else {
          cls += "hover:bg-green-50 text-gray-900 cursor-pointer hover:text-green-800";
        }

        days.push(
          <div key={d.toString()} className="text-center py-0.5">
            <button
              className={cls}
              onClick={() => handleDayClick(d)}
              onMouseEnter={() => startDate && !endDate && setHoverDate(d)}
              onMouseLeave={() => setHoverDate(null)}
              disabled={!isCurrentMonth || status !== "available"}
              aria-label={format(d, "d MMMM yyyy")}
            >
              {format(d, "d")}
            </button>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  }

  // Show preview as soon as a start date is selected.
  // If endDate is null (awaiting second click), use hoverDate or fall back to startDate (1-day).
  const previewEnd = endDate ?? hoverDate ?? startDate;
  const previewPrice = startDate && previewEnd
    ? calcPrice(startDate, previewEnd, rates)
    : null;

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-bold text-gray-900 text-lg">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-400">
          <Loader2 size={24} className="animate-spin mr-2" />
          Loading availability...
        </div>
      ) : (
        renderDays()
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-700 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-100 inline-block border border-red-200" />
          Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-100 inline-block" />
          Selected range
        </span>
      </div>

      {/* Price preview */}
      {previewPrice && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-green-800 font-medium">
                {startDate && previewEnd && isSameDay(startDate, previewEnd)
                  ? format(startDate, "d MMM yyyy")
                  : <>
                      {startDate && format(startDate, "d MMM")}
                      {" – "}
                      {previewEnd && format(previewEnd, "d MMM yyyy")}
                    </>
                }
              </div>
              <div className="text-xs text-green-600 capitalize">
                {previewPrice.numberOfDays} day{previewPrice.numberOfDays !== 1 ? "s" : ""} ·{" "}
                {previewPrice.hireType} rate
                {previewPrice.numberOfDays === 1 && !endDate && (
                  <span className="ml-2 text-green-500">· tap another date to extend</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-green-800"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
                ${previewPrice.hireFeeTotal}
              </div>
              <div className="text-xs text-green-600">hire fee inc. GST</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
