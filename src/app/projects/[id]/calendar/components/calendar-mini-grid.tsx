"use client";

import genDays from "@/utils/gen-days";
import { type Months } from "../page";

type Props = {
  year: number;
  monthNumber: number;
  monthName: Months;
  selectedDate: Date;
  onSelect: (date: Date) => void;
};

export default function CalendarMiniGrid({
  year,
  monthNumber,
  monthName,
  selectedDate,
  onSelect,
}: Props) {
  const days = genDays(year, monthNumber);

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

      <div className="grid grid-cols-7 w-full font-medium text-center items-center gap-2">
        {days.map((day, index) => (
          <p
            key={`${monthName}-${index}`}
            className={`
              aspect-square flex items-center justify-center
              rounded-sm text-sm transition-all duration-200 cursor-pointer
              hover:scale-105
              ${day.isOff ? "text-neutral-600" : "text-neutral-100"}
              ${isSelected(day)
                ? "bg-main hover:bg-blue-900"
                : "hover:bg-neutral-700"
              }
            `}
            onClick={() => onSelect(new Date(year, monthNumber, day.num))}
          >
            {day.num}
          </p>
        ))}
      </div>
    </section>
  );
}
