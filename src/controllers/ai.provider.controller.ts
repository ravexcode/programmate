import { validateProviderRequest, listProviderModelsRequest } from "@/client/ai-provider";

export type ProviderConfig = {
  name: string;
  validateUrl: string;
  modelsUrl?: string;
  headers?: Record<string, string>;
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
  requiresApiKey?: boolean;
  requiresCustomUrl?: boolean;
};

const PROVIDERS: Record<string, ProviderConfig> = {
  google: {
    name: "Google AI",
    validateUrl: "https://generativelanguage.googleapis.com/v1beta/models",
    modelsUrl: "https://generativelanguage.googleapis.com/v1beta/models",
    method: "GET",
  },
  claude: {
    name: "Claude",
    validateUrl: "https://api.anthropic.com/v1/messages",
    modelsUrl: "https://api.anthropic.com/v1/models",
    headers: {
      "Anthropic-Version": "2023-06-01",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: {
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1,
      messages: [{ role: "user", content: "Ping" }],
    },
  },
  openai: {
    name: "OpenAI",
    validateUrl: "https://api.openai.com/v1/models",
    modelsUrl: "https://api.openai.com/v1/models",
    method: "GET",
  },
  codex: {
    name: "Codex",
    validateUrl: "https://api.openai.com/v1/models",
    modelsUrl: "https://api.openai.com/v1/models",
    method: "GET",
  },
  minimax: {
    name: "Minimax",
    validateUrl: "https://api.minimax.chat/v1/models",
    modelsUrl: "https://api.minimax.chat/v1/models",
    method: "GET",
  },
  "claude-code": {
    name: "Claude Code",
    validateUrl: "https://api.anthropic.com/v1/messages",
    modelsUrl: "https://api.anthropic.com/v1/models",
    headers: {
      "Anthropic-Version": "2023-06-01",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: {
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1,
      messages: [{ role: "user", content: "Ping" }],
    },
  },
  ollama: {
    name: "Ollama",
    validateUrl: "http://localhost:11434/api/tags",
    modelsUrl: "http://localhost:11434/api/tags",
    method: "GET",
    requiresApiKey: false,
    requiresCustomUrl: true,
  },
  groq: {
    name: "Groq",
    validateUrl: "https://api.groq.com/openai/v1/models",
    modelsUrl: "https://api.groq.com/openai/v1/models",
    method: "GET",
  },
  mistral: {
    name: "Mistral",
    validateUrl: "https://api.mistral.ai/v1/models",
    modelsUrl: "https://api.mistral.ai/v1/models",
    method: "GET",
  },
  deepseek: {
    name: "DeepSeek",
    validateUrl: "https://api.deepseek.com/models",
    modelsUrl: "https://api.deepseek.com/models",
    method: "GET",
  },
  xai: {
    name: "xAI (Grok)",
    validateUrl: "https://api.x.ai/v1/models",
    modelsUrl: "https://api.x.ai/v1/models",
    method: "GET",
  },
  together: {
    name: "Together AI",
    validateUrl: "https://api.together.xyz/v1/models",
    modelsUrl: "https://api.together.xyz/v1/models",
    method: "GET",
  },
  fireworks: {
    name: "Fireworks",
    validateUrl: "https://api.fireworks.ai/inference/v1/models",
    modelsUrl: "https://api.fireworks.ai/inference/v1/models",
    method: "GET",
  },
  perplexity: {
    name: "Perplexity",
    validateUrl: "https://api.perplexity.ai/v1/models",
    modelsUrl: "https://api.perplexity.ai/v1/models",
    method: "GET",
  },
  cohere: {
    name: "Cohere",
    validateUrl: "https://api.cohere.com/v2/models",
    modelsUrl: "https://api.cohere.com/v2/models",
    method: "GET",
  },
  huggingface: {
    name: "Hugging Face",
    validateUrl: "https://router.huggingface.co/v1/models",
    modelsUrl: "https://router.huggingface.co/v1/models",
    method: "GET",
  },
  other: {
    name: "Other (OpenAI-compatible)",
    validateUrl: "",
    modelsUrl: "",
    method: "GET",
    requiresApiKey: false,
    requiresCustomUrl: true,
  },
};

export async function validateProviderController(
  providerName: string,
  apiKey: string,
  customUrl?: string
): Promise<{
  status: number;
  message: string;
  provider?: string;
  models?: string[];
  url?: string;
}> {
  const provider = PROVIDERS[providerName.toLowerCase()];
  
  if (!provider) {
    return {
      status: 404,
      message: `Provider '${providerName}' not found`,
      provider: providerName,
      url: customUrl,
    };
  }

  if (provider.requiresCustomUrl && !customUrl) {
    return {
      status: 400,
      message: `Custom URL is required for ${provider.name}`,
      provider: provider.name,
    };
  }

  const needsAuth = provider.requiresApiKey !== false;

  const headers: Record<string, string> = {
    ...provider.headers,
  };

  if (needsAuth) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  if (provider.name === "Google AI") {
    headers["X-Goog-Api-Key"] = apiKey;
    delete headers["Authorization"];
  }

  if (provider.name === "Minimax") {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const validateUrl = customUrl || provider.validateUrl;
  const modelsUrl = provider.modelsUrl;

  try {
    const validateRes = await validateProviderRequest(
      validateUrl,
      provider.method || "GET",
      headers,
      provider.body ? JSON.stringify(provider.body) : undefined
    );

    if (!validateRes.ok) {
      return {
        status: validateRes.status,
        message: needsAuth
          ? `${provider.name} API key validation failed`
          : `Failed to connect to ${provider.name}`,
        provider: provider.name,
      };
    }

    let models: string[] = [];
    
    if (modelsUrl) {
      const resolvedModelsUrl = customUrl
        ? `${customUrl.replace(/\/+$/, "")}${new URL(provider.modelsUrl!).pathname}`
        : modelsUrl;

      const modelsRes = await listProviderModelsRequest(resolvedModelsUrl, headers);
      
      if (modelsRes.ok) {
        const data = await modelsRes.json();
        
        if (provider.name === "Google AI") {
          models = data.models?.map((m: { name: string }) => m.name.replace("models/", "")) || [];
        } else if (Array.isArray(data.data)) {
          models = data.data
            .map((m: { id?: string }) => m.id)
            .filter((id: string | undefined): id is string => Boolean(id));
        } else if (Array.isArray(data.models)) {
          models = data.models
            .map((m: string | { name?: string; id?: string }) =>
              typeof m === "string" ? m : (m.name ?? m.id)
            )
            .filter((id: string | undefined): id is string => Boolean(id));
        }
      }
    }

    return {
      status: 200,
      message: needsAuth
        ? `${provider.name} API key validated`
        : `${provider.name} connected successfully`,
      provider: provider.name,
      models,
      url: customUrl,
    };
  } catch (error) {
    return {
      status: 500,
      message: error instanceof Error ? error.message : `Failed to connect to ${provider.name}`,
      provider: provider.name,
    };
  }
}

export async function listProvidersController(): Promise<{
  status: number;
  providers: Array<{ name: string; key: string }>;
}> {
  return {
    status: 200,
    providers: Object.entries(PROVIDERS).map(([key, config]) => ({
      key,
      name: config.name,
    })),
  };
}
