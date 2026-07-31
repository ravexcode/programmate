import { apiFetch } from "@/utils/http";
import type { Ticket } from "@/types/team.types";

export async function createTicketRequest(
  token: string,
  data: { id: number; ticket: Ticket }
) {
  return apiFetch(`/api/teams/${data.id}/tickets`, {
    method: "POST",
    token,
    body: {
      ...data.ticket,
      teamId: data.id,
    },
  });
}

export async function updateTicketRequest(
  token: string,
  data: { id: number; index: number; ticket: Ticket }
) {
  return apiFetch(`/api/teams/${data.id}/tickets`, {
    method: "PUT",
    token,
    body: {
      ...data.ticket,
      index: data.index,
      teamId: data.id,
    },
  });
}

export async function getTicketRequest(
  token: string,
  teamId: number,
  index?: number
) {
  return apiFetch(`/api/teams/${teamId}/tickets/${index}`, {
    method: "GET",
    token,
  });
}

export async function deleteTicketRequest(
  token: string,
  teamId: number,
  index?: number
) {
  return apiFetch(`/api/teams/${teamId}/tickets/${index}`, {
    method: "DELETE",
    token,
  });
}
