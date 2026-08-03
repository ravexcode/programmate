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

import {
  createTicketController,
  updateTicketController,
  getTicketController,
  deleteTicketController
} from "@/controllers/project/ticket.controller";

import { showSnackbar } from "@/components/ui/snackbar";

import checkStatus from "@/utils/check-status";

import {
  getSessionStr,
  logOut
} from "../session.service";

import type { Ticket } from "@/types/team.types";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function createTicketService(data: CreateData) {
  const token = getSessionStr();
  const router = data.router;

  if (!token) return logOut(router);

  const response = await createTicketController({
    id: data.id,
    token,
    ticket: data.ticket
  });

  showSnackbar(
    response.message,
    checkStatus(response.status),
    data.snackbar
  );

  if (response.status <= 205) return null;

  return true;
}

export async function updateTicketService(data: UpdateData) {
  const token = getSessionStr();
  const router = data.router;

  if (!token) return logOut(router);

  const response = await updateTicketController({
    id: data.id,
    token,
    ticket: data.ticket,
    index: data.index
  });

  showSnackbar(
    response.message,
    checkStatus(response.status),
    data.snackbar
  );

  if (response.status <= 205) return null;

  return true;
}

export async function getTicketService(data: RequestData) {
  const token = getSessionStr();
  const router = data.router;

  if (!token) return logOut(router);

  const response = await getTicketController({
    teamId: data.id,
    index: data.index,
    token
  });

  if (response.status >= 205) {
    showSnackbar(
      response.message,
      checkStatus(response.status),
      data.snackbar
    );
    return null;
  }

  return response.data;
}

export async function deleteTicketService(data: RequestData) {
  const token = getSessionStr();
  const router = data.router;

  if (!token) return logOut(router);

  const response = await deleteTicketController({
    teamId: data.id,
    index: data.index,
    token
  });

  showSnackbar(
    response.message,
    checkStatus(response.status),
    data.snackbar
  );

  if (response.status <= 205) return null;

  return true;
}
