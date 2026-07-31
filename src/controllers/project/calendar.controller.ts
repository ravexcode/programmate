//Types
import type { CalendarDate } from "@/types/team.types";

//Client
import {
  createEventRequest,
  updateEventRequest,
  deleteEventRequest,
} from "@/client/calendar";

type UploadData = {
  id: number;
  content: CalendarDate;
  token: string;
}

type UpdateData = {
  id: number;
  index: number;
  content: CalendarDate;
  token: string;
}

type DeleteData = {
  id: number;
  index: number;
  token: string;
}

export async function createEventController(data: UploadData) {
  const req = await createEventRequest(data.token, data.id, data.content);

  return {
    message: req.data.message,
    status: req.data.status
  }
}

export async function updateEventController(data: UpdateData) {
  const req = await updateEventRequest(data.token, data.id, data.index, data.content);

  return {
    message: req.data.message,
    status: req.data.status
  }
}

export async function deleteEventController(data: DeleteData) {
  const req = await deleteEventRequest(data.token, data.id, data.index);

  return {
    message: req.data.message,
    status: req.data.status
  }
}
