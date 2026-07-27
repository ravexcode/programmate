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
  "other"
];

export type ProviderName = keyof typeof providers;

export function getURL(provider: ProviderName): string {
  return providers[provider].url;
}