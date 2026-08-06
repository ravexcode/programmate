export const providers = {
  google: {
    name: "Google AI",
    url: "https://generativelanguage.googleapis.com/v1beta/models",
  },
  claude: {
    name: "Claude",
    url: "https://api.anthropic.com/v1/models",
  },
  openai: {
    name: "OpenAI",
    url: "https://api.openai.com/v1/models",
  },
  codex: {
    name: "Codex",
    url: "https://api.openai.com/v1/models",
  },
  minimax: {
    name: "Minimax",
    url: "https://api.minimax.chat/v1/models",
  },
  "claude-code": {
    name: "Claude Code",
    url: "https://api.anthropic.com/v1/models",
  },
  ollama: {
    name: "Ollama",
    url: "http://localhost:11434/api/tags",
  },
  groq: {
    name: "Groq",
    url: "https://api.groq.com/openai/v1/models",
  },
  mistral: {
    name: "Mistral",
    url: "https://api.mistral.ai/v1/models",
  },
  deepseek: {
    name: "DeepSeek",
    url: "https://api.deepseek.com/models",
  },
  xai: {
    name: "xAI (Grok)",
    url: "https://api.x.ai/v1/models",
  },
  openrouter: {
    name: "OpenRouter",
    url: "https://openrouter.ai/api/v1/models",
  },
  together: {
    name: "Together AI",
    url: "https://api.together.xyz/v1/models",
  },
  fireworks: {
    name: "Fireworks",
    url: "https://api.fireworks.ai/inference/v1/models",
  },
  perplexity: {
    name: "Perplexity",
    url: "https://api.perplexity.ai/v1/models",
  },
  cohere: {
    name: "Cohere",
    url: "https://api.cohere.com/v2/models",
  },
  huggingface: {
    name: "Hugging Face",
    url: "https://router.huggingface.co/v1/models",
  },
  other: {
    name: "Other (OpenAI-compatible)",
    url: "",
  },
};

export const providersArray = [
  "google",
  "claude",
  "openai",
  "codex",
  "minimax",
  "claude-code",
  "ollama",
  "groq",
  "mistral",
  "deepseek",
  "xai",
  "together",
  "fireworks",
  "perplexity",
  "cohere",
  "huggingface",
  "other"
];

export type ProviderName = keyof typeof providers;

export function getURL(provider: ProviderName): string {
  return providers[provider].url;
}