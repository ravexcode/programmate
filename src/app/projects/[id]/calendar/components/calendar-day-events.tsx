"use client";

import CalendarEventCard from "./calendar-event-card";

import type { CalendarDate } from "@/types/team.types";
import type { Months } from "../page";

type Props = {
  events: CalendarDate[];
  selectedDate: Date;
  monthName: Months;
  onDelete: (index: number) => void;
};

export default function CalendarDayEvents({
  events,
  selectedDate,
  monthName,
  onDelete,
}: Props) {
  const filtered = events.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getMonth() === selectedDate.getMonth() &&
      d.getDate() === selectedDate.getDate() &&
      d.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <main className="w-full flex flex-col h-full p-5 px-10 overflow-y-auto">
      <p className="text-3xl tracking-wide mb-6 font-medium">
        {monthName} {selectedDate.getDate()}, {selectedDate.getFullYear()}
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-40">
          <p className="text-lg">No events for this day</p>
        </div>
      ) : (
        filtered.map((calEvent) => {
          const realIndex = events.indexOf(calEvent);

          return (
            <CalendarEventCard
              key={`event-${realIndex}`}
              event={calEvent}
              index={realIndex}
              onDelete={onDelete}
            />
          );
        })
      )}
    </main>
  );
}
