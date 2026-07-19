type CreateData = {
  id: number;
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
  ticket: Ticket;
}

type UpdateData = {
  id: number;
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
  ticket: Ticket;
  index: number
}

type RequestData = {
  id: number;
  index: number;
  router: AppRouterInstance;
  snackbar: React.RefObject<null>;
}

import type { Ticket } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import {
  createTicketService,
  updateTicketService,
  getTicketService,
  deleteTicketService
} from "@/services/project/ticket.service";

export async function createTicket(data: CreateData) {
  const valid = await createTicketService(data);

  if (valid) return data.router.push(`/projects/${data.id}/tickets`);

  return;
}

export async function updateTicket(data: UpdateData) {
  const valid = await updateTicketService(data);

  if (valid) return data.router.push(`/projects/${data.id}/tickets`);

  return;
}

export async function getTicket(data: RequestData) {
  return await getTicketService(data);
}

export async function deleteTicket(data: RequestData) {
  const valid = await deleteTicketService(data);

  if (valid) return data.router.push(`/projects/${data.id}/tickets`);

  return;
}
