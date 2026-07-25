"use client";

//Next imports
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

//React imports
import { useState, useEffect, useRef, useCallback } from "react";

//Hooks imports
import { getSessionStr } from "@/services/session.service";
import { getCached } from "@/hooks/cache.hook";
import animationClose from "@/hooks/useAnimationClose";

//Prebuilt UI imports
import LoadingScreen from "@/components/screens/loading-screen";
import SnackBar from "@/components/ui/snackbar";
import MainButton from "@/components/ui/buttons/main";
import AltButton from "@/components/ui/buttons/alternate";
import Card from "@/components/ui/card";
import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";
import OptionsInput from "@/components/forms/options-input";

//Modules imports
import { validateProvider } from "@/modules/ai.provider.module";
import { getUser } from "@/modules/user.module";

//Types imports
import { UserData } from "@/types/user.types";

//Icons imports
import {
  IconArrowLeft,
  IconArrowsMoveVertical,
  IconChevronDown,
  IconCloudOff,
  IconPlus,
  IconSettings,
  IconSend,
  IconSparkles,
  IconUserCircle,
} from "@tabler/icons-react";

type ProviderOption = {
  key: string;
  name: string;
};

const PROVIDERS: ProviderOption[] = [
  { key: "google", name: "Google AI" },
  { key: "claude", name: "Claude" },
  { key: "openai", name: "OpenAI" },
  { key: "codex", name: "Codex" },
  { key: "minimax", name: "Minimax" },
  { key: "claude-code", name: "Claude Code" },
];

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function AgentsPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData>();
  const [profileDisabled, setProfileDisabled] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const [provider, setProvider] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingProvider, setIsLoadingProvider] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [showProviderForm, setShowProviderForm] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);

  const profileSettings = useRef(null);
  const modelMenu = useRef(null);
  const snackbar = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function get() {
      const token = getSessionStr();

      if (!token) return router.push("/auth/signin");

      const cached = getCached();

      if (cached) {
        setUser(cached);
        return;
      }

      const fetched = await getUser(router);

      if (!fetched) return router.push("/auth/signin");

      return setUser(fetched);
    }

    get();
    return;
  }, [router]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleProfileSettings = () => {
    if (!profileSettings.current) return;

    const current: HTMLElement = profileSettings.current;
    const classlist = current.classList;

    setProfileDisabled((prev) => (prev ? false : true));

    if (classlist.contains("hidden")) {
      classlist.remove("animate-fade-out-up");
      classlist.replace("hidden", "flex");
      return;
    }

    classlist.add("animate-fade-out-up");
    animationClose(current, "fade-out-up", "hidden", "flex");
    return;
  };

  const toggleModelMenu = () => {
    if (!modelMenu.current) return;

    const current: HTMLElement = modelMenu.current;
    const classlist = current.classList;

    setProfileDisabled((prev) => (prev ? false : true));

    if (classlist.contains("hidden")) {
      classlist.remove("animate-fade-out-down");
      classlist.replace("hidden", "flex");
      return;
    }

    classlist.add("animate-fade-out-down");
    animationClose(current, "fade-out-down", "hidden", "flex");
    return;
  };

  const handleProviderSelect = (providerName: string) => {
    const found = PROVIDERS.find((p) => p.name === providerName);
    setProvider(found ? found.key : providerName);
  };

  const handleProviderSubmit = useCallback(
    async (e: React.SubmitEvent) => {
      e.preventDefault();
      e.nativeEvent.preventDefault();

      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const providerName = formData.get("provider") as string;
      const apiKey = formData.get("apiKey") as string;
      const customUrl = (formData.get("customUrl") as string) || undefined;

      if (!providerName || !apiKey) return;

      setIsLoadingProvider(true);

      const result = await validateProvider(
        providerName,
        apiKey,
        customUrl,
        snackbar
      );

      setIsLoadingProvider(false);

      if (result.success && result.models) {
        setProvider(result.provider || providerName);
        setAvailableModels(result.models);
        setShowProviderForm(false);
      }
    },
    []
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

    // Simulated AI response — replace with actual API call
    setTimeout(() => {
      const aiMessage: Message = {
        role: "ai",
        content: `Response from ${provider} (${model}): This is a simulated response. Connect your provider to get real AI responses.`,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsSending(false);
    }, 1000);
  }, [currentMessage, provider, model]);

  const handleModelSelect = (selectedModel: string) => {
    setModel(selectedModel);
    setShowModelMenu(false);
  };

  return user ? (
    <div
      className="h-screen bg-background text-zinc-50 flex flex-col overflow-hidden"
      onClick={() => {
        if (profileSettings.current) {
          const current: HTMLElement = profileSettings.current;
          const classlist = current.classList;

          if (classlist.contains("flex")) {
            setProfileDisabled((prev) => (prev ? false : true));
            classlist.add("animate-fade-out-up");
            animationClose(current, "fade-out-up", "hidden", "flex");
            return;
          }
        }
      }}
    >
      <SnackBar ref={snackbar} />

      {/* Model / Provider menu */}
      <div
        className="w-screen h-screen fixed inset-0 backdrop-blur backdrop-brightness-80 z-10 hidden flex-col animate-fade-in-up animate-duration-200 items-center justify-center"
        ref={modelMenu}
        onClick={toggleModelMenu}
      >
        <section
          onClick={(e) => {
            e.preventDefault();
            e.nativeEvent.preventDefault();
          }}
          className="w-full max-w-250 rounded-sm bg-neutral-950 border border-neutral-800 flex flex-col p-4 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
            <p className="text-lg font-medium tracking-wide">Select provider & model</p>
            <AltButton size="w-25" action={toggleModelMenu}>Close</AltButton>
          </div>

          {/* Current provider & model */}
          {provider && model ? (
            <div className="py-4 flex flex-col gap-3">
              <Card title="Current configuration">
                <div className="flex gap-3 items-center">
                  <IconSparkles size={18} className="text-main" />
                  <span className="font-medium">{provider}</span>
                  <span className="text-xs opacity-60">→</span>
                  <span className="text-sm opacity-80">{model}</span>
                </div>
              </Card>

              {/* Available models for this provider */}
              {availableModels.length > 0 && (
                <Card title="Available models">
                  <div className="flex flex-col gap-1 w-full">
                    {availableModels.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleModelSelect(m)}
                        className={`w-full text-left px-3 py-2 rounded-sm text-sm duration-200 flex items-center gap-2 ${
                          model === m
                            ? "bg-main/20 text-main border border-main/30"
                            : "bg-neutral-900 hover:bg-neutral-800 border border-transparent"
                        }`}
                      >
                        {m}
                        {model === m && (
                          <span className="ml-auto text-xs text-main">active</span>
                        )}
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              <button
                type="button"
                onClick={() => setShowProviderForm(true)}
                className="w-full flex gap-2 items-center justify-center py-2 px-4 rounded-sm bg-neutral-900 hover:bg-neutral-800 duration-300 text-sm cursor-pointer border border-neutral-800"
              >
                <IconPlus size={16} />
                Change provider
              </button>
            </div>
          ) : (
            <div className="py-15 flex flex-col gap-1 items-center justify-center font-light text-neutral-200">
              <IconCloudOff size={40} stroke={1} />
              <p className="text-xl">No provider connected</p>
              <p className="text-sm text-center">
                Connect an AI provider with your API key to start chatting
              </p>
              <MainButton
                size="w-full mt-3"
                action={() => {
                  setShowProviderForm(true);
                  toggleModelMenu();
                }}
              >
                Add a provider
              </MainButton>
            </div>
          )}
        </section>
      </div>

      {/* Provider setup form modal */}
      {showProviderForm && (
        <div
          className="w-screen h-screen fixed inset-0 backdrop-blur backdrop-brightness-75 z-10 flex-col animate-fade-in-up animate-duration-200 items-center justify-center"
          onClick={() => setShowProviderForm(false)}
        >
          <section
            onClick={(e) => {
              e.preventDefault();
              e.nativeEvent.preventDefault();
            }}
            className="w-full max-w-250 rounded-sm bg-neutral-950 border border-neutral-800 flex flex-col p-4"
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
                value={provider}
                options={[]}
                onChange={setProvider}
                isRequired
              />

              <CreatorInput
                label="API Key"
                value=""
                onChange={(_e) => {}}
                required
                type="text"
                placeholder="sk-..."
              />

              <CreatorInput
                label="Custom URL (optional)"
                value=""
                onChange={(_e) => {}}
                type="url"
                placeholder="https://api.example.com/v1"
              />
            </CreatorForm>
          </section>
        </div>
      )}

      {/* Header */}
      <header className="p-2 border-b border-neutral-800 flex items-center justify-between animate-fade-in-down">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex gap-2 py-2 px-4 rounded-md duration-300 cursor-pointer hover:bg-neutral-800 items-center justify-center"
        >
          <IconArrowLeft size={15} />
          Go back
        </button>

        <div className="h-full flex gap-1 items-center justify-center">
          {/* Provider & model selector */}
          <button
            type="button"
            onClick={toggleModelMenu}
            className="rounded-md hover:bg-neutral-800 h-full outline-none flex gap-2 items-center justify-center py-2 px-4 w-full max-w-max cursor-pointer duration-400 text-sm"
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
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopPropagation();
              toggleProfileSettings();
            }}
            className={
              "duration-400 cursor-pointer rounded-sm py-2 px-4 flex items-center justify-center gap-2 text-sm relative " +
              (profileDisabled ? "bg-neutral-800" : "hover:bg-neutral-800")
            }
          >
            {user.avatar_url ? (
              <Image
                src={user.avatar_url!}
                alt={user.name + " profile picture"}
                height={250}
                width={250}
                preload
                loading="eager"
                className="rounded-full w-6"
              />
            ) : (
              <IconUserCircle size={20} />
            )}
            {user.name}
            <IconArrowsMoveVertical size={14} className="ml-1" />

            <section
              className="absolute top-1/1 bg-neutral-900 p-2 w-full rounded-b-md animate-fade-in-down hidden flex-col animate-duration-300"
              ref={profileSettings}
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopPropagation();
              }}
            >
              <Link
                href="/settings"
                className="w-full flex gap-1 justify-start items-center hover:bg-neutral-700 px-2 py-1"
              >
                <IconSettings size={18} />
                Settings
              </Link>
              <Link
                href="/user/billing"
                className="w-full flex gap-1 justify-start items-center hover:bg-neutral-700 px-2 py-1"
              >
                <IconSettings size={18} />
                Billing
              </Link>
              <Link
                href="/users/me"
                className="w-full flex gap-1 justify-start items-center hover:bg-neutral-700 px-2 py-1"
              >
                <IconUserCircle size={18} />
                My profile
              </Link>
            </section>
          </button>
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
          className="rounded-md bg-main hover:brightness-80 duration-300 h-full outline-none flex gap-1 items-center justify-center py-2 px-4 w-full max-w-max cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          <IconSend size={18} />
          Send
        </button>
      </footer>
    </div>
  ) : (
    <LoadingScreen />
  );
}
