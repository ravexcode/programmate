import { apiFetch } from "@/utils/http";

export async function createEventRequest(
  token: string,
  id: number,
  content: unknown
) {
  return apiFetch(`/api/teams/${id}/calendar`, {
    method: "POST",
    token,
    body: {
      event: content,
    },
  });
}

export async function updateEventRequest(
  token: string,
  id: number,
  index: number,
  content: unknown
) {
  return apiFetch(`/api/teams/${id}/calendar`, {
    method: "PUT",
    token,
    body: {
      event: content,
      eventIndex: index,
    },
  });
}

export async function deleteEventRequest(
  token: string,
  id: number,
  index: number
) {
  return apiFetch(`/api/teams/${id}/calendar`, {
    method: "DELETE",
    token,
    body: {
      eventIndex: index,
    },
  });
}
