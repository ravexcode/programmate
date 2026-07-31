import { apiFetch } from "@/utils/http";

export async function captureRequest(token: string, plan: "pro" | "enterprise") {
  return apiFetch("/api/payments/capture", {
    method: "POST",
    token,
    body: {
      plan,
    },
  });
}
