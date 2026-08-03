"use client";

//React imports
import { useState } from "react";

//Hooks imports
import { IconChevronLeft, IconChevronRight, IconPlus, IconX } from "@tabler/icons-react";

const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const today = new Date();
const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

function dateKey(year: number, month: number, day: number) {
  return `${year}-${month}-${day}`;
}

export default function CalendarShowcase() {
  const [ viewYear, setViewYear ] = useState(today.getFullYear());
  const [ viewMonth, setViewMonth ] = useState(today.getMonth());
  const [ selected, setSelected ] = useState(todayKey);
  const [ events, setEvents ] = useState<Record<string, string[]>>({
    [todayKey]: ["Sprint planning", "Design review"],
  });
  const [ draft, setDraft ] = useState("");

  const firstDay = new Date(viewYear, viewMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, i) => i - startOffset + 1);

  const selectedLabel = (() => {
    const [year, month, day] = selected.split("-").map(Number);
    const name = new Date(year, month, day).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    return name;
  })();

  const addEvent = () => {
    if(!draft.trim()) return;

    setEvents((prev) => ({
      ...prev,
      [selected]: [...(prev[selected] ?? []), draft.trim()],
    }));
    setDraft("");
  };

  const deleteEvent = (title: string) => {
    setEvents((prev) => ({
      ...prev,
      [selected]: (prev[selected] ?? []).filter((event) => event !== title),
    }));
  };

  return (
    <div
    className="w-full aspect-video rounded-md border border-neutral-800 bg-neutral-950 p-5 flex flex-col overflow-hidden">
      <div
      className="flex justify-between items-center">
        <p
        className="text-sm font-medium tracking-wide">
          Team calendar <span className="text-main">events</span>
        </p>

        <div
        className="flex items-center gap-2 text-sm">
          <button
          type="button"
          onClick={() => {
            const newMonth = viewMonth - 1;
            if(newMonth < 0) { setViewMonth(11); setViewYear((year) => year - 1); }
            else setViewMonth(newMonth);
          }}
          className="rounded-sm bg-neutral-800 p-1 text-neutral-400 duration-300 hover:bg-neutral-700 hover:text-white">
            <IconChevronLeft
            size={14}
            stroke={2} />
          </button>

          <p
          className="w-32 text-center text-sm font-medium">
            {new Date(viewYear, viewMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>

          <button
          type="button"
          onClick={() => {
            const newMonth = viewMonth + 1;
            if(newMonth > 11) { setViewMonth(0); setViewYear((year) => year + 1); }
            else setViewMonth(newMonth);
          }}
          className="rounded-sm bg-neutral-800 p-1 text-neutral-400 duration-300 hover:bg-neutral-700 hover:text-white">
            <IconChevronRight
            size={14}
            stroke={2} />
          </button>
        </div>
      </div>

      <div
      className="mt-3 grid grid-cols-7 gap-1">
        {
          weekDays.map((day) => (
            <p
            key={day}
            className="text-center text-[10px] font-medium text-text/40">
              {day}
            </p>
          ))
        }

        {
          cells.map((day, index) => {
            const valid = day >= 1 && day <= daysInMonth;
            const key = valid ? dateKey(viewYear, viewMonth, day) : null;
            const hasEvents = key ? Boolean(events[key]?.length) : false;
            const isSelected = key === selected;

            return (
              <button
              key={index}
              type="button"
              disabled={!valid}
              onClick={() => key && setSelected(key)}
              className={"h-7 rounded-sm text-[11px] duration-200 disabled:opacity-0 " + (isSelected ? "bg-main text-white font-bold" : "text-text/70 hover:bg-neutral-800 " + (hasEvents && "border border-main/50"))}>
                {day}
              </button>
            );
          })
        }
      </div>

      <div
      className="mt-3 rounded-md bg-neutral-900 border border-neutral-800 p-3">
        <p
        className="text-xs font-medium text-main">
          {selectedLabel}
        </p>

        <div
        className="mt-2 flex flex-col sm:flex-row gap-2">
          <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addEvent()}
          placeholder="Event title..."
          className="w-full rounded-sm bg-neutral-950 border border-neutral-800 px-3 py-1 text-xs outline-none focus:border-main" />
          <button
          type="button"
          onClick={addEvent}
          className="flex items-center justify-center gap-1 w-full sm:w-auto rounded-sm bg-main px-3 py-1 text-xs duration-300 hover:brightness-80">
            <IconPlus
            size={12}
            stroke={2.5} />
            Add
          </button>
        </div>

        <div
        className="mt-2 flex flex-col gap-1">
          {
            (events[selected] ?? []).map((event) => (
              <div
              key={event}
              className="group flex items-center justify-between rounded-sm bg-neutral-950 border border-neutral-800 px-2.5 py-1.5 text-xs">
                {event}
                <button
                type="button"
                onClick={() => deleteEvent(event)}
                className="text-neutral-500 opacity-0 group-hover:opacity-100 duration-300 hover:text-red-400">
                  <IconX
                  size={12}
                  stroke={2} />
                </button>
              </div>
            ))
          }

          {
            !(events[selected] ?? []).length && (
              <p
              className="text-xs text-text/40">
                No events for this day
              </p>
            )
          }
        </div>
      </div>
    </div>
  )
}
