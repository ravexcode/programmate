import animationClose from "@/utils/animation-close";

import type { RefObject } from "react";
import type { Status } from "@/types/team.types";

//-------- Project status --------
export const STATUS_OPTIONS: Array<{ value: Status; label: string; color: string }> = [
  { value: "Backlog", label: "Backlog", color: "bg-zinc-500" },
  { value: "Planning", label: "Planning", color: "bg-blue-400" },
  { value: "In progress", label: "In progress", color: "bg-orange-400" },
  { value: "On Hold", label: "On Hold", color: "bg-red-400" },
  { value: "Done", label: "Done", color: "bg-purple-500" },
];

export function getStatusColor(status: Status | undefined) {
  return (
    STATUS_OPTIONS.find((option) => option.value === status)?.color ?? "bg-zinc-500"
  );
}

//-------- Text helpers --------
export function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + "..." : text;
}

//-------- Overlay toggler (modal / warn card) --------
export function toggleOverlay(ref: RefObject<null>) {
  if(!ref.current) return;

  const element: HTMLElement = ref.current;

  if(element.classList.contains("hidden")) {
    element.classList.remove("animate-fade-out-down");
    element.classList.replace("hidden", "flex");
    return;
  }

  element.classList.add("animate-fade-out-down");
  animationClose(element, "fade-out-down", "hidden", "flex");
}
