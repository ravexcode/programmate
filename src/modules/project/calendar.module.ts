//Types
import type { CalendarDate } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

//Services
import { createEventService, updateEventService } from "@/services/project/calendar.service";
import Team from "@/types/team.types";

export async function createEvent(
  id: number,
  event: CalendarDate,
  snackbar: React.RefObject<null>,
  router: AppRouterInstance
) {
  const res = await createEventService({
    id,
    event,
    snackbar,
    router
  });

  return res;
}

export async function updateEvent(
  id: number,
  index: number,
  content: CalendarDate,
  snackbar: React.RefObject<null>,
  router: AppRouterInstance
) {
  const res = await updateEventService({
    id,
    index,
    content,
    snackbar,
    router,
  });

  return res;
}