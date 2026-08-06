import { apiFetch } from "@/utils/http";

//-------- AI transport --------

export async function sendChatRequest(
  url: string,
  options: RequestInit
) {
  return fetch(url, options);
}

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function openRouterChatRequest(
  token: string,
  model: string,
  messages: ChatMessage[]
) {
  return apiFetch("/api/ai/openrouter/chat", {
    method: "POST",
    token,
    body: { model, messages },
  });
}
