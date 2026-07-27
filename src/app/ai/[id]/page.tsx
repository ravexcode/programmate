"use client";

import { useState, useEffect, useRef } from "react";

import { useRouter, useParams } from "next/navigation";

import { getUser } from "@/modules/user.module";
import { getSession, addMessage } from "@/modules/ai.session.module";
import {
  buildChatRequest,
  parseChatResponse,
} from "@/controllers/ai.chat.controller";

import LoadingScreen from "@/components/screens/loading-screen";
import AiLayout from "@/components/ai/layout";
import SnackBar, { showSnackbar } from "@/components/ui/snackbar";

import type { UserData } from "@/types/user.types";
import type { AiChatSession, AiChatMessage } from "@/types/ai.types";
import { IconArrowUp } from "@tabler/icons-react";

export default function AiSessionPage() {
  const router = useRouter();
  const params = useParams();
  const snackbarRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sessionId = params.id as string;

  const [user, setUser] = useState<UserData>();
  const [session, setSession] = useState<AiChatSession>();
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getUser(router);
      if (!data) return;
      setUser(data);

      const result = await getSession(router, sessionId, snackbarRef);
      if (result.success && result.data) {
        setSession(result.data);
      }
    };

    load();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending || !session || !user) return;

    const content = input.trim();
    setInput("");
    setIsSending(true);

    // 1. Save user message
    console.warn("[Chat] Saving user message...");

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

    const userResult = await addMessage(
      router,
      session.id,
      "user",
      content,
      snackbarRef
    );

    if (!userResult.success || !userResult.data) {
      console.warn("[Chat] Failed to save user message.");
      setIsSending(false);
      return;
    }

    console.warn("[Chat] User message saved.");
    setSession(userResult.data);

    // 2. Find provider config
    console.warn("[Chat] Looking for provider:", session.provider);

    const providerConfig = user.ai.find((p) => p.name === session.provider);

    if (!providerConfig) {
      console.warn("[Chat] Provider not found:", session.provider);
      showSnackbar("Provider not found", "critic", snackbarRef);
      setIsSending(false);
      return;
    }

    console.warn("[Chat] Provider found. Key:", providerConfig.name);

    // 3. Build AI request
    const chatMessages = userResult.data.messages.map((m) => ({
      role: m.sent_by as "user" | "assistant",
      content: m.content,
    }));

    const chatRequest = buildChatRequest({
      provider: session.provider,
      model: session.model,
      messages: chatMessages,
      apiKey: providerConfig.api_key,
      url: providerConfig.url,
    });

    if (!chatRequest) {
      console.warn("[Chat] Could not build request for provider:", session.provider);
      showSnackbar("Unsupported provider", "critic", snackbarRef);
      setIsSending(false);
      return;
    }

    console.warn("[Chat] Request built. URL:", chatRequest.url);

    // 4. Call external AI
    console.warn("[Chat] Calling AI...");

    const aiRes = await fetch(chatRequest.url, chatRequest.options);

    console.warn("[Chat] AI response status:", aiRes.status);

    if (!aiRes.ok) {
      const errorBody = await aiRes.text().catch(() => "Unknown error");
      console.warn("[Chat] AI error:", errorBody);
      showSnackbar("AI request failed", "critic", snackbarRef);
      setIsSending(false);
      return;
    }

    const aiData = await aiRes.json();
    const aiContent = parseChatResponse(session.provider, aiData);

    if (!aiContent) {
      console.warn("[Chat] Could not parse AI response.");
      showSnackbar("Empty AI response", "warn", snackbarRef);
      setIsSending(false);
      return;
    }

    console.warn("[Chat] AI response received. Length:", aiContent.length);

    // 5. Save assistant message
    console.warn("[Chat] Saving assistant message...");

    const assistantResult = await addMessage(
      router,
      session.id,
      "assistant",
      aiContent,
      snackbarRef
    );

    if (!assistantResult.success || !assistantResult.data) {
      console.warn("[Chat] Failed to save assistant message.");
      setIsSending(false);
      return;
    }

    console.warn("[Chat] Assistant message saved.");
    setSession(assistantResult.data);
    setIsSending(false);
  };

  if (!user || !session) return <LoadingScreen />;

  return (
    <AiLayout user={user} router={router}>
      <SnackBar ref={snackbarRef} />

      <main className="w-full flex flex-col items-center justify-center max-w-350 mx-auto p-5">
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
      </main>
    </AiLayout>
  );
}
