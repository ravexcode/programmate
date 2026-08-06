import { apiFetch } from "@/utils/http";

import type { AiProjectSpec } from "@/types/ai-project.types";

export type AiBuildMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function generateProjectSpecRequest(
  token: string,
  data: {
    provider: string;
    model: string;
    messages: AiBuildMessage[];
  }
) {
  return apiFetch("/api/ai/build-project/generate", {
    method: "POST",
    token,
    body: data,
  });
}

export async function commitProjectSpecRequest(
  token: string,
  spec: AiProjectSpec
) {
  return apiFetch("/api/ai/build-project/commit", {
    method: "POST",
    token,
    body: { spec },
  });
}
