"use client";

import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { getUser } from "@/modules/user.module";
import { createSession, addMessage } from "@/modules/ai.session.module";

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
import type { AiChatSession } from "@/types/ai.types";

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

export default function AiPage() {
  const router = useRouter();
  const snackbarRef = useRef(null);

  const [user, setUser] = useState<UserData>();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Model selector
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [selectedModel, setSelectedModel] = useState<FlatModel | null>(null);
  const modelPickerRef = useRef<HTMLDivElement>(null);

  const [session, setSession] = useState<AiChatSession>();

  const [ gIndex, setGIndex ] = useState(0);

  const flatModels = user ? flattenModels(user) : [];

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending || !user) return;
    if (!selectedModel) {
      console.warn("[AI] No model selected. Aborting send.");
      showSnackbar("Select a model first", "warn", snackbarRef);
      return;
    }

    const content = input.trim();
    setInput("");
    setIsSending(true);

    console.warn("[AI] Starting send process...");
    console.warn("[AI] Content:", content);
    console.warn("[AI] Model:", selectedModel.displayName);
    if (!session) {
      console.warn("[AI] No active session. Creating new session...");

      const title =
        content.length > 40 ? content.slice(0, 40) + "..." : content;

      const createResult = await createSession(
        router,
        title,
        selectedModel.providerKey,
        selectedModel.model,
        snackbarRef
      );

      console.warn("[AI] Session create result:", createResult.success);

      if (!createResult.success || !createResult.data) {
        console.warn("[AI] Session creation failed. Aborting.");
        setIsSending(false);
        showSnackbar("Failed to create session", "critic", snackbarRef);
        return;
      }

      console.warn("[AI] Session created:", createResult.data.id);
      setSession(createResult.data);
    }
    
    const targetSessionId = session?.id;
    if (!targetSessionId) {
      console.warn("[AI] No session ID available. Aborting.");
      setIsSending(false);
      return;
    }

    console.warn("[AI] Adding user message to session:", targetSessionId);

    const messageResult = await addMessage(
      router,
      targetSessionId,
      "user",
      content,
      snackbarRef
    );

    console.warn("[AI] Message add result:", messageResult.success);

    if (!messageResult.success || !messageResult.data) {
      console.warn("[AI] Failed to add message. Aborting.");
      setIsSending(false);
      return;
    }

    console.warn("[AI] Message saved. Updated session:", messageResult.data.id);
    setSession(messageResult.data);

    console.warn("[AI] Building AI request...");

    const aiRequestBody = {
      session_id: targetSessionId,
      provider: selectedModel.providerKey,
      model: selectedModel.model,
      messages: messageResult.data.messages.map((m) => ({
        role: m.sent_by,
        content: m.content,
      })),
    };

    console.warn("[AI] Request body:", JSON.stringify(aiRequestBody, null, 2));
    console.warn("[AI] Send process complete. Awaiting AI response (not yet implemented).");

    setIsSending(false);
  };

  if (!user) return <LoadingScreen />;

  return (
    <AiLayout user={user} router={router}>
      <SnackBar ref={snackbarRef} />

      <main className="w-full flex flex-col items-center justify-center max-w-350 mx-auto p-5">
        <section className="h-full w-full flex flex-col items-center justify-end">
          {session ? (
            <div></div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-4xl font-light text-neutral-400 cursor-default select-none animate-fade-in-up">
              {greetings[gIndex].replace("User", user.name)}
            </div>
          )}
        </section>

        <section className="w-full p-3 px-5 rounded-xl border border-neutral-900 bg-neutral-950 flex flex-col gap-2 animate-fade-in-up">
          <form onSubmit={handleSend} className="w-full flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                flatModels.length > 0 ? "Ask me anything" : "Connect a provider first"
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

          {/* Model selector + providers link */}
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
                          console.warn("[AI] Model selected:", m.displayName);
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
      </main>
    </AiLayout>
  );
}
