"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { getUser } from "@/modules/user.module";
import {
  createSession,
  addMessage,
} from "@/modules/ai.session.module";
import {
  buildChatRequest,
  parseChatResponse,
} from "@/controllers/ai.chat.controller";

import LoadingScreen from "@/components/screens/loading-screen";
import AiLayout from "@/components/ai/layout";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";

import { rng } from "@/utils/rng";
import { providers } from "@/utils/getURL";

import {
  IconArrowUp,
  IconAssembly,
  IconCloudCog,
} from "@tabler/icons-react";

import type { UserData } from "@/types/user.types";
import type { AiChatSession, AiChatMessage } from "@/types/ai.types";

interface FlatModel {
  providerKey: string;
  providerName: string;
  model: string;
  displayName: string;
}

function flattenModels(user: UserData): FlatModel[] {
  if (!user.ai || user.ai.length === 0) return [];

  const models: FlatModel[] = [];

  user.ai.forEach((provider) => {
    const providerKey = provider.name;
    const providerName =
      providers[providerKey as keyof typeof providers]?.name ?? providerKey;

    provider.models.forEach((model) => {
      models.push({
        providerKey,
        providerName,
        model,
        displayName: `${providerName} / ${model}`,
      });
    });
  });

  return models;
}

interface Props {
  initialSession?: AiChatSession;
}

export default function AiPage({ initialSession }: Props) {
  const router = useRouter();
  const snackbarRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<UserData>();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Model selector
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [selectedModel, setSelectedModel] = useState<FlatModel | null>(null);
  const modelPickerRef = useRef<HTMLDivElement>(null);

  const [session, setSession] = useState<AiChatSession | undefined>(initialSession);

  const [gIndex, setGIndex] = useState(0);

  const flatModels = user ? flattenModels(user) : [];

  // Load user
  useEffect(() => {
    const get = async () => {
      const data = await getUser(router);
      if (!data) return;
      setUser(data);
    };
    get();
  }, []);

  useEffect(() => {
    if (flatModels.length > 0 && !selectedModel) {
      setSelectedModel(flatModels[0]);
    }
  }, [flatModels]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        modelPickerRef.current &&
        !modelPickerRef.current.contains(e.target as Node)
      ) {
        setShowModelPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

  const greetings: string[] = [
    "Hello, User! What are we building today?",
    "Welcome back, User! Ready to create something amazing?",
    "Hi, User! What's the project for today?",
    "Good to see you, User. What are we working on?",
    "Hello, User! Let's build something incredible.",
    "Hey, User! What idea are we turning into reality today?",
    "Welcome, User. What's on the development roadmap?",
    "Hi there, User! Ready to start coding?",
    "Hello, User! What challenge are we solving today?",
    "Hey, User! What are we creating together?",
    "Good to have you back, User! What's today's mission?",
    "Welcome, User! Let's make some progress.",
    "Hello, User! What's the next big feature?",
    "Hi, User! What project deserves our attention today?",
    "Hey, User! Time to build something awesome.",
    "Welcome back, User! What's your plan for today?",
    "Hello, User! Ready to bring another idea to life?",
    "Hi, User! What innovation are we working on today?",
    "Good day, User! What would you like to build?",
    "Hello, User! Let's get started on your next masterpiece.",
  ];

  useEffect(() => {
    setGIndex(rng(greetings.length));
  }, []);

  const resetChat = useCallback(() => {
    setSession(undefined);
    setInput("");
    setIsSending(false);
    router.push("/ai");
  }, [router]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending || !user) return;
    if (!selectedModel) {
      showSnackbar("Select a model first", "warn", snackbarRef);
      return;
    }

    const content = input.trim();
    setInput("");
    setIsSending(true);

    // 1. Create session (first message)
    let targetSessionId: string;
    let targetSession: AiChatSession;

    if (!session) {
      const title = content.length > 40 ? content.slice(0, 40) + "..." : content;

      const createResult = await createSession(
        router,
        title,
        selectedModel.providerKey,
        selectedModel.model,
        snackbarRef
      );

      if (!createResult.success || !createResult.data) {
        setIsSending(false);
        showSnackbar("Failed to create session", "critic", snackbarRef);
        return;
      }

      targetSessionId = createResult.data.id;
      targetSession = createResult.data;

      // Optimistic update: show session immediately
      setSession(targetSession);
      router.push(`/ai/${targetSessionId}`, { scroll: false });
    } else {
      targetSessionId = session.id;
      targetSession = session;

      // Optimistic update: show user message
      const userMessage: AiChatMessage = {
        id: crypto.randomUUID(),
        session_id: session.id,
        sent_by: "user",
        content,
        created_at: new Date().toISOString(),
      };
      setSession((prev) =>
        prev ? { ...prev, messages: [...prev.messages, userMessage] } : prev
      );
    }

    // 2. Save user message
    const userResult = await addMessage(
      router,
      targetSessionId,
      "user",
      content,
      snackbarRef
    );

    if (!userResult.success || !userResult.data) {
      setIsSending(false);
      return;
    }

    setSession(userResult.data);

    // 3. Find provider config
    const providerConfig = user.ai.find(
      (p) => p.name === selectedModel.providerKey
    );

    if (!providerConfig) {
      showSnackbar("Provider not found", "critic", snackbarRef);
      setIsSending(false);
      return;
    }

    // 4. Build AI request
    const chatMessages = userResult.data.messages.map((m) => ({
      role: m.sent_by as "user" | "assistant",
      content: m.content,
    }));

    const chatRequest = buildChatRequest({
      provider: selectedModel.providerKey,
      model: selectedModel.model,
      messages: chatMessages,
      apiKey: providerConfig.api_key,
      url: providerConfig.url,
    });

    if (!chatRequest) {
      showSnackbar("Unsupported provider", "critic", snackbarRef);
      setIsSending(false);
      return;
    }

    // 5. Call external AI
    const aiRes = await fetch(chatRequest.url, chatRequest.options);

    if (!aiRes.ok) {
      showSnackbar("AI request failed", "critic", snackbarRef);
      setIsSending(false);
      return;
    }

    const aiData = await aiRes.json();
    const aiContent = parseChatResponse(selectedModel.providerKey, aiData);

    if (!aiContent) {
      showSnackbar("Empty AI response", "warn", snackbarRef);
      setIsSending(false);
      return;
    }

    // 6. Save assistant message
    const assistantResult = await addMessage(
      router,
      targetSessionId,
      "assistant",
      aiContent,
      snackbarRef
    );

    if (!assistantResult.success || !assistantResult.data) {
      setIsSending(false);
      return;
    }

    setSession(assistantResult.data);
    setIsSending(false);
  };

  if (!user) return <LoadingScreen />;

  return (
    <AiLayout user={user} router={router} onNewChat={resetChat}>
      <SnackBar ref={snackbarRef} />

      <main className="w-full flex flex-col items-center justify-center max-w-350 mx-auto p-5">
        {session ? (
          <>
            <section className="h-full w-full flex flex-col items-end overflow-y-auto max-h-[70vh] gap-3 py-4">
              {session.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    "w-full flex " +
                    (msg.sent_by === "user" ? "justify-end" : "justify-start")
                  }>
                  <div
                    className={
                      "w-max max-w-250 rounded-xl px-4 py-2 " +
                      (msg.sent_by === "user"
                        && "bg-main text-white px-6")
                    }>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="w-full flex justify-start">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-neutral-400">
                    Thinking...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </section>

            <section className="w-full mt-auto p-3 px-5 rounded-xl border border-neutral-900 bg-neutral-950 flex flex-col gap-2 animate-fade-in-up">
              <form onSubmit={handleSend} className="w-full flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything"
                  className="w-full outline-none"
                  disabled={isSending}
                />

                <button
                  type="submit"
                  disabled={isSending || !input.trim()}
                  className="bg-main rounded-full aspect-square block hover:brightness-75 duration-300 cursor-pointer p-2 disabled:grayscale disabled:cursor-not-allowed">
                  <IconArrowUp size={20} />
                </button>
              </form>

              <div className="w-full cursor-default text-sm font-light py-1">
                {session.provider} / {session.model}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="h-full w-full flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center h-full text-4xl font-light text-neutral-400 cursor-default select-none animate-fade-in-up">
                {greetings[gIndex].replace("User", user.name)}
              </div>
            </section>

            <section className="w-full p-3 px-5 rounded-xl border border-neutral-900 bg-neutral-950 flex flex-col gap-2 animate-fade-in-up">
              <form onSubmit={handleSend} className="w-full flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    flatModels.length > 0
                      ? "Ask me anything"
                      : "Connect a provider first"
                  }
                  className="w-full outline-none"
                  disabled={isSending || flatModels.length === 0}
                />

                <button
                  type="submit"
                  disabled={isSending || !input.trim() || flatModels.length === 0}
                  className="bg-main rounded-full aspect-square block hover:brightness-75 duration-300 cursor-pointer p-2 disabled:grayscale disabled:cursor-not-allowed">
                  <IconArrowUp size={20} />
                </button>
              </form>

              <div className="w-full flex items-center justify-between text-sm font-light py-1">
                {flatModels.length > 0 ? (
                  <div ref={modelPickerRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setShowModelPicker((p) => !p)}
                      className="flex items-center gap-1.5 cursor-pointer transition duration-200 py-1.5 px-4 rounded-sm hover:bg-neutral-800">
                      <span>
                        {selectedModel
                          ? selectedModel.displayName
                          : "Select model"}
                      </span>
                      <IconAssembly size={13} />
                    </button>

                    {showModelPicker && (
                      <div className="absolute bottom-full left-0 mb-1 rounded-md border border-neutral-800 bg-neutral-900 text-sm flex flex-col w-72 max-h-60 overflow-y-auto z-20">
                        {flatModels.map((m) => (
                          <button
                            key={m.displayName}
                            type="button"
                            onClick={() => {
                              setSelectedModel(m);
                              setShowModelPicker(false);
                            }}
                            className={
                              "w-full text-left px-3 py-2 duration-200 flex items-center justify-between " +
                              (selectedModel?.displayName === m.displayName
                                ? "bg-neutral-800 text-main"
                                : "hover:bg-neutral-800")
                            }>
                            <span className="truncate">{m.displayName}</span>
                            {selectedModel?.displayName === m.displayName && (
                              <span className="w-2 h-2 rounded-full bg-main shrink-0 ml-2" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/ai/providers"
                    className="flex items-center gap-1.5 cursor-pointer hover:text-main transition duration-200 px-1 py-0.5 rounded-sm hover:bg-neutral-800">
                    <IconCloudCog size={15} />
                    <span>Connect a provider</span>
                  </Link>
                )}

                <Link
                  href="/ai/providers"
                  className="text-neutral-500 hover:text-neutral-300 transition duration-200 px-1 py-0.5 rounded-sm hover:bg-neutral-800">
                  Providers
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
    </AiLayout>
  );
}
