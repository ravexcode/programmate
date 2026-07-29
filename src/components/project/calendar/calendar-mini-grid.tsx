"use client";

import { useMemo } from "react";
import genDays from "@/utils/gen-days";

import type { Months } from "./calendar";
import type { CalendarDate } from "@/types/team.types";

type Props = {
  year: number;
  monthNumber: number;
  monthName: Months;
  selectedDate: Date;
  events: CalendarDate[];
  onSelect: (date: Date) => void;
};

export default function CalendarMiniGrid({
  year,
  monthNumber,
  monthName,
  selectedDate,
  events,
  onSelect,
}: Props) {
  const days = genDays(year, monthNumber);

  const eventCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [events]);

  function getEventCount(dayNum: number): number {
    return eventCounts[`${year}-${monthNumber}-${dayNum}`] || 0;
  }

  function isToday(dayNum: number) {
    const today = new Date();
    return (
      dayNum === today.getDate() &&
      monthNumber === today.getMonth() &&
      year === today.getFullYear()
    );
  }

  function isSelected(day: { num: number; month_index: number }) {
    return (
      day.month_index === selectedDate.getMonth() &&
      day.num === selectedDate.getDate() &&
      year === selectedDate.getFullYear()
    );
  }

  return (
    <section className="w-full rounded-sm bg-neutral-800 mt-3 flex flex-col items-center p-2 py-4">
      <div className="grid grid-cols-7 w-full font-medium text-center mb-4 uppercase text-xs">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <p key={i}>{d}</p>
        ))}
      </div>

      <div className="grid grid-cols-7 w-full font-medium text-center items-center gap-y-2">
        {days.map((day, index) => {
          const count = getEventCount(day.num);
          const selected = isSelected(day);
          const today = isToday(day.num);

          return (
            <div
              key={`${monthName}-${index}`}
              className="flex flex-col items-center gap-0.5"
            >
              <button
                type="button"
                className={`
                  aspect-square w-8 flex items-center justify-center
                  rounded-sm text-sm transition-all duration-200 cursor-pointer
                  ${day.isOff ? "text-neutral-600" : "text-neutral-100"}
                  ${selected ? "bg-main hover:brightness-80" : today ? "ring-1 ring-main/50 hover:bg-neutral-700" : "hover:bg-neutral-700"}
                `}
                onClick={() => onSelect(new Date(year, monthNumber, day.num))}
              >
                {day.num}
              </button>

              {count > 0 && (
                <span
                  className={`text-[10px] leading-none font-normal ${
                    selected ? "text-main/80" : "text-main/60"
                  }`}
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
