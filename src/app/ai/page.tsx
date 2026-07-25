"use client";

//Next imports
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

//React imports
import { useState, useEffect, useRef, useCallback } from "react";

//Prebuilt UI imports
import LoadingScreen from "@/components/screens/loading-screen";
import SnackBar from "@/components/ui/snackbar";
import AltButton from "@/components/ui/buttons/alternate";
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";
import OptionsInput from "@/components/forms/options-input";
import Models from "@/components/ui/ai/models";

//Modules imports
import { validateProvider } from "@/modules/ai.provider.module";
import { getUser, updateAiProviders } from "@/modules/user.module";

//Types imports
import { UserData, Provider } from "@/types/user.types";

//Icons imports
import {
  IconArrowLeft,
  IconChevronDown,
  IconSettings,
  IconSend,
  IconSparkles,
  IconUserCircle,
  IconCloudOff
} from "@tabler/icons-react";
import MainButton from "@/components/ui/buttons/main";

type ProviderOption = {
  key: string;
  name: string;
  requiresApiKey: boolean;
  requiresCustomUrl: boolean;
};

const PROVIDERS: ProviderOption[] = [
  { key: "google", name: "Google AI", requiresApiKey: true, requiresCustomUrl: false },
  { key: "claude", name: "Claude", requiresApiKey: true, requiresCustomUrl: false },
  { key: "openai", name: "OpenAI", requiresApiKey: true, requiresCustomUrl: false },
  { key: "codex", name: "Codex", requiresApiKey: true, requiresCustomUrl: false },
  { key: "minimax", name: "Minimax", requiresApiKey: true, requiresCustomUrl: false },
  { key: "claude-code", name: "Claude Code", requiresApiKey: true, requiresCustomUrl: false },
  { key: "ollama", name: "Ollama", requiresApiKey: false, requiresCustomUrl: true },
  { key: "other", name: "Other (OpenAI-compatible)", requiresApiKey: false, requiresCustomUrl: true },
];

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function AgentsPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingProvider, setIsLoadingProvider] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [showProviderForm, setShowProviderForm] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [apiKey, setApiKey] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [connectedUrl, setConnectedUrl] = useState("");

  const [savedProviders, setSavedProviders] = useState<Provider[]>([]);

  const selectedProviderConfig = PROVIDERS.find((p) => p.key === provider);

  const snackbar = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function get() {
      const data = await getUser(router);

      if(!data) return router.push("/dashboard");

      console.warn(data);
      
      setUser(data);
      setSavedProviders(data.ai || []);
    }

    get();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleProviderSubmit = useCallback(
    async (e: React.SubmitEvent) => {
      e.preventDefault();

      if (!provider) return;

      const needsKey = selectedProviderConfig?.requiresApiKey !== false;
      const keyValue = needsKey ? apiKey : "";

      setIsLoadingProvider(true);

      const result = await validateProvider(
        provider,
        keyValue,
        customUrl || undefined,
        snackbar
      );

      setIsLoadingProvider(false);

      if (result.success && result.models) {
        const providerName = result.provider || provider;

        const newProvider: Provider = {
          name: providerName,
          api_key: keyValue,
          models: result.models,
          url: result.url || "",
        };

        const updated = [
          ...savedProviders.filter((p) => p.name !== providerName),
          newProvider,
        ];

        setSavedProviders(updated);
        setProvider(providerName);
        setAvailableModels(result.models);
        setConnectedUrl(result.url || "");
        setShowProviderForm(false);
        setApiKey("");
        setCustomUrl("");

        if (user) {
          setUser({ ...user, ai: updated });

          await updateAiProviders(router, updated, snackbar);
        }
      }
    },
    [provider, apiKey, customUrl, selectedProviderConfig, savedProviders, user, router]
  );

  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || !provider || !model) return;

    const userMessage: Message = {
      role: "user",
      content: currentMessage.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsSending(true);

    setTimeout(() => {
      const aiMessage: Message = {
        role: "ai",
        content: `Response from ${provider} (${model}): This is a simulated response. Connect your provider to get real AI responses.`,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsSending(false);
    }, 1000);
  }, [currentMessage, provider, model]);

  const handleModelSelect = (selectedModel: string, selectedProvider: string) => {
    setModel(selectedModel);
    setProvider(selectedProvider)
    setShowModelMenu(false);
  };

  if (!user) return <LoadingScreen />;

  return (
    <div
      className="h-screen bg-background text-zinc-50 flex flex-col overflow-hidden"
      onClick={() => {
        if (showProfileMenu) setShowProfileMenu(false);
      }}
    >
      <SnackBar ref={snackbar} />

      {/* Model / Provider menu */}
      {showModelMenu && (
        <div
          className="w-screen h-screen fixed inset-0 backdrop-blur backdrop-brightness-80 z-10 flex flex-col animate-fade-in-up animate-duration-200 items-center justify-center"
          onClick={() => setShowModelMenu(false)}
        >
          <section
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-250 rounded-sm bg-neutral-950 border border-neutral-800 flex flex-col p-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
              <p className="text-lg font-medium tracking-wide">Select provider & model</p>
              <AltButton size="w-25" action={() => setShowModelMenu(false)}>Close</AltButton>
            </div>

            {
              savedProviders .length > 0 ?
              <div
              className="w-full flex items-center justify-center flex-col gap-1">
                {
                  savedProviders.map((prov, i) =>
                    <Models
                    key={i}
                    name={prov.name}
                    models={prov.models}
                    url={prov.url}
                    onSelect={handleModelSelect} />
                  )
                }
              </div>
              :
              <div
              className="w-full flex flex-col gap-2 items-center justify-center p-5 py-10 font-light text-neutral-300">
                <IconCloudOff
                size={60}
                stroke={0.5} />

                <p
                className="text-xl">
                  Providers not connected
                </p>

                <MainButton
                size="w-60"
                className="font-normal text-zinc-50"
                action={() => {
                  setShowProviderForm(true);
                  setShowModelMenu(false);
                }}>
                  Connect a new provider
                </MainButton>
              </div>
            }
          </section>
        </div>
      )}

      {/* Provider setup form modal */}
      {showProviderForm && (
        <div
          className="w-screen h-screen fixed inset-0 backdrop-blur backdrop-brightness-75 z-10 flex flex-col animate-fade-in-up animate-duration-200 items-center justify-center"
          onClick={() => setShowProviderForm(false)}
        >
          <CreatorForm
            title="Add AI Provider"
            action={handleProviderSubmit}
            hideAction={() => setShowProviderForm(false)}
            confirmMessage="Connect provider"
            isDangerous={false}
            disabledMessage={isLoadingProvider ? "Validating..." : undefined}
            actionIsDisabled={isLoadingProvider}
          >
            <OptionsInput
              label="Provider"
              value={selectedProviderConfig?.name ?? provider}
              options={PROVIDERS.map((p) => p.name)}
              onChange={(name) => {
                const found = PROVIDERS.find((p) => p.name === name);
                if (found) {
                  setProvider(found.key);
                  setApiKey("");
                  setCustomUrl("");
                }
              }}
              isRequired
            />

            {selectedProviderConfig?.requiresApiKey !== false && (
              <CreatorInput
                label="API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                type="text"
                placeholder="sk-..."
              />
            )}

            <CreatorInput
              label={selectedProviderConfig?.requiresCustomUrl ? "Server URL" : "Custom URL (optional)"}
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              required={selectedProviderConfig?.requiresCustomUrl === true}
              type="url"
              placeholder={
                selectedProviderConfig?.key === "ollama"
                  ? "http://localhost:11434"
                  : "https://api.example.com/v1"
              }
            />
          </CreatorForm>
        </div>
      )}

      {/* Header */}
      <header className="p-2 border-b border-neutral-800 flex items-center justify-between animate-fade-in-down">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex gap-2 py-2 px-4 rounded-sm duration-300 cursor-pointer hover:bg-neutral-800 items-center justify-center"
        >
          <IconArrowLeft size={15} />
          Go back
        </button>

        <div className="h-full flex gap-1 items-center justify-center">
          {/* Provider & model selector */}
          <button
            type="button"
            onClick={() => setShowModelMenu(true)}
            className="rounded-sm hover:bg-neutral-800 h-full outline-none flex gap-2 items-center justify-center py-2 px-4 w-full max-w-max cursor-pointer duration-400 text-sm"
          >
            {provider && model ? (
              <>
                <IconSparkles size={14} className="text-main" />
                <p>{provider}</p>
                <span className="text-xs opacity-70">{model}</span>
                <IconChevronDown size={12} className="opacity-50" />
              </>
            ) : (
              <p>Set a provider</p>
            )}
          </button>

          {/* Profile settings */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowProfileMenu((prev) => !prev);
              }}
              className={
                "duration-400 cursor-pointer rounded-sm py-2 px-4 flex items-center justify-center gap-2 text-sm " +
                (showProfileMenu ? "bg-neutral-800" : "hover:bg-neutral-800")
              }
            >
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.name + " profile picture"}
                  height={250}
                  width={250}
                  loading="eager"
                  className="rounded-full w-6"
                />
              ) : (
                <IconUserCircle size={20} />
              )}
              {user.name}
            </button>

            {showProfileMenu && (
              <section
                className="absolute top-full right-0 bg-neutral-900 border border-neutral-800 p-2 w-45 rounded-sm animate-fade-in-down animate-duration-200 flex flex-col z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  href="/settings"
                  className="w-full flex gap-2 items-center hover:bg-neutral-700 px-2 py-1.5 rounded-sm text-sm"
                >
                  <IconSettings size={16} />
                  Settings
                </Link>
                <Link
                  href="/user/billing"
                  className="w-full flex gap-2 items-center hover:bg-neutral-700 px-2 py-1.5 rounded-sm text-sm"
                >
                  <IconSettings size={16} />
                  Billing
                </Link>
                <Link
                  href="/users/me"
                  className="w-full flex gap-2 items-center hover:bg-neutral-700 px-2 py-1.5 rounded-sm text-sm"
                >
                  <IconUserCircle size={16} />
                  My profile
                </Link>
              </section>
            )}
          </div>
        </div>
      </header>

      {/* Main chat area */}
      <main className="mx-auto px-4 py-3 overflow-y-auto w-full max-w-350 h-full flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center w-full h-full">
            <p className="text-5xl font-light opacity-80 select-none animate-fade-in-up">
              What are we building today?
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-sm px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-main text-white rounded-br-sm"
                      : "bg-neutral-900 border border-neutral-800 text-zinc-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </main>

      {/* Footer - message input */}
      <footer className="mx-auto p-4 w-full max-w-350 bg-neutral-950 rounded-sm mb-3 animate-fade-in-up flex gap-3 items-center">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder={
            provider && model
              ? "Ask anything..."
              : "Connect a provider first..."
          }
          disabled={!provider || !model || isSending}
          className="bg-neutral-900 rounded-sm p-2 w-full outline-none border-2 border-transparent duration-300 focus:border-main disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        />

        <button
          type="button"
          onClick={handleSendMessage}
          disabled={!provider || !model || isSending || !currentMessage.trim()}
          className="rounded-sm bg-main hover:brightness-80 duration-300 h-full outline-none flex gap-1 items-center justify-center py-2 px-4 w-full max-w-max cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          <IconSend size={18} />
          Send
        </button>
      </footer>
    </div>
  );
}
