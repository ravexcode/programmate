import { apiFetch } from "@/utils/http";

export async function createSessionRequest(
  token: string,
  data: {
    title: string;
    provider: string;
    model: string;
  }
) {
  return apiFetch("/api/ai/sessions", {
    method: "POST",
    token,
    body: data,
  });
}

export async function listSessionsRequest(token: string) {
  return apiFetch("/api/ai/sessions", {
    method: "GET",
    token,
  });
}

export async function getSessionRequest(token: string, sessionId: string) {
  return apiFetch(`/api/ai/sessions/${sessionId}`, {
    method: "GET",
    token,
  });
}

export async function deleteSessionRequest(token: string, sessionId: string) {
  return apiFetch(`/api/ai/sessions/${sessionId}`, {
    method: "DELETE",
    token,
  });
}

export async function addMessageRequest(
  token: string,
  sessionId: string,
  data: {
    sent_by: "user" | "assistant";
    content: string;
  }
) {
  return apiFetch(`/api/ai/sessions/${sessionId}/messages`, {
    method: "POST",
    token,
    body: data,
  });
}
