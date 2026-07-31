import { apiFetch } from "@/utils/http";

export async function signInRequest(credentials: {
  email: string;
  password: string;
}) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export async function signUpRequest(credentials: {
  email: string;
  name: string;
  password: string;
}) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: credentials,
  });
}

export async function oauthRedirectRequest(provider: string) {
  return apiFetch(`/api/auth/${provider.toLowerCase()}`, {
    method: "GET",
  });
}
