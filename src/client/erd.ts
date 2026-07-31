import { apiFetch } from "@/utils/http";

export async function saveERDRequest(
  token: string,
  payload: unknown
) {
  return apiFetch(`/api/teams/${(payload as { teamId: string | number }).teamId}/erd`, {
    method: "POST",
    token,
    body: payload,
  });
}
