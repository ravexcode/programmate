export type ProviderConfig = {
  name: string;
  validateUrl: string;
  modelsUrl?: string;
  headers?: Record<string, string>;
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
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

  const headers: Record<string, string> = {
    "Authorization": `Bearer ${apiKey}`,
    ...provider.headers,
  };

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
    const validateRes = await fetch(validateUrl, {
      method: provider.method || "GET",
      headers,
      body: provider.body ? JSON.stringify(provider.body) : undefined,
    });

    if (!validateRes.ok) {
      return {
        status: validateRes.status,
        message: `${provider.name} API key validation failed`,
        provider: provider.name,
      };
    }

    let models: string[] = [];
    
    if (modelsUrl) {
      const modelsRes = await fetch(modelsUrl, {
        method: "GET",
        headers,
      });
      
      if (modelsRes.ok) {
        const data = await modelsRes.json();
        
        if (provider.name === "Google AI") {
          models = data.models?.map((m: { name: string }) => m.name.replace("models/", "")) || [];
        } else if (provider.name === "Claude" || provider.name === "Claude Code") {
          models = data.data?.map((m: { id: string }) => m.id) || [];
        } else if (provider.name === "OpenAI" || provider.name === "Codex") {
          models = data.data?.map((m: { id: string }) => m.id) || [];
        } else if (provider.name === "Minimax") {
          models = data.data?.map((m: { id: string }) => m.id) || [];
        } else {
          models = data.models?.map((m: { name: string }) => m.name) || 
                   data.data?.map((m: { id: string }) => m.id) || [];
        }
      }
    }

    return {
      status: 200,
      message: `${provider.name} API key validated`,
      provider: provider.name,
      models,
    };
  } catch (error) {
    return {
      status: 500,
      message: error instanceof Error ? error.message : "Provider validation error",
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