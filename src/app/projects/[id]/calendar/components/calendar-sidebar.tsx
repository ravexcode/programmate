"use client";

import { useRouter } from "next/navigation";

import MainButton from "@/components/ui/buttons/main";
import CalendarMiniGrid from "./calendar-mini-grid";

import { IconArrowLeft, IconArrowRight, IconPlus } from "@tabler/icons-react";

import type { Months } from "../page";

type Props = {
  teamName: string;
  monthName: Months;
  monthNumber: number;
  year: number;
  selectedDate: Date;
  onMonthChange: (month: number, year: number) => void;
  onToday: () => void;
  onSelectDate: (date: Date) => void;
  onOpenCreator: () => void;
};

export default function CalendarSidebar({
  teamName,
  monthName,
  monthNumber,
  year,
  selectedDate,
  onMonthChange,
  onToday,
  onSelectDate,
  onOpenCreator,
}: Props) {
  const router = useRouter();

  function goBack() {
    const next = monthNumber > 0 ? monthNumber - 1 : 11;
    const nextYear = monthNumber === 0 ? year - 1 : year;
    onMonthChange(next, nextYear);
  }

  function goForward() {
    const next = monthNumber < 11 ? monthNumber + 1 : 0;
    const nextYear = monthNumber === 11 ? year + 1 : year;
    onMonthChange(next, nextYear);
  }

  return (
    <aside className="h-full flex flex-col bg-neutral-900 p-4 w-80 shrink-0 border-r border-neutral-800">
      <button
        type="button"
        onClick={() => router.back()}
        className="w-max mb-3 mr-auto py-1.5 px-3 rounded-sm hover:bg-neutral-700 flex gap-2 items-center text-sm cursor-pointer duration-300"
      >
        <IconArrowLeft size={14} />
        Back
      </button>

      <p className="text-2xl font-medium tracking-wide w-full text-start">
        {teamName} calendar
      </p>

      <MainButton
        size="w-full"
        className="mt-4 flex gap-1 items-center justify-center"
        action={onOpenCreator}
      >
        <IconPlus size={14} stroke={3.5} />
        <span className="text-sm font-medium">New event</span>
      </MainButton>

      <div className="w-full flex items-center justify-between mt-8">
        <p className="text-base font-medium tracking-wide">
          {monthName} {year}
        </p>

        <div className="flex gap-1 items-center">
          <button
            type="button"
            className="px-3 py-1.5 rounded-sm duration-300 hover:bg-neutral-700 cursor-pointer text-xs"
            onClick={onToday}
          >
            Now
          </button>

          <button
            type="button"
            className="p-2 rounded-full duration-300 hover:bg-neutral-700 cursor-pointer"
            onClick={goBack}
          >
            <IconArrowLeft size={14} />
          </button>

          <button
            type="button"
            className="p-2 rounded-full duration-300 hover:bg-neutral-700 cursor-pointer"
            onClick={goForward}
          >
            <IconArrowRight size={14} />
          </button>
        </div>
      </div>

      <CalendarMiniGrid
        year={year}
        monthNumber={monthNumber}
        monthName={monthName}
        selectedDate={selectedDate}
        onSelect={onSelectDate}
      />
    </aside>
  );
}
