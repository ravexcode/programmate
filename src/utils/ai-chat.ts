type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestInput = {
  provider: string;
  model: string;
  messages: ChatMessage[];
  apiKey?: string;
  url?: string;
};

type ChatRequest = {
  url: string;
  options: RequestInit;
};

/**
 * Builds the correct fetch URL + options for each provider's chat API.
 * Returns the request ready to execute.
 */
export function buildChatRequest(input: ChatRequestInput): ChatRequest | null {
  const { provider, model, messages, apiKey, url } = input;

  switch (provider) {
    case "ollama":
      return buildOllamaRequest(model, messages, url);

    case "openai":
    case "codex":
      return buildOpenAIRequest(model, messages, apiKey, "https://api.openai.com");

    case "minimax":
      return buildOpenAIRequest(model, messages, apiKey, "https://api.minimax.chat");

    case "claude":
    case "claude-code":
      return buildClaudeRequest(model, messages, apiKey);

    case "google":
      return buildGoogleRequest(model, messages, apiKey);

    case "other":
      if (!url) return null;
      return buildOpenAIRequest(model, messages, apiKey, url);

    default:
      return null;
  }
}

function buildOllamaRequest(
  model: string,
  messages: ChatMessage[],
  url?: string
): ChatRequest {
  const baseUrl = url?.replace(/\/+$/, "") || "http://localhost:11434";

  return {
    url: `${baseUrl}/api/chat`,
    options: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
    },
  };
}

function buildOpenAIRequest(
  model: string,
  messages: ChatMessage[],
  apiKey?: string,
  baseUrl: string = "https://api.openai.com"
): ChatRequest {
  return {
    url: `${baseUrl}/v1/chat/completions`,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    },
  };
}

function buildClaudeRequest(
  model: string,
  messages: ChatMessage[],
  apiKey?: string
): ChatRequest {
  return {
    url: "https://api.anthropic.com/v1/messages",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        messages,
      }),
    },
  };
}

function buildGoogleRequest(
  model: string,
  messages: ChatMessage[],
  apiKey?: string
): ChatRequest {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  return {
    url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    options: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    },
  };
}

/**
 * Parses the AI response content from each provider's response format.
 */
export function parseChatResponse(
  provider: string,
  data: unknown
): string | null {
  switch (provider) {
    case "ollama": {
      const res = data as { message?: { content?: string } };
      return res.message?.content ?? null;
    }

    case "openai":
    case "codex":
    case "minimax":
    case "other": {
      const res = data as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      return res.choices?.[0]?.message?.content ?? null;
    }

    case "claude":
    case "claude-code": {
      const res = data as {
        content?: Array<{ type?: string; text?: string }>;
      };
      return res.content?.[0]?.text ?? null;
    }

    case "google": {
      const res = data as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };
      return res.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
    }

    default:
      return null;
  }
}
