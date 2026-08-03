import { getSessionStr, logOut } from "../session.service";

import { showSnackbar } from "@/components/ui/snackbar";

import checkStatus from "@/utils/check-status";

import {
  createEventController,
  updateEventController,
  deleteEventController
} from "@/controllers/project/calendar.controller";

import type { CalendarDate } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type EventData = {
  id: number;
  event: CalendarDate;
  snackbar: React.RefObject<null>;
  router: AppRouterInstance;
};

type UpdateData = {
  id: number;
  index: number;
  content: CalendarDate;
  snackbar: React.RefObject<null>;
  router: AppRouterInstance;
};

type DeleteData = {
  id: number;
  index: number;
  snackbar: React.RefObject<null>;
  router: AppRouterInstance;
};

function handleToken(router: AppRouterInstance) {
  const token = getSessionStr();

  if (!token) {
    logOut(router);
    return null;
  }

  return token;
}

export async function createEventService(data: EventData) {
  const token = handleToken(data.router);
  if (!token) return false;

  const response = await createEventController({
    id: data.id,
    content: data.event,
    token
  });

  showSnackbar(response.message, checkStatus(response.status), data.snackbar);

  return response.status < 205;
}

export async function updateEventService(data: UpdateData) {
  const token = handleToken(data.router);
  if (!token) return false;

  const response = await updateEventController({
    id: data.id,
    index: data.index,
    content: data.content,
    token
  });

  showSnackbar(response.message, checkStatus(response.status), data.snackbar);

  return response.status < 205;
}

export async function deleteEventService(data: DeleteData) {
  const token = handleToken(data.router);
  if (!token) return false;

  const response = await deleteEventController({
    id: data.id,
    index: data.index,
    token
  });

  showSnackbar(response.message, checkStatus(response.status), data.snackbar);

  return response.status < 205;
}
