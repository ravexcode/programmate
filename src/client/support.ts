import { apiFetch } from "@/utils/http";

export async function submitSuggestionRequest(data: {
  title: string;
  description: string;
  email: string;
}) {
  return apiFetch("/api/support/suggestions", {
    method: "POST",
    body: data,
  });
}

export async function submitBugRequest(data: {
  title: string;
  description: string;
  steps: string;
  version: string;
  email: string;
  screenshot_url: string;
  error_date: string;
}) {
  return apiFetch("/api/support/bugs", {
    method: "POST",
    body: data,
  });
}
