"use client";

import Image from "next/image";
import { IconCircleFilled, IconUserCircle, IconTrash } from "@tabler/icons-react";
import HazardButton from "@/components/ui/buttons/hazard";

import type { CalendarDate } from "@/types/team.types";

type Props = {
  event: CalendarDate;
  index: number;
  onDelete: (index: number) => void;
};

const TYPE_LABELS: Record<string, string> = {
  deadline: "Deadline",
  meeting: "Meeting",
  request: "Request",
  "online-meeting": "Online Meeting",
  "target-start": "Target Start",
};

export default function CalendarEventCard({ event, index, onDelete }: Props) {
  return (
    <section className="w-full rounded-sm bg-neutral-900 border border-neutral-800 p-4 my-2 animate-fade-in-down animate-duration-200">
      <div className="w-full flex gap-3 items-start">
        <IconCircleFilled
          size={14}
          color={event.color}
          className="mt-1 shrink-0"
        />

        <div className="flex flex-col w-full gap-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium tracking-wide text-start">
              {event.title}
            </p>

            <span className="text-xs px-2 py-0.5 rounded-sm bg-neutral-800 text-neutral-400 shrink-0">
              {TYPE_LABELS[event.type] ?? event.type}
            </span>
          </div>

          {event.description && (
            <p className="text-sm text-start opacity-70">
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

        <HazardButton
          size="p-1.5"
          action={() => onDelete(index)}
        >
          <IconTrash size={14} />
        </HazardButton>
      </div>
    </section>
  );
}
