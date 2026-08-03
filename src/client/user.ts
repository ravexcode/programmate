import { apiFetch } from "@/utils/http";

export async function fetchProfileRequest(token: string) {
  return apiFetch("/api/users/me", {
    method: "GET",
    token,
  });
}

export async function updateUserRequest(
  token: string,
  updatable: {
    name: string;
    avatar_url: string;
  }
) {
  return apiFetch("/api/users/update", {
    method: "PUT",
    token,
    body: updatable,
  });
}

export async function updateAiProvidersRequest(
  token: string,
  ai_providers: Array<{
    name: string;
    api_key: string;
    models: string[];
    url?: string;
  }>
) {
  return apiFetch("/api/users/update", {
    method: "POST",
    token,
    body: { ai: ai_providers },
  });
}

export async function fetchPublicProfileRequest(id: string | number) {
  return apiFetch(`/api/users/${id}`, {
    method: "GET",
  });
}

export async function searchUsersRequest(query: string) {
  return apiFetch(`/api/users/search/${query}`, {
    method: "GET",
  });
}
