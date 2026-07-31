import {
  createTicketRequest,
  updateTicketRequest,
  getTicketRequest,
  deleteTicketRequest,
} from "@/client/ticket";

import type { Ticket } from "@/types/team.types";

type CreateData = {
  token: string;
  ticket: Ticket;
  id: number;
}

type UpdateData = {
  token: string;
  ticket: Ticket;
  id: number;
  index: number;
}

type RequestData = {
  token: string;
  teamId: number;
  index?: number;
}

export async function createTicketController(data: CreateData) {
  const req = await createTicketRequest(data.token, {
    id: data.id,
    ticket: data.ticket,
  });

  return {
    message: req.data.message,
    status: req.status,
    data: req.data.data || req.data
  }
}

export async function updateTicketController(data: UpdateData) {
  const req = await updateTicketRequest(data.token, {
    id: data.id,
    index: data.index,
    ticket: data.ticket,
  });

  return {
    message: req.data.message,
    status: req.status,
    data: req.data.data || req.data
  }
}

export async function getTicketController(data: RequestData) {
  const req = await getTicketRequest(data.token, data.teamId, data.index);

  return {
    message: req.data.message,
    status: req.status,
    data: req.data.data || req.data
  }
}

export async function deleteTicketController(data: RequestData) {
  const req = await deleteTicketRequest(data.token, data.teamId, data.index);

  return {
    message: req.data.message,
    status: req.status,
    data: req.data.data || req.data
  }
}
