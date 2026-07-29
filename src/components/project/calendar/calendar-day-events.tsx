"use client";

import { useMemo } from "react";
import CalendarEventCard from "./calendar-event-card";

import { IconCalendarPlus } from "@tabler/icons-react";

import type { CalendarDate } from "@/types/team.types";
import type { Months } from "./calendar";

type Props = {
  events: CalendarDate[];
  selectedDate: Date;
  monthName: Months;
  onEdit: (event: CalendarDate, index: number) => void;
  onDelete: (event: CalendarDate, index: number) => void;
  onOpenCreator: () => void;
};

export default function CalendarDayEvents({
  events,
  selectedDate,
  monthName,
  onEdit,
  onDelete,
  onOpenCreator,
}: Props) {
  const filtered = useMemo(
    () =>
      events.filter((e) => {
        const d = new Date(e.date);
        return (
          d.getMonth() === selectedDate.getMonth() &&
          d.getDate() === selectedDate.getDate() &&
          d.getFullYear() === selectedDate.getFullYear()
        );
      }),
    [events, selectedDate],
  );

  const dayStr = `${monthName} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;

  return (
    <main className="w-full flex flex-col h-full p-5 px-10 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <p className="text-3xl tracking-wide font-medium">{dayStr}</p>
        <button
          type="button"
          onClick={onOpenCreator}
          className="flex items-center gap-2 px-4 py-2 rounded-sm bg-main/20 border border-main/30 text-sm font-medium hover:bg-main/30 duration-300 cursor-pointer"
        >
          <IconCalendarPlus size={16} />
          Add event
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800">
            <IconCalendarPlus size={28} className="text-neutral-500" />
          </div>
          <div className="text-center">
            <p className="text-lg text-neutral-400">No events for this day</p>
            <p className="text-sm text-neutral-600 mt-1">
              Click &quot;Add event&quot; to create one
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((calEvent) => {
            const realIndex = events.indexOf(calEvent);
            return (
              <CalendarEventCard
                key={`event-${realIndex}`}
                event={calEvent}
                index={realIndex}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
