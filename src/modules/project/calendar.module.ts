//Types
import type { CalendarDate } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

//Services
import {
  createEventService,
  updateEventService,
  deleteEventService
} from "@/services/project/calendar.service";

export async function createEvent(
  id: number,
  event: CalendarDate,
  snackbar: React.RefObject<null>,
  router: AppRouterInstance
) {
  return await createEventService({ id, event, snackbar, router });
}

export async function updateEvent(
  id: number,
  index: number,
  content: CalendarDate,
  snackbar: React.RefObject<null>,
  router: AppRouterInstance
) {
  return await updateEventService({ id, index, content, snackbar, router });
}

export async function deleteEvent(
  id: number,
  index: number,
  snackbar: React.RefObject<null>,
  router: AppRouterInstance
) {
  return await deleteEventService({ id, index, snackbar, router });
}
