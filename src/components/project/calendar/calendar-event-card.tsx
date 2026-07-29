"use client";

import Image from "next/image";
import {
  IconEdit,
  IconTrash,
  IconUserCircle,
} from "@tabler/icons-react";

import HazardButton from "@/components/ui/buttons/hazard";

import type { CalendarDate } from "@/types/team.types";

type Props = {
  event: CalendarDate;
  index: number;
  onEdit: (event: CalendarDate, index: number) => void;
  onDelete: (event: CalendarDate, index: number) => void;
};

const TYPE_LABELS: Record<string, string> = {
  deadline: "Deadline",
  meeting: "Meeting",
  request: "Request",
  "online-meeting": "Online Meeting",
  "target-start": "Target Start",
};

export default function CalendarEventCard({
  event,
  index,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className="w-full rounded-sm bg-neutral-950 border border-neutral-800 p-4 animate-fade-in-down animate-duration-200 hover:border-neutral-700 duration-300">
      <div className="w-full flex gap-3 items-start">
        <div
          className="w-1 h-12 rounded-full shrink-0 mt-0.5"
          style={{ backgroundColor: event.color }}
        />

        <div className="flex flex-col w-full gap-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium tracking-wide text-start">
              {event.title}
            </p>

            <span
              className="text-xs px-2 py-0.5 rounded-sm shrink-0"
              style={{
                backgroundColor: `${event.color}20`,
                color: event.color,
                borderColor: `${event.color}40`,
              }}
            >
              {TYPE_LABELS[event.type] ?? event.type}
            </span>
          </div>

          {event.description && (
            <p className="text-sm text-start opacity-70 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>

      <div className="w-full flex items-center justify-between mt-3 pt-3 border-t border-neutral-800">
        <div className="flex items-center gap-2">
          {event.creator.avatar_url ? (
            <Image
              src={event.creator.avatar_url}
              alt={`${event.creator.username} profile picture`}
              width={24}
              height={24}
              className="rounded-full aspect-square w-6 h-6 object-cover"
            />
          ) : (
            <IconUserCircle size={24} className="text-neutral-500" />
          )}

          <span className="text-sm opacity-70">
            {event.creator.username}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(event, index)}
            className="p-1.5 rounded-sm bg-neutral-800 hover:bg-neutral-700 duration-300 cursor-pointer text-neutral-400 hover:text-text"
          >
            <IconEdit size={14} />
          </button>

          <HazardButton size="p-1.5" action={() => onDelete(event, index)}>
            <IconTrash size={14} />
          </HazardButton>
        </div>
      </div>
    </section>
  );
}
